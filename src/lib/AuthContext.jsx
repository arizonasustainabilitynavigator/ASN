import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { api } from "@/api/client";

// Auth context object
const AuthContext = createContext(null);

// Quiz answers saved before account creation, linked to the account once one exists
export const PENDING_QUIZ_KEY = "asn_pending_quiz_answers";

// Flags for tracking an in-progress password recovery
const RECOVERY_IN_PROGRESS_KEY = "asn_recovery_in_progress";
const RESET_PASSWORD_PATH = "/reset-password";

// Save a pending quiz response to the newly signed-in user's account
async function flushPendingQuizResponse(userId) {
  const raw = localStorage.getItem(PENDING_QUIZ_KEY);
  if (!raw || !userId) return;
  localStorage.removeItem(PENDING_QUIZ_KEY);
  try {
    const answers = JSON.parse(raw);
    await api.entities.QuizResponse.create({ userId, answers });
  } catch (e) {
    console.error("Failed to save pending quiz response", e);
  }
}

// Build the URL Supabase should send users back to after OAuth/auth actions
function getAuthRedirectUrl() {
  const configuredRedirect = import.meta.env.VITE_SUPABASE_REDIRECT_URL?.trim();
  if (configuredRedirect) {
    return configuredRedirect;
  }

  const { hostname, port } = window.location;
  const normalizedPort = port ? `:${port}` : "";

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return `http://localhost${normalizedPort}/`;
  }

  return `${window.location.origin}${import.meta.env.BASE_URL || "/"}`;
}

export function AuthProvider({ children }) {
  // Auth state
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  // Whether this tab has reached the reset-password route during the current recovery session
  const recoveryArrivedRef = useRef(false);

  // Navigation helper
  const navigateToLogin = useCallback(() => {
    navigate("/login", { replace: true });
  }, [navigate]);

  // Look up the current Supabase session and sync local auth state to it
  const checkUserAuth = useCallback(async () => {
    setIsLoadingAuth(true);
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      const inRecovery = !!localStorage.getItem(RECOVERY_IN_PROGRESS_KEY);
      if (data?.session?.user && !inRecovery) {
        setUser(data.session.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setAuthError(null);
    } catch {
      setUser(null);
      setIsAuthenticated(false);
      setAuthError(null);
    } finally {
      setIsLoadingAuth(false);
    }
  }, []);

  // Google sign-in
  const signInWithGoogle = useCallback(async () => {
    const redirectTo = getAuthRedirectUrl();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    if (error) throw error;
  }, []);

  // Sign out
  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
    navigate("/", { replace: true });
  }, [navigate]);

  // Mount: detect a password-recovery link, clean up any abandoned recovery session, and
  // subscribe to Supabase auth state changes
  useEffect(() => {
    if (sessionStorage.getItem("asn_pending_password_recovery")) {
      localStorage.setItem(RECOVERY_IN_PROGRESS_KEY, "1");
      navigate(RESET_PASSWORD_PATH, { replace: true });
    } else if (
      localStorage.getItem(RECOVERY_IN_PROGRESS_KEY) &&
      location.pathname !== RESET_PASSWORD_PATH
    ) {
      // Leftover unresolved recovery session from an earlier tab/visit
      localStorage.removeItem(RECOVERY_IN_PROGRESS_KEY);
      supabase.auth.signOut({ scope: "local" }).catch(() => {});
    }

    checkUserAuth();

    // Auth state change handler
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      // Password recovery: redirect to the reset-password page, don't treat as signed in
      if (event === "PASSWORD_RECOVERY") {
        localStorage.setItem(RECOVERY_IN_PROGRESS_KEY, "1");
        recoveryArrivedRef.current = false;
        setUser(null);
        setIsAuthenticated(false);
        setIsLoadingAuth(false);
        navigate(RESET_PASSWORD_PATH, { replace: true });
        return;
      }

      // Sign-out: clear recovery tracking
      if (event === "SIGNED_OUT") {
        localStorage.removeItem(RECOVERY_IN_PROGRESS_KEY);
        recoveryArrivedRef.current = false;
      }

      // Unresolved recovery session: stay signed-out
      if (localStorage.getItem(RECOVERY_IN_PROGRESS_KEY)) {
        setIsLoadingAuth(false);
        return;
      }

      // Normal sign-in/refresh: sync state
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session?.user);
      setIsLoadingAuth(false);
      if (session?.user) flushPendingQuizResponse(session.user.id);
    });

    return () => data?.subscription?.unsubscribe();
  }, [checkUserAuth]);

  // Route watcher: sign out an abandoned recovery session if the user leaves the reset page
  useEffect(() => {
    if (!localStorage.getItem(RECOVERY_IN_PROGRESS_KEY)) {
      recoveryArrivedRef.current = false;
      return;
    }

    if (location.pathname === RESET_PASSWORD_PATH) {
      recoveryArrivedRef.current = true;
      sessionStorage.removeItem("asn_pending_password_recovery");
      return;
    }

    if (recoveryArrivedRef.current) {
      recoveryArrivedRef.current = false;
      localStorage.removeItem(RECOVERY_IN_PROGRESS_KEY);
      supabase.auth.signOut({ scope: "local" }).catch(() => {});
    }
  }, [location.pathname]);

  // Context value exposed to consumers
  const value = {
    isLoadingAuth,
    isLoadingPublicSettings,
    authError,
    isAuthenticated,
    authChecked: !isLoadingAuth,
    user,
    navigateToLogin,
    checkUserAuth,
    logout,
    signInWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook for consuming auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

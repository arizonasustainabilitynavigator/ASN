import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { api } from "@/api/client";

const AuthContext = createContext(null);

// Key the quiz results page stashes answers under when someone takes the
// quiz before creating an account, so they can be linked to the account
// once one exists (see the onAuthStateChange handler below).
export const PENDING_QUIZ_KEY = "asn_pending_quiz_answers";

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
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  const navigateToLogin = useCallback(() => {
    navigate("/login", { replace: true });
  }, [navigate]);

  const checkUserAuth = useCallback(async () => {
    setIsLoadingAuth(true);
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      if (data?.session?.user) {
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

  const signInWithGoogle = useCallback(async () => {
    const redirectTo = getAuthRedirectUrl();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    if (error) throw error;
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
    navigate("/", { replace: true });
  }, [navigate]);

  useEffect(() => {
    checkUserAuth();

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session?.user);
      setIsLoadingAuth(false);
      if (session?.user) flushPendingQuizResponse(session.user.id);

      // Supabase establishes a real session from the recovery link's token
      // (that's how it lets the user set a new password), which otherwise
      // looks just like a normal login. Without this, the HashRouter's own
      // hash-based routing gets clobbered by Supabase cleaning up the token
      // from the URL fragment, and the user lands signed-in on the homepage
      // instead of the reset-password form. This event is the reliable
      // signal, independent of whatever happens to the URL afterward.
      if (event === "PASSWORD_RECOVERY") {
        navigate("/reset-password", { replace: true });
      }
    });

    return () => data?.subscription?.unsubscribe();
  }, [checkUserAuth]);

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

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

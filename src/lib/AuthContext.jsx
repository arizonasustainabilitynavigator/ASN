import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { api } from "@/api/client";

const AuthContext = createContext(null);

// Key the quiz results page stashes answers under when someone takes the
// quiz before creating an account, so they can be linked to the account
// once one exists (see the onAuthStateChange handler below).
export const PENDING_QUIZ_KEY = "asn_pending_quiz_answers";

// Marks an in-progress password recovery in this browser (localStorage, so
// it survives refreshes and is visible to every tab, same as the Supabase
// session itself) from the moment the recovery link is opened until the
// reset is either completed or abandoned. checkUserAuth and the
// onAuthStateChange handler below check this so a recovery session is never
// treated as a normal login; the route-watching effect checks it to sign
// the session out if the reset page is left without finishing.
//
// This flag is a client-side UX guard, not a security boundary — see the
// notes where it's used for what it does and doesn't protect against.
const RECOVERY_IN_PROGRESS_KEY = "asn_recovery_in_progress";
const RESET_PASSWORD_PATH = "/reset-password";

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
  const location = useLocation();
  // True once this tab has actually rendered the reset-password route
  // during the current recovery session. Guards the abandonment check
  // below against the brief window, right after the recovery link lands,
  // where the redirect to /reset-password hasn't taken effect yet and the
  // route still reads as something else — without it, that transient
  // state would look identical to a real abandonment.
  const recoveryArrivedRef = useRef(false);

  const navigateToLogin = useCallback(() => {
    navigate("/login", { replace: true });
  }, [navigate]);

  const checkUserAuth = useCallback(async () => {
    setIsLoadingAuth(true);
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      // An unresolved recovery session is real to Supabase but must never
      // read as a normal login here — getSession() alone can't tell the
      // two apart, so defer to the flag set when the recovery link was
      // opened (see RECOVERY_IN_PROGRESS_KEY above).
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
    // main.jsx stashes this before calling getSession(), because that call
    // clears the "type=recovery" hash as a side effect of parsing it —
    // before this component ever mounts to subscribe to onAuthStateChange,
    // so the PASSWORD_RECOVERY event it fires has no listener yet and is
    // lost. This flag survives that gap; the live URL hash by this point
    // does not. It's deliberately NOT cleared here (only once the
    // route-watching effect below confirms we actually reached
    // /reset-password) so that React's dev-mode double-invoking of this
    // effect can't race it into looking like a leftover session instead.
    if (sessionStorage.getItem("asn_pending_password_recovery")) {
      localStorage.setItem(RECOVERY_IN_PROGRESS_KEY, "1");
      navigate(RESET_PASSWORD_PATH, { replace: true });
    } else if (
      localStorage.getItem(RECOVERY_IN_PROGRESS_KEY) &&
      location.pathname !== RESET_PASSWORD_PATH
    ) {
      // A recovery session was left unresolved by a previous tab/visit
      // (e.g. the user closed that tab instead of navigating away from
      // it), and this fresh load isn't heading to the reset page either.
      // Nothing is going to finish it, so drop it now rather than let it
      // sit as a live, unused session. scope: "local" only forgets it in
      // this browser and doesn't touch the user's other devices.
      localStorage.removeItem(RECOVERY_IN_PROGRESS_KEY);
      supabase.auth.signOut({ scope: "local" }).catch(() => {});
    }

    checkUserAuth();

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      // Supabase establishes a real session from the recovery link's token
      // (that's how it lets the user set a new password), which otherwise
      // looks just like a normal login. Without this, the HashRouter's own
      // hash-based routing gets clobbered by Supabase cleaning up the token
      // from the URL fragment, and the user lands signed-in on the homepage
      // instead of the reset-password form. This event is the reliable
      // signal, independent of whatever happens to the URL afterward.
      if (event === "PASSWORD_RECOVERY") {
        localStorage.setItem(RECOVERY_IN_PROGRESS_KEY, "1");
        recoveryArrivedRef.current = false;
        setUser(null);
        setIsAuthenticated(false);
        setIsLoadingAuth(false);
        navigate(RESET_PASSWORD_PATH, { replace: true });
        return;
      }

      if (event === "SIGNED_OUT") {
        localStorage.removeItem(RECOVERY_IN_PROGRESS_KEY);
        recoveryArrivedRef.current = false;
      }

      // Keep treating this as signed-out while a recovery session is
      // unresolved, even if Supabase refreshes its token in the
      // background while it just sits on the reset-password page.
      if (localStorage.getItem(RECOVERY_IN_PROGRESS_KEY)) {
        setIsLoadingAuth(false);
        return;
      }

      setUser(session?.user ?? null);
      setIsAuthenticated(!!session?.user);
      setIsLoadingAuth(false);
      if (session?.user) flushPendingQuizResponse(session.user.id);
    });

    return () => data?.subscription?.unsubscribe();
  }, [checkUserAuth]);

  useEffect(() => {
    // Abandoning the reset page mid-recovery — editing the URL, clicking a
    // nav link, hitting back — should sign that session out instead of
    // leaving it live just because nothing else is watching it. Gated on
    // recoveryArrivedRef so the redirect above (which briefly sits on a
    // different route while the router catches up) is never mistaken for
    // an abandonment.
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

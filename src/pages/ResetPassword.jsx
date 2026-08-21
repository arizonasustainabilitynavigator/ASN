import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase, createIsolatedAuthClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { KeyRound, Loader2 } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import PasswordInput from "@/components/PasswordInput";
import { getErrorMessage } from "@/lib/utils";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [hasRecoverySession, setHasRecoverySession] = useState(null);
  const recoveryTokensRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const session = data?.session;
      setHasRecoverySession(!!session);
      if (session) {
        // Supabase persists this recovery session to localStorage, which
        // every other open tab on this site picks up instantly — so the tab
        // the user already had open flips to "signed in" the moment this
        // page loads, before they've touched anything. Grab the tokens we
        // need for updateUser() and sign the shared session back out right
        // away, rather than waiting until the form is submitted, so that
        // window of unwanted cross-tab sign-in is as short as possible.
        recoveryTokensRef.current = {
          access_token: session.access_token,
          refresh_token: session.refresh_token,
        };
        await supabase.auth.signOut();
      }
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      // Use a throwaway client that never touches localStorage — the tokens
      // captured on mount are enough to authorize this one updateUser()
      // call, and doing it this way means the update never re-persists a
      // session that other tabs would pick up again.
      const isolatedClient = createIsolatedAuthClient();
      const { error: setSessionError } = await isolatedClient.auth.setSession(
        recoveryTokensRef.current
      );
      if (setSessionError) throw setSessionError;
      const { error: updateError } = await isolatedClient.auth.updateUser({ password });
      if (updateError) throw updateError;
      setSuccess(true);
      setTimeout(() => {
        // The reset link opens in a brand-new tab (email clients always do
        // this). That tab has no history to go "back" to, so close it and
        // let the user return to whatever tab they already had open —
        // rather than leaving an orphan tab signed out on /login. Browsers
        // only allow window.close() on tabs a script opened or that have no
        // navigation history; if it's blocked, fall back to /login in place.
        window.close();
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to reset password"));
    } finally {
      setLoading(false);
    }
  };

  if (hasRecoverySession === null) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!hasRecoverySession) {
    return (
      <AuthLayout
        icon={KeyRound}
        title="Link expired"
        subtitle="This password reset link is invalid or has expired"
        footer={
          <Link to="/forgot-password" className="text-primary font-medium hover:underline">
            Request a new link
          </Link>
        }
      >
        <p className="text-sm text-muted-foreground text-center">
          Password reset links only work once and expire after a short time.
        </p>
      </AuthLayout>
    );
  }

  if (success) {
    return (
      <AuthLayout icon={KeyRound} title="Password updated" subtitle="Redirecting you now...">
        <p className="text-sm text-muted-foreground text-center">
          Your password has been changed successfully.
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout icon={KeyRound} title="Set a new password" subtitle="Choose a new password for your account">
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
          <PasswordInput
            id="password"
            autoComplete="new-password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm Password</Label>
          <PasswordInput
            id="confirm"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full h-12 font-medium" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Updating...
            </>
          ) : (
            "Update password"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}

"use client";

import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, KeyRound } from "lucide-react";
import { ALLOWED_LOGIN_EMAIL } from "@/lib/auth";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

type LoginMode = "sign-in" | "forgot" | "update";

export function LoginForm({
  redirectTo,
  errorCode,
  initialMode,
}: {
  redirectTo: string;
  errorCode?: string;
  initialMode: LoginMode;
}) {
  const [mode, setMode] = useState<LoginMode>(initialMode);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [canUpdatePassword, setCanUpdatePassword] = useState(false);
  const [error, setError] = useState(
    errorCode === "admin"
      ? "This account is not authorized to access the employee workspace."
      : errorCode === "setup"
        ? "Administrator access is unavailable until Supabase is configured."
        : "",
  );
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  useEffect(() => {
    if (mode !== "update") return;
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setError("Password updates are unavailable until Supabase is configured.");
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" && session) {
        setCanUpdatePassword(true);
        setError("");
      }
    });

    void supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (data.session) {
        setCanUpdatePassword(true);
      } else if (sessionError) {
        setError("We couldn't verify this reset link. Request a new one and try again.");
      } else {
        setError("This password reset link is invalid or expired. Request a new one and try again.");
      }
    });

    return () => subscription.unsubscribe();
  }, [mode]);

  const signIn = async (supabase: NonNullable<ReturnType<typeof getSupabaseBrowserClient>>) => {
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: ALLOWED_LOGIN_EMAIL,
      password,
    });
    if (signInError) {
      setError("We couldn't sign you in with those details. Check your password, then try again.");
      return;
    }
    window.location.assign(redirectTo);
  };

  const sendResetLink = async (supabase: NonNullable<ReturnType<typeof getSupabaseBrowserClient>>) => {
    const redirectUrl = new URL("/login?mode=update", window.location.origin).toString();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(ALLOWED_LOGIN_EMAIL, {
      redirectTo: redirectUrl,
    });
    if (resetError) {
      setError("We couldn't send a reset link. Please try again later or contact the administrator.");
      return;
    }
    setMessage(`If the shop account is configured, a password reset link will be sent to its registered email address (${ALLOWED_LOGIN_EMAIL}).`);
  };

  const updatePassword = async (supabase: NonNullable<ReturnType<typeof getSupabaseBrowserClient>>) => {
    if (!canUpdatePassword) {
      setError("Verify your password reset link before choosing a new password.");
      return;
    }
    if (password.length < 12) {
      setError("Choose a password with at least 12 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError("We couldn't update your password. Request a new reset link and try again.");
      return;
    }
    window.location.assign("/admin");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setError("Sign-in is not configured yet. Add the Supabase project settings to .env.local and restart the app.");
      return;
    }
    setPending(true);
    if (mode === "sign-in") {
      await signIn(supabase);
    } else if (mode === "forgot") {
      await sendResetLink(supabase);
    } else {
      await updatePassword(supabase);
    }
    setPending(false);
  };

  const heading = mode === "forgot"
    ? "Reset password"
    : mode === "update"
      ? "Choose a new password"
      : "Welcome back";

  return (
    <main className="login-page">
      <div className="login-panel">
        <div className="login-brand"><span className="brand-mark"><span /></span><span className="brand-copy"><strong>GRANITE SHOP</strong><small>INVENTORY DESK</small></span></div>
        <div className="login-rule" />
        <span className="section-kicker">EMPLOYEE ACCESS</span>
        <h1>{heading}<span className="heading-period">.</span></h1>
        <p className="login-description">
          {mode === "forgot"
            ? "We’ll email a secure reset link to the shop account’s registered email."
            : mode === "update"
              ? "Enter and confirm your new password to restore account access."
              : "Sign in with the shop account to access inventory."}
        </p>
        <form className="login-form" onSubmit={handleSubmit}>
          {mode !== "update" && (
            <label className="form-field">
              <span>Email address</span>
              <input autoComplete="username" readOnly type="email" value={ALLOWED_LOGIN_EMAIL} />
            </label>
          )}
          {mode !== "forgot" && (
            <label className="form-field">
              <span>{mode === "update" ? "New password" : "Password"}</span>
              <input
                autoComplete={mode === "update" ? "new-password" : "current-password"}
                autoFocus={mode === "sign-in"}
                onChange={(event) => setPassword(event.target.value)}
                required
                type="password"
                value={password}
              />
            </label>
          )}
          {mode === "update" && (
            <label className="form-field">
              <span>Confirm new password</span>
              <input autoComplete="new-password" onChange={(event) => setConfirmPassword(event.target.value)} required type="password" value={confirmPassword} />
            </label>
          )}
          {error && <p className="login-error" role="alert">{error}</p>}
          {message && <p className="login-message" role="status">{message}</p>}
          {mode === "update" && !canUpdatePassword && !error && <p className="login-setup" role="status">Verifying your password reset link…</p>}
          {!configured && <p className="login-setup"><KeyRound size={15} /> Login is ready to connect. Set up Supabase to enable employee accounts; the public demo remains open until then.</p>}
          <button className="button button-primary login-submit" disabled={pending || !configured || (mode === "update" && !canUpdatePassword)} type="submit">
            {pending
              ? "Please wait..."
              : mode === "forgot"
                ? "Send reset link"
                : mode === "update"
                  ? "Update password"
                  : "Sign in"}
            <ArrowRight size={15} />
          </button>
        </form>
        {mode === "sign-in" && (
          <button className="login-mode-switch" onClick={() => { setMode("forgot"); setError(""); setMessage(""); }} type="button">
            Forgot password?
          </button>
        )}
        {mode === "forgot" && (
          <button className="login-mode-switch" onClick={() => { setMode("sign-in"); setError(""); setMessage(""); }} type="button">
            <ArrowLeft size={13} /> Back to sign in
          </button>
        )}
        <div className="login-footnote"><span className="demo-indicator"><i /> Demo records</span><span>Granite Shop Inventory</span></div>
      </div>
      <div className="login-photo" role="img" aria-label="Stone surfaces in a countertop showroom"><span>STONE & SURFACE<br />INVENTORY</span></div>
    </main>
  );
}
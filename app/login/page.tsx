"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";

import Logo from "../../components/Logo";

const trustPoints = [
  "One account for farmers, buyers, agronomists and admins",
  "Your data stays private and is never sold",
  "Pick up right where you left off, on any device",
];

const roleChips = [
  { icon: "🌾", label: "Farmer" },
  { icon: "🛍️", label: "Buyer" },
  { icon: "🧑‍🌾", label: "Agronomist" },
  { icon: "🛡️", label: "Admin" },
];

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const justRegistered = searchParams.get("registered") === "1";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, remember }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.error ?? "Invalid email or password.");
        return;
      }

      router.push(data?.redirectTo ?? "/login");
    } catch {
      setError(
        "Couldn't reach the server. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <div className="login-shell">
        {/* ================= LEFT — BRAND PANEL ================= */}
        <section className="login-visual">
          <div className="login-visual-glow" />
          <div className="login-orbit login-orbit-one" />
          <div className="login-orbit login-orbit-two" />

          <Link href="/" className="login-brand">
            <Logo width={150} />
          </Link>

          <div className="login-visual-content">
            <div className="login-badge">
              <span className="pulse-dot" />
              Welcome back
            </div>

            <h1>
              Your farm, your market,
              <br />
              <span>one login away.</span>
            </h1>

            <p>
              Sign in to manage your farms, track activity, connect with
              buyers and agricultural experts, all in one place.
            </p>

            <ul className="login-points">
              {trustPoints.map((point) => (
                <li key={point}>
                  <span>
                    <ShieldCheck size={13} />
                  </span>
                  {point}
                </li>
              ))}
            </ul>

            <div className="login-roles">
              {roleChips.map((role) => (
                <div className="login-role-chip" key={role.label}>
                  <span>{role.icon}</span>
                  {role.label}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= RIGHT — FORM ================= */}
        <section className="login-form-side">
          <div className="login-form-wrap">
            <Link href="/" className="login-mobile-back">
              <ArrowLeft size={15} />
              Back to home
            </Link>

            <div className="login-mobile-logo">
              <Logo width={130} />
            </div>

            <div className="login-heading">
              <span className="mini-tag">SIGN IN</span>
              <h2>Welcome back</h2>
              <p>Enter your details to access your AGRINOVA account.</p>
            </div>

            {justRegistered && !error && (
              <div className="login-message login-info login-info-top">
                Account created — sign in below to continue.
              </div>
            )}

            <form className="login-form" onSubmit={handleSubmit} noValidate>
              <label className="login-field">
                <span>Email address</span>
                <div className="login-input">
                  <Mail size={16} />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
              </label>

              <label className="login-field">
                <span>Password</span>
                <div className="login-input">
                  <Lock size={16} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="login-eye-toggle"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </label>

              <div className="login-row">
                <label className="login-checkbox">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <span className="login-checkbox-box" />
                  Remember me
                </label>

                <button type="button" className="login-forgot">
                  Forgot password?
                </button>
              </div>

              {error && <div className="login-message login-error">{error}</div>}

              <button
                type="submit"
                className="btn btn-primary btn-large login-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="login-spinner" />
                    Signing in...
                  </>
                ) : (
                  <>Sign in →</>
                )}
              </button>
            </form>

            <div className="login-divider">
              <span>New to AGRINOVA?</span>
            </div>

            <Link href="/#roles" className="btn btn-outline btn-large login-register-btn">
              Create an account
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

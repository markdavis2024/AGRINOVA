"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
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
  CheckCircle,
} from "lucide-react";

import Logo from "@/components/Logo";

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
  const [successMessage, setSuccessMessage] = useState("");
  const justRegistered = searchParams.get("registered") === "1";
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.announcement) setAnnouncement(data.announcement);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (justRegistered) {
      setSuccessMessage("Account created successfully! Please sign in.");
    }
  }, [justRegistered]);

  // Navigate to forgot password page
  const goToForgotPassword = () => {
    router.push("/forgot-password");
  };

  // Navigate to landing page roles section
  const goToLandingPage = () => {
    router.push("/#roles");
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

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

            {announcement && (
              <div className="login-message login-info login-info-top">
                {announcement}
              </div>
            )}

            {successMessage && (
              <div className="login-message login-success login-info-top">
                <CheckCircle size={16} />
                {successMessage}
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

                {/* ✅ Forgot Password Button - Navigates to forgot password page */}
                <button 
                  type="button" 
                  className="login-forgot"
                  onClick={goToForgotPassword}
                >
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

            {/* ✅ Get Started Button - Navigates to landing page roles section */}
            <button
              onClick={goToLandingPage}
              className="login-get-started-btn"
            >
              Get Started →
            </button>

            <div className="login-footer-text">
              <Link href="/terms">Terms</Link>
              <span>•</span>
              <Link href="/privacy">Privacy</Link>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        /* =========================================================
           LOGIN PAGE STYLES
        ========================================================= */

        .login-page {
          min-height: 100vh;
          background: var(--cream);
        }

        .login-shell {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 0.95fr 1.05fr;
        }

        /* ---- Left brand panel ---- */

        .login-visual {
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 44px 60px 60px;
          background: var(--green-deep);
          color: white;
        }

        .login-visual-glow {
          position: absolute;
          width: 480px;
          height: 480px;
          right: -160px;
          top: -140px;
          border-radius: 50%;
          background: rgba(184, 230, 46, 0.14);
          filter: blur(20px);
        }

        .login-orbit {
          position: absolute;
          border: 1px dashed rgba(184, 230, 46, 0.18);
          border-radius: 50%;
          pointer-events: none;
        }

        .login-orbit-one {
          width: 340px;
          height: 340px;
          right: -90px;
          bottom: -120px;
          animation: rotateSlow 26s linear infinite;
        }

        .login-orbit-two {
          width: 220px;
          height: 220px;
          right: -40px;
          bottom: -30px;
          animation: rotateSlowReverse 20s linear infinite;
        }

        @keyframes rotateSlow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes rotateSlowReverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        .login-brand {
          display: inline-flex;
          width: fit-content;
        }

        .login-brand .agrinova-logo-image {
          filter: brightness(0) invert(1);
        }

        .login-visual-content {
          position: relative;
          z-index: 2;
          max-width: 460px;
        }

        .login-badge {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 9px 14px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 100px;
          background: rgba(255, 255, 255, 0.06);
          font-size: 11px;
          font-weight: 700;
          margin-bottom: 22px;
        }

        .pulse-dot {
          width: 8px;
          height: 8px;
          background: #34d399;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.45);
          }
          70% {
            box-shadow: 0 0 0 8px rgba(52, 211, 153, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(52, 211, 153, 0);
          }
        }

        .login-visual-content h1 {
          font-family: "Manrope", sans-serif;
          font-size: clamp(32px, 3.4vw, 44px);
          line-height: 1.08;
          letter-spacing: -0.04em;
          font-weight: 800;
        }

        .login-visual-content h1 span {
          color: var(--green);
        }

        .login-visual-content > p {
          margin: 20px 0 26px;
          color: rgba(255, 255, 255, 0.65);
          font-size: 14px;
          line-height: 1.8;
          max-width: 380px;
        }

        .login-points {
          display: grid;
          gap: 12px;
          list-style: none;
          margin-bottom: 30px;
        }

        .login-points li {
          display: flex;
          align-items: center;
          gap: 11px;
          font-size: 12.5px;
          color: rgba(255, 255, 255, 0.85);
        }

        .login-points li span {
          display: grid;
          place-items: center;
          flex-shrink: 0;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(184, 230, 46, 0.15);
          color: var(--green);
        }

        .login-roles {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .login-role-chip {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 8px 13px;
          border-radius: 100px;
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 11px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.85);
        }

        /* ---- Right form panel ---- */

        .login-form-side {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          background: white;
        }

        .login-form-wrap {
          width: 100%;
          max-width: 400px;
        }

        .login-mobile-back,
        .login-mobile-logo {
          display: none;
        }

        .login-mobile-back {
          align-items: center;
          gap: 8px;
          color: var(--text-soft);
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 20px;
          text-decoration: none;
        }

        .login-heading {
          margin-bottom: 30px;
        }

        .login-heading .mini-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--green-dark);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.15em;
          margin-bottom: 12px;
        }

        .login-heading h2 {
          font-family: "Manrope", sans-serif;
          font-size: clamp(28px, 3vw, 34px);
          letter-spacing: -0.04em;
          font-weight: 800;
          color: var(--green-deep);
        }

        .login-heading p {
          margin-top: 10px;
          color: var(--text-soft);
          font-size: 13.5px;
          line-height: 1.7;
        }

        .login-message {
          padding: 11px 14px;
          border-radius: 12px;
          font-size: 12px;
          line-height: 1.6;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .login-error {
          background: #fdecec;
          color: #b3261e;
          border: 1px solid #f6c9c7;
        }

        .login-info {
          background: var(--green-soft);
          color: var(--green-dark);
          border: 1px solid rgba(130, 173, 22, 0.25);
        }

        .login-success {
          background: var(--green-soft);
          color: var(--green-dark);
          border: 1px solid rgba(130, 173, 22, 0.25);
        }

        .login-info-top {
          margin-bottom: 18px;
        }

        .login-form {
          display: grid;
          gap: 16px;
        }

        .login-field {
          display: grid;
          gap: 8px;
        }

        .login-field > span {
          font-size: 11.5px;
          font-weight: 700;
          color: var(--green-deep);
        }

        .login-input {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 14px;
          border-radius: 14px;
          border: 1px solid var(--border);
          background: white;
          color: #8b9487;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .login-input:focus-within {
          border-color: var(--green);
          box-shadow: 0 0 0 4px rgba(184, 230, 46, 0.15);
        }

        .login-input input {
          flex: 1;
          border: none;
          outline: none;
          padding: 13px 0;
          font-size: 14px;
          color: var(--text);
          background: transparent;
          font-family: inherit;
        }

        .login-eye-toggle {
          border: none;
          background: transparent;
          color: #8b9487;
          display: flex;
          align-items: center;
          padding: 4px;
        }

        .login-eye-toggle:hover {
          color: var(--green-dark);
        }

        .login-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: -4px;
        }

        .login-checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: var(--text-soft);
          cursor: pointer;
        }

        .login-checkbox input {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
        }

        .login-checkbox-box {
          width: 16px;
          height: 16px;
          border-radius: 5px;
          border: 1.5px solid var(--border);
          background: white;
          display: inline-block;
          position: relative;
          transition: background 0.2s ease, border-color 0.2s ease;
        }

        .login-checkbox input:checked + .login-checkbox-box {
          background: var(--green);
          border-color: var(--green);
        }

        .login-checkbox input:checked + .login-checkbox-box::after {
          content: "";
          position: absolute;
          left: 5px;
          top: 1px;
          width: 4px;
          height: 8px;
          border: solid var(--green-deep);
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }

        /* ✅ Updated Forgot Password Button */
        .login-forgot {
          border: none;
          background: transparent;
          color: var(--green-dark);
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: color 0.2s;
        }

        .login-forgot:hover {
          color: var(--green-deep);
          text-decoration: underline;
        }

        .login-submit {
          width: 100%;
          justify-content: center;
          display: flex;
          align-items: center;
          gap: 9px;
          margin-top: 4px;
        }

        .login-submit:disabled {
          opacity: 0.75;
          cursor: not-allowed;
          transform: none !important;
        }

        .login-spinner {
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .login-divider {
          position: relative;
          text-align: center;
          margin: 26px 0 18px;
        }

        .login-divider::before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: 50%;
          height: 1px;
          background: var(--border);
        }

        .login-divider span {
          position: relative;
          padding: 0 12px;
          background: white;
          color: #8b9487;
          font-size: 11px;
          font-weight: 600;
        }

        /* ✅ Get Started Button */
        .login-get-started-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 12px 24px;
          margin-top: 8px;
          border: 2px solid var(--green);
          border-radius: 12px;
          background: transparent;
          color: var(--green-deep);
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
        }

        .login-get-started-btn:hover {
          background: var(--green);
          color: var(--green-deep);
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(184, 230, 46, 0.3);
        }

        .login-footer-text {
          text-align: center;
          margin-top: 20px;
          font-size: 11px;
          color: #8b9487;
        }

        .login-footer-text a {
          color: var(--text-soft);
          text-decoration: none;
        }

        .login-footer-text a:hover {
          color: var(--green-dark);
        }

        .login-footer-text span {
          margin: 0 8px;
        }

        /* =========================================================
           RESPONSIVE
        ========================================================= */

        @media (max-width: 900px) {
          .login-shell {
            grid-template-columns: 1fr;
          }

          .login-visual {
            display: none;
          }

          .login-mobile-back {
            display: inline-flex;
          }

          .login-mobile-logo {
            display: block;
            margin-bottom: 26px;
          }

          .login-form-side {
            padding: 60px 24px;
            background: var(--cream);
            min-height: 100vh;
          }

          .login-form-wrap {
            max-width: 420px;
            margin: 0 auto;
          }
        }

        @media (max-width: 480px) {
          .login-form-side {
            padding: 40px 18px;
          }

          .login-row {
            flex-wrap: wrap;
            gap: 10px;
          }

          .login-heading h2 {
            font-size: 24px;
          }

          .login-get-started-btn {
            font-size: 13px;
            padding: 10px 20px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
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
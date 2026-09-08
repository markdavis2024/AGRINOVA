"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import Logo from "@/components/Logo";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setSuccess(true);
    } catch (error) {
      setError("Could not connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-topbar">
        <Link href="/" className="auth-brand">
          <Logo width={140} />
        </Link>
        <Link href="/login" className="auth-back-link">
          Back to <strong>Login</strong>
        </Link>
      </div>

      <div className="auth-shell">
        <div className="auth-card" style={{ maxWidth: "480px", margin: "0 auto" }}>
          <div className="auth-card-header">
            <span className="mini-tag">🔐 FORGOT PASSWORD</span>
            <h1>Reset your password</h1>
            <p>
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {success ? (
            <div className="success-container">
              <div className="success-icon">
                <CheckCircle size={48} className="text-green-600" />
              </div>
              <h3>Check your email</h3>
              <p>
                We've sent a password reset link to <strong>{email}</strong>.
                The link will expire in 1 hour.
              </p>
              <button
                onClick={() => router.push("/login")}
                className="btn btn-primary"
                style={{ width: "100%", marginTop: "16px" }}
              >
                Back to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="auth-form">
              <label className="login-field">
                <span>Email address</span>
                <div className="login-input">
                  <Mail size={16} />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </label>

              {error && (
                <div className="login-message login-error">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-large"
                disabled={loading}
                style={{ width: "100%", justifyContent: "center" }}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="login-spinner" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>

              <div style={{ textAlign: "center", marginTop: "16px" }}>
                <Link href="/login" style={{ color: "#059669", fontWeight: "600", fontSize: "14px" }}>
                  ← Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>

      <style jsx>{`
        .success-container {
          text-align: center;
          padding: 20px 0;
        }
        .success-icon {
          margin-bottom: 16px;
        }
        .success-container h3 {
          font-size: 20px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 8px;
        }
        .success-container p {
          color: #6b7280;
          font-size: 14px;
          line-height: 1.6;
        }
      `}</style>
    </main>
  );
}
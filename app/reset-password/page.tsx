"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Lock, Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import Logo from "@/components/Logo";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token.");
    }
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
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
            <span className="mini-tag">🔐 RESET PASSWORD</span>
            <h1>Create new password</h1>
            <p>Enter your new password below.</p>
          </div>

          {!token ? (
            <div className="error-container">
              <AlertCircle size={48} className="text-red-500" />
              <h3>Invalid Reset Link</h3>
              <p>The password reset link is invalid or has expired.</p>
              <Link href="/forgot-password" className="btn btn-primary" style={{ width: "100%", textAlign: "center" }}>
                Request New Link
              </Link>
            </div>
          ) : success ? (
            <div className="success-container">
              <div className="success-icon">
                <CheckCircle size={48} className="text-green-600" />
              </div>
              <h3>Password Reset Successful!</h3>
              <p>Your password has been reset. Redirecting to login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="auth-form">
              <label className="login-field">
                <span>New Password</span>
                <div className="login-input">
                  <Lock size={16} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="login-eye-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </label>

              <label className="login-field">
                <span>Confirm Password</span>
                <div className="login-input">
                  <Lock size={16} />
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="login-eye-toggle"
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
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
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
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
        .error-container {
          text-align: center;
          padding: 20px 0;
        }
        .error-container h3 {
          font-size: 20px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 8px;
        }
        .error-container p {
          color: #6b7280;
          font-size: 14px;
          margin-bottom: 16px;
        }
      `}</style>
    </main>
  );
}
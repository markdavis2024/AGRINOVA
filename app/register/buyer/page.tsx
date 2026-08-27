"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Apple,
  ArrowLeft,
  ArrowRight,
  Beef,
  Carrot,
  Check,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Milk,
  Package,
  Phone,
  User,
  Wheat,
} from "lucide-react";

import Logo from "../../../components/Logo";

const steps = [
  { label: "Personal info", icon: User },
  { label: "Preferences & security", icon: Lock },
];

const regions = [
  "Adamawa",
  "Centre",
  "East",
  "Far North",
  "Littoral",
  "North",
  "Northwest",
  "West",
  "South",
  "Southwest",
];

const interests = [
  { label: "Vegetables", icon: Carrot },
  { label: "Fruits", icon: Apple },
  { label: "Cereals & grains", icon: Wheat },
  { label: "Livestock & poultry", icon: Beef },
  { label: "Dairy", icon: Milk },
  { label: "Other produce", icon: Package },
];

export default function BuyerRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    region: "",
    town: "",
    interests: [] as string[],
    password: "",
    confirmPassword: "",
    terms: false,
  });

  function update(key: string, value: string | boolean) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleInterest(label: string) {
    setForm((f) => ({
      ...f,
      interests: f.interests.includes(label)
        ? f.interests.filter((i) => i !== label)
        : [...f.interests, label],
    }));
  }

  function validateStep(current: number) {
    if (current === 1) {
      if (!form.fullName || !form.email || !form.phone || !form.region || !form.town) {
        setError("Please fill in all your personal information.");
        return false;
      }
    }

    setError("");
    return true;
  }

  function goNext() {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(s + 1, 2));
  }

  function goBack() {
    setError("");
    setStep((s) => Math.max(s - 1, 1));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (form.password.length < 8) {
      setError("Your password must be at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!form.terms) {
      setError("Please accept the AGRINOVA terms and conditions.");
      return;
    }

    setLoading(true);

    try {
      const fd = new FormData();
      fd.set("fullName", form.fullName);
      fd.set("email", form.email);
      fd.set("phone", form.phone);
      fd.set("region", form.region);
      fd.set("town", form.town);
      form.interests.forEach((i) => fd.append("interests", i));
      fd.set("password", form.password);
      fd.set("confirmPassword", form.confirmPassword);
      fd.set("terms", String(form.terms));

      const res = await fetch("/api/auth/register/buyer", {
        method: "POST",
        body: fd,
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.error ?? "Something went wrong. Please try again.");
        return;
      }

      router.push("/login?registered=1");
    } catch {
      setError(
        "Couldn't reach the server. Please check your connection and try again."
      );
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
          Already registered? <strong>Login</strong>
        </Link>
      </div>

      <div className="auth-shell">
        <div className="auth-card">
          <div className="auth-card-header">
            <span className="mini-tag">🛍️ BUYER REGISTRATION</span>
            <h1>Create your buyer account</h1>
            <p>
              Discover agricultural products and connect directly with
              farmers near you.
            </p>
          </div>

          {/* ---- Stepper ---- */}
          <div className="auth-stepper">
            {steps.map((s, index) => {
              const num = index + 1;
              const StepIcon = s.icon;
              const state =
                num < step ? "done" : num === step ? "active" : "upcoming";

              return (
                <div className={`auth-step auth-step-${state}`} key={s.label}>
                  <div className="auth-step-icon">
                    {state === "done" ? <Check size={14} /> : <StepIcon size={14} />}
                  </div>
                  <span>{s.label}</span>
                  {index < steps.length - 1 && <div className="auth-step-line" />}
                </div>
              );
            })}
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {/* ---- Step 1 — Personal information ---- */}
            {step === 1 && (
              <div className="auth-step-panel">
                <label className="login-field">
                  <span>Full name</span>
                  <div className="login-input">
                    <User size={16} />
                    <input
                      type="text"
                      placeholder="Your full name"
                      value={form.fullName}
                      onChange={(e) => update("fullName", e.target.value)}
                      autoComplete="name"
                    />
                  </div>
                </label>

                <label className="login-field">
                  <span>Email address</span>
                  <div className="login-input">
                    <Mail size={16} />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      autoComplete="email"
                    />
                  </div>
                </label>

                <label className="login-field">
                  <span>Phone number</span>
                  <div className="login-input">
                    <Phone size={16} />
                    <input
                      type="tel"
                      placeholder="+237 6XX XXX XXX"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      autoComplete="tel"
                    />
                  </div>
                </label>

                <div className="auth-field-row">
                  <label className="login-field">
                    <span>Region</span>
                    <div className="login-input">
                      <MapPin size={16} />
                      <select
                        value={form.region}
                        onChange={(e) => update("region", e.target.value)}
                      >
                        <option value="">Select region</option>
                        {regions.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>
                  </label>

                  <label className="login-field">
                    <span>Town / City</span>
                    <div className="login-input">
                      <MapPin size={16} />
                      <input
                        type="text"
                        placeholder="e.g. Douala"
                        value={form.town}
                        onChange={(e) => update("town", e.target.value)}
                      />
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* ---- Step 2 — Preferences + Security ---- */}
            {step === 2 && (
              <div className="auth-step-panel">
                <div className="login-field">
                  <span>What are you interested in buying? (optional)</span>
                  <div className="auth-chip-grid">
                    {interests.map((item) => {
                      const active = form.interests.includes(item.label);
                      return (
                        <button
                          type="button"
                          key={item.label}
                          className={`auth-chip ${active ? "auth-chip-active" : ""}`}
                          onClick={() => toggleInterest(item.label)}
                        >
                          <item.icon size={14} />
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <label className="login-field">
                  <span>Password</span>
                  <div className="login-input">
                    <Lock size={16} />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="At least 8 characters"
                      value={form.password}
                      onChange={(e) => update("password", e.target.value)}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="login-eye-toggle"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </label>

                <label className="login-field">
                  <span>Confirm password</span>
                  <div className="login-input">
                    <Lock size={16} />
                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder="Re-enter your password"
                      value={form.confirmPassword}
                      onChange={(e) => update("confirmPassword", e.target.value)}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="login-eye-toggle"
                      onClick={() => setShowConfirm((v) => !v)}
                      aria-label={showConfirm ? "Hide password" : "Show password"}
                    >
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </label>

                <label className="login-checkbox auth-terms">
                  <input
                    type="checkbox"
                    checked={form.terms}
                    onChange={(e) => update("terms", e.target.checked)}
                  />
                  <span className="login-checkbox-box" />
                  I agree to the AGRINOVA terms and conditions
                </label>
              </div>
            )}

            {error && <div className="login-message login-error">{error}</div>}

            <div className="auth-form-nav">
              {step > 1 ? (
                <button type="button" className="btn btn-light" onClick={goBack}>
                  <ArrowLeft size={15} />
                  Previous
                </button>
              ) : (
                <span />
              )}

              {step < 2 && (
                <button type="button" className="btn btn-primary" onClick={goNext}>
                  Next
                  <ArrowRight size={15} />
                </button>
              )}

              {step === 2 && (
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="login-spinner" />
                      Creating account...
                    </>
                  ) : (
                    <>Create account →</>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

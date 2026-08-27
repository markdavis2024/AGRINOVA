"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Briefcase,
  Building,
  Check,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  Upload,
  User,
} from "lucide-react";

import Logo from "../../../components/Logo";

const steps = [
  { label: "Personal info", icon: User },
  { label: "Credentials", icon: GraduationCap },
  { label: "Security", icon: Lock },
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

const specializations = [
  "Crop science",
  "Soil science",
  "Animal husbandry",
  "Plant pathology",
  "Agricultural economics",
  "Irrigation & water management",
  "Other",
];

export default function AgronomistRegisterPage() {
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
    specialization: "",
    experience: "",
    institution: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [certification, setCertification] = useState<File | null>(null);

  function update(key: string, value: string | boolean) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validateStep(current: number) {
    if (current === 1) {
      if (!form.fullName || !form.email || !form.phone || !form.region || !form.town) {
        setError("Please fill in all your personal information.");
        return false;
      }
    }

    if (current === 2) {
      if (!form.specialization || !form.institution) {
        setError("Please share your specialization and institution.");
        return false;
      }
    }

    setError("");
    return true;
  }

  function goNext() {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(s + 1, 3));
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
      fd.set("specialization", form.specialization);
      fd.set("experience", form.experience);
      fd.set("institution", form.institution);
      fd.set("password", form.password);
      fd.set("confirmPassword", form.confirmPassword);
      fd.set("terms", String(form.terms));
      if (certification) fd.set("certification", certification);

      const res = await fetch("/api/auth/register/agronomist", {
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
            <span className="mini-tag">🧑‍🌾 AGRONOMIST REGISTRATION</span>
            <h1>Create your expert account</h1>
            <p>
              Share your agricultural expertise and help farmers make better
              decisions across AGRINOVA.
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
                        placeholder="e.g. Yaoundé"
                        value={form.town}
                        onChange={(e) => update("town", e.target.value)}
                      />
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* ---- Step 2 — Professional credentials ---- */}
            {step === 2 && (
              <div className="auth-step-panel">
                <label className="login-field">
                  <span>Specialization</span>
                  <div className="login-input">
                    <GraduationCap size={16} />
                    <select
                      value={form.specialization}
                      onChange={(e) => update("specialization", e.target.value)}
                    >
                      <option value="">Select specialization</option>
                      {specializations.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </label>

                <div className="auth-field-row">
                  <label className="login-field">
                    <span>Years of experience</span>
                    <div className="login-input">
                      <Briefcase size={16} />
                      <input
                        type="text"
                        placeholder="e.g. 5"
                        value={form.experience}
                        onChange={(e) => update("experience", e.target.value)}
                      />
                    </div>
                  </label>

                  <label className="login-field">
                    <span>Institution / employer</span>
                    <div className="login-input">
                      <Building size={16} />
                      <input
                        type="text"
                        placeholder="Where you work or studied"
                        value={form.institution}
                        onChange={(e) => update("institution", e.target.value)}
                      />
                    </div>
                  </label>
                </div>

                <div className="login-field">
                  <span>Professional certification / diploma (optional)</span>
                  <label className="auth-upload">
                    <Upload size={18} />
                    <div>
                      <strong>
                        {certification ? certification.name : "Click to upload"}
                      </strong>
                      <small>
                        JPG, PNG or PDF, up to 5MB. Speeds up your review.
                      </small>
                    </div>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,application/pdf"
                      onChange={(e) => setCertification(e.target.files?.[0] ?? null)}
                    />
                  </label>
                </div>

                <div className="auth-note">
                  <Award size={14} />
                  Your account will be marked as pending review by an
                  administrator until your credentials are verified.
                </div>
              </div>
            )}

            {/* ---- Step 3 — Security ---- */}
            {step === 3 && (
              <div className="auth-step-panel">
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

              {step < 3 && (
                <button type="button" className="btn btn-primary" onClick={goNext}>
                  Next
                  <ArrowRight size={15} />
                </button>
              )}

              {step === 3 && (
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

"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  FileText,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  Ruler,
  Smartphone,
  Sprout,
  Upload,
  User,
  Wifi,
} from "lucide-react";

import Logo from "../../../components/Logo";

const steps = [
  { label: "Personal info", icon: User },
  { label: "Farm details", icon: Sprout },
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

const farmingTypes = [
  "Crop farming",
  "Livestock",
  "Mixed farming",
  "Aquaculture",
  "Poultry",
  "Other",
];

export default function FarmerRegisterPage() {
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
    farmingType: "",
    farmSize: "",
    password: "",
    confirmPassword: "",
    twoFactor: false,
    iotInterest: false,
    terms: false,
  });

  const [files, setFiles] = useState<{
    idFront: File | null;
    idBack: File | null;
    farmProof: File | null;
  }>({ idFront: null, idBack: null, farmProof: null });

  function setFile(key: keyof typeof files, value: File | null) {
    setFiles((f) => ({ ...f, [key]: value }));
  }

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
      if (!form.farmingType) {
        setError("Please tell us what type of farming you do.");
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
      fd.set("farmingType", form.farmingType);
      fd.set("farmSize", form.farmSize);
      fd.set("password", form.password);
      fd.set("confirmPassword", form.confirmPassword);
      fd.set("twoFactor", String(form.twoFactor));
      fd.set("iotInterest", String(form.iotInterest));
      fd.set("terms", String(form.terms));
      if (files.idFront) fd.set("idFront", files.idFront);
      if (files.idBack) fd.set("idBack", files.idBack);
      if (files.farmProof) fd.set("farmProof", files.farmProof);

      const res = await fetch("/api/auth/register/farmer", {
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
            <span className="mini-tag">🌾 FARMER REGISTRATION</span>
            <h1>Create your farmer account</h1>
            <p>
              Manage your farms, connect with buyers and get guidance from
              agricultural experts.
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
                        placeholder="e.g. Bafoussam"
                        value={form.town}
                        onChange={(e) => update("town", e.target.value)}
                      />
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* ---- Step 2 — Farm details + verification ---- */}
            {step === 2 && (
              <div className="auth-step-panel">
                <div className="auth-field-row">
                  <label className="login-field">
                    <span>Type of farming</span>
                    <div className="login-input">
                      <Sprout size={16} />
                      <select
                        value={form.farmingType}
                        onChange={(e) => update("farmingType", e.target.value)}
                      >
                        <option value="">Select type</option>
                        {farmingTypes.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                  </label>

                  <label className="login-field">
                    <span>Farm size (optional)</span>
                    <div className="login-input">
                      <Ruler size={16} />
                      <input
                        type="text"
                        placeholder="e.g. 2.5 hectares"
                        value={form.farmSize}
                        onChange={(e) => update("farmSize", e.target.value)}
                      />
                    </div>
                  </label>
                </div>

                <div className="login-field">
                  <span>National ID — front (optional)</span>
                  <label className="auth-upload">
                    <Upload size={18} />
                    <div>
                      <strong>
                        {files.idFront ? files.idFront.name : "Click to upload"}
                      </strong>
                      <small>JPG, PNG or PDF, up to 5MB.</small>
                    </div>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,application/pdf"
                      onChange={(e) => setFile("idFront", e.target.files?.[0] ?? null)}
                    />
                  </label>
                </div>

                <div className="login-field">
                  <span>National ID — back (optional)</span>
                  <label className="auth-upload">
                    <Upload size={18} />
                    <div>
                      <strong>
                        {files.idBack ? files.idBack.name : "Click to upload"}
                      </strong>
                      <small>JPG, PNG or PDF, up to 5MB.</small>
                    </div>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,application/pdf"
                      onChange={(e) => setFile("idBack", e.target.files?.[0] ?? null)}
                    />
                  </label>
                </div>

                <div className="login-field">
                  <span>Proof of farming activity (optional)</span>
                  <label className="auth-upload">
                    <FileText size={18} />
                    <div>
                      <strong>
                        {files.farmProof ? files.farmProof.name : "Click to upload"}
                      </strong>
                      <small>A land title, cooperative card, or similar proof.</small>
                    </div>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,application/pdf"
                      onChange={(e) => setFile("farmProof", e.target.files?.[0] ?? null)}
                    />
                  </label>
                </div>
              </div>
            )}

            {/* ---- Step 3 — Security & preferences ---- */}
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

                <div className="auth-toggle-row">
                  <div className="auth-toggle-text">
                    <Smartphone size={16} />
                    <div>
                      <strong>Two-step authentication</strong>
                      <span>Extra security when you sign in</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={`auth-switch ${form.twoFactor ? "auth-switch-on" : ""}`}
                    onClick={() => update("twoFactor", !form.twoFactor)}
                    aria-pressed={form.twoFactor}
                  >
                    <span />
                  </button>
                </div>

                <div className="auth-toggle-row">
                  <div className="auth-toggle-text">
                    <Wifi size={16} />
                    <div>
                      <strong>Interested in IoT monitoring</strong>
                      <span>Soil, weather and crop sensors for your farm</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={`auth-switch ${form.iotInterest ? "auth-switch-on" : ""}`}
                    onClick={() => update("iotInterest", !form.iotInterest)}
                    aria-pressed={form.iotInterest}
                  >
                    <span />
                  </button>
                </div>

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

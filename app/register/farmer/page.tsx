"use client";

import { FormEvent, useState, useEffect, useRef } from "react";
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
  AlertCircle,
  CheckCircle,
  Info,
  Shield,
  Copy,
  Download,
  X,
} from "lucide-react";

import Logo from "../../../components/Logo";
import PhotoUpload from "../../../components/PhotoUpload";

const steps = [
  { label: "Personal info", icon: User },
  { label: "Farm details", icon: Sprout },
  { label: "Security", icon: Lock },
];

const regions = [
  "Adamawa", "Centre", "East", "Far North", "Littoral",
  "North", "Northwest", "West", "South", "Southwest",
];

// LAND-BASED FARMING TYPES ONLY
const farmingTypes = [
  { value: "Crop farming", label: "🌾 Crop Farming", description: "Growing crops like maize, cassava, tomatoes, etc." },
  { value: "Mixed farming", label: "🌿 Mixed Farming", description: "Combination of crops and livestock on land." },
  { value: "Livestock", label: "🐄 Livestock", description: "Rearing cattle, goats, sheep, poultry on land." },
  { value: "Poultry", label: "🐔 Poultry", description: "Chicken, turkey, duck farming on land." },
  { value: "Agroforestry", label: "🌳 Agroforestry", description: "Combining trees with crops on same land." },
  { value: "Greenhouse", label: "🏠 Greenhouse Farming", description: "Controlled environment farming on land." },
  { value: "Other", label: "📋 Other Land-Based", description: "Other types of land-based agriculture." },
];

const disabledFarmingTypes = [
  { value: "Aquaculture", label: "🐟 Aquaculture", description: "Fish farming in water (not land-based)" },
  { value: "Hydroponics", label: "💧 Hydroponics", description: "Soilless farming (not land-based)" },
];

export default function FarmerRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Profile photo states
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);

  // 2FA states
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [twoFactorSecret, setTwoFactorSecret] = useState("");
  const [twoFactorQRCode, setTwoFactorQRCode] = useState("");
  const [twoFactorToken, setTwoFactorToken] = useState("");
  const [twoFactorBackupCodes, setTwoFactorBackupCodes] = useState<string[]>([]);
  const [isVerifying2FA, setIsVerifying2FA] = useState(false);
  const [twoFactorError, setTwoFactorError] = useState("");
  const [twoFactorSuccess, setTwoFactorSuccess] = useState("");

  // Email validation states
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [emailError, setEmailError] = useState("");
  const [isValidatingEmail, setIsValidatingEmail] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);

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

  const backupCodesRef = useRef<HTMLDivElement>(null);

  function setFile(key: keyof typeof files, value: File | null) {
    setFiles((f) => ({ ...f, [key]: value }));
  }

  function update(key: string, value: string | boolean) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const handlePhotoSelect = (file: File, preview: string) => {
    setProfilePhoto(file);
    setProfilePhotoPreview(preview);
  };

  const handlePhotoRemove = () => {
    setProfilePhoto(null);
    setProfilePhotoPreview(null);
  };

  // Email validation function
  const validateEmail = async (email: string) => {
    if (!email) {
      setEmailValid(null);
      setEmailError("");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setEmailValid(false);
      setEmailError("Please enter a valid email address.");
      return;
    }

    setIsValidatingEmail(true);
    setEmailError("");

  try {
  const response = await fetch("/api/v1/auth/validate-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  // Guard against HTML/404/500 — never crash on .json()
  const ct = response.headers.get("content-type") || "";
  if (!response.ok || !ct.includes("application/json")) {
    // Fail open — don't block the user if server is unhappy
    setEmailValid(true);
    setEmailError("");
    return;
  }

  const data = await response.json();

  if (data.valid === false) {
    setEmailValid(false);
    setEmailError(data.error || "Invalid email address.");
  } else {
    setEmailValid(true);
    setEmailError("");
  }
} catch (error) {
  console.error("Email validation error:", error);
  setEmailValid(true);
  setEmailError("");
} finally {
  setIsValidatingEmail(false);
};

  // Debounced email validation
  useEffect(() => {
    if (!form.email || !emailTouched) return;

    const timer = setTimeout(() => {
      validateEmail(form.email);
    }, 500);

    return () => clearTimeout(timer);
  }, [form.email, emailTouched]);

  // ✅ UPDATED 2FA Setup - Handles 401 (not logged in) gracefully
  const setupTwoFactor = async () => {
    setTwoFactorError("");
    setTwoFactorSuccess("");

    try {
      const response = await fetch("/api/auth/2fa/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enable: true }),
      });

      const data = await response.json();

      // ✅ Check if user is not logged in (this is expected during registration)
      if (response.status === 401 || data?.error === "Please sign in to enable 2FA.") {
        setTwoFactorError("⚠️ Please create your account first, then enable 2FA from Settings.");
        update("twoFactor", false);
        return;
      }

      // ✅ Check if 2FA service is not available
      if (response.status === 404) {
        setTwoFactorError("2FA service is not available. Please continue without 2FA.");
        update("twoFactor", false);
        return;
      }

      if (!response.ok) {
        setTwoFactorError(data.error || "Failed to setup 2FA.");
        return;
      }

      // ✅ If we get here, 2FA setup worked
      setTwoFactorSecret(data.secret);
      setTwoFactorQRCode(data.qrCode);
      setShow2FASetup(true);
    } catch (error) {
      console.error("2FA setup error:", error);
      setTwoFactorError("Failed to setup two-factor authentication.");
    }
  };

  // Verify 2FA
  const verifyTwoFactor = async () => {
    if (!twoFactorToken || twoFactorToken.length < 6) {
      setTwoFactorError("Please enter a valid 6-digit code.");
      return;
    }

    setIsVerifying2FA(true);
    setTwoFactorError("");
    setTwoFactorSuccess("");

    try {
      const response = await fetch("/api/auth/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: twoFactorSecret,
          token: twoFactorToken,
          action: "verify",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setTwoFactorError(data.error || "Verification failed.");
        return;
      }

      if (data.verified) {
        setTwoFactorSuccess("2FA enabled successfully!");
        setTwoFactorBackupCodes(data.backupCodes || []);
        update("twoFactor", true);
        
        setTimeout(() => {
          setShow2FASetup(false);
        }, 3000);
      } else {
        setTwoFactorError(data.error || "Invalid code. Please try again.");
      }
    } catch (error) {
      setTwoFactorError("Failed to verify two-factor authentication.");
    } finally {
      setIsVerifying2FA(false);
    }
  };

  // Copy backup codes
  const copyBackupCodes = () => {
    if (twoFactorBackupCodes.length === 0) return;
    
    const text = twoFactorBackupCodes.join("\n");
    navigator.clipboard.writeText(text).then(() => {
      setTwoFactorSuccess("Backup codes copied to clipboard!");
      setTimeout(() => setTwoFactorSuccess(""), 3000);
    });
  };

  // Download backup codes
  const downloadBackupCodes = () => {
    if (twoFactorBackupCodes.length === 0) return;
    
    const text = twoFactorBackupCodes.join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "agrinova-backup-codes.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  function validateStep(current: number) {
    if (current === 1) {
      if (!form.fullName || !form.email || !form.phone || !form.region || !form.town) {
        setError("Please fill in all your personal information.");
        return false;
      }

      if (!profilePhoto) {
        setError("Please upload a profile photo.");
        return false;
      }

      if (emailValid === false) {
        setError("Please enter a valid email address.");
        return false;
      }
    }

    if (current === 2) {
      if (!form.farmingType) {
        setError("Please select your farming type.");
        return false;
      }

      // Validate ID uploads are required
      if (!files.idFront) {
        setError("Please upload the front of your National ID.");
        return false;
      }

      if (!files.idBack) {
        setError("Please upload the back of your National ID.");
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
    setSuccess("");

    if (emailValid === false) {
      setError("Please enter a valid email address.");
      return;
    }

    if (form.password.length < 8) {
      setError("Your password must be at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!form.terms) {
      setError("Please read and accept the AGRINOVA terms and conditions.");
      return;
    }

    if (!profilePhoto) {
      setError("Please upload a profile photo.");
      return;
    }

    // Validate ID uploads before submitting
    if (!files.idFront) {
      setError("Please upload the front of your National ID.");
      return;
    }

    if (!files.idBack) {
      setError("Please upload the back of your National ID.");
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

      if (profilePhoto) {
        fd.set("profilePhoto", profilePhoto);
      }
      if (files.idFront) fd.set("idFront", files.idFront);
      if (files.idBack) fd.set("idBack", files.idBack);
      if (files.farmProof) fd.set("farmProof", files.farmProof);

      const res = await fetch("/api/auth/register/farmer", {
        method: "POST",
        body: fd,
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        if (data?.error?.toLowerCase().includes("email already exists")) {
          setEmailValid(false);
          setEmailError("An account with this email already exists. Please login instead.");
        }
        setError(data?.error ?? "Something went wrong. Please try again.");
        return;
      }

      setSuccess(data?.message || "Account created successfully!");

      setTimeout(() => {
        router.push("/login?registered=1");
      }, 2000);
    } catch {
      setError(
        "Couldn't reach the server. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const getEmailInputStyle = () => {
    if (!emailTouched || !form.email) return "login-input";
    if (isValidatingEmail) return "login-input login-input-validating";
    if (emailValid === true) return "login-input login-input-valid";
    if (emailValid === false) return "login-input login-input-invalid";
    return "login-input";
  };

  const getEmailIcon = () => {
    if (!emailTouched || !form.email) return null;
    if (isValidatingEmail) return <Loader2 size={16} className="spin" />;
    if (emailValid === true) return <CheckCircle size={16} className="text-green-600" />;
    if (emailValid === false) return <AlertCircle size={16} className="text-red-500" />;
    return null;
  };

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
                {/* Profile Photo Upload */}
                <div className="auth-field-full">
                  <PhotoUpload
                    label="Profile Photo"
                    onPhotoSelect={handlePhotoSelect}
                    onPhotoRemove={handlePhotoRemove}
                    currentPhoto={profilePhotoPreview}
                    required={true}
                    maxSize={10}
                  />
                </div>

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
                      required
                    />
                  </div>
                </label>

                {/* Email Field with Validation */}
                <label className="login-field">
                  <span>Email address <span className="email-required">*</span></span>
                  <div className={getEmailInputStyle()}>
                    <Mail size={16} />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => {
                        update("email", e.target.value);
                        if (!emailTouched) setEmailTouched(true);
                      }}
                      onBlur={() => {
                        setEmailTouched(true);
                        if (form.email) validateEmail(form.email);
                      }}
                      autoComplete="email"
                      required
                      className={emailValid === false ? "input-error" : ""}
                    />
                    {getEmailIcon()}
                    {isValidatingEmail && (
                      <span className="email-validating">Checking...</span>
                    )}
                  </div>
                  {emailError && emailTouched && (
                    <div className="email-validation-message error">
                      <AlertCircle size={14} />
                      <span>{emailError}</span>
                    </div>
                  )}
                  {emailValid === true && emailTouched && (
                    <div className="email-validation-message success">
                      <CheckCircle size={14} />
                      <span>Email is valid</span>
                    </div>
                  )}
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
                      required
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
                        required
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
                        required
                      />
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* ---- Step 2 — Farm details + verification ---- */}
            {step === 2 && (
              <div className="auth-step-panel">
                <div className="farming-type-section">
                  <label className="login-field">
                    <span>Type of farming <span className="field-required">*</span></span>
                    <div className="login-input">
                      <Sprout size={16} />
                      <select
                        value={form.farmingType}
                        onChange={(e) => update("farmingType", e.target.value)}
                        required
                      >
                        <option value="">Select your farming type</option>
                        
                        <optgroup label="🌱 Land-Based Farming">
                          {farmingTypes.map((t) => (
                            <option key={t.value} value={t.value}>
                              {t.label}
                            </option>
                          ))}
                        </optgroup>

                        <optgroup label="⛔ Not Available (Non-Land)">
                          {disabledFarmingTypes.map((t) => (
                            <option key={t.value} value={t.value} disabled>
                              {t.label}
                            </option>
                          ))}
                        </optgroup>
                      </select>
                    </div>
                  </label>

                  {form.farmingType && (
                    <div className="farming-type-info">
                      <Info size={16} className="info-icon" />
                      <div>
                        <strong>Selected:</strong>{" "}
                        {farmingTypes.find(t => t.value === form.farmingType)?.label || 
                         disabledFarmingTypes.find(t => t.value === form.farmingType)?.label || 
                         form.farmingType}
                        <br />
                        <span className="farming-type-desc">
                          {farmingTypes.find(t => t.value === form.farmingType)?.description ||
                           disabledFarmingTypes.find(t => t.value === form.farmingType)?.description ||
                           "Selected farming type"}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="farming-type-note">
                    <Info size={14} />
                    <span>
                      <strong>Note:</strong> We currently support land-based farming only. 
                      Aquaculture, hydroponics, and other water-based farming options are not available at this time.
                    </span>
                  </div>
                </div>

                <div className="auth-field-row">
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

                {/* ID Front - Required */}
                <div className="login-field">
                  <span>National ID — Front <span className="field-required">*</span></span>
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
                      required
                    />
                  </label>
                  {!files.idFront && (
                    <div className="upload-required-message">
                      <AlertCircle size={14} />
                      <span>Please upload the front of your National ID</span>
                    </div>
                  )}
                </div>

                {/* ID Back - Required */}
                <div className="login-field">
                  <span>National ID — Back <span className="field-required">*</span></span>
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
                      required
                    />
                  </label>
                  {!files.idBack && (
                    <div className="upload-required-message">
                      <AlertCircle size={14} />
                      <span>Please upload the back of your National ID</span>
                    </div>
                  )}
                </div>

                {/* Farm Proof - Optional */}
                <div className="login-field">
                  <span>Proof of farming activity (optional)</span>
                  <label className="auth-upload auth-upload-optional">
                    <Upload size={18} />
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
                      required
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
                      required
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

                {/* 2FA Toggle */}
                <div className="auth-toggle-row">
                  <div className="auth-toggle-text">
                    <Shield size={16} />
                    <div>
                      <strong>Two-step authentication</strong>
                      <span>Extra security when you sign in</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={`auth-switch ${form.twoFactor ? "auth-switch-on" : ""}`}
                    onClick={() => {
                      if (!form.twoFactor) {
                        setupTwoFactor();
                      } else {
                        update("twoFactor", false);
                        setTwoFactorError("");
                        setTwoFactorSuccess("");
                        setShow2FASetup(false);
                      }
                    }}
                    aria-pressed={form.twoFactor}
                  >
                    <span />
                  </button>
                </div>

                {/* 2FA Setup Modal */}
                {show2FASetup && (
                  <div className="twofa-setup-modal">
                    <div className="twofa-setup-content">
                      <button
                        type="button"
                        className="twofa-close"
                        onClick={() => setShow2FASetup(false)}
                      >
                        <X size={20} />
                      </button>
                      
                      <h3>
                        <Shield size={24} />
                        Set Up Two-Factor Authentication
                      </h3>
                      <p>Scan the QR code with your authenticator app (Google Authenticator, Authy, etc.)</p>

                      {twoFactorQRCode && (
                        <div className="twofa-qr-container">
                          <img src={twoFactorQRCode} alt="QR Code for 2FA" />
                          <div className="twofa-secret">
                            <span>Secret Key:</span>
                            <code>{twoFactorSecret}</code>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(twoFactorSecret);
                                setTwoFactorSuccess("Secret copied!");
                                setTimeout(() => setTwoFactorSuccess(""), 2000);
                              }}
                            >
                              <Copy size={14} />
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="twofa-verify">
                        <label>
                          Enter 6-digit code from authenticator app
                          <input
                            type="text"
                            placeholder="XXXXXX"
                            maxLength={6}
                            value={twoFactorToken}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, "");
                              setTwoFactorToken(val);
                            }}
                          />
                        </label>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={verifyTwoFactor}
                          disabled={isVerifying2FA || twoFactorToken.length < 6}
                        >
                          {isVerifying2FA ? (
                            <>
                              <Loader2 size={16} className="spin" />
                              Verifying...
                            </>
                          ) : (
                            "Verify & Enable"
                          )}
                        </button>
                      </div>

                      {twoFactorError && (
                        <div className="twofa-error">
                          <AlertCircle size={16} />
                          {twoFactorError}
                        </div>
                      )}

                      {twoFactorSuccess && (
                        <div className="twofa-success">
                          <CheckCircle size={16} />
                          {twoFactorSuccess}
                        </div>
                      )}

                      {twoFactorBackupCodes.length > 0 && (
                        <div className="twofa-backup-codes" ref={backupCodesRef}>
                          <h4>Backup Codes (Save these!)</h4>
                          <p>Use these codes if you lose access to your authenticator app.</p>
                          <div className="backup-codes-grid">
                            {twoFactorBackupCodes.map((code, i) => (
                              <span key={i} className="backup-code">{code}</span>
                            ))}
                          </div>
                          <div className="backup-actions">
                            <button type="button" onClick={copyBackupCodes}>
                              <Copy size={14} />
                              Copy Codes
                            </button>
                            <button type="button" onClick={downloadBackupCodes}>
                              <Download size={14} />
                              Download
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

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

                {/* ---- Terms & Conditions ---- */}
                <label className="login-checkbox auth-terms">
                  <input
                    type="checkbox"
                    checked={form.terms}
                    onChange={(e) => update("terms", e.target.checked)}
                    required
                  />
                  <span className="login-checkbox-box" />
                  <span className="auth-terms-text">
                    I have read and agree to the{" "}
                    <Link href="/terms" target="_blank" className="auth-terms-link">
                      Terms &amp; Conditions
                    </Link>
                    {" "}and{" "}
                    <Link href="/privacy" target="_blank" className="auth-terms-link">
                      Privacy Policy
                    </Link>
                    {" "}of AGRINOVA.
                  </span>
                </label>
              </div>
            )}

            {error && <div className="login-message login-error">{error}</div>}
            {success && <div className="login-message login-success">{success}</div>}

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

      <style jsx>{`
        .auth-field-full {
          grid-column: 1 / -1;
        }

        .email-required,
        .field-required {
          color: #ef4444;
        }

        .login-input-valid {
          border-color: #22c55e !important;
          background: #f0fdf4 !important;
        }

        .login-input-invalid {
          border-color: #ef4444 !important;
          background: #fef2f2 !important;
        }

        .login-input-validating {
          border-color: #f59e0b !important;
          background: #fffbeb !important;
        }

        .login-input input.input-error {
          color: #dc2626 !important;
        }

        .email-validation-message {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          margin-top: 4px;
        }

        .email-validation-message.error {
          color: #dc2626;
        }

        .email-validation-message.success {
          color: #16a34a;
        }

        .email-validating {
          font-size: 11px;
          color: #f59e0b;
          margin-left: 4px;
          font-weight: 500;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .auth-terms-text {
          font-size: 13px;
          color: #4b5563;
          line-height: 1.5;
        }

        .auth-terms-link {
          color: #059669;
          text-decoration: underline;
          font-weight: 500;
        }

        .auth-terms-link:hover {
          color: #047857;
        }

        .login-success {
          background: var(--green-soft);
          color: var(--green-dark);
          border: 1px solid rgba(130, 173, 22, 0.25);
        }

        /* Upload Required Message */
        .upload-required-message {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #dc2626;
          font-size: 12px;
          margin-top: 4px;
        }

        /* Farming Type Styles */
        .farming-type-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .farming-type-info {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 16px;
          background: #ecfdf5;
          border-radius: 10px;
          border: 1px solid #6ee7b7;
        }

        .farming-type-info .info-icon {
          color: #059669;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .farming-type-info strong {
          color: #065f46;
        }

        .farming-type-desc {
          font-size: 13px;
          color: #6b7280;
        }

        .farming-type-note {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 10px 14px;
          background: #fffbeb;
          border-radius: 8px;
          border: 1px solid #fcd34d;
          font-size: 12px;
          color: #92400e;
        }

        .farming-type-note svg {
          flex-shrink: 0;
          margin-top: 1px;
        }

        .farming-type-note strong {
          color: #78350f;
        }

        select option:disabled {
          color: #9ca3af;
          background: #f3f4f6;
        }

        select optgroup {
          font-weight: 600;
          color: #1f2937;
        }

        select optgroup:last-child {
          color: #9ca3af;
        }

        select optgroup:last-child option {
          color: #9ca3af;
        }

        /* Auth Upload Styles */
        .auth-upload {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          border-radius: 14px;
          border: 1.5px dashed var(--green);
          background: var(--green-soft);
          color: var(--green-dark);
          cursor: pointer;
          transition: border-color 0.2s ease, background 0.2s ease;
        }

        .auth-upload:hover {
          border-color: var(--green-dark);
          background: #d4ed9a;
        }

        .auth-upload strong {
          display: block;
          font-size: 12.5px;
          color: var(--green-deep);
          word-break: break-all;
        }

        .auth-upload small {
          display: block;
          margin-top: 3px;
          font-size: 10.5px;
          line-height: 1.5;
          color: var(--green-dark);
          opacity: 0.75;
        }

        .auth-upload input[type="file"] {
          display: none;
        }

        .auth-upload-optional {
          border-color: var(--border);
          background: var(--cream-dark);
        }

        .auth-upload-optional:hover {
          border-color: var(--green);
          background: var(--green-soft);
        }

        /* 2FA Styles */
        .twofa-setup-modal {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .twofa-setup-content {
          background: white;
          border-radius: 20px;
          padding: 32px;
          max-width: 480px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
        }

        .twofa-close {
          position: absolute;
          top: 16px;
          right: 16px;
          background: #f3f4f6;
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #6b7280;
        }

        .twofa-close:hover {
          background: #e5e7eb;
        }

        .twofa-setup-content h3 {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 20px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 8px;
        }

        .twofa-setup-content > p {
          color: #6b7280;
          font-size: 14px;
          margin-bottom: 20px;
        }

        .twofa-qr-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: #f9fafb;
          border-radius: 12px;
          margin-bottom: 16px;
        }

        .twofa-qr-container img {
          width: 180px;
          height: 180px;
        }

        .twofa-secret {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #6b7280;
        }

        .twofa-secret code {
          background: white;
          padding: 4px 10px;
          border-radius: 6px;
          font-family: monospace;
          font-size: 13px;
          color: #1f2937;
          border: 1px solid #e5e7eb;
        }

        .twofa-secret button {
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
        }

        .twofa-secret button:hover {
          color: #059669;
        }

        .twofa-verify {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .twofa-verify label {
          font-size: 13px;
          font-weight: 500;
          color: #374151;
        }

        .twofa-verify input {
          display: block;
          width: 100%;
          padding: 10px 14px;
          border: 1px solid #d1d5db;
          border-radius: 10px;
          font-size: 18px;
          font-weight: 600;
          font-family: monospace;
          text-align: center;
          letter-spacing: 8px;
          margin-top: 4px;
        }

        .twofa-verify input:focus {
          outline: none;
          border-color: #059669;
          box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
        }

        .twofa-error {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background: #fef2f2;
          border-radius: 8px;
          color: #dc2626;
          font-size: 13px;
          margin-top: 12px;
        }

        .twofa-success {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background: #ecfdf5;
          border-radius: 8px;
          color: #059669;
          font-size: 13px;
          margin-top: 12px;
        }

        .twofa-backup-codes {
          margin-top: 16px;
          padding: 16px;
          background: #fffbeb;
          border-radius: 12px;
          border: 1px solid #fcd34d;
        }

        .twofa-backup-codes h4 {
          font-size: 14px;
          font-weight: 600;
          color: #92400e;
          margin-bottom: 4px;
        }

        .twofa-backup-codes p {
          font-size: 12px;
          color: #78350f;
          margin-bottom: 12px;
        }

        .backup-codes-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
        }

        .backup-code {
          font-family: monospace;
          font-size: 14px;
          font-weight: 600;
          color: #78350f;
          padding: 4px 8px;
          background: white;
          border-radius: 4px;
          text-align: center;
        }

        .backup-actions {
          display: flex;
          gap: 8px;
          margin-top: 12px;
        }

        .backup-actions button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          color: #4b5563;
          cursor: pointer;
        }

        .backup-actions button:hover {
          border-color: #059669;
          color: #059669;
        }
      `}</style>
    </main>
  );
}
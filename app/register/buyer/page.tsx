"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader2,
  ShoppingBag,
  Store,
  Package,
  Truck,
  Shield,
  Building2,
  Globe,
  Upload,
  Camera,
  X,
  FileText,
  Check,
  ChevronRight,
} from "lucide-react";

export default function BuyerRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    
    // Step 2: Company/Business Info
    companyName: "",
    companyType: "",
    registrationNumber: "",
    taxId: "",
    yearsInBusiness: "",
    employeeCount: "",
    
    // Step 3: Location & Preferences
    country: "Cameroon",
    region: "",
    city: "",
    address: "",
    postalCode: "",
    preferredProducts: [] as string[],
    purchaseFrequency: "",
    budgetRange: "",
    
    // Step 4: Terms
    agreeTerms: false,
    agreeMarketing: false,
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [idCardImage, setIdCardImage] = useState<string | null>(null);
  const [idCardFile, setIdCardFile] = useState<File | null>(null);
  const [idCardType, setIdCardType] = useState("national_id");
  
  const profileInputRef = useRef<HTMLInputElement>(null);
  const idCardInputRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const regions = [
    "Adamawa", "Centre", "East", "Far North", "Littoral",
    "North", "Northwest", "West", "South", "Southwest"
  ];

  const companyTypes = [
    "Agricultural Company",
    "Food Processing Company",
    "Retail Business",
    "Wholesale Business",
    "Export Company",
    "Individual Buyer",
    "Cooperatives",
    "Restaurant/Hotel",
    "Supermarket",
    "Other"
  ];

  const productCategories = [
    "Fresh Produce",
    "Grains & Cereals",
    "Livestock Products",
    "Processed Foods",
    "Cocoa & Coffee",
    "Oil Seeds",
    "Tubers & Roots",
    "Fruits",
    "Vegetables",
    "Dairy Products",
    "Poultry Products",
    "Organic Products"
  ];

  const purchaseFrequencyOptions = [
    "Daily",
    "Weekly",
    "Bi-weekly",
    "Monthly",
    "Quarterly",
    "As needed"
  ];

  const budgetRanges = [
    "Under 100,000 FCFA",
    "100,000 - 500,000 FCFA",
    "500,000 - 1,000,000 FCFA",
    "1,000,000 - 5,000,000 FCFA",
    "5,000,000 - 10,000,000 FCFA",
    "Over 10,000,000 FCFA"
  ];

  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target?.result as string);
        setProfileImageFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIdCardUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setIdCardImage(event.target?.result as string);
        setIdCardFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfileImage = () => {
    setProfileImage(null);
    setProfileImageFile(null);
    if (profileInputRef.current) profileInputRef.current.value = "";
  };

  const removeIdCard = () => {
    setIdCardImage(null);
    setIdCardFile(null);
    if (idCardInputRef.current) idCardInputRef.current.value = "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleProductToggle = (product: string) => {
    setFormData(prev => ({
      ...prev,
      preferredProducts: prev.preferredProducts.includes(product)
        ? prev.preferredProducts.filter(p => p !== product)
        : [...prev.preferredProducts, product]
    }));
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!profileImage) {
      newErrors.profileImage = "Please upload a profile picture";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.companyName.trim()) newErrors.companyName = "Company/Organization name is required";
    if (!formData.companyType) newErrors.companyType = "Please select company type";
    if (!idCardImage) {
      newErrors.idCard = "Please upload your ID card";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.region) newErrors.region = "Please select your region";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (formData.preferredProducts.length === 0) {
      newErrors.preferredProducts = "Please select at least one product category";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = true;
    
    if (step === 1) isValid = validateStep1();
    else if (step === 2) isValid = validateStep2();
    else if (step === 3) isValid = validateStep3();
    
    if (isValid && step < 4) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeTerms) {
      setErrors({ agreeTerms: "You must agree to the Terms & Conditions" });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess(true);
      setTimeout(() => {
        router.push("/buyer");
      }, 2000);
    } catch (error) {
      setErrors({ submit: "Registration failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, label: "Personal Info", icon: User },
    { number: 2, label: "Business & ID", icon: Building2 },
    { number: 3, label: "Location & Preferences", icon: MapPin },
    { number: 4, label: "Complete", icon: CheckCircle },
  ];

  return (
    <div className="register-buyer-page">
      <div className="register-buyer-container">
        {/* Header */}
        <div className="register-header">
          <Link href="/register" className="register-back-btn">
            <ArrowLeft className="register-back-icon" />
            Back
          </Link>
          <div className="register-header-content">
            <ShoppingBag className="register-header-icon" />
            <div>
              <h1>Buyer Registration</h1>
              <p>Join AGRINOVA as a buyer and connect with farmers directly</p>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="register-steps">
          {steps.map((s, index) => {
            const Icon = s.icon;
            const isActive = step === s.number;
            const isCompleted = step > s.number;
            return (
              <div key={s.number} className="register-step-item">
                <div className={`register-step-circle ${isActive ? 'register-step-active' : ''} ${isCompleted ? 'register-step-completed' : ''}`}>
                  {isCompleted ? <CheckCircle className="register-step-icon" /> : <span>{s.number}</span>}
                </div>
                <div className="register-step-label">{s.label}</div>
                {index < steps.length - 1 && (
                  <div className={`register-step-line ${isCompleted ? 'register-step-line-completed' : ''}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="register-form">
          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div className="register-step-content">
              <h2 className="register-step-title">Personal Information</h2>
              <p className="register-step-subtitle">Enter your personal details and upload a profile picture</p>

              {/* Profile Picture Upload */}
              <div className="register-upload-section">
                <label className="register-label">Profile Picture *</label>
                <div className="register-upload-container">
                  <div className="register-upload-avatar">
                    {profileImage ? (
                      <div className="register-upload-preview">
                        <img src={profileImage} alt="Profile" className="register-upload-img" />
                        <button 
                          type="button"
                          className="register-upload-remove"
                          onClick={removeProfileImage}
                        >
                          <X className="register-upload-remove-icon" />
                        </button>
                      </div>
                    ) : (
                      <div 
                        className="register-upload-placeholder"
                        onClick={() => profileInputRef.current?.click()}
                      >
                        <Camera className="register-upload-placeholder-icon" />
                        <span>Upload Photo</span>
                      </div>
                    )}
                  </div>
                  <input
                    ref={profileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfileUpload}
                    className="register-upload-input"
                  />
                  <p className="register-upload-hint">Upload a clear profile photo (JPG, PNG, max 5MB)</p>
                  {errors.profileImage && (
                    <span className="register-error">{errors.profileImage}</span>
                  )}
                </div>
              </div>

              <div className="register-form-grid">
                <div className="register-form-group">
                  <label className="register-label">First Name *</label>
                  <div className="register-input-wrapper">
                    <User className="register-input-icon" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter your first name"
                      className={`register-input ${errors.firstName ? 'register-input-error' : ''}`}
                    />
                  </div>
                  {errors.firstName && (
                    <span className="register-error">{errors.firstName}</span>
                  )}
                </div>

                <div className="register-form-group">
                  <label className="register-label">Last Name *</label>
                  <div className="register-input-wrapper">
                    <User className="register-input-icon" />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter your last name"
                      className={`register-input ${errors.lastName ? 'register-input-error' : ''}`}
                    />
                  </div>
                  {errors.lastName && (
                    <span className="register-error">{errors.lastName}</span>
                  )}
                </div>

                <div className="register-form-group">
                  <label className="register-label">Email Address *</label>
                  <div className="register-input-wrapper">
                    <Mail className="register-input-icon" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      className={`register-input ${errors.email ? 'register-input-error' : ''}`}
                    />
                  </div>
                  {errors.email && (
                    <span className="register-error">{errors.email}</span>
                  )}
                </div>

                <div className="register-form-group">
                  <label className="register-label">Phone Number *</label>
                  <div className="register-input-wrapper">
                    <Phone className="register-input-icon" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g., +237 6XX XXX XXX"
                      className={`register-input ${errors.phone ? 'register-input-error' : ''}`}
                    />
                  </div>
                  {errors.phone && (
                    <span className="register-error">{errors.phone}</span>
                  )}
                </div>

                <div className="register-form-group">
                  <label className="register-label">Password *</label>
                  <div className="register-input-wrapper">
                    <Lock className="register-input-icon" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Min. 8 characters"
                      className={`register-input ${errors.password ? 'register-input-error' : ''}`}
                    />
                    <button
                      type="button"
                      className="register-password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="register-password-icon" /> : <Eye className="register-password-icon" />}
                    </button>
                  </div>
                  {errors.password && (
                    <span className="register-error">{errors.password}</span>
                  )}
                </div>

                <div className="register-form-group">
                  <label className="register-label">Confirm Password *</label>
                  <div className="register-input-wrapper">
                    <Lock className="register-input-icon" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      className={`register-input ${errors.confirmPassword ? 'register-input-error' : ''}`}
                    />
                    <button
                      type="button"
                      className="register-password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="register-password-icon" /> : <Eye className="register-password-icon" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <span className="register-error">{errors.confirmPassword}</span>
                  )}
                </div>
              </div>

              <div className="register-navigation">
                <button type="button" className="register-next-btn" onClick={handleNext}>
                  Next Step →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Business Info & ID Upload */}
          {step === 2 && (
            <div className="register-step-content">
              <h2 className="register-step-title">Business & ID Verification</h2>
              <p className="register-step-subtitle">Tell us about your company and upload your ID for verification</p>

              {/* ID Card Upload */}
              <div className="register-upload-section">
                <label className="register-label">ID Card / Passport *</label>
                <div className="register-upload-container">
                  <div className="register-upload-id">
                    {idCardImage ? (
                      <div className="register-upload-preview">
                        <img src={idCardImage} alt="ID Card" className="register-upload-img" />
                        <button 
                          type="button"
                          className="register-upload-remove"
                          onClick={removeIdCard}
                        >
                          <X className="register-upload-remove-icon" />
                        </button>
                      </div>
                    ) : (
                      <div 
                        className="register-upload-placeholder-id"
                        onClick={() => idCardInputRef.current?.click()}
                      >
                        <FileText className="register-upload-placeholder-icon" />
                        <span>Upload ID Card</span>
                        <small>National ID, Passport, or Driver's License</small>
                      </div>
                    )}
                  </div>
                  <input
                    ref={idCardInputRef}
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleIdCardUpload}
                    className="register-upload-input"
                  />
                  <div className="register-id-type">
                    <label className="register-id-type-label">ID Type</label>
                    <select 
                      value={idCardType}
                      onChange={(e) => setIdCardType(e.target.value)}
                      className="register-id-type-select"
                    >
                      <option value="national_id">National ID Card</option>
                      <option value="passport">Passport</option>
                      <option value="drivers_license">Driver's License</option>
                      <option value="voter_card">Voter's Card</option>
                    </select>
                  </div>
                  <p className="register-upload-hint">Upload a clear photo of your ID (JPG, PNG, PDF, max 10MB)</p>
                  {errors.idCard && (
                    <span className="register-error">{errors.idCard}</span>
                  )}
                </div>
              </div>

              <div className="register-form-grid">
                <div className="register-form-group register-form-full">
                  <label className="register-label">Company/Organization Name *</label>
                  <div className="register-input-wrapper">
                    <Building2 className="register-input-icon" />
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="Enter your company name"
                      className={`register-input ${errors.companyName ? 'register-input-error' : ''}`}
                    />
                  </div>
                  {errors.companyName && (
                    <span className="register-error">{errors.companyName}</span>
                  )}
                </div>

                <div className="register-form-group">
                  <label className="register-label">Company Type *</label>
                  <div className="register-select-wrapper">
                    <Store className="register-select-icon" />
                    <select
                      name="companyType"
                      value={formData.companyType}
                      onChange={handleChange}
                      className={`register-select ${errors.companyType ? 'register-input-error' : ''}`}
                    >
                      <option value="">Select type</option>
                      {companyTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  {errors.companyType && (
                    <span className="register-error">{errors.companyType}</span>
                  )}
                </div>

                <div className="register-form-group">
                  <label className="register-label">Registration Number</label>
                  <div className="register-input-wrapper">
                    <Shield className="register-input-icon" />
                    <input
                      type="text"
                      name="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={handleChange}
                      placeholder="e.g., RC 2024/001"
                      className="register-input"
                    />
                  </div>
                </div>

                <div className="register-form-group">
                  <label className="register-label">Tax ID</label>
                  <div className="register-input-wrapper">
                    <Globe className="register-input-icon" />
                    <input
                      type="text"
                      name="taxId"
                      value={formData.taxId}
                      onChange={handleChange}
                      placeholder="e.g., TAX-2024-001"
                      className="register-input"
                    />
                  </div>
                </div>

                <div className="register-form-group">
                  <label className="register-label">Years in Business</label>
                  <div className="register-select-wrapper">
                    <Package className="register-select-icon" />
                    <select
                      name="yearsInBusiness"
                      value={formData.yearsInBusiness}
                      onChange={handleChange}
                      className="register-select"
                    >
                      <option value="">Select years</option>
                      <option value="0-1">Less than 1 year</option>
                      <option value="1-3">1-3 years</option>
                      <option value="3-5">3-5 years</option>
                      <option value="5-10">5-10 years</option>
                      <option value="10+">10+ years</option>
                    </select>
                  </div>
                </div>

                <div className="register-form-group">
                  <label className="register-label">Number of Employees</label>
                  <div className="register-select-wrapper">
                    <User className="register-select-icon" />
                    <select
                      name="employeeCount"
                      value={formData.employeeCount}
                      onChange={handleChange}
                      className="register-select"
                    >
                      <option value="">Select employees</option>
                      <option value="1-5">1-5</option>
                      <option value="6-10">6-10</option>
                      <option value="11-50">11-50</option>
                      <option value="51-200">51-200</option>
                      <option value="200+">200+</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="register-navigation">
                <button type="button" className="register-back-btn-form" onClick={handleBack}>
                  ← Back
                </button>
                <button type="button" className="register-next-btn" onClick={handleNext}>
                  Next Step →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Location & Preferences */}
          {step === 3 && (
            <div className="register-step-content">
              <h2 className="register-step-title">Location & Preferences</h2>
              <p className="register-step-subtitle">Help us connect you with the right farmers</p>

              <div className="register-form-grid">
                <div className="register-form-group">
                  <label className="register-label">Country</label>
                  <div className="register-input-wrapper">
                    <Globe className="register-input-icon" />
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="register-input"
                      disabled
                    />
                  </div>
                </div>

                <div className="register-form-group">
                  <label className="register-label">Region *</label>
                  <div className="register-select-wrapper">
                    <MapPin className="register-select-icon" />
                    <select
                      name="region"
                      value={formData.region}
                      onChange={handleChange}
                      className={`register-select ${errors.region ? 'register-input-error' : ''}`}
                    >
                      <option value="">Select region</option>
                      {regions.map(region => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                  </div>
                  {errors.region && (
                    <span className="register-error">{errors.region}</span>
                  )}
                </div>

                <div className="register-form-group">
                  <label className="register-label">City *</label>
                  <div className="register-input-wrapper">
                    <MapPin className="register-input-icon" />
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Enter your city"
                      className={`register-input ${errors.city ? 'register-input-error' : ''}`}
                    />
                  </div>
                  {errors.city && (
                    <span className="register-error">{errors.city}</span>
                  )}
                </div>

                <div className="register-form-group register-form-full">
                  <label className="register-label">Address *</label>
                  <div className="register-input-wrapper">
                    <MapPin className="register-input-icon" />
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter your full address"
                      className={`register-textarea ${errors.address ? 'register-input-error' : ''}`}
                      rows={2}
                    />
                  </div>
                  {errors.address && (
                    <span className="register-error">{errors.address}</span>
                  )}
                </div>

                <div className="register-form-group register-form-full">
                  <label className="register-label">Preferred Products *</label>
                  <p className="register-hint">Select all that apply</p>
                  <div className="register-products-grid">
                    {productCategories.map(product => (
                      <button
                        key={product}
                        type="button"
                        className={`register-product-chip ${formData.preferredProducts.includes(product) ? 'register-product-chip-selected' : ''}`}
                        onClick={() => handleProductToggle(product)}
                      >
                        {formData.preferredProducts.includes(product) && <CheckCircle className="register-product-chip-icon" />}
                        {product}
                      </button>
                    ))}
                  </div>
                  {errors.preferredProducts && (
                    <span className="register-error">{errors.preferredProducts}</span>
                  )}
                </div>

                <div className="register-form-group">
                  <label className="register-label">Purchase Frequency</label>
                  <div className="register-select-wrapper">
                    <Truck className="register-select-icon" />
                    <select
                      name="purchaseFrequency"
                      value={formData.purchaseFrequency}
                      onChange={handleChange}
                      className="register-select"
                    >
                      <option value="">Select frequency</option>
                      {purchaseFrequencyOptions.map(freq => (
                        <option key={freq} value={freq}>{freq}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="register-form-group">
                  <label className="register-label">Budget Range (per month)</label>
                  <div className="register-select-wrapper">
                    <Package className="register-select-icon" />
                    <select
                      name="budgetRange"
                      value={formData.budgetRange}
                      onChange={handleChange}
                      className="register-select"
                    >
                      <option value="">Select budget</option>
                      {budgetRanges.map(range => (
                        <option key={range} value={range}>{range}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="register-navigation">
                <button type="button" className="register-back-btn-form" onClick={handleBack}>
                  ← Back
                </button>
                <button type="button" className="register-next-btn" onClick={handleNext}>
                  Review & Complete →
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Review & Complete */}
          {step === 4 && (
            <div className="register-step-content">
              <h2 className="register-step-title">Review & Complete</h2>
              <p className="register-step-subtitle">Please review your information before submitting</p>

              <div className="register-review">
                <div className="register-review-section">
                  <h3>Personal Information</h3>
                  <div className="register-review-grid">
                    <div><strong>Name:</strong> {formData.firstName} {formData.lastName}</div>
                    <div><strong>Email:</strong> {formData.email}</div>
                    <div><strong>Phone:</strong> {formData.phone}</div>
                    <div><strong>Profile Photo:</strong> {profileImage ? '✅ Uploaded' : '❌ Not uploaded'}</div>
                  </div>
                </div>

                <div className="register-review-section">
                  <h3>Business & ID</h3>
                  <div className="register-review-grid">
                    <div><strong>Company:</strong> {formData.companyName || "N/A"}</div>
                    <div><strong>Type:</strong> {formData.companyType || "N/A"}</div>
                    <div><strong>Registration:</strong> {formData.registrationNumber || "N/A"}</div>
                    <div><strong>Years in Business:</strong> {formData.yearsInBusiness || "N/A"}</div>
                    <div><strong>ID Card:</strong> {idCardImage ? '✅ Uploaded' : '❌ Not uploaded'}</div>
                    <div><strong>ID Type:</strong> {idCardType.replace('_', ' ').toUpperCase()}</div>
                  </div>
                </div>

                <div className="register-review-section">
                  <h3>Location & Preferences</h3>
                  <div className="register-review-grid">
                    <div><strong>Region:</strong> {formData.region}</div>
                    <div><strong>City:</strong> {formData.city}</div>
                    <div><strong>Address:</strong> {formData.address}</div>
                    <div><strong>Products:</strong> {formData.preferredProducts.join(", ")}</div>
                    {formData.purchaseFrequency && <div><strong>Frequency:</strong> {formData.purchaseFrequency}</div>}
                    {formData.budgetRange && <div><strong>Budget:</strong> {formData.budgetRange}</div>}
                  </div>
                </div>
              </div>

              <div className="register-terms">
                <label className="register-terms-label">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                  />
                  <span>
                    I agree to the <button type="button" className="register-terms-link" onClick={() => setShowTermsModal(true)}>Terms & Conditions</button> and 
                    <a href="/privacy" target="_blank"> Privacy Policy</a> *
                  </span>
                </label>
                {errors.agreeTerms && (
                  <span className="register-error">{errors.agreeTerms}</span>
                )}

                <label className="register-terms-label">
                  <input
                    type="checkbox"
                    name="agreeMarketing"
                    checked={formData.agreeMarketing}
                    onChange={handleChange}
                  />
                  <span>
                    I would like to receive updates about new products and offers
                  </span>
                </label>
              </div>

              {errors.submit && (
                <div className="register-error-box">
                  <AlertCircle className="register-error-icon" />
                  {errors.submit}
                </div>
              )}

              <div className="register-navigation">
                <button type="button" className="register-back-btn-form" onClick={handleBack}>
                  ← Back
                </button>
                <button
                  type="submit"
                  className="register-submit-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="register-submit-spinner" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="register-submit-icon" />
                      Complete Registration
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Terms Modal */}
        {showTermsModal && (
          <div className="register-terms-modal-overlay" onClick={() => setShowTermsModal(false)}>
            <div className="register-terms-modal" onClick={(e) => e.stopPropagation()}>
              <button className="register-terms-modal-close" onClick={() => setShowTermsModal(false)}>
                <X className="w-5 h-5" />
              </button>
              <h2>Terms & Conditions</h2>
              <div className="register-terms-modal-content">
                <h3>1. Acceptance of Terms</h3>
                <p>By registering as a buyer on AGRINOVA, you agree to these terms and conditions.</p>
                
                <h3>2. Buyer Responsibilities</h3>
                <p>You agree to provide accurate information, respect farmers' pricing, and complete transactions in good faith.</p>
                
                <h3>3. Product Quality</h3>
                <p>While we verify farmers, we recommend inspecting products upon delivery and reporting any issues within 24 hours.</p>
                
                <h3>4. Payment Terms</h3>
                <p>Payments are processed securely through our platform. Refunds are handled per our refund policy.</p>
                
                <h3>5. Data Protection</h3>
                <p>Your personal data is protected under our privacy policy and Cameroon's data protection laws.</p>
                
                <h3>6. Account Security</h3>
                <p>You are responsible for maintaining the security of your account and password.</p>
                
                <h3>7. Termination</h3>
                <p>AGRINOVA reserves the right to terminate accounts that violate these terms.</p>
              </div>
              <button className="register-terms-modal-btn" onClick={() => setShowTermsModal(false)}>
                I Understand
              </button>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {success && (
          <div className="register-success-overlay">
            <div className="register-success-modal">
              <CheckCircle className="register-success-icon" />
              <h2>Registration Complete! 🎉</h2>
              <p>Your buyer account has been created successfully.</p>
              <p className="register-success-sub">Redirecting to your dashboard...</p>
              <div className="register-success-spinner"></div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .register-buyer-page {
          min-height: 100vh;
          background: #f0fdf4;
          padding: 2rem 1rem;
        }

        .register-buyer-container {
          max-width: 800px;
          margin: 0 auto;
        }

        /* Header */
        .register-header {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .register-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: #6b7280;
          text-decoration: none;
          font-size: 0.875rem;
          transition: color 0.2s;
          width: fit-content;
        }

        .register-back-btn:hover {
          color: #1f2937;
        }

        .register-back-icon {
          width: 1.25rem;
          height: 1.25rem;
        }

        .register-header-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .register-header-icon {
          width: 2.5rem;
          height: 2.5rem;
          color: #059669;
          background: #ecfdf5;
          padding: 0.5rem;
          border-radius: 0.75rem;
        }

        .register-header-content h1 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #064e3b;
        }

        .register-header-content p {
          color: #6b7280;
          font-size: 0.875rem;
        }

        /* Steps */
        .register-steps {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: white;
          border-radius: 1rem;
          border: 1px solid #e5e7eb;
        }

        .register-step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          position: relative;
          flex: 1;
        }

        .register-step-circle {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.875rem;
          background: #f3f4f6;
          color: #6b7280;
          transition: all 0.3s;
        }

        .register-step-active {
          background: #059669;
          color: white;
          box-shadow: 0 0 0 4px rgba(5,150,105,0.2);
        }

        .register-step-completed {
          background: #d1fae5;
          color: #059669;
        }

        .register-step-icon {
          width: 1.25rem;
          height: 1.25rem;
        }

        .register-step-label {
          font-size: 0.625rem;
          color: #6b7280;
          text-align: center;
        }

        .register-step-line {
          position: absolute;
          top: 1.25rem;
          left: calc(50% + 1.5rem);
          width: calc(100% - 3rem);
          height: 2px;
          background: #e5e7eb;
          transition: background 0.3s;
        }

        .register-step-line-completed {
          background: #059669;
        }

        @media (max-width: 640px) {
          .register-steps {
            padding: 1rem;
            overflow-x: auto;
          }
          .register-step-item {
            min-width: 3.5rem;
          }
          .register-step-label {
            font-size: 0.5rem;
          }
          .register-step-circle {
            width: 2rem;
            height: 2rem;
            font-size: 0.75rem;
          }
          .register-step-line {
            top: 1rem;
          }
        }

        /* Form */
        .register-form {
          background: white;
          border-radius: 1.5rem;
          padding: 2rem;
          border: 1px solid #e5e7eb;
        }

        .register-step-content {
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .register-step-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #064e3b;
          margin-bottom: 0.25rem;
        }

        .register-step-subtitle {
          color: #6b7280;
          font-size: 0.875rem;
          margin-bottom: 1.5rem;
        }

        /* Upload Section */
        .register-upload-section {
          margin-bottom: 1.5rem;
        }

        .register-upload-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .register-upload-avatar {
          width: 6rem;
          height: 6rem;
          border-radius: 50%;
          overflow: hidden;
          border: 3px dashed #d1d5db;
          position: relative;
        }

        .register-upload-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #f9fafb;
          cursor: pointer;
          transition: background 0.2s;
          color: #6b7280;
          font-size: 0.625rem;
          gap: 0.25rem;
        }

        .register-upload-placeholder:hover {
          background: #f3f4f6;
        }

        .register-upload-placeholder-icon {
          width: 1.5rem;
          height: 1.5rem;
        }

        .register-upload-preview {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .register-upload-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .register-upload-remove {
          position: absolute;
          top: 0.25rem;
          right: 0.25rem;
          background: rgba(239,68,68,0.9);
          border: none;
          border-radius: 50%;
          width: 1.5rem;
          height: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
        }

        .register-upload-remove:hover {
          background: #dc2626;
        }

        .register-upload-remove-icon {
          width: 0.875rem;
          height: 0.875rem;
          color: white;
        }

        .register-upload-id {
          width: 12rem;
          height: 8rem;
          border-radius: 0.5rem;
          overflow: hidden;
          border: 2px dashed #d1d5db;
          position: relative;
        }

        .register-upload-placeholder-id {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #f9fafb;
          cursor: pointer;
          transition: background 0.2s;
          color: #6b7280;
          gap: 0.25rem;
          padding: 0.5rem;
          text-align: center;
        }

        .register-upload-placeholder-id:hover {
          background: #f3f4f6;
        }

        .register-upload-placeholder-id small {
          font-size: 0.5rem;
          color: #9ca3af;
        }

        .register-upload-input {
          display: none;
        }

        .register-upload-hint {
          font-size: 0.75rem;
          color: #6b7280;
          margin: 0;
        }

        .register-id-type {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .register-id-type-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #1f2937;
        }

        .register-id-type-select {
          padding: 0.375rem 0.75rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          background: white;
          outline: none;
        }

        .register-id-type-select:focus {
          border-color: #059669;
        }

        .register-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .register-form-full {
          grid-column: 1 / -1;
        }

        .register-form-group {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .register-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #1f2937;
        }

        .register-hint {
          font-size: 0.75rem;
          color: #6b7280;
          margin: 0;
        }

        .register-input-wrapper {
          position: relative;
        }

        .register-input-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          width: 1.25rem;
          height: 1.25rem;
          color: #9ca3af;
        }

        .register-input {
          width: 100%;
          padding: 0.625rem 0.75rem 0.625rem 2.5rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          transition: border-color 0.2s;
          outline: none;
          background: white;
        }

        .register-input:focus {
          border-color: #059669;
          box-shadow: 0 0 0 3px rgba(5,150,105,0.1);
        }

        .register-input-error {
          border-color: #ef4444;
        }

        .register-input-error:focus {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239,68,68,0.1);
        }

        .register-select-wrapper {
          position: relative;
        }

        .register-select-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          width: 1.25rem;
          height: 1.25rem;
          color: #9ca3af;
        }

        .register-select {
          width: 100%;
          padding: 0.625rem 0.75rem 0.625rem 2.5rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          background: white;
          outline: none;
          appearance: none;
          transition: border-color 0.2s;
        }

        .register-select:focus {
          border-color: #059669;
          box-shadow: 0 0 0 3px rgba(5,150,105,0.1);
        }

        .register-textarea {
          width: 100%;
          padding: 0.625rem 0.75rem 0.625rem 2.5rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          outline: none;
          resize: vertical;
          font-family: inherit;
          transition: border-color 0.2s;
        }

        .register-textarea:focus {
          border-color: #059669;
          box-shadow: 0 0 0 3px rgba(5,150,105,0.1);
        }

        .register-password-toggle {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #9ca3af;
          padding: 0;
        }

        .register-password-icon {
          width: 1.25rem;
          height: 1.25rem;
        }

        .register-error {
          font-size: 0.75rem;
          color: #ef4444;
        }

        /* Products Grid */
        .register-products-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .register-product-chip {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.375rem 0.75rem;
          border: 1px solid #e5e7eb;
          border-radius: 9999px;
          font-size: 0.75rem;
          color: #6b7280;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
        }

        .register-product-chip:hover {
          border-color: #10b981;
          background: #f0fdf4;
        }

        .register-product-chip-selected {
          border-color: #059669;
          background: #ecfdf5;
          color: #059669;
        }

        .register-product-chip-icon {
          width: 0.875rem;
          height: 0.875rem;
        }

        /* Navigation */
        .register-navigation {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid #f3f4f6;
        }

        .register-next-btn {
          padding: 0.625rem 2rem;
          background: #059669;
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
          margin-left: auto;
        }

        .register-next-btn:hover {
          background: #047857;
        }

        .register-back-btn-form {
          padding: 0.625rem 2rem;
          background: transparent;
          color: #6b7280;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .register-back-btn-form:hover {
          background: #f9fafb;
          border-color: #d1d5db;
        }

        /* Review */
        .register-review {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .register-review-section {
          background: #f9fafb;
          border-radius: 0.75rem;
          padding: 1rem;
        }

        .register-review-section h3 {
          font-size: 0.875rem;
          font-weight: 600;
          color: #064e3b;
          margin-bottom: 0.5rem;
        }

        .register-review-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.25rem 1rem;
          font-size: 0.875rem;
          color: #1f2937;
        }

        .register-review-grid strong {
          color: #6b7280;
          font-weight: 500;
        }

        /* Terms */
        .register-terms {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .register-terms-label {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #1f2937;
          cursor: pointer;
        }

        .register-terms-label input[type="checkbox"] {
          margin-top: 0.125rem;
          width: 1rem;
          height: 1rem;
          cursor: pointer;
          accent-color: #059669;
          flex-shrink: 0;
        }

        .register-terms-link {
          background: none;
          border: none;
          color: #059669;
          font-weight: 500;
          cursor: pointer;
          text-decoration: underline;
          padding: 0;
        }

        .register-terms-link:hover {
          color: #047857;
        }

        .register-error-box {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background: #fef2f2;
          border-radius: 0.5rem;
          color: #dc2626;
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }

        .register-error-icon {
          width: 1.25rem;
          height: 1.25rem;
          flex-shrink: 0;
        }

        /* Submit */
        .register-submit-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 2rem;
          background: #059669;
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .register-submit-btn:hover:not(:disabled) {
          background: #047857;
        }

        .register-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .register-submit-spinner {
          width: 1.25rem;
          height: 1.25rem;
          animation: spin 0.8s linear infinite;
        }

        .register-submit-icon {
          width: 1.25rem;
          height: 1.25rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Terms Modal */
        .register-terms-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .register-terms-modal {
          background: white;
          border-radius: 1.5rem;
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          padding: 2rem;
          position: relative;
        }

        .register-terms-modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          cursor: pointer;
          color: #6b7280;
          padding: 0.25rem;
          border-radius: 0.375rem;
          transition: background 0.2s;
        }

        .register-terms-modal-close:hover {
          background: #f3f4f6;
        }

        .register-terms-modal h2 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #064e3b;
          margin-bottom: 1rem;
        }

        .register-terms-modal-content {
          margin-bottom: 1.5rem;
        }

        .register-terms-modal-content h3 {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1f2937;
          margin-top: 1rem;
          margin-bottom: 0.25rem;
        }

        .register-terms-modal-content p {
          font-size: 0.875rem;
          color: #6b7280;
          line-height: 1.6;
          margin: 0;
        }

        .register-terms-modal-btn {
          width: 100%;
          padding: 0.75rem;
          background: #059669;
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .register-terms-modal-btn:hover {
          background: #047857;
        }

        /* Success Modal */
        .register-success-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .register-success-modal {
          background: white;
          border-radius: 1.5rem;
          padding: 2.5rem;
          text-align: center;
          max-width: 400px;
          width: 100%;
        }

        .register-success-icon {
          width: 4rem;
          height: 4rem;
          color: #059669;
          margin: 0 auto 1rem;
        }

        .register-success-modal h2 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #064e3b;
          margin-bottom: 0.5rem;
        }

        .register-success-modal p {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .register-success-sub {
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .register-success-spinner {
          width: 2rem;
          height: 2rem;
          border: 3px solid #d1fae5;
          border-top-color: #059669;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 1rem auto 0;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .register-form-grid {
            grid-template-columns: 1fr;
          }

          .register-review-grid {
            grid-template-columns: 1fr;
          }

          .register-navigation {
            flex-direction: column;
          }

          .register-navigation button {
            width: 100%;
            justify-content: center;
          }

          .register-form {
            padding: 1.5rem;
          }

          .register-upload-id {
            width: 100%;
            height: 10rem;
          }

          .register-terms-modal {
            padding: 1.5rem;
            margin: 1rem;
          }
        }

        @media (max-width: 480px) {
          .register-buyer-page {
            padding: 1rem 0.5rem;
          }

          .register-form {
            padding: 1rem;
          }

          .register-header-content {
            flex-direction: column;
            text-align: center;
          }

          .register-products-grid {
            gap: 0.25rem;
          }

          .register-product-chip {
            font-size: 0.65rem;
            padding: 0.25rem 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}
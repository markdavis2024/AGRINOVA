"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Bell,
  Lock,
  Globe,
  Moon,
  Sun,
  Save,
  Shield,
  Smartphone,
  Mail,
  Phone,
  MapPin,
  Camera,
  Sprout,
  Droplets,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Edit2,
  Check,
  Users,
  ShoppingBag,
  Award,
  Calendar,
} from "lucide-react";
import { useSession } from "@/lib/useSession";

export default function SettingsPage() {
  const router = useRouter();
  const { user, loading } = useSession();
  const [activeTab, setActiveTab] = useState("profile");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: "",
    region: "",
    bio: "",
    farmSize: "",
  });
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: false,
  });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "preferences", label: "Preferences", icon: Globe },
  ];

  const stats = [
    { icon: Users, label: "Total Farms", value: "3", change: "+1 this month" },
    { icon: Sprout, label: "Active Crops", value: "12", change: "+3 new" },
    { icon: ShoppingBag, label: "Products Sold", value: "47", change: "+15% growth" },
    { icon: Award, label: "Rating", value: "4.8", change: "Excellent" },
  ];

  const activities = [
    { icon: Calendar, text: "Added new crop: Maize", time: "2 hours ago" },
    { icon: ShoppingBag, text: "Sold 50kg of Cassava", time: "5 hours ago" },
    { icon: Users, text: "New consultation booked", time: "1 day ago" },
    { icon: Sprout, text: "Updated farm profile", time: "2 days ago" },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1500);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  if (loading || !user) {
    return (
      <div className="settings-loading">
        <div className="settings-loading-spinner"></div>
        <span>Loading your profile...</span>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <div className="settings-container">
        {/* Header */}
        <div className="settings-header">
          <Link href="/farmer" className="settings-back-btn">
            <ArrowLeft className="settings-icon" />
          </Link>
          <div>
            <h1 className="settings-title">Settings</h1>
            <p className="settings-subtitle">Manage your account and preferences</p>
          </div>
        </div>

        <div className="settings-grid">
          {/* Left Column */}
          <div className="settings-left">
            {/* Profile Card */}
            <div className="settings-profile-card">
              <div className="settings-profile-header">
                <div className="settings-profile-avatar-container">
                  <div className="settings-profile-avatar">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="settings-profile-img" />
                    ) : (
                      <span className="settings-profile-initial">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </span>
                    )}
                  </div>
                  <button 
                    className="settings-avatar-edit-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="settings-avatar-edit-icon" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="settings-file-input"
                  />
                </div>
                <div className="settings-profile-info">
                  <div className="settings-profile-name-row">
                    <h2 className="settings-profile-name">{user.name}</h2>
                    <button 
                      className="settings-edit-btn"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Edit2 className="settings-edit-icon" />
                    </button>
                  </div>
                  <p className="settings-profile-email">{user.email}</p>
                  <div className="settings-profile-badge">
                    <span className="settings-badge-dot"></span>
                    <span>Verified Farmer</span>
                  </div>
                  <div className="settings-profile-region">
                    <MapPin className="settings-region-icon" />
                    <span>Centre Region, Cameroon</span>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="settings-edit-form">
                  <div className="settings-edit-grid">
                    <div className="settings-edit-group">
                      <label className="settings-edit-label">Full Name</label>
                      <input
                        type="text"
                        value={formData.name || user.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="settings-edit-input"
                      />
                    </div>
                    <div className="settings-edit-group">
                      <label className="settings-edit-label">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+237 6XX XXX XXX"
                        className="settings-edit-input"
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                    <div className="settings-edit-group">
                      <label className="settings-edit-label">Region</label>
                      <select className="settings-edit-select">
                        <option value="centre">Centre Region</option>
                        <option value="north">North Region</option>
                        <option value="west">West Region</option>
                        <option value="south">South Region</option>
                        <option value="east">East Region</option>
                        <option value="littoral">Littoral</option>
                        <option value="adamawa">Adamawa</option>
                        <option value="far-north">Far North</option>
                        <option value="northwest">Northwest</option>
                        <option value="southwest">Southwest</option>
                      </select>
                    </div>
                    <div className="settings-edit-group">
                      <label className="settings-edit-label">Farm Size (hectares)</label>
                      <input
                        type="number"
                        placeholder="Enter farm size"
                        className="settings-edit-input"
                        onChange={(e) => setFormData({...formData, farmSize: e.target.value})}
                      />
                    </div>
                    <div className="settings-edit-group settings-edit-full">
                      <label className="settings-edit-label">Bio</label>
                      <textarea
                        rows={3}
                        placeholder="Tell us about your farming journey..."
                        className="settings-edit-textarea"
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="settings-edit-actions">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="settings-edit-cancel"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="settings-edit-save"
                    >
                      {saving ? (
                        <div className="settings-spinner-white"></div>
                      ) : (
                        <Check className="settings-save-icon" />
                      )}
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                  {saveSuccess && (
                    <div className="settings-save-success">
                      <Check className="settings-success-icon" />
                      Changes saved successfully!
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Stats Cards */}
            <div className="settings-stats-grid">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="settings-stat-card">
                    <div className="settings-stat-icon">
                      <Icon className="settings-stat-icon-svg" />
                    </div>
                    <div className="settings-stat-info">
                      <span className="settings-stat-value">{stat.value}</span>
                      <span className="settings-stat-label">{stat.label}</span>
                      <span className="settings-stat-change">{stat.change}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recent Activity */}
            <div className="settings-activity-card">
              <h3 className="settings-activity-title">Recent Activity</h3>
              <div className="settings-activity-list">
                {activities.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div key={index} className="settings-activity-item">
                      <div className="settings-activity-icon">
                        <Icon className="settings-activity-icon-svg" />
                      </div>
                      <div className="settings-activity-content">
                        <span className="settings-activity-text">{activity.text}</span>
                        <span className="settings-activity-time">{activity.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="settings-right">
            <div className="settings-tabs-container">
              <div className="settings-tabs">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`settings-tab-btn ${
                        activeTab === tab.id ? "settings-tab-btn-active" : ""
                      }`}
                    >
                      <Icon className="settings-tab-icon" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="settings-tab-content">
                {/* Profile Tab */}
                {activeTab === "profile" && (
                  <div className="settings-tab-panel">
                    <h3 className="settings-panel-title">Profile Information</h3>
                    
                    <div className="settings-info-grid">
                      <div className="settings-info-item">
                        <label className="settings-info-label">Full Name</label>
                        <p className="settings-info-value">{user.name}</p>
                      </div>
                      <div className="settings-info-item">
                        <label className="settings-info-label">Email</label>
                        <p className="settings-info-value">{user.email}</p>
                      </div>
                      <div className="settings-info-item">
                        <label className="settings-info-label">Phone</label>
                        <p className="settings-info-value text-gray-400">Not set</p>
                      </div>
                      <div className="settings-info-item">
                        <label className="settings-info-label">Region</label>
                        <p className="settings-info-value text-gray-400">Not set</p>
                      </div>
                      <div className="settings-info-item settings-info-full">
                        <label className="settings-info-label">Bio</label>
                        <p className="settings-info-value text-gray-400">Add your farming story...</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === "security" && (
                  <div className="settings-tab-panel">
                    <h3 className="settings-panel-title">Security Settings</h3>
                    
                    <div className="settings-security-options">
                      <div className="settings-security-option">
                        <div className="settings-security-option-left">
                          <Shield className="settings-security-option-icon" />
                          <div>
                            <div className="settings-security-option-title">Two-Factor Authentication</div>
                            <div className="settings-security-option-desc">Add an extra layer of security</div>
                          </div>
                        </div>
                        <button className="settings-security-option-btn settings-security-option-btn-green">
                          Enable
                        </button>
                      </div>

                      <div className="settings-security-option">
                        <div className="settings-security-option-left">
                          <Lock className="settings-security-option-icon" />
                          <div>
                            <div className="settings-security-option-title">Change Password</div>
                            <div className="settings-security-option-desc">Update your password regularly</div>
                          </div>
                        </div>
                        <button className="settings-security-option-btn settings-security-option-btn-gray">
                          Change
                        </button>
                      </div>

                      <div className="settings-security-option">
                        <div className="settings-security-option-left">
                          <Smartphone className="settings-security-option-icon" />
                          <div>
                            <div className="settings-security-option-title">Trusted Devices</div>
                            <div className="settings-security-option-desc">Manage devices with access</div>
                          </div>
                        </div>
                        <span className="settings-security-devices">3 devices</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === "notifications" && (
                  <div className="settings-tab-panel">
                    <h3 className="settings-panel-title">Notification Preferences</h3>
                    
                    <div className="settings-notification-options">
                      <div className="settings-notification-option">
                        <div className="settings-notification-option-left">
                          <Mail className="settings-notification-option-icon" />
                          <div>
                            <div className="settings-notification-option-title">Email Notifications</div>
                            <div className="settings-notification-option-desc">Receive updates via email</div>
                          </div>
                        </div>
                        <button
                          onClick={() => setNotifications({...notifications, email: !notifications.email})}
                          className={`settings-toggle ${notifications.email ? "settings-toggle-on" : ""}`}
                        >
                          <div className={`settings-toggle-dot ${notifications.email ? "settings-toggle-dot-on" : ""}`} />
                        </button>
                      </div>

                      <div className="settings-notification-option">
                        <div className="settings-notification-option-left">
                          <Bell className="settings-notification-option-icon" />
                          <div>
                            <div className="settings-notification-option-title">Push Notifications</div>
                            <div className="settings-notification-option-desc">Get real-time alerts</div>
                          </div>
                        </div>
                        <button
                          onClick={() => setNotifications({...notifications, push: !notifications.push})}
                          className={`settings-toggle ${notifications.push ? "settings-toggle-on" : ""}`}
                        >
                          <div className={`settings-toggle-dot ${notifications.push ? "settings-toggle-dot-on" : ""}`} />
                        </button>
                      </div>

                      <div className="settings-notification-option">
                        <div className="settings-notification-option-left">
                          <Phone className="settings-notification-option-icon" />
                          <div>
                            <div className="settings-notification-option-title">SMS Notifications</div>
                            <div className="settings-notification-option-desc">Receive SMS alerts</div>
                          </div>
                        </div>
                        <button
                          onClick={() => setNotifications({...notifications, sms: !notifications.sms})}
                          className={`settings-toggle ${notifications.sms ? "settings-toggle-on" : ""}`}
                        >
                          <div className={`settings-toggle-dot ${notifications.sms ? "settings-toggle-dot-on" : ""}`} />
                        </button>
                      </div>

                      <div className="settings-notification-option">
                        <div className="settings-notification-option-left">
                          <Sprout className="settings-notification-option-icon" />
                          <div>
                            <div className="settings-notification-option-title">Marketing Updates</div>
                            <div className="settings-notification-option-desc">News about new features and offers</div>
                          </div>
                        </div>
                        <button
                          onClick={() => setNotifications({...notifications, marketing: !notifications.marketing})}
                          className={`settings-toggle ${notifications.marketing ? "settings-toggle-on" : ""}`}
                        >
                          <div className={`settings-toggle-dot ${notifications.marketing ? "settings-toggle-dot-on" : ""}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Preferences Tab */}
                {activeTab === "preferences" && (
                  <div className="settings-tab-panel">
                    <h3 className="settings-panel-title">Preferences</h3>
                    
                    <div className="settings-preference-options">
                      <div className="settings-preference-option">
                        <div className="settings-preference-option-left">
                          {isDarkMode ? (
                            <Moon className="settings-preference-option-icon" />
                          ) : (
                            <Sun className="settings-preference-option-icon" />
                          )}
                          <div>
                            <div className="settings-preference-option-title">Dark Mode</div>
                            <div className="settings-preference-option-desc">Switch between light and dark theme</div>
                          </div>
                        </div>
                        <button
                          onClick={() => setIsDarkMode(!isDarkMode)}
                          className={`settings-toggle ${isDarkMode ? "settings-toggle-on" : ""}`}
                        >
                          <div className={`settings-toggle-dot ${isDarkMode ? "settings-toggle-dot-on" : ""}`} />
                        </button>
                      </div>

                      <div className="settings-preference-option">
                        <div className="settings-preference-option-left">
                          <Globe className="settings-preference-option-icon" />
                          <div>
                            <div className="settings-preference-option-title">Language</div>
                            <div className="settings-preference-option-desc">Choose your preferred language</div>
                          </div>
                        </div>
                        <select className="settings-preference-select">
                          <option value="en">English</option>
                          <option value="fr">Français</option>
                          <option value="pidgin">Pidgin English</option>
                        </select>
                      </div>

                      <div className="settings-preference-option">
                        <div className="settings-preference-option-left">
                          <Droplets className="settings-preference-option-icon" />
                          <div>
                            <div className="settings-preference-option-title">Weather Units</div>
                            <div className="settings-preference-option-desc">Temperature and measurement units</div>
                          </div>
                        </div>
                        <select className="settings-preference-select">
                          <option value="celsius">Celsius (°C)</option>
                          <option value="fahrenheit">Fahrenheit (°F)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Logout Button */}
              <div className="settings-logout-section">
                <button
                  onClick={handleLogout}
                  className="settings-logout-btn"
                >
                  <LogOut className="settings-logout-icon" />
                  Log out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .settings-page {
          min-height: 100vh;
          background: #f0fdf4;
          padding: 2rem;
        }

        .settings-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        /* Loading */
        .settings-loading {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          background: #f0fdf4;
          color: #6b7280;
        }

        .settings-loading-spinner {
          width: 1.5rem;
          height: 1.5rem;
          border: 2px solid #d1fae5;
          border-top-color: #059669;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Header */
        .settings-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .settings-back-btn {
          padding: 0.5rem;
          background: white;
          border-radius: 0.75rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .settings-back-btn:hover {
          background: #ecfdf5;
          transform: translateX(-2px);
        }

        .settings-icon {
          width: 1.25rem;
          height: 1.25rem;
          color: #6b7280;
        }

        .settings-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #064e3b;
        }

        .settings-subtitle {
          font-size: 0.875rem;
          color: #6b7280;
        }

        /* Grid */
        .settings-grid {
          display: grid;
          grid-template-columns: 380px 1fr;
          gap: 1.5rem;
        }

        /* Left Column */
        .settings-left {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        /* Profile Card */
        .settings-profile-card {
          background: white;
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
          border: 1px solid #d1fae5;
        }

        .settings-profile-header {
          display: flex;
          gap: 1.25rem;
        }

        .settings-profile-avatar-container {
          position: relative;
          flex-shrink: 0;
        }

        .settings-profile-avatar {
          width: 5rem;
          height: 5rem;
          background: linear-gradient(135deg, #059669, #10b981);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid #d1fae5;
        }

        .settings-profile-img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }

        .settings-profile-initial {
          font-size: 2rem;
          font-weight: 700;
          color: white;
        }

        .settings-avatar-edit-btn {
          position: absolute;
          bottom: -0.25rem;
          right: -0.25rem;
          padding: 0.375rem;
          background: white;
          border-radius: 50%;
          border: 2px solid #d1fae5;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .settings-avatar-edit-btn:hover {
          background: #ecfdf5;
          transform: scale(1.05);
        }

        .settings-avatar-edit-icon {
          width: 0.875rem;
          height: 0.875rem;
          color: #059669;
        }

        .settings-file-input {
          display: none;
        }

        .settings-profile-info {
          flex: 1;
          padding-top: 0.25rem;
        }

        .settings-profile-name-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .settings-profile-name {
          font-size: 1.125rem;
          font-weight: 600;
          color: #064e3b;
        }

        .settings-edit-btn {
          padding: 0.25rem;
          background: transparent;
          border: none;
          cursor: pointer;
          border-radius: 0.375rem;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .settings-edit-btn:hover {
          background: #f3f4f6;
        }

        .settings-edit-icon {
          width: 0.875rem;
          height: 0.875rem;
          color: #6b7280;
        }

        .settings-profile-email {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .settings-profile-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.75rem;
          color: #059669;
          background: #ecfdf5;
          padding: 0.25rem 0.625rem;
          border-radius: 9999px;
          margin-top: 0.5rem;
        }

        .settings-badge-dot {
          width: 0.375rem;
          height: 0.375rem;
          background: #059669;
          border-radius: 50%;
        }

        .settings-profile-region {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          margin-top: 0.5rem;
          font-size: 0.75rem;
          color: #6b7280;
        }

        .settings-region-icon {
          width: 0.875rem;
          height: 0.875rem;
        }

        /* Edit Form */
        .settings-edit-form {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #f3f4f6;
        }

        .settings-edit-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .settings-edit-full {
          grid-column: 1 / -1;
        }

        .settings-edit-group {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .settings-edit-label {
          font-size: 0.75rem;
          font-weight: 500;
          color: #374151;
        }

        .settings-edit-input {
          padding: 0.5rem 0.75rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .settings-edit-input:focus {
          border-color: #059669;
          box-shadow: 0 0 0 3px rgba(5,150,105,0.1);
        }

        .settings-edit-select {
          padding: 0.5rem 0.75rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          outline: none;
          background: white;
        }
        .settings-edit-select:focus {
          border-color: #059669;
        }

        .settings-edit-textarea {
          padding: 0.5rem 0.75rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          outline: none;
          resize: vertical;
          min-height: 4rem;
          font-family: inherit;
        }
        .settings-edit-textarea:focus {
          border-color: #059669;
        }

        .settings-edit-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-top: 0.75rem;
        }

        .settings-edit-cancel {
          padding: 0.5rem 1rem;
          background: transparent;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s;
        }
        .settings-edit-cancel:hover {
          background: #f9fafb;
        }

        .settings-edit-save {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1.25rem;
          background: #059669;
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }
        .settings-edit-save:hover:not(:disabled) {
          background: #047857;
        }
        .settings-edit-save:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .settings-spinner-white {
          width: 1rem;
          height: 1rem;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .settings-save-success {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.75rem;
          padding: 0.5rem 0.75rem;
          background: #ecfdf5;
          border-radius: 0.5rem;
          color: #059669;
          font-size: 0.875rem;
        }

        .settings-success-icon {
          width: 1rem;
          height: 1rem;
        }

        .settings-save-icon {
          width: 1rem;
          height: 1rem;
        }

        /* Stats */
        .settings-stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .settings-stat-card {
          background: white;
          border-radius: 0.75rem;
          padding: 1rem;
          border: 1px solid #d1fae5;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          transition: all 0.2s;
        }
        .settings-stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .settings-stat-icon {
          width: 2.5rem;
          height: 2.5rem;
          background: #ecfdf5;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .settings-stat-icon-svg {
          width: 1.25rem;
          height: 1.25rem;
          color: #059669;
        }

        .settings-stat-info {
          flex: 1;
        }

        .settings-stat-value {
          display: block;
          font-size: 1.125rem;
          font-weight: 700;
          color: #064e3b;
        }

        .settings-stat-label {
          display: block;
          font-size: 0.625rem;
          color: #6b7280;
        }

        .settings-stat-change {
          display: block;
          font-size: 0.625rem;
          color: #059669;
        }

        /* Activity */
        .settings-activity-card {
          background: white;
          border-radius: 1rem;
          padding: 1.25rem;
          border: 1px solid #d1fae5;
        }

        .settings-activity-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: #064e3b;
          margin-bottom: 0.75rem;
        }

        .settings-activity-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .settings-activity-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 0.75rem;
          background: #f9fafb;
          border-radius: 0.5rem;
          transition: background 0.2s;
        }
        .settings-activity-item:hover {
          background: #f3f4f6;
        }

        .settings-activity-icon {
          width: 2rem;
          height: 2rem;
          background: white;
          border-radius: 0.375rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .settings-activity-icon-svg {
          width: 0.875rem;
          height: 0.875rem;
          color: #059669;
        }

        .settings-activity-content {
          flex: 1;
        }

        .settings-activity-text {
          display: block;
          font-size: 0.75rem;
          color: #374151;
        }

        .settings-activity-time {
          display: block;
          font-size: 0.625rem;
          color: #9ca3af;
        }

        /* Right Column */
        .settings-right {
          min-width: 0;
        }

        .settings-tabs-container {
          background: white;
          border-radius: 1rem;
          border: 1px solid #d1fae5;
          overflow: hidden;
        }

        .settings-tabs {
          display: flex;
          gap: 0.25rem;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #f3f4f6;
          overflow-x: auto;
        }

        .settings-tab-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border: none;
          background: transparent;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .settings-tab-btn:hover {
          background: #f9fafb;
          color: #374151;
        }
        .settings-tab-btn-active {
          background: #ecfdf5;
          color: #059669;
        }

        .settings-tab-icon {
          width: 1rem;
          height: 1rem;
        }

        .settings-tab-content {
          padding: 1.5rem;
        }

        .settings-tab-panel {
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .settings-panel-title {
          font-size: 1rem;
          font-weight: 600;
          color: #064e3b;
          margin-bottom: 1rem;
        }

        /* Info Grid */
        .settings-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .settings-info-full {
          grid-column: 1 / -1;
        }

        .settings-info-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .settings-info-label {
          font-size: 0.75rem;
          font-weight: 500;
          color: #6b7280;
        }

        .settings-info-value {
          font-size: 0.875rem;
          color: #111827;
        }

        /* Security Options */
        .settings-security-options {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .settings-security-option {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          border: 1px solid #f3f4f6;
          border-radius: 0.75rem;
          transition: border-color 0.2s;
        }
        .settings-security-option:hover {
          border-color: #d1fae5;
        }

        .settings-security-option-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .settings-security-option-icon {
          width: 1.25rem;
          height: 1.25rem;
          color: #6b7280;
        }

        .settings-security-option-title {
          font-size: 0.875rem;
          font-weight: 500;
          color: #111827;
        }

        .settings-security-option-desc {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .settings-security-option-btn {
          padding: 0.375rem 1rem;
          border-radius: 0.5rem;
          font-size: 0.75rem;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }
        .settings-security-option-btn-green {
          background: #059669;
          color: white;
        }
        .settings-security-option-btn-green:hover {
          background: #047857;
        }
        .settings-security-option-btn-gray {
          background: #f3f4f6;
          color: #374151;
        }
        .settings-security-option-btn-gray:hover {
          background: #e5e7eb;
        }

        .settings-security-devices {
          font-size: 0.875rem;
          color: #6b7280;
        }

        /* Notification Options */
        .settings-notification-options {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .settings-notification-option {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          border: 1px solid #f3f4f6;
          border-radius: 0.75rem;
          transition: border-color 0.2s;
        }
        .settings-notification-option:hover {
          border-color: #d1fae5;
        }

        .settings-notification-option-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .settings-notification-option-icon {
          width: 1.25rem;
          height: 1.25rem;
          color: #6b7280;
        }

        .settings-notification-option-title {
          font-size: 0.875rem;
          font-weight: 500;
          color: #111827;
        }

        .settings-notification-option-desc {
          font-size: 0.75rem;
          color: #6b7280;
        }

        /* Preference Options */
        .settings-preference-options {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .settings-preference-option {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          border: 1px solid #f3f4f6;
          border-radius: 0.75rem;
          transition: border-color 0.2s;
        }
        .settings-preference-option:hover {
          border-color: #d1fae5;
        }

        .settings-preference-option-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .settings-preference-option-icon {
          width: 1.25rem;
          height: 1.25rem;
          color: #6b7280;
        }

        .settings-preference-option-title {
          font-size: 0.875rem;
          font-weight: 500;
          color: #111827;
        }

        .settings-preference-option-desc {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .settings-preference-select {
          padding: 0.375rem 0.75rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 0.75rem;
          background: white;
          outline: none;
        }
        .settings-preference-select:focus {
          border-color: #059669;
        }

        /* Toggle */
        .settings-toggle {
          width: 2.75rem;
          height: 1.5rem;
          border-radius: 9999px;
          background: #d1d5db;
          border: none;
          cursor: pointer;
          position: relative;
          transition: background 0.2s;
          flex-shrink: 0;
        }
        .settings-toggle-on {
          background: #059669;
        }

        .settings-toggle-dot {
          position: absolute;
          top: 0.125rem;
          left: 0.125rem;
          width: 1.25rem;
          height: 1.25rem;
          background: white;
          border-radius: 50%;
          transition: transform 0.2s;
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        .settings-toggle-dot-on {
          transform: translateX(1.25rem);
        }

        /* Logout */
        .settings-logout-section {
          padding: 1rem 1.5rem;
          border-top: 1px solid #f3f4f6;
        }

        .settings-logout-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: transparent;
          border: none;
          color: #dc2626;
          font-size: 0.875rem;
          cursor: pointer;
          border-radius: 0.5rem;
          transition: background 0.2s;
        }
        .settings-logout-btn:hover {
          background: #fef2f2;
        }

        .settings-logout-icon {
          width: 1rem;
          height: 1rem;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .settings-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .settings-page {
            padding: 1rem;
          }

          .settings-edit-grid {
            grid-template-columns: 1fr;
          }

          .settings-stats-grid {
            grid-template-columns: 1fr 1fr;
          }

          .settings-info-grid {
            grid-template-columns: 1fr;
          }

          .settings-tabs {
            gap: 0.125rem;
            padding: 0.5rem;
          }

          .settings-tab-btn {
            padding: 0.375rem 0.625rem;
            font-size: 0.75rem;
          }

          .settings-tab-content {
            padding: 1rem;
          }

          .settings-profile-header {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .settings-profile-name-row {
            justify-content: center;
          }

          .settings-profile-region {
            justify-content: center;
          }

          .settings-security-option,
          .settings-notification-option,
          .settings-preference-option {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }

          .settings-profile-card {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
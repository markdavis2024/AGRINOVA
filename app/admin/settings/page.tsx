"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  ChevronDown,
  FileCheck2,
  Layout,
  LayoutDashboard,
  Loader2,
  LogOut,
  Mail,
  Megaphone,
  Menu,
  Phone,
  Save,
  Search,
  Settings,
  ShieldCheck,
  Store,
  UserPlus,
  Users,
  X,
} from "lucide-react";

import Logo from "../../../components/Logo";
import { useSession } from "../../../lib/useSession";

type PlatformSettings = {
  siteName: string;
  supportEmail: string | null;
  supportPhone: string | null;
  allowRegistrations: boolean;
  requireVerification: boolean;
  maintenanceMode: boolean;
  announcement: string | null;
};

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "Users", icon: Users, href: "/admin/users" },
  { label: "Verifications", icon: FileCheck2, href: "/admin/verifications" },
  { label: "Marketplace", icon: Store },
  { label: "IoT Devices", icon: Activity },
  { label: "Reports", icon: BarChart3, href: "/admin/reports" },
  { label: "Settings", icon: Settings, href: "/admin/settings", active: true },
];

export default function AdminSettingsPage() {
  const router = useRouter();
  const { user, loading } = useSession("ADMIN");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => setSettings(data.settings ?? null))
      .catch(() => {});
  }, [user]);

  function update<K extends keyof PlatformSettings>(key: K, value: PlatformSettings[K]) {
    setSettings((s) => (s ? { ...s, [key]: value } : s));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!settings) return;

    setError("");
    setSuccess(false);
    setSaving(true);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.error ?? "Something went wrong. Please try again.");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Couldn't reach the server. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  if (loading || !user || !settings) {
    return <div className="dash-loading">Loading settings...</div>;
  }

  const initial = user.name.charAt(0).toUpperCase();
  const firstName = user.name.split(" ")[0];

  return (
    <div className="dash-page">
      {sidebarOpen && <div className="dash-overlay" onClick={() => setSidebarOpen(false)} />}

      <aside className={`dash-sidebar ${sidebarOpen ? "dash-sidebar-open" : ""}`}>
        <div className="dash-sidebar-top">
          <Link href="/" className="dash-logo"><Logo width={130} /></Link>
          <button className="dash-sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <nav className="dash-nav">
          <span className="dash-nav-label">Main</span>
          {navItems.slice(0, 4).map((item) =>
            item.href ? (
              <Link key={item.label} href={item.href} className="dash-nav-item">
                <item.icon size={16} />{item.label}
              </Link>
            ) : (
              <button key={item.label} className="dash-nav-item">
                <item.icon size={16} />{item.label}
                <span className="dash-soon">Soon</span>
              </button>
            )
          )}
          <span className="dash-nav-label">Platform</span>
          {navItems.slice(4).map((item) =>
            item.href ? (
              <Link key={item.label} href={item.href} className={`dash-nav-item ${item.active ? "dash-nav-active" : ""}`}>
                <item.icon size={16} />{item.label}
              </Link>
            ) : (
              <button key={item.label} className="dash-nav-item">
                <item.icon size={16} />{item.label}
                <span className="dash-soon">Soon</span>
              </button>
            )
          )}
        </nav>

        <div className="dash-sidebar-bottom">
          <div className="dash-admin-card">
            <div className="dash-avatar">{initial}</div>
            <div><strong>{user.name}</strong><span>Administrator</span></div>
          </div>
          <button className="dash-logout" onClick={handleLogout}>
            <LogOut size={15} />Log out
          </button>
        </div>
      </aside>

      <div className="dash-main">
        <header className="dash-topbar">
          <button className="dash-menu-btn" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <Menu size={20} />
          </button>
          <div className="dash-search">
            <Search size={16} />
            <input type="text" placeholder="Search..." disabled />
          </div>
          <div className="dash-topbar-actions">
            <button className="dash-icon-btn" aria-label="Notifications">
              <Bell size={18} /><span className="dash-dot" />
            </button>
            <div className="dash-profile">
              <button className="dash-profile-btn" onClick={() => setProfileOpen((v) => !v)}>
                <div className="dash-avatar dash-avatar-small">{initial}</div>
                <span>{firstName}</span><ChevronDown size={14} />
              </button>
              {profileOpen && (
                <div className="dash-profile-menu">
                  <Link href="/" className="dash-profile-menu-item"><Layout size={14} />Back to landing page</Link>
                  <button className="dash-profile-menu-item" onClick={handleLogout}><LogOut size={14} />Log out</button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="dash-content">
          <div className="dash-page-header">
            <div>
              <h1>Platform settings</h1>
              <p>Site-wide configuration that affects every user.</p>
            </div>
          </div>

          {settings.maintenanceMode && (
            <div className="dash-banner settings-maintenance-banner">
              <AlertTriangle size={16} />
              Maintenance mode is ON — only admins can currently sign in.
            </div>
          )}

          <form onSubmit={handleSubmit} className="settings-grid">
            <div className="auth-card settings-card">
              <div className="auth-card-header">
                <span className="mini-tag"><Settings size={12} /> GENERAL</span>
                <h2>Site information</h2>
                <p>Shown to users and used for support contact.</p>
              </div>

              <div className="auth-form">
                <label className="login-field">
                  <span>Site name</span>
                  <div className="login-input">
                    <ShieldCheck size={16} />
                    <input type="text" value={settings.siteName} onChange={(e) => update("siteName", e.target.value)} />
                  </div>
                </label>

                <label className="login-field">
                  <span>Support email</span>
                  <div className="login-input">
                    <Mail size={16} />
                    <input type="email" value={settings.supportEmail ?? ""} onChange={(e) => update("supportEmail", e.target.value)} placeholder="support@agrinova.com" />
                  </div>
                </label>

                <label className="login-field">
                  <span>Support phone</span>
                  <div className="login-input">
                    <Phone size={16} />
                    <input type="tel" value={settings.supportPhone ?? ""} onChange={(e) => update("supportPhone", e.target.value)} placeholder="+237 6XX XXX XXX" />
                  </div>
                </label>

                <label className="login-field">
                  <span>Login page announcement (optional)</span>
                  <div className="login-input">
                    <Megaphone size={16} />
                    <input type="text" value={settings.announcement ?? ""} onChange={(e) => update("announcement", e.target.value)} placeholder="e.g. Scheduled maintenance this Saturday" />
                  </div>
                </label>
              </div>
            </div>

            <div className="auth-card settings-card">
              <div className="auth-card-header">
                <span className="mini-tag"><UserPlus size={12} /> ACCESS CONTROL</span>
                <h2>Platform controls</h2>
                <p>These take effect immediately for everyone.</p>
              </div>

              <div className="auth-form">
                <div className="auth-toggle-row">
                  <div className="auth-toggle-text">
                    <UserPlus size={16} />
                    <div>
                      <strong>Allow new registrations</strong>
                      <span>Turn off to temporarily stop new sign-ups</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={`auth-switch ${settings.allowRegistrations ? "auth-switch-on" : ""}`}
                    onClick={() => update("allowRegistrations", !settings.allowRegistrations)}
                    aria-pressed={settings.allowRegistrations}
                  >
                    <span />
                  </button>
                </div>

                <div className="auth-toggle-row">
                  <div className="auth-toggle-text">
                    <ShieldCheck size={16} />
                    <div>
                      <strong>Require expert verification</strong>
                      <span>Agronomists & admins need review before access</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={`auth-switch ${settings.requireVerification ? "auth-switch-on" : ""}`}
                    onClick={() => update("requireVerification", !settings.requireVerification)}
                    aria-pressed={settings.requireVerification}
                  >
                    <span />
                  </button>
                </div>

                <div className="auth-toggle-row">
                  <div className="auth-toggle-text">
                    <AlertTriangle size={16} />
                    <div>
                      <strong>Maintenance mode</strong>
                      <span>Blocks non-admin sign-ins platform-wide</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={`auth-switch ${settings.maintenanceMode ? "auth-switch-on" : ""}`}
                    onClick={() => update("maintenanceMode", !settings.maintenanceMode)}
                    aria-pressed={settings.maintenanceMode}
                  >
                    <span />
                  </button>
                </div>

                {error && <div className="login-message login-error">{error}</div>}
                {success && <div className="login-message login-info">Settings saved.</div>}

                <button type="submit" className="btn btn-primary settings-save-btn" disabled={saving}>
                  {saving ? (<><Loader2 size={16} className="login-spinner" />Saving...</>) : (<><Save size={16} />Save settings</>)}
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

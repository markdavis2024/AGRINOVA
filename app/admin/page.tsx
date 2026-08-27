"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  BadgeCheck,
  BarChart3,
  Bell,
  ChevronDown,
  Clock,
  FileCheck2,
  Layout,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  ShoppingCart,
  Sprout,
  Store,
  TriangleAlert,
  Users,
  Wheat,
  X,
} from "lucide-react";

import Logo from "../../components/Logo";
import { useSession } from "../../lib/useSession";

/* ============================================================
   Sample data — the dashboard shell is fully built, but every
   number here is placeholder content until it's wired to
   PostgreSQL/Prisma. Swap these for real queries next.
============================================================ */

const stats = [
  { label: "Total users", value: "1,284", change: "+12% this month", icon: Users, tone: "green" },
  { label: "Farmers", value: "742", change: "+8% this month", icon: Sprout, tone: "green" },
  { label: "Buyers", value: "398", change: "+15% this month", icon: ShoppingCart, tone: "sky" },
  { label: "Agronomists", value: "56", change: "+3% this month", icon: Wheat, tone: "yellow" },
  { label: "Pending verifications", value: "27", change: "Needs review", icon: FileCheck2, tone: "alert" },
  { label: "Marketplace listings", value: "512", change: "+21% this month", icon: Store, tone: "sky" },
];

const roleBreakdown = [
  { label: "Farmers", count: 742, percent: 58 },
  { label: "Buyers", count: 398, percent: 31 },
  { label: "Agronomists", count: 56, percent: 4 },
  { label: "Admins", count: 12, percent: 1 },
];

const quickActions = [
  { title: "Manage users", desc: "View accounts, edit roles, suspend or reinstate access.", icon: Users, href: "/admin/users" },
  { title: "Verify documents", desc: "Review farmer and agronomist ID / authorization uploads.", icon: FileCheck2, href: "/admin/verifications" },
  { title: "Marketplace moderation", desc: "Approve, flag or remove marketplace listings.", icon: Store },
  { title: "IoT devices", desc: "Monitor connected sensors across registered farms.", icon: Activity },
  { title: "Reports & analytics", desc: "Platform-wide usage and growth reports.", icon: BarChart3 },
  { title: "Platform settings", desc: "Roles, permissions, branding and notifications.", icon: Settings },
];

const recentActivity = [
  { name: "Amina Ndongo", action: "registered as a Farmer", time: "5 min ago", icon: Sprout },
  { name: "Paul Eto", action: "registered as a Buyer", time: "22 min ago", icon: ShoppingCart },
  { name: "Dr. Marie Foka", action: "registered as an Agronomist", time: "1 hour ago", icon: Wheat },
  { name: "System", action: "flagged a marketplace listing for review", time: "2 hours ago", icon: TriangleAlert },
  { name: "Jean Baptiste", action: "registered as a Farmer", time: "3 hours ago", icon: Sprout },
];

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Users", icon: Users, href: "/admin/users" },
  { label: "Verifications", icon: FileCheck2, href: "/admin/verifications" },
  { label: "Marketplace", icon: Store },
  { label: "IoT Devices", icon: Activity },
  { label: "Reports", icon: BarChart3 },
  { label: "Settings", icon: Settings },
];

export default function AdminHomePage() {
  const router = useRouter();
  const { user, loading } = useSession("ADMIN");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  if (loading || !user) {
    return <div className="dash-loading">Loading your dashboard...</div>;
  }

  const initial = user.name.charAt(0).toUpperCase();

  return (
    <div className="dash-page">
      {sidebarOpen && (
        <div className="dash-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside className={`dash-sidebar ${sidebarOpen ? "dash-sidebar-open" : ""}`}>
        <div className="dash-sidebar-top">
          <Link href="/" className="dash-logo">
            <Logo width={130} />
          </Link>

          <button
            className="dash-sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="dash-nav">
          <span className="dash-nav-label">Main</span>

          {navItems.slice(0, 4).map((item) =>
            item.href ? (
              <Link key={item.label} href={item.href} className="dash-nav-item">
                <item.icon size={16} />
                {item.label}
              </Link>
            ) : (
              <button
                key={item.label}
                className={`dash-nav-item ${item.active ? "dash-nav-active" : ""}`}
              >
                <item.icon size={16} />
                {item.label}
                {!item.active && <span className="dash-soon">Soon</span>}
              </button>
            )
          )}

          <span className="dash-nav-label">Platform</span>

          {navItems.slice(4).map((item) => (
            <button key={item.label} className="dash-nav-item">
              <item.icon size={16} />
              {item.label}
              <span className="dash-soon">Soon</span>
            </button>
          ))}
        </nav>

        <div className="dash-sidebar-bottom">
          <div className="dash-admin-card">
            <div className="dash-avatar">{initial}</div>
            <div>
              <strong>{user.name}</strong>
              <span>Administrator</span>
            </div>
          </div>

          <button className="dash-logout" onClick={handleLogout}>
            <LogOut size={15} />
            Log out
          </button>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <div className="dash-main">
        <header className="dash-topbar">
          <button
            className="dash-menu-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          <div className="dash-search">
            <Search size={16} />
            <input type="text" placeholder="Search users, listings, reports..." />
          </div>

          <div className="dash-topbar-actions">
            <button className="dash-icon-btn" aria-label="Notifications">
              <Bell size={18} />
              <span className="dash-dot" />
            </button>

            <div className="dash-profile">
              <button
                className="dash-profile-btn"
                onClick={() => setProfileOpen((v) => !v)}
              >
                <div className="dash-avatar dash-avatar-small">{initial}</div>
                <span>{user.name.split(" ")[0]}</span>
                <ChevronDown size={14} />
              </button>

              {profileOpen && (
                <div className="dash-profile-menu">
                  <Link href="/" className="dash-profile-menu-item">
                    <Layout size={14} />
                    Back to landing page
                  </Link>
                  <button className="dash-profile-menu-item" onClick={handleLogout}>
                    <LogOut size={14} />
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="dash-content">
          <div className="dash-banner">
            <BadgeCheck size={16} />
            You&apos;re signed in for real — but the stats and activity
            below are still sample data until those features are built.
          </div>

          <div className="dash-page-header">
            <div>
              <h1>Welcome back, {user.name.split(" ")[0]} 👋</h1>
              <p>Here&apos;s what&apos;s happening across AGRINOVA today.</p>
            </div>
          </div>

          {/* ---- Stat cards ---- */}
          <div className="dash-stats-grid">
            {stats.map((s) => (
              <div className="dash-stat-card" key={s.label}>
                <div className={`dash-stat-icon dash-stat-${s.tone}`}>
                  <s.icon size={17} />
                </div>
                <div className="dash-stat-value">{s.value}</div>
                <div className="dash-stat-label">{s.label}</div>
                <div className={`dash-stat-change dash-stat-change-${s.tone}`}>
                  {s.change}
                </div>
              </div>
            ))}
          </div>

          {/* ---- Breakdown + Activity ---- */}
          <div className="dash-split">
            <div className="dash-panel">
              <div className="dash-panel-header">
                <h2>Users by role</h2>
                <span className="dash-sample-tag">Sample data</span>
              </div>

              <div className="dash-bars">
                {roleBreakdown.map((r) => (
                  <div className="dash-bar-row" key={r.label}>
                    <div className="dash-bar-label">
                      <span>{r.label}</span>
                      <span>{r.count}</span>
                    </div>
                    <div className="dash-bar-track">
                      <div
                        className="dash-bar-fill"
                        style={{ width: `${r.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="dash-panel">
              <div className="dash-panel-header">
                <h2>Recent activity</h2>
                <span className="dash-sample-tag">Sample data</span>
              </div>

              <div className="dash-activity-list">
                {recentActivity.map((a, i) => (
                  <div className="dash-activity-item" key={i}>
                    <div className="dash-activity-icon">
                      <a.icon size={14} />
                    </div>
                    <div className="dash-activity-body">
                      <p>
                        <strong>{a.name}</strong> {a.action}
                      </p>
                      <span>
                        <Clock size={11} />
                        {a.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ---- Quick actions ---- */}
          <div className="dash-panel-header dash-actions-header">
            <h2>Quick actions</h2>
          </div>

          <div className="dash-actions-grid">
            {quickActions.map((a) =>
              a.href ? (
                <Link
                  href={a.href}
                  className="dash-action-card dash-action-card-link"
                  key={a.title}
                >
                  <div className="dash-action-top">
                    <div className="dash-action-icon">
                      <a.icon size={18} />
                    </div>
                  </div>
                  <h3>{a.title}</h3>
                  <p>{a.desc}</p>
                </Link>
              ) : (
                <div className="dash-action-card" key={a.title}>
                  <div className="dash-action-top">
                    <div className="dash-action-icon">
                      <a.icon size={18} />
                    </div>
                    <span className="dash-soon">Coming soon</span>
                  </div>
                  <h3>{a.title}</h3>
                  <p>{a.desc}</p>
                </div>
              )
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  BadgeCheck,
  Banknote,
  Bell,
  ChevronDown,
  Clock,
  CloudSun,
  Layout,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Package,
  Plus,
  Search,
  Settings,
  Sprout,
  Store,
  X,
} from "lucide-react";

import Logo from "../../../components/Logo";
import { useSession } from "../../../lib/useSession";

/* ============================================================
   Sample data — the dashboard shell is fully built, but every
   number here is placeholder content until it's wired to
   PostgreSQL/Prisma.
============================================================ */

const stats = [
  { label: "My farms", value: "3", change: "1 added this year", icon: Sprout, tone: "green" },
  { label: "Active listings", value: "12", change: "+4 this month", icon: Store, tone: "sky" },
  { label: "Orders received", value: "28", change: "+6 this week", icon: Package, tone: "green" },
  { label: "This month's sales", value: "185,000 FCFA", change: "+18% vs last month", icon: Banknote, tone: "yellow" },
  { label: "Messages", value: "5", change: "2 unread", icon: MessageSquare, tone: "alert" },
  { label: "Connected sensors", value: "0", change: "Not set up yet", icon: Activity, tone: "sky" },
];

const cropBreakdown = [
  { label: "Maize", count: 4, percent: 40 },
  { label: "Cassava", count: 3, percent: 30 },
  { label: "Tomatoes", count: 2, percent: 20 },
  { label: "Other", count: 1, percent: 10 },
];

const quickActions = [
  { title: "Add a farm", desc: "Register a new farm and start tracking it.", icon: Plus },
  { title: "Create a listing", desc: "Put your produce up for sale on the marketplace.", icon: Store },
  { title: "View my orders", desc: "Track orders placed by buyers.", icon: Package },
  { title: "Ask an agronomist", desc: "Get expert advice on crops or livestock.", icon: MessageSquare },
  { title: "IoT devices", desc: "Connect soil, weather and crop sensors.", icon: Activity },
  { title: "Weather forecast", desc: "Check conditions for your farm's region.", icon: CloudSun },
];

const recentActivity = [
  { name: "Buyer Paul Eto", action: "ordered 50kg of Tomatoes", time: "18 min ago", icon: Package },
  { name: "Dr. Marie Foka", action: "replied to your question about soil pH", time: "1 hour ago", icon: MessageSquare },
  { name: "Marketplace", action: "your Maize listing was viewed 12 times", time: "3 hours ago", icon: Store },
  { name: "System", action: "reminder: update your Cassava harvest date", time: "5 hours ago", icon: Sprout },
  { name: "Buyer Amina N.", action: "sent you a message", time: "yesterday", icon: MessageSquare },
];

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "My Farms", icon: Sprout },
  { label: "Marketplace", icon: Store },
  { label: "Orders", icon: Package },
  { label: "IoT Devices", icon: Activity },
  { label: "Messages", icon: MessageSquare },
  { label: "Settings", icon: Settings },
];

function FarmerDashboard() {
  const router = useRouter();
  const { user, loading } = useSession("FARMER");

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
  const firstName = user.name.split(" ")[0];

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

          {navItems.slice(0, 4).map((item) => (
            <button
              key={item.label}
              className={`dash-nav-item ${item.active ? "dash-nav-active" : ""}`}
            >
              <item.icon size={16} />
              {item.label}
              {!item.active && <span className="dash-soon">Soon</span>}
            </button>
          ))}

          <span className="dash-nav-label">Support</span>

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
              <span>Farmer account</span>
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
            <input type="text" placeholder="Search farms, listings, orders..." />
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
                <span>{firstName}</span>
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
              <h1>Welcome back, {firstName} 👋</h1>
              <p>Here&apos;s how your farms are doing today.</p>
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
                <h2>Crops by type</h2>
                <span className="dash-sample-tag">Sample data</span>
              </div>

              <div className="dash-bars">
                {cropBreakdown.map((r) => (
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
            {quickActions.map((a) => (
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
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function FarmerHomePage() {
  return <FarmerDashboard />;
}

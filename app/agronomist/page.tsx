"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Award,
  BadgeCheck,
  Bell,
  BookOpen,
  Calendar,
  ChevronDown,
  Clock,
  Layout,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  Search,
  Settings,
  Stethoscope,
  Users,
  X,
} from "lucide-react";

import Logo from "../../components/Logo";
import { useSession } from "../../lib/useSession";

/* ============================================================
   Sample data — the dashboard shell is fully built, but every
   number here is placeholder content until it's wired to
   PostgreSQL/Prisma.
============================================================ */

const stats = [
  { label: "Assigned farmers", value: "24", change: "+3 this month", icon: Users, tone: "green" },
  { label: "Pending questions", value: "7", change: "Needs your reply", icon: MessageCircle, tone: "alert" },
  { label: "Consultations", value: "11", change: "This month", icon: Calendar, tone: "sky" },
  { label: "Diagnosis requests", value: "4", change: "2 awaiting review", icon: Stethoscope, tone: "yellow" },
  { label: "Advisory articles", value: "6", change: "Published so far", icon: BookOpen, tone: "green" },
  { label: "Credential status", value: "Pending", change: "Awaiting admin review", icon: Award, tone: "alert" },
];

const topicBreakdown = [
  { label: "Pest & disease", count: 9, percent: 45 },
  { label: "Soil health", count: 5, percent: 25 },
  { label: "Irrigation", count: 4, percent: 20 },
  { label: "Other", count: 2, percent: 10 },
];

const quickActions = [
  { title: "Answer questions", desc: "Reply to farmers waiting on your advice.", icon: MessageCircle, href: "/messages" },
  { title: "My farmers", desc: "View farmers currently assigned to you.", icon: Users },
  { title: "Diagnose a crop issue", desc: "Review photo-based diagnosis requests.", icon: Stethoscope },
  { title: "Schedule a consultation", desc: "Set up a call or farm visit.", icon: Calendar },
  { title: "Publish an article", desc: "Share advisory content with farmers.", icon: BookOpen },
  { title: "My credentials", desc: "Track your verification status.", icon: Award },
];

const recentActivity = [
  { name: "Farmer Jean Baptiste", action: "asked a question about yellowing maize leaves", time: "12 min ago", icon: MessageCircle },
  { name: "Farmer Amina Ndongo", action: "requested a crop diagnosis", time: "1 hour ago", icon: Stethoscope },
  { name: "System", action: "your credential review is still pending", time: "3 hours ago", icon: Award },
  { name: "Farmer Paul Eto", action: "booked a consultation for Friday", time: "5 hours ago", icon: Calendar },
  { name: "Farmer Jean Baptiste", action: "thanked you for your last reply", time: "yesterday", icon: MessageCircle },
];

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "My Farmers", icon: Users },
  { label: "Questions", icon: MessageCircle, href: "/messages" },
  { label: "Consultations", icon: Calendar },
  { label: "Diagnosis", icon: Stethoscope },
  { label: "Articles", icon: BookOpen },
  { label: "Settings", icon: Settings },
];

function AgronomistDashboard() {
  const router = useRouter();
  const { user, loading } = useSession("AGRONOMIST");

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

          {navItems.slice(0, 4).map((item) =>
            item.href ? (
              <Link
                key={item.label}
                href={item.href}
                className={`dash-nav-item ${item.active ? "dash-nav-active" : ""}`}
              >
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

          <span className="dash-nav-label">Knowledge</span>

          {navItems.slice(4).map((item) =>
            item.href ? (
              <Link key={item.label} href={item.href} className="dash-nav-item">
                <item.icon size={16} />
                {item.label}
              </Link>
            ) : (
              <button key={item.label} className="dash-nav-item">
                <item.icon size={16} />
                {item.label}
                <span className="dash-soon">Soon</span>
              </button>
            )
          )}
        </nav>

        <div className="dash-sidebar-bottom">
          <div className="dash-admin-card">
            <div className="dash-avatar">{initial}</div>
            <div>
              <strong>{user.name}</strong>
              <span>Agronomist account</span>
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
            <input type="text" placeholder="Search farmers, questions, articles..." />
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
              <p>Here&apos;s what your assigned farmers need today.</p>
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
                <h2>Questions by topic</h2>
                <span className="dash-sample-tag">Sample data</span>
              </div>

              <div className="dash-bars">
                {topicBreakdown.map((r) => (
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

export default function AgronomistHomePage() {
  return <AgronomistDashboard />;
}

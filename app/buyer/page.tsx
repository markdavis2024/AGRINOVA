"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  Banknote,
  Bell,
  ChevronDown,
  Clock,
  Heart,
  Layout,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Package,
  Receipt,
  Search,
  Settings,
  Store,
  Truck,
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
  { label: "Orders placed", value: "16", change: "+3 this month", icon: Package, tone: "green" },
  { label: "Orders in transit", value: "2", change: "Arriving this week", icon: Truck, tone: "sky" },
  { label: "Saved farmers", value: "9", change: "+2 this month", icon: Heart, tone: "alert" },
  { label: "This month's spend", value: "94,500 FCFA", change: "+11% vs last month", icon: Banknote, tone: "yellow" },
  { label: "Messages", value: "3", change: "1 unread", icon: MessageSquare, tone: "green" },
  { label: "Marketplace listings", value: "512", change: "Browse produce near you", icon: Store, tone: "sky" },
];

const purchaseBreakdown = [
  { label: "Vegetables", count: 7, percent: 44 },
  { label: "Fruits", count: 4, percent: 25 },
  { label: "Cereals & grains", count: 3, percent: 19 },
  { label: "Other", count: 2, percent: 12 },
];

const quickActions = [
  { title: "Browse marketplace", desc: "Discover fresh produce from farmers near you.", icon: Store, href: "/marketplace" },
  { title: "Track my orders", desc: "See the status of orders you've placed.", icon: Package, href: "/buyer/orders" },
  { title: "Saved farmers", desc: "Quickly reorder from farmers you trust.", icon: Heart },
  { title: "Message a farmer", desc: "Ask about availability, pricing or delivery.", icon: MessageSquare, href: "/messages" },
  { title: "Order history", desc: "Download receipts for past purchases.", icon: Receipt },
  { title: "Delivery tracking", desc: "Follow your order from farm to doorstep.", icon: Truck },
];

const recentActivity = [
  { name: "Farmer Jean Baptiste", action: "confirmed your order of Maize", time: "40 min ago", icon: Package },
  { name: "Farmer Amina Ndongo", action: "replied to your message", time: "2 hours ago", icon: MessageSquare },
  { name: "Order #A102", action: "is now out for delivery", time: "4 hours ago", icon: Truck },
  { name: "Marketplace", action: "3 new Tomato listings near you", time: "6 hours ago", icon: Store },
  { name: "Order #A098", action: "was delivered successfully", time: "yesterday", icon: Package },
];

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Marketplace", icon: Store, href: "/marketplace" },
  { label: "My Orders", icon: Package, href: "/buyer/orders" },
  { label: "Saved Farmers", icon: Heart },
  { label: "Messages", icon: MessageSquare, href: "/messages" },
  { label: "Order History", icon: Receipt },
  { label: "Settings", icon: Settings },
];

function BuyerDashboard() {
  const router = useRouter();
  const { user, loading } = useSession("BUYER");

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

          <span className="dash-nav-label">Support</span>

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
              <span>Buyer account</span>
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
            <input type="text" placeholder="Search produce, farmers, orders..." />
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
              <p>Here&apos;s what&apos;s happening with your orders today.</p>
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
                <h2>Purchases by category</h2>
                <span className="dash-sample-tag">Sample data</span>
              </div>

              <div className="dash-bars">
                {purchaseBreakdown.map((r) => (
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

export default function BuyerHomePage() {
  return <BuyerDashboard />;
}

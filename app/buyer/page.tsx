"use client";

import { useEffect, useState } from "react";
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
  ShoppingBag,
  TrendingUp,
  User,
  MapPin,
  Star,
  CheckCircle,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { useSession } from "@/lib/useSession";
import NotificationBell from "@/components/NotificationBell";

const STAT_ICONS: Record<string, any> = {
  Package,
  Truck,
  Heart,
  Banknote,
  MessageSquare,
  Store,
};

const initialStats = [
  { key: "placed", label: "Orders placed", value: "—", change: "Loading...", icon: Package, tone: "green" },
  { key: "transit", label: "Orders in transit", value: "—", change: "Loading...", icon: Truck, tone: "sky" },
  { key: "farmers", label: "Farmers ordered from", value: "—", change: "Loading...", icon: Heart, tone: "alert" },
  { key: "spend", label: "This month's spend", value: "—", change: "Loading...", icon: Banknote, tone: "yellow" },
  { key: "unread", label: "Messages", value: "—", change: "Loading...", icon: MessageSquare, tone: "green" },
  { key: "listings", label: "Marketplace listings", value: "—", change: "Loading...", icon: Store, tone: "sky" },
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
  { title: "Message a farmer", desc: "Ask about availability, pricing or delivery.", icon: MessageSquare, href: "/messages" },
  { title: "Order history", desc: "Review your past delivered orders.", icon: Receipt, href: "/buyer/orders?status=DELIVERED" },
  { title: "Saved farmers", desc: "Quickly reorder from farmers you trust.", icon: Heart },
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
  { label: "Dashboard", icon: LayoutDashboard, href: "/buyer", active: true },
  { label: "Marketplace", icon: Store, href: "/marketplace" },
  { label: "My Orders", icon: Package, href: "/buyer/orders" },
  { label: "Saved Farmers", icon: Heart },
  { label: "Messages", icon: MessageSquare, href: "/messages" },
  { label: "Order History", icon: Receipt, href: "/buyer/orders?status=DELIVERED" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

export default function BuyerDashboard() {
  const router = useRouter();
  const { user, loading } = useSession("BUYER");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [stats, setStats] = useState(initialStats);

  useEffect(() => {
    if (!user) return;
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.stats) {
          setStats(
            data.stats.map((s: { icon: string; [k: string]: unknown }) => ({
              ...s,
              icon: STAT_ICONS[s.icon] ?? Store,
            }))
          );
        }
      })
      .catch(() => {});
  }, [user]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  if (loading || !user) {
    return (
      <div className="dash-loading">
        <div className="dash-loading-spinner"></div>
        <span>Loading your dashboard...</span>
      </div>
    );
  }

  const initial = user.name.charAt(0).toUpperCase();
  const firstName = user.name.split(" ")[0];

  return (
    <div className="dash-page">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="dash-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`dash-sidebar ${sidebarOpen ? "dash-sidebar-open" : ""}`}>
        <div className="dash-sidebar-top">
          <Link href="/" className="dash-logo">
            <span className="dash-logo-icon">🌱</span>
            <span className="dash-logo-text">AGRINOVA</span>
          </Link>

          <button
            className="dash-sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* User Info */}
        <div className="dash-sidebar-user">
          <div className="dash-sidebar-avatar">
            <span>{initial}</span>
          </div>
          <div className="dash-sidebar-user-info">
            <span className="dash-sidebar-user-name">{user.name}</span>
            <span className="dash-sidebar-user-role">Buyer</span>
          </div>
        </div>

        <nav className="dash-nav">
          <span className="dash-nav-label">Main</span>

          {navItems.map((item) =>
            item.href ? (
              <Link
                key={item.label}
                href={item.href}
                className={`dash-nav-item ${item.active ? "dash-nav-active" : ""}`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </Link>
            ) : (
              <button
                key={item.label}
                className="dash-nav-item"
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
                <span className="dash-soon">Soon</span>
              </button>
            )
          )}
        </nav>

        <div className="dash-sidebar-bottom">
          <button className="dash-logout" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="dash-main">
        {/* Topbar */}
        <header className="dash-topbar">
          <button
            className="dash-menu-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <div className="dash-search">
            <Search size={16} />
            <input type="text" placeholder="Search produce, farmers, orders..." />
          </div>

          <div className="dash-topbar-actions">
            <NotificationBell userId={user.id} />

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

        {/* Content */}
        <main className="dash-content">
          <div className="dash-banner">
            <BadgeCheck size={16} />
            <span>
              Welcome to your buyer dashboard, <strong>{firstName}</strong>! 
              Browse products, track orders, and connect with farmers.
            </span>
          </div>

          <div className="dash-page-header">
            <div>
              <h1>Welcome back, {firstName} 👋</h1>
              <p>Here's what's happening with your orders today.</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="dash-stats-grid">
            {stats.map((s) => (
              <div className="dash-stat-card" key={s.label}>
                <div className={`dash-stat-icon dash-stat-${s.tone}`}>
                  <s.icon size={18} />
                </div>
                <div className="dash-stat-value">{s.value}</div>
                <div className="dash-stat-label">{s.label}</div>
                <div className={`dash-stat-change dash-stat-change-${s.tone}`}>
                  {s.change}
                </div>
              </div>
            ))}
          </div>

          {/* Split Panel */}
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

          {/* Quick Actions */}
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
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="dash-action-top">
                    <div className="dash-action-icon">
                      <a.icon size={20} />
                    </div>
                    {a.title === "Browse marketplace" && <span className="dash-action-badge">New</span>}
                  </div>
                  <h3>{a.title}</h3>
                  <p>{a.desc}</p>
                </Link>
              ) : (
                <div className="dash-action-card" key={a.title}>
                  <div className="dash-action-top">
                    <div className="dash-action-icon">
                      <a.icon size={20} />
                    </div>
                    <span className="dash-soon-badge">Coming soon</span>
                  </div>
                  <h3>{a.title}</h3>
                  <p>{a.desc}</p>
                </div>
              )
            )}
          </div>
        </main>
      </div>

      <style jsx>{`
        /* Loading */
        .dash-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: #f5f0e8;
          gap: 0.75rem;
          color: #6b7280;
        }

        .dash-loading-spinner {
          width: 1.5rem;
          height: 1.5rem;
          border: 2px solid #e8e0d5;
          border-top-color: #7cb342;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Page Layout */
        .dash-page {
          display: flex;
          min-height: 100vh;
          background: #f5f0e8;
        }

        /* Overlay */
        .dash-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          z-index: 40;
          display: none;
        }

        @media (max-width: 768px) {
          .dash-overlay {
            display: block;
          }
        }

        /* Sidebar */
        .dash-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          z-index: 50;
          width: 280px;
          background: #faf8f5;
          border-right: 1px solid #e8e0d5;
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease;
          transform: translateX(-100%);
        }

        .dash-sidebar-open {
          transform: translateX(0);
        }

        @media (min-width: 768px) {
          .dash-sidebar {
            position: sticky;
            top: 0;
            transform: translateX(0);
            height: 100vh;
          }
        }

        .dash-sidebar-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid #e8e0d5;
        }

        .dash-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
        }

        .dash-logo-icon {
          font-size: 1.5rem;
        }

        .dash-logo-text {
          font-size: 1.125rem;
          font-weight: 700;
          color: #2d5a27;
        }

        .dash-sidebar-close {
          padding: 0.25rem;
          background: none;
          border: none;
          border-radius: 0.375rem;
          cursor: pointer;
          display: none;
          color: #6b7280;
        }

        .dash-sidebar-close:hover {
          background: #f5f0e8;
        }

        @media (max-width: 768px) {
          .dash-sidebar-close {
            display: block;
          }
        }

        /* Sidebar User */
        .dash-sidebar-user {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid #e8e0d5;
        }

        .dash-sidebar-avatar {
          width: 2.5rem;
          height: 2.5rem;
          background: linear-gradient(135deg, #7cb342, #558b2f);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          font-weight: 600;
          color: white;
          flex-shrink: 0;
        }

        .dash-sidebar-user-info {
          display: flex;
          flex-direction: column;
        }

        .dash-sidebar-user-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: #2d5a27;
        }

        .dash-sidebar-user-role {
          font-size: 0.75rem;
          color: #6b7280;
        }

        /* Navigation */
        .dash-nav {
          flex: 1;
          overflow-y: auto;
          padding: 0.75rem;
        }

        .dash-nav-label {
          display: block;
          font-size: 0.65rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #9ca3af;
          padding: 0.5rem 0.75rem;
        }

        .dash-nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.625rem 0.75rem;
          border-radius: 0.5rem;
          color: #6b7280;
          text-decoration: none;
          transition: all 0.2s;
          width: 100%;
          border: none;
          background: none;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          font-family: inherit;
          margin-bottom: 0.125rem;
        }

        .dash-nav-item:hover {
          background: #f5f0e8;
          color: #2d5a27;
        }

        .dash-nav-active {
          background: #e8f5e9;
          color: #7cb342;
        }

        .dash-nav-active:hover {
          background: #e8f5e9;
        }

        .dash-nav-item svg {
          flex-shrink: 0;
        }

        .dash-nav-item span:not(.dash-soon) {
          flex: 1;
        }

        .dash-soon {
          font-size: 0.55rem;
          color: #9ca3af;
          background: #f5f0e8;
          padding: 0.125rem 0.5rem;
          border-radius: 9999px;
          flex-shrink: 0;
        }

        .dash-sidebar-bottom {
          padding: 0.75rem 0.75rem;
          border-top: 1px solid #e8e0d5;
        }

        .dash-logout {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.625rem 0.75rem;
          width: 100%;
          border: none;
          border-radius: 0.5rem;
          color: #ef4444;
          background: transparent;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }

        .dash-logout:hover {
          background: #fef2f2;
        }

        /* Main Content */
        .dash-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        /* Topbar */
        .dash-topbar {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 1.5rem;
          background: #faf8f5;
          border-bottom: 1px solid #e8e0d5;
          flex-shrink: 0;
          flex-wrap: wrap;
        }

        .dash-menu-btn {
          padding: 0.5rem;
          background: none;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          display: none;
          color: #6b7280;
          transition: background 0.2s;
        }

        .dash-menu-btn:hover {
          background: #f5f0e8;
        }

        @media (max-width: 768px) {
          .dash-menu-btn {
            display: block;
          }
        }

        .dash-search {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: white;
          border: 1px solid #e8e0d5;
          border-radius: 0.75rem;
          padding: 0.5rem 0.75rem;
          min-width: 200px;
          transition: border-color 0.2s;
        }

        .dash-search:focus-within {
          border-color: #7cb342;
          box-shadow: 0 0 0 3px rgba(124, 179, 66, 0.1);
        }

        .dash-search input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 0.875rem;
          background: transparent;
          color: #2d5a27;
          min-width: 0;
        }

        .dash-search input::placeholder {
          color: #9ca3af;
        }

        .dash-search svg {
          color: #9ca3af;
          flex-shrink: 0;
        }

        .dash-topbar-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-shrink: 0;
        }

        .dash-profile {
          position: relative;
        }

        .dash-profile-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.375rem 0.5rem;
          background: none;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: background 0.2s;
          font-size: 0.875rem;
          color: #2d5a27;
          font-weight: 500;
          font-family: inherit;
        }

        .dash-profile-btn:hover {
          background: #f5f0e8;
        }

        .dash-avatar {
          width: 2rem;
          height: 2rem;
          background: linear-gradient(135deg, #7cb342, #558b2f);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 600;
          color: white;
          flex-shrink: 0;
        }

        .dash-avatar-small {
          width: 2rem;
          height: 2rem;
          font-size: 0.7rem;
        }

        .dash-profile-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border: 1px solid #e8e0d5;
          border-radius: 0.75rem;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          min-width: 200px;
          margin-top: 0.5rem;
          overflow: hidden;
          z-index: 10;
        }

        .dash-profile-menu-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 1rem;
          color: #6b7280;
          text-decoration: none;
          font-size: 0.875rem;
          transition: background 0.2s;
          width: 100%;
          border: none;
          background: none;
          cursor: pointer;
          font-family: inherit;
        }

        .dash-profile-menu-item:hover {
          background: #f5f0e8;
          color: #2d5a27;
        }

        /* Content */
        .dash-content {
          flex: 1;
          padding: 1.5rem;
          overflow-y: auto;
        }

        .dash-banner {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          background: #e8f5e9;
          border-radius: 0.75rem;
          border: 1px solid #c8e6c9;
          color: #2d5a27;
          font-size: 0.875rem;
          margin-bottom: 1.5rem;
        }

        .dash-banner svg {
          flex-shrink: 0;
          color: #7cb342;
        }

        .dash-banner strong {
          color: #1b3a1b;
        }

        .dash-page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .dash-page-header h1 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #2d5a27;
        }

        .dash-page-header p {
          color: #6b7280;
          font-size: 0.875rem;
        }

        /* Stats Grid */
        .dash-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .dash-stat-card {
          background: #faf8f5;
          border: 1px solid #e8e0d5;
          border-radius: 1rem;
          padding: 1rem;
          transition: all 0.2s;
        }

        .dash-stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .dash-stat-icon {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.5rem;
        }

        .dash-stat-green { background: #e8f5e9; color: #7cb342; }
        .dash-stat-sky { background: #e3f2fd; color: #42a5f5; }
        .dash-stat-yellow { background: #fff8e1; color: #f9a825; }
        .dash-stat-alert { background: #fce4ec; color: #ef5350; }

        .dash-stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #2d5a27;
        }

        .dash-stat-label {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .dash-stat-change {
          font-size: 0.65rem;
          margin-top: 0.25rem;
        }

        .dash-stat-change-green { color: #7cb342; }
        .dash-stat-change-sky { color: #42a5f5; }
        .dash-stat-change-yellow { color: #f9a825; }
        .dash-stat-change-alert { color: #ef5350; }

        /* Split Panel */
        .dash-split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        @media (max-width: 768px) {
          .dash-split {
            grid-template-columns: 1fr;
          }
        }

        .dash-panel {
          background: #faf8f5;
          border: 1px solid #e8e0d5;
          border-radius: 1rem;
          padding: 1.25rem;
        }

        .dash-panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .dash-panel-header h2 {
          font-size: 1rem;
          font-weight: 600;
          color: #2d5a27;
        }

        .dash-sample-tag {
          font-size: 0.625rem;
          color: #9ca3af;
          background: #f5f0e8;
          padding: 0.125rem 0.5rem;
          border-radius: 9999px;
        }

        /* Bars */
        .dash-bars {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .dash-bar-row {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }

        .dash-bar-label {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: #2d5a27;
        }

        .dash-bar-track {
          width: 100%;
          height: 0.5rem;
          background: #e8e0d5;
          border-radius: 9999px;
          overflow: hidden;
        }

        .dash-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #7cb342, #558b2f);
          border-radius: 9999px;
          transition: width 0.6s ease;
        }

        /* Activity */
        .dash-activity-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .dash-activity-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.5rem 0;
          border-bottom: 1px solid #f5f0e8;
        }

        .dash-activity-item:last-child {
          border-bottom: none;
        }

        .dash-activity-icon {
          width: 2rem;
          height: 2rem;
          background: #f5f0e8;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #7cb342;
        }

        .dash-activity-body {
          flex: 1;
        }

        .dash-activity-body p {
          font-size: 0.75rem;
          color: #2d5a27;
          margin: 0;
        }

        .dash-activity-body p strong {
          color: #1b3a1b;
        }

        .dash-activity-body span {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.6rem;
          color: #9ca3af;
        }

        /* Quick Actions */
        .dash-actions-header {
          margin-bottom: 1rem;
        }

        .dash-actions-header h2 {
          font-size: 1rem;
          font-weight: 600;
          color: #2d5a27;
        }

        .dash-actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
        }

        .dash-action-card {
          background: #faf8f5;
          border: 1px solid #e8e0d5;
          border-radius: 1rem;
          padding: 1rem;
          transition: all 0.2s;
          text-decoration: none;
          color: inherit;
          display: block;
        }

        .dash-action-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          border-color: #7cb342;
        }

        .dash-action-card-link:hover {
          border-color: #7cb342;
        }

        .dash-action-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .dash-action-icon {
          width: 2.5rem;
          height: 2.5rem;
          background: #e8f5e9;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #7cb342;
        }

        .dash-action-badge {
          font-size: 0.55rem;
          color: white;
          background: #7cb342;
          padding: 0.125rem 0.5rem;
          border-radius: 9999px;
        }

        .dash-soon-badge {
          font-size: 0.55rem;
          color: #9ca3af;
          background: #f5f0e8;
          padding: 0.125rem 0.5rem;
          border-radius: 9999px;
        }

        .dash-action-card h3 {
          font-size: 0.875rem;
          font-weight: 600;
          color: #2d5a27;
          margin: 0 0 0.25rem 0;
        }

        .dash-action-card p {
          font-size: 0.75rem;
          color: #6b7280;
          margin: 0;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .dash-stats-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .dash-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .dash-content {
            padding: 1rem;
          }

          .dash-topbar {
            padding: 0.5rem 1rem;
          }

          .dash-search {
            min-width: 150px;
          }
        }

        @media (max-width: 480px) {
          .dash-stats-grid {
            grid-template-columns: 1fr 1fr;
          }

          .dash-actions-grid {
            grid-template-columns: 1fr;
          }

          .dash-page-header h1 {
            font-size: 1.25rem;
          }

          .dash-topbar {
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}
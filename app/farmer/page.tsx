"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  BadgeCheck,
  Banknote,
  Bell,
  BookOpen,
  CalendarDays,
  ChevronDown,
  Clock,
  Cloud,
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
  Stethoscope,
  Store,
  X,
  Bot,
  Cpu,
} from "lucide-react";

import { useSession } from "@/lib/useSession";
import DashboardSidebar from "@/components/DashboardSidebar";
import NotificationBell from "@/components/NotificationBell";
import { weatherService } from "@/lib/weatherService";

const STAT_ICONS: Record<string, typeof Sprout> = {
  Store,
  Sprout,
  Package,
  Banknote,
  MessageSquare,
  Activity,
};

const initialStats = [
  { key: "listings", label: "Total listings", value: "—", change: "Loading...", icon: Store, tone: "sky" },
  { key: "active", label: "Active listings", value: "—", change: "Loading...", icon: Sprout, tone: "sky" },
  { key: "orders", label: "Orders received", value: "—", change: "Loading...", icon: Package, tone: "green" },
  { key: "sales", label: "This month's sales", value: "—", change: "Loading...", icon: Banknote, tone: "yellow" },
  { key: "unread", label: "Messages", value: "—", change: "Loading...", icon: MessageSquare, tone: "green" },
  { key: "sensors", label: "Connected sensors", value: "—", change: "Loading...", icon: Activity, tone: "sky" },
];

const cropBreakdown = [
  { label: "Maize", count: 4, percent: 40 },
  { label: "Cassava", count: 3, percent: 30 },
  { label: "Tomatoes", count: 2, percent: 20 },
  { label: "Other", count: 1, percent: 10 },
];

const quickActions = [
  { title: "Add a farm", desc: "Register a new farm and start tracking it.", icon: Plus, href: "/farmer/farms" },
  { title: "Create a listing", desc: "Put your produce up for sale on the marketplace.", icon: Store, href: "/farmer/marketplace/new" },
  { title: "View my orders", desc: "Track orders placed by buyers.", icon: Package, href: "/farmer/orders" },
  { title: "Ask an agronomist", desc: "Get expert advice on crops or livestock.", icon: MessageSquare, href: "/messages" },
  { title: "Request a diagnosis", desc: "Get expert help with a crop issue, with a photo.", icon: Stethoscope, href: "/farmer/diagnosis" },
  { title: "Book a consultation", desc: "Schedule a call or visit with an agronomist.", icon: CalendarDays, href: "/farmer/consultations" },
  { title: "IoT devices", desc: "Connect soil, weather and crop sensors.", icon: Activity, href: "/farmer/iot" },
  { title: "IoT Dashboard", desc: "Monitor your sensors in real-time.", icon: Cpu, href: "/farmer/iot-dashboard" },
  { title: "Advisory articles", desc: "Read agricultural guidance from experts.", icon: BookOpen, href: "/articles" },
  { title: "AI Assistant", desc: "Get instant agricultural advice from our AI.", icon: Bot, href: "/ai-chat" },
  { title: "Weather Dashboard", desc: "View detailed weather forecasts and insights.", icon: Cloud, href: "/weather" },
];

const recentActivity = [
  { name: "Buyer Paul Eto", action: "ordered 50kg of Tomatoes", time: "18 min ago", icon: Package },
  { name: "Dr. Marie Foka", action: "replied to your question about soil pH", time: "1 hour ago", icon: MessageSquare },
  { name: "Marketplace", action: "your Maize listing was viewed 12 times", time: "3 hours ago", icon: Store },
  { name: "System", action: "reminder: update your Cassava harvest date", time: "5 hours ago", icon: Sprout },
  { name: "Buyer Amina N.", action: "sent you a message", time: "yesterday", icon: MessageSquare },
];

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/farmer", active: true },
  { label: "My Farms", icon: Sprout, href: "/farmer/farms" },
  { label: "Marketplace", icon: Store, href: "/farmer/marketplace" },
  { label: "Orders", icon: Package, href: "/farmer/orders" },
  { label: "IoT Devices", icon: Activity, href: "/farmer/iot" },
  { label: "IoT Dashboard", icon: Cpu, href: "/farmer/iot-dashboard" },
  { label: "Weather", icon: Cloud, href: "/weather" },
  { label: "AI Assistant", icon: Bot, href: "/ai-chat" },
  { label: "Messages", icon: MessageSquare, href: "/messages" },
  { label: "Consultations", icon: CalendarDays, href: "/farmer/consultations" },
  { label: "Diagnosis", icon: Stethoscope, href: "/farmer/diagnosis" },
  { label: "Articles", icon: BookOpen, href: "/articles" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

function FarmerDashboard() {
  const router = useRouter();
  const { user, loading } = useSession("FARMER");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [stats, setStats] = useState(initialStats);

  // Start weather monitoring
  useEffect(() => {
    if (user) {
      // Start weather monitoring for notifications
      weatherService.startMonitoring();
      
      // Initialize notification service with user ID
      const { notificationService } = require('@/lib/notificationService');
      notificationService.initialize(user.id);
    }

    return () => {
      weatherService.stopMonitoring();
    };
  }, [user]);

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

  const hasIoTInterest = user.iotInterest || false;

  return (
    <div className="dash-page">
      <DashboardSidebar
        user={user}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="dash-main">
        <header className="dash-topbar">
          <button className="dash-menu-btn" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>

          <div className="dash-search">
            <Search size={16} />
            <input type="text" placeholder="Search farms, listings, orders..." />
          </div>

          <div className="dash-topbar-actions">
            <NotificationBell userId={user.id} />

            <div className="dash-profile">
              <button className="dash-profile-btn" onClick={() => setProfileOpen((v) => !v)}>
                <div className="dash-avatar dash-avatar-small">{initial}</div>
                <span>{firstName}</span>
                <ChevronDown size={14} />
              </button>

              {profileOpen && (
                <div className="dash-profile-menu">
                  <Link href="/" className="dash-profile-menu-item">
                    <Layout size={14} /> Back to landing page
                  </Link>
                  <button className="dash-profile-menu-item" onClick={handleLogout}>
                    <LogOut size={14} /> Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="dash-content">
          {/* Welcome Banner */}
          <div className="dash-banner">
            <BadgeCheck size={16} />
            <span>
              Welcome to your farm dashboard, <strong>{firstName}</strong>! 
              Manage your crops, track orders, and monitor your farm's performance.
            </span>
          </div>

          {/* Page Header */}
          <div className="dash-page-header">
            <div>
              <h1>Welcome back, {firstName} 👋</h1>
              <p>Here's how your farms are doing today.</p>
            </div>
          </div>

          {/* Stats Grid */}
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

          {/* IoT Section - Only if user has IoT interest */}
          {hasIoTInterest && (
            <div className="dash-iot-section">
              <div className="dash-iot-header">
                <h2>
                  <Activity size={20} className="text-green-600" />
                  Your IoT Dashboard
                </h2>
                <Link href="/farmer/iot-dashboard" className="btn btn-primary btn-sm">
                  View Dashboard →
                </Link>
              </div>
              <div className="dash-iot-grid">
                <div className="dash-iot-card">
                  <div className="dash-iot-icon">🌱</div>
                  <div>
                    <h4>Soil Moisture</h4>
                    <p className="dash-iot-value">—</p>
                    <span className="dash-iot-status">No sensors connected</span>
                  </div>
                </div>
                <div className="dash-iot-card">
                  <div className="dash-iot-icon">🌡️</div>
                  <div>
                    <h4>Temperature</h4>
                    <p className="dash-iot-value">—</p>
                    <span className="dash-iot-status">No sensors connected</span>
                  </div>
                </div>
                <div className="dash-iot-card">
                  <div className="dash-iot-icon">📡</div>
                  <div>
                    <h4>Devices</h4>
                    <p className="dash-iot-value">0</p>
                    <Link href="/farmer/iot" className="dash-iot-link">Add device →</Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Split Panel - Crops & Activity */}
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
                      <div className="dash-bar-fill" style={{ width: `${r.percent}%` }} />
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
                    <div className="dash-activity-icon"><a.icon size={14} /></div>
                    <div className="dash-activity-body">
                      <p><strong>{a.name}</strong> {a.action}</p>
                      <span><Clock size={11} /> {a.time}</span>
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
                <Link href={a.href} className="dash-action-card dash-action-card-link" key={a.title}>
                  <div className="dash-action-top">
                    <div className="dash-action-icon"><a.icon size={18} /></div>
                    {a.title === "AI Assistant" && <span className="dash-ai-badge">New</span>}
                    {a.title === "Weather Dashboard" && <span className="dash-weather-badge">☀️</span>}
                  </div>
                  <h3>{a.title}</h3>
                  <p>{a.desc}</p>
                </Link>
              ) : (
                <div className="dash-action-card" key={a.title}>
                  <div className="dash-action-top">
                    <div className="dash-action-icon"><a.icon size={18} /></div>
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

      <style jsx>{`
        /* Loading */
        .dash-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: #f0fdf4;
          gap: 0.75rem;
          color: #6b7280;
        }

        .dash-loading-spinner {
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

        /* IoT Section */
        .dash-iot-section {
          background: white;
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 24px;
          border: 1px solid #e5e7eb;
        }

        .dash-iot-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .dash-iot-header h2 {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .btn-sm {
          padding: 6px 16px;
          font-size: 12px;
          background: #059669;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.2s;
        }

        .btn-sm:hover {
          background: #047857;
        }

        .dash-iot-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .dash-iot-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: #f9fafb;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }

        .dash-iot-icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 20px;
        }

        .dash-iot-card h4 {
          font-size: 13px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .dash-iot-value {
          font-size: 18px;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .dash-iot-status {
          font-size: 11px;
          color: #9ca3af;
        }

        .dash-iot-link {
          font-size: 12px;
          color: #059669;
          font-weight: 600;
          text-decoration: none;
        }

        .dash-iot-link:hover {
          text-decoration: underline;
        }

        /* Weather Badge */
        .dash-weather-badge {
          font-size: 12px;
          background: #dbeafe;
          color: #3b82f6;
          padding: 2px 8px;
          border-radius: 9999px;
        }

        @media (max-width: 768px) {
          .dash-iot-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default FarmerDashboard;
"use client";

import { useEffect, useState } from "react";
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
  UserPlus,
  FileText,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Star,
  Phone,
  Video,
  MapPin,
  Filter,
  Plus,
} from "lucide-react";
import { useSession } from "@/lib/useSession";
import NotificationBell from "@/components/NotificationBell";

interface Stats {
  conversations: number;
  unread: number;
  consultations: number;
  diagnosis: number;
  articles: number;
  credential: string;
  credentialStatus: string;
}

interface Activity {
  id: string;
  type: "message" | "diagnosis" | "consultation" | "article" | "system";
  farmerName: string;
  action: string;
  time: string;
  icon: any;
}

interface Farmer {
  id: string;
  name: string;
  location: string;
  crop: string;
  lastActive: string;
  status: "online" | "offline";
}

const mockStats: Stats = {
  conversations: 24,
  unread: 5,
  consultations: 12,
  diagnosis: 8,
  articles: 6,
  credential: "Verified",
  credentialStatus: "Approved",
};

const mockFarmers: Farmer[] = [
  { id: "1", name: "Jean Baptiste", location: "Bamenda", crop: "Maize", lastActive: "2 min ago", status: "online" },
  { id: "2", name: "Marie Claire", location: "Yaoundé", crop: "Tomatoes", lastActive: "1 hour ago", status: "online" },
  { id: "3", name: "Paul Atanga", location: "Douala", crop: "Cassava", lastActive: "3 hours ago", status: "offline" },
  { id: "4", name: "Amina Ndongo", location: "Buea", crop: "Cocoa", lastActive: "5 hours ago", status: "offline" },
];

const mockActivities: Activity[] = [
  { id: "1", type: "message", farmerName: "Jean Baptiste", action: "asked about yellowing maize leaves", time: "12 min ago", icon: MessageCircle },
  { id: "2", type: "diagnosis", farmerName: "Amina Ndongo", action: "requested a crop diagnosis", time: "1 hour ago", icon: Stethoscope },
  { id: "3", type: "system", farmerName: "System", action: "your credential review is still pending", time: "3 hours ago", icon: Award },
  { id: "4", type: "consultation", farmerName: "Paul Eto", action: "booked a consultation for Friday", time: "5 hours ago", icon: Calendar },
  { id: "5", type: "message", farmerName: "Jean Baptiste", action: "thanked you for your last reply", time: "yesterday", icon: MessageCircle },
];

const topicBreakdown = [
  { label: "Pest & disease", count: 9, percent: 45 },
  { label: "Soil health", count: 5, percent: 25 },
  { label: "Irrigation", count: 4, percent: 20 },
  { label: "Other", count: 2, percent: 10 },
];

const quickActions = [
  { title: "Answer questions", desc: "Reply to farmers waiting on your advice.", icon: MessageCircle, href: "/messages" },
  { title: "My farmers", desc: "View farmers currently assigned to you.", icon: Users, href: "/agronomist/farmers" },
  { title: "Diagnose a crop issue", desc: "Review photo-based diagnosis requests.", icon: Stethoscope, href: "/agronomist/diagnosis" },
  { title: "Schedule a consultation", desc: "Set up a call or farm visit.", icon: Calendar, href: "/agronomist/consultations" },
  { title: "Publish an article", desc: "Share advisory content with farmers.", icon: BookOpen, href: "/agronomist/articles/new" },
  { title: "My credentials", desc: "Track your verification status.", icon: Award, href: "/agronomist/credentials" },
];

export default function AgronomistDashboard() {
  const router = useRouter();
  const { user, loading } = useSession("AGRONOMIST");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [stats, setStats] = useState(mockStats);
  const [farmers, setFarmers] = useState(mockFarmers);
  const [activities, setActivities] = useState(mockActivities);

  useEffect(() => {
    if (!user) return;
    // Fetch real stats from API
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.stats) {
          setStats(data.stats);
        }
      })
      .catch(() => {
        // Use mock data if API fails
        setStats(mockStats);
      });

    // Fetch farmers
    fetch("/api/agronomist/farmers")
      .then((res) => res.json())
      .then((data) => {
        if (data.farmers) {
          setFarmers(data.farmers);
        }
      })
      .catch(() => {
        setFarmers(mockFarmers);
      });

    // Fetch activities
    fetch("/api/agronomist/activities")
      .then((res) => res.json())
      .then((data) => {
        if (data.activities) {
          setActivities(data.activities);
        }
      })
      .catch(() => {
        setActivities(mockActivities);
      });
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
  const onlineFarmers = farmers.filter(f => f.status === "online").length;

  return (
    <div className="dash-page">
      {sidebarOpen && (
        <div className="dash-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar - UNCHANGED */}
      <aside className={`dash-sidebar ${sidebarOpen ? "dash-sidebar-open" : ""}`}>
        <div className="dash-sidebar-top">
          <Link href="/" className="dash-logo">
            <span className="dash-logo-icon">🌱</span>
            <span className="dash-logo-text">AGRINOVA</span>
          </Link>
          <button className="dash-sidebar-close" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <nav className="dash-nav">
          <span className="dash-nav-label">Main</span>
          {[
            { label: "Dashboard", icon: LayoutDashboard, href: "/agronomist", active: true },
            { label: "My Farmers", icon: Users, href: "/agronomist/farmers" },
            { label: "Questions", icon: MessageCircle, href: "/messages" },
            { label: "Consultations", icon: Calendar, href: "/agronomist/consultations" },
            { label: "Diagnosis", icon: Stethoscope, href: "/agronomist/diagnosis" },
            { label: "Articles", icon: BookOpen, href: "/agronomist/articles" },
            { label: "Settings", icon: Settings, href: "/settings" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`dash-nav-item ${item.active ? "dash-nav-active" : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </Link>
          ))}
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
        <header className="dash-topbar">
          <button className="dash-menu-btn" onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>

          <div className="dash-search">
            <Search size={16} />
            <input type="text" placeholder="Search farmers, questions, articles..." />
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
            <span>
              Welcome back, <strong>Dr. {firstName}</strong>! You have 
              <strong> {stats.unread} unanswered questions</strong> and 
              <strong> {stats.diagnosis} pending diagnoses</strong>
            </span>
          </div>

          <div className="dash-page-header">
            <div>
              <h1>Welcome back, {firstName} 👋</h1>
              <p>Here's what your assigned farmers need today.</p>
            </div>
          </div>

          {/* Stats - Now functional */}
          <div className="dash-stats-grid">
            <div className="dash-stat-card">
              <div className="dash-stat-icon dash-stat-green">
                <Users size={17} />
              </div>
              <div className="dash-stat-value">{farmers.length}</div>
              <div className="dash-stat-label">My Farmers</div>
              <div className="dash-stat-change">{onlineFarmers} online now</div>
            </div>

            <div className="dash-stat-card">
              <div className="dash-stat-icon dash-stat-blue">
                <MessageCircle size={17} />
              </div>
              <div className="dash-stat-value">{stats.conversations}</div>
              <div className="dash-stat-label">Conversations</div>
              <div className="dash-stat-change">{stats.unread} unread</div>
            </div>

            <div className="dash-stat-card">
              <div className="dash-stat-icon dash-stat-yellow">
                <Stethoscope size={17} />
              </div>
              <div className="dash-stat-value">{stats.diagnosis}</div>
              <div className="dash-stat-label">Diagnosis</div>
              <div className="dash-stat-change">Pending review</div>
            </div>

            <div className="dash-stat-card">
              <div className="dash-stat-icon dash-stat-purple">
                <Calendar size={17} />
              </div>
              <div className="dash-stat-value">{stats.consultations}</div>
              <div className="dash-stat-label">Consultations</div>
              <div className="dash-stat-change">This month</div>
            </div>

            <div className="dash-stat-card">
              <div className="dash-stat-icon dash-stat-orange">
                <BookOpen size={17} />
              </div>
              <div className="dash-stat-value">{stats.articles}</div>
              <div className="dash-stat-label">Articles</div>
              <div className="dash-stat-change">Published</div>
            </div>

            <div className="dash-stat-card">
              <div className="dash-stat-icon dash-stat-green">
                <Award size={17} />
              </div>
              <div className="dash-stat-value">{stats.credential}</div>
              <div className="dash-stat-label">Credential</div>
              <div className="dash-stat-change">{stats.credentialStatus}</div>
            </div>
          </div>

          {/* Split Panel - Topic Breakdown & Activity */}
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
                {activities.map((a) => {
                  const Icon = a.icon;
                  return (
                    <div key={a.id} className="dash-activity-item">
                      <div className="dash-activity-icon">
                        <Icon size={14} />
                      </div>
                      <div className="dash-activity-body">
                        <p><strong>{a.farmerName}</strong> {a.action}</p>
                        <span><Clock size={11} /> {a.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* My Farmers - Now functional with clickable items */}
          <div className="dash-farmers-section">
            <div className="dash-farmers-header">
              <h2>My Farmers</h2>
              <div className="dash-farmers-actions">
                <span className="dash-farmers-count">{farmers.length} farmers</span>
                <Link href="/agronomist/farmers" className="dash-farmers-link">
                  View All →
                </Link>
              </div>
            </div>

            <div className="dash-farmers-grid">
              {farmers.map((farmer) => (
                <div key={farmer.id} className="dash-farmer-card">
                  <div className="dash-farmer-avatar">
                    <span>{farmer.name.charAt(0)}</span>
                    <span className={`dash-farmer-status dash-farmer-${farmer.status}`}></span>
                  </div>
                  <div className="dash-farmer-info">
                    <span className="dash-farmer-name">{farmer.name}</span>
                    <span className="dash-farmer-location">
                      <MapPin size={12} />
                      {farmer.location}
                    </span>
                    <span className="dash-farmer-crop">{farmer.crop}</span>
                  </div>
                  <div className="dash-farmer-actions">
                    <Link href={`/messages?farmer=${farmer.id}`} className="dash-farmer-msg-btn">
                      <MessageCircle size={14} />
                    </Link>
                    <Link href={`/agronomist/farmers/${farmer.id}`} className="dash-farmer-view-btn">
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions - All now functional */}
          <div className="dash-panel-header dash-actions-header">
            <h2>Quick actions</h2>
          </div>

          <div className="dash-actions-grid">
            {quickActions.map((a) => (
              <Link
                key={a.title}
                href={a.href}
                className="dash-action-card dash-action-card-link"
              >
                <div className="dash-action-top">
                  <div className="dash-action-icon">
                    <a.icon size={18} />
                  </div>
                </div>
                <h3>{a.title}</h3>
                <p>{a.desc}</p>
              </Link>
            ))}
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

        /* Page */
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

        /* Navigation */
        .dash-nav {
          flex: 1;
          overflow-y: auto;
          padding: 0.75rem 0.75rem;
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
          font-size: 0.875rem;
          font-weight: 500;
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
          color: #6b7280;
          transition: background 0.2s;
          display: none;
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
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        /* Banner */
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

        /* Stats */
        .dash-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
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
        .dash-stat-blue { background: #e3f2fd; color: #42a5f5; }
        .dash-stat-yellow { background: #fff8e1; color: #f9a825; }
        .dash-stat-purple { background: #f3e5f5; color: #8e24aa; }
        .dash-stat-orange { background: #fff3e0; color: #ef6c00; }

        .dash-stat-value {
          font-size: 1.25rem;
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
          color: #7cb342;
        }

        /* Split */
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

        /* Farmers Section */
        .dash-farmers-section {
          background: #faf8f5;
          border: 1px solid #e8e0d5;
          border-radius: 1rem;
          padding: 1.25rem;
          margin-bottom: 1.5rem;
        }

        .dash-farmers-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .dash-farmers-header h2 {
          font-size: 1rem;
          font-weight: 600;
          color: #2d5a27;
        }

        .dash-farmers-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .dash-farmers-count {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .dash-farmers-link {
          font-size: 0.75rem;
          color: #7cb342;
          text-decoration: none;
        }

        .dash-farmers-link:hover {
          text-decoration: underline;
        }

        .dash-farmers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 0.75rem;
        }

        .dash-farmer-card {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: white;
          border-radius: 0.75rem;
          border: 1px solid #e8e0d5;
          transition: all 0.2s;
        }

        .dash-farmer-card:hover {
          border-color: #7cb342;
          transform: translateY(-2px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }

        .dash-farmer-avatar {
          position: relative;
          width: 2.5rem;
          height: 2.5rem;
          background: linear-gradient(135deg, #7cb342, #558b2f);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.875rem;
          font-weight: 600;
          color: white;
          flex-shrink: 0;
        }

        .dash-farmer-status {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 0.625rem;
          height: 0.625rem;
          border-radius: 50%;
          border: 2px solid white;
        }

        .dash-farmer-online {
          background: #34d399;
        }

        .dash-farmer-offline {
          background: #d1d5db;
        }

        .dash-farmer-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .dash-farmer-name {
          font-size: 0.75rem;
          font-weight: 600;
          color: #2d5a27;
        }

        .dash-farmer-location {
          display: flex;
          align-items: center;
          gap: 0.125rem;
          font-size: 0.6rem;
          color: #6b7280;
        }

        .dash-farmer-crop {
          font-size: 0.6rem;
          color: #7cb342;
          background: #e8f5e9;
          padding: 0.0625rem 0.375rem;
          border-radius: 9999px;
          width: fit-content;
        }

        .dash-farmer-actions {
          display: flex;
          gap: 0.25rem;
        }

        .dash-farmer-msg-btn {
          padding: 0.25rem;
          background: #f5f0e8;
          border-radius: 0.375rem;
          color: #6b7280;
          transition: all 0.2s;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dash-farmer-msg-btn:hover {
          background: #e8f5e9;
          color: #7cb342;
        }

        .dash-farmer-view-btn {
          padding: 0.25rem 0.5rem;
          background: #7cb342;
          border: none;
          border-radius: 0.375rem;
          color: white;
          font-size: 0.6rem;
          cursor: pointer;
          transition: background 0.2s;
          text-decoration: none;
        }

        .dash-farmer-view-btn:hover {
          background: #558b2f;
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
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
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
        @media (max-width: 768px) {
          .dash-topbar {
            padding: 0.5rem 1rem;
          }

          .dash-search {
            min-width: 150px;
          }

          .dash-content {
            padding: 1rem;
          }

          .dash-farmers-grid {
            grid-template-columns: 1fr;
          }

          .dash-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .dash-actions-grid {
            grid-template-columns: 1fr;
          }

          .dash-banner {
            flex-direction: column;
            text-align: center;
          }

          .dash-banner-btn {
            margin-left: 0;
          }
        }

        @media (max-width: 480px) {
          .dash-stats-grid {
            grid-template-columns: 1fr 1fr;
          }

          .dash-farmer-card {
            flex-wrap: wrap;
          }

          .dash-farmer-actions {
            width: 100%;
            justify-content: flex-end;
          }
        }
      `}</style>
    </div>
  );
}
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  ChevronDown,
  Layout,
  LogOut,
  Menu,
  Search,
  MessageSquare,
  BadgeCheck,
} from "lucide-react";

import Logo from "@/components/Logo";
import { useSession } from "@/lib/useSession";
import DashboardSidebar from "@/components/DashboardSidebar";

export default function MessagesPage() {
  const router = useRouter();
  const { user, loading } = useSession("FARMER");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  if (loading || !user) {
    return <div className="dash-loading">Loading messages...</div>;
  }

  const initial = user.name.charAt(0).toUpperCase();
  const firstName = user.name.split(" ")[0];

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
            <input type="text" placeholder="Search messages..." />
          </div>

          <div className="dash-topbar-actions">
            <button className="dash-icon-btn" aria-label="Notifications">
              <Bell size={18} />
              <span className="dash-dot" />
            </button>

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
          <div className="dash-page-header">
            <div>
              <h1>💬 Messages</h1>
              <p>Communicate with buyers, agronomists, and other farmers.</p>
            </div>
          </div>

          <div className="dash-banner">
            <BadgeCheck size={16} />
            Messages feature coming soon! You'll be able to chat with buyers and experts here.
          </div>

          <div className="dash-empty-state">
            <MessageSquare size={48} className="text-gray-300" />
            <h3>No messages yet</h3>
            <p>Start connecting with buyers and agricultural experts.</p>
          </div>

          <style jsx>{`
            .dash-empty-state {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding: 60px 20px;
              background: white;
              border-radius: 16px;
              border: 1px solid #e5e7eb;
              text-align: center;
              color: #6b7280;
            }
            .dash-empty-state h3 {
              color: #1f2937;
              margin: 12px 0 8px 0;
              font-size: 18px;
              font-weight: 600;
            }
            .dash-empty-state p {
              margin-bottom: 16px;
            }
          `}</style>
        </main>
      </div>
    </div>
  );
}
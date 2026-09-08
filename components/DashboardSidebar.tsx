"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sprout,
  Store,
  Package,
  Activity,
  Cloud,
  Bot,
  MessageSquare,
  CalendarDays,
  Stethoscope,
  BookOpen,
  Settings,
  LogOut,
  X,
  Menu,
} from "lucide-react";

import Logo from "./Logo";

interface SidebarProps {
  user: {
    name: string;
    role: string;
    photo?: string | null;
  };
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/farmer" },
  { label: "My Farms", icon: Sprout, href: "/farmer/farms" },
  { label: "Marketplace", icon: Store, href: "/farmer/marketplace" },
  { label: "Orders", icon: Package, href: "/farmer/orders" },
  { label: "IoT Devices", icon: Activity, href: "/farmer/iot" },
  { label: "Weather", icon: Cloud, href: "/weather" },
  { label: "AI Assistant", icon: Bot, href: "/ai-chat" },
  { label: "Messages", icon: MessageSquare, href: "/messages" },
  { label: "Consultations", icon: CalendarDays, href: "/farmer/consultations" },
  { label: "Diagnosis", icon: Stethoscope, href: "/farmer/diagnosis" },
  { label: "Articles", icon: BookOpen, href: "/articles" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

export default function DashboardSidebar({ user, onLogout, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const initial = user.name?.charAt(0).toUpperCase() || "U";

  // Split items into Main and Support sections
  const mainItems = navItems.slice(0, 7);
  const supportItems = navItems.slice(7);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div className="dash-overlay" onClick={onClose} />
      )}

      <aside className={`dash-sidebar ${isOpen ? "dash-sidebar-open" : ""}`}>
        <div className="dash-sidebar-top">
          <Link href="/" className="dash-logo" onClick={onClose}>
            <Logo width={130} />
          </Link>
          <button
            className="dash-sidebar-close"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="dash-nav">
          <span className="dash-nav-label">Main</span>
          {mainItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`dash-nav-item ${isActive ? "dash-nav-active" : ""}`}
                onClick={onClose}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            );
          })}

          <span className="dash-nav-label">Support</span>
          {supportItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`dash-nav-item ${isActive ? "dash-nav-active" : ""}`}
                onClick={onClose}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="dash-sidebar-bottom">
          <div className="dash-admin-card">
            <div className="dash-avatar">
              {user.photo ? (
                <img src={user.photo} alt={user.name} className="dash-avatar-img" />
              ) : (
                initial
              )}
            </div>
            <div>
              <strong>{user.name}</strong>
              <span>{user.role?.toLowerCase() || "User"} account</span>
            </div>
          </div>
          <button className="dash-logout" onClick={onLogout}>
            <LogOut size={15} />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}
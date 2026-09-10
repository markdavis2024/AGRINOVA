"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sprout,
  Store,
  Package,
  Heart,
  MessageSquare,
  Receipt,
  Settings,
  LogOut,
  X,
  ChevronRight,
  User,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface BuyerSidebarProps {
  user: User;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/buyer" },
  { label: "Marketplace", icon: Store, href: "/marketplace" },
  { label: "My Orders", icon: Package, href: "/buyer/orders" },
  { label: "Saved Farmers", icon: Heart, href: "/buyer/saved-farmers" },
  { label: "Messages", icon: MessageSquare, href: "/messages" },
  { label: "Order History", icon: Receipt, href: "/buyer/orders?status=DELIVERED" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

export default function BuyerSidebar({ user, onLogout, isOpen, onClose }: BuyerSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        {/* Header */}
        <div className="sidebar-header">
          <Link href="/buyer" className="sidebar-brand">
            <span className="sidebar-brand-icon">🌱</span>
            <span className="sidebar-brand-text">AGRINOVA</span>
          </Link>
          <button className="sidebar-close-btn" onClick={onClose}>
            <X className="sidebar-close-icon" />
          </button>
        </div>

        {/* User Info */}
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            <span className="sidebar-avatar-text">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{user.name}</span>
            <span className="sidebar-user-role">Buyer</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
                            (item.href === "/buyer" && pathname === "/buyer") ||
                            (item.href === "/buyer/saved-farmers" && pathname === "/buyer/saved-farmers");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-nav-item ${isActive ? 'sidebar-nav-item-active' : ''}`}
                onClick={onClose}
              >
                <Icon className="sidebar-nav-icon" />
                <span className="sidebar-nav-label">{item.label}</span>
                {isActive && <ChevronRight className="sidebar-nav-chevron" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <button onClick={onLogout} className="sidebar-logout-btn">
            <LogOut className="sidebar-logout-icon" />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      <style jsx>{`
        /* Overlay */
        .sidebar-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          z-index: 40;
          display: none;
        }

        @media (max-width: 768px) {
          .sidebar-overlay {
            display: block;
          }
        }

        /* Sidebar */
        .sidebar {
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

        .sidebar-open {
          transform: translateX(0);
        }

        @media (min-width: 768px) {
          .sidebar {
            position: sticky;
            top: 0;
            transform: translateX(0);
            height: 100vh;
          }
        }

        /* Header */
        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid #e8e0d5;
          flex-shrink: 0;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
        }

        .sidebar-brand-icon {
          font-size: 1.5rem;
        }

        .sidebar-brand-text {
          font-size: 1.125rem;
          font-weight: 700;
          color: #2d5a27;
        }

        .sidebar-close-btn {
          padding: 0.25rem;
          background: none;
          border: none;
          border-radius: 0.375rem;
          cursor: pointer;
          display: none;
          transition: background 0.2s;
        }

        .sidebar-close-btn:hover {
          background: #f5f0e8;
        }

        .sidebar-close-icon {
          width: 1.25rem;
          height: 1.25rem;
          color: #6b7280;
        }

        @media (max-width: 768px) {
          .sidebar-close-btn {
            display: block;
          }
        }

        /* User Info */
        .sidebar-user {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid #e8e0d5;
        }

        .sidebar-avatar {
          width: 2.5rem;
          height: 2.5rem;
          background: linear-gradient(135deg, #7cb342, #558b2f);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .sidebar-avatar-text {
          font-size: 1rem;
          font-weight: 600;
          color: white;
        }

        .sidebar-user-info {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .sidebar-user-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: #2d5a27;
        }

        .sidebar-user-role {
          font-size: 0.75rem;
          color: #6b7280;
          text-transform: capitalize;
        }

        /* Navigation */
        .sidebar-nav {
          flex: 1;
          overflow-y: auto;
          padding: 0.75rem 0.75rem;
        }

        .sidebar-nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.625rem 0.75rem;
          border-radius: 0.5rem;
          color: #6b7280;
          text-decoration: none;
          transition: all 0.2s;
          margin-bottom: 0.125rem;
          position: relative;
        }

        .sidebar-nav-item:hover {
          background: #f5f0e8;
          color: #2d5a27;
        }

        .sidebar-nav-item-active {
          background: #e8f5e9;
          color: #7cb342;
        }

        .sidebar-nav-item-active:hover {
          background: #e8f5e9;
        }

        .sidebar-nav-icon {
          width: 1.25rem;
          height: 1.25rem;
          flex-shrink: 0;
        }

        .sidebar-nav-label {
          font-size: 0.875rem;
          font-weight: 500;
        }

        .sidebar-nav-chevron {
          width: 1rem;
          height: 1rem;
          margin-left: auto;
          color: #7cb342;
        }

        /* Footer */
        .sidebar-footer {
          padding: 0.75rem 0.75rem;
          border-top: 1px solid #e8e0d5;
          flex-shrink: 0;
        }

        .sidebar-logout-btn {
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

        .sidebar-logout-btn:hover {
          background: #fef2f2;
        }

        .sidebar-logout-icon {
          width: 1.25rem;
          height: 1.25rem;
        }
      `}</style>
    </>
  );
}
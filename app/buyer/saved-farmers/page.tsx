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
  X,
  Heart,
  Star,
  MapPin,
  User,
  MessageSquare,
  ShoppingCart,
  Check,
  Clock,
  Award,
  Leaf,
  Sprout,
  LayoutDashboard,
  Store,
  Package,
  Receipt,
  Settings,
} from "lucide-react";
import { useAnySession } from "@/lib/useSession";
import NotificationBell from "@/components/NotificationBell";

interface SavedFarmer {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  specialties: string[];
  products: string[];
  image: string;
  savedDate: Date;
  lastOrder: string;
  totalOrders: number;
  online: boolean;
}

const mockSavedFarmers: SavedFarmer[] = [
  {
    id: "farmer1",
    name: "Jean Baptiste",
    location: "Bamenda, Cameroon",
    rating: 4.8,
    reviews: 34,
    specialties: ["Maize", "Cassava", "Groundnuts"],
    products: ["Fresh Maize", "Cassava Tubers"],
    image: "JB",
    savedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    lastOrder: "2 days ago",
    totalOrders: 5,
    online: true,
  },
  {
    id: "farmer2",
    name: "Marie Claire",
    location: "Yaoundé, Cameroon",
    rating: 4.9,
    reviews: 56,
    specialties: ["Tomatoes", "Vegetables", "Peppers"],
    products: ["Organic Tomatoes", "Fresh Peppers"],
    image: "MC",
    savedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
    lastOrder: "1 week ago",
    totalOrders: 3,
    online: false,
  },
  {
    id: "farmer3",
    name: "Paul Atanga",
    location: "Douala, Cameroon",
    rating: 4.5,
    reviews: 28,
    specialties: ["Cassava", "Plantains", "Cocoa"],
    products: ["Cassava Tubers", "Fresh Plantains"],
    image: "PA",
    savedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    lastOrder: "5 days ago",
    totalOrders: 2,
    online: true,
  },
  {
    id: "farmer4",
    name: "Amina Ndongo",
    location: "Buea, Cameroon",
    rating: 4.7,
    reviews: 42,
    specialties: ["Cocoa", "Coffee", "Bananas"],
    products: ["Cocoa Beans", "Fresh Bananas"],
    image: "AN",
    savedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
    lastOrder: "2 weeks ago",
    totalOrders: 4,
    online: false,
  },
  {
    id: "farmer5",
    name: "Joseph Mbarga",
    location: "Limbe, Cameroon",
    rating: 4.6,
    reviews: 31,
    specialties: ["Plantains", "Bananas", "Cassava"],
    products: ["Fresh Plantains", "Cassava Tubers"],
    image: "JM",
    savedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    lastOrder: "3 days ago",
    totalOrders: 3,
    online: false,
  },
  {
    id: "farmer6",
    name: "Sylvie Ndam",
    location: "Garoua, Cameroon",
    rating: 4.4,
    reviews: 19,
    specialties: ["Groundnuts", "Maize", "Cotton"],
    products: ["Groundnuts", "Fresh Maize"],
    image: "SN",
    savedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    lastOrder: "4 days ago",
    totalOrders: 1,
    online: false,
  },
];

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/buyer" },
  { label: "Marketplace", icon: Store, href: "/marketplace" },
  { label: "My Orders", icon: Package, href: "/buyer/orders" },
  { label: "Saved Farmers", icon: Heart, href: "/buyer/saved-farmers", active: true },
  { label: "Messages", icon: MessageSquare, href: "/messages" },
  { label: "Order History", icon: Receipt, href: "/buyer/orders?status=DELIVERED" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

export default function SavedFarmersPage() {
  const router = useRouter();
  const { user, loading } = useAnySession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOnline, setFilterOnline] = useState<"all" | "online" | "offline">("all");

  if (loading || !user) {
    return (
      <div className="saved-loading">
        <div className="saved-loading-spinner"></div>
        <span>Loading saved farmers...</span>
      </div>
    );
  }

  const initial = user.name.charAt(0).toUpperCase();
  const firstName = user.name.split(" ")[0];

  const filteredFarmers = mockSavedFarmers.filter(farmer => {
    const matchesSearch = farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          farmer.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          farmer.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterOnline === "all" || (filterOnline === "online" ? farmer.online : !farmer.online);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="saved-page">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="saved-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar - Same style as farmer */}
      <aside className={`saved-sidebar ${sidebarOpen ? "saved-sidebar-open" : ""}`}>
        <div className="saved-sidebar-top">
          <Link href="/" className="saved-logo">
            <span className="saved-logo-icon">🌱</span>
            <span className="saved-logo-text">AGRINOVA</span>
          </Link>
          <button
            className="saved-sidebar-close"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <div className="saved-sidebar-user">
          <div className="saved-sidebar-avatar">
            <span>{initial}</span>
          </div>
          <div className="saved-sidebar-user-info">
            <span className="saved-sidebar-user-name">{user.name}</span>
            <span className="saved-sidebar-user-role">Buyer</span>
          </div>
        </div>

        <nav className="saved-nav">
          <span className="saved-nav-label">Main</span>
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`saved-nav-item ${item.active ? "saved-nav-active" : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="saved-sidebar-bottom">
          <button className="saved-logout" onClick={() => router.push("/login")}>
            <LogOut size={18} />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="saved-main">
        {/* Topbar */}
        <header className="saved-topbar">
          <button
            className="saved-menu-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <div className="saved-search">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search saved farmers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="saved-topbar-actions">
            <NotificationBell userId={user.id} />

            <div className="saved-profile">
              <button
                className="saved-profile-btn"
                onClick={() => setProfileOpen((v) => !v)}
              >
                <div className="saved-avatar saved-avatar-small">{initial}</div>
                <span>{firstName}</span>
                <ChevronDown size={14} />
              </button>

              {profileOpen && (
                <div className="saved-profile-menu">
                  <Link href="/" className="saved-profile-menu-item">
                    <Layout size={14} />
                    Back to landing page
                  </Link>
                  <Link href="/buyer" className="saved-profile-menu-item">
                    <Layout size={14} />
                    Dashboard
                  </Link>
                  <button
                    className="saved-profile-menu-item"
                    onClick={() => router.push("/login")}
                  >
                    <LogOut size={14} />
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="saved-content">
          <div className="saved-header">
            <div>
              <h1>Saved Farmers ❤️</h1>
              <p>Your trusted farmers, ready to supply quality produce</p>
            </div>
            <div className="saved-stats">
              <div className="saved-stat">
                <span className="saved-stat-value">{mockSavedFarmers.length}</span>
                <span className="saved-stat-label">Saved Farmers</span>
              </div>
              <div className="saved-stat">
                <span className="saved-stat-value">
                  {mockSavedFarmers.filter(f => f.online).length}
                </span>
                <span className="saved-stat-label">Online Now</span>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="saved-filters">
            <button
              className={`saved-filter-btn ${filterOnline === "all" ? "saved-filter-active" : ""}`}
              onClick={() => setFilterOnline("all")}
            >
              All
            </button>
            <button
              className={`saved-filter-btn ${filterOnline === "online" ? "saved-filter-active" : ""}`}
              onClick={() => setFilterOnline("online")}
            >
              <span className="saved-online-dot"></span>
              Online
            </button>
            <button
              className={`saved-filter-btn ${filterOnline === "offline" ? "saved-filter-active" : ""}`}
              onClick={() => setFilterOnline("offline")}
            >
              Offline
            </button>
          </div>

          {/* Farmers Grid */}
          <div className="saved-grid">
            {filteredFarmers.length === 0 ? (
              <div className="saved-empty">
                <Heart size={48} />
                <h3>No saved farmers</h3>
                <p>Start saving farmers you trust for quick reordering</p>
                <Link href="/marketplace" className="saved-empty-btn">
                  Browse Marketplace
                </Link>
              </div>
            ) : (
              filteredFarmers.map((farmer) => (
                <div key={farmer.id} className="saved-card">
                  <div className="saved-card-header">
                    <div className="saved-card-avatar">
                      <span>{farmer.image}</span>
                      {farmer.online && <span className="saved-online-dot-card"></span>}
                    </div>
                    <div className="saved-card-info">
                      <h3>{farmer.name}</h3>
                      <div className="saved-card-location">
                        <MapPin size={14} />
                        <span>{farmer.location}</span>
                      </div>
                      <div className="saved-card-rating">
                        <Star size={14} className="saved-card-star" />
                        <span>{farmer.rating}</span>
                        <span className="saved-card-reviews">({farmer.reviews} reviews)</span>
                      </div>
                    </div>
                    <button className="saved-card-unsave">
                      <Heart size={18} className="saved-card-heart-filled" />
                    </button>
                  </div>

                  <div className="saved-card-body">
                    <div className="saved-card-specialties">
                      {farmer.specialties.map((specialty, i) => (
                        <span key={i} className="saved-card-specialty">
                          <Sprout size={12} />
                          {specialty}
                        </span>
                      ))}
                    </div>
                    <div className="saved-card-products">
                      <span className="saved-card-products-label">Recent products:</span>
                      <span className="saved-card-products-list">
                        {farmer.products.join(", ")}
                      </span>
                    </div>
                    <div className="saved-card-stats">
                      <div className="saved-card-stat">
                        <span className="saved-card-stat-label">Orders</span>
                        <span className="saved-card-stat-value">{farmer.totalOrders}</span>
                      </div>
                      <div className="saved-card-stat">
                        <span className="saved-card-stat-label">Last Order</span>
                        <span className="saved-card-stat-value">{farmer.lastOrder}</span>
                      </div>
                      <div className="saved-card-stat">
                        <span className="saved-card-stat-label">Saved</span>
                        <span className="saved-card-stat-value">
                          {farmer.savedDate.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="saved-card-footer">
                    <Link href={`/messages?farmer=${farmer.id}`} className="saved-card-message-btn">
                      <MessageSquare size={16} />
                      Message
                    </Link>
                    <Link href={`/marketplace?farmer=${farmer.id}`} className="saved-card-order-btn">
                      <ShoppingCart size={16} />
                      Order Now
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Page */
        .saved-page {
          display: flex;
          min-height: 100vh;
          background: #f5f0e8;
        }

        /* Loading */
        .saved-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: #f5f0e8;
          gap: 0.75rem;
          color: #6b7280;
        }

        .saved-loading-spinner {
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

        /* Overlay */
        .saved-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          z-index: 40;
          display: none;
        }

        @media (max-width: 768px) {
          .saved-overlay {
            display: block;
          }
        }

        /* Sidebar */
        .saved-sidebar {
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

        .saved-sidebar-open {
          transform: translateX(0);
        }

        @media (min-width: 768px) {
          .saved-sidebar {
            position: sticky;
            top: 0;
            transform: translateX(0);
            height: 100vh;
          }
        }

        .saved-sidebar-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid #e8e0d5;
        }

        .saved-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
        }

        .saved-logo-icon {
          font-size: 1.5rem;
        }

        .saved-logo-text {
          font-size: 1.125rem;
          font-weight: 700;
          color: #2d5a27;
        }

        .saved-sidebar-close {
          padding: 0.25rem;
          background: none;
          border: none;
          border-radius: 0.375rem;
          cursor: pointer;
          display: none;
          color: #6b7280;
        }

        .saved-sidebar-close:hover {
          background: #f5f0e8;
        }

        @media (max-width: 768px) {
          .saved-sidebar-close {
            display: block;
          }
        }

        .saved-sidebar-user {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid #e8e0d5;
        }

        .saved-sidebar-avatar {
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

        .saved-sidebar-user-info {
          display: flex;
          flex-direction: column;
        }

        .saved-sidebar-user-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: #2d5a27;
        }

        .saved-sidebar-user-role {
          font-size: 0.75rem;
          color: #6b7280;
        }

        /* Navigation */
        .saved-nav {
          flex: 1;
          overflow-y: auto;
          padding: 0.75rem;
        }

        .saved-nav-label {
          display: block;
          font-size: 0.65rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #9ca3af;
          padding: 0.5rem 0.75rem;
        }

        .saved-nav-item {
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

        .saved-nav-item:hover {
          background: #f5f0e8;
          color: #2d5a27;
        }

        .saved-nav-active {
          background: #e8f5e9;
          color: #7cb342;
        }

        .saved-nav-active:hover {
          background: #e8f5e9;
        }

        .saved-sidebar-bottom {
          padding: 0.75rem 0.75rem;
          border-top: 1px solid #e8e0d5;
        }

        .saved-logout {
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

        .saved-logout:hover {
          background: #fef2f2;
        }

        /* Main Content */
        .saved-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        /* Topbar */
        .saved-topbar {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 1.5rem;
          background: #faf8f5;
          border-bottom: 1px solid #e8e0d5;
          flex-shrink: 0;
          flex-wrap: wrap;
        }

        .saved-menu-btn {
          padding: 0.5rem;
          background: none;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          color: #6b7280;
          transition: background 0.2s;
          display: none;
        }

        .saved-menu-btn:hover {
          background: #f5f0e8;
        }

        @media (max-width: 768px) {
          .saved-menu-btn {
            display: block;
          }
        }

        .saved-search {
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

        .saved-search:focus-within {
          border-color: #7cb342;
          box-shadow: 0 0 0 3px rgba(124, 179, 66, 0.1);
        }

        .saved-search input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 0.875rem;
          background: transparent;
          color: #2d5a27;
          min-width: 0;
        }

        .saved-search input::placeholder {
          color: #9ca3af;
        }

        .saved-search svg {
          color: #9ca3af;
          flex-shrink: 0;
        }

        .saved-topbar-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-shrink: 0;
        }

        .saved-profile {
          position: relative;
        }

        .saved-profile-btn {
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

        .saved-profile-btn:hover {
          background: #f5f0e8;
        }

        .saved-avatar {
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

        .saved-avatar-small {
          width: 2rem;
          height: 2rem;
          font-size: 0.7rem;
        }

        .saved-profile-menu {
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

        .saved-profile-menu-item {
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

        .saved-profile-menu-item:hover {
          background: #f5f0e8;
          color: #2d5a27;
        }

        /* Content */
        .saved-content {
          flex: 1;
          padding: 1.5rem;
          overflow-y: auto;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        /* Header */
        .saved-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .saved-header h1 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #2d5a27;
        }

        .saved-header p {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .saved-stats {
          display: flex;
          gap: 1.5rem;
        }

        .saved-stat {
          text-align: center;
        }

        .saved-stat-value {
          display: block;
          font-size: 1.25rem;
          font-weight: 700;
          color: #2d5a27;
        }

        .saved-stat-label {
          font-size: 0.625rem;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* Filters */
        .saved-filters {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 1.5rem;
        }

        .saved-filter-btn {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.375rem 0.75rem;
          border: 1px solid #e8e0d5;
          border-radius: 9999px;
          font-size: 0.75rem;
          color: #6b7280;
          background: #faf8f5;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }

        .saved-filter-btn:hover {
          border-color: #7cb342;
          color: #2d5a27;
        }

        .saved-filter-active {
          background: #7cb342;
          color: white;
          border-color: #7cb342;
        }

        .saved-filter-active:hover {
          background: #558b2f;
          color: white;
        }

        .saved-online-dot {
          width: 0.5rem;
          height: 0.5rem;
          background: #34d399;
          border-radius: 50%;
        }

        /* Grid */
        .saved-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .saved-card {
          background: #faf8f5;
          border: 1px solid #e8e0d5;
          border-radius: 1rem;
          overflow: hidden;
          transition: all 0.2s;
        }

        .saved-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          border-color: #7cb342;
        }

        .saved-card-header {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 1rem;
        }

        .saved-card-avatar {
          position: relative;
          width: 3.5rem;
          height: 3.5rem;
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

        .saved-online-dot-card {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 0.75rem;
          height: 0.75rem;
          background: #34d399;
          border: 2px solid #faf8f5;
          border-radius: 50%;
        }

        .saved-card-info {
          flex: 1;
        }

        .saved-card-info h3 {
          font-size: 0.875rem;
          font-weight: 600;
          color: #2d5a27;
          margin: 0;
        }

        .saved-card-location {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.7rem;
          color: #6b7280;
        }

        .saved-card-rating {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.7rem;
          color: #2d5a27;
        }

        .saved-card-star {
          color: #f9a825;
          fill: #f9a825;
        }

        .saved-card-reviews {
          color: #9ca3af;
        }

        .saved-card-unsave {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.25rem;
        }

        .saved-card-heart-filled {
          color: #ef5350;
          fill: #ef5350;
        }

        .saved-card-body {
          padding: 0 1rem 1rem 1rem;
        }

        .saved-card-specialties {
          display: flex;
          flex-wrap: wrap;
          gap: 0.25rem;
          margin-bottom: 0.5rem;
        }

        .saved-card-specialty {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.125rem 0.5rem;
          background: #e8f5e9;
          border-radius: 9999px;
          font-size: 0.625rem;
          color: #7cb342;
        }

        .saved-card-products {
          font-size: 0.75rem;
          color: #6b7280;
          margin-bottom: 0.5rem;
        }

        .saved-card-products-label {
          font-weight: 500;
          color: #2d5a27;
        }

        .saved-card-products-list {
          color: #6b7280;
        }

        .saved-card-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
          padding-top: 0.5rem;
          border-top: 1px solid #f5f0e8;
        }

        .saved-card-stat {
          text-align: center;
        }

        .saved-card-stat-label {
          display: block;
          font-size: 0.55rem;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .saved-card-stat-value {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          color: #2d5a27;
        }

        .saved-card-footer {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border-top: 1px solid #f5f0e8;
        }

        .saved-card-message-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.375rem;
          padding: 0.375rem;
          background: #f5f0e8;
          border: 1px solid #e8e0d5;
          border-radius: 0.5rem;
          font-size: 0.7rem;
          font-weight: 500;
          color: #6b7280;
          text-decoration: none;
          transition: all 0.2s;
        }

        .saved-card-message-btn:hover {
          border-color: #7cb342;
          color: #2d5a27;
        }

        .saved-card-order-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.375rem;
          padding: 0.375rem;
          background: #7cb342;
          border: none;
          border-radius: 0.5rem;
          font-size: 0.7rem;
          font-weight: 500;
          color: white;
          text-decoration: none;
          transition: background 0.2s;
        }

        .saved-card-order-btn:hover {
          background: #558b2f;
        }

        /* Empty */
        .saved-empty {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          background: #faf8f5;
          border: 1px solid #e8e0d5;
          border-radius: 1rem;
          color: #9ca3af;
          text-align: center;
        }

        .saved-empty h3 {
          font-size: 1.125rem;
          color: #2d5a27;
          margin: 1rem 0 0.25rem 0;
        }

        .saved-empty p {
          font-size: 0.875rem;
          margin: 0 0 1rem 0;
        }

        .saved-empty-btn {
          padding: 0.5rem 1.5rem;
          background: #7cb342;
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
          text-decoration: none;
        }

        .saved-empty-btn:hover {
          background: #558b2f;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .saved-topbar {
            padding: 0.5rem 1rem;
          }

          .saved-search {
            min-width: 150px;
          }

          .saved-content {
            padding: 1rem;
          }

          .saved-grid {
            grid-template-columns: 1fr;
          }

          .saved-header {
            flex-direction: column;
          }

          .saved-stats {
            width: 100%;
            justify-content: space-around;
          }
        }

        @media (max-width: 480px) {
          .saved-topbar {
            gap: 0.5rem;
          }

          .saved-card-stats {
            grid-template-columns: repeat(3, 1fr);
          }

          .saved-card-footer {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
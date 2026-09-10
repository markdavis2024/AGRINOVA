"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Bell,
  ChevronDown,
  Layout,
  LogOut,
  Menu,
  Search,
  X,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  ArrowLeft,
  Filter,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAnySession } from "@/lib/useSession";
import NotificationBell from "@/components/NotificationBell";

interface Order {
  id: string;
  productName: string;
  farmer: string;
  farmerLocation: string;
  date: string;
  total: number;
  quantity: number;
  unit: string;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  delivery: string;
  image: string;
}

const mockOrders: Order[] = [
  {
    id: "ORD-001",
    productName: "Fresh Maize",
    farmer: "Jean Baptiste",
    farmerLocation: "Bamenda, Cameroon",
    date: "2024-03-20",
    total: 25000,
    quantity: 50,
    unit: "kg",
    status: "delivered",
    delivery: "Delivered on March 22",
    image: "/AGRINOVA-logo.png",
  },
  {
    id: "ORD-002",
    productName: "Organic Tomatoes",
    farmer: "Marie Claire",
    farmerLocation: "Yaoundé, Cameroon",
    date: "2024-03-18",
    total: 16000,
    quantity: 20,
    unit: "kg",
    status: "shipped",
    delivery: "Expected March 25",
    image: "/AGRINOVA-logo.png",
  },
  {
    id: "ORD-003",
    productName: "Cassava Tubers",
    farmer: "Paul Atanga",
    farmerLocation: "Douala, Cameroon",
    date: "2024-03-15",
    total: 30000,
    quantity: 100,
    unit: "kg",
    status: "processing",
    delivery: "Processing at farm",
    image: "/AGRINOVA-logo.png",
  },
  {
    id: "ORD-004",
    productName: "Cocoa Beans",
    farmer: "Amina Ndongo",
    farmerLocation: "Buea, Cameroon",
    date: "2024-03-12",
    total: 125000,
    quantity: 50,
    unit: "kg",
    status: "confirmed",
    delivery: "Awaiting pickup",
    image: "/AGRINOVA-logo.png",
  },
  {
    id: "ORD-005",
    productName: "Fresh Plantains",
    farmer: "Joseph Mbarga",
    farmerLocation: "Limbe, Cameroon",
    date: "2024-03-10",
    total: 8000,
    quantity: 20,
    unit: "bunches",
    status: "pending",
    delivery: "Pending confirmation",
    image: "/AGRINOVA-logo.png",
  },
];

const statusColors = {
  pending: { bg: "bg-yellow-50", text: "text-yellow-600", border: "border-yellow-200", icon: Clock },
  confirmed: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200", icon: CheckCircle },
  processing: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200", icon: Package },
  shipped: { bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-200", icon: Truck },
  delivered: { bg: "bg-green-50", text: "text-green-600", border: "border-green-200", icon: CheckCircle },
  cancelled: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200", icon: AlertCircle },
};

const statusLabels = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

function OrdersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAnySession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.farmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading || !user) {
    return (
      <div className="orders-loading">
        <div className="orders-loading-spinner"></div>
        <span>Loading your orders...</span>
      </div>
    );
  }

  const initial = user.name.charAt(0).toUpperCase();
  const firstName = user.name.split(" ")[0];

  return (
    <div className="orders-page">
      {/* Topbar */}
      <header className="orders-topbar">
        <button
          className="orders-menu-btn"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <div className="orders-brand">
          <span className="orders-brand-icon">🌱</span>
          <span className="orders-brand-text">AGRINOVA</span>
          <span className="orders-brand-badge">My Orders</span>
        </div>

        <div className="orders-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="orders-topbar-actions">
          <NotificationBell userId={user.id} />

          <div className="orders-profile">
            <button
              className="orders-profile-btn"
              onClick={() => setProfileOpen((v) => !v)}
            >
              <div className="orders-avatar orders-avatar-small">{initial}</div>
              <span>{firstName}</span>
              <ChevronDown size={14} />
            </button>

            {profileOpen && (
              <div className="orders-profile-menu">
                <Link href="/" className="orders-profile-menu-item">
                  <Layout size={14} />
                  Back to landing page
                </Link>
                <Link href="/buyer" className="orders-profile-menu-item">
                  <Layout size={14} />
                  Dashboard
                </Link>
                <button
                  className="orders-profile-menu-item"
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

      {/* Main Content */}
      <div className="orders-content">
        {/* Back Button */}
        <Link href="/buyer" className="orders-back-btn">
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="orders-header">
          <div>
            <h1>My Orders</h1>
            <p>Track and manage all your orders in one place</p>
          </div>
          <div className="orders-stats">
            <div className="orders-stat">
              <span className="orders-stat-value">{mockOrders.length}</span>
              <span className="orders-stat-label">Total Orders</span>
            </div>
            <div className="orders-stat">
              <span className="orders-stat-value">
                {mockOrders.filter(o => o.status === "delivered").length}
              </span>
              <span className="orders-stat-label">Delivered</span>
            </div>
            <div className="orders-stat">
              <span className="orders-stat-value">
                {mockOrders.filter(o => o.status === "shipped" || o.status === "processing").length}
              </span>
              <span className="orders-stat-label">In Transit</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="orders-filters">
          <button
            className={`orders-filter-btn ${filterStatus === "all" ? "orders-filter-active" : ""}`}
            onClick={() => setFilterStatus("all")}
          >
            All
          </button>
          {Object.entries(statusLabels).map(([key, label]) => (
            <button
              key={key}
              className={`orders-filter-btn ${filterStatus === key ? "orders-filter-active" : ""}`}
              onClick={() => setFilterStatus(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="orders-list">
          {filteredOrders.length === 0 ? (
            <div className="orders-empty">
              <Package size={48} />
              <h3>No orders found</h3>
              <p>Try adjusting your search or filter criteria</p>
              <Link href="/marketplace" className="orders-empty-btn">
                Browse Marketplace
              </Link>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const statusColor = statusColors[order.status];
              const StatusIcon = statusColor.icon;
              return (
                <div key={order.id} className="orders-card">
                  <div className="orders-card-header">
                    <div className="orders-card-id">
                      <span className="orders-card-id-label">Order</span>
                      <span className="orders-card-id-value">{order.id}</span>
                    </div>
                    <div className={`orders-card-status ${statusColor.bg} ${statusColor.text} ${statusColor.border}`}>
                      <StatusIcon size={14} />
                      <span>{statusLabels[order.status]}</span>
                    </div>
                  </div>

                  <div className="orders-card-body">
                    <div className="orders-card-product">
                      <div className="orders-card-product-image">
                        <Package size={24} />
                      </div>
                      <div className="orders-card-product-info">
                        <h3>{order.productName}</h3>
                        <p>
                          <span>{order.farmer}</span>
                          <span className="orders-card-product-location">{order.farmerLocation}</span>
                        </p>
                      </div>
                    </div>

                    <div className="orders-card-details">
                      <div className="orders-card-detail">
                        <span className="orders-card-detail-label">Quantity</span>
                        <span className="orders-card-detail-value">
                          {order.quantity} {order.unit}
                        </span>
                      </div>
                      <div className="orders-card-detail">
                        <span className="orders-card-detail-label">Total</span>
                        <span className="orders-card-detail-value">
                          {order.total.toLocaleString()} FCFA
                        </span>
                      </div>
                      <div className="orders-card-detail">
                        <span className="orders-card-detail-label">Date</span>
                        <span className="orders-card-detail-value">
                          {new Date(order.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="orders-card-detail">
                        <span className="orders-card-detail-label">Delivery</span>
                        <span className="orders-card-detail-value">{order.delivery}</span>
                      </div>
                    </div>
                  </div>

                  <div className="orders-card-footer">
                    <button className="orders-card-track-btn">
                      <Eye size={16} />
                      Track Order
                    </button>
                    {order.status === "pending" && (
                      <button className="orders-card-cancel-btn">
                        Cancel Order
                      </button>
                    )}
                    {order.status === "delivered" && (
                      <button className="orders-card-review-btn">
                        Leave Review
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <style jsx>{`
        /* Page */
        .orders-page {
          min-height: 100vh;
          background: #f5f0e8;
        }

        /* Loading */
        .orders-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: #f5f0e8;
          gap: 0.75rem;
          color: #6b7280;
        }

        .orders-loading-spinner {
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

        /* Topbar */
        .orders-topbar {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 1.5rem;
          background: #faf8f5;
          border-bottom: 1px solid #e8e0d5;
          position: sticky;
          top: 0;
          z-index: 10;
          flex-wrap: wrap;
        }

        .orders-menu-btn {
          padding: 0.5rem;
          background: none;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          color: #6b7280;
          transition: background 0.2s;
          display: none;
        }

        .orders-menu-btn:hover {
          background: #f5f0e8;
        }

        @media (max-width: 768px) {
          .orders-menu-btn {
            display: block;
          }
        }

        .orders-brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-shrink: 0;
        }

        .orders-brand-icon {
          font-size: 1.5rem;
        }

        .orders-brand-text {
          font-size: 1.125rem;
          font-weight: 700;
          color: #2d5a27;
        }

        .orders-brand-badge {
          font-size: 0.625rem;
          color: #7cb342;
          background: #e8f5e9;
          padding: 0.125rem 0.5rem;
          border-radius: 9999px;
          font-weight: 500;
          text-transform: uppercase;
        }

        .orders-search {
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

        .orders-search:focus-within {
          border-color: #7cb342;
          box-shadow: 0 0 0 3px rgba(124, 179, 66, 0.1);
        }

        .orders-search input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 0.875rem;
          background: transparent;
          color: #2d5a27;
          min-width: 0;
        }

        .orders-search input::placeholder {
          color: #9ca3af;
        }

        .orders-search svg {
          color: #9ca3af;
          flex-shrink: 0;
        }

        .orders-topbar-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-shrink: 0;
        }

        .orders-profile {
          position: relative;
        }

        .orders-profile-btn {
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

        .orders-profile-btn:hover {
          background: #f5f0e8;
        }

        .orders-avatar {
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

        .orders-avatar-small {
          width: 2rem;
          height: 2rem;
          font-size: 0.7rem;
        }

        .orders-profile-menu {
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

        .orders-profile-menu-item {
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

        .orders-profile-menu-item:hover {
          background: #f5f0e8;
          color: #2d5a27;
        }

        /* Content */
        .orders-content {
          max-width: 1000px;
          margin: 0 auto;
          padding: 1.5rem;
        }

        /* Back Button */
        .orders-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: #6b7280;
          text-decoration: none;
          font-size: 0.875rem;
          transition: color 0.2s;
          margin-bottom: 1rem;
        }

        .orders-back-btn:hover {
          color: #2d5a27;
        }

        /* Header */
        .orders-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .orders-header h1 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #2d5a27;
        }

        .orders-header p {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .orders-stats {
          display: flex;
          gap: 1.5rem;
        }

        .orders-stat {
          text-align: center;
        }

        .orders-stat-value {
          display: block;
          font-size: 1.25rem;
          font-weight: 700;
          color: #2d5a27;
        }

        .orders-stat-label {
          font-size: 0.625rem;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* Filters */
        .orders-filters {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 1.5rem;
        }

        .orders-filter-btn {
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

        .orders-filter-btn:hover {
          border-color: #7cb342;
          color: #2d5a27;
        }

        .orders-filter-active {
          background: #7cb342;
          color: white;
          border-color: #7cb342;
        }

        .orders-filter-active:hover {
          background: #558b2f;
          color: white;
        }

        /* Orders List */
        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .orders-card {
          background: #faf8f5;
          border: 1px solid #e8e0d5;
          border-radius: 1rem;
          overflow: hidden;
          transition: all 0.2s;
        }

        .orders-card:hover {
          border-color: #7cb342;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }

        .orders-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1rem;
          background: #f5f0e8;
          border-bottom: 1px solid #e8e0d5;
        }

        .orders-card-id {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .orders-card-id-label {
          font-size: 0.625rem;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .orders-card-id-value {
          font-size: 0.75rem;
          font-weight: 600;
          color: #2d5a27;
        }

        .orders-card-status {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.125rem 0.5rem;
          border-radius: 9999px;
          font-size: 0.625rem;
          font-weight: 500;
          border: 1px solid transparent;
        }

        .orders-card-body {
          padding: 1rem;
        }

        .orders-card-product {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .orders-card-product-image {
          width: 3rem;
          height: 3rem;
          background: #f5f0e8;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #7cb342;
        }

        .orders-card-product-info h3 {
          font-size: 0.875rem;
          font-weight: 600;
          color: #2d5a27;
          margin: 0;
        }

        .orders-card-product-info p {
          font-size: 0.75rem;
          color: #6b7280;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .orders-card-product-location {
          color: #9ca3af;
        }

        .orders-card-details {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.5rem;
          padding-top: 0.75rem;
          border-top: 1px solid #f5f0e8;
        }

        .orders-card-detail {
          display: flex;
          flex-direction: column;
        }

        .orders-card-detail-label {
          font-size: 0.55rem;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .orders-card-detail-value {
          font-size: 0.75rem;
          font-weight: 600;
          color: #2d5a27;
        }

        .orders-card-footer {
          display: flex;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border-top: 1px solid #f5f0e8;
          flex-wrap: wrap;
        }

        .orders-card-track-btn {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.375rem 0.75rem;
          background: #7cb342;
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-size: 0.7rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
          font-family: inherit;
        }

        .orders-card-track-btn:hover {
          background: #558b2f;
        }

        .orders-card-cancel-btn {
          padding: 0.375rem 0.75rem;
          background: #fef2f2;
          color: #ef4444;
          border: 1px solid #fecaca;
          border-radius: 0.5rem;
          font-size: 0.7rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }

        .orders-card-cancel-btn:hover {
          background: #fee2e2;
        }

        .orders-card-review-btn {
          padding: 0.375rem 0.75rem;
          background: #f5f0e8;
          color: #6b7280;
          border: 1px solid #e8e0d5;
          border-radius: 0.5rem;
          font-size: 0.7rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }

        .orders-card-review-btn:hover {
          border-color: #7cb342;
          color: #2d5a27;
        }

        /* Empty */
        .orders-empty {
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

        .orders-empty h3 {
          font-size: 1.125rem;
          color: #2d5a27;
          margin: 1rem 0 0.25rem 0;
        }

        .orders-empty p {
          font-size: 0.875rem;
          margin: 0 0 1rem 0;
        }

        .orders-empty-btn {
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

        .orders-empty-btn:hover {
          background: #558b2f;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .orders-topbar {
            padding: 0.5rem 1rem;
          }

          .orders-search {
            min-width: 150px;
          }

          .orders-content {
            padding: 1rem;
          }

          .orders-header {
            flex-direction: column;
          }

          .orders-stats {
            width: 100%;
            justify-content: space-around;
          }

          .orders-card-details {
            grid-template-columns: repeat(2, 1fr);
          }

          .orders-brand-text {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .orders-topbar {
            gap: 0.5rem;
          }

          .orders-card-details {
            grid-template-columns: 1fr 1fr;
          }

          .orders-card-footer {
            flex-direction: column;
          }

          .orders-card-footer button {
            width: 100%;
            justify-content: center;
          }

          .orders-filters {
            gap: 0.25rem;
          }

          .orders-filter-btn {
            font-size: 0.65rem;
            padding: 0.25rem 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={
      <div className="orders-loading">
        <div className="orders-loading-spinner"></div>
        <span>Loading orders...</span>
      </div>
    }>
      <OrdersContent />
    </Suspense>
  );
}
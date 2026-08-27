"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  ChevronDown,
  CircleX,
  Clock,
  Hash,
  Heart,
  ImageOff,
  Layout,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Package,
  PackageCheck,
  Receipt,
  Search,
  Settings,
  Store,
  Truck,
  X,
} from "lucide-react";

import Logo from "../../../components/Logo";
import { useSession } from "../../../lib/useSession";

type Order = {
  id: number;
  quantity: number;
  totalPrice: number;
  status: "PENDING" | "CONFIRMED" | "DELIVERED" | "CANCELLED";
  note: string | null;
  createdAt: string;
  listing: {
    title: string;
    unit: string;
    imageUrl: string | null;
    farmer: { id: number; name: string; phone: string | null };
  };
};

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/buyer" },
  { label: "Marketplace", icon: Store, href: "/marketplace" },
  { label: "My Orders", icon: Package, href: "/buyer/orders", active: true },
  { label: "Saved Farmers", icon: Heart },
  { label: "Messages", icon: MessageSquare },
  { label: "Order History", icon: Receipt },
  { label: "Settings", icon: Settings },
];

const statusMeta = {
  PENDING: { label: "Awaiting confirmation", icon: Clock, tone: "pending" },
  CONFIRMED: { label: "Confirmed", icon: PackageCheck, tone: "confirmed" },
  DELIVERED: { label: "Delivered", icon: Truck, tone: "delivered" },
  CANCELLED: { label: "Cancelled", icon: CircleX, tone: "cancelled" },
};

export default function BuyerOrdersPage() {
  const router = useRouter();
  const { user, loading } = useSession("BUYER");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) return;

    fetch("/api/marketplace/orders?as=buyer")
      .then((res) => res.json())
      .then((data) => setOrders(data.orders ?? []))
      .catch(() => setOrders([]));
  }, [user]);

  async function cancelOrder(id: number) {
    setBusyId(id);
    setMessage("");

    try {
      const res = await fetch(`/api/marketplace/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELLED" }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setMessage(data?.error ?? "Something went wrong. Please try again.");
        return;
      }

      setOrders((list) =>
        list
          ? list.map((o) => (o.id === id ? { ...o, status: "CANCELLED" } : o))
          : list
      );
    } catch {
      setMessage("Couldn't reach the server. Please try again.");
    } finally {
      setBusyId(null);
    }
  }

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
              <button key={item.label} className="dash-nav-item">
                <item.icon size={16} />
                {item.label}
                <span className="dash-soon">Soon</span>
              </button>
            )
          )}

          <span className="dash-nav-label">Support</span>

          {navItems.slice(4).map((item) => (
            <button key={item.label} className="dash-nav-item">
              <item.icon size={16} />
              {item.label}
              <span className="dash-soon">Soon</span>
            </button>
          ))}
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
            <input type="text" placeholder="Search your orders..." />
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
          <div className="dash-page-header">
            <div>
              <h1>My orders</h1>
              <p>Track everything you&apos;ve ordered from farmers.</p>
            </div>
          </div>

          {message && <div className="login-message login-error verif-message">{message}</div>}

          {orders === null && (
            <div className="dash-loading-inline">Loading your orders...</div>
          )}

          {orders !== null && orders.length === 0 && (
            <div className="verif-empty">
              <Package size={22} />
              <h3>No orders yet</h3>
              <p>Browse the marketplace to place your first order.</p>
            </div>
          )}

          <div className="order-list">
            {orders?.map((o) => {
              const meta = statusMeta[o.status];
              return (
                <div className="order-card" key={o.id}>
                  <div className="order-card-image">
                    {o.listing.imageUrl ? (
                      <img src={o.listing.imageUrl} alt={o.listing.title} />
                    ) : (
                      <ImageOff size={20} />
                    )}
                  </div>

                  <div className="order-card-body">
                    <div className="order-card-top">
                      <h3>{o.listing.title}</h3>
                      <span className={`order-status order-status-${meta.tone}`}>
                        <meta.icon size={12} />
                        {meta.label}
                      </span>
                    </div>
                    <p className="order-card-meta">
                      <Hash size={11} />
                      {o.id} · {o.quantity} {o.listing.unit} · from{" "}
                      {o.listing.farmer.name}
                    </p>
                    {o.note && <p className="order-card-note">&ldquo;{o.note}&rdquo;</p>}
                  </div>

                  <div className="order-card-side">
                    <div className="order-card-price">
                      {o.totalPrice.toLocaleString()} FCFA
                    </div>
                    <Link href={`/messages?to=${o.listing.farmer.id}`} className="order-call-btn">
                      <MessageSquare size={13} />
                      Message
                    </Link>
                    {o.status === "PENDING" && (
                      <button
                        className="btn btn-light order-cancel-btn"
                        disabled={busyId === o.id}
                        onClick={() => cancelOrder(o.id)}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}

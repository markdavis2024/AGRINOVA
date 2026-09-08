"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Award,
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
  Phone,
  Search,
  Settings,
  Stethoscope,
  Users,
  X,
} from "lucide-react";

import Logo from "../../../components/Logo";
import { useSession } from "../../../lib/useSession";

type Consultation = {
  id: number;
  subject: string;
  notes: string | null;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  scheduledAt: string | null;
  agronomistId: number | null;
  farmer: { name: string; phone: string | null; town: string | null; region: string | null };
};

const statusMeta = {
  PENDING: { label: "Unclaimed", tone: "pending" },
  CONFIRMED: { label: "Confirmed", tone: "confirmed" },
  COMPLETED: { label: "Completed", tone: "delivered" },
  CANCELLED: { label: "Cancelled", tone: "cancelled" },
};

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/agronomist" },
  { label: "My Farmers", icon: Users },
  { label: "Questions", icon: MessageCircle, href: "/messages" },
  { label: "Consultations", icon: Calendar, href: "/agronomist/consultations", active: true },
  { label: "Diagnosis", icon: Stethoscope, href: "/agronomist/diagnosis" },
  { label: "Articles", icon: BookOpen, href: "/articles" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

export default function AgronomistConsultationsPage() {
  const router = useRouter();
  const { user, loading } = useSession("AGRONOMIST");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [items, setItems] = useState<Consultation[] | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  function load() {
    fetch("/api/consultations")
      .then((res) => res.json())
      .then((data) => setItems(data.consultations ?? []))
      .catch(() => setItems([]));
  }

  useEffect(() => {
    if (user) load();
  }, [user]);

  async function updateStatus(id: number, status: string) {
    setBusyId(id);
    setMessage("");
    try {
      const res = await fetch(`/api/consultations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setMessage(data?.error ?? "Something went wrong.");
        return;
      }
      load();
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
      {sidebarOpen && <div className="dash-overlay" onClick={() => setSidebarOpen(false)} />}

      <aside className={`dash-sidebar ${sidebarOpen ? "dash-sidebar-open" : ""}`}>
        <div className="dash-sidebar-top">
          <Link href="/" className="dash-logo"><Logo width={130} /></Link>
          <button className="dash-sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <nav className="dash-nav">
          <span className="dash-nav-label">Main</span>
          {navItems.slice(0, 4).map((item) =>
            item.href ? (
              <Link key={item.label} href={item.href} className={`dash-nav-item ${item.active ? "dash-nav-active" : ""}`}>
                <item.icon size={16} />{item.label}
              </Link>
            ) : (
              <button key={item.label} className="dash-nav-item">
                <item.icon size={16} />{item.label}
                <span className="dash-soon">Soon</span>
              </button>
            )
          )}
          <span className="dash-nav-label">Knowledge</span>
          {navItems.slice(4).map((item) =>
            item.href ? (
              <Link key={item.label} href={item.href} className="dash-nav-item">
                <item.icon size={16} />{item.label}
              </Link>
            ) : (
              <button key={item.label} className="dash-nav-item">
                <item.icon size={16} />{item.label}
                <span className="dash-soon">Soon</span>
              </button>
            )
          )}
        </nav>

        <div className="dash-sidebar-bottom">
          <div className="dash-admin-card">
            <div className="dash-avatar">{initial}</div>
            <div><strong>{user.name}</strong><span>Agronomist account</span></div>
          </div>
          <button className="dash-logout" onClick={handleLogout}>
            <LogOut size={15} />Log out
          </button>
        </div>
      </aside>

      <div className="dash-main">
        <header className="dash-topbar">
          <button className="dash-menu-btn" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <Menu size={20} />
          </button>
          <div className="dash-search">
            <Search size={16} />
            <input type="text" placeholder="Search..." disabled />
          </div>
          <div className="dash-topbar-actions">
            <button className="dash-icon-btn" aria-label="Notifications">
              <Bell size={18} /><span className="dash-dot" />
            </button>
            <div className="dash-profile">
              <button className="dash-profile-btn" onClick={() => setProfileOpen((v) => !v)}>
                <div className="dash-avatar dash-avatar-small">{initial}</div>
                <span>{firstName}</span><ChevronDown size={14} />
              </button>
              {profileOpen && (
                <div className="dash-profile-menu">
                  <Link href="/" className="dash-profile-menu-item"><Layout size={14} />Back to landing page</Link>
                  <button className="dash-profile-menu-item" onClick={handleLogout}><LogOut size={14} />Log out</button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="dash-content">
          <div className="dash-page-header">
            <div>
              <h1>Consultations</h1>
              <p>Unclaimed requests plus everything assigned to you.</p>
            </div>
          </div>

          {message && <div className="login-message login-error verif-message">{message}</div>}
          {items === null && <div className="dash-loading-inline">Loading...</div>}
          {items !== null && items.length === 0 && (
            <div className="verif-empty"><Calendar size={22} /><h3>Nothing here</h3><p>New consultation requests will show up here.</p></div>
          )}

          <div className="order-list">
            {items?.map((c) => {
              const meta = statusMeta[c.status];
              const isMine = c.agronomistId === user.userId;
              return (
                <div className="order-card" key={c.id}>
                  <div className="order-card-image"><Award size={18} /></div>
                  <div className="order-card-body">
                    <div className="order-card-top">
                      <h3>{c.subject}</h3>
                      <span className={`order-status order-status-${meta.tone}`}>
                        <Clock size={12} />{meta.label}
                      </span>
                    </div>
                    <p className="order-card-meta">
                      {c.farmer.name}{c.farmer.town ? ` · ${c.farmer.town}` : ""}
                      {c.scheduledAt ? ` · ${new Date(c.scheduledAt).toLocaleDateString()}` : ""}
                    </p>
                    {c.notes && <p className="order-card-note">&ldquo;{c.notes}&rdquo;</p>}
                  </div>
                  <div className="order-card-side">
                    {c.farmer.phone && (
                      <a href={`tel:${c.farmer.phone}`} className="order-call-btn">
                        <Phone size={13} />Call
                      </a>
                    )}
                    {c.status === "PENDING" && (
                      <button className="btn btn-primary" disabled={busyId === c.id} onClick={() => updateStatus(c.id, "CONFIRMED")}>
                        Claim &amp; confirm
                      </button>
                    )}
                    {c.status === "CONFIRMED" && isMine && (
                      <button className="btn btn-primary" disabled={busyId === c.id} onClick={() => updateStatus(c.id, "COMPLETED")}>
                        Mark completed
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

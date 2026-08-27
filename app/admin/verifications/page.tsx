"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  Award,
  BarChart3,
  Bell,
  Building,
  ChevronDown,
  CheckCircle2,
  ExternalLink,
  FileCheck2,
  Inbox,
  KeyRound,
  Layout,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  ShoppingCart,
  Sprout,
  Store,
  Users,
  X,
  XCircle,
} from "lucide-react";

import Logo from "../../../components/Logo";
import { useSession } from "../../../lib/useSession";

type PendingUser = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: "FARMER" | "BUYER" | "AGRONOMIST" | "ADMIN";
  region: string | null;
  town: string | null;
  createdAt: string;
  specialization: string | null;
  experience: string | null;
  institution: string | null;
  certificationUrl: string | null;
  position: string | null;
  organization: string | null;
  inviteCode: string | null;
  authLetterUrl: string | null;
};

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "Users", icon: Users },
  { label: "Verifications", icon: FileCheck2, active: true },
  { label: "Marketplace", icon: Store },
  { label: "IoT Devices", icon: Activity },
  { label: "Reports", icon: BarChart3 },
  { label: "Settings", icon: Settings },
];

export default function AdminVerificationsPage() {
  const router = useRouter();
  const { user, loading } = useSession("ADMIN");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [pending, setPending] = useState<PendingUser[] | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) return;

    fetch("/api/admin/verifications")
      .then((res) => res.json())
      .then((data) => setPending(data.pending ?? []))
      .catch(() => setPending([]));
  }, [user]);

  async function handleAction(id: number, action: "approve" | "reject") {
    setBusyId(id);
    setMessage("");

    try {
      const res = await fetch(`/api/admin/verifications/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setMessage(data?.error ?? "Something went wrong. Please try again.");
        return;
      }

      setPending((list) => (list ? list.filter((u) => u.id !== id) : list));
    } catch {
      setMessage(
        "Couldn't reach the server. Please check your connection and try again."
      );
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
              <Link key={item.label} href={item.href} className="dash-nav-item">
                <item.icon size={16} />
                {item.label}
              </Link>
            ) : (
              <button
                key={item.label}
                className={`dash-nav-item ${item.active ? "dash-nav-active" : ""}`}
              >
                <item.icon size={16} />
                {item.label}
              </button>
            )
          )}

          <span className="dash-nav-label">Platform</span>

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
              <span>Administrator</span>
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
            <input type="text" placeholder="Search pending accounts..." />
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
              <h1>Verification queue</h1>
              <p>
                Agronomist and admin accounts are held here until you review
                them.
              </p>
            </div>
          </div>

          {message && <div className="login-message login-error verif-message">{message}</div>}

          {pending === null && (
            <div className="dash-loading-inline">Loading pending accounts...</div>
          )}

          {pending !== null && pending.length === 0 && (
            <div className="verif-empty">
              <Inbox size={22} />
              <h3>Nothing to review</h3>
              <p>New agronomist and admin sign-ups will show up here.</p>
            </div>
          )}

          <div className="verif-list">
            {pending?.map((p) => (
              <div className="verif-card" key={p.id}>
                <div className="verif-card-top">
                  <div className="verif-who">
                    <div className="dash-avatar">{p.name.charAt(0).toUpperCase()}</div>
                    <div>
                      <strong>{p.name}</strong>
                      <span>{p.email}</span>
                    </div>
                  </div>
                  <span className={`verif-role-tag verif-role-${p.role.toLowerCase()}`}>
                    {p.role === "AGRONOMIST" ? (
                      <>
                        <Sprout size={12} /> Agronomist
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={12} /> Admin
                      </>
                    )}
                  </span>
                </div>

                <div className="verif-details">
                  {p.phone && <span>{p.phone}</span>}
                  {p.town && p.region && (
                    <span>
                      {p.town}, {p.region}
                    </span>
                  )}

                  {p.role === "AGRONOMIST" && (
                    <>
                      {p.specialization && <span>{p.specialization}</span>}
                      {p.experience && <span>{p.experience} years experience</span>}
                      {p.institution && (
                        <span>
                          <Building size={11} /> {p.institution}
                        </span>
                      )}
                    </>
                  )}

                  {p.role === "ADMIN" && (
                    <>
                      {p.organization && (
                        <span>
                          <Building size={11} /> {p.organization}
                        </span>
                      )}
                      {p.position && <span>{p.position}</span>}
                      {p.inviteCode && (
                        <span>
                          <KeyRound size={11} /> Code: {p.inviteCode}
                        </span>
                      )}
                    </>
                  )}
                </div>

                <div className="verif-doc">
                  {(p.certificationUrl || p.authLetterUrl) ? (
                    <a
                      href={p.certificationUrl ?? p.authLetterUrl ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="verif-doc-link"
                    >
                      <FileCheck2 size={14} />
                      View submitted document
                      <ExternalLink size={12} />
                    </a>
                  ) : (
                    <span className="verif-doc-none">
                      <Award size={14} />
                      No document uploaded
                    </span>
                  )}
                </div>

                <div className="verif-actions">
                  <button
                    className="btn btn-light verif-reject"
                    disabled={busyId === p.id}
                    onClick={() => handleAction(p.id, "reject")}
                  >
                    <XCircle size={15} />
                    Reject
                  </button>
                  <button
                    className="btn btn-primary"
                    disabled={busyId === p.id}
                    onClick={() => handleAction(p.id, "approve")}
                  >
                    <CheckCircle2 size={15} />
                    Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

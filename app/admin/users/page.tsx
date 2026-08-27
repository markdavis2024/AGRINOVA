"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  BarChart3,
  Bell,
  ChevronDown,
  FileCheck2,
  Layout,
  LayoutDashboard,
  LogOut,
  Menu,
  RotateCcw,
  Search,
  Settings,
  ShieldOff,
  Store,
  Trash2,
  Users,
  X,
} from "lucide-react";

import Logo from "../../../components/Logo";
import { useSession } from "../../../lib/useSession";

type ManagedUser = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: "FARMER" | "BUYER" | "AGRONOMIST" | "ADMIN";
  region: string | null;
  town: string | null;
  verified: boolean;
  suspended: boolean;
  createdAt: string;
};

const roleFilters = [
  { value: "", label: "All" },
  { value: "FARMER", label: "Farmers" },
  { value: "BUYER", label: "Buyers" },
  { value: "AGRONOMIST", label: "Agronomists" },
  { value: "ADMIN", label: "Admins" },
];

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "Users", icon: Users, href: "/admin/users", active: true },
  { label: "Verifications", icon: FileCheck2, href: "/admin/verifications" },
  { label: "Marketplace", icon: Store },
  { label: "IoT Devices", icon: Activity },
  { label: "Reports", icon: BarChart3 },
  { label: "Settings", icon: Settings },
];

export default function AdminUsersPage() {
  const router = useRouter();
  const { user, loading } = useSession("ADMIN");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [users, setUsers] = useState<ManagedUser[] | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) return;

    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (roleFilter) params.set("role", roleFilter);

    const timeout = setTimeout(() => {
      fetch(`/api/admin/users?${params.toString()}`)
        .then((res) => res.json())
        .then((data) => setUsers(data.users ?? []))
        .catch(() => setUsers([]));
    }, 250);

    return () => clearTimeout(timeout);
  }, [user, search, roleFilter]);

  async function patchUser(id: number, body: Record<string, unknown>) {
    setBusyId(id);
    setMessage("");

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setMessage(data?.error ?? "Something went wrong. Please try again.");
        return;
      }

      setUsers((list) =>
        list
          ? list.map((u) => (u.id === id ? { ...u, ...data.user } : u))
          : list
      );
    } catch {
      setMessage("Couldn't reach the server. Please try again.");
    } finally {
      setBusyId(null);
    }
  }

  async function deleteUser(id: number, name: string) {
    if (!confirm(`Delete ${name}'s account? This can't be undone.`)) return;

    setBusyId(id);
    setMessage("");

    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setMessage(data?.error ?? "Something went wrong. Please try again.");
        return;
      }

      setUsers((list) => (list ? list.filter((u) => u.id !== id) : list));
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
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
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
              <h1>Manage users</h1>
              <p>View, edit roles, suspend or reinstate accounts.</p>
            </div>
          </div>

          <div className="market-filters">
            {roleFilters.map((r) => (
              <button
                key={r.value}
                className={`auth-chip ${roleFilter === r.value ? "auth-chip-active" : ""}`}
                onClick={() => setRoleFilter(r.value)}
              >
                {r.label}
              </button>
            ))}
          </div>

          {message && <div className="login-message login-error verif-message">{message}</div>}

          {users === null && (
            <div className="dash-loading-inline">Loading users...</div>
          )}

          {users !== null && users.length === 0 && (
            <div className="verif-empty">
              <Users size={22} />
              <h3>No users found</h3>
              <p>Try a different search or filter.</p>
            </div>
          )}

          <div className="user-list">
            {users?.map((u) => (
              <div className="user-row" key={u.id}>
                <div className="user-row-who">
                  <div className="dash-avatar">{u.name.charAt(0).toUpperCase()}</div>
                  <div>
                    <strong>{u.name}</strong>
                    <span>{u.email}</span>
                  </div>
                </div>

                <div className="user-row-meta">
                  <span className={`verif-role-tag verif-role-${u.role.toLowerCase()}`}>
                    {u.role.charAt(0) + u.role.slice(1).toLowerCase()}
                  </span>

                  {u.suspended ? (
                    <span className="order-status order-status-cancelled">Suspended</span>
                  ) : !u.verified ? (
                    <span className="order-status order-status-pending">Pending review</span>
                  ) : (
                    <span className="order-status order-status-delivered">Active</span>
                  )}
                </div>

                <div className="user-row-actions">
                  <select
                    className="user-role-select"
                    value={u.role}
                    disabled={busyId === u.id}
                    onChange={(e) => patchUser(u.id, { role: e.target.value })}
                  >
                    <option value="FARMER">Farmer</option>
                    <option value="BUYER">Buyer</option>
                    <option value="AGRONOMIST">Agronomist</option>
                    <option value="ADMIN">Admin</option>
                  </select>

                  <button
                    className="dash-icon-btn"
                    disabled={busyId === u.id}
                    onClick={() => patchUser(u.id, { suspended: !u.suspended })}
                    aria-label={u.suspended ? "Reinstate" : "Suspend"}
                    title={u.suspended ? "Reinstate account" : "Suspend account"}
                  >
                    {u.suspended ? <RotateCcw size={16} /> : <ShieldOff size={16} />}
                  </button>

                  <button
                    className="dash-icon-btn user-delete-btn"
                    disabled={busyId === u.id}
                    onClick={() => deleteUser(u.id, u.name)}
                    aria-label="Delete user"
                    title="Delete account"
                  >
                    <Trash2 size={16} />
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

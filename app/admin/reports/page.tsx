"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  BarChart3,
  Banknote,
  Bell,
  ChevronDown,
  FileCheck2,
  Layout,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Percent,
  Search,
  Settings,
  Store,
  Users,
  X,
} from "lucide-react";

import Logo from "../../../components/Logo";
import { useSession } from "../../../lib/useSession";

type Bar = { label: string; count?: number; total?: number; percent: number };

type Reports = {
  overview: {
    totalUsers: number;
    totalListings: number;
    totalRevenue: number;
    totalMessages: number;
    totalConsultations: number;
    totalDiagnoses: number;
    totalArticles: number;
    verifiedRate: number;
  };
  userGrowth: Bar[];
  revenueByMonth: Bar[];
  ordersByStatus: Bar[];
  listingsByCategory: Bar[];
  usersByRole: Bar[];
};

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "Users", icon: Users, href: "/admin/users" },
  { label: "Verifications", icon: FileCheck2, href: "/admin/verifications" },
  { label: "Marketplace", icon: Store },
  { label: "IoT Devices", icon: Activity },
  { label: "Reports", icon: BarChart3, href: "/admin/reports", active: true },
  { label: "Settings", icon: Settings, href: "/settings" },
];

function fcfa(n: number) {
  return `${Math.round(n).toLocaleString()} FCFA`;
}

export default function AdminReportsPage() {
  const router = useRouter();
  const { user, loading } = useSession("ADMIN");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [data, setData] = useState<Reports | null>(null);

  useEffect(() => {
    if (!user) return;
    fetch("/api/admin/reports")
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch(() => {});
  }, [user]);

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
          <span className="dash-nav-label">Platform</span>
          {navItems.slice(4).map((item) =>
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
        </nav>

        <div className="dash-sidebar-bottom">
          <div className="dash-admin-card">
            <div className="dash-avatar">{initial}</div>
            <div><strong>{user.name}</strong><span>Administrator</span></div>
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
              <h1>Reports & analytics</h1>
              <p>Platform-wide numbers, computed live from your database.</p>
            </div>
          </div>

          {!data && <div className="dash-loading-inline">Loading reports...</div>}

          {data && (
            <>
              <div className="dash-stats-grid">
                <div className="dash-stat-card">
                  <div className="dash-stat-icon dash-stat-green"><Users size={17} /></div>
                  <div className="dash-stat-value">{data.overview.totalUsers.toLocaleString()}</div>
                  <div className="dash-stat-label">Total users</div>
                </div>
                <div className="dash-stat-card">
                  <div className="dash-stat-icon dash-stat-sky"><Store size={17} /></div>
                  <div className="dash-stat-value">{data.overview.totalListings.toLocaleString()}</div>
                  <div className="dash-stat-label">Total listings</div>
                </div>
                <div className="dash-stat-card">
                  <div className="dash-stat-icon dash-stat-yellow"><Banknote size={17} /></div>
                  <div className="dash-stat-value">{fcfa(data.overview.totalRevenue)}</div>
                  <div className="dash-stat-label">Total revenue</div>
                </div>
                <div className="dash-stat-card">
                  <div className="dash-stat-icon dash-stat-green"><MessageSquare size={17} /></div>
                  <div className="dash-stat-value">{data.overview.totalMessages.toLocaleString()}</div>
                  <div className="dash-stat-label">Messages sent</div>
                </div>
                <div className="dash-stat-card">
                  <div className="dash-stat-icon dash-stat-sky"><BarChart3 size={17} /></div>
                  <div className="dash-stat-value">{data.overview.totalArticles.toLocaleString()}</div>
                  <div className="dash-stat-label">Articles published</div>
                </div>
                <div className="dash-stat-card">
                  <div className={`dash-stat-icon ${data.overview.verifiedRate >= 80 ? "dash-stat-green" : "dash-stat-alert"}`}>
                    <Percent size={17} />
                  </div>
                  <div className="dash-stat-value">{data.overview.verifiedRate}%</div>
                  <div className="dash-stat-label">Experts verified</div>
                </div>
              </div>

              <div className="dash-split">
                <div className="dash-panel">
                  <div className="dash-panel-header"><h2>New users, last 6 months</h2></div>
                  <div className="dash-bars">
                    {data.userGrowth.map((m) => (
                      <div className="dash-bar-row" key={m.label}>
                        <div className="dash-bar-label"><span>{m.label}</span><span>{m.count}</span></div>
                        <div className="dash-bar-track"><div className="dash-bar-fill" style={{ width: `${m.percent}%` }} /></div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="dash-panel">
                  <div className="dash-panel-header"><h2>Revenue, last 6 months</h2></div>
                  <div className="dash-bars">
                    {data.revenueByMonth.map((m) => (
                      <div className="dash-bar-row" key={m.label}>
                        <div className="dash-bar-label"><span>{m.label}</span><span>{fcfa(m.total ?? 0)}</span></div>
                        <div className="dash-bar-track"><div className="dash-bar-fill" style={{ width: `${m.percent}%` }} /></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="dash-split">
                <div className="dash-panel">
                  <div className="dash-panel-header"><h2>Orders by status</h2></div>
                  <div className="dash-bars">
                    {data.ordersByStatus.length === 0 && <p className="order-card-meta">No orders yet.</p>}
                    {data.ordersByStatus.map((o) => (
                      <div className="dash-bar-row" key={o.label}>
                        <div className="dash-bar-label"><span>{o.label}</span><span>{o.count}</span></div>
                        <div className="dash-bar-track"><div className="dash-bar-fill" style={{ width: `${o.percent}%` }} /></div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="dash-panel">
                  <div className="dash-panel-header"><h2>Listings by category</h2></div>
                  <div className="dash-bars">
                    {data.listingsByCategory.length === 0 && <p className="order-card-meta">No listings yet.</p>}
                    {data.listingsByCategory.map((l) => (
                      <div className="dash-bar-row" key={l.label}>
                        <div className="dash-bar-label"><span>{l.label}</span><span>{l.count}</span></div>
                        <div className="dash-bar-track"><div className="dash-bar-fill" style={{ width: `${l.percent}%` }} /></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="dash-panel">
                <div className="dash-panel-header"><h2>Users by role</h2></div>
                <div className="dash-bars">
                  {data.usersByRole.map((r) => (
                    <div className="dash-bar-row" key={r.label}>
                      <div className="dash-bar-label"><span>{r.label}</span><span>{r.count}</span></div>
                      <div className="dash-bar-track"><div className="dash-bar-fill" style={{ width: `${r.percent}%` }} /></div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

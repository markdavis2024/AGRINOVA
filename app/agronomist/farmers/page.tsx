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
  Settings,
  X,
  Users,
  MapPin,
  MessageCircle,
  Calendar,
  Stethoscope,
  Award,
  Filter,
  UserPlus,
  Clock,
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  Star,
  BookOpen,
} from "lucide-react";
import { useSession } from "@/lib/useSession";
import NotificationBell from "@/components/NotificationBell";

interface Farmer {
  id: string;
  name: string;
  location: string;
  crop: string;
  lastActive: string;
  status: "online" | "offline";
  consultations: number;
  diagnosis: number;
  rating: number;
  phone: string;
  email: string;
}

const mockFarmers: Farmer[] = [
  { id: "1", name: "Jean Baptiste", location: "Bamenda", crop: "Maize", lastActive: "2 min ago", status: "online", consultations: 5, diagnosis: 3, rating: 4.8, phone: "+237 6XX XXX XXX", email: "jean@example.com" },
  { id: "2", name: "Marie Claire", location: "Yaoundé", crop: "Tomatoes", lastActive: "1 hour ago", status: "online", consultations: 3, diagnosis: 2, rating: 4.9, phone: "+237 6XX XXX XXX", email: "marie@example.com" },
  { id: "3", name: "Paul Atanga", location: "Douala", crop: "Cassava", lastActive: "3 hours ago", status: "offline", consultations: 2, diagnosis: 1, rating: 4.5, phone: "+237 6XX XXX XXX", email: "paul@example.com" },
  { id: "4", name: "Amina Ndongo", location: "Buea", crop: "Cocoa", lastActive: "5 hours ago", status: "offline", consultations: 4, diagnosis: 2, rating: 4.7, phone: "+237 6XX XXX XXX", email: "amina@example.com" },
];

export default function MyFarmersPage() {
  const router = useRouter();
  const { user, loading } = useSession("AGRONOMIST");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "online" | "offline">("all");

  if (loading || !user) {
    return <div className="dash-loading">Loading farmers...</div>;
  }

  const initial = user.name.charAt(0).toUpperCase();
  const firstName = user.name.split(" ")[0];

  const filteredFarmers = mockFarmers.filter(farmer => {
    const matchesSearch = farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          farmer.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          farmer.crop.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || farmer.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="dash-page">
      {sidebarOpen && <div className="dash-overlay" onClick={() => setSidebarOpen(false)} />}

      <aside className={`dash-sidebar ${sidebarOpen ? "dash-sidebar-open" : ""}`}>
        <div className="dash-sidebar-top">
          <Link href="/" className="dash-logo">
            <span className="dash-logo-icon">🌱</span>
            <span className="dash-logo-text">AGRINOVA</span>
          </Link>
          <button className="dash-sidebar-close" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <nav className="dash-nav">
          <span className="dash-nav-label">Main</span>
          {[
            { label: "Dashboard", icon: Layout, href: "/agronomist" },
            { label: "My Farmers", icon: Users, href: "/agronomist/farmers", active: true },
            { label: "Questions", icon: MessageCircle, href: "/messages" },
            { label: "Consultations", icon: Calendar, href: "/agronomist/consultations" },
            { label: "Diagnosis", icon: Stethoscope, href: "/agronomist/diagnosis" },
            { label: "Articles", icon: BookOpen, href: "/agronomist/articles" },
            { label: "Settings", icon: Settings, href: "/settings" },
          ].map((item) => (
            <Link key={item.label} href={item.href} className={`dash-nav-item ${item.active ? "dash-nav-active" : ""}`}>
              <item.icon size={18} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="dash-sidebar-bottom">
          <button className="dash-logout" onClick={() => router.push("/login")}>
            <LogOut size={18} />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      <div className="dash-main">
        <header className="dash-topbar">
          <button className="dash-menu-btn" onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>
          <div className="dash-search">
            <Search size={16} />
            <input type="text" placeholder="Search farmers..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="dash-topbar-actions">
            <NotificationBell userId={user.id} />
            <div className="dash-profile">
              <button className="dash-profile-btn" onClick={() => setProfileOpen((v) => !v)}>
                <div className="dash-avatar dash-avatar-small">{initial}</div>
                <span>{firstName}</span>
                <ChevronDown size={14} />
              </button>
              {profileOpen && (
                <div className="dash-profile-menu">
                  <Link href="/" className="dash-profile-menu-item"><Layout size={14} /> Back</Link>
                  <button className="dash-profile-menu-item" onClick={() => router.push("/login")}><LogOut size={14} /> Log out</button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="dash-content">
          <div className="dash-page-header">
            <div>
              <h1>My Farmers</h1>
              <p>Manage and connect with farmers assigned to you</p>
            </div>
            <div className="dash-stats-small">
              <span>{mockFarmers.length} total</span>
              <span>{mockFarmers.filter(f => f.status === "online").length} online</span>
            </div>
          </div>

          <div className="dash-filters">
            <button className={`dash-filter-btn ${filterStatus === "all" ? "dash-filter-active" : ""}`} onClick={() => setFilterStatus("all")}>All</button>
            <button className={`dash-filter-btn ${filterStatus === "online" ? "dash-filter-active" : ""}`} onClick={() => setFilterStatus("online")}><span className="dash-dot-green"></span>Online</button>
            <button className={`dash-filter-btn ${filterStatus === "offline" ? "dash-filter-active" : ""}`} onClick={() => setFilterStatus("offline")}><span className="dash-dot-gray"></span>Offline</button>
          </div>

          <div className="dash-farmers-list">
            {filteredFarmers.map((farmer) => (
              <div key={farmer.id} className="dash-farmer-item">
                <div className="dash-farmer-item-header">
                  <div className="dash-farmer-item-avatar">
                    <span>{farmer.name.charAt(0)}</span>
                    <span className={`dash-farmer-status-dot dash-farmer-${farmer.status}`}></span>
                  </div>
                  <div className="dash-farmer-item-info">
                    <h3>{farmer.name}</h3>
                    <span className="dash-farmer-item-location"><MapPin size={14} />{farmer.location}</span>
                  </div>
                  <div className="dash-farmer-item-stats">
                    <span><Calendar size={14} /> {farmer.consultations}</span>
                    <span><Stethoscope size={14} /> {farmer.diagnosis}</span>
                    <span><Star size={14} /> {farmer.rating}</span>
                  </div>
                  <div className="dash-farmer-item-actions">
                    <Link href={`/messages?farmer=${farmer.id}`} className="dash-farmer-msg-btn"><MessageCircle size={16} /></Link>
                    <Link href={`/agronomist/farmers/${farmer.id}`} className="dash-farmer-view-btn">View</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      <style jsx>{`
        .dash-loading { display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f5f0e8; color: #6b7280; }
        .dash-loading-spinner { width: 1.5rem; height: 1.5rem; border: 2px solid #e8e0d5; border-top-color: #7cb342; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .dash-page { display: flex; min-height: 100vh; background: #f5f0e8; }
        .dash-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 40; display: none; }
        @media (max-width: 768px) { .dash-overlay { display: block; } }
        .dash-sidebar { position: fixed; top: 0; left: 0; bottom: 0; z-index: 50; width: 280px; background: #faf8f5; border-right: 1px solid #e8e0d5; display: flex; flex-direction: column; transition: transform 0.3s ease; transform: translateX(-100%); }
        .dash-sidebar-open { transform: translateX(0); }
        @media (min-width: 768px) { .dash-sidebar { position: sticky; top: 0; transform: translateX(0); height: 100vh; } }
        .dash-sidebar-top { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; border-bottom: 1px solid #e8e0d5; }
        .dash-logo { display: flex; align-items: center; gap: 0.5rem; text-decoration: none; }
        .dash-logo-icon { font-size: 1.5rem; }
        .dash-logo-text { font-size: 1.125rem; font-weight: 700; color: #2d5a27; }
        .dash-sidebar-close { padding: 0.25rem; background: none; border: none; border-radius: 0.375rem; cursor: pointer; display: none; color: #6b7280; }
        .dash-sidebar-close:hover { background: #f5f0e8; }
        @media (max-width: 768px) { .dash-sidebar-close { display: block; } }
        .dash-nav { flex: 1; overflow-y: auto; padding: 0.75rem; }
        .dash-nav-label { display: block; font-size: 0.65rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; padding: 0.5rem 0.75rem; }
        .dash-nav-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.625rem 0.75rem; border-radius: 0.5rem; color: #6b7280; text-decoration: none; transition: all 0.2s; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.125rem; }
        .dash-nav-item:hover { background: #f5f0e8; color: #2d5a27; }
        .dash-nav-active { background: #e8f5e9; color: #7cb342; }
        .dash-sidebar-bottom { padding: 0.75rem; border-top: 1px solid #e8e0d5; }
        .dash-logout { display: flex; align-items: center; gap: 0.75rem; padding: 0.625rem 0.75rem; width: 100%; border: none; border-radius: 0.5rem; color: #ef4444; background: transparent; font-size: 0.875rem; font-weight: 500; cursor: pointer; transition: all 0.2s; font-family: inherit; }
        .dash-logout:hover { background: #fef2f2; }
        .dash-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
        .dash-topbar { display: flex; align-items: center; gap: 1rem; padding: 0.75rem 1.5rem; background: #faf8f5; border-bottom: 1px solid #e8e0d5; flex-shrink: 0; flex-wrap: wrap; }
        .dash-menu-btn { padding: 0.5rem; background: none; border: none; border-radius: 0.5rem; cursor: pointer; color: #6b7280; transition: background 0.2s; display: none; }
        .dash-menu-btn:hover { background: #f5f0e8; }
        @media (max-width: 768px) { .dash-menu-btn { display: block; } }
        .dash-search { flex: 1; display: flex; align-items: center; gap: 0.5rem; background: white; border: 1px solid #e8e0d5; border-radius: 0.75rem; padding: 0.5rem 0.75rem; min-width: 200px; transition: border-color 0.2s; }
        .dash-search:focus-within { border-color: #7cb342; box-shadow: 0 0 0 3px rgba(124,179,66,0.1); }
        .dash-search input { flex: 1; border: none; outline: none; font-size: 0.875rem; background: transparent; color: #2d5a27; min-width: 0; }
        .dash-search input::placeholder { color: #9ca3af; }
        .dash-search svg { color: #9ca3af; flex-shrink: 0; }
        .dash-topbar-actions { display: flex; align-items: center; gap: 0.75rem; flex-shrink: 0; }
        .dash-profile { position: relative; }
        .dash-profile-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.375rem 0.5rem; background: none; border: none; border-radius: 0.5rem; cursor: pointer; transition: background 0.2s; font-size: 0.875rem; color: #2d5a27; font-weight: 500; font-family: inherit; }
        .dash-profile-btn:hover { background: #f5f0e8; }
        .dash-avatar { width: 2rem; height: 2rem; background: linear-gradient(135deg, #7cb342, #558b2f); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 600; color: white; flex-shrink: 0; }
        .dash-avatar-small { width: 2rem; height: 2rem; font-size: 0.7rem; }
        .dash-profile-menu { position: absolute; top: 100%; right: 0; background: white; border: 1px solid #e8e0d5; border-radius: 0.75rem; box-shadow: 0 10px 40px rgba(0,0,0,0.1); min-width: 200px; margin-top: 0.5rem; overflow: hidden; z-index: 10; }
        .dash-profile-menu-item { display: flex; align-items: center; gap: 0.5rem; padding: 0.625rem 1rem; color: #6b7280; text-decoration: none; font-size: 0.875rem; transition: background 0.2s; width: 100%; border: none; background: none; cursor: pointer; font-family: inherit; }
        .dash-profile-menu-item:hover { background: #f5f0e8; color: #2d5a27; }
        .dash-content { flex: 1; padding: 1.5rem; overflow-y: auto; max-width: 1200px; margin: 0 auto; width: 100%; }
        .dash-page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 0.5rem; }
        .dash-page-header h1 { font-size: 1.5rem; font-weight: 700; color: #2d5a27; }
        .dash-page-header p { color: #6b7280; font-size: 0.875rem; }
        .dash-stats-small { display: flex; gap: 1rem; }
        .dash-stats-small span { font-size: 0.75rem; color: #6b7280; background: #faf8f5; padding: 0.25rem 0.75rem; border-radius: 9999px; border: 1px solid #e8e0d5; }
        .dash-filters { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
        .dash-filter-btn { display: flex; align-items: center; gap: 0.375rem; padding: 0.375rem 0.75rem; border: 1px solid #e8e0d5; border-radius: 9999px; font-size: 0.75rem; color: #6b7280; background: #faf8f5; cursor: pointer; transition: all 0.2s; font-family: inherit; }
        .dash-filter-btn:hover { border-color: #7cb342; color: #2d5a27; }
        .dash-filter-active { background: #7cb342; color: white; border-color: #7cb342; }
        .dash-dot-green { width: 0.5rem; height: 0.5rem; background: #34d399; border-radius: 50%; }
        .dash-dot-gray { width: 0.5rem; height: 0.5rem; background: #d1d5db; border-radius: 50%; }
        .dash-farmers-list { display: flex; flex-direction: column; gap: 0.75rem; }
        .dash-farmer-item { background: #faf8f5; border: 1px solid #e8e0d5; border-radius: 1rem; padding: 1rem; transition: all 0.2s; }
        .dash-farmer-item:hover { border-color: #7cb342; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
        .dash-farmer-item-header { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
        .dash-farmer-item-avatar { position: relative; width: 3rem; height: 3rem; background: linear-gradient(135deg, #7cb342, #558b2f); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1rem; font-weight: 600; color: white; flex-shrink: 0; }
        .dash-farmer-status-dot { position: absolute; bottom: 0; right: 0; width: 0.75rem; height: 0.75rem; border-radius: 50%; border: 2px solid #faf8f5; }
        .dash-farmer-online { background: #34d399; }
        .dash-farmer-offline { background: #d1d5db; }
        .dash-farmer-item-info { flex: 1; }
        .dash-farmer-item-info h3 { font-size: 0.875rem; font-weight: 600; color: #2d5a27; margin: 0; }
        .dash-farmer-item-location { display: flex; align-items: center; gap: 0.25rem; font-size: 0.7rem; color: #6b7280; }
        .dash-farmer-item-stats { display: flex; gap: 0.75rem; font-size: 0.7rem; color: #6b7280; }
        .dash-farmer-item-stats span { display: flex; align-items: center; gap: 0.25rem; }
        .dash-farmer-item-actions { display: flex; gap: 0.5rem; }
        .dash-farmer-msg-btn { padding: 0.375rem; background: #f5f0e8; border-radius: 0.375rem; color: #6b7280; transition: all 0.2s; text-decoration: none; display: flex; align-items: center; justify-content: center; }
        .dash-farmer-msg-btn:hover { background: #e8f5e9; color: #7cb342; }
        .dash-farmer-view-btn { padding: 0.375rem 0.75rem; background: #7cb342; border: none; border-radius: 0.375rem; color: white; font-size: 0.7rem; cursor: pointer; transition: background 0.2s; text-decoration: none; }
        .dash-farmer-view-btn:hover { background: #558b2f; }
        @media (max-width: 768px) { .dash-topbar { padding: 0.5rem 1rem; } .dash-search { min-width: 150px; } .dash-content { padding: 1rem; } .dash-farmer-item-header { flex-direction: column; align-items: flex-start; } .dash-farmer-item-actions { width: 100%; } }
      `}</style>
    </div>
  );
}
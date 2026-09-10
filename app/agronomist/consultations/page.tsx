"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell, ChevronDown, Layout, LogOut, Menu, Search, X,
  Calendar, Clock, Video, Phone, MapPin, CheckCircle, AlertCircle,
  Users, MessageCircle, Stethoscope, BookOpen, Settings, Filter,
  ArrowRight, Plus, User,
} from "lucide-react";
import { useSession } from "@/lib/useSession";
import NotificationBell from "@/components/NotificationBell";

interface Consultation {
  id: string;
  farmerName: string;
  farmerLocation: string;
  crop: string;
  issue: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  type: "video" | "phone" | "in-person";
}

const mockConsultations: Consultation[] = [
  { id: "1", farmerName: "Jean Baptiste", farmerLocation: "Bamenda", crop: "Maize", issue: "Pest infestation", date: "2024-03-21", time: "10:00", status: "pending", type: "video" },
  { id: "2", farmerName: "Marie Claire", farmerLocation: "Yaoundé", crop: "Tomatoes", issue: "Leaf disease", date: "2024-03-20", time: "14:30", status: "confirmed", type: "phone" },
  { id: "3", farmerName: "Paul Atanga", farmerLocation: "Douala", crop: "Cassava", issue: "Soil fertility", date: "2024-03-19", time: "09:00", status: "completed", type: "in-person" },
  { id: "4", farmerName: "Amina Ndongo", farmerLocation: "Buea", crop: "Cocoa", issue: "Pest control", date: "2024-03-22", time: "11:00", status: "pending", type: "video" },
];

const statusColors = {
  pending: { bg: "bg-yellow-50", text: "text-yellow-600", border: "border-yellow-200", icon: Clock },
  confirmed: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200", icon: CheckCircle },
  completed: { bg: "bg-green-50", text: "text-green-600", border: "border-green-200", icon: CheckCircle },
  cancelled: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200", icon: AlertCircle },
};

const statusLabels = {
  pending: "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

const typeIcons = {
  video: Video,
  phone: Phone,
  "in-person": MapPin,
};

export default function ConsultationsPage() {
  const router = useRouter();
  const { user, loading } = useSession("AGRONOMIST");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  if (loading || !user) return <div className="dash-loading">Loading consultations...</div>;

  const initial = user.name.charAt(0).toUpperCase();
  const firstName = user.name.split(" ")[0];

  const filteredConsultations = mockConsultations.filter(c => {
    const matchesSearch = c.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.issue.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="dash-page">
      {sidebarOpen && <div className="dash-overlay" onClick={() => setSidebarOpen(false)} />}
      <aside className={`dash-sidebar ${sidebarOpen ? "dash-sidebar-open" : ""}`}>
        <div className="dash-sidebar-top">
          <Link href="/" className="dash-logo"><span className="dash-logo-icon">🌱</span><span className="dash-logo-text">AGRINOVA</span></Link>
          <button className="dash-sidebar-close" onClick={() => setSidebarOpen(false)}><X size={18} /></button>
        </div>
        <nav className="dash-nav">
          <span className="dash-nav-label">Main</span>
          {[
            { label: "Dashboard", icon: Layout, href: "/agronomist" },
            { label: "My Farmers", icon: Users, href: "/agronomist/farmers" },
            { label: "Questions", icon: MessageCircle, href: "/messages" },
            { label: "Consultations", icon: Calendar, href: "/agronomist/consultations", active: true },
            { label: "Diagnosis", icon: Stethoscope, href: "/agronomist/diagnosis" },
            { label: "Articles", icon: BookOpen, href: "/agronomist/articles" },
            { label: "Settings", icon: Settings, href: "/settings" },
          ].map((item) => (
            <Link key={item.label} href={item.href} className={`dash-nav-item ${item.active ? "dash-nav-active" : ""}`}>
              <item.icon size={18} /><span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="dash-sidebar-bottom">
          <button className="dash-logout" onClick={() => router.push("/login")}><LogOut size={18} /><span>Log out</span></button>
        </div>
      </aside>

      <div className="dash-main">
        <header className="dash-topbar">
          <button className="dash-menu-btn" onClick={() => setSidebarOpen(true)}><Menu size={22} /></button>
          <div className="dash-search"><Search size={16} /><input type="text" placeholder="Search consultations..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
          <div className="dash-topbar-actions">
            <NotificationBell userId={user.id} />
            <div className="dash-profile">
              <button className="dash-profile-btn" onClick={() => setProfileOpen((v) => !v)}>
                <div className="dash-avatar dash-avatar-small">{initial}</div><span>{firstName}</span><ChevronDown size={14} />
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
            <div><h1>Consultations</h1><p>Manage your consultation sessions with farmers</p></div>
            <Link href="/agronomist/consultations/new" className="dash-primary-btn"><Plus size={16} /> New Consultation</Link>
          </div>

          <div className="dash-filters">
            <button className={`dash-filter-btn ${filterStatus === "all" ? "dash-filter-active" : ""}`} onClick={() => setFilterStatus("all")}>All</button>
            <button className={`dash-filter-btn ${filterStatus === "pending" ? "dash-filter-active" : ""}`} onClick={() => setFilterStatus("pending")}>Pending</button>
            <button className={`dash-filter-btn ${filterStatus === "confirmed" ? "dash-filter-active" : ""}`} onClick={() => setFilterStatus("confirmed")}>Confirmed</button>
            <button className={`dash-filter-btn ${filterStatus === "completed" ? "dash-filter-active" : ""}`} onClick={() => setFilterStatus("completed")}>Completed</button>
          </div>

          <div className="dash-consultations-list">
            {filteredConsultations.map((c) => {
              const statusColor = statusColors[c.status];
              const StatusIcon = statusColor.icon;
              const TypeIcon = typeIcons[c.type];
              return (
                <div key={c.id} className="dash-consultation-item">
                  <div className="dash-consultation-header">
                    <div className="dash-consultation-user">
                      <div className="dash-consultation-avatar"><span>{c.farmerName.charAt(0)}</span></div>
                      <div>
                        <h3>{c.farmerName}</h3>
                        <span><MapPin size={12} />{c.farmerLocation}</span>
                      </div>
                    </div>
                    <div className={`dash-consultation-status ${statusColor.bg} ${statusColor.text}`}>
                      <StatusIcon size={14} /><span>{statusLabels[c.status]}</span>
                    </div>
                  </div>
                  <div className="dash-consultation-body">
                    <div className="dash-consultation-details">
                      <span><Calendar size={14} /> {c.date}</span>
                      <span><Clock size={14} /> {c.time}</span>
                      <span><TypeIcon size={14} /> {c.type}</span>
                    </div>
                    <div className="dash-consultation-crop"><strong>{c.crop}</strong> - {c.issue}</div>
                  </div>
                  <div className="dash-consultation-actions">
                    <button className="dash-consultation-join-btn">Join Session</button>
                    <button className="dash-consultation-reschedule-btn">Reschedule</button>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      <style jsx>{`
        .dash-loading { display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f5f0e8; color: #6b7280; }
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
        @media (max-width: 768px) { .dash-sidebar-close { display: block; } }
        .dash-nav { flex: 1; overflow-y: auto; padding: 0.75rem; }
        .dash-nav-label { display: block; font-size: 0.65rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; padding: 0.5rem 0.75rem; }
        .dash-nav-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.625rem 0.75rem; border-radius: 0.5rem; color: #6b7280; text-decoration: none; transition: all 0.2s; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.125rem; }
        .dash-nav-item:hover { background: #f5f0e8; color: #2d5a27; }
        .dash-nav-active { background: #e8f5e9; color: #7cb342; }
        .dash-sidebar-bottom { padding: 0.75rem; border-top: 1px solid #e8e0d5; }
        .dash-logout { display: flex; align-items: center; gap: 0.75rem; padding: 0.625rem 0.75rem; width: 100%; border: none; border-radius: 0.5rem; color: #ef4444; background: transparent; font-size: 0.875rem; font-weight: 500; cursor: pointer; font-family: inherit; }
        .dash-logout:hover { background: #fef2f2; }
        .dash-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
        .dash-topbar { display: flex; align-items: center; gap: 1rem; padding: 0.75rem 1.5rem; background: #faf8f5; border-bottom: 1px solid #e8e0d5; flex-shrink: 0; flex-wrap: wrap; }
        .dash-menu-btn { padding: 0.5rem; background: none; border: none; border-radius: 0.5rem; cursor: pointer; color: #6b7280; display: none; }
        @media (max-width: 768px) { .dash-menu-btn { display: block; } }
        .dash-search { flex: 1; display: flex; align-items: center; gap: 0.5rem; background: white; border: 1px solid #e8e0d5; border-radius: 0.75rem; padding: 0.5rem 0.75rem; min-width: 200px; }
        .dash-search input { flex: 1; border: none; outline: none; font-size: 0.875rem; background: transparent; color: #2d5a27; }
        .dash-search svg { color: #9ca3af; }
        .dash-topbar-actions { display: flex; align-items: center; gap: 0.75rem; }
        .dash-profile { position: relative; }
        .dash-profile-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.375rem 0.5rem; background: none; border: none; border-radius: 0.5rem; cursor: pointer; font-size: 0.875rem; color: #2d5a27; font-weight: 500; font-family: inherit; }
        .dash-avatar { width: 2rem; height: 2rem; background: linear-gradient(135deg, #7cb342, #558b2f); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 600; color: white; }
        .dash-avatar-small { width: 2rem; height: 2rem; font-size: 0.7rem; }
        .dash-profile-menu { position: absolute; top: 100%; right: 0; background: white; border: 1px solid #e8e0d5; border-radius: 0.75rem; box-shadow: 0 10px 40px rgba(0,0,0,0.1); min-width: 200px; margin-top: 0.5rem; overflow: hidden; z-index: 10; }
        .dash-profile-menu-item { display: flex; align-items: center; gap: 0.5rem; padding: 0.625rem 1rem; color: #6b7280; text-decoration: none; font-size: 0.875rem; width: 100%; border: none; background: none; cursor: pointer; font-family: inherit; }
        .dash-profile-menu-item:hover { background: #f5f0e8; color: #2d5a27; }
        .dash-content { flex: 1; padding: 1.5rem; overflow-y: auto; max-width: 1200px; margin: 0 auto; width: 100%; }
        .dash-page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 0.5rem; }
        .dash-page-header h1 { font-size: 1.5rem; font-weight: 700; color: #2d5a27; }
        .dash-page-header p { color: #6b7280; font-size: 0.875rem; }
        .dash-primary-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1.25rem; background: #7cb342; color: white; border-radius: 0.5rem; font-size: 0.875rem; font-weight: 500; text-decoration: none; }
        .dash-primary-btn:hover { background: #558b2f; }
        .dash-filters { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
        .dash-filter-btn { padding: 0.375rem 0.75rem; border: 1px solid #e8e0d5; border-radius: 9999px; font-size: 0.75rem; color: #6b7280; background: #faf8f5; cursor: pointer; transition: all 0.2s; font-family: inherit; }
        .dash-filter-btn:hover { border-color: #7cb342; color: #2d5a27; }
        .dash-filter-active { background: #7cb342; color: white; border-color: #7cb342; }
        .dash-consultations-list { display: flex; flex-direction: column; gap: 0.75rem; }
        .dash-consultation-item { background: #faf8f5; border: 1px solid #e8e0d5; border-radius: 1rem; padding: 1rem; transition: all 0.2s; }
        .dash-consultation-item:hover { border-color: #7cb342; }
        .dash-consultation-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem; }
        .dash-consultation-user { display: flex; align-items: center; gap: 0.75rem; }
        .dash-consultation-avatar { width: 2.5rem; height: 2.5rem; background: linear-gradient(135deg, #7cb342, #558b2f); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.875rem; font-weight: 600; color: white; }
        .dash-consultation-user h3 { font-size: 0.875rem; font-weight: 600; color: #2d5a27; margin: 0; }
        .dash-consultation-user span { display: flex; align-items: center; gap: 0.25rem; font-size: 0.7rem; color: #6b7280; }
        .dash-consultation-status { display: flex; align-items: center; gap: 0.25rem; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.65rem; font-weight: 500; }
        .dash-consultation-body { margin-bottom: 0.75rem; }
        .dash-consultation-details { display: flex; gap: 1rem; margin-bottom: 0.5rem; flex-wrap: wrap; }
        .dash-consultation-details span { display: flex; align-items: center; gap: 0.25rem; font-size: 0.7rem; color: #6b7280; }
        .dash-consultation-crop { font-size: 0.75rem; color: #2d5a27; }
        .dash-consultation-actions { display: flex; gap: 0.5rem; }
        .dash-consultation-join-btn { padding: 0.375rem 0.75rem; background: #7cb342; color: white; border: none; border-radius: 0.5rem; font-size: 0.7rem; font-weight: 500; cursor: pointer; font-family: inherit; }
        .dash-consultation-join-btn:hover { background: #558b2f; }
        .dash-consultation-reschedule-btn { padding: 0.375rem 0.75rem; background: #f5f0e8; color: #6b7280; border: 1px solid #e8e0d5; border-radius: 0.5rem; font-size: 0.7rem; font-weight: 500; cursor: pointer; font-family: inherit; }
        .dash-consultation-reschedule-btn:hover { border-color: #7cb342; color: #2d5a27; }
        @media (max-width: 768px) { .dash-content { padding: 1rem; } .dash-consultation-header { flex-direction: column; } }
      `}</style>
    </div>
  );
}
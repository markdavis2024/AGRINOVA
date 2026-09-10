"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell, ChevronDown, Layout, LogOut, Menu, Search, X,
  BookOpen, Calendar, Clock, Eye, MessageCircle, Heart,
  Users, Stethoscope, Settings, Plus, Filter, ArrowRight,
} from "lucide-react";
import { useSession } from "@/lib/useSession";
import NotificationBell from "@/components/NotificationBell";

interface Article {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  status: "published" | "draft" | "review";
  views: number;
  likes: number;
  comments: number;
  date: string;
  readTime: string;
}

const mockArticles: Article[] = [
  { id: "1", title: "Soil Management Tips for Maize Farmers", category: "Soil Health", excerpt: "Learn how to maintain healthy soil for better maize yields...", status: "published", views: 342, likes: 45, comments: 12, date: "2024-03-15", readTime: "5 min" },
  { id: "2", title: "Pest Control in Tomato Farming", category: "Pest Control", excerpt: "A comprehensive guide to managing common tomato pests...", status: "published", views: 256, likes: 32, comments: 8, date: "2024-03-10", readTime: "7 min" },
  { id: "3", title: "Irrigation Best Practices", category: "Irrigation", excerpt: "Maximize water efficiency with these irrigation techniques...", status: "draft", views: 0, likes: 0, comments: 0, date: "2024-03-20", readTime: "6 min" },
  { id: "4", title: "Cocoa Production Guide", category: "Crop Management", excerpt: "From planting to harvest, a complete cocoa guide...", status: "review", views: 0, likes: 0, comments: 0, date: "2024-03-18", readTime: "10 min" },
];

const statusColors = {
  published: { bg: "bg-green-50", text: "text-green-600" },
  draft: { bg: "bg-yellow-50", text: "text-yellow-600" },
  review: { bg: "bg-blue-50", text: "text-blue-600" },
};

export default function ArticlesPage() {
  const router = useRouter();
  const { user, loading } = useSession("AGRONOMIST");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  if (loading || !user) return <div className="dash-loading">Loading articles...</div>;

  const initial = user.name.charAt(0).toUpperCase();
  const firstName = user.name.split(" ")[0];

  const filteredArticles = mockArticles.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || a.status === filterStatus;
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
            { label: "Consultations", icon: Calendar, href: "/agronomist/consultations" },
            { label: "Diagnosis", icon: Stethoscope, href: "/agronomist/diagnosis" },
            { label: "Articles", icon: BookOpen, href: "/agronomist/articles", active: true },
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
          <div className="dash-search"><Search size={16} /><input type="text" placeholder="Search articles..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
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
            <div><h1>My Articles</h1><p>Manage your advisory content for farmers</p></div>
            <Link href="/agronomist/articles/new" className="dash-primary-btn"><Plus size={16} /> New Article</Link>
          </div>

          <div className="dash-filters">
            <button className={`dash-filter-btn ${filterStatus === "all" ? "dash-filter-active" : ""}`} onClick={() => setFilterStatus("all")}>All</button>
            <button className={`dash-filter-btn ${filterStatus === "published" ? "dash-filter-active" : ""}`} onClick={() => setFilterStatus("published")}>Published</button>
            <button className={`dash-filter-btn ${filterStatus === "draft" ? "dash-filter-active" : ""}`} onClick={() => setFilterStatus("draft")}>Drafts</button>
            <button className={`dash-filter-btn ${filterStatus === "review" ? "dash-filter-active" : ""}`} onClick={() => setFilterStatus("review")}>In Review</button>
          </div>

          <div className="dash-articles-list">
            {filteredArticles.map((a) => {
              const statusColor = statusColors[a.status];
              return (
                <div key={a.id} className="dash-article-item">
                  <div className="dash-article-header">
                    <div className="dash-article-category">{a.category}</div>
                    <div className={`dash-article-status ${statusColor.bg} ${statusColor.text}`}>
                      {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                    </div>
                  </div>
                  <h3 className="dash-article-title">{a.title}</h3>
                  <p className="dash-article-excerpt">{a.excerpt}</p>
                  <div className="dash-article-meta">
                    <span><Calendar size={14} /> {a.date}</span>
                    <span><Clock size={14} /> {a.readTime} read</span>
                    {a.status === "published" && (
                      <>
                        <span><Eye size={14} /> {a.views}</span>
                        <span><Heart size={14} /> {a.likes}</span>
                        <span><MessageCircle size={14} /> {a.comments}</span>
                      </>
                    )}
                  </div>
                  <div className="dash-article-actions">
                    <Link href={`/agronomist/articles/${a.id}`} className="dash-article-edit-btn">
                      {a.status === "published" ? "View" : "Edit"} <ArrowRight size={14} />
                    </Link>
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
        .dash-filter-btn { padding: 0.375rem 0.75rem; border: 1px solid #e8e0d5; border-radius: 9999px; font-size: 0.75rem; color: #6b7280; background: #faf8f5; cursor: pointer; font-family: inherit; }
        .dash-filter-btn:hover { border-color: #7cb342; color: #2d5a27; }
        .dash-filter-active { background: #7cb342; color: white; border-color: #7cb342; }
        .dash-articles-list { display: flex; flex-direction: column; gap: 1rem; }
        .dash-article-item { background: #faf8f5; border: 1px solid #e8e0d5; border-radius: 1rem; padding: 1.25rem; transition: all 0.2s; }
        .dash-article-item:hover { border-color: #7cb342; }
        .dash-article-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
        .dash-article-category { font-size: 0.65rem; color: #7cb342; background: #e8f5e9; padding: 0.125rem 0.5rem; border-radius: 9999px; }
        .dash-article-status { padding: 0.125rem 0.5rem; border-radius: 9999px; font-size: 0.6rem; font-weight: 500; }
        .dash-article-title { font-size: 1rem; font-weight: 600; color: #2d5a27; margin: 0 0 0.25rem 0; }
        .dash-article-excerpt { font-size: 0.75rem; color: #6b7280; margin: 0 0 0.75rem 0; }
        .dash-article-meta { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 0.75rem; }
        .dash-article-meta span { display: flex; align-items: center; gap: 0.25rem; font-size: 0.65rem; color: #6b7280; }
        .dash-article-actions { display: flex; justify-content: flex-end; }
        .dash-article-edit-btn { display: flex; align-items: center; gap: 0.25rem; font-size: 0.7rem; color: #7cb342; text-decoration: none; font-weight: 500; }
        .dash-article-edit-btn:hover { text-decoration: underline; }
        @media (max-width: 768px) { .dash-content { padding: 1rem; } }
      `}</style>
    </div>
  );
}
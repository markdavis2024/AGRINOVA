"use client";

import { FormEvent, Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Bell,
  ChevronDown,
  Layout,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Search,
  Send,
  UserRound,
  X,
} from "lucide-react";

import Logo from "../../components/Logo";
import { ROLE_PATH, useAnySession } from "../../lib/useSession";

type Conversation = {
  contact: { id: number; name: string; role: string };
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
};

type Msg = {
  id: number;
  content: string;
  senderId: number;
  receiverId: number;
  createdAt: string;
};

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function MessagesInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAnySession();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[] | null>(null);
  const [activeId, setActiveId] = useState<number | null>(() => {
    const to = searchParams.get("to");
    return to ? Number(to) : null;
  });
  const [activeName, setActiveName] = useState<string>("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const threadEndRef = useRef<HTMLDivElement | null>(null);

  // Load the conversation list.
  useEffect(() => {
    if (!user) return;

    function load() {
      fetch("/api/messages/conversations")
        .then((res) => res.json())
        .then((data) => setConversations(data.conversations ?? []));
    }

    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [user]);

  // Load the active thread, poll while open.
  useEffect(() => {
    if (!user || !activeId) return;

    function load() {
      fetch(`/api/messages?with=${activeId}`)
        .then((res) => res.json())
        .then((data) => {
          setMessages(data.messages ?? []);
          if (data.contact) setActiveName(data.contact.name);
        });
    }

    load();
    const interval = setInterval(load, 4000);
    return () => clearInterval(interval);
  }, [user, activeId]);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(event: FormEvent) {
    event.preventDefault();
    if (!draft.trim() || !activeId || sending) return;

    setSending(true);
    const content = draft.trim();
    setDraft("");

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: activeId, content }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((m) => [...m, data.message]);
      }
    } finally {
      setSending(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  if (loading || !user) {
    return <div className="dash-loading">Loading messages...</div>;
  }

  const initial = user.name.charAt(0).toUpperCase();
  const firstName = user.name.split(" ")[0];
  const homePath = ROLE_PATH[user.role];

  return (
    <div className="dash-page">
      {sidebarOpen && (
        <div className="dash-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`dash-sidebar ${sidebarOpen ? "dash-sidebar-open" : ""}`}>
        <div className="dash-sidebar-top">
          <Link href="/" className="dash-logo">
            <Logo width={130} />
          </Link>
          <button className="dash-sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <nav className="dash-nav">
          <span className="dash-nav-label">Main</span>
          <Link href={homePath} className="dash-nav-item">
            <LayoutDashboard size={16} />
            Dashboard
          </Link>
          <button className="dash-nav-item dash-nav-active">
            <MessageSquare size={16} />
            Messages
          </button>
        </nav>

        <div className="dash-sidebar-bottom">
          <div className="dash-admin-card">
            <div className="dash-avatar">{initial}</div>
            <div>
              <strong>{user.name}</strong>
              <span>{user.role.charAt(0) + user.role.slice(1).toLowerCase()} account</span>
            </div>
          </div>
          <button className="dash-logout" onClick={handleLogout}>
            <LogOut size={15} />
            Log out
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
              <Bell size={18} />
              <span className="dash-dot" />
            </button>
            <div className="dash-profile">
              <button className="dash-profile-btn" onClick={() => setProfileOpen((v) => !v)}>
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

        <main className="dash-content messages-content">
          <div className={`messages-shell ${activeId ? "messages-shell-thread-open" : ""}`}>
            {/* ---- Conversation list ---- */}
            <div className="messages-list">
              <div className="messages-list-header">
                <h2>Messages</h2>
              </div>

              {conversations === null && (
                <div className="dash-loading-inline">Loading...</div>
              )}

              {conversations !== null && conversations.length === 0 && (
                <div className="verif-empty messages-empty-list">
                  <MessageSquare size={20} />
                  <h3>No conversations yet</h3>
                  <p>Message a farmer or buyer from the marketplace or an order.</p>
                </div>
              )}

              {conversations?.map((c) => (
                <button
                  key={c.contact.id}
                  className={`messages-list-item ${activeId === c.contact.id ? "messages-list-item-active" : ""}`}
                  onClick={() => setActiveId(c.contact.id)}
                >
                  <div className="dash-avatar">{c.contact.name.charAt(0).toUpperCase()}</div>
                  <div className="messages-list-item-body">
                    <div className="messages-list-item-top">
                      <strong>{c.contact.name}</strong>
                      <span>{formatTime(c.lastMessageAt)}</span>
                    </div>
                    <p>{c.lastMessage}</p>
                  </div>
                  {c.unreadCount > 0 && (
                    <span className="messages-unread-badge">{c.unreadCount}</span>
                  )}
                </button>
              ))}
            </div>

            {/* ---- Thread ---- */}
            <div className="messages-thread">
              {!activeId ? (
                <div className="messages-thread-empty">
                  <UserRound size={26} />
                  <p>Select a conversation to start chatting</p>
                </div>
              ) : (
                <>
                  <div className="messages-thread-header">
                    <button
                      className="messages-thread-back"
                      onClick={() => setActiveId(null)}
                      aria-label="Back to conversations"
                    >
                      <ArrowLeft size={16} />
                    </button>
                    <div className="dash-avatar">
                      {(activeName || "?").charAt(0).toUpperCase()}
                    </div>
                    <strong>{activeName || "Loading..."}</strong>
                  </div>

                  <div className="messages-thread-body">
                    {messages.map((m) => (
                      <div
                        key={m.id}
                        className={`message-bubble-row ${m.senderId === user.userId ? "message-bubble-row-me" : ""}`}
                      >
                        <div className="message-bubble">
                          <p>{m.content}</p>
                          <span>{formatTime(m.createdAt)}</span>
                        </div>
                      </div>
                    ))}
                    <div ref={threadEndRef} />
                  </div>

                  <form className="messages-input-row" onSubmit={handleSend}>
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                    />
                    <button type="submit" disabled={!draft.trim() || sending} aria-label="Send">
                      <Send size={16} />
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="dash-loading">Loading messages...</div>}>
      <MessagesInner />
    </Suspense>
  );
}

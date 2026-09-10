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
  X,
  Send,
  Paperclip,
  User,
  Phone,
  Video,
  MoreVertical,
  Check,
  CheckCheck,
  Clock,
  Image,
  Smile,
  Mic,
  ArrowLeft,
  MessageSquare,
} from "lucide-react";
import { useAnySession } from "@/lib/useSession";
import NotificationBell from "@/components/NotificationBell";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: Date;
  read: boolean;
  type: "text" | "image" | "file";
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  participantRole: string;
  lastMessage: string;
  lastMessageTime: Date;
  unread: number;
  online: boolean;
  messages: Message[];
}

const mockConversations: Conversation[] = [
  {
    id: "conv1",
    participantId: "farmer1",
    participantName: "Jean Baptiste",
    participantAvatar: "JB",
    participantRole: "Farmer",
    lastMessage: "Your maize order is confirmed and will be shipped tomorrow.",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 30),
    unread: 2,
    online: true,
    messages: [
      {
        id: "msg1",
        senderId: "farmer1",
        senderName: "Jean Baptiste",
        senderAvatar: "JB",
        content: "Hello! I've received your order for 50kg of maize.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        read: true,
        type: "text",
      },
      {
        id: "msg2",
        senderId: "buyer1",
        senderName: "You",
        senderAvatar: "Y",
        content: "Great! When will it be shipped?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
        read: true,
        type: "text",
      },
      {
        id: "msg3",
        senderId: "farmer1",
        senderName: "Jean Baptiste",
        senderAvatar: "JB",
        content: "Your maize order is confirmed and will be shipped tomorrow.",
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        read: false,
        type: "text",
      },
    ],
  },
  {
    id: "conv2",
    participantId: "farmer2",
    participantName: "Marie Claire",
    participantAvatar: "MC",
    participantRole: "Farmer",
    lastMessage: "Yes, the tomatoes are organic and freshly harvested.",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 3),
    unread: 0,
    online: false,
    messages: [
      {
        id: "msg4",
        senderId: "buyer1",
        senderName: "You",
        senderAvatar: "Y",
        content: "Are the tomatoes organic?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
        read: true,
        type: "text",
      },
      {
        id: "msg5",
        senderId: "farmer2",
        senderName: "Marie Claire",
        senderAvatar: "MC",
        content: "Yes, the tomatoes are organic and freshly harvested.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
        read: true,
        type: "text",
      },
    ],
  },
  {
    id: "conv3",
    participantId: "farmer3",
    participantName: "Paul Atanga",
    participantAvatar: "PA",
    participantRole: "Farmer",
    lastMessage: "I'll have the cassava ready for pickup on Friday.",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 5),
    unread: 0,
    online: false,
    messages: [
      {
        id: "msg6",
        senderId: "farmer3",
        senderName: "Paul Atanga",
        senderAvatar: "PA",
        content: "I'll have the cassava ready for pickup on Friday.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
        read: true,
        type: "text",
      },
    ],
  },
  {
    id: "conv4",
    participantId: "farmer4",
    participantName: "Amina Ndongo",
    participantAvatar: "AN",
    participantRole: "Farmer",
    lastMessage: "The cocoa beans are ready for shipment. Let me know when to send.",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 8),
    unread: 1,
    online: true,
    messages: [
      {
        id: "msg7",
        senderId: "farmer4",
        senderName: "Amina Ndongo",
        senderAvatar: "AN",
        content: "The cocoa beans are ready for shipment. Let me know when to send.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
        read: false,
        type: "text",
      },
    ],
  },
];

function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

export default function MessagesPage() {
  const router = useRouter();
  const { user, loading } = useAnySession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  if (loading || !user) {
    return (
      <div className="messages-loading">
        <div className="messages-loading-spinner"></div>
        <span>Loading messages...</span>
      </div>
    );
  }

  const initial = user.name.charAt(0).toUpperCase();
  const firstName = user.name.split(" ")[0];

  const filteredConversations = mockConversations.filter(conv =>
    conv.participantName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentConversation = mockConversations.find(c => c.id === selectedConversation);

  return (
    <div className="messages-page">
      {/* Topbar */}
      <header className="messages-topbar">
        <button
          className="messages-menu-btn"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <div className="messages-brand">
          <span className="messages-brand-icon">🌱</span>
          <span className="messages-brand-text">AGRINOVA</span>
          <span className="messages-brand-badge">Messages</span>
        </div>

        <div className="messages-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="messages-topbar-actions">
          <NotificationBell userId={user.id} />

          <div className="messages-profile">
            <button
              className="messages-profile-btn"
              onClick={() => setProfileOpen((v) => !v)}
            >
              <div className="messages-avatar messages-avatar-small">{initial}</div>
              <span>{firstName}</span>
              <ChevronDown size={14} />
            </button>

            {profileOpen && (
              <div className="messages-profile-menu">
                <Link href="/" className="messages-profile-menu-item">
                  <Layout size={14} />
                  Back to landing page
                </Link>
                <Link href="/buyer" className="messages-profile-menu-item">
                  <Layout size={14} />
                  Dashboard
                </Link>
                <button
                  className="messages-profile-menu-item"
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
      <div className="messages-content">
        <div className="messages-container">
          {/* Conversations List */}
          <div className="messages-conversations">
            <div className="messages-conversations-header">
              <h2>Conversations</h2>
              <span className="messages-conversations-count">
                {filteredConversations.length} chats
              </span>
            </div>

            <div className="messages-conversations-list">
              {filteredConversations.length === 0 ? (
                <div className="messages-empty">
                  <MessageSquare size={40} />
                  <h3>No conversations</h3>
                  <p>Start chatting with farmers about their products</p>
                  <Link href="/marketplace" className="messages-empty-btn">
                    Browse Marketplace
                  </Link>
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={`messages-conversation-item ${
                      selectedConversation === conv.id ? "messages-conversation-active" : ""
                    }`}
                    onClick={() => setSelectedConversation(conv.id)}
                  >
                    <div className="messages-conversation-avatar">
                      <span>{conv.participantAvatar}</span>
                      {conv.online && <span className="messages-online-dot"></span>}
                    </div>
                    <div className="messages-conversation-info">
                      <div className="messages-conversation-top">
                        <span className="messages-conversation-name">
                          {conv.participantName}
                        </span>
                        <span className="messages-conversation-time">
                          {formatTime(conv.lastMessageTime)}
                        </span>
                      </div>
                      <div className="messages-conversation-bottom">
                        <span className="messages-conversation-last">
                          {conv.lastMessage}
                        </span>
                        {conv.unread > 0 && (
                          <span className="messages-unread-badge">{conv.unread}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="messages-chat">
            {currentConversation ? (
              <>
                {/* Chat Header */}
                <div className="messages-chat-header">
                  <button
                    className="messages-chat-back"
                    onClick={() => setSelectedConversation(null)}
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <div className="messages-chat-participant">
                    <div className="messages-chat-avatar">
                      <span>{currentConversation.participantAvatar}</span>
                      {currentConversation.online && <span className="messages-online-dot"></span>}
                    </div>
                    <div>
                      <span className="messages-chat-name">
                        {currentConversation.participantName}
                      </span>
                      <span className="messages-chat-role">
                        {currentConversation.participantRole}
                      </span>
                    </div>
                  </div>
                  <div className="messages-chat-actions">
                    <button className="messages-chat-action-btn">
                      <Phone size={18} />
                    </button>
                    <button className="messages-chat-action-btn">
                      <Video size={18} />
                    </button>
                    <button className="messages-chat-action-btn">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="messages-chat-body">
                  {currentConversation.messages.map((msg) => {
                    const isOwn = msg.senderId === "buyer1";
                    return (
                      <div
                        key={msg.id}
                        className={`messages-chat-message ${
                          isOwn ? "messages-chat-message-own" : ""
                        }`}
                      >
                        {!isOwn && (
                          <div className="messages-chat-message-avatar">
                            <span>{msg.senderAvatar}</span>
                          </div>
                        )}
                        <div className="messages-chat-message-content">
                          <div className="messages-chat-message-bubble">
                            {msg.type === "image" ? (
                              <div className="messages-chat-message-image">
                                <Image size={24} />
                                <span>Image</span>
                              </div>
                            ) : msg.type === "file" ? (
                              <div className="messages-chat-message-file">
                                <Paperclip size={18} />
                                <span>File attached</span>
                              </div>
                            ) : (
                              <p>{msg.content}</p>
                            )}
                          </div>
                          <div className="messages-chat-message-time">
                            {formatTime(msg.timestamp)}
                            {isOwn && (
                              msg.read ? (
                                <CheckCheck size={14} className="messages-read" />
                              ) : (
                                <Check size={14} />
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Chat Input */}
                <div className="messages-chat-input">
                  <button className="messages-chat-input-btn">
                    <Paperclip size={20} />
                  </button>
                  <button className="messages-chat-input-btn">
                    <Image size={20} />
                  </button>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && messageInput.trim()) {
                        // Send message logic here
                        setMessageInput("");
                      }
                    }}
                  />
                  <button className="messages-chat-input-btn">
                    <Smile size={20} />
                  </button>
                  <button className="messages-chat-input-btn">
                    <Mic size={20} />
                  </button>
                  <button
                    className="messages-chat-send-btn"
                    disabled={!messageInput.trim()}
                    onClick={() => {
                      if (messageInput.trim()) {
                        // Send message logic here
                        setMessageInput("");
                      }
                    }}
                  >
                    <Send size={20} />
                  </button>
                </div>
              </>
            ) : (
              <div className="messages-chat-empty">
                <MessageSquare size={48} />
                <h3>Select a conversation</h3>
                <p>Choose a farmer to start messaging</p>
                <Link href="/marketplace" className="messages-empty-btn">
                  Browse Marketplace
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Page */
        .messages-page {
          min-height: 100vh;
          background: #f5f0e8;
        }

        /* Loading */
        .messages-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: #f5f0e8;
          gap: 0.75rem;
          color: #6b7280;
        }

        .messages-loading-spinner {
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
        .messages-topbar {
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

        .messages-menu-btn {
          padding: 0.5rem;
          background: none;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          color: #6b7280;
          transition: background 0.2s;
          display: none;
        }

        .messages-menu-btn:hover {
          background: #f5f0e8;
        }

        @media (max-width: 768px) {
          .messages-menu-btn {
            display: block;
          }
        }

        .messages-brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-shrink: 0;
        }

        .messages-brand-icon {
          font-size: 1.5rem;
        }

        .messages-brand-text {
          font-size: 1.125rem;
          font-weight: 700;
          color: #2d5a27;
        }

        .messages-brand-badge {
          font-size: 0.625rem;
          color: #7cb342;
          background: #e8f5e9;
          padding: 0.125rem 0.5rem;
          border-radius: 9999px;
          font-weight: 500;
          text-transform: uppercase;
        }

        .messages-search {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: white;
          border: 1px solid #e8e0d5;
          border-radius: 0.75rem;
          padding: 0.5rem 0.75rem;
          min-width: 150px;
          transition: border-color 0.2s;
        }

        .messages-search:focus-within {
          border-color: #7cb342;
          box-shadow: 0 0 0 3px rgba(124, 179, 66, 0.1);
        }

        .messages-search input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 0.875rem;
          background: transparent;
          color: #2d5a27;
          min-width: 0;
        }

        .messages-search input::placeholder {
          color: #9ca3af;
        }

        .messages-search svg {
          color: #9ca3af;
          flex-shrink: 0;
        }

        .messages-topbar-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-shrink: 0;
        }

        .messages-profile {
          position: relative;
        }

        .messages-profile-btn {
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

        .messages-profile-btn:hover {
          background: #f5f0e8;
        }

        .messages-avatar {
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

        .messages-avatar-small {
          width: 2rem;
          height: 2rem;
          font-size: 0.7rem;
        }

        .messages-profile-menu {
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

        .messages-profile-menu-item {
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

        .messages-profile-menu-item:hover {
          background: #f5f0e8;
          color: #2d5a27;
        }

        /* Content */
        .messages-content {
          flex: 1;
          padding: 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        .messages-container {
          display: flex;
          background: #faf8f5;
          border: 1px solid #e8e0d5;
          border-radius: 1rem;
          overflow: hidden;
          min-height: 500px;
          height: calc(100vh - 180px);
        }

        /* Conversations List */
        .messages-conversations {
          width: 340px;
          border-right: 1px solid #e8e0d5;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
        }

        .messages-conversations-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid #e8e0d5;
        }

        .messages-conversations-header h2 {
          font-size: 1rem;
          font-weight: 600;
          color: #2d5a27;
          margin: 0;
        }

        .messages-conversations-count {
          font-size: 0.7rem;
          color: #6b7280;
        }

        .messages-conversations-list {
          flex: 1;
          overflow-y: auto;
          padding: 0.5rem;
        }

        .messages-conversation-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          border-radius: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 0.25rem;
        }

        .messages-conversation-item:hover {
          background: #f5f0e8;
        }

        .messages-conversation-active {
          background: #e8f5e9;
        }

        .messages-conversation-avatar {
          position: relative;
          width: 2.75rem;
          height: 2.75rem;
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

        .messages-online-dot {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 0.75rem;
          height: 0.75rem;
          background: #34d399;
          border: 2px solid #faf8f5;
          border-radius: 50%;
        }

        .messages-conversation-info {
          flex: 1;
          min-width: 0;
        }

        .messages-conversation-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .messages-conversation-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: #2d5a27;
        }

        .messages-conversation-time {
          font-size: 0.6rem;
          color: #9ca3af;
        }

        .messages-conversation-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .messages-conversation-last {
          font-size: 0.75rem;
          color: #6b7280;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 150px;
        }

        .messages-unread-badge {
          background: #7cb342;
          color: white;
          font-size: 0.6rem;
          font-weight: 600;
          padding: 0.125rem 0.375rem;
          border-radius: 9999px;
          min-width: 1.25rem;
          text-align: center;
        }

        /* Chat Area */
        .messages-chat {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .messages-chat-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #e8e0d5;
        }

        .messages-chat-back {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          color: #6b7280;
          padding: 0.25rem;
        }

        .messages-chat-back:hover {
          color: #2d5a27;
        }

        @media (max-width: 768px) {
          .messages-chat-back {
            display: block;
          }
        }

        .messages-chat-participant {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex: 1;
        }

        .messages-chat-avatar {
          position: relative;
          width: 2.5rem;
          height: 2.5rem;
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

        .messages-chat-name {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: #2d5a27;
        }

        .messages-chat-role {
          display: block;
          font-size: 0.625rem;
          color: #6b7280;
        }

        .messages-chat-actions {
          display: flex;
          gap: 0.25rem;
        }

        .messages-chat-action-btn {
          padding: 0.375rem;
          background: none;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          color: #6b7280;
          transition: all 0.2s;
        }

        .messages-chat-action-btn:hover {
          background: #f5f0e8;
          color: #2d5a27;
        }

        /* Chat Body */
        .messages-chat-body {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .messages-chat-message {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          max-width: 80%;
        }

        .messages-chat-message-own {
          align-self: flex-end;
          flex-direction: row-reverse;
        }

        .messages-chat-message-avatar {
          width: 2rem;
          height: 2rem;
          background: linear-gradient(135deg, #7cb342, #558b2f);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.625rem;
          font-weight: 600;
          color: white;
          flex-shrink: 0;
        }

        .messages-chat-message-content {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }

        .messages-chat-message-bubble {
          padding: 0.625rem 0.875rem;
          background: white;
          border-radius: 0.75rem;
          border: 1px solid #e8e0d5;
          font-size: 0.875rem;
          color: #2d5a27;
          word-wrap: break-word;
        }

        .messages-chat-message-own .messages-chat-message-bubble {
          background: #7cb342;
          border-color: #7cb342;
          color: white;
        }

        .messages-chat-message-image {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #6b7280;
        }

        .messages-chat-message-file {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #6b7280;
        }

        .messages-chat-message-time {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.55rem;
          color: #9ca3af;
          padding: 0 0.25rem;
        }

        .messages-read {
          color: #34d399;
        }

        /* Chat Input */
        .messages-chat-input {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border-top: 1px solid #e8e0d5;
          background: #faf8f5;
        }

        .messages-chat-input-btn {
          padding: 0.375rem;
          background: none;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          color: #6b7280;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .messages-chat-input-btn:hover {
          background: #f5f0e8;
          color: #2d5a27;
        }

        .messages-chat-input input {
          flex: 1;
          padding: 0.5rem 0.75rem;
          border: 1px solid #e8e0d5;
          border-radius: 0.75rem;
          font-size: 0.875rem;
          background: white;
          color: #2d5a27;
          outline: none;
          transition: border-color 0.2s;
          font-family: inherit;
        }

        .messages-chat-input input:focus {
          border-color: #7cb342;
          box-shadow: 0 0 0 3px rgba(124, 179, 66, 0.1);
        }

        .messages-chat-send-btn {
          padding: 0.5rem;
          background: #7cb342;
          color: white;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .messages-chat-send-btn:hover:not(:disabled) {
          background: #558b2f;
        }

        .messages-chat-send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Empty States */
        .messages-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          text-align: center;
          color: #9ca3af;
          height: 100%;
        }

        .messages-empty h3 {
          color: #2d5a27;
          margin: 0.5rem 0 0.25rem 0;
          font-size: 1rem;
        }

        .messages-empty p {
          font-size: 0.875rem;
          margin: 0 0 1rem 0;
        }

        .messages-empty-btn {
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

        .messages-empty-btn:hover {
          background: #558b2f;
        }

        .messages-chat-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #9ca3af;
          text-align: center;
          padding: 2rem;
        }

        .messages-chat-empty h3 {
          color: #2d5a27;
          margin: 0.5rem 0 0.25rem 0;
          font-size: 1rem;
        }

        .messages-chat-empty p {
          font-size: 0.875rem;
          margin: 0 0 1rem 0;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .messages-topbar {
            padding: 0.5rem 1rem;
          }

          .messages-content {
            padding: 0.5rem;
          }

          .messages-container {
            height: calc(100vh - 120px);
            border-radius: 0.75rem;
          }

          .messages-conversations {
            width: 100%;
            border-right: none;
          }

          .messages-conversations-list {
            max-height: 400px;
          }

          .messages-chat {
            display: none;
          }

          .messages-chat-active {
            display: flex;
          }

          .messages-conversations-hidden {
            display: none;
          }

          .messages-brand-text {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .messages-topbar {
            gap: 0.5rem;
          }

          .messages-search {
            min-width: 100px;
          }

          .messages-conversation-last {
            max-width: 100px;
          }
        }
      `}</style>
    </div>
  );
}
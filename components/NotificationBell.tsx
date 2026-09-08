"use client";

import { useState, useEffect } from "react";
import { Bell, Check, X } from "lucide-react";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  link?: string;
  read: boolean;
  createdAt: string;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId }),
      });
      // Update local state
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true }),
      });
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success": return "bg-green-50 border-green-200";
      case "warning": return "bg-yellow-50 border-yellow-200";
      case "error": return "bg-red-50 border-red-200";
      default: return "bg-blue-50 border-blue-200";
    }
  };

  return (
    <div className="notification-bell">
      <button
        className="dash-icon-btn notification-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="notification-count">{unreadCount}</span>
        )}
        <span className="dash-dot" />
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="notification-mark-all">
                <Check size={14} /> Mark all read
              </button>
            )}
          </div>

          <div className="notification-list">
            {loading ? (
              <div className="notification-loading">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="notification-empty">
                <Bell size={24} />
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.read ? "notification-unread" : ""}`}
                >
                  <div className={`notification-item-content ${getTypeColor(notification.type)}`}>
                    <div className="notification-item-header">
                      <h4>{notification.title}</h4>
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="notification-mark-btn"
                        >
                          <Check size={14} />
                        </button>
                      )}
                    </div>
                    <p>{notification.message}</p>
                    <span className="notification-time">
                      {new Date(notification.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .notification-bell {
          position: relative;
        }

        .notification-btn {
          position: relative;
          border: 1px solid var(--border);
          background: white;
          border-radius: 12px;
          padding: 9px;
          color: var(--green-deep);
          cursor: pointer;
        }

        .notification-count {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #ef4444;
          color: white;
          font-size: 10px;
          font-weight: 700;
          min-width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
        }

        .dash-dot {
          display: none;
        }

        .notification-dropdown {
          position: absolute;
          right: 0;
          top: calc(100% + 8px);
          width: 380px;
          max-height: 480px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          border: 1px solid var(--border);
          z-index: 50;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .notification-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid var(--border);
          flex-shrink: 0;
        }

        .notification-header h3 {
          font-size: 16px;
          font-weight: 700;
          color: var(--green-deep);
          margin: 0;
        }

        .notification-mark-all {
          display: flex;
          align-items: center;
          gap: 4px;
          background: none;
          border: none;
          color: #059669;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }

        .notification-mark-all:hover {
          color: #047857;
        }

        .notification-list {
          flex: 1;
          overflow-y: auto;
          padding: 8px;
        }

        .notification-loading {
          padding: 30px 20px;
          text-align: center;
          color: #6b7280;
        }

        .notification-empty {
          padding: 40px 20px;
          text-align: center;
          color: #9ca3af;
        }

        .notification-empty p {
          margin: 8px 0 0 0;
        }

        .notification-item {
          margin-bottom: 6px;
        }

        .notification-unread {
          border-left: 3px solid #059669;
          border-radius: 0 8px 8px 0;
        }

        .notification-item-content {
          padding: 12px 14px;
          border-radius: 8px;
          border: 1px solid transparent;
        }

        .notification-item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 8px;
        }

        .notification-item-header h4 {
          font-size: 13px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .notification-item-content p {
          font-size: 12px;
          color: #6b7280;
          margin: 4px 0 6px 0;
          line-height: 1.5;
        }

        .notification-time {
          font-size: 10px;
          color: #9ca3af;
        }

        .notification-mark-btn {
          flex-shrink: 0;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: none;
          background: #059669;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
        }

        .notification-mark-btn:hover {
          background: #047857;
        }

        @media (max-width: 640px) {
          .notification-dropdown {
            width: calc(100vw - 32px);
            right: -16px;
            max-height: 400px;
          }
        }
      `}</style>
    </div>
  );
}
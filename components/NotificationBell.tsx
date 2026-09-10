"use client";

import { useEffect, useState } from "react";
import { Bell, X, Check, CheckCheck, Trash2, BellOff } from "lucide-react";
import Link from "next/link";
import { notificationService, type Notification } from "../lib/notificationService";

interface NotificationBellProps {
  userId: string;
  className?: string;
}

export default function NotificationBell({ userId, className = "" }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Initialize notification service
    notificationService.initialize(userId);
    
    // Subscribe to notification changes
    const unsubscribe = notificationService.subscribe((notifs) => {
      setNotifications(notifs);
      setUnreadCount(notifs.filter(n => !n.read).length);
    });

    // Request notification permission
    notificationService.requestPermission();

    return () => unsubscribe();
  }, [userId]);

  const handleMarkAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    notificationService.markAsRead(id);
  };

  const handleMarkAllRead = () => {
    notificationService.markAllAsRead();
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    notificationService.deleteNotification(id);
  };

  const handleClearAll = () => {
    notificationService.clearAll();
  };

  const getTypeStyles = (type: string) => {
    const styles: Record<string, { bg: string; border: string }> = {
      success: { bg: 'bg-green-50', border: 'border-green-200' },
      warning: { bg: 'bg-yellow-50', border: 'border-yellow-200' },
      error: { bg: 'bg-red-50', border: 'border-red-200' },
      info: { bg: 'bg-blue-50', border: 'border-blue-200' }
    };
    return styles[type] || styles.info;
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      success: '✅',
      warning: '⚠️',
      error: '❌',
      info: 'ℹ️'
    };
    return icons[type] || '📌';
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={`notification-bell ${className}`}>
      <button
        className="notification-bell-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <Bell className="notification-bell-icon" />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <div>
              <h3>Notifications</h3>
              <span className="notification-count">
                {unreadCount} unread
              </span>
            </div>
            <div className="notification-actions">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="notification-action-btn"
                  title="Mark all as read"
                >
                  <CheckCheck className="notification-action-icon" />
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="notification-action-btn"
                  title="Clear all"
                >
                  <Trash2 className="notification-action-icon" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="notification-action-btn"
                title="Close"
              >
                <X className="notification-action-icon" />
              </button>
            </div>
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="notification-empty">
                <BellOff className="notification-empty-icon" />
                <p>No notifications</p>
                <span>You're all caught up!</span>
              </div>
            ) : (
              notifications.map((notification) => {
                const styles = getTypeStyles(notification.type);
                return (
                  <div
                    key={notification.id}
                    className={`notification-item ${!notification.read ? 'notification-unread' : ''} ${styles.bg}`}
                  >
                    <div className="notification-item-icon">
                      <span>{notification.icon}</span>
                    </div>
                    <div className="notification-item-content">
                      <div className="notification-item-header">
                        <span className="notification-item-title">
                          {notification.title}
                        </span>
                        {!notification.read && (
                          <span className="notification-dot"></span>
                        )}
                      </div>
                      <p className="notification-item-message">
                        {notification.message}
                      </p>
                      <div className="notification-item-footer">
                        <span className="notification-item-time">
                          {formatTime(notification.createdAt)}
                        </span>
                        {notification.link && (
                          <Link
                            href={notification.link}
                            className="notification-item-link"
                            onClick={() => {
                              notificationService.markAsRead(notification.id);
                              setIsOpen(false);
                            }}
                          >
                            View →
                          </Link>
                        )}
                      </div>
                    </div>
                    <div className="notification-item-actions">
                      {!notification.read && (
                        <button
                          onClick={(e) => handleMarkAsRead(notification.id, e)}
                          className="notification-mark-btn"
                          title="Mark as read"
                        >
                          <Check className="notification-mark-icon" />
                        </button>
                      )}
                      <button
                        onClick={(e) => handleDelete(notification.id, e)}
                        className="notification-delete-btn"
                        title="Delete"
                      >
                        <X className="notification-delete-icon" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .notification-bell {
          position: relative;
        }

        .notification-bell-btn {
          position: relative;
          padding: 0.5rem;
          background: transparent;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .notification-bell-btn:hover {
          background: #f3f4f6;
        }

        .notification-bell-icon {
          width: 1.25rem;
          height: 1.25rem;
          color: #6b7280;
        }

        .notification-badge {
          position: absolute;
          top: -0.25rem;
          right: -0.25rem;
          background: #ef4444;
          color: white;
          font-size: 0.6rem;
          font-weight: 600;
          min-width: 1.25rem;
          height: 1.25rem;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 0.25rem;
          animation: pulse-badge 2s ease-in-out infinite;
        }

        @keyframes pulse-badge {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .notification-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          width: 24rem;
          max-height: 32rem;
          background: white;
          border-radius: 0.75rem;
          box-shadow: 0 10px 40px rgba(0,0,0,0.15);
          border: 1px solid #e5e7eb;
          z-index: 1000;
          margin-top: 0.5rem;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .notification-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #f3f4f6;
          flex-shrink: 0;
        }

        .notification-header h3 {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1f2937;
        }

        .notification-count {
          font-size: 0.625rem;
          color: #6b7280;
          margin-left: 0.5rem;
        }

        .notification-actions {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .notification-action-btn {
          padding: 0.25rem;
          background: transparent;
          border: none;
          border-radius: 0.25rem;
          cursor: pointer;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b7280;
        }

        .notification-action-btn:hover {
          background: #f3f4f6;
          color: #374151;
        }

        .notification-action-icon {
          width: 1rem;
          height: 1rem;
        }

        .notification-list {
          flex: 1;
          overflow-y: auto;
          padding: 0.5rem;
        }

        .notification-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          padding: 2rem 0;
          color: #9ca3af;
        }

        .notification-empty-icon {
          width: 2.5rem;
          height: 2.5rem;
          color: #d1d5db;
        }

        .notification-empty p {
          font-size: 0.875rem;
          font-weight: 500;
          color: #6b7280;
        }

        .notification-empty span {
          font-size: 0.75rem;
        }

        .notification-item {
          display: flex;
          gap: 0.75rem;
          padding: 0.75rem;
          border-radius: 0.5rem;
          margin-bottom: 0.25rem;
          transition: background 0.2s;
          border: 1px solid transparent;
        }

        .notification-item:hover {
          background: #f9fafb;
        }

        .notification-unread {
          border-color: #e5e7eb;
        }

        .notification-unread .notification-item-title {
          font-weight: 600;
        }

        .notification-item-icon {
          flex-shrink: 0;
          font-size: 1.25rem;
        }

        .notification-item-content {
          flex: 1;
          min-width: 0;
        }

        .notification-item-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .notification-item-title {
          font-size: 0.75rem;
          font-weight: 500;
          color: #1f2937;
        }

        .notification-dot {
          width: 0.375rem;
          height: 0.375rem;
          background: #3b82f6;
          border-radius: 50%;
          flex-shrink: 0;
          animation: pulse-dot 2s ease-in-out infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .notification-item-message {
          font-size: 0.7rem;
          color: #6b7280;
          margin: 0.125rem 0 0.25rem 0;
          line-height: 1.4;
        }

        .notification-item-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .notification-item-time {
          font-size: 0.55rem;
          color: #9ca3af;
        }

        .notification-item-link {
          font-size: 0.6rem;
          color: #10a37f;
          text-decoration: none;
          font-weight: 500;
        }

        .notification-item-link:hover {
          text-decoration: underline;
        }

        .notification-item-actions {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
          flex-shrink: 0;
        }

        .notification-mark-btn,
        .notification-delete-btn {
          padding: 0.125rem;
          background: transparent;
          border: none;
          border-radius: 0.25rem;
          cursor: pointer;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9ca3af;
        }

        .notification-mark-btn:hover {
          background: #d1fae5;
          color: #10a37f;
        }

        .notification-delete-btn:hover {
          background: #fef2f2;
          color: #ef4444;
        }

        .notification-mark-icon,
        .notification-delete-icon {
          width: 0.75rem;
          height: 0.75rem;
        }

        /* Responsive */
        @media (max-width: 640px) {
          .notification-dropdown {
            width: 20rem;
            right: -4rem;
          }
        }

        @media (max-width: 480px) {
          .notification-dropdown {
            width: 18rem;
            right: -6rem;
          }
        }
      `}</style>
    </div>
  );
}
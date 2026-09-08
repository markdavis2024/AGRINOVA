// lib/notifications.ts
import { prisma } from "./prisma";

// Types
export interface NotificationData {
  userId: number;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  link?: string;
  metadata?: any;
}

// Create a notification
export async function createNotification(data: NotificationData) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        message: data.message,
        type: data.type,
        link: data.link || null,
        metadata: data.metadata || null,
        read: false,
      },
    });
    return notification;
  } catch (error) {
    console.error("Failed to create notification:", error);
    return null;
  }
}

// Get user notifications
export async function getUserNotifications(userId: number, limit = 50) {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return notifications;
  } catch (error) {
    console.error("Failed to get notifications:", error);
    return [];
  }
}

// Mark notification as read
export async function markNotificationAsRead(notificationId: number) {
  try {
    await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });
    return true;
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
    return false;
  }
}

// Mark all notifications as read
export async function markAllNotificationsAsRead(userId: number) {
  try {
    await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
    return true;
  } catch (error) {
    console.error("Failed to mark all notifications as read:", error);
    return false;
  }
}

// Get unread count
export async function getUnreadNotificationCount(userId: number) {
  try {
    const count = await prisma.notification.count({
      where: { userId, read: false },
    });
    return count;
  } catch (error) {
    console.error("Failed to get unread count:", error);
    return 0;
  }
}

// Push notification to browser
export function pushNotification(title: string, body: string, icon?: string) {
  if (typeof window !== "undefined" && "Notification" in window) {
    if (Notification.permission === "granted") {
      new Notification(title, {
        body: body,
        icon: icon || "/agrinova-logo.png",
      });
    } else if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }
}

// Request notification permission
export function requestNotificationPermission() {
  if (typeof window !== "undefined" && "Notification" in window) {
    Notification.requestPermission();
  }
}
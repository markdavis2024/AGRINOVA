// Notification Types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  icon: string;
  read: boolean;
  createdAt: Date;
  link?: string;
  action?: {
    label: string;
    url: string;
  };
}

// Notification Events
export type NotificationEvent = 
  | { type: 'WEATHER_ALERT'; data: any }
  | { type: 'ORDER_RECEIVED'; data: any }
  | { type: 'ORDER_CONFIRMED'; data: any }
  | { type: 'ORDER_DELIVERED'; data: any }
  | { type: 'MESSAGE_RECEIVED'; data: any }
  | { type: 'CONSULTATION_BOOKED'; data: any }
  | { type: 'CONSULTATION_REMINDER'; data: any }
  | { type: 'DIAGNOSIS_REQUESTED'; data: any }
  | { type: 'DIAGNOSIS_COMPLETED'; data: any }
  | { type: 'LISTING_VIEWED'; data: any }
  | { type: 'LISTING_SOLD'; data: any }
  | { type: 'FARM_UPDATE'; data: any }
  | { type: 'CROP_ALERT'; data: any }
  | { type: 'WEATHER_FORECAST'; data: any }
  | { type: 'SYSTEM_UPDATE'; data: any };

// Notification Service
class NotificationService {
  private listeners: ((notifications: Notification[]) => void)[] = [];
  private notifications: Notification[] = [];
  private userId: string | null = null;

  // Initialize with user ID
  initialize(userId: string) {
    this.userId = userId;
    this.loadNotifications();
    this.setupEventListeners();
  }

  // Load notifications from localStorage
  private loadNotifications() {
    try {
      const saved = localStorage.getItem(`notifications_${this.userId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.notifications = parsed.map((n: any) => ({
          ...n,
          createdAt: new Date(n.createdAt)
        }));
      } else {
        // Add sample notifications for demo
        this.addSampleNotifications();
      }
      this.notifyListeners();
    } catch (error) {
      console.error('Error loading notifications:', error);
      this.addSampleNotifications();
    }
  }

  // Add sample notifications
  private addSampleNotifications() {
    this.notifications = [
      {
        id: `notif_${Date.now()}_1`,
        userId: this.userId || '1',
        title: 'Welcome to AGRINOVA!',
        message: 'Start managing your farm and connect with buyers today.',
        type: 'success',
        icon: '🎉',
        read: false,
        createdAt: new Date(),
        link: '/farmer'
      },
      {
        id: `notif_${Date.now()}_2`,
        userId: this.userId || '1',
        title: 'Weather Alert',
        message: 'Heavy rainfall expected in your area tomorrow. Ensure proper drainage.',
        type: 'warning',
        icon: '🌧️',
        read: false,
        createdAt: new Date(Date.now() - 3600000),
        link: '/weather'
      },
      {
        id: `notif_${Date.now()}_3`,
        userId: this.userId || '1',
        title: 'Planting Season Update',
        message: 'Optimal planting conditions for maize this week. Check your farm plan.',
        type: 'info',
        icon: '🌱',
        read: false,
        createdAt: new Date(Date.now() - 7200000),
        link: '/farmer/farms'
      }
    ];
    this.saveNotifications();
  }

  // Save notifications to localStorage
  private saveNotifications() {
    if (this.userId) {
      localStorage.setItem(`notifications_${this.userId}`, JSON.stringify(this.notifications));
    }
  }

  // Setup event listeners for real-time updates
  private setupEventListeners() {
    // Listen for weather updates
    window.addEventListener('weather-update', (event: any) => {
      this.addNotification({
        type: 'info',
        title: 'Weather Update',
        message: event.detail?.message || 'Weather forecast updated for your region.',
        icon: '🌤️',
        link: '/weather'
      });
    });

    // Listen for order events
    window.addEventListener('order-event', (event: any) => {
      const { action, orderId } = event.detail || {};
      const messages: Record<string, string> = {
        'received': 'New order received! Check your orders.',
        'confirmed': 'Order has been confirmed!',
        'delivered': 'Order has been delivered!',
      };
      this.addNotification({
        type: 'success',
        title: `Order ${action.charAt(0).toUpperCase() + action.slice(1)}`,
        message: messages[action] || `Order ${action}`,
        icon: '📦',
        link: '/farmer/orders'
      });
    });

    // Listen for message events
    window.addEventListener('message-event', (event: any) => {
      this.addNotification({
        type: 'info',
        title: 'New Message',
        message: `You have a new message from ${event.detail?.sender || 'a buyer'}`,
        icon: '💬',
        link: '/messages'
      });
    });

    // Listen for consultation events
    window.addEventListener('consultation-event', (event: any) => {
      const { action } = event.detail || {};
      this.addNotification({
        type: 'info',
        title: `Consultation ${action}`,
        message: action === 'booked' ? 'New consultation booked!' : 'Consultation reminder',
        icon: '📅',
        link: '/farmer/consultations'
      });
    });
  }

  // Add a new notification
  addNotification(data: {
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    icon: string;
    link?: string;
    action?: { label: string; url: string };
  }) {
    const notification: Notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      userId: this.userId || '1',
      title: data.title,
      message: data.message,
      type: data.type,
      icon: data.icon,
      read: false,
      createdAt: new Date(),
      link: data.link,
      action: data.action
    };

    this.notifications.unshift(notification);
    this.saveNotifications();
    this.notifyListeners();

    // Show browser notification if permitted
    this.showBrowserNotification(notification);

    return notification;
  }

  // Show browser notification
  private showBrowserNotification(notification: Notification) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/AGRINOVA-logo.png'
      });
    }
  }

  // Request notification permission
  requestPermission() {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }

  // Get all notifications
  getNotifications(): Notification[] {
    return this.notifications;
  }

  // Get unread count
  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  // Mark notification as read
  markAsRead(id: string) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.saveNotifications();
      this.notifyListeners();
    }
  }

  // Mark all as read
  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.saveNotifications();
    this.notifyListeners();
  }

  // Delete notification
  deleteNotification(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.saveNotifications();
    this.notifyListeners();
  }

  // Clear all notifications
  clearAll() {
    this.notifications = [];
    this.saveNotifications();
    this.notifyListeners();
  }

  // Subscribe to notification changes
  subscribe(listener: (notifications: Notification[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notify all listeners
  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.notifications));
  }

  // Trigger a notification event
  triggerEvent(event: NotificationEvent) {
    const eventMap: Record<string, { title: string; message: string; icon: string; type: 'info' | 'success' | 'warning' | 'error' }> = {
      'WEATHER_ALERT': {
        title: '⚠️ Weather Alert',
        message: 'Severe weather conditions expected. Check details.',
        icon: '🌪️',
        type: 'warning'
      },
      'ORDER_RECEIVED': {
        title: '📦 New Order',
        message: 'You have received a new order from a buyer.',
        icon: '📦',
        type: 'success'
      },
      'ORDER_CONFIRMED': {
        title: '✅ Order Confirmed',
        message: 'Your order has been confirmed by the buyer.',
        icon: '✅',
        type: 'success'
      },
      'ORDER_DELIVERED': {
        title: '🚚 Order Delivered',
        message: 'Your order has been delivered successfully.',
        icon: '🚚',
        type: 'success'
      },
      'MESSAGE_RECEIVED': {
        title: '💬 New Message',
        message: 'You have a new message from a farmer.',
        icon: '💬',
        type: 'info'
      },
      'CONSULTATION_BOOKED': {
        title: '📅 Consultation Booked',
        message: 'A new consultation has been booked with you.',
        icon: '📅',
        type: 'info'
      },
      'CONSULTATION_REMINDER': {
        title: '⏰ Consultation Reminder',
        message: 'You have a consultation in 1 hour.',
        icon: '⏰',
        type: 'warning'
      },
      'DIAGNOSIS_REQUESTED': {
        title: '🔬 Diagnosis Requested',
        message: 'A farmer has requested a crop diagnosis.',
        icon: '🔬',
        type: 'info'
      },
      'DIAGNOSIS_COMPLETED': {
        title: '✅ Diagnosis Complete',
        message: 'Your crop diagnosis is ready for review.',
        icon: '✅',
        type: 'success'
      },
      'LISTING_VIEWED': {
        title: '👀 Listing Viewed',
        message: 'Your product listing has been viewed by a buyer.',
        icon: '👀',
        type: 'info'
      },
      'LISTING_SOLD': {
        title: '💰 Product Sold!',
        message: 'Your product has been sold! Check your orders.',
        icon: '💰',
        type: 'success'
      },
      'FARM_UPDATE': {
        title: '🌾 Farm Update',
        message: 'Update: Your farm information has been updated.',
        icon: '🌾',
        type: 'info'
      },
      'CROP_ALERT': {
        title: '🌿 Crop Alert',
        message: 'Your crops need attention. Check the details.',
        icon: '🌿',
        type: 'warning'
      },
      'WEATHER_FORECAST': {
        title: '🌤️ Weather Forecast',
        message: 'New weather forecast available for your region.',
        icon: '🌤️',
        type: 'info'
      },
      'SYSTEM_UPDATE': {
        title: '🔄 System Update',
        message: 'AGRINOVA has been updated with new features.',
        icon: '🔄',
        type: 'info'
      }
    };

    const eventData = eventMap[event.type];
    if (eventData) {
      this.addNotification({
        type: eventData.type,
        title: eventData.title,
        message: eventData.message,
        icon: eventData.icon,
        link: this.getLinkForEvent(event.type)
      });
    }
  }

  private getLinkForEvent(type: string): string {
    const links: Record<string, string> = {
      'WEATHER_ALERT': '/weather',
      'WEATHER_FORECAST': '/weather',
      'ORDER_RECEIVED': '/farmer/orders',
      'ORDER_CONFIRMED': '/farmer/orders',
      'ORDER_DELIVERED': '/farmer/orders',
      'MESSAGE_RECEIVED': '/messages',
      'CONSULTATION_BOOKED': '/farmer/consultations',
      'CONSULTATION_REMINDER': '/farmer/consultations',
      'DIAGNOSIS_REQUESTED': '/farmer/diagnosis',
      'DIAGNOSIS_COMPLETED': '/farmer/diagnosis',
      'LISTING_VIEWED': '/farmer/marketplace',
      'LISTING_SOLD': '/farmer/orders',
      'FARM_UPDATE': '/farmer/farms',
      'CROP_ALERT': '/farmer/farms',
      'SYSTEM_UPDATE': '/'
    };
    return links[type] || '/';
  }
}

// Singleton instance
export const notificationService = new NotificationService();
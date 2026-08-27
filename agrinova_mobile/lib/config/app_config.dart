class AppConfig {
  static const String appName = 'AGRINOVA';
  static const String appVersion = '1.0.0';

  // API Base URL - Change this to your actual backend URL
  static const String apiBaseUrl = 'http://localhost:3000/api';

  // Timeouts
  static const int connectionTimeout = 30000; // 30 seconds
  static const int receiveTimeout = 30000; // 30 seconds

  // Feature flags
  static const bool enableIoT = true;
  static const bool enableOfflineMode = true;
  static const bool enablePushNotifications = true;
}
class ApiConfig {
  // Auth endpoints
  static const String login = '/auth/login';
  static const String register = '/auth/register';
  static const String logout = '/auth/logout';
  static const String refreshToken = '/auth/refresh';
  static const String me = '/auth/me';

  // User endpoints
  static const String users = '/users';
  static const String userProfile = '/users/profile';

  // Farm endpoints
  static const String farms = '/farms';
  static const String crops = '/crops';
  static const String sensorReadings = '/sensor-readings';

  // Marketplace endpoints
  static const String listings = '/listings';
  static const String orders = '/orders';

  // Messages endpoints
  static const String messages = '/messages';
  static const String conversations = '/messages/conversations';

  // Alerts endpoints
  static const String alerts = '/alerts';

  // Analytics endpoints
  static const String analytics = '/analytics';
}
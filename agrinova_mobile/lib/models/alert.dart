enum AlertType {
  irrigation,
  pest,
  disease,
  weather,
  market,
  system,
}

enum AlertPriority {
  low,
  medium,
  high,
  critical,
}

class Alert {
  final String id;
  final String title;
  final String message;
  final AlertType type;
  final AlertPriority priority;
  final bool isRead;
  final bool isResolved;
  final String? farmId;
  final String? cropId;
  final Map<String, dynamic>? metadata;
  final DateTime createdAt;
  final DateTime? resolvedAt;

  Alert({
    required this.id,
    required this.title,
    required this.message,
    required this.type,
    required this.priority,
    this.isRead = false,
    this.isResolved = false,
    this.farmId,
    this.cropId,
    this.metadata,
    required this.createdAt,
    this.resolvedAt,
  });

  factory Alert.fromJson(Map<String, dynamic> json) {
    return Alert(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      message: json['message'] ?? '',
      type: _parseAlertType(json['type'] ?? 'system'),
      priority: _parseAlertPriority(json['priority'] ?? 'medium'),
      isRead: json['isRead'] ?? json['is_read'] ?? false,
      isResolved: json['isResolved'] ?? json['is_resolved'] ?? false,
      farmId: json['farmId'] ?? json['farm_id'],
      cropId: json['cropId'] ?? json['crop_id'],
      metadata: json['metadata'],
      createdAt: DateTime.tryParse(json['createdAt'] ?? json['created_at'] ?? '') ?? DateTime.now(),
      resolvedAt: json['resolvedAt'] != null ? DateTime.tryParse(json['resolvedAt']) : null,
    );
  }

  static AlertType _parseAlertType(String type) {
    switch (type.toLowerCase()) {
      case 'irrigation':
        return AlertType.irrigation;
      case 'pest':
        return AlertType.pest;
      case 'disease':
        return AlertType.disease;
      case 'weather':
        return AlertType.weather;
      case 'market':
        return AlertType.market;
      default:
        return AlertType.system;
    }
  }

  static AlertPriority _parseAlertPriority(String priority) {
    switch (priority.toLowerCase()) {
      case 'low':
        return AlertPriority.low;
      case 'high':
        return AlertPriority.high;
      case 'critical':
        return AlertPriority.critical;
      default:
        return AlertPriority.medium;
    }
  }

  Color get priorityColor {
    switch (priority) {
      case AlertPriority.low:
        return Colors.green;
      case AlertPriority.medium:
        return Colors.orange;
      case AlertPriority.high:
        return Colors.red.shade700;
      case AlertPriority.critical:
        return Colors.red;
    }
  }

  IconData get typeIcon {
    switch (type) {
      case AlertType.irrigation:
        return Icons.water_drop;
      case AlertType.pest:
        return Icons.bug_report;
      case AlertType.disease:
        return Icons.sick;
      case AlertType.weather:
        return Icons.wb_sunny;
      case AlertType.market:
        return Icons.shopping_cart;
      case AlertType.system:
        return Icons.settings;
    }
  }
}
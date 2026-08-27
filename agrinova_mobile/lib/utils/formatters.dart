import 'package:intl/intl.dart';

class Formatters {
  static String formatCurrency(double amount) {
    final formatter = NumberFormat.currency(
      symbol: '₦',
      decimalDigits: 0,
    );
    return formatter.format(amount);
  }

  static String formatDate(DateTime date) {
    final formatter = DateFormat('MMM d, yyyy');
    return formatter.format(date);
  }

  static String formatDateTime(DateTime date) {
    final formatter = DateFormat('MMM d, yyyy h:mm a');
    return formatter.format(date);
  }

  static String formatTimeAgo(DateTime date) {
    final now = DateTime.now();
    final difference = now.difference(date);

    if (difference.inDays > 7) {
      return formatDate(date);
    } else if (difference.inDays > 0) {
      return '${difference.inDays}d ago';
    } else if (difference.inHours > 0) {
      return '${difference.inHours}h ago';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes}m ago';
    } else {
      return 'Just now';
    }
  }

  static String truncateText(String text, int maxLength) {
    if (text.length <= maxLength) return text;
    return '${text.substring(0, maxLength)}...';
  }
}
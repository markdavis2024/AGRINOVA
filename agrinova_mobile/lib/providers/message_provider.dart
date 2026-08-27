import 'package:flutter/material.dart';

class MessageProvider extends ChangeNotifier {
  String? _token;
  List<Map<String, dynamic>> _conversations = [];
  bool _isLoading = false;

  String? get token => _token;
  List<Map<String, dynamic>> get conversations => _conversations;
  bool get isLoading => _isLoading;

  void setToken(String? token) {
    _token = token;
    _loadConversations();
  }

  Future<void> _loadConversations() async {
    _isLoading = true;
    notifyListeners();

    // Simulate API call
    await Future.delayed(const Duration(milliseconds: 500));

    _conversations = [
      {
        'id': '1',
        'name': 'Farmers\' Group',
        'icon': '🌾',
        'lastMessage': 'New organic maize available...',
        'time': '2 min ago',
        'unread': true,
      },
      {
        'id': '2',
        'name': 'Buyer - Jane Smith',
        'icon': '🛒',
        'lastMessage': 'How much for 50kg?',
        'time': '1 hour ago',
        'unread': false,
      },
      {
        'id': '3',
        'name': 'Agronomist - Dr. Peter',
        'icon': '🧑‍🌾',
        'lastMessage': 'Schedule consultation for next week',
        'time': 'Yesterday',
        'unread': true,
      },
    ];

    _isLoading = false;
    notifyListeners();
  }

  void sendMessage(String conversationId, String message) {
    // Simulate sending message
    final index = _conversations.indexWhere((c) => c['id'] == conversationId);
    if (index != -1) {
      _conversations[index]['lastMessage'] = message;
      _conversations[index]['time'] = 'Just now';
      notifyListeners();
    }
  }
}
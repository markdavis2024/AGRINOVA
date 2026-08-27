import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../models/user.dart';

class AuthProvider extends ChangeNotifier {
  User? _user;
  String? _token;
  bool _isLoading = false;
  bool _isAuthenticated = false;

  User? get user => _user;
  String? get token => _token;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _isAuthenticated;

  AuthProvider() {
    _loadAuthData();
  }

  Future<void> _loadAuthData() async {
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString('auth_token');
    if (_token != null) {
      _isAuthenticated = true;
      // You can load user from storage here
    }
    notifyListeners();
  }

  Future<bool> login(String identifier, String password) async {
    _setLoading(true);

    try {
      // Simulate API call
      await Future.delayed(const Duration(seconds: 1));

      // Demo login - accept any credentials
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('auth_token', 'demo_token_12345');

      _token = 'demo_token_12345';
      _user = User(
        id: '1',
        email: identifier,
        fullName: 'John Farmer',
        role: UserRole.farmer,
        createdAt: DateTime.now(),
        phone: '+237 6XX XXX XXX',
        farmName: 'Green Valley Farm',
        farmLocation: 'Bamenda',
        crops: ['Maize', 'Tomatoes', 'Beans'],
        isIoTEnabled: false,
      );
      _isAuthenticated = true;

      _setLoading(false);
      return true;
    } catch (e) {
      _setLoading(false);
      return false;
    }
  }

  Future<bool> autoLogin(String token) async {
    _setLoading(true);

    try {
      // Verify token with API
      await Future.delayed(const Duration(milliseconds: 500));

      if (token == 'demo_token_12345') {
        _token = token;
        _user = User(
          id: '1',
          email: 'john@farmer.com',
          fullName: 'John Farmer',
          role: UserRole.farmer,
          createdAt: DateTime.now(),
          phone: '+237 6XX XXX XXX',
          farmName: 'Green Valley Farm',
          farmLocation: 'Bamenda',
          crops: ['Maize', 'Tomatoes', 'Beans'],
          isIoTEnabled: false,
        );
        _isAuthenticated = true;
        _setLoading(false);
        return true;
      }

      _setLoading(false);
      return false;
    } catch (e) {
      _setLoading(false);
      return false;
    }
  }

  Future<void> logout() async {
    _setLoading(true);

    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');

    _token = null;
    _user = null;
    _isAuthenticated = false;

    _setLoading(false);
    notifyListeners();
  }

  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void setUser(User user) {
    _user = user;
    notifyListeners();
  }
}
import 'dart:convert';
import 'package:dio/dio.dart';

class AuthService {
  final Dio _dio = Dio();

  Future<Map<String, dynamic>> login(String identifier, String password) async {
    // Simulate API call - replace with your actual API endpoint
    await Future.delayed(const Duration(seconds: 1));

    // Demo response
    return {
      'success': true,
      'token': 'demo_token_12345',
      'user': {
        'id': '1',
        'email': identifier,
        'fullName': 'John Farmer',
        'role': 'farmer',
        'phone': '+237 6XX XXX XXX',
        'createdAt': DateTime.now().toIso8601String(),
        'farmName': 'Green Valley Farm',
        'farmLocation': 'Bamenda',
        'crops': ['Maize', 'Tomatoes', 'Beans'],
      }
    };
  }

  Future<Map<String, dynamic>?> getCurrentUser(String token) async {
    // Simulate API call
    await Future.delayed(const Duration(milliseconds: 500));

    if (token == 'demo_token_12345') {
      return {
        'id': '1',
        'email': 'john@farmer.com',
        'fullName': 'John Farmer',
        'role': 'farmer',
        'phone': '+237 6XX XXX XXX',
        'createdAt': DateTime.now().toIso8601String(),
        'farmName': 'Green Valley Farm',
        'farmLocation': 'Bamenda',
        'crops': ['Maize', 'Tomatoes', 'Beans'],
      };
    }
    return null;
  }

  Future<Map<String, dynamic>> register(Map<String, dynamic> userData) async {
    // Simulate API call
    await Future.delayed(const Duration(seconds: 1));

    return {
      'success': true,
      'message': 'Registration successful',
      'user': userData,
    };
  }
}
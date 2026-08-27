import 'package:flutter/material.dart';

class RegisterProvider extends ChangeNotifier {
  Map<String, dynamic> _formData = {};
  int _currentStep = 0;

  Map<String, dynamic> get formData => _formData;
  int get currentStep => _currentStep;

  void updateFormData(Map<String, dynamic> data) {
    _formData.addAll(data);
    notifyListeners();
  }

  void nextStep() {
    if (_currentStep < 4) {
      _currentStep++;
      notifyListeners();
    }
  }

  void previousStep() {
    if (_currentStep > 0) {
      _currentStep--;
      notifyListeners();
    }
  }

  void resetForm() {
    _formData = {};
    _currentStep = 0;
    notifyListeners();
  }
}
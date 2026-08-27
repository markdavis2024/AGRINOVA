import 'package:flutter/material.dart';
import '../models/farm.dart';

class FarmProvider extends ChangeNotifier {
  String? _token;
  List<Farm> _farms = [];
  bool _isLoading = false;

  String? get token => _token;
  List<Farm> get farms => _farms;
  bool get isLoading => _isLoading;

  void setToken(String? token) {
    _token = token;
    _loadFarms();
  }

  Future<void> _loadFarms() async {
    _isLoading = true;
    notifyListeners();

    // Simulate API call
    await Future.delayed(const Duration(milliseconds: 500));

    _farms = [
      Farm(
        id: '1',
        name: 'Green Valley Farm',
        location: 'Bamenda',
        size: 5.0,
        sizeUnit: 'hectares',
        description: 'Organic maize and vegetable farm',
        createdAt: DateTime.now(),
        crops: [
          Crop(
            id: '1',
            name: 'Maize',
            variety: 'Hybrid',
            plantingDate: DateTime.now().subtract(const Duration(days: 30)),
            expectedHarvestDate: DateTime.now().add(const Duration(days: 60)),
            area: 3.0,
            status: 'Growing',
          ),
          Crop(
            id: '2',
            name: 'Tomatoes',
            variety: 'Cherry',
            plantingDate: DateTime.now().subtract(const Duration(days: 15)),
            expectedHarvestDate: DateTime.now().add(const Duration(days: 45)),
            area: 1.5,
            status: 'Growing',
          ),
        ],
      ),
    ];

    _isLoading = false;
    notifyListeners();
  }

  void addFarm(Farm farm) {
    _farms.add(farm);
    notifyListeners();
  }

  void updateFarm(Farm farm) {
    final index = _farms.indexWhere((f) => f.id == farm.id);
    if (index != -1) {
      _farms[index] = farm;
      notifyListeners();
    }
  }

  void deleteFarm(String id) {
    _farms.removeWhere((f) => f.id == id);
    notifyListeners();
  }
}
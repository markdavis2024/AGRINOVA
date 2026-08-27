class Farm {
  final String id;
  final String name;
  final String? location;
  final double? size;
  final String? sizeUnit;
  final String? description;
  final List<Crop>? crops;
  final List<SensorReading>? sensorReadings;
  final DateTime createdAt;
  final DateTime? updatedAt;

  Farm({
    required this.id,
    required this.name,
    this.location,
    this.size,
    this.sizeUnit,
    this.description,
    this.crops,
    this.sensorReadings,
    required this.createdAt,
    this.updatedAt,
  });

  factory Farm.fromJson(Map<String, dynamic> json) {
    return Farm(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      location: json['location'],
      size: json['size']?.toDouble(),
      sizeUnit: json['sizeUnit'] ?? json['size_unit'],
      description: json['description'],
      crops: json['crops'] != null
          ? (json['crops'] as List).map((e) => Crop.fromJson(e)).toList()
          : null,
      sensorReadings: json['sensorReadings'] != null
          ? (json['sensorReadings'] as List).map((e) => SensorReading.fromJson(e)).toList()
          : null,
      createdAt: DateTime.tryParse(json['createdAt'] ?? json['created_at'] ?? '') ?? DateTime.now(),
      updatedAt: json['updatedAt'] != null ? DateTime.tryParse(json['updatedAt']) : null,
    );
  }
}

class Crop {
  final String id;
  final String name;
  final String? variety;
  final DateTime? plantingDate;
  final DateTime? expectedHarvestDate;
  final double? area;
  final String? status;
  final List<SensorReading>? sensorReadings;

  Crop({
    required this.id,
    required this.name,
    this.variety,
    this.plantingDate,
    this.expectedHarvestDate,
    this.area,
    this.status,
    this.sensorReadings,
  });

  factory Crop.fromJson(Map<String, dynamic> json) {
    return Crop(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      variety: json['variety'],
      plantingDate: json['plantingDate'] != null ? DateTime.tryParse(json['plantingDate']) : null,
      expectedHarvestDate: json['expectedHarvestDate'] != null ? DateTime.tryParse(json['expectedHarvestDate']) : null,
      area: json['area']?.toDouble(),
      status: json['status'],
      sensorReadings: json['sensorReadings'] != null
          ? (json['sensorReadings'] as List).map((e) => SensorReading.fromJson(e)).toList()
          : null,
    );
  }
}

class SensorReading {
  final String id;
  final String? cropId;
  final String? farmId;
  final double? soilMoisture;
  final double? temperature;
  final double? humidity;
  final double? ph;
  final double? lightIntensity;
  final DateTime timestamp;

  SensorReading({
    required this.id,
    this.cropId,
    this.farmId,
    this.soilMoisture,
    this.temperature,
    this.humidity,
    this.ph,
    this.lightIntensity,
    required this.timestamp,
  });

  factory SensorReading.fromJson(Map<String, dynamic> json) {
    return SensorReading(
      id: json['id'] ?? '',
      cropId: json['cropId'] ?? json['crop_id'],
      farmId: json['farmId'] ?? json['farm_id'],
      soilMoisture: json['soilMoisture']?.toDouble() ?? json['soil_moisture']?.toDouble(),
      temperature: json['temperature']?.toDouble(),
      humidity: json['humidity']?.toDouble(),
      ph: json['ph']?.toDouble(),
      lightIntensity: json['lightIntensity']?.toDouble() ?? json['light_intensity']?.toDouble(),
      timestamp: DateTime.tryParse(json['timestamp'] ?? '') ?? DateTime.now(),
    );
  }
}
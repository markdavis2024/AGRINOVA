enum UserRole {
  farmer,
  buyer,
  agronomist,
  admin,
}

class User {
  final String id;
  final String email;
  final String fullName;
  final String? phone;
  final UserRole role;
  final bool isVerified;
  final bool isSuspended;
  final String? profileImage;
  final DateTime createdAt;
  final DateTime? lastLogin;

  // Farmer specific
  final String? farmName;
  final String? farmLocation;
  final List<String>? crops;
  final bool? isIoTEnabled;

  // Buyer specific
  final String? organizationName;

  // Agronomist specific
  final String? specialization;
  final String? qualification;

  User({
    required this.id,
    required this.email,
    required this.fullName,
    this.phone,
    required this.role,
    this.isVerified = false,
    this.isSuspended = false,
    this.profileImage,
    required this.createdAt,
    this.lastLogin,
    this.farmName,
    this.farmLocation,
    this.crops,
    this.isIoTEnabled,
    this.organizationName,
    this.specialization,
    this.qualification,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] ?? '',
      email: json['email'] ?? '',
      fullName: json['fullName'] ?? json['full_name'] ?? '',
      phone: json['phone'],
      role: _parseRole(json['role'] ?? 'farmer'),
      isVerified: json['isVerified'] ?? json['is_verified'] ?? false,
      isSuspended: json['isSuspended'] ?? json['is_suspended'] ?? false,
      profileImage: json['profileImage'] ?? json['profile_image'],
      createdAt: DateTime.tryParse(json['createdAt'] ?? json['created_at'] ?? '') ?? DateTime.now(),
      lastLogin: json['lastLogin'] != null ? DateTime.tryParse(json['lastLogin']) : null,
      farmName: json['farmName'] ?? json['farm_name'],
      farmLocation: json['farmLocation'] ?? json['farm_location'],
      crops: json['crops'] != null ? List<String>.from(json['crops']) : null,
      isIoTEnabled: json['isIoTEnabled'] ?? json['is_iot_enabled'],
      organizationName: json['organizationName'] ?? json['organization_name'],
      specialization: json['specialization'],
      qualification: json['qualification'],
    );
  }

  static UserRole _parseRole(String role) {
    switch (role.toLowerCase()) {
      case 'farmer':
        return UserRole.farmer;
      case 'buyer':
        return UserRole.buyer;
      case 'agronomist':
        return UserRole.agronomist;
      case 'admin':
        return UserRole.admin;
      default:
        return UserRole.farmer;
    }
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'fullName': fullName,
      'phone': phone,
      'role': role.name,
      'isVerified': isVerified,
      'isSuspended': isSuspended,
      'profileImage': profileImage,
      'createdAt': createdAt.toIso8601String(),
      'lastLogin': lastLogin?.toIso8601String(),
      'farmName': farmName,
      'farmLocation': farmLocation,
      'crops': crops,
      'isIoTEnabled': isIoTEnabled,
      'organizationName': organizationName,
      'specialization': specialization,
      'qualification': qualification,
    };
  }

  User copyWith({
    String? id,
    String? email,
    String? fullName,
    String? phone,
    UserRole? role,
    bool? isVerified,
    bool? isSuspended,
    String? profileImage,
    DateTime? createdAt,
    DateTime? lastLogin,
    String? farmName,
    String? farmLocation,
    List<String>? crops,
    bool? isIoTEnabled,
    String? organizationName,
    String? specialization,
    String? qualification,
  }) {
    return User(
      id: id ?? this.id,
      email: email ?? this.email,
      fullName: fullName ?? this.fullName,
      phone: phone ?? this.phone,
      role: role ?? this.role,
      isVerified: isVerified ?? this.isVerified,
      isSuspended: isSuspended ?? this.isSuspended,
      profileImage: profileImage ?? this.profileImage,
      createdAt: createdAt ?? this.createdAt,
      lastLogin: lastLogin ?? this.lastLogin,
      farmName: farmName ?? this.farmName,
      farmLocation: farmLocation ?? this.farmLocation,
      crops: crops ?? this.crops,
      isIoTEnabled: isIoTEnabled ?? this.isIoTEnabled,
      organizationName: organizationName ?? this.organizationName,
      specialization: specialization ?? this.specialization,
      qualification: qualification ?? this.qualification,
    );
  }
}
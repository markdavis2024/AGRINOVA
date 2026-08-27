import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../screens/auth/farmer/buyer/agronomist/admin/shared/common/splash/landing/splash_screen.dart';
import '../screens/auth/farmer/buyer/agronomist/admin/shared/common/splash/landing/landing_screen.dart';
import '../screens/auth/farmer/buyer/agronomist/admin/shared/common/splash/landing/login_screen.dart';
import '../screens/auth/farmer/buyer/agronomist/admin/shared/common/splash/landing/register_selection_screen.dart';
import '../screens/auth/farmer/buyer/agronomist/admin/shared/common/splash/landing/farmer_register_screen.dart';
import '../screens/auth/farmer/buyer/agronomist/admin/shared/common/splash/landing/buyer_register_screen.dart';
import '../screens/auth/farmer/buyer/agronomist/admin/shared/common/splash/landing/agronomist_register_screen.dart';
import '../screens/auth/farmer/buyer/agronomist/admin/shared/common/splash/landing/admin_register_screen.dart';
import '../screens/auth/farmer/buyer/agronomist/admin/shared/common/splash/landing/farmer_home_screen.dart';
import '../screens/auth/farmer/buyer/agronomist/admin/shared/common/splash/landing/buyer_home_screen.dart';
import '../screens/auth/farmer/buyer/agronomist/admin/shared/common/splash/landing/agronomist_home_screen.dart';
import '../screens/auth/farmer/buyer/agronomist/admin/shared/common/splash/landing/admin_home_screen.dart';
import '../screens/auth/farmer/buyer/agronomist/admin/shared/common/splash/landing/marketplace_screen.dart';
import '../screens/auth/farmer/buyer/agronomist/admin/shared/common/splash/landing/messages_screen.dart';
import '../screens/auth/farmer/buyer/agronomist/admin/shared/common/splash/landing/profile_screen.dart';

class AppRoutes {
  static final router = GoRouter(
    initialLocation: '/splash',
    routes: [
      GoRoute(
        path: '/splash',
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(
        path: '/landing',
        builder: (context, state) => const LandingScreen(),
      ),
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/register-selection',
        builder: (context, state) => const RegisterSelectionScreen(),
      ),
      GoRoute(
        path: '/farmer-register',
        builder: (context, state) => const FarmerRegisterScreen(),
      ),
      GoRoute(
        path: '/buyer-register',
        builder: (context, state) => const BuyerRegisterScreen(),
      ),
      GoRoute(
        path: '/agronomist-register',
        builder: (context, state) => const AgronomistRegisterScreen(),
      ),
      GoRoute(
        path: '/admin-register',
        builder: (context, state) => const AdminRegisterScreen(),
      ),
      GoRoute(
        path: '/farmer-home',
        builder: (context, state) => const FarmerHomeScreen(),
      ),
      GoRoute(
        path: '/buyer-home',
        builder: (context, state) => const BuyerHomeScreen(),
      ),
      GoRoute(
        path: '/agronomist-home',
        builder: (context, state) => const AgronomistHomeScreen(),
      ),
      GoRoute(
        path: '/admin-home',
        builder: (context, state) => const AdminHomeScreen(),
      ),
      GoRoute(
        path: '/marketplace',
        builder: (context, state) => const MarketplaceScreen(),
      ),
      GoRoute(
        path: '/messages',
        builder: (context, state) => const MessagesScreen(),
      ),
      GoRoute(
        path: '/profile',
        builder: (context, state) => const ProfileScreen(),
      ),
    ],
  );
}

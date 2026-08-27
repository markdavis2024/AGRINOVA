import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../../../../../../../../../providers/auth_provider.dart';
import '../../../../../../../../../../theme/app_colors.dart';
import '../../../../../../../../../../widgets/common/logo_widget.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    _checkAuth();
  }

  Future<void> _checkAuth() async {
    await Future.delayed(const Duration(seconds: 2));
    if (!mounted) return;
    
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    if (authProvider.isAuthenticated) {
      final user = authProvider.user;
      if (user != null) {
        switch (user.role.name) {
          case 'farmer':
            context.go('/farmer-home');
            break;
          case 'buyer':
            context.go('/buyer-home');
            break;
          case 'agronomist':
            context.go('/agronomist-home');
            break;
          case 'admin':
            context.go('/admin-home');
            break;
          default:
            context.go('/landing');
        }
      } else {
        context.go('/landing');
      }
    } else {
      context.go('/landing');
    }
  }

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      backgroundColor: AppColors.greenDeep,
      body: Center(
        child: LogoWidget(
          width: 200,
          isDark: false,
        ),
      ),
    );
  }
}

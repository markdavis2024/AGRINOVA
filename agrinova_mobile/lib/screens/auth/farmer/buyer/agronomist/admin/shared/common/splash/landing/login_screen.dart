import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:agrinova_mobile/providers/auth_provider.dart';
import 'package:agrinova_mobile/theme/app_colors.dart';
import 'package:agrinova_mobile/widgets/common/custom_button.dart';
import 'package:agrinova_mobile/widgets/common/custom_input.dart';
import 'package:agrinova_mobile/widgets/common/logo_widget.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLoading = false;

  Future<void> _handleLogin() async {
    if (_emailController.text.isEmpty || _passwordController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter email and password')),
      );
      return;
    }

    setState(() => _isLoading = true);
    final success = await context.read<AuthProvider>().login(
      _emailController.text,
      _passwordController.text,
    );
    setState(() => _isLoading = false);

    if (success && mounted) {
      final user = context.read<AuthProvider>().user;
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
      }
    } else if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Login failed. Please check credentials.')),
      );
    }
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      appBar: AppBar(backgroundColor: AppColors.white),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            const LogoWidget(width: 120),
            const SizedBox(height: 32),
            const Text(
              'Sign In',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: AppColors.greenDeep,
              ),
            ),
            const SizedBox(height: 32),
            CustomInput(
              label: 'Email',
              hint: 'Enter your email',
              controller: _emailController,
              keyboardType: TextInputType.emailAddress,
            ),
            const SizedBox(height: 16),
            CustomInput(
              label: 'Password',
              hint: 'Enter your password',
              controller: _passwordController,
              obscureText: true,
            ),
            const SizedBox(height: 32),
            CustomButton(
              text: 'LOGIN',
              isLoading: _isLoading,
              onPressed: _handleLogin,
            ),
            const SizedBox(height: 16),
            TextButton(
              onPressed: () => context.push('/register-selection'),
              child: const Text(
                'Don\'t have an account? Register',
                style: TextStyle(color: AppColors.greenDark),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

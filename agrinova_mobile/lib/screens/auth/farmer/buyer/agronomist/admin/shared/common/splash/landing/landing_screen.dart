import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../../../../../../../theme/app_colors.dart';
import '../../../../../../../../../../widgets/common/custom_button.dart';
import '../../../../../../../../../../widgets/common/logo_widget.dart';

class LandingScreen extends StatelessWidget {
  const LandingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Column(
            children: [
              const Spacer(),
              const LogoWidget(width: 200),
              const SizedBox(height: 24),
              const Text(
                'Intelligent Agriculture\nManagement System',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w500,
                  color: AppColors.gray,
                ),
              ),
              const Spacer(),
              CustomButton(
                text: 'GET STARTED',
                onPressed: () => context.push('/register-selection'),
              ),
              const SizedBox(height: 16),
              OutlinedButton(
                style: OutlinedButton.styleFrom(
                  minimumSize: const Size(double.infinity, 56),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14),
                  ),
                ),
                onPressed: () => context.push('/login'),
                child: const Text(
                  'LOGIN TO ACCOUNT',
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    color: AppColors.greenDeep,
                  ),
                ),
              ),
              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:agrinova_mobile/theme/app_colors.dart';
import 'package:agrinova_mobile/widgets/common/logo_widget.dart';

class LoadingScreen extends StatelessWidget {
  const LoadingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      backgroundColor: AppColors.cream,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            LogoWidget(width: 150),
            SizedBox(height: 40),
            SizedBox(
              width: 40,
              height: 40,
              child: CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(AppColors.green),
                strokeWidth: 3,
              ),
            ),
            SizedBox(height: 20),
            Text(
              'Loading AGRINOVA...',
              style: TextStyle(
                color: AppColors.gray,
                fontSize: 14,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

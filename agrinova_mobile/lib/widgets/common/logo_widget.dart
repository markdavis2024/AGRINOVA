import 'package:flutter/material.dart';
import '../../theme/app_colors.dart';

class LogoWidget extends StatelessWidget {
  final double width;
  final bool isDark;

  const LogoWidget({
    super.key,
    this.width = 150,
    this.isDark = true,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(
          Icons.eco_rounded,
          size: width * 0.4,
          color: AppColors.green,
        ),
        Text(
          'AGRINOVA',
          style: TextStyle(
            fontSize: width * 0.15,
            fontWeight: FontWeight.w900,
            color: isDark ? AppColors.greenDeep : Colors.white,
            letterSpacing: 2,
          ),
        ),
      ],
    );
  }
}
import 'package:flutter/material.dart';
import '../../theme/app_colors.dart';

class StatCard extends StatelessWidget {
  final String icon;
  final String label;
  final String value;
  final Color backgroundColor;
  final VoidCallback? onTap;

  const StatCard({
    super.key,
    required this.icon,
    required this.label,
    required this.value,
    required this.backgroundColor,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: backgroundColor,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.border),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(icon, style: const TextStyle(fontSize: 24)),
            const SizedBox(height: 8),
            Text(
              value,
              style: const TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.w700,
                color: AppColors.greenDeep,
              ),
            ),
            Text(
              label,
              style: const TextStyle(
                fontSize: 13,
                color: AppColors.gray,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
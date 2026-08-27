import 'package:flutter/material.dart';
import '../../theme/app_colors.dart';

class QuickAction extends StatelessWidget {
  final String icon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  const QuickAction({
    super.key,
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: ListTile(
        leading: Container(
          width: 48,
          height: 48,
          decoration: BoxDecoration(
            color: AppColors.greenSoft,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Center(
            child: Text(icon, style: const TextStyle(fontSize: 24)),
          ),
        ),
        title: Text(
          title,
          style: const TextStyle(
            fontWeight: FontWeight.w700,
            color: AppColors.greenDeep,
          ),
        ),
        subtitle: Text(
          subtitle,
          style: const TextStyle(color: AppColors.gray, fontSize: 13),
        ),
        trailing: const Icon(Icons.chevron_right, color: AppColors.gray),
        onTap: onTap,
      ),
    );
  }
}
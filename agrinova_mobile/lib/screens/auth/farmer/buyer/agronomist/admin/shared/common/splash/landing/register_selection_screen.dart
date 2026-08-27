import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:agrinova_mobile/theme/app_colors.dart';

class RegisterSelectionScreen extends StatelessWidget {
  const RegisterSelectionScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      appBar: AppBar(
        backgroundColor: AppColors.white,
        title: const Text(
          'Select Account Type',
          style: TextStyle(color: AppColors.greenDeep, fontWeight: FontWeight.bold),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          children: [
            _buildRoleCard(
              context,
              title: 'Farmer',
              description: 'Manage crops, monitor soil, and sell produce.',
              icon: Icons.agriculture_rounded,
              onTap: () => context.push('/farmer-register'),
            ),
            const SizedBox(height: 16),
            _buildRoleCard(
              context,
              title: 'Buyer',
              description: 'Purchase fresh produce directly from farmers.',
              icon: Icons.shopping_basket_rounded,
              onTap: () => context.push('/buyer-register'),
            ),
            const SizedBox(height: 16),
            _buildRoleCard(
              context,
              title: 'Agronomist',
              description: 'Provide expert advice and monitor farm health.',
              icon: Icons.psychology_rounded,
              onTap: () => context.push('/agronomist-register'),
            ),
            const SizedBox(height: 16),
            _buildRoleCard(
              context,
              title: 'Admin',
              description: 'Oversee system operations and users.',
              icon: Icons.admin_panel_settings_rounded,
              onTap: () => context.push('/admin-register'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRoleCard(
    BuildContext context, {
    required String title,
    required String description,
    required IconData icon,
    required VoidCallback onTap,
  }) {
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        leading: Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: AppColors.greenSoft,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(icon, color: AppColors.greenDark, size: 30),
        ),
        title: Text(
          title,
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
        ),
        subtitle: Text(description),
        trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 16),
        onTap: onTap,
      ),
    );
  }
}

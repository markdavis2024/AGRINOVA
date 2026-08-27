import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:agrinova_mobile/theme/app_colors.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.cream,
      appBar: AppBar(
        backgroundColor: AppColors.cream,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
        title: const Text(
          'Profile',
          style: TextStyle(
            fontWeight: FontWeight.w700,
            color: AppColors.greenDeep,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.settings_outlined),
            onPressed: () {},
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            // Profile header
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: AppColors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppColors.border),
              ),
              child: Column(
                children: [
                  Container(
                    width: 80,
                    height: 80,
                    decoration: const BoxDecoration(
                      color: AppColors.greenSoft,
                      shape: BoxShape.circle,
                    ),
                    child: const Center(
                      child: Text(
                        '👤',
                        style: TextStyle(fontSize: 40),
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    'John Farmer',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w700,
                      color: AppColors.greenDeep,
                    ),
                  ),
                  const Text(
                    'john@farmer.com',
                    style: TextStyle(
                      color: AppColors.gray,
                      fontSize: 14,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.greenSoft,
                      borderRadius: BorderRadius.circular(50),
                    ),
                    child: const Text(
                      '🌾 Farmer',
                      style: TextStyle(
                        color: AppColors.greenDark,
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Menu items
            _buildMenuItem(Icons.person_outline, 'Edit Profile', () {}),
            _buildMenuItem(Icons.storefront_outlined, 'My Listings', () {}),
            _buildMenuItem(Icons.shopping_bag_outlined, 'Orders', () {}),
            _buildMenuItem(Icons.notifications_outlined, 'Notifications', () {}),
            _buildMenuItem(Icons.security_outlined, 'Privacy & Security', () {}),
            _buildMenuItem(Icons.help_outline, 'Help & Support', () {}),

            const SizedBox(height: 20),

            SizedBox(
              width: double.infinity,
              child: OutlinedButton(
                onPressed: () {
                  context.push('/landing');
                },
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: Colors.red),
                  foregroundColor: Colors.red,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
                child: const Text('Logout'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMenuItem(IconData icon, String title, VoidCallback onTap) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: ListTile(
        leading: Icon(icon, color: AppColors.greenDark),
        title: Text(
          title,
          style: const TextStyle(
            color: AppColors.black,
            fontWeight: FontWeight.w500,
          ),
        ),
        trailing: const Icon(Icons.chevron_right, color: AppColors.gray),
        onTap: onTap,
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'package:agrinova_mobile/theme/app_colors.dart';
import 'package:agrinova_mobile/widgets/common/logo_widget.dart';

class AgronomistHomeScreen extends StatelessWidget {
  const AgronomistHomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.cream,
      appBar: AppBar(
        backgroundColor: AppColors.cream,
        elevation: 0,
        title: const LogoWidget(width: 100),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_outlined),
            onPressed: () {},
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () {
              context.push('/landing');
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Welcome back, Expert!',
              style: TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.w700,
                color: AppColors.greenDeep,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'Monitor farm health and provide guidance.',
              style: TextStyle(
                color: AppColors.gray,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 24),

            // Expert Stats
            Row(
              children: [
                Expanded(
                  child: _buildStatCard('👨‍🌾', 'Consulted', '42', AppColors.greenSoft),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildStatCard('🏥', 'Diseases', '5', AppColors.sky),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: _buildStatCard('📍', 'Active Farms', '12', Colors.amber.shade50),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildStatCard('⭐', 'Rating', '4.9', AppColors.greenSoft),
                ),
              ],
            ),
            const SizedBox(height: 24),

            const Text(
              'Assigned Tasks',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w700,
                color: AppColors.greenDeep,
              ),
            ),
            const SizedBox(height: 16),
            _buildTaskCard('🔍', 'Soil Analysis', 'Green Valley Farm', 'Urgent'),
            const SizedBox(height: 12),
            _buildTaskCard('🐛', 'Pest Control', 'Sunrise Orchards', 'Normal'),
          ],
        ),
      ),
      bottomNavigationBar: _buildBottomNav(context),
    );
  }

  Widget _buildStatCard(String icon, String label, String value, Color bgColor) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: bgColor,
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
    );
  }

  Widget _buildTaskCard(String icon, String title, String farm, String priority) {
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
          child: Center(child: Text(icon, style: const TextStyle(fontSize: 24))),
        ),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.w700, color: AppColors.greenDeep)),
        subtitle: Text(farm),
        trailing: Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
          decoration: BoxDecoration(
            color: priority == 'Urgent' ? Colors.red.withAlpha(38) : AppColors.sky,
            borderRadius: BorderRadius.circular(8),
          ),
          child: Text(
            priority,
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.bold,
              color: priority == 'Urgent' ? Colors.red : AppColors.skyDark,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildBottomNav(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: AppColors.white,
        border: Border(
          top: BorderSide(color: AppColors.border),
        ),
      ),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildNavItem(Icons.home_filled, 'Home', true, () {}),
              _buildNavItem(Icons.analytics_outlined, 'Farms', false, () {}),
              _buildNavItem(Icons.chat_bubble_outline, 'Messages', false, () => context.push('/messages')),
              _buildNavItem(Icons.person_outline, 'Profile', false, () => context.push('/profile')),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNavItem(IconData icon, String label, bool isActive, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            icon,
            color: isActive ? AppColors.greenDark : AppColors.gray,
            size: 28,
          ),
          const SizedBox(height: 2),
          Text(
            label,
            style: TextStyle(
              fontSize: 10,
              color: isActive ? AppColors.greenDark : AppColors.gray,
              fontWeight: isActive ? FontWeight.w700 : FontWeight.w400,
            ),
          ),
        ],
      ),
    );
  }
}

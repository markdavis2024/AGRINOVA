import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:agrinova_mobile/theme/app_colors.dart';
import 'package:agrinova_mobile/widgets/common/logo_widget.dart';

class FarmerHomeScreen extends StatelessWidget {
  const FarmerHomeScreen({super.key});

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
              'Welcome back, Farmer!',
              style: TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.w700,
                color: AppColors.greenDeep,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'Here\'s what\'s happening on your farm today.',
              style: TextStyle(
                color: AppColors.gray,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 24),

            // Stats Grid
            Row(
              children: [
                Expanded(
                  child: _buildStatCard('🌾', 'Active Crops', '12', AppColors.greenSoft),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildStatCard('💧', 'Alerts', '3', AppColors.sky),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: _buildStatCard('📦', 'Listings', '5', Colors.amber.shade50),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildStatCard('📊', 'This Month', '₦450K', AppColors.greenSoft),
                ),
              ],
            ),
            const SizedBox(height: 24),

            // Quick Actions
            const Text(
              'Quick Actions',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w700,
                color: AppColors.greenDeep,
              ),
            ),
            const SizedBox(height: 16),
            _buildActionCard('🌱', 'Add Crop', 'Register a new crop', () {}),
            const SizedBox(height: 12),
            _buildActionCard('📦', 'New Listing', 'List produce for sale', () => context.push('/marketplace')),
            const SizedBox(height: 12),
            _buildActionCard('📊', 'Farm Report', 'View analytics', () {}),

            const SizedBox(height: 24),

            // Recent Alerts
            const Text(
              'Recent Alerts',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w700,
                color: AppColors.greenDeep,
              ),
            ),
            const SizedBox(height: 16),
            _buildAlertCard('⚠️', 'Irrigation needed', 'Maize field needs watering', AppColors.green),
            const SizedBox(height: 12),
            _buildAlertCard('🐛', 'Pest detected', 'Tomatoes - early detection', Colors.orange),
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

  Widget _buildActionCard(String icon, String title, String subtitle, VoidCallback onTap) {
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

  Widget _buildAlertCard(String icon, String title, String message, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: color.withOpacity(0.15),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Center(
              child: Text(icon, style: const TextStyle(fontSize: 24)),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontWeight: FontWeight.w700,
                    color: AppColors.greenDeep,
                  ),
                ),
                Text(
                  message,
                  style: const TextStyle(
                    color: AppColors.gray,
                    fontSize: 13,
                  ),
                ),
              ],
            ),
          ),
          const Icon(Icons.chevron_right, color: AppColors.gray),
        ],
      ),
    );
  }

  Widget _buildBottomNav(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
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
              _buildNavItem(Icons.agriculture, 'Farms', false, () {}),
              _buildNavItem(Icons.storefront_outlined, 'Market', false, () => context.push('/marketplace')),
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
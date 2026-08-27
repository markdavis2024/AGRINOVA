import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../../../../../../../theme/app_colors.dart';
import '../../../../../../../../../../widgets/common/logo_widget.dart';

class BuyerHomeScreen extends StatelessWidget {
  const BuyerHomeScreen({super.key});

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
              'Welcome back, Buyer!',
              style: TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.w700,
                color: AppColors.greenDeep,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'Discover fresh produce from local farmers.',
              style: TextStyle(
                color: AppColors.gray,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 24),

            Row(
              children: [
                Expanded(
                  child: _buildStatCard('🛒', 'Available', '24', AppColors.greenSoft),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildStatCard('📦', 'Orders', '6', AppColors.sky),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: _buildStatCard('⭐', 'Favorites', '8', Colors.amber.shade50),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildStatCard('📊', 'Spent', '₦320K', AppColors.greenSoft),
                ),
              ],
            ),
            const SizedBox(height: 24),

            const Text(
              'Recent Products',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w700,
                color: AppColors.greenDeep,
              ),
            ),
            const SizedBox(height: 16),
            _buildProductCard('🌾', 'Organic Maize', '200kg', '₦25,000', 'Bamenda'),
            const SizedBox(height: 12),
            _buildProductCard('🍅', 'Fresh Tomatoes', '50kg', '₦15,000', 'Yaoundé'),
            const SizedBox(height: 12),
            _buildProductCard('🌿', 'Green Beans', '100kg', '₦18,000', 'Douala'),

            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () => context.push('/marketplace'),
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
                child: const Text('Browse All Products →'),
              ),
            ),
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

  Widget _buildProductCard(String icon, String name, String quantity, String price, String location) {
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
            width: 60,
            height: 60,
            decoration: BoxDecoration(
              color: AppColors.greenSoft,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Center(
              child: Text(icon, style: const TextStyle(fontSize: 30)),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  name,
                  style: const TextStyle(
                    fontWeight: FontWeight.w700,
                    fontSize: 16,
                    color: AppColors.greenDeep,
                  ),
                ),
                Text('$quantity • $location', style: const TextStyle(color: AppColors.gray, fontSize: 13)),
                Text(price, style: const TextStyle(fontWeight: FontWeight.w700, color: AppColors.greenDark)),
              ],
            ),
          ),
          IconButton(
            icon: const Icon(Icons.add_shopping_cart, color: AppColors.greenDark),
            onPressed: () {},
          ),
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

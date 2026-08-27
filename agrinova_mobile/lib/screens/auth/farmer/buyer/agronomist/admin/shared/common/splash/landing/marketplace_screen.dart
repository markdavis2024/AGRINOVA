import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:agrinova_mobile/theme/app_colors.dart';

class MarketplaceScreen extends StatelessWidget {
  const MarketplaceScreen({super.key});

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
          'Marketplace',
          style: TextStyle(
            fontWeight: FontWeight.w700,
            color: AppColors.greenDeep,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {},
          ),
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: () {},
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Filter chips
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  _buildFilterChip('All', true),
                  _buildFilterChip('Grains', false),
                  _buildFilterChip('Vegetables', false),
                  _buildFilterChip('Fruits', false),
                  _buildFilterChip('Tubers', false),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Products grid
            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
                childAspectRatio: 0.75,
              ),
              itemCount: 6,
              itemBuilder: (context, index) {
                return _buildProductCard(
                  index % 2 == 0 ? '🌾' : '🍅',
                  index % 2 == 0 ? 'Organic Maize' : 'Fresh Tomatoes',
                  '200kg',
                  index % 2 == 0 ? '₦25,000' : '₦15,000',
                  'Bamenda',
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFilterChip(String label, bool isSelected) {
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: FilterChip(
        label: Text(label),
        selected: isSelected,
        onSelected: (selected) {},
        backgroundColor: AppColors.white,
        selectedColor: AppColors.greenSoft,
        checkmarkColor: AppColors.greenDark,
        labelStyle: TextStyle(
          color: isSelected ? AppColors.greenDark : AppColors.gray,
          fontWeight: isSelected ? FontWeight.w700 : FontWeight.w400,
        ),
        side: BorderSide(
          color: isSelected ? AppColors.greenDark : AppColors.border,
        ),
      ),
    );
  }

  Widget _buildProductCard(String icon, String name, String quantity, String price, String location) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            height: 120,
            width: double.infinity,
            decoration: const BoxDecoration(
              color: AppColors.greenSoft,
              borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
            ),
            child: Center(
              child: Text(icon, style: const TextStyle(fontSize: 48)),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  name,
                  style: const TextStyle(
                    fontWeight: FontWeight.w700,
                    fontSize: 14,
                    color: AppColors.greenDeep,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 4),
                Text(
                  '$quantity • $location',
                  style: const TextStyle(
                    color: AppColors.gray,
                    fontSize: 12,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      price,
                      style: const TextStyle(
                        fontWeight: FontWeight.w700,
                        color: AppColors.greenDark,
                        fontSize: 14,
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.all(6),
                      decoration: BoxDecoration(
                        color: AppColors.green,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Icon(
                        Icons.add,
                        color: AppColors.greenDeep,
                        size: 16,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

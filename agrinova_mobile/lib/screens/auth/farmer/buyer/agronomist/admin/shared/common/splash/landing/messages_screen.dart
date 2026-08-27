import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:agrinova_mobile/theme/app_colors.dart';

class MessagesScreen extends StatelessWidget {
  const MessagesScreen({super.key});

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
          'Messages',
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
        ],
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: 8,
        itemBuilder: (context, index) {
          return _buildMessageCard(
            index % 3 == 0 ? '🌾' : (index % 3 == 1 ? '🛒' : '🧑‍🌾'),
            index % 3 == 0 ? 'Farmers\' Group' : (index % 3 == 1 ? 'Market Support' : 'Agronomist Help'),
            'New updates regarding your recent activity...',
            '${index + 2} min ago',
            index % 2 == 0,
          );
        },
      ),
    );
  }

  Widget _buildMessageCard(String icon, String name, String preview, String time, bool isUnread) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          Container(
            width: 50,
            height: 50,
            decoration: BoxDecoration(
              color: AppColors.greenSoft,
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
                Row(
                  children: [
                    Text(
                      name,
                      style: TextStyle(
                        fontWeight: isUnread ? FontWeight.w700 : FontWeight.w500,
                        fontSize: 15,
                        color: AppColors.greenDeep,
                      ),
                    ),
                    const Spacer(),
                    Text(
                      time,
                      style: const TextStyle(
                        color: AppColors.gray,
                        fontSize: 11,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  preview,
                  style: TextStyle(
                    color: isUnread ? AppColors.black : AppColors.gray,
                    fontWeight: isUnread ? FontWeight.w600 : FontWeight.w400,
                    fontSize: 13,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
          if (isUnread) ...[
            const SizedBox(width: 8),
            Container(
              width: 10,
              height: 10,
              decoration: const BoxDecoration(
                color: AppColors.green,
                shape: BoxShape.circle,
              ),
            ),
          ],
        ],
      ),
    );
  }
}

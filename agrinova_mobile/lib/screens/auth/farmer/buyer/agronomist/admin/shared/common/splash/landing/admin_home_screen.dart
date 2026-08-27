import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../../../../../../../theme/app_colors.dart';
import '../../../../../../../../../../widgets/common/logo_widget.dart';

class AdminHomeScreen extends StatelessWidget {
  const AdminHomeScreen({super.key});

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
              'System Overview',
              style: TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.w700,
                color: AppColors.greenDeep,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'Manage the AGRINOVA ecosystem and monitor activity.',
              style: TextStyle(
                color: AppColors.gray,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 24),

            // Admin Stats
            Row(
              children: [
                Expanded(
                  child: _buildStatCard('👥', 'Users', '1,240', AppColors.greenSoft),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildStatCard('🚜', 'Farms', '450', AppColors.sky),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: _buildStatCard('📈', 'Transactions', '892', Colors.amber.shade50),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildStatCard('📡', 'IoT Nodes', '156', AppColors.greenSoft),
                ),
              ],
            ),
            const SizedBox(height: 24),

            const Text(
              'Administrative Tasks',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w700,
                color: AppColors.greenDeep,
              ),
            ),
            const SizedBox(height: 16),
            _buildActionCard(Icons.verified_user_outlined, 'Verification Queue', '8 pending registrations', () {}),
            const SizedBox(height: 12),
            _buildActionCard(Icons.report_problem_outlined, 'System Health', 'All systems operational', () {}),
            const SizedBox(height: 12),
            _buildActionCard(Icons.settings_outlined, 'Global Settings', 'Configure platform parameters', () {}),
          ],
        ),
      ),
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

  Widget _buildActionCard(IconData icon, String title, String subtitle, VoidCallback onTap) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: ListTile(
        leading: Icon(icon, color: AppColors.greenDark),
        title: Text(
          title,
          style: const TextStyle(fontWeight: FontWeight.w700, color: AppColors.greenDeep),
        ),
        subtitle: Text(subtitle, style: const TextStyle(fontSize: 13, color: AppColors.gray)),
        trailing: const Icon(Icons.chevron_right, color: AppColors.gray),
        onTap: onTap,
      ),
    );
  }
}

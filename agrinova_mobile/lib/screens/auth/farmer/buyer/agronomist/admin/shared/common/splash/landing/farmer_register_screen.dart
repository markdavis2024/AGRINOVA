import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../../../../../../../theme/app_colors.dart';
import '../../../../../../../../../../widgets/common/logo_widget.dart';

class FarmerRegisterScreen extends StatefulWidget {
  const FarmerRegisterScreen({super.key});

  @override
  State<FarmerRegisterScreen> createState() => _FarmerRegisterScreenState();
}

class _FarmerRegisterScreenState extends State<FarmerRegisterScreen> {
  bool _isLoading = false;
  bool _termsAccepted = false;
  bool _iotEnabled = false;

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
        title: const LogoWidget(width: 100),
        actions: [
          TextButton(
            onPressed: () => context.push('/login'),
            child: const Text('Login'),
          ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                decoration: BoxDecoration(
                  color: AppColors.greenSoft,
                  borderRadius: BorderRadius.circular(50),
                ),
                child: const Text(
                  '🌾 FARMER REGISTRATION',
                  style: TextStyle(
                    color: AppColors.greenDark,
                    fontWeight: FontWeight.w800,
                    fontSize: 11,
                  ),
                ),
              ),
              const SizedBox(height: 12),
              const Text(
                'Join AGRINOVA as a farmer',
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.w700,
                  color: AppColors.greenDeep,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'Manage your crops, monitor your farm with IoT, and connect with buyers.',
                style: TextStyle(
                  color: AppColors.gray,
                  height: 1.6,
                ),
              ),
              const SizedBox(height: 30),

              Card(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(24),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildSectionTitle(1, 'Personal information'),
                      const SizedBox(height: 16),
                      const TextField(
                        decoration: InputDecoration(
                          labelText: 'Full name *',
                          hintText: 'Enter your name',
                        ),
                      ),
                      const SizedBox(height: 16),
                      const TextField(
                        decoration: InputDecoration(
                          labelText: 'Email *',
                          hintText: 'you@example.com',
                        ),
                        keyboardType: TextInputType.emailAddress,
                      ),
                      const SizedBox(height: 16),
                      const TextField(
                        decoration: InputDecoration(
                          labelText: 'Phone number *',
                          hintText: '+237 6XX XXX XXX',
                        ),
                        keyboardType: TextInputType.phone,
                      ),
                      const SizedBox(height: 24),

                      const Divider(color: AppColors.border),
                      const SizedBox(height: 24),

                      _buildSectionTitle(2, 'Farm information'),
                      const SizedBox(height: 16),
                      const TextField(
                        decoration: InputDecoration(
                          labelText: 'Farm name *',
                          hintText: 'Enter your farm name',
                        ),
                      ),
                      const SizedBox(height: 16),
                      const TextField(
                        decoration: InputDecoration(
                          labelText: 'Farm location *',
                          hintText: 'Region, City',
                        ),
                      ),
                      const SizedBox(height: 24),

                      const Divider(color: AppColors.border),
                      const SizedBox(height: 24),

                      _buildSectionTitle(3, 'Smart agriculture options'),
                      const SizedBox(height: 16),
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: AppColors.white,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: AppColors.border),
                        ),
                        child: Row(
                          children: [
                            Checkbox(
                              value: _iotEnabled,
                              onChanged: (value) {
                                setState(() {
                                  _iotEnabled = value ?? false;
                                });
                              },
                              activeColor: AppColors.greenDark,
                            ),
                            const Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'Enable IoT farming',
                                    style: TextStyle(
                                      fontWeight: FontWeight.w700,
                                      color: AppColors.greenDeep,
                                    ),
                                  ),
                                  Text(
                                    'Connect sensors and smart devices to monitor your farm.',
                                    style: TextStyle(
                                      color: AppColors.gray,
                                      fontSize: 12,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                      if (_iotEnabled) ...[
                        const SizedBox(height: 12),
                        Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(
                              colors: [AppColors.greenSoft, AppColors.sky],
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                            ),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: const Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                '🌐 IoT mode enabled',
                                style: TextStyle(
                                  fontWeight: FontWeight.w700,
                                  color: AppColors.greenDeep,
                                ),
                              ),
                              SizedBox(height: 4),
                              Text(
                                'Your account will be able to connect compatible agricultural IoT devices.',
                                style: TextStyle(
                                  color: AppColors.gray,
                                  fontSize: 13,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                      const SizedBox(height: 24),

                      const Divider(color: AppColors.border),
                      const SizedBox(height: 24),

                      _buildSectionTitle(4, 'Security'),
                      const SizedBox(height: 16),
                      const TextField(
                        obscureText: true,
                        decoration: InputDecoration(
                          labelText: 'Password *',
                          hintText: 'Create a strong password',
                        ),
                      ),
                      const SizedBox(height: 16),
                      const TextField(
                        obscureText: true,
                        decoration: InputDecoration(
                          labelText: 'Confirm password *',
                          hintText: 'Confirm your password',
                        ),
                      ),
                      const SizedBox(height: 16),
                      Row(
                        children: [
                          Checkbox(
                            value: _termsAccepted,
                            onChanged: (value) {
                              setState(() {
                                _termsAccepted = value ?? false;
                              });
                            },
                            activeColor: AppColors.greenDark,
                          ),
                          const Expanded(
                            child: Text(
                              'I accept the AGRINOVA terms and conditions.',
                              style: TextStyle(
                                color: AppColors.gray,
                                fontSize: 13,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 24),

                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: _isLoading ? null : _handleSubmit,
                          child: _isLoading
                              ? const SizedBox(
                                  height: 20,
                                  width: 20,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2,
                                    valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                                  ),
                                )
                              : const Text('Create farmer account →'),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSectionTitle(int number, String title) {
    return Row(
      children: [
        Container(
          width: 28,
          height: 28,
          decoration: BoxDecoration(
            color: AppColors.green,
            borderRadius: BorderRadius.circular(14),
          ),
          child: Center(
            child: Text(
              '$number',
              style: const TextStyle(
                fontWeight: FontWeight.w800,
                color: AppColors.greenDeep,
                fontSize: 12,
              ),
            ),
          ),
        ),
        const SizedBox(width: 12),
        Text(
          title,
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w700,
            color: AppColors.greenDeep,
          ),
        ),
      ],
    );
  }

  void _handleSubmit() {
    if (!_termsAccepted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please accept the terms and conditions'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    setState(() => _isLoading = true);
    Future.delayed(const Duration(seconds: 2), () {
      setState(() => _isLoading = false);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Farmer account created successfully!'),
          backgroundColor: AppColors.green,
        ),
      );
      context.push('/login');
    });
  }
}

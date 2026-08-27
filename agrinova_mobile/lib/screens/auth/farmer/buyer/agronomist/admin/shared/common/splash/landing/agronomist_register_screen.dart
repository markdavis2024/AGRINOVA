import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:agrinova_mobile/theme/app_colors.dart';
import 'package:agrinova_mobile/widgets/common/logo_widget.dart';

class AgronomistRegisterScreen extends StatefulWidget {
  const AgronomistRegisterScreen({super.key});

  @override
  State<AgronomistRegisterScreen> createState() => _AgronomistRegisterScreenState();
}

class _AgronomistRegisterScreenState extends State<AgronomistRegisterScreen> {
  bool _isLoading = false;
  bool _termsAccepted = false;

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
                  color: Colors.amber.shade50,
                  borderRadius: BorderRadius.circular(50),
                ),
                child: const Text(
                  '🧑‍🌾 AGRONOMIST REGISTRATION',
                  style: TextStyle(
                    color: Colors.amber,
                    fontWeight: FontWeight.w800,
                    fontSize: 11,
                  ),
                ),
              ),
              const SizedBox(height: 12),
              const Text(
                'Join AGRINOVA as an agronomist',
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.w700,
                  color: AppColors.greenDeep,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'Provide professional agricultural knowledge and support farmers through the AGRINOVA ecosystem.',
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
                      _buildSectionTitle(1, 'Professional information'),
                      const SizedBox(height: 16),
                      const TextField(
                        decoration: InputDecoration(
                          labelText: 'Full name *',
                          hintText: 'Your full name',
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
                      const SizedBox(height: 16),
                      DropdownButtonFormField<String>(
                        decoration: const InputDecoration(
                          labelText: 'Region *',
                        ),
                        items: [
                          'Centre', 'Littoral', 'West', 'North-West',
                          'South-West', 'North', 'Far-North', 'Adamawa',
                          'East', 'South'
                        ].map((region) {
                          return DropdownMenuItem(
                            value: region,
                            child: Text(region),
                          );
                        }).toList(),
                        onChanged: (value) {},
                      ),
                      const SizedBox(height: 16),
                      const TextField(
                        decoration: InputDecoration(
                          labelText: 'Town / City *',
                          hintText: 'Your town or city',
                        ),
                      ),
                      const SizedBox(height: 16),
                      const TextField(
                        decoration: InputDecoration(
                          labelText: 'Specialization *',
                          hintText: 'Example: Crop production',
                        ),
                      ),
                      const SizedBox(height: 16),
                      const TextField(
                        decoration: InputDecoration(
                          labelText: 'Professional organization',
                          hintText: 'Organization / institution',
                        ),
                      ),
                      const SizedBox(height: 24),

                      const Divider(color: AppColors.border),
                      const SizedBox(height: 24),

                      _buildSectionTitle(2, 'Professional documents'),
                      const SizedBox(height: 16),
                      _buildFileUpload('National ID — Front *'),
                      const SizedBox(height: 16),
                      _buildFileUpload('National ID — Back *'),
                      const SizedBox(height: 16),
                      _buildFileUpload('Professional qualification / certificate *'),
                      const SizedBox(height: 24),

                      const Divider(color: AppColors.border),
                      const SizedBox(height: 24),

                      _buildSectionTitle(3, 'Security'),
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
                              '🔐 Two-step authentication',
                              style: TextStyle(
                                fontWeight: FontWeight.w700,
                                color: AppColors.greenDeep,
                              ),
                            ),
                            SizedBox(height: 4),
                            Text(
                              'Additional verification will be required when accessing your professional account.',
                              style: TextStyle(
                                color: AppColors.gray,
                                fontSize: 13,
                              ),
                            ),
                          ],
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

                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          TextButton(
                            onPressed: () => context.pop(),
                            child: const Text(
                              'Already registered?',
                              style: TextStyle(color: AppColors.gray),
                            ),
                          ),
                          ElevatedButton(
                            onPressed: _isLoading ? null : _handleSubmit,
                            style: ElevatedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 24,
                                vertical: 14,
                              ),
                            ),
                            child: _isLoading
                                ? const SizedBox(
                              height: 20,
                              width: 20,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                valueColor: AlwaysStoppedAnimation<Color>(
                                  Colors.white,
                                ),
                              ),
                            )
                                : const Text('Submit professional registration →'),
                          ),
                        ],
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

  Widget _buildFileUpload(String label) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            fontWeight: FontWeight.w600,
            fontSize: 14,
            color: AppColors.black,
          ),
        ),
        const SizedBox(height: 6),
        Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 16),
          decoration: BoxDecoration(
            border: Border.all(
              color: AppColors.border,
              style: BorderStyle.solid,
            ),
            borderRadius: BorderRadius.circular(12),
            color: AppColors.greenSoft.withAlpha(76),
          ),
          child: const Row(
            children: [
              Icon(Icons.cloud_upload_outlined, color: AppColors.greenDark),
              SizedBox(width: 12),
              Text(
                'Upload file',
                style: TextStyle(color: AppColors.greenDark),
              ),
              Spacer(),
              Icon(
                Icons.attach_file,
                color: AppColors.gray,
              ),
            ],
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
          content: Text('Agronomist registration submitted successfully!'),
          backgroundColor: AppColors.green,
        ),
      );
      context.push('/login');
    });
  }
}

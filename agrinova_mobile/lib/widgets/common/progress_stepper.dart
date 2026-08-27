import 'package:flutter/material.dart';
import '../../theme/app_colors.dart';

class ProgressStepper extends StatelessWidget {
  final int currentStep;
  final int totalSteps;
  final List<String> labels;

  const ProgressStepper({
    super.key,
    required this.currentStep,
    required this.totalSteps,
    required this.labels,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Row(
          children: List.generate(totalSteps, (index) {
            final isActive = index <= currentStep;
            final isLast = index == totalSteps - 1;

            return Expanded(
              child: Row(
                children: [
                  // Step circle
                  Container(
                    width: 32,
                    height: 32,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: isActive ? AppColors.green : AppColors.border,
                      border: Border.all(
                        color: isActive ? AppColors.greenDark : AppColors.border,
                        width: 2,
                      ),
                    ),
                    child: Center(
                      child: isActive && index < currentStep
                          ? const Icon(
                        Icons.check,
                        color: AppColors.white,
                        size: 16,
                      )
                          : Text(
                        '${index + 1}',
                        style: TextStyle(
                          color: isActive ? AppColors.white : AppColors.gray,
                          fontWeight: FontWeight.w700,
                          fontSize: 12,
                        ),
                      ),
                    ),
                  ),

                  // Line
                  if (!isLast)
                    Expanded(
                      child: Container(
                        height: 2,
                        color: index < currentStep ? AppColors.green : AppColors.border,
                      ),
                    ),
                ],
              ),
            );
          }),
        ),
        const SizedBox(height: 8),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: labels.map((label) {
            return Expanded(
              child: Text(
                label,
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 10,
                  color: AppColors.gray,
                  fontWeight: FontWeight.w500,
                ),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }
}
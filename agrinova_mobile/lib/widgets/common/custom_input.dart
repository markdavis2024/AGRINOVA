import 'package:flutter/material.dart';
import '../../theme/app_colors.dart';

class CustomInput extends StatefulWidget {
  final String label;
  final String? hint;
  final TextInputType keyboardType;
  final bool obscureText;
  final bool isRequired;
  final String? errorText;
  final TextEditingController? controller;
  final ValueChanged<String>? onChanged;
  final FormFieldValidator<String>? validator;

  const CustomInput({
    super.key,
    required this.label,
    this.hint,
    this.keyboardType = TextInputType.text,
    this.obscureText = false,
    this.isRequired = false,
    this.errorText,
    this.controller,
    this.onChanged,
    this.validator,
  });

  @override
  State<CustomInput> createState() => _CustomInputState();
}

class _CustomInputState extends State<CustomInput> {
  bool _obscureText = false;

  @override
  void initState() {
    super.initState();
    _obscureText = widget.obscureText;
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Text(
              widget.label,
              style: const TextStyle(
                fontWeight: FontWeight.w600,
                fontSize: 14,
                color: AppColors.black,
              ),
            ),
            if (widget.isRequired)
              const Text(
                ' *',
                style: TextStyle(color: Colors.red),
              ),
          ],
        ),
        const SizedBox(height: 8),
        TextFormField(
          controller: widget.controller,
          onChanged: widget.onChanged,
          obscureText: _obscureText,
          keyboardType: widget.keyboardType,
          validator: widget.validator,
          decoration: InputDecoration(
            hintText: widget.hint,
            errorText: widget.errorText,
            suffixIcon: widget.obscureText
                ? IconButton(
              icon: Icon(
                _obscureText ? Icons.visibility_off : Icons.visibility,
                color: AppColors.gray,
              ),
              onPressed: () {
                setState(() {
                  _obscureText = !_obscureText;
                });
              },
            )
                : null,
          ),
        ),
      ],
    );
  }
}
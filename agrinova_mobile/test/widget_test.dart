import 'package:flutter_test/flutter_test.dart';
import 'package:agrinova_mobile/app.dart';

void main() {
  testWidgets('App smoke test', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const AgriNovaApp());

    // Verify that splash screen is shown (Logo is present)
    expect(find.text('AGRINOVA'), findsOneWidget);
  });
}

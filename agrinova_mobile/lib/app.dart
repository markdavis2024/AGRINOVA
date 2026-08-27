import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:agrinova_mobile/theme/app_theme.dart';
import 'package:agrinova_mobile/navigation/app_routes.dart';
import 'package:agrinova_mobile/providers/auth_provider.dart';
import 'package:agrinova_mobile/providers/user_provider.dart';
import 'package:agrinova_mobile/providers/farm_provider.dart';
import 'package:agrinova_mobile/providers/message_provider.dart';
import 'package:agrinova_mobile/providers/register_provider.dart';

class AgriNovaApp extends StatelessWidget {
  const AgriNovaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => RegisterProvider()),
        ChangeNotifierProxyProvider<AuthProvider, UserProvider>(
          create: (_) => UserProvider(),
          update: (_, auth, userProvider) {
            if (userProvider != null && auth.isAuthenticated) {
              userProvider.setUser(auth.user);
            }
            return userProvider ?? UserProvider();
          },
        ),
        ChangeNotifierProxyProvider<AuthProvider, FarmProvider>(
          create: (_) => FarmProvider(),
          update: (_, auth, farmProvider) {
            if (farmProvider != null && auth.isAuthenticated) {
              farmProvider.setToken(auth.token);
            }
            return farmProvider ?? FarmProvider();
          },
        ),
        ChangeNotifierProxyProvider<AuthProvider, MessageProvider>(
          create: (_) => MessageProvider(),
          update: (_, auth, messageProvider) {
            if (messageProvider != null && auth.isAuthenticated) {
              messageProvider.setToken(auth.token);
            }
            return messageProvider ?? MessageProvider();
          },
        ),
      ],
      child: MaterialApp.router(
        title: 'AGRINOVA',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        routerConfig: AppRoutes.router,
      ),
    );
  }
}

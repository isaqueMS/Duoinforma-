// Import core React library for building UI components
import React from 'react';

// Import SafeAreaProvider to handle secure screen margins (e.g., notches on iOS/Android devices)
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import Expo StatusBar to configure the color and appearance of the device status bar at the top
import { StatusBar } from 'expo-status-bar';

// Import AuthProvider from AuthContext to wrap the app with authentication state and functions
import { AuthProvider } from './src/context/AuthContext';

// Import GameProvider from GameContext to wrap the app with game points, level, and scanning progress
import { GameProvider } from './src/context/GameContext';

// Import the main AppNavigator containing the application navigation flow and screens
import AppNavigator from './src/navigation/AppNavigator';

/**
 * Main application component.
 * This component initializes the global providers (Safe Area, Authentication, and Game State)
 * and mounts the app navigator.
 */
export default function App() {
  return (
    // SafeAreaProvider manages notch paddings and safe zones across multiple devices
    <SafeAreaProvider>
      {/* AuthProvider injects authentication services and current user credentials */}
      <AuthProvider>
        {/* GameProvider injects stats, level progress, scanner history, and leaderboard */}
        <GameProvider>
          {/* AppNavigator handles rendering Login or main Dashboard according to user state */}
          <AppNavigator />
          {/* Configures dark status bar theme to match our cyber aesthetic */}
          <StatusBar style="light" backgroundColor="#070A13" />
        </GameProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}


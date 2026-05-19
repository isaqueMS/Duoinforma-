// Import React core library
import React from 'react';

// Import essential layout components and status indicators from React Native
import { StyleSheet, View, ActivityIndicator, Text, Platform } from 'react-native';

// Import React Navigation container provider
import { NavigationContainer } from '@react-navigation/native';

// Import Native Stack Navigation library helpers
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import Bottom Tab Navigation library helpers
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import Ionicons vectors from Expo package
import { Ionicons } from '@expo/vector-icons';

// Import our design system style configurations
import { theme } from '../styles/theme';

// Import custom authentication state hook
import { useAuth } from '../context/AuthContext';

// Import local page components
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import TrainingScreen from '../screens/TrainingScreen';
import LearningScreen from '../screens/LearningScreen';
import VerificationScreen from '../screens/VerificationScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ExamScreen from '../screens/ExamScreen';

// Initialize navigation controllers
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * TabNavigator component.
 * Renders the primary bottom tab dashboard layout (Home, Treinamento, Verificação, Perfil)
 * when a user is signed in. Features a customized glassmorphism design.
 */
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // Dynamic icon loading based on active state and routing name
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Treinamento') {
            iconName = focused ? 'trophy' : 'trophy-outline';
          } else if (route.name === 'Verificação') {
            iconName = focused ? 'shield-checkmark' : 'shield-checkmark-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        headerShown: false,
        tabBarBackground: () => (
          <View style={styles.tabBarBackgroundStyle} />
        )
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Treinamento" component={TrainingScreen} />
      <Tab.Screen name="Verificação" component={VerificationScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

/**
 * AuthStack component.
 * Layout stack loaded when user session is unauthorized (Splash and Login).
 */
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}

/**
 * AppStack component.
 * Main stack layout grouping the central bottom tabs with secondary sub-views
 * like Aprendizado/Exames.
 */
function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade_from_bottom'
      }}
    >
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen name="Aprendizado" component={LearningScreen} />
      <Stack.Screen name="Exame" component={ExamScreen} />
    </Stack.Navigator>
  );
}

/**
 * AppNavigator component.
 * Root navigator bootstrapping AuthStack or AppStack depending on user authenticated state.
 */
export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    // Show premium loading spinner when app is checking cached credentials
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={theme.colors.primary} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {/* Route matching based on session status */}
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

// Styling definitions for tabs navigation and loader
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    backgroundColor: '#070A13',
    borderTopWidth: 1.5,
    borderTopColor: 'rgba(0, 240, 255, 0.2)',
    height: 64,
    paddingBottom: 8,
    paddingTop: 8,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    elevation: 10,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  tabBarBackgroundStyle: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(7, 10, 19, 0.95)',
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginTop: 2,
  }
});


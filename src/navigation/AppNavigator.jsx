import React from 'react';
import { StyleSheet, View, ActivityIndicator, Text, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { useAuth } from '../context/AuthContext';

// Import Screens
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import TrainingScreen from '../screens/TrainingScreen';
import LearningScreen from '../screens/LearningScreen';
import VerificationScreen from '../screens/VerificationScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ExamScreen from '../screens/ExamScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
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

// Auth Stack — Unauthenticated flow
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}

// App Stack — Authenticated flow
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

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    // Show a splash-style loading indicator while auth state is resolving
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={theme.colors.primary} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

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

// Importação da biblioteca principal do React
import React from 'react';

// Importação dos componentes de layout essenciais e indicadores de status do React Native
import { StyleSheet, View, ActivityIndicator, Text, Platform } from 'react-native';

// Importação do container de navegação principal (NavigationContainer)
import { NavigationContainer } from '@react-navigation/native';

// Importação de utilitários de empilhamento de telas nativas (Stack Navigator)
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importação de utilitários de abas de navegação inferiores (Bottom Tab Navigator)
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Importação do pacote oficial de ícones Ionicons do Expo
import { Ionicons } from '@expo/vector-icons';

// Importação das definições de tema de design e paleta de cores cyberpunk do sistema
import { theme } from '../styles/theme';

// Importação do hook customizado para ler dados da sessão de autenticação ativa (AuthContext)
import { useAuth } from '../context/AuthContext';

// Importação dos componentes de telas locais
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import TrainingScreen from '../screens/TrainingScreen';
import LearningScreen from '../screens/LearningScreen';
import VerificationScreen from '../screens/VerificationScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ExamScreen from '../screens/ExamScreen';

// Inicialização dos controladores de fluxo de navegação do React Navigation
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * Componente TabNavigator.
 * Renderiza o painel principal inferior (Home, Treinamento, Verificação, Perfil)
 * quando um usuário está com uma sessão autenticada ativa. Conta com design translúcido premium.
 */
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // Carregamento dinâmico de ícones com base na aba ativa e rota de destino
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
 * Componente AuthStack.
 * Pilha de navegação carregada quando não há sessão autenticada ativa (Splash e Login).
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
 * Componente AppStack.
 * Pilha principal que agrupa as abas inferiores com as sub-telas secundárias,
 * como Aprendizado e Exames de Certificação.
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
 * Componente AppNavigator (Navegador Raiz).
 * Gerencia a montagem da árvore de telas (AuthStack ou AppStack) com base no estado do usuário.
 */
export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    // Exibe um indicador de carregamento premium enquanto valida a sessão no banco
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={theme.colors.primary} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {/* Seleção do fluxo de navegação baseado no estado de login da sessão */}
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

// Definições de estilos e compilação de regras visuais das abas inferiores
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

// Importação do React core
import React from 'react';

// Importação do SafeAreaProvider para gerenciar as margens seguras da tela (notch em dispositivos iOS/Android)
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Importação do StatusBar do Expo para configurar a aparência da barra de status do dispositivo
import { StatusBar } from 'expo-status-bar';

// Importação do AuthProvider do AuthContext para envelopar o app com estados e funções de autenticação
import { AuthProvider } from './src/context/AuthContext';

// Importação do GameProvider do GameContext para envelopar o app com controle de XP, nível e pontuações
import { GameProvider } from './src/context/GameContext';

// Importação do navegador principal AppNavigator contendo o fluxo de telas do aplicativo
import AppNavigator from './src/navigation/AppNavigator';

/**
 * Componente principal da aplicação (App).
 * Inicializa os provedores globais (Área Segura, Autenticação e Estados do Jogo)
 * e monta o AppNavigator que gerencia a navegação entre as telas.
 */
export default function App() {
  return (
    // SafeAreaProvider gerencia preenchimentos de notch e zonas seguras do sistema operacional
    <SafeAreaProvider>
      {/* AuthProvider injeta os serviços de sessão e dados cadastrais do agente autenticado */}
      <AuthProvider>
        {/* GameProvider injeta estatísticas de XP, conquistas, histórico do scanner e exames */}
        <GameProvider>
          {/* AppNavigator controla a exibição da tela de Login ou do Dashboard com base na sessão ativa */}
          <AppNavigator />
          {/* Configura o tema claro da barra de status para combinar com nossa estética cyberpunk escura */}
          <StatusBar style="light" backgroundColor="#070A13" />
        </GameProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

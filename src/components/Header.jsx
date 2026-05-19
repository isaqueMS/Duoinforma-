// Importação do React core
import React from 'react';

// Importação dos componentes essenciais de layout, gestos, imagens e plataforma do React Native
import { StyleSheet, View, Text, TouchableOpacity, Image, Platform, StatusBar } from 'react-native';

// Importação da coleção de ícones Ionicons do Expo
import { Ionicons } from '@expo/vector-icons';

// Importação das constantes e configurações globais do tema visual
import { theme } from '../styles/theme';

// Importação do hook de acesso ao contexto de autenticação de usuários
import { useAuth } from '../context/AuthContext';

// Importação do hook de acesso ao contexto do sistema de pontos e progresso
import { useGame } from '../context/GameContext';

// Carrega o asset de logotipo padrão do sistema
const LOGO = require('../../assets/logo.png');

/**
 * Componente Header (Cabeçalho).
 * Renderizado no topo das telas principais para exibir navegação, títulos dinâmicos,
 * status de autenticação ativa e atalho para o perfil do agente ativo.
 * 
 * @param {string} title - O título principal da tela exibido no cabeçalho
 * @param {string} subtitle - Subtítulo descritivo secundário
 * @param {object} navigation - Propriedade de navegação do React Navigation
 * @param {boolean} showBack - Força a exibição do botão de retorno
 * @param {boolean} showAvatar - Controla a exibição da miniatura do perfil/avatar no cabeçalho
 * @param {function} onBack - Callback customizada executada ao retornar, sobrepondo o padrão
 */
export default function Header({ 
  title, 
  subtitle, 
  navigation, 
  showBack = false, 
  showAvatar = true,
  onBack
}) {
  // Extrai o registro do usuário autenticado no Firebase
  const { user } = useAuth();
  // Extrai as informações de nível de XP do usuário
  const { getCurrentLevel } = useGame();
  
  const currentLevel = getCurrentLevel();
  // Valida dinamicamente se a ação de voltar está disponível no contexto atual
  const canGoBack = showBack || !!onBack || (navigation && navigation.canGoBack());

  // Navega para a aba de Perfil ao clicar no ícone do cabeçalho
  const handleAvatarPress = () => {
    if (navigation) {
      navigation.navigate('Perfil');
    }
  };

  // Aciona o retorno na árvore de telas ou executa a callback customizada
  const handleBackPress = () => {
    if (onBack) {
      onBack();
    } else if (navigation) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.headerContainer}>
      {/* Seção Esquerda: Exibe botão de voltar ou o logo corporativo */}
      <View style={styles.leftSection}>
        {canGoBack ? (
          <TouchableOpacity 
            onPress={handleBackPress} 
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color={theme.colors.primary} />
            <Text style={styles.backButtonText}>VOLTAR</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.logoWrapper}>
            <View style={styles.logoBorder}>
              <Image source={LOGO} style={styles.logoImage} resizeMode="contain" />
            </View>
          </View>
        )}
      </View>

      {/* Seção Central: Título e Subtítulo principais da tela ativa */}
      <View style={styles.centerSection}>
        <Text style={styles.titleText} numberOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.subtitleText} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>

      {/* Seção Direita: Miniatura circular do avatar ou emoji do nível atual */}
      <View style={styles.rightSection}>
        {showAvatar && (
          <TouchableOpacity 
            onPress={handleAvatarPress}
            style={styles.avatarButton}
            activeOpacity={0.8}
          >
            <View style={styles.avatarBorder}>
              {user?.photoURL ? (
                <Image source={{ uri: user.photoURL }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarEmoji}>{currentLevel.badge}</Text>
              )}
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

// Estilos visuais neon e compensação de área segura com base no sistema operacional
const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    // Compensação dinâmica de altura no Android para evitar sobrepor a barra de status
    height: Platform.OS === 'android' ? 64 + (StatusBar.currentHeight || 24) : 64,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    backgroundColor: 'rgba(7, 10, 19, 0.85)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 240, 255, 0.15)',
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  leftSection: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingRight: 12,
  },
  backButtonText: {
    color: theme.colors.primary,
    fontWeight: '900',
    fontSize: 10,
    letterSpacing: 1.5,
    marginLeft: -2,
    textShadowColor: 'rgba(0, 240, 255, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  logoWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBorder: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 240, 255, 0.05)',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 240, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 4,
  },
  logoImage: {
    width: 28,
    height: 28,
    borderRadius: 5,
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textShadowColor: theme.colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  subtitleText: {
    fontSize: 8,
    color: theme.colors.textSecondary,
    letterSpacing: 1.5,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  rightSection: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  avatarButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarBorder: {
    width: 38,
    height: 38,
    borderRadius: theme.roundness.full,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(0, 240, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarEmoji: {
    fontSize: 18,
  },
});

// Importação do React core
import React from 'react';

// Importação dos componentes de layout e estilização essenciais do React Native
import { StyleSheet, View } from 'react-native';

// Importação do BlurView do Expo para implementar efeitos nativos de glassmorphism desfocado
import { BlurView } from 'expo-blur';

// Importação das constantes e definições de tema de design
import { theme } from '../styles/theme';

/**
 * Componente GlassCard.
 * Implementa um cartão com visual translúcido de vidro (glassmorphism),
 * intensidade de desfoque customizável e bordas em neon baseadas no status.
 * 
 * @param {React.ReactNode} children - Conteúdo aninhado do componente
 * @param {object} style - Estilos extras para sobrepor os padrões do contêiner
 * @param {number} intensity - Intensidade de opacidade do desfoque (0-100)
 * @param {string} borderType - Esquema de cores das bordas ('primary' | 'neonPrimary' | etc.)
 */
export default function GlassCard({ children, style, intensity = 40, borderType = 'primary' }) {
  // Determina a cor da borda de acordo com as especificações do tema
  const getBorderColor = () => {
    switch (borderType) {
      case 'primary': return theme.colors.border;
      case 'neonPrimary': return theme.colors.primary;
      case 'secondary': return theme.colors.secondary;
      case 'accent': return theme.colors.accent;
      case 'danger': return theme.colors.danger;
      case 'warning': return theme.colors.warning;
      default: return theme.colors.border;
    }
  };

  return (
    <View style={[
      styles.container, 
      { borderColor: getBorderColor() },
      style
    ]}>
      {/* Renderiza o efeito de desfoque nativo no iOS/Android com fallback no web */}
      <BlurView intensity={intensity} tint="dark" style={styles.blur}>
        <View style={styles.content}>
          {children}
        </View>
      </BlurView>
    </View>
  );
}

// Definições de estilos visuais e sombreamentos do cartão translúcido
const styles = StyleSheet.create({
  container: {
    borderRadius: theme.roundness.lg,
    borderWidth: 1.5,
    backgroundColor: 'rgba(14, 19, 38, 0.7)', // Fundo semitransparente estilo ficção científica
    overflow: 'hidden',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4, // Sombreamento para dispositivos Android
  },
  blur: {
    width: '100%',
  },
  content: {
    padding: theme.spacing.lg,
  }
});

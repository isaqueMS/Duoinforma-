// Importação do React core e hooks para gerenciamento de referências e animação
import React, { useRef } from 'react';

// Importação dos componentes de estilização, texto, clique e animações do React Native
import { StyleSheet, Text, TouchableOpacity, Animated } from 'react-native';

// Importação do LinearGradient do Expo para desenhar fundos gradientes cibernéticos vibrantes
import { LinearGradient } from 'expo-linear-gradient';

// Importação das constantes e definições de tema de design
import { theme } from '../styles/theme';

/**
 * Componente NeonButton.
 * Botão customizado com brilho neon e efeitos físicos de mola (spring animation) ao clicar.
 * Suporta múltiplas variantes de design (neon azul principal, magenta secundário, verde acento, vermelho perigo e outline translúcido).
 * 
 * @param {function} onPress - Função executada quando o botão for acionado
 * @param {string} title - Texto exibido no centro do botão
 * @param {string} variant - Estilo de cor ('primary' | 'secondary' | 'accent' | 'danger' | 'outline')
 * @param {object} style - Estilos de layout customizados para o contêiner externo
 * @param {object} textStyle - Estilos de cores ou fontes customizados para o rótulo do texto
 * @param {boolean} disabled - Define se o botão está desabilitado, travando cliques e escurecendo cores
 */
export default function NeonButton({ 
  onPress, 
  title, 
  variant = 'primary', 
  style, 
  textStyle,
  disabled = false
}) {
  // Referência de valor de animação de escala para efeito de clique (shrink/bounce)
  const scaleValue = useRef(new Animated.Value(1)).current;

  // Efeito de encolhimento físico de mola ao pressionar o botão
  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  // Efeito de retorno à escala total ao liberar o clique
  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  // Seleciona a combinação dupla de cores baseada na variante visual
  const getGradientColors = () => {
    if (disabled) {
      return [theme.colors.surfaceSecondary, theme.colors.surfaceSecondary];
    }
    switch (variant) {
      case 'primary':
        return [theme.colors.primary, '#0088FF'];
      case 'secondary':
        return [theme.colors.secondary, '#8800FF'];
      case 'accent':
        return [theme.colors.accent, '#00CC44'];
      case 'danger':
        return [theme.colors.danger, '#CC0033'];
      case 'outline':
      default:
        return ['transparent', 'transparent'];
    }
  };

  // Validação booleana se a variante selecionada é outline/borda translúcida
  const isOutline = variant === 'outline';

  return (
    // Invólucro animado para controle de pulsação e escala física
    <Animated.View style={[{ transform: [{ scale: scaleValue }] }, style]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.8}
        style={[
          styles.buttonContainer,
          isOutline && styles.outlineContainer,
          disabled && styles.disabledContainer
        ]}
      >
        {/* Renderiza o gradiente de fundo nos botões ativos preenchidos */}
        <LinearGradient
          colors={getGradientColors()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <Text style={[
            styles.buttonText,
            isOutline && styles.outlineText,
            disabled && styles.disabledText,
            textStyle
          ]}>
            {title}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

// Estilizações de botões com alto contraste e sombreamento para efeitos tridimensionais
const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: theme.roundness.md,
    overflow: 'hidden',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  gradient: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#000000', // Texto preto para máximo contraste com o brilho neon do botão
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  outlineContainer: {
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(0, 240, 255, 0.05)',
    shadowColor: 'transparent',
    elevation: 0,
  },
  outlineText: {
    color: theme.colors.primary,
  },
  disabledContainer: {
    borderColor: 'transparent',
    shadowColor: 'transparent',
    elevation: 0,
  },
  disabledText: {
    color: theme.colors.textMuted,
  }
});

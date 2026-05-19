// Importação do React core
import React from 'react';

// Importação dos componentes de layout e estilização essenciais do React Native
import { StyleSheet, View, Text } from 'react-native';

// Importação do LinearGradient do Expo para compilar sobreposições iluminadas
import { LinearGradient } from 'expo-linear-gradient';

// Importação das constantes e definições de tema de design
import { theme } from '../styles/theme';

/**
 * Componente ProgressBar.
 * Exibe o progresso de conclusão de níveis, performance em exames ou preenchimento de metas.
 * Conta com efeito luminoso (glow) característico da identidade visual.
 * 
 * @param {number} progress - Valor decimal entre 0 e 1 indicando a porcentagem de progresso
 * @param {string} label - Rótulo de texto no lado esquerdo da barra de progresso
 * @param {string} valueText - Rótulo de valor numérico no lado direito da barra de progresso
 * @param {string} color - Código de cor de preenchimento da barra ativa
 * @param {string} glowColor - Configuração da cor de sombra/brilho secundária
 */
export default function ProgressBar({ 
  progress, 
  label, 
  valueText,
  color = theme.colors.primary,
  glowColor = theme.colors.primaryGlow
}) {
  // Normaliza o progresso em uma porcentagem segura dentro dos limites de 0% a 100%
  const percentage = Math.min(Math.max(progress * 100, 0), 100);

  return (
    <View style={styles.container}>
      {/* Renders cabeçalhos de identificação apenas se 'label' ou 'valueText' forem informados */}
      {(label || valueText) && (
        <View style={styles.labelContainer}>
          {label && <Text style={styles.label}>{label}</Text>}
          {valueText && <Text style={styles.valueText}>{valueText}</Text>}
        </View>
      )}
      
      {/* O trilho vazio de fundo da barra de progresso */}
      <View style={styles.track}>
        {/* Preenchimento ativo dimensionado de acordo com a porcentagem calculada */}
        <View style={[
          styles.fill, 
          { width: `${percentage}%`, backgroundColor: color, shadowColor: color }
        ]}>
          {/* Brilho gradiente superior para criar sensação tridimensional de vidro */}
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.gradientFill}
          />
        </View>
      </View>
    </View>
  );
}

// Estilizações estruturais e de sombreamento tridimensional da barra de progresso
const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: theme.spacing.sm,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  label: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  valueText: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: 'bold',
  },
  track: {
    height: 8,
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: theme.roundness.full,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  fill: {
    height: '100%',
    borderRadius: theme.roundness.full,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
  },
  gradientFill: {
    flex: 1,
  }
});

// Importação do React core e hooks essenciais
import React, { useEffect, useRef } from 'react';

// Importação dos componentes de layout, animações estruturais e suavização de movimentos do React Native
import { StyleSheet, View, Animated, Easing } from 'react-native';

// Importação das constantes e definições de tema de design
import { theme } from '../styles/theme';

/**
 * Componente ScannerAnimation.
 * Renderiza uma grade cibernética futurista sobreposta com uma linha de varredura laser horizontal animada.
 * Utilizado durante checagens de segurança, varredura de URLs ou no processamento de status.
 * 
 * @param {boolean} active - Controla se a animação infinita de movimento do laser está ativa
 * @param {string} color - Cor primária do brilho do feixe de laser
 */
export default function ScannerAnimation({ active = false, color = theme.colors.primary }) {
  // Referência de valor de animação de translação do laser
  const animatedValue = useRef(new Animated.Value(0)).current;

  // Hook useEffect que lida com a montagem, loop infinito e limpeza da animação do laser
  useEffect(() => {
    if (active) {
      // Loop infinito: o laser desce do topo ao rodapé em 2s e sobe de volta em 2s continuamente
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          })
        ])
      ).start();
    } else {
      // Retorna a linha do laser instantaneamente para o topo
      animatedValue.setValue(0);
    }
  }, [active]);

  // Caso o scanner não esteja ativo, não renderiza nada em tela
  if (!active) return null;

  // Interpola a posição Y entre o topo (0%) e o limite da caixa (100% / offset de 180px)
  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 180] // Limite de altura proporcional a styles.scannerBox
  });

  return (
    <View style={styles.scannerBox}>
      {/* Grade de fundo futurista estilizada */}
      <View style={styles.gridOverlay}>
        <View style={styles.horizontalLine} />
        <View style={styles.horizontalLine} />
        <View style={styles.horizontalLine} />
        <View style={styles.horizontalLine} />
        <View style={styles.verticalLine} />
        <View style={styles.verticalLine} />
        <View style={styles.verticalLine} />
        <View style={styles.verticalLine} />
      </View>
      
      {/* Feixe laser luminoso de varredura animado */}
      <Animated.View style={[
        styles.laserBeam, 
        { 
          transform: [{ translateY }],
          backgroundColor: color,
          shadowColor: color
        }
      ]} />
    </View>
  );
}

// Estilizações de posicionamento e sombras do laser e das grades do scanner
const styles = StyleSheet.create({
  scannerBox: {
    height: 180,
    width: '100%',
    backgroundColor: 'rgba(7, 10, 19, 0.6)',
    borderRadius: theme.roundness.md,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 240, 255, 0.2)',
    position: 'relative',
    overflow: 'hidden',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
    opacity: 0.15,
  },
  horizontalLine: {
    width: '100%',
    height: 1,
    backgroundColor: theme.colors.primary,
    marginVertical: 20,
  },
  verticalLine: {
    width: 1,
    height: '100%',
    backgroundColor: theme.colors.primary,
    position: 'absolute',
    left: '25%',
    marginLeft: 0,
  },
  laserBeam: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 4,
    borderRadius: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 6,
  }
});
export const styles_verticalLine_helper = StyleSheet.create({
  // Helper de estilização para customizações extras futuras
});

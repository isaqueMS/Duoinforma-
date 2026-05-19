// Importação de hooks essenciais do React
import React, { useEffect, useRef } from 'react';

// Importação de componentes e APIs de layout, dimensões e animações do React Native
import { StyleSheet, View, Text, Animated, Dimensions, Image } from 'react-native';

// Importação do componente de gradiente linear do Expo
import { LinearGradient } from 'expo-linear-gradient';

// Importação dos tokens do sistema de design (cores, espaçamentos)
import { theme } from '../styles/theme';

// Importação do componente customizado de botão neon
import NeonButton from '../components/NeonButton';

// Obtém as dimensões de largura e altura da tela física do dispositivo
const { width } = Dimensions.get('window');

// Carrega o recurso de imagem estática da logomarca oficial do sistema
const LOGO = require('../../assets/logo.png');

/**
 * Componente SplashScreen (Tela de Boas-vindas).
 * Renderiza uma página de abertura animada com temática ciberpunk e efeitos visuais premium.
 * Apresenta uma varredura a laser vermelha/azul sobre o logotipo central em escala.
 * 
 * @param {object} navigation - Objeto de roteamento do React Navigation
 */
export default function SplashScreen({ navigation }) {
  // Inicialização das referências das animações reativas
  const scanAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.3)).current;

  // Efeito executado na montagem da tela para iniciar a coreografia de animações
  useEffect(() => {
    // Executa em paralelo o esvanecimento (fade-in) e a escala suave (spring) do logotipo
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start();

    // Loop contínuo da varredura vertical da linha de laser brilhante
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, []);

  // Navega o fluxo de entrada para a tela de autenticação (Login)
  const handleStart = () => {
    navigation.navigate('Login');
  };

  // Mapeamento dos valores da animação para translação vertical da linha laser (0 a 100px)
  const laserY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100]
  });

  return (
    <LinearGradient
      colors={[theme.colors.background, '#0A122E', '#060814']}
      style={styles.container}
    >
      {/* Grade de linhas cibernéticas sobreposta para visual de ficção científica */}
      <View style={styles.gridOverlay} pointerEvents="none">
        <View style={styles.gridLineH} />
        <View style={styles.gridLineH} />
        <View style={styles.gridLineH} />
        <View style={styles.gridLineV} />
        <View style={styles.gridLineV} />
        <View style={styles.gridLineV} />
      </View>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Contêiner do logotipo central contendo o efeito de scanner a laser */}
        <View style={styles.logoContainer}>
          <Animated.View style={[styles.logoHex, { transform: [{ scale: logoScale }] }]}>
            <Image source={LOGO} style={styles.logoImage} resizeMode="contain" />
            
            {/* Efeito holográfico de laser brilhante de varredura vertical */}
            <Animated.View style={[
              styles.laser, 
              { transform: [{ translateY: laserY }] }
            ]} />
          </Animated.View>
        </View>

        {/* Título textual com destaque neon estilizado */}
        <Text style={styles.logoText}>DUO<Text style={{ color: theme.colors.primary }}>INFORMA</Text></Text>
        <Text style={styles.version}>VER 2.0.0 // HOLOGRAPHIC SYSTEMS</Text>
        
        {/* Caixa de slogan inspirador com borda colorida */}
        <View style={styles.taglineBox}>
          <Text style={styles.taglineText}>
            "A verdade não é dada. Ela é verificada. Desenvolva seu escudo contra a desinformação digital."
          </Text>
        </View>

        {/* Botão de ação neon para navegar à autenticação */}
        <View style={styles.buttonWrapper}>
          <NeonButton 
            title="INICIAR SISTEMA" 
            onPress={handleStart}
            variant="primary"
          />
        </View>
      </Animated.View>

      {/* Assinatura do rodapé decorativo cibernético */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>DUOINFORMA DECRYPTOR v2.0.0</Text>
        <Text style={styles.footerSec}>CONEXÃO ENCRIPTADA E SEGURA</Text>
      </View>
    </LinearGradient>
  );
}

// Folha de estilos para posicionamento da grade cibernética, caixa do logotipo e neon
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.08,
  },
  gridLineH: {
    width: '100%',
    height: 1,
    backgroundColor: theme.colors.primary,
    position: 'absolute',
    top: '30%',
    marginTop: 100,
  },
  gridLineV: {
    width: 1,
    height: '100%',
    backgroundColor: theme.colors.primary,
    position: 'absolute',
    left: '50%',
    marginLeft: -100,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
    width: '100%',
  },
  logoContainer: {
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
    position: 'relative',
  },
  logoHex: {
    width: 140,
    height: 140,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(0, 240, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  logoImage: {
    width: 120,
    height: 120,
    borderRadius: 20,
  },
  laser: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 5,
    opacity: 0.8,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 4,
    textShadowColor: theme.colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  version: {
    fontSize: 10,
    color: theme.colors.textMuted,
    letterSpacing: 2,
    marginTop: 6,
    marginBottom: theme.spacing.xl,
  },
  taglineBox: {
    borderLeftWidth: 2,
    borderLeftColor: theme.colors.secondary,
    paddingLeft: theme.spacing.md,
    marginVertical: theme.spacing.lg,
    backgroundColor: 'rgba(189, 0, 255, 0.03)',
    borderRadius: theme.roundness.sm,
    paddingVertical: 10,
  },
  taglineText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    fontStyle: 'italic',
    textAlign: 'left',
  },
  buttonWrapper: {
    width: '100%',
    marginTop: theme.spacing.lg,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    alignItems: 'center',
  },
  footerText: {
    color: theme.colors.textMuted,
    fontSize: 11,
    letterSpacing: 1.5,
  },
  footerSec: {
    color: theme.colors.accent,
    fontSize: 9,
    letterSpacing: 2,
    fontWeight: 'bold',
    marginTop: 4,
  }
});

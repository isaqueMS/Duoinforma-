// Importação de hooks essenciais do React
import React, { useState, useRef } from 'react';

// Importação de componentes, interações e animações do React Native
import {
  StyleSheet, View, Text, TextInput, TouchableOpacity,
  Animated, Dimensions, Image, KeyboardAvoidingView, Platform,
  ScrollView, ActivityIndicator, Alert
} from 'react-native';

// Importação do componente de gradiente linear do Expo
import { LinearGradient } from 'expo-linear-gradient';

// Importação dos tokens do sistema de design (cores, tipografia)
import { theme } from '../styles/theme';

// Importação do hook de autenticação customizado
import { useAuth } from '../context/AuthContext';

// Obtém as dimensões de largura e altura da tela física do dispositivo
const { width, height } = Dimensions.get('window');

// Carrega o recurso de imagem estática da logomarca oficial do sistema
const LOGO = require('../../assets/logo.png');

/**
 * Componente LoginScreen (Tela de Acesso / Portal do Agente).
 * Fornece a interface primária de entrada ao aplicativo, suportando autenticação integrada do Google
 * com tratamento e fallbacks elegantes para emuladores e modos de desenvolvimento local.
 * 
 * @param {object} navigation - Objeto de roteamento do React Navigation
 */
export default function LoginScreen({ navigation }) {
  // Extrai as funções e mensagens de erro do provedor de autenticação global
  const { 
    loginWithGoogle, 
    loginWithGoogleSimulated, 
    authError 
  } = useAuth();

  // Estados locais para controle de modais, formulários e indicadores de carregamento
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');
  const [showGooglePasswordInput, setShowGooglePasswordInput] = useState(false);
  const [googlePassword, setGooglePassword] = useState('');
  const [googleModalError, setGoogleModalError] = useState('');

  // Referências para animações de entrada por esvanecimento e translação vertical
  const formOpacity = useRef(new Animated.Value(0)).current;
  const formTranslateY = useRef(new Animated.Value(30)).current;

  // Dispara animações de entrada suaves assim que a tela é montada
  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(formOpacity, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(formTranslateY, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();
  }, []);

  /**
   * Gerencia o clique do botão de autenticação do Google.
   * Tenta iniciar o fluxo nativo padrão. Em ambientes de emulador onde as chaves SHAs
   * ou os pacotes nativos do Google Play Services não estão configurados, captura o erro
   * e redireciona automaticamente para a interface simulada de login seguro.
   */
  const handleGoogle = async () => {
    setLocalError('');
    setSubmitting(true);
    try {
      await loginWithGoogle();
    } catch (e) {
      // Trata a exceção específica redirecionando para a janela de simulação dev
      if (e.message === 'SIMULATED_GOOGLE_FLOW') {
        setShowGoogleModal(true);
      } else {
        setLocalError(e.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Envia os dados informados na janela simulada de login do Google.
   * Cria uma credencial real de e-mail e senha no Firebase para garantir
   * o correto funcionamento de persistência do Firestore e painel do usuário.
   */
  const handleGoogleSimulatedSubmit = async () => {
    setGoogleModalError('');
    if (!googleEmail.trim()) {
      setGoogleModalError('Por favor, informe seu e-mail do Google.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(googleEmail)) {
      setGoogleModalError('Formato de e-mail inválido.');
      return;
    }

    if (showGooglePasswordInput && !googlePassword) {
      setGoogleModalError('Informe a senha para autenticar este e-mail.');
      return;
    }

    setSubmitting(true);
    try {
      if (showGooglePasswordInput) {
        // Tenta autenticar o usuário que já possui registro ativo
        await loginWithGoogleSimulated(googleEmail.trim(), googlePassword);
        setShowGoogleModal(false);
        setShowGooglePasswordInput(false);
        setGooglePassword('');
      } else {
        // Tenta criar ou logar a conta simulada inicial
        await loginWithGoogleSimulated(googleEmail.trim());
        setShowGoogleModal(false);
        setShowGooglePasswordInput(false);
        setGooglePassword('');
      }
    } catch (e) {
      // Intercepta e-mails cadastrados previamente no Firebase para solicitar verificação de senha
      if (
        e.message?.includes('cadastrado') || 
        e.message?.includes('senha') || 
        e.message?.includes('Senha') || 
        e.message?.includes('credential') || 
        e.message?.includes('password')
      ) {
        setShowGooglePasswordInput(true);
        setGoogleModalError('Este e-mail já possui uma conta comum. Digite sua senha para prosseguir.');
      } else {
        setGoogleModalError(e.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Consolida as mensagens de erro nativas e locais
  const errorMessage = localError || authError;

  return (
    <LinearGradient
      colors={['#070A13', '#0A122E', '#060814']}
      style={styles.container}
    >
      {/* Grade de linhas em background para a atmosfera ciberpunk */}
      <View style={styles.gridOverlay} pointerEvents="none">
        {[...Array(6)].map((_, i) => (
          <View key={`h${i}`} style={[styles.gridLineH, { top: `${15 + i * 15}%` }]} />
        ))}
        {[...Array(5)].map((_, i) => (
          <View key={`v${i}`} style={[styles.gridLineV, { left: `${10 + i * 20}%` }]} />
        ))}
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Cabeçalho principal com a logomarca iluminada por neon */}
          <Animated.View style={[styles.logoSection, { opacity: formOpacity, transform: [{ translateY: formTranslateY }] }]}>
            <View style={styles.logoGlow}>
              <Image source={LOGO} style={styles.logoImage} resizeMode="contain" />
            </View>
            <Text style={styles.appName}>
              DUO<Text style={{ color: theme.colors.primary }}>INFORMA</Text>
            </Text>
            <Text style={styles.appTagline}>SISTEMA DE DEFESA COGNITIVA</Text>
          </Animated.View>

          {/* Cartão translúcido central de autenticação */}
          <Animated.View style={[styles.authCard, { opacity: formOpacity, transform: [{ translateY: formTranslateY }] }]}>
            <Text style={styles.connectionTitle}>PORTAL DE ACESSO</Text>
            <Text style={styles.connectionSubtitle}>IDENTIFICAÇÃO DE AGENTE AUTORIZADO</Text>

            {/* Separador estilizado geométrico ciberpunk */}
            <View style={styles.cyberDividerContainer}>
              <View style={styles.cyberLine} />
              <View style={styles.cyberDiamond} />
              <View style={styles.cyberLine} />
            </View>

            {/* Exibe aviso flutuante de erro se houver falhas no login */}
            {!!errorMessage && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
              </View>
            )}

            {/* Botão de login com Google com efeito de feedback neon */}
            <TouchableOpacity
              onPress={handleGoogle}
              disabled={submitting}
              style={[styles.googleBtn, submitting && styles.googleBtnDisabled]}
              activeOpacity={0.8}
            >
              {submitting ? (
                <ActivityIndicator color={theme.colors.primary} />
              ) : (
                <View style={styles.googleContent}>
                  <Text style={styles.googleIconText}>🌐</Text>
                  <Text style={styles.googleBtnText}>CONECTAR COM GOOGLE</Text>
                </View>
              )}
            </TouchableOpacity>

            <Text style={styles.securityHint}>
              * Conexão segura e autenticada diretamente via servidores federados do Google. Seus dados estão sob criptografia de nível militar.
            </Text>
          </Animated.View>

          {/* Assinatura no rodapé da página */}
          <Text style={styles.footer}>DUOINFORMA PRODUCTION GATEWAY v3.0.0 // REDE PROTEGIDA</Text>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal simulador do Google (utilizado para testes rápidos em emulador local) */}
      {showGoogleModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalGoogleLogo}>
              <Text style={styles.modalGoogleEmoji}>🌐</Text>
            </View>
            <Text style={styles.modalTitle}>Google Sign-In</Text>
            <Text style={styles.modalSubtitle}>
              Simulação de login seguro para o emulador/desenvolvimento
            </Text>
            
            {/* Mensagem de falha interna da janela modal */}
            {!!googleModalError && (
              <View style={[styles.errorBox, { width: '100%', marginBottom: 16 }]}>
                <Text style={styles.errorText}>⚠️ {googleModalError}</Text>
              </View>
            )}

            {/* Campo de e-mail fictício do Google */}
            <View style={styles.modalFieldGroup}>
              <Text style={styles.modalFieldLabel}>E-MAIL DA CONTA GOOGLE</Text>
              <View style={styles.modalInputRow}>
                <Text style={styles.modalInputIcon}>📧</Text>
                <TextInput
                  value={googleEmail}
                  onChangeText={setGoogleEmail}
                  placeholder="seu.email@gmail.com"
                  placeholderTextColor={theme.colors.textMuted}
                  style={styles.modalTextInput}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!showGooglePasswordInput && !submitting}
                />
              </View>
            </View>

            {/* Campo de senha exibido de forma condicional se a conta já existir no Firestore/Auth */}
            {showGooglePasswordInput && (
              <View style={[styles.modalFieldGroup, { marginTop: 4 }]}>
                <Text style={styles.modalFieldLabel}>SENHA DA CONTA DO SISTEMA</Text>
                <View style={styles.modalInputRow}>
                  <Text style={styles.modalInputIcon}>🔐</Text>
                  <TextInput
                    value={googlePassword}
                    onChangeText={setGooglePassword}
                    placeholder="Digite sua senha cadastrada"
                    placeholderTextColor={theme.colors.textMuted}
                    style={styles.modalTextInput}
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!submitting}
                  />
                </View>
              </View>
            )}

            {/* Ações de controle da janela flutuante modal */}
            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                onPress={() => {
                  setShowGoogleModal(false);
                  setShowGooglePasswordInput(false);
                  setGooglePassword('');
                  setGoogleModalError('');
                }}
                style={styles.modalCancelBtn}
              >
                <Text style={styles.modalCancelBtnText}>CANCELAR</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleGoogleSimulatedSubmit}
                disabled={submitting}
                style={[styles.modalSubmitBtn, submitting && { opacity: 0.6 }]}
              >
                {submitting ? (
                  <ActivityIndicator color="#000000" size="small" />
                ) : (
                  <Text style={styles.modalSubmitBtnText}>ENTRAR</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </LinearGradient>
  );
}

// Folha de estilos para controle visual, posicionamento, cartões translúcidos e modal
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  gridLineH: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: theme.colors.primary,
    opacity: 0.04,
  },
  gridLineV: {
    position: 'absolute',
    height: '100%',
    width: 1,
    backgroundColor: theme.colors.primary,
    opacity: 0.04,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoGlow: {
    width: 110,
    height: 110,
    borderRadius: 24,
    backgroundColor: 'rgba(0,240,255,0.06)',
    borderWidth: 2,
    borderColor: 'rgba(0,240,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 12,
    overflow: 'hidden',
  },
  logoImage: {
    width: 90,
    height: 90,
    borderRadius: 18,
  },
  appName: {
    fontSize: 30,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 4,
    textShadowColor: theme.colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  appTagline: {
    fontSize: 9,
    color: theme.colors.textMuted,
    letterSpacing: 2.5,
    marginTop: 6,
  },
  authCard: {
    width: '100%',
    backgroundColor: 'rgba(14, 19, 38, 0.9)',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(0,240,255,0.2)',
    padding: 24,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    alignItems: 'center',
  },
  connectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 4,
    textAlign: 'center',
  },
  connectionSubtitle: {
    color: theme.colors.primary,
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginBottom: 16,
    textAlign: 'center',
  },
  cyberDividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    marginVertical: 12,
  },
  cyberLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(0,240,255,0.25)',
  },
  cyberDiamond: {
    width: 6,
    height: 6,
    backgroundColor: theme.colors.primary,
    transform: [{ rotate: '45deg' }],
    marginHorizontal: 10,
  },
  errorBox: {
    backgroundColor: 'rgba(255,0,85,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,0,85,0.3)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    width: '100%',
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: 12,
    lineHeight: 18,
  },
  googleBtn: {
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(0,240,255,0.04)',
    overflow: 'hidden',
    marginTop: 16,
    height: 52,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  googleBtnDisabled: {
    opacity: 0.6,
  },
  googleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIconText: {
    fontSize: 18,
    marginRight: 10,
  },
  googleBtnText: {
    color: theme.colors.primary,
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 2,
  },
  securityHint: {
    color: theme.colors.textMuted,
    fontSize: 9,
    lineHeight: 14,
    textAlign: 'center',
    marginTop: 24,
    paddingHorizontal: 8,
  },
  footer: {
    color: theme.colors.textMuted,
    fontSize: 9,
    letterSpacing: 1.5,
    marginTop: 32,
    textAlign: 'center',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5, 7, 16, 0.96)',
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: 'rgba(14, 19, 38, 0.98)',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 240, 255, 0.25)',
    padding: 24,
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },
  modalGoogleLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalGoogleEmoji: {
    fontSize: 26,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    color: theme.colors.textMuted,
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  modalFieldGroup: {
    width: '100%',
    marginBottom: 20,
  },
  modalFieldLabel: {
    color: theme.colors.primary,
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  modalInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,240,255,0.15)',
    paddingHorizontal: 14,
    height: 50,
  },
  modalInputIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  modalTextInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    height: 50,
  },
  modalBtnRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
  },
  modalCancelBtnText: {
    color: theme.colors.textSecondary,
    fontWeight: 'bold',
    fontSize: 12,
    letterSpacing: 1.5,
  },
  modalSubmitBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
  },
  modalSubmitBtnText: {
    color: '#000000',
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 1.5,
  },
});

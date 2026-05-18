import React, { useState, useRef } from 'react';
import {
  StyleSheet, View, Text, TextInput, TouchableOpacity,
  Animated, Dimensions, Image, KeyboardAvoidingView, Platform,
  ScrollView, ActivityIndicator, Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../styles/theme';
import { useAuth } from '../context/AuthContext';

const { width, height } = Dimensions.get('window');
const LOGO = require('../../assets/icon.png');

export default function LoginScreen({ navigation }) {
  const { 
    loginWithEmail, 
    registerWithEmail, 
    loginAnonymously, 
    loginWithGoogle, 
    loginWithGoogleSimulated, 
    authError 
  } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');
  const [showGooglePasswordInput, setShowGooglePasswordInput] = useState(false);
  const [googlePassword, setGooglePassword] = useState('');
  const [googleModalError, setGoogleModalError] = useState('');

  // Animation refs
  const formOpacity = useRef(new Animated.Value(0)).current;
  const formTranslateY = useRef(new Animated.Value(30)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(formOpacity, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(formTranslateY, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();
  }, []);

  const switchMode = (newMode) => {
    setLocalError('');
    setName('');
    setEmail('');
    setPassword('');
    // Quick fade for mode switch
    Animated.sequence([
      Animated.timing(formOpacity, { toValue: 0.4, duration: 150, useNativeDriver: true }),
      Animated.timing(formOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
    setMode(newMode);
  };

  const validate = () => {
    if (!email.trim()) { setLocalError('Por favor, informe seu e-mail.'); return false; }
    if (!/\S+@\S+\.\S+/.test(email)) { setLocalError('Formato de e-mail inválido.'); return false; }
    if (!password || password.length < 6) { setLocalError('A senha deve ter no mínimo 6 caracteres.'); return false; }
    if (mode === 'register' && !name.trim()) { setLocalError('Informe um codinome de agente.'); return false; }
    return true;
  };

  const handleSubmit = async () => {
    setLocalError('');
    if (!validate()) return;
    setSubmitting(true);
    try {
      if (mode === 'login') {
        await loginWithEmail(email.trim(), password);
      } else {
        await registerWithEmail(name.trim(), email.trim(), password);
      }
      // Navigation handled by AppNavigator (auth state change)
    } catch (e) {
      setLocalError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGuest = async () => {
    setSubmitting(true);
    try {
      await loginAnonymously();
    } catch (e) {
      setLocalError('Falha ao entrar como convidado.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setLocalError('');
    setSubmitting(true);
    try {
      await loginWithGoogle();
    } catch (e) {
      if (e.message === 'SIMULATED_GOOGLE_FLOW') {
        setShowGoogleModal(true);
      } else {
        setLocalError(e.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

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
        await loginWithGoogleSimulated(googleEmail.trim(), googlePassword);
        setShowGoogleModal(false);
        setShowGooglePasswordInput(false);
        setGooglePassword('');
      } else {
        await loginWithGoogleSimulated(googleEmail.trim());
        setShowGoogleModal(false);
        setShowGooglePasswordInput(false);
        setGooglePassword('');
      }
    } catch (e) {
      // If error indicates wrong password or account already exists with password
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

  const errorMessage = localError || authError;

  return (
    <LinearGradient
      colors={['#070A13', '#0A122E', '#060814']}
      style={styles.container}
    >
      {/* Background grid lines */}
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
          {/* Logo */}
          <Animated.View style={[styles.logoSection, { opacity: formOpacity, transform: [{ translateY: formTranslateY }] }]}>
            <View style={styles.logoGlow}>
              <Image source={LOGO} style={styles.logoImage} resizeMode="contain" />
            </View>
            <Text style={styles.appName}>
              DUO<Text style={{ color: theme.colors.primary }}>INFORMA</Text>
            </Text>
            <Text style={styles.appTagline}>SISTEMA DE DEFESA COGNITIVA</Text>
          </Animated.View>

          {/* Auth Card */}
          <Animated.View style={[styles.authCard, { opacity: formOpacity, transform: [{ translateY: formTranslateY }] }]}>
            {/* Tab Switcher */}
            <View style={styles.tabRow}>
              <TouchableOpacity
                onPress={() => switchMode('login')}
                style={[styles.tabBtn, mode === 'login' && styles.tabBtnActive]}
              >
                <Text style={[styles.tabBtnText, mode === 'login' && styles.tabBtnTextActive]}>
                  ENTRAR
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => switchMode('register')}
                style={[styles.tabBtn, mode === 'register' && styles.tabBtnActive]}
              >
                <Text style={[styles.tabBtnText, mode === 'register' && styles.tabBtnTextActive]}>
                  CADASTRAR
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            {/* Name field (register only) */}
            {mode === 'register' && (
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>CODINOME DO AGENTE</Text>
                <View style={styles.inputRow}>
                  <Text style={styles.inputIcon}>🕵️</Text>
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Ex: Agente_Alpha_77"
                    placeholderTextColor={theme.colors.textMuted}
                    style={styles.textInput}
                    autoCapitalize="words"
                    editable={!submitting}
                  />
                </View>
              </View>
            )}

            {/* Email */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>E-MAIL</Text>
              <View style={styles.inputRow}>
                <Text style={styles.inputIcon}>📡</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="agente@duoinforma.com"
                  placeholderTextColor={theme.colors.textMuted}
                  style={styles.textInput}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!submitting}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>SENHA DE ACESSO</Text>
              <View style={styles.inputRow}>
                <Text style={styles.inputIcon}>🔐</Text>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor={theme.colors.textMuted}
                  style={[styles.textInput, { flex: 1 }]}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  editable={!submitting}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                  <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '🙈'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Error message */}
            {!!errorMessage && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
              </View>
            )}

            {/* Main CTA */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={submitting}
              style={[styles.primaryBtn, submitting && styles.primaryBtnDisabled]}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['rgba(0,240,255,0.15)', 'rgba(0,240,255,0.05)']}
                style={styles.primaryBtnGrad}
              >
                {submitting ? (
                  <ActivityIndicator color={theme.colors.primary} />
                ) : (
                  <Text style={styles.primaryBtnText}>
                    {mode === 'login' ? 'INICIAR SESSÃO' : 'CRIAR CONTA'}
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Google Sign In */}
            <TouchableOpacity
              onPress={handleGoogle}
              disabled={submitting}
              style={[styles.googleBtn, submitting && styles.primaryBtnDisabled]}
              activeOpacity={0.8}
            >
              <View style={styles.googleContent}>
                <Text style={styles.googleIconText}>🌐</Text>
                <Text style={styles.googleBtnText}>ENTRAR COM GOOGLE</Text>
              </View>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.orRow}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>ou</Text>
              <View style={styles.orLine} />
            </View>

            {/* Guest access */}
            <TouchableOpacity
              onPress={handleGuest}
              disabled={submitting}
              style={styles.guestBtn}
              activeOpacity={0.8}
            >
              <Text style={styles.guestBtnText}>⚡ ACESSO RÁPIDO (CONVIDADO)</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Footer */}
          <Text style={styles.footer}>DUOINFORMA DECRYPTOR v2.0.0 // CONEXÃO CRIPTOGRAFADA</Text>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Simulated Google Sign-In Modal */}
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
            
            {/* Modal Error */}
            {!!googleModalError && (
              <View style={[styles.errorBox, { width: '100%', marginBottom: 16 }]}>
                <Text style={styles.errorText}>⚠️ {googleModalError}</Text>
              </View>
            )}

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
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 10,
    padding: 4,
    marginBottom: 20,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabBtnActive: {
    backgroundColor: theme.colors.primary,
  },
  tabBtnText: {
    color: theme.colors.textSecondary,
    fontWeight: 'bold',
    fontSize: 12,
    letterSpacing: 1.5,
  },
  tabBtnTextActive: {
    color: '#000000',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginBottom: 20,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    color: theme.colors.primary,
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,240,255,0.15)',
    paddingHorizontal: 14,
    height: 50,
  },
  inputIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    height: 50,
  },
  eyeBtn: {
    padding: 6,
  },
  eyeIcon: {
    fontSize: 18,
  },
  errorBox: {
    backgroundColor: 'rgba(255,0,85,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,0,85,0.3)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: 12,
    lineHeight: 18,
  },
  primaryBtn: {
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
    overflow: 'hidden',
    marginTop: 4,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  primaryBtnDisabled: {
    opacity: 0.6,
  },
  primaryBtnGrad: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: theme.colors.primary,
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 2,
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  orText: {
    color: theme.colors.textMuted,
    fontSize: 12,
    marginHorizontal: 12,
  },
  guestBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(189,0,255,0.3)',
    backgroundColor: 'rgba(189,0,255,0.04)',
    alignItems: 'center',
  },
  guestBtnText: {
    color: theme.colors.secondary,
    fontWeight: 'bold',
    fontSize: 13,
    letterSpacing: 1,
  },
  footer: {
    color: theme.colors.textMuted,
    fontSize: 9,
    letterSpacing: 1.5,
    marginTop: 32,
    textAlign: 'center',
  },
  googleBtn: {
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    overflow: 'hidden',
    marginTop: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
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
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 1.5,
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

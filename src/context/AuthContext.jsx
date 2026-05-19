// Importação do React core e utilitários para Context API do React
import React, { createContext, useState, useEffect, useContext } from 'react';

// Importação das flags de status do Firebase e serviços expostos (Autenticação e Firestore)
import { isFirebaseEnabled, auth, db } from '../../firebase.config';

// Importação de funções cruciais do módulo oficial de Autenticação do Firebase
import { 
  signInAnonymously,               // Função para login anônimo sem credenciais
  signInWithEmailAndPassword,      // Autentica o usuário a partir do e-mail e senha no console
  createUserWithEmailAndPassword,  // Cadastra e autentica um novo e-mail e senha no console
  signOut,                         // Encerra a sessão ativa do usuário ativo no Firebase
  onAuthStateChanged,              // Listener do estado de autenticação (dispara a cada mudança)
  updateProfile                    // Atualiza metadados básicos (como displayName) no nó do Firebase
} from 'firebase/auth';

// Importação de métodos auxiliares do Firestore para ler/gravar perfis em coleções no banco
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Biblioteca padrão de persistência local AsyncStorage para suporte a cenários offline e emulação
import AsyncStorage from '@react-native-async-storage/async-storage';

// API para detecção da plataforma de execução corrente (ex: 'ios', 'android', 'web')
import { Platform } from 'react-native';

// Inicializa a configuração do Google Sign-In no Mobile de forma dinâmica (apenas nativo)
if (Platform.OS !== 'web') {
  try {
    const { GoogleSignin } = require('@react-native-google-signin/google-signin');
    GoogleSignin.configure({
      // Credencial Web Client ID criada no console Google Cloud para autenticação cruzada
      webClientId: '546354146563-juair62rvu8h1q06kgfsc8qh1mehrmrt.apps.googleusercontent.com',
      offlineAccess: true,
    });
  } catch (err) {
    console.warn('Google Sign-in não configurado:', err);
  }
}

// Criação do objeto do React Context para propagar as informações de sessão por todo o aplicativo
const AuthContext = createContext({});

/**
 * Provedor do Contexto de Autenticação (AuthProvider).
 * Centraliza e distribui o ciclo de vida de login, logout e sincronização com o Firebase Auth
 * ou AsyncStorage (em cenários simulados offline).
 */
export const AuthProvider = ({ children }) => {
  // --- Estados Principais de Autenticação ---
  // user guarda o objeto do usuário ativo contendo uid, email, displayName e photoURL
  const [user, setUser] = useState(null);
  
  // loading sinaliza se o processo inicial de validação da sessão ainda está sendo processado
  const [loading, setLoading] = useState(true);
  
  // isOffline indica se a aplicação está rodando em modo puramente local (Firebase desativado)
  const [isOffline, setIsOffline] = useState(!isFirebaseEnabled);
  
  // authError armazena a mensagem traduzida do último erro gerado em fluxos de login/cadastro
  const [authError, setAuthError] = useState(null);

  // Inicializa o listener de autenticação no montagem do componente
  useEffect(() => {
    let unsubscribe;
    
    const initAuth = async () => {
      if (isFirebaseEnabled) {
        // Se o Firebase estiver ativo, assina o ouvinte oficial para capturar mudanças na sessão
        unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            // Se houver um usuário autenticado no Firebase, mapeia para o formato simplificado
            const userProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              isAnonymous: firebaseUser.isAnonymous,
              displayName: firebaseUser.displayName || (firebaseUser.isAnonymous ? 'Cyber Recruta' : firebaseUser.email.split('@')[0]),
              photoURL: firebaseUser.photoURL || null,
            };
            setUser(userProfile);
            setIsOffline(false);
          } else {
            // Se nenhum usuário estiver logado, zera o estado local
            setUser(null);
          }
          setLoading(false);
        });
      } else {
        // Se o Firebase estiver desativado, tenta ler a última sessão simulada no AsyncStorage
        try {
          const localUserStr = await AsyncStorage.getItem('@duoinforma_local_user');
          if (localUserStr) {
            setUser(JSON.parse(localUserStr));
          }
        } catch (e) {
          console.error('Erro ao carregar usuário local', e);
        }
        setLoading(false);
      }
    };

    initAuth();

    // Desinscreve o listener no desmonte do componente para evitar vazamento de memória (Memory Leak)
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  /**
   * Realiza login offline simulado gerando credenciais randômicas e persistindo localmente.
   * Utilizado quando o Firebase está inativo ou indisponível.
   * 
   * @param {string} [cleanEmail] - E-mail digitado pelo desenvolvedor no formulário
   */
  const loginOffline = async (cleanEmail) => {
    const mockUid = 'offline_' + Math.random().toString(36).substr(2, 9);
    const mockUser = {
      uid: mockUid,
      email: cleanEmail || null,
      isAnonymous: false,
      displayName: cleanEmail ? cleanEmail.split('@')[0] : 'Agente_' + Math.random().toString(36).substr(2, 5).toUpperCase(),
    };
    await AsyncStorage.setItem('@duoinforma_local_user', JSON.stringify(mockUser));
    setUser(mockUser);
    setIsOffline(true);
    setLoading(false);
  };

  /**
   * Fluxo principal de login com o Google.
   * Trata separadamente a web (com popup Firebase) e dispositivos nativos mobile.
   * Suporta fallback para emulador ou falha de chaves simulando fluxo de login offline.
   */
  const loginWithGoogle = async () => {
    setLoading(true);
    setAuthError(null);
    
    if (Platform.OS === 'web') {
      if (isFirebaseEnabled) {
        try {
          const { GoogleAuthProvider, signInWithPopup } = require('firebase/auth');
          const provider = new GoogleAuthProvider();
          await signInWithPopup(auth, provider);
        } catch (error) {
          setLoading(false);
          const msg = _translateFirebaseError(error.code);
          setAuthError(msg);
          throw new Error(msg);
        }
      } else {
        await loginOffline();
      }
    } else {
      // Plataforma Mobile - Executa login com Google nativo ou redireciona para simulação
      try {
        if (!isFirebaseEnabled) {
          // Caso Firebase esteja desativado nas configs locais, lança fluxo simulado
          throw new Error('SIMULATED_GOOGLE_FLOW');
        }

        const { GoogleSignin } = require('@react-native-google-signin/google-signin');
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        
        const signInResult = await GoogleSignin.signIn();
        const idToken = signInResult.idToken || (signInResult.data && signInResult.data.idToken);
        
        if (!idToken) {
          throw new Error('Não foi possível obter o ID Token do Google.');
        }

        const { GoogleAuthProvider, signInWithCredential } = require('firebase/auth');
        const credential = GoogleAuthProvider.credential(idToken);
        await signInWithCredential(auth, credential);
      } catch (error) {
        console.log('Erro no Google Sign-In real:', error);
        
        // Trata erros comuns de setup (como falta do Google Play Services em emuladores comuns, 
        // cancelamentos intencionais ou chaves SHAs desalinhadas no Firebase Console)
        if (
          error.code === 'SIGN_IN_CANCELLED' || 
          error.code === 'IN_PROGRESS' || 
          error.code === 'PLAY_SERVICES_NOT_AVAILABLE' ||
          error.message?.includes('developer') ||
          error.message?.includes('play services') ||
          error.message?.includes('Play Services') ||
          error.message?.includes('DEVELOPER_ERROR') ||
          error.message === 'SIMULATED_GOOGLE_FLOW'
        ) {
          setLoading(false);
          // Lança a exceção específica identificando que a tela de login deve abrir a janela de simulação dev
          throw new Error('SIMULATED_GOOGLE_FLOW');
        }
        setLoading(false);
        const msg = _translateFirebaseError(error.code) || error.message;
        setAuthError(msg);
        throw new Error(msg);
      }
    }
  };

  /**
   * Login com Google simulado de alta fidelidade para ambientes de desenvolvimento ou emulador.
   * Cria uma conta de e-mail e senha real no Firebase sob o capô baseando-se no e-mail do Google,
   * permitindo testes funcionais completos do banco de dados na nuvem Firestore sem precisar configurar a API Google.
   */
  const loginWithGoogleSimulated = async (email, customPassword = null) => {
    setLoading(true);
    setAuthError(null);
    const cleanEmail = email.trim();
    
    // Gera uma senha determinística baseada no e-mail para que a conta seja real no console Firebase
    const simulatedPassword = customPassword || ('GoogleSimulated_' + cleanEmail + '_Duoinforma2026');
    
    if (isFirebaseEnabled) {
      try {
        // Tenta autenticar o usuário diretamente no nó de e-mail e senha
        await signInWithEmailAndPassword(auth, cleanEmail, simulatedPassword);
      } catch (error) {
        // Lança o erro imediatamente caso tenha sido fornecida uma senha customizada incorreta pelo modal de desenvolvedor
        if (customPassword) {
          setLoading(false);
          const msg = _translateFirebaseError(error.code);
          setAuthError(msg);
          throw new Error(msg);
        }

        // Se o usuário não existir no banco (primeiro login dele), registra-o imediatamente!
        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential' || error.code === 'auth/invalid-email') {
          try {
            const cred = await createUserWithEmailAndPassword(auth, cleanEmail, simulatedPassword);
            const displayName = cleanEmail.split('@')[0];
            // Configura o display name inicial usando o prefixo do e-mail
            await updateProfile(cred.user, { displayName });
          } catch (regError) {
            setLoading(false);
            const msg = _translateFirebaseError(regError.code);
            setAuthError(msg);
            throw new Error(msg);
          }
        } else {
          setLoading(false);
          const msg = _translateFirebaseError(error.code);
          setAuthError(msg);
          throw new Error(msg);
        }
      }
    } else {
      // Fallback offline caso o Firebase esteja inativo
      const mockUser = {
        uid: 'google_offline_' + Math.random().toString(36).substr(2, 9),
        email: cleanEmail,
        isAnonymous: false,
        displayName: cleanEmail.split('@')[0],
        photoURL: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
      };
      await AsyncStorage.setItem('@duoinforma_local_user', JSON.stringify(mockUser));
      setUser(mockUser);
      setIsOffline(true);
      setLoading(false);
    }
  };

  /**
   * Atualiza o nome de exibição do usuário ativo.
   * Persiste a alteração no perfil do Firebase e salva a cópia localmente no AsyncStorage.
   * 
   * @param {string} newName - Novo codinome inserido pelo usuário
   */
  const updateDisplayName = async (newName) => {
    if (!newName || !newName.trim()) return;
    const trimmed = newName.trim();

    if (isFirebaseEnabled && auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, { displayName: trimmed });
      } catch (e) {
        console.warn('Erro ao atualizar nome no Firebase:', e.message);
      }
    }

    const updatedUser = { ...user, displayName: trimmed };
    setUser(updatedUser);

    // Salva a cópia dos dados cadastrais localmente
    try {
      const existing = await AsyncStorage.getItem('@duoinforma_local_user');
      if (existing) {
        const parsed = JSON.parse(existing);
        await AsyncStorage.setItem('@duoinforma_local_user', JSON.stringify({ ...parsed, displayName: trimmed }));
      }
    } catch (e) {
      console.error('Erro ao salvar displayName localmente:', e);
    }
  };

  /**
   * Desloga o usuário atual, limpando todos os estados e storages locais.
   */
  const logoutUser = async () => {
    setLoading(true);
    if (isFirebaseEnabled) {
      try {
        await signOut(auth);
      } catch (error) {
        console.error('Erro ao deslogar Firebase:', error);
      }
    }
    // Remove as chaves persistidas no AsyncStorage referentes ao usuário e pontuação de jogo
    await AsyncStorage.removeItem('@duoinforma_local_user');
    await AsyncStorage.removeItem('@duoinforma_game_state');
    
    // Zera o estado local de autenticação
    setUser(null);
    setLoading(false);
  };

  /**
   * Traduz códigos e códigos de erros retornados pela API do Firebase para mensagens amigáveis em Português.
   */
  const _translateFirebaseError = (code) => {
    const errors = {
      'auth/email-already-in-use': 'Este e-mail já está cadastrado.',
      'auth/invalid-email': 'Formato de e-mail inválido.',
      'auth/weak-password': 'A senha deve ter no mínimo 6 caracteres.',
      'auth/user-not-found': 'Usuário não encontrado.',
      'auth/wrong-password': 'Senha incorreta.',
      'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
      'auth/network-request-failed': 'Sem conexão com a internet.',
    };
    return errors[code] || 'Erro de autenticação. Tente novamente.';
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isOffline,
      authError,
      loginWithGoogle,
      loginWithGoogleSimulated,
      updateDisplayName,
      logoutUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado simplificado para consumo direto do AuthContext nos componentes
export const useAuth = () => useContext(AuthContext);
export default AuthContext;

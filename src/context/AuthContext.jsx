import React, { createContext, useState, useEffect, useContext } from 'react';
import { isFirebaseEnabled, auth, db } from '../../firebase.config';
import { 
  signInAnonymously, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Configure Google Sign-in on Mobile when Firebase is enabled
if (Platform.OS !== 'web') {
  try {
    const { GoogleSignin } = require('@react-native-google-signin/google-signin');
    GoogleSignin.configure({
      webClientId: '546354146563-juair62rvu8h1q06kgfsc8qh1mehrmrt.apps.googleusercontent.com',
      offlineAccess: true,
    });
  } catch (err) {
    console.warn('Google Sign-in não configurado:', err);
  }
}

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(!isFirebaseEnabled);
  const [authError, setAuthError] = useState(null);

  // Load offline user from storage on start
  useEffect(() => {
    let unsubscribe;
    
    const initAuth = async () => {
      if (isFirebaseEnabled) {
        unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
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
            setUser(null);
          }
          setLoading(false);
        });
      } else {
        // Fallback: load local mock user
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

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Anonymous Login / Fast Login (Convidado)
  const loginAnonymously = async () => {
    setLoading(true);
    setAuthError(null);
    if (isFirebaseEnabled) {
      try {
        await signInAnonymously(auth);
      } catch (error) {
        console.error('Erro no login anônimo Firebase:', error);
        await loginOffline();
      }
    } else {
      await loginOffline();
    }
  };

  const loginOffline = async () => {
    const mockUid = 'offline_' + Math.random().toString(36).substr(2, 9);
    const mockUser = {
      uid: mockUid,
      email: null,
      isAnonymous: true,
      displayName: 'Agente_' + Math.random().toString(36).substr(2, 5).toUpperCase(),
    };
    await AsyncStorage.setItem('@duoinforma_local_user', JSON.stringify(mockUser));
    setUser(mockUser);
    setIsOffline(true);
    setLoading(false);
  };

  // Login with Google (Platform Hybrid)
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
      // Mobile - Real Google Sign In with Simulated fallback
      try {
        if (!isFirebaseEnabled) {
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
        // Fallback to simulation if GoogleSignin fails due to developer setup or missing Play Services,
        // or user cancels, or developer explicitly wants mock.
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
          throw new Error('SIMULATED_GOOGLE_FLOW');
        }
        setLoading(false);
        const msg = _translateFirebaseError(error.code) || error.message;
        setAuthError(msg);
        throw new Error(msg);
      }
    }
  };

  // Simulated Google Auth on Mobile Emulator (creates a real Firebase User based on the Google Email)
  const loginWithGoogleSimulated = async (email, customPassword = null) => {
    setLoading(true);
    setAuthError(null);
    const cleanEmail = email.trim();
    
    // Create a safe, deterministic password based on the email so it's a real Firebase credentials login under the hood
    const simulatedPassword = customPassword || ('GoogleSimulated_' + cleanEmail + '_Duoinforma2026');
    
    if (isFirebaseEnabled) {
      try {
        // Try to login
        await signInWithEmailAndPassword(auth, cleanEmail, simulatedPassword);
      } catch (error) {
        // If we tried with a custom password and it failed, throw immediately
        if (customPassword) {
          setLoading(false);
          const msg = _translateFirebaseError(error.code);
          setAuthError(msg);
          throw new Error(msg);
        }

        // If the user does not exist in Firebase, register them!
        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential' || error.code === 'auth/invalid-email') {
          try {
            const cred = await createUserWithEmailAndPassword(auth, cleanEmail, simulatedPassword);
            const displayName = cleanEmail.split('@')[0];
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
      // Offline fallback mock
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

  // Register with Email
  const registerWithEmail = async (name, email, password) => {
    setLoading(true);
    setAuthError(null);
    if (isFirebaseEnabled) {
      try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        if (name) {
          await updateProfile(cred.user, { displayName: name });
        }
      } catch (error) {
        setLoading(false);
        const msg = _translateFirebaseError(error.code);
        setAuthError(msg);
        throw new Error(msg);
      }
    } else {
      const mockUser = {
        uid: 'offline_' + Math.random().toString(36).substr(2, 9),
        email: email,
        isAnonymous: false,
        displayName: name || email.split('@')[0],
      };
      await AsyncStorage.setItem('@duoinforma_local_user', JSON.stringify(mockUser));
      setUser(mockUser);
      setIsOffline(true);
      setLoading(false);
    }
  };

  // Login with Email
  const loginWithEmail = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    if (isFirebaseEnabled) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (error) {
        setLoading(false);
        const msg = _translateFirebaseError(error.code);
        setAuthError(msg);
        throw new Error(msg);
      }
    } else {
      // Local mock login — accept any credentials offline
      const mockUser = {
        uid: 'offline_user_' + email.replace(/[^a-z0-9]/gi, '_'),
        email: email,
        isAnonymous: false,
        displayName: email.split('@')[0],
      };
      await AsyncStorage.setItem('@duoinforma_local_user', JSON.stringify(mockUser));
      setUser(mockUser);
      setIsOffline(true);
      setLoading(false);
    }
  };

  // Update display name (codinome do agente)
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

    // Persist locally
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

  // Logout
  const logoutUser = async () => {
    setLoading(true);
    if (isFirebaseEnabled) {
      try {
        await signOut(auth);
      } catch (error) {
        console.error('Erro ao deslogar Firebase:', error);
      }
    }
    await AsyncStorage.removeItem('@duoinforma_local_user');
    await AsyncStorage.removeItem('@duoinforma_game_state');
    setUser(null);
    setLoading(false);
  };

  // Translate Firebase error codes to Portuguese
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
      loginAnonymously,
      loginWithEmail,
      registerWithEmail,
      loginWithGoogle,
      loginWithGoogleSimulated,
      updateDisplayName,
      logoutUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;

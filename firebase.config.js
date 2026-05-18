import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// In Expo 54+, standard configuration can be fetched from process.env or expo-constants.
// We will set up standard placeholder configs. If they are not valid or missing,
// our auth/game context will fallback to safe local storage mock so that the app NEVER crashes.
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyBnYFMdmi7RUxC3OCqA3CO2F9I7R7MwJio",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "biblioteca-d2087.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "biblioteca-d2087",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "biblioteca-d2087.firebasestorage.app",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "546354146563",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:546354146563:web:1fa043db6175cfee308d36"
};

let app;
let auth;
let db;
let isFirebaseEnabled = false;

// Check if credentials look real and attempt initialization
if (firebaseConfig.apiKey && !firebaseConfig.apiKey.includes("DummyKey")) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    
    // Check if we can initialize Auth with persistence
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
    
    db = getFirestore(app);
    isFirebaseEnabled = true;
    console.log("Firebase inicializado com sucesso!");
  } catch (error) {
    console.warn("Falha ao inicializar o Firebase. Usando fallback offline:", error.message);
  }
} else {
  console.log("Credenciais do Firebase ausentes ou padrão. O app rodará em MODO OFFLINE local.");
}

export { app, auth, db, isFirebaseEnabled };

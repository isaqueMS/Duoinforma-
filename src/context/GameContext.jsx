import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { isFirebaseEnabled, db } from '../../firebase.config';
import { doc, getDoc, setDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GameContext = createContext({});

const LEVELS = [
  { minPoints: 0, title: 'Recruta Digital', badge: '🤖' },
  { minPoints: 100, title: 'Cibercadete', badge: '🛡️' },
  { minPoints: 300, title: 'Analista de Fatos', badge: '🔍' },
  { minPoints: 600, title: 'Detetive Digital', badge: '🕵️‍♂️' },
  { minPoints: 1000, title: 'Guardião da Verdade', badge: '🔮' },
  { minPoints: 1500, title: 'Mestre Anti-Fake', badge: '👑' }
];

const ACHIEVEMENTS = [
  { id: 'first_training', title: 'Primeiro Alerta', description: 'Concluiu a análise da primeira postagem.', badge: '⚡', points: 30 },
  { id: 'perfect_3', title: 'Analista Preciso', description: 'Acertou 3 análises seguidas no Treinamento.', badge: '🎯', points: 50 },
  { id: 'streak_3', title: 'Hábito Saudável', description: 'Manteve uma sequência de 3 dias ativos.', badge: '🔥', points: 40 },
  { id: 'scanner_master', title: 'Inspetor Cibernético', description: 'Verificou 5 links ou textos no Scanner Digital.', badge: '📡', points: 60 },
  { id: 'level_up_1', title: 'Promovido!', description: 'Subiu de nível pela primeira vez.', badge: '🌟', points: 50 },
  { id: 'exam_facil', title: 'Iniciado Seguro', description: 'Aprovado no Exame Nível Fácil.', badge: '🔑', points: 100 },
  { id: 'exam_medio', title: 'Defensor Digital', description: 'Aprovado no Exame Nível Médio.', badge: '🛡️', points: 150 },
  { id: 'exam_dificil', title: 'Ciber-Oráculo', description: 'Aprovado no Exame Nível Difícil.', badge: '🔮', points: 250 }
];

export const GameProvider = ({ children }) => {
  const { user, isOffline } = useAuth();
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(1);
  const [completedTrainings, setCompletedTrainings] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [scannerHistory, setScannerHistory] = useState([]);
  const [unlockedExamLevel, setUnlockedExamLevel] = useState('facil'); // 'facil' | 'medio' | 'dificil'
  const [examScores, setExamScores] = useState({ facil: null, medio: null, dificil: null });
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [age, setAge] = useState(null);
  const [location, setLocation] = useState(null);

  // Get current Level title and badge
  const getCurrentLevel = () => {
    let current = LEVELS[0];
    for (let i = 0; i < LEVELS.length; i++) {
      if (points >= LEVELS[i].minPoints) {
        current = LEVELS[i];
      } else {
        break;
      }
    }
    return current;
  };

  // Fetch dynamic leaderboard from Firestore
  const fetchLeaderboard = async () => {
    if (!isFirebaseEnabled) {
      // Offline fallback leaderboard
      setLeaderboard([
        { rank: 1, name: 'CyberGuardian_9', points: 2850, level: 'Mestre Anti-Fake 👑' },
        { rank: 2, name: 'FactFinder_Neo', points: 2420, level: 'Mestre Anti-Fake 👑' },
        { rank: 3, name: 'ByteDetetive', points: 1980, level: 'Mestre Anti-Fake 👑' },
        { rank: 4, name: 'CibernautaReal', points: 1450, level: 'Guardião da Verdade 🔮' }
      ]);
      return;
    }

    try {
      const q = query(collection(db, 'gamestate'), orderBy('points', 'desc'), limit(10));
      const querySnapshot = await getDocs(q);
      const list = [];
      let rank = 1;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        list.push({
          rank,
          name: data.displayName || 'Agente Anônimo',
          points: data.points || 0,
          level: `${data.levelTitle || 'Recruta Digital'} ${data.levelBadge || '🤖'}`
        });
        rank++;
      });

      // If empty or has very few items, fill with mock data so it looks premium and populated
      if (list.length < 4) {
        const mockList = [
          { rank: list.length + 1, name: 'CyberGuardian_9', points: 2850, level: 'Mestre Anti-Fake 👑' },
          { rank: list.length + 2, name: 'FactFinder_Neo', points: 2420, level: 'Mestre Anti-Fake 👑' },
          { rank: list.length + 3, name: 'ByteDetetive', points: 1980, level: 'Mestre Anti-Fake 👑' },
          { rank: list.length + 4, name: 'CibernautaReal', points: 1450, level: 'Guardião da Verdade 🔮' }
        ];
        
        // Combine real and mock, then sort again
        const combined = [...list, ...mockList]
          .sort((a, b) => b.points - a.points)
          .map((item, index) => ({ ...item, rank: index + 1 }));
          
        setLeaderboard(combined.slice(0, 5));
      } else {
        setLeaderboard(list);
      }
    } catch (e) {
      console.warn("Erro ao buscar leaderboard do Firestore:", e);
      setLeaderboard([
        { rank: 1, name: 'CyberGuardian_9', points: 2850, level: 'Mestre Anti-Fake 👑' },
        { rank: 2, name: 'FactFinder_Neo', points: 2420, level: 'Mestre Anti-Fake 👑' },
        { rank: 3, name: 'ByteDetetive', points: 1980, level: 'Mestre Anti-Fake 👑' },
        { rank: 4, name: 'CibernautaReal', points: 1450, level: 'Guardião da Verdade 🔮' }
      ]);
    }
  };

  // Load gamestate
  useEffect(() => {
    const loadGameState = async () => {
      if (!user) {
        setPoints(0);
        setCompletedTrainings([]);
        setAchievements([]);
        setScannerHistory([]);
        setUnlockedExamLevel('facil');
        setExamScores({ facil: null, medio: null, dificil: null });
        setLoading(false);
        return;
      }

      setLoading(true);
      let loadedState = null;

      // 1. Try local storage first (always, for fast load)
      try {
        const localStateStr = await AsyncStorage.getItem(`@duoinforma_game_${user.uid}`);
        if (localStateStr) {
          loadedState = JSON.parse(localStateStr);
        }
      } catch (e) {
        console.error("Erro ao carregar gamestate local", e);
      }

      // 2. Try Firebase Firestore if online
      if (isFirebaseEnabled && !isOffline) {
        try {
          const docRef = doc(db, 'gamestate', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const firebaseState = docSnap.data();
            // Merge or choose the one with higher points/more progress
            if (!loadedState || firebaseState.points >= loadedState.points) {
              loadedState = firebaseState;
            }
          }
        } catch (e) {
          console.warn("Falha ao sincronizar com Firestore, usando dados locais:", e.message);
        }
      }

      // 3. Set states
      if (loadedState) {
        setPoints(loadedState.points || 0);
        setStreak(loadedState.streak || 1);
        setCompletedTrainings(loadedState.completedTrainings || []);
        setAchievements(loadedState.achievements || []);
        setScannerHistory(loadedState.scannerHistory || []);
        setUnlockedExamLevel(loadedState.unlockedExamLevel || 'facil');
        setExamScores(loadedState.examScores || { facil: null, medio: null, dificil: null });
        setAge(loadedState.age || null);
        setLocation(loadedState.location || null);
      } else {
        // Init default state
        setPoints(0);
        setStreak(1);
        setCompletedTrainings([]);
        setAchievements([]);
        setScannerHistory([]);
        setUnlockedExamLevel('facil');
        setExamScores({ facil: null, medio: null, dificil: null });
        setAge(null);
        setLocation(null);
      }
      setLoading(false);
      
      // Fetch leaderboard once gamestate loads
      fetchLeaderboard();
    };

    loadGameState();
  }, [user, isOffline]);

  // Keep displayName on leaderboard synced when user changes it in AuthContext
  useEffect(() => {
    const syncDisplayName = async () => {
      if (user && isFirebaseEnabled && !isOffline) {
        try {
          await setDoc(doc(db, 'gamestate', user.uid), {
            displayName: user.displayName || 'Agente Anônimo'
          }, { merge: true });
          
          fetchLeaderboard();
        } catch (e) {
          console.warn("Erro ao sincronizar displayName no Firestore:", e.message);
        }
      }
    };
    
    syncDisplayName();
  }, [user?.displayName, isOffline]);

  // Sync state helper
  const syncGameState = async (newPoints, newCompleted, newAchievements, newHistory, newUnlockedLevel = unlockedExamLevel, newScores = examScores) => {
    if (!user) return;

    const currentLevel = getCurrentLevel();
    const stateToSave = {
      uid: user.uid,
      displayName: user.displayName || 'Agente Anônimo',
      photoURL: user.photoURL || null,
      levelTitle: currentLevel.title,
      levelBadge: currentLevel.badge,
      points: newPoints,
      streak,
      completedTrainings: newCompleted,
      achievements: newAchievements,
      scannerHistory: newHistory,
      unlockedExamLevel: newUnlockedLevel,
      examScores: newScores,
      age,
      location,
      updatedAt: new Date().toISOString()
    };

    // Save locally
    try {
      await AsyncStorage.setItem(`@duoinforma_game_${user.uid}`, JSON.stringify(stateToSave));
    } catch (e) {
      console.error("Erro ao salvar gamestate local:", e);
    }

    // Save to Firestore if online
    if (isFirebaseEnabled && !isOffline) {
      try {
        await setDoc(doc(db, 'gamestate', user.uid), stateToSave, { merge: true });
      } catch (e) {
        console.warn("Erro ao salvar gamestate no Firestore:", e.message);
      }
    }

    // Refresh leaderboard
    fetchLeaderboard();
  };

  // Update Age and Location
  const updateUserMetadata = async (newAge, newLocation) => {
    if (!user) return;

    setAge(newAge);
    setLocation(newLocation);

    const currentLevel = getCurrentLevel();
    const stateToSave = {
      uid: user.uid,
      displayName: user.displayName || 'Agente Anônimo',
      photoURL: user.photoURL || null,
      levelTitle: currentLevel.title,
      levelBadge: currentLevel.badge,
      points,
      streak,
      completedTrainings,
      achievements,
      scannerHistory,
      unlockedExamLevel,
      examScores,
      age: newAge,
      location: newLocation,
      updatedAt: new Date().toISOString()
    };

    // Save locally
    try {
      await AsyncStorage.setItem(`@duoinforma_game_${user.uid}`, JSON.stringify(stateToSave));
    } catch (e) {
      console.error("Erro ao salvar metadata local:", e);
    }

    // Save to Firestore if online
    if (isFirebaseEnabled && !isOffline) {
      try {
        await setDoc(doc(db, 'gamestate', user.uid), stateToSave, { merge: true });
      } catch (e) {
        console.warn("Erro ao salvar metadata no Firestore:", e.message);
      }
    }
  };

  // Get progress to next level
  const getNextLevelProgress = () => {
    let currentIdx = 0;
    for (let i = 0; i < LEVELS.length; i++) {
      if (points >= LEVELS[i].minPoints) {
        currentIdx = i;
      } else {
        break;
      }
    }

    if (currentIdx === LEVELS.length - 1) {
      return { percentage: 1, currentMin: LEVELS[currentIdx].minPoints, nextMin: LEVELS[currentIdx].minPoints, nextTitle: 'Nível Máximo' };
    }

    const currentMin = LEVELS[currentIdx].minPoints;
    const nextMin = LEVELS[currentIdx + 1].minPoints;
    const levelRange = nextMin - currentMin;
    const earnedInLevel = points - currentMin;
    const percentage = Math.min(Math.max(earnedInLevel / levelRange, 0), 1);

    return {
      percentage,
      currentMin,
      nextMin,
      nextTitle: LEVELS[currentIdx + 1].title
    };
  };

  // Add Points
  const addPoints = async (amount) => {
    const newPoints = points + amount;
    setPoints(newPoints);
    
    // Check level up achievement
    let updatedAchievements = [...achievements];
    const prevLevel = LEVELS.find(l => points >= l.minPoints);
    const nextLevel = LEVELS.find(l => newPoints >= l.minPoints);
    
    if (prevLevel && nextLevel && prevLevel.title !== nextLevel.title && !achievements.includes('level_up_1')) {
      updatedAchievements.push('level_up_1');
      setAchievements(updatedAchievements);
    }

    await syncGameState(newPoints, completedTrainings, updatedAchievements, scannerHistory);
  };

  // Complete a training
  const completeTraining = async (id, isCorrect, pointsEarned) => {
    if (completedTrainings.includes(id)) return;

    const newCompleted = [...completedTrainings, id];
    setCompletedTrainings(newCompleted);

    let finalPoints = points;
    if (isCorrect) {
      finalPoints += pointsEarned;
      setPoints(finalPoints);
    }

    // Achievements logic
    const updatedAchievements = [...achievements];
    
    // 1. First training
    if (newCompleted.length === 1 && !achievements.includes('first_training')) {
      updatedAchievements.push('first_training');
      finalPoints += 30; // bonus points
    }

    // 2. Perfect 3 analyses
    if (newCompleted.length >= 3 && isCorrect && !achievements.includes('perfect_3')) {
      updatedAchievements.push('perfect_3');
      finalPoints += 50; // bonus
    }

    setAchievements(updatedAchievements);
    await syncGameState(finalPoints, newCompleted, updatedAchievements, scannerHistory);
  };

  // Add search scan history item
  const addScanHistory = async (content, result, type) => {
    const newHistoryItem = {
      id: Math.random().toString(36).substr(2, 9),
      content,
      result,
      type, // 'link', 'text', 'image'
      timestamp: new Date().toLocaleDateString('pt-BR')
    };

    const newHistory = [newHistoryItem, ...scannerHistory].slice(0, 10); // Keep last 10 scans
    setScannerHistory(newHistory);

    let finalPoints = points + 15; // 15 points per verification scan
    setPoints(finalPoints);

    const updatedAchievements = [...achievements];
    if (newHistory.length >= 5 && !achievements.includes('scanner_master')) {
      updatedAchievements.push('scanner_master');
      finalPoints += 60; // bonus
      setPoints(finalPoints);
    }

    await syncGameState(finalPoints, completedTrainings, updatedAchievements, newHistory);
  };

  // Complete Exam Level with Progression Logic
  const completeExamLevel = async (level, score) => {
    const totalQuestions = level === 'facil' ? 15 : level === 'medio' ? 20 : 15;
    const percentage = score / totalQuestions;
    const passed = percentage >= 0.7; // 70% passing score
    
    let nextUnlockedLevel = unlockedExamLevel;
    let finalPoints = points;
    const updatedAchievements = [...achievements];
    const updatedScores = { ...examScores };

    // Update highest score if this score is better
    if (updatedScores[level] === null || score > updatedScores[level]) {
      updatedScores[level] = score;
    }

    let xpBonus = 0;
    let unlockedNewLevel = false;

    if (passed) {
      // Award first-time pass bonus and progression
      if (level === 'facil') {
        if (!achievements.includes('exam_facil')) {
          updatedAchievements.push('exam_facil');
          xpBonus = 300;
        }
        if (unlockedExamLevel === 'facil') {
          nextUnlockedLevel = 'medio';
          unlockedNewLevel = true;
        }
      } else if (level === 'medio') {
        if (!achievements.includes('exam_medio')) {
          updatedAchievements.push('exam_medio');
          xpBonus = 500;
        }
        if (unlockedExamLevel === 'medio') {
          nextUnlockedLevel = 'dificil';
          unlockedNewLevel = true;
        }
      } else if (level === 'dificil') {
        if (!achievements.includes('exam_dificil')) {
          updatedAchievements.push('exam_dificil');
          xpBonus = 800;
        }
      }
    }

    finalPoints += xpBonus;
    setPoints(finalPoints);
    setUnlockedExamLevel(nextUnlockedLevel);
    setExamScores(updatedScores);
    setAchievements(updatedAchievements);

    await syncGameState(
      finalPoints,
      completedTrainings,
      updatedAchievements,
      scannerHistory,
      nextUnlockedLevel,
      updatedScores
    );

    return {
      passed,
      percentage,
      xpBonus,
      unlockedNewLevel
    };
  };

  return (
    <GameContext.Provider value={{
      points,
      streak,
      completedTrainings,
      achievements,
      scannerHistory,
      unlockedExamLevel,
      examScores,
      leaderboard,
      loading,
      age,
      location,
      updateUserMetadata,
      getCurrentLevel,
      getNextLevelProgress,
      addPoints,
      completeTraining,
      addScanHistory,
      completeExamLevel,
      fetchLeaderboard,
      ACHIEVEMENTS
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
export default GameContext;

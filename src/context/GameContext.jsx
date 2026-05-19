// Importação do React core e hooks essenciais
import React, { createContext, useState, useEffect, useContext } from 'react';

// Importação do hook de acesso ao contexto de autenticação do usuário
import { useAuth } from './AuthContext';

// Importação das flags de status do Firebase e conexões de banco de dados
import { isFirebaseEnabled, db } from '../../firebase.config';

// Importação de métodos auxiliares do Firestore para gerenciar dados do jogo
import { doc, getDoc, setDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

// Importação da biblioteca AsyncStorage para cache local persistente offline
import AsyncStorage from '@react-native-async-storage/async-storage';

// Criação do objeto do React Context para propagar as estatísticas do jogo
const GameContext = createContext({});

// Definição dos critérios de progressão de nível de acordo com as faixas de pontos
const LEVELS = [
  { minPoints: 0, title: 'Recruta Digital', badge: '🤖' },
  { minPoints: 100, title: 'Cibercadete', badge: '🛡️' },
  { minPoints: 300, title: 'Analista de Fatos', badge: '🔍' },
  { minPoints: 600, title: 'Detetive Digital', badge: '🕵️‍♂️' },
  { minPoints: 1000, title: 'Guardião da Verdade', badge: '🔮' },
  { minPoints: 1500, title: 'Mestre Anti-Fake', badge: '👑' }
];

// Lista estática de conquistas (achievements) com títulos, descrições e bônus de XP
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

/**
 * Componente GameProvider.
 * Gerencia a pontuação (XP), ofensiva diária (streak), lista de treinamentos concluídos,
 * conquistas desbloqueadas, histórico de varreduras de segurança do scanner,
 * metadados demográficos do usuário e sincronização em nuvem via Firestore.
 */
export const GameProvider = ({ children }) => {
  // Obtém o registro de usuário autenticado
  const { user, isOffline } = useAuth();
  
  // Declaração dos estados internos do jogo
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

  /**
   * Retorna o título e o badge do nível atual com base nos pontos de XP
   */
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

  /**
   * Busca a lista de líderes (leaderboard) ordenada por maior XP
   * de forma remota no Firestore ou recorre a dados fictícios se offline.
   */
  const fetchLeaderboard = async () => {
    if (!isFirebaseEnabled) {
      setLeaderboard([
        { rank: 1, name: 'CyberGuardian_9', points: 2850, level: 'Mestre Anti-Fake 👑' },
        { rank: 2, name: 'FactFinder_Neo', points: 2420, level: 'Mestre Anti-Fake 👑' },
        { rank: 3, name: 'ByteDetetive', points: 1980, level: 'Mestre Anti-Fake 👑' },
        { rank: 4, name: 'CibernautaReal', points: 1450, level: 'Guardião da Verdade 🔮' }
      ]);
      return;
    }

    try {
      // Cria consulta ordenando os usuários por pontos no Firestore (limitando aos 10 melhores)
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

      // Caso o banco remoto tenha poucos dados, mescla com dados estáticos para visual elegante no app
      if (list.length < 4) {
        const mockList = [
          { rank: list.length + 1, name: 'CyberGuardian_9', points: 2850, level: 'Mestre Anti-Fake 👑' },
          { rank: list.length + 2, name: 'FactFinder_Neo', points: 2420, level: 'Mestre Anti-Fake 👑' },
          { rank: list.length + 3, name: 'ByteDetetive', points: 1980, level: 'Mestre Anti-Fake 👑' },
          { rank: list.length + 4, name: 'CibernautaReal', points: 1450, level: 'Guardião da Verdade 🔮' }
        ];
        
        // Combina as listas, ordena por XP e reconstrói as posições (ranks) corretas
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

  // Carrega e sincroniza as estatísticas do jogo ao logar ou mudar de estado offline
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

      // Primeiro, tenta carregar do cache offline persistente do dispositivo
      try {
        const localStateStr = await AsyncStorage.getItem(`@duoinforma_game_${user.uid}`);
        if (localStateStr) {
          loadedState = JSON.parse(localStateStr);
        }
      } catch (e) {
        console.error("Erro ao carregar gamestate local", e);
      }

      // Se o Firebase estiver ativo e o app online, tenta carregar dados em nuvem
      if (isFirebaseEnabled && !isOffline) {
        try {
          const docRef = doc(db, 'gamestate', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const firebaseState = docSnap.data();
            // Mescla estados priorizando aquele com maior pontuação cadastrada
            if (!loadedState || firebaseState.points >= loadedState.points) {
              loadedState = firebaseState;
            }
          }
        } catch (e) {
          console.warn("Falha ao sincronizar com Firestore, usando dados locais:", e.message);
        }
      }

      // Alimenta as variáveis reativas com os dados consolidados carregados
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
        // Inicializa com as configurações padrões de recruta
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
      
      // Busca atualizada do ranking geral de líderes
      fetchLeaderboard();
    };

    loadGameState();
  }, [user, isOffline]);

  // Atualiza o apelido do agente no ranking quando houver edição cadastral
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

  /**
   * Rotina unificada de persistência.
   * Salva os pontos atualizados, conquistas e demais métricas no AsyncStorage e Firestore.
   */
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

    // Salva cópia local persistente
    try {
      await AsyncStorage.setItem(`@duoinforma_game_${user.uid}`, JSON.stringify(stateToSave));
    } catch (e) {
      console.error("Erro ao salvar gamestate local:", e);
    }

    // Envia dados consolidados para o Firestore na nuvem
    if (isFirebaseEnabled && !isOffline) {
      try {
        await setDoc(doc(db, 'gamestate', user.uid), stateToSave, { merge: true });
      } catch (e) {
        console.warn("Erro ao salvar gamestate no Firestore:", e.message);
      }
    }

    // Recarrega lista de líderes atualizada
    fetchLeaderboard();
  };

  /**
   * Grava os metadados cadastrais do usuário (idade e localidade)
   */
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

    try {
      await AsyncStorage.setItem(`@duoinforma_game_${user.uid}`, JSON.stringify(stateToSave));
    } catch (e) {
      console.error("Erro ao salvar metadata local:", e);
    }

    if (isFirebaseEnabled && !isOffline) {
      try {
        await setDoc(doc(db, 'gamestate', user.uid), stateToSave, { merge: true });
      } catch (e) {
        console.warn("Erro ao salvar metadata no Firestore:", e.message);
      }
    }
  };

  /**
   * Calcula o preenchimento proporcional (porcentagem) até a próxima promoção de nível
   */
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

  /**
   * Adiciona pontos na pontuação global do agente
   */
  const addPoints = async (amount) => {
    const newPoints = points + amount;
    setPoints(newPoints);
    
    // Verifica gatilhos de promoção de nível para liberar medalha correspondente
    let updatedAchievements = [...achievements];
    const prevLevel = LEVELS.find(l => points >= l.minPoints);
    const nextLevel = LEVELS.find(l => newPoints >= l.minPoints);
    
    if (prevLevel && nextLevel && prevLevel.title !== nextLevel.title && !achievements.includes('level_up_1')) {
      updatedAchievements.push('level_up_1');
      setAchievements(updatedAchievements);
    }

    await syncGameState(newPoints, completedTrainings, updatedAchievements, scannerHistory);
  };

  /**
   * Registra a conclusão da análise de uma postagem do simulador de Treinamento
   */
  const completeTraining = async (id, isCorrect, pointsEarned) => {
    if (completedTrainings.includes(id)) return;

    const newCompleted = [...completedTrainings, id];
    setCompletedTrainings(newCompleted);

    let finalPoints = points;
    if (isCorrect) {
      finalPoints += pointsEarned;
      setPoints(finalPoints);
    }

    const updatedAchievements = [...achievements];
    
    // Libera conquista do primeiro treinamento concluído
    if (newCompleted.length === 1 && !achievements.includes('first_training')) {
      updatedAchievements.push('first_training');
      finalPoints += 30; // Pontos bônus
    }

    // Libera conquista se acertar sequência de 3 análises
    if (newCompleted.length >= 3 && isCorrect && !achievements.includes('perfect_3')) {
      updatedAchievements.push('perfect_3');
      finalPoints += 50; // Pontos bônus
    }

    setAchievements(updatedAchievements);
    await syncGameState(finalPoints, newCompleted, updatedAchievements, scannerHistory);
  };

  /**
   * Salva a varredura efetuada pelo scanner de links/textos no histórico visível do agente
   */
  const addScanHistory = async (content, result, type) => {
    const newHistoryItem = {
      id: Math.random().toString(36).substr(2, 9),
      content,
      result,
      type, // 'link', 'text' ou 'image'
      timestamp: new Date().toLocaleDateString('pt-BR')
    };

    const newHistory = [newHistoryItem, ...scannerHistory].slice(0, 10);
    setScannerHistory(newHistory);

    let finalPoints = points + 15; // 15 XP concedidos por varredura
    setPoints(finalPoints);

    const updatedAchievements = [...achievements];
    if (newHistory.length >= 5 && !achievements.includes('scanner_master')) {
      updatedAchievements.push('scanner_master');
      finalPoints += 60; // Pontos bônus
      setPoints(finalPoints);
    }

    await syncGameState(finalPoints, completedTrainings, updatedAchievements, newHistory);
  };

  /**
   * Registra e valida os resultados obtidos em exames de certificações acadêmicas.
   * Exige o mínimo de 70% de taxa de acerto para promover o usuário ao próximo nível de dificuldade.
   */
  const completeExamLevel = async (level, score) => {
    const totalQuestions = level === 'facil' ? 15 : level === 'medio' ? 20 : 15;
    const percentage = score / totalQuestions;
    const passed = percentage >= 0.7; // Regra de aprovação: 70% de acertos
    
    let nextUnlockedLevel = unlockedExamLevel;
    let finalPoints = points;
    const updatedAchievements = [...achievements];
    const updatedScores = { ...examScores };

    if (updatedScores[level] === null || score > updatedScores[level]) {
      updatedScores[level] = score;
    }

    let xpBonus = 0;
    let unlockedNewLevel = false;

    if (passed) {
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

// Hook simplificado para consumo direto do GameContext nos componentes de tela
export const useGame = () => useContext(GameContext);
export default GameContext;

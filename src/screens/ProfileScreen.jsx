// Importação do React e Hooks necessários para gerenciar estados locais e disparar ações nos ciclos de vida do componente
import React, { useState, useEffect } from 'react';

// Importação dos componentes fundamentais do React Native para estruturação e estilização da interface nativa
import { 
  StyleSheet,       // Utilitário para compilação e validação de estilos JavaScript em folhas nativas
  View,             // Bloco genérico de divisão para organizar estruturas flexbox
  Text,             // Componente padrão para renderização de caracteres e strings estilizadas
  SafeAreaView,     // Container que evita que o conteúdo invada áreas de sistema (notch, status bar, etc.)
  ScrollView,       // Painel de exibição que habilita rolagem fluida para conteúdos longos
  TouchableOpacity, // Wrapper interativo que providencia feedback de opacidade instantâneo ao toque
  TextInput,        // Campo de entrada de texto para interação e digitação do usuário
  Image             // Componente de carregamento e exibição de mídias de imagem local ou remota (URL)
} from 'react-native';

// Importação do gradiente de cores da biblioteca oficial Expo LinearGradient
import { LinearGradient } from 'expo-linear-gradient';

// Importação do tema de design da aplicação (cores cyberpunk, fontes, espaçamentos e raios de borda)
import { theme } from '../styles/theme';

// Importação do contexto de autenticação para gerenciar sessões do Firebase Auth
import { useAuth } from '../context/AuthContext';

// Importação do contexto de jogo para gerenciar XP, conquistas, exames e dados do ranking local
import { useGame } from '../context/GameContext';

// Importação de componentes reutilizáveis baseados em glassmorphism translúcido e cartões neon
import GlassCard from '../components/GlassCard';  // Bloco de visual premium cyberpunk com desfoque e bordas brilhantes
import StatCard from '../components/StatCard';    // Exibe métricas chave (como XP, scans) com gradiente interno
import BadgeCard from '../components/BadgeCard';  // Componente que renderiza medalhas desbloqueáveis ou trancadas
import Header from '../components/Header';        // Cabeçalho padronizado da navegação superior

/**
 * Componente funcional do Perfil do Agente (ProfileScreen).
 * Renderiza informações do usuário logado, permite edição do nome de exibição,
 * exibe idade e localização configurados localmente, apresenta contadores de XP, 
 * conquistas trancadas/destrancadas e renderiza a ladder de classificação global do leaderboard.
 */
export default function ProfileScreen({ navigation }) {
  // Acesso às funções e dados expostos pelo provedor de autenticação (AuthContext)
  const { 
    user,               // Dados cadastrais do agente autenticado (objeto do Firebase Auth)
    logoutUser,         // Função responsável por deslogar e limpar a sessão ativa do usuário
    updateDisplayName   // Função responsável por sincronizar o novo nome no perfil do Firebase
  } = useAuth();

  // Acesso às estatísticas de jogo e conquistas do provedor global de jogo (GameContext)
  const { 
    points,               // Total de pontos de experiência (XP) acumulados pelo jogador
    completedTrainings,   // Array de IDs dos treinamentos finalizados pelo agente
    achievements,         // Lista de IDs contendo todas as medalhas e medalhões conquistados
    scannerHistory,       // Histórico de análises feitas no verificador de links
    getCurrentLevel,      // Retorna o título, nível e emoji do usuário baseando-se no XP atual
    ACHIEVEMENTS,         // Banco de dados estático contendo todas as medalhas cadastradas no sistema
    examScores,           // Recordes de acertos para os exames Fácil, Médio e Difícil
    unlockedExamLevel,    // Progresso hierárquico nos exames ('facil', 'medio' ou 'dificil')
    leaderboard,          // Array de jogadores do ranking global fictício + o usuário ativo
    fetchLeaderboard,     // Dispara a requisição para organizar e classificar o ranking de pontuação
    age,                  // Idade cadastrada localmente do usuário ativo
    location,             // Cidade/País do usuário cadastrados localmente
    updateUserMetadata    // Função para salvar a idade e localização de forma persistente
  } = useGame();
  
  // --- Estados de Edição do Nome de Exibição (Firebase) ---
  // isEditing rastreia se o TextInput de edição do nome de exibição está visível na tela
  const [isEditing, setIsEditing] = useState(false);
  // tempName serve para armazenar o valor que o usuário digita antes de confirmar a modificação
  const [tempName, setTempName] = useState('');

  // --- Estados de Edição dos Registros de Identidade (Metadados Locais) ---
  // isEditingMetadata rastreia o estado de edição da Idade e Localização na interface
  const [isEditingMetadata, setIsEditingMetadata] = useState(false);
  // tempAge armazena a idade editada temporariamente no campo TextInput correspondente
  const [tempAge, setTempAge] = useState('');
  // tempLocation armazena a localização editada temporariamente no campo TextInput correspondente
  const [tempLocation, setTempLocation] = useState('');

  // Sincroniza o valor inicial do nome de exibição cadastrado assim que o componente monta
  useEffect(() => {
    if (user?.displayName) {
      setTempName(user.displayName);
    }
  }, [user?.displayName]);

  // Sincroniza a idade e localização salvas nos metadados globais assim que são alteradas no contexto
  useEffect(() => {
    setTempAge(age ? String(age) : '');
    setTempLocation(location || '');
  }, [age, location]);

  /**
   * Salva os metadados digitados de Idade e Localização no AsyncStorage.
   * Conclui limpando o modo de edição na interface.
   */
  const handleSaveMetadata = async () => {
    await updateUserMetadata(
      tempAge.trim() ? tempAge.trim() : null, 
      tempLocation.trim() ? tempLocation.trim() : null
    );
    setIsEditingMetadata(false);
  };

  // Dispara o download/carregamento da lista de líderes (leaderboard) na inicialização da tela
  useEffect(() => {
    fetchLeaderboard();
  }, []);

  /**
   * Envia a alteração do nome de exibição do Firebase de forma assíncrona.
   * Só dispara caso o campo não esteja inteiramente vazio.
   */
  const handleSaveName = async () => {
    if (tempName.trim()) {
      await updateDisplayName(tempName.trim());
      setIsEditing(false);
    }
  };

  // Computa a classificação do nível cibernético (ex: Recruta, Defensor, Oráculo) e seu emoji correspondente
  const currentLevel = getCurrentLevel();

  // Encontra qual é a posição numérica do usuário ativo na lista ordenada de pontuação global
  const userRankInLeaderboard = leaderboard.findIndex(p => p.name === (user?.displayName || 'Você'));
  // Define o índice ordinal de classificação: #1, #2, etc. (se não achar na lista de elite, assume última posição + 1)
  const userRankNum = userRankInLeaderboard !== -1 ? userRankInLeaderboard + 1 : leaderboard.length + 1;
  // Define se o card do jogador deve ser exibido como um container flutuante no rodapé do ranking
  const showCurrentPlayerAtBottom = userRankInLeaderboard === -1;

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[theme.colors.background, '#0A0E22']}
        style={styles.container}
      >
        <Header 
          title="PERFIL DO AGENTE" 
          subtitle="SISTEMA DE CREDENCIAIS" 
          navigation={navigation} 
          showAvatar={false} 
        />
        
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* User Basic Info Card */}
          <GlassCard style={styles.userCard} borderType="neonPrimary">
            <View style={styles.userRow}>
              <View style={styles.avatarContainer}>
                {user?.photoURL ? (
                  <Image source={{ uri: user.photoURL }} style={styles.avatarImage} />
                ) : (
                  <Text style={styles.avatarEmoji}>{currentLevel.badge}</Text>
                )}
              </View>
              <View style={styles.userInfo}>
                {isEditing ? (
                  <View style={styles.editRow}>
                    <TextInput
                      style={styles.editInput}
                      value={tempName}
                      onChangeText={setTempName}
                      autoFocus
                      maxLength={25}
                      placeholderTextColor={theme.colors.textMuted}
                    />
                    <TouchableOpacity onPress={handleSaveName} style={styles.saveBtn}>
                      <Text style={styles.saveBtnText}>✓</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.cancelBtn}>
                      <Text style={styles.cancelBtnText}>✗</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.nameRow}>
                    <Text style={styles.userName}>{user?.displayName || 'Recruta Cibernético'}</Text>
                    <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editIconBtn}>
                      <Text style={styles.editIcon}>✏️</Text>
                    </TouchableOpacity>
                  </View>
                )}
                <Text style={styles.userSub}>{user?.email || 'MODO LOCAL ENCRIPTADO'}</Text>
                <View style={styles.badgeLabel}>
                  <Text style={styles.badgeText}>{currentLevel.title}</Text>
                </View>
              </View>
            </View>
          </GlassCard>

          {/* Metadata Card: Age & Location */}
          <GlassCard style={styles.metadataCard} borderType="neonSecondary">
            <View style={styles.metadataHeader}>
              <Text style={styles.metadataTitle}>REGISTRO DE IDENTIDADE</Text>
              <TouchableOpacity 
                onPress={() => {
                  if (isEditingMetadata) {
                    handleSaveMetadata();
                  } else {
                    setIsEditingMetadata(true);
                  }
                }}
                style={styles.metadataEditBtn}
              >
                <Text style={styles.metadataEditBtnText}>
                  {isEditingMetadata ? '✓ SALVAR' : '✏️ EDITAR'}
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.metadataRow}>
              <Text style={styles.metadataLabel}>IDADE:</Text>
              {isEditingMetadata ? (
                <TextInput
                  style={styles.metadataInput}
                  value={tempAge}
                  onChangeText={setTempAge}
                  placeholder="Ex: 25 anos"
                  placeholderTextColor={theme.colors.textMuted}
                  maxLength={10}
                />
              ) : (
                <Text style={styles.metadataValue}>{age || 'Não configurada'}</Text>
              )}
            </View>

            <View style={styles.metadataRow}>
              <Text style={styles.metadataLabel}>LOCALIZAÇÃO:</Text>
              {isEditingMetadata ? (
                <TextInput
                  style={styles.metadataInput}
                  value={tempLocation}
                  onChangeText={setTempLocation}
                  placeholder="Ex: São Paulo, BR"
                  placeholderTextColor={theme.colors.textMuted}
                  maxLength={30}
                />
              ) : (
                <Text style={styles.metadataValue}>{location || 'Não configurada'}</Text>
              )}
            </View>
          </GlassCard>

          {/* Stats grid */}
          <Text style={styles.sectionTitle}>MÉTRICAS DO SISTEMA</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statsRow}>
              <StatCard 
                label="PONTOS XP" 
                value={points} 
                icon="⚡" 
                color={theme.colors.primary} 
              />
              <StatCard 
                label="CONQUISTAS" 
                value={`${achievements.length}/${ACHIEVEMENTS.length}`} 
                icon="⭐" 
                color={theme.colors.secondary} 
              />
            </View>
            <View style={styles.statsRow}>
              <StatCard 
                label="DESAFIOS" 
                value={completedTrainings.length} 
                icon="🎯" 
                color={theme.colors.accent} 
              />
              <StatCard 
                label="SCANS FEITOS" 
                value={scannerHistory.length} 
                icon="📡" 
                color={theme.colors.warning} 
              />
            </View>
          </View>

          {/* Exames de Cibersegurança Info */}
          <Text style={styles.sectionTitle}>CERTIFICAÇÕES DE CIBERSEGURANÇA</Text>
          
          <GlassCard style={styles.examesCard} borderType="neonSecondary">
            <View style={styles.exameStatusRow}>
              <View style={styles.exameStatusCol}>
                <Text style={styles.exameStatusLabel}>EXAME FÁCIL</Text>
                <Text style={[
                  styles.exameStatusValue,
                  { color: examScores.facil !== null ? theme.colors.accent : theme.colors.textMuted }
                ]}>
                  {examScores.facil !== null ? `Aprovado (${examScores.facil}/15)` : 'Pendente 🔒'}
                </Text>
              </View>
              
              <View style={styles.exameStatusCol}>
                <Text style={styles.exameStatusLabel}>EXAME MÉDIO</Text>
                <Text style={[
                  styles.exameStatusValue,
                  { color: examScores.medio !== null ? theme.colors.accent : theme.colors.textMuted }
                ]}>
                  {examScores.medio !== null ? `Aprovado (${examScores.medio}/20)` : 
                   unlockedExamLevel === 'facil' ? 'Bloqueado 🔒' : 'Pendente 🔒'}
                </Text>
              </View>

              <View style={styles.exameStatusCol}>
                <Text style={styles.exameStatusLabel}>EXAME DIFÍCIL</Text>
                <Text style={[
                  styles.exameStatusValue,
                  { color: examScores.dificil !== null ? theme.colors.accent : theme.colors.textMuted }
                ]}>
                  {examScores.dificil !== null ? `Aprovado (${examScores.dificil}/15)` : 
                   unlockedExamLevel !== 'dificil' ? 'Bloqueado 🔒' : 'Pendente 🔒'}
                </Text>
              </View>
            </View>
          </GlassCard>

          {/* Achievements list */}
          <Text style={styles.sectionTitle}>MEDALHAS E CONQUISTAS</Text>
          
          <View style={styles.achievementsBox}>
            {ACHIEVEMENTS.map((item) => {
              const isUnlocked = achievements.includes(item.id);
              return (
                <BadgeCard
                  key={item.id}
                  badge={item.badge}
                  title={item.title}
                  description={item.description}
                  isUnlocked={isUnlocked}
                />
              );
            })}
          </View>

          {/* Simulated Ranking Ladder */}
          <Text style={styles.sectionTitle}>LADDER RANK GLOBAL</Text>
          
          <GlassCard style={styles.rankCard}>
            {leaderboard.map((p, idx) => {
              const isCurrentUser = p.name === (user?.displayName || 'Você');
              return (
                <View 
                  key={idx} 
                  style={[
                    styles.rankRow, 
                    idx < leaderboard.length - 1 && styles.rankRowBorder,
                    isCurrentUser && styles.currentPlayerRankRow
                  ]}
                >
                  <View style={styles.rankLeft}>
                    <Text style={[
                      styles.rankNum, 
                      p.rank <= 3 && styles.topRank,
                      isCurrentUser && { color: theme.colors.primary }
                    ]}>
                      #{p.rank}
                    </Text>
                    <View>
                      <Text style={[
                        styles.rankName, 
                        isCurrentUser && { color: theme.colors.primary, fontWeight: 'bold' }
                      ]}>
                        {p.name}
                      </Text>
                      <Text style={styles.rankLevel}>{p.level}</Text>
                    </View>
                  </View>
                  <Text style={[
                    styles.rankXP,
                    isCurrentUser && { color: theme.colors.primary, fontWeight: 'bold' }
                  ]}>
                    {p.points} XP
                  </Text>
                </View>
              );
            })}

            {/* Conditionally show current player at the bottom if not in top list */}
            {showCurrentPlayerAtBottom && (
              <View style={[styles.rankRow, styles.currentPlayerRankRow]}>
                <View style={styles.rankLeft}>
                  <Text style={[styles.rankNum, { color: theme.colors.primary }]}>#{userRankNum}</Text>
                  <View>
                    <Text style={[styles.rankName, { color: theme.colors.primary, fontWeight: 'bold' }]}>
                      {user?.displayName || 'Você'}
                    </Text>
                    <Text style={styles.rankLevel}>{currentLevel.title} {currentLevel.badge}</Text>
                  </View>
                </View>
                <Text style={[styles.rankXP, { color: theme.colors.primary, fontWeight: 'bold' }]}>{points} XP</Text>
              </View>
            )}
          </GlassCard>

          {/* Action buttons */}
          <TouchableOpacity onPress={logoutUser} style={styles.logoutBtn}>
            <Text style={styles.logoutBtnText}>REINICIAR SISTEMA (LOGOUT)</Text>
          </TouchableOpacity>

        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    marginVertical: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  headerSubtitle: {
    fontSize: 10,
    color: theme.colors.textMuted,
    letterSpacing: 1.5,
    marginTop: 2,
  },
  userCard: {
    width: '100%',
    marginBottom: theme.spacing.lg,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0, 240, 255, 0.1)',
    borderWidth: 2,
    borderColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.lg,
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarEmoji: {
    fontSize: 34,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: theme.roundness.sm,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 10,
  },
  editInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    paddingVertical: 4,
  },
  saveBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(0,255,100,0.1)',
    borderRadius: theme.roundness.sm,
    borderWidth: 1,
    borderColor: '#00FF64',
    marginHorizontal: 4,
  },
  saveBtnText: {
    color: '#00FF64',
    fontWeight: 'bold',
    fontSize: 12,
  },
  cancelBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(255,0,85,0.1)',
    borderRadius: theme.roundness.sm,
    borderWidth: 1,
    borderColor: '#FF0055',
  },
  cancelBtnText: {
    color: '#FF0055',
    fontWeight: 'bold',
    fontSize: 12,
  },
  editIconBtn: {
    padding: 6,
    marginLeft: 6,
  },
  editIcon: {
    fontSize: 14,
    opacity: 0.8,
  },
  userSub: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
    marginBottom: 6,
  },
  badgeLabel: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 240, 255, 0.1)',
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: theme.roundness.sm,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  badgeText: {
    color: theme.colors.primary,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    alignSelf: 'flex-start',
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  statsGrid: {
    width: '100%',
    marginBottom: theme.spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  examesCard: {
    width: '100%',
    marginBottom: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  exameStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  exameStatusCol: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  exameStatusLabel: {
    color: theme.colors.textSecondary,
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  exameStatusValue: {
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  achievementsBox: {
    width: '100%',
    marginBottom: theme.spacing.md,
  },
  rankCard: {
    width: '100%',
    marginBottom: theme.spacing.xl,
  },
  rankRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  rankRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  currentPlayerRankRow: {
    marginTop: theme.spacing.sm,
    borderTopWidth: 1.5,
    borderTopColor: 'rgba(0, 240, 255, 0.2)',
    paddingTop: theme.spacing.md,
  },
  rankLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankNum: {
    fontSize: 16,
    fontWeight: '900',
    color: theme.colors.textSecondary,
    width: 36,
  },
  topRank: {
    color: theme.colors.warning,
  },
  rankName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  rankLevel: {
    color: theme.colors.textSecondary,
    fontSize: 10,
    marginTop: 2,
  },
  rankXP: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.textSecondary,
  },
  metadataCard: {
    width: '100%',
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.md,
  },
  metadataHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    paddingBottom: 6,
  },
  metadataTitle: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1.2,
  },
  metadataEditBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(0, 240, 255, 0.1)',
    borderRadius: theme.roundness.sm,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  metadataEditBtnText: {
    color: theme.colors.primary,
    fontSize: 9,
    fontWeight: 'bold',
  },
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  metadataLabel: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    fontWeight: 'bold',
    width: 100,
  },
  metadataValue: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  metadataInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 13,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: theme.roundness.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  logoutBtn: {
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 0, 85, 0.3)',
    borderRadius: theme.roundness.md,
    backgroundColor: 'rgba(255, 0, 85, 0.04)',
    marginBottom: theme.spacing.xxl,
  },
  logoutBtnText: {
    color: theme.colors.danger,
    fontWeight: 'bold',
    fontSize: 12,
    letterSpacing: 1,
  }
});

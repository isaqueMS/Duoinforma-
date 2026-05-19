import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../styles/theme';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import GlassCard from '../components/GlassCard';
import ProgressBar from '../components/ProgressBar';
import Header from '../components/Header';

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const { points, streak, getCurrentLevel, getNextLevelProgress, unlockedExamLevel } = useGame();
  
  const currentLevel = getCurrentLevel();
  const progressData = getNextLevelProgress();

  const handleNavigate = (tabName) => {
    navigation.navigate(tabName);
  };

  const handleNavigateToScreen = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[theme.colors.background, '#0A0F24']}
        style={styles.container}
      >
        <Header 
          title="DUOINFORMA" 
          subtitle="SISTEMA DE DEFESA COGNITIVA" 
          navigation={navigation} 
          showAvatar={true} 
        />
        
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Level Progress Dashboard */}
          <GlassCard style={styles.dashboardCard} borderType="neonPrimary">
            <View style={styles.dashboardHeader}>
              <View>
                <Text style={styles.levelLabel}>NÍVEL DO AGENTE</Text>
                <Text style={styles.levelName}>{currentLevel.title}</Text>
              </View>
              <View style={styles.streakBadge}>
                <Text style={styles.streakText}>🔥 {streak} DIAS</Text>
              </View>
            </View>

            <ProgressBar 
              progress={progressData.percentage} 
              label="PROGRESSÃO DE PONTOS" 
              valueText={`${points} XP`}
              color={theme.colors.primary}
            />
            
            <View style={styles.xpInfoRow}>
              <Text style={styles.xpInfoText}>Nível atual: {progressData.currentMin} XP</Text>
              <Text style={styles.xpInfoText}>Próximo nível: {progressData.nextMin} XP</Text>
            </View>
          </GlassCard>

          {/* Menu / Game Mode Grid Title */}
          <Text style={styles.sectionTitle}>MÓDULOS OPERACIONAIS</Text>

          {/* Grid of Main Modes */}
          <View style={styles.modesContainer}>
            
            {/* Mode 1: Training */}
            <TouchableOpacity 
              onPress={() => handleNavigate('Treinamento')} 
              style={styles.modeCardWrapper}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['rgba(0, 240, 255, 0.1)', 'rgba(0, 240, 255, 0.02)']}
                style={[styles.modeCard, { borderColor: theme.colors.primary }]}
              >
                <Text style={styles.modeIcon}>🎯</Text>
                <Text style={styles.modeTitle}>TREINAMENTO</Text>
                <Text style={styles.modeDesc}>Analise simulações de posts e fake news em tempo real.</Text>
                <View style={[styles.actionIndicator, { backgroundColor: theme.colors.primary }]}>
                  <Text style={styles.actionText}>TREINAR</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* Mode 2: Verification */}
            <TouchableOpacity 
              onPress={() => handleNavigate('Verificação')} 
              style={styles.modeCardWrapper}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['rgba(189, 0, 255, 0.1)', 'rgba(189, 0, 255, 0.02)']}
                style={[styles.modeCard, { borderColor: theme.colors.secondary }]}
              >
                <Text style={styles.modeIcon}>🔍</Text>
                <Text style={styles.modeTitle}>SCANNER DIGITAL</Text>
                <Text style={styles.modeDesc}>Cole links ou textos suspeitos para análise inteligente.</Text>
                <View style={[styles.actionIndicator, { backgroundColor: theme.colors.secondary }]}>
                  <Text style={styles.actionText}>ESCANEAR</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

          </View>

          {/* Mode 4: Exam Simulator (Full-width custom purple/neon banner) */}
          <TouchableOpacity 
            onPress={() => handleNavigateToScreen('Exame')} 
            style={styles.examBannerWrapper}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#1F1135', '#0E081F']}
              style={[styles.examBanner, { borderColor: theme.colors.secondary }]}
            >
              <View style={styles.examInfo}>
                <View style={styles.examBadge}>
                  <Text style={styles.examBadgeText}>SIMULADOR DE EXAME</Text>
                </View>
                <Text style={styles.examTitle}>Avaliação de Credenciais</Text>
                <Text style={styles.examDesc}>
                  Exames progressivos do Fácil ao Difícil. Obtenha mais de 70% de acertos para avançar.
                </Text>
                <View style={styles.examProgressRow}>
                  <Text style={styles.examProgressText}>
                    Status: <Text style={{ color: theme.colors.secondary, fontWeight: 'bold' }}>
                      {unlockedExamLevel === 'facil' ? 'Nível Fácil Liberado' :
                       unlockedExamLevel === 'medio' ? 'Nível Médio Liberado' :
                       'Nível Difícil Liberado 🛡️'}
                    </Text>
                  </Text>
                </View>
              </View>
              <View style={styles.examIconContainer}>
                <Text style={styles.examLargeIcon}>🔑</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Mode 3: Learning (Full-width custom button banner) */}
          <TouchableOpacity 
            onPress={() => handleNavigateToScreen('Aprendizado')} 
            style={styles.learningBannerWrapper}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#181F38', '#0E1326']}
              style={styles.learningBanner}
            >
              <View style={styles.learningInfo}>
                <View style={styles.newBadge}>
                  <Text style={styles.newBadgeText}>MÓDULO DE CURSO</Text>
                </View>
                <Text style={styles.learningTitle}>Enciclopédia de Defesa</Text>
                <Text style={styles.learningDesc}>
                  Aprenda as técnicas mais famosas de desinformação, vieses cognitivos e dicas de verificação rápida.
                </Text>
              </View>
              <View style={styles.learningIconContainer}>
                <Text style={styles.learningLargeIcon}>📚</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Critical Tip Card */}
          <GlassCard style={styles.tipCard} borderType="accent">
            <View style={styles.tipHeader}>
              <Text style={styles.tipTitle}>💡 DIRETRIZ ANTI-DESINFORMAÇÃO</Text>
            </View>
            <Text style={styles.tipBody}>
              "Sempre verifique a URL de portais de notícias. Portais falsos costumam imitar grandes sites de notícias mudando apenas uma letra na URL (ex: g1-noticia.com em vez de g1.globo.com)."
            </Text>
          </GlassCard>

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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
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
  avatarButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarBorder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarEmoji: {
    fontSize: 22,
  },
  dashboardCard: {
    marginBottom: theme.spacing.lg,
  },
  dashboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  levelLabel: {
    color: theme.colors.textMuted,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  levelName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  streakBadge: {
    backgroundColor: 'rgba(255, 184, 0, 0.1)',
    borderWidth: 1,
    borderColor: theme.colors.warning,
    borderRadius: theme.roundness.full,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  streakText: {
    color: theme.colors.warning,
    fontSize: 12,
    fontWeight: 'bold',
  },
  xpInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  xpInfoText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginBottom: theme.spacing.md,
  },
  modesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  modeCardWrapper: {
    width: '48%',
  },
  modeCard: {
    borderRadius: theme.roundness.lg,
    borderWidth: 1.5,
    padding: theme.spacing.md,
    height: 180,
    justifyContent: 'space-between',
  },
  modeIcon: {
    fontSize: 28,
  },
  modeTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  modeDesc: {
    color: theme.colors.textSecondary,
    fontSize: 10,
    lineHeight: 14,
  },
  actionIndicator: {
    borderRadius: theme.roundness.sm,
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.sm,
  },
  actionText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: 'bold',
  },
  examBannerWrapper: {
    width: '100%',
    marginBottom: theme.spacing.lg,
  },
  examBanner: {
    borderRadius: theme.roundness.lg,
    padding: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
  },
  examInfo: {
    flex: 1,
    paddingRight: theme.spacing.md,
  },
  examBadge: {
    backgroundColor: 'rgba(189, 0, 255, 0.1)',
    borderColor: theme.colors.secondary,
    borderWidth: 1,
    borderRadius: theme.roundness.sm,
    paddingVertical: 2,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  examBadgeText: {
    color: theme.colors.secondary,
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  examTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  examDesc: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    lineHeight: 15,
    marginTop: 4,
  },
  examProgressRow: {
    marginTop: 8,
  },
  examProgressText: {
    color: theme.colors.textMuted,
    fontSize: 10,
  },
  examIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(189, 0, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  examLargeIcon: {
    fontSize: 32,
  },
  learningBannerWrapper: {
    width: '100%',
    marginBottom: theme.spacing.lg,
  },
  learningBanner: {
    borderRadius: theme.roundness.lg,
    padding: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  learningInfo: {
    flex: 1,
    paddingRight: theme.spacing.md,
  },
  newBadge: {
    backgroundColor: 'rgba(0, 255, 102, 0.1)',
    borderColor: theme.colors.accent,
    borderWidth: 1,
    borderRadius: theme.roundness.sm,
    paddingVertical: 2,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  newBadgeText: {
    color: theme.colors.accent,
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  learningTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  learningDesc: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 4,
  },
  learningIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  learningLargeIcon: {
    fontSize: 32,
  },
  tipCard: {
    marginBottom: theme.spacing.md,
  },
  tipHeader: {
    marginBottom: 6,
  },
  tipTitle: {
    color: theme.colors.accent,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  tipBody: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  }
});

import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../styles/theme';
import { useGame } from '../context/GameContext';
import { trainingData } from '../data/trainingData';
import GlassCard from '../components/GlassCard';
import NeonButton from '../components/NeonButton';
import ProgressBar from '../components/ProgressBar';
import Header from '../components/Header';

export default function TrainingScreen({ navigation }) {
  const { completedTrainings, completeTraining } = useGame();
  
  // Filter out already completed items, or just cycle through all of them
  // We want to allow training even if completed, but user only gets points once!
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null); // 'real' or 'fake'
  const [showFeedback, setShowFeedback] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));

  const currentItem = trainingData[currentIndex];
  const isCompletedAlready = completedTrainings.includes(currentItem.id);

  const handleAnswer = (answer) => {
    if (showFeedback) return;
    
    setSelectedAnswer(answer);
    setShowFeedback(true);

    const isCorrect = (answer === 'real' && currentItem.isReal) || (answer === 'fake' && !currentItem.isReal);
    
    // Earn 50 XP if correct and not already completed
    completeTraining(currentItem.id, isCorrect, 50);
  };

  const handleNext = () => {
    // Fade transition to next card
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true
    }).start(() => {
      setSelectedAnswer(null);
      setShowFeedback(false);
      setCurrentIndex((prev) => (prev + 1) % trainingData.length);
      
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true
      }).start();
    });
  };

  const isCorrectAnswer = selectedAnswer && (
    (selectedAnswer === 'real' && currentItem.isReal) || 
    (selectedAnswer === 'fake' && !currentItem.isReal)
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[theme.colors.background, '#090D1E']}
        style={styles.container}
      >
        <Header 
          title="TREINAMENTO" 
          subtitle="SIMULADOR DE DESINFORMAÇÃO" 
          navigation={navigation} 
          showAvatar={true} 
        />
        
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Progress indicators */}
          <View style={styles.progContainer}>
            <ProgressBar 
              progress={(currentIndex + 1) / trainingData.length} 
              label={`DESAFIO ${currentIndex + 1} DE ${trainingData.length}`}
              valueText={`${currentIndex + 1}/${trainingData.length}`}
            />
          </View>

          <Animated.View style={{ opacity: fadeAnim, width: '100%' }}>
            
            {/* The Cyber Post Card */}
            <GlassCard 
              style={styles.postCard} 
              borderType={showFeedback ? (currentItem.isReal ? 'accent' : 'danger') : 'primary'}
            >
              {/* Category / Source Badge */}
              <View style={styles.badgeRow}>
                <View style={styles.sourceBadge}>
                  <Text style={styles.sourceText}>{currentItem.title}</Text>
                </View>
                {isCompletedAlready && (
                  <View style={styles.completedBadge}>
                    <Text style={styles.completedText}>ANALISADO ✓</Text>
                  </View>
                )}
              </View>

              {/* Author Info */}
              <View style={styles.authorRow}>
                <View style={styles.authorAvatar}>
                  <Text style={styles.avatarLabel}>{currentItem.author.charAt(0).toUpperCase()}</Text>
                </View>
                <View>
                  <Text style={styles.authorName}>@{currentItem.author}</Text>
                  <Text style={styles.timestamp}>{currentItem.timestamp}</Text>
                </View>
              </View>

              {/* Post Content */}
              <Text style={styles.contentBody}>{currentItem.content}</Text>

              {/* Post Stats (Social Card mockup decoration) */}
              <View style={styles.socialStats}>
                <Text style={styles.socialStatText}>❤️ {currentItem.likes || '2.5K'}</Text>
                <Text style={styles.socialStatText}>🔁 {currentItem.shares || '1.1K'}</Text>
                <Text style={styles.socialStatText}>💬 421 Comentários</Text>
              </View>
            </GlassCard>

            {/* Answer buttons or Feedback details */}
            {!showFeedback ? (
              <View style={styles.choiceContainer}>
                
                <TouchableOpacity 
                  onPress={() => handleAnswer('real')}
                  style={[styles.choiceBtn, styles.realBtn]}
                  activeOpacity={0.8}
                >
                  <Text style={styles.choiceIcon}>🛡️</Text>
                  <Text style={styles.choiceLabel}>CONFIÁVEL</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={() => handleAnswer('fake')}
                  style={[styles.choiceBtn, styles.fakeBtn]}
                  activeOpacity={0.8}
                >
                  <Text style={styles.choiceIcon}>⚠️</Text>
                  <Text style={styles.choiceLabel}>SUSPEITO</Text>
                </TouchableOpacity>

              </View>
            ) : (
              <View style={styles.feedbackContainer}>
                
                {/* Result banner */}
                <GlassCard 
                  style={[
                    styles.resultBanner, 
                    { borderColor: isCorrectAnswer ? theme.colors.accent : theme.colors.danger }
                  ]}
                  intensity={60}
                >
                  <Text style={[
                    styles.resultTitle, 
                    { color: isCorrectAnswer ? theme.colors.accent : theme.colors.danger }
                  ]}>
                    {isCorrectAnswer ? '✓ ANÁLISE CORRETA (+50 XP)' : '❌ ANÁLISE INCORRETA'}
                  </Text>
                  
                  <Text style={styles.resultLabel}>
                    Este post é originalmente classificado como: <Text style={{fontWeight: 'bold', color: currentItem.isReal ? theme.colors.accent : theme.colors.danger}}>{currentItem.isReal ? 'VERDADEIRO' : 'FALSO'}</Text>
                  </Text>
                </GlassCard>

                {/* Explanation text card */}
                <GlassCard style={styles.explanationCard} borderType="primary">
                  <Text style={styles.explTitle}>ANÁLISE DOS VETORES:</Text>
                  <Text style={styles.explBody}>{currentItem.explanation}</Text>

                  <Text style={styles.tipsTitle}>DICAS DO SCANNER:</Text>
                  {currentItem.tips.map((tip, idx) => (
                    <Text key={idx} style={styles.tipItem}>🔹 {tip}</Text>
                  ))}
                </GlassCard>

                <NeonButton 
                  title="PRÓXIMO DESAFIO" 
                  onPress={handleNext}
                  variant="primary"
                  style={styles.nextBtn}
                />

              </View>
            )}

          </Animated.View>

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
    marginBottom: theme.spacing.md,
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
  progContainer: {
    width: '100%',
    marginBottom: theme.spacing.md,
  },
  postCard: {
    width: '100%',
    marginBottom: theme.spacing.lg,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sourceBadge: {
    backgroundColor: theme.colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: theme.roundness.sm,
  },
  sourceText: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    fontWeight: 'bold',
  },
  completedBadge: {
    backgroundColor: 'rgba(0, 255, 102, 0.1)',
    borderWidth: 1,
    borderColor: theme.colors.accent,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: theme.roundness.sm,
  },
  completedText: {
    color: theme.colors.accent,
    fontSize: 9,
    fontWeight: 'bold',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  avatarLabel: {
    color: theme.colors.primary,
    fontWeight: 'bold',
    fontSize: 18,
  },
  authorName: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  timestamp: {
    color: theme.colors.textMuted,
    fontSize: 11,
  },
  contentBody: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: theme.spacing.lg,
  },
  socialStats: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    paddingTop: theme.spacing.md,
  },
  socialStatText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    marginRight: theme.spacing.md,
  },
  choiceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: theme.spacing.xl,
  },
  choiceBtn: {
    flex: 1,
    borderRadius: theme.roundness.md,
    borderWidth: 1.5,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
    elevation: 3,
  },
  realBtn: {
    backgroundColor: 'rgba(0, 255, 102, 0.05)',
    borderColor: theme.colors.accent,
    shadowColor: theme.colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  fakeBtn: {
    backgroundColor: 'rgba(255, 0, 85, 0.05)',
    borderColor: theme.colors.danger,
    shadowColor: theme.colors.danger,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  choiceIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  choiceLabel: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 1,
  },
  feedbackContainer: {
    width: '100%',
  },
  resultBanner: {
    width: '100%',
    marginBottom: theme.spacing.md,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 4,
  },
  resultLabel: {
    color: '#FFFFFF',
    fontSize: 13,
  },
  explanationCard: {
    width: '100%',
    marginBottom: theme.spacing.lg,
  },
  explTitle: {
    color: theme.colors.primary,
    fontWeight: 'bold',
    fontSize: 13,
    letterSpacing: 1,
    marginBottom: theme.spacing.xs,
  },
  explBody: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  tipsTitle: {
    color: theme.colors.secondary,
    fontWeight: 'bold',
    fontSize: 13,
    letterSpacing: 1,
    marginBottom: theme.spacing.xs,
  },
  tipItem: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 4,
  },
  nextBtn: {
    width: '100%',
    marginBottom: theme.spacing.xl,
  }
});

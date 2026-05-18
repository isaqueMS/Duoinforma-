import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../styles/theme';
import { useGame } from '../context/GameContext';
import { EXAM_QUESTIONS } from '../data/examQuestions';
import GlassCard from '../components/GlassCard';
import NeonButton from '../components/NeonButton';
import ProgressBar from '../components/ProgressBar';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function ExamScreen({ navigation }) {
  const { unlockedExamLevel, examScores, completeExamLevel, points } = useGame();

  // Navigation and active states
  const [activeStep, setActiveStep] = useState('menu'); // 'menu' | 'quiz' | 'analyzing' | 'report'
  const [selectedDifficulty, setSelectedDifficulty] = useState(null); // 'facil' | 'medio' | 'dificil'
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Selection and verification states
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [isAnswerConfirmed, setIsAnswerConfirmed] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  
  // Report results state
  const [examResult, setExamResult] = useState(null);

  // Load questions based on difficulty
  const startExam = (difficulty) => {
    // Check lock status first
    if (difficulty === 'medio' && unlockedExamLevel === 'facil') return;
    if (difficulty === 'dificil' && unlockedExamLevel !== 'dificil') return;

    const filtered = EXAM_QUESTIONS.filter(q => q.difficulty === difficulty);
    // Shuffle questions slightly or just use them direct
    setCurrentQuestions(filtered);
    setSelectedDifficulty(difficulty);
    setCurrentQuestionIndex(0);
    setCorrectAnswersCount(0);
    setSelectedOptionIndex(null);
    setIsAnswerConfirmed(false);
    setActiveStep('quiz');
  };

  const handleSelectOption = (idx) => {
    if (isAnswerConfirmed) return;
    setSelectedOptionIndex(idx);
  };

  const handleConfirmAnswer = () => {
    if (selectedOptionIndex === null) return;
    
    const currentQuestion = currentQuestions[currentQuestionIndex];
    const isCorrect = selectedOptionIndex === currentQuestion.correctIndex;
    
    if (isCorrect) {
      setCorrectAnswersCount(prev => prev + 1);
    }
    
    setIsAnswerConfirmed(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOptionIndex(null);
      setIsAnswerConfirmed(false);
    } else {
      // Finished all questions! Trigger analysis
      setActiveStep('analyzing');
    }
  };

  // Run the evaluation when entering 'analyzing' step
  useEffect(() => {
    if (activeStep !== 'analyzing') return;

    const runAnalysis = async () => {
      // Simulate 2 seconds of futuristic scanning analysis
      setTimeout(async () => {
        const result = await completeExamLevel(selectedDifficulty, correctAnswersCount);
        setExamResult(result);
        setActiveStep('report');
      }, 2000);
    };

    runAnalysis();
  }, [activeStep]);

  // Render difficulty cards
  const renderDifficultyCard = (levelKey, title, questionsCount, xpReward, desc, iconColor, statusText) => {
    const isLocked = (levelKey === 'medio' && unlockedExamLevel === 'facil') ||
                     (levelKey === 'dificil' && unlockedExamLevel !== 'dificil');
    const score = examScores[levelKey];
    const hasPassed = score !== null && score >= (levelKey === 'facil' ? 11 : levelKey === 'medio' ? 14 : 11);

    let borderType = 'border';
    if (!isLocked) {
      if (levelKey === 'facil') borderType = 'neonPrimary';
      if (levelKey === 'medio') borderType = 'neonSecondary';
      if (levelKey === 'dificil') borderType = 'neonDanger';
    }

    return (
      <GlassCard 
        key={levelKey}
        style={[styles.difficultyCard, isLocked && styles.difficultyCardLocked]}
        borderType={borderType}
      >
        <View style={styles.diffHeader}>
          <View style={styles.diffTitleRow}>
            <Text style={[styles.diffTitle, { color: isLocked ? theme.colors.textMuted : iconColor }]}>
              {title}
            </Text>
            {isLocked ? (
              <Ionicons name="lock-closed" size={16} color={theme.colors.textMuted} />
            ) : hasPassed ? (
              <Ionicons name="checkmark-circle" size={18} color={theme.colors.accent} />
            ) : null}
          </View>
          <Text style={styles.diffReward}>{xpReward}</Text>
        </View>

        <Text style={styles.diffDesc}>{desc}</Text>
        
        <View style={styles.diffFooter}>
          <Text style={styles.diffDetails}>📋 {questionsCount} Questões  |  ⏱️ Sem limite</Text>
          {score !== null && (
            <Text style={styles.diffHighScore}>Recorde: {score}/{questionsCount}</Text>
          )}
        </View>

        <TouchableOpacity
          onPress={() => startExam(levelKey)}
          disabled={isLocked}
          style={[
            styles.diffButton,
            { backgroundColor: isLocked ? 'rgba(255,255,255,0.02)' : 'rgba(0, 240, 255, 0.05)' },
            !isLocked && { borderColor: iconColor, borderWidth: 1 }
          ]}
        >
          <Text style={[
            styles.diffButtonText,
            { color: isLocked ? theme.colors.textMuted : '#FFFFFF' }
          ]}>
            {isLocked ? 'BLOQUEADO' : score !== null ? 'REFAZER EXAME' : 'INICIAR EXAME'}
          </Text>
        </TouchableOpacity>
      </GlassCard>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[theme.colors.background, '#0A0F24']}
        style={styles.container}
      >
        
        {/* ========================================== */}
        {/* STEP 1: DIFFICULTY SELECTION MENU */}
        {/* ========================================== */}
        {activeStep === 'menu' && (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                <Ionicons name="chevron-back" size={24} color={theme.colors.primary} />
                <Text style={styles.backBtnText}>VOLTAR</Text>
              </TouchableOpacity>
              
              <Text style={styles.headerTitle}>CENTRAL DE EXAMES</Text>
              <Text style={styles.headerSubtitle}>SISTEMA DE CERTIFICAÇÃO EM SEGURANÇA</Text>
            </View>

            <GlassCard style={styles.infoBanner} borderType="neonPrimary">
              <Text style={styles.infoBannerTitle}>💡 INSTRUCÕES DE EXAME</Text>
              <Text style={styles.infoBannerText}>
                Os exames avaliam sua resiliência contra ataques de engenharia social, golpes, fake news e deepfakes. 
                Obtenha pelo menos <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>70% de acertos</Text> para conseguir a credencial e desbloquear o próximo nível.
              </Text>
            </GlassCard>

            <Text style={styles.sectionTitle}>NÍVEIS DE CREDENCIAMENTO</Text>

            {renderDifficultyCard(
              'facil',
              'EXAME FÁCIL: INICIADO',
              15,
              '+300 XP Bônus',
              'Conceitos básicos de e-mails suspeitos, links falsos, senhas fortes e cuidados gerais em redes públicas.',
              theme.colors.primary,
              'DESBLOQUEADO'
            )}

            {renderDifficultyCard(
              'medio',
              'EXAME MÉDIO: DEFENSOR DIGITAL',
              20,
              '+500 XP Bônus',
              'Engenharia social sofisticada, ransomware, perigos de QR codes, encurtadores de links e spoofing.',
              theme.colors.secondary,
              unlockedExamLevel === 'facil' ? 'Requer aprovação no Exame Fácil' : 'DESBLOQUEADO'
            )}

            {renderDifficultyCard(
              'dificil',
              'EXAME DIFÍCIL: CIBER-ORÁCULO',
              15,
              '+800 XP Bônus',
              'Ataques avançados direcionados (spear phishing), Man-in-the-Middle, deepfakes baseados em IA e credential stuffing.',
              theme.colors.danger,
              unlockedExamLevel !== 'dificil' ? 'Requer aprovação no Exame Médio' : 'DESBLOQUEADO'
            )}
          </ScrollView>
        )}

        {/* ========================================== */}
        {/* STEP 2: ACTIVE EXAM QUIZ */}
        {/* ========================================== */}
        {activeStep === 'quiz' && currentQuestions.length > 0 && (
          <View style={styles.quizWrapper}>
            {/* Header / Progress Bar */}
            <View style={styles.quizHeader}>
              <View style={styles.progressTextRow}>
                <Text style={styles.questionCounter}>
                  QUESTÃO {currentQuestionIndex + 1} DE {currentQuestions.length}
                </Text>
                <Text style={styles.difficultyTag}>
                  🚀 {selectedDifficulty.toUpperCase()}
                </Text>
              </View>
              <ProgressBar 
                progress={(currentQuestionIndex + 1) / currentQuestions.length} 
                color={
                  selectedDifficulty === 'facil' ? theme.colors.primary :
                  selectedDifficulty === 'medio' ? theme.colors.secondary :
                  theme.colors.danger
                }
              />
            </View>

            <ScrollView contentContainerStyle={styles.quizScroll} showsVerticalScrollIndicator={false}>
              {/* Question Text */}
              <GlassCard style={styles.questionCard} borderType="neonPrimary">
                <Text style={styles.questionText}>
                  {currentQuestions[currentQuestionIndex].question}
                </Text>
              </GlassCard>

              {/* Options */}
              <View style={styles.optionsWrapper}>
                {currentQuestions[currentQuestionIndex].options.map((opt, idx) => {
                  const isSelected = selectedOptionIndex === idx;
                  const isCorrect = idx === currentQuestions[currentQuestionIndex].correctIndex;
                  
                  let optionStyle = styles.optionButton;
                  let borderCol = 'rgba(255, 255, 255, 0.08)';
                  let bgCol = 'rgba(255, 255, 255, 0.02)';
                  let textCol = '#FFFFFF';
                  let iconName = null;
                  let iconColor = '#FFFFFF';

                  if (isAnswerConfirmed) {
                    if (isCorrect) {
                      // Correct option is always green
                      borderCol = theme.colors.accent;
                      bgCol = 'rgba(0, 255, 102, 0.08)';
                      textCol = theme.colors.accent;
                      iconName = 'checkmark-circle';
                      iconColor = theme.colors.accent;
                    } else if (isSelected) {
                      // Selected incorrect option is red
                      borderCol = theme.colors.danger;
                      bgCol = 'rgba(255, 0, 85, 0.08)';
                      textCol = theme.colors.danger;
                      iconName = 'close-circle';
                      iconColor = theme.colors.danger;
                    } else {
                      // Other options are dimmed
                      textCol = theme.colors.textMuted;
                    }
                  } else if (isSelected) {
                    // Option is selected but not confirmed
                    borderCol = selectedDifficulty === 'facil' ? theme.colors.primary :
                                selectedDifficulty === 'medio' ? theme.colors.secondary :
                                theme.colors.danger;
                    bgCol = 'rgba(0, 240, 255, 0.05)';
                    textCol = borderCol;
                  }

                  return (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => handleSelectOption(idx)}
                      disabled={isAnswerConfirmed}
                      style={[
                        optionStyle,
                        { borderColor: borderCol, backgroundColor: bgCol }
                      ]}
                      activeOpacity={0.7}
                    >
                      <View style={styles.optionRow}>
                        <View style={[
                          styles.optionLetterBox, 
                          { 
                            borderColor: borderCol,
                            backgroundColor: isSelected || (isAnswerConfirmed && isCorrect) ? 'rgba(255,255,255,0.05)' : 'transparent'
                          }
                        ]}>
                          <Text style={[styles.optionLetterText, { color: textCol }]}>
                            {String.fromCharCode(65 + idx)}
                          </Text>
                        </View>
                        <Text style={[styles.optionText, { color: textCol }]}>
                          {opt}
                        </Text>
                      </View>
                      {iconName && (
                        <Ionicons name={iconName} size={20} color={iconColor} style={styles.optionFeedbackIcon} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

            {/* Action Bar */}
            <View style={styles.quizFooter}>
              {!isAnswerConfirmed ? (
                <TouchableOpacity
                  onPress={handleConfirmAnswer}
                  disabled={selectedOptionIndex === null}
                  style={[
                    styles.actionBtn,
                    { 
                      backgroundColor: selectedOptionIndex === null ? 'rgba(255, 255, 255, 0.03)' : theme.colors.primary,
                      borderColor: selectedOptionIndex === null ? 'rgba(255, 255, 255, 0.05)' : theme.colors.primary,
                      borderWidth: 1
                    }
                  ]}
                >
                  <Text style={[
                    styles.actionBtnText, 
                    { color: selectedOptionIndex === null ? theme.colors.textMuted : '#000000' }
                  ]}>
                    CONFIRMAR RESPOSTA
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={handleNextQuestion}
                  style={[
                    styles.actionBtn,
                    { 
                      backgroundColor: theme.colors.accent,
                      borderColor: theme.colors.accent,
                      borderWidth: 1
                    }
                  ]}
                >
                  <Text style={[styles.actionBtnText, { color: '#000000' }]}>
                    {currentQuestionIndex === currentQuestions.length - 1 ? 'FINALIZAR AVALIAÇÃO' : 'PRÓXIMA QUESTÃO'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* ========================================== */}
        {/* STEP 3: HOLOGRAPHIC SCANNING / ANALYZING */}
        {/* ========================================== */}
        {activeStep === 'analyzing' && (
          <View style={styles.centeredScreen}>
            <GlassCard style={styles.analyzingCard} borderType="neonPrimary">
              <ActivityIndicator size="large" color={theme.colors.primary} />
              
              <View style={styles.scanGrid}>
                <Text style={styles.scanLabel}>SISTEMA DE CRIPTOGRAFIA ANALÍTICA</Text>
                <Text style={styles.scanValue}>COMPILANDO DADOS DO AGENTE...</Text>
                
                <View style={styles.terminalContainer}>
                  <Text style={styles.terminalText}>$ loading fact_checking_engine.dll...</Text>
                  <Text style={styles.terminalText}>$ verifying cryptographic signatures...</Text>
                  <Text style={styles.terminalText}>$ counting correct responses: {correctAnswersCount}/{currentQuestions.length}</Text>
                  <Text style={styles.terminalText}>$ registering state change in secure vault...</Text>
                </View>
              </View>

              <Text style={styles.analyzingTitle}>PROCESSANDO EXAME</Text>
              <Text style={styles.analyzingSubtitle}>Calculando aproveitamento cognitivo...</Text>
            </GlassCard>
          </View>
        )}

        {/* ========================================== */}
        {/* STEP 4: REPORT CARD / SCORES */}
        {/* ========================================== */}
        {activeStep === 'report' && examResult && (
          <View style={styles.reportWrapper}>
            <ScrollView contentContainerStyle={styles.reportScroll} showsVerticalScrollIndicator={false}>
              
              <View style={styles.reportHeader}>
                <Text style={styles.reportHeaderSub}>RELATÓRIO DE DESEMPENHO</Text>
                <Text style={styles.reportHeaderTitle}>AVALIAÇÃO DE CREDENCIAL</Text>
              </View>

              {/* Large Score Card */}
              <GlassCard 
                style={styles.scoreCard} 
                borderType={examResult.passed ? 'neonAccent' : 'neonDanger'}
              >
                <Text style={[
                  styles.resultStatusText,
                  { color: examResult.passed ? theme.colors.accent : theme.colors.danger }
                ]}>
                  {examResult.passed ? 'APROVADO / CREDENCIADO 🏆' : 'TENTATIVA BLOQUEADA ⚠️'}
                </Text>

                <View style={styles.scoreCircle}>
                  <Text style={[
                    styles.scoreCircleValue,
                    { color: examResult.passed ? theme.colors.accent : theme.colors.danger }
                  ]}>
                    {correctAnswersCount}
                  </Text>
                  <Text style={styles.scoreCircleTotal}>de {currentQuestions.length}</Text>
                </View>

                <Text style={styles.percentageText}>
                  Aproveitamento: {Math.round(examResult.percentage * 100)}%
                </Text>
                
                <Text style={styles.minRequiredText}>
                  (Exigido para aprovação: 70% ou mais)
                </Text>
              </GlassCard>

              {/* Result description */}
              <GlassCard style={styles.feedbackCard}>
                {examResult.passed ? (
                  <View>
                    <Text style={styles.feedbackTitle}>SISTEMA DE DEFESA DESBLOQUEADO!</Text>
                    <Text style={styles.feedbackText}>
                      Parabéns, Agente! Você demonstrou maturidade excepcional no nível{' '}
                      <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                        {selectedDifficulty.toUpperCase()}
                      </Text>{' '}
                      e suas credenciais foram promovidas com sucesso na rede local do Duoinforma.
                    </Text>
                    
                    {examResult.xpBonus > 0 ? (
                      <View style={styles.xpBonusBadge}>
                        <Text style={styles.xpBonusBadgeText}>
                          ⚡ +{examResult.xpBonus} XP DE BÔNUS CREDITADOS!
                        </Text>
                      </View>
                    ) : (
                      <Text style={styles.xpTipText}>
                        Você já obteve o bônus de XP deste exame, mas seu novo score foi registrado.
                      </Text>
                    )}
                  </View>
                ) : (
                  <View>
                    <Text style={[styles.feedbackTitle, { color: theme.colors.danger }]}>
                      INTEGRIDADE COMPROMETIDA!
                    </Text>
                    <Text style={styles.feedbackText}>
                      Infelizmente, seu nível de resiliência está abaixo do limite de segurança (70%). 
                      Você precisa estudar mais a fundo os tópicos do exame. Acesse a{' '}
                      <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                        Enciclopédia de Defesa
                      </Text>{' '}
                      na tela inicial para reforçar seu conhecimento e tente novamente.
                    </Text>
                  </View>
                )}
              </GlassCard>

              {/* Action Buttons */}
              <View style={styles.reportActions}>
                {examResult.passed && selectedDifficulty !== 'dificil' && (
                  <TouchableOpacity
                    onPress={() => {
                      const nextLevel = selectedDifficulty === 'facil' ? 'medio' : 'dificil';
                      startExam(nextLevel);
                    }}
                    style={[styles.reportBtn, { backgroundColor: theme.colors.accent, borderColor: theme.colors.accent }]}
                  >
                    <Text style={[styles.reportBtnText, { color: '#000000' }]}>
                      AVANÇAR PARA PRÓXIMO EXAME
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  onPress={() => startExam(selectedDifficulty)}
                  style={[styles.reportBtn, { borderColor: theme.colors.primary, borderWidth: 1 }]}
                >
                  <Text style={styles.reportBtnText}>REFAZER ESTE EXAME</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setActiveStep('menu')}
                  style={[styles.reportBtn, { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 }]}
                >
                  <Text style={[styles.reportBtnText, { color: '#FFFFFF' }]}>
                    VOLTAR À CENTRAL DE EXAMES
                  </Text>
                </TouchableOpacity>
              </View>

            </ScrollView>
          </View>
        )}

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
    width: '100%',
    marginVertical: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  backBtnText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
    fontSize: 12,
    letterSpacing: 1,
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
  infoBanner: {
    marginBottom: theme.spacing.lg,
  },
  infoBannerTitle: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 4,
  },
  infoBannerText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginBottom: theme.spacing.md,
  },
  difficultyCard: {
    marginBottom: theme.spacing.md,
  },
  difficultyCardLocked: {
    opacity: 0.6,
  },
  diffHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  diffTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  diffTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  diffReward: {
    color: theme.colors.warning,
    fontSize: 11,
    fontWeight: 'bold',
    backgroundColor: 'rgba(255, 184, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.roundness.sm,
    borderWidth: 0.5,
    borderColor: theme.colors.warning,
  },
  diffDesc: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: theme.spacing.md,
  },
  diffFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    paddingTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  diffDetails: {
    fontSize: 10,
    color: theme.colors.textMuted,
  },
  diffHighScore: {
    fontSize: 11,
    fontWeight: 'bold',
    color: theme.colors.accent,
  },
  diffButton: {
    borderRadius: theme.roundness.md,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diffButtonText: {
    fontWeight: 'bold',
    fontSize: 12,
    letterSpacing: 1,
  },
  
  // Quiz screen styles
  quizWrapper: {
    flex: 1,
    padding: theme.spacing.md,
  },
  quizHeader: {
    marginVertical: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  questionCounter: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  difficultyTag: {
    color: theme.colors.textSecondary,
    fontSize: 10,
    fontWeight: 'bold',
  },
  quizScroll: {
    paddingBottom: theme.spacing.xl,
  },
  questionCard: {
    marginBottom: theme.spacing.lg,
  },
  questionText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 'bold',
  },
  optionsWrapper: {
    gap: theme.spacing.sm,
  },
  optionButton: {
    borderWidth: 1.5,
    borderRadius: theme.roundness.md,
    padding: theme.spacing.md,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionLetterBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  optionLetterText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  optionText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    flex: 1,
    paddingRight: 10,
  },
  optionFeedbackIcon: {
    position: 'absolute',
    right: 16,
    top: 18,
  },
  quizFooter: {
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  actionBtn: {
    paddingVertical: 14,
    borderRadius: theme.roundness.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    fontWeight: 'bold',
    fontSize: 12,
    letterSpacing: 1.5,
  },

  // Analyzing screen styles
  centeredScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  analyzingCard: {
    width: '100%',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  analyzingTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginTop: theme.spacing.lg,
    marginBottom: 4,
  },
  analyzingSubtitle: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  scanGrid: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.1)',
    borderRadius: theme.roundness.md,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  scanLabel: {
    fontSize: 9,
    color: theme.colors.primary,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 4,
  },
  scanValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: theme.spacing.sm,
  },
  terminalContainer: {
    gap: 4,
  },
  terminalText: {
    fontFamily: theme.fonts.mono,
    fontSize: 9,
    color: theme.colors.textMuted,
  },

  // Report screen styles
  reportWrapper: {
    flex: 1,
    padding: theme.spacing.md,
  },
  reportScroll: {
    paddingBottom: theme.spacing.xxl,
  },
  reportHeader: {
    marginVertical: theme.spacing.md,
    alignItems: 'center',
  },
  reportHeaderSub: {
    color: theme.colors.textMuted,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  reportHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 2,
  },
  scoreCard: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    marginBottom: theme.spacing.md,
  },
  resultStatusText: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: theme.spacing.lg,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.01)',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  scoreCircleValue: {
    fontSize: 42,
    fontWeight: '900',
  },
  scoreCircleTotal: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: -4,
  },
  percentageText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  minRequiredText: {
    color: theme.colors.textMuted,
    fontSize: 11,
  },
  feedbackCard: {
    marginBottom: theme.spacing.lg,
  },
  feedbackTitle: {
    color: theme.colors.accent,
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 6,
  },
  feedbackText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
  xpBonusBadge: {
    marginTop: theme.spacing.md,
    backgroundColor: 'rgba(0, 255, 102, 0.1)',
    borderColor: theme.colors.accent,
    borderWidth: 1,
    borderRadius: theme.roundness.sm,
    paddingVertical: 8,
    alignItems: 'center',
  },
  xpBonusBadgeText: {
    color: theme.colors.accent,
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  xpTipText: {
    color: theme.colors.textMuted,
    fontSize: 10,
    fontStyle: 'italic',
    marginTop: 8,
  },
  reportActions: {
    gap: theme.spacing.sm,
  },
  reportBtn: {
    paddingVertical: 14,
    borderRadius: theme.roundness.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportBtnText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
    fontSize: 12,
    letterSpacing: 1,
  }
});

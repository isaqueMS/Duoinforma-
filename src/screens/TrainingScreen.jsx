// Importação de hooks essenciais do React para controle de estados e efeitos
import React, { useState } from 'react';

// Importação de componentes fundamentais de visualização, safe area, botões, scrolls e animação do React Native
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, ScrollView, Animated } from 'react-native';

// Importação do componente de gradiente linear do Expo
import { LinearGradient } from 'expo-linear-gradient';

// Importação dos tokens do sistema de design (cores, margens, arredondamentos)
import { theme } from '../styles/theme';

// Importação do hook global de controle de jogabilidade e XP
import { useGame } from '../context/GameContext';

// Importação do conjunto de simulações estáticas de posts/notícias
import { trainingData } from '../data/trainingData';

// Importação de componentes de interface customizados
import GlassCard from '../components/GlassCard';
import NeonButton from '../components/NeonButton';
import ProgressBar from '../components/ProgressBar';
import Header from '../components/Header';

/**
 * Componente TrainingScreen (Missão de Treinamento).
 * Permite que agentes simulem a análise de publicações digitais, classificando-as entre "Confiável" ou "Suspeito".
 * Fornece feedbacks pedagógicos imediatos indicando falhas estruturais, vieses ou pistas de manipulação de fatos.
 * 
 * @param {object} navigation - Objeto de navegação da pilha do React Navigation
 */
export default function TrainingScreen({ navigation }) {
  // Consome a lista de ids concluídos e a função de conclusão de missões do provedor de estado
  const { completedTrainings, completeTraining } = useGame();
  
  // Controle de índice da publicação em foco no simulador
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Resposta selecionada pelo agente no post atual
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  
  // Controla se a caixa de análise e dicas do scanner deve ser exibida
  const [showFeedback, setShowFeedback] = useState(false);
  
  // Referência para animações fluidas de esvanecimento de cartões
  const [fadeAnim] = useState(new Animated.Value(1));

  // Obtém o registro de postagem ativo com base no índice atual
  const currentItem = trainingData[currentIndex];
  
  // Valida se o agente já completou essa verificação em sessões passadas
  const isCompletedAlready = completedTrainings.includes(currentItem.id);

  /**
   * Avalia a escolha do usuário comparando-a com a verdade factual do item.
   * Dispara o ganho de XP global e exibe a justificativa educacional sobre o post.
   */
  const handleAnswer = (answer) => {
    if (showFeedback) return;
    
    setSelectedAnswer(answer);
    setShowFeedback(true);

    // Valida se o usuário acertou a natureza do post
    const isCorrect = (answer === 'real' && currentItem.isReal) || (answer === 'fake' && !currentItem.isReal);
    
    // Incrementa os pontos (+50 XP) no provedor global do game
    completeTraining(currentItem.id, isCorrect, 50);
  };

  /**
   * Transiciona o carrossel de desafios com uma animação suave de fade out/fade in.
   */
  const handleNext = () => {
    // Efeito de desaparecimento suave (fade out)
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true
    }).start(() => {
      setSelectedAnswer(null);
      setShowFeedback(false);
      
      // Avança o índice circularmente no array de dados
      setCurrentIndex((prev) => (prev + 1) % trainingData.length);
      
      // Efeito de aparecimento suave (fade in)
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true
      }).start();
    });
  };

  // Flag auxiliar para identificar o status do acerto do agente
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
        {/* Cabeçalho superior com suporte ao menu lateral/avatar */}
        <Header 
          title="TREINAMENTO" 
          subtitle="SIMULADOR DE DESINFORMAÇÃO" 
          navigation={navigation} 
          showAvatar={true} 
        />
        
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Barra de progresso dos desafios do simulador */}
          <View style={styles.progContainer}>
            <ProgressBar 
              progress={(currentIndex + 1) / trainingData.length} 
              label={`DESAFIO ${currentIndex + 1} DE ${trainingData.length}`}
              valueText={`${currentIndex + 1}/${trainingData.length}`}
            />
          </View>

          <Animated.View style={{ opacity: fadeAnim, width: '100%' }}>
            
            {/* Cartão contendo a simulação do post social fictício */}
            <GlassCard 
              style={styles.postCard} 
              borderType={showFeedback ? (currentItem.isReal ? 'accent' : 'danger') : 'primary'}
            >
              {/* Badges de fonte e status da análise */}
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

              {/* Informações estéticas de autoria do post */}
              <View style={styles.authorRow}>
                <View style={styles.authorAvatar}>
                  <Text style={styles.avatarLabel}>{currentItem.author.charAt(0).toUpperCase()}</Text>
                </View>
                <View>
                  <Text style={styles.authorName}>@{currentItem.author}</Text>
                  <Text style={styles.timestamp}>{currentItem.timestamp}</Text>
                </View>
              </View>

              {/* Corpo da postagem com a alegação suspeita */}
              <Text style={styles.contentBody}>{currentItem.content}</Text>

              {/* Métricas sociais fictícias */}
              <View style={styles.socialStats}>
                <Text style={styles.socialStatText}>❤️ {currentItem.likes || '2.5K'}</Text>
                <Text style={styles.socialStatText}>🔁 {currentItem.shares || '1.1K'}</Text>
                <Text style={styles.socialStatText}>💬 421 Comentários</Text>
              </View>
            </GlassCard>

            {/* Renderização condicional: botões de escolha ou cartão de feedback */}
            {!showFeedback ? (
              <View style={styles.choiceContainer}>
                
                {/* Opção "Confiável" (Escudo) */}
                <TouchableOpacity 
                  onPress={() => handleAnswer('real')}
                  style={[styles.choiceBtn, styles.realBtn]}
                  activeOpacity={0.8}
                >
                  <Text style={styles.choiceIcon}>🛡️</Text>
                  <Text style={styles.choiceLabel}>CONFIÁVEL</Text>
                </TouchableOpacity>

                {/* Opção "Suspeito" (Alerta) */}
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
                
                {/* Faixa de resultado (Acerto ou Erro) com acréscimo de XP */}
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

                {/* Caixa informativa com a explicação analítica e diretrizes do scanner */}
                <GlassCard style={styles.explanationCard} borderType="primary">
                  <Text style={styles.explTitle}>ANÁLISE DOS VETORES:</Text>
                  <Text style={styles.explBody}>{currentItem.explanation}</Text>

                  <Text style={styles.tipsTitle}>DICAS DO SCANNER:</Text>
                  {currentItem.tips.map((tip, idx) => (
                    <Text key={idx} style={styles.tipItem}>🔹 {tip}</Text>
                  ))}
                </GlassCard>

                {/* Botão de navegação ao próximo desafio */}
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

// Folha de estilos contendo os visuais ciberpunk e neons de botões "real" e "fake"
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

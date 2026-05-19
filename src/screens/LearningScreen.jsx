// Import core React library hooks
import React, { useState } from 'react';

// Import essential layout components, text interfaces, safe area containers, scroll wrappers, and touch elements
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';

// Import LinearGradient from Expo package
import { LinearGradient } from 'expo-linear-gradient';

// Import our design system style configurations
import { theme } from '../styles/theme';

// Import our game context hook to manage points/XP
import { useGame } from '../context/GameContext';

// Import local custom high-fidelity components
import GlassCard from '../components/GlassCard';
import NeonButton from '../components/NeonButton';
import Header from '../components/Header';

// Static documentation content mapping famous techniques and quiz structures
const LESSONS = [
  {
    id: 'l1',
    category: 'CONCEITOS BÁSICOS',
    title: 'A anatomia da Desinformação',
    description: 'Entenda a diferença entre Fake News, desinformação e desinformação involuntária.',
    icon: '🧬',
    content: 'Nem toda notícia falsa é igual. Existem três categorias principais:\n\n1️⃣ **Desinformação (Disinformation):** Conteúdo criado intencionalmente para causar dano, mentir ou lucrar politicamente/financeiramente.\n\n2️⃣ **Informação Incorreta (Misinformation):** Erros compartilhados sem intenção de prejudicar (ex: um parente compartilhando receita antiga ou dado equivocado achando que ajuda).\n\n3️⃣ **Informação Maliciosa (Malinformation):** Informações verdadeiras usadas fora de contexto ou vazadas de propósito para causar dano à reputação de alguém.',
    quiz: {
      question: 'Se seu parente repassa uma notícia falsa no WhatsApp jurando ser verdade e tentando ajudar, isso se classifica como:',
      options: [
        'Desinformação (Intencional)',
        'Informação Incorreta (Sem intenção maliciosa)',
        'Informação Maliciosa (Fato real fora de contexto)'
      ],
      correctIdx: 1,
      rewardXP: 40
    }
  },
  {
    id: 'l2',
    category: 'TÉCNICAS DE MÍDIA',
    title: 'Manipulação por Clickbait',
    description: 'Como manchetes apelativas sequestram sua atenção e manipulam suas emoções.',
    icon: '🎣',
    content: 'O "Clickbait" (caça-clique) usa gatilhos psicológicos como curiosidade e indignação.\n\n**Sinais clássicos:**\n💥 Uso excessivo de pontuação de exclamação e tom dramático ("Você não vai acreditar no que aconteceu...").\n💥 Omissão intencional de informações cruciais na chamada para forçar o clique.\n💥 Exagero desproporcional do fato ocorrido.\n\n**Por que existe?** Cada clique gera visualizações de anúncios, enriquecendo quem produz manchetes enganosas às custas da verdade.',
    quiz: {
      question: 'Qual é o principal objetivo por trás de manchetes do estilo "Clickbait"?',
      options: [
        'Informar a população com máxima velocidade',
        'Sequestrar a atenção do usuário para gerar cliques e monetizar anúncios',
        'Facilitar a leitura rápida sem precisar abrir o link'
      ],
      correctIdx: 1,
      rewardXP: 40
    }
  },
  {
    id: 'l3',
    category: 'TECNOLOGIA AVANÇADA',
    title: 'Deepfakes e IA Generativa',
    description: 'Como identificar rostos e vozes falsificados por Inteligência Artificial.',
    icon: '🤖',
    content: 'Com a evolução da IA, agora é fácil criar vídeos e áudios ultra-realistas de pessoas dizendo coisas que nunca disseram.\n\n**Como identificar Deepfakes de vídeo:**\n👁️ **Olhos:** Piscadas artificiais (muito frequentes ou raras) e falta de brilho natural.\n🦷 **Boca:** Movimentos de dentes e lábios desalinhados com a fala.\n👂 **Sombras:** Iluminação inconsistente no pescoço e bochechas.\n🗣️ **Áudio:** Cortes abruptos ou tom robótico metálico.',
    quiz: {
      question: 'Qual destes é um sinal clássico para suspeitar de uma imagem ou vídeo deepfake?',
      options: [
        'O vídeo está em resolução HD',
        'Sombras inconsistentes no rosto e piscadas de olho totalmente artificiais',
        'A pessoa na filmagem fala muito rápido'
      ],
      correctIdx: 1,
      rewardXP: 40
    }
  }
];

/**
 * LearningScreen component.
 * Renders the course catalog screen where agents read core digital safety concepts
 * and answer challenge quizes to earn points.
 * 
 * @param {object} navigation - React Navigation routing prop
 */
export default function LearningScreen({ navigation }) {
  // Extract point accumulation context
  const { addPoints } = useGame();

  // Local component states
  const [activeLesson, setActiveLesson] = useState(null);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [completedLessons, setCompletedLessons] = useState([]);

  // Opens active document text
  const handleOpenLesson = (lesson) => {
    setActiveLesson(lesson);
    setQuizAnswer(null);
    setShowQuizResult(false);
  };

  // Handles verification of quiz selection and adds XP rewards
  const handleAnswerQuiz = (optionIdx) => {
    if (showQuizResult) return;
    setQuizAnswer(optionIdx);
    setShowQuizResult(true);

    // If choice matches correct index, reward XP and tag lesson as done
    if (optionIdx === activeLesson.quiz.correctIdx) {
      if (!completedLessons.includes(activeLesson.id)) {
        setCompletedLessons([...completedLessons, activeLesson.id]);
        addPoints(activeLesson.quiz.rewardXP);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[theme.colors.background, '#0A0E1D']}
        style={styles.container}
      >
        {/* Customized Dynamic Header navigation options */}
        <Header 
          title={activeLesson ? activeLesson.title : "ENCICLOPÉDIA"} 
          subtitle={activeLesson ? activeLesson.category : "TÁTICAS DE DEFESA COGNITIVA"} 
          navigation={navigation} 
          showAvatar={true} 
          onBack={activeLesson ? () => setActiveLesson(null) : undefined}
        />
        
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {!activeLesson ? (
            <View style={{ width: '100%' }}>
              <Text style={styles.introText}>
                Selecione um arquivo de treinamento para decifrar as técnicas de manipulação mais utilizadas da rede:
              </Text>

              {/* Loop rendering lesson file list items */}
              {LESSONS.map((lesson) => {
                const isDone = completedLessons.includes(lesson.id);
                return (
                  <TouchableOpacity
                    key={lesson.id}
                    onPress={() => handleOpenLesson(lesson)}
                    style={styles.lessonCardWrapper}
                    activeOpacity={0.8}
                  >
                    <GlassCard 
                      style={styles.lessonCard}
                      borderType={isDone ? 'accent' : 'primary'}
                    >
                      <View style={styles.lessonRow}>
                        <View style={styles.lessonIconContainer}>
                          <Text style={styles.lessonIconText}>{lesson.icon}</Text>
                        </View>
                        <View style={styles.lessonInfo}>
                          <Text style={styles.lessonCategory}>{lesson.category}</Text>
                          <Text style={styles.lessonTitle}>{lesson.title}</Text>
                          <Text style={styles.lessonDesc} numberOfLines={2}>{lesson.description}</Text>
                        </View>
                      </View>
                      
                      <View style={styles.cardFooter}>
                        {isDone ? (
                          <Text style={styles.completedText}>ARQUIVO DECIFRADO ✓</Text>
                        ) : (
                          <Text style={styles.lockedText}>DECIFRAR DOCUMENTO →</Text>
                        )}
                      </View>
                    </GlassCard>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <View style={{ width: '100%' }}>
              {/* Back to course selector button */}
              <TouchableOpacity onPress={() => setActiveLesson(null)} style={styles.backBtn}>
                <Text style={styles.backBtnText}>← VOLTAR AOS ARQUIVOS</Text>
              </TouchableOpacity>

              {/* Comprehensive Document Content Display card */}
              <GlassCard style={styles.lessonDetailCard} borderType="neonPrimary">
                <Text style={styles.detailCategory}>{activeLesson.category}</Text>
                <Text style={styles.detailTitle}>{activeLesson.title}</Text>
                <Text style={styles.detailBody}>{activeLesson.content}</Text>
              </GlassCard>

              {/* Interactive Mini-Challenge Area */}
              <Text style={styles.quizTitle}>⚡ MINI-DESAFIO DE DECRIPTAÇÃO</Text>
              
              <GlassCard style={styles.quizCard} borderType="secondary">
                <Text style={styles.quizQuestion}>{activeLesson.quiz.question}</Text>
                
                {activeLesson.quiz.options.map((option, idx) => {
                  const isSelected = quizAnswer === idx;
                  const isCorrect = idx === activeLesson.quiz.correctIdx;
                  
                  let optStyle = styles.quizOption;
                  if (showQuizResult) {
                    if (isCorrect) optStyle = [styles.quizOption, styles.quizOptionCorrect];
                    else if (isSelected && !isCorrect) optStyle = [styles.quizOption, styles.quizOptionIncorrect];
                  } else if (isSelected) {
                    optStyle = [styles.quizOption, styles.quizOptionSelected];
                  }

                  return (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => handleAnswerQuiz(idx)}
                      disabled={showQuizResult}
                      style={optStyle}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.quizOptionText,
                        showQuizResult && isCorrect && { color: theme.colors.accent, fontWeight: 'bold' },
                        showQuizResult && isSelected && !isCorrect && { color: theme.colors.danger }
                      ]}>
                        {option}
                      </Text>
                    </TouchableOpacity>
                  );
                })}

                {/* Option validation feedbacks */}
                {showQuizResult && (
                  <View style={styles.quizResultBox}>
                    {quizAnswer === activeLesson.quiz.correctIdx ? (
                      <Text style={styles.quizSuccessText}>
                        🎉 Excelente Agente! Você decifrou o enigma perfeitamente (+{activeLesson.quiz.rewardXP} XP)
                      </Text>
                    ) : (
                      <Text style={styles.quizFailText}>
                        ❌ Resposta inadequada. Analise a documentação acima e tente novamente mais tarde!
                      </Text>
                    )}
                  </View>
                )}
              </GlassCard>

              <NeonButton 
                title="CONCLUIR ARQUIVO" 
                onPress={() => setActiveLesson(null)} 
                variant="primary"
                style={{ marginBottom: theme.spacing.xl }}
              />
            </View>
          )}

        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

// Styles definition for Enciclopédia grid cards and course contents
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
  introText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  lessonCardWrapper: {
    width: '100%',
    marginBottom: theme.spacing.md,
  },
  lessonCard: {
    width: '100%',
  },
  lessonRow: {
    flexDirection: 'row',
  },
  lessonIconContainer: {
    width: 50,
    height: 50,
    borderRadius: theme.roundness.md,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  lessonIconText: {
    fontSize: 24,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonCategory: {
    color: theme.colors.primary,
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  lessonTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 2,
    marginBottom: 4,
  },
  lessonDesc: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    paddingTop: theme.spacing.sm,
    marginTop: theme.spacing.md,
    alignItems: 'flex-end',
  },
  completedText: {
    color: theme.colors.accent,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  lockedText: {
    color: theme.colors.primary,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  backBtn: {
    alignSelf: 'flex-start',
    marginBottom: theme.spacing.md,
    paddingVertical: 6,
  },
  backBtnText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
    fontSize: 13,
    letterSpacing: 1,
  },
  lessonDetailCard: {
    width: '100%',
    marginBottom: theme.spacing.lg,
  },
  detailCategory: {
    color: theme.colors.primary,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 4,
  },
  detailTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: theme.spacing.md,
  },
  detailBody: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
  },
  quizTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginBottom: theme.spacing.md,
  },
  quizCard: {
    width: '100%',
    marginBottom: theme.spacing.lg,
  },
  quizQuestion: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  quizOption: {
    backgroundColor: theme.colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    borderRadius: theme.roundness.md,
    marginBottom: theme.spacing.sm,
  },
  quizOptionSelected: {
    borderColor: theme.colors.secondary,
    backgroundColor: 'rgba(189, 0, 255, 0.05)',
  },
  quizOptionCorrect: {
    borderColor: theme.colors.accent,
    backgroundColor: 'rgba(0, 255, 102, 0.08)',
  },
  quizOptionIncorrect: {
    borderColor: theme.colors.danger,
    backgroundColor: 'rgba(255, 0, 85, 0.08)',
  },
  quizOptionText: {
    color: '#FFFFFF',
    fontSize: 13,
    lineHeight: 18,
  },
  quizResultBox: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  quizSuccessText: {
    color: theme.colors.accent,
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },
  quizFailText: {
    color: theme.colors.danger,
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  }
});


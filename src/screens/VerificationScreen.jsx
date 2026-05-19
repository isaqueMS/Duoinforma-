// Import React core hooks
import React, { useState } from 'react';

// Import essential user interface elements, scroll areas, loaders, and input fields from React Native
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';

// Import LinearGradient component from expo package
import { LinearGradient } from 'expo-linear-gradient';

// Import our design system style configurations
import { theme } from '../styles/theme';

// Import our customized game state context provider to persist scan logs
import { useGame } from '../context/GameContext';

// Import local custom high-fidelity animation components
import GlassCard from '../components/GlassCard';
import NeonButton from '../components/NeonButton';
import ScannerAnimation from '../components/ScannerAnimation';
import Header from '../components/Header';

// ─── Heuristic Analysis Engine ─────────────────────────────────────────────────

// Collection of typical suspicious domain extensions and bait expressions
const SUSPICIOUS_DOMAINS = [
  '.xyz', '.ru', '.click', '.online', '.info', '.biz', '.tk', '.ml',
  'login-', 'seguro-', 'banco-', 'gratuito-', 'gratis-', 'clique-',
  'oferta-', 'premio-', 'urgente-', 'ganhe-', 'desconto-', 'promo-'
];

// Heuristic keyword patterns used to tag specific disinformation categories
const FAKE_NEWS_PATTERNS = [
  // Health misinformation
  { terms: ['cura o câncer', 'cura cancer', 'cura o covid', 'cloroquina cura', 'ivermectina cura', 'chá milagroso', 'limão cura', 'bicarbonato cura', 'chip na vacina', 'vacina 5g', 'vacina chip', 'microchip na vacina', 'vacina mata', 'veneno na vacina'], flag: 'Desinformação médica e anti-vacina detectada', penalty: 40 },
  // Financial scams
  { terms: ['pix grátis', 'pix de graça', 'ganhe dinheiro fácil', 'renda extra fácil', 'ganhar seguidores grátis', 'avalie produtos em casa', 'trabalho em casa sem esforço', 'duplique seu dinheiro', 'esquema rentável', 'bolsa família extra', 'cpf premiado', 'seu nome foi sorteado'], flag: 'Indicadores de golpe financeiro ou pirâmide', penalty: 45 },
  // Conspiracy theories
  { terms: ['terra plana', 'terraplanismo', 'governo secreto', 'nova ordem mundial', 'iluminati', 'bill gates conspira', 'eles escondem', 'mídia esconde', 'verdade proibida', 'querem te controlar', 'os poderosos não querem que você saiba', 'acordem as ovelhas'], flag: 'Teoria conspiratória identificada', penalty: 35 },
  // Alarmist / clickbait
  { terms: ['urgente', '🚨', '‼️', '⚠️ urgente', 'atenção‼', 'pare tudo', 'antes que apaguem', 'antes que deletem', 'compartilhe antes que sumam', 'vazar agora', 'explosivo'], flag: 'Uso de gatilhos alarmistas e clickbait emocional', penalty: 20 },
  // Viral sharing pressure
  { terms: ['compartilhe urgente', 'repassem', 'mande para todos', 'corrente do bem', 'se você não compartilhar', 'avise seus contatos', 'calada da noite', 'às 3 da manhã mude'], flag: 'Pressão para compartilhamento viral (corrente)', penalty: 25 },
  // Political misinformation
  { terms: ['voto fraudado', 'urna fraudada', 'eleição roubada', 'fraude nas urnas', 'golpe eleitoral', 'ditadura comunista', 'marxismo cultural', 'kit gay nas escolas'], flag: 'Desinformação política ou eleitoral identificada', penalty: 38 },
  // Deepfakes / AI manipulation mentions
  { terms: ['foto manipulada', 'imagem falsa provando', 'vídeo comprovando', 'gravação vazada comprovando'], flag: 'Possível deepfake ou material manipulado digitalmente', penalty: 30 },
];

// Anonymity source verification keywords
const SOURCE_FLAGS = [
  { terms: ['segundo fontes', 'dizem que', 'me disseram que', 'um médico disse', 'um militar disse', 'ouvi dizer que', 'circulando nas redes', 'no whatsapp dizem'], flag: 'Ausência de fonte verificável — informação anônima', penalty: 22 },
];

/**
 * Custom offline NLP Analyzer.
 * Checks for punctuation, fake news patterns, uppercase shouting, and domain patterns.
 * 
 * @param {string} input - Text or URL being validated
 * @param {string} type - Tab mode ('text' | 'link')
 * @returns {object} Analysis metrics including confidence score, status color, and flags list
 */
function analyzeContent(input, type) {
  const lower = input.toLowerCase();
  let score = 92; // Base confidence score
  const flags = [];

  // 1. Link-specific checks
  if (type === 'link') {
    if (!lower.startsWith('https://')) {
      score -= 18;
      flags.push('Link sem protocolo seguro HTTPS — dados podem ser interceptados');
    }
    for (const pattern of SUSPICIOUS_DOMAINS) {
      if (lower.includes(pattern)) {
        score -= 22;
        flags.push(`Domínio suspeito detectado: "${pattern}" — comum em sites clonados`);
        break;
      }
    }
    // Check for cloned major news portals
    const clonedSites = [
      { real: 'g1.globo.com', fakes: ['g1-noticia', 'g1globo.', 'g-1globo', 'gl.globo', 'g1.glob0'] },
      { real: 'uol.com.br', fakes: ['u0l.com', 'uol-noticias', 'uol.com.ru'] },
      { real: 'folha.uol', fakes: ['folha-noticias', 'a-folha.'] },
      { real: 'cnn.com', fakes: ['cnn-brasil.', 'cnnn.com', 'cnn.com.ru'] },
    ];
    for (const site of clonedSites) {
      if (!lower.includes(site.real) && site.fakes.some(f => lower.includes(f))) {
        score -= 30;
        flags.push(`Possível clone de portal jornalístico confiável (${site.real})`);
      }
    }
  }

  // 2. Fake news content patterns parsing
  for (const category of FAKE_NEWS_PATTERNS) {
    for (const term of category.terms) {
      if (lower.includes(term)) {
        score -= category.penalty;
        if (!flags.includes(category.flag)) {
          flags.push(category.flag);
        }
        break;
      }
    }
  }

  // 3. Anonymous source patterns parsing
  for (const category of SOURCE_FLAGS) {
    for (const term of category.terms) {
      if (lower.includes(term)) {
        score -= category.penalty;
        if (!flags.includes(category.flag)) {
          flags.push(category.flag);
        }
        break;
      }
    }
  }

  // 4. Excessive uppercase (shouting text) detection
  const uppercaseRatio = (input.match(/[A-ZÁÉÍÓÚÀÃÕÂÊÔÇ]/g) || []).length / Math.max(input.length, 1);
  if (uppercaseRatio > 0.4 && input.length > 20) {
    score -= 12;
    flags.push('Excesso de letras maiúsculas — técnica comum para gerar urgência falsa');
  }

  // 5. Excessive exclamation marks assessment
  const exclamationCount = (input.match(/[!?]/g) || []).length;
  if (exclamationCount >= 3) {
    score -= 10;
    flags.push('Uso excessivo de pontuação emocional (! e ?) — padrão sensacionalista');
  }

  // 6. Very short content safeguard
  if (input.trim().length < 20) {
    score = 50;
    flags.push('Conteúdo muito curto para análise profunda — avalie o contexto completo');
  }

  // Limit bounds to [5, 100]
  score = Math.max(Math.min(Math.round(score), 100), 5);

  let status = 'CONFIÁVEL';
  let resultColor = theme.colors.accent;
  if (score < 40) {
    status = 'ALTAMENTE SUSPEITO / POSSÍVEL FAKE NEWS';
    resultColor = theme.colors.danger;
  } else if (score < 70) {
    status = 'DUVIDOSO — VERIFIQUE AS FONTES';
    resultColor = theme.colors.warning;
  }

  const recommendation =
    score < 40
      ? 'NÃO COMPARTILHE esta informação. Consulte sites de fact-checking como Agência Lupa, G1 Fato ou Checamos antes de repassar.'
      : score < 70
        ? 'Procure a notícia em portais jornalísticos reconhecidos e verifique se há fontes identificadas antes de compartilhar.'
        : 'Esta informação apresenta características de conteúdo factual saudável. Ainda assim, sempre confira a fonte original.';

  return {
    score,
    status,
    color: resultColor,
    flags: flags.length > 0 ? flags : ['Nenhum padrão suspeito óbvio identificado.'],
    recommendation,
  };
}

/**
 * VerificationScreen component.
 * Allows users to paste links or custom texts, running heuristic NLP checks to compute a confidence metric.
 * Includes interactive loading bars and persistent scans history list.
 * 
 * @param {object} navigation - React navigation route handler
 */
export default function VerificationScreen({ navigation }) {
  // Extract scans history list and persistence dispatcher
  const { addScanHistory, scannerHistory } = useGame();
  
  // Local states
  const [inputType, setInputType] = useState('text'); // 'text' | 'link'
  const [inputValue, setInputValue] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgressText, setScanProgressText] = useState('');
  const [scanResult, setScanResult] = useState(null);

  // Triggers mock scanning stages and then processes heuristics
  const startScan = () => {
    if (!inputValue.trim()) return;

    setIsScanning(true);
    setScanResult(null);
    setScanProgressText('INICIALIZANDO VARREDURA DE METADADOS...');

    const diagnostics = [
      'CONECTANDO AOS BANCOS DE DADOS DE CHECAGEM...',
      'DETECTANDO PADRÕES DE LINGUAGEM SENSACIONALISTA...',
      'VERIFICANDO DOMÍNIOS, CERTIFICADOS E FONTES...',
      'CRUZANDO COM BASE DE FAKE NEWS CONHECIDAS...',
      'CALCULANDO ÍNDICE DE CONFIABILIDADE DIGITAL...',
    ];

    // Stepper updates during scan simulation
    diagnostics.forEach((text, index) => {
      setTimeout(() => setScanProgressText(text), (index + 1) * 600);
    });

    // Concludes scan after delay and appends logs into global game states
    setTimeout(() => {
      setIsScanning(false);
      const result = analyzeContent(inputValue, inputType);
      setScanResult(result);

      addScanHistory(
        inputValue.slice(0, 50) + (inputValue.length > 50 ? '...' : ''),
        `${result.score}% (${result.status})`,
        inputType
      );
    }, 3600);
  };

  // Clears user form entries
  const clearForm = () => {
    setInputValue('');
    setScanResult(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[theme.colors.background, '#090E20']}
        style={styles.container}
      >
        {/* Render custom page header */}
        <Header 
          title="SCANNER DIGITAL" 
          subtitle="MOTOR DE ANÁLISE HEURÍSTICA v2.0" 
          navigation={navigation} 
          showAvatar={true} 
        />
        
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Type Selector Tabs: Text vs Link checks */}
          <View style={styles.tabContainer}>
            <TouchableOpacity 
              onPress={() => { setInputType('text'); clearForm(); }}
              style={[styles.tab, inputType === 'text' && styles.activeTab]}
            >
              <Text style={[styles.tabText, inputType === 'text' && styles.activeTabText]}>📝 TEXTO</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => { setInputType('link'); clearForm(); }}
              style={[styles.tab, inputType === 'link' && styles.activeTab]}
            >
              <Text style={[styles.tabText, inputType === 'link' && styles.activeTabText]}>🔗 LINK / URL</Text>
            </TouchableOpacity>
          </View>

          {/* Contextual instruction banners */}
          <View style={styles.infoBanner}>
            <Text style={styles.infoBannerText}>
              {inputType === 'text'
                ? '🔍 Cole o texto de uma mensagem, post ou notícia para análise heurística completa.'
                : '🌐 Cole a URL completa para verificar o domínio, protocolo e padrões de sites fraudulentos.'}
            </Text>
          </View>

          {/* Primary Form fields area */}
          <GlassCard style={styles.formCard} borderType="neonPrimary">
            <Text style={styles.inputLabel}>
              {inputType === 'text' 
                ? 'Cole o parágrafo ou mensagem recebida:' 
                : 'Cole o link completo da página:'}
            </Text>

            <TextInput
              value={inputValue}
              onChangeText={setInputValue}
              placeholder={inputType === 'text' 
                ? 'Ex: URGENTE: Chá milagroso neutraliza vírus em 12 horas! Compartilhe antes que apaguem!!!'
                : 'Ex: http://g1-noticias-urgentes.xyz/premio...'}
              placeholderTextColor={theme.colors.textMuted}
              multiline={inputType === 'text'}
              numberOfLines={inputType === 'text' ? 5 : 1}
              style={[
                styles.textInput, 
                inputType === 'text' ? { height: 110, textAlignVertical: 'top' } : { height: 48 }
              ]}
              editable={!isScanning}
            />

            {!isScanning && !scanResult && (
              <NeonButton 
                title="INICIAR ANÁLISE" 
                onPress={startScan}
                variant="primary"
                disabled={!inputValue.trim()}
                style={styles.scanBtn}
              />
            )}

            {/* Simulated holographic laser scanning overlays */}
            {isScanning && (
              <View style={styles.scanningWrapper}>
                <ScannerAnimation active={true} color={theme.colors.primary} />
                <Text style={styles.progressText}>{scanProgressText}</Text>
                <ActivityIndicator color={theme.colors.primary} style={{ marginTop: 8 }} />
              </View>
            )}
          </GlassCard>

          {/* Heuristic Diagnostic results card outputs */}
          {scanResult && (
            <GlassCard 
              style={styles.resultCard} 
              borderType={scanResult.score < 40 ? 'danger' : scanResult.score < 70 ? 'warning' : 'accent'}
            >
              <Text style={styles.resultHeader}>DIAGNÓSTICO FINALIZADO:</Text>
              
              {/* Trust Score Radial gauge display */}
              <View style={styles.gaugeContainer}>
                <View style={[styles.gaugeTrack, { borderColor: scanResult.color }]}>
                  <Text style={[styles.gaugeScore, { color: scanResult.color }]}>{scanResult.score}%</Text>
                  <Text style={styles.gaugeSub}>CONFIABILIDADE</Text>
                </View>
              </View>

              <Text style={styles.statusLabel}>STATUS DA INFORMAÇÃO:</Text>
              <Text style={[styles.statusVal, { color: scanResult.color }]}>{scanResult.status}</Text>

              <View style={styles.resultDivider} />

              {/* Lists all spotted suspicious pattern flags */}
              <Text style={styles.sectionSub}>SINAIS DE ANOMALIA DETECTADOS:</Text>
              {scanResult.flags.map((flag, idx) => (
                <Text key={idx} style={styles.flagItem}>
                  {scanResult.score < 40 ? '🚨' : scanResult.score < 70 ? '⚠️' : '✅'} {flag}
                </Text>
              ))}

              <View style={styles.resultDivider} />

              <Text style={styles.sectionSub}>RECOMENDAÇÃO DO SISTEMA:</Text>
              <Text style={styles.recommendationText}>{scanResult.recommendation}</Text>

              {/* Appends verified Brazilian fact-checking links for risky scores */}
              {scanResult.score < 60 && (
                <View style={styles.factCheckBox}>
                  <Text style={styles.factCheckTitle}>🔎 Sites de Fact-Checking Recomendados:</Text>
                  <Text style={styles.factCheckLink}>• lupa.uol.com.br</Text>
                  <Text style={styles.factCheckLink}>• checamos.afp.com</Text>
                  <Text style={styles.factCheckLink}>• g1.globo.com/fato-ou-fake</Text>
                  <Text style={styles.factCheckLink}>• boatos.org</Text>
                </View>
              )}

              <NeonButton 
                title="NOVO SCAN" 
                onPress={clearForm}
                variant="outline"
                style={{ marginTop: theme.spacing.lg }}
              />
            </GlassCard>
          )}

          {/* Historical Scans persistent list */}
          {scannerHistory.length > 0 && (
            <View style={styles.historyContainer}>
              <Text style={styles.historyTitle}>REGISTROS DE SCAN ANTERIORES</Text>
              {scannerHistory.map((item) => (
                <GlassCard key={item.id} style={styles.historyCard}>
                  <View style={styles.historyRow}>
                    <Text style={styles.historyType}>
                      {item.type === 'text' ? '📝 TEXTO' : '🔗 LINK'}
                    </Text>
                    <Text style={styles.historyDate}>{item.timestamp}</Text>
                  </View>
                  <Text style={styles.historyContent} numberOfLines={2}>{item.content}</Text>
                  <Text style={[
                    styles.historyResult,
                    { color: item.result.includes('SUSPEITO') || item.result.includes('FAKE') 
                        ? theme.colors.danger 
                        : item.result.includes('DUVIDOSO') 
                          ? theme.colors.warning 
                          : theme.colors.accent }
                  ]}>
                    Resultado: {item.result}
                  </Text>
                </GlassCard>
              ))}
            </View>
          )}

        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

// StyleSheet specifications representing neon cybersecurity themes
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
    color: theme.colors.primary,
    letterSpacing: 1.5,
    marginTop: 2,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    padding: 4,
    borderRadius: theme.roundness.md,
    width: '100%',
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: theme.roundness.sm,
  },
  activeTab: {
    backgroundColor: theme.colors.primary,
  },
  tabText: {
    color: theme.colors.textSecondary,
    fontWeight: 'bold',
    fontSize: 12,
    letterSpacing: 1,
  },
  activeTabText: {
    color: '#000000',
  },
  infoBanner: {
    width: '100%',
    backgroundColor: 'rgba(0,240,255,0.04)',
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
    borderRadius: theme.roundness.sm,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: theme.spacing.md,
  },
  infoBannerText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
  formCard: {
    width: '100%',
    marginBottom: theme.spacing.lg,
  },
  inputLabel: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: theme.spacing.sm,
  },
  textInput: {
    backgroundColor: 'rgba(7, 10, 19, 0.7)',
    borderRadius: theme.roundness.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    color: '#FFFFFF',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 12,
    fontSize: 14,
    marginBottom: theme.spacing.md,
  },
  scanBtn: {
    width: '100%',
  },
  scanningWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 10,
  },
  progressText: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
    marginTop: theme.spacing.md,
  },
  resultCard: {
    width: '100%',
    marginBottom: theme.spacing.lg,
  },
  resultHeader: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: theme.spacing.md,
  },
  gaugeContainer: {
    alignItems: 'center',
    marginVertical: theme.spacing.md,
  },
  gaugeTrack: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  gaugeScore: {
    fontSize: 34,
    fontWeight: '900',
  },
  gaugeSub: {
    fontSize: 8,
    color: theme.colors.textSecondary,
    letterSpacing: 1,
    marginTop: 2,
  },
  statusLabel: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
  statusVal: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 2,
    letterSpacing: 0.5,
    lineHeight: 22,
  },
  resultDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginVertical: theme.spacing.md,
    width: '100%',
  },
  sectionSub: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: theme.spacing.sm,
  },
  flagItem: {
    color: '#FFFFFF',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 6,
  },
  recommendationText: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
  factCheckBox: {
    marginTop: theme.spacing.md,
    backgroundColor: 'rgba(0,240,255,0.05)',
    borderRadius: theme.roundness.md,
    borderWidth: 1,
    borderColor: 'rgba(0,240,255,0.15)',
    padding: 12,
  },
  factCheckTitle: {
    color: theme.colors.primary,
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 8,
  },
  factCheckLink: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    lineHeight: 20,
  },
  historyContainer: {
    width: '100%',
    marginTop: theme.spacing.md,
  },
  historyTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginBottom: theme.spacing.md,
  },
  historyCard: {
    width: '100%',
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.md,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  historyType: {
    fontSize: 10,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  historyDate: {
    fontSize: 10,
    color: theme.colors.textMuted,
  },
  historyContent: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 18,
  },
  historyResult: {
    fontSize: 12,
    fontWeight: 'bold',
  }
});


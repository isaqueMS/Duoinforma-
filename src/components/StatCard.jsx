// Importação do React core
import React from 'react';

// Importação dos componentes essenciais de layout e texto do React Native
import { StyleSheet, View, Text } from 'react-native';

// Importação das constantes e definições do tema visual padrão do sistema
import { theme } from '../styles/theme';

/**
 * Componente StatCard.
 * Exibe cartões de estatísticas simples e consolidados (como pontuação, contagem de dias ativos, taxa de acerto, etc.).
 * Inclui indicadores visuais com bordas em neon customizáveis.
 * 
 * @param {string} label - Descrição curta da métrica posicionada abaixo do valor principal
 * @param {string|number} value - O valor estatístico principal a ser destacado
 * @param {string} icon - Emoji representativo para ilustrar a métrica
 * @param {string} color - Tom de cor neon para o contêiner do ícone e efeitos secundários
 */
export default function StatCard({ label, value, icon, color = theme.colors.primary }) {
  return (
    <View style={[styles.card, { borderColor: 'rgba(255, 255, 255, 0.05)' }]}>
      {/* Opacidade de fundo dinâmica (adicionando sufixo hexadecimal "15" para ~8% de opacidade) */}
      <View style={[styles.iconContainer, { backgroundColor: `${color}15`, borderColor: color }]}>
        <Text style={styles.iconText}>{icon}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
    </View>
  );
}

// Estilizações de grade e espaçamentos do componente de estatísticas
const styles = StyleSheet.create({
  card: {
    flex: 1, // Expande uniformemente na linha de colunas do contêiner pai
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: 'rgba(14, 19, 38, 0.6)',
    borderRadius: theme.roundness.md,
    borderWidth: 1,
    marginHorizontal: 4,
    marginBottom: theme.spacing.sm,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: theme.roundness.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  iconText: {
    fontSize: 20,
  },
  info: {
    flex: 1,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  label: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginTop: 2,
  }
});

// Import core React library
import React from 'react';

// Import essential layout components from React Native
import { StyleSheet, View, Text } from 'react-native';

// Import our design system style configurations
import { theme } from '../styles/theme';

/**
 * StatCard component.
 * Displays simple, concise statistics cards (like score points, streak counters, check status, etc.).
 * Includes styled, colorized icon indicators.
 * 
 * @param {string} label - Underneath label describing the metric
 * @param {string|number} value - The primary statistical value to show
 * @param {string} icon - Emoji representing the metric
 * @param {string} color - Neon tint color for the icon border and light background bleed
 */
export default function StatCard({ label, value, icon, color = theme.colors.primary }) {
  return (
    <View style={[styles.card, { borderColor: 'rgba(255, 255, 255, 0.05)' }]}>
      {/* Dynamic background opacity bleed (appending "15" hex suffix for ~8% opacity) */}
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

// Layout styling rules for inline statistics columns
const styles = StyleSheet.create({
  card: {
    flex: 1, // Expand dynamically to fill parent row column layout
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


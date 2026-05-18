import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { theme } from '../styles/theme';

export default function StatCard({ label, value, icon, color = theme.colors.primary }) {
  return (
    <View style={[styles.card, { borderColor: 'rgba(255, 255, 255, 0.05)' }]}>
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

const styles = StyleSheet.create({
  card: {
    flex: 1,
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

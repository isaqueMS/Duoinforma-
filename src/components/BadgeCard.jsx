import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { theme } from '../styles/theme';

export default function BadgeCard({ badge, title, description, isUnlocked = false }) {
  return (
    <View style={[
      styles.card,
      isUnlocked ? styles.unlockedCard : styles.lockedCard
    ]}>
      <View style={[
        styles.iconContainer,
        isUnlocked ? styles.unlockedIcon : styles.lockedIcon
      ]}>
        <Text style={styles.badgeText}>{isUnlocked ? badge : '🔒'}</Text>
      </View>
      <View style={styles.info}>
        <Text style={[
          styles.title,
          isUnlocked ? styles.unlockedTitle : styles.lockedTitle
        ]}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.roundness.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
  },
  lockedCard: {
    backgroundColor: 'rgba(14, 19, 38, 0.4)',
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  unlockedCard: {
    backgroundColor: 'rgba(14, 19, 38, 0.8)',
    borderColor: 'rgba(0, 240, 255, 0.3)',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
    borderWidth: 1,
  },
  lockedIcon: {
    backgroundColor: theme.colors.surfaceSecondary,
    borderColor: 'transparent',
  },
  unlockedIcon: {
    backgroundColor: 'rgba(0, 240, 255, 0.1)',
    borderColor: theme.colors.primary,
  },
  badgeText: {
    fontSize: 22,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  lockedTitle: {
    color: theme.colors.textMuted,
  },
  unlockedTitle: {
    color: theme.colors.primary,
  },
  description: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  }
});

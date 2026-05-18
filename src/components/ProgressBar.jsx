import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../styles/theme';

export default function ProgressBar({ 
  progress, // number between 0 and 1
  label, 
  valueText,
  color = theme.colors.primary,
  glowColor = theme.colors.primaryGlow
}) {
  const percentage = Math.min(Math.max(progress * 100, 0), 100);

  return (
    <View style={styles.container}>
      {(label || valueText) && (
        <View style={styles.labelContainer}>
          {label && <Text style={styles.label}>{label}</Text>}
          {valueText && <Text style={styles.valueText}>{valueText}</Text>}
        </View>
      )}
      
      <View style={styles.track}>
        <View style={[
          styles.fill, 
          { width: `${percentage}%`, backgroundColor: color, shadowColor: color }
        ]}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.gradientFill}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: theme.spacing.sm,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  label: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  valueText: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: 'bold',
  },
  track: {
    height: 8,
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: theme.roundness.full,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  fill: {
    height: '100%',
    borderRadius: theme.roundness.full,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
  },
  gradientFill: {
    flex: 1,
  }
});

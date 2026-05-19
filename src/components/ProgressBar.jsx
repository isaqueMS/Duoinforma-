// Import React to build components
import React from 'react';

// Import essential layout components from React Native
import { StyleSheet, View, Text } from 'react-native';

// Import LinearGradient from Expo to compile highlighted overlays
import { LinearGradient } from 'expo-linear-gradient';

// Import our design system style configurations
import { theme } from '../styles/theme';

/**
 * ProgressBar component.
 * Displays level completion progress, exam performance levels, or timeline ticks.
 * Features a glowing background effect.
 * 
 * @param {number} progress - Float number between 0 and 1 signifying completion percentage
 * @param {string} label - Text label on the left of the progress track
 * @param {string} valueText - Value label on the right side of the progress track
 * @param {string} color - Fill color code of the active bar
 * @param {string} glowColor - Secondary shadow/glow color configuration
 */
export default function ProgressBar({ 
  progress, 
  label, 
  valueText,
  color = theme.colors.primary,
  glowColor = theme.colors.primaryGlow
}) {
  // Normalize percentage within safe boundaries [0, 100]%
  const percentage = Math.min(Math.max(progress * 100, 0), 100);

  return (
    <View style={styles.container}>
      {/* Renders descriptive headers only if label or value text are supplied */}
      {(label || valueText) && (
        <View style={styles.labelContainer}>
          {label && <Text style={styles.label}>{label}</Text>}
          {valueText && <Text style={styles.valueText}>{valueText}</Text>}
        </View>
      )}
      
      {/* The empty background track */}
      <View style={styles.track}>
        {/* Animated fill layout styling based on calculations */}
        <View style={[
          styles.fill, 
          { width: `${percentage}%`, backgroundColor: color, shadowColor: color }
        ]}>
          {/* Overlay highlight gradient adding realistic glassy depth */}
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

// Styling definitions for progress tracker components
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


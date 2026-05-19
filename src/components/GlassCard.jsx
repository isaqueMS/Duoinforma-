// Import React to build the component
import React from 'react';

// Import core stylesheet and view components from React Native
import { StyleSheet, View } from 'react-native';

// Import BlurView from Expo to implement native glassmorphism blur overlays
import { BlurView } from 'expo-blur';

// Import theme style variables
import { theme } from '../styles/theme';

/**
 * GlassCard component.
 * Implements a high-fidelity glassmorphism card with dark opacity, 
 * customizable blur intensity, and neon borders based on active state.
 * 
 * @param {React.ReactNode} children - Nested component content
 * @param {object} style - Optional inline style overrides
 * @param {number} intensity - Blur opacity overlay intensity (0-100)
 * @param {string} borderType - Color scheme of borders ('primary' | 'neonPrimary' | etc.)
 */
export default function GlassCard({ children, style, intensity = 40, borderType = 'primary' }) {
  // Determine border color based on theme
  const getBorderColor = () => {
    switch (borderType) {
      case 'primary': return theme.colors.border;
      case 'neonPrimary': return theme.colors.primary;
      case 'secondary': return theme.colors.secondary;
      case 'accent': return theme.colors.accent;
      case 'danger': return theme.colors.danger;
      case 'warning': return theme.colors.warning;
      default: return theme.colors.border;
    }
  };

  return (
    <View style={[
      styles.container, 
      { borderColor: getBorderColor() },
      style
    ]}>
      {/* Renders the native blur effect on iOS/Android or falls back on web */}
      <BlurView intensity={intensity} tint="dark" style={styles.blur}>
        <View style={styles.content}>
          {children}
        </View>
      </BlurView>
    </View>
  );
}

// Styling definitions for the glassmorphism component
const styles = StyleSheet.create({
  container: {
    borderRadius: theme.roundness.lg,
    borderWidth: 1.5,
    backgroundColor: 'rgba(14, 19, 38, 0.7)', // Semi-transparent cyber card body
    overflow: 'hidden',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4, // Android shadow
  },
  blur: {
    width: '100%',
  },
  content: {
    padding: theme.spacing.lg,
  }
});


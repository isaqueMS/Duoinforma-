import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { theme } from '../styles/theme';

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
      <BlurView intensity={intensity} tint="dark" style={styles.blur}>
        <View style={styles.content}>
          {children}
        </View>
      </BlurView>
    </View>
  );
}

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

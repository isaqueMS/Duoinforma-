// Import React and standard state/ref management hooks
import React, { useRef } from 'react';

// Import essential layout and animation utilities from React Native
import { StyleSheet, Text, TouchableOpacity, Animated } from 'react-native';

// Import LinearGradient from Expo to construct glowing cyber gradients
import { LinearGradient } from 'expo-linear-gradient';

// Import design system style configurations
import { theme } from '../styles/theme';

/**
 * NeonButton component.
 * Custom glowing action button with spring animation feedback on press,
 * supports multiple visual variants (primary neon blue, secondary magenta, accent green, danger red, and outline).
 * 
 * @param {function} onPress - Callback function triggered on button press
 * @param {string} title - Text displayed inside the button
 * @param {string} variant - Visual design style ('primary' | 'secondary' | 'accent' | 'danger' | 'outline')
 * @param {object} style - External layout overrides for button container
 * @param {object} textStyle - External text color/font override props
 * @param {boolean} disabled - Blocks touch interactions and displays dark theme
 */
export default function NeonButton({ 
  onPress, 
  title, 
  variant = 'primary', 
  style, 
  textStyle,
  disabled = false
}) {
  // Animation scale value ref to create click shrink effects
  const scaleValue = useRef(new Animated.Value(1)).current;

  // Spring animation on button touch start - shrinks button slightly
  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  // Spring animation on button touch end - returns button to full size
  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  // Selects dual gradient colors matching standard cyber theme
  const getGradientColors = () => {
    if (disabled) {
      return [theme.colors.surfaceSecondary, theme.colors.surfaceSecondary];
    }
    switch (variant) {
      case 'primary':
        return [theme.colors.primary, '#0088FF'];
      case 'secondary':
        return [theme.colors.secondary, '#8800FF'];
      case 'accent':
        return [theme.colors.accent, '#00CC44'];
      case 'danger':
        return [theme.colors.danger, '#CC0033'];
      case 'outline':
      default:
        return ['transparent', 'transparent'];
    }
  };

  // Outline style flag determination
  const isOutline = variant === 'outline';

  return (
    // Scaled container wrapping touch action for smooth feedback
    <Animated.View style={[{ transform: [{ scale: scaleValue }] }, style]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.8}
        style={[
          styles.buttonContainer,
          isOutline && styles.outlineContainer,
          disabled && styles.disabledContainer
        ]}
      >
        {/* Render horizontal gradient background on active filled buttons */}
        <LinearGradient
          colors={getGradientColors()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <Text style={[
            styles.buttonText,
            isOutline && styles.outlineText,
            disabled && styles.disabledText,
            textStyle
          ]}>
            {title}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

// Neon button styles with heavy contrast text colors and shadows
const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: theme.roundness.md,
    overflow: 'hidden',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  gradient: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#000000', // Black text for high contrast on glowing buttons
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  outlineContainer: {
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(0, 240, 255, 0.05)',
    shadowColor: 'transparent',
    elevation: 0,
  },
  outlineText: {
    color: theme.colors.primary,
  },
  disabledContainer: {
    borderColor: 'transparent',
    shadowColor: 'transparent',
    elevation: 0,
  },
  disabledText: {
    color: theme.colors.textMuted,
  }
});


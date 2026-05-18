import React, { useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../styles/theme';

export default function NeonButton({ 
  onPress, 
  title, 
  variant = 'primary', // 'primary', 'secondary', 'accent', 'danger', 'outline'
  style, 
  textStyle,
  disabled = false
}) {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

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

  const isOutline = variant === 'outline';

  return (
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

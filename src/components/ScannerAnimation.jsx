// Import core React hooks
import React, { useEffect, useRef } from 'react';

// Import core layout, animation, and easing utilities from React Native
import { StyleSheet, View, Animated, Easing } from 'react-native';

// Import central design theme tokens
import { theme } from '../styles/theme';

/**
 * ScannerAnimation component.
 * Renders a futuristic cyber grid overlay with an animated horizontal laser scanning line.
 * Used during security checks, QR code scans, or database processing visual states.
 * 
 * @param {boolean} active - Starts/stops the infinite loop laser translation animation
 * @param {string} color - The primary glow color for the laser line
 */
export default function ScannerAnimation({ active = false, color = theme.colors.primary }) {
  // Floating translation animated coordinate reference
  const animatedValue = useRef(new Animated.Value(0)).current;

  // React hook to handle start, loop, and cleanup of the laser scanning animation
  useEffect(() => {
    if (active) {
      // Loop sequence: moves from top to bottom (2s) then bottom to top (2s) infinitely
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          })
        ])
      ).start();
    } else {
      // Return laser line immediately to the top of the card
      animatedValue.setValue(0);
    }
  }, [active]);

  // If the animation is inactive, do not paint it
  if (!active) return null;

  // Interpolate position from top (0%) to bottom (100% / 180px offset)
  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 180] // Height boundary matching styles.scannerBox
  });

  return (
    <View style={styles.scannerBox}>
      {/* Dynamic Futuristic Grid Background */}
      <View style={styles.gridOverlay}>
        <View style={styles.horizontalLine} />
        <View style={styles.horizontalLine} />
        <View style={styles.horizontalLine} />
        <View style={styles.horizontalLine} />
        <View style={styles.verticalLine} />
        <View style={styles.verticalLine} />
        <View style={styles.verticalLine} />
        <View style={styles.verticalLine} />
      </View>
      
      {/* Glowing Scanning Laser Beam Line */}
      <Animated.View style={[
        styles.laserBeam, 
        { 
          transform: [{ translateY }],
          backgroundColor: color,
          shadowColor: color
        }
      ]} />
    </View>
  );
}

// Styling configurations for cyber grids and absolute overlay laser layers
const styles = StyleSheet.create({
  scannerBox: {
    height: 180,
    width: '100%',
    backgroundColor: 'rgba(7, 10, 19, 0.6)',
    borderRadius: theme.roundness.md,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 240, 255, 0.2)',
    position: 'relative',
    overflow: 'hidden',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
    opacity: 0.15,
  },
  horizontalLine: {
    width: '100%',
    height: 1,
    backgroundColor: theme.colors.primary,
    marginVertical: 20,
  },
  verticalLine: {
    width: 1,
    height: '100%',
    backgroundColor: theme.colors.primary,
    position: 'absolute',
    left: '25%',
    marginLeft: 0,
  },
  laserBeam: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 4,
    borderRadius: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 6,
  }
});
export const styles_verticalLine_helper = StyleSheet.create({
  // Helper styling for extra customization placeholders
});


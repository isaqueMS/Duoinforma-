import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing } from 'react-native';
import { theme } from '../styles/theme';

export default function ScannerAnimation({ active = false, color = theme.colors.primary }) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (active) {
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
      animatedValue.setValue(0);
    }
  }, [active]);

  if (!active) return null;

  // Interpolate position from top (0%) to bottom (100%)
  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 180] // height of scanning container
  });

  return (
    <View style={styles.scannerBox}>
      {/* Dynamic Grid Background */}
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
      
      {/* Scanning Laser Beam */}
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
  // Multiple vertical lines can be placed if needed manually
});

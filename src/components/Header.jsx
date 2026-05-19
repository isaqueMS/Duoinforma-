// Import core React library
import React from 'react';

// Import essential React Native layout and interactive components
import { StyleSheet, View, Text, TouchableOpacity, Image, Platform, StatusBar } from 'react-native';

// Import Ionicons icon collection from Expo icons library
import { Ionicons } from '@expo/vector-icons';

// Import our central design theme configuration
import { theme } from '../styles/theme';

// Import custom authentication state hook
import { useAuth } from '../context/AuthContext';

// Import custom game state and level configuration hook
import { useGame } from '../context/GameContext';

// Load our system logo asset
const LOGO = require('../../assets/logo.png');

/**
 * Header component.
 * Rendered at the top of pages to display consistent application state, navigation,
 * dynamic titles/subtitles, user profile navigation, and system logo badge.
 * 
 * @param {string} title - The page header title
 * @param {string} subtitle - Secondary descriptive title below the main title
 * @param {object} navigation - React Navigation navigation prop to navigate between pages
 * @param {boolean} showBack - Forced flag to render back chevron button
 * @param {boolean} showAvatar - Toggle avatar/profile image rendering in header
 * @param {function} onBack - Explicit callback function for handling back press overrides
 */
export default function Header({ 
  title, 
  subtitle, 
  navigation, 
  showBack = false, 
  showAvatar = true,
  onBack
}) {
  // Extract authenticated user object
  const { user } = useAuth();
  // Extract level and badge information
  const { getCurrentLevel } = useGame();
  
  const currentLevel = getCurrentLevel();
  // Dynamically calculate if a back action is valid and possible
  const canGoBack = showBack || !!onBack || (navigation && navigation.canGoBack());

  // Triggers navigation jump to the Perfil tab on header avatar click
  const handleAvatarPress = () => {
    if (navigation) {
      // Navigate to 'Perfil' screen using navigation prop
      navigation.navigate('Perfil');
    }
  };

  // Triggers back navigation or execute callback override
  const handleBackPress = () => {
    if (onBack) {
      onBack();
    } else if (navigation) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.headerContainer}>
      {/* Left Area: Renders Back button or standard system logo */}
      <View style={styles.leftSection}>
        {canGoBack ? (
          <TouchableOpacity 
            onPress={handleBackPress} 
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color={theme.colors.primary} />
            <Text style={styles.backButtonText}>VOLTAR</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.logoWrapper}>
            <View style={styles.logoBorder}>
              <Image source={LOGO} style={styles.logoImage} resizeMode="contain" />
            </View>
          </View>
        )}
      </View>

      {/* Center Area: Title and Subtitle display with truncation */}
      <View style={styles.centerSection}>
        <Text style={styles.titleText} numberOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.subtitleText} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>

      {/* Right Area: Dynamic Avatar image or level badge */}
      <View style={styles.rightSection}>
        {showAvatar && (
          <TouchableOpacity 
            onPress={handleAvatarPress}
            style={styles.avatarButton}
            activeOpacity={0.8}
          >
            <View style={styles.avatarBorder}>
              {user?.photoURL ? (
                <Image source={{ uri: user.photoURL }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarEmoji}>{currentLevel.badge}</Text>
              )}
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

// Layout styling rules using high-fidelity neon borders and platform shadows
const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    // Dynamic height compensation on Android devices to account for status bar height
    height: Platform.OS === 'android' ? 64 + (StatusBar.currentHeight || 24) : 64,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    backgroundColor: 'rgba(7, 10, 19, 0.85)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 240, 255, 0.15)',
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  leftSection: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingRight: 12,
  },
  backButtonText: {
    color: theme.colors.primary,
    fontWeight: '900',
    fontSize: 10,
    letterSpacing: 1.5,
    marginLeft: -2,
    textShadowColor: 'rgba(0, 240, 255, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  logoWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBorder: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 240, 255, 0.05)',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 240, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 4,
  },
  logoImage: {
    width: 28,
    height: 28,
    borderRadius: 5,
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textShadowColor: theme.colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  subtitleText: {
    fontSize: 8,
    color: theme.colors.textSecondary,
    letterSpacing: 1.5,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  rightSection: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  avatarButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarBorder: {
    width: 38,
    height: 38,
    borderRadius: theme.roundness.full,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(0, 240, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarEmoji: {
    fontSize: 18,
  },
});


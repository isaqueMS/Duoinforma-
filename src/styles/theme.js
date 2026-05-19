/**
 * Custom design system and style tokens for the Duoinforma App.
 * Built with a high-fidelity "Cyber Defense" aesthetic, using deep space blues, dark metallic overlays,
 * and neon colors with simulated glassmorphism values.
 */
export const theme = {
  // Theme Color System
  colors: {
    background: '#070A13', // Deep cyber space blue-black (primary screen background)
    surface: '#0E1326',    // Dark metallic glass card background (cards, overlays)

    surfaceSecondary: '#181F38', // Lighter container
    
    primary: '#00F0FF',    // Neon Cyan / Blue
    primaryGlow: 'rgba(0, 240, 255, 0.4)',
    
    secondary: '#BD00FF',  // Neon Purple
    secondaryGlow: 'rgba(189, 0, 255, 0.4)',
    
    accent: '#00FF66',     // Neon Green (for real news, success, achievements)
    accentGlow: 'rgba(0, 255, 102, 0.4)',
    
    danger: '#FF0055',     // Neon Red (for fake news, warnings, errors)
    dangerGlow: 'rgba(255, 0, 85, 0.4)',
    
    warning: '#FFB800',    // Cyber Gold/Orange (for suspect rating, warnings)
    warningGlow: 'rgba(255, 184, 0, 0.4)',

    text: '#FFFFFF',       // Full white
    textSecondary: '#8F9BB3', // Muted steel blue
    textMuted: '#576585',  // Very dark grey-blue text
    
    border: '#1F294D',     // Cybergrid border color
    borderHighlight: '#3B4E8C',
  },
  fonts: {
    regular: 'System', // Fallback to System to ensure standard compatibility
    medium: 'System',
    bold: 'System',
    mono: 'System',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },
  roundness: {
    sm: 6,
    md: 12,
    lg: 20,
    xl: 30,
    full: 9999,
  }
};

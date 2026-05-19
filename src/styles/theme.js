/**
 * Sistema de design customizado e tokens de estilização do Duoinforma.
 * Construído sob a estética "Cyber Defense" (Defesa Cibernética), utilizando tons profundos de azul espacial,
 * superfícies metálicas escuras e cores neon brilhantes que simulam valores de glassmorphic.
 */
export const theme = {
  // Paleta de Cores do Tema
  colors: {
    background: '#070A13', // Azul-preto espacial profundo (fundo principal das telas)
    surface: '#0E1326',    // Fundo metálico escuro para cartões translúcidos

    surfaceSecondary: '#181F38', // Fundo de contêiner ligeiramente mais claro
    
    primary: '#00F0FF',    // Ciano Neon (utilizado em ações principais e links seguros)
    primaryGlow: 'rgba(0, 240, 255, 0.4)',
    
    secondary: '#BD00FF',  // Roxo Neon (utilizado para conquistas secundárias e exames)
    secondaryGlow: 'rgba(189, 0, 255, 0.4)',
    
    accent: '#00FF66',     // Verde Neon (para notícias verdadeiras, acertos e medalhas)
    accentGlow: 'rgba(0, 255, 102, 0.4)',
    
    danger: '#FF0055',     // Vermelho Neon (para fake news, perigos e erros)
    dangerGlow: 'rgba(255, 0, 85, 0.4)',
    
    warning: '#FFB800',    // Ouro Cibernético / Laranja (para avisos e níveis suspeitos)
    warningGlow: 'rgba(255, 184, 0, 0.4)',

    text: '#FFFFFF',       // Branco puro para textos principais
    textSecondary: '#8F9BB3', // Azul metálico claro para textos de apoio
    textMuted: '#576585',  // Azul metálico escuro para textos discretos
    
    border: '#1F294D',     // Cor da borda estilo grade cibernética
    borderHighlight: '#3B4E8C',
  },
  fonts: {
    regular: 'System', // Fallback para fontes do sistema para compatibilidade multiplataforma
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

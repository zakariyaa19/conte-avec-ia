// Design System - Thème principal pour Contes d'IA
export const theme = {
  colors: {
    // Couleurs principales
    background: {
      primary: '#FEFCF8', // Blanc cassé / crème très clair
      secondary: '#F9F7F4',
      white: '#FFFFFF'
    },
    
    // Couleurs d'accentuation
    accent: {
      coral: '#FF9999', // Rose corail
      pastelBlue: '#A8D8EA', // Bleu pastel
      paleYellow: '#FFE5B4', // Jaune pâle
      softPink: '#FFB3BA',
      lightGreen: '#BAFFC9',
      // Couleurs manquantes pour la compatibilité
      creamyYellow: '#FDF6E3', // Jaune crémeux
      lightCoral: '#FFCCCC', // Rose corail clair
      softPeach: '#FFDDCC' // Pêche doux
    },
    
    // Couleurs de texte
    text: {
      primary: '#2C2C2C', // Gris-noir
      secondary: '#5A4A42', // Brun foncé
      light: '#8B8B8B',
      white: '#FFFFFF'
    },
    
    // Couleurs d'état
    status: {
      success: '#4CAF50',
      warning: '#FF9800',
      error: '#F44336',
      info: '#2196F3'
    },
    
    // Couleurs pour les boutons
    button: {
      primary: '#FF9999',
      primaryHover: '#FF7F7F',
      secondary: '#A8D8EA',
      secondaryHover: '#8ECAE6'
    }
  },
  
  // Typographie
  fonts: {
    heading: '"Baloo 2", "Comic Neue", cursive', // Police avec empattements ronds
    body: '"Poppins", "Inter", sans-serif', // Police sans empattement
    fallback: 'system-ui, -apple-system, sans-serif'
  },
  
  // Tailles de police
  fontSizes: {
    xs: '0.75rem',   // 12px
    sm: '0.875rem',  // 14px
    base: '1rem',    // 16px
    lg: '1.125rem',  // 18px
    xl: '1.25rem',   // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem'      // 48px
  },
  
  // Espacements
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
    '4xl': '6rem'    // 96px
  },
  
  // Rayons de bordure
  borderRadius: {
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    '2xl': '1.5rem', // 24px
    full: '9999px'
  },
  
  // Ombres
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  },
  
  // Points de rupture pour le responsive
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  }
};

export type Theme = typeof theme;

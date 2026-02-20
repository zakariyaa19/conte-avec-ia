// Design System V2 - Thème principal pour Contes d'IA
// Refonte complète : ombres plus douces, animations, meilleure hiérarchie

export const theme = {
  colors: {
    // Couleurs principales
    background: {
      primary: '#FEFCF8',
      secondary: '#F9F7F4',
      white: '#FFFFFF'
    },

    // Couleurs d'accentuation
    accent: {
      coral: '#FF9999',
      coralDark: '#E88888',
      pastelBlue: '#A8D8EA',
      paleYellow: '#FFE5B4',
      softPink: '#FFB3BA',
      lightGreen: '#BAFFC9',
      creamyYellow: '#FDF6E3',
      lightCoral: '#FFCCCC',
      softPeach: '#FFDDCC'
    },

    // Couleurs de texte
    text: {
      primary: '#2C2C2C',
      secondary: '#5A4A42',
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
    },

    // Palette admin
    admin: {
      sidebar: '#1E293B',
      sidebarHover: '#334155',
      sidebarText: '#E2E8F0',
      sidebarActive: '#3B82F6',
      contentBg: '#F8FAFC',
      accent: '#3B82F6',
      accentHover: '#2563EB',
      cardBorder: '#E2E8F0'
    }
  },

  // Typographie
  fonts: {
    heading: '"Baloo 2", "Comic Neue", cursive',
    body: '"Poppins", "Inter", sans-serif',
    fallback: 'system-ui, -apple-system, sans-serif'
  },

  // Tailles de police
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem'
  },

  // Espacements
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
    '4xl': '6rem'
  },

  // Rayons de bordure (plus généreux V2)
  borderRadius: {
    sm: '0.375rem',
    md: '0.625rem',
    lg: '1rem',
    xl: '1.25rem',
    '2xl': '1.75rem',
    full: '9999px'
  },

  // Ombres V2 (plus douces, plus naturelles)
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)',
    md: '0 4px 12px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.04)',
    lg: '0 8px 24px rgba(0, 0, 0, 0.08), 0 4px 8px rgba(0, 0, 0, 0.04)',
    xl: '0 16px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.04)',
    glow: '0 0 20px rgba(255, 153, 153, 0.3)',
    glowStrong: '0 0 40px rgba(255, 153, 153, 0.4)',
    card: '0 2px 8px rgba(0, 0, 0, 0.04), 0 8px 24px rgba(0, 0, 0, 0.06)',
    cardHover: '0 8px 32px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(0, 0, 0, 0.06)'
  },

  // Transitions V2
  transitions: {
    fast: '0.15s ease',
    base: '0.25s ease',
    smooth: '0.35s cubic-bezier(0.4, 0, 0.2, 1)',
    spring: '0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
    slow: '0.6s cubic-bezier(0.4, 0, 0.2, 1)'
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

import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

export const GlobalStyles = createGlobalStyle`

  :root {
    --bg-primary: #FEFCF8;
    --bg-secondary: #F9F7F4;
    --bg-card: #FFFFFF;
    --bg-elevated: #FFFFFF;
    --bg-input: #FFFFFF;
    --text-primary: #2C2C2C;
    --text-secondary: #5A4A42;
    --text-light: #8B8B8B;
    --border-color: rgba(0,0,0,0.06);
    --border-input: #E8E5E1;
    --shadow-card: 0 2px 8px rgba(0,0,0,0.06);
    --shadow-card-hover: 0 8px 32px rgba(0,0,0,0.1);
    --header-glass: rgba(255,255,255,0.72);
    --hover-bg: rgba(255,153,153,0.06);
    --gradient-hero: linear-gradient(135deg, #FEFCF8 0%, #FFF5E6 50%, #FEFCF8 100%);
  }

  [data-theme="dark"] {
    --bg-primary: #13101E;
    --bg-secondary: #1A1628;
    --bg-card: #2C2540;
    --bg-elevated: #362E50;
    --bg-input: #252040;
    --text-primary: #F2EDE6;
    --text-secondary: #C0B9AF;
    --text-light: #918B83;
    --border-color: rgba(255,220,200,0.12);
    --border-input: rgba(255,220,200,0.18);
    --shadow-card: 0 4px 16px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,220,200,0.06);
    --shadow-card-hover: 0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,153,153,0.15);
    --header-glass: rgba(19,16,30,0.82);
    --hover-bg: rgba(255,153,153,0.12);
    --gradient-hero: linear-gradient(135deg, #13101E 0%, #1E1830 50%, #16122A 100%);
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
    -webkit-text-size-adjust: 100%;
    overflow-x: hidden;
  }

  body {
    font-family: ${theme.fonts.body};
    background-color: var(--bg-primary);
    color: var(--text-primary);
    line-height: 1.7;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${theme.fonts.heading};
    font-weight: 700;
    line-height: 1.25;
    margin-bottom: ${theme.spacing.md};
    letter-spacing: -0.01em;
  }

  h1 {
    font-size: ${theme.fontSizes['5xl']};
    color: var(--text-primary);

    @media (max-width: ${theme.breakpoints.md}) {
      font-size: ${theme.fontSizes['4xl']};
    }

    @media (max-width: ${theme.breakpoints.sm}) {
      font-size: ${theme.fontSizes['3xl']};
    }
  }

  h2 {
    font-size: ${theme.fontSizes['3xl']};
    color: var(--text-primary);

    @media (max-width: ${theme.breakpoints.md}) {
      font-size: ${theme.fontSizes['2xl']};
    }
  }

  h3 {
    font-size: ${theme.fontSizes['2xl']};
    color: var(--text-secondary);
  }

  p {
    margin-bottom: ${theme.spacing.md};
    font-size: ${theme.fontSizes.base};
    line-height: 1.7;
  }

  a {
    color: ${theme.colors.accent.coral};
    text-decoration: none;
    transition: color ${theme.transitions.fast};

    &:hover {
      color: ${theme.colors.button.primaryHover};
    }
  }

  button {
    font-family: ${theme.fonts.body};
    cursor: pointer;
    border: none;
    outline: none;
    transition: all ${theme.transitions.base};
  }

  input, textarea, select {
    font-family: ${theme.fonts.body};
    font-size: ${theme.fontSizes.base};
    border: 2px solid var(--border-input);
    border-radius: ${theme.borderRadius.md};
    padding: 0.75rem ${theme.spacing.md};
    transition: all ${theme.transitions.base};
    background-color: var(--bg-input);
    color: var(--text-primary);
    box-sizing: border-box;
    max-width: 100%;

    &:focus {
      border-color: ${theme.colors.accent.coral};
      outline: none;
      box-shadow: 0 0 0 3px rgba(255, 153, 153, 0.15);
    }

    &::placeholder {
      color: var(--text-light);
    }

    @media (max-width: 480px) {
      font-size: 16px; /* Prevents iOS zoom on input focus */
    }
  }

  img {
    max-width: 100%;
    height: auto;
  }

  // Classes utilitaires
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 ${theme.spacing.lg};

    @media (max-width: ${theme.breakpoints.md}) {
      padding: 0 ${theme.spacing.md};
    }
  }

  .text-center {
    text-align: center;
  }

  .mb-sm { margin-bottom: ${theme.spacing.sm}; }
  .mb-md { margin-bottom: ${theme.spacing.md}; }
  .mb-lg { margin-bottom: ${theme.spacing.lg}; }
  .mb-xl { margin-bottom: ${theme.spacing.xl}; }

  .mt-sm { margin-top: ${theme.spacing.sm}; }
  .mt-md { margin-top: ${theme.spacing.md}; }
  .mt-lg { margin-top: ${theme.spacing.lg}; }
  .mt-xl { margin-top: ${theme.spacing.xl}; }

  // Animations globales réutilisables
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideInFromBottom {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.03);
    }
  }

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-8px);
    }
  }

  // Scrollbar personnalisée
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--bg-secondary);
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.accent.lightCoral};
    border-radius: ${theme.borderRadius.full};

    &:hover {
      background: ${theme.colors.accent.coral};
    }
  }

  // Sélection de texte
  ::selection {
    background: rgba(255, 153, 153, 0.25);
    color: var(--text-primary);
  }
`;

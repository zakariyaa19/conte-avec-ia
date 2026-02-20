import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

export const GlobalStyles = createGlobalStyle`

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
    -webkit-text-size-adjust: 100%;
  }

  body {
    font-family: ${theme.fonts.body};
    background-color: ${theme.colors.background.primary};
    color: ${theme.colors.text.primary};
    line-height: 1.7;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
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
    color: ${theme.colors.text.primary};

    @media (max-width: ${theme.breakpoints.md}) {
      font-size: ${theme.fontSizes['4xl']};
    }

    @media (max-width: ${theme.breakpoints.sm}) {
      font-size: ${theme.fontSizes['3xl']};
    }
  }

  h2 {
    font-size: ${theme.fontSizes['3xl']};
    color: ${theme.colors.text.primary};

    @media (max-width: ${theme.breakpoints.md}) {
      font-size: ${theme.fontSizes['2xl']};
    }
  }

  h3 {
    font-size: ${theme.fontSizes['2xl']};
    color: ${theme.colors.text.secondary};
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
    border: 2px solid #E8E5E1;
    border-radius: ${theme.borderRadius.md};
    padding: 0.75rem ${theme.spacing.md};
    transition: all ${theme.transitions.base};
    background-color: ${theme.colors.background.white};

    &:focus {
      border-color: ${theme.colors.accent.coral};
      outline: none;
      box-shadow: 0 0 0 3px rgba(255, 153, 153, 0.15);
    }

    &::placeholder {
      color: #B5B0AB;
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
    background: ${theme.colors.background.secondary};
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
    color: ${theme.colors.text.primary};
  }
`;

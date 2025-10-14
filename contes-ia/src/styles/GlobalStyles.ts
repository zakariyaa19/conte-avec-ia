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
  }

  body {
    font-family: ${theme.fonts.body};
    background-color: ${theme.colors.background.primary};
    color: ${theme.colors.text.primary};
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${theme.fonts.heading};
    font-weight: 600;
    line-height: 1.3;
    margin-bottom: ${theme.spacing.md};
  }

  h1 {
    font-size: ${theme.fontSizes['4xl']};
    color: ${theme.colors.text.primary};
  }

  h2 {
    font-size: ${theme.fontSizes['3xl']};
    color: ${theme.colors.text.primary};
  }

  h3 {
    font-size: ${theme.fontSizes['2xl']};
    color: ${theme.colors.text.secondary};
  }

  p {
    margin-bottom: ${theme.spacing.md};
    font-size: ${theme.fontSizes.base};
  }

  a {
    color: ${theme.colors.accent.coral};
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: ${theme.colors.button.primaryHover};
    }
  }

  button {
    font-family: ${theme.fonts.body};
    cursor: pointer;
    border: none;
    outline: none;
    transition: all 0.2s ease;
  }

  input, textarea, select {
    font-family: ${theme.fonts.body};
    font-size: ${theme.fontSizes.base};
    border: 2px solid #E5E5E5;
    border-radius: ${theme.borderRadius.md};
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    transition: border-color 0.2s ease;

    &:focus {
      border-color: ${theme.colors.accent.coral};
      outline: none;
    }
  }

  // Classes utilitaires
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 ${theme.spacing.lg};
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

  // Responsive utilities
  @media (max-width: ${theme.breakpoints.md}) {
    .container {
      padding: 0 ${theme.spacing.md};
    }
    
    h1 {
      font-size: ${theme.fontSizes['3xl']};
    }
    
    h2 {
      font-size: ${theme.fontSizes['2xl']};
    }
  }
`;

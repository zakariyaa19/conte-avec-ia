import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { theme } from '../../styles/theme';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  style?: React.CSSProperties;
  fullWidth?: boolean;
}

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const StyledButton = styled.button<{ $variant: string; $size: string; $fullWidth?: boolean; $loading?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  font-family: ${theme.fonts.body};
  font-weight: 600;
  border-radius: ${theme.borderRadius.xl};
  transition: all ${theme.transitions.smooth};
  cursor: pointer;
  border: 2px solid transparent;
  width: ${props => props.$fullWidth ? '100%' : 'auto'};
  position: relative;
  overflow: hidden;
  letter-spacing: 0.01em;

  ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return css`
          padding: 0.5rem 1.25rem;
          font-size: ${theme.fontSizes.sm};
          border-radius: ${theme.borderRadius.lg};
        `;
      case 'lg':
        return css`
          padding: 1rem 2.5rem;
          font-size: ${theme.fontSizes.lg};

          @media (max-width: ${theme.breakpoints.sm}) {
            padding: 0.875rem 2rem;
            font-size: ${theme.fontSizes.base};
          }
        `;
      default:
        return css`
          padding: 0.75rem 1.75rem;
          font-size: ${theme.fontSizes.base};
        `;
    }
  }}

  ${({ $variant }) => {
    switch ($variant) {
      case 'secondary':
        return css`
          background: linear-gradient(135deg, ${theme.colors.accent.pastelBlue} 0%, #9DD0E4 100%);
          color: var(--text-primary);
          box-shadow: ${theme.shadows.sm};

          &:hover:not(:disabled) {
            background: linear-gradient(135deg, #9DD0E4 0%, ${theme.colors.button.secondaryHover} 100%);
            box-shadow: ${theme.shadows.md};
            transform: translateY(-2px);
          }

          &:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: ${theme.shadows.sm};
          }
        `;
      case 'outline':
        return css`
          background-color: transparent;
          color: ${theme.colors.accent.coral};
          border-color: ${theme.colors.accent.coral};

          &:hover:not(:disabled) {
            background-color: ${theme.colors.accent.coral};
            color: ${theme.colors.text.white};
            transform: translateY(-2px);
            box-shadow: ${theme.shadows.glow};
          }

          &:active:not(:disabled) {
            transform: translateY(0);
          }
        `;
      case 'ghost':
        return css`
          background-color: transparent;
          color: var(--text-secondary);

          &:hover:not(:disabled) {
            background-color: var(--hover-bg);
            color: ${theme.colors.accent.coral};
          }
        `;
      default:
        return css`
          background: linear-gradient(135deg, ${theme.colors.accent.coral} 0%, ${theme.colors.button.primaryHover} 100%);
          color: ${theme.colors.text.white};
          box-shadow: ${theme.shadows.sm}, ${theme.shadows.glow};

          &:hover:not(:disabled) {
            background: linear-gradient(135deg, ${theme.colors.button.primaryHover} 0%, #FF6B6B 100%);
            box-shadow: ${theme.shadows.md}, ${theme.shadows.glowStrong};
            transform: translateY(-2px);
          }

          &:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: ${theme.shadows.sm};
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }

  ${({ $loading }) => $loading && css`
    pointer-events: none;
    opacity: 0.85;
  `}
`;

const Spinner = styled.span`
  width: 18px;
  height: 18px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: ${spin} 0.6s linear infinite;
  display: inline-block;
`;

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  loading = false,
  type = 'button',
  className,
  style,
  fullWidth = false,
  ...props
}) => {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      $loading={loading}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
      className={className}
      style={style}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </StyledButton>
  );
};

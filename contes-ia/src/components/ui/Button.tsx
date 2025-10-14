import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  style?: React.CSSProperties;
  fullWidth?: boolean;
}

const StyledButton = styled.button<{ $variant: string; $size: string; $fullWidth?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: ${theme.fonts.body};
  font-weight: 500;
  border-radius: ${theme.borderRadius.lg};
  transition: all 0.2s ease;
  cursor: pointer;
  border: 2px solid transparent;
  width: ${props => props.$fullWidth ? '100%' : 'auto'};
  
  ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return `
          padding: ${theme.spacing.sm} ${theme.spacing.md};
          font-size: ${theme.fontSizes.sm};
        `;
      case 'lg':
        return `
          padding: ${theme.spacing.lg} ${theme.spacing.xl};
          font-size: ${theme.fontSizes.lg};
        `;
      default:
        return `
          padding: ${theme.spacing.md} ${theme.spacing.lg};
          font-size: ${theme.fontSizes.base};
        `;
    }
  }}
  
  ${({ $variant }) => {
    switch ($variant) {
      case 'secondary':
        return `
          background-color: ${theme.colors.accent.pastelBlue};
          color: ${theme.colors.text.primary};
          box-shadow: ${theme.shadows.sm};
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.button.secondaryHover};
            box-shadow: ${theme.shadows.md};
            transform: translateY(-1px);
          }
        `;
      case 'outline':
        return `
          background-color: transparent;
          color: ${theme.colors.accent.coral};
          border-color: ${theme.colors.accent.coral};
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.accent.coral};
            color: ${theme.colors.text.white};
            transform: translateY(-1px);
          }
        `;
      default:
        return `
          background-color: ${theme.colors.accent.coral};
          color: ${theme.colors.text.white};
          box-shadow: ${theme.shadows.sm};
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.button.primaryHover};
            box-shadow: ${theme.shadows.md};
            transform: translateY(-1px);
          }
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
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
      disabled={disabled}
      onClick={onClick}
      type={type}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

interface SelectionCardProps {
  value: string;
  label: string;
  icon?: string;
  description?: string;
  isSelected: boolean;
  onClick: (value: string) => void;
  size?: 'sm' | 'md' | 'lg';
  isCustom?: boolean;
  customLabel?: string;
}

const CardContainer = styled.div<{ $isSelected: boolean; $size: string; $isCustom?: boolean }>`
  background-color: ${props => {
    if (props.$isCustom) {
      return props.$isSelected ? theme.colors.accent.pastelBlue + '30' : theme.colors.accent.pastelBlue + '15';
    }
    return props.$isSelected ? theme.colors.accent.creamyYellow : 'var(--bg-card)';
  }};
  border: 2px solid ${props => {
    if (props.$isCustom) {
      return props.$isSelected ? theme.colors.accent.pastelBlue : theme.colors.accent.pastelBlue + '60';
    }
    return props.$isSelected ? theme.colors.accent.coral : '#E5E5E5';
  }};
  border-radius: ${theme.borderRadius.lg};
  padding: ${props => {
    if (props.$isCustom) return `${theme.spacing.xl} ${theme.spacing.lg}`;
    switch (props.$size) {
      case 'sm': return theme.spacing.md;
      case 'lg': return theme.spacing.xl;
      default: return theme.spacing.lg;
    }
  }};
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  grid-column: ${props => props.$isCustom ? '1 / -1' : 'auto'};
  
  &:hover {
    border-color: ${props => props.$isCustom ? theme.colors.accent.pastelBlue : theme.colors.accent.coral};
    box-shadow: ${theme.shadows.md};
    transform: translateY(-2px);
  }
  
  ${props => props.$isSelected && `
    box-shadow: ${theme.shadows.md};
    transform: translateY(-2px);
  `}
  
  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${props => {
      if (props.$isCustom) return `${theme.spacing.lg} ${theme.spacing.md}`;
      switch (props.$size) {
        case 'sm': return `${theme.spacing.sm} ${theme.spacing.xs}`;
        case 'lg': return `${theme.spacing.lg} ${theme.spacing.md}`;
        default: return `${theme.spacing.md} ${theme.spacing.sm}`;
      }
    }};
    border-radius: ${theme.borderRadius.md};
  }
`;

const CardIcon = styled.div<{ $size: string }>`
  font-size: ${props => {
    switch (props.$size) {
      case 'sm': return theme.fontSizes.xl;
      case 'lg': return theme.fontSizes['4xl'];
      default: return theme.fontSizes['2xl'];
    }
  }};
  margin-bottom: ${theme.spacing.sm};
  
  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${props => {
      switch (props.$size) {
        case 'sm': return theme.fontSizes.lg;
        case 'lg': return theme.fontSizes['2xl'];
        default: return theme.fontSizes.xl;
      }
    }};
    margin-bottom: ${theme.spacing.xs};
  }
`;

const CardLabel = styled.div<{ $size: string }>`
  font-family: ${theme.fonts.body};
  font-weight: 600;
  color: var(--text-primary);
  font-size: ${props => {
    switch (props.$size) {
      case 'sm': return theme.fontSizes.sm;
      case 'lg': return theme.fontSizes.lg;
      default: return theme.fontSizes.base;
    }
  }};
  margin-bottom: ${props => props.$size === 'lg' ? theme.spacing.sm : '4px'};
  
  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${props => {
      switch (props.$size) {
        case 'sm': return theme.fontSizes.xs;
        case 'lg': return theme.fontSizes.base;
        default: return theme.fontSizes.sm;
      }
    }};
    margin-bottom: ${props => props.$size === 'lg' ? theme.spacing.xs : '2px'};
    line-height: 1.3;
  }
`;

const CardDescription = styled.div`
  font-size: ${theme.fontSizes.xs};
  color: var(--text-light);
  line-height: 1.4;
  
  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 10px;
    line-height: 1.2;
    margin-top: 2px;
  }
`;

export const SelectionCard: React.FC<SelectionCardProps> = ({
  value,
  label,
  icon,
  description,
  isSelected,
  onClick,
  size = 'md',
  isCustom = false,
  customLabel
}) => {
  return (
    <CardContainer
      $isSelected={isSelected}
      $size={size}
      $isCustom={isCustom}
      onClick={() => onClick(value)}
    >
      {icon && (
        <CardIcon $size={size}>
          {icon}
        </CardIcon>
      )}
      <CardLabel $size={size}>
        {customLabel || label}
      </CardLabel>
      {description && (
        <CardDescription>
          {description}
        </CardDescription>
      )}
    </CardContainer>
  );
};

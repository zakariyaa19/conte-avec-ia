import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

interface ImageSelectionCardProps {
  value: string;
  label: string;
  imagePath: string;
  isSelected: boolean;
  onClick: (value: string) => void;
}

const CardContainer = styled.div<{ $isSelected: boolean }>`
  position: relative;
  height: 200px;
  border-radius: ${theme.borderRadius.lg};
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 3px solid ${props => props.$isSelected ? theme.colors.accent.coral : 'transparent'};
  box-shadow: ${props => props.$isSelected 
    ? `0 0 20px ${theme.colors.accent.coral}60` 
    : theme.shadows.sm};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${theme.shadows.lg};
    border-color: ${props => props.$isSelected ? theme.colors.accent.coral : theme.colors.accent.coral + '40'};
  }
  
  @media (max-width: ${theme.breakpoints.sm}) {
    height: 160px;
  }
`;

const BackgroundImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  ${CardContainer}:hover & {
    transform: scale(1.05);
  }
`;

const Overlay = styled.div<{ $isSelected: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.$isSelected 
    ? `linear-gradient(180deg, rgba(255,153,153,0.3) 0%, rgba(0,0,0,0.6) 100%)`
    : `linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)`};
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  padding: ${theme.spacing.lg};
  
  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.md};
  }
`;

const Label = styled.div`
  color: white;
  font-size: ${theme.fontSizes.lg};
  font-weight: 700;
  text-align: center;
  text-shadow: 0 2px 8px rgba(0,0,0,0.8);
  line-height: 1.3;
  
  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.base};
  }
`;

const SelectedBadge = styled.div`
  position: absolute;
  top: ${theme.spacing.sm};
  right: ${theme.spacing.sm};
  background: ${theme.colors.accent.coral};
  color: white;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.xs};
  font-weight: 700;
  box-shadow: ${theme.shadows.md};
  
  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 10px;
    padding: 4px ${theme.spacing.xs};
  }
`;

export const ImageSelectionCard: React.FC<ImageSelectionCardProps> = ({
  value,
  label,
  imagePath,
  isSelected,
  onClick
}) => {
  return (
    <CardContainer
      $isSelected={isSelected}
      onClick={() => onClick(value)}
      role="button"
      aria-pressed={isSelected}
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick(value);
        }
      }}
    >
      <BackgroundImage 
        src={imagePath} 
        alt={label}
        loading="lazy"
        onError={(e) => {
          // Fallback en cas d'erreur de chargement
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const container = target.parentElement;
          if (container) {
            container.style.background = 'var(--bg-secondary)';
          }
        }}
      />
      <Overlay $isSelected={isSelected}>
        <Label>{label}</Label>
      </Overlay>
      {isSelected && <SelectedBadge>Sélectionné</SelectedBadge>}
    </CardContainer>
  );
};

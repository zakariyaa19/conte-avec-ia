import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

interface ImageOccasionCardProps {
  value: string;
  label: string;
  imagePath: string;
  isSelected: boolean;
  onClick: (value: string) => void;
}

const CardContainer = styled.div<{ $isSelected: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.lg};
  background: ${props => props.$isSelected 
    ? 'var(--bg-primary)'
    : 'var(--bg-secondary)'};
  border: 3px solid ${props => props.$isSelected 
    ? theme.colors.accent.coral 
    : 'transparent'};
  box-shadow: ${props => props.$isSelected 
    ? `0 0 20px ${theme.colors.accent.coral}60` 
    : theme.shadows.sm};
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 200px;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${theme.shadows.lg};
    border-color: ${props => props.$isSelected 
      ? theme.colors.accent.coral 
      : theme.colors.accent.coral + '40'};
  }
  
  @media (max-width: ${theme.breakpoints.sm}) {
    min-height: 180px;
    padding: ${theme.spacing.md};
  }
`;

const ImageContainer = styled.div`
  width: 180px;
  height: 180px;
  margin-bottom: ${theme.spacing.md};
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: ${theme.breakpoints.sm}) {
    width: 130px;
    height: 130px;
  }
`;

const OccasionImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
  
  ${CardContainer}:hover & {
    transform: scale(1.1);
  }
`;

const Label = styled.div`
  font-size: ${theme.fontSizes.base};
  font-weight: 600;
  color: var(--text-primary);
  text-align: center;
  
  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.sm};
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

const FallbackIcon = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  background: linear-gradient(135deg, ${theme.colors.accent.pastelBlue}40, ${theme.colors.accent.creamyYellow}40);
  border-radius: ${theme.borderRadius.md};
`;

export const ImageOccasionCard: React.FC<ImageOccasionCardProps> = ({
  value,
  label,
  imagePath,
  isSelected,
  onClick
}) => {
  const [imageError, setImageError] = React.useState(false);

  const fallbackEmojis: { [key: string]: string } = {
    'birthday': '🎂',
    'christmas': '🎄',
    'new-year': '🎆',
    'easter': '🐣',
    'eid': '🌙',
    'mothers-day': '💐',
    'fathers-day': '👨‍👧'
  };

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
      <ImageContainer>
        {!imageError ? (
          <OccasionImage 
            src={imagePath} 
            alt={label}
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <FallbackIcon>{fallbackEmojis[value] || '🎉'}</FallbackIcon>
        )}
      </ImageContainer>
      
      <Label>{label}</Label>
      
      {isSelected && <SelectedBadge>Sélectionné</SelectedBadge>}
    </CardContainer>
  );
};

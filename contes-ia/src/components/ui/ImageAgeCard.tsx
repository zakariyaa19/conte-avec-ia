import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

interface ImageAgeCardProps {
  value: string;
  label: string;
  description: string;
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
  min-height: 280px;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${theme.shadows.lg};
    border-color: ${props => props.$isSelected 
      ? theme.colors.accent.coral 
      : theme.colors.accent.coral + '40'};
  }
  
  @media (max-width: ${theme.breakpoints.sm}) {
    min-height: 240px;
    padding: ${theme.spacing.md};
  }
`;

const ImageContainer = styled.div`
  width: 160px;
  height: 160px;
  margin-bottom: ${theme.spacing.md};
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: ${theme.breakpoints.sm}) {
    width: 130px;
    height: 130px;
  }
`;

const AgeImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
  
  ${CardContainer}:hover & {
    transform: scale(1.1);
  }
`;

const Label = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: ${theme.fontSizes.xl};
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: ${theme.spacing.xs};
  text-align: center;
  font-variant-emoji: text;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.lg};
  }
`;

const Description = styled.div`
  font-size: ${theme.fontSizes.sm};
  color: var(--text-secondary);
  text-align: center;
  line-height: 1.4;
  
  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.xs};
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
  font-size: 64px;
  background: linear-gradient(135deg, ${theme.colors.accent.pastelBlue}40, ${theme.colors.accent.creamyYellow}40);
  border-radius: ${theme.borderRadius.md};
`;

export const ImageAgeCard: React.FC<ImageAgeCardProps> = ({
  value,
  label,
  description,
  imagePath,
  isSelected,
  onClick
}) => {
  const [imageError, setImageError] = React.useState(false);

  const fallbackEmojis: { [key: string]: string } = {
    '0-2': '👶',
    '3-5': '🧒',
    '6-9': '👦',
    '10+': '👨'
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
          <AgeImage 
            src={imagePath} 
            alt={`${label} - ${description}`}
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <FallbackIcon>{fallbackEmojis[value] || '👤'}</FallbackIcon>
        )}
      </ImageContainer>
      
      <Label>{label}</Label>
      <Description>{description}</Description>
      
      {isSelected && <SelectedBadge>Sélectionné</SelectedBadge>}
    </CardContainer>
  );
};

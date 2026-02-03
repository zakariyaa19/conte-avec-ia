import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

interface CustomThemeCardProps {
  value: string;
  label: string;
  imagePath: string;
  isSelected: boolean;
  onClick: (value: string) => void;
}

const CardContainer = styled.div<{ $isSelected: boolean }>`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${theme.spacing.lg};
  padding: ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.lg};
  background: ${props => props.$isSelected 
    ? theme.colors.accent.pastelBlue + '30' 
    : theme.colors.accent.pastelBlue + '15'};
  border: 2px solid ${props => props.$isSelected 
    ? theme.colors.accent.pastelBlue 
    : theme.colors.accent.pastelBlue + '60'};
  cursor: pointer;
  transition: all 0.3s ease;
  grid-column: 1 / -1;
  min-height: 120px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.md};
    border-color: ${theme.colors.accent.pastelBlue};
  }
  
  @media (max-width: ${theme.breakpoints.sm}) {
    flex-direction: column;
    gap: ${theme.spacing.md};
    padding: ${theme.spacing.md};
    min-height: auto;
  }
`;

const ImageContainer = styled.div`
  width: 140px;
  height: 140px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: ${theme.breakpoints.sm}) {
    width: 110px;
    height: 110px;
  }
`;

const CustomImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
  
  ${CardContainer}:hover & {
    transform: scale(1.05);
  }
`;

const TextContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const Label = styled.div`
  font-size: ${theme.fontSizes.lg};
  font-weight: 700;
  color: ${theme.colors.text.primary};
  
  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.base};
    text-align: center;
  }
`;

const Description = styled.div`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.light};
  line-height: 1.4;
  
  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.xs};
    text-align: center;
  }
`;

const SelectedBadge = styled.div`
  position: absolute;
  top: ${theme.spacing.sm};
  right: ${theme.spacing.sm};
  background: ${theme.colors.accent.pastelBlue};
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

export const CustomThemeCard: React.FC<CustomThemeCardProps> = ({
  value,
  label,
  imagePath,
  isSelected,
  onClick
}) => {
  const [imageError, setImageError] = React.useState(false);

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
          <CustomImage 
            src={imagePath} 
            alt={label}
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <FallbackIcon>✏️</FallbackIcon>
        )}
      </ImageContainer>
      
      <TextContainer>
        <Label>Personnalisé</Label>
        <Description>Personnalisez le thème général de votre conte</Description>
      </TextContainer>
      
      {isSelected && <SelectedBadge>Sélectionné</SelectedBadge>}
    </CardContainer>
  );
};

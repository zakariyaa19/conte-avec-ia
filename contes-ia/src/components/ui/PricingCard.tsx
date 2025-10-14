import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { Button } from './Button';

interface PricingCardProps {
  title: string;
  price: string;
  originalPrice?: string;
  features: string[];
  isPopular?: boolean;
  ctaText: string;
  onSelect: () => void;
}

const CardContainer = styled.div<{ $isPopular?: boolean }>`
  background: linear-gradient(135deg, ${theme.colors.background.primary} 0%, ${theme.colors.accent.paleYellow} 100%);
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing['2xl']};
  box-shadow: ${props => props.$isPopular ? theme.shadows.lg : theme.shadows.md};
  position: relative;
  transition: transform 0.2s ease;
  border: ${props => props.$isPopular ? `3px solid ${theme.colors.accent.coral}` : '1px solid #E5E5E5'};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${theme.shadows.xl};
  }
  
  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.xl};
    border-radius: ${theme.borderRadius.lg};
  }
`;

const PopularBadge = styled.div`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${theme.colors.accent.coral};
  color: ${theme.colors.text.white};
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
  
  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.xs};
    padding: ${theme.spacing.xs} ${theme.spacing.md};
  }
`;

const CardTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.xl};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.md};
  text-align: center;
  
  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.lg};
    margin-bottom: ${theme.spacing.sm};
  }
`;

const PriceSection = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing.xl};
  
  @media (max-width: ${theme.breakpoints.sm}) {
    margin-bottom: ${theme.spacing.lg};
  }
`;

const Price = styled.div`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['3xl']};
  font-weight: 700;
  color: ${theme.colors.accent.coral};
  margin-bottom: ${theme.spacing.sm};
  
  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes['2xl']};
  }
`;

const OriginalPrice = styled.span`
  font-size: ${theme.fontSizes.lg};
  color: ${theme.colors.text.light};
  text-decoration: line-through;
  margin-left: ${theme.spacing.sm};
`;

const FeaturesList = styled.ul`
  list-style: none;
  margin-bottom: ${theme.spacing.xl};
  
  @media (max-width: ${theme.breakpoints.sm}) {
    margin-bottom: ${theme.spacing.lg};
  }
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: ${theme.spacing.md};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
  
  &:before {
    content: '✓';
    color: ${theme.colors.accent.coral};
    font-weight: bold;
    margin-right: ${theme.spacing.md};
    font-size: ${theme.fontSizes.base};
  }
  
  @media (max-width: ${theme.breakpoints.sm}) {
    margin-bottom: ${theme.spacing.sm};
    font-size: ${theme.fontSizes.xs};
    
    &:before {
      margin-right: ${theme.spacing.sm};
      font-size: ${theme.fontSizes.sm};
    }
  }
`;

export const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  originalPrice,
  features,
  isPopular = false,
  ctaText,
  onSelect
}) => {
  return (
    <CardContainer $isPopular={isPopular}>
      {isPopular && <PopularBadge>Le plus populaire</PopularBadge>}
      
      <CardTitle>{title}</CardTitle>
      
      <PriceSection>
        <Price>
          {price}
          {originalPrice && <OriginalPrice>{originalPrice}</OriginalPrice>}
        </Price>
      </PriceSection>
      
      <FeaturesList>
        {features.map((feature, index) => (
          <FeatureItem key={index}>{feature}</FeatureItem>
        ))}
      </FeaturesList>
      
      <Button 
        variant={isPopular ? 'primary' : 'outline'} 
        size="lg" 
        onClick={onSelect}
        style={{ width: '100%' }}
      >
        {ctaText}
      </Button>
    </CardContainer>
  );
};

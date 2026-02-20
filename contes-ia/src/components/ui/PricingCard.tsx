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
  badge?: string;
  subtitle?: string;
  onSelect: () => void;
}

const CardContainer = styled.div<{ $isPopular?: boolean }>`
  background: ${props => props.$isPopular
    ? 'linear-gradient(160deg, #FFFFFF 0%, #FFF8F0 40%, #FFF0E0 100%)'
    : theme.colors.background.white
  };
  border-radius: ${theme.borderRadius['2xl']};
  padding: ${theme.spacing['2xl']};
  box-shadow: ${props => props.$isPopular
    ? '0 8px 32px rgba(255, 153, 153, 0.15), 0 0 0 1px rgba(255, 153, 153, 0.1)'
    : theme.shadows.card};
  position: relative;
  transition: all ${theme.transitions.smooth};
  border: ${props => props.$isPopular
    ? `2px solid ${theme.colors.accent.coral}`
    : '2px solid rgba(0, 0, 0, 0.04)'
  };
  overflow: hidden;
  transform: ${props => props.$isPopular ? 'scale(1.03)' : 'scale(1)'};

  ${props => props.$isPopular && `
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 5px;
      background: linear-gradient(90deg, ${theme.colors.accent.coral}, ${theme.colors.accent.softPink}, ${theme.colors.accent.pastelBlue});
    }
  `}

  &:hover {
    transform: ${props => props.$isPopular ? 'scale(1.03) translateY(-6px)' : 'translateY(-6px)'};
    box-shadow: ${theme.shadows.cardHover};
  }

  button {
    white-space: normal;
    line-height: 1.3;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.xl};
    border-radius: ${theme.borderRadius.xl};
    transform: scale(1);

    &:hover {
      transform: translateY(-6px);
    }
  }
`;

const PopularBadge = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  background: linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.button.primaryHover});
  color: ${theme.colors.text.white};
  padding: 0.375rem 1rem;
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.xs};
  font-weight: 700;
  letter-spacing: 0.02em;
  box-shadow: ${theme.shadows.glow};

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 0.625rem;
    padding: 0.25rem 0.75rem;
  }
`;

const CardTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.xl};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.md};
  text-align: center;
  font-weight: 700;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.lg};
    margin-bottom: ${theme.spacing.sm};
  }
`;

const PriceSection = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing.xl};
  padding: ${theme.spacing.md} 0;

  @media (max-width: ${theme.breakpoints.sm}) {
    margin-bottom: ${theme.spacing.lg};
  }
`;

const Price = styled.div<{ $isPopular?: boolean }>`
  font-family: ${theme.fonts.heading};
  font-size: ${props => props.$isPopular ? theme.fontSizes['3xl'] : theme.fontSizes['4xl']};
  font-weight: 700;
  color: ${theme.colors.accent.coral};
  margin-bottom: ${theme.spacing.xs};
  line-height: 1;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes['3xl']};
  }
`;

const OriginalPrice = styled.span`
  font-size: ${theme.fontSizes.lg};
  color: ${theme.colors.text.light};
  text-decoration: line-through;
  margin-left: ${theme.spacing.sm};
  font-weight: 400;
`;

const PriceSubtext = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.light};
  margin: ${theme.spacing.xs} 0 0;
`;

const ValueHighlight = styled.div`
  display: inline-block;
  background: linear-gradient(135deg, ${theme.colors.accent.lightGreen}30, #a8e6cf30);
  border: 1px solid #a8e6cf;
  border-radius: ${theme.borderRadius.full};
  padding: 4px ${theme.spacing.md};
  font-size: ${theme.fontSizes.xs};
  font-weight: 600;
  color: #2d6a4f;
  margin-top: ${theme.spacing.sm};
`;

const Divider = styled.div`
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0,0,0,0.06), transparent);
  margin-bottom: ${theme.spacing.xl};
`;

const FeaturesList = styled.ul`
  list-style: none;
  margin-bottom: ${theme.spacing.xl};
  padding: 0;

  @media (max-width: ${theme.breakpoints.sm}) {
    margin-bottom: ${theme.spacing.lg};
  }
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: ${theme.spacing.md};
  margin-bottom: 1rem;
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
  line-height: 1.5;

  &::before {
    content: '';
    flex-shrink: 0;
    width: 22px;
    height: 22px;
    border-radius: ${theme.borderRadius.full};
    background: linear-gradient(135deg, ${theme.colors.accent.lightGreen}, #8FE6A0);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 1px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white' width='13' height='13'%3E%3Cpath d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: center;
    background-size: 13px;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    margin-bottom: 0.625rem;
    font-size: ${theme.fontSizes.xs};
  }
`;

export const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  originalPrice,
  features,
  isPopular = false,
  ctaText,
  badge,
  subtitle,
  onSelect
}) => {
  const isSubscription = price.includes('/mois');
  return (
    <CardContainer $isPopular={isPopular}>
      {isPopular && <PopularBadge>{badge || 'Populaire'}</PopularBadge>}

      <CardTitle>{title}</CardTitle>

      <PriceSection>
        <Price $isPopular={isPopular}>
          {price}
          {originalPrice && <OriginalPrice>{originalPrice}</OriginalPrice>}
        </Price>
        <PriceSubtext>{isSubscription ? 'Abonnement mensuel - Sans engagement' : 'Paiement unique'}</PriceSubtext>
        {subtitle && <ValueHighlight>{subtitle}</ValueHighlight>}
      </PriceSection>

      <Divider />

      <FeaturesList>
        {features.map((feature, index) => (
          <FeatureItem key={index}>{feature}</FeatureItem>
        ))}
      </FeaturesList>

      <Button
        variant={isPopular ? 'primary' : 'outline'}
        size="lg"
        onClick={onSelect}
        fullWidth
      >
        {ctaText}
      </Button>
    </CardContainer>
  );
};

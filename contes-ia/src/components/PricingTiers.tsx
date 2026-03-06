import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { Button } from './ui/Button';

export type PricingPlan = 'single' | 'monthly' | 'annual';

interface PricingTiersProps {
  onSelectPlan: (plan: PricingPlan) => void;
}

const Section = styled.div`
  width: 100%;
`;

const ToggleRow = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${theme.spacing['2xl']};
`;

const ToggleContainer = styled.div`
  display: inline-flex;
  background: ${theme.colors.background.secondary};
  border-radius: ${theme.borderRadius.full};
  padding: 4px;
  gap: 2px;
`;

const ToggleButton = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1.5rem;
  border-radius: ${theme.borderRadius.full};
  border: none;
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  background: ${props => props.$active ? theme.colors.background.white : 'transparent'};
  color: ${props => props.$active ? theme.colors.text.primary : theme.colors.text.light};
  box-shadow: ${props => props.$active ? theme.shadows.sm : 'none'};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${theme.spacing.lg};
  align-items: stretch;

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    max-width: 420px;
    margin: 0 auto;
  }
`;

const Card = styled.div<{ $highlight?: 'popular' | 'best' }>`
  background: ${props => props.$highlight
    ? 'linear-gradient(160deg, #FFFFFF 0%, #FFF8F0 40%, #FFF0E0 100%)'
    : theme.colors.background.white};
  border-radius: ${theme.borderRadius['2xl']};
  padding: ${theme.spacing['2xl']};
  box-shadow: ${props => props.$highlight
    ? '0 8px 32px rgba(255, 153, 153, 0.15), 0 0 0 1px rgba(255, 153, 153, 0.1)'
    : theme.shadows.card};
  position: relative;
  transition: all ${theme.transitions.smooth};
  border: ${props => props.$highlight
    ? `2px solid ${theme.colors.accent.coral}`
    : '2px solid rgba(0, 0, 0, 0.04)'};
  overflow: hidden;
  display: flex;
  flex-direction: column;

  ${props => props.$highlight === 'popular' && `
    transform: scale(1.03);
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

  ${props => props.$highlight === 'best' && `
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 5px;
      background: linear-gradient(90deg, ${theme.colors.accent.pastelBlue}, ${theme.colors.accent.lightGreen});
    }
  `}

  &:hover {
    transform: ${props => props.$highlight === 'popular' ? 'scale(1.03) translateY(-6px)' : 'translateY(-6px)'};
    box-shadow: ${theme.shadows.cardHover};
  }

  button {
    white-space: normal;
    line-height: 1.3;
  }

  @media (max-width: ${theme.breakpoints.lg}) {
    transform: scale(1);
    &:hover {
      transform: translateY(-6px);
    }
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.xl};
    border-radius: ${theme.borderRadius.xl};
  }
`;

const Badge = styled.div<{ $variant?: 'popular' | 'best' }>`
  position: absolute;
  top: 16px;
  right: 16px;
  background: ${props => props.$variant === 'best'
    ? 'linear-gradient(135deg, #4CAF50, #81C784)'
    : `linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.button.primaryHover})`};
  color: ${theme.colors.text.white};
  padding: 0.375rem 1rem;
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.xs};
  font-weight: 700;
  letter-spacing: 0.02em;
  box-shadow: ${props => props.$variant === 'best'
    ? '0 0 20px rgba(76, 175, 80, 0.3)'
    : theme.shadows.glow};

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

const PriceBlock = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing.xl};
  padding: ${theme.spacing.md} 0;

  @media (max-width: ${theme.breakpoints.sm}) {
    margin-bottom: ${theme.spacing.lg};
  }
`;

const PriceValue = styled.div`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['3xl']};
  font-weight: 700;
  color: ${theme.colors.accent.coral};
  line-height: 1;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes['2xl']};
  }
`;

const PriceNote = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.light};
  margin: ${theme.spacing.xs} 0 0;
`;

const Savings = styled.div`
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

const Features = styled.ul`
  list-style: none;
  margin-bottom: ${theme.spacing.xl};
  padding: 0;
  flex: 1;

  @media (max-width: ${theme.breakpoints.sm}) {
    margin-bottom: ${theme.spacing.lg};
  }
`;

const Feature = styled.li`
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
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white' width='13' height='13'%3E%3Cpath d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: center;
    background-size: 13px;
    margin-top: 1px;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    margin-bottom: 0.625rem;
    font-size: ${theme.fontSizes.xs};
  }
`;

export const PricingTiers: React.FC<PricingTiersProps> = ({ onSelectPlan }) => {
  const [showAnnual, setShowAnnual] = useState(false);

  return (
    <Section>
      <ToggleRow>
        <ToggleContainer>
          <ToggleButton $active={!showAnnual} onClick={() => setShowAnnual(false)}>
            Mensuel
          </ToggleButton>
          <ToggleButton $active={showAnnual} onClick={() => setShowAnnual(true)}>
            Annuel (-33%)
          </ToggleButton>
        </ToggleContainer>
      </ToggleRow>

      <Grid>
        {/* Single purchase */}
        <Card>
          <CardTitle>Mon Histoire</CardTitle>
          <PriceBlock>
            <PriceValue>6,99&euro;</PriceValue>
            <PriceNote>Paiement unique</PriceNote>
          </PriceBlock>
          <Divider />
          <Features>
            <Feature>1 conte personnalise</Feature>
            <Feature>PDF haute qualite</Feature>
            <Feature>6 illustrations sur mesure</Feature>
            <Feature>Telechargement illimite</Feature>
            <Feature>Compatible tous appareils</Feature>
          </Features>
          <Button variant="outline" size="lg" onClick={() => onSelectPlan('single')} fullWidth>
            Commencer
          </Button>
        </Card>

        {/* Monthly subscription */}
        <Card $highlight="popular">
          <Badge $variant="popular">Populaire</Badge>
          <CardTitle>Club Mensuel</CardTitle>
          <PriceBlock>
            <PriceValue>9,99&euro;/mois</PriceValue>
            <PriceNote>Sans engagement</PriceNote>
            <Savings>~2,50&euro; par conte (-64%)</Savings>
          </PriceBlock>
          <Divider />
          <Features>
            <Feature>1 conte par semaine</Feature>
            <Feature>Credits cumulables</Feature>
            <Feature>Bibliotheque avec visionneuse</Feature>
            <Feature>Telechargement PDF illimite</Feature>
            <Feature>Annulable a tout moment</Feature>
          </Features>
          <Button variant="primary" size="lg" onClick={() => onSelectPlan('monthly')} fullWidth>
            S'abonner
          </Button>
        </Card>

        {/* Annual subscription */}
        <Card $highlight={showAnnual ? 'best' : undefined}>
          {showAnnual && <Badge $variant="best">Meilleure offre</Badge>}
          <CardTitle>Club Annuel</CardTitle>
          <PriceBlock>
            <PriceValue>79,99&euro;/an</PriceValue>
            <PriceNote>Soit 6,67&euro;/mois</PriceNote>
            <Savings>~1,54&euro; par conte (-78%)</Savings>
          </PriceBlock>
          <Divider />
          <Features>
            <Feature>1 conte par semaine</Feature>
            <Feature>52 contes par an</Feature>
            <Feature>Tout le Club Mensuel inclus</Feature>
            <Feature>Economisez 40&euro;+ par an</Feature>
            <Feature>Paiement unique annuel</Feature>
          </Features>
          <Button variant={showAnnual ? 'primary' : 'outline'} size="lg" onClick={() => onSelectPlan('annual')} fullWidth>
            Choisir l'annuel
          </Button>
        </Card>
      </Grid>
    </Section>
  );
};

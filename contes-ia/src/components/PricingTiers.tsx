import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../styles/theme';
import { Button } from './ui/Button';

export type PricingPlan = 'single' | 'monthly' | 'annual';

interface PricingTiersProps {
  onSelectPlan: (plan: PricingPlan) => void;
  isFirstPurchase?: boolean;
}

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Section = styled.div`
  width: 100%;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.lg};
  align-items: start;

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    max-width: 420px;
    margin: 0 auto;
  }
`;

const Card = styled.div<{ $highlighted?: boolean }>`
  background: ${props => props.$highlighted
    ? 'var(--bg-elevated)'
    : 'var(--bg-card)'};
  border: ${props => props.$highlighted
    ? '2px solid #764ba2'
    : `1px solid var(--bg-secondary)`};
  border-radius: 20px;
  padding: ${theme.spacing.xl};
  position: relative;
  transition: transform 0.25s, box-shadow 0.25s;
  animation: ${fadeInUp} 0.5s ease-out both;

  ${props => props.$highlighted && `
    transform: scale(1.02);
    box-shadow: 0 8px 40px rgba(118, 75, 162, 0.15);
  `}

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0,0,0,0.1);
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.lg};
  }
`;

const Badge = styled.div`
  position: absolute;
  top: -1px;
  right: 16px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 5px 14px;
  border-radius: 0 0 10px 10px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.3px;
`;

const CardTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.xl};
  color: var(--text-primary);
  margin: 0 0 ${theme.spacing.sm};
  font-weight: 700;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.lg};
  }
`;

const PriceBlock = styled.div`
  margin-bottom: ${theme.spacing.lg};
`;

const PriceValue = styled.div`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['3xl']};
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes['2xl']};
  }
`;

const PriceNote = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: var(--text-light);
  margin: 4px 0 0;
`;

const Divider = styled.div`
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0,0,0,0.06), transparent);
  margin-bottom: ${theme.spacing.md};
`;

const Features = styled.ul`
  list-style: none;
  margin: 0 0 ${theme.spacing.lg};
  padding: 0;
`;

const Feature = styled.li<{ $disabled?: boolean; $premium?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  font-size: 13px;
  color: ${props => props.$disabled ? '#ccc' : 'var(--text-secondary)'};
  text-decoration: ${props => props.$disabled ? 'line-through' : 'none'};
  font-weight: ${props => props.$premium ? 600 : 400};
  line-height: 1.4;
`;

const FeatureIcon = styled.span`
  font-size: 15px;
  flex-shrink: 0;
  width: 20px;
  text-align: center;
`;

const ToggleRow = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${theme.spacing.xl};
`;

const ToggleContainer = styled.div`
  display: inline-flex;
  background: var(--bg-secondary);
  border-radius: ${theme.borderRadius.full};
  padding: 3px;
`;

const ToggleButton = styled.button<{ $active: boolean }>`
  padding: 8px 20px;
  border-radius: ${theme.borderRadius.full};
  border: none;
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => props.$active ? 'var(--bg-card)' : 'transparent'};
  color: ${props => props.$active ? 'var(--text-primary)' : 'var(--text-light)'};
  box-shadow: ${props => props.$active ? '0 1px 4px rgba(0,0,0,0.1)' : 'none'};
`;

const SaveBadge = styled.span`
  background: #4CAF50;
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 8px;
  margin-left: 4px;
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
            Annuel <SaveBadge>-33%</SaveBadge>
          </ToggleButton>
        </ToggleContainer>
      </ToggleRow>

      <Grid>
        {/* Gratuit */}
        <Card>
          <CardTitle>Gratuit</CardTitle>
          <PriceBlock>
            <PriceValue>0€</PriceValue>
            <PriceNote>Pas de carte bancaire</PriceNote>
          </PriceBlock>
          <Divider />
          <Features>
            <Feature><FeatureIcon style={{ color: '#22C55E' }}>&#10003;</FeatureIcon>3 premiers chapitres gratuits (5 pages)</Feature>
            <Feature><FeatureIcon style={{ color: '#22C55E' }}>&#10003;</FeatureIcon>Livre complet à 2,99€</Feature>
            <Feature><FeatureIcon style={{ color: '#22C55E' }}>&#10003;</FeatureIcon>5 illustrations par chapitre</Feature>
            <Feature><FeatureIcon style={{ color: '#22C55E' }}>&#10003;</FeatureIcon>Bibliothèque en ligne</Feature>
            <Feature><FeatureIcon style={{ color: '#22C55E' }}>&#10003;</FeatureIcon>Lecture + téléchargement PDF</Feature>
            <Feature $disabled><FeatureIcon>—</FeatureIcon>9 styles d'illustration</Feature>
            <Feature $disabled><FeatureIcon>—</FeatureIcon>5 personnages secondaires</Feature>
            <Feature $disabled><FeatureIcon>—</FeatureIcon>Occasions spéciales</Feature>
          </Features>
          <Button variant="outline" size="lg" onClick={() => onSelectPlan('single')} fullWidth>
            Commencer gratuitement
          </Button>
        </Card>

        {/* Club */}
        <Card $highlighted>
          <Badge>Recommandé</Badge>
          <CardTitle>Club des Histoires</CardTitle>
          <PriceBlock>
            {!showAnnual && (
              <p style={{ fontSize: '13px', textDecoration: 'line-through', color: 'var(--text-light)', margin: '0 0 2px', opacity: 0.5 }}>9,99€/mois</p>
            )}
            <PriceValue>{showAnnual ? '6,67€' : '1,99€'}<span style={{ fontSize: '16px', fontWeight: 400, color: 'var(--text-light)' }}>/mois</span></PriceValue>
            <PriceNote>{showAnnual ? '79,99€/an — économisez 40€' : '1er mois, puis 9,99€/mois · Sans engagement'}</PriceNote>
          </PriceBlock>
          <Divider />
          <Features>
            <Feature $premium><FeatureIcon style={{ color: '#8B5CF6' }}>&#10003;</FeatureIcon>4 livres/mois · 2x plus de pages</Feature>
            <Feature $premium><FeatureIcon style={{ color: '#8B5CF6' }}>&#10003;</FeatureIcon>9 styles d'illustration</Feature>
            <Feature $premium><FeatureIcon style={{ color: '#8B5CF6' }}>&#10003;</FeatureIcon>5 personnages secondaires</Feature>
            <Feature $premium><FeatureIcon style={{ color: '#8B5CF6' }}>&#10003;</FeatureIcon>Animal de compagnie</Feature>
            <Feature $premium><FeatureIcon style={{ color: '#8B5CF6' }}>&#10003;</FeatureIcon>Noël, anniversaire, fêtes...</Feature>
            <Feature><FeatureIcon style={{ color: '#22C55E' }}>&#10003;</FeatureIcon>Bibliothèque illimitée + PDF</Feature>
            <Feature><FeatureIcon style={{ color: '#22C55E' }}>&#10003;</FeatureIcon>Crédits cumulables</Feature>
            <Feature><FeatureIcon style={{ color: '#22C55E' }}>&#10003;</FeatureIcon>Annulable en 1 clic</Feature>
          </Features>
          <Button variant="primary" size="lg" onClick={() => onSelectPlan(showAnnual ? 'annual' : 'monthly')} fullWidth>
            Rejoindre le Club
          </Button>
        </Card>
      </Grid>
    </Section>
  );
};

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { theme } from '../styles/theme';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { ApiService } from '../config/api';
import { metaTrackSubscribe } from '../utils/metaPixel';

/* ═══════════ ANIMATIONS ═══════════ */

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(118, 75, 162, 0.3); }
  50% { box-shadow: 0 0 0 10px rgba(118, 75, 162, 0); }
`;

const checkPop = keyframes`
  0% { transform: scale(0); }
  60% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

/* ═══════════ LAYOUT ═══════════ */

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${theme.colors.background.primary};
`;

const Content = styled.main`
  flex: 1;
  max-width: 540px;
  margin: 0 auto;
  padding: ${theme.spacing.xl} ${theme.spacing.md};
  width: 100%;
`;

/* ═══════════ HERO ═══════════ */

const HeroSection = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing.lg};
  animation: ${fadeInUp} 0.5s ease-out;
`;

const HeroBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #667eea20, #764ba220);
  color: #764ba2;
  font-size: 11px;
  font-weight: 700;
  padding: 5px 14px;
  border-radius: 20px;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const HeroTitle = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: 26px;
  color: ${theme.colors.text.primary};
  margin: 0 0 8px;
  line-height: 1.2;
  letter-spacing: -0.02em;
`;

const HeroSub = styled.p`
  color: ${theme.colors.text.secondary};
  font-size: 14px;
  margin: 0;
  line-height: 1.5;
`;

/* ═══════════ COMPARISON TABLE ═══════════ */

const TableCard = styled.div`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 2px 16px rgba(0,0,0,0.06);
  border: 1px solid rgba(0,0,0,0.04);
  margin-bottom: ${theme.spacing.lg};
  animation: ${fadeInUp} 0.5s ease-out 0.1s both;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  border-bottom: 1px solid #f0f0f0;
`;

const TableHeaderCell = styled.div<{ $highlighted?: boolean }>`
  padding: 16px 8px;
  text-align: center;
  font-size: 13px;
  font-weight: 700;
  color: ${props => props.$highlighted ? '#764ba2' : theme.colors.text.secondary};
  background: ${props => props.$highlighted ? 'linear-gradient(135deg, #667eea08, #764ba210)' : 'transparent'};
  position: relative;

  ${props => props.$highlighted && css`
    &::after {
      content: 'Recommande';
      position: absolute;
      top: 4px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      font-size: 9px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 10px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
  `}
`;

const HeaderLabel = styled.div<{ $highlighted?: boolean }>`
  margin-top: ${props => props.$highlighted ? '14px' : '0'};
`;

const TableRow = styled.div<{ $even?: boolean }>`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  border-bottom: 1px solid #f8f8f8;
  align-items: center;

  &:last-child { border-bottom: none; }
`;

const FeatureCell = styled.div`
  padding: 12px 12px;
  font-size: 13px;
  color: ${theme.colors.text.primary};
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FeatureEmoji = styled.span`
  font-size: 16px;
  flex-shrink: 0;
`;

const CheckCell = styled.div<{ $highlighted?: boolean; $value?: 'yes' | 'no' | 'limited' | string }>`
  padding: 12px 8px;
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  background: ${props => props.$highlighted ? 'rgba(102, 126, 234, 0.03)' : 'transparent'};
  color: ${props => {
    if (props.$value === 'no') return '#ccc';
    if (props.$value === 'yes') return '#4CAF50';
    return theme.colors.text.secondary;
  }};
`;

/* ═══════════ PRICING CARD ═══════════ */

const PricingSection = styled.div`
  animation: ${fadeInUp} 0.5s ease-out 0.2s both;
  margin-bottom: ${theme.spacing.lg};
`;

const PricingCard = styled.div`
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 24px;
  padding: 28px 24px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 20% 80%, rgba(255,255,255,0.12), transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08), transparent 50%);
  }
`;

const PricingInner = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
`;

const PricingToggle = styled.div`
  display: inline-flex;
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(8px);
  border-radius: 30px;
  padding: 3px;
  margin-bottom: 20px;
`;

const ToggleBtn = styled.button<{ $active: boolean }>`
  padding: 7px 18px;
  border: none;
  border-radius: 28px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  background: ${props => props.$active ? 'white' : 'transparent'};
  color: ${props => props.$active ? '#764ba2' : 'rgba(255,255,255,0.7)'};
`;

const SaveTag = styled.span`
  background: #4CAF50;
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: 4px;
`;

const PriceRow = styled.div`
  color: white;
  margin-bottom: 4px;
`;

const PriceAmount = styled.span`
  font-size: 44px;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1;
`;

const PriceUnit = styled.span`
  font-size: 16px;
  font-weight: 400;
  opacity: 0.8;
`;

const PriceSub = styled.p`
  color: rgba(255,255,255,0.55);
  font-size: 12px;
  margin: 4px 0 20px;
`;

const CTAButton = styled.button<{ $loading?: boolean }>`
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 14px;
  background: white;
  color: #764ba2;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  position: relative;
  overflow: hidden;
  transition: transform 0.15s;

  &:active { transform: scale(0.97); }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
    background-size: 200% 100%;
    animation: ${shimmer} 3s ease-in-out infinite;
  }
`;

const CTAText = styled.span`
  position: relative;
  z-index: 2;
`;

/* ═══════════ GUARANTEES ═══════════ */

const GuaranteesRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 14px;
  flex-wrap: wrap;
  animation: ${fadeInUp} 0.5s ease-out 0.3s both;
  margin-bottom: ${theme.spacing.lg};
`;

const Guarantee = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: ${theme.colors.text.light};
  font-weight: 500;
`;

/* ═══════════ TESTIMONIAL ═══════════ */

const TestimonialCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.04);
  border: 1px solid rgba(0,0,0,0.04);
  text-align: center;
  animation: ${fadeInUp} 0.5s ease-out 0.35s both;
  margin-bottom: ${theme.spacing.lg};
`;

/* ═══════════ COMPONENT ═══════════ */

export const UpgradePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isClub } = useAuth();
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setLoading(true);
    try {
      metaTrackSubscribe();
      const token = localStorage.getItem('userToken');
      if (!token) { navigate('/login'); return; }
      const result = await ApiService.createSubscriptionSession(token);
      if (result.url) window.location.href = result.url;
    } catch (error) {
      console.error('Erreur creation session abonnement:', error);
      setLoading(false);
    }
  };

  if (isClub) {
    return (
      <PageContainer>
        <Header />
        <Content>
          <HeroSection>
            <HeroTitle>Vous etes deja membre !</HeroTitle>
            <HeroSub>Profitez de vos avantages depuis votre bibliotheque.</HeroSub>
            <div style={{ marginTop: 16 }}>
              <Button variant="primary" size="lg" onClick={() => navigate('/dashboard')}>Ma bibliotheque</Button>
            </div>
          </HeroSection>
        </Content>
        <Footer />
      </PageContainer>
    );
  }

  const rows: { emoji: string; label: string; free: string; freeVal: 'yes' | 'no' | 'limited'; club: string; clubVal: 'yes' }[] = [
    { emoji: '\uD83D\uDCD6', label: 'Livres par mois', free: '3 max', freeVal: 'limited', club: 'Illimite', clubVal: 'yes' },
    { emoji: '\uD83D\uDDBC\uFE0F', label: 'Illustrations', free: '7 / livre', freeVal: 'yes', club: '7 / livre', clubVal: 'yes' },
    { emoji: '\uD83D\uDCDA', label: 'Bibliotheque en ligne', free: '\u2713', freeVal: 'yes', club: '\u2713', clubVal: 'yes' },
    { emoji: '\uD83D\uDC64', label: 'Personnages secondaires', free: '\u2014', freeVal: 'no', club: '\u2713', clubVal: 'yes' },
    { emoji: '\uD83D\uDC36', label: 'Animaux de compagnie', free: '\u2014', freeVal: 'no', club: '\u2713', clubVal: 'yes' },
    { emoji: '\uD83C\uDFA8', label: 'Styles d\'illustration', free: 'Standard', freeVal: 'limited', club: 'Aquarelle, manga, Disney...', clubVal: 'yes' },
    { emoji: '\uD83C\uDF81', label: 'Occasions speciales', free: '\u2014', freeVal: 'no', club: 'Noel, anniversaire...', clubVal: 'yes' },
    { emoji: '\uD83C\uDF10', label: 'Langues', free: 'Francais', freeVal: 'limited', club: '15+ langues', clubVal: 'yes' },
    { emoji: '\u2199\uFE0F', label: 'Telechargement PDF', free: '\u2014', freeVal: 'no', club: '\u2713', clubVal: 'yes' },
    { emoji: '\u267B\uFE0F', label: 'Credits cumulables', free: '\u2014', freeVal: 'no', club: '\u2713', clubVal: 'yes' },
  ];

  return (
    <PageContainer>
      <Header />
      <Content>
        {/* Hero */}
        <HeroSection>
          <HeroBadge>Club des Histoires</HeroBadge>
          <HeroTitle>Comparez les offres</HeroTitle>
          <HeroSub>Tout ce qui est inclus dans le Club, face a l'offre gratuite.</HeroSub>
        </HeroSection>

        {/* Comparison table */}
        <TableCard>
          <TableHeader>
            <TableHeaderCell>
              <HeaderLabel>Fonctionnalite</HeaderLabel>
            </TableHeaderCell>
            <TableHeaderCell>
              <HeaderLabel>Gratuit</HeaderLabel>
            </TableHeaderCell>
            <TableHeaderCell $highlighted>
              <HeaderLabel $highlighted>Club</HeaderLabel>
            </TableHeaderCell>
          </TableHeader>

          {rows.map((row, i) => (
            <TableRow key={row.label} $even={i % 2 === 0}>
              <FeatureCell>
                <FeatureEmoji>{row.emoji}</FeatureEmoji>
                {row.label}
              </FeatureCell>
              <CheckCell $value={row.freeVal}>
                {row.free}
              </CheckCell>
              <CheckCell $highlighted $value={row.clubVal}>
                {row.club}
              </CheckCell>
            </TableRow>
          ))}
        </TableCard>

        {/* Pricing */}
        <PricingSection>
          <PricingCard>
            <PricingInner>
              <PricingToggle>
                <ToggleBtn $active={billing === 'monthly'} onClick={() => setBilling('monthly')}>
                  Mensuel
                </ToggleBtn>
                <ToggleBtn $active={billing === 'annual'} onClick={() => setBilling('annual')}>
                  Annuel <SaveTag>-33%</SaveTag>
                </ToggleBtn>
              </PricingToggle>

              <PriceRow>
                <PriceAmount>{billing === 'monthly' ? '9,99' : '6,67'}</PriceAmount>
                <PriceUnit>€/mois</PriceUnit>
              </PriceRow>
              <PriceSub>
                {billing === 'monthly'
                  ? 'Facture mensuellement'
                  : '79,99€/an — economisez 40€'}
              </PriceSub>

              <CTAButton onClick={handleSubscribe} $loading={loading} disabled={loading}>
                <CTAText>{loading ? 'Redirection...' : 'Commencer maintenant'}</CTAText>
              </CTAButton>
            </PricingInner>
          </PricingCard>
        </PricingSection>

        {/* Guarantees */}
        <GuaranteesRow>
          <Guarantee><span>&#x1F512;</span> Paiement securise</Guarantee>
          <Guarantee><span>&#x274C;</span> Sans engagement</Guarantee>
          <Guarantee><span>&#x26A1;</span> Acces immediat</Guarantee>
        </GuaranteesRow>

        {/* Testimonial */}
        <TestimonialCard>
          <div style={{ color: '#FFD700', fontSize: 16, marginBottom: 10, letterSpacing: 2 }}>&#x2B50;&#x2B50;&#x2B50;&#x2B50;&#x2B50;</div>
          <p style={{ fontSize: 14, color: theme.colors.text.secondary, fontStyle: 'italic', lineHeight: 1.7, margin: '0 0 8px' }}>
            "Ma fille me demande une nouvelle histoire tous les soirs ! Le Club c'est le cadeau parfait."
          </p>
          <p style={{ fontSize: 12, color: theme.colors.text.light, margin: 0, fontWeight: 600 }}>
            Marie, maman de Lola (5 ans)
          </p>
        </TestimonialCard>
      </Content>
      <Footer />
    </PageContainer>
  );
};

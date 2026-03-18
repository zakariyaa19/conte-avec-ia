import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { theme } from '../styles/theme';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { useAuth } from '../contexts/AuthContext';

// ── Animations ──
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
`;

const scrollCarousel = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

// ── Layout ──
const Page = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
  color: var(--text-primary);
`;

const Section = styled.section<{ $bg?: string }>`
  width: 100%;
  padding: 64px 20px;
  ${p => p.$bg && css`background: ${p.$bg};`}
  @media (max-width: ${theme.breakpoints.sm}) { padding: 40px 16px; }
`;

const Inner = styled.div`
  max-width: 960px;
  margin: 0 auto;
`;

// ── Hero ──
const HeroSection = styled.section`
  width: 100%;
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 80px 20px 48px;
  position: relative;
  overflow: hidden;
  @media (max-width: ${theme.breakpoints.sm}) {
    min-height: auto;
    padding: 60px 16px 32px;
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 680px;
  animation: ${fadeInUp} 0.8s ease both;
`;

const HeroBadge = styled.span`
  display: inline-block;
  background: linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.accent.softPink});
  color: white;
  font-size: 12px;
  font-weight: 700;
  padding: 6px 16px;
  border-radius: 20px;
  margin-bottom: 20px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;

const HeroTitle = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: clamp(2rem, 5vw, 3.2rem);
  font-weight: 800;
  line-height: 1.15;
  margin: 0 0 16px;
  background: linear-gradient(135deg, var(--text-primary) 0%, ${theme.colors.accent.coral} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const HeroSub = styled.p`
  font-size: ${theme.fontSizes.lg};
  color: var(--text-secondary);
  margin: 0 0 28px;
  line-height: 1.5;
  @media (max-width: ${theme.breakpoints.sm}) { font-size: ${theme.fontSizes.base}; }
`;

const HeroPrice = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 8px;
  margin-bottom: 24px;
`;

const PriceBig = styled.span`
  font-family: ${theme.fonts.heading};
  font-size: clamp(2.5rem, 6vw, 3.5rem);
  font-weight: 800;
  color: ${theme.colors.accent.coral};
`;

const PriceUnit = styled.span`
  font-size: ${theme.fontSizes.lg};
  color: var(--text-light);
  font-weight: 500;
`;

const HeroVisual = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 32px;
`;

const FloatingBook = styled.div<{ $delay?: number }>`
  width: 72px;
  height: 96px;
  border-radius: 4px 10px 10px 4px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,153,153,0.15);
  animation: ${float} 3s ease-in-out infinite;
  animation-delay: ${p => (p.$delay || 0) * 0.3}s;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  @media (max-width: ${theme.breakpoints.sm}) {
    width: 56px;
    height: 76px;
  }
`;

const TrustRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 16px;
  span {
    font-size: 13px;
    color: var(--text-light);
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;

// ── CTA Button ──
const CTAButton = styled.button<{ $variant?: 'primary' | 'outline' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 40px;
  border-radius: 14px;
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.lg};
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  ${p => p.$variant === 'outline' ? css`
    background: transparent;
    border: 2px solid ${theme.colors.accent.coral};
    color: ${theme.colors.accent.coral};
    &:hover { background: ${theme.colors.accent.coral}10; }
  ` : css`
    background: linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.accent.coralDark});
    color: white;
    box-shadow: 0 4px 20px ${theme.colors.accent.coral}40;
    &:hover { transform: translateY(-2px); box-shadow: 0 8px 32px ${theme.colors.accent.coral}50; }
  `}
  &:active { transform: scale(0.97); }
  &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
  @media (max-width: ${theme.breakpoints.sm}) {
    width: 100%;
    padding: 14px 24px;
    font-size: ${theme.fontSizes.base};
  }
`;

// ── Toggle ──
const PlanToggle = styled.div`
  display: inline-flex;
  background: var(--bg-card);
  border-radius: 12px;
  padding: 4px;
  border: 1px solid var(--border-color);
  margin-bottom: 24px;
`;

const PlanOption = styled.button<{ $active: boolean }>`
  padding: 10px 24px;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  font-size: ${theme.fontSizes.sm};
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  ${p => p.$active ? css`
    background: ${theme.colors.accent.coral};
    color: white;
    box-shadow: 0 2px 8px ${theme.colors.accent.coral}30;
  ` : css`
    background: transparent;
    color: var(--text-secondary);
    &:hover { color: var(--text-primary); }
  `}
`;

const SaveBadge = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background: #4CAF50;
  color: white;
  font-size: 9px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 8px;
  white-space: nowrap;
`;

// ── Benefits Grid ──
const BenefitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
`;

const BenefitCard = styled.div<{ $delay?: number }>`
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 20px 16px;
  text-align: center;
  transition: all 0.3s ease;
  animation: ${fadeInUp} 0.5s ease both;
  animation-delay: ${p => (p.$delay || 0) * 0.08}s;
  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-card-hover);
    border-color: ${theme.colors.accent.coral}30;
  }
  @media (max-width: ${theme.breakpoints.sm}) { padding: 14px 10px; }
`;

const BenefitIcon = styled.div`
  font-size: 28px;
  margin-bottom: 8px;
  @media (max-width: ${theme.breakpoints.sm}) { font-size: 24px; }
`;

const BenefitLabel = styled.p`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.sm};
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 4px;
`;

const BenefitDesc = styled.p`
  font-size: 11px;
  color: var(--text-light);
  margin: 0;
  line-height: 1.3;
`;

// ── Styles Carousel ──
const CarouselWrapper = styled.div`
  overflow: hidden;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
`;

const CarouselTrack = styled.div`
  display: flex;
  gap: 16px;
  animation: ${scrollCarousel} 30s linear infinite;
  width: max-content;
  &:hover { animation-play-state: paused; }
`;

const StyleCard = styled.div`
  width: 160px;
  flex-shrink: 0;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  transition: all 0.3s ease;
  &:hover { transform: scale(1.03); box-shadow: var(--shadow-card-hover); }
  @media (max-width: ${theme.breakpoints.sm}) { width: 130px; }
`;

const StyleImg = styled.div<{ $src: string }>`
  width: 100%;
  aspect-ratio: 1;
  background-image: url(${p => p.$src});
  background-size: cover;
  background-position: center;
`;

const StyleName = styled.p`
  text-align: center;
  padding: 8px 4px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
`;

// ── Comparison ──
const ComparisonTable = styled.div`
  display: grid;
  grid-template-columns: 1fr 100px 100px;
  gap: 0;
  max-width: 560px;
  margin: 0 auto;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
`;

const CompHeader = styled.div<{ $highlight?: boolean }>`
  padding: 14px 12px;
  font-weight: 700;
  font-size: ${theme.fontSizes.sm};
  text-align: center;
  background: ${p => p.$highlight ? `${theme.colors.accent.coral}15` : 'var(--bg-elevated)'};
  color: ${p => p.$highlight ? theme.colors.accent.coral : 'var(--text-primary)'};
  border-bottom: 1px solid var(--border-color);
`;

const CompCell = styled.div<{ $highlight?: boolean; $last?: boolean }>`
  padding: 10px 12px;
  font-size: 13px;
  text-align: center;
  border-bottom: ${p => p.$last ? 'none' : '1px solid var(--border-color)'};
  color: var(--text-secondary);
  ${p => p.$highlight && css`background: ${theme.colors.accent.coral}06;`}
`;

const CompFeature = styled(CompCell)`
  text-align: left;
  font-weight: 500;
  color: var(--text-primary);
`;

// ── Testimonial ──
const TestimonialCard = styled.div`
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 24px;
  max-width: 480px;
  margin: 0 auto;
  text-align: center;
`;

// ── Error ──
const ErrorMsg = styled.p`
  color: ${theme.colors.status?.error || '#e74c3c'};
  font-size: ${theme.fontSizes.sm};
  text-align: center;
  margin-top: 8px;
`;

// ── Shimmer button effect ──
const ShimmerCTA = styled(CTAButton)`
  background-size: 200% auto;
  background-image: linear-gradient(
    90deg,
    ${theme.colors.accent.coral} 0%,
    ${theme.colors.accent.softPink} 50%,
    ${theme.colors.accent.coral} 100%
  );
  animation: ${shimmer} 3s linear infinite;
`;

// ── Section titles ──
const STitle = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: clamp(1.5rem, 3.5vw, 2rem);
  font-weight: 800;
  text-align: center;
  margin: 0 0 8px;
  color: var(--text-primary);
`;

const SSub = styled.p`
  font-size: ${theme.fontSizes.base};
  color: var(--text-secondary);
  text-align: center;
  margin: 0 0 32px;
  line-height: 1.5;
  @media (max-width: ${theme.breakpoints.sm}) { font-size: ${theme.fontSizes.sm}; }
`;

// =============================================
// COMPONENT
// =============================================
export const ClubPage: React.FC = () => {
  const { isClub, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const detailsRef = useRef<HTMLDivElement>(null);

  const goToCheckout = () => {
    if (isClub) { navigate('/dashboard'); return; }
    navigate('/club/checkout');
  };

  const illustrationStyles = [
    { name: 'Aquarelle', img: '/images/illustration-styles/aquarelle.jpg' },
    { name: 'Animation 3D', img: '/images/illustration-styles/animation-3d.jpg' },
    { name: 'Monde des blocs', img: '/images/illustration-styles/monde-des-blocs.jpg' },
    { name: 'Papier decoupo', img: '/images/illustration-styles/papier-decoupe.jpg' },
    { name: 'Clay-animation', img: '/images/illustration-styles/clay-animation.jpg' },
    { name: 'Kawaii', img: '/images/illustration-styles/kawaii.jpg' },
    { name: 'Geometrique', img: '/images/illustration-styles/geometrique.jpg' },
    { name: 'Livre illustre', img: '/images/illustration-styles/livre-illustre.jpg' },
    { name: 'Manga', img: '/images/illustration-styles/dessin-japonais-manga.jpg' },
  ];


  const benefits = [
    { icon: '📚', label: '4 livres / mois', desc: 'Utilisez-les quand vous voulez' },
    { icon: '📖', label: '12 pages / livre', desc: '2x plus que le gratuit' },
    { icon: '🎨', label: '9 styles', desc: 'Aquarelle, 3D, manga...' },
    { icon: '👨‍👩‍👧', label: 'Personnages', desc: 'Famille, amis, animaux' },
    { icon: '🌍', label: 'Multi-langues', desc: 'FR, EN, ES, AR...' },
    { icon: '⬇️', label: 'PDF illimités', desc: 'Télécharger & imprimer' },
  ];

  const comparison = [
    { feature: 'Livres/mois', free: '1', club: '4' },
    { feature: 'Pages/livre', free: '6', club: '12' },
    { feature: 'Illustrations/livre', free: '6', club: '12' },
    { feature: "Styles d'illustration", free: '1', club: '9' },
    { feature: 'Personnages secondaires', free: '✘', club: '✔' },
    { feature: 'Multi-langues', free: '✘', club: '✔' },
    { feature: 'PDF téléchargeable', free: '✔', club: '✔' },
  ];

  const ctaLabel = isClub
    ? 'Accéder à ma bibliothèque'
    : isAuthenticated
      ? 'Rejoindre le Club'
      : 'Commencer maintenant';

  return (
    <Page>
      <Header />
      <main>

        {/* ═══ HERO ═══ */}
        <HeroSection>
          <HeroContent>
            <HeroBadge>Club des Histoires</HeroBadge>
            <HeroTitle>Offrez des histoires illimitées à votre enfant</HeroTitle>
            <HeroSub>
              4 livres de 12 pages chaque mois, avec son prénom et son visage.
            </HeroSub>

            {/* Floating books — real book covers */}
            <HeroVisual>
              {[
                { src: '/images/covers/emma-noel.jpg', alt: 'Emma et le Noël enchanté' },
                { src: '/images/covers/hajar-ramadan.jpg', alt: 'Hajar et le Ramadan' },
                { src: '/images/covers/younes-paques.jpg', alt: 'Younès et Pâques' },
                { src: '/images/covers/adele-carnaval.jpg', alt: 'Adèle au Carnaval' },
                { src: '/images/covers/forest-adventure.jpg', alt: 'Roméo et la forêt enchantée' },
              ].map((book, i) => (
                <FloatingBook key={book.alt} $delay={i}>
                  <img src={book.src} alt={book.alt} />
                </FloatingBook>
              ))}
            </HeroVisual>

            <ShimmerCTA onClick={goToCheckout}>
              {ctaLabel}
            </ShimmerCTA>
          </HeroContent>
        </HeroSection>

        {/* ═══ HIGHLIGHTS STRIP — compact, visible immediately ═══ */}
        <Section style={{ padding: '32px 16px 16px' }}>
          <Inner>
            <div style={{
              display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px',
              scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch',
              msOverflowStyle: 'none', scrollbarWidth: 'none',
            }}>
              {[
                { icon: '📚', text: '4 livres/mois' },
                { icon: '📖', text: '12 pages' },
                { icon: '🎨', text: '9 styles' },
                { icon: '🌍', text: 'Multi-langues' },
                { icon: '⬇️', text: 'PDF illimités' },
              ].map(h => (
                <div key={h.text} style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                  borderRadius: '12px', padding: '10px 14px',
                  flexShrink: 0, scrollSnapAlign: 'start',
                  fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)',
                  whiteSpace: 'nowrap',
                }}>
                  <span style={{ fontSize: '18px' }}>{h.icon}</span>
                  {h.text}
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '12px' }}>
              <button
                onClick={() => detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                style={{
                  all: 'unset', cursor: 'pointer',
                  fontSize: '13px', fontWeight: 600,
                  color: theme.colors.accent.coral,
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                }}
              >
                Voir tous les avantages ↓
              </button>
            </div>
          </Inner>
        </Section>

        {/* ═══ BENEFITS (detailed) ═══ */}
        <Section $bg="var(--bg-secondary)" ref={detailsRef}>
          <Inner>
            <STitle>Ce que vous obtenez</STitle>
            <SSub>Tout ce qu'il faut pour créer des souvenirs magiques</SSub>
            <BenefitsGrid>
              {benefits.map((b, i) => (
                <BenefitCard key={b.label} $delay={i}>
                  <BenefitIcon>{b.icon}</BenefitIcon>
                  <BenefitLabel>{b.label}</BenefitLabel>
                  <BenefitDesc>{b.desc}</BenefitDesc>
                </BenefitCard>
              ))}
            </BenefitsGrid>
          </Inner>
        </Section>

        {/* ═══ STYLES CAROUSEL ═══ */}
        <Section>
          <Inner>
            <STitle>9 styles d'illustration</STitle>
            <SSub>Chaque livre a son univers visuel unique</SSub>
          </Inner>
          <CarouselWrapper>
            <CarouselTrack>
              {[...illustrationStyles, ...illustrationStyles].map((s, i) => (
                <StyleCard key={`${s.name}-${i}`}>
                  <StyleImg $src={s.img} />
                  <StyleName>{s.name}</StyleName>
                </StyleCard>
              ))}
            </CarouselTrack>
          </CarouselWrapper>
        </Section>

        {/* ═══ COMPARISON ═══ */}
        <Section $bg="var(--bg-secondary)">
          <Inner>
            <STitle>Gratuit vs Club</STitle>
            <SSub>Pourquoi passer au Club ?</SSub>
            <ComparisonTable>
              <CompHeader>Fonctionnalité</CompHeader>
              <CompHeader>Gratuit</CompHeader>
              <CompHeader $highlight>Club</CompHeader>
              {comparison.map((row, i) => (
                <React.Fragment key={row.feature}>
                  <CompFeature $last={i === comparison.length - 1}>{row.feature}</CompFeature>
                  <CompCell $last={i === comparison.length - 1}>{row.free}</CompCell>
                  <CompCell $highlight $last={i === comparison.length - 1}>
                    <strong>{row.club}</strong>
                  </CompCell>
                </React.Fragment>
              ))}
            </ComparisonTable>
          </Inner>
        </Section>

        {/* ═══ TESTIMONIAL ═══ */}
        <Section>
          <Inner>
            <TestimonialCard>
              <p style={{ fontSize: '32px', margin: '0 0 12px' }}>⭐⭐⭐⭐⭐</p>
              <p style={{
                fontSize: theme.fontSizes.base, color: 'var(--text-primary)',
                fontStyle: 'italic', lineHeight: 1.6, margin: '0 0 12px',
              }}>
                "Ma fille attend chaque semaine sa nouvelle histoire. Elle adore voir son prénom
                et reconnaître sa famille dans les illustrations !"
              </p>
              <p style={{ fontSize: theme.fontSizes.sm, color: 'var(--text-light)', margin: 0 }}>
                — Sarah, maman de Lea (4 ans)
              </p>
            </TestimonialCard>
          </Inner>
        </Section>

      </main>
      <Footer />
    </Page>
  );
};

export default ClubPage;

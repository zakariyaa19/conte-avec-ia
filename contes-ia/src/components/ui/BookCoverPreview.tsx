import React from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../../styles/theme';

interface BookCoverPreviewProps {
  coverImageUrl?: string | null;
  isGenerating?: boolean;
  error?: string | null;
  onClick?: () => void;
}

/* --- Animations --- */

const revealPulse = keyframes`
  0% { opacity: 0; transform: perspective(800px) rotateY(15deg) scale(0.85); }
  60% { opacity: 1; transform: perspective(800px) rotateY(-3deg) scale(1.02); }
  100% { opacity: 1; transform: perspective(800px) rotateY(-2deg) scale(1); }
`;

const gradientShift = keyframes`
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
`;

const bookFloat = keyframes`
  0%, 100% { transform: translateY(0) rotateY(0deg); }
  50% { transform: translateY(-6px) rotateY(-3deg); }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
  50% { opacity: 1; transform: scale(1) rotate(180deg); }
`;

const floatMessage = keyframes`
  0% { opacity: 0; transform: translateY(10px); }
  3% { opacity: 1; transform: translateY(0); }
  14% { opacity: 1; transform: translateY(0); }
  16.5% { opacity: 0; transform: translateY(-10px); }
  100% { opacity: 0; transform: translateY(-10px); }
`;

const progressGlow = keyframes`
  0% { width: 5%; }
  50% { width: 70%; }
  100% { width: 95%; }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const orbitFloat = keyframes`
  0% { transform: rotate(0deg) translateX(50px) rotate(0deg); opacity: 0.7; }
  50% { opacity: 1; }
  100% { transform: rotate(360deg) translateX(50px) rotate(-360deg); opacity: 0.7; }
`;

const gentlePulse = keyframes`
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.15; transform: scale(1.5); }
`;

const magicSweep = keyframes`
  0% { transform: translateX(-100%) skewX(-15deg); }
  100% { transform: translateX(250%) skewX(-15deg); }
`;

const bookGlow = keyframes`
  0%, 100% {
    box-shadow:
      3px 3px 15px rgba(0, 0, 0, 0.2),
      0 0 15px rgba(255, 153, 153, 0.25),
      0 0 30px rgba(255, 153, 153, 0.1);
  }
  50% {
    box-shadow:
      3px 3px 15px rgba(0, 0, 0, 0.2),
      0 0 25px rgba(255, 153, 153, 0.45),
      0 0 50px rgba(255, 179, 186, 0.25);
  }
`;

/* --- Styled Components --- */

const PreviewWrapper = styled.div`
  width: 100%;
  max-width: 450px;
  margin: 0 auto;
  text-align: center;

  @media (max-width: ${theme.breakpoints.sm}) {
    max-width: 340px;
  }
`;

const BookContainer = styled.div`
  display: inline-block;
  width: 100%;
  perspective: 1200px;
`;

const HoverOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.35);
  opacity: 0;
  transition: opacity 0.35s ease;
  z-index: 5;
  pointer-events: none;
  padding: ${theme.spacing.xl};
`;

const HoverCTAText = styled.p`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.xl};
  color: white;
  text-align: center;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0,0,0,0.6);
  line-height: 1.4;
  margin: 0;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.lg};
  }
`;

const AIImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: filter 0.35s ease;
`;

const BookInner = styled.div<{ $revealed: boolean; $clickable: boolean }>`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow:
    -6px 6px 20px rgba(0,0,0,0.15),
    0 15px 40px rgba(0,0,0,0.12),
    0 0 0 1px rgba(0,0,0,0.04);
  animation: ${props => props.$revealed ? revealPulse : 'none'} 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  transform: perspective(800px) rotateY(-2deg);
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: ${props => props.$clickable ? 'pointer' : 'default'};

  &:hover {
    transform: perspective(800px) rotateY(0deg) scale(1.02);
  }

  &:hover ${AIImage} {
    filter: blur(3px);
  }

  &:hover ${HoverOverlay} {
    opacity: 1;
  }

  /* Spine effect */
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 12px;
    background: linear-gradient(90deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.04) 50%, transparent 100%);
    z-index: 10;
    pointer-events: none;
  }

  /* Page edge effect */
  &::after {
    content: '';
    position: absolute;
    right: -2px;
    top: 4px;
    bottom: 4px;
    width: 4px;
    background: linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(230,230,230,0.5) 100%);
    border-radius: 0 2px 2px 0;
    z-index: 10;
    pointer-events: none;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    &:hover { transform: perspective(800px) rotateY(0deg) scale(1.01); }
    &:hover ${AIImage} { filter: none; }
    &:hover ${HoverOverlay} { opacity: 0; }
  }
`;

const RatioContainer = styled.div`
  width: 100%;
  padding-bottom: 150%; /* 2:3 portrait ratio */
  position: relative;
  background: var(--bg-secondary);
`;

/* --- Loading Animation : sombre, sobre, video-like --- */

/* Background sombre avec leger shift de tons */
const MagicalLoadingScene = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(160deg, #16142a 0%, #1d1740 35%, #221a4a 70%, #16142a 100%);
  background-size: 200% 200%;
  animation: ${gradientShift} 14s ease-in-out infinite;
  overflow: hidden;
  padding: 16px;
  gap: 14px;
`;

/* Particule de poussiere tres subtile (vs gros sparkles colores) */
const DustParticle = styled.div<{ $x: string; $y: string; $delay: string; $size: string }>`
  position: absolute;
  left: ${p => p.$x};
  top: ${p => p.$y};
  width: ${p => p.$size};
  height: ${p => p.$size};
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  filter: blur(0.5px);
  opacity: 0;
  animation: ${gentlePulse} 6s ease-in-out infinite;
  animation-delay: ${p => p.$delay};
`;

/* Conteneur du livre — perspective pour un leger 3D */
const VideoBookFrame = styled.div`
  width: 65%;
  max-width: 180px;
  aspect-ratio: 3/4;
  position: relative;
  z-index: 2;
  filter: drop-shadow(0 8px 24px rgba(255, 153, 153, 0.18));

  svg {
    width: 100%;
    height: 100%;
    display: block;
  }

  /* Ligne de "scan" coral qui balaie le livre une fois toutes les 4s */
  &::after {
    content: '';
    position: absolute;
    top: 8%;
    left: 10%;
    right: 10%;
    height: 2px;
    background: linear-gradient(90deg, transparent, ${theme.colors.accent.coral}, transparent);
    box-shadow: 0 0 12px ${theme.colors.accent.coral};
    opacity: 0;
    animation: scanLine 4s ease-in-out infinite;
    border-radius: 2px;
  }

  @keyframes scanLine {
    0%   { transform: translateY(0); opacity: 0; }
    8%   { opacity: 1; }
    50%  { transform: translateY(280%); opacity: 1; }
    58%  { opacity: 0; }
    100% { opacity: 0; }
  }
`;

/* Loading title — clair sur sombre */
const LoadingTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.lg};
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
  margin: 0;
  z-index: 2;
  text-align: center;
  letter-spacing: 0.005em;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.base};
  }
`;

const LoadingSubtitle = styled.p`
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.xs};
  color: rgba(255, 255, 255, 0.55);
  margin: 0;
  z-index: 2;
  text-align: center;
`;

const RotatingMessages = styled.div`
  text-align: center;
  min-height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  z-index: 2;
`;

const MessageText = styled.p<{ $index: number; $total: number }>`
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.xs};
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
  position: absolute;
  opacity: 0;
  animation: ${floatMessage} ${p => p.$total * 3.5}s ease-in-out infinite;
  animation-delay: ${p => p.$index * 3.5}s;
  padding: 0 ${theme.spacing.lg};
  max-width: 280px;
  line-height: 1.5;
  margin: 0;
  letter-spacing: 0.005em;

  @media (max-width: ${theme.breakpoints.sm}) {
    max-width: 240px;
  }
`;

const ProgressBarContainer = styled.div`
  width: 65%;
  height: 3px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: ${theme.borderRadius.full};
  margin-top: 4px;
  overflow: hidden;
  z-index: 2;
`;

const ProgressFill = styled.div`
  height: 100%;
  border-radius: ${theme.borderRadius.full};
  background: linear-gradient(
    90deg,
    ${theme.colors.accent.coral},
    ${theme.colors.accent.softPink},
    ${theme.colors.accent.coral}
  );
  background-size: 200% 100%;
  animation:
    ${progressGlow} 18s ease-in-out forwards,
    ${shimmer} 2s ease-in-out infinite;
`;

/* --- Empty / Placeholder --- */

const PlaceholderOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.md};
  background: linear-gradient(160deg, #f8f9fa 0%, #e9ecef 100%);
`;

const PlaceholderIcon = styled.span`
  font-size: 3rem;
  opacity: 0.4;
`;

const PlaceholderText = styled.p`
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.xs};
  color: var(--text-light);
  text-align: center;
  padding: 0 ${theme.spacing.lg};
  max-width: 240px;
  line-height: 1.5;
  margin: 0;
`;

/* --- Loading Messages --- */

const LOADING_MESSAGES = [
  'Notre IA imagine votre histoire...',
  'Les personnages prennent vie...',
  'Les illustrations se dessinent...',
  'Votre conte se construit page par page...',
  'Les couleurs et les détails apparaissent...',
  'Encore quelques instants magiques...',
];

/* --- Component --- */

export const BookCoverPreview: React.FC<BookCoverPreviewProps> = React.memo(({
  coverImageUrl,
  isGenerating = false,
  error,
  onClick,
}) => {
  const hasAIImage = !!coverImageUrl;
  const isClickable = hasAIImage && !isGenerating;

  const handleClick = () => {
    if (isClickable && onClick) {
      onClick();
    }
  };

  return (
    <PreviewWrapper>
      <BookContainer>
        <BookInner
          $revealed={hasAIImage && !isGenerating}
          $clickable={isClickable}
          onClick={handleClick}
        >
          <RatioContainer>
            {/* Mode 1 : Image IA */}
            {hasAIImage && !isGenerating && (
              <>
                <AIImage src={coverImageUrl!} alt="Couverture de votre conte" loading="eager" />
                <HoverOverlay>
                  <HoverCTAText>
                    Recevoir mon conte complet maintenant
                  </HoverCTAText>
                </HoverOverlay>
              </>
            )}

            {/* Mode 2 : Génération en cours — visuel sombre, sobre, video-like */}
            {isGenerating && (
              <MagicalLoadingScene>
                {/* Particules de poussière très subtiles (au lieu de sparkles agressifs) */}
                <DustParticle $x="12%" $y="22%" $delay="0s"   $size="2px" />
                <DustParticle $x="84%" $y="18%" $delay="1.5s" $size="2px" />
                <DustParticle $x="78%" $y="74%" $delay="3s"   $size="3px" />
                <DustParticle $x="18%" $y="72%" $delay="2s"   $size="2px" />
                <DustParticle $x="50%" $y="88%" $delay="4s"   $size="2px" />

                {/* Livre SVG qui se dessine progressivement (effet vidéo) */}
                <VideoBookFrame>
                  <svg viewBox="0 0 200 270" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <defs>
                      <linearGradient id="bookFill" x1="0" y1="0" x2="200" y2="270" gradientUnits="userSpaceOnUse">
                        <stop offset="0%"  stopColor="#FF9999" stopOpacity="0.18" />
                        <stop offset="55%" stopColor="#FF7F7F" stopOpacity="0.10" />
                        <stop offset="100%" stopColor="#A78BFA" stopOpacity="0.12" />
                      </linearGradient>
                      <linearGradient id="spineFill" x1="0" y1="0" x2="0" y2="270">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.04)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                      </linearGradient>
                    </defs>

                    {/* Couverture remplie (apparait progressivement) */}
                    <rect x="20" y="18" width="160" height="234" rx="6" fill="url(#bookFill)">
                      <animate attributeName="opacity" values="0;1" dur="1.4s" begin="0.6s" fill="freeze" />
                    </rect>

                    {/* Tranche du livre */}
                    <rect x="20" y="18" width="14" height="234" fill="url(#spineFill)">
                      <animate attributeName="opacity" values="0;1" dur="0.8s" begin="1s" fill="freeze" />
                    </rect>

                    {/* Contour de couverture qui se dessine (stroke animation) */}
                    <rect
                      x="20" y="18" width="160" height="234" rx="6"
                      stroke="rgba(255,153,153,0.55)" strokeWidth="1.4" fill="none"
                      strokeDasharray="788" strokeDashoffset="788"
                    >
                      <animate attributeName="stroke-dashoffset" from="788" to="0" dur="2s" begin="0s" fill="freeze" />
                    </rect>

                    {/* Lignes de titre qui se dessinent */}
                    <line x1="48" y1="62" x2="152" y2="62"
                      stroke="rgba(255,179,186,0.7)" strokeWidth="2.5" strokeLinecap="round"
                      strokeDasharray="104" strokeDashoffset="104">
                      <animate attributeName="stroke-dashoffset" from="104" to="0" dur="1.2s" begin="2.2s" fill="freeze" />
                    </line>
                    <line x1="62" y1="78" x2="138" y2="78"
                      stroke="rgba(255,213,128,0.5)" strokeWidth="2" strokeLinecap="round"
                      strokeDasharray="76" strokeDashoffset="76">
                      <animate attributeName="stroke-dashoffset" from="76" to="0" dur="1s" begin="2.8s" fill="freeze" />
                    </line>

                    {/* Personnage stylisé — silhouette qui se dessine + remplissage */}
                    <g>
                      {/* Tête : cercle qui se dessine */}
                      <circle cx="100" cy="140" r="22"
                        stroke="rgba(255,200,180,0.85)" strokeWidth="1.8" fill="none"
                        strokeDasharray="139" strokeDashoffset="139">
                        <animate attributeName="stroke-dashoffset" from="139" to="0" dur="1.4s" begin="3.4s" fill="freeze" />
                      </circle>
                      {/* Tête remplie */}
                      <circle cx="100" cy="140" r="22" fill="rgba(255,200,180,0.18)">
                        <animate attributeName="opacity" values="0;1" dur="1s" begin="4.6s" fill="freeze" />
                      </circle>

                      {/* Corps : courbe qui se dessine */}
                      <path d="M 70 200 Q 100 175 130 200 L 130 232 L 70 232 Z"
                        stroke="rgba(167,139,250,0.7)" strokeWidth="1.8" fill="none"
                        strokeDasharray="180" strokeDashoffset="180">
                        <animate attributeName="stroke-dashoffset" from="180" to="0" dur="1.4s" begin="4s" fill="freeze" />
                      </path>
                      <path d="M 70 200 Q 100 175 130 200 L 130 232 L 70 232 Z"
                        fill="rgba(167,139,250,0.18)">
                        <animate attributeName="opacity" values="0;1" dur="1s" begin="5.4s" fill="freeze" />
                      </path>
                    </g>

                    {/* Petite étoile décorative qui pulse */}
                    <circle cx="160" cy="48" r="2" fill="rgba(255,213,128,0.9)">
                      <animate attributeName="opacity" values="0;1;0" dur="2s" begin="3s" repeatCount="indefinite" />
                      <animate attributeName="r" values="1.5;3;1.5" dur="2s" begin="3s" repeatCount="indefinite" />
                    </circle>
                  </svg>
                </VideoBookFrame>

                {/* Title */}
                <LoadingTitle>Votre conte prend vie</LoadingTitle>
                <LoadingSubtitle>Cela prend environ 30 secondes</LoadingSubtitle>

                {/* Rotating Messages */}
                <RotatingMessages>
                  {LOADING_MESSAGES.map((msg, i) => (
                    <MessageText key={i} $index={i} $total={LOADING_MESSAGES.length}>
                      {msg}
                    </MessageText>
                  ))}
                </RotatingMessages>

                {/* Progress Bar — fine, sur fond sombre */}
                <ProgressBarContainer>
                  <ProgressFill />
                </ProgressBarContainer>
              </MagicalLoadingScene>
            )}

            {/* Mode 3 : Placeholder */}
            {!hasAIImage && !isGenerating && !error && (
              <PlaceholderOverlay>
                <PlaceholderIcon>{'\uD83D\uDCD6'}</PlaceholderIcon>
                <PlaceholderText>
                  Votre couverture personnalisée apparaîtra ici
                </PlaceholderText>
              </PlaceholderOverlay>
            )}

            {/* Mode 4 : Erreur */}
            {!hasAIImage && !isGenerating && error && (
              <PlaceholderOverlay>
                <PlaceholderIcon>{'\u26A0\uFE0F'}</PlaceholderIcon>
                <PlaceholderText>
                  {error}
                </PlaceholderText>
              </PlaceholderOverlay>
            )}
          </RatioContainer>
        </BookInner>
      </BookContainer>
    </PreviewWrapper>
  );
});

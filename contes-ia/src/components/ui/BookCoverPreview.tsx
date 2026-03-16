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

/* --- Magical Loading Animation --- */

const MagicalLoadingScene = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(160deg, #fef3e8 0%, #fce4ec 25%, #e8eaf6 50%, #f3e5f5 75%, #fef3e8 100%);
  background-size: 400% 400%;
  animation: ${gradientShift} 10s ease-in-out infinite;
  overflow: hidden;
`;

/* Soft ambient glow circles */
const AmbientGlow = styled.div<{ $x: string; $y: string; $color: string; $delay: string; $size: string }>`
  position: absolute;
  left: ${p => p.$x};
  top: ${p => p.$y};
  width: ${p => p.$size};
  height: ${p => p.$size};
  border-radius: 50%;
  background: ${p => p.$color};
  filter: blur(30px);
  animation: ${gentlePulse} 6s ease-in-out infinite;
  animation-delay: ${p => p.$delay};
  pointer-events: none;
`;

/* Large animated book */
const AnimatedBook = styled.div`
  width: 130px;
  height: 170px;
  perspective: 400px;
  margin-bottom: ${theme.spacing.lg};
  z-index: 2;

  @media (max-width: ${theme.breakpoints.sm}) {
    width: 100px;
    height: 130px;
  }
`;

const BookBody = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  animation: ${bookFloat} 4s ease-in-out infinite;
`;

const BookCoverShape = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(145deg, ${theme.colors.accent.coral}, #e8456b, ${theme.colors.accent.softPink});
  border-radius: 4px 8px 8px 4px;
  animation: ${bookGlow} 3s ease-in-out infinite;
  overflow: hidden;

  /* Spine */
  &::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 7px;
    background: linear-gradient(90deg, rgba(0,0,0,0.25), rgba(0,0,0,0.05));
    border-radius: 4px 0 0 4px;
  }

  /* Star decoration on cover */
  &::after {
    content: '';
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 30px; height: 30px;
    border: 2.5px solid rgba(255,255,255,0.4);
    border-radius: 50%;
    box-shadow: 0 0 12px rgba(255,255,255,0.2);
  }
`;

const MagicSweepOverlay = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 4px 8px 8px 4px;
  overflow: hidden;
  pointer-events: none;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 40%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.35) 40%,
      rgba(255, 255, 255, 0.5) 50%,
      rgba(255, 255, 255, 0.35) 60%,
      rgba(255, 255, 255, 0) 100%
    );
    animation: ${magicSweep} 3s ease-in-out infinite;
  }
`;

const SparkleElement = styled.div<{ $x: string; $y: string; $delay: string; $size: string }>`
  position: absolute;
  left: ${p => p.$x};
  top: ${p => p.$y};
  width: ${p => p.$size};
  height: ${p => p.$size};
  animation: ${sparkle} 2.5s ease-in-out infinite;
  animation-delay: ${p => p.$delay};
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${theme.colors.accent.coral};
    clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  }
`;

/* Orbiting particle */
const OrbitParticle = styled.div<{ $delay: string; $duration: string; $size: string; $color: string }>`
  position: absolute;
  top: 50%; left: 50%;
  width: ${p => p.$size};
  height: ${p => p.$size};
  border-radius: 50%;
  background: ${p => p.$color};
  animation: ${orbitFloat} ${p => p.$duration} linear infinite;
  animation-delay: ${p => p.$delay};
  z-index: 1;
`;

/* Loading title */
const LoadingTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.lg};
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 4px;
  z-index: 2;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.base};
  }
`;

const LoadingSubtitle = styled.p`
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.xs};
  color: var(--text-light);
  margin: 0 0 ${theme.spacing.md};
  z-index: 2;
`;

const RotatingMessages = styled.div`
  text-align: center;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  margin-top: ${theme.spacing.sm};
  z-index: 2;
`;

const MessageText = styled.p<{ $index: number; $total: number }>`
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.sm};
  color: var(--text-secondary);
  font-weight: 600;
  position: absolute;
  opacity: 0;
  animation: ${floatMessage} ${p => p.$total * 3.5}s ease-in-out infinite;
  animation-delay: ${p => p.$index * 3.5}s;
  padding: 0 ${theme.spacing.lg};
  max-width: 280px;
  line-height: 1.5;
  margin: 0;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.xs};
    max-width: 240px;
  }
`;

const ProgressBarContainer = styled.div`
  width: 65%;
  height: 6px;
  background: var(--border-color);
  border-radius: ${theme.borderRadius.full};
  margin-top: ${theme.spacing.lg};
  overflow: hidden;
  z-index: 2;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.04);
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
  'Les couleurs et les details apparaissent...',
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

            {/* Mode 2 : Generation en cours */}
            {isGenerating && (
              <MagicalLoadingScene>
                {/* Ambient glows */}
                <AmbientGlow $x="10%" $y="20%" $color="rgba(255,154,139,0.3)" $delay="0s" $size="80px" />
                <AmbientGlow $x="70%" $y="60%" $color="rgba(179,157,219,0.25)" $delay="2s" $size="100px" />
                <AmbientGlow $x="50%" $y="10%" $color="rgba(255,213,180,0.3)" $delay="4s" $size="70px" />

                {/* Sparkles */}
                <SparkleElement $x="10%" $y="15%" $delay="0s" $size="12px" />
                <SparkleElement $x="85%" $y="10%" $delay="0.5s" $size="8px" />
                <SparkleElement $x="78%" $y="75%" $delay="1s" $size="11px" />
                <SparkleElement $x="15%" $y="70%" $delay="1.5s" $size="14px" />
                <SparkleElement $x="90%" $y="40%" $delay="0.3s" $size="7px" />
                <SparkleElement $x="5%" $y="42%" $delay="0.8s" $size="9px" />
                <SparkleElement $x="50%" $y="85%" $delay="1.8s" $size="10px" />
                <SparkleElement $x="35%" $y="8%" $delay="2.2s" $size="6px" />

                {/* Orbiting particles */}
                <OrbitParticle $delay="0s" $duration="8s" $size="5px" $color={`${theme.colors.accent.coral}80`} />
                <OrbitParticle $delay="2s" $duration="10s" $size="4px" $color={`${theme.colors.accent.softPink}90`} />
                <OrbitParticle $delay="4s" $duration="7s" $size="3px" $color="rgba(179,157,219,0.6)" />

                {/* Animated Book */}
                <AnimatedBook>
                  <BookBody>
                    <BookCoverShape />
                    <MagicSweepOverlay />
                  </BookBody>
                </AnimatedBook>

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

                {/* Progress Bar */}
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

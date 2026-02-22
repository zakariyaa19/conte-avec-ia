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

const bookOpen = keyframes`
  0%, 100% { transform: rotateY(0deg); }
  50% { transform: rotateY(-25deg); }
`;

const pageTurn = keyframes`
  0% { transform: rotateY(0deg); opacity: 1; }
  50% { transform: rotateY(-80deg); opacity: 0.6; }
  100% { transform: rotateY(0deg); opacity: 1; }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
  50% { opacity: 1; transform: scale(1) rotate(180deg); }
`;

const floatMessage = keyframes`
  0% { opacity: 0; transform: translateY(10px); }
  5% { opacity: 1; transform: translateY(0); }
  28% { opacity: 1; transform: translateY(0); }
  33% { opacity: 0; transform: translateY(-10px); }
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
  background: ${theme.colors.background.secondary};
`;

/* --- Magical Loading Animation --- */

const MagicalLoadingScene = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(160deg, #fef3e8 0%, #fce4ec 35%, #e8eaf6 65%, #fef3e8 100%);
  background-size: 300% 300%;
  animation: ${gradientShift} 8s ease-in-out infinite;
  overflow: hidden;
`;

const AnimatedBook = styled.div`
  width: 70px;
  height: 90px;
  perspective: 300px;
  margin-bottom: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.sm}) {
    width: 56px;
    height: 72px;
  }
`;

const BookBody = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  animation: ${bookOpen} 3s ease-in-out infinite;
`;

const BookCoverShape = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.accent.softPink});
  border-radius: 3px 6px 6px 3px;
  box-shadow: 2px 2px 10px rgba(0,0,0,0.15);

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 5px;
    background: linear-gradient(90deg, rgba(0,0,0,0.2), transparent);
    border-radius: 3px 0 0 3px;
  }

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255,255,255,0.5);
    border-radius: 50%;
  }
`;

const BookPage = styled.div<{ $delay: number }>`
  position: absolute;
  top: 3px;
  right: 3px;
  bottom: 3px;
  left: 6px;
  background: white;
  border-radius: 0 4px 4px 0;
  transform-origin: left center;
  animation: ${pageTurn} 3s ease-in-out infinite;
  animation-delay: ${props => props.$delay}s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);

  &::before {
    content: '';
    position: absolute;
    top: 15%;
    left: 15%;
    right: 15%;
    height: 3px;
    background: rgba(0,0,0,0.06);
    border-radius: 2px;
  }

  &::after {
    content: '';
    position: absolute;
    top: 30%;
    left: 15%;
    right: 25%;
    height: 3px;
    background: rgba(0,0,0,0.04);
    border-radius: 2px;
  }
`;

const SparkleElement = styled.div<{ $x: string; $y: string; $delay: string; $size: string }>`
  position: absolute;
  left: ${props => props.$x};
  top: ${props => props.$y};
  width: ${props => props.$size};
  height: ${props => props.$size};
  animation: ${sparkle} 2.5s ease-in-out infinite;
  animation-delay: ${props => props.$delay};

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${theme.colors.accent.coral};
    clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  }
`;

const RotatingMessages = styled.div`
  text-align: center;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  margin-top: ${theme.spacing.sm};
`;

const MessageText = styled.p<{ $index: number; $total: number }>`
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
  font-weight: 500;
  position: absolute;
  opacity: 0;
  animation: ${floatMessage} ${props => props.$total * 3}s ease-in-out infinite;
  animation-delay: ${props => props.$index * 3}s;
  padding: 0 ${theme.spacing.lg};
  max-width: 260px;
  line-height: 1.5;
  margin: 0;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.xs};
    max-width: 220px;
  }
`;

const ProgressBarContainer = styled.div`
  width: 55%;
  height: 4px;
  background: rgba(0,0,0,0.06);
  border-radius: ${theme.borderRadius.full};
  margin-top: ${theme.spacing.lg};
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  border-radius: ${theme.borderRadius.full};
  background: linear-gradient(
    90deg,
    ${theme.colors.accent.coral}80,
    ${theme.colors.accent.softPink},
    ${theme.colors.accent.coral}80
  );
  background-size: 200% 100%;
  animation:
    ${progressGlow} 15s ease-in-out forwards,
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
  color: ${theme.colors.text.light};
  text-align: center;
  padding: 0 ${theme.spacing.lg};
  max-width: 240px;
  line-height: 1.5;
  margin: 0;
`;

/* --- Loading Messages --- */

const LOADING_MESSAGES = [
  'Création de votre histoire...',
  'Illustration en cours...',
  'Votre conte prend vie...',
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
            {/* Mode 1 : Image IA générée + hover overlay */}
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

            {/* Mode 2 : Génération en cours — animation magique */}
            {isGenerating && (
              <MagicalLoadingScene>
                {/* Sparkles */}
                <SparkleElement $x="12%" $y="18%" $delay="0s" $size="10px" />
                <SparkleElement $x="82%" $y="12%" $delay="0.6s" $size="7px" />
                <SparkleElement $x="75%" $y="72%" $delay="1.2s" $size="9px" />
                <SparkleElement $x="18%" $y="68%" $delay="1.8s" $size="12px" />
                <SparkleElement $x="88%" $y="42%" $delay="0.4s" $size="6px" />
                <SparkleElement $x="8%" $y="45%" $delay="1s" $size="8px" />

                {/* Animated Book */}
                <AnimatedBook>
                  <BookBody>
                    <BookPage $delay={0.4} />
                    <BookPage $delay={0.8} />
                    <BookCoverShape />
                  </BookBody>
                </AnimatedBook>

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

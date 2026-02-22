import React from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../../styles/theme';

interface BookCoverPreviewProps {
  coverImageUrl?: string | null;
  isGenerating?: boolean;
  error?: string | null;
  onRegenerate?: () => void;
}

/* --- Animations --- */

const revealPulse = keyframes`
  0% { opacity: 0; transform: perspective(800px) rotateY(15deg) scale(0.85); }
  60% { opacity: 1; transform: perspective(800px) rotateY(-3deg) scale(1.02); }
  100% { opacity: 1; transform: perspective(800px) rotateY(-2deg) scale(1); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
`;

const dotBounce = keyframes`
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
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

const BookInner = styled.div<{ $revealed: boolean }>`
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

  &:hover {
    transform: perspective(800px) rotateY(0deg) scale(1.02);
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
  }
`;

const RatioContainer = styled.div`
  width: 100%;
  padding-bottom: 150%; /* 2:3 portrait ratio */
  position: relative;
  background: ${theme.colors.background.secondary};
`;

/* --- AI Image --- */

const AIImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

/* --- Loading State --- */

const LoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.lg};
  background: linear-gradient(160deg, #fef3e8 0%, #fce4ec 50%, #e8eaf6 100%);
`;

const LoadingIcon = styled.span`
  font-size: 3.5rem;
  animation: ${pulse} 2s ease-in-out infinite;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 2.5rem;
  }
`;

const LoadingText = styled.p`
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
  font-weight: 500;
  animation: ${pulse} 2s ease-in-out infinite;
  text-align: center;
  padding: 0 ${theme.spacing.lg};
  max-width: 280px;
  line-height: 1.5;
  margin: 0;
`;

const ShimmerBar = styled.div`
  width: 50%;
  height: 6px;
  border-radius: ${theme.borderRadius.full};
  background: linear-gradient(
    90deg,
    rgba(0,0,0,0.05) 0%,
    rgba(0,0,0,0.12) 50%,
    rgba(0,0,0,0.05) 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;
`;

const LoadingDots = styled.div`
  display: flex;
  gap: 6px;
  margin-top: ${theme.spacing.xs};
`;

const Dot = styled.span<{ $delay: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${theme.colors.accent.coral};
  display: inline-block;
  animation: ${dotBounce} 1.4s ease-in-out infinite;
  animation-delay: ${props => props.$delay};
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

/* --- Actions --- */

const ActionRow = styled.div`
  display: flex;
  justify-content: center;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.md};
`;

const RegenerateButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  border: 1.5px solid ${theme.colors.accent.coral};
  border-radius: ${theme.borderRadius.full};
  background: transparent;
  color: ${theme.colors.accent.coral};
  font-size: ${theme.fontSizes.xs};
  font-weight: 600;
  font-family: ${theme.fonts.body};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${theme.colors.accent.coral};
    color: #fff;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorBanner = styled.div`
  margin-top: ${theme.spacing.sm};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  background: #fff3f3;
  border: 1px solid #ffe0e0;
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.text.secondary};
  font-family: ${theme.fonts.body};
  line-height: 1.5;
`;

/* --- Component --- */

export const BookCoverPreview: React.FC<BookCoverPreviewProps> = React.memo(({
  coverImageUrl,
  isGenerating = false,
  error,
  onRegenerate,
}) => {
  const hasAIImage = !!coverImageUrl;

  return (
    <PreviewWrapper>
      <BookContainer>
        <BookInner $revealed={hasAIImage && !isGenerating}>
          <RatioContainer>
            {/* Mode 1 : Image IA generee */}
            {hasAIImage && !isGenerating && (
              <AIImage src={coverImageUrl!} alt="Couverture de votre conte" loading="eager" />
            )}

            {/* Mode 2 : Generation en cours */}
            {isGenerating && (
              <LoadingOverlay>
                <LoadingIcon>{'\uD83C\uDFA8'}</LoadingIcon>
                <LoadingText>
                  Notre IA illustre votre conte personnalisé...
                </LoadingText>
                <ShimmerBar />
                <LoadingDots>
                  <Dot $delay="0s" />
                  <Dot $delay="0.2s" />
                  <Dot $delay="0.4s" />
                </LoadingDots>
              </LoadingOverlay>
            )}

            {/* Mode 3 : Placeholder (avant toute generation) */}
            {!hasAIImage && !isGenerating && !error && (
              <PlaceholderOverlay>
                <PlaceholderIcon>{'\uD83D\uDCD6'}</PlaceholderIcon>
                <PlaceholderText>
                  Votre couverture personnalisée apparaîtra ici
                </PlaceholderText>
              </PlaceholderOverlay>
            )}

            {/* Mode 4 : Erreur sans image */}
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

      {/* Bouton Regenerer + Erreur */}
      <ActionRow>
        {hasAIImage && onRegenerate && (
          <RegenerateButton onClick={onRegenerate} disabled={isGenerating}>
            {'\uD83D\uDD04'} Régénérer la couverture
          </RegenerateButton>
        )}
      </ActionRow>
      {error && hasAIImage && !isGenerating && (
        <ErrorBanner>
          {error}
          {onRegenerate && (
            <RegenerateButton onClick={onRegenerate} style={{ marginLeft: '8px', marginTop: '4px' }}>
              Réessayer
            </RegenerateButton>
          )}
        </ErrorBanner>
      )}
    </PreviewWrapper>
  );
});

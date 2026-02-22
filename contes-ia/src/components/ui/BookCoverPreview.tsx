import React, { useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../../styles/theme';
import { StoryFormData } from '../../types/FormTypes';
import { generateCoverTitle, generateCoverSubtitle } from '../../utils/coverTitleGenerator';
import { getCoverPalette, getStyleTreatment } from '../../utils/coverThemeConfig';

interface BookCoverPreviewProps {
  formData: Partial<StoryFormData>;
  coverImageUrl?: string | null;
  isGenerating?: boolean;
  error?: string | null;
  onRegenerate?: () => void;
}

/* ─── Animations ─── */

const slideInUp = keyframes`
  from { opacity: 0; transform: translateY(30px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const floatAnim = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

/* ─── Styled Components ─── */

const PreviewWrapper = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto ${theme.spacing.xl};
  text-align: center;
  animation: ${slideInUp} 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
`;

const PreviewHeading = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.lg};
  margin: 0 0 ${theme.spacing.md};
  background: linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.accent.softPink});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.base};
    margin-bottom: ${theme.spacing.sm};
  }
`;

const BookContainer = styled.div`
  display: inline-block;
  width: 85%;
  max-width: 620px;
  perspective: 1200px;

  @media (max-width: ${theme.breakpoints.sm}) {
    width: 95%;
  }
`;

const BookInner = styled.div<{ $radius: string }>`
  position: relative;
  transform: rotateY(-3deg);
  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  border-radius: ${props => props.$radius};
  overflow: hidden;
  box-shadow:
    -4px 4px 12px rgba(0,0,0,0.08),
    0 12px 30px rgba(0,0,0,0.12),
    0 0 0 1px rgba(0,0,0,0.04);

  &:hover {
    transform: rotateY(0deg) scale(1.02);
  }

  /* Spine effect */
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 10px;
    background: linear-gradient(90deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.03) 60%, transparent 100%);
    z-index: 10;
    pointer-events: none;
  }

  /* Page edge effect */
  &::after {
    content: '';
    position: absolute;
    right: -2px;
    top: 3px;
    bottom: 3px;
    width: 3px;
    background: linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(240,240,240,0.5) 100%);
    border-radius: 0 2px 2px 0;
    z-index: 10;
    pointer-events: none;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    transform: rotateY(-1.5deg);
    &:hover { transform: rotateY(0deg) scale(1.01); }
  }
`;

const RatioContainer = styled.div`
  width: 100%;
  padding-bottom: 57.14%;
  position: relative;
`;

/* ─── Mode Image IA ─── */

const AIImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  animation: ${fadeIn} 0.6s ease;
`;

const TextOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 5% 6%;
  z-index: 5;
  pointer-events: none;
`;

const OverlayTitle = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: clamp(0.9rem, 3.5vw, 1.5rem);
  color: #fff;
  margin: 0;
  line-height: 1.3;
  text-align: center;
  text-shadow: 0 2px 8px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.3);
  word-break: break-word;
  padding: 6px 12px;
  background: rgba(0,0,0,0.25);
  border-radius: ${theme.borderRadius.lg};
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  align-self: center;
  max-width: 90%;
`;

const OverlaySubtitle = styled.p`
  font-family: ${theme.fonts.body};
  font-size: clamp(0.55rem, 1.8vw, 0.75rem);
  font-style: italic;
  color: rgba(255,255,255,0.9);
  text-shadow: 0 1px 4px rgba(0,0,0,0.4);
  margin: 4px 0 0;
  text-align: center;
`;

const OverlayBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: ${theme.spacing.sm};
`;

const OverlayPill = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: ${theme.borderRadius.full};
  background: rgba(0,0,0,0.35);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  font-family: ${theme.fonts.body};
  font-size: clamp(0.5rem, 1.6vw, 0.65rem);
  font-weight: 600;
  color: rgba(255,255,255,0.9);
`;

const OverlayCredit = styled.span`
  font-family: ${theme.fonts.body};
  font-size: clamp(0.45rem, 1.3vw, 0.55rem);
  color: rgba(255,255,255,0.7);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
  text-shadow: 0 1px 3px rgba(0,0,0,0.4);
`;

/* ─── Mode Loading ─── */

const LoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.md};
  z-index: 6;
`;

const ShimmerBar = styled.div`
  width: 60%;
  height: 8px;
  border-radius: ${theme.borderRadius.full};
  background: linear-gradient(
    90deg,
    rgba(255,255,255,0.2) 0%,
    rgba(255,255,255,0.5) 50%,
    rgba(255,255,255,0.2) 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;
`;

const LoadingText = styled.p`
  font-family: ${theme.fonts.body};
  font-size: clamp(0.7rem, 2vw, 0.85rem);
  color: rgba(0,0,0,0.5);
  font-weight: 500;
  animation: ${pulse} 2s ease-in-out infinite;
  text-align: center;
  padding: 0 ${theme.spacing.md};
`;

const LoadingIcon = styled.span`
  font-size: clamp(2rem, 6vw, 3rem);
  animation: ${pulse} 2s ease-in-out infinite;
`;

/* ─── Boutons ─── */

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
  border: 1px solid ${theme.colors.accent.coral};
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
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.background.secondary};
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.text.secondary};
  font-family: ${theme.fonts.body};
`;

/* ─── Fallback CSS Components ─── */

const BackgroundLayer = styled.div<{ $primary: string; $secondary: string }>`
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, ${props => props.$primary} 0%, ${props => props.$secondary} 100%);
  transition: background 0.8s ease;
`;

const StyleLayer = styled.div<{ $bgExtra: string }>`
  position: absolute;
  inset: 0;
  background-image: ${props => props.$bgExtra};
  pointer-events: none;
`;

const DecorationLayer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
`;

const FloatingEmoji = styled.span<{ $x: string; $y: string; $delay: string; $size: string; $extraStyle: string }>`
  position: absolute;
  left: ${props => props.$x};
  top: ${props => props.$y};
  font-size: ${props => props.$size};
  animation: ${floatAnim} 6s ease-in-out infinite;
  animation-delay: ${props => props.$delay};
  ${props => props.$extraStyle}
`;

const FallbackContentLayer = styled.div`
  position: absolute;
  inset: 0;
  padding: 8%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 5;

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: 6%;
  }
`;

const FallbackTopRow = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const FallbackBadge = styled.span<{ $accent: string }>`
  display: inline-flex;
  padding: 4px 12px;
  border-radius: ${theme.borderRadius.full};
  font-size: clamp(0.55rem, 1.8vw, 0.7rem);
  font-weight: 600;
  font-family: ${theme.fonts.body};
  color: ${props => props.$accent};
  background: rgba(255,255,255,0.55);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.3);
`;

const FallbackCenter = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FallbackTitle = styled.h2<{ $color: string; $extraStyle: string }>`
  font-family: ${theme.fonts.heading};
  font-size: clamp(1rem, 4vw, 1.7rem);
  color: ${props => props.$color};
  margin: 0;
  line-height: 1.3;
  text-align: center;
  max-width: 85%;
  word-break: break-word;
  ${props => props.$extraStyle}
`;

const FallbackBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: ${theme.spacing.sm};
`;

const FallbackPill = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: ${theme.borderRadius.full};
  background: rgba(255,255,255,0.6);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.3);
  font-family: ${theme.fonts.body};
  font-size: clamp(0.55rem, 1.8vw, 0.7rem);
  font-weight: 600;
  color: rgba(0,0,0,0.6);
`;

const FallbackCredit = styled.span<{ $color: string }>`
  font-family: ${theme.fonts.body};
  font-size: clamp(0.5rem, 1.5vw, 0.6rem);
  color: ${props => props.$color};
  opacity: 0.5;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
`;

/* ─── Positions des decorations ─── */

const DECO_POSITIONS = [
  { x: '8%',  y: '10%', size: 'clamp(1rem, 3vw, 1.5rem)', delay: '0s' },
  { x: '85%', y: '8%',  size: 'clamp(1.2rem, 3.5vw, 1.8rem)', delay: '1s' },
  { x: '5%',  y: '75%', size: 'clamp(0.9rem, 2.5vw, 1.3rem)', delay: '2s' },
  { x: '88%', y: '70%', size: 'clamp(1rem, 3vw, 1.6rem)', delay: '3s' },
  { x: '45%', y: '5%',  size: 'clamp(0.8rem, 2vw, 1.1rem)', delay: '4s' },
];

/* ─── Composant ─── */

export const BookCoverPreview: React.FC<BookCoverPreviewProps> = React.memo(({
  formData,
  coverImageUrl,
  isGenerating = false,
  error,
  onRegenerate,
}) => {
  const palette = useMemo(
    () => getCoverPalette(formData.specificSubject, formData.generalTheme),
    [formData.specificSubject, formData.generalTheme]
  );

  const treatment = useMemo(
    () => getStyleTreatment(formData.illustrationStyle),
    [formData.illustrationStyle]
  );

  const title = useMemo(
    () => generateCoverTitle(
      formData.protagonistName || '',
      formData.specificSubject,
      formData.generalTheme
    ),
    [formData.protagonistName, formData.specificSubject, formData.generalTheme]
  );

  const subtitle = useMemo(
    () => generateCoverSubtitle(formData.centralMessage),
    [formData.centralMessage]
  );

  const genderIcon = formData.protagonistGender === 'girl' ? '\uD83D\uDC67' : formData.protagonistGender === 'boy' ? '\uD83D\uDC66' : '\u2728';
  const creatorName = formData.creatorName || 'Contes d\'IA';
  const protagonistLabel = [
    formData.protagonistName,
    formData.protagonistAge ? `${formData.protagonistAge} ans` : null,
  ].filter(Boolean).join(', ');

  const hasAIImage = !!coverImageUrl;

  return (
    <PreviewWrapper>
      <PreviewHeading>
        {hasAIImage ? 'Apercu de votre conte' : isGenerating ? 'Creation de votre couverture...' : 'Apercu de votre conte'}
      </PreviewHeading>
      <BookContainer>
        <BookInner $radius={treatment.borderRadius}>
          <RatioContainer>
            {/* Mode 1 : Image IA generee */}
            {hasAIImage && !isGenerating && (
              <>
                <AIImage src={coverImageUrl!} alt="Couverture du conte" />
                <TextOverlay>
                  <div />
                  <div style={{ textAlign: 'center' }}>
                    <OverlayTitle>{title}</OverlayTitle>
                    {subtitle && <OverlaySubtitle>{subtitle}</OverlaySubtitle>}
                  </div>
                  <OverlayBottom>
                    <OverlayPill>
                      <span>{genderIcon}</span>
                      <span>{protagonistLabel}</span>
                    </OverlayPill>
                    <OverlayCredit>Par {creatorName}</OverlayCredit>
                  </OverlayBottom>
                </TextOverlay>
              </>
            )}

            {/* Mode 2 : Generation en cours */}
            {isGenerating && (
              <>
                <BackgroundLayer $primary={palette.primary} $secondary={palette.secondary} />
                <StyleLayer $bgExtra={treatment.backgroundExtra} />
                <LoadingOverlay>
                  <LoadingIcon>{'\uD83C\uDFA8'}</LoadingIcon>
                  <LoadingText>Notre IA cree votre couverture personnalisee...</LoadingText>
                  <ShimmerBar />
                </LoadingOverlay>
              </>
            )}

            {/* Mode 3 : Fallback CSS (pas d'image, pas de generation en cours) */}
            {!hasAIImage && !isGenerating && (
              <>
                <BackgroundLayer $primary={palette.primary} $secondary={palette.secondary} />
                <StyleLayer $bgExtra={treatment.backgroundExtra} />
                <DecorationLayer>
                  {palette.decorations.slice(0, 5).map((emoji, i) => (
                    <FloatingEmoji
                      key={`${emoji}-${i}`}
                      $x={DECO_POSITIONS[i].x}
                      $y={DECO_POSITIONS[i].y}
                      $size={DECO_POSITIONS[i].size}
                      $delay={DECO_POSITIONS[i].delay}
                      $extraStyle={treatment.decorationStyle}
                    >
                      {emoji}
                    </FloatingEmoji>
                  ))}
                </DecorationLayer>
                <FallbackContentLayer>
                  <FallbackTopRow>
                    {subtitle && (
                      <FallbackBadge $accent={palette.accent}>{subtitle}</FallbackBadge>
                    )}
                  </FallbackTopRow>
                  <FallbackCenter>
                    <FallbackTitle $color={palette.textColor} $extraStyle={treatment.titleStyle}>
                      {title}
                    </FallbackTitle>
                  </FallbackCenter>
                  <FallbackBottom>
                    <FallbackPill>
                      <span>{genderIcon}</span>
                      <span>{protagonistLabel}</span>
                    </FallbackPill>
                    <FallbackCredit $color={palette.textColor}>
                      Par {creatorName}
                    </FallbackCredit>
                  </FallbackBottom>
                </FallbackContentLayer>
              </>
            )}
          </RatioContainer>
        </BookInner>
      </BookContainer>

      {/* Bouton Regenerer + Erreur */}
      <ActionRow>
        {hasAIImage && onRegenerate && (
          <RegenerateButton onClick={onRegenerate} disabled={isGenerating}>
            {'\uD83D\uDD04'} Regenerer
          </RegenerateButton>
        )}
      </ActionRow>
      {error && !isGenerating && (
        <ErrorBanner>
          {error}. Votre conte sera cree normalement.
          {onRegenerate && (
            <RegenerateButton onClick={onRegenerate} style={{ marginLeft: '8px' }}>
              Reessayer
            </RegenerateButton>
          )}
        </ErrorBanner>
      )}
    </PreviewWrapper>
  );
});

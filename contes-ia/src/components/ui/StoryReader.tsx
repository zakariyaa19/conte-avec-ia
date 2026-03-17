import React, { useRef, useState, useEffect, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { theme } from '../../styles/theme';
import { getImageUrl } from '../../config/constants';

/* ═══════════════════════════════════════════
   STORY READER — TikTok-style vertical scroll
   Full-screen, snap scrolling, mobile-first
   ═══════════════════════════════════════════ */

interface StoryReaderProps {
  coverImageUrl: string | null;
  coverTitle: string;
  paragraphs: string[];
  illustrationUrls: string[];
  creatorName?: string;
  protagonistName: string;
  onClose: () => void;
  onShare?: () => void;
  onCreateAnother?: () => void;
  isShared?: boolean;
  isClub?: boolean;
}

/* ═══════════ ANIMATIONS ═══════════ */

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slowZoom = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.03); }
  100% { transform: scale(1); }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: scale(0.5); }
  50% { opacity: 1; transform: scale(1); }
`;

const progressGrow = keyframes`
  from { transform: scaleX(0); }
`;

/* ═══════════ LAYOUT ═══════════ */

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: #000;
  animation: ${fadeIn} 0.3s ease-out;
`;

const ScrollContainer = styled.div`
  height: 100vh;
  height: 100dvh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  -webkit-overflow-scrolling: touch;

  /* Hide scrollbar */
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar { display: none; }
`;

const Slide = styled.div`
  height: 100vh;
  height: 100dvh;
  width: 100%;
  scroll-snap-align: start;
  scroll-snap-stop: always;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

/* ═══════════ PROGRESS BAR ═══════════ */

const ProgressBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  z-index: 10002;
  background: rgba(255,255,255,0.1);
`;

const ProgressFill = styled.div<{ $progress: number }>`
  height: 100%;
  background: linear-gradient(90deg, ${theme.colors.accent.coral}, #FF8E53);
  width: ${props => props.$progress}%;
  transition: width 0.3s ease-out;
  border-radius: 0 2px 2px 0;
`;

/* ═══════════ TOP CONTROLS ═══════════ */

const TopControls = styled.div`
  position: fixed;
  top: 12px;
  left: 12px;
  right: 12px;
  z-index: 10003;
  display: flex;
  justify-content: space-between;
  align-items: center;
  pointer-events: none;

  > * { pointer-events: auto; }
`;

const NightModeButton = styled.button<{ $active: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: ${props => props.$active ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.4)'};
  backdrop-filter: blur(8px);
  color: ${props => props.$active ? '#FFD700' : 'white'};
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;

  &:active { transform: scale(0.9); }
`;

const CloseButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(8px);
  color: white;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;

  &:active { background: rgba(0,0,0,0.6); }
`;

/* ═══════════ PAGE INDICATOR ═══════════ */

const PageIndicator = styled.div<{ $visible: boolean }>`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10002;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(8px);
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 20px;
  transition: opacity 0.3s;
  opacity: ${props => props.$visible ? 1 : 0};
  pointer-events: none;
`;

/* ═══════════ COVER SLIDE ═══════════ */

const CoverSlide = styled(Slide)`
  background: #000;
`;

const CoverBlurBg = styled.img`
  position: absolute;
  inset: -20px;
  width: calc(100% + 40px);
  height: calc(100% + 40px);
  object-fit: cover;
  filter: blur(40px) saturate(1.3) brightness(0.7);
  transform: scale(1.1);
`;

const CoverImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  z-index: 1;
  animation: ${slowZoom} 12s ease-in-out infinite;
`;

const CoverOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(rgba(0,0,0,0.3) 0%, transparent 30%, transparent 50%, rgba(0,0,0,0.85) 100%);
  z-index: 2;
`;

const CoverContent = styled.div`
  position: relative;
  z-index: 3;
  text-align: center;
  padding: 0 20px;
  margin-top: auto;
  margin-bottom: 60px;
  animation: ${slideUp} 0.8s ease-out 0.3s both;
`;

const CoverTitle = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: 22px;
  font-weight: 800;
  color: white;
  margin: 0 auto 8px;
  line-height: 1.3;
  text-shadow: 0 2px 16px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.4);
  letter-spacing: -0.01em;
  max-width: 300px;

  @media (min-width: 768px) {
    font-size: 28px;
    max-width: 400px;
  }
`;

const CoverCreator = styled.p`
  font-size: 14px;
  color: rgba(255,255,255,0.7);
  margin: 0;
  font-weight: 500;
`;

const ScrollHint = styled.div`
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  color: rgba(255,255,255,0.5);
  font-size: 11px;
  font-weight: 500;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  animation: ${fadeIn} 1s ease-out 1.5s both;

  &::after {
    content: '';
    width: 2px;
    height: 16px;
    background: rgba(255,255,255,0.3);
    border-radius: 1px;
    animation: ${keyframes`
      0%, 100% { transform: scaleY(0.5); opacity: 0.3; }
      50% { transform: scaleY(1); opacity: 0.8; }
    `} 1.5s ease-in-out infinite;
  }
`;

/* ═══════════ TEXT SLIDE ═══════════ */

const SLIDE_COLORS_DAY = [
  { bg: '#FDF6E3', accent: '#FF9999' },  // Crème + Coral
  { bg: '#F0F7FF', accent: '#7CB9D0' },  // Bleu clair
  { bg: '#FFF5F5', accent: '#FF9999' },  // Rose
  { bg: '#F5FFF5', accent: '#6BB77B' },  // Vert
  { bg: '#FFF8F0', accent: '#FFB366' },  // Orange
  { bg: '#F8F0FF', accent: '#9B7ED8' },  // Violet
];

const SLIDE_COLORS_NIGHT = [
  { bg: '#1a1a2e', accent: '#FF9999' },
  { bg: '#16213e', accent: '#7CB9D0' },
  { bg: '#1e1525', accent: '#FF9999' },
  { bg: '#152015', accent: '#6BB77B' },
  { bg: '#1e1810', accent: '#FFB366' },
  { bg: '#1a1525', accent: '#9B7ED8' },
];

const TextSlide = styled(Slide)<{ $colorIndex: number; $night?: boolean }>`
  background: ${props => {
    const colors = props.$night ? SLIDE_COLORS_NIGHT : SLIDE_COLORS_DAY;
    return colors[props.$colorIndex % colors.length].bg;
  }};
  padding: 60px 28px 40px;
`;

const TextContent = styled.div<{ $visible: boolean }>`
  max-width: 480px;
  text-align: center;
  opacity: ${props => props.$visible ? 1 : 0};
  transform: translateY(${props => props.$visible ? 0 : '30px'});
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
`;

const PageNumber = styled.div<{ $colorIndex: number; $night?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${props => {
    const colors = props.$night ? SLIDE_COLORS_NIGHT : SLIDE_COLORS_DAY;
    return colors[props.$colorIndex % colors.length].accent + '20';
  }};
  color: ${props => {
    const colors = props.$night ? SLIDE_COLORS_NIGHT : SLIDE_COLORS_DAY;
    return colors[props.$colorIndex % colors.length].accent;
  }};
  font-family: ${theme.fonts.heading};
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 20px;
`;

const StoryText = styled.p<{ $night?: boolean }>`
  font-family: ${theme.fonts.body};
  font-size: 16px;
  line-height: 1.9;
  color: ${props => props.$night ? 'rgba(255,255,255,0.85)' : 'var(--text-primary)'};
  margin: 0;
  font-weight: 400;
  letter-spacing: 0.01em;
  transition: color 0.3s;

  @media (min-width: 768px) {
    font-size: 18px;
  }
`;

const TextDivider = styled.div<{ $colorIndex: number; $night?: boolean }>`
  width: 40px;
  height: 3px;
  border-radius: 2px;
  background: ${props => {
    const colors = props.$night ? SLIDE_COLORS_NIGHT : SLIDE_COLORS_DAY;
    return colors[props.$colorIndex % colors.length].accent + '40';
  }};
  margin: 24px auto 0;
`;

/* ═══════════ IMAGE SLIDE ═══════════ */

const ImageSlide = styled(Slide)`
  background: #000;
`;

const StoryImage = styled.img<{ $visible: boolean }>`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: ${props => props.$visible ? 1 : 0};
  transform: scale(${props => props.$visible ? 1 : 1.1});
  transition: opacity 0.8s ease-out, transform 8s ease-out;
`;

/* ═══════════ END SLIDE ═══════════ */

const EndSlide = styled(Slide)`
  background: linear-gradient(135deg, #1a1a2e, #16213e);
`;

const EndContent = styled.div`
  text-align: center;
  padding: 0 28px;
  animation: ${slideUp} 0.6s ease-out;
`;

const EndEmoji = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const EndTitle = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: 28px;
  color: white;
  margin: 0 0 8px;
  font-weight: 800;
`;

const EndSubtitle = styled.p`
  color: rgba(255,255,255,0.6);
  font-size: 14px;
  margin: 0 0 32px;
  line-height: 1.5;
`;

const EndButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 300px;
`;

const EndButton = styled.button<{ $primary?: boolean }>`
  width: 100%;
  padding: 14px;
  border-radius: 14px;
  border: ${props => props.$primary ? 'none' : '1px solid rgba(255,255,255,0.2)'};
  background: ${props => props.$primary
    ? 'linear-gradient(135deg, #FF9999, #FF7F7F)'
    : 'rgba(255,255,255,0.08)'};
  color: white;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s, opacity 0.15s;
  backdrop-filter: ${props => props.$primary ? 'none' : 'blur(8px)'};

  &:active { transform: scale(0.97); }
`;

const ClubUpsellCard = styled.div`
  background: linear-gradient(135deg, rgba(255,153,153,0.12), rgba(155,126,216,0.12));
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  padding: 16px 18px;
  margin-top: 20px;
  width: 100%;
  max-width: 300px;
  text-align: left;
  cursor: pointer;
  transition: transform 0.15s, border-color 0.2s;

  &:active { transform: scale(0.97); }
  &:hover { border-color: rgba(255,153,153,0.3); }
`;

const ClubUpsellLabel = styled.div`
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: #FF9999;
  font-weight: 700;
  margin-bottom: 8px;
`;

const ClubUpsellText = styled.p`
  font-size: 13px;
  color: rgba(255,255,255,0.7);
  margin: 0;
  line-height: 1.5;
`;

const ClubUpsellArrow = styled.span`
  display: inline-block;
  color: #FF9999;
  margin-left: 4px;
  font-size: 13px;
`;

const SharedCTA = styled.button`
  width: 100%;
  max-width: 300px;
  padding: 16px;
  border-radius: 14px;
  border: none;
  background: linear-gradient(135deg, #FF9999, #FF7F7F);
  color: white;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.15s;
  margin-top: 8px;

  &:active { transform: scale(0.97); }
`;

const Sparkle = styled.div<{ $left: string; $top: string; $delay: number; $size: number }>`
  position: absolute;
  left: ${props => props.$left};
  top: ${props => props.$top};
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  border-radius: 50%;
  background: white;
  opacity: 0;
  animation: ${sparkle} ${props => 2 + props.$delay}s ease-in-out ${props => props.$delay}s infinite;
`;

/* ═══════════ COMPONENT ═══════════ */

export const StoryReader: React.FC<StoryReaderProps> = ({
  coverImageUrl,
  coverTitle,
  paragraphs,
  illustrationUrls,
  creatorName,
  protagonistName,
  onClose,
  onShare,
  onCreateAnother,
  isShared = false,
  isClub = false,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [visibleSlides, setVisibleSlides] = useState<Set<number>>(new Set([0]));
  const [showIndicator, setShowIndicator] = useState(true);
  const [nightMode, setNightMode] = useState(true);
  const indicatorTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Build slides array — 1 paragraph per text slide, alternate text → image
  // Result: cover → [text → image] × N → end = 14 slides perfectly balanced
  const slides: { type: 'cover' | 'text' | 'image' | 'end'; index?: number; paragraphIndices?: number[] }[] = [];
  slides.push({ type: 'cover' });

  paragraphs.forEach((_, i) => {
    // Text slide (1 paragraph)
    slides.push({ type: 'text', index: i, paragraphIndices: [i] });

    // Image slide right after (if available)
    if (i < illustrationUrls.length && illustrationUrls[i]) {
      slides.push({ type: 'image', index: i });
    }
  });

  slides.push({ type: 'end' });

  const totalSlides = slides.length;
  const progress = totalSlides > 1 ? ((currentSlide + 1) / totalSlides) * 100 : 0;

  // Track visible slides with IntersectionObserver
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = Number(entry.target.getAttribute('data-slide-index'));
          if (isNaN(idx)) return;

          if (entry.isIntersecting) {
            setVisibleSlides(prev => new Set(prev).add(idx));
            if (entry.intersectionRatio > 0.5) {
              setCurrentSlide(idx);
            }
          }
        });
      },
      { root: container, threshold: [0.1, 0.5] }
    );

    container.querySelectorAll('[data-slide-index]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [slides.length]);

  // Show/hide page indicator on scroll
  useEffect(() => {
    setShowIndicator(true);
    if (indicatorTimeout.current) clearTimeout(indicatorTimeout.current);
    indicatorTimeout.current = setTimeout(() => setShowIndicator(false), 2000);
  }, [currentSlide]);

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const resolveUrl = (url: string | null) => {
    if (!url) return '';
    return url.startsWith('http') ? url : getImageUrl(url);
  };

  return (
    <Overlay>
      <ProgressBar>
        <ProgressFill $progress={progress} />
      </ProgressBar>

      <TopControls>
        <NightModeButton $active={nightMode} onClick={() => setNightMode(!nightMode)} aria-label="Mode nuit">
          {nightMode ? '\u2600\uFE0F' : '\uD83C\uDF19'}
        </NightModeButton>
        <CloseButton onClick={onClose} aria-label="Fermer">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </CloseButton>
      </TopControls>

      <PageIndicator $visible={showIndicator}>
        {currentSlide + 1} / {totalSlides}
      </PageIndicator>

      <ScrollContainer ref={scrollRef}>
        {slides.map((slide, idx) => {
          const isVisible = visibleSlides.has(idx);

          if (slide.type === 'cover') {
            return (
              <CoverSlide key="cover" data-slide-index={0}>
                {coverImageUrl && (
                  <>
                    <CoverBlurBg src={resolveUrl(coverImageUrl)} alt="" aria-hidden="true" />
                    <CoverImage src={resolveUrl(coverImageUrl)} alt={coverTitle} />
                  </>
                )}
                <CoverOverlay />
                <ScrollHint>Glissez pour lire</ScrollHint>
              </CoverSlide>
            );
          }

          if (slide.type === 'text' && slide.index !== undefined && slide.paragraphIndices) {
            const colorIdx = slide.index % SLIDE_COLORS_DAY.length;
            return (
              <TextSlide key={`text-${slide.index}`} data-slide-index={idx} $colorIndex={colorIdx} $night={nightMode}>
                <TextContent $visible={isVisible}>
                  <PageNumber $colorIndex={colorIdx} $night={nightMode}>{slide.index + 1}</PageNumber>
                  {slide.paragraphIndices.map((pIdx, pI) => (
                    <StoryText key={pIdx} $night={nightMode} style={pI > 0 ? { marginTop: '16px' } : undefined}>
                      {paragraphs[pIdx]}
                    </StoryText>
                  ))}
                  <TextDivider $colorIndex={colorIdx} $night={nightMode} />
                </TextContent>
              </TextSlide>
            );
          }

          if (slide.type === 'image' && slide.index !== undefined) {
            const imgUrl = illustrationUrls[slide.index];
            return (
              <ImageSlide key={`img-${slide.index}`} data-slide-index={idx}>
                <StoryImage
                  src={resolveUrl(imgUrl)}
                  alt={`Illustration ${slide.index + 1}`}
                  loading="lazy"
                  $visible={isVisible}
                />
              </ImageSlide>
            );
          }

          if (slide.type === 'end') {
            return (
              <EndSlide key="end" data-slide-index={idx}>
                <Sparkle $left="15%" $top="20%" $delay={0} $size={4} />
                <Sparkle $left="80%" $top="15%" $delay={0.5} $size={3} />
                <Sparkle $left="25%" $top="70%" $delay={1} $size={5} />
                <Sparkle $left="75%" $top="75%" $delay={1.5} $size={3} />
                <Sparkle $left="50%" $top="10%" $delay={0.8} $size={4} />
                <Sparkle $left="40%" $top="85%" $delay={2} $size={3} />
                <Sparkle $left="90%" $top="45%" $delay={0.3} $size={4} />
                <EndContent>
                  <EndEmoji>&#x2728;</EndEmoji>
                  <EndTitle>Fin de l'histoire</EndTitle>
                  <EndSubtitle>
                    {protagonistName} a vecu une belle aventure !
                  </EndSubtitle>

                  {isShared ? (
                    <>
                      {/* Lien partagé : CTA principal pour créer son livre */}
                      <SharedCTA onClick={() => window.location.href = '/create-story'}>
                        Vous aussi, creez votre livre gratuitement
                      </SharedCTA>

                      {/* Upsell club subtil */}
                      <ClubUpsellCard onClick={() => window.location.href = '/club'}>
                        <ClubUpsellLabel>Club des Histoires</ClubUpsellLabel>
                        <ClubUpsellText>
                          Personnages secondaires, animal de compagnie, styles d'illustration... Personnalisez encore plus vos livres
                          <ClubUpsellArrow>&rarr;</ClubUpsellArrow>
                        </ClubUpsellText>
                      </ClubUpsellCard>
                    </>
                  ) : (
                    <>
                      {/* Propriétaire : partage + navigation */}
                      {onShare && (
                        <div style={{ marginBottom: 24 }}>
                          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
                            Faites decouvrir cette histoire
                          </p>
                          <EndButton $primary onClick={onShare}>
                            Envoyer a un proche
                          </EndButton>
                        </div>
                      )}

                      <EndButtons>
                        {onCreateAnother && (
                          <EndButton onClick={onCreateAnother}>
                            Creer une nouvelle histoire
                          </EndButton>
                        )}
                        <EndButton onClick={onClose}>
                          Retour a la bibliotheque
                        </EndButton>
                      </EndButtons>

                      {/* Upsell club pour non-abonnés */}
                      {!isClub && (
                        <ClubUpsellCard onClick={() => window.location.href = '/club'}>
                          <ClubUpsellLabel>Club des Histoires</ClubUpsellLabel>
                          <ClubUpsellText>
                            Personnages secondaires, animal de compagnie, choix du style d'illustration... Personnalisez encore plus !
                            <ClubUpsellArrow>&rarr;</ClubUpsellArrow>
                          </ClubUpsellText>
                        </ClubUpsellCard>
                      )}
                    </>
                  )}

                  <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, marginTop: 24 }}>
                    Cree avec Contes d'IA
                  </p>
                </EndContent>
              </EndSlide>
            );
          }

          return null;
        })}
      </ScrollContainer>
    </Overlay>
  );
};

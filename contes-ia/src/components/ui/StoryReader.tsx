import React, { useRef, useState, useEffect, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { theme } from '../../styles/theme';
import { getImageUrl } from '../../config/constants';
import { generateStoryCard } from '../../utils/generateStoryCard';

/* ═══════════════════════════════════════════
   STORY READER — Dual layout: portrait + landscape
   Full-screen, snap scrolling, mobile-first
   ═══════════════════════════════════════════ */

interface StoryReaderProps {
  coverImageUrl: string | null;
  coverTitle: string;
  paragraphs: string[];
  illustrationUrls: string[];
  creatorName?: string;
  narratedBy?: string;
  protagonistName: string;
  onClose: () => void;
  onShare?: () => void;
  onCreateAnother?: () => void;
  isShared?: boolean;
  isClub?: boolean;
  shareUrl?: string;
}

/* ═══════════ ANIMATIONS ═══════════ */
const fadeIn = keyframes`from{opacity:0}to{opacity:1}`;
const slideUp = keyframes`from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}`;
const slowZoom = keyframes`0%,100%{transform:scale(1)}50%{transform:scale(1.05)}`;
const sparkleAnim = keyframes`0%,100%{opacity:0;transform:scale(0)}50%{opacity:1;transform:scale(1)}`;

/* ═══════════ COLOR PALETTES ═══════════ */
const COLORS_DAY = [
  { bg: '#FFF8F0', accent: '#FF9999' },
  { bg: '#F0F8FF', accent: '#6BA3D6' },
  { bg: '#FFF0F5', accent: '#E88AAA' },
  { bg: '#F0FFF0', accent: '#6BBF8A' },
  { bg: '#FFF5EB', accent: '#E8A060' },
  { bg: '#F5F0FF', accent: '#9B8AD6' },
];
const COLORS_NIGHT = [
  { bg: '#1A1428', accent: '#FF9999' },
  { bg: '#141A28', accent: '#6BA3D6' },
  { bg: '#1A1420', accent: '#E88AAA' },
  { bg: '#141A18', accent: '#6BBF8A' },
  { bg: '#1A1814', accent: '#E8A060' },
  { bg: '#181428', accent: '#9B8AD6' },
];

/* ═══════════ LAYOUT ═══════════ */
const Overlay = styled.div`
  position: fixed; inset: 0; z-index: 10000;
  background: #000; animation: ${fadeIn} 0.3s ease;
`;

const ScrollContainer = styled.div`
  width: 100%; height: 100dvh;
  overflow-y: scroll; overflow-x: hidden;
  scroll-snap-type: y mandatory;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar { display: none; }
  scrollbar-width: none;
`;

const ProgressBar = styled.div`
  position: fixed; top: 0; left: 0; right: 0; height: 3px;
  background: rgba(255,255,255,0.1); z-index: 10002;
`;
const ProgressFill = styled.div<{ $progress: number }>`
  height: 100%; width: ${p => p.$progress}%;
  background: linear-gradient(90deg, ${theme.colors.accent.coral}, #FF8E53);
  transition: width 0.3s ease;
`;

const TopControls = styled.div`
  position: fixed; top: 12px; left: 16px; right: 16px;
  display: flex; justify-content: space-between; z-index: 10003;
`;

const CtrlBtn = styled.button<{ $active?: boolean }>`
  appearance: none;
  border: none; outline: none; margin: 0; padding: 0;
  cursor: pointer; -webkit-tap-highlight-color: transparent;
  width: 44px; height: 44px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background: rgba(0,0,0,0.5); backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: ${p => p.$active ? '#FFD700' : 'rgba(255,255,255,0.8)'};
  font-size: 18px; transition: all 0.2s;
  position: relative; z-index: 10004;
  &:active { transform: scale(0.9); opacity: 0.8; }
`;

const PageIndicator = styled.div<{ $visible: boolean }>`
  position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
  z-index: 10002; backdrop-filter: blur(8px);
  background: rgba(0,0,0,0.5); color: rgba(255,255,255,0.7);
  padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600;
  opacity: ${p => p.$visible ? 1 : 0}; transition: opacity 0.3s;
`;

/* ═══════════ SLIDE BASE ═══════════ */
const Slide = styled.div`
  min-height: 100dvh; width: 100%;
  scroll-snap-align: start; scroll-snap-stop: always;
  position: relative; overflow: hidden;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
`;

/* ═══════════ COVER SLIDE (unchanged) ═══════════ */
const CoverSlide = styled(Slide)`background: #000;`;
const CoverBlurBg = styled.img`
  position: absolute; inset: -20px; width: calc(100% + 40px); height: calc(100% + 40px);
  object-fit: cover; filter: blur(40px) saturate(1.3) brightness(0.7);
  transform: scale(1.1); z-index: 0;
`;
const CoverImage = styled.img`
  position: absolute; inset: 0; width: 100%; height: 100%;
  object-fit: contain; z-index: 1; animation: ${slowZoom} 12s ease-in-out infinite;
`;
const CoverOverlay = styled.div`
  position: absolute; inset: 0; z-index: 2;
  background: linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 30%, transparent 60%, rgba(0,0,0,0.85) 100%);
`;
const ScrollHint = styled.div`
  position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%);
  z-index: 3; color: rgba(255,255,255,0.5); font-size: 11px; font-weight: 500;
  text-align: center; animation: ${fadeIn} 1s ease 1.5s both;
  &::after {
    content: ''; display: block; width: 2px; height: 16px;
    background: rgba(255,255,255,0.4); margin: 8px auto 0; border-radius: 2px;
    animation: ${keyframes`0%,100%{transform:scaleY(0.3);opacity:0.3}50%{transform:scaleY(1);opacity:1}`} 1.5s ease-in-out infinite;
  }
`;

/* ═══════════ STORY PAGE SLIDE — dual layout ═══════════ */
const PageSlide = styled(Slide)<{ $bg: string }>`
  background: ${p => p.$bg};

  /* Mobile portrait: vertical stack, scrollable if content overflows */
  @media (orientation: portrait) and (max-width: 1024px) {
    flex-direction: column;
    justify-content: flex-start;
    padding: 0;
  }
  /* Desktop / landscape: horizontal side-by-side */
  @media (orientation: landscape), (min-width: 1025px) {
    flex-direction: row;
    justify-content: stretch;
    padding: 0;
  }
`;

const PageImageBox = styled.div<{ $side: 'left' | 'right' }>`
  position: relative; overflow: hidden;
  background: #000;

  /* Mobile: full width, 55% of viewport — image dominates */
  @media (orientation: portrait) and (max-width: 1024px) {
    width: 100%;
    height: 55dvh;
    flex-shrink: 0;
  }
  /* Desktop: 50% width, full height */
  @media (orientation: landscape), (min-width: 1025px) {
    width: 50%;
    height: 100dvh;
    order: ${p => p.$side === 'right' ? 2 : 0};
  }
`;

const PageImg = styled.img<{ $visible: boolean }>`
  width: 100%; height: 100%; object-fit: cover;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: scale(${p => p.$visible ? 1 : 1.05});
  transition: opacity 0.8s ease, transform 6s ease-out;
`;

const PageTextBox = styled.div<{ $accent: string; $night: boolean }>`
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 10px 22px 20px;
  overflow-y: auto;

  /* Desktop: 50% */
  @media (orientation: landscape), (min-width: 1025px) {
    width: 50%;
    padding: 40px 48px;
  }
`;

const PageNum = styled.div<{ $accent: string; $night: boolean }>`
  width: 32px; height: 32px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 700; margin-bottom: 10px;
  background: ${p => p.$night ? `${p.$accent}25` : `${p.$accent}18`};
  color: ${p => p.$accent};
  flex-shrink: 0;
`;

const PageText = styled.div<{ $night: boolean; $small?: boolean }>`
  font-family: ${theme.fonts.body};
  font-size: ${p => p.$small ? '13px' : '15px'};
  line-height: ${p => p.$small ? '1.7' : '1.85'};
  text-align: center;
  max-width: 480px; margin: 0;
  color: ${p => p.$night ? 'rgba(255,255,255,0.88)' : '#2C2C2C'};
  letter-spacing: 0.015em;
  word-spacing: 0.05em;

  p { margin: 0 0 12px; &:last-child { margin-bottom: 0; } }

  @media (min-width: 1025px) {
    font-size: ${p => p.$small ? '14px' : '17px'};
    line-height: ${p => p.$small ? '1.75' : '1.85'};
  }
`;

const PageDivider = styled.div<{ $accent: string }>`
  width: 36px; height: 2.5px; border-radius: 2px; margin: 16px auto 0;
  background: ${p => `${p.$accent}40`};
  flex-shrink: 0;
`;

/* ═══════════ END SLIDE ═══════════ */
const EndSlide = styled(Slide)`
  background: linear-gradient(135deg, #1a1a2e, #16213e);
`;
const EndContent = styled.div`
  text-align: center; padding: 0 28px;
  animation: ${slideUp} 0.6s ease both;
  display: flex; flex-direction: column; align-items: center;
`;
const EndEmoji = styled.div`font-size: 48px; margin-bottom: 16px;`;
const EndTitle = styled.h2`
  font-family: ${theme.fonts.heading}; font-size: 28px;
  color: white; font-weight: 800; margin: 0 0 8px;
`;
const EndSubtitle = styled.p`
  font-size: 14px; color: rgba(255,255,255,0.6); margin: 0 0 32px; line-height: 1.5;
`;
const EndButtons = styled.div`
  display: flex; flex-direction: column; gap: 12px; width: 100%; max-width: 300px;
`;
const EndButton = styled.button<{ $primary?: boolean }>`
  width: 100%; padding: 14px; border-radius: 14px;
  border: ${p => p.$primary ? 'none' : '1px solid rgba(255,255,255,0.2)'};
  background: ${p => p.$primary
    ? `linear-gradient(135deg, ${theme.colors.accent.coral}, #FF7F7F)` : 'transparent'};
  color: white; font-size: 15px; font-weight: 700; cursor: pointer;
  backdrop-filter: ${p => p.$primary ? 'none' : 'blur(8px)'};
  transition: transform 0.15s; &:active { transform: scale(0.97); }
`;

const Sparkle = styled.div<{ $left: string; $top: string; $delay: number; $size: number }>`
  position: absolute;
  left: ${p => p.$left}; top: ${p => p.$top};
  width: ${p => p.$size}px; height: ${p => p.$size}px;
  border-radius: 50%; background: white; opacity: 0;
  animation: ${sparkleAnim} ${p => 2 + p.$delay}s ease-in-out ${p => p.$delay}s infinite;
`;

/* ═══════════ COMPONENT ═══════════ */
export const StoryReader: React.FC<StoryReaderProps> = ({
  coverImageUrl, coverTitle, paragraphs, illustrationUrls,
  creatorName, narratedBy, protagonistName, onClose, onShare, onCreateAnother,
  isShared = false, isClub = false, shareUrl,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [visibleSlides, setVisibleSlides] = useState<Set<number>>(new Set([0]));
  const [showIndicator, setShowIndicator] = useState(true);
  const [nightMode, setNightMode] = useState(true);
  const [sharingStory, setSharingStory] = useState(false);
  const indicatorTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Share story card (generates image then uses native share or download)
  const handleShareStory = useCallback(async () => {
    if (!coverImageUrl || sharingStory) return;
    setSharingStory(true);
    try {
      const blob = await generateStoryCard(
        resolveUrl(coverImageUrl) || '',
        coverTitle,
        protagonistName
      );
      const file = new File([blob], `${protagonistName}-contedia.png`, { type: 'image/png' });

      // Try native share (mobile — opens Instagram, WhatsApp, etc.)
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: coverTitle,
          text: `Découvrez l'histoire de ${protagonistName} ! 📖✨ Créez le vôtre sur contedia.fr`,
        });
      } else {
        // Fallback: download the image
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${protagonistName}-contedia.png`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      // User cancelled share — not an error
      console.log('Share cancelled or failed:', err);
    } finally {
      setSharingStory(false);
    }
  }, [coverImageUrl, coverTitle, protagonistName, sharingStory]);

  const resolveUrl = useCallback((url: string | null) => {
    if (!url) return '';
    return url.startsWith('http') ? url : getImageUrl(url);
  }, []);

  // Build slides: cover + pages (text+image combined) + end
  const pageCount = Math.max(paragraphs.length, illustrationUrls.length);
  const slides: { type: 'cover' | 'page' | 'end'; index?: number }[] = [{ type: 'cover' }];
  for (let i = 0; i < pageCount; i++) {
    slides.push({ type: 'page', index: i });
  }
  slides.push({ type: 'end' });

  const totalSlides = slides.length;
  const progress = totalSlides > 1 ? ((currentSlide + 1) / totalSlides) * 100 : 0;

  // IntersectionObserver for scroll tracking
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
            if (entry.intersectionRatio > 0.5) setCurrentSlide(idx);
          }
        });
      },
      { root: container, threshold: [0.1, 0.5] }
    );
    container.querySelectorAll('[data-slide-index]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [slides.length]);

  // Page indicator auto-hide
  useEffect(() => {
    setShowIndicator(true);
    if (indicatorTimeout.current) clearTimeout(indicatorTimeout.current);
    indicatorTimeout.current = setTimeout(() => setShowIndicator(false), 2000);
  }, [currentSlide]);

  // Lock body scroll + escape key
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);


  const colors = nightMode ? COLORS_NIGHT : COLORS_DAY;

  // Split long paragraphs into breathable sub-paragraphs at sentence boundaries
  const formatText = (text: string) => {
    if (!text) return { parts: [''], isLong: false };
    const isLong = text.length > 350;
    // Split on sentence endings (. ! ?) followed by space, group ~2 sentences per block
    const sentences = text.split(/(?<=[.!?])\s+/);
    const parts: string[] = [];
    let current = '';
    for (const s of sentences) {
      if (current && (current + ' ' + s).length > 180) {
        parts.push(current.trim());
        current = s;
      } else {
        current = current ? current + ' ' + s : s;
      }
    }
    if (current.trim()) parts.push(current.trim());
    return { parts: parts.length > 0 ? parts : [text], isLong };
  };

  return (
    <Overlay>
      <ProgressBar><ProgressFill $progress={progress} /></ProgressBar>

      <TopControls>
        <CtrlBtn $active={nightMode} onClick={() => setNightMode(!nightMode)} aria-label="Mode nuit">
          {nightMode ? '☀️' : '🌙'}
        </CtrlBtn>
        <CtrlBtn onClick={onClose} aria-label="Fermer">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </CtrlBtn>
      </TopControls>

      <PageIndicator $visible={showIndicator}>
        {currentSlide + 1} / {totalSlides}
      </PageIndicator>

      <ScrollContainer ref={scrollRef}>
        {slides.map((slide, idx) => {
          const isVisible = visibleSlides.has(idx);

          /* ── Cover ── */
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

          /* ── Story page (image + text combined) ── */
          if (slide.type === 'page' && slide.index !== undefined) {
            const i = slide.index;
            const c = colors[i % colors.length];
            const imgUrl = i < illustrationUrls.length ? illustrationUrls[i] : null;
            const rawText = i < paragraphs.length ? paragraphs[i] : '';
            const { parts, isLong } = formatText(rawText);
            // Alternate image side: even=right, odd=left (desktop only)
            const imgSide: 'left' | 'right' = i % 2 === 0 ? 'right' : 'left';

            return (
              <PageSlide key={`page-${i}`} data-slide-index={idx} $bg={c.bg}>
                {imgUrl && (
                  <PageImageBox $side={imgSide}>
                    <PageImg src={resolveUrl(imgUrl)} alt={`Page ${i + 1}`} loading="lazy" $visible={isVisible} />
                  </PageImageBox>
                )}
                <PageTextBox $accent={c.accent} $night={nightMode}>
                  <PageNum $accent={c.accent} $night={nightMode}>{i + 1}</PageNum>
                  <PageText $night={nightMode} $small={isLong}>
                    {parts.map((part, pi) => <p key={pi}>{part}</p>)}
                  </PageText>
                  <PageDivider $accent={c.accent} />
                  {/* Signature auteur — dernière page uniquement */}
                  {i === pageCount - 1 && (narratedBy || creatorName) && (
                    <p style={{
                      marginTop: '16px', fontSize: '12px', fontStyle: 'italic',
                      color: nightMode ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.35)',
                      textAlign: 'center',
                    }}>
                      Histoire racontée par {narratedBy || creatorName}
                    </p>
                  )}
                </PageTextBox>
              </PageSlide>
            );
          }

          /* ── End slide ── */
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
                  <EndSubtitle>{protagonistName} a vecu une belle aventure !</EndSubtitle>

                  {isShared ? (
                    <>
                      <EndButton $primary onClick={() => window.location.href = '/create-story'} style={{ maxWidth: 300, marginBottom: 16 }}>
                        Vous aussi, creez votre livre gratuitement
                      </EndButton>
                      <div
                        onClick={() => window.location.href = '/club/checkout'}
                        style={{
                          width: '100%', maxWidth: 320, cursor: 'pointer',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 40%, #f093fb 100%)',
                          borderRadius: '16px', padding: '16px',
                          textAlign: 'center', marginTop: 8,
                          boxShadow: '0 4px 24px rgba(118,75,162,0.4)',
                          border: '1px solid rgba(255,255,255,0.15)',
                        }}
                      >
                        <p style={{ color: 'white', fontWeight: 700, fontSize: '14px', margin: '0 0 8px' }}>
                          Envie de plus de pages ? ✨
                        </p>
                        <span style={{
                          display: 'inline-block', fontSize: '12px', fontWeight: 600,
                          color: 'rgba(255,255,255,0.9)', padding: '6px 16px',
                          borderRadius: '20px', background: 'rgba(255,255,255,0.15)',
                          backdropFilter: 'blur(4px)',
                        }}>
                          Découvrir le Club &rarr;
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      {onShare && (
                        <EndButton $primary onClick={onShare} style={{ marginBottom: 12 }}>
                          Envoyer a un proche
                        </EndButton>
                      )}

                      {/* Share as Story — generates image card for Instagram/TikTok */}
                      <button
                        onClick={handleShareStory}
                        disabled={sharingStory}
                        style={{
                          appearance: 'none', border: 'none', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                          width: '100%', maxWidth: 300, padding: '12px 20px',
                          borderRadius: '12px', marginBottom: 16,
                          background: 'linear-gradient(135deg, #E1306C, #833AB4, #405DE6)',
                          color: 'white', fontSize: '14px', fontWeight: 700,
                          transition: 'transform 0.2s, opacity 0.2s',
                          opacity: sharingStory ? 0.7 : 1,
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                        </svg>
                        {sharingStory ? 'Création...' : 'Partager dans votre Story'}
                      </button>

                      {!isClub && (
                        <div onClick={() => window.location.href = '/club/checkout'}
                          style={{
                            width: '100%', maxWidth: 320, cursor: 'pointer',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 40%, #f093fb 100%)',
                            borderRadius: '16px', padding: '16px',
                            textAlign: 'center', marginBottom: 14,
                            boxShadow: '0 4px 24px rgba(118,75,162,0.4)',
                            border: '1px solid rgba(255,255,255,0.15)',
                          }}>
                          <p style={{ color: 'white', fontWeight: 700, fontSize: '14px', margin: '0 0 8px' }}>
                            Envie de plus de pages ? ✨
                          </p>
                          <span style={{
                            display: 'inline-block', fontSize: '12px', fontWeight: 600,
                            color: 'rgba(255,255,255,0.9)', padding: '6px 16px',
                            borderRadius: '20px', background: 'rgba(255,255,255,0.15)',
                            backdropFilter: 'blur(4px)',
                          }}>
                            Découvrir le Club &rarr;
                          </span>
                        </div>
                      )}

                      {onCreateAnother && (
                        <EndButton onClick={onCreateAnother} style={{ opacity: 0.7 }}>
                          Creer une nouvelle histoire
                        </EndButton>
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

export default StoryReader;

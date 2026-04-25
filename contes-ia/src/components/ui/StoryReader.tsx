import React, { useRef, useState, useEffect, useCallback, useLayoutEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { theme } from '../../styles/theme';
import { getImageUrl } from '../../config/constants';
import { InlineCheckout } from '../payment/InlineCheckout';
import { useExperiment } from '../../hooks/useExperiment';


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
  isCliffhanger?: boolean; // true si l'histoire est un aperçu gratuit non terminé
  cliffhangerSummary?: string; // question personnalisée générée par l'IA (tâche 2.2)
  orderId?: string;        // pour le paiement de complétion
  isGenerating?: boolean;  // true si la complétion est en cours de génération
  generationProgress?: number; // 0-100 progression de la génération
}

/* ═══════════ ANIMATIONS ═══════════ */
const fadeIn = keyframes`from{opacity:0}to{opacity:1}`;
const slideUp = keyframes`from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}`;
const slowZoom = keyframes`0%,100%{transform:scale(1)}50%{transform:scale(1.05)}`;
const sparkleAnim = keyframes`0%,100%{opacity:0;transform:scale(0)}50%{opacity:1;transform:scale(1)}`;
const pulseCta = keyframes`0%{box-shadow:0 0 0 0 rgba(255,107,107,0.55)}70%{box-shadow:0 0 0 14px rgba(255,107,107,0)}100%{box-shadow:0 0 0 0 rgba(255,107,107,0)}`;

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
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  z-index: 10000;
  background: #000; animation: ${fadeIn} 0.3s ease;
  touch-action: pan-y;
  user-select: none;
  -webkit-user-select: none;
  /* Forcer le plein écran sur TOUS les navigateurs mobiles */
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  height: -webkit-fill-available;
  overflow: hidden;
`;

const ScrollContainer = styled.div`
  width: 100%;
  height: 100vh;
  height: 100dvh;
  height: -webkit-fill-available;
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
  position: fixed; top: max(env(safe-area-inset-top, 12px), 12px); left: 16px; right: 16px;
  display: flex; justify-content: space-between; z-index: 10003;
  padding-top: 4px;
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

const FloatingShareBtn = styled.button<{ $visible: boolean }>`
  position: fixed;
  bottom: max(env(safe-area-inset-bottom, 16px), 16px);
  right: 16px;
  z-index: 10003;
  width: 44px; height: 44px; border-radius: 50%;
  border: none; cursor: pointer;
  background: rgba(0,0,0,0.55);
  backdrop-filter: blur(10px);
  color: rgba(255,255,255,0.85);
  display: flex; align-items: center; justify-content: center;
  opacity: ${p => p.$visible ? 0.85 : 0};
  transform: translateY(${p => p.$visible ? '0' : '10px'});
  transition: opacity 0.3s, transform 0.3s, background 0.15s;
  &:hover { background: rgba(0,0,0,0.75); opacity: 1; }
  &:active { transform: scale(0.92); }
`;

const ShareToast = styled.div<{ $visible: boolean }>`
  position: fixed; bottom: 74px; right: 16px;
  z-index: 10004;
  padding: 8px 14px; border-radius: 20px;
  background: rgba(16,185,129,0.95); color: white;
  font-size: 12px; font-weight: 600;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? '0' : '8px'});
  transition: opacity 0.25s, transform 0.25s;
  pointer-events: none;
`;

const PageIndicator = styled.div<{ $visible: boolean }>`
  position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
  z-index: 10002; backdrop-filter: blur(8px);
  background: rgba(0,0,0,0.5); color: rgba(255,255,255,0.7);
  padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600;
  opacity: ${p => p.$visible ? 1 : 0}; transition: opacity 0.3s;
  display: flex; align-items: center; gap: 8px;
  & > .hint {
    font-size: 11px; font-weight: 500;
    color: rgba(255,213,128,0.95);
    padding-left: 8px;
    border-left: 1px solid rgba(255,255,255,0.2);
  }
`;

/* ═══════════ SLIDE BASE ═══════════ */
const Slide = styled.div`
  height: 100vh;
  height: 100dvh;
  height: -webkit-fill-available;
  width: 100%;
  scroll-snap-align: start; scroll-snap-stop: always;
  position: relative; overflow: hidden;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  flex-shrink: 0;
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
  padding: 8px 20px 12px;
  overflow: hidden; /* NO internal scroll — text must fit */
  min-height: 0; /* allow flex shrinking */

  /* Desktop: 50% */
  @media (orientation: landscape), (min-width: 1025px) {
    width: 50%;
    padding: 40px 48px;
  }
`;

const PageNum = styled.div<{ $accent: string; $night: boolean }>`
  width: 28px; height: 28px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 700; margin-bottom: 6px;
  background: ${p => p.$night ? `${p.$accent}25` : `${p.$accent}18`};
  color: ${p => p.$accent};
  flex-shrink: 0;
`;

/* Auto-fit text: starts at maxFontSize, shrinks until it fits in parent */
const AutoFitText: React.FC<{ text: string; night: boolean }> = ({ text, night }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(15);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // Start at 15px, shrink until text fits without overflow
    let size = 15;
    const minSize = 9;
    el.style.fontSize = `${size}px`;
    while (el.scrollHeight > el.clientHeight && size > minSize) {
      size -= 0.5;
      el.style.fontSize = `${size}px`;
      el.style.lineHeight = size <= 10 ? '1.4' : size <= 12 ? '1.5' : '1.65';
    }
    setFontSize(size);
  }, [text]);

  return (
    <div
      ref={containerRef}
      style={{
        fontFamily: theme.fonts.body,
        fontSize: `${fontSize}px`,
        lineHeight: fontSize <= 10 ? '1.4' : fontSize <= 12 ? '1.5' : '1.65',
        textAlign: 'center',
        maxWidth: 480,
        margin: 0,
        color: night ? 'rgba(255,255,255,0.88)' : '#2C2C2C',
        letterSpacing: '0.01em',
        overflow: 'hidden',
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span>{text}</span>
    </div>
  );
};

const PageDivider = styled.div<{ $accent: string }>`
  width: 30px; height: 2px; border-radius: 2px; margin: 8px auto 0;
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

const PaywallCta = styled.button`
  width: 100%; max-width: 340px;
  padding: 18px 24px; border-radius: 16px; border: none;
  background: linear-gradient(135deg, #FF6B6B, #FF8E53);
  color: white; font-size: 17px; font-weight: 800; line-height: 1.3;
  cursor: pointer;
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  animation: ${pulseCta} 2.2s ease-out infinite;
  transition: transform 0.15s;
  &:active { transform: scale(0.97); }
  & > span.sub { font-size: 12px; font-weight: 600; opacity: 0.92; }
`;

const TrustBadges = styled.div`
  display: flex; flex-wrap: wrap; justify-content: center;
  gap: 8px 14px; margin: 14px 0 6px;
  font-size: 11px; color: rgba(255,255,255,0.55);
  & > span { display: inline-flex; align-items: center; gap: 4px; }
`;

const TestimonialBlock = styled.div`
  width: 100%; max-width: 320px;
  margin: 4px 0 20px;
  padding: 12px 14px;
  border-left: 2px solid rgba(255,255,255,0.25);
  text-align: left;
  & p.quote { font-size: 13px; font-style: italic; color: rgba(255,255,255,0.82); margin: 0 0 4px; line-height: 1.45; }
  & p.author { font-size: 11px; color: rgba(255,255,255,0.5); margin: 0; }
`;

const ClubLink = styled.button`
  background: none; border: none; cursor: pointer;
  color: rgba(255,255,255,0.55); font-size: 12px; font-weight: 500;
  margin: 6px 0 4px; padding: 6px 10px;
  text-decoration: underline; text-underline-offset: 3px;
  &:hover { color: rgba(255,255,255,0.85); }
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
  isCliffhanger = false, cliffhangerSummary, orderId,
  isGenerating = false, generationProgress = 0,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [visibleSlides, setVisibleSlides] = useState<Set<number>>(new Set([0]));
  const [showIndicator, setShowIndicator] = useState(true);
  const [nightMode, setNightMode] = useState(true);
  const [completionLoading, setCompletionLoading] = useState(false);
  const [completionProgress, setCompletionProgress] = useState(0);
  const [shareToastVisible, setShareToastVisible] = useState(false);
  const [inlineCheckoutOpen, setInlineCheckoutOpen] = useState(false);

  // 6.1 devbook — A/B test du flow de paiement completion
  // control = redirection Checkout Session (ancien flow)
  // inline  = Stripe Elements dans un modal (pas de redirection)
  // Kill-switch leve le 2026-04-15 : REACT_APP_STRIPE_PUBLISHABLE_KEY ajoute sur Vercel
  // + webhook Stripe prod ecoute payment_intent.succeeded. A/B 50/50 actif.
  const completionCheckoutVariant = useExperiment(
    'completion_checkout_v1',
    ['control', 'inline'] as const
  );
  const indicatorTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // Page indicator auto-hide (reste visible sur la derniere page du cliffhanger)
  useEffect(() => {
    setShowIndicator(true);
    if (indicatorTimeout.current) clearTimeout(indicatorTimeout.current);
    const currentType = slides[currentSlide]?.type;
    const currentPageIndex = slides[currentSlide]?.index;
    const isCliffhangerLastPage = isCliffhanger
      && currentType === 'page'
      && typeof currentPageIndex === 'number'
      && currentPageIndex === pageCount - 1;
    const delay = isCliffhangerLastPage ? 6000 : 2000;
    indicatorTimeout.current = setTimeout(() => setShowIndicator(false), delay);
  }, [currentSlide, isCliffhanger, pageCount, slides]);

  // Lock body scroll + force scroll to top + escape key
  useEffect(() => {
    const prev = document.body.style.overflow;
    const prevPosition = document.body.style.position;
    const prevTop = document.body.style.top;
    const prevWidth = document.body.style.width;
    const scrollY = window.scrollY;

    // Bloquer le body scroll complètement (iOS fix)
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';

    // Forcer le scroll du reader au top
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }

    return () => {
      document.body.style.position = prevPosition;
      document.body.style.top = prevTop;
      document.body.style.width = prevWidth;
      document.body.style.overflow = prev;
      window.scrollTo(0, scrollY);
    };
  }, []);
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);


  const colors = nightMode ? COLORS_NIGHT : COLORS_DAY;

  const handleFloatingShare = useCallback(async () => {
    const url = shareUrl || (typeof window !== 'undefined' ? window.location.href : '');
    const text = `Regarde le livre personnalise de ${protagonistName} !`;
    if (typeof navigator !== 'undefined' && (navigator as any).share) {
      try {
        await (navigator as any).share({ title: coverTitle, text, url });
        return;
      } catch { /* cancel ou erreur : fallback copy */ }
    }
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setShareToastVisible(true);
        setTimeout(() => setShareToastVisible(false), 1800);
        return;
      }
    } catch { /* ignore */ }
    if (onShare) onShare();
  }, [shareUrl, protagonistName, coverTitle, onShare]);

  const showFloatingShare = slides[currentSlide]?.type === 'page';

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

      <FloatingShareBtn
        $visible={showFloatingShare}
        onClick={handleFloatingShare}
        aria-label="Partager cette histoire"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      </FloatingShareBtn>
      <ShareToast $visible={shareToastVisible}>Lien copie !</ShareToast>

      {(() => {
        const currentType = slides[currentSlide]?.type;
        const currentPageIndex = slides[currentSlide]?.index;
        if (currentType === 'end') return null;
        let label: string;
        let hint: string | null = null;
        if (currentType === 'cover') {
          label = 'Couverture';
        } else if (currentType === 'page' && typeof currentPageIndex === 'number') {
          label = `Page ${currentPageIndex + 1} / ${pageCount}`;
          if (isCliffhanger && currentPageIndex === pageCount - 1) {
            hint = 'Derniere page du chapitre gratuit';
          }
        } else {
          label = `${currentSlide + 1} / ${totalSlides}`;
        }
        return (
          <PageIndicator $visible={showIndicator}>
            <span>{label}</span>
            {hint && <span className="hint">{hint}</span>}
          </PageIndicator>
        );
      })()}

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
            const imgSide: 'left' | 'right' = i % 2 === 0 ? 'right' : 'left';
            const authorSuffix = i === pageCount - 1 && (narratedBy || creatorName)
              ? `\n\n— Histoire racontée par ${narratedBy || creatorName}` : '';

            return (
              <PageSlide key={`page-${i}`} data-slide-index={idx} $bg={c.bg}>
                {imgUrl && (
                  <PageImageBox $side={imgSide}>
                    <PageImg src={resolveUrl(imgUrl)} alt={`Page ${i + 1}`} loading="lazy" $visible={isVisible} />
                  </PageImageBox>
                )}
                <PageTextBox $accent={c.accent} $night={nightMode}>
                  <PageNum $accent={c.accent} $night={nightMode}>{i + 1}</PageNum>
                  <AutoFitText text={rawText + authorSuffix} night={nightMode} />
                  <PageDivider $accent={c.accent} />
                </PageTextBox>
              </PageSlide>
            );
          }

          /* ── End slide — CLIFFHANGER or COMPLETE ── */
          if (slide.type === 'end') {
            // ═══ GENERATION EN COURS — slide de progression ═══
            if (isGenerating) {
              return (
                <EndSlide key="end" data-slide-index={idx}>
                  <EndContent>
                    <p style={{ fontSize: '3rem', margin: '0 0 16px' }}>&#x2728;&#x1F4D6;&#x2728;</p>
                    <EndTitle style={{ fontSize: '1.3rem', lineHeight: 1.4 }}>
                      La suite de l'aventure{protagonistName ? ` de ${protagonistName}` : ''} arrive...
                    </EndTitle>
                    <EndSubtitle style={{ fontSize: '0.85rem', opacity: 0.6, marginBottom: 28 }}>
                      Notre IA écrit et illustre les 7 prochaines pages
                    </EndSubtitle>

                    {/* Barre de progression */}
                    <div style={{
                      width: '100%', maxWidth: 280, height: 8, borderRadius: 4,
                      background: 'rgba(255,255,255,0.1)', overflow: 'hidden',
                      margin: '0 auto 12px',
                    }}>
                      <div style={{
                        width: `${Math.max(generationProgress, 5)}%`, height: '100%',
                        borderRadius: 4,
                        background: 'linear-gradient(90deg, #a78bfa, #f093fb)',
                        transition: 'width 1s ease-out',
                      }} />
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: '0 0 8px' }}>
                      {generationProgress < 30 ? 'Écriture de la suite...' :
                       generationProgress < 80 ? 'Illustration des nouvelles pages...' :
                       generationProgress < 95 ? 'Assemblage du livre complet...' :
                       'Presque terminé...'}
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, margin: 0 }}>
                      {generationProgress}% — environ 2 minutes
                    </p>
                  </EndContent>
                </EndSlide>
              );
            }

            // ═══ CLIFFHANGER — L'histoire n'est pas finie, proposer de payer ═══
            if (isCliffhanger && !isShared) {
              const handleCompletion = async () => {
                if (!orderId) {
                  alert('Impossible de finaliser la commande. Rechargez la page.');
                  return;
                }
                // Variante inline : on ouvre le modal Stripe Elements
                // (cast string : le kill switch peut restreindre les variantes a ['control'])
                if ((completionCheckoutVariant as string) === 'inline') {
                  setInlineCheckoutOpen(true);
                  return;
                }
                // Variante control : ancien flow par redirection Checkout
                try {
                  const { ApiService } = await import('../../config/api');
                  const res = await ApiService.createCompletionSession(orderId);
                  if (res.url) window.location.href = res.url;
                  else alert(res.message || 'Erreur');
                } catch { alert('Erreur de connexion'); }
              };
              const summary = (cliffhangerSummary || '').trim()
                || `Que va-t-il découvrir ensuite ?`;
              return (
                <EndSlide key="end" data-slide-index={idx}>
                  <Sparkle $left="15%" $top="20%" $delay={0} $size={4} />
                  <Sparkle $left="80%" $top="15%" $delay={0.5} $size={3} />
                  <Sparkle $left="50%" $top="10%" $delay={0.8} $size={4} />
                  <Sparkle $left="75%" $top="75%" $delay={1.5} $size={3} />
                  <EndContent style={{ padding: '0 20px', justifyContent: 'center', gap: 0 }}>

                    {/* Header compact : emoji + titre + sous-titre en 1 bloc serré */}
                    <div style={{ textAlign: 'center', marginBottom: 16 }}>
                      <div style={{ fontSize: '2.2rem', marginBottom: 6 }}>&#x1F4D6;</div>
                      <h2 style={{
                        fontFamily: theme.fonts.heading, fontSize: 22, fontWeight: 800,
                        color: 'white', margin: '0 0 6px', lineHeight: 1.2,
                      }}>
                        L'histoire de {protagonistName} n'est pas finie...
                      </h2>
                      <p style={{
                        fontSize: 13, fontStyle: 'italic', color: 'rgba(255,255,255,0.65)',
                        margin: 0, lineHeight: 1.35,
                      }}>
                        {summary}
                      </p>
                    </div>

                    {/* CTA PRINCIPAL — focus total, pulsant, GROS */}
                    <PaywallCta onClick={handleCompletion} style={{ marginBottom: 6 }}>
                      <span>Offrir la suite &agrave; {protagonistName}</span>
                      <span className="sub">2,99&euro; &middot; 20 pages illustr&eacute;es &middot; PDF inclus</span>
                    </PaywallCta>

                    {/* Trust badges — 1 ligne compacte */}
                    <div style={{
                      display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap',
                      margin: '8px 0 12px', fontSize: 10, color: 'rgba(255,255,255,0.45)',
                    }}>
                      <span>&#10003; Sans risque</span>
                      <span>&#10003; Stripe</span>
                      <span>&#10003; Instantan&eacute;</span>
                    </div>

                    {/* Séparateur visuel */}
                    <div style={{
                      width: 40, height: 1, background: 'rgba(255,255,255,0.12)',
                      margin: '0 auto 12px',
                    }} />

                    {/* Témoignage — ultra compact, 1 ligne */}
                    <p style={{
                      fontSize: 12, fontStyle: 'italic', color: 'rgba(255,255,255,0.5)',
                      textAlign: 'center', margin: '0 0 14px', lineHeight: 1.35,
                    }}>
                      &laquo; Mon fils r&eacute;clame son livre chaque soir &raquo; &mdash; Marie &#9733;&#9733;&#9733;&#9733;&#9733;
                    </p>

                    {/* Club — lien discret */}
                    {!isClub && (
                      <ClubLink onClick={() => { window.location.href = '/club/checkout'; }}>
                        ou &eacute;conomisez avec le Club &rarr; 1,99&euro;/mois
                      </ClubLink>
                    )}

                    {/* Partager — encore plus discret, texte seul */}
                    {onShare && (
                      <button
                        onClick={onShare}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: 'rgba(255,255,255,0.25)', fontSize: 11, marginTop: 10,
                          textDecoration: 'underline', textUnderlineOffset: 3,
                        }}
                      >
                        Partager l'aper&ccedil;u
                      </button>
                    )}

                  </EndContent>
                </EndSlide>
              );
            }

            // ═══ FIN NORMALE — L'histoire est complète ═══
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
                  <EndEmoji>&#9733;</EndEmoji>
                  <EndTitle>Fin de l'histoire</EndTitle>
                  <EndSubtitle>{protagonistName} a vécu une belle aventure !</EndSubtitle>

                  {isShared ? (
                    <>
                      <EndButton $primary onClick={() => window.location.href = '/create-story'} style={{ maxWidth: 300, marginBottom: 16 }}>
                        Vous aussi, créez votre livre gratuitement
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
                      {/* 1. Envoyer à un proche — bouton principal */}
                      {onShare && (
                        <EndButton $primary onClick={onShare} style={{ marginBottom: 16 }}>
                          Envoyer à un proche
                        </EndButton>
                      )}

                      {/* 2. Section Club premium — upsell visuel */}
                      {!isClub && (
                        <div
                          onClick={() => window.location.href = '/club/checkout'}
                          style={{
                            width: '100%', maxWidth: 320, cursor: 'pointer',
                            background: 'linear-gradient(135deg, #1a1040 0%, #2d1b69 50%, #1a1040 100%)',
                            borderRadius: '20px', padding: '20px 18px',
                            textAlign: 'center', marginBottom: 16,
                            boxShadow: '0 4px 32px rgba(118,75,162,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
                            border: '1px solid rgba(167,139,250,0.3)',
                            position: 'relative',
                            overflow: 'hidden',
                          }}
                        >
                          {/* Decorative glow */}
                          <div style={{
                            position: 'absolute', top: '-30px', right: '-30px',
                            width: '80px', height: '80px', borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(167,139,250,0.3) 0%, transparent 70%)',
                            pointerEvents: 'none',
                          }} />
                          <div style={{
                            position: 'absolute', bottom: '-20px', left: '-20px',
                            width: '60px', height: '60px', borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(240,147,251,0.2) 0%, transparent 70%)',
                            pointerEvents: 'none',
                          }} />

                          <p style={{
                            color: '#f0e6ff', fontWeight: 800, fontSize: '15px',
                            margin: '0 0 12px', letterSpacing: '-0.3px',
                          }}>
                            Passez au niveau suivant
                          </p>

                          <div style={{
                            display: 'flex', flexDirection: 'column', gap: '6px',
                            marginBottom: '14px',
                          }}>
                            {[
                              { icon: '2x', text: 'plus de pages par histoire' },
                              { icon: '5', text: 'personnages secondaires' },
                              { icon: '9', text: "styles d'illustration" },
                              { icon: '4', text: 'livres par mois inclus' },
                            ].map((item, i) => (
                              <div key={i} style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                textAlign: 'left',
                              }}>
                                <span style={{
                                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                  minWidth: '28px', height: '22px',
                                  borderRadius: '6px', fontSize: '11px', fontWeight: 800,
                                  background: 'linear-gradient(135deg, #a78bfa, #f093fb)',
                                  color: '#1a1040',
                                }}>
                                  {item.icon}
                                </span>
                                <span style={{
                                  color: 'rgba(255,255,255,0.85)', fontSize: '12px', fontWeight: 500,
                                }}>
                                  {item.text}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div style={{
                            display: 'inline-block', fontSize: '13px', fontWeight: 700,
                            color: 'white', padding: '10px 24px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #a78bfa 0%, #f093fb 100%)',
                            boxShadow: '0 2px 12px rgba(167,139,250,0.4)',
                            letterSpacing: '-0.2px',
                          }}>
                            Essayer pour 1,99 &euro; &rarr;
                          </div>

                          <p style={{
                            color: 'rgba(255,255,255,0.35)', fontSize: '10px',
                            margin: '8px 0 0', fontWeight: 500,
                          }}>
                            <span style={{ textDecoration: 'line-through', opacity: 0.6 }}>9,99&euro;</span>
                            {' '}1,99 &euro; le 1er mois &middot; Sans engagement
                          </p>
                        </div>
                      )}

                      {/* 3. Créer une nouvelle histoire */}
                      {onCreateAnother && (
                        <EndButton onClick={onCreateAnother} style={{ opacity: 0.7 }}>
                          Créer une nouvelle histoire
                        </EndButton>
                      )}
                    </>
                  )}

                  <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, marginTop: 24 }}>
                    Créé avec Contes d'IA
                  </p>
                </EndContent>
              </EndSlide>
            );
          }

          return null;
        })}
      </ScrollContainer>

      {inlineCheckoutOpen && orderId && (
        <InlineCheckout
          orderId={orderId}
          protagonistName={protagonistName}
          coverImageUrl={coverImageUrl}
          onSuccess={() => {
            // Paiement OK : on ferme le modal et on redirige vers la story avec ?completed=true
            // pour que StoryDetailPage gere le flow post-achat (polling generation, reader, etc.)
            setInlineCheckoutOpen(false);
            if (typeof window !== 'undefined') {
              window.location.href = `/dashboard/story/${orderId}?completed=true`;
            }
          }}
          onClose={() => setInlineCheckoutOpen(false)}
        />
      )}
    </Overlay>
  );
};

export default StoryReader;

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { theme } from '../styles/theme';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { ApiService } from '../config/api';
import { getImageUrl } from '../config/constants';
import { ShareModal } from '../components/ui/ShareModal';

/* ══════════════════════════════════════════════
   ANIMATIONS
   ══════════════════════════════════════════════ */

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const bookSlideIn = keyframes`
  from { opacity: 0; transform: translateY(30px) scale(0.9); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 ${theme.colors.accent.coral}40; }
  50% { box-shadow: 0 0 0 12px ${theme.colors.accent.coral}00; }
`;

const floatBooks = keyframes`
  0%, 100% { transform: translateY(0) rotate(-2deg); }
  33% { transform: translateY(-8px) rotate(1deg); }
  66% { transform: translateY(-3px) rotate(-1deg); }
`;

const progressFill = keyframes`
  from { width: 0; }
`;

/* ══════════════════════════════════════════════
   LAYOUT
   ══════════════════════════════════════════════ */

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-primary);
`;

const MainContent = styled.main`
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing['2xl']} ${theme.spacing.lg};
  width: 100%;

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.lg} ${theme.spacing.md};
  }
`;

/* ══════════════════════════════════════════════
   1. LIBRARY HEADER
   ══════════════════════════════════════════════ */

const LibraryHeader = styled.div`
  margin-bottom: ${theme.spacing.xl};
  animation: ${fadeInUp} 0.6s ease-out;
`;

const HeaderTopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.sm};
`;

const HeaderTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const LibraryTitle = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['2xl']};
  color: var(--text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.xl};
  }
`;

const Badge = styled.span<{ $variant: 'club' | 'basic' | 'activating' }>`
  display: inline-flex;
  align-items: center;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.xs};
  font-weight: 700;
  background: ${p => {
    if (p.$variant === 'club') return `linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.button.primaryHover})`;
    if (p.$variant === 'activating') return `linear-gradient(135deg, ${theme.colors.accent.coral}80, ${theme.colors.button.primaryHover}80)`;
    return 'var(--bg-secondary)';
  }};
  color: ${p => p.$variant === 'basic' ? 'var(--text-secondary)' : 'white'};
`;

const LibrarySubtitle = styled.p`
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.base};
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.sm};
  }
`;

const StoryCounter = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.accent.coral};
  font-weight: 600;
  margin-top: 4px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  flex-shrink: 0;

  @media (max-width: ${theme.breakpoints.sm}) {
    width: 100%;
    justify-content: stretch;

    button {
      flex: 1;
    }
  }
`;

/* ══════════════════════════════════════════════
   CLUB WELCOME BANNER (subscription activation)
   ══════════════════════════════════════════════ */

const ClubWelcomeBanner = styled.div`
  background: linear-gradient(135deg, ${theme.colors.accent.coral}15, ${theme.colors.accent.softPink}25, ${theme.colors.accent.creamyYellow}30);
  border: 1px solid ${theme.colors.accent.coral}30;
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.xl} ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};
  text-align: center;
  animation: ${fadeInUp} 0.6s ease-out;
`;

const WelcomeTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.xl};
  color: var(--text-primary);
  margin: 0 0 ${theme.spacing.sm};
`;

const WelcomeText = styled.p`
  color: var(--text-secondary);
  font-size: ${theme.fontSizes.sm};
  margin: 0;
`;

const WelcomeShimmer = styled.div`
  height: 3px;
  margin-top: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.full};
  background: linear-gradient(90deg, transparent, ${theme.colors.accent.coral}60, transparent);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s linear infinite;
`;

/* ══════════════════════════════════════════════
   2. CLUB SECTION — Premium Members
   ══════════════════════════════════════════════ */

const ClubSection = styled.div`
  background: linear-gradient(135deg, ${theme.colors.accent.creamyYellow}, ${theme.colors.accent.softPink}20);
  border: 1px solid ${theme.colors.accent.lightCoral}30;
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};
  animation: ${fadeInUp} 0.6s ease-out 0.1s both;
`;

const ClubSectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.md};
  flex-wrap: wrap;
  gap: ${theme.spacing.sm};
`;

const ClubSectionTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.lg};
  color: var(--text-primary);
  margin: 0;
`;

const ManageLink = styled.button`
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: ${theme.fontSizes.xs};
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
  &:hover { color: ${theme.colors.accent.coral}; }
`;

const ClubGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const CreditCard = styled.div<{ $available: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  background: ${p => p.$available
    ? `linear-gradient(135deg, ${theme.colors.accent.lightGreen}30, #a8e6cf30)`
    : 'var(--bg-card)'
  };
  border: 1px solid ${p => p.$available ? '#a8e6cf' : 'var(--border-input)'};
  border-radius: ${theme.borderRadius.lg};
`;

const CreditInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const CreditIcon = styled.span`
  font-size: ${theme.fontSizes.xl};
`;

const CreditText = styled.div`
  h4 {
    font-family: ${theme.fonts.heading};
    font-size: ${theme.fontSizes.base};
    color: var(--text-primary);
    margin: 0;
  }
  p {
    font-size: ${theme.fontSizes.xs};
    color: var(--text-secondary);
    margin: ${theme.spacing.xs} 0 0;
  }
`;

const CountdownText = styled.span`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.accent.coral};
  font-weight: 600;
`;

const CollectionCard = styled.div`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  background: var(--bg-card);
  border: 1px solid var(--border-input);
  border-radius: ${theme.borderRadius.lg};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const CollectionLabel = styled.span`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.base};
  color: var(--text-primary);
  font-weight: 700;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 8px;
  background: var(--border-input);
  border-radius: ${theme.borderRadius.full};
  overflow: hidden;
`;

const ProgressBarFill = styled.div<{ $percent: number }>`
  height: 100%;
  width: ${p => p.$percent}%;
  background: linear-gradient(90deg, ${theme.colors.accent.coral}, ${theme.colors.accent.softPink});
  border-radius: ${theme.borderRadius.full};
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  animation: ${progressFill} 1s ease-out;
`;

const ProgressText = styled.span`
  font-size: ${theme.fontSizes.xs};
  color: var(--text-light);
`;

/* ══════════════════════════════════════════════
   2B. JOIN CLUB BANNER — Basic Members
   ══════════════════════════════════════════════ */

const JoinClubCard = styled.div`
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.xl};
  margin-bottom: ${theme.spacing.xl};
  position: relative;
  overflow: hidden;
  animation: ${fadeInUp} 0.6s ease-out 0.1s both;

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.lg};
  }
`;

const JoinClubContent = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.sm}) {
    flex-direction: column;
    text-align: center;
  }
`;

const JoinClubTextBlock = styled.div`
  flex: 1;
`;

const JoinClubTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.xl};
  color: white;
  margin: 0 0 ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.lg};
  }
`;

const JoinClubFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 ${theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const JoinClubFeature = styled.li`
  font-size: ${theme.fontSizes.sm};
  color: rgba(255, 255, 255, 0.85);
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};

  &::before {
    content: '\u2728';
    font-size: 14px;
  }
`;

const JoinClubVisual = styled.div`
  display: flex;
  gap: -12px;
  flex-shrink: 0;

  @media (max-width: ${theme.breakpoints.sm}) {
    justify-content: center;
  }
`;

const FloatingBookPreview = styled.div<{ $delay: number; $rotate: number }>`
  width: 60px;
  height: 80px;
  border-radius: 3px 8px 8px 3px;
  background: linear-gradient(135deg, ${theme.colors.accent.softPink}, ${theme.colors.accent.creamyYellow});
  box-shadow: -2px 0 4px rgba(0,0,0,0.2), 2px 2px 8px rgba(0,0,0,0.3);
  animation: ${floatBooks} 4s ease-in-out ${p => p.$delay}s infinite;
  transform: rotate(${p => p.$rotate}deg);
  margin-left: -8px;

  &:first-child { margin-left: 0; }

  @media (max-width: ${theme.breakpoints.sm}) {
    width: 48px;
    height: 64px;
  }
`;

const JoinClubBg = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 80% 50%, ${theme.colors.accent.coral}15, transparent 60%);
  z-index: 1;
`;

/* ══════════════════════════════════════════════
   3. FILTER BAR
   ══════════════════════════════════════════════ */

const FilterBar = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ $active: boolean }>`
  padding: 5px 14px;
  border: 1.5px solid ${p => p.$active ? theme.colors.accent.coral : 'var(--border-input)'};
  border-radius: 20px;
  background: ${p => p.$active ? theme.colors.accent.coral : 'transparent'};
  color: ${p => p.$active ? 'white' : 'var(--text-secondary)'};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { border-color: ${theme.colors.accent.coral}; }
`;

/* ══════════════════════════════════════════════
   4. BOOKSHELF GRID + BOOK CARDS
   ══════════════════════════════════════════════ */

const SectionLabel = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.lg};
  color: var(--text-primary);
  margin: 0 0 ${theme.spacing.md};
`;

const BookshelfGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${theme.spacing.md};
  }

  @media (min-width: ${theme.breakpoints.lg}) {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: ${theme.spacing.xl};
  }
`;

const BookCard = styled.div<{ $hasImage: boolean; $delay?: number }>`
  position: relative;
  aspect-ratio: 2 / 3;
  border-radius: 4px 12px 12px 4px;
  overflow: hidden;
  cursor: pointer;
  background: ${p => p.$hasImage ? '#1a1a2e' : `linear-gradient(135deg, ${theme.colors.accent.softPink}, ${theme.colors.accent.creamyYellow})`};
  box-shadow:
    -4px 0 8px rgba(0,0,0,0.15),
    4px 2px 12px rgba(0,0,0,0.2),
    inset -2px 0 4px rgba(255,255,255,0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: left center;
  animation: ${bookSlideIn} 0.5s ease-out ${p => (p.$delay || 0) * 0.08}s both;
  perspective: 800px;

  &:hover {
    transform: scale(1.04) translateY(-4px) rotateY(-3deg);
    box-shadow:
      -6px 0 12px rgba(0,0,0,0.2),
      6px 4px 20px rgba(0,0,0,0.3),
      inset -2px 0 4px rgba(255,255,255,0.1);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const BookSpine = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 6px;
  background: linear-gradient(to right, rgba(0,0,0,0.3), rgba(0,0,0,0.05));
  z-index: 3;
`;

const BookCoverImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
`;

const BookOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: ${theme.spacing.md} ${theme.spacing.sm};
  background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.4) 60%, transparent 100%);
  z-index: 2;
`;

const BookTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.sm};
  color: white;
  margin: 0 0 4px;
  line-height: 1.3;
  text-shadow: 0 1px 3px rgba(0,0,0,0.5);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const BookDate = styled.span`
  font-size: 10px;
  color: rgba(255,255,255,0.7);
`;

const BookStatusBadge = styled.span<{ $color: string }>`
  position: absolute;
  top: ${theme.spacing.sm};
  right: ${theme.spacing.sm};
  padding: 2px 8px;
  border-radius: ${theme.borderRadius.full};
  font-size: 10px;
  font-weight: 700;
  color: white;
  background: ${p => p.$color};
  z-index: 3;
  backdrop-filter: blur(4px);
`;

const BookFavoriteBtn = styled.button<{ $active: boolean }>`
  position: absolute;
  top: ${theme.spacing.sm};
  left: ${theme.spacing.md};
  background: none;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  z-index: 3;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.5));
  color: ${p => p.$active ? theme.colors.accent.coral : 'rgba(255,255,255,0.8)'};
  transition: transform 0.2s;
  &:hover { transform: scale(1.3); }
`;

const BookShareBtn = styled.button`
  position: absolute;
  bottom: ${theme.spacing.sm};
  right: ${theme.spacing.sm};
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(4px);
  border: none;
  cursor: pointer;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  color: white;

  &:hover { background: ${theme.colors.accent.coral}; transform: scale(1.1); }
  &:active { transform: scale(0.95); }
`;

const BookPlaceholder = styled.div`
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.lg};
  text-align: center;
`;

const PlaceholderIcon = styled.div`
  font-size: 2.5rem;
  opacity: 0.5;
`;

const PlaceholderName = styled.div`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.base};
  color: var(--text-secondary);
  font-weight: 600;
`;

/* ══════════════════════════════════════════════
   5. COLLECTION SECTION
   ══════════════════════════════════════════════ */

const CollectionSection = styled.div`
  margin-top: ${theme.spacing['2xl']};
  animation: ${fadeIn} 0.6s ease-out 0.3s both;
`;

const CollectionTitle = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.xl};
  color: var(--text-primary);
  margin: 0 0 ${theme.spacing.sm};

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.lg};
  }
`;

const CollectionSubtitle = styled.p`
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.sm};
  color: var(--text-secondary);
  margin: 0 0 ${theme.spacing.lg};
`;

const EpisodeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.lg};
`;

const EpisodeItem = styled.div<{ $available: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  background: ${p => p.$available ? 'var(--bg-card)' : 'transparent'};
  border: 1px solid ${p => p.$available ? 'var(--border-input)' : 'var(--border-color)'};
  border-radius: ${theme.borderRadius.lg};
  cursor: ${p => p.$available ? 'pointer' : 'default'};
  transition: all 0.2s ease;
  opacity: ${p => p.$available ? 1 : 0.5};

  ${p => p.$available && css`
    &:hover {
      border-color: ${theme.colors.accent.coral};
      box-shadow: var(--shadow-card);
    }
  `}
`;

const EpisodeNumber = styled.span<{ $active: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.sm};
  font-weight: 700;
  flex-shrink: 0;
  background: ${p => p.$active
    ? `linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.accent.softPink})`
    : 'var(--border-input)'};
  color: ${p => p.$active ? 'white' : 'var(--text-light)'};
`;

const EpisodeInfo = styled.div`
  flex: 1;
  min-width: 0;

  h4 {
    font-family: ${theme.fonts.heading};
    font-size: ${theme.fontSizes.sm};
    color: var(--text-primary);
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  p {
    font-size: ${theme.fontSizes.xs};
    color: var(--text-light);
    margin: 2px 0 0;
  }
`;

/* ══════════════════════════════════════════════
   6. TEASER CARD (next story)
   ══════════════════════════════════════════════ */

const TeaserCard = styled.div`
  position: relative;
  aspect-ratio: 2 / 3;
  border-radius: 4px 12px 12px 4px;
  overflow: hidden;
  cursor: pointer;
  background: linear-gradient(135deg, ${theme.colors.accent.softPink}40, ${theme.colors.accent.creamyYellow}40);
  border: 2px dashed ${theme.colors.accent.coral}40;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.lg};
  text-align: center;
  transition: all 0.3s ease;
  animation: ${pulseGlow} 3s ease-in-out infinite;

  &:hover {
    border-color: ${theme.colors.accent.coral};
    background: linear-gradient(135deg, ${theme.colors.accent.softPink}60, ${theme.colors.accent.creamyYellow}60);
    transform: translateY(-4px);
  }
`;

const TeaserIcon = styled.div`
  font-size: 2rem;
  opacity: 0.7;
`;

const TeaserTitle = styled.span`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.sm};
  color: var(--text-primary);
  font-weight: 700;
`;

const TeaserSubtitle = styled.span`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.accent.coral};
  font-weight: 600;
`;

/* ══════════════════════════════════════════════
   7. CTA SECTION
   ══════════════════════════════════════════════ */

const CTASection = styled.div`
  text-align: center;
  margin-top: ${theme.spacing['2xl']};
  padding: ${theme.spacing.xl};
  background: linear-gradient(135deg, ${theme.colors.accent.creamyYellow}50, ${theme.colors.accent.softPink}20);
  border-radius: ${theme.borderRadius.xl};
  animation: ${fadeIn} 0.6s ease-out 0.4s both;
`;

const CTAText = styled.p`
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.base};
  color: var(--text-secondary);
  margin: 0 0 ${theme.spacing.md};
  line-height: 1.5;
`;

/* ══════════════════════════════════════════════
   EMPTY STATE
   ══════════════════════════════════════════════ */

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing['3xl']} ${theme.spacing.xl};
  color: var(--text-secondary);
  background: var(--bg-card);
  border-radius: ${theme.borderRadius['2xl']};
  box-shadow: var(--shadow-card);
  border: 1px solid var(--border-color);
  max-width: 500px;
  margin: ${theme.spacing['2xl']} auto;
`;

const EmptyIcon = styled.div`
  font-size: 3.5rem;
  margin-bottom: ${theme.spacing.lg};
  line-height: 1;
`;

const EmptyTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.xl};
  color: var(--text-primary);
  margin: 0 0 ${theme.spacing.sm};
`;

const EmptyText = styled.p`
  font-size: ${theme.fontSizes.base};
  color: var(--text-secondary);
  margin: 0 0 ${theme.spacing.xl};
  line-height: 1.6;
`;

/* ══════════════════════════════════════════════
   UTILS
   ══════════════════════════════════════════════ */

const getTimeUntilNextCredit = (nextCreditDate: string | undefined) => {
  if (!nextCreditDate) return null;
  const diff = new Date(nextCreditDate).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000)
  };
};

/* ══════════════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════════════ */

export const DashboardPage: React.FC = () => {
  const { user, isClub, isAuthenticated, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [clubCredit, setClubCredit] = useState<{ canSubmit: boolean; remaining: number; nextCreditDate?: string; totalEarned?: number } | null>(null);
  const [subscriptionActivating, setSubscriptionActivating] = useState(false);
  const [countdown, setCountdown] = useState<{ days: number; hours: number } | null>(null);
  const [shareStory, setShareStory] = useState<{ id: string; name: string; title?: string } | null>(null);

  // Derive protagonist name (most used) for personalized messages
  const heroName = useMemo(() => {
    if (!stories.length) return null;
    const nameCount: Record<string, number> = {};
    stories.forEach(s => {
      if (s.protagonistName) {
        nameCount[s.protagonistName] = (nameCount[s.protagonistName] || 0) + 1;
      }
    });
    const sorted = Object.entries(nameCount).sort((a, b) => b[1] - a[1]);
    return sorted[0]?.[0] || null;
  }, [stories]);

  // Group stories by protagonist for collection view
  const collections = useMemo(() => {
    const groups: Record<string, any[]> = {};
    stories.forEach(s => {
      const name = s.protagonistName || 'Inconnu';
      if (!groups[name]) groups[name] = [];
      groups[name].push(s);
    });
    // Sort each group by date
    Object.values(groups).forEach(arr => arr.sort((a: any, b: any) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    ));
    return groups;
  }, [stories]);

  const mainCollection = useMemo(() => {
    if (!heroName || !collections[heroName]) return null;
    return { name: heroName, stories: collections[heroName] };
  }, [heroName, collections]);

  // ── Polling for Club activation after Stripe checkout ──
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('subscription') !== 'success') return;

    const token = localStorage.getItem('userToken');
    if (!token) return;

    setSubscriptionActivating(true);
    let attempts = 0;
    const maxAttempts = 15;

    const pollSubscription = async () => {
      try {
        const result = await ApiService.checkSubscriptionStatus(token);
        if (result.success && result.status === 'active') {
          await refreshProfile();
          const [storiesRes, creditRes] = await Promise.all([
            ApiService.getClientStories(token).catch(() => null),
            ApiService.getClubCredit(token).catch(() => null)
          ]);
          if (storiesRes?.success) setStories(storiesRes.data);
          if (creditRes?.success) setClubCredit(creditRes.data);
          setSubscriptionActivating(false);
          setLoading(false);
          navigate('/dashboard', { replace: true });
          return;
        }
      } catch (e) {
        console.error('Erreur polling subscription:', e);
      }
      attempts++;
      if (attempts < maxAttempts) {
        setTimeout(pollSubscription, 2000);
      } else {
        setSubscriptionActivating(false);
        await refreshProfile();
        try {
          const storiesRes = await ApiService.getClientStories(token!);
          if (storiesRes.success) setStories(storiesRes.data);
        } catch {}
        setLoading(false);
        navigate('/dashboard', { replace: true });
      }
    };
    pollSubscription();
  }, [location.search]); // eslint-disable-line

  // ── Load stories + club credit ──
  useEffect(() => {
    loadStories();
    if (isClub) {
      const token = localStorage.getItem('userToken');
      if (token) {
        ApiService.getClubCredit(token)
          .then(res => { if (res.success) setClubCredit(res.data); })
          .catch(() => {});
      }
    }
  }, [isClub]); // eslint-disable-line

  // ── Countdown timer ──
  useEffect(() => {
    if (!clubCredit?.nextCreditDate) { setCountdown(null); return; }
    const update = () => setCountdown(getTimeUntilNextCredit(clubCredit.nextCreditDate));
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [clubCredit]);

  const loadStories = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) return;
    try {
      const response = await ApiService.getClientStories(token);
      if (response.success) setStories(response.data);
    } catch (error) {
      console.error('Erreur chargement contes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent, storyId: string) => {
    e.stopPropagation();
    const token = localStorage.getItem('userToken');
    if (!token) return;
    try {
      const response = await ApiService.toggleFavorite(token, storyId);
      if (response.success) {
        setStories(prev => prev.map(s => s.id === storyId ? { ...s, isFavorite: response.data.isFavorite } : s));
      }
    } catch (error) {
      console.error('Erreur toggle favori:', error);
    }
  };

  const handleManageSubscription = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) return;
    try {
      const result = await ApiService.createCustomerPortal(token);
      if (result.url) window.location.href = result.url;
    } catch (error) {
      console.error('Erreur portail client:', error);
    }
  };

  const handleJoinClub = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    const token = localStorage.getItem('userToken');
    if (!token) { navigate('/login'); return; }
    try {
      const result = await ApiService.createSubscriptionSession(token);
      if (result.url) window.location.href = result.url;
    } catch (error) {
      console.error('Erreur creation session abonnement:', error);
    }
  };

  const filteredStories = stories.filter(s => {
    if (filter === 'favorites') return s.isFavorite;
    if (filter === 'en_cours') return s.storyStatus === 'EN_COURS';
    if (filter === 'disponible') return s.storyStatus === 'DISPONIBLE';
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DISPONIBLE': return theme.colors.status.success;
      case 'EN_COURS': return theme.colors.status.warning;
      default: return 'var(--text-light)';
    }
  };

  const getStatusLabel = (story: any) => {
    if (story.isFavorite && story.storyStatus === 'DISPONIBLE') return 'Favori';
    if (story.storyStatus === 'DISPONIBLE') return 'Disponible';
    if (story.storyStatus === 'EN_COURS' && story.firstIllustrationUrl) return 'En preparation';
    if (story.storyStatus === 'EN_COURS') return 'En cours';
    if (['GENERATING_TEXT', 'GENERATING_IMAGES', 'ASSEMBLING_PDF'].includes(story.storyStatus)) return 'Generation...';
    return story.storyStatus;
  };

  const collectionGoal = 12;
  const collectionProgress = Math.min((stories.length / collectionGoal) * 100, 100);

  return (
    <PageContainer>
      <Header />
      <MainContent>

        {/* ══════ 1. COMPACT HEADER ══════ */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 16,
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
              <h1 style={{ fontFamily: theme.fonts.heading, fontSize: 20, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Ma Bibliotheque
              </h1>
              <span style={{
                fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10,
                background: isClub ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#f0f0f0',
                color: isClub ? 'white' : 'var(--text-light)',
              }}>
                {isClub ? 'Club' : 'Gratuit'}
              </span>
            </div>
            {!loading && stories.length > 0 && (
              <p style={{ fontSize: 12, color: 'var(--text-light)', margin: 0 }}>
                {stories.length} {stories.length === 1 ? 'histoire' : 'histoires'}
                {heroName ? ` de ${heroName}` : ''}
              </p>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => navigate('/dashboard/account')} style={{
              width: 36, height: 36, borderRadius: '50%', border: '1px solid #e0e0e0',
              background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, color: 'var(--text-secondary)',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </button>
            <button onClick={() => {
              if (!isClub && stories.length >= 3) navigate('/club/checkout');
              else navigate('/create-story');
            }} style={{
              height: 36, padding: '0 16px', borderRadius: 18, border: 'none',
              background: theme.colors.accent.coral, color: 'white',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span style={{ fontSize: 16 }}>+</span> Creer
            </button>
          </div>
        </div>

        {/* ══════ WELCOME BANNER (activation) ══════ */}
        {subscriptionActivating && (
          <ClubWelcomeBanner>
            <WelcomeTitle>Bienvenue dans le Club des Histoires</WelcomeTitle>
            <WelcomeText>Votre espace premium se prépare...</WelcomeText>
            <WelcomeShimmer />
          </ClubWelcomeBanner>
        )}

        {/* ══════ 2A. CLUB SECTION (Premium) — compact ══════ */}
        {!loading && isClub && !subscriptionActivating && (
          <div style={{
            background: 'linear-gradient(135deg, #667eea10, #764ba210)',
            border: '1px solid #667eea20', borderRadius: 14,
            padding: '14px 16px', marginBottom: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 20 }}>{clubCredit?.canSubmit ? '\u2728' : '\u23F3'}</span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  {clubCredit?.canSubmit
                    ? `${clubCredit.remaining} credit${clubCredit.remaining > 1 ? 's' : ''} disponible${clubCredit.remaining > 1 ? 's' : ''}`
                    : 'Aucun credit'}
                </p>
                <p style={{ fontSize: 11, color: 'var(--text-light)', margin: 0 }}>
                  {countdown ? `Prochain dans ${countdown.days}j ${countdown.hours}h` : 'Club des Histoires'}
                </p>
              </div>
            </div>
            {clubCredit?.canSubmit ? (
              <button onClick={() => navigate('/create-story')} style={{
                padding: '7px 14px', borderRadius: 10, border: 'none',
                background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white',
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
              }}>Creer</button>
            ) : (
              <button onClick={() => navigate('/create-story')} style={{
                padding: '7px 14px', borderRadius: 10, border: '1px solid #ddd',
                background: 'var(--bg-card)', color: 'var(--text-secondary)',
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
              }}>Commander</button>
            )}
          </div>
        )}

        {/* old Club section removed — replaced by compact banner above */}

        {/* ══════ 2B. JOIN CLUB (Basic) — compact banner ══════ */}
        {!loading && !isClub && !subscriptionActivating && (
          <div onClick={() => navigate('/club/checkout')} style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '16px', padding: '16px 18px', marginBottom: '16px',
            position: 'relative', overflow: 'hidden', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
              <div style={{ position: 'absolute', width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', top: -20, right: -10 }} />
            </div>
            <div style={{ position: 'relative', zIndex: 2, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 11, background: 'rgba(255,255,255,0.2)', color: 'white', padding: '2px 8px', borderRadius: 8, fontWeight: 600 }}>
                  {stories.length}/3
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>
                  {stories.length >= 3 ? 'Bibliotheque pleine' : 'Passer au Club'}
                </span>
              </div>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', margin: 0 }}>
                Livres illimites, styles, personnages...
              </p>
            </div>
            <div style={{
              background: 'white', color: '#764ba2', borderRadius: 12,
              padding: '8px 14px', fontSize: 12, fontWeight: 700, flexShrink: 0,
            }}>
              Voir &rarr;
            </div>
          </div>
        )}

        {/* ══════ 3. FILTER BAR ══════ */}
        {!loading && stories.length > 0 && (
          <FilterBar>
            {[
              { key: 'all', label: 'Tous' },
              { key: 'favorites', label: 'Favoris' },
              { key: 'en_cours', label: 'En cours' },
              { key: 'disponible', label: 'Disponibles' }
            ].map(f => (
              <FilterButton key={f.key} $active={filter === f.key} onClick={() => setFilter(f.key)}>
                {f.label}
              </FilterButton>
            ))}
          </FilterBar>
        )}

        {/* ══════ 4. BOOKSHELF GRID ══════ */}
        {loading ? (
          <EmptyState>
            <EmptyText>Chargement de vos contes...</EmptyText>
          </EmptyState>
        ) : stories.length === 0 ? (
          <EmptyState>
            <EmptyIcon>📖</EmptyIcon>
            <EmptyTitle>Commencez votre première aventure</EmptyTitle>
            <EmptyText>
              Votre bibliothèque est vide pour le moment.
              Créez un conte personnalisé unique pour votre enfant.
            </EmptyText>
            <Button variant="primary" size="lg" onClick={() => navigate('/create-story')}>
              Créer un conte
            </Button>
          </EmptyState>
        ) : filteredStories.length === 0 ? (
          <EmptyState>
            <EmptyTitle>Aucun conte dans cette catégorie</EmptyTitle>
            <EmptyText>Essayez un autre filtre ou créez un nouveau conte.</EmptyText>
            <Button variant="ghost" size="md" onClick={() => setFilter('all')}>
              Voir tous les contes
            </Button>
          </EmptyState>
        ) : (
          <>
            <BookshelfGrid>
              {filteredStories.map((story, idx) => {
                const coverUrl = story.coverImageUrl ? getImageUrl(story.coverImageUrl) : null;
                const title = story.coverTitle || `Conte de ${story.protagonistName}`;
                return (
                  <BookCard key={story.id} $hasImage={!!coverUrl} $delay={idx} onClick={() => navigate(`/dashboard/story/${story.id}`)}>
                    <BookSpine />
                    <BookPlaceholder>
                      <PlaceholderIcon>📖</PlaceholderIcon>
                      <PlaceholderName>{story.protagonistName}</PlaceholderName>
                    </BookPlaceholder>
                    {coverUrl && (
                      <BookCoverImage src={coverUrl} alt={title} loading="lazy" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    )}
                    <BookStatusBadge $color={getStatusColor(story.storyStatus)}>
                      {getStatusLabel(story)}
                    </BookStatusBadge>
                    <BookFavoriteBtn $active={story.isFavorite} onClick={(e) => handleToggleFavorite(e, story.id)}>
                      {story.isFavorite ? '\u2764\uFE0F' : '\u2661'}
                    </BookFavoriteBtn>
                    {story.storyStatus === 'DISPONIBLE' && (
                      <BookShareBtn onClick={(e) => { e.stopPropagation(); setShareStory({ id: story.id, name: story.protagonistName, title }); }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                        </svg>
                      </BookShareBtn>
                    )}
                    <BookOverlay>
                      <BookTitle>{title}</BookTitle>
                      <BookDate>{new Date(story.createdAt).toLocaleDateString('fr-FR')}</BookDate>
                    </BookOverlay>
                  </BookCard>
                );
              })}

              {/* ══════ 5. TEASER CARD ══════ */}
              <TeaserCard onClick={() => navigate('/create-story')}>
                <TeaserIcon>+</TeaserIcon>
                <TeaserTitle>
                  {heroName ? `Prochaine aventure de ${heroName}` : 'Prochaine aventure'}
                </TeaserTitle>
                <TeaserSubtitle>
                  {isClub && clubCredit?.canSubmit
                    ? 'Disponible maintenant'
                    : isClub && countdown
                      ? `Disponible dans ${countdown.days}j ${countdown.hours}h`
                      : 'Disponible maintenant'
                  }
                </TeaserSubtitle>
              </TeaserCard>
            </BookshelfGrid>
          </>
        )}

        {/* ══════ 6. COLLECTION SECTION ══════ */}
        {!loading && mainCollection && mainCollection.stories.length > 1 && (
          <CollectionSection>
            <CollectionTitle>Les aventures de {mainCollection.name}</CollectionTitle>
            <CollectionSubtitle>
              {mainCollection.name} a déjà {mainCollection.stories.length} aventure{mainCollection.stories.length > 1 ? 's' : ''} dans sa collection.
              Quelle sera sa prochaine histoire ?
            </CollectionSubtitle>

            <EpisodeList>
              {mainCollection.stories.map((story: any, idx: number) => {
                const title = story.coverTitle || `Conte de ${story.protagonistName}`;
                return (
                  <EpisodeItem key={story.id} $available onClick={() => navigate(`/dashboard/story/${story.id}`)}>
                    <EpisodeNumber $active>{idx + 1}</EpisodeNumber>
                    <EpisodeInfo>
                      <h4>{title}</h4>
                      <p>{new Date(story.createdAt).toLocaleDateString('fr-FR')}</p>
                    </EpisodeInfo>
                  </EpisodeItem>
                );
              })}

              {/* Next episode placeholder */}
              <EpisodeItem $available={false}>
                <EpisodeNumber $active={false}>{mainCollection.stories.length + 1}</EpisodeNumber>
                <EpisodeInfo>
                  <h4>La prochaine aventure arrive bientôt...</h4>
                  <p>
                    {isClub && clubCredit?.canSubmit
                      ? 'Crédit disponible maintenant'
                      : isClub && countdown
                        ? `Prochain crédit dans ${countdown.days}j ${countdown.hours}h`
                        : ''
                    }
                  </p>
                </EpisodeInfo>
              </EpisodeItem>
            </EpisodeList>

            <div style={{ textAlign: 'center' }}>
              <Button variant="primary" size="md" onClick={() => navigate('/create-story')}>
                Créer la prochaine histoire
              </Button>
            </div>
          </CollectionSection>
        )}

        {/* ══════ 7. EMOTIONAL CTA ══════ */}
        {!loading && stories.length > 0 && (
          <CTASection>
            <CTAText>
              {heroName
                ? `${heroName} attend sa prochaine histoire ✨`
                : 'Votre enfant attend sa prochaine histoire ✨'
              }
            </CTAText>
            <Button variant="primary" size="lg" onClick={() => navigate('/create-story')}>
              Créer une nouvelle aventure
            </Button>
          </CTASection>
        )}

      </MainContent>
      <Footer />

      {shareStory && (
        <ShareModal
          isOpen={!!shareStory}
          onClose={() => setShareStory(null)}
          storyId={shareStory.id}
          protagonistName={shareStory.name}
          coverTitle={shareStory.title}
        />
      )}
    </PageContainer>
  );
};

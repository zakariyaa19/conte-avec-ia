import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../../styles/theme';

/* ─── Animations ─── */
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(40px) scale(0.96); }
  to   { opacity: 1; transform: translateY(0)     scale(1); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(-2deg); }
  50%      { transform: translateY(-6px) rotate(2deg); }
`;

const shimmerSweep = keyframes`
  0%   { transform: translateX(-120%); }
  100% { transform: translateX(220%); }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 0.3; transform: scale(0.85); }
  50%      { opacity: 1;   transform: scale(1.15); }
`;

/* ─── Layout ─── */
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  animation: ${fadeIn} 0.2s ease;
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
  padding: 0;

  @media (min-width: ${theme.breakpoints.md}) {
    align-items: center;
    padding: 24px;
  }
`;

const Modal = styled.div`
  position: relative;
  background: var(--bg-elevated);
  border-radius: 28px 28px 0 0;
  padding: 0 22px 22px;
  padding-bottom: max(22px, env(safe-area-inset-bottom));
  width: 100%;
  max-width: 440px;
  animation: ${slideUp} 0.36s cubic-bezier(0.34, 1.36, 0.64, 1);
  overflow: hidden;
  border-top: 0.5px solid var(--border-color);
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.18);

  @media (min-width: ${theme.breakpoints.md}) {
    border-radius: 24px;
    padding: 0 24px 24px;
    border: 0.5px solid var(--border-color);
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.24);
  }
`;

/* Hero band — gradient subtil avec sparkles */
const HeroBand = styled.div`
  position: relative;
  margin: 0 -22px;
  padding: 28px 22px 18px;
  background: linear-gradient(160deg,
    rgba(255, 153, 153, 0.18) 0%,
    rgba(255, 179, 186, 0.10) 45%,
    rgba(167, 139, 250, 0.08) 100%);
  text-align: center;
  overflow: hidden;

  @media (min-width: ${theme.breakpoints.md}) {
    margin: 0 -24px;
    padding: 30px 24px 20px;
    border-radius: 24px 24px 0 0;
  }

  /* Shimmer subtil qui balaie en haut */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 50%;
    height: 100%;
    background: linear-gradient(90deg,
      transparent,
      rgba(255, 255, 255, 0.07),
      transparent);
    animation: ${shimmerSweep} 4s ease-in-out infinite;
    pointer-events: none;
  }
`;

const ModalHandle = styled.div`
  width: 38px;
  height: 4px;
  background: var(--border-color);
  border-radius: 2px;
  margin: 10px auto 0;

  @media (min-width: ${theme.breakpoints.md}) {
    display: none;
  }
`;

/* Pile de livres animee */
const BookStack = styled.div`
  position: relative;
  display: inline-block;
  font-size: 52px;
  line-height: 1;
  margin-bottom: 12px;
  animation: ${float} 3.2s ease-in-out infinite;
  filter: drop-shadow(0 8px 18px rgba(255, 153, 153, 0.35));
`;

const Sparkle = styled.span<{ $top: string; $left: string; $delay: string; $size: number }>`
  position: absolute;
  top: ${p => p.$top};
  left: ${p => p.$left};
  font-size: ${p => p.$size}px;
  animation: ${sparkle} 2.4s ease-in-out infinite;
  animation-delay: ${p => p.$delay};
  pointer-events: none;
`;

const Title = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0 0 6px;
  line-height: 1.18;
  letter-spacing: -0.01em;

  span {
    color: ${theme.colors.accent.coral};
  }
`;

const Subtitle = styled.p`
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
  max-width: 340px;
  margin: 0 auto;
`;

/* ─── Benefits ─── */
const BenefitsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 18px 0 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const BenefitItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.875rem;
  color: var(--text-primary);
  line-height: 1.4;
  font-weight: 500;
`;

const Check = styled.span`
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.button.primaryHover});
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 800;
  box-shadow: 0 2px 6px rgba(255, 153, 153, 0.35);
  margin-top: 1px;
`;

/* ─── Pricing chip ─── */
const PriceChip = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(255, 153, 153, 0.08);
  border: 1px solid rgba(255, 153, 153, 0.22);
  border-radius: 14px;
  padding: 12px 14px;
  margin-bottom: 14px;
  font-size: 0.875rem;
  color: var(--text-primary);
  font-weight: 500;
`;

const PriceMain = styled.span`
  font-family: ${theme.fonts.heading};
  font-size: 1.05rem;
  font-weight: 800;
  color: ${theme.colors.accent.coral};
`;

const PriceMuted = styled.span`
  color: var(--text-light);
  font-size: 0.78rem;
`;

/* ─── Buttons ─── */
const PrimaryBtn = styled.button`
  width: 100%;
  padding: 15px 20px;
  border: none;
  border-radius: 16px;
  font-family: ${theme.fonts.heading}, ${theme.fonts.body};
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  background: linear-gradient(135deg, ${theme.colors.accent.coral} 0%, ${theme.colors.button.primaryHover} 100%);
  color: white;
  letter-spacing: 0.005em;
  box-shadow: 0 4px 16px rgba(255, 153, 153, 0.35), 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: transform 0.15s ease, box-shadow 0.25s ease;

  &:hover {
    transform: translateY(-1.5px);
    box-shadow: 0 8px 24px rgba(255, 153, 153, 0.45), 0 1px 3px rgba(0, 0, 0, 0.08);
  }
  &:active {
    transform: scale(0.98);
  }
`;

const SecondaryBtn = styled.button`
  width: 100%;
  padding: 12px 20px;
  border: none;
  border-radius: 14px;
  background: transparent;
  color: var(--text-light);
  font-family: ${theme.fonts.body};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 10px;
  transition: color 0.2s, background 0.2s;

  &:hover {
    color: var(--text-secondary);
    background: var(--hover-bg, rgba(0, 0, 0, 0.03));
  }
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.06);
  color: var(--text-light);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
  transition: background 0.2s, color 0.2s;
  font-size: 14px;

  &:hover {
    background: rgba(0, 0, 0, 0.12);
    color: var(--text-primary);
  }

  html[data-theme="dark"] & {
    background: rgba(255, 255, 255, 0.08);
    &:hover { background: rgba(255, 255, 255, 0.16); }
  }
`;

/* ═══════════════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════════════ */

interface Props {
  open: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  /** Nombre actuel de livres (par defaut 3, pour message dynamique). */
  bookCount?: number;
}

/**
 * Modal "bibliotheque pleine" — affiche quand un user gratuit (3 livres deja
 * crees) tente d'en creer un 4eme. Remplace le window.confirm() natif par
 * une experience visuelle premium qui informe + convertit vers le Club.
 *
 * Design: bottom-sheet sur mobile, centered card desktop. Stack de livres
 * animee + sparkles + benefits list + CTA pricing. Inspiration generale
 * des modals Notion / Linear / Apple Music subscribe.
 */
export const LibraryFullModal: React.FC<Props> = ({
  open,
  onClose,
  onUpgrade,
  bookCount = 3,
}) => {
  // Lock body scroll
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Esc to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <Overlay onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="lib-full-title">
      <Modal onClick={e => e.stopPropagation()}>
        <ModalHandle aria-hidden="true" />

        <CloseBtn onClick={onClose} aria-label="Fermer">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </CloseBtn>

        <HeroBand>
          <BookStack aria-hidden="true">
            📚
            <Sparkle $top="-4px" $left="-12px" $delay="0s" $size={14}>✨</Sparkle>
            <Sparkle $top="6px" $left="58px" $delay="0.8s" $size={12}>✨</Sparkle>
            <Sparkle $top="38px" $left="-8px" $delay="1.6s" $size={10}>✨</Sparkle>
          </BookStack>
          <Title id="lib-full-title">
            Votre bibliothèque est <span>pleine</span>
          </Title>
          <Subtitle>
            Le compte gratuit est limité à {bookCount} livres. Passez au
            Club pour une bibliothèque illimitée et des livres complets de 20 pages.
          </Subtitle>
        </HeroBand>

        <BenefitsList>
          <BenefitItem>
            <Check aria-hidden="true">✓</Check>
            <span><strong>Livres illimités</strong> dans votre bibliothèque</span>
          </BenefitItem>
          <BenefitItem>
            <Check aria-hidden="true">✓</Check>
            <span>Livres <strong>complets de 20 pages</strong> (au lieu de 3)</span>
          </BenefitItem>
          <BenefitItem>
            <Check aria-hidden="true">✓</Check>
            <span><strong>9 styles d'illustration</strong> + 5 personnages secondaires</span>
          </BenefitItem>
          <BenefitItem>
            <Check aria-hidden="true">✓</Check>
            <span>Sans engagement — résiliable à tout moment</span>
          </BenefitItem>
        </BenefitsList>

        <PriceChip>
          <PriceMain>1,99 €</PriceMain>
          <span>le premier mois</span>
          <PriceMuted>· puis 9,99 €/mois</PriceMuted>
        </PriceChip>

        <PrimaryBtn onClick={onUpgrade}>
          Rejoindre le Club des Histoires
        </PrimaryBtn>

        <SecondaryBtn onClick={onClose}>
          Plus tard
        </SecondaryBtn>
      </Modal>
    </Overlay>
  );
};

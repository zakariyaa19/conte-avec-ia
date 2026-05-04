import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';

interface Props {
  text: string;
  /** True quand l'IA est en train d'analyser (debounce + appel API) */
  thinking?: boolean;
  /** Vitesse en caracteres par seconde (defaut 38) */
  speedCps?: number;
}

/* ─── Animations ──────────────────────────────────────────── */
const blink = keyframes`
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
`;
const dotBounce = keyframes`
  0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
  40%           { transform: translateY(-3px); opacity: 1; }
`;
const ringSpin = keyframes`
  to { transform: rotate(360deg); }
`;
const shimmerSweep = keyframes`
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(220%); }
`;

/* ─── Styled ──────────────────────────────────────────────── */
const Wrap = styled.div<{ $thinking: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  margin-top: 4px;
  border-radius: 14px;
  background: linear-gradient(135deg,
    rgba(255, 153, 153, 0.10) 0%,
    rgba(167, 139, 250, 0.06) 100%);
  border: 1px solid rgba(255, 153, 153, 0.22);
  min-height: 44px;
  overflow: hidden;
  transition: border-color 0.3s ease;

  /* Shimmer subtle qui balaie quand l'IA reflechit */
  &::before {
    content: '';
    position: absolute;
    top: 0; bottom: 0;
    left: 0;
    width: 40%;
    background: linear-gradient(90deg,
      transparent,
      rgba(255, 255, 255, 0.06),
      transparent);
    pointer-events: none;
    opacity: ${p => p.$thinking ? 1 : 0};
    transition: opacity 0.3s ease;
    animation: ${shimmerSweep} 1.6s ease-in-out infinite;
  }
`;

/* Mini avatar IA : cercle avec sparkle, anneau qui tourne pendant thinking */
const AIBadge = styled.div<{ $thinking: boolean }>`
  position: relative;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #FF9999, #C7A8F5);
  box-shadow: 0 0 12px rgba(255, 153, 153, 0.4);

  /* Anneau qui tourne (mode thinking) */
  &::before {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: 50%;
    border: 1.5px solid transparent;
    border-top-color: rgba(255, 153, 153, 0.7);
    border-right-color: rgba(255, 153, 153, 0.4);
    opacity: ${p => p.$thinking ? 1 : 0};
    animation: ${ringSpin} 1.2s linear infinite;
    transition: opacity 0.25s ease;
  }

  /* Sparkle interne (4 points en croix) */
  svg {
    width: 12px;
    height: 12px;
    color: white;
  }
`;

const Content = styled.div`
  position: relative;
  flex: 1;
  min-width: 0;
  z-index: 1;
`;

const HintText = styled.p`
  font-family: 'Poppins', system-ui, -apple-system, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.92);
  margin: 0;
  line-height: 1.45;
  letter-spacing: 0.005em;
`;

const Caret = styled.span`
  display: inline-block;
  width: 1.5px;
  height: 13px;
  background: #FF9999;
  margin-left: 2px;
  vertical-align: middle;
  animation: ${blink} 0.95s steps(2, start) infinite;
  border-radius: 1px;
`;

const ThinkingDots = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const Dot = styled.span<{ $delay: string }>`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.65);
  animation: ${dotBounce} 1s ease-in-out infinite;
  animation-delay: ${p => p.$delay};
`;

const Label = styled.span`
  font-family: 'Poppins', system-ui, sans-serif;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 153, 153, 0.85);
  margin-right: 8px;
`;

/* ─── Component ───────────────────────────────────────────── */
/**
 * SmartHint — apparition IA stylee.
 *
 * Mode 1 (thinking) : avatar IA tourne, badge "IA" + 3 dots qui rebondissent.
 * Mode 2 (revealed) : typewriter du conseil avec caret clignotant.
 *
 * Pendant que l'API mouline, l'utilisateur voit "IA • • •" → puis le conseil
 * apparait progressivement caractere par caractere. Effet "vraie analyse en
 * direct" plus convaincant qu'un simple texte statique.
 */
export const SmartHint: React.FC<Props> = ({ text, thinking = false, speedCps = 38 }) => {
  const [shown, setShown] = useState<string>('');
  const [typing, setTyping] = useState(false);
  const lastTextRef = useRef<string>('');
  const idxRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Pendant le thinking, on n'anime pas — on reste sur le texte precedent (ou vide)
    if (thinking) return;

    if (text === lastTextRef.current) {
      setShown(text);
      return;
    }
    lastTextRef.current = text;

    if (intervalRef.current) clearInterval(intervalRef.current);
    idxRef.current = 0;
    setShown('');
    setTyping(true);

    const stepMs = Math.max(15, Math.round(1000 / speedCps));
    intervalRef.current = setInterval(() => {
      idxRef.current += 1;
      const slice = text.slice(0, idxRef.current);
      setShown(slice);
      if (idxRef.current >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setTyping(false);
      }
    }, stepMs);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, speedCps, thinking]);

  return (
    <Wrap $thinking={thinking} aria-live="polite">
      <AIBadge $thinking={thinking} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3 L13.5 8 L18 9 L13.5 10 L12 15 L10.5 10 L6 9 L10.5 8 Z" />
        </svg>
      </AIBadge>
      <Content>
        {thinking ? (
          <HintText>
            <Label>IA</Label>
            <ThinkingDots style={{ display: 'inline-flex', verticalAlign: 'middle' }}>
              <Dot $delay="0s" />
              <Dot $delay="0.15s" />
              <Dot $delay="0.3s" />
            </ThinkingDots>
          </HintText>
        ) : (
          <HintText>
            {shown}
            {typing && <Caret />}
          </HintText>
        )}
      </Content>
    </Wrap>
  );
};

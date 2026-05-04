import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';

interface Props {
  text: string;
  /** Vitesse en caracteres par seconde (defaut 38 — rapide mais perceptible) */
  speedCps?: number;
}

const softPulse = keyframes`
  0%, 100% { opacity: 0.55; transform: scale(1); }
  50%      { opacity: 1;    transform: scale(1.18); }
`;

const blink = keyframes`
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
`;

const Wrap = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 14px;
  margin-top: 4px;
  background: rgba(255, 153, 153, 0.06);
  border-left: 2px solid rgba(255, 153, 153, 0.55);
  border-radius: 8px;
  min-height: 36px;
`;

const Dot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #FF9999;
  flex-shrink: 0;
  margin-top: 6px;
  animation: ${softPulse} 1.6s ease-in-out infinite;
  box-shadow: 0 0 6px rgba(255, 153, 153, 0.5);
`;

const Text = styled.p`
  font-family: 'Poppins', system-ui, -apple-system, sans-serif;
  font-size: 13.5px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.86);
  margin: 0;
  line-height: 1.45;
  letter-spacing: 0.005em;
  /* Empeche le saut de hauteur quand le texte change */
  min-height: 20px;
  flex: 1;
`;

const Caret = styled.span`
  display: inline-block;
  width: 1.5px;
  height: 14px;
  background: #FF9999;
  margin-left: 2px;
  vertical-align: middle;
  animation: ${blink} 1s steps(2, start) infinite;
  border-radius: 1px;
`;

/**
 * SmartHint — affiche le conseil IA avec un effet machine a ecrire rapide.
 *
 * Animation : 38 caracteres/sec (~26ms par char) — assez rapide pour ne pas
 * frustrer mais visible pour attirer le regard. Si le texte arrive identique
 * au precedent (cache hit), on n'anime pas a nouveau.
 */
export const SmartHint: React.FC<Props> = ({ text, speedCps = 38 }) => {
  const [shown, setShown] = useState<string>('');
  const [typing, setTyping] = useState(false);
  const lastTextRef = useRef<string>('');
  const idxRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Si le texte est identique au precedent, on ne rejoue pas l'animation
    if (text === lastTextRef.current) {
      setShown(text);
      return;
    }
    lastTextRef.current = text;

    // Stop animation precedente
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
  }, [text, speedCps]);

  return (
    <Wrap aria-live="polite">
      <Dot />
      <Text>
        {shown}
        {typing && <Caret />}
      </Text>
    </Wrap>
  );
};

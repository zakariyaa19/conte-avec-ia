import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

interface Props {
  text: string;
  /** Delai de debounce (ms) avant que le texte change apres une frappe rapide */
  debounceMs?: number;
}

const softPulse = keyframes`
  0%, 100% { opacity: 0.55; transform: scale(1); }
  50%      { opacity: 1;    transform: scale(1.15); }
`;

const fadeSlide = keyframes`
  from { opacity: 0; transform: translateY(3px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Wrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 2px 0;
  min-height: 22px; /* evite le saut de layout entre 2 hints */
`;

const Dot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #FF9999;
  flex-shrink: 0;
  animation: ${softPulse} 2.2s ease-in-out infinite;
`;

const Text = styled.p<{ $key: string }>`
  font-family: 'Poppins', system-ui, -apple-system, sans-serif;
  font-size: 13px;
  font-style: italic;
  font-weight: 400;
  color: var(--text-light, #8B8B8B);
  margin: 0;
  line-height: 1.4;
  letter-spacing: 0.005em;
  /* la cle change a chaque hint different → l'animation se rejoue */
  animation: ${fadeSlide} 240ms ease both;
`;

/**
 * SmartHint — suggestion discrete sous la textarea.
 * Apparait avec une mini animation fade quand le hint change.
 * L'utilisateur peut totalement ignorer cette suggestion.
 */
export const SmartHint: React.FC<Props> = ({ text, debounceMs = 280 }) => {
  const [displayed, setDisplayed] = useState(text);

  useEffect(() => {
    const id = setTimeout(() => setDisplayed(text), debounceMs);
    return () => clearTimeout(id);
  }, [text, debounceMs]);

  return (
    <Wrap aria-live="polite">
      <Dot />
      <Text $key={displayed}>{displayed}</Text>
    </Wrap>
  );
};

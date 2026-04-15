import React, { useState, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';

/**
 * 6.2 devbook — Flow post-achat en 3 slides, montre apres retour de Stripe.
 * Slide 1 : progression + partage (WhatsApp / copy / Facebook)
 * Slide 2 : livre pret, CTA lire / telecharger PDF / offrir
 * Slide 3 : nouvelle aventure + upsell Club (hidden pour membres Club)
 */

interface PostPurchaseFlowProps {
  protagonistName: string;
  storyReady: boolean;
  generationProgress?: number;
  shareUrl?: string;
  pdfUrl?: string | null;
  isClub?: boolean;
  onReadNow: () => void;
  onCreateAnother: () => void;
  onClose: () => void;
}

const fadeIn = keyframes`from{opacity:0}to{opacity:1}`;
const slideUp = keyframes`from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}`;

const Overlay = styled.div`
  position: fixed; inset: 0; z-index: 11000;
  background: rgba(10, 8, 30, 0.85);
  backdrop-filter: blur(16px);
  display: flex; align-items: center; justify-content: center;
  padding: 16px;
  animation: ${fadeIn} 0.3s ease;
`;

const Card = styled.div`
  width: 100%; max-width: 420px; max-height: 90vh; overflow-y: auto;
  background: linear-gradient(145deg, #1a1040, #2d1b69);
  border-radius: 24px; padding: 28px 24px; color: white;
  text-align: center;
  box-shadow: 0 24px 80px rgba(0,0,0,0.5);
  animation: ${slideUp} 0.35s ease both;
`;

const Title = styled.h2`
  font-size: 22px; font-weight: 800; margin: 0 0 10px; line-height: 1.25;
`;
const Subtitle = styled.p`
  font-size: 14px; color: rgba(255,255,255,0.7); margin: 0 0 22px; line-height: 1.5;
`;

const PrimaryBtn = styled.button`
  width: 100%; padding: 14px 20px; border-radius: 14px; border: none;
  background: linear-gradient(135deg, #FF6B6B, #FF8E53);
  color: white; font-size: 15px; font-weight: 800; cursor: pointer;
  margin-bottom: 10px;
  &:active { transform: scale(0.97); }
`;
const SecondaryBtn = styled.button`
  width: 100%; padding: 12px 18px; border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.2);
  background: rgba(255,255,255,0.04); color: white;
  font-size: 14px; font-weight: 600; cursor: pointer;
  margin-bottom: 10px;
  &:active { transform: scale(0.97); }
`;

const ShareRow = styled.div`
  display: flex; gap: 10px; margin: 10px 0 18px;
  & > button {
    flex: 1; padding: 12px 8px; border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.15);
    background: rgba(255,255,255,0.06); color: white;
    font-size: 12px; font-weight: 600; cursor: pointer;
    display: flex; flex-direction: column; align-items: center; gap: 6px;
  }
  & > button:active { transform: scale(0.96); }
`;

const ProgressTrack = styled.div`
  width: 100%; height: 6px; border-radius: 3px;
  background: rgba(255,255,255,0.1); overflow: hidden;
  margin: 6px 0 18px;
`;
const ProgressFill = styled.div<{ $pct: number }>`
  height: 100%; width: ${p => Math.max(p.$pct, 5)}%;
  background: linear-gradient(90deg, #a78bfa, #f093fb);
  transition: width 1s ease-out;
`;

const Dots = styled.div`
  display: flex; justify-content: center; gap: 6px; margin-top: 14px;
`;
const Dot = styled.span<{ $active: boolean }>`
  width: 7px; height: 7px; border-radius: 50%;
  background: ${p => p.$active ? 'white' : 'rgba(255,255,255,0.25)'};
  transition: background 0.2s;
`;

const SkipLink = styled.button`
  background: none; border: none; color: rgba(255,255,255,0.45);
  font-size: 12px; cursor: pointer; margin-top: 12px;
  text-decoration: underline;
  &:hover { color: rgba(255,255,255,0.75); }
`;

export const PostPurchaseFlow: React.FC<PostPurchaseFlowProps> = ({
  protagonistName, storyReady, generationProgress = 0,
  shareUrl, pdfUrl, isClub,
  onReadNow, onCreateAnother, onClose,
}) => {
  const [slide, setSlide] = useState<0 | 1 | 2>(storyReady ? 1 : 0);
  const [copied, setCopied] = useState(false);
  const totalSlides = isClub ? 2 : 3; // slide 2 (upsell) skip pour Club

  const urlToShare = shareUrl || (typeof window !== 'undefined' ? window.location.href : '');

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(urlToShare);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* ignore */ }
  }, [urlToShare]);

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Regardez le livre personnalise de ${protagonistName} ! ${urlToShare}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };
  const handleFacebook = () => {
    const u = encodeURIComponent(urlToShare);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${u}`, '_blank');
  };

  const next = () => setSlide(s => (s + 1) as 0 | 1 | 2);

  return (
    <Overlay onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <Card>
        {slide === 0 && (
          <>
            <Title>🎉 Le livre de {protagonistName} est en preparation !</Title>
            <Subtitle>
              Pendant que l'IA termine les illustrations, partagez la nouvelle avec vos proches.
            </Subtitle>
            <ProgressTrack><ProgressFill $pct={generationProgress} /></ProgressTrack>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', margin: '0 0 18px' }}>
              {generationProgress}% · {generationProgress < 80 ? 'Illustrations en cours' : 'Assemblage final'}
            </p>
            <ShareRow>
              <button onClick={handleWhatsApp}>
                <span style={{ fontSize: 20 }}>💬</span>
                WhatsApp
              </button>
              <button onClick={handleFacebook}>
                <span style={{ fontSize: 20 }}>📘</span>
                Facebook
              </button>
              <button onClick={handleCopy}>
                <span style={{ fontSize: 20 }}>🔗</span>
                {copied ? 'Copie !' : 'Copier'}
              </button>
            </ShareRow>
            <SecondaryBtn onClick={() => (storyReady ? next() : onClose())}>
              {storyReady ? 'Continuer →' : 'Fermer'}
            </SecondaryBtn>
          </>
        )}

        {slide === 1 && (
          <>
            <Title>📖 Votre livre est prêt !</Title>
            <Subtitle>L'histoire complete de {protagonistName} vous attend.</Subtitle>
            <PrimaryBtn onClick={onReadNow}>Lire maintenant</PrimaryBtn>
            {pdfUrl && (
              <SecondaryBtn onClick={() => window.open(pdfUrl, '_blank')}>
                Télécharger le PDF
              </SecondaryBtn>
            )}
            <SecondaryBtn onClick={handleCopy}>
              {copied ? 'Lien copié !' : 'Offrir à un proche'}
            </SecondaryBtn>
            {!isClub && <SkipLink onClick={next}>Et après ? →</SkipLink>}
          </>
        )}

        {slide === 2 && !isClub && (
          <>
            <Title>Et si {protagonistName} vivait une nouvelle aventure ?</Title>
            <Subtitle>
              Avec le Club, vous créez 4 livres par mois avec de nouveaux styles, personnages et occasions.
            </Subtitle>
            <PrimaryBtn onClick={onCreateAnother}>Créer une nouvelle histoire</PrimaryBtn>
            <SecondaryBtn
              onClick={() => { window.location.href = '/club/checkout'; }}
              style={{ background: 'linear-gradient(135deg, #a78bfa, #f093fb)', border: 'none', fontWeight: 800 }}
            >
              Découvrir le Club — 1,99€/mois
            </SecondaryBtn>
            <SkipLink onClick={onClose}>Peut-être plus tard</SkipLink>
          </>
        )}

        <Dots>
          {Array.from({ length: totalSlides }).map((_, i) => (
            <Dot key={i} $active={i === slide} />
          ))}
        </Dots>
      </Card>
    </Overlay>
  );
};

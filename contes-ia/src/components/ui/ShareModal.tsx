import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../../styles/theme';
import { ApiService } from '../../config/api';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  animation: ${fadeIn} 0.2s ease;
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);

  @media (min-width: ${theme.breakpoints.md}) {
    align-items: center;
  }
`;

const Modal = styled.div`
  background: var(--bg-elevated);
  border-radius: 24px 24px 0 0;
  padding: ${theme.spacing.lg} ${theme.spacing.lg} ${theme.spacing['2xl']};
  width: 100%;
  max-width: 420px;
  animation: ${slideUp} 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @media (min-width: ${theme.breakpoints.md}) {
    border-radius: 24px;
  }
`;

const ModalHandle = styled.div`
  width: 36px;
  height: 4px;
  background: var(--border-color);
  border-radius: 2px;
  margin: 0 auto ${theme.spacing.md};

  @media (min-width: ${theme.breakpoints.md}) {
    display: none;
  }
`;

const HeroSection = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing.lg};
`;

const HeroEmoji = styled.div`
  font-size: 40px;
  margin-bottom: 8px;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const HeroTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.xl};
  color: var(--text-primary);
  margin: 0 0 6px;
  line-height: 1.3;
`;

const HeroSubtitle = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
`;

const MessagePreview = styled.div`
  background: var(--bg-secondary);
  border-radius: 16px;
  padding: 14px 16px;
  margin-bottom: ${theme.spacing.lg};
  border-left: 3px solid ${theme.colors.accent.coral};
`;

const MessageText = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: var(--text-primary);
  margin: 0;
  line-height: 1.5;
  font-style: italic;
`;

const NativeShareButton = styled.button`
  appearance: none;
  border: none;
  cursor: pointer;
  width: 100%;
  padding: 16px;
  border-radius: 14px;
  margin-bottom: 14px;
  background: linear-gradient(135deg, ${theme.colors.accent.coral}, #FF7F7F);
  color: white;
  font-size: 16px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: transform 0.15s;
  box-shadow: 0 4px 16px rgba(255, 120, 120, 0.3);

  &:active { transform: scale(0.97); }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;

  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border-color);
  }
`;

const DividerText = styled.span`
  font-size: ${theme.fontSizes.xs};
  color: var(--text-light);
`;

const ShareGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.lg};
`;

const ShareButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
  border-radius: ${theme.borderRadius.lg};
  transition: all 0.2s ease;

  &:hover { background: var(--bg-secondary); }
  &:active { transform: scale(0.95); }
`;

const ShareIcon = styled.div<{ $bg: string }>`
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: ${p => p.$bg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  box-shadow: 0 2px 8px ${p => p.$bg}40;
`;

const ShareLabel = styled.span`
  font-size: 11px;
  color: var(--text-secondary);
  font-weight: 600;
`;

const CopyLinkRow = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  align-items: center;
  padding: 10px 14px;
  background: var(--bg-secondary);
  border-radius: 12px;
  margin-bottom: ${theme.spacing.md};
`;

const LinkText = styled.span`
  flex: 1;
  font-size: 11px;
  color: var(--text-light);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: monospace;
`;

const CopyButton = styled.button<{ $copied: boolean }>`
  padding: 6px 14px;
  border-radius: 8px;
  border: none;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  background: ${p => p.$copied ? '#10B981' : theme.colors.accent.coral};
  color: white;
  white-space: nowrap;
`;

const CloseButton = styled.button`
  display: block;
  width: 100%;
  padding: 10px;
  border: none;
  background: none;
  color: var(--text-light);
  font-size: ${theme.fontSizes.sm};
  font-weight: 500;
  cursor: pointer;
  text-align: center;
  border-radius: 10px;

  &:hover { color: var(--text-primary); background: var(--bg-secondary); }
`;

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  storyId: string;
  protagonistName: string;
  coverTitle?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen, onClose, storyId, protagonistName, coverTitle
}) => {
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && !shareUrl) {
      generateLink();
    }
  }, [isOpen]); // eslint-disable-line

  const generateLink = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) return;
    setLoading(true);
    try {
      const res = await ApiService.generateShareToken(token, storyId);
      if (res.success && res.data?.shareToken) {
        const url = `${window.location.origin}/story/${res.data.shareToken}`;
        setShareUrl(url);
      }
    } catch (err) {
      console.error('Erreur generation lien partage:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      const input = document.createElement('input');
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareText = `Regarde le conte personnalise de ${protagonistName} ! Une histoire magique creee rien que pour lui. Viens la decouvrir :`;
  const title = coverTitle || `Le conte de ${protagonistName}`;

  const handleNativeShare = async () => {
    if (navigator.share && shareUrl) {
      try {
        // Fusionner texte + URL dans le champ text (iOS ignore text si url est séparé)
        await navigator.share({ text: `${shareText}\n\n${shareUrl}` });
        return true;
      } catch { /* cancelled */ }
    }
    return false;
  };

  const handleWhatsApp = () => {
    if (!shareUrl) return;
    const text = encodeURIComponent(`${shareText}\n\n${shareUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleFacebook = () => {
    if (!shareUrl) return;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <ModalHandle />

        <HeroSection>
          <HeroEmoji>📖</HeroEmoji>
          <HeroTitle>Partagez le conte de {protagonistName}</HeroTitle>
          <HeroSubtitle>Faites decouvrir cette histoire magique a vos proches</HeroSubtitle>
        </HeroSection>

        {/* Aperçu du message qui sera envoyé */}
        <MessagePreview>
          <MessageText>
            "{shareText}"
          </MessageText>
        </MessagePreview>

        {/* Bouton principal : partage natif (mobile) */}
        {typeof navigator.share === 'function' && shareUrl && (
          <NativeShareButton onClick={handleNativeShare}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            Envoyer a mes proches
          </NativeShareButton>
        )}

        <Divider><DividerText>ou choisir</DividerText></Divider>

        {/* Grille : WhatsApp, Facebook, Copier */}
        <ShareGrid>
          <ShareButton onClick={handleWhatsApp}>
            <ShareIcon $bg="#25D366">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </ShareIcon>
            <ShareLabel>WhatsApp</ShareLabel>
          </ShareButton>

          <ShareButton onClick={handleFacebook}>
            <ShareIcon $bg="#1877F2">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </ShareIcon>
            <ShareLabel>Facebook</ShareLabel>
          </ShareButton>

          <ShareButton onClick={handleCopy}>
            <ShareIcon $bg={copied ? '#10B981' : '#6B7280'}>
              {copied ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                </svg>
              )}
            </ShareIcon>
            <ShareLabel>{copied ? 'Copie !' : 'Copier'}</ShareLabel>
          </ShareButton>
        </ShareGrid>

        {/* Lien visible */}
        {shareUrl && (
          <CopyLinkRow>
            <LinkText>{shareUrl}</LinkText>
            <CopyButton $copied={copied} onClick={handleCopy}>
              {copied ? 'Copie !' : 'Copier'}
            </CopyButton>
          </CopyLinkRow>
        )}

        {loading && (
          <CopyLinkRow>
            <LinkText>Generation du lien de partage...</LinkText>
          </CopyLinkRow>
        )}

        <CloseButton onClick={onClose}>Fermer</CloseButton>
      </Modal>
    </Overlay>
  );
};

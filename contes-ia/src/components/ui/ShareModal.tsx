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

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  animation: ${fadeIn} 0.2s ease;
  -webkit-backdrop-filter: blur(4px);
  backdrop-filter: blur(4px);

  @media (min-width: ${theme.breakpoints.md}) {
    align-items: center;
  }
`;

const Modal = styled.div`
  background: white;
  border-radius: 20px 20px 0 0;
  padding: ${theme.spacing.xl} ${theme.spacing.lg} ${theme.spacing['2xl']};
  width: 100%;
  max-width: 420px;
  animation: ${slideUp} 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @media (min-width: ${theme.breakpoints.md}) {
    border-radius: 20px;
  }
`;

const ModalHandle = styled.div`
  width: 36px;
  height: 4px;
  background: #D1D5DB;
  border-radius: 2px;
  margin: 0 auto ${theme.spacing.lg};

  @media (min-width: ${theme.breakpoints.md}) {
    display: none;
  }
`;

const ModalTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.lg};
  color: ${theme.colors.text.primary};
  text-align: center;
  margin: 0 0 4px;
`;

const ModalSubtitle = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
  text-align: center;
  margin: 0 0 ${theme.spacing.xl};
`;

const ShareGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
`;

const ShareButton = styled.button<{ $bg: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.lg};
  transition: all 0.2s ease;

  &:hover {
    background: ${theme.colors.background.secondary};
  }
  &:active { transform: scale(0.95); }
`;

const ShareIcon = styled.div<{ $bg: string }>`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: ${p => p.$bg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
`;

const ShareLabel = styled.span`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.text.secondary};
  font-weight: 500;
`;

const CopyLinkRow = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  align-items: center;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: ${theme.colors.background.secondary};
  border-radius: ${theme.borderRadius.lg};
  margin-bottom: ${theme.spacing.md};
`;

const LinkText = styled.span`
  flex: 1;
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.text.light};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CopyButton = styled.button<{ $copied: boolean }>`
  padding: 6px 14px;
  border-radius: ${theme.borderRadius.md};
  border: none;
  font-size: ${theme.fontSizes.xs};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background: ${p => p.$copied ? theme.colors.status.success : theme.colors.accent.coral};
  color: white;
  white-space: nowrap;
`;

const CloseButton = styled.button`
  display: block;
  width: 100%;
  padding: ${theme.spacing.sm};
  border: none;
  background: none;
  color: ${theme.colors.text.light};
  font-size: ${theme.fontSizes.sm};
  cursor: pointer;
  text-align: center;

  &:hover { color: ${theme.colors.text.primary}; }
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
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement('input');
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareText = `${protagonistName} est le héros de son propre livre ! Découvrez son histoire créée avec Contes d'IA`;
  const title = coverTitle || `L'histoire de ${protagonistName}`;

  const handleNativeShare = async () => {
    if (navigator.share && shareUrl) {
      try {
        await navigator.share({ title, text: shareText, url: shareUrl });
        return true;
      } catch { /* cancelled */ }
    }
    return false;
  };

  const handleWhatsApp = () => {
    if (!shareUrl) return;
    const text = encodeURIComponent(`${shareText}\n${shareUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleFacebook = () => {
    if (!shareUrl) return;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const handleInstagram = () => {
    // Instagram doesn't support direct URL sharing, copy link instead
    handleCopy();
  };

  const handleShare = async (platform: string) => {
    // Try native share on mobile first
    if (platform === 'native') {
      const shared = await handleNativeShare();
      if (shared) return;
    }

    switch (platform) {
      case 'whatsapp': handleWhatsApp(); break;
      case 'facebook': handleFacebook(); break;
      case 'instagram': handleInstagram(); break;
    }
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <ModalHandle />
        <ModalTitle>Partager l'histoire de {protagonistName}</ModalTitle>
        <ModalSubtitle>Montrez cette aventure à votre famille</ModalSubtitle>

        <ShareGrid>
          <ShareButton $bg="#25D366" onClick={() => handleShare('whatsapp')}>
            <ShareIcon $bg="#25D366">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </ShareIcon>
            <ShareLabel>WhatsApp</ShareLabel>
          </ShareButton>

          <ShareButton $bg="#E4405F" onClick={() => handleShare('instagram')}>
            <ShareIcon $bg="linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </ShareIcon>
            <ShareLabel>Instagram</ShareLabel>
          </ShareButton>

          <ShareButton $bg="#1877F2" onClick={() => handleShare('facebook')}>
            <ShareIcon $bg="#1877F2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </ShareIcon>
            <ShareLabel>Facebook</ShareLabel>
          </ShareButton>

          <ShareButton $bg="#6B7280" onClick={() => handleShare('native')}>
            <ShareIcon $bg="#6B7280">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"/>
                <circle cx="6" cy="12" r="3"/>
                <circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
            </ShareIcon>
            <ShareLabel>Plus</ShareLabel>
          </ShareButton>
        </ShareGrid>

        {shareUrl && (
          <CopyLinkRow>
            <LinkText>{shareUrl}</LinkText>
            <CopyButton $copied={copied} onClick={handleCopy}>
              {copied ? 'Copié !' : 'Copier'}
            </CopyButton>
          </CopyLinkRow>
        )}

        {loading && (
          <CopyLinkRow>
            <LinkText>Génération du lien...</LinkText>
          </CopyLinkRow>
        )}

        <CloseButton onClick={onClose}>Fermer</CloseButton>
      </Modal>
    </Overlay>
  );
};

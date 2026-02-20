import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { theme } from '../styles/theme';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { StoryPDFViewer } from '../components/ui/StoryPDFViewer';
import { ApiService } from '../config/api';
import {
  GENERAL_THEMES,
  SPECIFIC_SUBJECTS,
  CENTRAL_MESSAGES,
  ILLUSTRATION_STYLES
} from '../types/FormTypes';

/* ─── Traduction des valeurs BDD vers labels francais ─── */

const translateValue = (value: string, options: { value: string; label: string }[]): string => {
  const found = options.find(o => o.value === value);
  return found ? found.label : value;
};

const translateTheme = (v: string) => translateValue(v, GENERAL_THEMES);
const translateSubject = (v: string) => translateValue(v, SPECIFIC_SUBJECTS);
const translateMessage = (v: string) => translateValue(v, CENTRAL_MESSAGES);
const translateStyle = (v: string) => translateValue(v, ILLUSTRATION_STYLES);

/* ─── Animations ─── */

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

/* ─── Styled Components ─── */

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${theme.colors.background.primary};
`;

const MainContent = styled.main`
  flex: 1;
  max-width: 900px;
  margin: 0 auto;
  padding: ${theme.spacing.xl} ${theme.spacing.lg};
  width: 100%;
  animation: ${fadeInUp} 0.6s ease-out;

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.md} ${theme.spacing.sm};
  }
`;

const BackLink = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.accent.coral};
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
  cursor: pointer;
  margin-bottom: ${theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  padding: 0;

  &:hover { text-decoration: underline; }

  @media (max-width: ${theme.breakpoints.sm}) {
    margin-bottom: ${theme.spacing.sm};
    font-size: ${theme.fontSizes.xs};
  }
`;

const Card = styled.div`
  background: ${theme.colors.background.white};
  border-radius: ${theme.borderRadius['2xl']};
  box-shadow: ${theme.shadows.card};
  border: 1px solid rgba(0, 0, 0, 0.04);
  padding: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.md};
    border-radius: ${theme.borderRadius.xl};
  }
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.sm}) {
    margin-bottom: ${theme.spacing.sm};
  }
`;

const StoryTitle = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['2xl']};
  color: ${theme.colors.text.primary};
  margin: 0;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.xl};
  }
`;

const StatusBadge = styled.span<{ $color: string }>`
  display: inline-flex;
  padding: 4px ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.xs};
  font-weight: 700;
  background: ${props => props.$color}20;
  color: ${props => props.$color};
  white-space: nowrap;
  flex-shrink: 0;
`;

const ActionsRow = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.sm}) {
    margin-bottom: ${theme.spacing.md};
    gap: ${theme.spacing.xs};
  }
`;

const ActionButton = styled.button<{ $variant: 'primary' | 'secondary' | 'ghost' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  border-radius: ${theme.borderRadius.lg};
  font-weight: 600;
  font-size: ${theme.fontSizes.sm};
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  flex: ${props => props.$variant === 'ghost' ? '0 0 auto' : '1'};
  min-width: 0;

  ${props => props.$variant === 'primary' && `
    background: ${theme.colors.accent.coral};
    color: white;
    &:hover { background: ${theme.colors.accent.coralDark || '#e05a4a'}; }
  `}

  ${props => props.$variant === 'secondary' && `
    background: ${theme.colors.accent.coral}12;
    color: ${theme.colors.accent.coral};
    &:hover { background: ${theme.colors.accent.coral}20; }
  `}

  ${props => props.$variant === 'ghost' && `
    background: transparent;
    color: ${theme.colors.text.secondary};
    padding: 10px 12px;
    &:hover { background: rgba(0,0,0,0.04); }
  `}

  &:active { transform: scale(0.97); }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: 10px 12px;
    font-size: ${theme.fontSizes.xs};
  }
`;

const ButtonSpinner = styled.span`
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: ${spin} 0.6s linear infinite;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.sm} ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.sm}) {
    gap: ${theme.spacing.xs} ${theme.spacing.sm};
  }
`;

const InfoItem = styled.div`
  label {
    display: block;
    font-size: 10px;
    color: ${theme.colors.text.light};
    font-weight: 600;
    margin-bottom: 2px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  span {
    font-size: ${theme.fontSizes.sm};
    color: ${theme.colors.text.primary};
  }
`;

const FavoriteButton = styled.button<{ $active: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  padding: 4px;
  transition: transform 0.2s ease;
  flex-shrink: 0;

  &:hover { transform: scale(1.15); }
  &:active { transform: scale(0.95); }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  margin: ${theme.spacing.md} 0;

  @media (max-width: ${theme.breakpoints.sm}) {
    margin: ${theme.spacing.sm} 0;
  }
`;

const ErrorBanner = styled.div`
  background: #FEE2E2;
  color: #DC2626;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.fontSizes.sm};
  margin-bottom: ${theme.spacing.sm};
  text-align: center;
`;

const LoadingText = styled.div`
  text-align: center;
  padding: ${theme.spacing['3xl']};
  color: ${theme.colors.text.secondary};
`;

/* ─── Composant ─── */

export const StoryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [story, setStory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  useEffect(() => {
    loadStory();
  }, [id]);

  const loadStory = async () => {
    const token = localStorage.getItem('userToken');
    if (!token || !id) return;

    try {
      const response = await ApiService.getClientStoryDetail(token, id);
      if (response.success) {
        setStory(response.data);
      }
    } catch (error) {
      console.error('Erreur chargement conte:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    const token = localStorage.getItem('userToken');
    if (!token || !id) return;

    try {
      const blobUrl = await ApiService.downloadStoryPdf(token, id);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `conte-${story?.protagonistName || 'histoire'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Erreur telechargement:', error);
      setPdfError('Erreur lors du telechargement. Reessayez.');
    }
  };

  const handleViewPdf = async () => {
    const token = localStorage.getItem('userToken');
    if (!token || !id) return;

    setPdfError(null);
    setPdfLoading(true);

    try {
      if (!pdfUrl) {
        const blobUrl = await ApiService.downloadStoryPdf(token, id);
        setPdfUrl(blobUrl);
      }
      setViewerOpen(true);
    } catch (error) {
      console.error('Erreur lecture PDF:', error);
      setPdfError('Impossible de charger le PDF. Verifiez votre connexion et reessayez.');
    } finally {
      setPdfLoading(false);
    }
  };

  const handleCloseViewer = () => {
    setViewerOpen(false);
  };

  const handleToggleFavorite = async () => {
    const token = localStorage.getItem('userToken');
    if (!token || !id) return;

    try {
      const response = await ApiService.toggleFavorite(token, id);
      if (response.success) {
        setStory((prev: any) => ({ ...prev, isFavorite: response.data.isFavorite }));
      }
    } catch (error) {
      console.error('Erreur toggle favori:', error);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <Header />
        <LoadingText>Chargement du conte...</LoadingText>
        <Footer />
      </PageContainer>
    );
  }

  if (!story) {
    return (
      <PageContainer>
        <Header />
        <MainContent>
          <p>Conte non trouve.</p>
          <Button variant="primary" onClick={() => navigate('/dashboard')}>Retour</Button>
        </MainContent>
        <Footer />
      </PageContainer>
    );
  }

  const isAvailable = story.storyStatus === 'DISPONIBLE';
  const statusColor = isAvailable ? theme.colors.status.success : theme.colors.status.warning;

  return (
    <PageContainer>
      <Header />
      <MainContent>
        <BackLink onClick={() => navigate('/dashboard')}>
          &larr; Retour
        </BackLink>

        <Card>
          {/* Titre + statut + favori sur la meme ligne */}
          <TitleRow>
            <StoryTitle>Conte de {story.protagonistName}</StoryTitle>
            <FavoriteButton
              $active={story.isFavorite}
              onClick={handleToggleFavorite}
              title={story.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            >
              {story.isFavorite ? '❤️' : '🤍'}
            </FavoriteButton>
          </TitleRow>

          <StatusBadge $color={statusColor} style={{ marginBottom: theme.spacing.md }}>
            {isAvailable ? 'Disponible' : 'En cours de creation'}
          </StatusBadge>

          {/* Boutons d'action en haut — visibles immediatement */}
          {isAvailable && story.pdfUrl && (
            <>
              {pdfError && <ErrorBanner>{pdfError}</ErrorBanner>}
              <ActionsRow>
                <ActionButton
                  $variant="primary"
                  onClick={handleViewPdf}
                  disabled={pdfLoading}
                >
                  {pdfLoading ? <ButtonSpinner /> : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                  Lire le conte
                </ActionButton>
                <ActionButton
                  $variant="secondary"
                  onClick={handleDownloadPdf}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Telecharger
                </ActionButton>
              </ActionsRow>
            </>
          )}

          <Divider />

          {/* Infos du conte — grille compacte 2 colonnes */}
          <InfoGrid>
            <InfoItem>
              <label>Theme</label>
              <span>{translateTheme(story.generalTheme)}</span>
            </InfoItem>
            <InfoItem>
              <label>Occasion</label>
              <span>{translateSubject(story.specificSubject)}</span>
            </InfoItem>
            <InfoItem>
              <label>Age</label>
              <span>{story.ageRange} ans</span>
            </InfoItem>
            <InfoItem>
              <label>Style</label>
              <span>{translateStyle(story.illustrationStyle)}</span>
            </InfoItem>
            <InfoItem>
              <label>Message</label>
              <span>{translateMessage(story.centralMessage)}</span>
            </InfoItem>
            <InfoItem>
              <label>Format</label>
              <span>eBook</span>
            </InfoItem>
          </InfoGrid>
        </Card>
      </MainContent>
      <Footer />

      <StoryPDFViewer
        isOpen={viewerOpen}
        onClose={handleCloseViewer}
        pdfUrl={pdfUrl}
        title={`Conte de ${story.protagonistName}`}
        onDownload={handleDownloadPdf}
      />
    </PageContainer>
  );
};

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { theme } from '../styles/theme';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { StoryPDFViewer } from '../components/ui/StoryPDFViewer';
import { ApiService } from '../config/api';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`;

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
  padding: ${theme.spacing['2xl']} ${theme.spacing.lg};
  width: 100%;
  animation: ${fadeInUp} 0.6s ease-out;

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.lg} ${theme.spacing.md};
  }
`;

const BackLink = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.accent.coral};
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
  cursor: pointer;
  margin-bottom: ${theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};

  &:hover { text-decoration: underline; }
`;

const Card = styled.div`
  background: ${theme.colors.background.white};
  border-radius: ${theme.borderRadius['2xl']};
  box-shadow: ${theme.shadows.card};
  border: 1px solid rgba(0, 0, 0, 0.04);
  padding: ${theme.spacing['2xl']};
  margin-bottom: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.lg};
    border-radius: ${theme.borderRadius.xl};
  }
`;

const StoryTitle = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['3xl']};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes['2xl']};
    margin: 0 0 ${theme.spacing.md};
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.sm};
    margin-bottom: ${theme.spacing.lg};
  }
`;

const InfoItem = styled.div`
  label {
    display: block;
    font-size: ${theme.fontSizes.xs};
    color: ${theme.colors.text.light};
    font-weight: 600;
    margin-bottom: ${theme.spacing.xs};
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  span {
    font-size: ${theme.fontSizes.base};
    color: ${theme.colors.text.primary};
  }
`;

const StatusBadge = styled.span<{ $color: string }>`
  display: inline-flex;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.xs};
  font-weight: 700;
  background: ${props => props.$color}20;
  color: ${props => props.$color};
`;

const ActionsRow = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  flex-wrap: wrap;

  @media (max-width: ${theme.breakpoints.sm}) {
    gap: ${theme.spacing.sm};
  }
`;

const LoadingText = styled.div`
  text-align: center;
  padding: ${theme.spacing['3xl']};
  color: ${theme.colors.text.secondary};
`;

export const StoryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [story, setStory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

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
      link.download = `conte-${story?.protagonistName || 'story'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Erreur telechargement:', error);
    }
  };

  const handleViewPdf = async () => {
    const token = localStorage.getItem('userToken');
    if (!token || !id) return;

    try {
      // Si le PDF n'est pas encore charge, le charger
      if (!pdfUrl) {
        const blobUrl = await ApiService.downloadStoryPdf(token, id);
        setPdfUrl(blobUrl);
      }
      setViewerOpen(true);
    } catch (error) {
      console.error('Erreur lecture PDF:', error);
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

  const statusColor = story.storyStatus === 'DISPONIBLE' ? theme.colors.status.success : theme.colors.status.warning;

  return (
    <PageContainer>
      <Header />
      <MainContent>
        <BackLink onClick={() => navigate('/dashboard')}>
          &larr; Retour a ma bibliotheque
        </BackLink>

        <Card>
          <StoryTitle>Conte de {story.protagonistName}</StoryTitle>

          <InfoGrid>
            <InfoItem>
              <label>Statut</label>
              <StatusBadge $color={statusColor}>
                {story.storyStatus === 'DISPONIBLE' ? 'Disponible' : 'En cours de creation'}
              </StatusBadge>
            </InfoItem>
            <InfoItem>
              <label>Theme</label>
              <span>{story.generalTheme}</span>
            </InfoItem>
            <InfoItem>
              <label>Tranche d'age</label>
              <span>{story.ageRange} ans</span>
            </InfoItem>
            <InfoItem>
              <label>Style</label>
              <span>{story.illustrationStyle}</span>
            </InfoItem>
            <InfoItem>
              <label>Message</label>
              <span>{story.centralMessage}</span>
            </InfoItem>
            <InfoItem>
              <label>Format</label>
              <span>eBook Numerique</span>
            </InfoItem>
          </InfoGrid>

          <ActionsRow>
            {story.storyStatus === 'DISPONIBLE' && story.pdfUrl && (
              <>
                <Button variant="primary" size="md" onClick={handleViewPdf}>
                  Lire le conte
                </Button>
                <Button variant="secondary" size="md" onClick={handleDownloadPdf}>
                  Telecharger le PDF
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="md"
              onClick={handleToggleFavorite}
            >
              {story.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            </Button>
          </ActionsRow>
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

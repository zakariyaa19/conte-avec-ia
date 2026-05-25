import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { ApiService } from '../config/api';
import { AdminLayout } from '../components/admin/AdminLayout';
import { StoryReader } from '../components/ui/StoryReader';
import { getImageUrl } from '../config/constants';

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.light};
  margin-bottom: ${theme.spacing.lg};

  span.link {
    color: ${theme.colors.admin.accent};
    cursor: pointer;
    &:hover { text-decoration: underline; }
  }
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
  flex-wrap: wrap;
  gap: ${theme.spacing.sm};
`;

const PageTitle = styled.h1`
  font-size: ${theme.fontSizes['2xl']};
  font-weight: 700;
  color: ${theme.colors.text.primary};
  margin: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  flex-wrap: wrap;
`;

const PrimaryBtn = styled.button`
  background: ${theme.colors.admin.accent};
  color: white;
  border: none;
  padding: 8px 18px;
  border-radius: ${theme.borderRadius.md};
  font-weight: 600;
  font-size: ${theme.fontSizes.sm};
  cursor: pointer;
  &:hover { opacity: 0.9; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const GhostBtn = styled.button`
  background: white;
  color: ${theme.colors.text.primary};
  border: 1px solid ${theme.colors.admin.cardBorder};
  padding: 8px 16px;
  border-radius: ${theme.borderRadius.md};
  font-weight: 500;
  font-size: ${theme.fontSizes.sm};
  cursor: pointer;
  &:hover { background: ${theme.colors.admin.contentBg}; }
`;

const InfoBanner = styled.div`
  background: white;
  border: 1px solid ${theme.colors.admin.cardBorder};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.md};
  font-size: ${theme.fontSizes.sm};
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const InfoLabel = styled.span`
  color: ${theme.colors.text.light};
  font-size: ${theme.fontSizes.xs};
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
`;

const InfoValue = styled.span`
  color: ${theme.colors.text.primary};
  font-weight: 600;
`;

const PreviewBadge = styled.span`
  display: inline-block;
  padding: 4px 10px;
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.xs};
  font-weight: 700;
  color: #92400E;
  background: #FEF3C7;
  margin-left: ${theme.spacing.sm};
`;

const BookLayout = styled.div`
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: ${theme.spacing.xl};
  margin-bottom: ${theme.spacing.xl};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CoverWrapper = styled.div`
  width: 240px;
  aspect-ratio: 2 / 3;
  border-radius: 4px 14px 14px 4px;
  overflow: hidden;
  box-shadow:
    -4px 0 10px rgba(0,0,0,0.15),
    6px 4px 20px rgba(0,0,0,0.25);
  background: linear-gradient(135deg, #FFE4E1, #FFF8DC);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CoverPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  color: ${theme.colors.text.light};
`;

const ParagraphCard = styled.div`
  background: white;
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.admin.cardBorder};
  overflow: hidden;
  margin-bottom: ${theme.spacing.md};
`;

const ParagraphIllustration = styled.div`
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: ${theme.colors.admin.contentBg};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ParagraphContent = styled.div`
  padding: ${theme.spacing.lg};
`;

const ParagraphNumber = styled.div`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.text.light};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
  margin-bottom: ${theme.spacing.xs};
`;

const ParagraphText = styled.p`
  font-size: ${theme.fontSizes.base};
  color: ${theme.colors.text.primary};
  line-height: 1.8;
  margin: 0;
  white-space: pre-wrap;
`;

const EmptyState = styled.div`
  background: white;
  border: 1px dashed ${theme.colors.admin.cardBorder};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing['2xl']};
  text-align: center;
  color: ${theme.colors.text.light};
  font-size: ${theme.fontSizes.base};
`;

const LoadingState = styled.div`
  text-align: center;
  padding: ${theme.spacing['3xl']};
  color: ${theme.colors.text.light};
`;

const ErrorMsg = styled.div`
  background: #FEE2E2;
  border: 1px solid #FCA5A5;
  color: #B91C1C;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  margin-bottom: ${theme.spacing.md};
  font-size: ${theme.fontSizes.sm};
`;

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

interface AdminStoryViewerPageProps {
  token: string;
}

export const AdminStoryViewerPage: React.FC<AdminStoryViewerPageProps> = ({ token }) => {
  const { storyOrderId } = useParams<{ storyOrderId: string }>();
  const navigate = useNavigate();
  const [story, setStory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [readerOpen, setReaderOpen] = useState(false);

  const getToken = () => localStorage.getItem('adminToken') || token;

  useEffect(() => {
    if (storyOrderId) loadStory();
    // eslint-disable-next-line
  }, [storyOrderId]);

  const loadStory = async () => {
    if (!storyOrderId) return;
    try {
      setLoading(true);
      setError('');
      const res = await ApiService.getAdminStoryContent(getToken(), storyOrderId);
      if (res.success) {
        setStory(res.data);
      } else {
        setError('Livre non trouvé');
      }
    } catch (err: any) {
      setError('Erreur lors du chargement: ' + (err?.message || 'inconnue'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <AdminLayout><LoadingState>Chargement du livre...</LoadingState></AdminLayout>;
  }

  if (error || !story) {
    return (
      <AdminLayout>
        <Breadcrumb>
          <span className="link" onClick={() => navigate('/admin/orders')}>Commandes</span>
          <span>/</span>
          <span>Livre</span>
        </Breadcrumb>
        <ErrorMsg>{error || 'Livre non trouvé'}</ErrorMsg>
      </AdminLayout>
    );
  }

  const coverUrl: string | null = (story.coverImageUrl ? getImageUrl(story.coverImageUrl) : null) || null;
  const paragraphs: string[] = story.storyParagraphs || [];
  const illustrations: string[] = story.illustrationUrls || [];
  const firstIllustration = story.firstIllustrationUrl ? getImageUrl(story.firstIllustrationUrl) : null;
  const displayTitle = story.coverTitle || `L'histoire de ${story.protagonistName}`;

  return (
    <AdminLayout>
      <Breadcrumb>
        <span className="link" onClick={() => navigate('/admin')}>Admin</span>
        <span>/</span>
        <span className="link" onClick={() => navigate('/admin/orders')}>Commandes</span>
        <span>/</span>
        <span className="link" onClick={() => navigate(`/admin/order/${story.orderId}`)}>#{story.orderId.slice(-8)}</span>
        <span>/</span>
        <span>Lecture du livre</span>
      </Breadcrumb>

      <PageHeader>
        <PageTitle>
          {displayTitle}
          {story.isPreview && <PreviewBadge>Chapitre gratuit uniquement</PreviewBadge>}
        </PageTitle>
        <HeaderActions>
          {paragraphs.length > 0 && (
            <PrimaryBtn onClick={() => setReaderOpen(true)}>
              Lire en plein écran
            </PrimaryBtn>
          )}
          <GhostBtn onClick={() => navigate(`/admin/order/${story.orderId}`)}>
            Détails commande
          </GhostBtn>
        </HeaderActions>
      </PageHeader>

      <InfoBanner>
        <InfoItem>
          <InfoLabel>Client</InfoLabel>
          <InfoValue>{story.clientEmail || '-'}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Statut</InfoLabel>
          <InfoValue>{story.status}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Protagoniste</InfoLabel>
          <InfoValue>{story.protagonistName}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Tranche d'âge</InfoLabel>
          <InfoValue>{story.ageRange}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Thème</InfoLabel>
          <InfoValue>{story.generalTheme}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Style illustration</InfoLabel>
          <InfoValue>{story.illustrationStyle}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Paragraphes</InfoLabel>
          <InfoValue>{paragraphs.length}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Illustrations</InfoLabel>
          <InfoValue>{illustrations.length}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Créé le</InfoLabel>
          <InfoValue>{formatDate(story.createdAt)}</InfoValue>
        </InfoItem>
      </InfoBanner>

      <BookLayout>
        <CoverWrapper>
          {coverUrl ? (
            <img src={coverUrl} alt={displayTitle} />
          ) : (
            <CoverPlaceholder>📖</CoverPlaceholder>
          )}
        </CoverWrapper>

        <div>
          {paragraphs.length === 0 ? (
            <EmptyState>
              Aucun contenu généré pour cette commande.<br />
              {story.status === 'PENDING' || story.status === 'UNPAID'
                ? 'Le client n\'a pas (encore) payé.'
                : story.status === 'PAID'
                  ? 'La commande est payée mais pas encore envoyée en génération.'
                  : 'La génération n\'a pas encore produit de texte.'}
            </EmptyState>
          ) : (
            paragraphs.map((p, i) => {
              const img = illustrations[i] || (i === 0 ? firstIllustration : null);
              const imgSrc = img ? (img.startsWith('http') ? img : getImageUrl(img)) : null;
              return (
                <ParagraphCard key={i}>
                  {imgSrc && (
                    <ParagraphIllustration>
                      <img src={imgSrc} alt={`Illustration ${i + 1}`} loading="lazy" />
                    </ParagraphIllustration>
                  )}
                  <ParagraphContent>
                    <ParagraphNumber>Paragraphe {i + 1} / {paragraphs.length}</ParagraphNumber>
                    <ParagraphText>{p}</ParagraphText>
                  </ParagraphContent>
                </ParagraphCard>
              );
            })
          )}
        </div>
      </BookLayout>

      {readerOpen && paragraphs.length > 0 && (
        <StoryReader
          coverImageUrl={coverUrl}
          coverTitle={displayTitle}
          paragraphs={paragraphs}
          illustrationUrls={illustrations}
          protagonistName={story.protagonistName}
          creatorName={story.creatorName}
          narratedBy={story.narratedBy}
          onClose={() => setReaderOpen(false)}
        />
      )}
    </AdminLayout>
  );
};

export default AdminStoryViewerPage;

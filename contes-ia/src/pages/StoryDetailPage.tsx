import React, { useState, useEffect } from 'react';
import { safeLocalStorage } from '../utils/safeStorage';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { theme } from '../styles/theme';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { StoryPDFViewer } from '../components/ui/StoryPDFViewer';
import { StoryReader } from '../components/ui/StoryReader';
import { ApiService } from '../config/api';
import { getImageUrl } from '../config/constants';
import { ShareModal } from '../components/ui/ShareModal';
import { useAuth } from '../contexts/AuthContext';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
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

const gentleFloat = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
`;

/* ─── Styled Components ─── */

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-primary);
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
  margin-bottom: ${theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  padding: 0;

  &:hover { text-decoration: underline; }
`;

/* ─── Hero : couverture + infos principales ─── */

const HeroSection = styled.div`
  display: flex;
  gap: ${theme.spacing.xl};
  margin-bottom: ${theme.spacing.xl};
  align-items: flex-start;

  @media (max-width: ${theme.breakpoints.md}) {
    flex-direction: column;
    align-items: center;
  }
`;

const CoverWrapper = styled.div`
  flex-shrink: 0;
  width: 220px;
  aspect-ratio: 2 / 3;
  border-radius: 4px 14px 14px 4px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  box-shadow:
    -4px 0 10px rgba(0,0,0,0.15),
    6px 4px 20px rgba(0,0,0,0.25),
    inset -2px 0 4px rgba(255,255,255,0.1);
  animation: ${gentleFloat} 4s ease-in-out infinite;
  transition: transform 0.2s ease;

  &:active { transform: scale(0.97); }

  @media (max-width: ${theme.breakpoints.sm}) {
    width: 180px;
  }
`;

const CoverImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CoverPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, ${theme.colors.accent.softPink}, ${theme.colors.accent.creamyYellow});
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
`;

const PlaceholderIcon = styled.div`
  font-size: 3rem;
  opacity: 0.5;
`;

const PlaceholderName = styled.div`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.base};
  color: var(--text-secondary);
  font-weight: 600;
  text-align: center;
  padding: 0 ${theme.spacing.sm};
`;

const CoverSpine = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 6px;
  background: linear-gradient(to right, rgba(0,0,0,0.35), rgba(0,0,0,0.05));
  z-index: 2;
`;

const HeroInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};

  @media (max-width: ${theme.breakpoints.md}) {
    align-items: center;
    text-align: center;
    width: 100%;
  }
`;

const StoryTitle = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['2xl']};
  color: var(--text-primary);
  margin: 0;
  line-height: 1.3;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.xl};
  }
`;

const StorySubtitle = styled.p`
  font-size: ${theme.fontSizes.base};
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
`;

const TagsRow = styled.div`
  display: flex;
  gap: ${theme.spacing.xs};
  flex-wrap: wrap;

  @media (max-width: ${theme.breakpoints.md}) {
    justify-content: center;
  }
`;

const Tag = styled.span<{ $color?: string }>`
  display: inline-flex;
  padding: 3px 10px;
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.xs};
  font-weight: 600;
  background: ${props => props.$color ? `${props.$color}18` : `var(--bg-secondary)`};
  color: ${props => props.$color || `var(--text-secondary)`};
`;

const FavoriteRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const FavoriteButton = styled.button<{ $active: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 22px;
  padding: 4px;
  transition: transform 0.2s ease;
  flex-shrink: 0;

  &:hover { transform: scale(1.15); }
  &:active { transform: scale(0.95); }
`;

const FavoriteLabel = styled.span`
  font-size: ${theme.fontSizes.xs};
  color: var(--text-light);
`;

const DateText = styled.span`
  font-size: ${theme.fontSizes.xs};
  color: var(--text-light);
`;

/* ─── Actions ─── */

const ActionsCard = styled.div`
  background: var(--bg-card);
  border-radius: ${theme.borderRadius.xl};
  box-shadow: var(--shadow-card);
  border: 1px solid var(--border-color);
  padding: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
`;

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${theme.spacing.md};
  width: 100%;
`;

const ActionCard = styled.button<{ $variant: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.xl};
  font-weight: 600;
  font-size: ${theme.fontSizes.base};
  cursor: pointer;
  transition: all 0.25s ease;
  border: none;
  width: 100%;
  text-align: left;

  ${props => props.$variant === 'primary' && `
    background: linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.button.primaryHover});
    color: white;
    box-shadow: 0 4px 16px ${theme.colors.accent.coral}30;
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 24px ${theme.colors.accent.coral}40;
    }
  `}

  ${props => props.$variant === 'secondary' && `
    background: var(--bg-card);
    color: var(--text-primary);
    border: 1.5px solid var(--border-color);
    &:hover {
      border-color: ${theme.colors.accent.coral}40;
      transform: translateY(-1px);
      box-shadow: var(--shadow-card);
    }
  `}

  &:active { transform: scale(0.98); }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ActionIconCircle = styled.div<{ $variant: 'primary' | 'secondary' }>`
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  ${props => props.$variant === 'primary' && `
    background: rgba(255, 255, 255, 0.2);
    color: white;
  `}

  ${props => props.$variant === 'secondary' && `
    background: ${theme.colors.accent.coral}12;
    color: ${theme.colors.accent.coral};
  `}
`;

const ActionTextBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ActionLabel = styled.span`
  font-weight: 700;
  font-size: ${theme.fontSizes.base};
`;

const ActionDesc = styled.span<{ $variant: 'primary' | 'secondary' }>`
  font-weight: 400;
  font-size: ${theme.fontSizes.xs};
  opacity: 0.75;
  color: ${props => props.$variant === 'primary' ? 'rgba(255,255,255,0.85)' : `var(--text-light)`};
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

const GeneratingCard = styled.div`
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 24px;
  padding: 40px 24px;
  text-align: center;
  position: relative;
  overflow: hidden;
  margin-bottom: ${theme.spacing.lg};

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 30% 70%, rgba(255,255,255,0.1), transparent 50%),
                radial-gradient(circle at 70% 30%, rgba(255,255,255,0.08), transparent 50%);
  }
`;

const GenInner = styled.div`
  position: relative;
  z-index: 2;
`;

const GenBookAnim = keyframes`
  0%, 100% { transform: rotateY(0deg) scale(1); }
  25% { transform: rotateY(-8deg) scale(1.02); }
  50% { transform: rotateY(0deg) scale(1.05); }
  75% { transform: rotateY(8deg) scale(1.02); }
`;

const GenBook = styled.div`
  font-size: 56px;
  margin-bottom: 16px;
  animation: ${GenBookAnim} 3s ease-in-out infinite;
  display: inline-block;
`;

const GenTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: 22px;
  color: white;
  margin: 0 0 8px;
  font-weight: 800;
`;

const GenText = styled.p`
  color: rgba(255,255,255,0.7);
  font-size: 14px;
  margin: 0 0 24px;
  line-height: 1.5;
`;

const GenProgressTrack = styled.div`
  width: 100%;
  max-width: 280px;
  height: 6px;
  background: rgba(255,255,255,0.15);
  border-radius: 3px;
  margin: 0 auto 12px;
  overflow: hidden;
`;

const GenProgressShimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(200%); }
`;

const GenProgressBar = styled.div<{ $progress: number }>`
  height: 100%;
  width: ${props => props.$progress}%;
  background: linear-gradient(90deg, rgba(255,255,255,0.6), white, rgba(255,255,255,0.6));
  border-radius: 3px;
  transition: width 0.5s ease;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
    animation: ${GenProgressShimmer} 1.5s ease-in-out infinite;
  }
`;

const GenStep = styled.p`
  color: rgba(255,255,255,0.5);
  font-size: 12px;
  margin: 0;
`;

const GenSparkle = styled.div<{ $left: string; $top: string; $delay: number; $size: number }>`
  position: absolute;
  left: ${props => props.$left};
  top: ${props => props.$top};
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  border-radius: 50%;
  background: white;
  opacity: 0;
  animation: ${keyframes`
    0%, 100% { opacity: 0; transform: scale(0.5); }
    50% { opacity: 0.6; transform: scale(1); }
  `} ${props => 2 + props.$delay}s ease-in-out ${props => props.$delay}s infinite;
`;

/* ─── Details ─── */

const DetailsCard = styled.div`
  background: var(--bg-card);
  border-radius: ${theme.borderRadius.xl};
  box-shadow: var(--shadow-card);
  border: 1px solid var(--border-color);
  padding: ${theme.spacing.lg};
`;

const DetailsTitle = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.lg};
  color: var(--text-primary);
  margin: 0 0 ${theme.spacing.md};
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.sm} ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.sm}) {
    gap: ${theme.spacing.xs} ${theme.spacing.sm};
  }
`;

const InfoItem = styled.div`
  label {
    display: block;
    font-size: 10px;
    color: var(--text-light);
    font-weight: 600;
    margin-bottom: 2px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  span {
    font-size: ${theme.fontSizes.sm};
    color: var(--text-primary);
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
  color: var(--text-secondary);
`;

/* ─── Composant ─── */

export const StoryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, refreshProfile, isClub } = useAuth();
  const [story, setStory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [readerOpen, setReaderOpen] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [coverError, setCoverError] = useState(false);

  // Secure account state
  const [newPassword, setNewPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const needsSecureAccount = user && !user.hasPassword && !user.hasGoogle;

  const handleSetPassword = async () => {
    if (newPassword.length < 8) {
      setPasswordError('Minimum 8 caractères');
      return;
    }
    setPasswordSaving(true);
    setPasswordError('');
    try {
      const token = safeLocalStorage.getItem('userToken');
      if (!token) return;
      const res = await ApiService.changePassword(token, '', newPassword);
      if (res.success) {
        setPasswordSaved(true);
        refreshProfile();
      } else {
        setPasswordError(res.message || 'Erreur');
      }
    } catch {
      setPasswordError('Erreur lors de la sauvegarde');
    }
    setPasswordSaving(false);
  };

  const handleGoogleSecure = async (credential: string) => {
    try {
      const res = await ApiService.googleAuth(credential);
      if (res.success) {
        if (res.data?.token) safeLocalStorage.setItem('userToken', res.data.token);
        setPasswordSaved(true);
        refreshProfile();
      }
    } catch {
      setPasswordError('Erreur Google');
    }
  };
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    loadStory();
  }, [id]);

  // Tracker la lecture uniquement quand le livre est prêt — 1 fois par visite
  const readTrackedRef = React.useRef(false);
  useEffect(() => {
    if (story?.storyStatus === 'DISPONIBLE' && !readTrackedRef.current) {
      readTrackedRef.current = true;
      const token = safeLocalStorage.getItem('userToken');
      if (token && id) {
        ApiService.trackRead(token, id);
      }
    }
  }, [story?.storyStatus, id]);

  // Auto-refresh every 10s while story is generating
  useEffect(() => {
    if (!story || story.storyStatus === 'DISPONIBLE') return;
    const interval = setInterval(() => {
      loadStory();
    }, 10000);
    return () => clearInterval(interval);
  }, [story?.storyStatus, id]);

  const loadStory = async () => {
    const token = safeLocalStorage.getItem('userToken');
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
    const token = safeLocalStorage.getItem('userToken');
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
      setPdfError('Erreur lors du téléchargement. Réessayez.');
    }
  };

  const handleViewPdf = async () => {
    const token = safeLocalStorage.getItem('userToken');
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
      setPdfError('Impossible de charger le PDF. Vérifiez votre connexion et réessayez.');
    } finally {
      setPdfLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    const token = safeLocalStorage.getItem('userToken');
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
          <p>Conte non trouvé.</p>
          <Button variant="primary" onClick={() => navigate('/dashboard')}>Retour</Button>
        </MainContent>
        <Footer />
      </PageContainer>
    );
  }

  const isAvailable = story.storyStatus === 'DISPONIBLE';
  const statusColor = isAvailable ? theme.colors.status.success : theme.colors.status.warning;
  const coverUrl = story.coverImageUrl ? getImageUrl(story.coverImageUrl) : null;
  const displayTitle = story.coverTitle || `Conte de ${story.protagonistName}`;

  // ─── PAGE DÉDIÉE GÉNÉRATION EN COURS ───
  if (!isAvailable) {
    return (
      <PageContainer>
        <Header />
        <MainContent>
          <BackLink onClick={() => navigate('/dashboard')}>
            &larr; Ma bibliothèque
          </BackLink>

          <GeneratingCard>
            <GenSparkle $left="10%" $top="15%" $delay={0} $size={4} />
            <GenSparkle $left="85%" $top="20%" $delay={0.7} $size={3} />
            <GenSparkle $left="20%" $top="75%" $delay={1.2} $size={5} />
            <GenSparkle $left="78%" $top="70%" $delay={0.3} $size={3} />
            <GenSparkle $left="45%" $top="8%" $delay={1.5} $size={4} />
            <GenInner>
              <GenBook>&#9733;</GenBook>
              <GenTitle>{displayTitle}</GenTitle>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, margin: '0 0 24px' }}>
                L'histoire de {story.protagonistName} est en cours de création.<br/>
                Elle sera prête dans quelques minutes !
              </p>
              <GenProgressTrack>
                <GenProgressBar $progress={story.generationProgress || 15} />
              </GenProgressTrack>
              <GenStep>
                {story.generationProgress
                  ? story.generationProgress < 10 ? 'Rédaction de l\'histoire...'
                    : story.generationProgress < 90 ? 'Création des illustrations...'
                    : 'Assemblage du livre...'
                  : 'Démarrage...'}
              </GenStep>
            </GenInner>
          </GeneratingCard>

          <div style={{ textAlign: 'center', marginTop: theme.spacing.lg }}>
            <p style={{ fontSize: 13, color: 'var(--text-light)' }}>
              Cette page se met à jour automatiquement
            </p>
          </div>
        </MainContent>
        <Footer />

        {id && (
          <ShareModal
            isOpen={shareOpen}
            onClose={() => setShareOpen(false)}
            storyId={id}
            protagonistName={story?.protagonistName || ''}
            coverTitle={displayTitle}
          />
        )}
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header />
      <MainContent>
        <BackLink onClick={() => navigate('/dashboard')}>
          &larr; Ma bibliothèque
        </BackLink>

        {/* ─── Hero : couverture + infos ─── */}
        <HeroSection>
          <CoverWrapper onClick={() => setReaderOpen(true)}>
            <CoverSpine />
            {coverUrl && !coverError ? (
              <CoverImage
                src={coverUrl}
                alt={displayTitle}
                onError={() => setCoverError(true)}
              />
            ) : (
              <CoverPlaceholder>
                <PlaceholderIcon>📖</PlaceholderIcon>
                <PlaceholderName>{story.protagonistName}</PlaceholderName>
              </CoverPlaceholder>
            )}
          </CoverWrapper>

          <HeroInfo>
            <StoryTitle>{displayTitle}</StoryTitle>
            <StorySubtitle>
              L'histoire de {story.protagonistName}, {story.ageRange} ans
            </StorySubtitle>

            <TagsRow>
              <Tag $color={statusColor}>
                Disponible
              </Tag>
              <Tag>{translateTheme(story.generalTheme)}</Tag>
              <Tag>{translateStyle(story.illustrationStyle)}</Tag>
              {story.purchaseType === 'CLUB' && (
                <Tag $color={theme.colors.accent.coral}>Club</Tag>
              )}
            </TagsRow>

            <FavoriteRow>
              <FavoriteButton
                $active={story.isFavorite}
                onClick={handleToggleFavorite}
                title={story.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              >
                {story.isFavorite ? '\u2764\uFE0F' : '\uD83E\uDD0D'}
              </FavoriteButton>
              <FavoriteLabel>
                {story.isFavorite ? 'Dans vos favoris' : 'Ajouter aux favoris'}
              </FavoriteLabel>
            </FavoriteRow>

            <DateText>
              Commande du {new Date(story.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </DateText>
          </HeroInfo>
        </HeroSection>

        {/* ─── Actions (lire / telecharger) ─── */}
        {isAvailable && story.pdfUrl ? (
          <ActionsCard>
            {pdfError && <ErrorBanner>{pdfError}</ErrorBanner>}
            <ActionsGrid>
              <ActionCard
                $variant="primary"
                onClick={() => {
                  // Use StoryReader if we have text+illustrations, fallback to PDF
                  const paragraphs = story.storyTextJson ? (() => { try { return JSON.parse(story.storyTextJson); } catch { return []; } })() : [];
                  const illustrations = story.illustrationUrlsJson ? (() => { try { return JSON.parse(story.illustrationUrlsJson); } catch { return []; } })() : [];
                  if (paragraphs.length > 0) {
                    setReaderOpen(true);
                  } else {
                    handleViewPdf();
                  }
                }}
                disabled={pdfLoading}
              >
                <ActionIconCircle $variant="primary">
                  {pdfLoading ? <ButtonSpinner /> : (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                  )}
                </ActionIconCircle>
                <ActionTextBlock>
                  <ActionLabel>Lire le livre</ActionLabel>
                  <ActionDesc $variant="primary">Ouvrir et feuilleter votre conte</ActionDesc>
                </ActionTextBlock>
              </ActionCard>

              <ActionCard
                $variant="secondary"
                onClick={() => setShareOpen(true)}
              >
                <ActionIconCircle $variant="secondary">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                    <polyline points="16 6 12 2 8 6" />
                    <line x1="12" y1="2" x2="12" y2="15" />
                  </svg>
                </ActionIconCircle>
                <ActionTextBlock>
                  <ActionLabel>Envoyer à un proche</ActionLabel>
                  <ActionDesc $variant="secondary">Partagez cette histoire avec votre famille</ActionDesc>
                </ActionTextBlock>
              </ActionCard>
            </ActionsGrid>
          </ActionsCard>
        ) : null}

        {/* ─── Détails du conte ─── */}
        <DetailsCard style={{ marginTop: theme.spacing.lg }}>
          <DetailsTitle>Détails du conte</DetailsTitle>
          <InfoGrid>
            <InfoItem>
              <label>Personnage</label>
              <span>{story.protagonistName}</span>
            </InfoItem>
            <InfoItem>
              <label>Âge</label>
              <span>{story.ageRange} ans</span>
            </InfoItem>
            <InfoItem>
              <label>Thème</label>
              <span>{translateTheme(story.generalTheme)}</span>
            </InfoItem>
            <InfoItem>
              <label>Occasion</label>
              <span>{translateSubject(story.specificSubject)}</span>
            </InfoItem>
            <InfoItem>
              <label>Message</label>
              <span>{translateMessage(story.centralMessage)}</span>
            </InfoItem>
            <InfoItem>
              <label>Style</label>
              <span>{translateStyle(story.illustrationStyle)}</span>
            </InfoItem>
            {story.language && (
              <InfoItem>
                <label>Langue</label>
                <span>{story.language}</span>
              </InfoItem>
            )}
            <InfoItem>
              <label>Format</label>
              <span>eBook numérique</span>
            </InfoItem>
          </InfoGrid>
        </DetailsCard>
      </MainContent>
      <Footer />

      <StoryPDFViewer
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        pdfUrl={pdfUrl}
        title={displayTitle}
        onDownload={handleDownloadPdf}
      />

      {readerOpen && story && (() => {
        const paragraphs = story.storyTextJson ? (() => { try { return JSON.parse(story.storyTextJson); } catch { return []; } })() : [];
        const illustrations = story.illustrationUrlsJson ? (() => { try { return JSON.parse(story.illustrationUrlsJson); } catch { return []; } })() : [];
        return (
          <StoryReader
            coverImageUrl={story.coverImageUrl}
            coverTitle={displayTitle}
            paragraphs={paragraphs}
            illustrationUrls={illustrations}
            creatorName={story.creatorName}
            narratedBy={(story as any).narratedBy}
            protagonistName={story.protagonistName || ''}
            onClose={() => setReaderOpen(false)}
            onShare={() => { setReaderOpen(false); setShareOpen(true); }}
            onCreateAnother={() => navigate('/create-story')}
            isClub={isClub}
            isCliffhanger={!isClub && Number(story.price || 0) === 0 && (paragraphs?.length || 0) <= 8}
            orderId={story.id}
          />
        );
      })()}

      {id && (
        <ShareModal
          isOpen={shareOpen}
          onClose={() => setShareOpen(false)}
          storyId={id}
          protagonistName={story?.protagonistName || ''}
          coverTitle={displayTitle}
        />
      )}
    </PageContainer>
  );
};

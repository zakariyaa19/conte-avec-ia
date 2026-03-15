import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import styled, { keyframes } from 'styled-components';
import { theme } from '../styles/theme';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { ApiService } from '../config/api';
import { getImageUrl } from '../config/constants';
import { StoryReader } from '../components/ui/StoryReader';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`;

const gentleFloat = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${theme.colors.background.primary};
`;

const MainContent = styled.main`
  flex: 1;
  max-width: 680px;
  margin: 0 auto;
  padding: ${theme.spacing.xl} ${theme.spacing.lg};
  width: 100%;
  animation: ${fadeInUp} 0.6s ease-out;

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.md} ${theme.spacing.sm};
  }
`;

const HeroSection = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing.xl};
`;

const HeroTitle = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['2xl']};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing.xs};

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.xl};
  }
`;

const HeroSubtitle = styled.p`
  font-size: ${theme.fontSizes.base};
  color: ${theme.colors.text.secondary};
  margin: 0 0 ${theme.spacing.xl};
`;

const CoverWrapper = styled.div`
  width: 240px;
  aspect-ratio: 2 / 3;
  margin: 0 auto ${theme.spacing.xl};
  border-radius: 4px 14px 14px 4px;
  overflow: hidden;
  position: relative;
  box-shadow:
    -4px 0 10px rgba(0,0,0,0.15),
    6px 4px 20px rgba(0,0,0,0.25),
    inset -2px 0 4px rgba(255,255,255,0.1);
  animation: ${gentleFloat} 4s ease-in-out infinite;

  @media (max-width: ${theme.breakpoints.sm}) {
    width: 200px;
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
  font-size: 3rem;
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

const StoryPreviewCard = styled.div`
  background: white;
  border-radius: ${theme.borderRadius.xl};
  box-shadow: ${theme.shadows.card};
  overflow: hidden;
  margin-bottom: ${theme.spacing.xl};
`;

const StoryPreviewContent = styled.div`
  padding: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.lg};
  }
`;

const StoryPreviewTitle = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.lg};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing.md};
`;

const StoryParagraph = styled.p`
  font-size: ${theme.fontSizes.base};
  color: ${theme.colors.text.secondary};
  line-height: 1.8;
  margin: 0;
`;

const IllustrationWrapper = styled.div`
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const LockedSection = styled.div`
  text-align: center;
  padding: ${theme.spacing['2xl']} ${theme.spacing.xl};
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border-radius: ${theme.borderRadius.xl};
  margin-bottom: ${theme.spacing.xl};
  position: relative;
  overflow: hidden;
`;

const LockedBg = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 30%, ${theme.colors.accent.coral}10, transparent 60%);
`;

const LockedContent = styled.div`
  position: relative;
  z-index: 2;
`;

const LockedIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: ${theme.spacing.md};
`;

const LockedTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.lg};
  color: white;
  margin: 0 0 ${theme.spacing.sm};
`;

const LockedText = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 ${theme.spacing.xl};
  max-width: 360px;
  margin-left: auto;
  margin-right: auto;
`;

const CTASection = styled.div`
  text-align: center;
  padding: ${theme.spacing.xl};
  background: linear-gradient(135deg, ${theme.colors.accent.creamyYellow}50, ${theme.colors.accent.softPink}20);
  border-radius: ${theme.borderRadius.xl};
  margin-bottom: ${theme.spacing.xl};
`;

const CTATitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.xl};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing.sm};
`;

const CTAText = styled.p`
  font-size: ${theme.fontSizes.base};
  color: ${theme.colors.text.secondary};
  margin: 0 0 ${theme.spacing.lg};
  line-height: 1.6;
`;

const BrandBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: ${theme.colors.background.white};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.text.secondary};
  font-weight: 600;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  margin-bottom: ${theme.spacing.lg};
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: ${theme.spacing['3xl']};
  color: ${theme.colors.text.secondary};
`;

const LoadingBar = styled.div`
  width: 200px;
  height: 3px;
  margin: ${theme.spacing.md} auto 0;
  border-radius: 2px;
  background: linear-gradient(90deg, transparent, ${theme.colors.accent.coral}60, transparent);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s linear infinite;
`;

const NotFoundContainer = styled.div`
  text-align: center;
  padding: ${theme.spacing['3xl']};
`;

export const PublicStoryPage: React.FC = () => {
  const { shareToken } = useParams<{ shareToken: string }>();
  const navigate = useNavigate();
  const [story, setStory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [coverError, setCoverError] = useState(false);
  const [readerOpen, setReaderOpen] = useState(false);

  useEffect(() => {
    if (shareToken) loadStory();
  }, [shareToken]); // eslint-disable-line

  const loadStory = async () => {
    try {
      const res = await ApiService.getPublicStory(shareToken!);
      if (res.success) setStory(res.data);
    } catch (err) {
      console.error('Erreur chargement histoire publique:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <Header />
        <LoadingContainer>
          <p>Chargement de l'histoire...</p>
          <LoadingBar />
        </LoadingContainer>
        <Footer />
      </PageContainer>
    );
  }

  if (!story) {
    return (
      <PageContainer>
        <Header />
        <MainContent>
          <NotFoundContainer>
            <h2>Histoire introuvable</h2>
            <p style={{ color: theme.colors.text.secondary, margin: `${theme.spacing.md} 0 ${theme.spacing.xl}` }}>
              Ce lien de partage n'est plus disponible.
            </p>
            <Button variant="primary" size="lg" onClick={() => navigate('/create-story')}>
              Créer votre propre histoire
            </Button>
          </NotFoundContainer>
        </MainContent>
        <Footer />
      </PageContainer>
    );
  }

  const displayTitle = story.coverTitle || `L'histoire de ${story.protagonistName}`;
  const coverUrl = story.coverImageUrl ? getImageUrl(story.coverImageUrl) : null;
  const illustrationUrl = story.firstIllustrationUrl ? getImageUrl(story.firstIllustrationUrl) : null;
  const ogDescription = `${story.protagonistName} est le héros de son propre livre ! Découvrez cette aventure personnalisée créée avec Contes d'IA.`;

  return (
    <PageContainer>
      <Helmet>
        <title>{displayTitle} - Contes d'IA</title>
        <meta name="description" content={ogDescription} />
        <meta property="og:title" content={displayTitle} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:type" content="article" />
        {coverUrl && <meta property="og:image" content={coverUrl} />}
        <meta property="og:site_name" content="Contes d'IA" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={displayTitle} />
        <meta name="twitter:description" content={ogDescription} />
        {coverUrl && <meta name="twitter:image" content={coverUrl} />}
      </Helmet>

      <Header />
      <MainContent>
        {/* Hero */}
        <HeroSection>
          <BrandBadge>Contes d'IA</BrandBadge>
          <HeroTitle>{displayTitle}</HeroTitle>
          <HeroSubtitle>Créée avec Contes d'IA</HeroSubtitle>
        </HeroSection>

        {/* Cover */}
        <CoverWrapper>
          <CoverSpine />
          {coverUrl && !coverError ? (
            <CoverImage src={coverUrl} alt={displayTitle} onError={() => setCoverError(true)} />
          ) : (
            <CoverPlaceholder>📖</CoverPlaceholder>
          )}
        </CoverWrapper>

        {/* Bouton lecture plein écran */}
        {story.storyParagraphs && story.storyParagraphs.length > 0 && (
          <div style={{ textAlign: 'center', marginBottom: theme.spacing.lg }}>
            <Button variant="primary" size="lg" onClick={() => setReaderOpen(true)}>
              Lire en plein ecran
            </Button>
          </div>
        )}

        {/* Full story with illustrations */}
        {story.storyParagraphs && story.storyParagraphs.length > 0 ? (
          <>
            <StoryPreviewCard>
              <StoryPreviewContent>
                <StoryPreviewTitle>L'histoire de {story.protagonistName}</StoryPreviewTitle>
              </StoryPreviewContent>
            </StoryPreviewCard>

            {story.storyParagraphs.map((p: string, i: number) => {
              const illustrations: string[] = story.illustrationUrls || [];
              const img = illustrations[i] || (i === 0 ? illustrationUrl : null);
              return (
                <StoryPreviewCard key={i}>
                  {img && (
                    <IllustrationWrapper>
                      <img src={img.startsWith('http') ? img : getImageUrl(img)} alt={`Illustration ${i + 1}`} loading="lazy" />
                    </IllustrationWrapper>
                  )}
                  <StoryPreviewContent>
                    <StoryParagraph>{p}</StoryParagraph>
                  </StoryPreviewContent>
                </StoryPreviewCard>
              );
            })}
          </>
        ) : story.firstParagraph ? (
          <StoryPreviewCard>
            {illustrationUrl && (
              <IllustrationWrapper>
                <img src={illustrationUrl} alt="Illustration" loading="lazy" />
              </IllustrationWrapper>
            )}
            <StoryPreviewContent>
              <StoryPreviewTitle>Premiere page</StoryPreviewTitle>
              <StoryParagraph>{story.firstParagraph}</StoryParagraph>
            </StoryPreviewContent>
          </StoryPreviewCard>
        ) : null}

        {/* CTA — gros appel a l'action */}
        <CTASection>
          <CTATitle>Creez le livre de votre enfant gratuitement</CTATitle>
          <CTAText>
            Votre enfant aussi peut devenir le heros de sa propre aventure personnalisee.
            Le premier livre est <strong>100% gratuit</strong> — pret en 5 minutes !
          </CTAText>
          <Button variant="primary" size="lg" onClick={() => navigate('/create-story')}>
            Creer mon livre gratuit maintenant
          </Button>
          <p style={{ fontSize: '13px', color: theme.colors.text.light, marginTop: '12px' }}>
            Pas de carte bancaire requise
          </p>
        </CTASection>
      </MainContent>
      <Footer />

      {readerOpen && story.storyParagraphs && (
        <StoryReader
          coverImageUrl={story.coverImageUrl}
          coverTitle={displayTitle}
          paragraphs={story.storyParagraphs}
          illustrationUrls={story.illustrationUrls || []}
          protagonistName={story.protagonistName}
          onClose={() => setReaderOpen(false)}
          onCreateAnother={() => navigate('/create-story')}
        />
      )}
    </PageContainer>
  );
};

import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { exampleStories } from '../data/exampleStories';
import { useNavigate } from 'react-router-dom';
import { useStaggerReveal } from '../hooks/useScrollReveal';
import { StoryPDFViewer } from '../components/ui/StoryPDFViewer';

const STYLE_COLORS: Record<string, string> = {
  'Animation 3D': '#6C5CE7',
  'Manga': '#D63031',
  'Kawaii': '#E84393',
  'Papier Decoupe': '#E17055',
  'Aquarelle': '#00B894',
  'Geometrique': '#0984E3',
};

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
`;

const ShowcaseSection = styled.section`
  flex: 1;
  padding: ${theme.spacing['3xl']} 0 ${theme.spacing['4xl']};
  background: var(--bg-primary);
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: 0 ${theme.spacing.md};
  }
`;

const SectionTitle = styled.h1`
  text-align: center;
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['4xl']};
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: ${theme.spacing.md};
  letter-spacing: -0.01em;
  line-height: 1.2;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.fontSizes['3xl']};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes['2xl']};
  }
`;

const Divider = styled.div`
  width: 48px;
  height: 3px;
  background: linear-gradient(90deg, ${theme.colors.accent.coral}, ${theme.colors.accent.softPink});
  border-radius: ${theme.borderRadius.full};
  margin: 0 auto ${theme.spacing.xl};
`;

const SectionSubtitle = styled.p`
  text-align: center;
  font-size: ${theme.fontSizes.lg};
  color: var(--text-secondary);
  max-width: 640px;
  margin: 0 auto ${theme.spacing['3xl']};
  line-height: 1.7;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.fontSizes.base};
    margin-bottom: ${theme.spacing['2xl']};
  }
`;

const ShowcaseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    max-width: 400px;
    margin: 0 auto;
    gap: ${theme.spacing.lg};
  }
`;

const ShowcaseCard = styled.div<{ $visible: boolean; $delay: string }>`
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: ${theme.borderRadius['2xl']};
  overflow: hidden;
  box-shadow: ${theme.shadows.card};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '36px'});
  transition-delay: ${p => p.$delay};

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.12), 0 8px 20px rgba(0, 0, 0, 0.06);
    border-color: ${theme.colors.accent.lightCoral};
  }
`;

const ShowcardCover = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top center;
    display: block;
    transition: transform 0.5s ease;
  }

  ${ShowcaseCard}:hover & img {
    transform: scale(1.05);
  }
`;

const ShowcardOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 40%, transparent 70%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: ${theme.spacing.lg};
  opacity: 0;
  transition: opacity 0.3s ease;

  ${ShowcaseCard}:hover & {
    opacity: 1;
  }
`;

const ShowcardHint = styled.span`
  color: white;
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(8px);
  padding: 8px 20px;
  border-radius: ${theme.borderRadius.full};
  text-align: center;
  align-self: center;
`;

const ShowcardInfo = styled.div`
  padding: ${theme.spacing.lg};
`;

const ShowcardStyleBadge = styled.span<{ $color: string }>`
  display: inline-block;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${p => p.$color};
  background: ${p => p.$color}12;
  border: 1px solid ${p => p.$color}25;
  padding: 3px 10px;
  border-radius: ${theme.borderRadius.full};
  margin-bottom: ${theme.spacing.sm};
`;

const ShowcardTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.lg};
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 6px;
  line-height: 1.3;
`;

const ShowcardMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: ${theme.spacing.sm};
`;

const ShowcardTag = styled.span`
  font-size: ${theme.fontSizes.xs};
  color: var(--text-secondary);
  background: var(--bg-secondary);
  padding: 3px 10px;
  border-radius: ${theme.borderRadius.full};
`;

const ShowcardDescription = styled.p`
  font-size: ${theme.fontSizes.xs};
  color: var(--text-light);
  line-height: 1.6;
  margin: 0;
`;

const ShowcaseFooter = styled.div`
  text-align: center;
  margin-top: ${theme.spacing['2xl']};
`;

export const ExemplesPage: React.FC = () => {
  const navigate = useNavigate();
  const showcaseReveal = useStaggerReveal(exampleStories.length);
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState<typeof exampleStories[0] | null>(null);

  const openStoryViewer = useCallback((story: typeof exampleStories[0]) => {
    setSelectedStory(story);
    setPdfViewerOpen(true);
  }, []);

  const closeStoryViewer = useCallback(() => {
    setPdfViewerOpen(false);
    setSelectedStory(null);
  }, []);

  useEffect(() => {
    document.title = "Exemples de Contes Personnalises | Contes d'IA";
  }, []);

  return (
    <PageContainer>
      <Header />
      <main>
        <ShowcaseSection ref={showcaseReveal.ref}>
          <Container>
            <SectionTitle>Decouvrez nos contes personnalises</SectionTitle>
            <Divider />
            <SectionSubtitle>
              Chaque conte est une creation unique. Cliquez pour feuilleter directement dans votre navigateur.
            </SectionSubtitle>

            <ShowcaseGrid>
              {exampleStories.map((story, i) => {
                const styleColor = STYLE_COLORS[story.illustrationStyle] || theme.colors.accent.coral;
                return (
                  <ShowcaseCard
                    key={story.id}
                    $visible={showcaseReveal.isVisible}
                    $delay={showcaseReveal.getDelay(i)}
                    onClick={() => openStoryViewer(story)}
                  >
                    <ShowcardCover>
                      <img
                        src={story.coverImage}
                        alt={story.title}
                        loading="lazy"
                        crossOrigin="anonymous"
                      />
                      <ShowcardOverlay>
                        <ShowcardHint>Feuilleter le conte</ShowcardHint>
                      </ShowcardOverlay>
                    </ShowcardCover>
                    <ShowcardInfo>
                      <ShowcardStyleBadge $color={styleColor}>
                        {story.illustrationStyle}
                      </ShowcardStyleBadge>
                      <ShowcardTitle>{story.title}</ShowcardTitle>
                      <ShowcardMeta>
                        <ShowcardTag>{story.ageRange}</ShowcardTag>
                        <ShowcardTag>{story.generalTheme}</ShowcardTag>
                        <ShowcardTag>{story.centralMessage}</ShowcardTag>
                      </ShowcardMeta>
                      <ShowcardDescription>
                        L'histoire de {story.protagonistName}, {story.protagonistAge}
                        {story.secondaryCharacterName && `, accompagne de ${story.secondaryCharacterName}`}.
                      </ShowcardDescription>
                    </ShowcardInfo>
                  </ShowcaseCard>
                );
              })}
            </ShowcaseGrid>

            <ShowcaseFooter>
              <Button variant="primary" size="lg" onClick={() => navigate('/create-story')}>
                Creer mon propre conte
              </Button>
            </ShowcaseFooter>
          </Container>
        </ShowcaseSection>
      </main>
      <Footer />

      <StoryPDFViewer
        isOpen={pdfViewerOpen}
        onClose={closeStoryViewer}
        pdfUrl={selectedStory?.pdfUrl || null}
        title={selectedStory?.title || ''}
      />
    </PageContainer>
  );
};

import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../styles/theme';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { exampleStories } from '../data/exampleStories';
import { useNavigate } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';

// =============================================
// ANIMATIONS
// =============================================

const gradientShift = keyframes`
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const bounceArrow = keyframes`
  0%, 100% { transform: translateX(-50%) translateY(0); opacity: 0.5; }
  50% { transform: translateX(-50%) translateY(10px); opacity: 1; }
`;

// =============================================
// LAYOUT
// =============================================

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
`;

// =============================================
// HERO
// =============================================

const HeroSection = styled.section`
  min-height: 65vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, ${theme.colors.background.primary} 0%, ${theme.colors.accent.paleYellow} 50%, ${theme.colors.accent.creamyYellow} 100%);
  background-size: 400% 400%;
  animation: ${gradientShift} 14s ease-in-out infinite;
  padding: ${theme.spacing['3xl']} ${theme.spacing.lg};
`;

const HeroDecoBlur = styled.div<{ $size: number; $top: string; $left: string; $color: string; $opacity: number }>`
  position: absolute;
  width: ${p => p.$size}px;
  height: ${p => p.$size}px;
  border-radius: 50%;
  background: ${p => p.$color};
  opacity: ${p => p.$opacity};
  top: ${p => p.$top};
  left: ${p => p.$left};
  filter: blur(80px);
  pointer-events: none;
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  max-width: 800px;
  animation: ${fadeInUp} 0.9s ease-out;
`;

const HeroBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 153, 153, 0.25);
  padding: 6px 18px;
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
  color: ${theme.colors.accent.coralDark};
  margin-bottom: ${theme.spacing.xl};
`;

const HeroTitle = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['6xl']};
  font-weight: 700;
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.lg};
  line-height: 1.1;
  letter-spacing: -0.02em;

  span {
    background: linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.button.primaryHover});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.fontSizes['4xl']};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes['3xl']};
  }
`;

const HeroDivider = styled.div`
  width: 48px;
  height: 3px;
  background: linear-gradient(90deg, ${theme.colors.accent.coral}, ${theme.colors.accent.softPink});
  border-radius: ${theme.borderRadius.full};
  margin: 0 auto ${theme.spacing.xl};
`;

const HeroSubtitle = styled.p`
  font-size: ${theme.fontSizes.xl};
  color: ${theme.colors.text.secondary};
  max-width: 600px;
  margin: 0 auto ${theme.spacing['2xl']};
  line-height: 1.7;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.fontSizes.lg};
  }
`;

const HeroCount = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 153, 153, 0.15);
  padding: ${theme.spacing.sm} ${theme.spacing.xl};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.base};
  color: ${theme.colors.text.secondary};

  strong {
    color: ${theme.colors.accent.coral};
    font-weight: 700;
  }
`;

const ScrollArrow = styled.div`
  position: absolute;
  bottom: ${theme.spacing.xl};
  left: 50%;
  animation: ${bounceArrow} 2s ease-in-out infinite;
  color: ${theme.colors.text.light};
  font-size: 1.5rem;
  cursor: pointer;
`;

// =============================================
// STORY SECTIONS
// =============================================

const StorySection = styled.section<{ $index: number }>`
  padding: ${theme.spacing['4xl']} 0;
  position: relative;
  overflow: hidden;
  background: ${p => p.$index % 2 === 0
    ? theme.colors.background.white
    : theme.colors.background.primary};

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing['3xl']} 0;
  }
`;

const SectionDeco = styled.div<{ $color: string; $position: 'left' | 'right' }>`
  position: absolute;
  width: 350px;
  height: 350px;
  border-radius: 50%;
  background: ${p => p.$color};
  opacity: 0.04;
  filter: blur(80px);
  pointer-events: none;
  ${p => p.$position === 'left' ? 'top: 10%; left: -120px;' : 'bottom: 10%; right: -120px;'}
`;

const StoryWatermark = styled.div<{ $right: boolean }>`
  position: absolute;
  top: 50%;
  ${p => p.$right ? 'right' : 'left'}: ${theme.spacing['2xl']};
  transform: translateY(-50%);
  font-family: ${theme.fonts.heading};
  font-size: clamp(10rem, 18vw, 18rem);
  font-weight: 800;
  color: rgba(0, 0, 0, 0.015);
  line-height: 1;
  pointer-events: none;
  user-select: none;

  @media (max-width: ${theme.breakpoints.lg}) {
    display: none;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${theme.spacing.lg};
  position: relative;
  z-index: 2;

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: 0 ${theme.spacing.md};
  }
`;

const StoryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing['3xl']};
  align-items: center;

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing['2xl']};
  }
`;

const CoverBlock = styled.div<{ $visible: boolean; $fromRight: boolean; $order: number }>`
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateX(${p => p.$visible ? '0' : p.$fromRight ? '60px' : '-60px'});
  transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  justify-content: center;
  order: ${p => p.$order};

  @media (max-width: ${theme.breakpoints.lg}) {
    order: 0;
  }
`;

const BookCover = styled.div`
  position: relative;
  width: 380px;
  height: 500px;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.15), 0 8px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.5s ease;

  &:hover {
    transform: scale(1.03) translateY(-8px);
    box-shadow: 0 35px 80px rgba(0, 0, 0, 0.2), 0 12px 30px rgba(0, 0, 0, 0.12);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    width: 300px;
    height: 400px;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    width: 260px;
    height: 350px;
    border-radius: 12px;
  }
`;

const CoverOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.5) 0%, transparent 50%);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: ${theme.spacing.xl};
  opacity: 0;
  transition: opacity 0.4s ease;

  ${BookCover}:hover & {
    opacity: 1;
  }
`;

const CoverHint = styled.span`
  color: white;
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  padding: 10px 24px;
  border-radius: ${theme.borderRadius.full};
  letter-spacing: 0.02em;
`;

const CoverFallback = styled.div<{ $accent: string }>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${p => p.$accent}, ${p => p.$accent}CC);
  color: white;
  text-align: center;
  padding: ${theme.spacing.xl};
`;

const FallbackInitial = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['3xl']};
  font-weight: 700;
  margin-bottom: ${theme.spacing.md};
`;

const FallbackTitle = styled.div`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.xl};
  font-weight: 700;
`;

const DetailsBlock = styled.div<{ $visible: boolean; $fromRight: boolean; $order: number }>`
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateX(${p => p.$visible ? '0' : p.$fromRight ? '60px' : '-60px'});
  transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.15s, transform 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.15s;
  order: ${p => p.$order};

  @media (max-width: ${theme.breakpoints.lg}) {
    order: 1;
  }
`;

const StoryLabel = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: ${theme.spacing.md};
`;

const LabelNumber = styled.span<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${p => p.$color};
  color: white;
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.sm};
  font-weight: 700;
`;

const LabelText = styled.span`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.xs};
  font-weight: 700;
  color: ${theme.colors.text.light};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const StoryTitle = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['3xl']};
  font-weight: 700;
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.lg};
  line-height: 1.2;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.fontSizes['2xl']};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.xl};
  }
`;

const TagsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: ${theme.spacing.lg};
`;

const Tag = styled.span<{ $color?: string }>`
  display: inline-flex;
  align-items: center;
  font-size: ${theme.fontSizes.xs};
  font-weight: 600;
  color: ${p => p.$color || theme.colors.text.secondary};
  background: ${p => p.$color ? p.$color + '12' : theme.colors.background.secondary};
  padding: 6px 14px;
  border-radius: ${theme.borderRadius.full};
  border: 1px solid ${p => p.$color ? p.$color + '20' : 'transparent'};
`;

const StoryDescription = styled.p`
  font-size: ${theme.fontSizes.base};
  color: ${theme.colors.text.secondary};
  line-height: 1.8;
  margin-bottom: ${theme.spacing.xl};
`;

const CharacterCard = styled.div`
  background: ${theme.colors.background.secondary};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};
`;

const CharacterCardTitle = styled.div`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.sm};
  font-weight: 700;
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.sm};
`;

const CharacterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.xs} ${theme.spacing.lg};
`;

const CharacterDetail = styled.div`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.text.secondary};
  line-height: 1.6;

  strong {
    color: ${theme.colors.text.primary};
    font-weight: 600;
  }
`;

const CTARow = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  flex-wrap: wrap;
`;

// =============================================
// FINAL CTA
// =============================================

const FinalCTASection = styled.section`
  padding: ${theme.spacing['3xl']} 0;
  background: linear-gradient(135deg, ${theme.colors.accent.coral} 0%, ${theme.colors.button.primaryHover} 100%);
  text-align: center;
  position: relative;
  overflow: hidden;
`;

const FinalCTAContent = styled.div<{ $visible: boolean }>`
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? '0' : '36px'});
  transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
`;

const FinalCTATitle = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['3xl']};
  font-weight: 700;
  color: white;
  margin-bottom: ${theme.spacing.md};
  position: relative;
  z-index: 2;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.fontSizes['2xl']};
  }
`;

const FinalCTAText = styled.p`
  font-size: ${theme.fontSizes.lg};
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: ${theme.spacing.xl};
  max-width: 540px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  position: relative;
  z-index: 2;
`;

const FinalCTAButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  justify-content: center;
  flex-wrap: wrap;
  position: relative;
  z-index: 2;

  @media (max-width: ${theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: center;
  }
`;

const WhiteButton = styled.button`
  background: white;
  color: ${theme.colors.accent.coral};
  border: none;
  padding: 14px 32px;
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.base};
  font-weight: 700;
  cursor: pointer;
  transition: all ${theme.transitions.smooth};
  font-family: ${theme.fonts.body};
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
`;

const GhostWhiteButton = styled.button`
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.5);
  padding: 12px 32px;
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.base};
  font-weight: 600;
  cursor: pointer;
  transition: all ${theme.transitions.smooth};
  font-family: ${theme.fonts.body};

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: white;
  }
`;

// =============================================
// DATA
// =============================================

const STORY_ACCENTS = [
  theme.colors.accent.coral,
  theme.colors.accent.pastelBlue,
  '#D4A843',
  theme.colors.accent.softPink,
  theme.colors.accent.lightGreen,
  '#9B8FE6',
];

// =============================================
// SUB-COMPONENT: Story showcase section
// =============================================

const StoryShowcase: React.FC<{
  story: typeof exampleStories[0];
  index: number;
  onRead: (story: typeof exampleStories[0]) => void;
  onCreateStory: () => void;
}> = ({ story, index, onRead, onCreateStory }) => {
  const reveal = useScrollReveal({ threshold: 0.15 });
  const isReverse = index % 2 !== 0;
  const accent = STORY_ACCENTS[index % STORY_ACCENTS.length];

  return (
    <StorySection $index={index} ref={reveal.ref}>
      <SectionDeco $color={accent} $position={isReverse ? 'right' : 'left'} />
      <StoryWatermark $right={!isReverse}>
        {String(index + 1).padStart(2, '0')}
      </StoryWatermark>

      <Container>
        <StoryGrid>
          <CoverBlock
            $visible={reveal.isVisible}
            $fromRight={isReverse}
            $order={isReverse ? 1 : 0}
          >
            <BookCover onClick={() => onRead(story)}>
              <img
                src={story.coverImage}
                alt={story.title}
                loading="lazy"
                crossOrigin="anonymous"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  const fallback = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <CoverFallback $accent={accent} style={{ display: 'none' }}>
                <FallbackInitial>{story.protagonistName.charAt(0)}</FallbackInitial>
                <FallbackTitle>{story.title}</FallbackTitle>
              </CoverFallback>
              <CoverOverlay>
                <CoverHint>Feuilleter le conte</CoverHint>
              </CoverOverlay>
            </BookCover>
          </CoverBlock>

          <DetailsBlock
            $visible={reveal.isVisible}
            $fromRight={!isReverse}
            $order={isReverse ? 0 : 1}
          >
            <StoryLabel>
              <LabelNumber $color={accent}>{index + 1}</LabelNumber>
              <LabelText>Conte exemple</LabelText>
            </StoryLabel>

            <StoryTitle>{story.title}</StoryTitle>

            <TagsRow>
              <Tag $color={accent}>{story.ageRange}</Tag>
              <Tag $color={theme.colors.accent.pastelBlue}>{story.illustrationStyle}</Tag>
              <Tag>{story.generalTheme}</Tag>
              <Tag>{story.centralMessage}</Tag>
            </TagsRow>

            <StoryDescription>
              L'histoire de {story.protagonistName}, {story.protagonistAge}, dans un univers {story.specificSubject.toLowerCase()}.
              {story.secondaryCharacterName && ` Accompagne de ${story.secondaryCharacterName} (${story.secondaryCharacterAge}).`}
              {' '}Un conte sur le theme : {story.centralMessage.toLowerCase()}.
            </StoryDescription>

            <CharacterCard>
              <CharacterCardTitle>Personnages</CharacterCardTitle>
              <CharacterGrid>
                <CharacterDetail><strong>Heros :</strong> {story.protagonistName}</CharacterDetail>
                <CharacterDetail><strong>Age :</strong> {story.protagonistAge}</CharacterDetail>
                <CharacterDetail><strong>Yeux :</strong> {story.eyeColor}</CharacterDetail>
                <CharacterDetail><strong>Cheveux :</strong> {story.hairColor}</CharacterDetail>
                <CharacterDetail><strong>Peau :</strong> {story.skinColor}</CharacterDetail>
                {story.secondaryCharacterName && (
                  <>
                    <CharacterDetail><strong>Compagnon :</strong> {story.secondaryCharacterName}</CharacterDetail>
                    <CharacterDetail><strong>Type :</strong> {story.secondaryCharacterAge}</CharacterDetail>
                  </>
                )}
              </CharacterGrid>
            </CharacterCard>

            <CTARow>
              <Button variant="primary" size="md" onClick={() => onRead(story)}>
                Lire ce conte
              </Button>
              <Button variant="outline" size="md" onClick={onCreateStory}>
                Creer le mien
              </Button>
            </CTARow>
          </DetailsBlock>
        </StoryGrid>
      </Container>
    </StorySection>
  );
};

// =============================================
// MAIN COMPONENT
// =============================================

export const ExemplesPage: React.FC = () => {
  const navigate = useNavigate();
  const ctaReveal = useScrollReveal();

  useEffect(() => {
    document.title = "Exemples de Contes Personnalises pour Enfants | Contes d'IA";

    const metaDescription = document.querySelector('meta[name="description"]');
    const content = "Decouvrez nos exemples de contes personnalises crees avec l'IA. 6 histoires uniques a feuilleter gratuitement. Livres personnalises avec illustrations sur mesure.";
    if (metaDescription) {
      metaDescription.setAttribute('content', content);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = content;
      document.head.appendChild(meta);
    }
  }, []);

  const handleReadStory = (story: typeof exampleStories[0]) => {
    if (story.pdfUrl) {
      window.open(story.pdfUrl, '_blank');
    }
  };

  const scrollToStories = () => {
    const firstStory = document.getElementById('story-0');
    if (firstStory) {
      firstStory.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <PageContainer>
      <Header />
      <main>

        {/* ============ HERO ============ */}
        <HeroSection>
          <HeroDecoBlur $size={400} $top="-10%" $left="-5%" $color={theme.colors.accent.coral} $opacity={0.06} />
          <HeroDecoBlur $size={300} $top="50%" $left="82%" $color={theme.colors.accent.pastelBlue} $opacity={0.08} />
          <HeroDecoBlur $size={200} $top="70%" $left="15%" $color={theme.colors.accent.softPink} $opacity={0.05} />

          <HeroContent>
            <HeroBadge>{exampleStories.length} contes a decouvrir</HeroBadge>
            <HeroTitle>
              Nos <span>contes</span> en exemple
            </HeroTitle>
            <HeroDivider />
            <HeroSubtitle>
              Parcourez notre galerie de contes personnalises. Chaque histoire est unique, creee sur mesure pour un enfant.
            </HeroSubtitle>
            <HeroCount>
              <strong>{exampleStories.length}</strong> contes disponibles en lecture gratuite
            </HeroCount>
          </HeroContent>

          <ScrollArrow onClick={scrollToStories}>&#8595;</ScrollArrow>
        </HeroSection>

        {/* ============ STORY SECTIONS ============ */}
        {exampleStories.map((story, index) => (
          <div key={story.id} id={`story-${index}`}>
            <StoryShowcase
              story={story}
              index={index}
              onRead={handleReadStory}
              onCreateStory={() => navigate('/create-story')}
            />
          </div>
        ))}

        {/* ============ FINAL CTA ============ */}
        <FinalCTASection ref={ctaReveal.ref}>
          <Container>
            <FinalCTAContent $visible={ctaReveal.isVisible}>
              <FinalCTATitle>Envie de creer votre propre conte ?</FinalCTATitle>
              <FinalCTAText>
                Offrez a votre enfant une histoire unique dont il est le heros. Personnalisez chaque detail en quelques clics.
              </FinalCTAText>
              <FinalCTAButtons>
                <WhiteButton onClick={() => navigate('/create-story')}>
                  Commencer mon conte
                </WhiteButton>
                <GhostWhiteButton onClick={() => navigate('/')}>
                  Voir les tarifs
                </GhostWhiteButton>
              </FinalCTAButtons>
            </FinalCTAContent>
          </Container>
        </FinalCTASection>

      </main>
      <Footer />
    </PageContainer>
  );
};

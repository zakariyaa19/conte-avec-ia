import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { useScrollReveal, useStaggerReveal } from '../hooks/useScrollReveal';
import { theme } from '../styles/theme';
import {
  PageContainer, HeroSection, HeroDecoBlur, HeroContent, HeroBadge,
  HeroTitle, HeroDivider, HeroSubtitle, ContentSection, SectionDeco,
  Container, SectionWrapper, SectionTitle, SectionSubtitle, SectionDivider,
  CardsGrid, FeatureCard, CardIcon, CardTitle, CardDescription, CardTagsRow, CardTag,
  FinalCTASection, FinalCTAContent, FinalCTATitle, FinalCTAText, WhiteButton
} from '../styles/DiscoverPageStyles';

const ageGroups = [
  { age: "2-4 ans", title: "Premiers Emerveillements", description: "Des contes personnalises doux et colores, parfaits pour les tout-petits. Histoires courtes avec des mots simples et des illustrations captivantes.", features: ["Vocabulaire adapte", "Histoires courtes (5-8 pages)", "Illustrations grandes et colorees", "Repetitions rassurantes"], themes: ["Animaux familiers", "Routine quotidienne", "Couleurs et formes", "Premiers apprentissages"], icon: "👶", color: "#FFB6C1" },
  { age: "4-6 ans", title: "Aventures Magiques", description: "L'age de l'imagination debordante ! Des contes educatifs qui stimulent la curiosite et developpent le langage de votre enfant.", features: ["Vocabulaire enrichi", "Histoires moyennes (8-12 pages)", "Dialogues simples", "Morale claire"], themes: ["Magie et feerie", "Amitie", "Decouverte du monde", "Emotions"], icon: "🧚", color: "#98FB98" },
  { age: "6-8 ans", title: "Heros en Herbe", description: "Des recits plus complexes ou votre enfant devient le heros. Parfait pour developper la confiance en soi et l'autonomie.", features: ["Phrases plus longues", "Histoires etoffees (12-16 pages)", "Defis a resoudre", "Valeurs importantes"], themes: ["Aventures epiques", "Courage et bravoure", "Sciences amusantes", "Cultures du monde"], icon: "🦸", color: "#87CEEB" },
  { age: "8-10 ans", title: "Explorateurs Curieux", description: "Des contes illustres riches en details et en enseignements. Ideal pour les jeunes lecteurs avides de decouvertes.", features: ["Vocabulaire avance", "Histoires longues (16-20 pages)", "Intrigues elaborees", "Reflexions profondes"], themes: ["Mysteres a elucider", "Histoire et geographie", "Ecologie", "Inventions"], icon: "🔍", color: "#DDA0DD" },
  { age: "10+ ans", title: "Jeunes Penseurs", description: "Des histoires sophistiquees qui abordent des sujets complexes avec finesse. Un cadeau enfant original pour les preadolescents.", features: ["Langage nuance", "Recits approfondis (20+ pages)", "Personnages complexes", "Enjeux actuels"], themes: ["Philosophie accessible", "Relations humaines", "Defis societaux", "Futur et technologie"], icon: "🎓", color: "#F0E68C" }
];

const developmentBenefits = [
  { title: "Developpement Linguistique", description: "Chaque conte personnalise enfant enrichit le vocabulaire et ameliore la comprehension ecrite selon l'age.", icon: "📚" },
  { title: "Eveil Cognitif", description: "Stimulation de la memoire, de la logique et de la capacite d'analyse adaptee au developpement de l'enfant.", icon: "🧠" },
  { title: "Intelligence Emotionnelle", description: "Apprentissage de la gestion des emotions et developpement de l'empathie a travers les personnages.", icon: "❤️" },
  { title: "Creativite et Imagination", description: "Stimulation de l'imagination creative avec des histoires qui s'adaptent aux centres d'interet de chaque age.", icon: "🎨" }
];

const ContesParAgePage: React.FC = () => {
  const navigate = useNavigate();
  const ageReveal = useScrollReveal();
  const ageCardsReveal = useStaggerReveal(ageGroups.length);
  const benefitsReveal = useScrollReveal();
  const benefitsCardsReveal = useStaggerReveal(developmentBenefits.length);
  const ctaReveal = useScrollReveal();

  return (
    <PageContainer>
      <Helmet>
        <title>Contes Personnalises par Age | Livre pour Bebe et Enfant Adapte</title>
        <meta name="description" content="Choisissez un conte adapte a l'age de votre enfant : livre pour bebe personnalise (2-4 ans), histoires magiques (4-6 ans), aventures (6-8 ans). Developpement optimal avec notre IA." />
        <meta name="keywords" content="livre pour bebe personnalise, comment choisir un conte adapte a l'age de son enfant, conte personnalise 2 ans, livre personnalise 3 ans, histoire personnalisee 5 ans, conte educatif personnalise, livre adapte age enfant" />
      </Helmet>
      <Header />

      <HeroSection>
        <HeroDecoBlur $size={350} $top="-10%" $left="-5%" $color={theme.colors.accent.coral} $opacity={0.08} />
        <HeroDecoBlur $size={280} $top="60%" $left="85%" $color={theme.colors.accent.pastelBlue} $opacity={0.06} />
        <HeroDecoBlur $size={200} $top="30%" $left="50%" $color={theme.colors.accent.paleYellow} $opacity={0.07} />
        <HeroContent>
          <HeroBadge>Par age</HeroBadge>
          <HeroTitle>Contes par <span>Age</span></HeroTitle>
          <HeroDivider />
          <HeroSubtitle>
            Chaque etape de l'enfance merite une histoire unique. Nos contes personnalises s'adaptent
            parfaitement au developpement cognitif et emotionnel de votre enfant.
          </HeroSubtitle>
        </HeroContent>
      </HeroSection>

      {/* Section 1: Age Groups Grid */}
      <ContentSection ref={ageReveal.ref}>
        <SectionDeco $size={300} $top="-50px" $right="-100px" $color={theme.colors.accent.softPink} />
        <Container>
          <SectionWrapper $visible={ageReveal.isVisible}>
            <SectionTitle>Trouvez le Conte Parfait pour <span>Votre Enfant</span></SectionTitle>
            <SectionDivider />
            <SectionSubtitle>
              Notre intelligence artificielle cree des histoires sur mesure, adaptees aux capacites de lecture,
              aux centres d'interet et au niveau de developpement de chaque tranche d'age.
            </SectionSubtitle>
          </SectionWrapper>
          <CardsGrid $columns={3} ref={ageCardsReveal.ref}>
            {ageGroups.map((group, i) => (
              <FeatureCard key={i} $visible={ageCardsReveal.isVisible} $delay={ageCardsReveal.getDelay(i)} $accentColor={group.color}>
                <CardIcon>{group.icon}</CardIcon>
                <CardTagsRow style={{ marginBottom: '8px' }}>
                  <CardTag $color={group.color}>{group.age}</CardTag>
                </CardTagsRow>
                <CardTitle>{group.title}</CardTitle>
                <CardDescription>{group.description}</CardDescription>
                <CardTagsRow style={{ marginBottom: '8px' }}>
                  {group.features.map((feature, j) => (
                    <CardTag key={j}>{feature}</CardTag>
                  ))}
                </CardTagsRow>
                <CardTagsRow>
                  {group.themes.map((t, j) => (
                    <CardTag key={j} $color={group.color}>{t}</CardTag>
                  ))}
                </CardTagsRow>
              </FeatureCard>
            ))}
          </CardsGrid>
        </Container>
      </ContentSection>

      {/* Section 2: Development Benefits (alt background) */}
      <ContentSection $alt ref={benefitsReveal.ref}>
        <SectionDeco $size={250} $top="10%" $left="-80px" $color={theme.colors.accent.paleYellow} />
        <Container>
          <SectionWrapper $visible={benefitsReveal.isVisible}>
            <SectionTitle>Les Bienfaits du <span>Developpement</span></SectionTitle>
            <SectionDivider />
            <SectionSubtitle>
              Nos contes personnalises accompagnent le developpement de votre enfant
              a chaque etape de sa croissance, stimulant ses capacites de maniere naturelle.
            </SectionSubtitle>
          </SectionWrapper>
          <CardsGrid $columns={4} ref={benefitsCardsReveal.ref}>
            {developmentBenefits.map((benefit, i) => (
              <FeatureCard key={i} $visible={benefitsCardsReveal.isVisible} $delay={benefitsCardsReveal.getDelay(i)}>
                <CardIcon>{benefit.icon}</CardIcon>
                <CardTitle>{benefit.title}</CardTitle>
                <CardDescription>{benefit.description}</CardDescription>
              </FeatureCard>
            ))}
          </CardsGrid>
        </Container>
      </ContentSection>

      {/* Final CTA */}
      <FinalCTASection ref={ctaReveal.ref}>
        <SectionWrapper $visible={ctaReveal.isVisible}>
          <FinalCTAContent>
            <FinalCTATitle>Creez le Conte Ideal pour Votre Enfant</FinalCTATitle>
            <FinalCTAText>
              Notre IA va creer une histoire parfaitement adaptee a l'age et a la personnalite
              de votre enfant. Un conte illustre unique qui grandira avec lui dans ses souvenirs.
            </FinalCTAText>
            <WhiteButton onClick={() => navigate('/create-story')}>Creer mon conte</WhiteButton>
          </FinalCTAContent>
        </SectionWrapper>
      </FinalCTASection>

      <Footer />
    </PageContainer>
  );
};

export default ContesParAgePage;

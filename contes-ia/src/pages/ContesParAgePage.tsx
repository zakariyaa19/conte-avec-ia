import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { useScrollReveal, useStaggerReveal } from '../hooks/useScrollReveal';
import { SEOHead } from '../components/SEOHead';
import { theme } from '../styles/theme';
import {
  PageContainer, HeroSection, HeroDecoBlur, HeroContent, HeroBadge,
  HeroTitle, HeroDivider, HeroSubtitle, ContentSection, SectionDeco,
  Container, SectionWrapper, SectionTitle, SectionSubtitle, SectionDivider,
  CardsGrid, FeatureCard, CardIcon, CardTitle, CardDescription, CardTagsRow, CardTag,
  FinalCTASection, FinalCTAContent, FinalCTATitle, FinalCTAText, WhiteButton
} from '../styles/DiscoverPageStyles';

const ageGroups = [
  { age: "2-4 ans", title: "Premiers Émerveillements", description: "Des contes personnalisés doux et colorés, parfaits pour les tout-petits. Histoires courtes avec des mots simples et des illustrations captivantes.", features: ["Vocabulaire adapté", "Histoires courtes (5-8 pages)", "Illustrations grandes et colorées", "Répétitions rassurantes"], themes: ["Animaux familiers", "Routine quotidienne", "Couleurs et formes", "Premiers apprentissages"], icon: "👶", color: "#FFB6C1" },
  { age: "4-6 ans", title: "Aventures Magiques", description: "L'âge de l'imagination débordante ! Des contes éducatifs qui stimulent la curiosité et développent le langage de votre enfant.", features: ["Vocabulaire enrichi", "Histoires moyennes (8-12 pages)", "Dialogues simples", "Morale claire"], themes: ["Magie et féerie", "Amitié", "Découverte du monde", "Émotions"], icon: "🧚", color: "#98FB98" },
  { age: "6-8 ans", title: "Héros en Herbe", description: "Des récits plus complexes où votre enfant devient le héros. Parfait pour développer la confiance en soi et l'autonomie.", features: ["Phrases plus longues", "Histoires étoffées (12-16 pages)", "Défis à résoudre", "Valeurs importantes"], themes: ["Aventures épiques", "Courage et bravoure", "Sciences amusantes", "Cultures du monde"], icon: "🦸", color: "#87CEEB" },
  { age: "8-10 ans", title: "Explorateurs Curieux", description: "Des contes illustrés riches en détails et en enseignements. Idéal pour les jeunes lecteurs avides de découvertes.", features: ["Vocabulaire avancé", "Histoires longues (16-20 pages)", "Intrigues élaborées", "Réflexions profondes"], themes: ["Mystères à élucider", "Histoire et géographie", "Écologie", "Inventions"], icon: "🔍", color: "#DDA0DD" },
  { age: "10+ ans", title: "Jeunes Penseurs", description: "Des histoires sophistiquées qui abordent des sujets complexes avec finesse. Un cadeau enfant original pour les préadolescents.", features: ["Langage nuancé", "Récits approfondis (20+ pages)", "Personnages complexes", "Enjeux actuels"], themes: ["Philosophie accessible", "Relations humaines", "Défis sociétaux", "Futur et technologie"], icon: "🎓", color: "#F0E68C" }
];

const developmentBenefits = [
  { title: "Développement Linguistique", description: "Chaque conte personnalisé enfant enrichit le vocabulaire et améliore la compréhension écrite selon l'âge.", icon: "📚" },
  { title: "Éveil Cognitif", description: "Stimulation de la mémoire, de la logique et de la capacité d'analyse adaptée au développement de l'enfant.", icon: "🧠" },
  { title: "Intelligence Émotionnelle", description: "Apprentissage de la gestion des émotions et développement de l'empathie à travers les personnages.", icon: "❤️" },
  { title: "Créativité et Imagination", description: "Stimulation de l'imagination créative avec des histoires qui s'adaptent aux centres d'intérêt de chaque âge.", icon: "🎨" }
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
      <SEOHead
        title="Contes Personnalisés par Âge | Livre pour Bébé et Enfant Adapté"
        description="Choisissez un conte adapté à l'âge de votre enfant : livre pour bébé personnalisé (2-4 ans), histoires magiques (4-6 ans), aventures (6-8 ans). Développement optimal avec notre IA."
      />
      <Helmet>
        <title>Contes Personnalisés par Âge | Livre pour Bébé et Enfant Adapté</title>
        <meta name="description" content="Choisissez un conte adapté à l'âge de votre enfant : livre pour bébé personnalisé (2-4 ans), histoires magiques (4-6 ans), aventures (6-8 ans). Développement optimal avec notre IA." />
        <meta name="keywords" content="livre pour bébé personnalisé, comment choisir un conte adapté à l'âge de son enfant, conte personnalisé 2 ans, livre personnalisé 3 ans, histoire personnalisée 5 ans, conte éducatif personnalisé, livre adapté âge enfant" />
      </Helmet>
      <Header />

      <HeroSection>
        <HeroDecoBlur $size={350} $top="-10%" $left="-5%" $color={theme.colors.accent.coral} $opacity={0.08} />
        <HeroDecoBlur $size={280} $top="60%" $left="85%" $color={theme.colors.accent.pastelBlue} $opacity={0.06} />
        <HeroDecoBlur $size={200} $top="30%" $left="50%" $color={theme.colors.accent.paleYellow} $opacity={0.07} />
        <HeroContent>
          <HeroBadge>Par âge</HeroBadge>
          <HeroTitle>Contes par <span>Âge</span></HeroTitle>
          <HeroDivider />
          <HeroSubtitle>
            Chaque étape de l'enfance mérite une histoire unique. Nos contes personnalisés s'adaptent
            parfaitement au développement cognitif et émotionnel de votre enfant.
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
              Notre intelligence artificielle crée des histoires sur mesure, adaptées aux capacités de lecture,
              aux centres d'intérêt et au niveau de développement de chaque tranche d'âge.
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
            <SectionTitle>Les Bienfaits du <span>Développement</span></SectionTitle>
            <SectionDivider />
            <SectionSubtitle>
              Nos contes personnalisés accompagnent le développement de votre enfant
              à chaque étape de sa croissance, stimulant ses capacités de manière naturelle.
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
            <FinalCTATitle>Créez le Conte Idéal pour Votre Enfant</FinalCTATitle>
            <FinalCTAText>
              Notre IA va créer une histoire parfaitement adaptée à l'âge et à la personnalité
              de votre enfant. Un conte illustré unique qui grandira avec lui dans ses souvenirs.
            </FinalCTAText>
            <WhiteButton onClick={() => navigate('/create-story')}>Créer mon conte</WhiteButton>
          </FinalCTAContent>
        </SectionWrapper>
      </FinalCTASection>

      <Footer />
    </PageContainer>
  );
};

export default ContesParAgePage;

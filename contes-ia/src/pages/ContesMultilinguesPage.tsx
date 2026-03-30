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
  StepNumber,
  FinalCTASection, FinalCTAContent, FinalCTATitle, FinalCTAText, WhiteButton
} from '../styles/DiscoverPageStyles';

const languages = [
  {
    name: "Francais",
    flag: "\uD83C\uDDEB\uD83C\uDDF7",
    description: "La langue de Moliere pour des contes poetiques et raffines, parfaits pour developper l'amour de la belle langue francaise.",
    benefits: ["Richesse vocabulaire", "Elegance litteraire", "Culture francaise", "Poesie naturelle"],
    level: "Langue maternelle"
  },
  {
    name: "Anglais",
    flag: "\uD83C\uDDEC\uD83C\uDDE7",
    description: "Ouvrez les portes du monde anglophone avec des histoires captivantes qui facilitent l'apprentissage de cette langue universelle.",
    benefits: ["Langue internationale", "Ouverture mondiale", "Vocabulaire moderne", "Accent authentique"],
    level: "Apprentissage ludique"
  },
  {
    name: "Espagnol",
    flag: "\uD83C\uDDEA\uD83C\uDDF8",
    description: "Découvrez la chaleur de la culture hispanique à travers des contes colorés et expressifs en espagnol.",
    benefits: ["Culture latine", "Sonorités musicales", "Expressions vivantes", "Diversité culturelle"],
    level: "Immersion douce"
  },
  {
    name: "Italien",
    flag: "\uD83C\uDDEE\uD83C\uDDF9",
    description: "L'art de vivre italien s'exprime dans des histoires pleines de passion et de créativité, bellissimo !",
    benefits: ["Art de vivre", "Créativité", "Passion narrative", "Héritage culturel"],
    level: "Découverte artistique"
  },
  {
    name: "Allemand",
    flag: "\uD83C\uDDE9\uD83C\uDDEA",
    description: "Précision et imagination se rencontrent dans des contes structurés qui révèlent la richesse de la culture germanique.",
    benefits: ["Précision linguistique", "Logique narrative", "Culture européenne", "Tradition littéraire"],
    level: "Apprentissage méthodique"
  },
  {
    name: "Arabe",
    flag: "\uD83C\uDDF8\uD83C\uDDE6",
    description: "Plongez dans l'univers des Mille et Une Nuits avec des contes qui célèbrent la richesse de la culture arabe.",
    benefits: ["Héritage millénaire", "Poésie orientale", "Sagesse ancestrale", "Calligraphie artistique"],
    level: "Découverte culturelle"
  }
];

const educationalBenefits = [
  {
    title: "Développement Linguistique",
    description: "Acquisition naturelle du vocabulaire et des structures grammaticales dans un contexte narratif engageant.",
    icon: "\uD83D\uDDE3\uFE0F"
  },
  {
    title: "Ouverture Culturelle",
    description: "Découverte des traditions, valeurs et modes de pensée de différentes cultures à travers leurs histoires.",
    icon: "\uD83C\uDF0D"
  },
  {
    title: "Flexibilité Cognitive",
    description: "Stimulation de la plasticité cérébrale et amélioration des capacités d'adaptation mentale.",
    icon: "\uD83E\uDDE0"
  },
  {
    title: "Confiance Internationale",
    description: "Préparation à un monde globalisé et développement de l'aisance dans les échanges interculturels.",
    icon: "\uD83E\uDD1D"
  }
];

const ageAdaptations = [
  {
    age: "3-5 ans",
    approach: "Immersion Douce",
    description: "Mots simples, repetitions rassurantes et sonorites familieres pour une premiere approche positive.",
    features: ["Vocabulaire de base", "Repetitions ludiques", "Sons familiers", "Images associees"]
  },
  {
    age: "6-8 ans",
    approach: "Apprentissage Ludique",
    description: "Histoires bilingues avec traductions integrees pour faciliter la comprehension et l'apprentissage.",
    features: ["Traductions integrees", "Jeux de mots", "Dialogues simples", "Contexte visuel"]
  },
  {
    age: "9-12 ans",
    approach: "Immersion Progressive",
    description: "Contes plus complexes qui developpent la maitrise linguistique et la comprehension culturelle.",
    features: ["Structures avancees", "Nuances culturelles", "Expressions idiomatiques", "Contexte historique"]
  }
];

const ContesMultilinguesPage: React.FC = () => {
  const navigate = useNavigate();
  const languagesReveal = useScrollReveal();
  const languagesCardsReveal = useStaggerReveal(languages.length);
  const benefitsReveal = useScrollReveal();
  const benefitsCardsReveal = useStaggerReveal(educationalBenefits.length);
  const ageReveal = useScrollReveal();
  const ageCardsReveal = useStaggerReveal(ageAdaptations.length);
  const ctaReveal = useScrollReveal();

  return (
    <PageContainer>
      <SEOHead
        title="Livre Personnalisé Multilingue pour Enfant | Apprentissage des Langues"
        description="Créez un livre personnalisé multilingue pour enfant : français, anglais, espagnol, italien, allemand, arabe. Apprentissage naturel des langues avec des histoires sur mesure."
      />
      <Helmet>
        <title>Livre Personnalisé Multilingue pour Enfant | Apprentissage des Langues</title>
        <meta name="description" content="Créez un livre personnalisé multilingue pour enfant : français, anglais, espagnol, italien, allemand, arabe. Apprentissage naturel des langues avec des histoires sur mesure." />
        <meta name="keywords" content="livre personnalisé multilingue pour enfant, conte personnalisé anglais, livre personnalisé espagnol, apprentissage langues enfant, conte bilingue personnalisé, livre éducatif multilingue, histoire personnalisée langues étrangères" />
      </Helmet>
      <Header />

      <HeroSection>
        <HeroDecoBlur $size={350} $top="-10%" $left="-5%" $color={theme.colors.accent.coral} $opacity={0.08} />
        <HeroDecoBlur $size={280} $top="60%" $left="85%" $color={theme.colors.accent.pastelBlue} $opacity={0.06} />
        <HeroDecoBlur $size={200} $top="30%" $left="50%" $color={theme.colors.accent.paleYellow} $opacity={0.07} />
        <HeroContent>
          <HeroBadge>6 langues disponibles</HeroBadge>
          <HeroTitle>Contes <span>Multilingues</span></HeroTitle>
          <HeroDivider />
          <HeroSubtitle>
            Ouvrez les portes du monde à votre enfant avec des contes personnalisés
            dans 6 langues. L'apprentissage des langues devient une aventure magique.
          </HeroSubtitle>
        </HeroContent>
      </HeroSection>

      {/* Section 1: Languages Grid */}
      <ContentSection ref={languagesReveal.ref}>
        <SectionDeco $size={300} $top="-50px" $right="-100px" $color={theme.colors.accent.softPink} />
        <Container>
          <SectionWrapper $visible={languagesReveal.isVisible}>
            <SectionTitle>Notre Palette <span>Linguistique</span></SectionTitle>
            <SectionDivider />
            <SectionSubtitle>
              Chaque langue porte en elle une vision unique du monde. Notre intelligence artificielle
              crée des histoires authentiques qui respectent l'esprit et la culture de chaque langue.
            </SectionSubtitle>
          </SectionWrapper>
          <CardsGrid ref={languagesCardsReveal.ref}>
            {languages.map((language, i) => (
              <FeatureCard key={i} $visible={languagesCardsReveal.isVisible} $delay={languagesCardsReveal.getDelay(i)}>
                <CardIcon>{language.flag}</CardIcon>
                <CardTitle>{language.name}</CardTitle>
                <CardDescription>{language.description}</CardDescription>
                <CardTagsRow>
                  <CardTag $color={theme.colors.accent.pastelBlue}>{language.level}</CardTag>
                </CardTagsRow>
                <CardTagsRow style={{ marginTop: '8px' }}>
                  {language.benefits.map((benefit, j) => (
                    <CardTag key={j}>{benefit}</CardTag>
                  ))}
                </CardTagsRow>
              </FeatureCard>
            ))}
          </CardsGrid>
        </Container>
      </ContentSection>

      {/* Section 2: Educational Benefits (alt background) */}
      <ContentSection $alt ref={benefitsReveal.ref}>
        <SectionDeco $size={250} $top="10%" $left="-80px" $color={theme.colors.accent.paleYellow} />
        <Container>
          <SectionWrapper $visible={benefitsReveal.isVisible}>
            <SectionTitle>Les Bienfaits de l'Apprentissage <span>Multilingue</span></SectionTitle>
            <SectionDivider />
            <SectionSubtitle>
              L'exposition precoce aux langues etrangeres stimule le developpement cognitif
              et ouvre des horizons infinis a votre enfant.
            </SectionSubtitle>
          </SectionWrapper>
          <CardsGrid $columns={4} ref={benefitsCardsReveal.ref}>
            {educationalBenefits.map((benefit, i) => (
              <FeatureCard key={i} $visible={benefitsCardsReveal.isVisible} $delay={benefitsCardsReveal.getDelay(i)}>
                <CardIcon>{benefit.icon}</CardIcon>
                <CardTitle>{benefit.title}</CardTitle>
                <CardDescription>{benefit.description}</CardDescription>
              </FeatureCard>
            ))}
          </CardsGrid>
        </Container>
      </ContentSection>

      {/* Section 3: Age Adaptations */}
      <ContentSection ref={ageReveal.ref}>
        <SectionDeco $size={280} $top="-30px" $right="-60px" $color={theme.colors.accent.lightGreen} />
        <Container>
          <SectionWrapper $visible={ageReveal.isVisible}>
            <SectionTitle>Adapte a chaque <span>Age</span></SectionTitle>
            <SectionDivider />
            <SectionSubtitle>
              Nos contes multilingues s'adaptent au niveau de developpement de votre enfant
              pour un apprentissage optimal et naturel.
            </SectionSubtitle>
          </SectionWrapper>
          <CardsGrid $columns={3} ref={ageCardsReveal.ref}>
            {ageAdaptations.map((adaptation, i) => (
              <FeatureCard key={i} $visible={ageCardsReveal.isVisible} $delay={ageCardsReveal.getDelay(i)}>
                <StepNumber>{adaptation.age}</StepNumber>
                <CardTitle>{adaptation.approach}</CardTitle>
                <CardDescription>{adaptation.description}</CardDescription>
                <CardTagsRow>
                  {adaptation.features.map((feature, j) => (
                    <CardTag key={j}>{feature}</CardTag>
                  ))}
                </CardTagsRow>
              </FeatureCard>
            ))}
          </CardsGrid>
        </Container>
      </ContentSection>

      {/* Final CTA */}
      <FinalCTASection ref={ctaReveal.ref}>
        <SectionWrapper $visible={ctaReveal.isVisible}>
          <FinalCTAContent>
            <FinalCTATitle>Offrez le Monde à Votre Enfant</FinalCTATitle>
            <FinalCTAText>
              Créez un conte personnalisé multilingue qui ouvrira ses horizons et développera
              ses compétences linguistiques de manière naturelle et joyeuse.
            </FinalCTAText>
            <WhiteButton onClick={() => navigate('/create-story')}>Créer mon conte</WhiteButton>
          </FinalCTAContent>
        </SectionWrapper>
      </FinalCTASection>

      <Footer />
    </PageContainer>
  );
};

export default ContesMultilinguesPage;

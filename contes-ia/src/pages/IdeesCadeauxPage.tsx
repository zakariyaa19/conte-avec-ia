import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { useScrollReveal, useStaggerReveal } from '../hooks/useScrollReveal';
import { SEOHead } from '../components/SEOHead';
import { SchemaBreadcrumb } from '../components/SchemaMarkup';
import { theme } from '../styles/theme';
import {
  PageContainer, HeroSection, HeroDecoBlur, HeroContent, HeroBadge,
  HeroTitle, HeroDivider, HeroSubtitle, ContentSection, SectionDeco,
  Container, SectionWrapper, SectionTitle, SectionSubtitle, SectionDivider,
  CardsGrid, FeatureCard, CardIcon, CardTitle, CardDescription, CardTagsRow, CardTag,
  TwoColumnGrid, StepNumber,
  FinalCTASection, FinalCTAContent, FinalCTATitle, FinalCTAText, WhiteButton
} from '../styles/DiscoverPageStyles';

const giftOccasions = [
  {
    occasion: "Anniversaire",
    description: "Le cadeau parfait pour marquer une année de plus avec une histoire unique qui grandit avec l'enfant.",
    icon: "\uD83C\uDF82",
    ageRecommendations: ["2-4 ans", "5-7 ans", "8-12 ans"],
    personalizations: ["Nom de l'enfant héros", "Âge dans l'histoire", "Amis comme personnages", "Lieux familiers"],
    color: "#FFE6F0"
  },
  {
    occasion: "Noël",
    description: "Un conte magique sous le sapin qui apportera émerveillement et joie pendant les fêtes de fin d'année.",
    icon: "\uD83C\uDF84",
    ageRecommendations: ["3-6 ans", "6-10 ans", "10+ ans"],
    personalizations: ["Thème hivernal", "Magie de Noël", "Valeurs de partage", "Traditions familiales"],
    color: "#E6F3FF"
  },
  {
    occasion: "Rentrée Scolaire",
    description: "Rassurer et motiver avec une histoire qui transforme l'appréhension en excitation pour cette nouvelle aventure.",
    icon: "\uD83C\uDF92",
    ageRecommendations: ["4-6 ans", "6-8 ans", "8-10 ans"],
    personalizations: ["Courage et confiance", "Nouvelles amitiés", "Apprentissages", "Adaptation"],
    color: "#FFF0E6"
  },
  {
    occasion: "Fête des Mères/Pères",
    description: "Célébrer l'amour familial avec un conte personnalisé qui honore les liens précieux entre parents et enfants.",
    icon: "\uD83D\uDC9D",
    ageRecommendations: ["3-8 ans", "8-12 ans"],
    personalizations: ["Amour familial", "Moments partagés", "Reconnaissance", "Tendresse"],
    color: "#F0E6FF"
  },
  {
    occasion: "Récompense",
    description: "Féliciter un effort, un progrès ou une réussite avec un cadeau enfant original qui valorise ses accomplissements.",
    icon: "\uD83C\uDFC6",
    ageRecommendations: ["4-8 ans", "8-12 ans"],
    personalizations: ["Fierté et réussite", "Persévérance", "Talents uniques", "Encouragements"],
    color: "#E6FFE6"
  },
  {
    occasion: "Consolation",
    description: "Apporter reconfort et espoir dans les moments difficiles avec une histoire douce et rassurante.",
    icon: "\uD83E\uDD17",
    ageRecommendations: ["3-6 ans", "6-10 ans", "10+ ans"],
    personalizations: ["Résilience", "Espoir", "Soutien émotionnel", "Guérison"],
    color: "#FFFAE6"
  }
];

const giftFormats = [
  {
    format: "eBook Numérique",
    price: "4,99€",
    description: "Format digital immédiat, parfait pour une surprise de dernière minute ou un cadeau éco-responsable.",
    advantages: ["Livraison instantanée", "Écologique", "Lecture sur tablette", "Prix accessible"],
    bestFor: ["Cadeaux spontanés", "Familles nomades", "Lecture interactive", "Budget serré"],
    icon: "\uD83D\uDCF1"
  },
  {
    format: "Club des Histoires",
    price: "9,99€/mois",
    description: "L'abonnement idéal pour les familles : 4 livres avec 2x plus de pages par mois, 9 styles, personnages secondaires. Crédits cumulables.",
    advantages: ["4 livres par mois", "2x plus de pages & illustrations", "Sans engagement", "Soit 2,50€ par livre"],
    bestFor: ["Familles passionnées", "Cadeaux réguliers", "Lecteurs assidus", "Budget maîtrisé"],
    icon: "\u2B50"
  }
];

const personalizationIdeas = [
  {
    category: "Personnages",
    ideas: ["L'enfant comme héros principal", "Frères et sœurs comme compagnons", "Animaux de compagnie", "Grands-parents sages", "Meilleurs amis"],
    icon: "\uD83D\uDC65"
  },
  {
    category: "Lieux",
    ideas: ["Maison familiale", "École de l'enfant", "Ville natale", "Lieux de vacances", "Pays d'origine"],
    icon: "\uD83C\uDFE0"
  },
  {
    category: "Passions",
    ideas: ["Sport favori", "Instrument de musique", "Animaux préférés", "Couleurs favorites", "Activités créatives"],
    icon: "\u26BD"
  },
  {
    category: "Valeurs",
    ideas: ["Courage et bravoure", "Amitié et partage", "Respect de la nature", "Curiosité scientifique", "Créativité artistique"],
    icon: "\uD83D\uDC8E"
  }
];

const ageSpecificGifts = [
  {
    age: "2-4 ans",
    title: "Premiers Émerveillements",
    description: "Des histoires courtes et colorées pour éveiller l'imagination des tout-petits.",
    giftIdeas: ["Premier conte personnalisé", "Histoire du doudou magique", "Aventure avec papa/maman", "Conte des premières fois"],
    themes: ["Animaux familiers", "Routine quotidienne", "Découverte des couleurs", "Premiers apprentissages"]
  },
  {
    age: "5-7 ans",
    title: "Aventuriers en Herbe",
    description: "L'âge parfait pour les grandes aventures et les amitiés magiques.",
    giftIdeas: ["Héros de l'école", "Aventure avec les copains", "Mystère à résoudre", "Voyage fantastique"],
    themes: ["Magie et féerie", "Amitié", "Courage", "Découverte du monde"]
  },
  {
    age: "8-12 ans",
    title: "Explorateurs Confirmés",
    description: "Des récits plus complexes qui nourrissent leur soif de connaissances et d'aventures.",
    giftIdeas: ["Enquête scientifique", "Voyage dans le temps", "Mission écologique", "Aventure culturelle"],
    themes: ["Sciences", "Histoire", "Écologie", "Cultures du monde"]
  }
];

const IdeesCadeauxPage: React.FC = () => {
  const navigate = useNavigate();
  const occasionsReveal = useScrollReveal();
  const occasionsCardsReveal = useStaggerReveal(giftOccasions.length);
  const formatsReveal = useScrollReveal();
  const formatsCardsReveal = useStaggerReveal(giftFormats.length);
  const personalizationReveal = useScrollReveal();
  const personalizationCardsReveal = useStaggerReveal(personalizationIdeas.length);
  const ageReveal = useScrollReveal();
  const ageCardsReveal = useStaggerReveal(ageSpecificGifts.length);
  const ctaReveal = useScrollReveal();

  return (
    <PageContainer>
      <SEOHead
        title="Idées Cadeaux Originaux pour Enfants | Livre Personnalisé Anniversaire"
        description="Découvrez le cadeau personnalisé enfant parfait ! Livre personnalisé pour anniversaire, Noël, rentrée. Histoire personnalisée pour un anniversaire d'enfant unique et mémorable."
      />
      <SchemaBreadcrumb items={[
        { name: 'Accueil', url: 'https://contedia.fr/' },
        { name: 'Idées cadeaux', url: 'https://contedia.fr/idees-cadeaux' },
      ]} />
      <Header />

      <HeroSection>
        <HeroDecoBlur $size={350} $top="-10%" $left="-5%" $color={theme.colors.accent.coral} $opacity={0.08} />
        <HeroDecoBlur $size={280} $top="60%" $left="85%" $color={theme.colors.accent.pastelBlue} $opacity={0.06} />
        <HeroDecoBlur $size={200} $top="30%" $left="50%" $color={theme.colors.accent.paleYellow} $opacity={0.07} />
        <HeroContent>
          <HeroBadge>Idées cadeaux</HeroBadge>
          <HeroTitle>Idées <span>Cadeaux</span></HeroTitle>
          <HeroDivider />
          <HeroSubtitle>
            Offrez bien plus qu'un simple livre ! Un conte personnalisé où votre enfant
            devient le héros de sa propre histoire magique, le cadeau original parfait.
          </HeroSubtitle>
        </HeroContent>
      </HeroSection>

      {/* Section 1: Gift Occasions Grid */}
      <ContentSection ref={occasionsReveal.ref}>
        <SectionDeco $size={300} $top="-50px" $right="-100px" $color={theme.colors.accent.softPink} />
        <Container>
          <SectionWrapper $visible={occasionsReveal.isVisible}>
            <SectionTitle>Le Cadeau Parfait pour Chaque <span>Occasion</span></SectionTitle>
            <SectionDivider />
            <SectionSubtitle>
              Que ce soit pour célébrer, récompenser, consoler ou simplement faire plaisir,
              nos contes personnalisés s'adaptent à tous les moments importants.
            </SectionSubtitle>
          </SectionWrapper>
          <CardsGrid ref={occasionsCardsReveal.ref}>
            {giftOccasions.map((item, i) => (
              <FeatureCard
                key={i}
                $visible={occasionsCardsReveal.isVisible}
                $delay={occasionsCardsReveal.getDelay(i)}
                $accentColor={item.color}
              >
                <CardIcon>{item.icon}</CardIcon>
                <CardTitle>{item.occasion}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
                <CardTagsRow>
                  {item.personalizations.map((tag, j) => (
                    <CardTag key={j}>{tag}</CardTag>
                  ))}
                </CardTagsRow>
              </FeatureCard>
            ))}
          </CardsGrid>
        </Container>
      </ContentSection>

      {/* Section 2: Gift Formats (2-column, alt background) */}
      <ContentSection $alt ref={formatsReveal.ref}>
        <SectionDeco $size={250} $top="10%" $left="-80px" $color={theme.colors.accent.paleYellow} />
        <Container>
          <SectionWrapper $visible={formatsReveal.isVisible}>
            <SectionTitle>Choisissez le Format <span>Parfait</span></SectionTitle>
            <SectionDivider />
            <SectionSubtitle>
              Deux formats disponibles pour s'adapter à toutes les envies et tous les budgets.
            </SectionSubtitle>
          </SectionWrapper>
          <TwoColumnGrid ref={formatsCardsReveal.ref}>
            {giftFormats.map((item, i) => (
              <FeatureCard key={i} $visible={formatsCardsReveal.isVisible} $delay={formatsCardsReveal.getDelay(i)}>
                <CardIcon>{item.icon}</CardIcon>
                <CardTitle>{item.format}</CardTitle>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: theme.colors.accent.coral,
                  marginBottom: '12px'
                }}>
                  {item.price}
                </div>
                <CardDescription>{item.description}</CardDescription>
                <CardTagsRow>
                  {item.advantages.map((adv, j) => (
                    <CardTag key={j}>{adv}</CardTag>
                  ))}
                </CardTagsRow>
                <CardTagsRow style={{ marginTop: '8px' }}>
                  {item.bestFor.map((bf, j) => (
                    <CardTag key={j} $color={theme.colors.accent.pastelBlue}>{bf}</CardTag>
                  ))}
                </CardTagsRow>
              </FeatureCard>
            ))}
          </TwoColumnGrid>
        </Container>
      </ContentSection>

      {/* Section 3: Personalization Ideas */}
      <ContentSection ref={personalizationReveal.ref}>
        <SectionDeco $size={280} $top="-30px" $right="-60px" $color={theme.colors.accent.lightGreen} />
        <Container>
          <SectionWrapper $visible={personalizationReveal.isVisible}>
            <SectionTitle>Idées de <span>Personnalisation</span></SectionTitle>
            <SectionDivider />
            <SectionSubtitle>
              Rendez chaque conte unique en intégrant les éléments de la vie de votre enfant
              pour une expérience de lecture vraiment personnelle.
            </SectionSubtitle>
          </SectionWrapper>
          <CardsGrid $columns={4} ref={personalizationCardsReveal.ref}>
            {personalizationIdeas.map((item, i) => (
              <FeatureCard key={i} $visible={personalizationCardsReveal.isVisible} $delay={personalizationCardsReveal.getDelay(i)}>
                <CardIcon>{item.icon}</CardIcon>
                <CardTitle>{item.category}</CardTitle>
                <CardTagsRow>
                  {item.ideas.map((idea, j) => (
                    <CardTag key={j}>{idea}</CardTag>
                  ))}
                </CardTagsRow>
              </FeatureCard>
            ))}
          </CardsGrid>
        </Container>
      </ContentSection>

      {/* Section 4: Age-Specific Gifts */}
      <ContentSection $alt ref={ageReveal.ref}>
        <SectionDeco $size={260} $top="5%" $left="-70px" $color={theme.colors.accent.softPeach} />
        <Container>
          <SectionWrapper $visible={ageReveal.isVisible}>
            <SectionTitle>Cadeaux par <span>Âge</span></SectionTitle>
            <SectionDivider />
            <SectionSubtitle>
              Chaque tranche d'âge mérite un conte adapté à ses centres d'intérêt
              et à son niveau de compréhension.
            </SectionSubtitle>
          </SectionWrapper>
          <CardsGrid $columns={3} ref={ageCardsReveal.ref}>
            {ageSpecificGifts.map((item, i) => (
              <FeatureCard key={i} $visible={ageCardsReveal.isVisible} $delay={ageCardsReveal.getDelay(i)}>
                <StepNumber>{item.age}</StepNumber>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
                <CardTagsRow>
                  {item.giftIdeas.map((idea, j) => (
                    <CardTag key={j}>{idea}</CardTag>
                  ))}
                </CardTagsRow>
                <CardTagsRow style={{ marginTop: '8px' }}>
                  {item.themes.map((t, j) => (
                    <CardTag key={j} $color={theme.colors.accent.pastelBlue}>{t}</CardTag>
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
            <FinalCTATitle>Créez le Cadeau Enfant Original Parfait</FinalCTATitle>
            <FinalCTAText>
              Ne cherchez plus le cadeau idéal : créez-le ! Un conte personnalisé unique
              qui célébrera sa personnalité et nourrira son imagination.
            </FinalCTAText>
            <WhiteButton onClick={() => navigate('/create-story')}>Créer mon conte</WhiteButton>
          </FinalCTAContent>
        </SectionWrapper>
      </FinalCTASection>

      <Footer />
    </PageContainer>
  );
};

export default IdeesCadeauxPage;

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

const educationalValues = [
  {
    title: "Respect et Tolérance",
    description: "Apprendre à accepter les différences, respecter autrui et cultiver l'ouverture d'esprit dès le plus jeune âge.",
    icon: "\uD83E\uDD1D",
    themes: ["Diversité culturelle", "Acceptation des différences", "Vivre ensemble"],
    ageGroups: ["4-6 ans", "6-8 ans", "8-10 ans"],
    color: "#E8F5E8"
  },
  {
    title: "Courage et Persévérance",
    description: "Développer la bravoure face aux défis et la détermination pour surmonter les obstacles de la vie.",
    icon: "\uD83D\uDCAA",
    themes: ["Héros et bravoure", "Défis personnels", "Dépassement de soi"],
    ageGroups: ["5-8 ans", "8-10 ans", "10+ ans"],
    color: "#FFF0E6"
  },
  {
    title: "Empathie et Bienveillance",
    description: "Cultiver la capacité à comprendre les émotions d'autrui et développer la compassion naturelle.",
    icon: "\u2764\uFE0F",
    themes: ["Amitié et partage", "Émotions", "Relations humaines"],
    ageGroups: ["3-6 ans", "6-8 ans", "8-12 ans"],
    color: "#FFE6F0"
  },
  {
    title: "Curiosité et Apprentissage",
    description: "Stimuler la soif de connaissances et l'amour de la découverte pour un apprentissage joyeux.",
    icon: "\uD83D\uDD0D",
    themes: ["Sciences et découvertes", "Exploration", "Mystères"],
    ageGroups: ["4-8 ans", "8-10 ans", "10+ ans"],
    color: "#E6F3FF"
  },
  {
    title: "Responsabilité Écologique",
    description: "Sensibiliser à la protection de l'environnement et développer une conscience écologique forte.",
    icon: "\uD83C\uDF31",
    themes: ["Nature et animaux", "Écologie", "Environnement"],
    ageGroups: ["5-8 ans", "8-10 ans", "10+ ans"],
    color: "#F0FFE6"
  },
  {
    title: "Créativité et Expression",
    description: "Encourager l'imagination créative et la libre expression artistique de la personnalité unique.",
    icon: "\uD83C\uDFA8",
    themes: ["Art et créativité", "Expression personnelle", "Imagination"],
    ageGroups: ["3-6 ans", "6-8 ans", "8-12 ans"],
    color: "#F0E6FF"
  },
  {
    title: "Justice et Équité",
    description: "Comprendre l'importance de la fairness et développer un sens moral solide et équilibré.",
    icon: "\u2696\uFE0F",
    themes: ["Morale et éthique", "Droits et devoirs", "Citoyenneté"],
    ageGroups: ["6-8 ans", "8-10 ans", "10+ ans"],
    color: "#E6FFE6"
  },
  {
    title: "Confiance en Soi",
    description: "Renforcer l'estime personnelle et développer l'assurance nécessaire pour s'épanouir pleinement.",
    icon: "\u2B50",
    themes: ["Développement personnel", "Estime de soi", "Réussite"],
    ageGroups: ["4-8 ans", "8-10 ans", "10+ ans"],
    color: "#FFFAE6"
  }
];

const implementationMethods = [
  {
    title: "Intégration Narrative Naturelle",
    description: "Les valeurs sont tissées dans l'histoire de manière organique, sans moralisation forcée.",
    icon: "\uD83D\uDCD6"
  },
  {
    title: "Personnages Exemplaires",
    description: "Des héros qui incarnent les valeurs et servent de modèles positifs pour l'enfant.",
    icon: "\uD83E\uDDB8"
  },
  {
    title: "Situations Concrètes",
    description: "Des dilemmes et choix réalistes qui permettent à l'enfant de réfléchir aux conséquences.",
    icon: "\uD83E\uDD14"
  },
  {
    title: "Dialogue et Réflexion",
    description: "Des moments d'échange qui encouragent la discussion entre parents et enfants.",
    icon: "\uD83D\uDCAC"
  }
];

const ageSpecificApproach = [
  {
    age: "3-5 ans",
    approach: "Découverte Émotionnelle",
    description: "Introduction douce aux émotions de base et aux relations interpersonnelles simples.",
    values: ["Partage", "Gentillesse", "Respect des autres", "Amour familial"],
    method: "Histoires courtes avec répétitions rassurantes et personnages attachants."
  },
  {
    age: "6-8 ans",
    approach: "Apprentissage Social",
    description: "Développement de la conscience sociale et des premières notions de bien et mal.",
    values: ["Amitié", "Honnêteté", "Courage", "Respect de la nature"],
    method: "Aventures avec choix moraux clairs et conséquences positives."
  },
  {
    age: "9-12 ans",
    approach: "Réflexion Éthique",
    description: "Exploration de concepts moraux plus complexes et développement de l'esprit critique.",
    values: ["Justice", "Responsabilité", "Tolérance", "Persévérance"],
    method: "Récits nuancés avec dilemmes moraux et réflexions approfondies."
  }
];

const ValeursEducativesPage: React.FC = () => {
  const navigate = useNavigate();
  const valuesReveal = useScrollReveal();
  const valuesCardsReveal = useStaggerReveal(educationalValues.length);
  const methodsReveal = useScrollReveal();
  const methodsCardsReveal = useStaggerReveal(implementationMethods.length);
  const ageReveal = useScrollReveal();
  const ageCardsReveal = useStaggerReveal(ageSpecificApproach.length);
  const ctaReveal = useScrollReveal();

  return (
    <PageContainer>
      <SEOHead
        title="Contes Éducatifs Personnalisés | Valeurs et Développement Émotionnel Enfant"
        description="Transmettez des valeurs importantes avec nos contes éducatifs personnalisés : respect, courage, empathie, confiance en soi. Développement émotionnel optimal de votre enfant."
      />
      <Helmet>
        <title>Contes Éducatifs Personnalisés | Valeurs et Développement Émotionnel Enfant</title>
        <meta name="description" content="Transmettez des valeurs importantes avec nos contes éducatifs personnalisés : respect, courage, empathie, confiance en soi. Développement émotionnel optimal de votre enfant." />
        <meta name="keywords" content="conte éducatif personnalisé, contes éducatifs et développement émotionnel, conte personnalisé pour apprendre la confiance en soi, valeurs éducatives conte, livre éducatif personnalisé pour enfant, développement émotionnel enfant, conte moral personnalisé" />
      </Helmet>
      <Header />

      <HeroSection>
        <HeroDecoBlur $size={350} $top="-10%" $left="-5%" $color={theme.colors.accent.coral} $opacity={0.08} />
        <HeroDecoBlur $size={280} $top="60%" $left="85%" $color={theme.colors.accent.pastelBlue} $opacity={0.06} />
        <HeroDecoBlur $size={200} $top="30%" $left="50%" $color={theme.colors.accent.paleYellow} $opacity={0.07} />
        <HeroContent>
          <HeroBadge>Valeurs éducatives</HeroBadge>
          <HeroTitle>Valeurs <span>Éducatives</span></HeroTitle>
          <HeroDivider />
          <HeroSubtitle>
            Chaque conte est une graine de sagesse plantée dans le cœur de votre enfant.
            Transmettez des valeurs essentielles à travers des histoires personnalisées.
          </HeroSubtitle>
        </HeroContent>
      </HeroSection>

      {/* Section 1: Educational Values Grid (4 columns) */}
      <ContentSection ref={valuesReveal.ref}>
        <SectionDeco $size={300} $top="-50px" $right="-100px" $color={theme.colors.accent.softPink} />
        <Container>
          <SectionWrapper $visible={valuesReveal.isVisible}>
            <SectionTitle>Notre Palette de Valeurs <span>Fondamentales</span></SectionTitle>
            <SectionDivider />
            <SectionSubtitle>
              Nos contes personnalisés intègrent naturellement des valeurs universelles,
              adaptées à chaque âge et personnalité. Chaque livre devient un compagnon
              de croissance morale et émotionnelle.
            </SectionSubtitle>
          </SectionWrapper>
          <CardsGrid $columns={4} ref={valuesCardsReveal.ref}>
            {educationalValues.map((value, i) => (
              <FeatureCard
                key={i}
                $visible={valuesCardsReveal.isVisible}
                $delay={valuesCardsReveal.getDelay(i)}
                $accentColor={value.color}
              >
                <CardIcon>{value.icon}</CardIcon>
                <CardTitle>{value.title}</CardTitle>
                <CardDescription>{value.description}</CardDescription>
                <CardTagsRow>
                  {value.themes.map((t, j) => (
                    <CardTag key={j} $color={value.color}>{t}</CardTag>
                  ))}
                </CardTagsRow>
                <CardTagsRow style={{ marginTop: '8px' }}>
                  {value.ageGroups.map((ag, j) => (
                    <CardTag key={j}>{ag}</CardTag>
                  ))}
                </CardTagsRow>
              </FeatureCard>
            ))}
          </CardsGrid>
        </Container>
      </ContentSection>

      {/* Section 2: Implementation Methods (alt background) */}
      <ContentSection $alt ref={methodsReveal.ref}>
        <SectionDeco $size={250} $top="10%" $left="-80px" $color={theme.colors.accent.paleYellow} />
        <Container>
          <SectionWrapper $visible={methodsReveal.isVisible}>
            <SectionTitle>Comment Nous Transmettons Ces <span>Valeurs</span></SectionTitle>
            <SectionDivider />
            <SectionSubtitle>
              Notre approche pédagogique intègre les valeurs de manière naturelle et engageante,
              sans jamais tomber dans la leçon de morale.
            </SectionSubtitle>
          </SectionWrapper>
          <CardsGrid $columns={4} ref={methodsCardsReveal.ref}>
            {implementationMethods.map((method, i) => (
              <FeatureCard key={i} $visible={methodsCardsReveal.isVisible} $delay={methodsCardsReveal.getDelay(i)}>
                <CardIcon>{method.icon}</CardIcon>
                <CardTitle>{method.title}</CardTitle>
                <CardDescription>{method.description}</CardDescription>
              </FeatureCard>
            ))}
          </CardsGrid>
        </Container>
      </ContentSection>

      {/* Section 3: Age-Specific Approach */}
      <ContentSection ref={ageReveal.ref}>
        <SectionDeco $size={280} $top="-30px" $right="-60px" $color={theme.colors.accent.lightGreen} />
        <Container>
          <SectionWrapper $visible={ageReveal.isVisible}>
            <SectionTitle>Adapté à chaque <span>Âge</span></SectionTitle>
            <SectionDivider />
            <SectionSubtitle>
              Les valeurs sont transmises différemment selon l'âge de l'enfant,
              pour un impact maximal et une compréhension optimale.
            </SectionSubtitle>
          </SectionWrapper>
          <CardsGrid $columns={3} ref={ageCardsReveal.ref}>
            {ageSpecificApproach.map((item, i) => (
              <FeatureCard key={i} $visible={ageCardsReveal.isVisible} $delay={ageCardsReveal.getDelay(i)}>
                <StepNumber>{item.age}</StepNumber>
                <CardTitle>{item.approach}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
                <CardDescription style={{ fontStyle: 'italic', marginBottom: '12px' }}>{item.method}</CardDescription>
                <CardTagsRow>
                  {item.values.map((v, j) => (
                    <CardTag key={j}>{v}</CardTag>
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
            <FinalCTATitle>Semez les Graines d'un Avenir Bienveillant</FinalCTATitle>
            <FinalCTAText>
              Créez un conte personnalisé qui transmettra les valeurs qui vous tiennent à cœur.
              Chaque histoire devient un cadeau précieux pour l'épanouissement de votre enfant.
            </FinalCTAText>
            <WhiteButton onClick={() => navigate('/create-story')}>Créer mon conte</WhiteButton>
          </FinalCTAContent>
        </SectionWrapper>
      </FinalCTASection>

      <Footer />
    </PageContainer>
  );
};

export default ValeursEducativesPage;

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
  StepNumber,
  FinalCTASection, FinalCTAContent, FinalCTATitle, FinalCTAText, WhiteButton
} from '../styles/DiscoverPageStyles';

const educationalValues = [
  {
    title: "Respect et Tolerance",
    description: "Apprendre a accepter les differences, respecter autrui et cultiver l'ouverture d'esprit des le plus jeune age.",
    icon: "\uD83E\uDD1D",
    themes: ["Diversite culturelle", "Acceptation des differences", "Vivre ensemble"],
    ageGroups: ["4-6 ans", "6-8 ans", "8-10 ans"],
    color: "#E8F5E8"
  },
  {
    title: "Courage et Perseverance",
    description: "Developper la bravoure face aux defis et la determination pour surmonter les obstacles de la vie.",
    icon: "\uD83D\uDCAA",
    themes: ["Heros et bravoure", "Defis personnels", "Depassement de soi"],
    ageGroups: ["5-8 ans", "8-10 ans", "10+ ans"],
    color: "#FFF0E6"
  },
  {
    title: "Empathie et Bienveillance",
    description: "Cultiver la capacite a comprendre les emotions d'autrui et developper la compassion naturelle.",
    icon: "\u2764\uFE0F",
    themes: ["Amitie et partage", "Emotions", "Relations humaines"],
    ageGroups: ["3-6 ans", "6-8 ans", "8-12 ans"],
    color: "#FFE6F0"
  },
  {
    title: "Curiosite et Apprentissage",
    description: "Stimuler la soif de connaissances et l'amour de la decouverte pour un apprentissage joyeux.",
    icon: "\uD83D\uDD0D",
    themes: ["Sciences et decouvertes", "Exploration", "Mysteres"],
    ageGroups: ["4-8 ans", "8-10 ans", "10+ ans"],
    color: "#E6F3FF"
  },
  {
    title: "Responsabilite Ecologique",
    description: "Sensibiliser a la protection de l'environnement et developper une conscience ecologique forte.",
    icon: "\uD83C\uDF31",
    themes: ["Nature et animaux", "Ecologie", "Environnement"],
    ageGroups: ["5-8 ans", "8-10 ans", "10+ ans"],
    color: "#F0FFE6"
  },
  {
    title: "Creativite et Expression",
    description: "Encourager l'imagination creative et la libre expression artistique de la personnalite unique.",
    icon: "\uD83C\uDFA8",
    themes: ["Art et creativite", "Expression personnelle", "Imagination"],
    ageGroups: ["3-6 ans", "6-8 ans", "8-12 ans"],
    color: "#F0E6FF"
  },
  {
    title: "Justice et Equite",
    description: "Comprendre l'importance de la fairness et developper un sens moral solide et equilibre.",
    icon: "\u2696\uFE0F",
    themes: ["Morale et ethique", "Droits et devoirs", "Citoyennete"],
    ageGroups: ["6-8 ans", "8-10 ans", "10+ ans"],
    color: "#E6FFE6"
  },
  {
    title: "Confiance en Soi",
    description: "Renforcer l'estime personnelle et developper l'assurance necessaire pour s'epanouir pleinement.",
    icon: "\u2B50",
    themes: ["Developpement personnel", "Estime de soi", "Reussite"],
    ageGroups: ["4-8 ans", "8-10 ans", "10+ ans"],
    color: "#FFFAE6"
  }
];

const implementationMethods = [
  {
    title: "Integration Narrative Naturelle",
    description: "Les valeurs sont tissees dans l'histoire de maniere organique, sans moralisation forcee.",
    icon: "\uD83D\uDCD6"
  },
  {
    title: "Personnages Exemplaires",
    description: "Des heros qui incarnent les valeurs et servent de modeles positifs pour l'enfant.",
    icon: "\uD83E\uDDB8"
  },
  {
    title: "Situations Concretes",
    description: "Des dilemmes et choix realistes qui permettent a l'enfant de reflechir aux consequences.",
    icon: "\uD83E\uDD14"
  },
  {
    title: "Dialogue et Reflexion",
    description: "Des moments d'echange qui encouragent la discussion entre parents et enfants.",
    icon: "\uD83D\uDCAC"
  }
];

const ageSpecificApproach = [
  {
    age: "3-5 ans",
    approach: "Decouverte Emotionnelle",
    description: "Introduction douce aux emotions de base et aux relations interpersonnelles simples.",
    values: ["Partage", "Gentillesse", "Respect des autres", "Amour familial"],
    method: "Histoires courtes avec repetitions rassurantes et personnages attachants."
  },
  {
    age: "6-8 ans",
    approach: "Apprentissage Social",
    description: "Developpement de la conscience sociale et des premieres notions de bien et mal.",
    values: ["Amitie", "Honnetete", "Courage", "Respect de la nature"],
    method: "Aventures avec choix moraux clairs et consequences positives."
  },
  {
    age: "9-12 ans",
    approach: "Reflexion Ethique",
    description: "Exploration de concepts moraux plus complexes et developpement de l'esprit critique.",
    values: ["Justice", "Responsabilite", "Tolerance", "Perseverance"],
    method: "Recits nuances avec dilemmes moraux et reflexions approfondies."
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
      <Helmet>
        <title>Contes Educatifs Personnalises | Valeurs et Developpement Emotionnel Enfant</title>
        <meta name="description" content="Transmettez des valeurs importantes avec nos contes educatifs personnalises : respect, courage, empathie, confiance en soi. Developpement emotionnel optimal de votre enfant." />
        <meta name="keywords" content="conte educatif personnalise, contes educatifs et developpement emotionnel, conte personnalise pour apprendre la confiance en soi, valeurs educatives conte, livre educatif personnalise pour enfant, developpement emotionnel enfant, conte moral personnalise" />
      </Helmet>
      <Header />

      <HeroSection>
        <HeroDecoBlur $size={350} $top="-10%" $left="-5%" $color={theme.colors.accent.coral} $opacity={0.08} />
        <HeroDecoBlur $size={280} $top="60%" $left="85%" $color={theme.colors.accent.pastelBlue} $opacity={0.06} />
        <HeroDecoBlur $size={200} $top="30%" $left="50%" $color={theme.colors.accent.paleYellow} $opacity={0.07} />
        <HeroContent>
          <HeroBadge>Valeurs educatives</HeroBadge>
          <HeroTitle>Valeurs <span>Educatives</span></HeroTitle>
          <HeroDivider />
          <HeroSubtitle>
            Chaque conte est une graine de sagesse plantee dans le coeur de votre enfant.
            Transmettez des valeurs essentielles a travers des histoires personnalisees.
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
              Nos contes personnalises integrent naturellement des valeurs universelles,
              adaptees a chaque age et personnalite. Chaque livre devient un compagnon
              de croissance morale et emotionnelle.
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
              Notre approche pedagogique integre les valeurs de maniere naturelle et engageante,
              sans jamais tomber dans la lecon de morale.
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
            <SectionTitle>Adapte a chaque <span>Age</span></SectionTitle>
            <SectionDivider />
            <SectionSubtitle>
              Les valeurs sont transmises differemment selon l'age de l'enfant,
              pour un impact maximal et une comprehension optimale.
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
              Creez un conte personnalise qui transmettra les valeurs qui vous tiennent a coeur.
              Chaque histoire devient un cadeau precieux pour l'epanouissement de votre enfant.
            </FinalCTAText>
            <WhiteButton onClick={() => navigate('/create-story')}>Creer mon conte</WhiteButton>
          </FinalCTAContent>
        </SectionWrapper>
      </FinalCTASection>

      <Footer />
    </PageContainer>
  );
};

export default ValeursEducativesPage;

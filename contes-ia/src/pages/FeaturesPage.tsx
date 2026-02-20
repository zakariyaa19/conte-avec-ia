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
  StepNumber, FinalCTASection, FinalCTAContent, FinalCTATitle, FinalCTAText, WhiteButton
} from '../styles/DiscoverPageStyles';

const coreFeatures = [
  {
    icon: "\uD83C\uDFA8",
    title: "9 Styles d'Illustration",
    description: "Aquarelle, Animation 3D, Kawaii, Manga japonais, Clay-animation, Papier d\u00E9coup\u00E9, G\u00E9om\u00E9trique, Monde des blocs, Livre illustr\u00E9 classique.",
    tags: ["Aquarelle", "3D", "Kawaii", "Manga"]
  },
  {
    icon: "\uD83C\uDF0D",
    title: "Support Multilingue",
    description: "Cr\u00E9ez des contes en 10 langues : Fran\u00E7ais, Anglais, Espagnol, Arabe, Allemand, Italien, Japonais, Flamand, Portugais, Polonais.",
    tags: ["10 langues", "Multilingue", "International"]
  },
  {
    icon: "\uD83C\uDFAF",
    title: "Th\u00E8mes Personnalisables",
    description: "Choisissez parmi nos th\u00E8mes pr\u00E9d\u00E9finis (\u00C9ducatif, Contes de f\u00E9es, Activit\u00E9s, Histoires, F\u00EAtes, Famille) ou cr\u00E9ez le v\u00F4tre.",
    tags: ["Personnalisable", "\u00C9ducatif", "Famille"]
  },
  {
    icon: "\uD83C\uDF82",
    title: "Occasions Sp\u00E9ciales",
    description: "Contes adapt\u00E9s pour anniversaires, No\u00EBl, P\u00E2ques, A\u00EFd, f\u00EAte des m\u00E8res/p\u00E8res, Saint-Nicolas, Carnaval, Halloween et plus.",
    tags: ["Anniversaire", "No\u00EBl", "F\u00EAtes"]
  }
];

const personalizationFeatures = [
  {
    icon: "\uD83D\uDC67\uD83D\uDC66",
    title: "Personnalisation Compl\u00E8te",
    description: "Nom, \u00E2ge, genre, couleur des yeux et cheveux, hobbies, plat pr\u00E9f\u00E9r\u00E9, \u00E9v\u00E9nements sp\u00E9ciaux.",
    tags: ["Apparence", "Personnalit\u00E9", "D\u00E9tails"]
  },
  {
    icon: "\uD83D\uDE4F",
    title: "Respect des Croyances",
    description: "Option religieuse respectueuse : Chr\u00E9tien, Juif, Musulman, Bouddhiste ou personnalis\u00E9e.",
    tags: ["Religion", "Respect", "Inclusif"]
  },
  {
    icon: "\uD83D\uDC65",
    title: "Personnages Secondaires",
    description: "Ajoutez des amis, famille ou personnages imaginaires avec leurs propres caract\u00E9ristiques.",
    tags: ["Amis", "Famille", "Secondaire"]
  },
  {
    icon: "\u270D\uFE0F",
    title: "Nom d'Auteur",
    description: "Signez votre cr\u00E9ation avec votre nom ou celui de votre enfant pour une fiert\u00E9 cr\u00E9ative.",
    tags: ["Auteur", "Signature", "Fiert\u00E9"]
  }
];

const ageAdaptation = [
  {
    icon: "\uD83D\uDC76",
    title: "0-2 ans",
    description: "Vocabulaire simple, images color\u00E9es, concepts basiques adapt\u00E9s aux tout-petits.",
    features: ["Mots simples", "Images vives", "Courtes histoires"]
  },
  {
    icon: "\uD83E\uDDD2",
    title: "3-5 ans",
    description: "Contes interactifs avec apprentissages ludiques et premi\u00E8res le\u00E7ons de vie.",
    features: ["Interactif", "\u00C9ducatif", "Valeurs"]
  },
  {
    icon: "\uD83D\uDC66",
    title: "6-9 ans",
    description: "Aventures complexes, d\u00E9veloppement de l'imagination et valeurs importantes.",
    features: ["Aventures", "Imagination", "Morale"]
  },
  {
    icon: "\uD83D\uDC67",
    title: "10+ ans",
    description: "Histoires sophistiqu\u00E9es avec d\u00E9fis intellectuels et th\u00E8mes profonds.",
    features: ["Sophistiqu\u00E9", "D\u00E9fis", "Profondeur"]
  }
];

const valueMessages = [
  {
    icon: "\uD83E\uDD1D",
    title: "Amiti\u00E9",
    description: "D\u00E9velopper les liens sociaux et l'empathie \u00E0 travers des histoires qui montrent l'importance de l'amiti\u00E9, de la coop\u00E9ration et du respect mutuel."
  },
  {
    icon: "\uD83D\uDCAA",
    title: "Courage",
    description: "Surmonter les peurs et relever les d\u00E9fis avec des aventures qui encouragent la bravoure, la confiance en soi et la d\u00E9termination face aux obstacles."
  },
  {
    icon: "\uD83C\uDF31",
    title: "\u00C9cologie",
    description: "Prendre soin de la nature et l'environnement en sensibilisant aux enjeux \u00E9cologiques \u00E0 travers des contes qui valorisent la protection de notre plan\u00E8te."
  },
  {
    icon: "\u2764\uFE0F",
    title: "Amour",
    description: "Cultiver l'amour familial et l'affection en explorant les liens familiaux, l'importance des relations et l'expression des sentiments positifs."
  },
  {
    icon: "\uD83C\uDFAF",
    title: "Pers\u00E9v\u00E9rance",
    description: "Ne jamais abandonner ses r\u00EAves avec des histoires inspirantes qui montrent que les efforts et la patience m\u00E8nent au succ\u00E8s et \u00E0 l'accomplissement personnel."
  },
  {
    icon: "\uD83E\uDD32",
    title: "Partage",
    description: "Apprendre la g\u00E9n\u00E9rosit\u00E9 et l'entraide en d\u00E9couvrant la joie de donner, d'aider les autres et de construire une communaut\u00E9 bienveillante."
  }
];

const FeaturesPage: React.FC = () => {
  const navigate = useNavigate();
  const coreReveal = useScrollReveal();
  const coreCardsReveal = useStaggerReveal(coreFeatures.length);
  const personalizationReveal = useScrollReveal();
  const personalizationCardsReveal = useStaggerReveal(personalizationFeatures.length);
  const ageReveal = useScrollReveal();
  const ageCardsReveal = useStaggerReveal(ageAdaptation.length);
  const valuesReveal = useScrollReveal();
  const valuesCardsReveal = useStaggerReveal(valueMessages.length);
  const ctaReveal = useScrollReveal();

  return (
    <PageContainer>
      <Helmet>
        <title>Fonctionnalit\u00E9s Livre Personnalis\u00E9 Enfant | Conte Magique avec IA</title>
        <meta name="description" content="D\u00E9couvrez toutes les fonctionnalit\u00E9s pour cr\u00E9er un livre illustr\u00E9 personnalis\u00E9 : 9 styles d'art, conte magique personnalis\u00E9, support multilingue, adaptation par \u00E2ge et personnalisation compl\u00E8te." />
        <meta name="keywords" content="conte magique personnalis\u00E9, livre illustr\u00E9 personnalis\u00E9, conte pour enfant g\u00E9n\u00E9r\u00E9 par IA, histoire sur mesure pour enfants, cr\u00E9er une histoire pour mon enfant, livre pour b\u00E9b\u00E9 personnalis\u00E9, cadeau personnalis\u00E9 enfant, livre personnalis\u00E9 pr\u00E9nom enfant, conte \u00E9ducatif personnalis\u00E9, histoire avec photo de l'enfant" />
      </Helmet>
      <Header />

      {/* Hero */}
      <HeroSection>
        <HeroDecoBlur $size={350} $top="-10%" $left="-5%" $color={theme.colors.accent.coral} $opacity={0.08} />
        <HeroDecoBlur $size={280} $top="60%" $left="85%" $color={theme.colors.accent.pastelBlue} $opacity={0.06} />
        <HeroDecoBlur $size={200} $top="30%" $left="50%" $color={theme.colors.accent.paleYellow} $opacity={0.07} />
        <HeroContent>
          <HeroBadge>Fonctionnalit\u00E9s</HeroBadge>
          <HeroTitle>Fonctionnalit\u00E9s <span>Avanc\u00E9es</span></HeroTitle>
          <HeroDivider />
          <HeroSubtitle>
            D\u00E9couvrez toutes les possibilit\u00E9s de personnalisation pour cr\u00E9er le conte parfait.
            Notre intelligence artificielle s'adapte \u00E0 chaque enfant avec une pr\u00E9cision remarquable.
          </HeroSubtitle>
        </HeroContent>
      </HeroSection>

      {/* Section 1: Fonctionnalit\u00E9s Principales */}
      <ContentSection ref={coreReveal.ref}>
        <SectionDeco $size={300} $top="-50px" $right="-100px" $color={theme.colors.accent.softPink} />
        <Container>
          <SectionWrapper $visible={coreReveal.isVisible}>
            <SectionTitle>Fonctionnalit\u00E9s <span>Principales</span></SectionTitle>
            <SectionDivider />
            <SectionSubtitle>
              Les outils essentiels pour cr\u00E9er un conte personnalis\u00E9 unique, avec des styles vari\u00E9s,
              un support multilingue et des th\u00E8mes adapt\u00E9s \u00E0 chaque occasion.
            </SectionSubtitle>
          </SectionWrapper>
          <CardsGrid $columns={2} ref={coreCardsReveal.ref}>
            {coreFeatures.map((feature, i) => (
              <FeatureCard key={i} $visible={coreCardsReveal.isVisible} $delay={coreCardsReveal.getDelay(i)}>
                <CardIcon>{feature.icon}</CardIcon>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
                <CardTagsRow>
                  {feature.tags.map((tag, j) => (
                    <CardTag key={j}>{tag}</CardTag>
                  ))}
                </CardTagsRow>
              </FeatureCard>
            ))}
          </CardsGrid>
        </Container>
      </ContentSection>

      {/* Section 2: Personnalisation Avanc\u00E9e ($alt) */}
      <ContentSection $alt ref={personalizationReveal.ref}>
        <SectionDeco $size={250} $top="10%" $left="-80px" $color={theme.colors.accent.paleYellow} />
        <Container>
          <SectionWrapper $visible={personalizationReveal.isVisible}>
            <SectionTitle>Personnalisation <span>Avanc\u00E9e</span></SectionTitle>
            <SectionDivider />
            <SectionSubtitle>
              Chaque d\u00E9tail compte pour rendre le conte de votre enfant vraiment unique.
              Personnalisez l'apparence, les croyances, les personnages et bien plus encore.
            </SectionSubtitle>
          </SectionWrapper>
          <CardsGrid $columns={2} ref={personalizationCardsReveal.ref}>
            {personalizationFeatures.map((feature, i) => (
              <FeatureCard key={i} $visible={personalizationCardsReveal.isVisible} $delay={personalizationCardsReveal.getDelay(i)}>
                <CardIcon>{feature.icon}</CardIcon>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
                <CardTagsRow>
                  {feature.tags.map((tag, j) => (
                    <CardTag key={j}>{tag}</CardTag>
                  ))}
                </CardTagsRow>
              </FeatureCard>
            ))}
          </CardsGrid>
        </Container>
      </ContentSection>

      {/* Section 3: Adaptation par Age */}
      <ContentSection ref={ageReveal.ref}>
        <SectionDeco $size={280} $top="-30px" $right="-120px" $color={theme.colors.accent.coral} />
        <Container>
          <SectionWrapper $visible={ageReveal.isVisible}>
            <SectionTitle>Adaptation par <span>\u00C2ge</span></SectionTitle>
            <SectionDivider />
            <SectionSubtitle>
              Nos contes s'adaptent automatiquement au niveau de lecture et de compr\u00E9hension
              de votre enfant pour une exp\u00E9rience parfaitement adapt\u00E9e.
            </SectionSubtitle>
          </SectionWrapper>
          <CardsGrid $columns={4} ref={ageCardsReveal.ref}>
            {ageAdaptation.map((age, i) => (
              <FeatureCard key={i} $visible={ageCardsReveal.isVisible} $delay={ageCardsReveal.getDelay(i)}>
                <StepNumber>{age.title}</StepNumber>
                <CardTitle>{age.icon} {age.title}</CardTitle>
                <CardDescription>{age.description}</CardDescription>
                <CardTagsRow>
                  {age.features.map((feature, j) => (
                    <CardTag key={j}>{feature}</CardTag>
                  ))}
                </CardTagsRow>
              </FeatureCard>
            ))}
          </CardsGrid>
        </Container>
      </ContentSection>

      {/* Section 4: Messages et Valeurs Educatives ($alt) */}
      <ContentSection $alt ref={valuesReveal.ref}>
        <SectionDeco $size={260} $top="5%" $left="-60px" $color={theme.colors.accent.softPink} />
        <Container>
          <SectionWrapper $visible={valuesReveal.isVisible}>
            <SectionTitle>Messages et Valeurs <span>\u00C9ducatives</span></SectionTitle>
            <SectionDivider />
            <SectionSubtitle>
              Int\u00E9grez des valeurs importantes dans chaque conte pour accompagner
              l'\u00E9panouissement de votre enfant.
            </SectionSubtitle>
          </SectionWrapper>
          <CardsGrid $columns={3} ref={valuesCardsReveal.ref}>
            {valueMessages.map((value, i) => (
              <FeatureCard key={i} $visible={valuesCardsReveal.isVisible} $delay={valuesCardsReveal.getDelay(i)}>
                <CardIcon>{value.icon}</CardIcon>
                <CardTitle>{value.title}</CardTitle>
                <CardDescription>{value.description}</CardDescription>
              </FeatureCard>
            ))}
          </CardsGrid>
        </Container>
      </ContentSection>

      {/* Final CTA */}
      <FinalCTASection ref={ctaReveal.ref}>
        <SectionWrapper $visible={ctaReveal.isVisible}>
          <FinalCTAContent>
            <FinalCTATitle>Pr\u00EAt \u00E0 D\u00E9couvrir Toutes Ces Fonctionnalit\u00E9s ?</FinalCTATitle>
            <FinalCTAText>
              Cr\u00E9ez d\u00E8s maintenant un conte personnalis\u00E9 unique qui utilise toutes ces fonctionnalit\u00E9s
              avanc\u00E9es pour offrir \u00E0 votre enfant une exp\u00E9rience de lecture inoubliable.
            </FinalCTAText>
            <WhiteButton onClick={() => navigate('/create-story')}>Cr\u00E9er mon conte personnalis\u00E9</WhiteButton>
          </FinalCTAContent>
        </SectionWrapper>
      </FinalCTASection>

      <Footer />
    </PageContainer>
  );
};

export { FeaturesPage };

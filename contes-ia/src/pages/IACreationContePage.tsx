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

const aiCapabilities = [
  { title: "Génération Narrative Intelligente", description: "Notre IA analyse les paramètres fournis pour créer une trame narrative cohérente et captivante, adaptée à l'âge et aux préférences de l'enfant.", icon: "📝", technical: "Algorithmes de traitement du langage naturel (NLP) avancés", benefits: ["Cohérence narrative", "Adaptation automatique", "Créativité infinie", "Personnalisation fine"] },
  { title: "Personnalisation Contextuelle", description: "L'intelligence artificielle intègre naturellement les éléments personnels dans l'histoire, créant une expérience immersive unique.", icon: "🎯", technical: "Modèles de deep learning pour l'intégration contextuelle", benefits: ["Intégration naturelle", "Cohérence personnelle", "Réalisme émotionnel", "Identification forte"] },
  { title: "Adaptation Linguistique", description: "Ajustement automatique du vocabulaire, de la complexité syntaxique et du style selon l'âge et le niveau de développement.", icon: "🗣️", technical: "Analyse psycholinguistique et adaptation développementale", benefits: ["Vocabulaire adapté", "Complexité ajustée", "Style approprié", "Progression naturelle"] },
  { title: "Génération d'Illustrations", description: "Création d'images uniques qui complètent parfaitement le récit, dans le style artistique choisi.", icon: "🎨", technical: "IA générative pour création visuelle et cohérence artistique", benefits: ["Illustrations uniques", "Cohérence visuelle", "Style personnalisé", "Qualité professionnelle"] }
];

const creationProcess = [
  { step: 1, title: "Analyse des Paramètres", description: "L'IA examine tous les éléments fournis : âge, préférences, personnalité, thèmes souhaités.", details: ["Profil psychologique de l'enfant", "Préférences thématiques", "Niveau de développement cognitif", "Contexte familial et culturel"], duration: "< 1 seconde" },
  { step: 2, title: "Construction Narrative", description: "Création de la structure du conte avec personnages, intrigue et messages éducatifs intégrés.", details: ["Développement des personnages", "Architecture narrative", "Intégration des valeurs éducatives", "Équilibrage émotionnel"], duration: "2-3 secondes" },
  { step: 3, title: "Rédaction Adaptée", description: "Génération du texte final avec le style, vocabulaire et longueur appropriés à l'enfant.", details: ["Adaptation linguistique", "Optimisation du rythme", "Intégration des dialogues", "Révision automatique"], duration: "3-5 secondes" },
  { step: 4, title: "Création Visuelle", description: "Génération des illustrations personnalisées qui accompagnent et enrichissent l'histoire.", details: ["Analyse des scènes clés", "Génération artistique", "Cohérence stylistique", "Optimisation qualité"], duration: "10-15 secondes" },
  { step: 5, title: "Assemblage Final", description: "Mise en page professionnelle et création du livre personnalisé IA dans le format choisi.", details: ["Mise en page automatique", "Optimisation typographique", "Génération PDF/eBook", "Contrôle qualité final"], duration: "2-3 secondes" }
];

const technicalInnovations = [
  { innovation: "Modèles de Langage Spécialisés", description: "IA entraînée spécifiquement sur la littérature jeunesse pour garantir un contenu approprié et engageant.", impact: "Qualité narrative exceptionnelle adaptée aux enfants" },
  { innovation: "Psychologie Développementale Intégrée", description: "Algorithmes basés sur les recherches en développement cognitif et émotionnel de l'enfant.", impact: "Adaptation précise aux capacités et besoins de chaque âge" },
  { innovation: "Génération Artistique Cohérente", description: "Système d'IA visuelle maintenant la cohérence des personnages et du style à travers tout le livre.", impact: "Expérience visuelle immersive et professionnelle" },
  { innovation: "Apprentissage Continu", description: "L'IA s'améliore constamment grâce aux retours et aux nouvelles créations, affinant sa compréhension.", impact: "Qualité en amélioration permanente et innovation continue" }
];

const IACreationContePage: React.FC = () => {
  const navigate = useNavigate();
  const capabilitiesReveal = useScrollReveal();
  const capabilitiesCardsReveal = useStaggerReveal(aiCapabilities.length);
  const processReveal = useScrollReveal();
  const processCardsReveal = useStaggerReveal(creationProcess.length);
  const innovationsReveal = useScrollReveal();
  const innovationsCardsReveal = useStaggerReveal(technicalInnovations.length);
  const ctaReveal = useScrollReveal();

  return (
    <PageContainer>
      <Helmet>
        <title>IA et Créativité : Créer des Histoires Uniques pour Enfants | Innovation</title>
        <meta name="description" content="Découvrez comment l'IA révolutionne les livres pour enfants. Créer un livre magique avec intelligence artificielle : génération narrative, personnalisation et illustrations uniques." />
        <meta name="keywords" content="IA et créativité, créer des histoires uniques pour enfants, comment l'intelligence artificielle révolutionne les livres pour enfants, créer un livre magique avec intelligence artificielle, personnalisation et imagination chez l'enfant, technologie conte personnalisé" />
      </Helmet>
      <Header />

      <HeroSection>
        <HeroDecoBlur $size={350} $top="-10%" $left="-5%" $color={theme.colors.accent.coral} $opacity={0.08} />
        <HeroDecoBlur $size={280} $top="60%" $left="85%" $color={theme.colors.accent.pastelBlue} $opacity={0.06} />
        <HeroDecoBlur $size={200} $top="30%" $left="50%" $color={theme.colors.accent.paleYellow} $opacity={0.07} />
        <HeroContent>
          <HeroBadge>Notre IA</HeroBadge>
          <HeroTitle>Comment fonctionne <span>l'IA</span> ?</HeroTitle>
          <HeroDivider />
          <HeroSubtitle>
            Découvrez comment notre intelligence artificielle transforme vos idées en contes
            personnalisés magiques, alliant créativité et précision technologique.
          </HeroSubtitle>
        </HeroContent>
      </HeroSection>

      {/* Section 1: AI Capabilities */}
      <ContentSection ref={capabilitiesReveal.ref}>
        <SectionDeco $size={300} $top="-50px" $right="-100px" $color={theme.colors.accent.softPink} />
        <Container>
          <SectionWrapper $visible={capabilitiesReveal.isVisible}>
            <SectionTitle>Les Super-Pouvoirs de Notre <span>IA Créative</span></SectionTitle>
            <SectionDivider />
            <SectionSubtitle>
              Notre intelligence artificielle maîtrise l'art délicat de la création littéraire pour enfants,
              combinant analyse psychologique, créativité narrative et adaptation personnalisée.
            </SectionSubtitle>
          </SectionWrapper>
          <CardsGrid $columns={2} ref={capabilitiesCardsReveal.ref}>
            {aiCapabilities.map((capability, i) => (
              <FeatureCard key={i} $visible={capabilitiesCardsReveal.isVisible} $delay={capabilitiesCardsReveal.getDelay(i)}>
                <CardIcon>{capability.icon}</CardIcon>
                <CardTitle>{capability.title}</CardTitle>
                <CardDescription>{capability.description}</CardDescription>
                <CardTagsRow style={{ marginBottom: '8px' }}>
                  <CardTag $color={theme.colors.accent.pastelBlue}>{capability.technical}</CardTag>
                </CardTagsRow>
                <CardTagsRow>
                  {capability.benefits.map((benefit, j) => (
                    <CardTag key={j}>{benefit}</CardTag>
                  ))}
                </CardTagsRow>
              </FeatureCard>
            ))}
          </CardsGrid>
        </Container>
      </ContentSection>

      {/* Section 2: Creation Process (alt background) */}
      <ContentSection $alt ref={processReveal.ref}>
        <SectionDeco $size={250} $top="10%" $left="-80px" $color={theme.colors.accent.paleYellow} />
        <Container>
          <SectionWrapper $visible={processReveal.isVisible}>
            <SectionTitle>Le Processus de Création en <span>5 Étapes</span></SectionTitle>
            <SectionDivider />
            <SectionSubtitle>
              De votre idée au livre personnalisé final, suivez le parcours fascinant
              de création d'un conte personnalisé en moins de 30 secondes.
            </SectionSubtitle>
          </SectionWrapper>
          <CardsGrid $columns={3} ref={processCardsReveal.ref}>
            {creationProcess.map((process, i) => (
              <FeatureCard key={i} $visible={processCardsReveal.isVisible} $delay={processCardsReveal.getDelay(i)}>
                <StepNumber>{process.step}</StepNumber>
                <CardTitle>{process.title}</CardTitle>
                <CardDescription>{process.description}</CardDescription>
                <CardTagsRow style={{ marginBottom: '8px' }}>
                  <CardTag $color={theme.colors.accent.pastelBlue}>{process.duration}</CardTag>
                </CardTagsRow>
                <CardTagsRow>
                  {process.details.map((detail, j) => (
                    <CardTag key={j}>{detail}</CardTag>
                  ))}
                </CardTagsRow>
              </FeatureCard>
            ))}
          </CardsGrid>
        </Container>
      </ContentSection>

      {/* Section 3: Technical Innovations */}
      <ContentSection ref={innovationsReveal.ref}>
        <SectionDeco $size={280} $top="-30px" $right="-60px" $color={theme.colors.accent.lightGreen} />
        <Container>
          <SectionWrapper $visible={innovationsReveal.isVisible}>
            <SectionTitle>Innovations <span>Technologiques</span></SectionTitle>
            <SectionDivider />
            <SectionSubtitle>
              Notre technologie repose sur les dernières avancées en intelligence artificielle,
              spécialement adaptées à la création de contenus pour enfants.
            </SectionSubtitle>
          </SectionWrapper>
          <CardsGrid $columns={2} ref={innovationsCardsReveal.ref}>
            {technicalInnovations.map((item, i) => (
              <FeatureCard key={i} $visible={innovationsCardsReveal.isVisible} $delay={innovationsCardsReveal.getDelay(i)}>
                <CardTitle>{item.innovation}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
                <CardTagsRow>
                  <CardTag $color={theme.colors.accent.lightGreen}>{item.impact}</CardTag>
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
            <FinalCTATitle>Découvrez la Magie de l'IA en Action</FinalCTATitle>
            <FinalCTAText>
              Prêt à voir notre intelligence artificielle créer un conte personnalisé unique ?
              Lancez le processus et observez la technologie transformer vos idées en histoire magique.
            </FinalCTAText>
            <WhiteButton onClick={() => navigate('/create-story')}>Créer mon conte</WhiteButton>
          </FinalCTAContent>
        </SectionWrapper>
      </FinalCTASection>

      <Footer />
    </PageContainer>
  );
};

export default IACreationContePage;

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
  { title: "Generation Narrative Intelligente", description: "Notre IA analyse les parametres fournis pour creer une trame narrative coherente et captivante, adaptee a l'age et aux preferences de l'enfant.", icon: "📝", technical: "Algorithmes de traitement du langage naturel (NLP) avances", benefits: ["Coherence narrative", "Adaptation automatique", "Creativite infinie", "Personnalisation fine"] },
  { title: "Personnalisation Contextuelle", description: "L'intelligence artificielle integre naturellement les elements personnels dans l'histoire, creant une experience immersive unique.", icon: "🎯", technical: "Modeles de deep learning pour l'integration contextuelle", benefits: ["Integration naturelle", "Coherence personnelle", "Realisme emotionnel", "Identification forte"] },
  { title: "Adaptation Linguistique", description: "Ajustement automatique du vocabulaire, de la complexite syntaxique et du style selon l'age et le niveau de developpement.", icon: "🗣️", technical: "Analyse psycholinguistique et adaptation developpementale", benefits: ["Vocabulaire adapte", "Complexite ajustee", "Style approprie", "Progression naturelle"] },
  { title: "Generation d'Illustrations", description: "Creation d'images uniques qui completent parfaitement le recit, dans le style artistique choisi.", icon: "🎨", technical: "IA generative pour creation visuelle et coherence artistique", benefits: ["Illustrations uniques", "Coherence visuelle", "Style personnalise", "Qualite professionnelle"] }
];

const creationProcess = [
  { step: 1, title: "Analyse des Parametres", description: "L'IA examine tous les elements fournis : age, preferences, personnalite, themes souhaites.", details: ["Profil psychologique de l'enfant", "Preferences thematiques", "Niveau de developpement cognitif", "Contexte familial et culturel"], duration: "< 1 seconde" },
  { step: 2, title: "Construction Narrative", description: "Creation de la structure du conte avec personnages, intrigue et messages educatifs integres.", details: ["Developpement des personnages", "Architecture narrative", "Integration des valeurs educatives", "Equilibrage emotionnel"], duration: "2-3 secondes" },
  { step: 3, title: "Redaction Adaptee", description: "Generation du texte final avec le style, vocabulaire et longueur appropries a l'enfant.", details: ["Adaptation linguistique", "Optimisation du rythme", "Integration des dialogues", "Revision automatique"], duration: "3-5 secondes" },
  { step: 4, title: "Creation Visuelle", description: "Generation des illustrations personnalisees qui accompagnent et enrichissent l'histoire.", details: ["Analyse des scenes cles", "Generation artistique", "Coherence stylistique", "Optimisation qualite"], duration: "10-15 secondes" },
  { step: 5, title: "Assemblage Final", description: "Mise en page professionnelle et creation du livre personnalise IA dans le format choisi.", details: ["Mise en page automatique", "Optimisation typographique", "Generation PDF/eBook", "Controle qualite final"], duration: "2-3 secondes" }
];

const technicalInnovations = [
  { innovation: "Modeles de Langage Specialises", description: "IA entrainee specifiquement sur la litterature jeunesse pour garantir un contenu approprie et engageant.", impact: "Qualite narrative exceptionnelle adaptee aux enfants" },
  { innovation: "Psychologie Developpementale Integree", description: "Algorithmes bases sur les recherches en developpement cognitif et emotionnel de l'enfant.", impact: "Adaptation precise aux capacites et besoins de chaque age" },
  { innovation: "Generation Artistique Coherente", description: "Systeme d'IA visuelle maintenant la coherence des personnages et du style a travers tout le livre.", impact: "Experience visuelle immersive et professionnelle" },
  { innovation: "Apprentissage Continu", description: "L'IA s'ameliore constamment grace aux retours et aux nouvelles creations, affinant sa comprehension.", impact: "Qualite en amelioration permanente et innovation continue" }
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
        <title>IA et Creativite : Creer des Histoires Uniques pour Enfants | Innovation</title>
        <meta name="description" content="Decouvrez comment l'IA revolutionne les livres pour enfants. Creer un livre magique avec intelligence artificielle : generation narrative, personnalisation et illustrations uniques." />
        <meta name="keywords" content="IA et creativite, creer des histoires uniques pour enfants, comment l'intelligence artificielle revolutionne les livres pour enfants, creer un livre magique avec intelligence artificielle, personnalisation et imagination chez l'enfant, technologie conte personnalise" />
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
            Decouvrez comment notre intelligence artificielle transforme vos idees en contes
            personnalises magiques, alliant creativite et precision technologique.
          </HeroSubtitle>
        </HeroContent>
      </HeroSection>

      {/* Section 1: AI Capabilities */}
      <ContentSection ref={capabilitiesReveal.ref}>
        <SectionDeco $size={300} $top="-50px" $right="-100px" $color={theme.colors.accent.softPink} />
        <Container>
          <SectionWrapper $visible={capabilitiesReveal.isVisible}>
            <SectionTitle>Les Super-Pouvoirs de Notre <span>IA Creative</span></SectionTitle>
            <SectionDivider />
            <SectionSubtitle>
              Notre intelligence artificielle maitrise l'art delicat de la creation litteraire pour enfants,
              combinant analyse psychologique, creativite narrative et adaptation personnalisee.
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
            <SectionTitle>Le Processus de Creation en <span>5 Etapes</span></SectionTitle>
            <SectionDivider />
            <SectionSubtitle>
              De votre idee au livre personnalise final, suivez le parcours fascinant
              de creation d'un conte personnalise en moins de 30 secondes.
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
              Notre technologie repose sur les dernieres avancees en intelligence artificielle,
              specialement adaptees a la creation de contenus pour enfants.
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
            <FinalCTATitle>Decouvrez la Magie de l'IA en Action</FinalCTATitle>
            <FinalCTAText>
              Pret a voir notre intelligence artificielle creer un conte personnalise unique ?
              Lancez le processus et observez la technologie transformer vos idees en histoire magique.
            </FinalCTAText>
            <WhiteButton onClick={() => navigate('/create-story')}>Creer mon conte</WhiteButton>
          </FinalCTAContent>
        </SectionWrapper>
      </FinalCTASection>

      <Footer />
    </PageContainer>
  );
};

export default IACreationContePage;

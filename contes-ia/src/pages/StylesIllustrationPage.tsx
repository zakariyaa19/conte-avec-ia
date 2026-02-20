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

const illustrationStyles = [
  { name: "Aquarelle Douce", description: "Des illustrations delicates aux couleurs pastel, parfaites pour les contes apaisants et poetiques. Style ideal pour les tout-petits.", characteristics: ["Couleurs douces", "Traits fluides", "Atmosphere tendre", "Effet apaisant"], ageGroup: "2-6 ans", mood: "Calme et rassurant", image: "🎨", color: "#E6F3FF" },
  { name: "Cartoon Colore", description: "Un style vibrant et joyeux avec des personnages expressifs. Parfait pour captiver l'attention des jeunes lecteurs.", characteristics: ["Couleurs vives", "Personnages expressifs", "Traits marques", "Dynamisme"], ageGroup: "4-8 ans", mood: "Joyeux et energique", image: "🌈", color: "#FFE6CC" },
  { name: "Realisme Fantastique", description: "Des illustrations detaillees qui melangent realisme et magie. Ideal pour les aventures epiques et les mondes imaginaires.", characteristics: ["Details fins", "Realisme magique", "Profondeur", "Immersion"], ageGroup: "6-10 ans", mood: "Aventureux et mysterieux", image: "✨", color: "#F0E6FF" },
  { name: "Style Vintage", description: "Inspire des livres d'antan avec des teintes sepia et des ornements delicats. Pour une atmosphere nostalgique et chaleureuse.", characteristics: ["Teintes sepia", "Ornements classiques", "Elegance retro", "Charme d'antan"], ageGroup: "5-12 ans", mood: "Nostalgique et chaleureux", image: "📚", color: "#FFF0E6" },
  { name: "Minimaliste Moderne", description: "Des illustrations epurees aux lignes nettes. Style contemporain qui met l'accent sur l'essentiel de l'histoire.", characteristics: ["Lignes epurees", "Couleurs selectionnees", "Simplicite elegante", "Focus narratif"], ageGroup: "6-12 ans", mood: "Moderne et sophistique", image: "⚡", color: "#E6FFE6" },
  { name: "Collage Artistique", description: "Un melange creatif de textures et materiaux pour un rendu unique et original. Stimule la creativite artistique.", characteristics: ["Textures variees", "Materiaux mixtes", "Originalite", "Creativite"], ageGroup: "7-12 ans", mood: "Creatif et original", image: "🎭", color: "#FFE6F0" }
];

const customizationOptions = [
  { title: "Palette de Couleurs", description: "Choisissez les couleurs dominantes selon les preferences de votre enfant", icon: "🎨" },
  { title: "Niveau de Detail", description: "Adaptez la complexite visuelle a l'age et aux gouts de votre enfant", icon: "🔍" },
  { title: "Ambiance Generale", description: "Definissez l'atmosphere : douce, aventureuse, mysterieuse ou joyeuse", icon: "🌟" },
  { title: "Personnages Uniques", description: "Creez des personnages qui ressemblent a votre enfant ou a ses heros preferes", icon: "👤" }
];

const StylesIllustrationPage: React.FC = () => {
  const navigate = useNavigate();
  const stylesReveal = useScrollReveal();
  const stylesCardsReveal = useStaggerReveal(illustrationStyles.length);
  const customReveal = useScrollReveal();
  const customCardsReveal = useStaggerReveal(customizationOptions.length);
  const ctaReveal = useScrollReveal();

  return (
    <PageContainer>
      <Helmet>
        <title>Styles d'Illustration Livre Personnalise | Conte Illustre sur Mesure</title>
        <meta name="description" content="Choisissez le style parfait pour votre livre illustre personnalise : aquarelle douce, cartoon colore, realisme fantastique, vintage. Conte illustre sur mesure pour votre enfant." />
        <meta name="keywords" content="livre illustre personnalise, conte illustre sur mesure, styles illustration livre enfant, livre personnalise aquarelle, conte cartoon personnalise, illustration sur mesure enfant, livre artistique personnalise" />
      </Helmet>
      <Header />

      <HeroSection>
        <HeroDecoBlur $size={350} $top="-10%" $left="-5%" $color={theme.colors.accent.coral} $opacity={0.08} />
        <HeroDecoBlur $size={280} $top="60%" $left="85%" $color={theme.colors.accent.pastelBlue} $opacity={0.06} />
        <HeroDecoBlur $size={200} $top="30%" $left="50%" $color={theme.colors.accent.paleYellow} $opacity={0.07} />
        <HeroContent>
          <HeroBadge>Styles</HeroBadge>
          <HeroTitle>Styles d'<span>Illustration</span></HeroTitle>
          <HeroDivider />
          <HeroSubtitle>
            Chaque conte illustre merite un style visuel unique. Decouvrez notre palette artistique
            pour creer un livre personnalise qui emerveillera votre enfant par sa beaute visuelle.
          </HeroSubtitle>
        </HeroContent>
      </HeroSection>

      {/* Section 1: Illustration Styles Grid */}
      <ContentSection ref={stylesReveal.ref}>
        <SectionDeco $size={300} $top="-50px" $right="-100px" $color={theme.colors.accent.softPink} />
        <Container>
          <SectionWrapper $visible={stylesReveal.isVisible}>
            <SectionTitle>Notre Galerie de Styles <span>Artistiques</span></SectionTitle>
            <SectionDivider />
            <SectionSubtitle>
              Notre intelligence artificielle maitrise une variete de styles d'illustration pour s'adapter
              parfaitement a l'age, aux gouts et a la personnalite de votre enfant.
            </SectionSubtitle>
          </SectionWrapper>
          <CardsGrid ref={stylesCardsReveal.ref}>
            {illustrationStyles.map((style, i) => (
              <FeatureCard key={i} $visible={stylesCardsReveal.isVisible} $delay={stylesCardsReveal.getDelay(i)} $accentColor={style.color}>
                <CardIcon>{style.image}</CardIcon>
                <CardTitle>{style.name}</CardTitle>
                <CardDescription>{style.description}</CardDescription>
                <CardTagsRow style={{ marginBottom: '8px' }}>
                  <CardTag $color={theme.colors.accent.pastelBlue}>{style.mood}</CardTag>
                  <CardTag $color={theme.colors.accent.lightGreen}>{style.ageGroup}</CardTag>
                </CardTagsRow>
                <CardTagsRow>
                  {style.characteristics.map((char, j) => (
                    <CardTag key={j}>{char}</CardTag>
                  ))}
                </CardTagsRow>
              </FeatureCard>
            ))}
          </CardsGrid>
        </Container>
      </ContentSection>

      {/* Section 2: Customization Options (alt background) */}
      <ContentSection $alt ref={customReveal.ref}>
        <SectionDeco $size={250} $top="10%" $left="-80px" $color={theme.colors.accent.paleYellow} />
        <Container>
          <SectionWrapper $visible={customReveal.isVisible}>
            <SectionTitle>Personnalisation de Vos <span>Illustrations</span></SectionTitle>
            <SectionDivider />
            <SectionSubtitle>
              Au-dela du style, personnalisez chaque aspect visuel de votre conte
              pour creer une experience de lecture visuellement unique et captivante.
            </SectionSubtitle>
          </SectionWrapper>
          <CardsGrid $columns={4} ref={customCardsReveal.ref}>
            {customizationOptions.map((option, i) => (
              <FeatureCard key={i} $visible={customCardsReveal.isVisible} $delay={customCardsReveal.getDelay(i)}>
                <CardIcon>{option.icon}</CardIcon>
                <CardTitle>{option.title}</CardTitle>
                <CardDescription>{option.description}</CardDescription>
              </FeatureCard>
            ))}
          </CardsGrid>
        </Container>
      </ContentSection>

      {/* Final CTA */}
      <FinalCTASection ref={ctaReveal.ref}>
        <SectionWrapper $visible={ctaReveal.isVisible}>
          <FinalCTAContent>
            <FinalCTATitle>Creez Votre Conte Illustre Unique</FinalCTATitle>
            <FinalCTAText>
              Transformez votre histoire en oeuvre d'art visuelle. Notre IA va creer des illustrations
              personnalisees qui donneront vie a votre conte de la plus belle maniere.
            </FinalCTAText>
            <WhiteButton onClick={() => navigate('/create-story')}>Creer mon conte</WhiteButton>
          </FinalCTAContent>
        </SectionWrapper>
      </FinalCTASection>

      <Footer />
    </PageContainer>
  );
};

export default StylesIllustrationPage;

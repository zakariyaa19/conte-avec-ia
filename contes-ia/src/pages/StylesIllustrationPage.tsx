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

const illustrationStyles = [
  { name: "Aquarelle Douce", description: "Des illustrations délicates aux couleurs pastel, parfaites pour les contes apaisants et poétiques. Style idéal pour les tout-petits.", characteristics: ["Couleurs douces", "Traits fluides", "Atmosphère tendre", "Effet apaisant"], ageGroup: "2-6 ans", mood: "Calme et rassurant", image: "🎨", color: "#E6F3FF" },
  { name: "Cartoon Coloré", description: "Un style vibrant et joyeux avec des personnages expressifs. Parfait pour captiver l'attention des jeunes lecteurs.", characteristics: ["Couleurs vives", "Personnages expressifs", "Traits marqués", "Dynamisme"], ageGroup: "4-8 ans", mood: "Joyeux et énergique", image: "🌈", color: "#FFE6CC" },
  { name: "Réalisme Fantastique", description: "Des illustrations détaillées qui mélangent réalisme et magie. Idéal pour les aventures épiques et les mondes imaginaires.", characteristics: ["Détails fins", "Réalisme magique", "Profondeur", "Immersion"], ageGroup: "6-10 ans", mood: "Aventureux et mystérieux", image: "✨", color: "#F0E6FF" },
  { name: "Style Vintage", description: "Inspiré des livres d'antan avec des teintes sépia et des ornements délicats. Pour une atmosphère nostalgique et chaleureuse.", characteristics: ["Teintes sépia", "Ornements classiques", "Élégance rétro", "Charme d'antan"], ageGroup: "5-12 ans", mood: "Nostalgique et chaleureux", image: "📚", color: "#FFF0E6" },
  { name: "Minimaliste Moderne", description: "Des illustrations épurées aux lignes nettes. Style contemporain qui met l'accent sur l'essentiel de l'histoire.", characteristics: ["Lignes épurées", "Couleurs sélectionnées", "Simplicité élégante", "Focus narratif"], ageGroup: "6-12 ans", mood: "Moderne et sophistiqué", image: "⚡", color: "#E6FFE6" },
  { name: "Collage Artistique", description: "Un mélange créatif de textures et matériaux pour un rendu unique et original. Stimule la créativité artistique.", characteristics: ["Textures variées", "Matériaux mixtes", "Originalité", "Créativité"], ageGroup: "7-12 ans", mood: "Créatif et original", image: "🎭", color: "#FFE6F0" }
];

const customizationOptions = [
  { title: "Palette de Couleurs", description: "Choisissez les couleurs dominantes selon les préférences de votre enfant", icon: "🎨" },
  { title: "Niveau de Détail", description: "Adaptez la complexité visuelle à l'âge et aux goûts de votre enfant", icon: "🔍" },
  { title: "Ambiance Générale", description: "Définissez l'atmosphère : douce, aventureuse, mystérieuse ou joyeuse", icon: "🌟" },
  { title: "Personnages Uniques", description: "Créez des personnages qui ressemblent à votre enfant ou à ses héros préférés", icon: "👤" }
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
      <SEOHead
        title="Styles d'Illustration Livre Personnalisé | Conte Illustré sur Mesure"
        description="Choisissez le style parfait pour votre livre illustré personnalisé : aquarelle douce, cartoon coloré, réalisme fantastique, vintage. Conte illustré sur mesure pour votre enfant."
      />
      <Helmet>
        <title>Styles d'Illustration Livre Personnalisé | Conte Illustré sur Mesure</title>
        <meta name="description" content="Choisissez le style parfait pour votre livre illustré personnalisé : aquarelle douce, cartoon coloré, réalisme fantastique, vintage. Conte illustré sur mesure pour votre enfant." />
        <meta name="keywords" content="livre illustré personnalisé, conte illustré sur mesure, styles illustration livre enfant, livre personnalisé aquarelle, conte cartoon personnalisé, illustration sur mesure enfant, livre artistique personnalisé" />
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
            Chaque conte illustré mérite un style visuel unique. Découvrez notre palette artistique
            pour créer un livre personnalisé qui émerveillera votre enfant par sa beauté visuelle.
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
              Notre intelligence artificielle maîtrise une variété de styles d'illustration pour s'adapter
              parfaitement à l'âge, aux goûts et à la personnalité de votre enfant.
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
              Au-delà du style, personnalisez chaque aspect visuel de votre conte
              pour créer une expérience de lecture visuellement unique et captivante.
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
            <FinalCTATitle>Créez Votre Conte Illustré Unique</FinalCTATitle>
            <FinalCTAText>
              Transformez votre histoire en œuvre d'art visuelle. Notre IA va créer des illustrations
              personnalisées qui donneront vie à votre conte de la plus belle manière.
            </FinalCTAText>
            <WhiteButton onClick={() => navigate('/create-story')}>Créer mon conte</WhiteButton>
          </FinalCTAContent>
        </SectionWrapper>
      </FinalCTASection>

      <Footer />
    </PageContainer>
  );
};

export default StylesIllustrationPage;

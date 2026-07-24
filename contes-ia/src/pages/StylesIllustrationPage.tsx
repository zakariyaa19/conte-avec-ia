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
  FinalCTASection, FinalCTAContent, FinalCTATitle, FinalCTAText, WhiteButton
} from '../styles/DiscoverPageStyles';

// Les 9 styles reellement selectionnables lors de la creation d'un livre
// (voir ILLUSTRATION_STYLES dans types/FormTypes.ts) — avant, cette page
// decrivait 6 styles inventes ("Style Vintage", "Minimaliste Moderne",
// "Collage Artistique"...) qu'un parent ne retrouvait jamais dans le vrai
// formulaire de creation.
const illustrationStyles = [
  { name: "Aquarelle", description: "Des illustrations délicates aux couleurs pastel, à la texture peinte à la main. Un style doux et poétique, parfait pour les contes apaisants.", characteristics: ["Couleurs douces", "Traits fluides", "Atmosphère tendre", "Effet apaisant"], ageGroup: "Tous âges", mood: "Calme et rassurant", image: "🎨", color: "#E6F3FF" },
  { name: "Animation 3D", description: "Un rendu chaleureux et expressif, inspiré des grands studios d'animation. Personnages attachants aux couleurs vives.", characteristics: ["Couleurs vives", "Personnages expressifs", "Rendu lumineux", "Dynamisme"], ageGroup: "Tous âges", mood: "Joyeux et énergique", image: "🎬", color: "#FFE6CC" },
  { name: "Monde des blocs", description: "Un univers construit en blocs et en pixels, pour les enfants qui vivent et respirent les jeux de construction.", characteristics: ["Style voxel", "Univers cubique", "Couleurs franches", "Esprit jeu vidéo"], ageGroup: "6-12 ans", mood: "Ludique et créatif", image: "🧱", color: "#E6FFE6" },
  { name: "Papier découpé", description: "Un rendu en couches de papier découpé, textures et ombres douces. Un style artisanal et chaleureux, unique en son genre.", characteristics: ["Textures papier", "Effet de couches", "Ombres douces", "Fait main"], ageGroup: "Tous âges", mood: "Créatif et original", image: "✂️", color: "#FFE6F0" },
  { name: "Clay-animation", description: "Des personnages modelés comme en pâte à modeler, à la manière des films en volume. Un rendu tactile et attachant.", characteristics: ["Texture modelée", "Volumes ronds", "Ombres douces", "Esprit stop-motion"], ageGroup: "4-10 ans", mood: "Attachant et original", image: "🏺", color: "#FFF0E6" },
  { name: "Kawaii", description: "Des personnages tout ronds, des grands yeux et une palette pastel. Le style \"mignon\" par excellence, adoré des plus jeunes.", characteristics: ["Personnages ronds", "Grands yeux", "Palette pastel", "Ultra mignon"], ageGroup: "2-8 ans", mood: "Doux et mignon", image: "🥰", color: "#FFE6F7" },
  { name: "Géométrique", description: "Des formes simples et des couleurs sélectionnées, pour un rendu épuré et contemporain qui met l'histoire en avant.", characteristics: ["Lignes épurées", "Formes simples", "Couleurs sélectionnées", "Focus narratif"], ageGroup: "6-12 ans", mood: "Moderne et sophistiqué", image: "🔷", color: "#E6E6FF" },
  { name: "Livre illustré", description: "Le style intemporel des livres jeunesse classiques : traits soignés, couleurs riches, mise en page équilibrée.", characteristics: ["Traits soignés", "Couleurs riches", "Style intemporel", "Mise en page classique"], ageGroup: "Tous âges", mood: "Classique et chaleureux", image: "📚", color: "#FFF5E6" },
  { name: "Dessin japonais / manga", description: "Un style inspiré des animes et mangas japonais : grands yeux expressifs, dynamisme et énergie à chaque page.", characteristics: ["Grands yeux expressifs", "Dynamisme", "Trait fin", "Esthétique anime"], ageGroup: "6-12 ans", mood: "Aventureux et énergique", image: "🎌", color: "#F0E6FF" }
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
      <SchemaBreadcrumb items={[
        { name: 'Accueil', url: 'https://contedia.fr/' },
        { name: 'Styles d\'illustration', url: 'https://contedia.fr/styles-illustration' },
      ]} />
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

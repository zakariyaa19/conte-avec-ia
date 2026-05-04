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

const themes = [
  { title: "Aventures et Explorations", description: "Des contes personnalisés qui emmènent votre enfant dans des voyages extraordinaires à travers des mondes fantastiques.", icon: "🗺️", keywords: ["aventure", "exploration", "voyage", "découverte"] },
  { title: "Animaux et Nature", description: "Des histoires touchantes avec des animaux attachants qui enseignent le respect de la nature et de l'environnement.", icon: "🦊", keywords: ["animaux", "nature", "forêt", "écologie"] },
  { title: "Magie et Féerie", description: "L'univers enchanté des fées, sorciers et créatures magiques pour stimuler l'imagination de votre enfant.", icon: "✨", keywords: ["magie", "fées", "sorciers", "enchantement"] },
  { title: "Héros et Courage", description: "Des récits inspirants où votre enfant devient le héros de sa propre histoire, développant confiance et bravoure.", icon: "🦸", keywords: ["héros", "courage", "bravoure", "confiance"] },
  { title: "Amitié et Partage", description: "Des contes émouvants sur l'importance de l'amitié, de l'entraide et des valeurs humaines essentielles.", icon: "🤝", keywords: ["amitié", "partage", "entraide", "solidarité"] },
  { title: "Sciences et Découvertes", description: "L'apprentissage devient magique avec des histoires qui éveillent la curiosité scientifique de votre enfant.", icon: "🔬", keywords: ["science", "découverte", "apprentissage", "curiosité"] }
];

const educationalBenefits = [
  { title: "Développement Cognitif", description: "Chaque conte éducatif stimule la réflexion, la logique et la résolution de problèmes.", icon: "🧠" },
  { title: "Imagination Créative", description: "Nos thèmes variés nourrissent la créativité et l'expression artistique de votre enfant.", icon: "💭" },
  { title: "Intelligence Émotionnelle", description: "Les histoires développent l'empathie, la gestion des émotions et les compétences sociales.", icon: "❤️" },
  { title: "Ouverture au Monde", description: "Découverte de cultures, de valeurs et de perspectives enrichissantes pour grandir.", icon: "🌍" }
];

const ThemesContesPage: React.FC = () => {
  const navigate = useNavigate();
  const themesReveal = useScrollReveal();
  const themesCardsReveal = useStaggerReveal(themes.length);
  const benefitsReveal = useScrollReveal();
  const benefitsCardsReveal = useStaggerReveal(educationalBenefits.length);
  const ctaReveal = useScrollReveal();

  return (
    <PageContainer>
      <SEOHead
        title="Thèmes de Contes Personnalisés pour Enfants | Livre sur Mesure avec IA"
        description="Choisissez parmi nos thèmes de contes personnalisés : aventure, magie, animaux, héros, amitié. Créez un livre enfant sur mesure adapté aux goûts de votre petit avec notre IA."
      />      <Header />

      <HeroSection>
        <HeroDecoBlur $size={350} $top="-10%" $left="-5%" $color={theme.colors.accent.coral} $opacity={0.08} />
        <HeroDecoBlur $size={280} $top="60%" $left="85%" $color={theme.colors.accent.pastelBlue} $opacity={0.06} />
        <HeroDecoBlur $size={200} $top="30%" $left="50%" $color={theme.colors.accent.paleYellow} $opacity={0.07} />
        <HeroContent>
          <HeroBadge>Thèmes</HeroBadge>
          <HeroTitle>Thèmes de <span>Contes</span></HeroTitle>
          <HeroDivider />
          <HeroSubtitle>
            Chaque enfant mérite une histoire unique qui lui ressemble. Découvrez notre collection
            de thèmes magiques pour créer un conte personnalisé qui éveillera son imagination.
          </HeroSubtitle>
        </HeroContent>
      </HeroSection>

      {/* Section 1: Themes Grid */}
      <ContentSection ref={themesReveal.ref}>
        <SectionDeco $size={300} $top="-50px" $right="-100px" $color={theme.colors.accent.softPink} />
        <Container>
          <SectionWrapper $visible={themesReveal.isVisible}>
            <SectionTitle>Explorez Nos Univers <span>Enchantés</span></SectionTitle>
            <SectionDivider />
            <SectionSubtitle>
              Nos thèmes de contes sont soigneusement conçus pour offrir à votre enfant une expérience
              de lecture inoubliable. Chaque livre personnalisé s'adapte à ses goûts et à sa personnalité.
            </SectionSubtitle>
          </SectionWrapper>
          <CardsGrid ref={themesCardsReveal.ref}>
            {themes.map((item, i) => (
              <FeatureCard key={i} $visible={themesCardsReveal.isVisible} $delay={themesCardsReveal.getDelay(i)}>
                <CardIcon>{item.icon}</CardIcon>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
                <CardTagsRow>
                  {item.keywords.map((keyword, j) => (
                    <CardTag key={j}>{keyword}</CardTag>
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
            <SectionTitle>Les Bienfaits <span>Éducatifs</span> de Nos Thèmes</SectionTitle>
            <SectionDivider />
            <SectionSubtitle>
              Chaque thème est conçu pour stimuler le développement de votre enfant
              tout en lui offrant des moments de lecture captivants et enrichissants.
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

      {/* Final CTA */}
      <FinalCTASection ref={ctaReveal.ref}>
        <SectionWrapper $visible={ctaReveal.isVisible}>
          <FinalCTAContent>
            <FinalCTATitle>Prêt à Créer le Conte Parfait ?</FinalCTATitle>
            <FinalCTAText>
              Transformez l'un de ces thèmes magiques en une histoire unique pour votre enfant.
              Notre IA créera un conte illustré personnalisé qui deviendra son nouveau livre préféré.
            </FinalCTAText>
            <WhiteButton onClick={() => navigate('/create-story')}>Créer mon conte</WhiteButton>
          </FinalCTAContent>
        </SectionWrapper>
      </FinalCTASection>

      <Footer />
    </PageContainer>
  );
};

export default ThemesContesPage;

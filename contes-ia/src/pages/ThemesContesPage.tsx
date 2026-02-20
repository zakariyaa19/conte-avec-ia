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

const themes = [
  { title: "Aventures et Explorations", description: "Des contes personnalises qui emmenent votre enfant dans des voyages extraordinaires a travers des mondes fantastiques.", icon: "🗺️", keywords: ["aventure", "exploration", "voyage", "decouverte"] },
  { title: "Animaux et Nature", description: "Des histoires touchantes avec des animaux attachants qui enseignent le respect de la nature et de l'environnement.", icon: "🦊", keywords: ["animaux", "nature", "foret", "ecologie"] },
  { title: "Magie et Feerie", description: "L'univers enchante des fees, sorciers et creatures magiques pour stimuler l'imagination de votre enfant.", icon: "✨", keywords: ["magie", "fees", "sorciers", "enchantement"] },
  { title: "Heros et Courage", description: "Des recits inspirants ou votre enfant devient le heros de sa propre histoire, developpant confiance et bravoure.", icon: "🦸", keywords: ["heros", "courage", "bravoure", "confiance"] },
  { title: "Amitie et Partage", description: "Des contes emouvants sur l'importance de l'amitie, de l'entraide et des valeurs humaines essentielles.", icon: "🤝", keywords: ["amitie", "partage", "entraide", "solidarite"] },
  { title: "Sciences et Decouvertes", description: "L'apprentissage devient magique avec des histoires qui eveillent la curiosite scientifique de votre enfant.", icon: "🔬", keywords: ["science", "decouverte", "apprentissage", "curiosite"] }
];

const educationalBenefits = [
  { title: "Developpement Cognitif", description: "Chaque conte educatif stimule la reflexion, la logique et la resolution de problemes.", icon: "🧠" },
  { title: "Imagination Creative", description: "Nos themes varies nourrissent la creativite et l'expression artistique de votre enfant.", icon: "💭" },
  { title: "Intelligence Emotionnelle", description: "Les histoires developpent l'empathie, la gestion des emotions et les competences sociales.", icon: "❤️" },
  { title: "Ouverture au Monde", description: "Decouverte de cultures, de valeurs et de perspectives enrichissantes pour grandir.", icon: "🌍" }
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
      <Helmet>
        <title>Themes de Contes Personnalises pour Enfants | Livre sur Mesure avec IA</title>
        <meta name="description" content="Choisissez parmi nos themes de contes personnalises : aventure, magie, animaux, heros, amitie. Creez un livre enfant sur mesure adapte aux gouts de votre petit avec notre IA." />
        <meta name="keywords" content="themes contes personnalises, livre enfant sur mesure, conte magique personnalise, histoire personnalisee aventure, conte personnalise animaux, livre personnalise heros, theme conte enfant, choix theme livre personnalise" />
      </Helmet>
      <Header />

      <HeroSection>
        <HeroDecoBlur $size={350} $top="-10%" $left="-5%" $color={theme.colors.accent.coral} $opacity={0.08} />
        <HeroDecoBlur $size={280} $top="60%" $left="85%" $color={theme.colors.accent.pastelBlue} $opacity={0.06} />
        <HeroDecoBlur $size={200} $top="30%" $left="50%" $color={theme.colors.accent.paleYellow} $opacity={0.07} />
        <HeroContent>
          <HeroBadge>Themes</HeroBadge>
          <HeroTitle>Themes de <span>Contes</span></HeroTitle>
          <HeroDivider />
          <HeroSubtitle>
            Chaque enfant merite une histoire unique qui lui ressemble. Decouvrez notre collection
            de themes magiques pour creer un conte personnalise qui eveillera son imagination.
          </HeroSubtitle>
        </HeroContent>
      </HeroSection>

      {/* Section 1: Themes Grid */}
      <ContentSection ref={themesReveal.ref}>
        <SectionDeco $size={300} $top="-50px" $right="-100px" $color={theme.colors.accent.softPink} />
        <Container>
          <SectionWrapper $visible={themesReveal.isVisible}>
            <SectionTitle>Explorez Nos Univers <span>Enchantes</span></SectionTitle>
            <SectionDivider />
            <SectionSubtitle>
              Nos themes de contes sont soigneusement concus pour offrir a votre enfant une experience
              de lecture inoubliable. Chaque livre personnalise s'adapte a ses gouts et a sa personnalite.
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
            <SectionTitle>Les Bienfaits <span>Educatifs</span> de Nos Themes</SectionTitle>
            <SectionDivider />
            <SectionSubtitle>
              Chaque theme est concu pour stimuler le developpement de votre enfant
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
            <FinalCTATitle>Pret a Creer le Conte Parfait ?</FinalCTATitle>
            <FinalCTAText>
              Transformez l'un de ces themes magiques en une histoire unique pour votre enfant.
              Notre IA creera un conte illustre personnalise qui deviendra son nouveau livre prefere.
            </FinalCTAText>
            <WhiteButton onClick={() => navigate('/create-story')}>Creer mon conte</WhiteButton>
          </FinalCTAContent>
        </SectionWrapper>
      </FinalCTASection>

      <Footer />
    </PageContainer>
  );
};

export default ThemesContesPage;

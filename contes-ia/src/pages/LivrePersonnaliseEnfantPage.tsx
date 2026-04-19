import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { SEOHead } from '../components/SEOHead';
import { SchemaFAQ, SchemaBreadcrumb } from '../components/SchemaMarkup';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { theme } from '../styles/theme';
import { Button } from '../components/ui/Button';

// ═══════════════════════════════════════════
// ANIMATIONS
// ═══════════════════════════════════════════

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(-2deg); }
  50% { transform: translateY(-12px) rotate(1deg); }
`;

const floatAlt = keyframes`
  0%, 100% { transform: translateY(0) rotate(2deg); }
  50% { transform: translateY(-10px) rotate(-1deg); }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

// ═══════════════════════════════════════════
// PAGE CONTAINER
// ═══════════════════════════════════════════

const Page = styled.div`
  min-height: 100vh;
  background: var(--bg-primary);
  overflow-x: hidden;
`;

// ═══════════════════════════════════════════
// HERO — Immersif, visuel, mobile-first
// ═══════════════════════════════════════════

const Hero = styled.section`
  position: relative;
  padding: 120px 20px 60px;
  background: linear-gradient(165deg, #1a0a2e 0%, #16213e 40%, #0f3460 100%);
  overflow: hidden;
  min-height: 85vh;
  display: flex;
  align-items: center;
  @media (max-width: 768px) {
    padding: 100px 16px 40px;
    min-height: auto;
  }
`;

const HeroGlow = styled.div<{ $x: string; $y: string; $color: string; $size: number }>`
  position: absolute;
  width: ${p => p.$size}px;
  height: ${p => p.$size}px;
  background: ${p => p.$color};
  border-radius: 50%;
  filter: blur(${p => p.$size * 0.6}px);
  opacity: 0.15;
  top: ${p => p.$y};
  left: ${p => p.$x};
  pointer-events: none;
`;

const HeroInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 32px;
    text-align: center;
  }
`;

const HeroText = styled.div`
  animation: ${fadeInUp} 0.8s ease both;
  z-index: 1;
`;

const HeroBadge = styled.span`
  display: inline-block;
  padding: 6px 16px;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 50px;
  color: #a5b4fc;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 20px;
`;

const HeroH1 = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: clamp(2rem, 5vw, 3.2rem);
  font-weight: 800;
  color: white;
  line-height: 1.15;
  margin: 0 0 16px;
  span { color: ${theme.colors.accent.coral}; }
`;

const HeroSub = styled.p`
  font-size: clamp(0.95rem, 2vw, 1.15rem);
  color: rgba(255,255,255,0.75);
  line-height: 1.7;
  margin: 0 0 28px;
  max-width: 520px;
  @media (max-width: 768px) { max-width: 100%; }
`;

const HeroCTA = styled.button`
  padding: 16px 36px;
  background: linear-gradient(135deg, ${theme.colors.accent.coral}, #FF7F7F);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(255,107,107,0.35);
  &:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(255,107,107,0.45); }
  @media (max-width: 768px) { width: 100%; }
`;

const HeroTrust = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
  font-size: 13px;
  color: rgba(255,255,255,0.5);
  @media (max-width: 768px) { justify-content: center; flex-wrap: wrap; gap: 12px; }
`;

const HeroVisual = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  animation: ${fadeInUp} 1s ease 0.2s both;
  @media (max-width: 768px) { margin-top: 12px; }
`;

const BookCover = styled.img<{ $float?: boolean }>`
  width: 200px;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05);
  animation: ${p => p.$float ? float : floatAlt} 6s ease-in-out infinite;
  @media (max-width: 768px) { width: 150px; }
`;

// ═══════════════════════════════════════════
// SECTION GÉNÉRIQUE
// ═══════════════════════════════════════════

const Section = styled.section<{ $alt?: boolean; $dark?: boolean }>`
  padding: 80px 20px;
  background: ${p => p.$dark ? 'linear-gradient(165deg, #1a0a2e, #16213e)' : p.$alt ? 'var(--bg-secondary)' : 'var(--bg-primary)'};
  ${p => p.$dark && 'color: white;'}
  @media (max-width: 768px) { padding: 48px 16px; }
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const SectionHeader = styled.div<{ $visible?: boolean }>`
  text-align: center;
  margin-bottom: 48px;
  opacity: ${p => p.$visible !== false ? 1 : 0};
  transform: ${p => p.$visible !== false ? 'none' : 'translateY(20px)'};
  transition: all 0.6s ease;
`;

const SectionTag = styled.span`
  display: inline-block;
  padding: 4px 14px;
  background: ${theme.colors.accent.coral}15;
  color: ${theme.colors.accent.coral};
  border-radius: 50px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 12px;
`;

const SectionTitle = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: clamp(1.6rem, 3.5vw, 2.4rem);
  font-weight: 800;
  color: var(--text-primary);
  margin: 0 0 12px;
  line-height: 1.2;
  span { color: ${theme.colors.accent.coral}; }
`;

const SectionSub = styled.p`
  font-size: clamp(0.9rem, 1.5vw, 1.05rem);
  color: var(--text-secondary);
  max-width: 640px;
  margin: 0 auto;
  line-height: 1.7;
`;

// ═══════════════════════════════════════════
// BÉNÉFICES — Grille visuelle avec images
// ═══════════════════════════════════════════

const BenefitGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`;

const BenefitCard = styled.div<{ $delay: number }>`
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 28px;
  transition: all 0.3s ease;
  animation: ${fadeInUp} 0.6s ease ${p => p.$delay * 0.1}s both;
  &:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.08); }
`;

const BenefitIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: ${theme.colors.accent.coral}12;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 800;
  color: ${theme.colors.accent.coral};
  margin-bottom: 16px;
`;

const BenefitTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 8px;
`;

const BenefitDesc = styled.p`
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
`;

// ═══════════════════════════════════════════
// SHOWCASE — Carrousel de couvertures
// ═══════════════════════════════════════════

const ShowcaseScroll = styled.div`
  display: flex;
  gap: 20px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding: 20px 0 24px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;

const ShowcaseItem = styled.div`
  scroll-snap-align: center;
  flex-shrink: 0;
  width: 240px;
  @media (max-width: 640px) { width: 180px; }
`;

const ShowcaseImg = styled.img`
  width: 100%;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
  transition: transform 0.3s ease;
  &:hover { transform: scale(1.03); }
`;

const ShowcaseLabel = styled.p`
  text-align: center;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin: 10px 0 0;
`;

// ═══════════════════════════════════════════
// ÂGE — Cards visuelles avec images
// ═══════════════════════════════════════════

const AgeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const AgeCard = styled.div`
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.3s ease;
  &:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.08); }
`;

const AgeImg = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  @media (max-width: 768px) { height: 160px; }
`;

const AgeBody = styled.div`
  padding: 20px;
`;

const AgeBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  background: ${theme.colors.accent.coral}15;
  color: ${theme.colors.accent.coral};
  border-radius: 50px;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const AgeTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 8px;
`;

const AgeDesc = styled.p`
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0 0 12px;
`;

const AgeTagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const AgeTag = styled.span`
  padding: 3px 10px;
  background: var(--bg-secondary);
  border-radius: 50px;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary);
`;

// ═══════════════════════════════════════════
// TÉMOIGNAGES
// ═══════════════════════════════════════════

const TestimonialGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const TestimonialCard = styled.div`
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 28px;
`;

const Stars = styled.div`
  color: #FFD700;
  font-size: 16px;
  margin-bottom: 12px;
  letter-spacing: 2px;
`;

const TestimonialText = styled.p`
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.7;
  font-style: italic;
  margin: 0 0 16px;
`;

const TestimonialAuthor = styled.p`
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
`;

// ═══════════════════════════════════════════
// CTA BANDEAU
// ═══════════════════════════════════════════

const CTABand = styled.section`
  padding: 60px 20px;
  background: linear-gradient(135deg, ${theme.colors.accent.coral}, #FF7F7F);
  text-align: center;
  @media (max-width: 768px) { padding: 40px 16px; }
`;

const CTATitle = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: clamp(1.4rem, 3vw, 2rem);
  font-weight: 800;
  color: white;
  margin: 0 0 12px;
`;

const CTASub = styled.p`
  font-size: 1rem;
  color: rgba(255,255,255,0.9);
  margin: 0 0 24px;
`;

const CTABtn = styled.button`
  padding: 16px 40px;
  background: white;
  color: ${theme.colors.accent.coral};
  border: none;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  &:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.2); }
  @media (max-width: 768px) { width: 100%; }
`;

// ═══════════════════════════════════════════
// FAQ
// ═══════════════════════════════════════════

const FAQItem = styled.div`
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 12px;
  transition: all 0.2s ease;
  &:hover { border-color: ${theme.colors.accent.coral}30; }
`;

const FAQQuestion = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 8px;
  line-height: 1.4;
`;

const FAQAnswer = styled.p`
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.7;
  margin: 0;
`;

// ═══════════════════════════════════════════
// LIENS INTERNES
// ═══════════════════════════════════════════

const LinksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const LinkCard = styled.div`
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover { transform: translateY(-3px); border-color: ${theme.colors.accent.coral}40; box-shadow: 0 8px 24px rgba(0,0,0,0.06); }
`;

const LinkTitle = styled.h4`
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 6px;
`;

const LinkDesc = styled.p`
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
`;

// ═══════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════

const covers = [
  { src: 'https://res.cloudinary.com/ddcfqlkrd/image/upload/v1774018112/conte-ia/covers/cover-1774018111614-186146487.png', label: 'Emma & la Forêt Magique' },
  { src: 'https://res.cloudinary.com/ddcfqlkrd/image/upload/v1774009120/conte-ia/covers/cover-1774009119376-652266210.png', label: 'Rayan et le Dino de Pâques' },
  { src: 'https://res.cloudinary.com/ddcfqlkrd/image/upload/v1774005307/conte-ia/covers/cover-1774005306089-669886729.png', label: 'Timéo et le Noël Enchanté' },
  { src: 'https://res.cloudinary.com/ddcfqlkrd/image/upload/v1774002706/conte-ia/covers/cover-1774002706211-337991428.png', label: 'Ethan et le Voyage des Étoiles' },
  { src: 'https://res.cloudinary.com/ddcfqlkrd/image/upload/v1773942968/conte-ia/covers/cover-1773942967849-276520848.png', label: 'Enzo et les Coquillages Magiques' },
];

const faqQuestions = [
  { question: "Comment créer un livre personnalisé pour mon enfant ?", answer: "Sur Contedia, remplissez un formulaire simple avec le prénom, l'âge et les passions de votre enfant. L'IA écrit une histoire unique et génère des illustrations personnalisées. Vous recevez votre livre par email en 5 minutes. Le premier livre est gratuit." },
  { question: "Le premier livre est-il vraiment gratuit ?", answer: "Oui, totalement gratuit. Pas de carte bancaire demandée, pas d'abonnement caché. Vous recevez un vrai livre complet (3 pages, 7 illustrations) par email. Si vous aimez, vous pouvez créer d'autres livres ou rejoindre le Club." },
  { question: "À quel âge peut-on offrir un livre personnalisé ?", answer: "Dès la naissance. Pour les 0-2 ans, les parents lisent à voix haute. Pour les 3-5 ans, l'enfant reconnaît son prénom et s'identifie au héros. Pour les 6-8 ans, il peut lire seul son aventure." },
  { question: "Quelle est la différence avec Wonderbly ou Hourra Héros ?", answer: "Les livres personnalisés classiques remplacent juste le prénom dans un texte standard. Sur Contedia, l'IA écrit une histoire 100% unique à partir de zéro, intégrant le prénom, les passions, les amis et le thème choisi. Deux enfants du même âge reçoivent deux histoires complètement différentes." },
  { question: "Le livre personnalisé est-il un bon cadeau ?", answer: "C'est le cadeau qui éclipse tous les autres. Un jouet, l'enfant l'oublie en 2 semaines. Un livre avec SON nom dedans, il le garde toute sa vie. Parfait pour un anniversaire, Noël, une naissance. À partir de 0€." },
  { question: "Comment l'IA crée-t-elle les illustrations ?", answer: "L'IA génère chaque illustration à partir du texte de la page, en respectant le style choisi (aquarelle, 3D, manga...). Le personnage principal correspond au profil de l'enfant. Toutes les illustrations sont uniques et cohérentes entre elles." }
];

const articleSchema = {
  "@context": "https://schema.org", "@type": "WebPage",
  "name": "Livre Personnalisé Enfant — Créez une Histoire Unique | Contedia",
  "description": "Créez un livre personnalisé gratuit pour votre enfant. Son prénom, ses passions, des illustrations uniques par IA. Prêt en 5 minutes.",
  "url": "https://contedia.fr/livre-personnalise-enfant",
  "publisher": { "@type": "Organization", "name": "Contedia", "url": "https://contedia.fr" },
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR", "description": "Premier livre personnalisé gratuit", "availability": "https://schema.org/InStock" }
};

// ═══════════════════════════════════════════
// COMPOSANT
// ═══════════════════════════════════════════

const LivrePersonnaliseEnfantPage: React.FC = () => {
  const navigate = useNavigate();
  const benefitsReveal = useScrollReveal();
  const showcaseReveal = useScrollReveal();
  const agesReveal = useScrollReveal();
  const testimonialsReveal = useScrollReveal();
  const faqReveal = useScrollReveal();

  return (
    <Page>
      <SEOHead
        title="Livre Personnalisé Enfant Gratuit — Créez Son Histoire en 5 min | Contedia"
        description="Offrez un livre personnalisé à votre enfant : son prénom, sa photo, une histoire unique illustrée par IA. 100% gratuit, sans carte bancaire, prêt en 5 minutes."
        type="website"
      />
      <SchemaFAQ questions={faqQuestions} />
      <SchemaBreadcrumb items={[
        { name: "Accueil", url: "https://contedia.fr/" },
        { name: "Livre Personnalisé Enfant", url: "https://contedia.fr/livre-personnalise-enfant" }
      ]} />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
      </Helmet>
      <Header />

      {/* ══════ HERO ══════ */}
      <Hero>
        <HeroGlow $x="-5%" $y="10%" $color="#FF6B6B" $size={400} />
        <HeroGlow $x="70%" $y="60%" $color="#6366F1" $size={300} />
        <HeroGlow $x="40%" $y="-10%" $color="#FF9999" $size={250} />

        <HeroInner>
          <HeroText>
            <HeroBadge>Premier livre gratuit</HeroBadge>
            <HeroH1>
              Créez un <span>Livre Personnalisé</span> pour Votre Enfant
            </HeroH1>
            <HeroSub>
              Son prénom, ses passions, des illustrations créées pour lui.
              Un livre unique au monde, prêt en 5 minutes.
              <strong> Le premier est offert.</strong>
            </HeroSub>
            <HeroCTA onClick={() => navigate('/create-story')}>
              Créer le livre gratuit de mon enfant
            </HeroCTA>
            <HeroTrust>
              <span>Gratuit</span>
              <span>Prêt en 5 min</span>
              <span>+500 parents</span>
            </HeroTrust>
          </HeroText>

          <HeroVisual>
            <BookCover src="https://res.cloudinary.com/ddcfqlkrd/image/upload/v1774018112/conte-ia/covers/cover-1774018111614-186146487.png" alt="Livre personnalisé enfant — Emma et la Forêt Magique" $float style={{ position: 'absolute', left: '0', top: '20px', zIndex: 1 }} loading="lazy" />
            <BookCover src="https://res.cloudinary.com/ddcfqlkrd/image/upload/v1774005307/conte-ia/covers/cover-1774005306089-669886729.png" alt="Livre personnalisé enfant — Les Étoiles de Luna" style={{ position: 'relative', zIndex: 2 }} loading="lazy" />
            <BookCover src="https://res.cloudinary.com/ddcfqlkrd/image/upload/v1774009120/conte-ia/covers/cover-1774009119376-652266210.png" alt="Livre personnalisé enfant — Zoé et le Royaume des Océans" $float style={{ position: 'absolute', right: '0', top: '40px', zIndex: 1 }} loading="lazy" />
          </HeroVisual>
        </HeroInner>
      </Hero>

      {/* ══════ POURQUOI ══════ */}
      <Section ref={benefitsReveal.ref}>
        <Container>
          <SectionHeader $visible={benefitsReveal.isVisible}>
            <SectionTag>Pourquoi Contedia</SectionTag>
            <SectionTitle>Un Livre <span>Vraiment Personnalisé</span></SectionTitle>
            <SectionSub>
              Pas juste un prénom collé dans un texte. Une vraie histoire écrite par l'IA
              autour de votre enfant — ses passions, ses amis, son univers.
            </SectionSub>
          </SectionHeader>
          <BenefitGrid>
            {[
              { icon: '1', title: 'Histoire 100% Unique', desc: "L'IA écrit chaque phrase à partir de zéro. Deux enfants du même âge reçoivent deux histoires complètement différentes." },
              { icon: '2', title: 'Prêt en 5 Minutes', desc: "Formulaire en 2 min, génération IA en 3 min. Vous recevez le livre par email immédiatement. C'est instantané." },
              { icon: '3', title: 'Premier Livre Gratuit', desc: "Testez sans risque. Pas de carte bancaire, pas d'engagement. Vous ne payez que si vous revenez pour un deuxième." },
              { icon: '4', title: 'Illustrations Uniques', desc: "9 styles au choix : aquarelle, manga, 3D, papier découpé. Chaque image est générée pour correspondre à l'histoire." },
            ].map((b, i) => (
              <BenefitCard key={i} $delay={i}>
                <BenefitIcon>{b.icon}</BenefitIcon>
                <BenefitTitle>{b.title}</BenefitTitle>
                <BenefitDesc>{b.desc}</BenefitDesc>
              </BenefitCard>
            ))}
          </BenefitGrid>
        </Container>
      </Section>

      {/* ══════ SHOWCASE COUVERTURES ══════ */}
      <Section $alt ref={showcaseReveal.ref}>
        <Container>
          <SectionHeader $visible={showcaseReveal.isVisible}>
            <SectionTag>Exemples</SectionTag>
            <SectionTitle>Des Livres <span>Magnifiques</span></SectionTitle>
            <SectionSub>
              Chaque couverture est unique. Voici quelques exemples de livres créés par nos parents.
            </SectionSub>
          </SectionHeader>
          <ShowcaseScroll>
            {covers.map((c, i) => (
              <ShowcaseItem key={i}>
                <ShowcaseImg src={c.src} alt={`Livre personnalisé enfant — ${c.label}`} loading="lazy" />
                <ShowcaseLabel>{c.label}</ShowcaseLabel>
              </ShowcaseItem>
            ))}
          </ShowcaseScroll>
        </Container>
      </Section>

      {/* ══════ CTA MILIEU ══════ */}
      <CTABand>
        <CTATitle>Votre enfant mérite son propre livre</CTATitle>
        <CTASub>Son prénom. Ses passions. Son histoire. Gratuit.</CTASub>
        <CTABtn onClick={() => navigate('/create-story')}>
          Créer mon livre gratuit
        </CTABtn>
      </CTABand>

      {/* ══════ PAR ÂGE ══════ */}
      <Section ref={agesReveal.ref}>
        <Container>
          <SectionHeader $visible={agesReveal.isVisible}>
            <SectionTag>Par âge</SectionTag>
            <SectionTitle>Adapté à <span>Chaque Enfant</span></SectionTitle>
            <SectionSub>
              L'IA adapte automatiquement le vocabulaire, la longueur et la complexité selon l'âge.
            </SectionSub>
          </SectionHeader>
          <AgeGrid>
            {[
              { age: '0-2 ans', title: 'Bébés', desc: 'Histoires courtes, illustrations très colorées. Idéal pour les premiers moments de lecture partagée.', img: '/image/ageenfant/age-0-2.png', themes: ['Animaux doux', 'Comptines', 'Couleurs'] },
              { age: '3-5 ans', title: 'Explorateurs', desc: "Aventures magiques adaptées à leur imagination débordante. Le personnage leur ressemble.", img: '/image/ageenfant/age-3-5.png', themes: ['Magie', 'Amitié', 'Courage'] },
              { age: '6-8 ans', title: 'Aventuriers', desc: "Récits élaborés avec des intrigues et des valeurs éducatives. L'enfant est un vrai héros.", img: '/image/ageenfant/age-6-9.png', themes: ['Enquêtes', 'Espace', 'Héros'] },
            ].map((a, i) => (
              <AgeCard key={i}>
                <AgeImg src={a.img} alt={`Livre personnalisé enfant ${a.age}`} loading="lazy" />
                <AgeBody>
                  <AgeBadge>{a.age}</AgeBadge>
                  <AgeTitle>{a.title}</AgeTitle>
                  <AgeDesc>{a.desc}</AgeDesc>
                  <AgeTagRow>
                    {a.themes.map((t, j) => <AgeTag key={j}>{t}</AgeTag>)}
                  </AgeTagRow>
                </AgeBody>
              </AgeCard>
            ))}
          </AgeGrid>
        </Container>
      </Section>

      {/* ══════ STYLES D'ILLUSTRATION ══════ */}
      <Section $alt>
        <Container>
          <SectionHeader>
            <SectionTag>9 styles</SectionTag>
            <SectionTitle>Des Illustrations <span>Sublimes</span></SectionTitle>
            <SectionSub>
              Choisissez le style qui correspond à votre enfant. Chaque illustration est unique.
            </SectionSub>
          </SectionHeader>
          <ShowcaseScroll>
            {[
              { src: '/images/illustration-styles/aquarelle.jpg', label: 'Aquarelle' },
              { src: '/images/illustration-styles/animation-3d.jpg', label: 'Animation 3D' },
              { src: '/images/illustration-styles/kawaii.jpg', label: 'Kawaii' },
              { src: '/images/illustration-styles/dessin-japonais-manga.jpg', label: 'Manga' },
              { src: '/images/illustration-styles/papier-decoupe.jpg', label: 'Papier découpé' },
              { src: '/images/illustration-styles/clay-animation.jpg', label: 'Clay' },
              { src: '/images/illustration-styles/livre-illustre.jpg', label: 'Illustré' },
              { src: '/images/illustration-styles/geometrique.jpg', label: 'Géométrique' },
              { src: '/images/illustration-styles/monde-des-blocs.jpg', label: 'Blocs' },
            ].map((s, i) => (
              <ShowcaseItem key={i}>
                <ShowcaseImg src={s.src} alt={`Style illustration ${s.label}`} loading="lazy" />
                <ShowcaseLabel>{s.label}</ShowcaseLabel>
              </ShowcaseItem>
            ))}
          </ShowcaseScroll>
        </Container>
      </Section>

      {/* ══════ TÉMOIGNAGES ══════ */}
      <Section ref={testimonialsReveal.ref}>
        <Container>
          <SectionHeader $visible={testimonialsReveal.isVisible}>
            <SectionTag>+500 parents</SectionTag>
            <SectionTitle>Ils ont <span>Adoré</span></SectionTitle>
          </SectionHeader>
          <TestimonialGrid>
            {[
              { text: "Ma fille a ouvert le livre et a crié 'C'est MOI !' Elle l'a relu 6 fois le premier soir.", author: "Aurélie", child: "maman de Léa, 5 ans" },
              { text: "Mon fils détestait les livres. Depuis son conte personnalisé avec ses dinosaures, il demande à lire chaque soir.", author: "Thomas", child: "papa de Raphaël, 6 ans" },
              { text: "J'ai offert un livre pour l'anniversaire de ma nièce. Sa mère m'a appelée en pleurant tellement c'était beau.", author: "Samira", child: "tante de Yasmine, 4 ans" },
            ].map((t, i) => (
              <TestimonialCard key={i}>
                <Stars>&#9733;&#9733;&#9733;&#9733;&#9733;</Stars>
                <TestimonialText>"{t.text}"</TestimonialText>
                <TestimonialAuthor>— {t.author}, {t.child}</TestimonialAuthor>
              </TestimonialCard>
            ))}
          </TestimonialGrid>
        </Container>
      </Section>

      {/* ══════ CTA ══════ */}
      <CTABand>
        <CTATitle>Le Premier Livre est Gratuit</CTATitle>
        <CTASub>Pas de carte bancaire. Juste le prénom de votre enfant et 2 minutes.</CTASub>
        <CTABtn onClick={() => navigate('/create-story')}>
          Créer le livre gratuit de mon enfant
        </CTABtn>
      </CTABand>

      {/* ══════ FAQ ══════ */}
      <Section ref={faqReveal.ref}>
        <Container>
          <SectionHeader $visible={faqReveal.isVisible}>
            <SectionTag>FAQ</SectionTag>
            <SectionTitle>Questions <span>Fréquentes</span></SectionTitle>
          </SectionHeader>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            {faqQuestions.map((faq, i) => (
              <FAQItem key={i}>
                <FAQQuestion>{faq.question}</FAQQuestion>
                <FAQAnswer>{faq.answer}</FAQAnswer>
              </FAQItem>
            ))}
          </div>
        </Container>
      </Section>

      {/* ══════ LIENS INTERNES ══════ */}
      <Section $alt>
        <Container>
          <SectionHeader>
            <SectionTitle>Nos <span>Guides</span></SectionTitle>
          </SectionHeader>
          <LinksGrid>
            {[
              { title: "Guide Complet 2026", desc: "Tout savoir sur le livre personnalisé", link: "/blog/guide-livre-personnalise-enfant-2026" },
              { title: "Comparatif 2026", desc: "Les 10 meilleures plateformes", link: "/blog/meilleurs-livres-personnalises-enfants-comparatif-2026" },
              { title: "Personnalisé vs Classique", desc: "Pourquoi le personnalisé gagne", link: "/blog/livre-personnalise-vs-livre-classique-enfant" },
              { title: "Cadeau Parfait", desc: "Le cadeau qui éclipse tout", link: "/blog/cadeau-livre-personnalise-enfant" },
              { title: "Enfant Timide", desc: "Comment le conte aide", link: "/blog/livre-personnalise-enfant-timide" },
              { title: "Rituel du Coucher", desc: "Le conte du soir parfait", link: "/blog/conte-personnalise-rituel-coucher" },
            ].map((item, i) => (
              <LinkCard key={i} onClick={() => navigate(item.link)}>
                <LinkTitle>{item.title}</LinkTitle>
                <LinkDesc>{item.desc}</LinkDesc>
              </LinkCard>
            ))}
          </LinksGrid>
        </Container>
      </Section>

      {/* ══════ CTA FINAL ══════ */}
      <Hero as="section" style={{ minHeight: 'auto', padding: '80px 20px' }}>
        <HeroGlow $x="50%" $y="50%" $color="#FF6B6B" $size={400} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
          <HeroH1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)' }}>
            Offrez à Votre Enfant <span>Son Propre Livre</span>
          </HeroH1>
          <HeroSub style={{ maxWidth: '100%', textAlign: 'center', margin: '0 auto 24px' }}>
            +500 parents ont déjà créé le livre de leur enfant. Gratuit, sans engagement, prêt en 5 minutes.
          </HeroSub>
          <HeroCTA onClick={() => navigate('/create-story')}>
            Créer le livre gratuit de mon enfant
          </HeroCTA>
        </div>
      </Hero>

      <Footer />
    </Page>
  );
};

export default LivrePersonnaliseEnfantPage;

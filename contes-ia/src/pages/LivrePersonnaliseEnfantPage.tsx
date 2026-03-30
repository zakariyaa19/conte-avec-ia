import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { SEOHead } from '../components/SEOHead';
import { SchemaFAQ, SchemaBreadcrumb } from '../components/SchemaMarkup';
import { useScrollReveal, useStaggerReveal } from '../hooks/useScrollReveal';
import { theme } from '../styles/theme';
import {
  PageContainer, HeroSection, HeroDecoBlur, HeroContent, HeroBadge,
  HeroTitle, HeroDivider, HeroSubtitle, ContentSection, SectionDeco,
  Container, SectionWrapper, SectionTitle, SectionSubtitle, SectionDivider,
  CardsGrid, FeatureCard, CardIcon, CardTitle, CardDescription, CardTagsRow, CardTag,
  FinalCTASection, FinalCTAContent, FinalCTATitle, FinalCTAText, WhiteButton
} from '../styles/DiscoverPageStyles';

// ── Données structurées ──

const benefits = [
  {
    title: "100% Personnalisé",
    description: "Le prénom, l'âge, les passions et même la photo de votre enfant sont intégrés dans l'histoire. Chaque livre est unique au monde.",
    icon: "1",
    tags: ["Prénom intégré", "Passions incluses", "Photo du héros", "Histoire unique"]
  },
  {
    title: "Prêt en 5 Minutes",
    description: "Remplissez le formulaire en 2 minutes, l'IA écrit et illustre le conte en 3 minutes. Vous recevez le livre par email immédiatement.",
    icon: "2",
    tags: ["Formulaire rapide", "IA instantanée", "Email immédiat", "PDF téléchargeable"]
  },
  {
    title: "Premier Livre Gratuit",
    description: "Testez sans risque : votre premier livre personnalisé est offert. Pas de carte bancaire, pas d'engagement. Vous ne payez que si vous revenez.",
    icon: "3",
    tags: ["0€", "Sans carte bancaire", "Sans engagement", "Test gratuit"]
  },
  {
    title: "Illustrations Uniques",
    description: "Chaque illustration est générée par IA pour correspondre à l'histoire. 9 styles disponibles : aquarelle, manga, 3D, papier découpé et plus.",
    icon: "4",
    tags: ["9 styles", "IA générative", "Qualité pro", "Cohérence visuelle"]
  }
];

const ageGroups = [
  {
    age: "0-2 ans",
    title: "Bébés et Tout-Petits",
    description: "Histoires courtes avec des illustrations très colorées. Idéal pour les premiers moments de lecture partagée avec bébé.",
    themes: ["Animaux doux", "Comptines", "Premiers mots", "Couleurs vives"]
  },
  {
    age: "3-5 ans",
    title: "Petits Explorateurs",
    description: "Aventures magiques adaptées à leur imagination débordante. Le personnage leur ressemble et vit des aventures extraordinaires.",
    themes: ["Magie", "Animaux qui parlent", "Amitié", "Courage"]
  },
  {
    age: "6-8 ans",
    title: "Jeunes Aventuriers",
    description: "Récits plus élaborés avec des intrigues, des mystères et des valeurs éducatives. L'enfant est un vrai héros qui résout des problèmes.",
    themes: ["Enquêtes", "Espace", "Nature", "Héros du quotidien"]
  }
];

const testimonials = [
  {
    text: "Ma fille a ouvert le livre et a crié 'C'est MOI !' Elle l'a relu 6 fois le premier soir. Aucun autre cadeau n'a eu cet effet.",
    author: "Aurélie",
    child: "maman de Léa, 5 ans"
  },
  {
    text: "Mon fils détestait les livres. Depuis qu'il a son conte personnalisé avec ses dinosaures, il demande à lire chaque soir. Le déclic.",
    author: "Thomas",
    child: "papa de Raphaël, 6 ans"
  },
  {
    text: "J'ai offert un livre personnalisé pour l'anniversaire de ma nièce. Sa mère m'a appelée en pleurant tellement c'était beau. Le meilleur cadeau possible.",
    author: "Samira",
    child: "tante de Yasmine, 4 ans"
  }
];

const faqQuestions = [
  {
    question: "Comment créer un livre personnalisé pour mon enfant ?",
    answer: "Sur Contedia, remplissez un formulaire simple avec le prénom, l'âge et les passions de votre enfant. L'IA écrit une histoire unique et génère des illustrations personnalisées. Vous recevez votre livre par email en 5 minutes. Le premier livre est gratuit."
  },
  {
    question: "Le premier livre est-il vraiment gratuit ?",
    answer: "Oui, totalement gratuit. Pas de carte bancaire demandée, pas d'abonnement caché. Vous recevez un vrai livre complet (6 pages, 7 illustrations) par email. Si vous aimez, vous pouvez créer d'autres livres ou rejoindre le Club."
  },
  {
    question: "À quel âge peut-on offrir un livre personnalisé ?",
    answer: "Dès la naissance. Pour les 0-2 ans, les parents lisent à voix haute et le bébé découvre les illustrations. Pour les 3-5 ans, l'enfant reconnaît son prénom et s'identifie au héros. Pour les 6-8 ans, il peut lire seul son aventure."
  },
  {
    question: "Quelle est la différence avec un livre personnalisé classique ?",
    answer: "Les livres personnalisés classiques (Wonderbly, Hourra Héros) remplacent juste le prénom dans un texte standard. Sur Contedia, l'IA écrit une histoire 100% unique à partir de zéro, intégrant le prénom, les passions, les amis et le thème choisi. Deux enfants du même âge reçoivent deux histoires complètement différentes."
  },
  {
    question: "Le livre personnalisé est-il un bon cadeau ?",
    answer: "C'est le cadeau qui éclipse tous les autres. Un jouet, l'enfant l'oublie en 2 semaines. Un livre avec SON nom dedans, il le garde toute sa vie. Parfait pour un anniversaire, Noël, une naissance ou juste pour faire plaisir. À partir de 0€."
  },
  {
    question: "Comment l'IA crée-t-elle les illustrations ?",
    answer: "L'IA génère chaque illustration à partir du texte de la page, en respectant le style choisi (aquarelle, 3D, manga...). Le personnage principal correspond au profil de l'enfant. Toutes les illustrations sont uniques et cohérentes entre elles."
  }
];

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Livre Personnalisé Enfant — Créez une Histoire Unique | Contedia",
  "description": "Créez un livre personnalisé gratuit pour votre enfant. Son prénom, ses passions, des illustrations uniques par IA. Prêt en 5 minutes.",
  "url": "https://contedia.fr/livre-personnalise-enfant",
  "publisher": { "@type": "Organization", "name": "Contedia", "url": "https://contedia.fr" },
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "EUR",
    "description": "Premier livre personnalisé gratuit",
    "availability": "https://schema.org/InStock"
  }
};

// ── Composant ──

const LivrePersonnaliseEnfantPage: React.FC = () => {
  const navigate = useNavigate();
  const benefitsReveal = useScrollReveal();
  const benefitsCardsReveal = useStaggerReveal(benefits.length);
  const agesReveal = useScrollReveal();
  const agesCardsReveal = useStaggerReveal(ageGroups.length);
  const testimonialsReveal = useScrollReveal();
  const faqReveal = useScrollReveal();
  const ctaReveal = useScrollReveal();

  return (
    <PageContainer>
      <SEOHead
        title="Livre Personnalisé Enfant — Créez une Histoire Unique Gratuit | Contedia"
        description="Créez un livre personnalisé gratuit pour votre enfant. Son prénom, ses passions, des illustrations uniques par IA. Prêt en 5 minutes, 0€. +500 parents conquis."
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

      {/* ── HERO ── */}
      <HeroSection>
        <HeroDecoBlur $size={350} $top="-10%" $left="-5%" $color={theme.colors.accent.coral} $opacity={0.08} />
        <HeroDecoBlur $size={280} $top="60%" $left="85%" $color={theme.colors.accent.pastelBlue} $opacity={0.06} />
        <HeroContent>
          <HeroBadge>Premier livre gratuit</HeroBadge>
          <HeroTitle>Livre Personnalisé <span>Enfant</span></HeroTitle>
          <HeroDivider />
          <HeroSubtitle>
            Votre enfant devient le héros de sa propre histoire. Son prénom, ses passions,
            des illustrations créées pour lui. Un livre unique au monde, prêt en 5 minutes.
            <strong> Le premier est gratuit.</strong>
          </HeroSubtitle>
          <div style={{ marginTop: '24px' }}>
            <WhiteButton onClick={() => navigate('/create-story')}>
              Créer le livre gratuit de mon enfant
            </WhiteButton>
          </div>
        </HeroContent>
      </HeroSection>

      {/* ── POURQUOI CONTEDIA ── */}
      <ContentSection ref={benefitsReveal.ref}>
        <SectionDeco $size={300} $top="-50px" $right="-100px" $color={theme.colors.accent.softPink} />
        <Container>
          <SectionWrapper $visible={benefitsReveal.isVisible}>
            <SectionTitle>Pourquoi Créer un <span>Livre Personnalisé</span> ?</SectionTitle>
            <SectionDivider />
            <SectionSubtitle>
              Un livre personnalisé n'est pas juste un livre avec un prénom dedans.
              C'est une histoire écrite POUR votre enfant, qui booste sa confiance,
              son amour de la lecture et crée un souvenir pour toute la vie.
            </SectionSubtitle>
          </SectionWrapper>
          <CardsGrid $columns={2} ref={benefitsCardsReveal.ref}>
            {benefits.map((b, i) => (
              <FeatureCard key={i} $visible={benefitsCardsReveal.isVisible} $delay={`${benefitsCardsReveal.getDelay(i)}s`}>
                <CardIcon style={{ fontSize: '2rem', fontWeight: 800, color: theme.colors.accent.coral }}>{b.icon}</CardIcon>
                <CardTitle>{b.title}</CardTitle>
                <CardDescription>{b.description}</CardDescription>
                <CardTagsRow>
                  {b.tags.map((t, j) => <CardTag key={j}>{t}</CardTag>)}
                </CardTagsRow>
              </FeatureCard>
            ))}
          </CardsGrid>
        </Container>
      </ContentSection>

      {/* ── PAR ÂGE ── */}
      <ContentSection $alt ref={agesReveal.ref}>
        <SectionDeco $size={250} $top="10%" $left="-80px" $color={theme.colors.accent.paleYellow} />
        <Container>
          <SectionWrapper $visible={agesReveal.isVisible}>
            <SectionTitle>Un Livre Adapté à <span>Chaque Âge</span></SectionTitle>
            <SectionDivider />
            <SectionSubtitle>
              L'IA adapte automatiquement le vocabulaire, la longueur et la complexité
              de l'histoire selon l'âge de votre enfant. Du bébé au pré-ado.
            </SectionSubtitle>
          </SectionWrapper>
          <CardsGrid $columns={3} ref={agesCardsReveal.ref}>
            {ageGroups.map((age, i) => (
              <FeatureCard key={i} $visible={agesCardsReveal.isVisible} $delay={`${agesCardsReveal.getDelay(i)}s`}>
                <CardIcon style={{ fontSize: '1.5rem', fontWeight: 700 }}>{age.age}</CardIcon>
                <CardTitle>{age.title}</CardTitle>
                <CardDescription>{age.description}</CardDescription>
                <CardTagsRow>
                  {age.themes.map((t, j) => <CardTag key={j}>{t}</CardTag>)}
                </CardTagsRow>
              </FeatureCard>
            ))}
          </CardsGrid>
        </Container>
      </ContentSection>

      {/* ── TÉMOIGNAGES ── */}
      <ContentSection ref={testimonialsReveal.ref}>
        <Container>
          <SectionWrapper $visible={testimonialsReveal.isVisible}>
            <SectionTitle>Ce que les <span>Parents</span> en Disent</SectionTitle>
            <SectionDivider />
          </SectionWrapper>
          <CardsGrid $columns={3} ref={testimonialsReveal.ref}>
            {testimonials.map((t, i) => (
              <FeatureCard key={i} $visible={testimonialsReveal.isVisible} $delay={`${i * 0.1}s`}>
                <CardDescription style={{ fontStyle: 'italic', fontSize: '0.95rem', lineHeight: 1.7 }}>
                  "{t.text}"
                </CardDescription>
                <CardTitle style={{ fontSize: '0.85rem', marginTop: '12px' }}>
                  — {t.author}, {t.child}
                </CardTitle>
              </FeatureCard>
            ))}
          </CardsGrid>
        </Container>
      </ContentSection>

      {/* ── CTA MILIEU ── */}
      <FinalCTASection>
        <SectionWrapper $visible={true}>
          <FinalCTAContent>
            <FinalCTATitle>Créez le Livre de Votre Enfant Maintenant</FinalCTATitle>
            <FinalCTAText>
              Son prénom. Ses passions. Son livre. Gratuit, prêt en 5 minutes.
            </FinalCTAText>
            <WhiteButton onClick={() => navigate('/create-story')}>
              Créer mon livre gratuit
            </WhiteButton>
          </FinalCTAContent>
        </SectionWrapper>
      </FinalCTASection>

      {/* ── FAQ SEO ── */}
      <ContentSection ref={faqReveal.ref}>
        <Container>
          <SectionWrapper $visible={faqReveal.isVisible}>
            <SectionTitle>Questions <span>Fréquentes</span></SectionTitle>
            <SectionDivider />
          </SectionWrapper>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            {faqQuestions.map((faq, i) => (
              <div key={i} style={{
                marginBottom: '20px', padding: '20px 24px',
                background: 'var(--bg-card)', borderRadius: '14px',
                border: '1px solid var(--border-color)',
              }}>
                <h3 style={{
                  fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)',
                  margin: '0 0 8px', lineHeight: 1.4,
                }}>
                  {faq.question}
                </h3>
                <p style={{
                  fontSize: '0.9rem', color: 'var(--text-secondary)',
                  lineHeight: 1.7, margin: 0,
                }}>
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </ContentSection>

      {/* ── MAILLAGE INTERNE ── */}
      <ContentSection $alt>
        <Container>
          <SectionWrapper $visible={true}>
            <SectionTitle>Explorez nos <span>Guides</span></SectionTitle>
            <SectionDivider />
          </SectionWrapper>
          <CardsGrid $columns={3}>
            {[
              { title: "Guide Complet 2026", desc: "Tout savoir sur le livre personnalisé enfant", link: "/blog/guide-livre-personnalise-enfant-2026" },
              { title: "Comparatif 2026", desc: "Les 10 meilleures plateformes comparées", link: "/blog/meilleurs-livres-personnalises-enfants-comparatif-2026" },
              { title: "Livre vs Classique", desc: "Pourquoi le personnalisé surpasse le classique", link: "/blog/livre-personnalise-vs-livre-classique-enfant" },
              { title: "Cadeau Parfait", desc: "Le cadeau qui éclipse tous les autres", link: "/blog/cadeau-livre-personnalise-enfant" },
              { title: "Enfant Timide", desc: "Comment un livre personnalisé aide un enfant timide", link: "/blog/livre-personnalise-enfant-timide" },
              { title: "Rituel du Coucher", desc: "Le conte du soir personnalisé", link: "/blog/conte-personnalise-rituel-coucher" },
            ].map((item, i) => (
              <FeatureCard key={i} $visible={true} $delay={`${i * 0.05}s`}
                onClick={() => navigate(item.link)} style={{ cursor: 'pointer' }}>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.desc}</CardDescription>
              </FeatureCard>
            ))}
          </CardsGrid>
        </Container>
      </ContentSection>

      {/* ── CTA FINAL ── */}
      <FinalCTASection ref={ctaReveal.ref}>
        <SectionWrapper $visible={ctaReveal.isVisible}>
          <FinalCTAContent>
            <FinalCTATitle>Le Premier Livre est Gratuit</FinalCTATitle>
            <FinalCTAText>
              Pas de carte bancaire. Pas d'engagement. Juste le prénom de votre enfant
              et 2 minutes de votre temps. Testez maintenant.
            </FinalCTAText>
            <WhiteButton onClick={() => navigate('/create-story')}>
              Créer le livre gratuit de mon enfant
            </WhiteButton>
          </FinalCTAContent>
        </SectionWrapper>
      </FinalCTASection>

      <Footer />
    </PageContainer>
  );
};

export default LivrePersonnaliseEnfantPage;

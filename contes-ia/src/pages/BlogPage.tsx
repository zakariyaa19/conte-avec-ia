import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { useScrollReveal, useStaggerReveal } from '../hooks/useScrollReveal';
import { SEOHead } from '../components/SEOHead';
import { SchemaBreadcrumb } from '../components/SchemaMarkup';
import { theme } from '../styles/theme';
import {
  PageContainer,
  HeroSection,
  HeroDecoBlur,
  HeroContent,
  HeroBadge,
  HeroTitle,
  HeroDivider,
  HeroSubtitle,
  ContentSection,
  Container,
  SectionTitle,
  SectionDivider,
  FinalCTASection,
  FinalCTATitle,
  FinalCTAText,
  WhiteButton,
} from '../styles/DiscoverPageStyles';

// ─── Blog-specific styled components ───

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const BlogCard = styled(Link)<{ $visible?: boolean; $delay?: string }>`
  display: flex;
  flex-direction: column;
  background: var(--bg-card);
  border-radius: ${theme.borderRadius['2xl']};
  overflow: hidden;
  box-shadow: ${theme.shadows.card};
  border: 1px solid rgba(0, 0, 0, 0.04);
  text-decoration: none;
  color: inherit;
  opacity: ${p => (p.$visible !== undefined ? (p.$visible ? 1 : 0) : 1)};
  transform: translateY(${p => (p.$visible !== undefined ? (p.$visible ? '0' : '30px') : '0')});
  transition:
    opacity 0.6s ease ${p => p.$delay || '0ms'},
    transform 0.6s ease ${p => p.$delay || '0ms'},
    box-shadow ${theme.transitions.smooth},
    border-color ${theme.transitions.smooth};

  &:hover {
    transform: translateY(-6px);
    box-shadow: ${theme.shadows.cardHover};
    border-color: ${theme.colors.accent.lightCoral};
  }
`;

const BlogCardImage = styled.div`
  width: 100%;
  height: 200px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform ${theme.transitions.smooth};
  }

  ${BlogCard}:hover & img {
    transform: scale(1.06);
  }
`;

const BlogCardContent = styled.div`
  padding: ${theme.spacing.lg};
  display: flex;
  flex-direction: column;
  flex: 1;

  h3 {
    font-family: ${theme.fonts.heading};
    font-size: ${theme.fontSizes.lg};
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: ${theme.spacing.sm};
    line-height: 1.35;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  p {
    font-size: ${theme.fontSizes.sm};
    color: var(--text-secondary);
    line-height: 1.7;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

const CategoryTitle = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['2xl']};
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: ${theme.spacing.xl};
  padding-bottom: ${theme.spacing.sm};
  border-bottom: 3px solid ${theme.colors.accent.lightCoral};
  display: inline-block;
`;

const CategoryBlock = styled.div`
  margin-bottom: ${theme.spacing['3xl']};

  &:last-child {
    margin-bottom: 0;
  }
`;

// ─── Blog articles data ───

const blogArticles = [
    { id: 1, title: "Creer un Livre Personnalise avec votre Animal de Compagnie", excerpt: "Transformez votre chien, chat ou animal favori en heros d'un conte personnalise unique. Decouvrez comment creer un livre magique ou votre enfant et son compagnon vivent des aventures extraordinaires ensemble.", slug: "histoire-animal-compagnie-livre-personnalise", image: "conte-animal-compagnie" },
    { id: 2, title: "Des contes pour enfants a personnaliser : nouveaux heros et univers illustres", excerpt: "Decouvrez comment creer des heros uniques, explorer des univers illustres epoustouflants et adapter vos histoires aux gouts des adolescents.", slug: "nouveaux-personnages-styles-aventures-ados", image: "enfant-lecture-personnalisee" },
    { id: 3, title: "Contes de Fees Modernes : Quand la Magie Rencontre la Personnalisation", excerpt: "Les contes de fees se reinventent grace aux aventures personnalisees, offrant a chaque enfant la possibilite de devenir le heros de son propre conte de fees sur mesure.", slug: "evolution-livres-enfants-contes-fees-aventures-personnalisees", image: "contes-fees-modernes" },
    { id: 4, title: "Comment l'IA revolutionne la creation d'histoires pour enfants", excerpt: "L'intelligence artificielle transforme la facon dont nous creons des histoires pour enfants. Decouvrez comment notre technologie permet de generer des contes personnalises uniques.", slug: "ia-revolution-creation-histoires-enfants", image: "ia-creation-histoires" },
    { id: 5, title: "Integrer les valeurs religieuses dans les contes personnalises", excerpt: "Apprenez comment personnaliser la religion de votre enfant dans nos contes IA. Guide complet pour creer des histoires respectueuses des croyances familiales.", slug: "integrer-valeurs-religieuses-contes-personnalises", image: "religion-contes-personnalises" },
    { id: 6, title: "Pourquoi votre animal de compagnie stimule l'imagination de votre enfant", excerpt: "Decouvrez comment votre animal de compagnie devient une source d'inspiration magique pour l'imagination de votre enfant.", slug: "animal-compagnie-stimule-imagination-enfant", image: "enfant-animal-lecture" },
    { id: 7, title: "Offrir un conte personnalise pour Noel : le cadeau parfait pour les amoureux des animaux", excerpt: "Decouvrez pourquoi un livre personnalise mettant en scene l'animal de compagnie est le cadeau de Noel ideal.", slug: "conte-personnalise-noel-cadeau-amoureux-animaux", image: "noel-enfant-animal-livre" },
    { id: 8, title: "De la photo au heros de conte : comment l'IA transforme votre animal en personnage d'aventure", excerpt: "Decouvrez la technologie revolutionnaire qui transforme les photos de votre animal en illustrations de conte personnalise.", slug: "photo-heros-conte-ia-transforme-animal-personnage", image: "ia-transformation-animal" },
    { id: 9, title: "Lire avec son compagnon a quatre pattes : un rituel qui renforce le lien enfant-animal", excerpt: "Decouvrez comment la lecture partagee avec votre animal de compagnie renforce les liens affectifs et developpe l'empathie chez l'enfant.", slug: "lire-compagnon-quatre-pattes-rituel-lien-enfant-animal", image: "enfant-lecture-animal-rituel" },
    { id: 10, title: "Top 5 des themes d'histoires pour transformer votre animal en heros de conte", excerpt: "Decouvrez 5 themes d'aventures captivants pour creer des contes personnalises avec votre animal.", slug: "top-5-themes-histoires-animal-heros-conte", image: "themes-aventures-animaux" },
    { id: 11, title: "Transmettre la foi a travers les histoires : comment les contes personnalises eveillent la spiritualite", excerpt: "Decouvrez comment les contes personnalises aident a transmettre la foi et les valeurs spirituelles aux enfants avec douceur.", slug: "transmettre-foi-histoires-contes-personnalises-spiritualite", image: "foi-spiritualite-enfant-conte" },
    { id: 12, title: "Les grandes fetes religieuses revisitees : creer un conte personnalise pour Noel, Ramadan, Paque ou Diwali", excerpt: "Celebrez les fetes religieuses avec des contes personnalises adaptes a chaque tradition.", slug: "fetes-religieuses-conte-personnalise-noel-ramadan-paque-diwali", image: "fetes-religieuses-conte-personnalise" },
    { id: 13, title: "Personnaliser la foi : quand l'IA s'adapte a vos valeurs religieuses", excerpt: "Decouvrez comment l'intelligence artificielle respecte et s'adapte aux differentes croyances religieuses.", slug: "personnaliser-foi-ia-adapte-valeurs-religieuses", image: "ia-adaptation-valeurs-religieuses" },
    { id: 14, title: "Des heros de foi : inspirer les enfants a travers des personnages spirituels", excerpt: "Decouvrez comment integrer des figures inspirantes de differentes traditions religieuses dans les contes personnalises.", slug: "heros-foi-inspirer-enfants-personnages-spirituels", image: "heros-spirituels-conte-enfant" },
    { id: 15, title: "Foi, tolerance et ouverture : comment les contes favorisent le respect des differentes religions", excerpt: "Decouvrez comment les contes personnalises enseignent la tolerance religieuse et le respect des differentes croyances.", slug: "foi-tolerance-ouverture-respect-differentes-religions", image: "tolerance-religieuse-conte-enfant" },
    { id: 16, title: "Pourquoi offrir un livre personnalise a un enfant en 2026 ?", excerpt: "Decouvrez pourquoi le livre personnalise est le cadeau ideal pour un enfant en 2026. Avantages, bienfaits et impact sur le developpement.", slug: "livre-personnalise-enfant-2026", image: "livre-personnalise-enfant-2026" },
    { id: 17, title: "Comment un conte personnalise aide l'enfant a developper confiance et imagination", excerpt: "Decouvrez comment les contes personnalises renforcent la confiance en soi et stimulent l'imagination des enfants.", slug: "conte-personnalise-confiance-imagination-enfant", image: "conte-personnalise-confiance-imagination-enfant" },
    { id: 18, title: "Livre personnalise ou livre classique : lequel est le plus benefique pour l'enfant ?", excerpt: "Comparaison detaillee entre livres personnalises et livres classiques pour enfants.", slug: "livre-personnalise-vs-livre-classique-enfant", image: "livre-personnalise-vs-livre-classique-enfant" },
    { id: 19, title: "L'intelligence artificielle au service des histoires pour enfants", excerpt: "Decouvrez comment l'intelligence artificielle revolutionne la creation d'histoires pour enfants.", slug: "intelligence-artificielle-histoires-enfants", image: "intelligence-artificielle-histoires-enfants" },
    { id: 20, title: "Pourquoi les enfants adorent etre le heros de leur propre histoire", excerpt: "Decouvrez les raisons psychologiques pour lesquelles les enfants adorent etre le heros de leur propre histoire.", slug: "enfant-heros-propre-histoire", image: "enfant-heros-propre-histoire" },
    { id: 21, title: "Lecture du soir : pourquoi le conte personnalise ameliore le rituel du coucher", excerpt: "Decouvrez comment les contes personnalises transforment le rituel du coucher en moment magique.", slug: "conte-personnalise-rituel-coucher", image: "conte-personnalise-rituel-coucher" },
    { id: 22, title: "Comment un livre personnalise peut aider un enfant timide ou anxieux", excerpt: "Decouvrez comment les livres personnalises aident les enfants timides et anxieux a developper leur confiance en soi.", slug: "livre-personnalise-enfant-timide", image: "livre-personnalise-enfant-timide" },
    { id: 23, title: "Cadeau de naissance ou anniversaire : le livre personnalise intemporel", excerpt: "Decouvrez pourquoi le livre personnalise est le cadeau parfait pour une naissance ou un anniversaire.", slug: "cadeau-livre-personnalise-enfant", image: "cadeau-livre-personnalise-enfant" },
    { id: 24, title: "Comment sont creees les histoires personnalisees sur Conte d'IA", excerpt: "Decouvrez les coulisses de la creation d'histoires personnalisees sur Conte d'IA.", slug: "creation-histoires-personnalisees-conte-ia", image: "creation-histoires-personnalisees-conte-ia" },
    { id: 25, title: "Les bienfaits de la lecture personnalisee sur le developpement emotionnel", excerpt: "Decouvrez comment la lecture personnalisee favorise le developpement emotionnel des enfants.", slug: "bienfaits-lecture-personnalisee-enfant", image: "bienfaits-lecture-personnalisee-enfant" },
    { id: 26, title: "Livre Personnalise Enfant : Le Guide Complet 2026 (par Age)", excerpt: "Le guide ultime pour choisir le meilleur livre personnalise pour votre enfant. Conseils par age (0-8 ans), comparatif classique vs IA, et creation en 3 etapes.", slug: "guide-livre-personnalise-enfant-2026", image: "livre-personnalise-enfant-guide-complet" },
    { id: 27, title: "Les 10 Meilleurs Livres Personnalises pour Enfants en 2026 (Comparatif)", excerpt: "Comparatif complet des 10 meilleures plateformes de livres personnalises : Contedia, Wonderbly, Hourra Heros, Eponi... Prix, qualite, notre verdict.", slug: "meilleurs-livres-personnalises-enfants-comparatif-2026", image: "meilleurs-livres-personnalises-comparatif" },
    { id: 28, title: "Conteuse Personnalisable : La Meilleure Alternative Numerique en 2026", excerpt: "Comparatif conteuses physiques (Lunii, Tonies) vs contes personnalises par IA. Decouvrez pourquoi le livre personnalise numerique est la meilleure alternative.", slug: "conteuse-personnalisable-alternative-numerique-2026", image: "conteuse-personnalisable-livre-enfant" }
];

// ─── Article categories ───

const recentArticles = blogArticles.filter(a => a.id >= 16);
const animalArticles = blogArticles.filter(a => a.id >= 6 && a.id <= 10);
const faithArticles = blogArticles.filter(a => a.id >= 11 && a.id <= 15);
const firstArticles = blogArticles.filter(a => a.id >= 1 && a.id <= 5);

// ─── Category Section Component ───

interface CategorySectionProps {
  title: string;
  articles: typeof blogArticles;
}

const CategorySection: React.FC<CategorySectionProps> = ({ title, articles }) => {
  const { ref, isVisible, getDelay } = useStaggerReveal(articles.length);

  return (
    <CategoryBlock ref={ref}>
      <CategoryTitle>{title}</CategoryTitle>
      <BlogGrid>
        {articles.map((article, index) => (
          <BlogCard
            key={article.id}
            to={`/blog/${article.slug}`}
            $visible={isVisible}
            $delay={getDelay(index)}
          >
            <BlogCardImage>
              <img
                src={`/images/blog/${article.image}.jpg`}
                loading="lazy"
                alt={article.title}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/placeholder-blog.jpg';
                }}
              />
            </BlogCardImage>
            <BlogCardContent>
              <h3>{article.title}</h3>
              <p>{article.excerpt}</p>
            </BlogCardContent>
          </BlogCard>
        ))}
      </BlogGrid>
    </CategoryBlock>
  );
};

// ─── BlogPage Component ───

const BlogPage: React.FC = () => {
  const navigate = useNavigate();
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollReveal();

  return (
    <PageContainer>
      <SEOHead
        title="Blog — Livres Personnalisés Enfants, Contes IA, Idées Cadeaux | Contedia"
        description="Articles et guides sur les livres personnalisés pour enfants. Conseils lecture, comparatifs, idées cadeaux et astuces pour créer le conte parfait."
      />
      <Helmet>
        <meta
          name="keywords"
          content="pourquoi offrir un livre personnalise a un enfant, les avantages des contes personnalises pour le developpement de l'enfant, top 10 des cadeaux personnalises pour enfants, comment choisir un conte adapte a l'age de son enfant, blog contes personnalises"
        />
      </Helmet>
      <SchemaBreadcrumb items={[
        { name: "Accueil", url: "https://contedia.fr/" },
        { name: "Blog", url: "https://contedia.fr/blog" }
      ]} />

      <Header />

      {/* ─── Hero ─── */}
      <HeroSection>
        <HeroDecoBlur $size={400} $top="-10%" $left="-5%" $color={theme.colors.accent.softPink} $opacity={0.3} />
        <HeroDecoBlur $size={300} $top="60%" $left="80%" $color={theme.colors.accent.pastelBlue} $opacity={0.2} />
        <HeroDecoBlur $size={250} $top="30%" $left="50%" $color={theme.colors.accent.paleYellow} $opacity={0.25} />
        <HeroContent>
          <HeroBadge>Blog</HeroBadge>
          <HeroTitle>
            Notre <span>Blog</span>
          </HeroTitle>
          <HeroDivider />
          <HeroSubtitle>
            Lisez nos derniers articles remplis d'inspiration, de conseils et d'histoires sur les livres pour enfants magiques.
          </HeroSubtitle>
        </HeroContent>
      </HeroSection>

      {/* ─── Blog Articles ─── */}
      <ContentSection ref={sectionRef}>
        <Container>
          <SectionTitle>
            Tous nos <span>articles</span>
          </SectionTitle>
          <SectionDivider />

          <CategorySection title="Articles Recents" articles={recentArticles} />
          <CategorySection title="Animaux de Compagnie" articles={animalArticles} />
          <CategorySection title="Foi et Spiritualite" articles={faithArticles} />
          <CategorySection title="Nos Premiers Articles" articles={firstArticles} />
        </Container>
      </ContentSection>

      {/* ─── Final CTA ─── */}
      <FinalCTASection>
        <FinalCTATitle>Envie de creer votre propre conte ?</FinalCTATitle>
        <FinalCTAText>
          Offrez a votre enfant une aventure personnalisee unique, creee sur mesure grace a l'intelligence artificielle.
        </FinalCTAText>
        <WhiteButton onClick={() => navigate('/create-story')}>
          Creer un conte personnalise
        </WhiteButton>
      </FinalCTASection>

      <Footer />
    </PageContainer>
  );
};

export default BlogPage;

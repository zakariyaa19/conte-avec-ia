import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { useScrollReveal, useStaggerReveal } from '../hooks/useScrollReveal';
import { SEOHead } from '../components/SEOHead';
import { SchemaBreadcrumb } from '../components/SchemaMarkup';
import { blogArticles } from '../data/blogArticles';
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
// Source unique de vérité : src/data/blogArticles.ts (importée en tête de fichier).


// ─── Article categories ───

const recentArticles = blogArticles.filter(a => a.id >= 16);
const animalArticles = blogArticles.filter(a => a.id >= 6 && a.id <= 10);
const faithArticles = blogArticles.filter(a => a.id >= 11 && a.id <= 15);
const firstArticles = blogArticles.filter(a => a.id >= 1 && a.id <= 5);
const cadeauxArticles = blogArticles.filter(a =>
  ['cadeau-livre-personnalise-enfant', 'cadeau-fete-des-meres-livre-personnalise', 'cadeau-naissance-livre-personnalise-bebe', 'cadeau-noel-livre-personnalise-enfant', 'cadeau-anniversaire-enfant-livre-personnalise', 'idee-cadeau-enfant-3-ans', 'idee-cadeau-enfant-5-ans'].includes(a.slug)
);
const comparatifsArticles = blogArticles.filter(a =>
  ['meilleurs-livres-personnalises-enfants-comparatif-2026', 'contedia-vs-wonderbly-comparatif', 'contedia-vs-hourra-heros-comparatif', 'contedia-vs-epopia-comparatif', 'alternative-lunii-livre-personnalise-ia', 'alternative-toniebox-livre-personnalise-enfant', 'lunii-vs-toniebox-comparatif-2026', 'conteuse-enfant-guide-complet-2026', 'chatgpt-vs-contedia-histoires-enfants'].includes(a.slug)
);
const rituelsArticles = blogArticles.filter(a =>
  ['histoire-du-soir-enfant-meilleures-idees', 'conte-pour-sendormir-histoires-personnalisees', 'histoire-du-soir-par-age-guide'].includes(a.slug)
);

// ─── Category Section Component ───

interface CategorySectionProps {
  title: string;
  articles: typeof blogArticles;
  categorySlug?: string;
}

const CategoryHubLink = styled(Link)`
  display: inline-block;
  margin-left: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.xl};
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
  color: var(--text-primary);
  background: transparent;
  border: 2px solid ${theme.colors.accent.lightCoral};
  border-radius: ${theme.borderRadius.full};
  text-decoration: none;
  transition: background ${theme.transitions.smooth}, color ${theme.transitions.smooth};

  &:hover {
    background: ${theme.colors.accent.lightCoral};
    color: #fff;
  }
`;

const CategorySection: React.FC<CategorySectionProps> = ({ title, articles, categorySlug }) => {
  const { ref, isVisible, getDelay } = useStaggerReveal(articles.length);

  return (
    <CategoryBlock ref={ref}>
      <CategoryTitle>{title}</CategoryTitle>
      {categorySlug && (
        <CategoryHubLink to={`/blog/categorie/${categorySlug}`}>
          Voir toute la catégorie →
        </CategoryHubLink>
      )}
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
        title="Blog Contedia — Guides, Comparatifs & Idées Livres Personnalisés Enfants"
        description="Guides pratiques, comparatifs honnêtes et idées cadeaux autour du livre personnalisé enfant. Conseils par âge, rituels lecture, alternatives Lunii/Toniebox."
      />
      <Helmet>
        <meta
          name="keywords"
          content="pourquoi offrir un livre personnalisé à un enfant, les avantages des contes personnalisés pour le développement de l'enfant, top 10 des cadeaux personnalisés pour enfants, comment choisir un conte adapté à l'âge de son enfant, blog contes personnalisés"
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

          <CategorySection title="Articles Récents" articles={recentArticles} />
          <CategorySection title="Comparatifs & Alternatives" articles={comparatifsArticles} categorySlug="conteuses" />
          <CategorySection title="Idées Cadeaux" articles={cadeauxArticles} categorySlug="cadeaux" />
          <CategorySection title="Rituels & Histoires du Soir" articles={rituelsArticles} categorySlug="sommeil" />
          <CategorySection title="Animaux de Compagnie" articles={animalArticles} categorySlug="animaux" />
          <CategorySection title="Foi et Spiritualité" articles={faithArticles} categorySlug="foi" />
          <CategorySection title="Nos Premiers Articles" articles={firstArticles} />
        </Container>
      </ContentSection>

      {/* ─── Final CTA ─── */}
      <FinalCTASection>
        <FinalCTATitle>Envie de créer votre propre conte ?</FinalCTATitle>
        <FinalCTAText>
          Offrez à votre enfant une aventure personnalisée unique, créée sur mesure grâce à l'intelligence artificielle.
        </FinalCTAText>
        <WhiteButton onClick={() => navigate('/create-story')}>
          Créer un conte personnalisé
        </WhiteButton>
      </FinalCTASection>

      <Footer />
    </PageContainer>
  );
};

export default BlogPage;

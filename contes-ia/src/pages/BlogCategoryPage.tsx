import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';

import { PageLayout } from '../components/layout/PageLayout';
import { SEOHead } from '../components/SEOHead';
import { SchemaBreadcrumb } from '../components/SchemaMarkup';
import { useStaggerReveal } from '../hooks/useScrollReveal';
import { theme } from '../styles/theme';
import {
  BLOG_CATEGORIES,
  getCategory,
  getCategoryArticles,
} from '../data/blogArticles';

// ─── Styled components ───

const HeroWrap = styled.section`
  padding: ${theme.spacing['3xl']} ${theme.spacing.lg} ${theme.spacing.xl};
  background: linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-soft, #fff7f3) 100%);
  text-align: center;
`;

const Crumbs = styled.nav`
  font-size: ${theme.fontSizes.sm};
  color: var(--text-secondary);
  margin-bottom: ${theme.spacing.lg};

  a {
    color: var(--text-secondary);
    text-decoration: none;

    &:hover {
      color: ${theme.colors.accent.lightCoral};
    }
  }

  span {
    margin: 0 ${theme.spacing.xs};
    color: var(--text-secondary);
  }
`;

const H1 = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['4xl']};
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.15;
  max-width: 820px;
  margin: 0 auto ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.fontSizes['3xl']};
  }
`;

const Intro = styled.p`
  font-size: ${theme.fontSizes.lg};
  color: var(--text-secondary);
  line-height: 1.7;
  max-width: 680px;
  margin: 0 auto ${theme.spacing.xl};
`;

const HeroCTA = styled(Link)`
  display: inline-block;
  padding: ${theme.spacing.md} ${theme.spacing['2xl']};
  background: ${theme.colors.accent.lightCoral};
  color: #fff;
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.base};
  font-weight: 700;
  border-radius: ${theme.borderRadius.full};
  text-decoration: none;
  box-shadow: ${theme.shadows.card};
  transition: transform ${theme.transitions.smooth}, box-shadow ${theme.transitions.smooth};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.cardHover};
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing['2xl']} ${theme.spacing.lg};
`;

const Grid = styled.div`
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

const Card = styled(Link)<{ $visible?: boolean; $delay?: string }>`
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

const CardImage = styled.div`
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f5f0ea;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform ${theme.transitions.smooth};
  }

  ${Card}:hover & img {
    transform: scale(1.06);
  }
`;

const CardContent = styled.div`
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

const SiblingHubsSection = styled.section`
  padding: ${theme.spacing['2xl']} ${theme.spacing.lg};
  background: var(--bg-soft, #fff7f3);
`;

const SiblingHubsTitle = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['2xl']};
  font-weight: 700;
  color: var(--text-primary);
  text-align: center;
  margin-bottom: ${theme.spacing.xl};
`;

const SiblingHubsGrid = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: ${theme.spacing.md};
`;

const SiblingHubCard = styled(Link)`
  display: block;
  padding: ${theme.spacing.lg};
  background: var(--bg-card);
  border-radius: ${theme.borderRadius.xl};
  text-decoration: none;
  color: inherit;
  border: 1px solid rgba(0, 0, 0, 0.06);
  text-align: center;
  font-family: ${theme.fonts.heading};
  font-weight: 600;
  transition: transform ${theme.transitions.smooth}, border-color ${theme.transitions.smooth};

  &:hover {
    transform: translateY(-3px);
    border-color: ${theme.colors.accent.lightCoral};
  }
`;

const FinalCTA = styled.section`
  padding: ${theme.spacing['3xl']} ${theme.spacing.lg};
  text-align: center;

  h2 {
    font-family: ${theme.fonts.heading};
    font-size: ${theme.fontSizes['3xl']};
    font-weight: 800;
    color: var(--text-primary);
    margin-bottom: ${theme.spacing.md};
  }

  p {
    font-size: ${theme.fontSizes.lg};
    color: var(--text-secondary);
    max-width: 580px;
    margin: 0 auto ${theme.spacing.xl};
    line-height: 1.6;
  }
`;

// ─── Component ───

const BlogCategoryPage: React.FC = () => {
  const { categorie } = useParams<{ categorie: string }>();
  const category = categorie ? getCategory(categorie) : undefined;
  const articles = category ? getCategoryArticles(category) : [];
  const { ref, isVisible, getDelay } = useStaggerReveal(articles.length);

  // Pas dans la map → redirige vers le hub blog (évite la 404 et préserve le jus)
  if (!category) {
    return <Navigate to="/blog" replace />;
  }

  const siblings = BLOG_CATEGORIES.filter(c => c.slug !== category.slug);

  const canonicalUrl = `https://contedia.fr/blog/categorie/${category.slug}`;

  // Schema ItemList — aide Google à comprendre qu'il s'agit d'une collection
  // d'articles autour d'un sujet (renforce le signal de cluster thématique).
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": category.h1,
    "description": category.metaDescription,
    "url": canonicalUrl,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": articles.map((a, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "url": `https://contedia.fr/blog/${a.slug}`,
        "name": a.title,
      })),
    },
  };

  return (
    <PageLayout>
      <SEOHead
        title={category.seoTitle}
        description={category.metaDescription}
        type="website"
      />
      <SchemaBreadcrumb
        items={[
          { name: "Accueil", url: "https://contedia.fr/" },
          { name: "Blog", url: "https://contedia.fr/blog" },
          { name: category.label, url: canonicalUrl },
        ]}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(itemListSchema)}</script>
      </Helmet>

      <HeroWrap>
        <Crumbs aria-label="Fil d'Ariane">
          <Link to="/">Accueil</Link>
          <span>›</span>
          <Link to="/blog">Blog</Link>
          <span>›</span>
          <span style={{ color: 'var(--text-primary)' }}>{category.label}</span>
        </Crumbs>
        <H1>{category.h1}</H1>
        <Intro>{category.intro}</Intro>
        <HeroCTA to="/create-story">Créer le 1er chapitre gratuit</HeroCTA>
      </HeroWrap>

      <Container ref={ref}>
        <Grid>
          {articles.map((a, i) => (
            <Card
              key={a.slug}
              to={`/blog/${a.slug}`}
              $visible={isVisible}
              $delay={getDelay(i)}
            >
              <CardImage>
                <img
                  src={`/images/blog/${a.image}.jpg`}
                  loading="lazy"
                  alt={a.title}
                  onError={e => {
                    const t = e.target as HTMLImageElement;
                    t.src = '/images/placeholder-blog.jpg';
                  }}
                />
              </CardImage>
              <CardContent>
                <h3>{a.title}</h3>
                <p>{a.excerpt}</p>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Container>

      <SiblingHubsSection>
        <SiblingHubsTitle>Explorer d'autres catégories</SiblingHubsTitle>
        <SiblingHubsGrid>
          {siblings.map(s => (
            <SiblingHubCard key={s.slug} to={`/blog/categorie/${s.slug}`}>
              {s.label}
            </SiblingHubCard>
          ))}
        </SiblingHubsGrid>
      </SiblingHubsSection>

      <FinalCTA>
        <h2>Et si l'histoire mettait en scène votre enfant ?</h2>
        <p>
          Premier chapitre gratuit, illustré, généré par IA. Avec le prénom et
          l'apparence de votre enfant — prêt en 5 minutes.
        </p>
        <HeroCTA to="/create-story">Créer mon premier chapitre gratuit</HeroCTA>
      </FinalCTA>
    </PageLayout>
  );
};

export default BlogCategoryPage;

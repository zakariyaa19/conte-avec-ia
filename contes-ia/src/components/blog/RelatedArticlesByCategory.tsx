import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { theme } from '../../styles/theme';
import {
  allArticles,
  getCategoryForArticle,
  getCategoryArticles,
} from '../../data/blogArticles';

/**
 * Auto-injecté par PageLayout. Sur les pages d'article /blog/:slug, surface
 * jusqu'à 3 articles frères du même cluster + CTA "Voir toute la catégorie".
 *
 * Objectif SEO : créer un lien article→hub en bas de chaque article (boucle
 * du silo thématique). Le composant rend null partout ailleurs.
 *
 * Note : ce composant ne fait QUE de l'UI. Le BreadcrumbList schema reste
 * géré par les composants <SchemaBreadcrumb> per-page.
 */

const MAX_RELATED = 3;

// ─── Styled ───

const Section = styled.aside`
  background: var(--bg-soft, #fff7f3);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  padding: ${theme.spacing['3xl']} ${theme.spacing.lg};
`;

const Inner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Eyebrow = styled.div`
  display: inline-block;
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  background: ${theme.colors.accent.lightCoral};
  color: #fff;
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.xs};
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  border-radius: ${theme.borderRadius.full};
  margin-bottom: ${theme.spacing.md};
`;

const Title = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['2xl']};
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 ${theme.spacing['2xl']};

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.xl};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled(Link)`
  display: flex;
  flex-direction: column;
  background: var(--bg-card);
  border-radius: ${theme.borderRadius['2xl']};
  overflow: hidden;
  box-shadow: ${theme.shadows.card};
  border: 1px solid rgba(0, 0, 0, 0.04);
  text-decoration: none;
  color: inherit;
  transition:
    transform ${theme.transitions.smooth},
    box-shadow ${theme.transitions.smooth},
    border-color ${theme.transitions.smooth};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${theme.shadows.cardHover};
    border-color: ${theme.colors.accent.lightCoral};
  }
`;

const Img = styled.div`
  width: 100%;
  height: 160px;
  overflow: hidden;
  background: #f5f0ea;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Body = styled.div`
  padding: ${theme.spacing.md} ${theme.spacing.lg} ${theme.spacing.lg};

  h3 {
    font-family: ${theme.fonts.heading};
    font-size: ${theme.fontSizes.base};
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

const HubCTA = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  margin-top: ${theme.spacing['2xl']};
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  background: transparent;
  color: var(--text-primary);
  border: 2px solid var(--text-primary);
  border-radius: ${theme.borderRadius.full};
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.base};
  font-weight: 700;
  text-decoration: none;
  transition:
    background ${theme.transitions.smooth},
    color ${theme.transitions.smooth},
    transform ${theme.transitions.smooth};

  &:hover {
    background: var(--text-primary);
    color: var(--bg-primary);
    transform: translateY(-2px);
  }
`;

// ─── Component ───

const pickRelated = (currentSlug: string) => {
  const category = getCategoryForArticle(currentSlug);
  if (!category) return null;

  const siblings = getCategoryArticles(category).filter(a => a.slug !== currentSlug);
  if (siblings.length === 0) return null;

  return {
    category,
    siblings: siblings.slice(0, MAX_RELATED),
  };
};

export const RelatedArticlesByCategory: React.FC = () => {
  const location = useLocation();
  const match = location.pathname.match(/^\/blog\/([a-z0-9-]+)$/);
  if (!match) return null;

  const slug = match[1];

  // Sanity : si le slug n'existe pas dans la SSOT on ne sait pas mailler.
  if (!allArticles.find(a => a.slug === slug)) return null;

  const related = pickRelated(slug);
  if (!related) return null;

  const { category, siblings } = related;

  return (
    <Section aria-label="Articles similaires">
      <Inner>
        <Eyebrow>Catégorie · {category.label}</Eyebrow>
        <Title>Continuer dans {category.label.toLowerCase()}</Title>

        <Grid>
          {siblings.map(a => (
            <Card key={a.slug} to={`/blog/${a.slug}`}>
              <Img>
                <img
                  src={`/images/blog/${a.image}.jpg`}
                  loading="lazy"
                  alt={a.title}
                  onError={e => {
                    const t = e.target as HTMLImageElement;
                    t.src = '/images/placeholder-blog.jpg';
                  }}
                />
              </Img>
              <Body>
                <h3>{a.title}</h3>
              </Body>
            </Card>
          ))}
        </Grid>

        <HubCTA to={`/blog/categorie/${category.slug}`}>
          Voir toute la catégorie {category.label} →
        </HubCTA>
      </Inner>
    </Section>
  );
};

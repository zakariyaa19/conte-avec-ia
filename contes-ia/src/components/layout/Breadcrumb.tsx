import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { theme } from '../../styles/theme';
import {
  allArticles,
  getCategoryForArticle,
} from '../../data/blogArticles';

// ─── Labels des routes statiques (pages SEO/landing) ───
// Map limitée volontairement : on n'inclut que les pages où un breadcrumb
// apporte de la valeur. Pour les paths non listés, le composant rend null.

const ROUTE_LABELS: Record<string, string> = {
  '/blog': 'Blog',
  '/exemples': 'Exemples',
  '/club': 'Club',
  '/club/checkout': 'Abonnement Club',
  '/tarifs': 'Tarifs',
  '/a-propos': 'À propos',
  '/livre-personnalise-enfant': 'Livre personnalisé enfant',
  '/conte-personnalise': 'Conte personnalisé',
  '/ia-creation-conte': 'IA & création de contes',
  '/themes-de-contes': 'Thèmes de contes',
  '/contes-par-age': 'Contes par âge',
  '/styles-illustration': "Styles d'illustration",
  '/contes-multilingues': 'Contes multilingues',
  '/valeurs-educatives': 'Valeurs éducatives',
  '/idees-cadeaux': 'Idées cadeaux',
  '/prenoms': 'Prénoms',
  '/mentions-legales': 'Mentions légales',
  '/politique-confidentialite': 'Politique de confidentialité',
  '/conditions-generales-de-vente': 'CGV',
};

const TRANCHE_AGE_LABELS: Record<string, string> = {
  'bebe-0-2-ans': 'Bébé (0-2 ans)',
  '3-5-ans': '3-5 ans',
  '6-8-ans': '6-8 ans',
  '9-12-ans': '9-12 ans',
};

// ─── Crumb resolution ───

interface Crumb {
  label: string;
  to?: string; // si absent → crumb non-cliquable (page courante)
}

const titleCase = (s: string): string =>
  s
    .split('-')
    .map(w => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ');

/**
 * Construit la liste de crumbs pour un pathname donné.
 * Retourne null si le breadcrumb ne doit PAS être rendu (home, hubs avec crumb
 * propre, paths inconnus sans valeur SEO).
 */
const resolveCrumbs = (pathname: string): Crumb[] | null => {
  // Normalise : enlève le slash final éventuel
  const path = pathname.replace(/\/+$/, '') || '/';

  // Home : pas de breadcrumb (la home ne passe pas par PageLayout, défensif)
  if (path === '/') return null;

  // Hubs de catégorie : ont leur propre fil d'Ariane riche dans le composant
  if (path.startsWith('/blog/categorie/')) return null;

  const base: Crumb[] = [{ label: 'Accueil', to: '/' }];

  // Article de blog : Accueil › Blog › [Catégorie?] › [Titre article]
  const blogMatch = path.match(/^\/blog\/([a-z0-9-]+)$/);
  if (blogMatch) {
    const slug = blogMatch[1];
    const article = allArticles.find(a => a.slug === slug);
    const category = getCategoryForArticle(slug);

    base.push({ label: 'Blog', to: '/blog' });
    if (category) {
      base.push({ label: category.label, to: `/blog/categorie/${category.slug}` });
    }
    if (article) {
      base.push({ label: article.title });
    } else {
      // Article routé non présent en SSOT : fallback titre de-slugifié
      base.push({ label: titleCase(slug) });
    }
    return base;
  }

  // /contes-par-age/:tranche → Accueil › Contes par âge › [Tranche]
  const trancheMatch = path.match(/^\/contes-par-age\/([a-z0-9-]+)$/);
  if (trancheMatch) {
    const tranche = trancheMatch[1];
    base.push({ label: 'Contes par âge', to: '/contes-par-age' });
    base.push({ label: TRANCHE_AGE_LABELS[tranche] || titleCase(tranche) });
    return base;
  }

  // /prenom/:nom → Accueil › Prénoms › [Nom]
  const prenomMatch = path.match(/^\/prenom\/([a-z]+)$/);
  if (prenomMatch) {
    base.push({ label: 'Prénoms', to: '/prenoms' });
    base.push({ label: titleCase(prenomMatch[1]) });
    return base;
  }

  // Route statique connue (landing page de premier niveau)
  if (ROUTE_LABELS[path]) {
    base.push({ label: ROUTE_LABELS[path] });
    return base;
  }

  // Sous-chemin connu (ex: /club/checkout)
  // On peut tenter de remonter d'un cran si le parent est connu.
  const segments = path.split('/').filter(Boolean);
  if (segments.length === 2) {
    const parent = '/' + segments[0];
    if (ROUTE_LABELS[parent]) {
      base.push({ label: ROUTE_LABELS[parent], to: parent });
      const childLabel = ROUTE_LABELS[path] || titleCase(segments[1]);
      base.push({ label: childLabel });
      return base;
    }
  }

  // Path inconnu : on ne rend rien plutôt qu'un fil approximatif.
  return null;
};

// ─── Styled UI ───

const Nav = styled.nav`
  background: var(--bg-soft, #fff7f3);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  font-size: ${theme.fontSizes.sm};
`;

const Inner = styled.ol`
  max-width: 1200px;
  margin: 0 auto;
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${theme.spacing.xs};
  color: var(--text-secondary);

  /* On tronque proprement le dernier crumb si très long (titres d'articles) */
  li:last-child {
    color: var(--text-primary);
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 60ch;

    @media (max-width: ${theme.breakpoints.sm}) {
      max-width: 28ch;
    }
  }
`;

const Sep = styled.span`
  color: var(--text-secondary);
  opacity: 0.5;
  padding: 0 ${theme.spacing.xs};
`;

const CrumbLink = styled(Link)`
  color: var(--text-secondary);
  text-decoration: none;

  &:hover {
    color: ${theme.colors.accent.lightCoral};
    text-decoration: underline;
  }
`;

// ─── Component ───

export const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const crumbs = resolveCrumbs(location.pathname);

  if (!crumbs || crumbs.length < 2) return null;

  return (
    <Nav aria-label="Fil d'Ariane">
      <Inner>
        {crumbs.map((c, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <React.Fragment key={`${i}-${c.label}`}>
              <li>
                {c.to && !isLast ? (
                  <CrumbLink to={c.to}>{c.label}</CrumbLink>
                ) : (
                  <span>{c.label}</span>
                )}
              </li>
              {!isLast && <Sep aria-hidden="true">›</Sep>}
            </React.Fragment>
          );
        })}
      </Inner>
    </Nav>
  );
};

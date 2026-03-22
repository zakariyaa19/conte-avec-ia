import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  type?: string;
  noindex?: boolean;
}

/**
 * Composant SEO universel — ajoute automatiquement :
 * - Canonical URL (basée sur le pathname actuel)
 * - Open Graph tags (titre, description, image, URL)
 * - Twitter card
 * - Hreflang fr pour les marchés francophones
 * - Noindex si nécessaire (pages admin, dashboard)
 *
 * Usage : <SEOHead title="Mon Titre" description="Ma description" />
 * Sans props : utilise les valeurs par défaut du site
 */
export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  image,
  type = 'website',
  noindex = false,
}) => {
  const location = useLocation();
  const baseUrl = 'https://contedia.fr';
  const canonicalUrl = `${baseUrl}${location.pathname}`;
  const defaultTitle = 'Créez un conte personnalisé avec l\'IA | Contes d\'IA';
  const defaultDescription = 'Créez un livre personnalisé gratuit pour votre enfant. Histoire unique générée par IA avec illustrations sur mesure. Prêt en 5 minutes.';
  const defaultImage = `${baseUrl}/images/og-image.png`;

  const pageTitle = title || defaultTitle;
  const pageDescription = description || defaultDescription;
  const pageImage = image?.startsWith('http') ? image : `${baseUrl}${image || '/images/og-image.png'}`;

  return (
    <Helmet>
      {/* Canonical */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Title & Description */}
      {title && <title>{pageTitle}</title>}
      <meta name="description" content={pageDescription} />

      {/* Robots */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:site_name" content="Contes d'IA" />
      <meta property="og:locale" content="fr_FR" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />

      {/* Hreflang — marchés francophones */}
      <link rel="alternate" hrefLang="fr" href={canonicalUrl} />
      <link rel="alternate" hrefLang="fr-FR" href={canonicalUrl} />
      <link rel="alternate" hrefLang="fr-BE" href={canonicalUrl} />
      <link rel="alternate" hrefLang="fr-CH" href={canonicalUrl} />
      <link rel="alternate" hrefLang="fr-CA" href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
    </Helmet>
  );
};

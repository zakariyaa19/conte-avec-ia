import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * Schema Organization — identifie l'entreprise pour Google
 * Affiche le nom, logo, réseaux sociaux dans les résultats
 */
export const SchemaOrganization: React.FC = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Contedia",
    "alternateName": "Contes d'IA",
    "url": "https://contedia.fr",
    "logo": "https://contedia.fr/logo-conte-ia.png",
    "description": "Créez des livres personnalisés pour enfants grâce à l'intelligence artificielle. Histoires uniques, illustrations sur mesure, premier livre gratuit.",
    "foundingDate": "2025",
    "sameAs": [
      "https://www.facebook.com/contedia",
      "https://www.instagram.com/contedia.fr"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": ["French"]
    },
    "offers": {
      "@type": "Offer",
      "name": "Premier livre personnalisé gratuit",
      "price": "0",
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

/**
 * Schema WebSite + SearchAction — active la barre de recherche Google
 */
export const SchemaWebSite: React.FC = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Contedia",
    "alternateName": "Contes d'IA",
    "url": "https://contedia.fr"
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

/**
 * Schema Product — pour la page Club (abonnement)
 * Affiche le prix dans les résultats Google
 */
export const SchemaProduct: React.FC<{
  name: string;
  description: string;
  price: string;
  priceCurrency?: string;
  image?: string;
}> = ({ name, description, price, priceCurrency = 'EUR', image }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": name,
    "description": description,
    "brand": { "@type": "Brand", "name": "Contedia" },
    "image": image || "https://contedia.fr/images/og-image.png",
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": priceCurrency,
      "availability": "https://schema.org/InStock",
      "seller": { "@type": "Organization", "name": "Contedia" }
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

/**
 * Schema FAQ — pour les pages avec questions fréquentes
 * Affiche les questions directement dans Google (rich snippets)
 */
export const SchemaFAQ: React.FC<{
  questions: { question: string; answer: string }[];
}> = ({ questions }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": questions.map(q => ({
      "@type": "Question",
      "name": q.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": q.answer
      }
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

/**
 * Schema BreadcrumbList — fil d'Ariane pour les articles de blog
 */
export const SchemaBreadcrumb: React.FC<{
  items: { name: string; url: string }[];
}> = ({ items }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

/**
 * Schema HowTo — pour les pages avec des étapes/tutoriels
 * Affiche les étapes directement dans Google (rich snippets)
 */
export const SchemaHowTo: React.FC<{
  name: string;
  description: string;
  totalTime?: string;
  steps: { name: string; text: string; image?: string }[];
}> = ({ name, description, totalTime, steps }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": name,
    "description": description,
    ...(totalTime && { "totalTime": totalTime }),
    "step": steps.map((s, i) => ({
      "@type": "HowToStep",
      "position": i + 1,
      "name": s.name,
      "text": s.text,
      ...(s.image && { "image": s.image }),
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

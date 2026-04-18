import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { SEOHead } from '../components/SEOHead';
import { SchemaFAQ, SchemaBreadcrumb } from '../components/SchemaMarkup';
import { Helmet } from 'react-helmet-async';
import '../styles/BlogArticle.css';

/**
 * Programmatic SEO — Page par prénom (Phase 5 devbook SEO)
 * Route: /prenom/:prenom
 * Exemple: /prenom/emma → "L'histoire personnalisée de Emma"
 *
 * Chaque page cible: "histoire de {prénom}", "livre personnalisé {prénom}"
 * Template unique, contenu dynamique basé sur le prénom.
 */

// Top 50 prénoms français avec genre et popularité
const PRENOMS_DATA: Record<string, { gender: 'fille' | 'garcon'; popularity: string; origin: string }> = {
  emma: { gender: 'fille', popularity: 'Top 1 depuis 2005', origin: 'germanique' },
  gabriel: { gender: 'garcon', popularity: 'Top 1 des garçons', origin: 'hébreu' },
  louise: { gender: 'fille', popularity: 'Top 3', origin: 'germanique' },
  raphael: { gender: 'garcon', popularity: 'Top 3', origin: 'hébreu' },
  jade: { gender: 'fille', popularity: 'Top 2', origin: 'espagnol' },
  leo: { gender: 'garcon', popularity: 'Top 5', origin: 'latin' },
  alice: { gender: 'fille', popularity: 'Top 5', origin: 'germanique' },
  louis: { gender: 'garcon', popularity: 'Top 5', origin: 'germanique' },
  rose: { gender: 'fille', popularity: 'Top 10', origin: 'latin' },
  noah: { gender: 'garcon', popularity: 'Top 5', origin: 'hébreu' },
  chloe: { gender: 'fille', popularity: 'Top 10', origin: 'grec' },
  adam: { gender: 'garcon', popularity: 'Top 10', origin: 'hébreu' },
  lina: { gender: 'fille', popularity: 'Top 10', origin: 'arabe' },
  lucas: { gender: 'garcon', popularity: 'Top 10', origin: 'latin' },
  mia: { gender: 'fille', popularity: 'Top 10', origin: 'scandinave' },
  arthur: { gender: 'garcon', popularity: 'Top 10', origin: 'celtique' },
  ambre: { gender: 'fille', popularity: 'Top 15', origin: 'arabe' },
  jules: { gender: 'garcon', popularity: 'Top 10', origin: 'latin' },
  anna: { gender: 'fille', popularity: 'Top 15', origin: 'hébreu' },
  hugo: { gender: 'garcon', popularity: 'Top 15', origin: 'germanique' },
  lea: { gender: 'fille', popularity: 'Top 10', origin: 'hébreu' },
  maël: { gender: 'garcon', popularity: 'Top 15', origin: 'celtique' },
  luna: { gender: 'fille', popularity: 'Top 20', origin: 'latin' },
  liam: { gender: 'garcon', popularity: 'Top 10', origin: 'irlandais' },
  julia: { gender: 'fille', popularity: 'Top 20', origin: 'latin' },
  ethan: { gender: 'garcon', popularity: 'Top 15', origin: 'hébreu' },
  manon: { gender: 'fille', popularity: 'Top 15', origin: 'hébreu' },
  nathan: { gender: 'garcon', popularity: 'Top 10', origin: 'hébreu' },
  elena: { gender: 'fille', popularity: 'Top 20', origin: 'grec' },
  tom: { gender: 'garcon', popularity: 'Top 20', origin: 'araméen' },
  agathe: { gender: 'fille', popularity: 'Top 20', origin: 'grec' },
  paul: { gender: 'garcon', popularity: 'Top 20', origin: 'latin' },
  camille: { gender: 'fille', popularity: 'Top 15', origin: 'latin' },
  sacha: { gender: 'garcon', popularity: 'Top 20', origin: 'grec' },
  charlie: { gender: 'fille', popularity: 'Top 25', origin: 'germanique' },
  mohamed: { gender: 'garcon', popularity: 'Top 20', origin: 'arabe' },
  yasmine: { gender: 'fille', popularity: 'Top 30', origin: 'arabe' },
  rayan: { gender: 'garcon', popularity: 'Top 20', origin: 'arabe' },
  ines: { gender: 'fille', popularity: 'Top 15', origin: 'arabe' },
  nolan: { gender: 'garcon', popularity: 'Top 20', origin: 'irlandais' },
  sarah: { gender: 'fille', popularity: 'Top 15', origin: 'hébreu' },
  theo: { gender: 'garcon', popularity: 'Top 15', origin: 'grec' },
  clara: { gender: 'fille', popularity: 'Top 20', origin: 'latin' },
  aaron: { gender: 'garcon', popularity: 'Top 20', origin: 'hébreu' },
  charlotte: { gender: 'fille', popularity: 'Top 20', origin: 'germanique' },
  gabin: { gender: 'garcon', popularity: 'Top 25', origin: 'latin' },
  victoria: { gender: 'fille', popularity: 'Top 25', origin: 'latin' },
  robin: { gender: 'garcon', popularity: 'Top 25', origin: 'germanique' },
  lily: { gender: 'fille', popularity: 'Top 25', origin: 'anglais' },
  martin: { gender: 'garcon', popularity: 'Top 30', origin: 'latin' },
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

const PrenomPage: React.FC = () => {
  const { prenom } = useParams<{ prenom: string }>();
  const prenomLower = (prenom || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const prenomDisplay = capitalize(prenom || 'votre enfant');
  const data = PRENOMS_DATA[prenomLower];
  const gender = data?.gender || 'garcon';
  const heroWord = gender === 'fille' ? 'héroïne' : 'héros';
  const ilElle = gender === 'fille' ? 'elle' : 'il';
  const sonSa = gender === 'fille' ? 'sa' : 'son';

  const themes = useMemo(() => {
    const all = [
      { name: 'Aventure', desc: `${prenomDisplay} part explorer un monde inconnu, résout des énigmes et découvre un trésor caché.` },
      { name: 'Animaux', desc: `${prenomDisplay} rencontre un animal magique qui devient ${sonSa} meilleur(e) ami(e) d'aventure.` },
      { name: 'Espace', desc: `${prenomDisplay} voyage à bord d'une fusée et découvre une planète où tout est possible.` },
      { name: 'Magie', desc: `${prenomDisplay} découvre qu'${ilElle} a un pouvoir secret et doit sauver un royaume enchanté.` },
      { name: 'Amitié', desc: `${prenomDisplay} apprend la valeur de l'amitié en aidant un nouveau voisin à s'intégrer.` },
      { name: 'Nature', desc: `${prenomDisplay} explore une forêt mystérieuse et apprend à protéger l'environnement.` },
    ];
    return all;
  }, [prenomDisplay, sonSa, ilElle]);

  const faqQuestions = [
    {
      question: `Comment créer un livre personnalisé pour ${prenomDisplay} ?`,
      answer: `Sur Contedia, entrez le prénom "${prenomDisplay}", choisissez l'âge, les passions et un thème. L'IA écrit une histoire unique où ${prenomDisplay} est le ${heroWord}. Illustrations personnalisées incluses. Premier livre gratuit, prêt en 5 minutes.`,
    },
    {
      question: `Quel type d'histoire convient le mieux à ${prenomDisplay} ?`,
      answer: `Cela dépend de l'âge et des passions de ${prenomDisplay}. Pour les 3-5 ans : animaux, magie, famille. Pour les 6-8 ans : aventure, espace, mystère. Vous choisissez le thème, l'IA adapte le vocabulaire et la complexité.`,
    },
    {
      question: `Le prénom ${prenomDisplay} apparaît-il vraiment dans toute l'histoire ?`,
      answer: `Oui, "${prenomDisplay}" est intégré(e) naturellement dans chaque page de l'histoire — pas juste sur la couverture. L'IA écrit chaque phrase en utilisant le prénom, les passions et le contexte que vous avez fournis.`,
    },
    {
      question: `Peut-on ajouter une photo de ${prenomDisplay} dans le livre ?`,
      answer: `Oui, c'est optionnel mais magique. Uploadez une photo et l'IA génère des illustrations où le personnage principal ressemble à ${prenomDisplay}. Sans photo, l'IA crée un personnage adapté à l'âge et au genre.`,
    },
    {
      question: `Combien coûte un livre personnalisé pour ${prenomDisplay} ?`,
      answer: `Le premier livre est 100% gratuit (6 pages, 7 illustrations, PDF). Les suivants : 2,99€ par livre complet (12 pages) ou 9,99€/mois pour le Club (4 livres par mois). Aucune carte bancaire pour le gratuit.`,
    },
  ];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `Livre Personnalisé pour ${prenomDisplay} — Histoire Unique avec Son Prénom`,
    "description": `Créez un livre personnalisé gratuit pour ${prenomDisplay}. ${capitalize(prenomDisplay)} devient le ${heroWord} de sa propre histoire illustrée.`,
    "author": { "@type": "Organization", "name": "Contedia", "url": "https://contedia.fr" },
    "publisher": { "@type": "Organization", "name": "Contedia", "logo": { "@type": "ImageObject", "url": "https://contedia.fr/logo-conte-ia.png" } },
    "datePublished": "2026-04-18",
    "dateModified": "2026-04-18",
  };

  return (
    <PageLayout>
      <SEOHead
        title={`Histoire Personnalisée de ${prenomDisplay} — Livre Unique Gratuit | Contedia`}
        description={`Créez un livre personnalisé gratuit pour ${prenomDisplay}. ${prenomDisplay} devient le ${heroWord} de son propre conte illustré par IA. Prénom intégré dans chaque page. Prêt en 5 min.`}
        type="article"
      />
      <SchemaFAQ questions={faqQuestions} />
      <SchemaBreadcrumb items={[
        { name: "Accueil", url: "https://contedia.fr/" },
        { name: "Prénoms", url: "https://contedia.fr/prenom" },
        { name: prenomDisplay, url: `https://contedia.fr/prenom/${prenomLower}` },
      ]} />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
      </Helmet>

      <div className="article-container">
        <div className="article-breadcrumb">
          <Link to="/">Accueil</Link> / <Link to="/blog">Prénoms</Link> / {prenomDisplay}
        </div>

        <div className="article-layout">
          <div className="article-main">
            <div className="article-header">
              <h1>L'Histoire Personnalisée de {prenomDisplay} : Un Livre Où {ilElle === 'elle' ? 'Elle' : 'Il'} Est le {capitalize(heroWord)}</h1>
              <div className="article-meta">
                <span>Par l'équipe Contedia · {data ? `${prenomDisplay} : ${data.popularity} en France` : `Prénom ${prenomDisplay}`}</span>
              </div>
            </div>

            <div className="article-content">
              <p className="article-intro">
                <strong>{prenomDisplay}</strong>, {heroWord} de sa propre histoire. Imaginez un livre où chaque page prononce le prénom de votre enfant, où les illustrations le représentent, où l'aventure est écrite <strong>rien que pour {ilElle}</strong>. C'est exactement ce que vous allez créer — en 5 minutes, gratuitement.
              </p>

              <div className="article-cta">
                <Link to="/create-story" className="cta-button">
                  Créer l'histoire de {prenomDisplay} gratuitement
                </Link>
              </div>

              <h2>Ce que {prenomDisplay} va découvrir dans son livre</h2>
              <p>
                Sur <Link to="/livre-personnalise-enfant">Contedia</Link>, l'intelligence artificielle écrit un conte <strong>100% unique</strong> pour {prenomDisplay}. Pas un texte générique avec un prénom collé dessus — une vraie histoire originale où {prenomDisplay} vit une aventure adaptée à son âge et ses passions.
              </p>
              <ul>
                <li><strong>Le prénom "{prenomDisplay}" dans chaque page</strong> — intégré naturellement dans le récit, pas juste sur la couverture</li>
                <li><strong>Des illustrations personnalisées</strong> — le personnage principal correspond au profil de {prenomDisplay}</li>
                <li><strong>Un thème choisi par vous</strong> — aventure, animaux, magie, amitié, espace...</li>
                <li><strong>Un vocabulaire adapté</strong> — l'IA ajuste la complexité selon l'âge de {prenomDisplay}</li>
              </ul>

              <h2>6 idées d'histoires pour {prenomDisplay}</h2>
              {themes.map((t, i) => (
                <div key={i} style={{ marginBottom: 16 }}>
                  <h3>{t.name}</h3>
                  <p>{t.desc}</p>
                </div>
              ))}
              <p>
                Et ce ne sont que des exemples. <Link to="/themes-de-contes">Découvrez tous les thèmes disponibles</Link> — ou inventez le vôtre avec le champ libre.
              </p>

              <div className="article-cta">
                <Link to="/create-story" className="cta-button">
                  Créer l'aventure de {prenomDisplay} →
                </Link>
              </div>

              <h2>Comment créer le livre de {prenomDisplay} en 3 étapes</h2>
              <ol>
                <li><strong>Remplissez le formulaire</strong> (2 min) — prénom, âge, passions, thème. <Link to="/create-story">Commencer ici</Link>.</li>
                <li><strong>L'IA écrit et illustre</strong> (3 min) — chaque phrase, chaque image est créée pour {prenomDisplay}.</li>
                <li><strong>Recevez le livre</strong> — par email en PDF + dans votre bibliothèque en ligne. Lisez-le avec {prenomDisplay} ce soir.</li>
              </ol>
              <p>
                Le premier livre est <strong>100% gratuit</strong>, <Link to="/blog/conte-personnalise-gratuit">sans carte bancaire</Link>. Si vous aimez, créez d'autres histoires pour {prenomDisplay} avec le <Link to="/club">Club Contedia</Link> (4 livres/mois).
              </p>

              {data && (
                <>
                  <h2>Le prénom {prenomDisplay} : origine et signification</h2>
                  <p>
                    <strong>{prenomDisplay}</strong> est un prénom d'origine <strong>{data.origin}</strong>, classé <strong>{data.popularity}</strong> en France. C'est l'un des prénoms les plus donnés aux {data.gender === 'fille' ? 'filles' : 'garçons'} — et autant d'enfants qui méritent leur propre histoire.
                  </p>
                  <p>
                    Sur Contedia, +500 familles ont déjà créé un livre pour leur enfant. Parmi elles, de nombreux petits {prenomDisplay} qui ont découvert le plaisir de se voir en {heroWord} de leur propre conte.
                  </p>
                </>
              )}

              <div className="article-cta">
                <Link to="/create-story" className="cta-button">
                  Offrir son livre à {prenomDisplay} — C'est gratuit
                </Link>
              </div>

              <h2 id="faq">Questions fréquentes sur le livre de {prenomDisplay}</h2>
              {faqQuestions.map((faq, i) => (
                <div key={i} style={{ marginBottom: 20 }}>
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </div>
              ))}

              <div className="article-cta">
                <Link to="/create-story" className="cta-button">
                  Créer l'histoire de {prenomDisplay} maintenant
                </Link>
              </div>

              <p style={{ fontSize: 13, color: '#999', marginTop: 32, textAlign: 'center' }}>
                Contedia · Chaque enfant mérite d'être le {heroWord} de sa propre histoire.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default PrenomPage;

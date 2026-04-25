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

// Top 50 prénoms français avec genre, popularité, signification et prénoms similaires
const PRENOMS_DATA: Record<string, { gender: 'fille' | 'garcon'; popularity: string; origin: string; meaning: string; relatedNames: string[] }> = {
  emma: { gender: 'fille', popularity: 'Top 1 depuis 2005', origin: 'germanique', meaning: 'Toute entière, universelle', relatedNames: ['alice', 'louise', 'rose', 'charlotte', 'anna'] },
  gabriel: { gender: 'garcon', popularity: 'Top 1 des garçons', origin: 'hébreu', meaning: 'Force de Dieu', relatedNames: ['raphael', 'nathan', 'adam', 'noah', 'aaron'] },
  louise: { gender: 'fille', popularity: 'Top 3', origin: 'germanique', meaning: 'Illustre au combat', relatedNames: ['alice', 'charlotte', 'emma', 'rose', 'victoria'] },
  raphael: { gender: 'garcon', popularity: 'Top 3', origin: 'hébreu', meaning: 'Dieu guérit', relatedNames: ['gabriel', 'nathan', 'adam', 'ethan', 'aaron'] },
  jade: { gender: 'fille', popularity: 'Top 2', origin: 'espagnol', meaning: 'Pierre précieuse verte', relatedNames: ['ambre', 'luna', 'lily', 'rose', 'mia'] },
  leo: { gender: 'garcon', popularity: 'Top 5', origin: 'latin', meaning: 'Lion', relatedNames: ['lucas', 'jules', 'paul', 'gabin', 'martin'] },
  alice: { gender: 'fille', popularity: 'Top 5', origin: 'germanique', meaning: 'De noble lignée', relatedNames: ['louise', 'emma', 'charlotte', 'charlie', 'rose'] },
  louis: { gender: 'garcon', popularity: 'Top 5', origin: 'germanique', meaning: 'Illustre au combat', relatedNames: ['hugo', 'arthur', 'robin', 'jules', 'paul'] },
  rose: { gender: 'fille', popularity: 'Top 10', origin: 'latin', meaning: 'La fleur', relatedNames: ['lily', 'jade', 'clara', 'victoria', 'emma'] },
  noah: { gender: 'garcon', popularity: 'Top 5', origin: 'hébreu', meaning: 'Repos, consolation', relatedNames: ['adam', 'gabriel', 'nathan', 'ethan', 'aaron'] },
  chloe: { gender: 'fille', popularity: 'Top 10', origin: 'grec', meaning: 'Jeune pousse, verdure', relatedNames: ['elena', 'agathe', 'lea', 'julia', 'manon'] },
  adam: { gender: 'garcon', popularity: 'Top 10', origin: 'hébreu', meaning: 'Fait de terre rouge', relatedNames: ['noah', 'gabriel', 'aaron', 'nathan', 'ethan'] },
  lina: { gender: 'fille', popularity: 'Top 10', origin: 'arabe', meaning: 'Douce, tendre', relatedNames: ['ines', 'yasmine', 'ambre', 'mia', 'luna'] },
  lucas: { gender: 'garcon', popularity: 'Top 10', origin: 'latin', meaning: 'Lumière', relatedNames: ['leo', 'jules', 'gabin', 'paul', 'martin'] },
  mia: { gender: 'fille', popularity: 'Top 10', origin: 'scandinave', meaning: 'Celle qui est aimée', relatedNames: ['luna', 'lina', 'lily', 'jade', 'lea'] },
  arthur: { gender: 'garcon', popularity: 'Top 10', origin: 'celtique', meaning: 'Ours, fort comme un ours', relatedNames: ['maël', 'louis', 'hugo', 'robin', 'liam'] },
  ambre: { gender: 'fille', popularity: 'Top 15', origin: 'arabe', meaning: 'Pierre précieuse dorée', relatedNames: ['jade', 'lina', 'yasmine', 'ines', 'luna'] },
  jules: { gender: 'garcon', popularity: 'Top 10', origin: 'latin', meaning: 'De la famille de Jule', relatedNames: ['leo', 'lucas', 'paul', 'gabin', 'louis'] },
  anna: { gender: 'fille', popularity: 'Top 15', origin: 'hébreu', meaning: 'Grâce, faveur', relatedNames: ['emma', 'lea', 'sarah', 'manon', 'clara'] },
  hugo: { gender: 'garcon', popularity: 'Top 15', origin: 'germanique', meaning: 'Esprit, intelligence', relatedNames: ['louis', 'arthur', 'robin', 'theo', 'jules'] },
  lea: { gender: 'fille', popularity: 'Top 10', origin: 'hébreu', meaning: 'Lionne, celle qui est fatiguée', relatedNames: ['anna', 'sarah', 'manon', 'chloe', 'julia'] },
  maël: { gender: 'garcon', popularity: 'Top 15', origin: 'celtique', meaning: 'Prince, chef', relatedNames: ['arthur', 'liam', 'nolan', 'robin', 'hugo'] },
  luna: { gender: 'fille', popularity: 'Top 20', origin: 'latin', meaning: 'Lune', relatedNames: ['mia', 'lily', 'jade', 'lina', 'ambre'] },
  liam: { gender: 'garcon', popularity: 'Top 10', origin: 'irlandais', meaning: 'Protecteur résolu', relatedNames: ['nolan', 'arthur', 'maël', 'ethan', 'noah'] },
  julia: { gender: 'fille', popularity: 'Top 20', origin: 'latin', meaning: 'De la famille de Jule', relatedNames: ['camille', 'clara', 'victoria', 'elena', 'chloe'] },
  ethan: { gender: 'garcon', popularity: 'Top 15', origin: 'hébreu', meaning: 'Fort, robuste, endurant', relatedNames: ['nathan', 'noah', 'adam', 'liam', 'aaron'] },
  manon: { gender: 'fille', popularity: 'Top 15', origin: 'hébreu', meaning: 'Goutte de mer, celle qui élève', relatedNames: ['lea', 'anna', 'sarah', 'camille', 'chloe'] },
  nathan: { gender: 'garcon', popularity: 'Top 10', origin: 'hébreu', meaning: 'Il a donné, don de Dieu', relatedNames: ['gabriel', 'raphael', 'ethan', 'noah', 'adam'] },
  elena: { gender: 'fille', popularity: 'Top 20', origin: 'grec', meaning: 'Éclat du soleil', relatedNames: ['chloe', 'agathe', 'julia', 'victoria', 'clara'] },
  tom: { gender: 'garcon', popularity: 'Top 20', origin: 'araméen', meaning: 'Jumeau', relatedNames: ['theo', 'hugo', 'sacha', 'robin', 'nolan'] },
  agathe: { gender: 'fille', popularity: 'Top 20', origin: 'grec', meaning: 'Bonne, vertueuse', relatedNames: ['chloe', 'elena', 'charlotte', 'alice', 'camille'] },
  paul: { gender: 'garcon', popularity: 'Top 20', origin: 'latin', meaning: 'Petit, humble', relatedNames: ['jules', 'lucas', 'leo', 'martin', 'gabin'] },
  camille: { gender: 'fille', popularity: 'Top 15', origin: 'latin', meaning: 'Jeune assistante de cérémonie', relatedNames: ['julia', 'manon', 'charlotte', 'agathe', 'clara'] },
  sacha: { gender: 'garcon', popularity: 'Top 20', origin: 'grec', meaning: 'Défenseur de l\'humanité', relatedNames: ['theo', 'tom', 'robin', 'hugo', 'nolan'] },
  charlie: { gender: 'fille', popularity: 'Top 25', origin: 'germanique', meaning: 'Femme du peuple', relatedNames: ['alice', 'charlotte', 'louise', 'lily', 'emma'] },
  mohamed: { gender: 'garcon', popularity: 'Top 20', origin: 'arabe', meaning: 'Le loué, le digne de louanges', relatedNames: ['rayan', 'adam', 'aaron', 'noah', 'nathan'] },
  yasmine: { gender: 'fille', popularity: 'Top 30', origin: 'arabe', meaning: 'Fleur de jasmin', relatedNames: ['lina', 'ines', 'ambre', 'sarah', 'luna'] },
  rayan: { gender: 'garcon', popularity: 'Top 20', origin: 'arabe', meaning: 'Porte du paradis, épanoui', relatedNames: ['mohamed', 'adam', 'noah', 'aaron', 'nathan'] },
  ines: { gender: 'fille', popularity: 'Top 15', origin: 'arabe', meaning: 'Pure, chaste, compagne aimable', relatedNames: ['lina', 'yasmine', 'ambre', 'sarah', 'lea'] },
  nolan: { gender: 'garcon', popularity: 'Top 20', origin: 'irlandais', meaning: 'Célèbre, illustre', relatedNames: ['liam', 'maël', 'arthur', 'tom', 'sacha'] },
  sarah: { gender: 'fille', popularity: 'Top 15', origin: 'hébreu', meaning: 'Princesse', relatedNames: ['anna', 'lea', 'manon', 'ines', 'emma'] },
  theo: { gender: 'garcon', popularity: 'Top 15', origin: 'grec', meaning: 'Don de Dieu', relatedNames: ['sacha', 'hugo', 'tom', 'robin', 'leo'] },
  clara: { gender: 'fille', popularity: 'Top 20', origin: 'latin', meaning: 'Claire, brillante, illustre', relatedNames: ['julia', 'victoria', 'rose', 'camille', 'elena'] },
  aaron: { gender: 'garcon', popularity: 'Top 20', origin: 'hébreu', meaning: 'Montagne de la force', relatedNames: ['gabriel', 'raphael', 'adam', 'ethan', 'nathan'] },
  charlotte: { gender: 'fille', popularity: 'Top 20', origin: 'germanique', meaning: 'Femme forte, vigoureuse', relatedNames: ['louise', 'alice', 'emma', 'charlie', 'agathe'] },
  gabin: { gender: 'garcon', popularity: 'Top 25', origin: 'latin', meaning: 'Originaire de Gabium', relatedNames: ['jules', 'lucas', 'leo', 'paul', 'martin'] },
  victoria: { gender: 'fille', popularity: 'Top 25', origin: 'latin', meaning: 'Victoire', relatedNames: ['julia', 'clara', 'elena', 'rose', 'charlotte'] },
  robin: { gender: 'garcon', popularity: 'Top 25', origin: 'germanique', meaning: 'Gloire, brillant', relatedNames: ['hugo', 'louis', 'arthur', 'maël', 'sacha'] },
  lily: { gender: 'fille', popularity: 'Top 25', origin: 'anglais', meaning: 'Lys, pureté', relatedNames: ['rose', 'luna', 'mia', 'jade', 'charlie'] },
  martin: { gender: 'garcon', popularity: 'Top 30', origin: 'latin', meaning: 'Consacré à Mars, guerrier', relatedNames: ['paul', 'jules', 'lucas', 'gabin', 'leo'] },
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
      answer: `Le premier livre est 100% gratuit (3 pages, 4 illustrations, PDF). Les suivants : 2,99€ par livre complet (20 pages) ou 9,99€/mois pour le Club (4 livres par mois). Aucune carte bancaire pour le gratuit.`,
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

              {data && (
                <>
                  <h2>Tout savoir sur le prénom {prenomDisplay}</h2>
                  <p>
                    Le prénom <strong>{prenomDisplay}</strong> vient du {data.origin} et signifie <strong>"{data.meaning}"</strong>.
                    {data.origin === 'germanique' && ` D'origine germanique, ce prénom a traversé les siècles en conservant toute sa noblesse. Porté par des reines et des figures historiques marquantes, ${prenomDisplay} évoque à la fois la tradition et la modernité.`}
                    {data.origin === 'hébreu' && ` Ce prénom biblique porte en lui une symbolique spirituelle profonde. Présent dans les textes sacrés des trois grandes religions monothéistes, ${prenomDisplay} est un prénom intemporel qui traverse les époques et les cultures.`}
                    {data.origin === 'latin' && ` Hérité de la Rome antique, ce prénom latin a su traverser deux millénaires sans prendre une ride. Les Romains lui prêtaient des qualités de caractère que l'on retrouve encore aujourd'hui chez les enfants qui le portent.`}
                    {data.origin === 'grec' && ` Issu de la Grèce antique, berceau de la civilisation occidentale, ce prénom porte en lui l'héritage d'une culture qui a façonné notre monde. Philosophes, héros mythologiques et figures historiques ont contribué à son rayonnement.`}
                    {data.origin === 'celtique' && ` Ce prénom celtique nous vient des anciennes traditions bretonnes et gaéliques. Lié aux légendes arthuriennes et à la mythologie celtique, il évoque la nature, la force et une connexion profonde avec les éléments.`}
                    {data.origin === 'arabe' && ` Ce prénom d'origine arabe est porteur d'une grande poésie et d'une signification profonde. Très répandu dans le monde francophone, il séduit par sa musicalité et la beauté de sa signification.`}
                    {data.origin === 'espagnol' && ` Venu d'Espagne, ce prénom évoque la chaleur méditerranéenne et la beauté naturelle. Sa sonorité douce et son caractère unique en font un choix de plus en plus prisé par les parents français.`}
                    {data.origin === 'scandinave' && ` Ce prénom d'origine scandinave porte en lui les grands espaces du Nord et la douceur des pays nordiques. Court et mélodieux, il a conquis les parents français par sa simplicité et son élégance.`}
                    {data.origin === 'irlandais' && ` Venu d'Irlande, terre de légendes et de poésie, ce prénom celtique porte en lui toute la magie de l'île verte. Sa sonorité moderne et son caractère distinctif en font un choix très apprécié des jeunes parents.`}
                    {data.origin === 'araméen' && ` Ce prénom d'origine araméenne nous vient des langues les plus anciennes de l'humanité. Porté par des figures bibliques majeures, il conserve une aura de sagesse et d'authenticité.`}
                    {data.origin === 'anglais' && ` Ce prénom d'origine anglaise a su conquérir les parents français par sa douceur et son élégance naturelle. Évoquant la nature et la délicatesse, il est devenu un incontournable des prénoms modernes.`}
                  </p>
                  <p>
                    En France, {prenomDisplay} connaît un succès remarquable depuis plusieurs années. Classé <strong>{data.popularity}</strong> des prénoms {data.gender === 'fille' ? 'féminins' : 'masculins'}, {ilElle} fait partie des prénoms préférés des parents français.
                    Ce succès n'est pas un hasard : {prenomDisplay} possède cette qualité rare d'être à la fois {data.gender === 'fille' ? 'doux et affirmé' : 'fort et tendre'}, moderne sans être éphémère. Les parents qui choisissent ce prénom pour leur enfant souhaitent lui transmettre des valeurs de {data.gender === 'fille' ? 'grâce et de détermination' : 'courage et de sensibilité'}.
                  </p>
                  <p>
                    C'est justement cette personnalité unique que nous mettons en valeur dans nos <Link to="/livre-personnalise-enfant">livres personnalisés</Link>. Quand {prenomDisplay} ouvre son livre et découvre que {ilElle} est le {heroWord} de l'histoire, que son prénom apparaît dans chaque page, la magie opère. Ce n'est plus "une histoire pour enfant" — c'est <strong>{sonSa} histoire</strong>, celle où {prenomDisplay} vit des aventures extraordinaires, surmonte des défis et grandit page après page.
                  </p>

                  <h2>3 idées d'histoires pour {prenomDisplay}</h2>
                  <p>Voici un aperçu de ce que l'IA de Contedia peut créer pour {prenomDisplay}. Chaque histoire est unique, écrite sur mesure, avec le prénom intégré naturellement dans le récit.</p>

                  <div style={{ marginBottom: 24 }}>
                    <h3>L'aventure secrète de {prenomDisplay}</h3>
                    <p style={{ fontStyle: 'italic', color: '#555', lineHeight: 1.7 }}>
                      {prenomDisplay} part à la découverte d'un monde caché derrière une porte mystérieuse apparue dans {sonSa} chambre.
                      {gender === 'fille'
                        ? ` De l'autre côté, elle découvre un royaume souterrain peuplé de créatures lumineuses qui ont perdu leur étoile guide. Armée de son courage et de sa curiosité, ${prenomDisplay} traverse des grottes de cristal, résout l'énigme des trois gardiens et retrouve l'étoile volée par un dragon solitaire qui avait simplement besoin d'une amie. En ramenant la lumière, elle devient la protectrice éternelle de ce monde secret.`
                        : ` De l'autre côté, il découvre un royaume souterrain peuplé de créatures lumineuses qui ont perdu leur étoile guide. Armé de son courage et de sa curiosité, ${prenomDisplay} traverse des grottes de cristal, résout l'énigme des trois gardiens et retrouve l'étoile volée par un dragon solitaire qui avait simplement besoin d'un ami. En ramenant la lumière, il devient le protecteur éternel de ce monde secret.`
                      }
                    </p>
                  </div>

                  <div style={{ marginBottom: 24 }}>
                    <h3>{prenomDisplay} et l'animal magique de la forêt</h3>
                    <p style={{ fontStyle: 'italic', color: '#555', lineHeight: 1.7 }}>
                      {prenomDisplay} rencontre un animal magique dans la forêt enchantée au bout de {sonSa} jardin.
                      {gender === 'fille'
                        ? ` C'est un petit renard doré capable de parler, et il a besoin de son aide : la forêt est en danger, les arbres perdent leurs couleurs. Ensemble, ${prenomDisplay} et le renard partent à la recherche des quatre pierres de saison cachées aux quatre coins de la forêt. À chaque pierre retrouvée, une saison revient — le vert du printemps, l'or de l'été, le rouge de l'automne, le blanc de l'hiver. ${prenomDisplay} comprend que la nature a besoin qu'on prenne soin d'elle, et elle promet de toujours protéger sa forêt.`
                        : ` C'est un petit renard doré capable de parler, et il a besoin de son aide : la forêt est en danger, les arbres perdent leurs couleurs. Ensemble, ${prenomDisplay} et le renard partent à la recherche des quatre pierres de saison cachées aux quatre coins de la forêt. À chaque pierre retrouvée, une saison revient — le vert du printemps, l'or de l'été, le rouge de l'automne, le blanc de l'hiver. ${prenomDisplay} comprend que la nature a besoin qu'on prenne soin d'elle, et il promet de toujours protéger sa forêt.`
                      }
                    </p>
                  </div>

                  <div style={{ marginBottom: 24 }}>
                    <h3>Le pouvoir secret de {prenomDisplay}</h3>
                    <p style={{ fontStyle: 'italic', color: '#555', lineHeight: 1.7 }}>
                      {prenomDisplay} découvre qu'{ilElle} possède un pouvoir spécial le jour de {sonSa} anniversaire.
                      {gender === 'fille'
                        ? ` En soufflant ses bougies, ${prenomDisplay} réalise que ses dessins prennent vie ! Un papillon dessiné au crayon s'envole de la feuille, un soleil illumine toute la pièce. Mais quand elle dessine un orage par accident, elle doit apprendre à maîtriser ce don extraordinaire. Guidée par une vieille bibliothécaire magicienne, ${prenomDisplay} découvre que son pouvoir vient du coeur : ce qu'elle imagine avec amour devient réalité. Elle crée alors le plus beau cadeau du monde pour sa famille — un livre d'histoires vivantes, où chacun est le héros.`
                        : ` En soufflant ses bougies, ${prenomDisplay} réalise que ses dessins prennent vie ! Un papillon dessiné au crayon s'envole de la feuille, un soleil illumine toute la pièce. Mais quand il dessine un orage par accident, il doit apprendre à maîtriser ce don extraordinaire. Guidé par un vieux bibliothécaire magicien, ${prenomDisplay} découvre que son pouvoir vient du coeur : ce qu'il imagine avec amour devient réalité. Il crée alors le plus beau cadeau du monde pour sa famille — un livre d'histoires vivantes, où chacun est le héros.`
                      }
                    </p>
                  </div>

                  <p>
                    Ces histoires ne sont que des exemples. Sur Contedia, chaque livre est <strong>généré sur mesure</strong> selon l'âge, les passions et le thème que vous choisissez. <Link to="/create-story">Essayez gratuitement</Link> et découvrez l'histoire unique que l'IA va écrire pour {prenomDisplay}.
                  </p>

                  <div className="article-cta">
                    <Link to="/create-story" className="cta-button">
                      Découvrir l'histoire de {prenomDisplay} →
                    </Link>
                  </div>

                  <h2>Pourquoi offrir un livre personnalisé à {prenomDisplay} ?</h2>
                  <p>
                    Un livre personnalisé n'est pas un simple cadeau — c'est une expérience de lecture transformatrice. Quand {prenomDisplay} ouvre un livre et voit <strong>son prénom sur chaque page</strong>, quelque chose de magique se produit : {ilElle} ne lit plus une histoire, {ilElle} <strong>vit</strong> une histoire.
                  </p>
                  <p>
                    Les études en psychologie de l'enfant montrent que la personnalisation d'un récit renforce considérablement l'engagement et la compréhension. Un enfant qui se reconnaît dans le personnage principal développe plus facilement son empathie, sa confiance en soi et son goût pour la lecture. Pour {prenomDisplay}, chaque aventure devient une occasion de se projeter, de rêver et de grandir.
                  </p>
                  <p>
                    De plus, un <Link to="/blog/guide-livre-personnalise-enfant-2026">livre personnalisé</Link> fait un cadeau inoubliable — que ce soit pour un anniversaire, Noël, ou simplement pour le plaisir de voir les yeux de {prenomDisplay} s'illuminer.
                    {gender === 'fille'
                      ? ` Les petites filles adorent se voir en héroïne courageuse, en exploratrice audacieuse ou en magicienne bienveillante.`
                      : ` Les petits garçons adorent se voir en héros courageux, en explorateur audacieux ou en magicien bienveillant.`
                    }
                  </p>

                  <h2>Prénoms similaires à {prenomDisplay}</h2>
                  <p>Vous aimez le prénom {prenomDisplay} ? Découvrez des prénoms proches par leur sonorité ou leur origine {data.origin}, et créez aussi un livre personnalisé pour eux :</p>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                    gap: 12,
                    margin: '20px 0 28px',
                  }}>
                    {data.relatedNames.map(name => (
                      <Link
                        to={`/prenom/${name}`}
                        key={name}
                        style={{
                          display: 'block',
                          padding: '14px 18px',
                          background: '#f8f5ff',
                          border: '1px solid #e0d4f5',
                          borderRadius: 10,
                          textAlign: 'center',
                          textDecoration: 'none',
                          color: '#6b21a8',
                          fontWeight: 600,
                          fontSize: 15,
                          transition: 'all 0.2s',
                        }}
                      >
                        {capitalize(name)}
                      </Link>
                    ))}
                  </div>

                  <h2>Articles qui pourraient vous intéresser</h2>
                  <p>Pour aller plus loin dans l'univers des histoires personnalisées pour enfants :</p>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li style={{ marginBottom: 12 }}>
                      <Link to="/blog/guide-livre-personnalise-enfant-2026" style={{ color: '#6b21a8', fontWeight: 500 }}>
                        Guide complet du livre personnalisé pour enfant en 2026
                      </Link>
                      <span style={{ display: 'block', fontSize: 13, color: '#777', marginTop: 2 }}>
                        Tout ce qu'il faut savoir pour choisir et créer le livre parfait pour {prenomDisplay}.
                      </span>
                    </li>
                    <li style={{ marginBottom: 12 }}>
                      <Link to="/blog/histoire-du-soir-enfant-meilleures-idees" style={{ color: '#6b21a8', fontWeight: 500 }}>
                        Les meilleures idées d'histoires du soir pour enfant
                      </Link>
                      <span style={{ display: 'block', fontSize: 13, color: '#777', marginTop: 2 }}>
                        Découvrez comment transformer le rituel du coucher en moment magique avec {prenomDisplay}.
                      </span>
                    </li>
                    <li style={{ marginBottom: 12 }}>
                      <Link to="/blog/conte-personnalise-gratuit" style={{ color: '#6b21a8', fontWeight: 500 }}>
                        Conte personnalisé gratuit : comment ça marche ?
                      </Link>
                      <span style={{ display: 'block', fontSize: 13, color: '#777', marginTop: 2 }}>
                        Créez le premier livre de {prenomDisplay} sans rien payer — notre guide étape par étape.
                      </span>
                    </li>
                  </ul>
                </>
              )}

              <div className="article-cta">
                <Link to="/create-story" className="cta-button">
                  Créer l'histoire unique de {prenomDisplay} — Gratuit
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

import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { PageLayout } from '../components/layout/PageLayout';
import { SEOHead } from '../components/SEOHead';
import { SchemaFAQ, SchemaBreadcrumb, SchemaHowTo, SchemaProduct } from '../components/SchemaMarkup';
import '../styles/BlogArticle.css';

/**
 * Programmatic SEO — Pages par tranche d'âge
 * Route : /contes-par-age/:tranche
 *
 * Cible "livre personnalisé X ans" et variantes (conte X ans, histoire X ans).
 * Sous-pillar nested du pillar /contes-par-age existant.
 */

type TrancheData = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  ageRange: string;
  ageRangeShort: string;
  metaKeywords: string;
  intro: string;
  pageCount: string;
  themes: { icon: string; title: string; desc: string }[];
  benefits: { icon: string; title: string; description: string }[];
  faqQuestions: { question: string; answer: string }[];
};

const TRANCHES: Record<string, TrancheData> = {
  'bebe-0-2-ans': {
    slug: 'bebe-0-2-ans',
    title: "Livre personnalisé bébé (0-2 ans) : le premier livre de sa vie | Contedia",
    description: "Créez un livre personnalisé pour votre bébé de 0 à 2 ans : prénom intégré, histoire courte adaptée, illustrations contrastées. Cadeau de naissance unique. Premier livre gratuit.",
    h1: "Livre personnalisé bébé (0-2 ans) : le premier livre où il est le héros",
    ageRange: "0-2 ans",
    ageRangeShort: "bébé",
    metaKeywords: "livre personnalisé bébé, livre personnalisé 1 an, livre personnalisé naissance, livre personnalisé 6 mois, conte bébé personnalisé",
    intro: "À 0-2 ans, votre bébé associe déjà sa voix d'amour à des images. Un **livre personnalisé bébé** avec son prénom écrit dans chaque page et des illustrations très contrastées devient un objet sacré du rituel du soir. Sur Contedia, le premier livre personnalisé pour votre bébé est entièrement gratuit, prêt en 5 minutes.",
    pageCount: "3 pages courtes",
    themes: [
      { icon: '🌙', title: "La nuit douce de bébé", desc: "Histoire apaisante pour le coucher : bébé entend les sons du soir et s'endort en paix" },
      { icon: '🐰', title: "Les amis animaux", desc: "Bébé rencontre un lapin, un chat, un mouton — chaque animal lui dit bonjour avec un son" },
      { icon: '🎨', title: "Découverte des couleurs", desc: "Bébé voyage à travers les couleurs : rouge, bleu, jaune, vert. Apprentissage visuel" },
      { icon: '🍼', title: "La journée de bébé", desc: "Le rituel quotidien rassurant : réveil, bain, repas, jeu, dodo. Sécurité émotionnelle" },
      { icon: '🐻', title: "Le doudou perdu et retrouvé", desc: "Le doudou de bébé s'égare, puis revient. Petite émotion bien dosée, fin heureuse" },
      { icon: '🌟', title: "Bébé et les étoiles", desc: "Histoire courte du soir : les étoiles veillent sur bébé, il s'endort sereinement" },
    ],
    benefits: [
      { icon: '👶', title: "Adapté dès la naissance", description: "Histoire de 3 pages, vocabulaire ultra simple, phrases répétitives qui rassurent bébé" },
      { icon: '🎨', title: "Illustrations contrastées", description: "Les illustrations utilisent des couleurs vives et contrastées, adaptées à la vue d'un bébé qui se développe" },
      { icon: '🎁', title: "Cadeau naissance unique", description: "Le cadeau de naissance le plus émouvant : un livre où le prénom du bébé est gravé pour toujours" },
      { icon: '🆓', title: "Premier livre gratuit", description: "Testez sans risque, sans carte bancaire. Si vous aimez, les suivants sont à 2,99€ ou Club" },
    ],
    faqQuestions: [
      { question: "À partir de quel âge offrir un livre personnalisé à un bébé ?", answer: "Dès la naissance. À 0-6 mois, vous lisez à voix haute (bébé reconnaît votre voix et associe l'amour au moment lecture). À 6-12 mois, bébé tape sur le livre, identifie des couleurs. À 12-24 mois, il pointe les images, dit \"Hop !\" devant son prénom. Le livre personnalisé bébé Contedia est conçu pour évoluer avec lui." },
      { question: "Quel format pour un livre personnalisé bébé ?", answer: "Sur Contedia, vous recevez un PDF haute qualité que vous pouvez imprimer en format cartonné via un service comme Vistaprint ou Photobox (10-15€). Pour une utilisation sur tablette/téléphone, c'est utilisable directement. Le format cartonné est idéal pour résister aux manipulations bébé." },
      { question: "Le livre personnalisé bébé inclut-il vraiment son prénom dans chaque page ?", answer: "Oui, chaque page du livre personnalisé bébé contient le prénom de votre enfant intégré naturellement. Pas juste sur la couverture comme certains concurrents — dans le texte lui-même. C'est essentiel pour que bébé associe son prénom au moment plaisir de la lecture." },
      { question: "Combien coûte un livre personnalisé pour bébé ?", answer: "Premier livre gratuit sur Contedia (3 pages illustrées, sans carte bancaire). Version complète : 2,99€. Pour des livres illimités : Club mensuel 1,99€ le premier mois puis 9,99€/mois (4 livres/mois). Vs concurrents : 25-40€ par livre imprimé chez Wonderbly/Hourra Héros." },
      { question: "Peut-on offrir un livre personnalisé bébé à un baby shower ?", answer: "Excellent cadeau de baby shower ! Vous créez le livre avec le prénom du bébé à naître, vous l'imprimez en version cartonnée, et vous l'offrez avant la naissance. Les futurs parents pleurent (toujours). C'est plus original qu'un body ou un doudou classique." },
      { question: "Mon bébé déchire les livres, est-ce un problème ?", answer: "Non. Vous avez le PDF original, donc vous pouvez réimprimer autant de fois que nécessaire (5-7€ chez un imprimeur en ligne). Les versions Club Contedia incluent 4 livres par mois — vous pouvez varier les histoires au lieu de reréimprimer la même." },
    ],
  },
  '3-5-ans': {
    slug: '3-5-ans',
    title: "Livre personnalisé enfant 3-5 ans : l'âge d'or du conte sur mesure | Contedia",
    description: "Livre personnalisé pour enfant de 3, 4 ou 5 ans : prénom + photo + histoire 100% unique générée par IA. L'âge d'or de la lecture personnalisée. Premier livre gratuit.",
    h1: "Livre personnalisé enfant 3-5 ans : l'âge magique du conte sur mesure",
    ageRange: "3-5 ans",
    ageRangeShort: "maternelle",
    metaKeywords: "livre personnalisé 3 ans, livre personnalisé 4 ans, livre personnalisé 5 ans, livre personnalisé maternelle, conte enfant 3-5 ans",
    intro: "**3 à 5 ans, c'est L'ÂGE D'OR du livre personnalisé enfant.** Votre enfant reconnaît son prénom dans le texte, identifie son personnage dans les illustrations, et s'écrie \"C'est moi !\" devant chaque page. Sur Contedia, le premier livre personnalisé 3-5 ans est entièrement gratuit, prêt en 5 minutes, et inclut son animal de compagnie s'il en a un.",
    pageCount: "6 à 10 pages",
    themes: [
      { icon: '🐉', title: "Le dragon ami", desc: "Votre enfant apprivoise un petit dragon qui devient son compagnon d'aventure" },
      { icon: '🦁', title: "L'animal de compagnie magique", desc: "Le chien/chat/lapin de l'enfant prend vie dans une aventure fantastique" },
      { icon: '🧚', title: "La fée du jardin", desc: "Une fée arrive dans le jardin de l'enfant et l'emmène dans un monde miniature" },
      { icon: '🚀', title: "Voyage dans l'espace", desc: "Aventure spatiale : votre enfant explore une planète avec des aliens amicaux" },
      { icon: '🏴‍☠️', title: "Le petit pirate", desc: "L'enfant devient capitaine d'un mini-bateau et cherche un trésor caché" },
      { icon: '🦖', title: "Au temps des dinosaures", desc: "Voyage dans le passé : votre enfant rencontre un bébé T-Rex perdu" },
    ],
    benefits: [
      { icon: '✨', title: "Identification totale", description: "À 3-5 ans, l'enfant reconnaît son prénom écrit et son personnage dessiné. L'immersion est maximale." },
      { icon: '📚', title: "Pré-lecture stimulée", description: "Le livre personnalisé motive l'enfant à apprendre à lire — il VEUT déchiffrer son histoire" },
      { icon: '🐶', title: "Animal de compagnie inclus", description: "Ajoutez votre chien, chat, lapin ou tortue comme compagnon de l'aventure" },
      { icon: '🎨', title: "9 styles d'illustration", description: "3D Pixar, manga, aquarelle, kawaii, papier découpé : choisissez l'univers visuel" },
    ],
    faqQuestions: [
      { question: "Pourquoi 3-5 ans est l'âge idéal pour un livre personnalisé ?", answer: "À 3-5 ans, votre enfant a développé suffisamment de capacités cognitives pour comprendre une histoire de 6-10 pages, mais reste assez jeune pour s'émerveiller. Il reconnaît son prénom écrit (apprentissage lecture en cours) et s'identifie visuellement aux illustrations. Le livre personnalisé devient un objet d'attachement émotionnel intense, souvent lu chaque soir pendant des mois." },
      { question: "Mon enfant de 4 ans aime les princesses, le livre s'adapte-t-il ?", answer: "Oui. Vous renseignez les passions de votre enfant (princesses, dragons, animaux, foot, espace…) et l'IA Contedia adapte le thème, les personnages et les illustrations. Pour une fille de 4 ans qui aime les princesses : choisissez le thème \"contes de fées\" + style \"kawaii\" ou \"aquarelle\"." },
      { question: "Le livre personnalisé enfant 3-5 ans est-il vraiment unique ?", answer: "Oui, 100%. Sur Contedia, l'IA générative crée chaque histoire à partir de zéro à partir du prénom, de l'âge, des hobbies et du thème choisis. Deux enfants de 4 ans avec le même prénom et le même thème recevront deux histoires totalement différentes. C'est la grosse différence avec Wonderbly/Hourra Héros qui utilisent des templates pré-écrits." },
      { question: "Peut-on créer plusieurs livres personnalisés pour le même enfant ?", answer: "Bien sûr. Beaucoup de parents Contedia créent un livre personnalisé par semaine ou par mois pour varier les aventures de leur enfant. Le Club Contedia (1,99€ le 1er mois puis 9,99€/mois) inclut 4 livres complets par mois — parfait pour ne jamais relire deux fois la même histoire." },
      { question: "Mon enfant de 3 ans peut-il regarder son livre seul sur tablette ?", answer: "Oui, le livre personnalisé est consultable sur tout écran (tablette, téléphone, ordinateur) via votre bibliothèque Contedia. Il est aussi téléchargeable en PDF imprimable. À 3 ans, l'enfant tourne les pages numériques tout seul. À 4-5 ans, il commence à reconnaître son prénom écrit dans le texte." },
      { question: "Combien coûte un livre personnalisé 3-5 ans ?", answer: "Premier livre 100% gratuit sur Contedia (3 pages, sans CB). Version complète 12 pages : 2,99€ unique. Club mensuel 1,99€ le premier mois puis 9,99€/mois (4 livres complets). Le coût annuel pour un enfant qui adore relire (~6-12 livres/an) : 18-36€ chez Contedia vs 150-400€ chez les concurrents imprimés." },
    ],
  },
  '6-8-ans': {
    slug: '6-8-ans',
    title: "Livre personnalisé enfant 6-8 ans : aventures pour lecteurs autonomes | Contedia",
    description: "Livre personnalisé pour enfant 6, 7 ou 8 ans : aventures riches, vocabulaire enrichi, 12 pages d'histoire 100% unique. Idéal pour la lecture autonome. Premier livre gratuit.",
    h1: "Livre personnalisé enfant 6-8 ans : son aventure pour lire en autonomie",
    ageRange: "6-8 ans",
    ageRangeShort: "école primaire",
    metaKeywords: "livre personnalisé 6 ans, livre personnalisé 7 ans, livre personnalisé 8 ans, livre personnalisé CP CE1 CE2, conte enfant école",
    intro: "À 6-8 ans, votre enfant lit tout seul. Le **livre personnalisé enfant 6-8 ans** devient un outil puissant pour entretenir le plaisir de la lecture : il lit SA propre aventure, pas une histoire générique. Vocabulaire enrichi, intrigues plus complexes, 12 pages d'aventure illustrée 100% unique générée par IA. Premier livre gratuit sur Contedia.",
    pageCount: "12 pages riches",
    themes: [
      { icon: '🕵️', title: "Le détective junior", desc: "Votre enfant résout une énigme du quartier : objet disparu, mystère, suspect" },
      { icon: '🐲', title: "Le royaume des dragons", desc: "Aventure de fantasy : l'enfant doit sauver un royaume avec l'aide d'un dragon" },
      { icon: '🌊', title: "Naufrage sur île déserte", desc: "L'enfant et son ami échouent sur une île et doivent survivre 3 jours" },
      { icon: '👻', title: "La maison hantée (gentil)", desc: "Mystère doux : un fantôme cherche un ami, l'enfant l'aide à retrouver sa famille" },
      { icon: '🦸', title: "Super-héros du quartier", desc: "L'enfant découvre qu'il a un super-pouvoir secret et doit aider les autres" },
      { icon: '🏰', title: "Le château perdu", desc: "Voyage médiéval : exploration d'un château abandonné avec énigmes à résoudre" },
    ],
    benefits: [
      { icon: '📖', title: "Lecture autonome", description: "Vocabulaire et longueur calibrés pour un enfant qui lit déjà : 12 pages, phrases moyennes, mots variés" },
      { icon: '🧠', title: "Stimule la cognition", description: "Intrigues plus complexes, personnages développés, twists narratifs. L'enfant raisonne et anticipe" },
      { icon: '🎒', title: "Lecture du soir et de l'école", description: "Idéal pour les devoirs de lecture du soir ou les moments de calme à l'école" },
      { icon: '🏆', title: "Confiance en soi", description: "L'enfant lit SA propre histoire seul, jusqu'au bout. Sentiment d'accomplissement énorme" },
    ],
    faqQuestions: [
      { question: "Mon enfant de 7 ans lit seul, le livre personnalisé est-il assez long ?", answer: "Oui, la version complète Contedia pour enfant 6-8 ans fait 12 pages avec un vrai roman court (paragraphes denses, intrigue à rebondissements). C'est l'équivalent d'un Petit Nicolas ou d'un Roald Dahl première lecture, mais avec VOTRE enfant comme héros. Compte 15-25 minutes de lecture autonome." },
      { question: "Le vocabulaire est-il vraiment adapté à un enfant qui apprend à lire ?", answer: "Oui, l'IA Contedia calibre automatiquement le vocabulaire selon l'âge renseigné. À 6 ans (CP/CE1) : mots simples, phrases courtes, syllabes claires. À 8 ans (CE2) : vocabulaire enrichi, dialogues, descriptions plus riches. Vous pouvez régénérer si vous trouvez le texte trop facile ou trop dur." },
      { question: "Peut-on ajouter un ami du même âge dans l'histoire ?", answer: "Oui, vous ajoutez jusqu'à 5 personnages secondaires : copain, copine, frère, sœur, animal de compagnie. L'IA intègre tout le monde dans l'aventure. Idéal pour offrir un livre où votre enfant ET son meilleur ami sont tous les deux héros — effet \"on est dans une histoire ensemble\" garanti." },
      { question: "Les illustrations sont-elles adaptées à un enfant de 7-8 ans ?", answer: "Oui, vous choisissez parmi 9 styles : 3D Pixar (moderne), manga (pour ceux qui aiment les BD japonaises), aquarelle (poétique), réaliste (pour les enfants qui veulent du \"sérieux\"). À 7-8 ans, beaucoup d'enfants préfèrent le style manga ou 3D Pixar, plus proche de leurs dessins animés." },
      { question: "Un livre personnalisé peut-il aider mon enfant à mieux lire ?", answer: "Oui. Les études en littératie infantile (Carnegie Mellon, 2019) montrent que les enfants lisent jusqu'à 3x plus longtemps un texte où ils se reconnaissent. Le livre personnalisé enfant 6-8 ans transforme la lecture obligatoire en plaisir. C'est un outil pédagogique parfait pour entretenir le goût de lire à l'âge où il se construit." },
      { question: "Combien coûte un livre personnalisé pour enfant 6-8 ans ?", answer: "Premier livre gratuit sur Contedia (3 pages, sans CB). Version complète 12 pages : 2,99€. Club mensuel pour 4 livres/mois : 1,99€ le premier mois puis 9,99€/mois. À 7-8 ans, votre enfant peut lire 1 livre par semaine — le Club est ultra rentable (~2€ par livre). Vs Wonderbly/Hourra Héros : 25-40€ par livre imprimé." },
    ],
  },
  '9-12-ans': {
    slug: '9-12-ans',
    title: "Livre personnalisé pré-ado 9-12 ans : aventures matures et illustrations manga | Contedia",
    description: "Livre personnalisé pour pré-ado 9, 10, 11 ou 12 ans : aventures matures, illustrations manga ou réaliste, intrigues complexes. L'unique livre encore cool à 11 ans. Premier livre gratuit.",
    h1: "Livre personnalisé pré-ado 9-12 ans : l'unique livre qui reste cool à 12 ans",
    ageRange: "9-12 ans",
    ageRangeShort: "pré-ado / collège",
    metaKeywords: "livre personnalisé 9 ans, livre personnalisé 10 ans, livre personnalisé 11 ans, livre personnalisé 12 ans, conte préado, livre manga personnalisé",
    intro: "À 9-12 ans, les livres personnalisés \"classiques\" deviennent vite \"trop bébé\". Sur Contedia, le **livre personnalisé pré-ado** propose des aventures matures, des illustrations style manga ou réaliste, et des intrigues complexes adaptées à un cerveau qui veut du défi. C'est le seul livre personnalisé qui reste cool à 12 ans. Premier livre gratuit.",
    pageCount: "12-20 pages denses",
    themes: [
      { icon: '⚔️', title: "Mission secrète", desc: "Le pré-ado est recruté pour une mission d'espionnage : techno, codes, infiltration" },
      { icon: '🔮', title: "Académie de magie", desc: "Découverte d'une école de sorcellerie cachée. Influences Harry Potter assumées" },
      { icon: '🌌', title: "Voyage interdimensionnel", desc: "Science-fiction : portails entre mondes, choix moraux, personnages complexes" },
      { icon: '🥷', title: "Le clan caché", desc: "Univers manga : ninjas, dojos, codes d'honneur, batailles épiques" },
      { icon: '🏔️', title: "Survie en montagne", desc: "Le pré-ado est perdu dans la nature et doit survivre par sa logique" },
      { icon: '🤖', title: "L'IA bienveillante", desc: "Le pré-ado développe une amitié avec une IA qui veut comprendre l'humanité" },
    ],
    benefits: [
      { icon: '🎯', title: "Aventures matures", description: "Personnages développés, twists narratifs, dilemmes moraux. Pas de \"il était une fois\" niais" },
      { icon: '🖼️', title: "Illustrations manga ou réaliste", description: "Plus de style \"bébé\". Choisissez manga (style anime) ou réaliste (semi-photo)" },
      { icon: '🧩', title: "Intrigues complexes", description: "Mystères à plusieurs niveaux, fausses pistes, fins surprenantes. L'IA évite la facilité" },
      { icon: '😎', title: "Reste cool à offrir", description: "L'unique livre personnalisé encore \"acceptable\" pour un pré-ado vs livres bébé clichés" },
    ],
    faqQuestions: [
      { question: "Un pré-ado de 11 ans appréciera-t-il vraiment un livre personnalisé ?", answer: "Oui, si vous choisissez bien le style et le thème. Évitez les histoires niaises de princesses ou de dinosaures mignons. Privilégiez : aventure, mystère, mission secrète, science-fiction. Sur Contedia, vous pouvez aussi choisir le style manga ou réaliste — visuellement, votre pré-ado verra ça comme une BD personnalisée, pas comme un livre pour enfant." },
      { question: "Le vocabulaire et la complexité sont-ils adaptés à un pré-ado ?", answer: "Oui, à 9-12 ans, l'IA Contedia génère des paragraphes plus denses, du vocabulaire varié (mots de niveau collège), des dialogues nombreux et des intrigues à plusieurs niveaux. Vous obtenez l'équivalent d'un Percy Jackson ou d'un mini-roman jeunesse, mais avec VOTRE pré-ado comme héros. Compte 30-45 minutes de lecture." },
      { question: "Mon ado de 12 ans n'aime plus rien — vraiment un livre personnalisé peut le toucher ?", answer: "C'est le pari de Contedia. À 12 ans, l'enfant pense qu'il \"sait tout\" — mais voir son prénom dans une vraie aventure manga le surprend. Beaucoup de parents nous écrivent : \"Mon ado a fait semblant de ne pas être impressionné, mais il l'a relu 3 fois en cachette.\" Le secret : choisissez le bon thème (mission, espionnage, fantasy) et le style manga. Premier livre gratuit pour tester sans risque." },
      { question: "Peut-on créer une série d'aventures pour le même pré-ado ?", answer: "Oui, et c'est l'usage idéal à 9-12 ans. Avec le Club Contedia (9,99€/mois pour 4 livres), votre pré-ado reçoit une nouvelle aventure par semaine. Vous pouvez créer une vraie saga : chaque livre continue l'univers du précédent (même personnages secondaires, même monde). C'est unique au monde." },
      { question: "Le livre personnalisé pré-ado peut-il être un cadeau d'anniversaire 10-12 ans ?", answer: "C'est même l'une des meilleures idées de cadeau à cet âge \"difficile\". Pour le 10ème anniversaire (un cap symbolique), créer une vraie aventure mature avec votre enfant comme héros est un signal puissant : \"Tu n'es plus un bébé, tu es le héros de ta propre histoire.\" Imprimez la version PDF en couverture rigide (Vistaprint, ~15€) pour effet maximal." },
      { question: "Combien coûte un livre personnalisé pour pré-ado 9-12 ans ?", answer: "Premier livre gratuit sur Contedia (sans CB). Version complète 12-20 pages : 2,99€. Club mensuel : 1,99€ le premier mois puis 9,99€/mois pour 4 livres. À 9-12 ans, votre enfant peut dévorer 1-2 livres par semaine — le Club est imbattable. Vs concurrents : ils n'ont quasi rien pour cette tranche d'âge (Wonderbly s'arrête à 10 ans)." },
    ],
  },
};

const howToSteps = [
  {
    name: "Choisissez le thème adapté à l'âge",
    text: "Sélectionnez un thème qui parle à votre enfant : animaux, aventure, espace, fantasy… L'IA Contedia adapte automatiquement la complexité narrative à la tranche d'âge."
  },
  {
    name: "Personnalisez le héros",
    text: "Prénom de l'enfant, âge précis, photo optionnelle, hobbies, animal de compagnie, personnages secondaires. Plus vous personnalisez, plus l'histoire est unique."
  },
  {
    name: "Recevez le livre en 5 minutes",
    text: "L'IA génère une histoire illustrée 100% unique adaptée à l'âge. Vocabulaire, longueur et thèmes sont automatiquement calibrés. Premier livre gratuit."
  }
];

const ContesParAgeTranchePage: React.FC = () => {
  const { tranche } = useParams<{ tranche: string }>();
  const data = tranche ? TRANCHES[tranche] : undefined;

  if (!data) {
    return <Navigate to="/contes-par-age" replace />;
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": data.title,
    "description": data.description,
    "url": `https://contedia.fr/contes-par-age/${data.slug}`,
    "publisher": { "@type": "Organization", "name": "Contedia", "url": "https://contedia.fr" },
    "datePublished": "2026-05-12",
    "dateModified": "2026-05-12",
  };

  return (
    <PageLayout>
      <SEOHead
        title={data.title}
        description={data.description}
        type="website"
      />
      <SchemaFAQ questions={data.faqQuestions} />
      <SchemaBreadcrumb items={[
        { name: "Accueil", url: "https://contedia.fr/" },
        { name: "Contes par âge", url: "https://contedia.fr/contes-par-age" },
        { name: data.ageRange, url: `https://contedia.fr/contes-par-age/${data.slug}` }
      ]} />
      <SchemaHowTo
        name={`Comment créer un livre personnalisé ${data.ageRangeShort} ${data.ageRange}`}
        description={`Créez en 3 étapes un livre personnalisé adapté à un enfant de ${data.ageRange}. Premier livre gratuit, prêt en 5 minutes.`}
        totalTime="PT5M"
        steps={howToSteps}
      />
      <SchemaProduct
        name={`Livre personnalisé ${data.ageRangeShort} (${data.ageRange}) — Premier livre gratuit`}
        description={`Livre personnalisé pour enfant de ${data.ageRange} avec prénom, photo et histoire 100% unique générée par IA.`}
        price="0"
        priceCurrency="EUR"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
      </Helmet>

      <div className="article-container">
        <div className="article-layout">
          <div className="article-main">
            <div className="article-header">
              <h1>{data.h1}</h1>
              <div className="article-meta">
                <span>Par l'équipe Contedia · Tranche : {data.ageRange} · {data.pageCount}</span>
              </div>
            </div>

            <div className="article-content">
              <p className="article-intro" dangerouslySetInnerHTML={{
                __html: data.intro
                  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
              }} />

              <div className="article-cta">
                <Link to="/create-story" className="cta-button">
                  ✨ Créer le livre personnalisé de mon enfant ({data.ageRange}) — Gratuit
                </Link>
              </div>

              <h2>Pourquoi un livre personnalisé pour un enfant de {data.ageRange} ?</h2>
              <ul>
                {data.benefits.map((b, i) => (
                  <li key={i}>
                    <strong>{b.icon} {b.title}</strong> — {b.description}
                  </li>
                ))}
              </ul>

              <h2>6 idées d'histoires pour un enfant de {data.ageRange}</h2>
              {data.themes.map((t, i) => (
                <div key={i} style={{ marginBottom: 20 }}>
                  <h3>{t.icon} {t.title}</h3>
                  <p>{t.desc}</p>
                </div>
              ))}

              <p>
                Et ce ne sont que des exemples. <Link to="/themes-de-contes">Découvrez tous les thèmes disponibles</Link> sur Contedia.
              </p>

              <div className="article-cta">
                <Link to="/create-story" className="cta-button">
                  ✨ Tester avec le premier livre gratuit — 5 min, sans CB
                </Link>
              </div>

              <h2>Comment créer un livre personnalisé pour un enfant de {data.ageRange}</h2>
              <ol>
                <li><strong>Étape 1 — Le thème</strong> : choisissez un univers adapté à l'âge ({data.themes.slice(0, 3).map(t => t.title.toLowerCase()).join(', ')}…). <Link to="/create-story">Commencer ici</Link>.</li>
                <li><strong>Étape 2 — Le héros</strong> : prénom de l'enfant, âge précis ({data.ageRange}), photo optionnelle, hobbies, personnages secondaires (frère, sœur, animal).</li>
                <li><strong>Étape 3 — Récupérer le livre</strong> : l'IA Contedia génère en 5 minutes un livre adapté à l'âge ({data.pageCount}), avec vocabulaire calibré et illustrations dans le style choisi.</li>
              </ol>

              <h2>Toutes les tranches d'âge disponibles</h2>
              <p>
                Explorez nos pages dédiées par tranche d'âge pour des contenus encore plus adaptés :
              </p>
              <ul>
                {Object.values(TRANCHES).filter(t => t.slug !== data.slug).map(t => (
                  <li key={t.slug}>
                    <Link to={`/contes-par-age/${t.slug}`}>
                      <strong>Livre personnalisé {t.ageRangeShort} ({t.ageRange})</strong>
                    </Link> — {t.description.slice(0, 120)}…
                  </li>
                ))}
              </ul>

              <h2>FAQ : livre personnalisé enfant {data.ageRange}</h2>
              {data.faqQuestions.map((faq, i) => (
                <div key={i} style={{ marginBottom: 20 }}>
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </div>
              ))}

              <div className="article-cta">
                <Link to="/create-story" className="cta-button">
                  ✨ Créer maintenant le livre de mon enfant ({data.ageRange})
                </Link>
              </div>

              <p>
                <em>Pour aller plus loin :</em>
              </p>
              <ul>
                <li><Link to="/conte-personnalise">Conte personnalisé : la landing transactionnelle Contedia</Link></li>
                <li><Link to="/livre-personnalise-enfant">Livre personnalisé enfant : tous âges confondus</Link></li>
                <li><Link to="/blog/guide-livre-personnalise-enfant-2026">Guide complet du livre personnalisé enfant 2026</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ContesParAgeTranchePage;

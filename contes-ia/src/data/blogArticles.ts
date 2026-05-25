// Source unique de vérité des articles blog Contedia.
// Consommé par BlogPage (49 articles historiques, ids 1-49) ET les pages-hub
// de catégorie (qui peuvent référencer en plus des articles plus récents
// listés dans extraHubArticles).

export interface BlogArticle {
  id: number;
  title: string;
  excerpt: string;
  slug: string;
  image: string;
}

export const blogArticles: BlogArticle[] = [
  { id: 1, title: "Créer un Livre Personnalisé avec votre Animal de Compagnie", excerpt: "Transformez votre chien, chat ou animal favori en héros d'un conte personnalisé unique. Découvrez comment créer un livre magique où votre enfant et son compagnon vivent des aventures extraordinaires ensemble.", slug: "histoire-animal-compagnie-livre-personnalise", image: "conte-animal-compagnie" },
  { id: 2, title: "Des contes pour enfants à personnaliser : nouveaux héros et univers illustrés", excerpt: "Découvrez comment créer des héros uniques, explorer des univers illustrés époustouflants et adapter vos histoires aux goûts des adolescents.", slug: "nouveaux-personnages-styles-aventures-ados", image: "enfant-lecture-personnalisee" },
  { id: 3, title: "Contes de Fées Modernes : Quand la Magie Rencontre la Personnalisation", excerpt: "Les contes de fées se réinventent grâce aux aventures personnalisées, offrant à chaque enfant la possibilité de devenir le héros de son propre conte de fées sur mesure.", slug: "evolution-livres-enfants-contes-fees-aventures-personnalisees", image: "contes-fees-modernes" },
  { id: 4, title: "Comment l'IA révolutionne la création d'histoires pour enfants", excerpt: "L'intelligence artificielle transforme la façon dont nous créons des histoires pour enfants. Découvrez comment notre technologie permet de générer des contes personnalisés uniques.", slug: "ia-revolution-creation-histoires-enfants", image: "ia-creation-histoires" },
  { id: 5, title: "Intégrer les valeurs religieuses dans les contes personnalisés", excerpt: "Apprenez comment personnaliser la religion de votre enfant dans nos contes IA. Guide complet pour créer des histoires respectueuses des croyances familiales.", slug: "integrer-valeurs-religieuses-contes-personnalises", image: "religion-contes-personnalises" },
  { id: 6, title: "Pourquoi votre animal de compagnie stimule l'imagination de votre enfant", excerpt: "Découvrez comment votre animal de compagnie devient une source d'inspiration magique pour l'imagination de votre enfant.", slug: "animal-compagnie-stimule-imagination-enfant", image: "enfant-animal-lecture" },
  { id: 7, title: "Offrir un conte personnalisé pour Noël : le cadeau parfait pour les amoureux des animaux", excerpt: "Découvrez pourquoi un livre personnalisé mettant en scène l'animal de compagnie est le cadeau de Noël idéal.", slug: "conte-personnalise-noel-cadeau-amoureux-animaux", image: "noel-enfant-animal-livre" },
  { id: 8, title: "De la photo au héros de conte : comment l'IA transforme votre animal en personnage d'aventure", excerpt: "Découvrez la technologie révolutionnaire qui transforme les photos de votre animal en illustrations de conte personnalisé.", slug: "photo-heros-conte-ia-transforme-animal-personnage", image: "ia-transformation-animal" },
  { id: 9, title: "Lire avec son compagnon à quatre pattes : un rituel qui renforce le lien enfant-animal", excerpt: "Découvrez comment la lecture partagée avec votre animal de compagnie renforce les liens affectifs et développe l'empathie chez l'enfant.", slug: "lire-compagnon-quatre-pattes-rituel-lien-enfant-animal", image: "enfant-lecture-animal-rituel" },
  { id: 10, title: "Top 5 des thèmes d'histoires pour transformer votre animal en héros de conte", excerpt: "Découvrez 5 thèmes d'aventures captivants pour créer des contes personnalisés avec votre animal.", slug: "top-5-themes-histoires-animal-heros-conte", image: "themes-aventures-animaux" },
  { id: 11, title: "Transmettre la foi à travers les histoires : comment les contes personnalisés éveillent la spiritualité", excerpt: "Découvrez comment les contes personnalisés aident à transmettre la foi et les valeurs spirituelles aux enfants avec douceur.", slug: "transmettre-foi-histoires-contes-personnalises-spiritualite", image: "foi-spiritualite-enfant-conte" },
  { id: 12, title: "Les grandes fêtes religieuses revisitées : créer un conte personnalisé pour Noël, Ramadan, Pâque ou Diwali", excerpt: "Célébrez les fêtes religieuses avec des contes personnalisés adaptés à chaque tradition.", slug: "fetes-religieuses-conte-personnalise-noel-ramadan-paque-diwali", image: "fetes-religieuses-conte-personnalise" },
  { id: 13, title: "Personnaliser la foi : quand l'IA s'adapte à vos valeurs religieuses", excerpt: "Découvrez comment l'intelligence artificielle respecte et s'adapte aux différentes croyances religieuses.", slug: "personnaliser-foi-ia-adapte-valeurs-religieuses", image: "ia-adaptation-valeurs-religieuses" },
  { id: 14, title: "Des héros de foi : inspirer les enfants à travers des personnages spirituels", excerpt: "Découvrez comment intégrer des figures inspirantes de différentes traditions religieuses dans les contes personnalisés.", slug: "heros-foi-inspirer-enfants-personnages-spirituels", image: "heros-spirituels-conte-enfant" },
  { id: 15, title: "Foi, tolérance et ouverture : comment les contes favorisent le respect des différentes religions", excerpt: "Découvrez comment les contes personnalisés enseignent la tolérance religieuse et le respect des différentes croyances.", slug: "foi-tolerance-ouverture-respect-differentes-religions", image: "tolerance-religieuse-conte-enfant" },
  { id: 16, title: "Pourquoi offrir un livre personnalisé à un enfant en 2026 ?", excerpt: "Découvrez pourquoi le livre personnalisé est le cadeau idéal pour un enfant en 2026. Avantages, bienfaits et impact sur le développement.", slug: "livre-personnalise-enfant-2026", image: "livre-personnalise-enfant-2026" },
  { id: 17, title: "Comment un conte personnalisé aide l'enfant à développer confiance et imagination", excerpt: "Découvrez comment les contes personnalisés renforcent la confiance en soi et stimulent l'imagination des enfants.", slug: "conte-personnalise-confiance-imagination-enfant", image: "conte-personnalise-confiance-imagination-enfant" },
  { id: 18, title: "Livre personnalisé ou livre classique : lequel est le plus bénéfique pour l'enfant ?", excerpt: "Comparaison détaillée entre livres personnalisés et livres classiques pour enfants.", slug: "livre-personnalise-vs-livre-classique-enfant", image: "livre-personnalise-vs-livre-classique-enfant" },
  { id: 19, title: "L'intelligence artificielle au service des histoires pour enfants", excerpt: "Découvrez comment l'intelligence artificielle révolutionne la création d'histoires pour enfants.", slug: "intelligence-artificielle-histoires-enfants", image: "intelligence-artificielle-histoires-enfants" },
  { id: 20, title: "Pourquoi les enfants adorent être le héros de leur propre histoire", excerpt: "Découvrez les raisons psychologiques pour lesquelles les enfants adorent être le héros de leur propre histoire.", slug: "enfant-heros-propre-histoire", image: "enfant-heros-propre-histoire" },
  { id: 21, title: "Lecture du soir : pourquoi le conte personnalisé améliore le rituel du coucher", excerpt: "Découvrez comment les contes personnalisés transforment le rituel du coucher en moment magique.", slug: "conte-personnalise-rituel-coucher", image: "conte-personnalise-rituel-coucher" },
  { id: 22, title: "Comment un livre personnalisé peut aider un enfant timide ou anxieux", excerpt: "Découvrez comment les livres personnalisés aident les enfants timides et anxieux à développer leur confiance en soi.", slug: "livre-personnalise-enfant-timide", image: "livre-personnalise-enfant-timide" },
  { id: 23, title: "Cadeau de naissance ou anniversaire : le livre personnalisé intemporel", excerpt: "Découvrez pourquoi le livre personnalisé est le cadeau parfait pour une naissance ou un anniversaire.", slug: "cadeau-livre-personnalise-enfant", image: "cadeau-livre-personnalise-enfant" },
  { id: 24, title: "Comment sont créées les histoires personnalisées sur Contedia", excerpt: "Découvrez les coulisses de la création d'histoires personnalisées sur Contedia.", slug: "creation-histoires-personnalisees-conte-ia", image: "creation-histoires-personnalisees-conte-ia" },
  { id: 25, title: "Les bienfaits de la lecture personnalisée sur le développement émotionnel", excerpt: "Découvrez comment la lecture personnalisée favorise le développement émotionnel des enfants.", slug: "bienfaits-lecture-personnalisee-enfant", image: "bienfaits-lecture-personnalisee-enfant" },
  { id: 26, title: "Livre Personnalisé Enfant : Le Guide Complet 2026 (par Âge)", excerpt: "Le guide ultime pour choisir le meilleur livre personnalisé pour votre enfant. Conseils par âge (0-8 ans), comparatif classique vs IA, et création en 3 étapes.", slug: "guide-livre-personnalise-enfant-2026", image: "livre-personnalise-enfant-guide-complet" },
  { id: 27, title: "Les 10 Meilleurs Livres Personnalisés pour Enfants en 2026 (Comparatif)", excerpt: "Comparatif complet des 10 meilleures plateformes de livres personnalisés : Contedia, Wonderbly, Hourra Héros, Époni... Prix, qualité, notre verdict.", slug: "meilleurs-livres-personnalises-enfants-comparatif-2026", image: "meilleurs-livres-personnalises-comparatif" },
  { id: 28, title: "Conteuse Personnalisable : La Meilleure Alternative Numérique en 2026", excerpt: "Comparatif conteuses physiques (Lunii, Tonies) vs contes personnalisés par IA. Découvrez pourquoi le livre personnalisé numérique est la meilleure alternative.", slug: "conteuse-personnalisable-alternative-numerique-2026", image: "conteuse-personnalisable-livre-enfant" },
  { id: 29, title: "Livre Conte Personnalisé : Créez une Histoire Unique pour votre Enfant", excerpt: "Créez un conte personnalisé avec le prénom et la photo de votre enfant. Histoire unique par IA, 15 thèmes, adapté de 0 à 8 ans. Premier livre gratuit.", slug: "livre-conte-personnalise-histoire-unique-enfant", image: "livre-conte-personnalise-enfant" },
  { id: 30, title: "Conte Personnalisé Gratuit : Créez le Vôtre en 2 Minutes", excerpt: "Créez un conte personnalisé gratuit pour votre enfant. Son prénom, ses passions, des illustrations uniques par IA. 0€, sans carte bancaire, prêt en 5 min.", slug: "conte-personnalise-gratuit", image: "conte-personnalise-gratuit" },
  { id: 31, title: "Livre Personnalisé Bébé : Le Premier Livre de Sa Vie", excerpt: "Créez un livre personnalisé pour bébé avec son prénom, sa photo et une histoire unique. Cadeau de naissance émotionnel, souvenir pour la vie. Premier livre gratuit.", slug: "livre-personnalise-bebe-premier-livre", image: "livre-personnalise-bebe" },
  { id: 32, title: "Cadeau Fête des Mères Personnalisé : Le Livre Qui Fait Pleurer Maman", excerpt: "Offrez un cadeau unique pour la fête des mères : un livre personnalisé où votre enfant est le héros. Création en 5 min, dès 2,99€.", slug: "cadeau-fete-des-meres-livre-personnalise", image: "cadeau-fete-des-meres-personnalise" },
  { id: 33, title: "Contedia vs Wonderbly : Comparatif Honnête 2026", excerpt: "Comparatif détaillé Contedia vs Wonderbly : prix, personnalisation, illustrations, délai. Quel livre personnalisé enfant choisir ?", slug: "contedia-vs-wonderbly-comparatif", image: "contedia-vs-wonderbly" },
  { id: 34, title: "Contedia vs Hourra Héros : Quel Livre Choisir en 2026 ?", excerpt: "Comparatif honnête Contedia vs Hourra Héros : prix, personnalisation, avis, qualité. Notre analyse détaillée.", slug: "contedia-vs-hourra-heros-comparatif", image: "contedia-vs-hourra-heros" },
  { id: 35, title: "Alternative Lunii 2026 : Le Livre Personnalisé IA Remplace la Conteuse", excerpt: "Vous cherchez une alternative à Lunii ? Découvrez le livre personnalisé par IA : histoires uniques, prénom de votre enfant, illustrations sur mesure. Essai gratuit.", slug: "alternative-lunii-livre-personnalise-ia", image: "alternative-lunii" },
  { id: 36, title: "Alternative Toniebox 2026 : 5 Solutions Modernes pour les Histoires", excerpt: "Les meilleures alternatives à la Toniebox en 2026 : livre personnalisé IA, conteuses numériques, apps. Comparatif honnête + essai gratuit.", slug: "alternative-toniebox-livre-personnalise-enfant", image: "alternative-toniebox" },
  { id: 37, title: "Histoire du Soir pour Enfant : 10 Idées Magiques pour un Rituel Inoubliable", excerpt: "Les meilleures histoires du soir par âge. 10 idées de rituels lecture : contes personnalisés, aventures, histoires avec son prénom. 1 histoire gratuite.", slug: "histoire-du-soir-enfant-meilleures-idees", image: "histoire-du-soir-enfant" },
  { id: 38, title: "Conte pour S'endormir : 7 Histoires Personnalisées pour des Nuits Paisibles", excerpt: "7 contes pour s'endormir où votre enfant est le héros. Histoires douces et apaisantes, personnalisées avec son prénom. Premier conte gratuit.", slug: "conte-pour-sendormir-histoires-personnalisees", image: "conte-pour-sendormir" },
  { id: 39, title: "Cadeau de Naissance : Le Livre Personnalisé Qui Émeut Tous les Parents", excerpt: "Le cadeau de naissance qui fait pleurer les parents : un livre personnalisé avec le prénom du bébé, son histoire unique. Création en 5 min, premier livre gratuit.", slug: "cadeau-naissance-livre-personnalise-bebe", image: "cadeau-naissance-personnalise" },
  { id: 40, title: "Cadeau de Noël Personnalisé : Le Livre Où Votre Enfant Est le Héros", excerpt: "Offrez un cadeau de Noël inoubliable : un livre personnalisé où votre enfant vit une aventure de Noël. Son prénom, ses passions, illustrations IA.", slug: "cadeau-noel-livre-personnalise-enfant", image: "cadeau-noel-personnalise" },
  { id: 41, title: "Livre Personnalisé 3-5 Ans : L'Âge d'Or de l'Imagination", excerpt: "Créez un livre personnalisé adapté aux 3-5 ans. Histoires avec son prénom, vocabulaire adapté, illustrations IA uniques. Premier livre gratuit.", slug: "livre-personnalise-enfant-3-5-ans", image: "livre-personnalise-3-5-ans" },
  { id: 42, title: "Contedia vs Epopia : Quel Livre Personnalisé Choisir en 2026 ?", excerpt: "Comparatif honnête Contedia vs Epopia : prix, personnalisation IA vs courrier, délai, qualité. Test gratuit inclus.", slug: "contedia-vs-epopia-comparatif", image: "contedia-vs-epopia" },
  { id: 43, title: "Cadeau Anniversaire Enfant : Le Livre Personnalisé Qui Éclipse Tous les Jouets", excerpt: "Le cadeau d'anniversaire qui marque : un livre personnalisé où votre enfant est le héros. Création en 5 min, premier gratuit.", slug: "cadeau-anniversaire-enfant-livre-personnalise", image: "cadeau-anniversaire-personnalise" },
  { id: 44, title: "Lunii vs Toniebox 2026 : Comparatif Complet + La Meilleure Alternative", excerpt: "Lunii ou Toniebox ? Comparatif prix, contenu, personnalisation. + La 3ème option que les parents ne connaissent pas : le livre personnalisé par IA.", slug: "lunii-vs-toniebox-comparatif-2026", image: "lunii-vs-toniebox-comparatif" },
  { id: 45, title: "Conteuse Enfant : Le Guide Complet d'Achat 2026", excerpt: "Lunii, Toniebox, Bookinou, Merlin, Yoto... Quel conteuse enfant choisir ? Guide complet + l'alternative IA personnalisée.", slug: "conteuse-enfant-guide-complet-2026", image: "conteuse-enfant-guide-complet" },
  { id: 46, title: "Histoire du Soir : Le Guide Complet par Âge (0-8 ans)", excerpt: "Quelle histoire du soir selon l'âge ? Idées, rituels, durées, thèmes adaptés pour chaque tranche d'âge.", slug: "histoire-du-soir-par-age-guide", image: "histoire-du-soir-par-age" },
  { id: 47, title: "Idée Cadeau Enfant 3 Ans : 15 Idées Originales (2026)", excerpt: "Quel cadeau offrir à un enfant de 3 ans ? 15 idées testées : jouets éducatifs, livres, expériences, cadeaux personnalisés.", slug: "idee-cadeau-enfant-3-ans", image: "idee-cadeau-enfant-3-ans" },
  { id: 48, title: "Idée Cadeau Enfant 5 Ans : 15 Idées qui Émerveillent", excerpt: "Quel cadeau pour un enfant de 5 ans ? 15 idées originales : jouets créatifs, jeux de société, livres, expériences.", slug: "idee-cadeau-enfant-5-ans", image: "idee-cadeau-enfant-5-ans" },
  { id: 49, title: "ChatGPT vs Contedia : Peut-on Créer un Livre Enfant avec ChatGPT ?", excerpt: "On a testé ChatGPT pour écrire des histoires enfants. Comparatif honnête : illustrations, mise en page, sécurité.", slug: "chatgpt-vs-contedia-histoires-enfants", image: "chatgpt-vs-contedia" }
];

// Articles plus récents non présents dans le tableau historique BlogPage
// (créés directement comme pages SEO sans être ajoutés au hub /blog).
// Ils sont référencés par les pages-hub de catégorie pour le maillage.
export const extraHubArticles: BlogArticle[] = [
  { id: 50, title: "Histoire du soir : 50 idées par âge pour endormir votre enfant", excerpt: "50 histoires du soir testées en famille (5 min, par âge, par thème) pour endormir votre enfant. Le rituel idéal + bonus : créer SA propre histoire du soir personnalisée gratuitement.", slug: "histoire-du-soir-50-idees", image: "histoire-du-soir-enfant" },
  { id: 51, title: "Histoire personnalisée avec un chien : votre enfant + son chien héros", excerpt: "Créez une histoire personnalisée où votre enfant et son chien sont les héros. Toutes races acceptées (golden, labrador, bouledogue…). Premier livre gratuit, prêt en 5 minutes.", slug: "histoire-personnalisee-chien", image: "enfant-chien-livre-personnalise" },
  { id: 52, title: "Comment choisir un livre personnalisé pour son enfant ? Guide d'achat 2026", excerpt: "Choisir un livre personnalisé : 5 critères clés, comparatif des 6 meilleurs services, par âge, par budget, par occasion. Les pièges à éviter + notre verdict. Premier livre gratuit.", slug: "choisir-livre-personnalise-guide-achat", image: "choisir-livre-personnalise" }
];

export const allArticles: BlogArticle[] = [...blogArticles, ...extraHubArticles];

// ─── Catégories SEO (silos thématiques) ───
// Chaque catégorie cible une requête générique distincte (data GSC) et agrège
// les articles existants pour résoudre la cannibalisation et concentrer le
// signal de pertinence. L'ordre des articleSlugs reflète la priorité d'affichage
// (leader article en premier).

export interface BlogCategory {
  slug: string;
  label: string;
  h1: string;
  seoTitle: string;
  metaDescription: string;
  intro: string;
  articleSlugs: string[];
}

export const BLOG_CATEGORIES: BlogCategory[] = [
  {
    slug: "animaux",
    label: "Animaux de compagnie",
    h1: "Histoires personnalisées avec un animal de compagnie",
    seoTitle: "Histoires personnalisées avec un animal : tous nos guides (chien, chat…) | Contedia",
    metaDescription: "Transformez votre chien, chat ou animal favori en héros d'une histoire personnalisée pour votre enfant. Guides, idées de thèmes, exemples. Premier livre gratuit.",
    intro: "Votre animal de compagnie est déjà le meilleur ami de votre enfant. Et s'il devenait aussi le co-héros de son livre ? Nos guides pour créer des histoires personnalisées où votre enfant ET son chien, chat ou autre compagnon vivent ensemble des aventures uniques — illustrations IA sur mesure incluses.",
    articleSlugs: [
      "histoire-animal-compagnie-livre-personnalise",
      "top-5-themes-histoires-animal-heros-conte",
      "histoire-personnalisee-chien",
      "animal-compagnie-stimule-imagination-enfant",
      "photo-heros-conte-ia-transforme-animal-personnage",
      "lire-compagnon-quatre-pattes-rituel-lien-enfant-animal",
      "conte-personnalise-noel-cadeau-amoureux-animaux"
    ]
  },
  {
    slug: "conteuses",
    label: "Conteuses & comparatifs",
    h1: "Conteuses personnalisables : guides & comparatifs (Lunii, Toniebox, alternatives)",
    seoTitle: "Conteuse personnalisable : guides, comparatifs et alternatives 2026 | Contedia",
    metaDescription: "Lunii, Toniebox, Yoto, Bookinou… Tous nos comparatifs de conteuses pour enfant + l'alternative numérique qui crée une histoire 100 % personnalisée à votre enfant.",
    intro: "Les conteuses physiques (Lunii, Toniebox…) racontent les mêmes histoires à tous les enfants. Le livre personnalisé par IA, lui, génère une aventure unique avec le prénom, l'apparence et les passions de votre enfant. Voici nos guides honnêtes pour choisir, comparer et tester gratuitement.",
    articleSlugs: [
      "conteuse-personnalisable-alternative-numerique-2026",
      "meilleurs-livres-personnalises-enfants-comparatif-2026",
      "conteuse-enfant-guide-complet-2026",
      "lunii-vs-toniebox-comparatif-2026",
      "alternative-lunii-livre-personnalise-ia",
      "alternative-toniebox-livre-personnalise-enfant",
      "contedia-vs-wonderbly-comparatif",
      "contedia-vs-hourra-heros-comparatif",
      "contedia-vs-epopia-comparatif",
      "chatgpt-vs-contedia-histoires-enfants"
    ]
  },
  {
    slug: "cadeaux",
    label: "Idées cadeaux",
    h1: "Idées cadeaux personnalisés pour enfant",
    seoTitle: "Idées cadeaux personnalisés pour enfant : naissance, anniversaire, Noël | Contedia",
    metaDescription: "Le livre personnalisé : un cadeau qui marque à vie. Idées par occasion (naissance, anniversaire, Noël, fête des Mères) et par âge. Premier livre gratuit.",
    intro: "Un livre où votre enfant est le héros — son prénom, son apparence, ses passions — reste un cadeau intemporel. Nos guides par occasion et par âge pour offrir un cadeau personnalisé qui sera relu pendant des années, pas oublié en deux semaines.",
    articleSlugs: [
      "cadeau-livre-personnalise-enfant",
      "cadeau-naissance-livre-personnalise-bebe",
      "cadeau-anniversaire-enfant-livre-personnalise",
      "cadeau-noel-livre-personnalise-enfant",
      "cadeau-fete-des-meres-livre-personnalise",
      "idee-cadeau-enfant-3-ans",
      "idee-cadeau-enfant-5-ans"
    ]
  },
  {
    slug: "sommeil",
    label: "Histoires du soir & coucher",
    h1: "Histoires du soir & rituel du coucher",
    seoTitle: "Histoire du soir pour enfant : idées, guides par âge, rituel du coucher | Contedia",
    metaDescription: "L'histoire du soir, ce moment magique. Nos guides pour choisir, raconter ou créer une histoire du soir personnalisée à votre enfant. Idées par âge + premier conte gratuit.",
    intro: "Le rituel du coucher est l'un des moments les plus précieux de la journée parent-enfant. Voici nos guides pour transformer ce rituel en aventure unique — y compris en créant une histoire 100 % personnalisée avec le prénom de votre enfant en quelques minutes.",
    articleSlugs: [
      "histoire-du-soir-50-idees",
      "histoire-du-soir-enfant-meilleures-idees",
      "histoire-du-soir-par-age-guide",
      "conte-pour-sendormir-histoires-personnalisees"
    ]
  },
  {
    slug: "foi",
    label: "Foi & valeurs",
    h1: "Contes personnalisés autour de la foi et des valeurs",
    seoTitle: "Contes personnalisés autour de la foi et des valeurs : guides Contedia",
    metaDescription: "Transmettre la foi et les valeurs à votre enfant à travers des contes personnalisés respectueux de votre tradition (chrétienne, musulmane, juive, autre). Premier livre gratuit.",
    intro: "Les histoires qu'on raconte aux enfants transmettent aussi nos valeurs. Nos guides pour créer des contes personnalisés respectueux de votre tradition spirituelle ou simplement porteurs de valeurs (tolérance, courage, partage) — adaptés à votre famille.",
    articleSlugs: [
      "transmettre-foi-histoires-contes-personnalises-spiritualite",
      "fetes-religieuses-conte-personnalise-noel-ramadan-paque-diwali",
      "personnaliser-foi-ia-adapte-valeurs-religieuses",
      "heros-foi-inspirer-enfants-personnages-spirituels",
      "foi-tolerance-ouverture-respect-differentes-religions",
      "integrer-valeurs-religieuses-contes-personnalises"
    ]
  }
];

export const getCategory = (slug: string): BlogCategory | undefined =>
  BLOG_CATEGORIES.find(c => c.slug === slug);

export const getCategoryArticles = (cat: BlogCategory): BlogArticle[] =>
  cat.articleSlugs
    .map(s => allArticles.find(a => a.slug === s))
    .filter((a): a is BlogArticle => a !== undefined);

export const getCategoryForArticle = (slug: string): BlogCategory | undefined =>
  BLOG_CATEGORIES.find(c => c.articleSlugs.includes(slug));

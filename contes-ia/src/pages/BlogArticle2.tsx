import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { PageLayout } from '../components/layout/PageLayout';
import { SEOHead } from '../components/SEOHead';
import { SchemaFAQ, SchemaBreadcrumb } from '../components/SchemaMarkup';
import '../styles/BlogArticle.css';

const BlogArticle2: React.FC = () => {

  const tableOfContents = [
    { title: "Votre enfant, héros d'un conte unique", id: "heros" },
    { title: "Les 9 styles d'illustration disponibles", id: "styles" },
    { title: "Personnaliser le héros avec une photo", id: "photo" },
    { title: "Des thèmes pour chaque passion", id: "themes" },
    { title: "Et pour les plus grands ? (6-8 ans)", id: "grands" },
    { title: "Créer un conte personnalisé en 3 minutes", id: "creer" },
    { title: "Ce que les parents en disent", id: "temoignages" },
    { title: "FAQ : Conte personnalisé enfant", id: "faq" },
  ];

  const handleScrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const faqQuestions = [
    {
      question: "Combien de styles d'illustration propose Contedia ?",
      answer: "Contedia propose 9 styles d'illustration : Animation 3D (style Pixar), Manga japonais, Kawaii, Aquarelle, Papier découpé, Clay Animation, Géométrique, Livre illustré classique et Block World (style Minecraft). Chaque style transforme complètement l'ambiance du conte."
    },
    {
      question: "Peut-on personnaliser le héros avec la photo de l'enfant ?",
      answer: "Oui ! Ajoutez une photo de votre enfant et l'IA analyse ses traits physiques (peau, cheveux, yeux) pour créer un personnage illustré qui lui ressemble. Le personnage garde la même apparence sur toutes les pages du livre."
    },
    {
      question: "Peut-on ajouter des personnages secondaires dans le conte ?",
      answer: "Oui ! Vous pouvez ajouter jusqu'à 5 personnages secondaires : frère, sœur, meilleur ami, animal de compagnie (chien, chat, lapin...). Chaque personnage apparaît dans l'histoire et les illustrations."
    },
    {
      question: "Les contes personnalisés sont-ils adaptés aux ados ?",
      answer: "Contedia adapte automatiquement le vocabulaire et la complexité à l'âge sélectionné. Pour les 6-8 ans, les histoires sont plus longues avec des rebondissements. Les thèmes mystère, enquête et voyage dans le temps plaisent aux plus grands."
    },
    {
      question: "Comment choisir le bon style d'illustration ?",
      answer: "Le style dépend de l'âge et des goûts de l'enfant. Pour les 0-3 ans : Kawaii ou Aquarelle (doux et coloré). Pour les 3-6 ans : Animation 3D (style Pixar, le plus populaire). Pour les 6-8 ans : Manga ou Livre illustré classique. Vous pouvez tester gratuitement avec le premier livre offert."
    },
    {
      question: "Combien coûte un conte personnalisé ?",
      answer: "Le premier conte est 100% gratuit sur Contedia. Les suivants coûtent 3,99€. L'abonnement Club (9,99€/mois) inclut 4 livres de 20 pages avec accès aux 9 styles d'illustration."
    }
  ];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Conte Personnalisé Enfant : 9 Styles d'Illustration et Héros sur Mesure",
    "description": "Découvrez les 9 styles d'illustration pour créer un conte personnalisé enfant unique. Animation 3D, Manga, Kawaii, Aquarelle... Premier livre gratuit.",
    "image": "https://contedia.fr/images/blog/enfant-lecture-personnalisee.jpg",
    "author": { "@type": "Organization", "name": "Contedia", "url": "https://contedia.fr" },
    "publisher": { "@type": "Organization", "name": "Contedia", "logo": { "@type": "ImageObject", "url": "https://contedia.fr/logo-conte-ia.png" } },
    "datePublished": "2025-11-04",
    "dateModified": "2026-03-22",
    "mainEntityOfPage": { "@type": "WebPage", "@id": "https://contedia.fr/blog/nouveaux-personnages-styles-aventures-ados" }
  };

  return (
    <PageLayout>
      <SEOHead
        title="Conte Personnalisé : 9 Styles d'Illustration au Choix (Enfants & Ados) | Contedia"
        description="9 styles d'illustration pour un conte personnalisé unique : Animation 3D, Manga, Kawaii, Aquarelle... Votre enfant héros, dans le style qu'il préfère. Gratuit."
        type="article"
      />
      <SchemaFAQ questions={faqQuestions} />
      <SchemaBreadcrumb items={[
        { name: "Accueil", url: "https://contedia.fr/" },
        { name: "Blog", url: "https://contedia.fr/blog" },
        { name: "Conte personnalisé : styles et héros", url: "https://contedia.fr/blog/nouveaux-personnages-styles-aventures-ados" }
      ]} />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
      </Helmet>

      <div className="article-container">

        <div className="article-layout">
          <div className="article-main">
            <div className="article-header">
              <h1>Conte Personnalisé Enfant : 9 Styles d'Illustration et Héros sur Mesure</h1>
              <div className="article-meta">
                <span>Par l'équipe Contedia · Mis à jour le 22 mars 2026 · 8 min de lecture</span>
              </div>
            </div>

            <div className="article-image">
              <img
                src="/images/blog/enfant-lecture-personnalisee.jpg"
                alt="Enfant émerveillé devant un conte personnalisé avec des illustrations colorées dans différents styles artistiques"
                loading="lazy"
                onError={(e) => { const target = e.target as HTMLImageElement; target.src = '/images/placeholder-blog.jpg'; }}
              />
            </div>

            <div className="article-content">
              <p className="article-intro">
                <strong>« Maman, pourquoi le personnage ne me ressemble pas ? »</strong> — C'est la question que posent les enfants quand ils lisent un livre classique. Avec un <strong>conte personnalisé</strong>, cette question disparaît : le héros, c'est votre enfant. Son visage. Son prénom. Ses passions. Et en 2026, vous pouvez choisir parmi <strong>9 styles d'illustration</strong> pour créer un univers visuel qui lui correspond parfaitement. Du style Pixar au manga en passant par l'aquarelle — voici comment transformer une simple histoire en œuvre d'art personnalisée.
              </p>

              <h2 id="heros">Votre enfant, héros d'un conte qui lui ressemble vraiment</h2>
              <p>
                Un <strong>conte personnalisé enfant</strong> va bien au-delà du simple prénom inséré dans un texte. Sur <strong>Contedia</strong>, votre enfant devient un héros complet :
              </p>
              <ul>
                <li><strong>Son visage dans les illustrations</strong> — Ajoutez une photo et l'IA crée un personnage illustré qui lui ressemble : même couleur de peau, même coupe de cheveux, même sourire.</li>
                <li><strong>Ses passions intégrées</strong> — Fan de dinosaures ? L'histoire intègre des dinosaures. Passionné d'espace ? Direction les étoiles. Le thème s'adapte à ce qui fait briller ses yeux.</li>
                <li><strong>Sa famille dans l'aventure</strong> — Ajoutez son frère, sa sœur, son meilleur ami ou <Link to="/blog/histoire-animal-compagnie-livre-personnalise">son chien</Link> comme personnages secondaires. Jusqu'à 5 personnages dans la version Club.</li>
                <li><strong>Son âge, son vocabulaire</strong> — L'IA adapte la complexité du texte à la tranche d'âge (0-2, 3-5, 6-8 ans). Un enfant de 3 ans et un enfant de 7 ans n'auront pas la même histoire.</li>
              </ul>
              <p>
                Le résultat ? Quand Rayan, 3 ans, ouvre son livre et voit un personnage qui lui ressemble en train de chevaucher un dinosaure, il ne dit pas « c'est un garçon » — il dit <strong>« c'est MOI ! »</strong>. C'est cette réaction qui fait toute la différence.
              </p>

              <div className="article-cta">
                <Link to="/create-story" className="cta-button">
                  ✨ Créez le conte de votre enfant — Premier livre gratuit
                </Link>
              </div>

              <h2 id="styles">Les 9 styles d'illustration disponibles sur Contedia</h2>
              <p>
                Chaque style transforme complètement l'ambiance du conte. Voici les <strong>9 styles d'illustration</strong> que vous pouvez choisir sur <Link to="/styles-illustration">Contedia</Link> :
              </p>
              <ul>
                <li><strong>Animation 3D (style Pixar)</strong> — Le plus populaire ! Personnages ronds et expressifs, couleurs vibrantes, qualité cinématique. Parfait pour les 3-7 ans. C'est le style qui fait dire aux enfants « on dirait un dessin animé ! »</li>
                <li><strong>Manga japonais</strong> — Grands yeux expressifs, compositions dynamiques, esthétique anime. Idéal pour les 5-8 ans fans de dessins animés japonais.</li>
                <li><strong>Kawaii</strong> — Ultra mignon, formes rondes, couleurs pastel, joues roses. Les tout-petits (0-4 ans) adorent ce style doux et rassurant.</li>
                <li><strong>Aquarelle</strong> — Délicat et poétique, avec des textures douces et des couleurs qui se fondent. Parfait pour les histoires contemplatives et les rituels du coucher.</li>
                <li><strong>Papier découpé</strong> — Effet collage avec des couches de papier, des ombres subtiles et un charme artisanal. Original et unique.</li>
                <li><strong>Clay Animation (pâte à modeler)</strong> — Style Aardman (Wallace & Gromit), avec des personnages en pâte à modeler et un charme fait-main. Les enfants adorent l'aspect « jouet qui prend vie ».</li>
                <li><strong>Géométrique</strong> — Formes épurées, couleurs vives, design moderne. Un style original qui se démarque.</li>
                <li><strong>Livre illustré classique</strong> — Style Beatrix Potter, gouache chaleureuse, ambiance nostalgique. Pour les parents qui aiment le charme des livres d'antan.</li>
                <li><strong>Block World (style Minecraft)</strong> — Univers cubique et pixelisé. Les fans de Minecraft (5-8 ans) deviennent fous avec ce style !</li>
              </ul>
              <p>
                <em>Astuce : vous ne savez pas quel style choisir ? Créez votre <Link to="/create-story">premier livre gratuit</Link> en Animation 3D (le plus populaire), puis testez d'autres styles avec le Club.</em>
              </p>

              <h2 id="photo">Comment personnaliser le héros avec une photo</h2>
              <p>
                La <strong>personnalisation avec photo</strong> est la fonctionnalité qui fait la plus grande différence entre un conte générique et un conte véritablement personnel :
              </p>
              <ul>
                <li><strong>Étape 1</strong> — Prenez une photo de votre enfant (visage de face, bien éclairé)</li>
                <li><strong>Étape 2</strong> — Uploadez-la dans le formulaire de création</li>
                <li><strong>Étape 3</strong> — L'IA analyse les traits : couleur de peau, type de cheveux, forme du visage, couleur des yeux</li>
                <li><strong>Résultat</strong> — Un personnage illustré qui ressemble à votre enfant apparaît dans le style choisi, de manière cohérente sur toutes les pages</li>
              </ul>
              <p>
                Sans photo ? Pas de problème. Vous pouvez aussi sélectionner manuellement la couleur des yeux, des cheveux et de la peau. Le résultat est tout aussi beau, juste un peu moins « c'est exactement moi ».
              </p>

              <h2 id="themes">Des thèmes pour chaque passion et chaque occasion</h2>
              <p>
                Le style visuel ne fait pas tout — le thème de l'histoire est tout aussi important. Contedia propose plus de <strong>15 thèmes</strong> :
              </p>
              <ul>
                <li><strong>Aventure classique</strong> — Forêt enchantée, quête du trésor, rencontre de créatures magiques</li>
                <li><strong>Espace et planètes</strong> — Fusée, aliens amicaux, exploration spatiale</li>
                <li><strong>Animaux</strong> — Ferme, jungle, océan, dinosaures</li>
                <li><strong>Fêtes</strong> — <Link to="/blog/conte-personnalise-noel-cadeau-amoureux-animaux">Noël</Link>, Pâques, anniversaire, <Link to="/blog/fetes-religieuses-conte-personnalise-noel-ramadan-paque-diwali">Ramadan, Aïd</Link></li>
                <li><strong>Pirates et trésor</strong> — Navigation, île mystérieuse, carte au trésor</li>
                <li><strong>Super-héros</strong> — L'enfant développe des pouvoirs et sauve le monde</li>
                <li><strong>Contes de fées</strong> — <Link to="/blog/evolution-livres-enfants-contes-fees-aventures-personnalisees">Princesses, dragons, châteaux enchantés</Link></li>
                <li><strong>Personnalisé</strong> — Décrivez votre propre thème et l'IA crée l'histoire sur mesure</li>
              </ul>

              <div className="article-cta">
                <Link to="/create-story" className="cta-button">
                  ✨ Choisissez votre style et votre thème — C'est gratuit
                </Link>
              </div>

              <h2 id="grands">Et pour les plus grands ? Contes pour les 6-8 ans</h2>
              <p>
                Les enfants de 6-8 ans ont des attentes plus sophistiquées. Ils veulent de <strong>vrais rebondissements</strong>, des mystères à résoudre, des choix courageux. Sur Contedia, les histoires pour cette tranche d'âge offrent :
              </p>
              <ul>
                <li><strong>20 pages</strong> (au lieu de 3) — Plus de texte, plus d'illustrations, plus d'aventure</li>
                <li><strong>Thèmes complexes</strong> — Mystère, enquête, voyage dans le temps, magie avancée</li>
                <li><strong>Vocabulaire enrichi</strong> — L'enfant peut lire seul et apprend de nouveaux mots en contexte</li>
                <li><strong>Valeurs fortes</strong> — Amitié, respect de l'environnement, <Link to="/blog/conte-personnalise-confiance-imagination-enfant">confiance en soi</Link>, acceptation de la différence</li>
                <li><strong>Styles Manga et Block World</strong> — Les styles préférés des 6-8 ans, inspirés de leurs univers (anime, Minecraft)</li>
              </ul>
              <p>
                L'abonnement <Link to="/club">Club Contedia</Link> (9,99€/mois) donne accès à 4 livres de 20 pages par mois avec les 9 styles — idéal pour varier les aventures chaque semaine.
              </p>

              <h2 id="creer">Créer un conte personnalisé en 3 minutes</h2>
              <p>
                Tout se fait depuis votre téléphone :
              </p>
              <ul>
                <li><strong>1. Thème + âge</strong> — Sélectionnez ce qui passionne votre enfant et sa tranche d'âge</li>
                <li><strong>2. Héros + photo</strong> — Prénom, photo (optionnel), personnages secondaires</li>
                <li><strong>3. Style</strong> — Choisissez parmi les 9 styles d'illustration</li>
                <li><strong>4. C'est prêt</strong> — L'IA génère une histoire unique en 5 minutes. Lisible immédiatement.</li>
              </ul>
              <p>
                <strong>Premier livre gratuit</strong>. Pas de carte bancaire. Juste votre email et la magie opère.
              </p>

              <h2 id="temoignages">Ce que les parents en disent</h2>
              <ul>
                <li><strong>Mélanie, maman de Jade (5 ans)</strong> — <em>« On a testé le style Kawaii pour Jade. Elle a dit "les personnages sont trop mignons, on dirait des peluches qui vivent !" C'est devenu son livre préféré, devant tous ses livres de la médiathèque. »</em></li>
                <li><strong>Kevin, papa de Noah (7 ans)</strong> — <em>« Noah est fan de manga. Quand il a vu son conte en style manga avec LUI en héros, il l'a lu 3 fois de suite. Puis il l'a montré à tous ses copains. C'est le premier livre qu'il a lu SEUL du début à la fin. »</em></li>
                <li><strong>Samia, maman de Lina (3 ans)</strong> — <em>« L'aquarelle pour le conte du soir, c'est parfait. Les couleurs sont douces, l'histoire est calme. Lina s'endort en regardant les illustrations. C'est devenu notre rituel. »</em></li>
              </ul>

              <div className="article-cta">
                <Link to="/create-story" className="cta-button">
                  ✨ Rejoignez +500 familles — Testez les 9 styles gratuitement
                </Link>
              </div>

              <h2 id="faq">FAQ : Conte personnalisé enfant — Styles et personnalisation</h2>

              {faqQuestions.map((faq, i) => (
                <React.Fragment key={i}>
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </React.Fragment>
              ))}

              <p>
                <em>Découvrez aussi :</em>
              </p>
              <ul>
                <li><Link to="/blog/guide-livre-personnalise-enfant-2026">Le guide complet du livre personnalisé enfant (0-8 ans)</Link></li>
                <li><Link to="/blog/meilleurs-livres-personnalises-enfants-comparatif-2026">Les 10 meilleurs livres personnalisés — Comparatif 2026</Link></li>
                <li><Link to="/blog/histoire-animal-compagnie-livre-personnalise">Livre personnalisé avec votre chien ou chat</Link></li>
                <li><Link to="/blog/conte-personnalise-rituel-coucher">Le conte personnalisé comme rituel du coucher</Link></li>
                <li><Link to="/blog/enfant-heros-propre-histoire">Pourquoi les enfants adorent être le héros</Link></li>
              </ul>
            </div>
          </div>

          <div className="article-sidebar">
            <div className="table-of-contents">
              <h3>Table des matières</h3>
              <ul>
                {tableOfContents.map((item, index) => (
                  <li key={index}>
                    <button onClick={() => handleScrollToSection(item.id)} className="toc-link">
                      {item.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default BlogArticle2;

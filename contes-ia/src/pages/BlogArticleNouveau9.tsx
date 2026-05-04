import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { SEOHead } from '../components/SEOHead';
import { SchemaFAQ, SchemaBreadcrumb } from '../components/SchemaMarkup';
import { Helmet } from 'react-helmet-async';
import '../styles/BlogArticle.css';

const BlogArticleNouveau9: React.FC = () => {

  const tableOfContents = [
    { title: "Pourquoi on vous montre tout", id: "transparence" },
    { title: "Étape 1 : Le formulaire", id: "etape-formulaire" },
    { title: "Étape 2 : L'IA écrit l'histoire", id: "etape-ia" },
    { title: "Étape 3 : Les illustrations", id: "etape-illustrations" },
    { title: "Étape 4 : Le livre assemblé", id: "etape-livre" },
    { title: "Nos engagements qualité", id: "engagements" },
    { title: "Ce que les parents en pensent", id: "temoignages" },
    { title: "FAQ", id: "faq" },
  ];

  const handleScrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const faqQuestions = [
    {
      question: "Qui écrit les histoires sur Contedia ?",
      answer: "L'IA (un modèle de langage avancé) écrit chaque histoire à partir de zéro, en intégrant les informations que vous fournissez. Ce n'est pas un catalogue de textes pré-écrits — chaque conte est véritablement unique. L'équipe Contedia supervise la qualité et améliore constamment les prompts qui guident l'IA."
    },
    {
      question: "Mes données sont-elles en sécurité ?",
      answer: "Oui. Les informations (prénom, âge, passions) servent uniquement à créer le conte. Elles ne sont ni revendues ni partagées. Contedia respecte le RGPD. Vous pouvez demander la suppression de vos données à tout moment."
    },
    {
      question: "Le conte est-il vérifié avant d'être envoyé ?",
      answer: "L'IA est guidée par des instructions strictes qui garantissent un contenu adapté aux enfants : pas de violence, pas de contenu inapproprié, des valeurs positives. Des vérifications automatiques sont en place. Si vous remarquez quoi que ce soit d'inhabituel, contactez-nous et nous corrigerons immédiatement."
    },
    {
      question: "Puis-je modifier le conte après l'avoir reçu ?",
      answer: "Le PDF est livré tel quel, mais si quelque chose ne vous convient pas, contactez-nous. Nous pouvons régénérer le conte avec des ajustements. Notre priorité est votre satisfaction."
    },
    {
      question: "Pourquoi le premier livre est-il gratuit ?",
      answer: "Parce que nous sommes convaincus que la meilleure façon de comprendre Contedia, c'est de l'essayer. Pas de piège, pas d'abonnement caché. Vous recevez un vrai livre complet, gratuit. Si vous aimez, vous revenez. Sinon, vous gardez le livre."
    },
    {
      question: "Combien de temps prend la création d'un conte ?",
      answer: "Environ 2-3 minutes pour le texte, 2-3 minutes pour les illustrations. Total : votre livre arrive par email en 5 minutes après avoir rempli le formulaire. C'est la puissance de l'IA."
    }
  ];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Les Coulisses de Contedia : Comment Votre Conte Personnalisé Est Créé",
    "description": "Visite guidée du processus de création Contedia. Du formulaire au livre : chaque étape expliquée. Transparence totale sur notre fonctionnement.",
    "image": "https://contedia.fr/images/blog/creation-histoires-personnalisees-conte-ia.jpg",
    "author": { "@type": "Organization", "name": "Contedia", "url": "https://contedia.fr" },
    "publisher": { "@type": "Organization", "name": "Contedia", "logo": { "@type": "ImageObject", "url": "https://contedia.fr/logo-conte-ia.png" } },
    "datePublished": "2025-10-01",
    "dateModified": "2026-03-23",
    "mainEntityOfPage": { "@type": "WebPage", "@id": "https://contedia.fr/blog/creation-histoires-personnalisees-conte-ia" }
  };

  return (
    <PageLayout>
      <SEOHead
        title="Les Coulisses de Contedia : Comment Votre Conte Est Créé | Contedia"
        description="Visite guidée du processus de création Contedia. Du formulaire au livre en 5 min. Transparence totale, engagements qualité. Premier livre gratuit."
        type="article"
      />
      <SchemaFAQ questions={faqQuestions} />
      <SchemaBreadcrumb items={[
        { name: "Accueil", url: "https://contedia.fr/" },
        { name: "Blog", url: "https://contedia.fr/blog" },
        { name: "Coulisses de Contedia", url: "https://contedia.fr/blog/creation-histoires-personnalisees-conte-ia" }
      ]} />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
      </Helmet>

      <div className="article-container">
        <div className="article-breadcrumb">
          <Link to="/blog">Blog</Link> / Les coulisses de Contedia
        </div>

        <div className="article-layout">
          <div className="article-main">
            <div className="article-header">
              <h1>Les Coulisses de Contedia : Comment Votre Conte Personnalisé Est Créé, Étape par Étape</h1>
              <div className="article-meta">
                <span>Par l'équipe Contedia · Mis à jour le 23 mars 2026 · 7 min de lecture</span>
              </div>
            </div>

            <div className="article-image">
              <img
                src="/images/blog/creation-histoires-personnalisees-conte-ia.jpg"
                alt="Les coulisses de Contedia : du formulaire au livre personnalisé pour enfant"
                loading="lazy"
                onError={(e) => { const target = e.target as HTMLImageElement; target.src = '/images/placeholder-blog.jpg'; }}
              />
            </div>

            <div className="article-content">
              <p className="article-intro">
                <strong>« Comment vous faites ? C'est un humain qui écrit ? C'est un robot ? Vous prenez quoi comme données ? »</strong> — On reçoit ces questions tous les jours. Et c'est normal : vous confiez le prénom de votre enfant, ses passions, parfois sa photo. Vous méritez de savoir exactement ce qu'on en fait. Voici la visite guidée complète de notre processus — <strong>sans jargon, sans secrets</strong>.
              </p>

              <h2 id="transparence">Pourquoi on vous montre tout</h2>
              <p>
                Beaucoup de services IA fonctionnent en « boîte noire ». Vous entrez des données, vous recevez un résultat, et entre les deux ? Mystère. Chez <strong>Contedia</strong>, on fait le choix inverse.
              </p>
              <p>
                Nos raisons :
              </p>
              <ul>
                <li><strong>C'est votre enfant</strong> — Vous avez le droit absolu de savoir ce qu'on fait avec ses informations.</li>
                <li><strong>La confiance se mérite</strong> — On ne demande pas de nous faire confiance aveuglément. On MONTRE ce qu'on fait.</li>
                <li><strong>On est fiers de notre travail</strong> — Le processus est beau. Pourquoi le cacher ?</li>
              </ul>
              <p>
                Si vous voulez comprendre <Link to="/blog/intelligence-artificielle-histoires-enfants">comment l'IA fonctionne en général</Link> pour créer des contes, lisez notre article dédié. Ici, on parle de CE QUI SE PASSE chez Contedia spécifiquement.
              </p>

              <div className="article-cta">
                <Link to="/create-story" className="cta-button">
                  ✨ Testez par vous-même — Premier livre gratuit
                </Link>
              </div>

              <h2 id="etape-formulaire">Étape 1 : Le formulaire (2 minutes)</h2>
              <p>
                Tout commence par vous. Vous remplissez un formulaire simple :
              </p>
              <ul>
                <li><strong>Prénom de l'enfant</strong> — Obligatoire. C'est le cœur de la personnalisation.</li>
                <li><strong>Âge</strong> — Pour adapter le vocabulaire, la longueur et la complexité.</li>
                <li><strong>Sexe</strong> — Pour les accords grammaticaux et le personnage.</li>
                <li><strong>Passions</strong> — Dinosaures, espace, chevaux, foot, danse… Ce qui fait briller ses yeux.</li>
                <li><strong>Thème</strong> — Courage, amitié, <Link to="/blog/conte-personnalise-gestion-emotions-enfant">émotions</Link>, famille, découverte…</li>
                <li><strong>Personnages secondaires</strong> (optionnel) — Meilleur ami, doudou, animal de compagnie.</li>
                <li><strong>Valeurs</strong> (optionnel) — <Link to="/blog/transmettre-foi-histoires-contes-personnalises-spiritualite">Foi</Link>, laïcité, écologie…</li>
              </ul>
              <p>
                <strong>Ce qu'on NE demande PAS :</strong> adresse, téléphone, numéro de carte bancaire (pour le livre gratuit). On n'a besoin que d'un email pour vous envoyer le livre.
              </p>
              <p>
                <strong>Ce qui se passe avec vos données :</strong> elles servent UNIQUEMENT à créer le conte. Elles ne sont ni revendues, ni partagées, ni utilisées pour de la publicité. Point.
              </p>

              <h2 id="etape-ia">Étape 2 : L'IA écrit l'histoire (2-3 minutes)</h2>
              <p>
                C'est la partie magique. Vos informations sont transformées en instructions pour le modèle d'IA. Ce n'est PAS un simple « remplacer [PRÉNOM] par Léo ». Voici ce qui se passe réellement :
              </p>
              <ol>
                <li><strong>Construction du prompt</strong> — Nos instructions guidées combinent vos infos en un brief créatif détaillé. C'est comme donner un cahier des charges ultra-précis à un auteur.</li>
                <li><strong>Génération du texte</strong> — L'IA écrit chaque phrase à partir de zéro. Deux enfants identiques (même âge, mêmes passions) recevront des histoires DIFFÉRENTES car l'IA crée, elle ne copie pas.</li>
                <li><strong>Adaptation au niveau</strong> — Le vocabulaire, la longueur des phrases, la complexité de l'intrigue sont calibrés automatiquement selon l'âge.</li>
                <li><strong>Intégration des valeurs</strong> — Le thème choisi structure TOUTE l'histoire. Le courage n'est pas mentionné — il est vécu par le personnage à travers l'aventure.</li>
              </ol>
              <p>
                <strong>Ce que l'IA ne fait PAS :</strong> pas de violence, pas de contenu effrayant pour les petits, pas de stéréotypes, pas de messages négatifs. Nos instructions sont strictes sur ces points.
              </p>

              <h2 id="etape-illustrations">Étape 3 : Les illustrations (2-3 minutes)</h2>
              <p>
                Pendant que le texte se finalise, un autre modèle d'IA génère les illustrations :
              </p>
              <ul>
                <li><strong>Couverture</strong> — Avec le titre personnalisé et le personnage principal.</li>
                <li><strong>Illustrations intérieures</strong> — Chaque page a une image qui correspond exactement au texte.</li>
                <li><strong>Cohérence visuelle</strong> — Toutes les illustrations sont dans le même style, avec le même personnage.</li>
                <li><strong>Style adapté à l'âge</strong> — Couleurs vives et formes simples pour les 3-5 ans, plus de détails pour les 6-8 ans.</li>
              </ul>
              <p>
                Les illustrations sont la partie qui impressionne le plus les parents. Quand l'enfant voit un personnage qui lui ressemble dans un univers qui correspond à ses passions, la magie opère.
              </p>

              <div className="article-cta">
                <Link to="/create-story" className="cta-button">
                  ✨ Voyez les illustrations par vous-même — Gratuit
                </Link>
              </div>

              <h2 id="etape-livre">Étape 4 : Le livre assemblé et envoyé (30 secondes)</h2>
              <p>
                Texte + illustrations = livre. Le système assemble automatiquement :
              </p>
              <ul>
                <li><strong>La couverture</strong> avec le titre et l'illustration principale</li>
                <li><strong>Les pages intérieures</strong> avec texte et illustrations en regard</li>
                <li><strong>La mise en page</strong> adaptée à la lecture sur écran ou à l'impression</li>
              </ul>
              <p>
                Le PDF est envoyé à votre email. <strong>Temps total depuis le formulaire : environ 5 minutes.</strong>
              </p>
              <p>
                Vous pouvez ensuite :
              </p>
              <ul>
                <li>Le lire sur tablette, téléphone ou ordinateur</li>
                <li>L'imprimer chez vous (format A4)</li>
                <li>L'imprimer et le relier via un service d'impression en ligne (résultat professionnel pour 5-10€)</li>
                <li>Le partager par email ou WhatsApp avec la famille</li>
              </ul>

              <h2 id="engagements">Nos engagements qualité</h2>
              <p>
                Voici ce qu'on vous promet — noir sur blanc :
              </p>
              <ol>
                <li><strong>Contenu 100% adapté aux enfants</strong> — Pas de violence, pas de contenu inapproprié, jamais. Nos instructions IA sont conçues pour ça.</li>
                <li><strong>Données protégées</strong> — RGPD, pas de revente, pas de partage. Suppression sur simple demande.</li>
                <li><strong>Gratuit = vraiment gratuit</strong> — Le premier livre n'a aucune contrepartie cachée. Pas d'abonnement automatique, pas de spam.</li>
                <li><strong>Satisfaction garantie</strong> — Si le conte ne vous plaît pas, on le refait. Gratuitement.</li>
                <li><strong>Amélioration continue</strong> — On lit chaque retour parent. Chaque suggestion est prise en compte pour améliorer le service.</li>
              </ol>

              <h2 id="temoignages">Ce que les parents en pensent</h2>
              <ul>
                <li><strong>Aurélie, maman de Léo (5 ans)</strong> — <em>« J'étais sceptique sur l'IA qui écrit pour les enfants. Mais quand j'ai lu le conte, j'ai été bluffée par la qualité. Le texte est doux, bien écrit, et Léo s'est reconnu immédiatement. En 5 minutes, j'avais un livre que ma mère n'aurait pas pu écrire en 5 jours. »</em></li>
                <li><strong>Rachid, papa de Yasmine (4 ans)</strong> — <em>« Ce qui m'a convaincu c'est la transparence. J'ai lu l'article sur le fonctionnement, j'ai compris ce qui se passait avec les données de ma fille, et j'ai fait confiance. Le résultat est magnifique — et je sais exactement comment il a été créé. »</em></li>
                <li><strong>Nathalie, maman de jumeaux (6 ans)</strong> — <em>« J'ai créé deux contes, un pour chacun, en 10 minutes. Deux histoires complètement différentes, adaptées à chaque personnalité. Quand mes fils ont comparé leurs livres, ils étaient fascinés par les différences. L'IA comprend vraiment chaque enfant. »</em></li>
              </ul>

              <div className="article-cta">
                <Link to="/create-story" className="cta-button">
                  ✨ Créez votre conte en 5 minutes — Gratuit
                </Link>
              </div>

              <h2 id="faq">FAQ : Le processus de création Contedia</h2>

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
                <li><Link to="/blog/intelligence-artificielle-histoires-enfants">Comment l'IA crée un conte personnalisé (technique)</Link></li>
                <li><Link to="/blog/livre-personnalise-enfant-guide-complet">Guide complet du livre personnalisé</Link></li>
                <li><Link to="/blog/livre-personnalise-vs-livre-classique">Livre personnalisé vs livre classique</Link></li>
                <li><Link to="/blog/enfant-heros-propre-histoire">Pourquoi les enfants adorent être le héros</Link></li>
                <li><Link to="/blog/club-contedia-abonnement-livre-personnalise-enfant">Le Club Contedia : un conte par mois</Link></li>
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

export default BlogArticleNouveau9;

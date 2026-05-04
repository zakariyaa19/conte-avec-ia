import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { SEOHead } from '../components/SEOHead';
import { SchemaFAQ, SchemaBreadcrumb } from '../components/SchemaMarkup';
import { Helmet } from 'react-helmet-async';
import '../styles/BlogArticle.css';

const BlogArticleVsEpopia: React.FC = () => {

  const tableOfContents = [
    { title: "Epopia et Contedia : deux approches très différentes", id: "deux-approches" },
    { title: "Comparatif détaillé point par point", id: "comparatif" },
    { title: "Pour quel enfant choisir Epopia ou Contedia ?", id: "quel-enfant" },
    { title: "Notre verdict honnête", id: "verdict" },
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
      question: "Epopia ou Contedia, lequel est le moins cher ?",
      answer: "Contedia est moins cher au global. Le premier livre est gratuit, puis 2,99€ par livre ou 9,99€/mois pour 4 livres avec le Club. Epopia fonctionne par abonnement à environ 10-12€/mois pour une aventure épistolaire. Pour un usage ponctuel ou un cadeau rapide, Contedia est nettement plus accessible. Pour une expérience longue durée par courrier, Epopia a son propre modèle."
    },
    {
      question: "Peut-on offrir Epopia et Contedia en même temps ?",
      answer: "Absolument ! Les deux services sont complémentaires. Epopia offre une aventure par courrier qui dure plusieurs semaines, tandis que Contedia fournit des livres personnalisés instantanés. Un enfant peut très bien recevoir ses lettres Epopia tout en ayant ses contes Contedia pour le rituel du coucher. Ce sont deux expériences différentes qui se complètent bien."
    },
    {
      question: "Quel âge pour Epopia vs Contedia ?",
      answer: "Epopia cible principalement les 5-10 ans, car l'enfant doit savoir lire et écrire pour participer pleinement à l'aventure épistolaire. Contedia couvre une tranche plus large, de 0 à 10 ans, car ce sont les parents qui lisent l'histoire aux plus petits. Pour les tout-petits (0-4 ans), Contedia est le seul choix adapté."
    },
    {
      question: "Epopia est-il mieux pour apprendre à lire ?",
      answer: "Epopia a un vrai avantage pour l'apprentissage de la lecture et de l'écriture, car l'enfant doit lire les lettres reçues et rédiger ses réponses. C'est un exercice actif. Contedia développe plutôt le goût de la lecture et l'imagination grâce à des histoires captivantes où l'enfant est le héros. Les deux approches sont bénéfiques, mais pour la pratique active de l'écriture, Epopia a l'avantage."
    },
    {
      question: "Contedia remplace-t-il Epopia ?",
      answer: "Non, Contedia ne remplace pas Epopia car ce sont deux concepts différents. Epopia est une aventure interactive par courrier postal où l'enfant influence l'histoire en répondant aux lettres. Contedia est un générateur de livres personnalisés par IA, avec des histoires instantanées et des illustrations uniques. Si vous cherchez un livre personnalisé immédiat, choisissez Contedia. Si vous cherchez une aventure épistolaire sur plusieurs semaines, Epopia est fait pour ça."
    }
  ];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Contedia vs Epopia : Quel Livre Personnalisé Choisir en 2026 ?",
    "description": "Comparatif honnête Contedia vs Epopia : prix, personnalisation IA vs courrier, délai, qualité. Quel livre personnalisé enfant choisir ? Test gratuit Contedia inclus.",
    "image": "https://contedia.fr/images/blog/contedia-vs-epopia.jpg",
    "author": { "@type": "Organization", "name": "Contedia", "url": "https://contedia.fr" },
    "publisher": { "@type": "Organization", "name": "Contedia", "logo": { "@type": "ImageObject", "url": "https://contedia.fr/logo-conte-ia.png" } },
    "datePublished": "2026-04-18",
    "dateModified": "2026-04-18",
    "mainEntityOfPage": { "@type": "WebPage", "@id": "https://contedia.fr/blog/contedia-vs-epopia-comparatif" }
  };

  return (
    <PageLayout>
      <SEOHead
        title="Contedia vs Epopia : Quel Livre Personnalisé Choisir en 2026 ?"
        description="Comparatif honnête Contedia vs Epopia : prix, personnalisation IA vs courrier, délai, qualité. Quel livre personnalisé enfant choisir ? Test gratuit Contedia inclus."
        type="article"
      />
      <SchemaFAQ questions={faqQuestions} />
      <SchemaBreadcrumb items={[
        { name: "Accueil", url: "https://contedia.fr/" },
        { name: "Blog", url: "https://contedia.fr/blog" },
        { name: "Contedia vs Epopia", url: "https://contedia.fr/blog/contedia-vs-epopia-comparatif" }
      ]} />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
      </Helmet>

      <div className="article-container">
        <div className="article-breadcrumb">
          <Link to="/blog">Blog</Link> / Contedia vs Epopia
        </div>

        <div className="article-layout">
          <div className="article-main">
            <div className="article-header">
              <h1>Contedia vs Epopia : Comparatif Honnête pour Choisir le Meilleur Livre Personnalisé</h1>
              <div className="article-meta">
                <span>Par l'équipe Contedia · Mis à jour le 18 avril 2026 · 7 min de lecture</span>
              </div>
            </div>

            <div className="article-image">
              <img
                src="/images/blog/contedia-vs-epopia.jpg"
                alt="Comparatif Contedia vs Epopia — livre personnalisé IA contre aventure épistolaire par courrier"
                loading="lazy"
                onError={(e) => { const target = e.target as HTMLImageElement; target.src = '/images/placeholder-blog.jpg'; }}
              />
            </div>

            <div className="article-content">
              <p className="article-intro">
                <strong>Contedia ou Epopia ?</strong> Les deux promettent de mettre votre enfant au coeur d'une histoire unique. Mais les approches sont radicalement différentes : <strong>Contedia</strong> génère un <Link to="/livre-personnalise-enfant">livre personnalisé</Link> instantané grâce à l'IA, tandis qu'<strong>Epopia</strong> propose une aventure épistolaire par courrier postal. Prix, délai, personnalisation, format : voici notre <strong>comparatif honnête</strong> pour vous aider à choisir.
              </p>

              <div className="article-cta">
                <Link to="/create-story" className="cta-button">
                  Essayer Contedia gratuitement
                </Link>
              </div>

              <h2 id="deux-approches">Epopia et Contedia : deux approches très différentes</h2>

              <h3>Epopia : l'aventure par courrier</h3>
              <p>
                Epopia est un concept original né en France. L'enfant reçoit un <strong>courrier postal</strong> contenant des lettres, des cartes et des éléments d'une aventure dont il est le héros. Il doit <strong>lire les lettres, répondre par écrit</strong>, et ses choix influencent la suite de l'histoire. L'aventure se déroule sur <strong>plusieurs semaines</strong>, avec des envois réguliers.
              </p>
              <p>
                C'est une expérience immersive qui développe la lecture et l'écriture. L'enfant attend le facteur avec impatience, ouvre ses enveloppes comme des trésors, et participe activement à la narration. Le modèle est un <strong>abonnement autour de 10-12€/mois</strong>.
              </p>
              <p>
                Les univers proposés par Epopia sont variés : devenir roi ou reine d'un royaume, diriger une réserve naturelle, voyager dans le temps... Chaque aventure est conçue pour captiver l'enfant sur la durée et l'encourager à écrire régulièrement.
              </p>

              <h3>Contedia : le livre personnalisé instantané par IA</h3>
              <p>
                <Link to="/livre-personnalise-enfant">Contedia</Link> prend une approche complètement différente. Vous remplissez un formulaire avec le prénom, l'âge et les passions de votre enfant. En <strong>5 minutes</strong>, l'intelligence artificielle écrit une histoire unique et génère des <strong>illustrations personnalisées</strong>. Vous recevez un livre PDF complet par email.
              </p>
              <p>
                Le premier livre est <strong>gratuit</strong>. Ensuite, chaque livre coute 2,99€, ou vous pouvez rejoindre le <Link to="/club">Club Contedia</Link> pour 9,99€/mois (4 livres avec plus de pages et d'options). C'est idéal pour le <Link to="/blog/conte-personnalise-rituel-coucher">rituel du coucher</Link>, les cadeaux personnalisés, ou simplement pour nourrir l'imagination d'un enfant qui dévore les histoires.
              </p>
              <p>
                La force de Contedia réside dans sa <strong>personnalisation poussée par IA</strong> : chaque histoire est écrite de zéro, les illustrations sont générées pour correspondre à l'enfant (y compris à partir d'une photo), et le vocabulaire s'adapte automatiquement à l'âge. Aucun livre n'est identique, même avec les mêmes paramètres.
              </p>

              <h2 id="comparatif">Comparatif détaillé point par point</h2>
              <p>
                Pour vous aider à y voir clair, nous avons comparé <strong>Contedia et Epopia</strong> sur 10 critères concrets. Nous avons essayé d'être aussi objectifs que possible, en reconnaissant les forces de chaque service.
              </p>
              <p>
                Voici le tableau comparatif complet :
              </p>

              <table style={{ width: '100%', borderCollapse: 'collapse', margin: '16px 0' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-secondary)' }}>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>Critère</th>
                    <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid var(--border-color)', fontWeight: 700 }}>Contedia</th>
                    <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid var(--border-color)', fontWeight: 700 }}>Epopia</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Format', 'Livre numérique (PDF)', 'Courrier postal (lettres)'],
                    ['Délai de réception', '5 minutes', 'Plusieurs jours (courrier)'],
                    ['Prix', 'Gratuit puis 2,99€/livre ou 9,99€/mois', '~10-12€/mois (abonnement)'],
                    ['Personnalisation', 'IA : prénom, âge, passions, photo', 'Prénom, choix narratifs par courrier'],
                    ['Illustrations', 'Générées par IA, uniques', 'Illustrations pré-dessinées'],
                    ['Tranche d\'âge', '0-10 ans', '5-10 ans'],
                    ['Personnages secondaires', 'Jusqu\'à 5 (Club)', 'Personnages de l\'univers'],
                    ['Interactivité', 'Formulaire en ligne', 'L\'enfant répond par courrier'],
                    ['Idéal comme cadeau', 'Oui, instantané', 'Oui, mais prévoir le délai'],
                    ['Essai gratuit', 'Oui, 1er livre offert', 'Non'],
                  ].map(([critere, contedia, epopia], i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '10px 12px', fontSize: '0.9rem', fontWeight: 600 }}>{critere}</td>
                      <td style={{ padding: '10px 12px', fontSize: '0.9rem', textAlign: 'center' }}>{contedia}</td>
                      <td style={{ padding: '10px 12px', fontSize: '0.9rem', textAlign: 'center' }}>{epopia}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p>
                Les deux services ont leurs forces. Contedia brille par sa <strong>rapidité et son accessibilité</strong> (premier livre gratuit, livraison instantanée). Epopia se distingue par son <strong>expérience immersive par courrier</strong> et l'implication active de l'enfant dans l'écriture. Consultez aussi nos comparatifs avec <Link to="/blog/contedia-vs-wonderbly-comparatif">Wonderbly</Link> et <Link to="/blog/contedia-vs-hourra-heros-comparatif">Hourra Héros</Link> pour une vue complète du marché.
              </p>

              <div className="article-cta">
                <Link to="/create-story" className="cta-button">
                  Tester Contedia gratuitement
                </Link>
              </div>

              <h2 id="quel-enfant">Pour quel enfant choisir Epopia ou Contedia ?</h2>
              <p>
                Au-delà des chiffres, le choix dépend surtout du <strong>profil de votre enfant</strong> et de ce que vous recherchez comme expérience. Voici nos recommandations selon les situations :
              </p>

              <h3>Choisissez Epopia si votre enfant...</h3>
              <ul>
                <li><strong>Aime recevoir du courrier</strong> — l'attente du facteur fait partie de la magie</li>
                <li><strong>A entre 5 et 10 ans</strong> — il doit savoir lire et écrire pour participer</li>
                <li><strong>Adore écrire</strong> — Epopia encourage l'enfant à rédiger ses réponses</li>
                <li><strong>Aime les aventures longues</strong> — l'histoire se déroule sur plusieurs semaines</li>
                <li><strong>A besoin de pratiquer la lecture/écriture</strong> — c'est un excellent exercice déguisé en jeu</li>
              </ul>

              <h3>Choisissez Contedia si votre enfant...</h3>
              <ul>
                <li><strong>A moins de 5 ans</strong> — les parents lisent l'histoire, pas besoin de savoir lire</li>
                <li><strong>Adore les histoires du soir</strong> — un nouveau conte en 5 minutes pour le <Link to="/blog/conte-personnalise-rituel-coucher">rituel du coucher</Link></li>
                <li><strong>Veut se voir dans l'histoire</strong> — la photo uploadée permet des illustrations à son image</li>
                <li><strong>Dévore les livres</strong> — avec le Club, 4 nouveaux livres par mois</li>
                <li><strong>Vous cherchez un cadeau rapide</strong> — un <Link to="/blog/conte-personnalise-gratuit">livre personnalisé gratuit</Link> prêt en 5 minutes</li>
              </ul>

              <h3>Et pourquoi pas les deux ?</h3>
              <p>
                Beaucoup de familles combinent les deux. Epopia pour l'aventure par courrier le week-end, Contedia pour les histoires du soir en semaine. Les deux expériences sont complémentaires : l'une est active (l'enfant écrit), l'autre est contemplative (l'enfant écoute ou lit). Rien n'oblige à choisir.
              </p>
              <p>
                Un enfant de 6 ans peut très bien recevoir son aventure Epopia le mercredi, répondre à ses lettres le week-end, et demander chaque soir un nouveau conte Contedia avec ses thèmes préférés. Les deux nourissent l'amour de la lecture, chacun à sa manière.
              </p>

              <h2 id="verdict">Notre verdict honnête</h2>
              <p>
                Soyons transparents : nous sommes Contedia, donc nous avons un biais. Mais nous croyons qu'un comparatif honnête sert mieux nos lecteurs qu'un article promotionnel. Voici notre analyse sincère.
              </p>
              <p>
                Ce que nous aimons chez Epopia : le concept du courrier est magique, l'enfant est vraiment acteur de l'histoire, et cela développe des compétences concrètes en lecture et écriture. Ce n'est pas un gadget — c'est un vrai outil éducatif ludique.
              </p>
              <p>
                <strong>Epopia est un excellent produit</strong> pour les enfants qui aiment le courrier, l'écriture et les aventures longues. L'expérience épistolaire est unique et vraiment engageante. Si votre enfant a entre 5 et 10 ans et que vous cherchez un outil ludique pour pratiquer la lecture et l'écriture, Epopia mérite clairement d'être essayé.
              </p>
              <p>
                <strong>Contedia répond à un besoin différent</strong> : des histoires personnalisées instantanées, avec des illustrations uniques générées par IA, accessibles dès la naissance. Le premier livre est gratuit, la livraison est immédiate, et le prix est plus bas pour un usage régulier. C'est le choix naturel pour les rituels du coucher, les cadeaux de dernière minute, et les familles avec des enfants en bas âge.
              </p>
              <p>
                Si vous hésitez encore, la meilleure façon de trancher est de <strong>tester Contedia gratuitement</strong>. Vous aurez votre premier livre en 5 minutes — sans engagement, sans carte bancaire. Vous pourrez ainsi comparer concrètement avec Epopia et décider en connaissance de cause.
              </p>
              <p>
                <strong>En résumé :</strong>
              </p>
              <ul>
                <li><strong>Aventure longue par courrier + pratique de l'écriture</strong> → Epopia</li>
                <li><strong>Livre personnalisé instantané + illustrations IA + gratuit pour tester</strong> → <Link to="/create-story">Contedia</Link></li>
                <li><strong>Les deux en même temps</strong> → la meilleure option pour les familles lectrices</li>
              </ul>

              <div className="article-cta">
                <Link to="/create-story" className="cta-button">
                  Créer mon premier livre gratuit sur Contedia
                </Link>
              </div>

              <h2 id="faq">FAQ : Contedia vs Epopia</h2>
              <p>
                Voici les questions les plus fréquentes des parents qui hésitent entre <strong>Epopia et Contedia</strong> :
              </p>

              {faqQuestions.map((faq, i) => (
                <React.Fragment key={i}>
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </React.Fragment>
              ))}

              <div className="article-cta">
                <Link to="/create-story" className="cta-button">
                  Essayer Contedia gratuitement — Premier livre offert
                </Link>
              </div>

              <p>
                <em>Découvrez aussi :</em>
              </p>
              <ul>
                <li><Link to="/livre-personnalise-enfant">Livre personnalisé enfant : tout savoir</Link></li>
                <li><Link to="/blog/contedia-vs-wonderbly-comparatif">Contedia vs Wonderbly : le comparatif</Link></li>
                <li><Link to="/blog/contedia-vs-hourra-heros-comparatif">Contedia vs Hourra Héros : le comparatif</Link></li>
                <li><Link to="/blog/conte-personnalise-gratuit">Conte personnalisé gratuit : comment ça marche</Link></li>
                <li><Link to="/club">Le Club Contedia : 4 livres par mois</Link></li>
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

export default BlogArticleVsEpopia;

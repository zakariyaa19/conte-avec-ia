import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { SEOHead } from '../components/SEOHead';
import { SchemaFAQ, SchemaBreadcrumb, SchemaHowTo } from '../components/SchemaMarkup';
import { Helmet } from 'react-helmet-async';
import '../styles/BlogArticle.css';

const BlogArticleConteGratuit: React.FC = () => {

  const tableOfContents = [
    { title: "Ce que vous allez recevoir", id: "ce-que-vous-recevez" },
    { title: "Comment créer votre conte en 3 étapes", id: "3-etapes" },
    { title: "Pourquoi c'est vraiment gratuit", id: "vraiment-gratuit" },
    { title: "Ce que les parents en pensent", id: "temoignages" },
    { title: "Gratuit vs Club : les différences", id: "gratuit-vs-club" },
    { title: "Pour quel âge ?", id: "par-age" },
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
      question: "Comment créer un conte personnalisé gratuit ?",
      answer: "Allez sur Contedia, cliquez « Créer un livre », remplissez le formulaire (prénom, âge, passions, thème) en 2 minutes. L'IA écrit et illustre un conte unique. Vous le recevez par email en 5 minutes. Le premier conte est 100% gratuit, sans carte bancaire."
    },
    {
      question: "Est-ce vraiment gratuit sans carte bancaire ?",
      answer: "Oui. Aucune carte bancaire n'est demandée. Aucun abonnement caché. Vous entrez simplement votre email pour recevoir le livre. Si vous ne revenez jamais, vous ne payez jamais. C'est un vrai cadeau, pas un piège."
    },
    {
      question: "Que contient le conte personnalisé gratuit ?",
      answer: "Le conte gratuit contient 3 pages de texte écrit par l'IA + 7 illustrations uniques générées pour correspondre à l'histoire. Le prénom de votre enfant est intégré dans toute l'histoire, pas juste sur la couverture. Vous recevez un PDF téléchargeable et lisible sur tout appareil."
    },
    {
      question: "En combien de temps reçoit-on le conte ?",
      answer: "Le formulaire prend 2 minutes. La génération par l'IA prend 3 minutes. Vous recevez votre livre par email en 5 minutes au total. C'est aussi accessible dans votre bibliothèque en ligne sur Contedia."
    },
    {
      question: "Mon enfant peut-il avoir sa photo dans l'histoire ?",
      answer: "Oui ! Vous pouvez uploader une photo de votre enfant. L'IA génère des illustrations où le personnage principal ressemble à votre enfant. C'est optionnel — sans photo, l'IA crée un personnage basé sur l'âge et le sexe indiqués."
    },
    {
      question: "Quelle est la différence entre le conte gratuit et le Club Contedia ?",
      answer: "Le conte gratuit : 3 pages, 7 illustrations, 1 style. Le Club (9,99€/mois) : 4 livres par mois, 20 pages, 12+ illustrations, 9 styles d'illustration, personnages secondaires, occasions spéciales, crédits cumulables. Le gratuit est parfait pour tester. Le Club pour les familles qui veulent un nouveau conte régulièrement."
    }
  ];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Conte Personnalisé Gratuit pour Enfant — Créez le Vôtre en 2 Minutes",
    "description": "Guide complet pour créer un conte personnalisé gratuit pour votre enfant. Ce que vous recevez, comment ça marche, pourquoi c'est gratuit. Premier livre offert.",
    "image": "https://contedia.fr/images/blog/conte-personnalise-gratuit.jpg",
    "author": { "@type": "Organization", "name": "Contedia", "url": "https://contedia.fr" },
    "publisher": { "@type": "Organization", "name": "Contedia", "logo": { "@type": "ImageObject", "url": "https://contedia.fr/logo-conte-ia.png" } },
    "datePublished": "2026-03-30",
    "dateModified": "2026-03-30",
    "mainEntityOfPage": { "@type": "WebPage", "@id": "https://contedia.fr/blog/conte-personnalise-gratuit" }
  };

  return (
    <PageLayout>
      <SEOHead
        title="Conte Personnalisé Gratuit pour Enfant — Créez le Vôtre en 2 Min | Contedia"
        description="Créez un conte personnalisé gratuit pour votre enfant. Son prénom, ses passions, des illustrations uniques par IA. Prêt en 2 minutes, 0€, sans carte bancaire."
        type="article"
      />
      <SchemaFAQ questions={faqQuestions} />
      <SchemaBreadcrumb items={[
        { name: "Accueil", url: "https://contedia.fr/" },
        { name: "Blog", url: "https://contedia.fr/blog" },
        { name: "Conte personnalisé gratuit", url: "https://contedia.fr/blog/conte-personnalise-gratuit" }
      ]} />
      <SchemaHowTo
        name="Créer un conte personnalisé gratuit pour votre enfant"
        description="Comment créer un livre personnalisé gratuit en 3 étapes simples sur Contedia"
        totalTime="PT5M"
        steps={[
          { name: "Remplissez le formulaire", text: "Entrez le prénom de votre enfant, choisissez un thème et décrivez ses passions. L'IA s'occupe du reste." },
          { name: "L'IA crée l'histoire", text: "Notre intelligence artificielle génère une histoire unique avec des illustrations personnalisées en quelques minutes." },
          { name: "Recevez votre livre", text: "Votre livre personnalisé est prêt ! Lisez-le en ligne ou téléchargez le PDF illustré gratuitement." }
        ]}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
      </Helmet>

      <div className="article-container">
        <div className="article-breadcrumb">
          <Link to="/blog">Blog</Link> / Conte personnalisé gratuit
        </div>

        <div className="article-layout">
          <div className="article-main">
            <div className="article-header">
              <h1>Conte Personnalisé Gratuit : Comment Créer une Histoire Unique pour Votre Enfant</h1>
              <div className="article-meta">
                <span>Par l'équipe Contedia · Mis à jour le 30 mars 2026 · 6 min de lecture</span>
              </div>
            </div>

            <div className="article-image">
              <img
                src="/images/blog/conte-personnalise-gratuit.jpg"
                alt="Enfant émerveillé découvrant son conte personnalisé gratuit — livre magique illustré"
                loading="lazy"
                onError={(e) => { const target = e.target as HTMLImageElement; target.src = '/images/placeholder-blog.jpg'; }}
              />
            </div>

            <div className="article-content">
              <p className="article-intro">
                <strong>Votre enfant, héros de sa propre histoire — et c'est gratuit.</strong> Pas de carte bancaire, pas d'engagement, pas de piège. Sur Contedia, l'intelligence artificielle écrit un <strong>conte personnalisé</strong> unique avec le prénom de votre enfant, ses passions et des illustrations créées pour lui. Le résultat ? Un livre qu'il voudra relire 10 fois. Le prix ? <strong>0€ pour le premier.</strong> Voici exactement ce que vous allez recevoir et comment le créer en 2 minutes.
              </p>

              <div className="article-cta">
                <Link to="/create-story" className="cta-button">
                  Créer le conte gratuit de mon enfant
                </Link>
              </div>

              <h2 id="ce-que-vous-recevez">Ce que vous allez recevoir (gratuitement)</h2>
              <p>
                Le conte personnalisé gratuit sur <Link to="/livre-personnalise-enfant">Contedia</Link> n'est pas une version bridée ou un simple aperçu. C'est un <strong>vrai livre complet</strong> :
              </p>
              <ul>
                <li><strong>3 pages d'histoire</strong> — écrites par l'IA à partir de zéro, intégrant le prénom, l'âge et les passions de votre enfant</li>
                <li><strong>7 illustrations uniques</strong> — générées par IA, dans un style professionnel, avec un personnage qui correspond à votre enfant</li>
                <li><strong>Une couverture personnalisée</strong> — avec le titre du conte et le nom de votre enfant</li>
                <li><strong>Un PDF téléchargeable</strong> — lisible sur téléphone, tablette ou ordinateur, imprimable</li>
                <li><strong>Accès à votre bibliothèque en ligne</strong> — relisez le conte à tout moment sur Contedia</li>
              </ul>
              <p>
                Deux enfants du même âge avec les mêmes passions recevront deux histoires <strong>complètement différentes</strong>. L'IA ne recycle pas — elle crée. C'est la différence fondamentale avec les <Link to="/blog/livre-personnalise-vs-livre-classique-enfant">livres personnalisés classiques</Link> qui remplacent juste un prénom dans un texte standard.
              </p>

              <h2 id="3-etapes">Comment créer votre conte en 3 étapes</h2>

              <h3>Étape 1 — Remplissez le formulaire (2 minutes)</h3>
              <p>
                Allez sur la <Link to="/create-story">page de création</Link> et répondez à quelques questions simples :
              </p>
              <ul>
                <li><strong>Prénom</strong> de votre enfant</li>
                <li><strong>Âge</strong> (l'IA adapte le vocabulaire et la complexité)</li>
                <li><strong>Passions</strong> — dinosaures, espace, princesses, foot, animaux...</li>
                <li><strong>Thème</strong> — courage, amitié, famille, découverte...</li>
                <li><strong>Photo</strong> (optionnel) — le personnage lui ressemblera</li>
              </ul>
              <p>
                C'est tout. Pas de compte à créer d'abord, pas de formulaire interminable. Juste ces quelques infos et votre email pour recevoir le livre.
              </p>

              <h3>Étape 2 — L'IA écrit et illustre (3 minutes)</h3>
              <p>
                L'<Link to="/blog/intelligence-artificielle-histoires-enfants">intelligence artificielle</Link> prend le relais. Elle écrit chaque phrase de l'histoire en intégrant naturellement tous les éléments que vous avez fournis. En parallèle, un autre modèle d'IA génère les illustrations — chacune unique, cohérente avec le texte.
              </p>
              <p>
                Ce n'est pas du « copier-coller avec un prénom ». L'IA compose une trame narrative originale où votre enfant est le <Link to="/blog/enfant-heros-propre-histoire">héros de l'aventure</Link>.
              </p>

              <h3>Étape 3 — Recevez votre livre par email (instantané)</h3>
              <p>
                Votre conte arrive dans votre boîte mail en PDF. Vous pouvez aussi le lire directement dans votre bibliothèque Contedia. Lisez-le avec votre enfant le soir même — c'est le <Link to="/blog/conte-personnalise-rituel-coucher">rituel du coucher</Link> parfait.
              </p>

              <div className="article-cta">
                <Link to="/create-story" className="cta-button">
                  Créer mon conte gratuit maintenant
                </Link>
              </div>

              <h2 id="vraiment-gratuit">Pourquoi c'est vraiment gratuit (sans piège)</h2>
              <p>
                La question la plus posée. Voici la réponse honnête :
              </p>
              <p>
                <strong>Le premier conte est gratuit parce que c'est la meilleure façon de vous convaincre.</strong> On est tellement sûrs que vous allez adorer que le risque est pour nous, pas pour vous. Concrètement :
              </p>
              <ul>
                <li><strong>Pas de carte bancaire</strong> — on ne vous la demande pas, ni maintenant ni après</li>
                <li><strong>Pas d'abonnement caché</strong> — vous ne serez pas débité dans 7 jours</li>
                <li><strong>Pas de version « limitée »</strong> — le conte gratuit est un vrai livre complet avec illustrations</li>
                <li><strong>Pas de spam</strong> — vous recevez votre livre + 3 emails de suivi, c'est tout</li>
              </ul>
              <p>
                Si vous aimez, vous pourrez créer d'autres contes (3,99€ l'unité) ou rejoindre le <Link to="/club">Club Contedia</Link> (9,99€/mois pour 4 livres avec 2x plus de pages). Si vous n'aimez pas, vous gardez votre conte gratuit et c'est fini. Aucune obligation.
              </p>

              <h2 id="temoignages">Ce que les parents en pensent</h2>
              <ul>
                <li><strong>Aurélie, maman de Léa (5 ans)</strong> — <em>« J'ai créé le conte gratuit par curiosité. Léa l'a ouvert et a crié "C'est MOI !" Elle l'a relu 6 fois le premier soir. On est passés au Club le lendemain. »</em></li>
                <li><strong>Thomas, papa de Raphaël (6 ans)</strong> — <em>« Mon fils détestait les livres. J'ai essayé le gratuit avec ses dinosaures. Il l'a lu tout seul, 4 fois de suite. Première fois de sa vie qu'il demandait un livre. »</em></li>
                <li><strong>Fatima, maman de Yasmine (4 ans)</strong> — <em>« J'étais sceptique sur le "gratuit". Mais c'est un vrai livre, avec de belles illustrations. Yasmine dort avec depuis 2 semaines. »</em></li>
              </ul>

              <div className="article-cta">
                <Link to="/create-story" className="cta-button">
                  Rejoignez +500 parents — C'est gratuit
                </Link>
              </div>

              <h2 id="gratuit-vs-club">Conte gratuit vs Club Contedia : quelle différence ?</h2>
              <p>
                Le conte gratuit est parfait pour découvrir. Le <Link to="/club">Club</Link> est fait pour les familles qui veulent un nouveau conte chaque semaine.
              </p>
              <table style={{ width: '100%', borderCollapse: 'collapse', margin: '16px 0' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-secondary)' }}>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}></th>
                    <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid var(--border-color)', fontWeight: 700 }}>Gratuit</th>
                    <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid var(--border-color)', fontWeight: 700 }}>Club (9,99€/mois)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Pages par livre', '6', '12'],
                    ['Illustrations', '7', '12+'],
                    ['Styles d\'illustration', '1', '9'],
                    ['Livres par mois', '1 (premier)', '4'],
                    ['Personnages secondaires', '1', '5'],
                    ['Occasions spéciales', 'Non', 'Oui (Noël, anniversaire...)'],
                    ['Animal de compagnie', 'Non', 'Oui'],
                    ['Crédits cumulables', 'Non', 'Oui'],
                    ['Prix', '0€', '9,99€/mois (annulable)'],
                  ].map(([feature, free, club], i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '10px 12px', fontSize: '0.9rem', fontWeight: 600 }}>{feature}</td>
                      <td style={{ padding: '10px 12px', fontSize: '0.9rem', textAlign: 'center' }}>{free}</td>
                      <td style={{ padding: '10px 12px', fontSize: '0.9rem', textAlign: 'center' }}>{club}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p>
                <strong>Notre conseil :</strong> commencez par le gratuit. Si votre enfant redemande « encore une histoire ! », vous saurez que le Club est fait pour vous.
              </p>

              <h2 id="par-age">Pour quel âge ?</h2>
              <p>
                Le conte personnalisé gratuit s'adapte automatiquement à l'âge de votre enfant :
              </p>
              <ul>
                <li><strong>0-2 ans</strong> — Histoire très courte, illustrations vives. Les parents lisent à voix haute. Le bébé entend son prénom et découvre les images.</li>
                <li><strong>3-5 ans</strong> — L'enfant reconnaît son prénom, s'identifie au héros. Vocabulaire simple, aventures magiques, animaux qui parlent. C'est l'âge où l'effet « wahou » est le plus fort.</li>
                <li><strong>6-8 ans</strong> — Récits plus élaborés avec des intrigues, des mystères. L'enfant peut lire seul. Le texte développe la confiance et l'imagination.</li>
              </ul>
              <p>
                Consultez notre <Link to="/blog/guide-livre-personnalise-enfant-2026">guide complet par âge</Link> pour choisir le thème idéal.
              </p>

              <h2 id="faq">FAQ : Conte personnalisé gratuit</h2>

              {faqQuestions.map((faq, i) => (
                <React.Fragment key={i}>
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </React.Fragment>
              ))}

              <div className="article-cta">
                <Link to="/create-story" className="cta-button">
                  Créer le conte gratuit de mon enfant
                </Link>
              </div>

              <p>
                <em>Découvrez aussi :</em>
              </p>
              <ul>
                <li><Link to="/livre-personnalise-enfant">Livre personnalisé enfant : tout savoir</Link></li>
                <li><Link to="/blog/guide-livre-personnalise-enfant-2026">Le guide complet du livre personnalisé 2026</Link></li>
                <li><Link to="/blog/meilleurs-livres-personnalises-enfants-comparatif-2026">Comparatif des 10 meilleurs livres personnalisés</Link></li>
                <li><Link to="/blog/enfant-heros-propre-histoire">Pourquoi les enfants adorent être le héros</Link></li>
                <li><Link to="/blog/conte-personnalise-rituel-coucher">Le conte personnalisé comme rituel du coucher</Link></li>
                <li><Link to="/blog/intelligence-artificielle-histoires-enfants">Comment l'IA crée un conte unique</Link></li>
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

export default BlogArticleConteGratuit;

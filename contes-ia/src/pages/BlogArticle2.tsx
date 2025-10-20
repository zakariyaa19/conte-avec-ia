import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import '../styles/BlogArticle.css';

const BlogArticle2: React.FC = () => {
  useEffect(() => {
    document.title = 'Des livres pour enfants avec plus de personnages et d\'aventures | Blog Contes IA';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Découvrez nos nouvelles fonctionnalités : créez des histoires personnalisées avec jusqu\'à 5 personnages, nouveaux styles artistiques et aventures pour adolescents. L\'évolution des contes IA.');
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]') || document.createElement('meta');
    metaKeywords.setAttribute('name', 'keywords');
    metaKeywords.setAttribute('content', 'livre personnalisé plusieurs personnages, conte IA frères soeurs, histoire personnalisée famille, livre magique ados, conte personnalisé adolescent, nouveaux styles dessin IA, aventures personnalisées enfants');
    if (!document.querySelector('meta[name="keywords"]')) {
      document.head.appendChild(metaKeywords);
    }
  }, []);

  const tableOfContents = [
    { title: "Jusqu'à cinq personnages dans une même histoire", id: "cinq-personnages" },
    { title: "Créer des aventures familiales complètes", id: "aventures-familiales" },
    { title: "Renforcer les liens entre frères et sœurs", id: "liens-freres-soeurs" },
    { title: "Nouveaux styles artistiques révolutionnaires", id: "nouveaux-styles" },
    { title: "Du réalisme à la fantaisie", id: "realisme-fantaisie" },
    { title: "Personnalisation artistique avancée", id: "personnalisation-artistique" },
    { title: "Des aventures spécialement conçues pour les ados", id: "aventures-ados" },
    { title: "Thèmes plus matures et engageants", id: "themes-matures" },
    { title: "Développement de l'identité adolescente", id: "identite-adolescente" },
    { title: "Comment utiliser ces nouvelles fonctionnalités", id: "utiliser-fonctionnalites" }
  ];

  const handleScrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <PageLayout>
      <div className="article-container">
        <div className="article-breadcrumb">
          <Link to="/blog">Blog</Link> / Des livres pour enfants avec plus de personnages et d'aventures
        </div>

        <div className="article-layout">
          <div className="article-main">
            <div className="article-header">
              <h1>Des livres pour enfants avec plus de personnages, de nouveaux styles de dessin & des aventures pour ados</h1>
              <div className="article-meta">
                <span>Dernière mise à jour le 12-06-2025</span>
              </div>
            </div>

            <div className="article-image">
              <img 
                src="/images/blog/enfant-lecture-personnalisee.jpg" 
                alt="Petite fille lisant un livre coloré personnalisé"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/placeholder-blog.jpg';
                }}
              />
            </div>

            <div className="article-content">
              <p className="article-intro">
                Nous sommes ravis d'annoncer les dernières innovations de notre plateforme de contes personnalisés ! Désormais, créez des histoires encore plus riches avec jusqu'à cinq personnages, explorez de nouveaux styles artistiques époustouflants, et découvrez des aventures spécialement conçues pour les adolescents. L'avenir de la littérature personnalisée est là !
              </p>

              <h2 id="cinq-personnages">Jusqu'à cinq personnages dans une même histoire</h2>
              
              <h3 id="aventures-familiales">Créer des aventures familiales complètes</h3>
              <p>
                Fini le temps où un seul enfant pouvait être le héros de l'histoire ! Notre nouvelle technologie permet d'intégrer jusqu'à cinq personnages dans un même conte personnalisé. Imaginez toute la famille - parents, enfants, grands-parents - vivant ensemble une aventure extraordinaire.
              </p>
              <p>
                Cette fonctionnalité révolutionnaire utilise une IA avancée pour maintenir la cohérence narrative tout en donnant à chaque personnage un rôle significatif dans l'histoire. Chaque membre de la famille a sa personnalité, ses forces et contribue de manière unique au déroulement de l'aventure.
              </p>

              <h3 id="liens-freres-soeurs">Renforcer les liens entre frères et sœurs</h3>
              <p>
                Les histoires multi-personnages sont particulièrement bénéfiques pour les familles avec plusieurs enfants. Au lieu de créer des livres séparés, vous pouvez maintenant offrir une aventure commune qui célèbre la fratrie dans son ensemble.
              </p>
              <p>
                Ces contes collaboratifs enseignent des valeurs importantes comme la coopération, l'entraide et la complémentarité. Chaque enfant se reconnaît dans l'histoire tout en apprenant à valoriser les qualités de ses frères et sœurs.
              </p>

              <h2 id="nouveaux-styles">Nouveaux styles artistiques révolutionnaires</h2>

              <h3 id="realisme-fantaisie">Du réalisme à la fantaisie</h3>
              <p>
                Notre palette artistique s'enrichit considérablement avec l'introduction de nouveaux styles de dessin générés par IA. Vous pouvez maintenant choisir parmi :
              </p>
              <ul>
                <li><strong>Style aquarelle moderne</strong> : Doux et poétique, parfait pour les histoires contemplatives</li>
                <li><strong>Illustration vectorielle dynamique</strong> : Colorée et énergique pour les aventures palpitantes</li>
                <li><strong>Art numérique réaliste</strong> : Pour des histoires qui se rapprochent de la réalité</li>
                <li><strong>Style manga adapté</strong> : Inspiré de l'art japonais, très apprécié des jeunes</li>
                <li><strong>Illustration vintage</strong> : Un charme rétro pour des contes intemporels</li>
              </ul>

              <h3 id="personnalisation-artistique">Personnalisation artistique avancée</h3>
              <p>
                Chaque style peut être personnalisé selon vos préférences. Notre IA analyse non seulement les caractéristiques physiques des personnages, mais adapte également le style artistique à l'âge des lecteurs et au ton de l'histoire choisie.
              </p>
              <p>
                Cette approche garantit une cohérence visuelle parfaite tout au long du livre, créant une expérience de lecture immersive et esthétiquement plaisante.
              </p>

              <h2 id="aventures-ados">Des aventures spécialement conçues pour les ados</h2>

              <h3 id="themes-matures">Thèmes plus matures et engageants</h3>
              <p>
                Reconnaissant que les adolescents ont des besoins narratifs différents, nous avons développé une gamme d'aventures spécialement adaptées à cette tranche d'âge. Ces histoires abordent des thèmes plus complexes et nuancés :
              </p>
              <ul>
                <li>Quêtes d'identité et de découverte de soi</li>
                <li>Aventures de science-fiction et de fantasy moderne</li>
                <li>Histoires d'amitié et de loyauté</li>
                <li>Défis écologiques et engagement citoyen</li>
                <li>Exploration de cultures et de mondes différents</li>
              </ul>

              <h3 id="identite-adolescente">Développement de l'identité adolescente</h3>
              <p>
                Ces nouvelles aventures sont conçues pour accompagner les adolescents dans leur développement personnel. Elles explorent des questions importantes comme la responsabilité, l'indépendance, et la construction de l'identité, tout en conservant l'aspect magique et divertissant des contes.
              </p>
              <p>
                L'IA adapte le vocabulaire, la complexité narrative et les enjeux moraux à l'âge du lecteur, créant des histoires qui résonnent authentiquement avec l'expérience adolescente.
              </p>

              <h2 id="utiliser-fonctionnalites">Comment utiliser ces nouvelles fonctionnalités</h2>
              <p>
                Toutes ces innovations sont intégrées de manière intuitive dans notre processus de création. Lors de la personnalisation de votre conte, vous pouvez maintenant :
              </p>
              <ul>
                <li>Ajouter jusqu'à quatre personnages supplémentaires avec leurs photos et caractéristiques</li>
                <li>Sélectionner votre style artistique préféré parmi notre nouvelle collection</li>
                <li>Choisir le niveau de maturité adapté à l'âge de vos lecteurs</li>
                <li>Personnaliser les relations entre les personnages</li>
              </ul>
              <p>
                Ces améliorations représentent notre engagement continu à faire évoluer la littérature personnalisée. Nous croyons que chaque famille mérite des histoires qui reflètent sa diversité et sa richesse unique.
              </p>

              <div className="article-cta">
                <Link to="/story-form" className="cta-button">
                  ✨ Découvrir les nouvelles fonctionnalités
                </Link>
              </div>
            </div>
          </div>

          <div className="article-sidebar">
            <div className="table-of-contents">
              <h3>Table des matières</h3>
              <ul>
                {tableOfContents.map((item, index) => (
                  <li key={index}>
                    <button 
                      onClick={() => handleScrollToSection(item.id)}
                      className="toc-link"
                    >
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

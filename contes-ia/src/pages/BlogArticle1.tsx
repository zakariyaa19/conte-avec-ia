import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import '../styles/BlogArticle.css';

const BlogArticle1: React.FC = () => {
  useEffect(() => {
    document.title = 'Créer un Livre Personnalisé avec votre Animal de Compagnie | Conte sur Mesure';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Transformez votre chien, chat ou animal favori en héros d\'un conte personnalisé unique. Créez un livre magique où votre enfant et son compagnon vivent des aventures extraordinaires ensemble.');
    }

    // Ajouter les mots-clés SEO
    const metaKeywords = document.querySelector('meta[name="keywords"]') || document.createElement('meta');
    metaKeywords.setAttribute('name', 'keywords');
    metaKeywords.setAttribute('content', 'livre personnalisé animal de compagnie, conte chien personnalisé, histoire chat personnalisée, livre enfant animal héros, cadeau original animal, conte sur mesure animaux, livre magique chien chat, histoire personnalisée famille animal');
    if (!document.querySelector('meta[name="keywords"]')) {
      document.head.appendChild(metaKeywords);
    }
  }, []);

  const tableOfContents = [
    { title: "Votre animal de compagnie, héros d'un conte unique", id: "animal-heros-conte" },
    { title: "Pourquoi choisir un livre personnalisé avec votre animal", id: "pourquoi-choisir" }, 
    { title: "Créer des souvenirs magiques en famille", id: "souvenirs-magiques" },
    { title: "Comment transformer votre animal en personnage de livre", id: "transformer-animal" },
    { title: "Les différents types d'aventures possibles", id: "types-aventures" },
    { title: "Personnalisation complète selon votre animal", id: "personnalisation-complete" },
    { title: "Un cadeau original qui marquera les esprits", id: "cadeau-original" },
    { title: "Commencer votre projet de livre personnalisé", id: "commencer-projet" }
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
          <Link to="/blog">Blog</Link> / Créer un Livre Personnalisé avec votre Animal de Compagnie
        </div>

        <div className="article-layout">
          <div className="article-main">
            <div className="article-header">
              <h1>Créer un Livre Personnalisé avec votre Animal de Compagnie : Le Guide Complet</h1>
              <div className="article-meta">
                <span>Dernière mise à jour le 12-06-2025</span>
              </div>
            </div>

            <div className="article-image">
              <img 
                src="/images/blog/conte-animal-compagnie.jpg" 
                alt="Enfant avec son chien regardant un livre personnalisé"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/placeholder-blog.jpg';
                }}
              />
            </div>

            <div className="article-content">
              <p className="article-intro">
                Vous cherchez un cadeau original qui fera briller les yeux de votre enfant ? Découvrez comment transformer votre fidèle compagnon à quatre pattes en véritable héros de conte personnalisé. Chien, chat, lapin ou même hamster - chaque animal peut devenir le protagoniste d'une aventure sur mesure qui émerveillera toute la famille.
              </p>

              <h2 id="animal-heros-conte">Votre animal de compagnie, héros d'un conte unique</h2>
              <p>
                Dans un monde où les écrans dominent, offrir à votre enfant un livre personnalisé mettant en scène son animal préféré représente bien plus qu'un simple cadeau. C'est créer un lien émotionnel profond entre la lecture et son quotidien. Imaginez la surprise et la joie de votre petit lorsqu'il découvre Rex, son golden retriever, partir à l'aventure dans une forêt enchantée, ou Mimi, sa chatte, résoudre des mystères dans un château magique.
              </p>
              <p>
                Cette personnalisation pousse l'enfant à s'identifier complètement à l'histoire, transformant chaque page tournée en moment de complicité avec son compagnon favori.
              </p>

              <h2 id="pourquoi-choisir">Pourquoi choisir un livre personnalisé avec votre animal</h2>
              <p>
                Les avantages d'un conte personnalisé avec votre animal de compagnie sont multiples. D'abord, cela renforce le lien affectif entre l'enfant et son compagnon. Ensuite, cela stimule l'imagination en montrant que les héros peuvent ressembler à ceux qu'on aime au quotidien.
              </p>
              <p>
                Contrairement aux livres traditionnels, votre conte sur mesure reflète la réalité de votre foyer. Votre enfant retrouve des éléments familiers : le nom de son animal, ses caractéristiques physiques uniques, ses petites manies. Cette familiarité crée une connexion émotionnelle immédiate qui encourage la lecture et développe l'amour des livres.
              </p>

              <h3 id="souvenirs-magiques">Créer des souvenirs magiques en famille</h3>
              <p>
                Un livre personnalisé devient rapidement un trésor familial. C'est l'histoire que votre enfant demandera encore et encore, celle qu'il voudra partager avec ses amis, ses grands-parents. Ces moments de lecture partagée créent des souvenirs durables et renforcent les liens familiaux.
              </p>
              <p>
                De plus, si votre animal vieillit ou n'est plus là, le livre devient un magnifique hommage, une façon de perpétuer son souvenir et de continuer à en parler avec tendresse.
              </p>

              <h2 id="transformer-animal">Comment transformer votre animal en personnage de livre</h2>
              <p>
                Le processus de création est simple et amusant. Il suffit de quelques photos de qualité de votre animal sous différents angles. Notre technologie d'intelligence artificielle analyse ces images pour capturer l'essence unique de votre compagnon : couleur du pelage, forme des oreilles, expression du regard, taille, morphologie.
              </p>
              <p>
                Ensuite, vous personnalisez l'aventure selon la personnalité de votre animal. Un chien énergique partira dans une quête sportive, un chat mystérieux résoudra des énigmes, un lapin curieux explorera de nouveaux territoires. Chaque histoire s'adapte au caractère réel de votre compagnon.
              </p>

              <h3 id="types-aventures">Les différents types d'aventures possibles</h3>
              <p>
                Nos contes personnalisés proposent une variété d'univers adaptés à tous les animaux :
              </p>
              <ul>
                <li><strong>Aventures forestières</strong> : Parfaites pour les chiens aventuriers qui aiment la nature</li>
                <li><strong>Mystères urbains</strong> : Idéales pour les chats malins et observateurs</li>
                <li><strong>Quêtes fantastiques</strong> : Pour tous les animaux qui rêvent de magie</li>
                <li><strong>Explorations sous-marines</strong> : Surprenantes même pour les animaux terrestres</li>
                <li><strong>Voyages dans l'espace</strong> : L'imagination n'a pas de limites !</li>
              </ul>

              <h3 id="personnalisation-complete">Personnalisation complète selon votre animal</h3>
              <p>
                Chaque détail compte dans la création de votre conte sur mesure. Le nom de votre animal, ses couleurs exactes, ses accessoires favoris (collier, jouet, panier) peuvent tous être intégrés dans l'histoire. Même les autres membres de la famille, humains ou animaux, peuvent faire des apparitions dans le récit.
              </p>
              <p>
                Cette attention aux détails garantit que votre enfant reconnaîtra immédiatement son compagnon et se sentira véritablement impliqué dans l'aventure.
              </p>

              <h2 id="cadeau-original">Un cadeau original qui marquera les esprits</h2>
              <p>
                À l'ère du numérique, offrir un livre physique personnalisé représente un geste fort et mémorable. C'est un cadeau qui se démarque lors des anniversaires, de Noël, ou pour célébrer l'arrivée d'un nouvel animal dans la famille.
              </p>
              <p>
                Les enfants adorent montrer "leur" livre à leurs amis, raconter les aventures de leur animal héros. Cela développe leur confiance en eux et leurs compétences narratives, tout en créant des moments de fierté partagée.
              </p>

              <h2 id="commencer-projet">Commencer votre projet de livre personnalisé</h2>
              <p>
                Créer le conte personnalisé de votre animal de compagnie est plus simple que vous ne l'imaginez. En quelques étapes intuitives, vous pouvez concevoir une histoire unique qui célèbre la relation spéciale entre votre enfant et son compagnon.
              </p>
              <p>
                N'attendez plus pour offrir à votre famille ce cadeau exceptionnel. Chaque animal a une personnalité unique qui mérite d'être célébrée dans une aventure sur mesure. Commencez dès aujourd'hui et créez des souvenirs qui dureront toute une vie !
              </p>

              <div className="article-cta">
                <Link to="/story-form" className="cta-button">
                  ✨ Créer le conte de mon animal de compagnie
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

export default BlogArticle1;

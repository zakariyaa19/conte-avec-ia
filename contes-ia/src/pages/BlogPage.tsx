import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import '../styles/BlogPage.css';

const BlogPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Blog Contes Personnalisés | Conseils Parents et Développement Enfant';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Blog expert sur les contes personnalisés : pourquoi offrir un livre personnalisé à un enfant, les avantages des contes personnalisés pour le développement de l\'enfant, conseils parents et inspiration.');
    } else {
      const newMetaDescription = document.createElement('meta');
      newMetaDescription.name = 'description';
      newMetaDescription.content = 'Blog expert sur les contes personnalisés : pourquoi offrir un livre personnalisé à un enfant, les avantages des contes personnalisés pour le développement de l\'enfant, conseils parents et inspiration.';
      document.head.appendChild(newMetaDescription);
    }

    // Mots-clés blog éditorial
    const metaKeywords = document.querySelector('meta[name="keywords"]') || document.createElement('meta');
    metaKeywords.setAttribute('name', 'keywords');
    metaKeywords.setAttribute('content', 'pourquoi offrir un livre personnalisé à un enfant, les avantages des contes personnalisés pour le développement de l\'enfant, top 10 des cadeaux personnalisés pour enfants, comment choisir un conte adapté à l\'âge de son enfant, blog contes personnalisés');
    if (!document.querySelector('meta[name="keywords"]')) {
      document.head.appendChild(metaKeywords);
    }
  }, []);

  const blogArticles = [
    {
      id: 1,
      title: "Créer un Livre Personnalisé avec votre Animal de Compagnie",
      excerpt: "Transformez votre chien, chat ou animal favori en héros d'un conte personnalisé unique. Découvrez comment créer un livre magique où votre enfant et son compagnon vivent des aventures extraordinaires ensemble.",
      image: "/images/blog/conte-animal-compagnie.jpg",
      slug: "histoire-animal-compagnie-livre-personnalise"
    },
    {
      id: 2,
      title: "Des contes pour enfants à personnaliser : nouveaux héros et univers illustrés",
      excerpt: "Découvrez comment créer des héros uniques, explorer des univers illustrés époustouflants et adapter vos histoires aux goûts des adolescents. Plongez dans un monde où chaque conte devient une aventure sur mesure inoubliable.",
      image: "/images/blog/enfant-lecture-personnalisee.jpg",
      slug: "nouveaux-personnages-styles-aventures-ados"
    },
    {
      id: 3,
      title: "Contes de Fées Modernes : Quand la Magie Rencontre la Personnalisation",
      excerpt: "Les contes de fées se réinventent grâce aux aventures personnalisées, offrant à chaque enfant la possibilité de devenir le héros de son propre conte de fées sur mesure avec châteaux enchantés et créatures magiques.",
      image: "/images/blog/contes-fees-modernes.jpg",
      slug: "evolution-livres-enfants-contes-fees-aventures-personnalisees"
    },
    {
      id: 4,
      title: "Comment l'IA révolutionne la création d'histoires pour enfants",
      excerpt: "L'intelligence artificielle transforme la façon dont nous créons des histoires pour enfants. Découvrez comment notre technologie permet de générer des contes personnalisés uniques qui captivent l'imagination des petits lecteurs.",
      image: "/images/blog/ia-creation-histoires.jpg",
      slug: "ia-revolution-creation-histoires-enfants"
    },
    {
      id: 5,
      title: "Intégrer les valeurs religieuses dans les contes personnalisés",
      excerpt: "Apprenez comment personnaliser la religion de votre enfant dans nos contes IA. Guide complet pour créer des histoires respectueuses des croyances familiales tout en stimulant l'imagination et les valeurs morales.",
      image: "/images/blog/religion-contes-personnalises.jpg",
      slug: "integrer-valeurs-religieuses-contes-personnalises"
    }
  ];

  return (
    <PageLayout>
      <div className="blog-container">
        <div className="blog-header">
          <h1>Blog</h1>
          <p>Lisez nos derniers articles remplis d'inspiration, de conseils et d'histoires sur les livres pour enfants magiques.</p>
        </div>

        <div className="blog-grid">
          {blogArticles.map((article) => (
            <Link 
              key={article.id} 
              to={`/blog/${article.slug}`} 
              className="blog-card"
            >
              <div className="blog-card-image">
                <img 
                  src={article.image} 
                  alt={article.title}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/placeholder-blog.jpg';
                  }}
                />
              </div>
              <div className="blog-card-content">
                <h3>{article.title}</h3>
                <p>{article.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default BlogPage;

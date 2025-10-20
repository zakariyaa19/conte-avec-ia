import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import '../styles/BlogPage.css';

const BlogPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Blog - Contes Personnalisés avec IA | Conseils et Inspiration';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Découvrez nos conseils d\'experts sur les contes personnalisés avec IA, l\'éducation des enfants et la création d\'histoires uniques. Blog spécialisé dans les livres personnalisés pour enfants.');
    }
  }, []);

  const blogArticles = [
    {
      id: 1,
      title: "L'histoire unique de votre animal de compagnie dans son propre livre",
      excerpt: "Découvrez comment transformer votre cher animal de compagnie en héros de son propre livre pour enfants. Cet article explique comment notre IA peut créer un souvenir magnifique et durable.",
      image: "/images/blog/conte-animal-compagnie.jpg",
      slug: "histoire-animal-compagnie-livre-personnalise"
    },
    {
      id: 2,
      title: "Des livres pour enfants avec plus de personnages, de nouveaux styles de dessin & des aventures pour ados",
      excerpt: "Découvrez les toutes dernières mises à jour magiques chez Livre Magique qui rendent vos histoires personnalisées encore plus spéciales ! Désormais, vous pouvez créer des aventures avec jusqu'à cinq personnages, permettant frères,",
      image: "/images/blog/enfant-lecture-personnalisee.jpg",
      slug: "nouveaux-personnages-styles-aventures-ados"
    },
    {
      id: 3,
      title: "L'évolution des livres pour enfants des contes de fées aux aventures personnalisées",
      excerpt: "Les livres pour enfants évoluent des contes de fées classiques vers des histoires numériques interactives qui stimulent l'imagination et le développement des enfants. Découvrez comment les innovations technologiques rendent cette transformation possible et ce que cela signifie",
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

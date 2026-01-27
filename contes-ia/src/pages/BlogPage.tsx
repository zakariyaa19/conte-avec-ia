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
    },
    // Articles sur les animaux de compagnie
    {
      id: 6,
      title: "Pourquoi votre animal de compagnie stimule l'imagination de votre enfant",
      excerpt: "Découvrez comment votre animal de compagnie devient une source d'inspiration magique pour l'imagination de votre enfant. Créez des histoires personnalisées mettant en scène votre compagnon à quatre pattes.",
      image: "/images/blog/enfant-animal-lecture.jpg",
      slug: "animal-compagnie-stimule-imagination-enfant"
    },
    {
      id: 7,
      title: "Offrir un conte personnalisé pour Noël : le cadeau parfait pour les amoureux des animaux",
      excerpt: "Découvrez pourquoi un livre personnalisé mettant en scène l'animal de compagnie est le cadeau de Noël idéal. Original, émouvant et unique, ce présent marquera les fêtes à jamais.",
      image: "/images/blog/noel-enfant-animal-livre.jpg",
      slug: "conte-personnalise-noel-cadeau-amoureux-animaux"
    },
    {
      id: 8,
      title: "De la photo au héros de conte : comment l'IA transforme votre animal en personnage d'aventure",
      excerpt: "Découvrez la technologie révolutionnaire qui transforme les photos de votre animal en illustrations de conte personnalisé. L'IA au service de la créativité et de l'émotion.",
      image: "/images/blog/ia-transformation-animal.jpg",
      slug: "photo-heros-conte-ia-transforme-animal-personnage"
    },
    {
      id: 9,
      title: "Lire avec son compagnon à quatre pattes : un rituel qui renforce le lien enfant-animal",
      excerpt: "Découvrez comment la lecture partagée avec votre animal de compagnie renforce les liens affectifs et développe l'empathie chez l'enfant. Les bienfaits d'un rituel unique.",
      image: "/images/blog/enfant-lecture-animal-rituel.jpg",
      slug: "lire-compagnon-quatre-pattes-rituel-lien-enfant-animal"
    },
    {
      id: 10,
      title: "Top 5 des thèmes d'histoires pour transformer votre animal en héros de conte",
      excerpt: "Découvrez 5 thèmes d'aventures captivants pour créer des contes personnalisés avec votre animal : forêt magique, voyage spatial, enquête urbaine et plus encore. Inspiration garantie !",
      image: "/images/blog/themes-aventures-animaux.jpg",
      slug: "top-5-themes-histoires-animal-heros-conte"
    },
    // Articles sur la foi et la religion
    {
      id: 11,
      title: "Transmettre la foi à travers les histoires : comment les contes personnalisés éveillent la spiritualité",
      excerpt: "Découvrez comment les contes personnalisés aident à transmettre la foi et les valeurs spirituelles aux enfants avec douceur et bienveillance. Une approche moderne de l'éducation religieuse.",
      image: "/images/blog/foi-spiritualite-enfant-conte.jpg",
      slug: "transmettre-foi-histoires-contes-personnalises-spiritualite"
    },
    {
      id: 12,
      title: "Les grandes fêtes religieuses revisitées : créer un conte personnalisé pour Noël, Ramadan, Pâque ou Diwali",
      excerpt: "Célébrez les fêtes religieuses avec des contes personnalisés adaptés à chaque tradition : Noël, Ramadan, Pâque, Diwali. Une approche moderne et respectueuse des célébrations spirituelles.",
      image: "/images/blog/fetes-religieuses-conte-personnalise.jpg",
      slug: "fetes-religieuses-conte-personnalise-noel-ramadan-paque-diwali"
    },
    {
      id: 13,
      title: "Personnaliser la foi : quand l'IA s'adapte à vos valeurs religieuses",
      excerpt: "Découvrez comment l'intelligence artificielle respecte et s'adapte aux différentes croyances religieuses pour créer des contes personnalisés authentiques et respectueux.",
      image: "/images/blog/ia-adaptation-valeurs-religieuses.jpg",
      slug: "personnaliser-foi-ia-adapte-valeurs-religieuses"
    },
    {
      id: 14,
      title: "Des héros de foi : inspirer les enfants à travers des personnages spirituels",
      excerpt: "Découvrez comment intégrer des figures inspirantes de différentes traditions religieuses dans les contes personnalisés pour enfants. Des héros spirituels qui guident et inspirent.",
      image: "/images/blog/heros-spirituels-conte-enfant.jpg",
      slug: "heros-foi-inspirer-enfants-personnages-spirituels"
    },
    {
      id: 15,
      title: "Foi, tolérance et ouverture : comment les contes favorisent le respect des différentes religions",
      excerpt: "Découvrez comment les contes personnalisés enseignent la tolérance religieuse et le respect des différentes croyances aux enfants, favorisant une coexistence harmonieuse.",
      image: "/images/blog/tolerance-religieuse-conte-enfant.jpg",
      slug: "foi-tolerance-ouverture-respect-differentes-religions"
    },
    // Nouveaux articles 2026
    {
      id: 16,
      title: "Pourquoi offrir un livre personnalisé à un enfant en 2026 ?",
      excerpt: "Découvrez pourquoi le livre personnalisé est le cadeau idéal pour un enfant en 2026. Avantages, bienfaits et impact sur le développement de l'enfant dans notre époque moderne.",
      image: "/images/blog/livre-personnalise-enfant-2026.jpg",
      slug: "livre-personnalise-enfant-2026"
    },
    {
      id: 17,
      title: "Comment un conte personnalisé aide l'enfant à développer confiance et imagination",
      excerpt: "Découvrez comment les contes personnalisés renforcent la confiance en soi et stimulent l'imagination des enfants. Bienfaits psychologiques et développement personnel expliqués.",
      image: "/images/blog/conte-personnalise-confiance-imagination-enfant.jpg",
      slug: "conte-personnalise-confiance-imagination-enfant"
    },
    {
      id: 18,
      title: "Livre personnalisé ou livre classique : lequel est le plus bénéfique pour l'enfant ?",
      excerpt: "Comparaison détaillée entre livres personnalisés et livres classiques pour enfants. Avantages, inconvénients et impact sur le développement de l'enfant.",
      image: "/images/blog/livre-personnalise-vs-livre-classique-enfant.jpg",
      slug: "livre-personnalise-vs-livre-classique-enfant"
    },
    {
      id: 19,
      title: "L'intelligence artificielle au service des histoires pour enfants",
      excerpt: "Découvrez comment l'intelligence artificielle révolutionne la création d'histoires pour enfants. Personnalisation, créativité et innovation au service de la littérature jeunesse.",
      image: "/images/blog/intelligence-artificielle-histoires-enfants.jpg",
      slug: "intelligence-artificielle-histoires-enfants"
    },
    {
      id: 20,
      title: "Pourquoi les enfants adorent être le héros de leur propre histoire",
      excerpt: "Découvrez les raisons psychologiques pour lesquelles les enfants adorent être le héros de leur propre histoire. Impact sur l'estime de soi et le développement personnel.",
      image: "/images/blog/enfant-heros-propre-histoire.jpg",
      slug: "enfant-heros-propre-histoire"
    },
    {
      id: 21,
      title: "Lecture du soir : pourquoi le conte personnalisé améliore le rituel du coucher",
      excerpt: "Découvrez comment les contes personnalisés transforment le rituel du coucher en moment magique. Bienfaits sur le sommeil et la relation parent-enfant.",
      image: "/images/blog/conte-personnalise-rituel-coucher.jpg",
      slug: "conte-personnalise-rituel-coucher"
    },
    {
      id: 22,
      title: "Comment un livre personnalisé peut aider un enfant timide ou anxieux",
      excerpt: "Découvrez comment les livres personnalisés aident les enfants timides et anxieux à développer leur confiance en soi. Approche thérapeutique douce et bienveillante.",
      image: "/images/blog/livre-personnalise-enfant-timide.jpg",
      slug: "livre-personnalise-enfant-timide"
    },
    {
      id: 23,
      title: "Cadeau de naissance ou anniversaire : le livre personnalisé intemporel",
      excerpt: "Découvrez pourquoi le livre personnalisé est le cadeau parfait pour une naissance ou un anniversaire. Un présent unique qui grandit avec l'enfant et marque les esprits.",
      image: "/images/blog/cadeau-livre-personnalise-enfant.jpg",
      slug: "cadeau-livre-personnalise-enfant"
    },
    {
      id: 24,
      title: "Comment sont créées les histoires personnalisées sur Conte d'IA",
      excerpt: "Découvrez les coulisses de la création d'histoires personnalisées sur Conte d'IA. Processus, technologie et expertise au service de contes uniques pour chaque enfant.",
      image: "/images/blog/creation-histoires-personnalisees-conte-ia.jpg",
      slug: "creation-histoires-personnalisees-conte-ia"
    },
    {
      id: 25,
      title: "Les bienfaits de la lecture personnalisée sur le développement émotionnel",
      excerpt: "Découvrez comment la lecture personnalisée favorise le développement émotionnel des enfants. Intelligence émotionnelle, empathie et équilibre psychologique.",
      image: "/images/blog/bienfaits-lecture-personnalisee-enfant.jpg",
      slug: "bienfaits-lecture-personnalisee-enfant"
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

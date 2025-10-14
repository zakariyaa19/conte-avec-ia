import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { Button } from '../components/ui/Button';
import {
  Container,
  PageHeader,
  PageTitle,
  PageIntro,
  Section,
  SectionTitle,
  SectionIntro,
  Grid,
  Card,
  CardHeader,
  CardIcon,
  CardTitle,
  CardDescription,
  CTASection,
  CTATitle,
  CTADescription,
  CTAButtons,
  CTALinks
} from '../styles/CommonPageStyles';

const BlogPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Blog Contes d\'IA | Conseils, Éducation et Actualités Contes Personnalisés';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Blog expert sur les contes personnalisés : conseils parents, développement enfant, idées cadeaux, IA créative. Tout sur le livre personnalisé IA.');
    }
  }, []);
  const blogArticles = [
    {
      id: 1,
      title: "Comment Choisir le Thème Parfait pour Votre Conte Personnalisé",
      excerpt: "Découvrez nos conseils d'experts pour sélectionner le thème idéal selon l'âge, la personnalité et les centres d'intérêt de votre enfant.",
      category: "Conseils Parents",
      readTime: "5 min",
      date: "15 Mars 2024",
      image: "🎭",
      tags: ["thèmes", "personnalisation", "conseils"],
      content: "Le choix du thème est crucial pour créer un conte personnalisé enfant qui captivera vraiment votre petit lecteur..."
    },
    {
      id: 2,
      title: "L'Impact des Contes Personnalisés sur le Développement de l'Enfant",
      excerpt: "Études scientifiques et témoignages sur les bienfaits cognitifs et émotionnels des histoires personnalisées.",
      category: "Éducation",
      readTime: "8 min",
      date: "10 Mars 2024",
      image: "🧠",
      tags: ["développement", "psychologie", "éducation"],
      content: "Les recherches récentes en neurosciences montrent que les contes personnalisés activent des zones cérébrales spécifiques..."
    },
    {
      id: 3,
      title: "5 Raisons d'Offrir un Livre Personnalisé IA pour un Anniversaire",
      excerpt: "Pourquoi un conte personnalisé est le cadeau enfant original parfait pour marquer cette journée spéciale.",
      category: "Idées Cadeaux",
      readTime: "4 min",
      date: "5 Mars 2024",
      image: "🎂",
      tags: ["anniversaire", "cadeau", "originalité"],
      content: "Un anniversaire mérite un cadeau unique qui marquera la mémoire de votre enfant..."
    },
    {
      id: 4,
      title: "Contes Multilingues : Éveiller Votre Enfant aux Langues du Monde",
      excerpt: "Comment les histoires personnalisées facilitent l'apprentissage naturel des langues étrangères.",
      category: "Apprentissage",
      readTime: "6 min",
      date: "28 Février 2024",
      image: "🌍",
      tags: ["multilingue", "apprentissage", "langues"],
      content: "L'apprentissage précoce des langues par les contes personnalisés offre des avantages uniques..."
    },
    {
      id: 5,
      title: "Les Valeurs Éducatives dans les Contes : Guide Complet",
      excerpt: "Comment intégrer naturellement respect, courage et empathie dans les histoires de vos enfants.",
      category: "Éducation",
      readTime: "7 min",
      date: "20 Février 2024",
      image: "💎",
      tags: ["valeurs", "éducation", "morale"],
      content: "Transmettre des valeurs par le conte éducatif est un art délicat qui demande finesse et authenticité..."
    },
    {
      id: 6,
      title: "IA et Créativité : L'Avenir de la Littérature Jeunesse",
      excerpt: "Exploration des innovations technologiques qui révolutionnent la création d'histoires pour enfants.",
      category: "Technologie",
      readTime: "9 min",
      date: "15 Février 2024",
      image: "🤖",
      tags: ["IA", "technologie", "innovation"],
      content: "L'intelligence artificielle ouvre de nouveaux horizons créatifs pour la littérature jeunesse..."
    }
  ];

  const categories = [
    { name: "Tous les articles", count: 6, active: true },
    { name: "Conseils Parents", count: 2, active: false },
    { name: "Éducation", count: 2, active: false },
    { name: "Idées Cadeaux", count: 1, active: false },
    { name: "Apprentissage", count: 1, active: false },
    { name: "Technologie", count: 1, active: false }
  ];

  const featuredArticle = blogArticles[0];
  const recentArticles = blogArticles.slice(1);

  return (
    <PageLayout>
      <Container>
        <PageHeader>
          <PageTitle>Blog Contes d'IA</PageTitle>
          <PageIntro>
            Découvrez nos conseils d'experts, actualités et réflexions sur l'univers magique 
            des contes personnalisés. Tout ce qu'il faut savoir pour éveiller l'imagination 
            de votre enfant avec des histoires uniques.
          </PageIntro>
        </PageHeader>

        <Section>
          <SectionTitle>Article à la Une</SectionTitle>
          <Card>
            <CardHeader>
              <CardIcon>{featuredArticle.image}</CardIcon>
              <CardTitle>{featuredArticle.title}</CardTitle>
            </CardHeader>
            <CardDescription>{featuredArticle.excerpt}</CardDescription>
            <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
              <span>{featuredArticle.category} • {featuredArticle.date} • {featuredArticle.readTime}</span>
            </div>
          </Card>
        </Section>

        <Section>
          <SectionTitle>Articles Récents</SectionTitle>
          <Grid>
            {recentArticles.map((article) => (
              <Card key={article.id}>
                <CardHeader>
                  <CardIcon>{article.image}</CardIcon>
                  <CardTitle>{article.title}</CardTitle>
                </CardHeader>
                <CardDescription>{article.excerpt}</CardDescription>
                <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
                  <span>{article.category} • {article.readTime}</span>
                </div>
              </Card>
            ))}
          </Grid>
        </Section>

        <Section>
          <SectionTitle>Explorez nos Sujets</SectionTitle>
          <Grid columns={4}>
            <Card>
              <CardHeader>
                <CardIcon>👨‍👩‍👧‍👦</CardIcon>
                <CardTitle>Conseils Parents</CardTitle>
              </CardHeader>
              <CardDescription>Guides pratiques pour choisir, personnaliser et utiliser au mieux les contes avec vos enfants.</CardDescription>
            </Card>
            <Card>
              <CardHeader>
                <CardIcon>🎓</CardIcon>
                <CardTitle>Développement & Éducation</CardTitle>
              </CardHeader>
              <CardDescription>Recherches et analyses sur l'impact des contes personnalisés sur l'épanouissement de l'enfant.</CardDescription>
            </Card>
            <Card>
              <CardHeader>
                <CardIcon>🎁</CardIcon>
                <CardTitle>Idées & Inspiration</CardTitle>
              </CardHeader>
              <CardDescription>Créativité et originalité pour faire de chaque conte un cadeau enfant original mémorable.</CardDescription>
            </Card>
            <Card>
              <CardHeader>
                <CardIcon>🚀</CardIcon>
                <CardTitle>Innovation & Technologie</CardTitle>
              </CardHeader>
              <CardDescription>Découvrez les coulisses de notre IA et les innovations qui révolutionnent la littérature jeunesse.</CardDescription>
            </Card>
          </Grid>
        </Section>

        <CTASection>
          <CTATitle>Inspiré par nos Articles ?</CTATitle>
          <CTADescription>
            Passez de la lecture à l'action ! Créez dès maintenant un conte personnalisé enfant 
            unique qui appliquera tous nos conseils pour émerveiller votre petit lecteur.
          </CTADescription>
          <CTAButtons>
            <Button variant="primary" size="lg" onClick={() => window.location.href = '/story-form'}>
              ✨ Créer mon conte personnalisé
            </Button>
          </CTAButtons>
          <CTALinks>
            <Link to="/themes-de-contes">Thèmes de contes</Link>
            <Link to="/idees-cadeaux">Idées cadeaux</Link>
            <Link to="/valeurs-educatives">Valeurs éducatives</Link>
          </CTALinks>
        </CTASection>
      </Container>
    </PageLayout>
  );
};

export default BlogPage;

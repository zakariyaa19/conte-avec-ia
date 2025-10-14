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
  TagContainer,
  Tag,
  CTASection,
  CTATitle,
  CTADescription,
  CTAButtons
} from '../styles/CommonPageStyles';

const ContesParAgePage: React.FC = () => {
  useEffect(() => {
    document.title = 'Contes Personnalisés par Âge | Histoires Adaptées 2-12 ans | Contes d\'IA';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Contes personnalisés adaptés à chaque âge : 2-4 ans, 4-6 ans, 6-8 ans, 8-10 ans, 10+ ans. Livre personnalisé IA pour un développement optimal de votre enfant.');
    }
  }, []);
  const ageGroups = [
    {
      age: "2-4 ans",
      title: "Premiers Émerveillements",
      description: "Des contes personnalisés doux et colorés, parfaits pour les tout-petits. Histoires courtes avec des mots simples et des illustrations captivantes.",
      features: ["Vocabulaire adapté", "Histoires courtes (5-8 pages)", "Illustrations grandes et colorées", "Répétitions rassurantes"],
      themes: ["Animaux familiers", "Routine quotidienne", "Couleurs et formes", "Premiers apprentissages"],
      icon: "👶",
      color: "#FFB6C1"
    },
    {
      age: "4-6 ans",
      title: "Aventures Magiques",
      description: "L'âge de l'imagination débordante ! Des contes éducatifs qui stimulent la curiosité et développent le langage de votre enfant.",
      features: ["Vocabulaire enrichi", "Histoires moyennes (8-12 pages)", "Dialogues simples", "Morale claire"],
      themes: ["Magie et féerie", "Amitié", "Découverte du monde", "Émotions"],
      icon: "🧚",
      color: "#98FB98"
    },
    {
      age: "6-8 ans",
      title: "Héros en Herbe",
      description: "Des récits plus complexes où votre enfant devient le héros. Parfait pour développer la confiance en soi et l'autonomie.",
      features: ["Phrases plus longues", "Histoires étoffées (12-16 pages)", "Défis à résoudre", "Valeurs importantes"],
      themes: ["Aventures épiques", "Courage et bravoure", "Sciences amusantes", "Cultures du monde"],
      icon: "🦸",
      color: "#87CEEB"
    },
    {
      age: "8-10 ans",
      title: "Explorateurs Curieux",
      description: "Des contes illustrés riches en détails et en enseignements. Idéal pour les jeunes lecteurs avides de découvertes.",
      features: ["Vocabulaire avancé", "Histoires longues (16-20 pages)", "Intrigues élaborées", "Réflexions profondes"],
      themes: ["Mystères à élucider", "Histoire et géographie", "Écologie", "Inventions"],
      icon: "🔍",
      color: "#DDA0DD"
    },
    {
      age: "10+ ans",
      title: "Jeunes Penseurs",
      description: "Des histoires sophistiquées qui abordent des sujets complexes avec finesse. Un cadeau enfant original pour les préadolescents.",
      features: ["Langage nuancé", "Récits approfondis (20+ pages)", "Personnages complexes", "Enjeux actuels"],
      themes: ["Philosophie accessible", "Relations humaines", "Défis sociétaux", "Futur et technologie"],
      icon: "🎓",
      color: "#F0E68C"
    }
  ];

  const developmentBenefits = [
    {
      title: "Développement Linguistique",
      description: "Chaque conte personnalisé enfant enrichit le vocabulaire et améliore la compréhension écrite selon l'âge.",
      icon: "📚"
    },
    {
      title: "Éveil Cognitif",
      description: "Stimulation de la mémoire, de la logique et de la capacité d'analyse adaptée au développement de l'enfant.",
      icon: "🧠"
    },
    {
      title: "Intelligence Émotionnelle",
      description: "Apprentissage de la gestion des émotions et développement de l'empathie à travers les personnages.",
      icon: "❤️"
    },
    {
      title: "Créativité et Imagination",
      description: "Stimulation de l'imagination créative avec des histoires qui s'adaptent aux centres d'intérêt de chaque âge.",
      icon: "🎨"
    }
  ];

  return (
    <PageLayout>
      <Container>
        <PageHeader>
          <PageTitle>Contes Personnalisés Adaptés à Chaque Âge</PageTitle>
          <PageIntro>
            Chaque étape de l'enfance mérite une histoire unique. Nos contes personnalisés s'adaptent parfaitement 
            au développement cognitif et émotionnel de votre enfant, de 2 à 12 ans et plus.
          </PageIntro>
        </PageHeader>

        <Section>
          <SectionTitle>Trouvez le Conte Parfait pour Votre Enfant</SectionTitle>
          <SectionIntro>
            Notre intelligence artificielle crée des histoires sur mesure, adaptées aux capacités de lecture, 
            aux centres d'intérêt et au niveau de développement de chaque tranche d'âge.
          </SectionIntro>
          
          <Grid>
            {ageGroups.map((group, index) => (
              <Card key={index} style={{ backgroundColor: group.color, border: `3px solid ${group.color}` }}>
                <CardHeader>
                  <CardIcon>{group.icon}</CardIcon>
                  <div>
                    <CardTitle>{group.age}</CardTitle>
                    <div style={{ fontSize: '1rem', color: '#666', marginBottom: '1rem' }}>{group.title}</div>
                  </div>
                </CardHeader>
                <CardDescription>{group.description}</CardDescription>
                <div style={{ marginBottom: '1rem' }}>
                  <h5 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>Caractéristiques adaptées :</h5>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {group.features.map((feature, idx) => (
                      <li key={idx} style={{ padding: '0.2rem 0', fontSize: '0.9rem' }}>✓ {feature}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>Thèmes favoris :</h5>
                  <TagContainer>
                    {group.themes.map((theme, idx) => (
                      <Tag key={idx} style={{ backgroundColor: group.color, border: '1px solid #ccc' }}>
                        {theme}
                      </Tag>
                    ))}
                  </TagContainer>
                </div>
              </Card>
            ))}
          </Grid>
        </Section>

        <CTASection>
          <CTATitle>Créez le Conte Idéal pour Votre Enfant</CTATitle>
          <CTADescription>
            Notre IA va créer une histoire parfaitement adaptée à l'âge et à la personnalité de votre enfant. 
            Un conte illustré unique qui grandira avec lui dans ses souvenirs.
          </CTADescription>
          <CTAButtons>
            <Button variant="primary" size="lg" onClick={() => window.location.href = '/story-form'}>
              ✨ Créer mon conte personnalisé
            </Button>
          </CTAButtons>
          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginTop: '1rem' }}>
            <Link to="/themes-de-contes" style={{ textDecoration: 'none' }}>Explorer les thèmes</Link>
            <Link to="/#pricing" style={{ textDecoration: 'none' }}>Voir les tarifs</Link>
          </div>
        </CTASection>
      </Container>
    </PageLayout>
  );
};

export default ContesParAgePage;

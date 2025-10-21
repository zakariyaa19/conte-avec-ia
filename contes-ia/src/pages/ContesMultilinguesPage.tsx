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

const ContesMultilinguesPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Livre Personnalisé Multilingue pour Enfant | Apprentissage des Langues';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Créez un livre personnalisé multilingue pour enfant : français, anglais, espagnol, italien, allemand, arabe. Apprentissage naturel des langues avec des histoires sur mesure.');
    } else {
      const newMetaDescription = document.createElement('meta');
      newMetaDescription.name = 'description';
      newMetaDescription.content = 'Créez un livre personnalisé multilingue pour enfant : français, anglais, espagnol, italien, allemand, arabe. Apprentissage naturel des langues avec des histoires sur mesure.';
      document.head.appendChild(newMetaDescription);
    }

    // Mots-clés pour le multilinguisme
    const metaKeywords = document.querySelector('meta[name="keywords"]') || document.createElement('meta');
    metaKeywords.setAttribute('name', 'keywords');
    metaKeywords.setAttribute('content', 'livre personnalisé multilingue pour enfant, conte personnalisé anglais, livre personnalisé espagnol, apprentissage langues enfant, conte bilingue personnalisé, livre éducatif multilingue, histoire personnalisée langues étrangères');
    if (!document.querySelector('meta[name="keywords"]')) {
      document.head.appendChild(metaKeywords);
    }
  }, []);
  const languages = [
    {
      name: "Français",
      flag: "🇫🇷",
      description: "La langue de Molière pour des contes poétiques et raffinés, parfaits pour développer l'amour de la belle langue française.",
      benefits: ["Richesse vocabulaire", "Élégance littéraire", "Culture française", "Poésie naturelle"],
      level: "Langue maternelle"
    },
    {
      name: "Anglais",
      flag: "🇬🇧",
      description: "Ouvrez les portes du monde anglophone avec des histoires captivantes qui facilitent l'apprentissage de cette langue universelle.",
      benefits: ["Langue internationale", "Ouverture mondiale", "Vocabulaire moderne", "Accent authentique"],
      level: "Apprentissage ludique"
    },
    {
      name: "Espagnol",
      flag: "🇪🇸",
      description: "Découvrez la chaleur de la culture hispanique à travers des contes colorés et expressifs en español.",
      benefits: ["Culture latine", "Sonorités musicales", "Expressions vivantes", "Diversité culturelle"],
      level: "Immersion douce"
    },
    {
      name: "Italien",
      flag: "🇮🇹",
      description: "L'art de vivre italien s'exprime dans des histoires pleines de passion et de créativité, bellissimo !",
      benefits: ["Art de vivre", "Créativité", "Passion narrative", "Héritage culturel"],
      level: "Découverte artistique"
    },
    {
      name: "Allemand",
      flag: "🇩🇪",
      description: "Précision et imagination se rencontrent dans des contes structurés qui révèlent la richesse de la culture germanique.",
      benefits: ["Précision linguistique", "Logique narrative", "Culture européenne", "Tradition littéraire"],
      level: "Apprentissage méthodique"
    },
    {
      name: "Arabe",
      flag: "🇸🇦",
      description: "Plongez dans l'univers des Mille et Une Nuits avec des contes qui célèbrent la richesse de la culture arabe.",
      benefits: ["Héritage millénaire", "Poésie orientale", "Sagesse ancestrale", "Calligraphie artistique"],
      level: "Découverte culturelle"
    }
  ];

  const educationalBenefits = [
    {
      title: "Développement Linguistique",
      description: "Acquisition naturelle du vocabulaire et des structures grammaticales dans un contexte narratif engageant.",
      icon: "🗣️"
    },
    {
      title: "Ouverture Culturelle",
      description: "Découverte des traditions, valeurs et modes de pensée de différentes cultures à travers leurs histoires.",
      icon: "🌍"
    },
    {
      title: "Flexibilité Cognitive",
      description: "Stimulation de la plasticité cérébrale et amélioration des capacités d'adaptation mentale.",
      icon: "🧠"
    },
    {
      title: "Confiance Internationale",
      description: "Préparation à un monde globalisé et développement de l'aisance dans les échanges interculturels.",
      icon: "🤝"
    }
  ];

  const ageAdaptations = [
    {
      age: "3-5 ans",
      approach: "Immersion Douce",
      description: "Mots simples, répétitions rassurantes et sonorités familières pour une première approche positive.",
      features: ["Vocabulaire de base", "Répétitions ludiques", "Sons familiers", "Images associées"]
    },
    {
      age: "6-8 ans",
      approach: "Apprentissage Ludique",
      description: "Histoires bilingues avec traductions intégrées pour faciliter la compréhension et l'apprentissage.",
      features: ["Traductions intégrées", "Jeux de mots", "Dialogues simples", "Contexte visuel"]
    },
    {
      age: "9-12 ans",
      approach: "Immersion Progressive",
      description: "Contes plus complexes qui développent la maîtrise linguistique et la compréhension culturelle.",
      features: ["Structures avancées", "Nuances culturelles", "Expressions idiomatiques", "Contexte historique"]
    }
  ];

  return (
    <PageLayout>
      <Container>
        <PageHeader>
          <PageTitle>Contes Multilingues Personnalisés</PageTitle>
          <PageIntro>
            Ouvrez les portes du monde à votre enfant ! Nos contes personnalisés multilingues transforment 
            l'apprentissage des langues en aventure magique, créant un cadeau enfant original qui éveille 
            à la diversité culturelle.
          </PageIntro>
        </PageHeader>

        <Section>
          <SectionTitle>Notre Palette Linguistique Mondiale</SectionTitle>
          <SectionIntro>
            Chaque langue porte en elle une vision unique du monde. Notre intelligence artificielle 
            crée des histoires authentiques qui respectent l'esprit et la culture de chaque langue.
          </SectionIntro>
          
          <Grid>
            {languages.map((language, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardIcon>{language.flag}</CardIcon>
                  <CardTitle>{language.name}</CardTitle>
                </CardHeader>
                <CardDescription>{language.description}</CardDescription>
                <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
                  <strong>Niveau :</strong> {language.level}
                </div>
              </Card>
            ))}
          </Grid>
        </Section>

        <Section>
          <SectionTitle>Les Bienfaits de l'Apprentissage Multilingue</SectionTitle>
          <Grid columns={4}>
            {educationalBenefits.map((benefit, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardIcon>{benefit.icon}</CardIcon>
                  <CardTitle>{benefit.title}</CardTitle>
                </CardHeader>
                <CardDescription>{benefit.description}</CardDescription>
              </Card>
            ))}
          </Grid>
        </Section>

        <CTASection>
          <CTATitle>Offrez le Monde à Votre Enfant</CTATitle>
          <CTADescription>
            Créez un conte personnalisé enfant multilingue qui ouvrira ses horizons et développera 
            ses compétences linguistiques de manière naturelle et joyeuse. L'aventure commence ici !
          </CTADescription>
          <CTAButtons>
            <Button variant="primary" size="lg" onClick={() => window.location.href = '/story-form'}>
              ✨ Créer mon conte personnalisé
            </Button>
          </CTAButtons>
          <CTALinks>
            <Link to="/themes-de-contes">Choisir un thème</Link>
            <Link to="/valeurs-educatives">Voir les valeurs éducatives</Link>
          </CTALinks>
        </CTASection>
      </Container>
    </PageLayout>
  );
};

export default ContesMultilinguesPage;

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

const IdeesCadeauxPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Idées Cadeaux Originaux pour Enfants | Livre Personnalisé Anniversaire';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Découvrez le cadeau personnalisé enfant parfait ! Livre personnalisé pour anniversaire, Noël, rentrée. Histoire personnalisée pour un anniversaire d\'enfant unique et mémorable.');
    } else {
      const newMetaDescription = document.createElement('meta');
      newMetaDescription.name = 'description';
      newMetaDescription.content = 'Découvrez le cadeau personnalisé enfant parfait ! Livre personnalisé pour anniversaire, Noël, rentrée. Histoire personnalisée pour un anniversaire d\'enfant unique et mémorable.';
      document.head.appendChild(newMetaDescription);
    }

    // Mots-clés longue traîne pour les cadeaux
    const metaKeywords = document.querySelector('meta[name="keywords"]') || document.createElement('meta');
    metaKeywords.setAttribute('name', 'keywords');
    metaKeywords.setAttribute('content', 'cadeau personnalisé enfant, histoire personnalisée pour un anniversaire d\'enfant, idée cadeau original pour un enfant de 5 ans, livre personnalisé anniversaire, cadeau enfant original, livre personnalisé Noël, cadeau unique enfant, livre personnalisé rentrée');
    if (!document.querySelector('meta[name="keywords"]')) {
      document.head.appendChild(metaKeywords);
    }
  }, []);
  const giftOccasions = [
    {
      occasion: "Anniversaire",
      description: "Le cadeau parfait pour marquer une année de plus avec une histoire unique qui grandit avec l'enfant.",
      icon: "🎂",
      ageRecommendations: ["2-4 ans", "5-7 ans", "8-12 ans"],
      personalizations: ["Nom de l'enfant héros", "Âge dans l'histoire", "Amis comme personnages", "Lieux familiers"],
      color: "#FFE6F0"
    },
    {
      occasion: "Noël",
      description: "Un conte magique sous le sapin qui apportera émerveillement et joie pendant les fêtes de fin d'année.",
      icon: "🎄",
      ageRecommendations: ["3-6 ans", "6-10 ans", "10+ ans"],
      personalizations: ["Thème hivernal", "Magie de Noël", "Valeurs de partage", "Traditions familiales"],
      color: "#E6F3FF"
    },
    {
      occasion: "Rentrée Scolaire",
      description: "Rassurer et motiver avec une histoire qui transforme l'appréhension en excitation pour cette nouvelle aventure.",
      icon: "🎒",
      ageRecommendations: ["4-6 ans", "6-8 ans", "8-10 ans"],
      personalizations: ["Courage et confiance", "Nouvelles amitiés", "Apprentissages", "Adaptation"],
      color: "#FFF0E6"
    },
    {
      occasion: "Fête des Mères/Pères",
      description: "Célébrer l'amour familial avec un conte personnalisé qui honore les liens précieux entre parents et enfants.",
      icon: "💝",
      ageRecommendations: ["3-8 ans", "8-12 ans"],
      personalizations: ["Amour familial", "Moments partagés", "Reconnaissance", "Tendresse"],
      color: "#F0E6FF"
    },
    {
      occasion: "Récompense",
      description: "Féliciter un effort, un progrès ou une réussite avec un cadeau enfant original qui valorise ses accomplissements.",
      icon: "🏆",
      ageRecommendations: ["4-8 ans", "8-12 ans"],
      personalizations: ["Fierté et réussite", "Persévérance", "Talents uniques", "Encouragements"],
      color: "#E6FFE6"
    },
    {
      occasion: "Consolation",
      description: "Apporter réconfort et espoir dans les moments difficiles avec une histoire douce et rassurante.",
      icon: "🤗",
      ageRecommendations: ["3-6 ans", "6-10 ans", "10+ ans"],
      personalizations: ["Résilience", "Espoir", "Soutien émotionnel", "Guérison"],
      color: "#FFFAE6"
    }
  ];

  const giftFormats = [
    {
      format: "eBook Numérique",
      price: "4,99€",
      description: "Format digital immédiat, parfait pour une surprise de dernière minute ou un cadeau éco-responsable.",
      advantages: ["Livraison instantanée", "Écologique", "Lecture sur tablette", "Prix accessible"],
      bestFor: ["Cadeaux spontanés", "Familles nomades", "Lecture interactive", "Budget serré"],
      icon: "📱"
    },
    {
      format: "Livre Relié Premium",
      price: "29,99€",
      description: "Objet précieux à conserver, avec impression haute qualité et reliure solide pour durer dans le temps.",
      advantages: ["Qualité premium", "Objet de collection", "Papier haute qualité", "Reliure durable"],
      bestFor: ["Cadeaux mémorables", "Occasions spéciales", "Bibliothèque personnelle", "Transmission familiale"],
      icon: "📚"
    }
  ];

  const personalizationIdeas = [
    {
      category: "Personnages",
      ideas: ["L'enfant comme héros principal", "Frères et sœurs comme compagnons", "Animaux de compagnie", "Grands-parents sages", "Meilleurs amis"],
      icon: "👥"
    },
    {
      category: "Lieux",
      ideas: ["Maison familiale", "École de l'enfant", "Ville natale", "Lieux de vacances", "Pays d'origine"],
      icon: "🏠"
    },
    {
      category: "Passions",
      ideas: ["Sport favori", "Instrument de musique", "Animaux préférés", "Couleurs favorites", "Activités créatives"],
      icon: "⚽"
    },
    {
      category: "Valeurs",
      ideas: ["Courage et bravoure", "Amitié et partage", "Respect de la nature", "Curiosité scientifique", "Créativité artistique"],
      icon: "💎"
    }
  ];

  const ageSpecificGifts = [
    {
      age: "2-4 ans",
      title: "Premiers Émerveillements",
      description: "Des histoires courtes et colorées pour éveiller l'imagination des tout-petits.",
      giftIdeas: ["Premier conte personnalisé", "Histoire du doudou magique", "Aventure avec papa/maman", "Conte des premières fois"],
      themes: ["Animaux familiers", "Routine quotidienne", "Découverte des couleurs", "Premiers apprentissages"]
    },
    {
      age: "5-7 ans",
      title: "Aventuriers en Herbe",
      description: "L'âge parfait pour les grandes aventures et les amitiés magiques.",
      giftIdeas: ["Héros de l'école", "Aventure avec les copains", "Mystère à résoudre", "Voyage fantastique"],
      themes: ["Magie et féerie", "Amitié", "Courage", "Découverte du monde"]
    },
    {
      age: "8-12 ans",
      title: "Explorateurs Confirmés",
      description: "Des récits plus complexes qui nourrissent leur soif de connaissances et d'aventures.",
      giftIdeas: ["Enquête scientifique", "Voyage dans le temps", "Mission écologique", "Aventure culturelle"],
      themes: ["Sciences", "Histoire", "Écologie", "Cultures du monde"]
    }
  ];

  return (
    <PageLayout>
      <Container>
        <PageHeader>
          <PageTitle>Idées Cadeaux : Contes Personnalisés pour Enfants</PageTitle>
          <PageIntro>
            Offrez bien plus qu'un simple livre ! Découvrez le cadeau enfant original qui marquera 
            sa mémoire pour toujours : un conte personnalisé où il devient le héros de sa propre histoire magique.
          </PageIntro>
        </PageHeader>

        <Section>
          <SectionTitle>Le Cadeau Parfait pour Chaque Occasion</SectionTitle>
          <SectionIntro>
            Que ce soit pour célébrer, récompenser, consoler ou simplement faire plaisir, 
            nos contes personnalisés s'adaptent à tous les moments importants de la vie de votre enfant.
          </SectionIntro>
          
          <Grid>
            {giftOccasions.map((occasion, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardIcon>{occasion.icon}</CardIcon>
                  <CardTitle>{occasion.occasion}</CardTitle>
                </CardHeader>
                <CardDescription>{occasion.description}</CardDescription>
              </Card>
            ))}
          </Grid>
        </Section>

        <Section>
          <SectionTitle>Choisissez le Format Parfait</SectionTitle>
          <Grid columns={2}>
            {giftFormats.map((format, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardIcon>{format.icon}</CardIcon>
                  <CardTitle>{format.format}</CardTitle>
                </CardHeader>
                <CardDescription>{format.description}</CardDescription>
                <div style={{ textAlign: 'center', margin: '1rem 0', fontSize: '1.5rem', fontWeight: 'bold', color: '#FF9999' }}>
                  {format.price}
                </div>
              </Card>
            ))}
          </Grid>
        </Section>

        <CTASection>
          <CTATitle>Créez le Cadeau Enfant Original Parfait</CTATitle>
          <CTADescription>
            Ne cherchez plus le cadeau idéal : créez-le ! Un conte personnalisé enfant unique 
            qui célébrera sa personnalité et nourrira son imagination pour les années à venir.
          </CTADescription>
          <CTAButtons>
            <Button variant="primary" size="lg" onClick={() => window.location.href = '/story-form'}>
              ✨ Créer mon cadeau personnalisé
            </Button>
          </CTAButtons>
          <CTALinks>
            <Link to="/themes-de-contes">Explorer les thèmes</Link>
            <Link to="/valeurs-educatives">Découvrir les valeurs éducatives</Link>
            <Link to="/contes-multilingues">Cadeaux multilingues</Link>
          </CTALinks>
        </CTASection>
      </Container>
    </PageLayout>
  );
};

export default IdeesCadeauxPage;

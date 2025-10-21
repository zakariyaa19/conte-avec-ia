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
  CTAButtons,
  CTALinks
} from '../styles/CommonPageStyles';

const FeaturesPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Fonctionnalités Livre Personnalisé Enfant | Conte Magique avec IA';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Découvrez toutes les fonctionnalités pour créer un livre illustré personnalisé : 9 styles d\'art, conte magique personnalisé, support multilingue, adaptation par âge et personnalisation complète.');
    } else {
      const newMetaDescription = document.createElement('meta');
      newMetaDescription.name = 'description';
      newMetaDescription.content = 'Découvrez toutes les fonctionnalités pour créer un livre illustré personnalisé : 9 styles d\'art, conte magique personnalisé, support multilingue, adaptation par âge et personnalisation complète.';
      document.head.appendChild(newMetaDescription);
    }

    // Mots-clés secondaires SEO
    const metaKeywords = document.querySelector('meta[name="keywords"]') || document.createElement('meta');
    metaKeywords.setAttribute('name', 'keywords');
    metaKeywords.setAttribute('content', 'conte magique personnalisé, livre illustré personnalisé, conte pour enfant généré par IA, histoire sur mesure pour enfants, créer une histoire pour mon enfant, livre pour bébé personnalisé, cadeau personnalisé enfant, livre personnalisé prénom enfant, conte éducatif personnalisé, histoire avec photo de l\'enfant');
    if (!document.querySelector('meta[name="keywords"]')) {
      document.head.appendChild(metaKeywords);
    }
  }, []);

  // Données des nouvelles fonctionnalités
  const coreFeatures = [
    {
      icon: "🎨",
      title: "9 Styles d'Illustration",
      description: "Aquarelle, Animation 3D, Kawaii, Manga japonais, Clay-animation, Papier découpé, Géométrique, Monde des blocs, Livre illustré classique.",
      tags: ["Aquarelle", "3D", "Kawaii", "Manga"]
    },
    {
      icon: "🌍",
      title: "Support Multilingue",
      description: "Créez des contes en 10 langues : Français, Anglais, Espagnol, Arabe, Allemand, Italien, Japonais, Flamand, Portugais, Polonais.",
      tags: ["10 langues", "Multilingue", "International"]
    },
    {
      icon: "🎯",
      title: "Thèmes Personnalisables",
      description: "Choisissez parmi nos thèmes prédéfinis (Éducatif, Contes de fées, Activités, Histoires, Fêtes, Famille) ou créez le vôtre.",
      tags: ["Personnalisable", "Éducatif", "Famille"]
    },
    {
      icon: "🎂",
      title: "Occasions Spéciales",
      description: "Contes adaptés pour anniversaires, Noël, Pâques, Aïd, fête des mères/pères, Saint-Nicolas, Carnaval, Halloween et plus.",
      tags: ["Anniversaire", "Noël", "Fêtes"]
    }
  ];

  const personalizationFeatures = [
    {
      icon: "👧👦",
      title: "Personnalisation Complète",
      description: "Nom, âge, genre, couleur des yeux et cheveux, hobbies, plat préféré, événements spéciaux.",
      tags: ["Apparence", "Personnalité", "Détails"]
    },
    {
      icon: "🙏",
      title: "Respect des Croyances",
      description: "Option religieuse respectueuse : Chrétien, Juif, Musulman, Bouddhiste ou personnalisée.",
      tags: ["Religion", "Respect", "Inclusif"]
    },
    {
      icon: "👥",
      title: "Personnages Secondaires",
      description: "Ajoutez des amis, famille ou personnages imaginaires avec leurs propres caractéristiques.",
      tags: ["Amis", "Famille", "Secondaire"]
    },
    {
      icon: "✍️",
      title: "Nom d'Auteur",
      description: "Signez votre création avec votre nom ou celui de votre enfant pour une fierté créative.",
      tags: ["Auteur", "Signature", "Fierté"]
    }
  ];

  const ageAdaptation = [
    {
      icon: "👶",
      title: "0-2 ans",
      description: "Vocabulaire simple, images colorées, concepts basiques adaptés aux tout-petits.",
      features: ["Mots simples", "Images vives", "Courtes histoires"]
    },
    {
      icon: "🧒",
      title: "3-5 ans", 
      description: "Contes interactifs avec apprentissages ludiques et premières leçons de vie.",
      features: ["Interactif", "Éducatif", "Valeurs"]
    },
    {
      icon: "👦",
      title: "6-9 ans",
      description: "Aventures complexes, développement de l'imagination et valeurs importantes.",
      features: ["Aventures", "Imagination", "Morale"]
    },
    {
      icon: "👧",
      title: "10+ ans",
      description: "Histoires sophistiquées avec défis intellectuels et thèmes profonds.",
      features: ["Sophistiqué", "Défis", "Profondeur"]
    }
  ];

  const valueMessages = [
    { 
      icon: "🤝", 
      title: "Amitié", 
      description: "Développer les liens sociaux et l'empathie à travers des histoires qui montrent l'importance de l'amitié, de la coopération et du respect mutuel."
    },
    { 
      icon: "💪", 
      title: "Courage", 
      description: "Surmonter les peurs et relever les défis avec des aventures qui encouragent la bravoure, la confiance en soi et la détermination face aux obstacles."
    },
    { 
      icon: "🌱", 
      title: "Écologie", 
      description: "Prendre soin de la nature et l'environnement en sensibilisant aux enjeux écologiques à travers des contes qui valorisent la protection de notre planète."
    },
    { 
      icon: "❤️", 
      title: "Amour", 
      description: "Cultiver l'amour familial et l'affection en explorant les liens familiaux, l'importance des relations et l'expression des sentiments positifs."
    },
    { 
      icon: "🎯", 
      title: "Persévérance", 
      description: "Ne jamais abandonner ses rêves avec des histoires inspirantes qui montrent que les efforts et la patience mènent au succès et à l'accomplissement personnel."
    },
    { 
      icon: "🤲", 
      title: "Partage", 
      description: "Apprendre la générosité et l'entraide en découvrant la joie de donner, d'aider les autres et de construire une communauté bienveillante."
    }
  ];

  return (
    <PageLayout>
      <Container>
        <PageHeader>
          <PageTitle>Fonctionnalités Avancées de Contes d'IA</PageTitle>
          <PageIntro>
            Découvrez toutes les possibilités de personnalisation pour créer le conte parfait. 
            Notre intelligence artificielle s'adapte à chaque enfant avec une précision remarquable.
          </PageIntro>
        </PageHeader>

        <Section>
          <SectionTitle>Fonctionnalités Principales</SectionTitle>
          <Grid>
            {coreFeatures.map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardIcon>{feature.icon}</CardIcon>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardDescription>{feature.description}</CardDescription>
                <TagContainer>
                  {feature.tags.map((tag, idx) => (
                    <Tag key={idx}>{tag}</Tag>
                  ))}
                </TagContainer>
              </Card>
            ))}
          </Grid>
        </Section>

        <Section>
          <SectionTitle>Personnalisation Avancée</SectionTitle>
          <Grid>
            {personalizationFeatures.map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardIcon>{feature.icon}</CardIcon>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardDescription>{feature.description}</CardDescription>
                <TagContainer>
                  {feature.tags.map((tag, idx) => (
                    <Tag key={idx}>{tag}</Tag>
                  ))}
                </TagContainer>
              </Card>
            ))}
          </Grid>
        </Section>

        <Section>
          <SectionTitle>Adaptation par Âge</SectionTitle>
          <Grid columns={4}>
            {ageAdaptation.map((age, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardIcon>{age.icon}</CardIcon>
                  <CardTitle>{age.title}</CardTitle>
                </CardHeader>
                <CardDescription>{age.description}</CardDescription>
                <TagContainer>
                  {age.features.map((feature, idx) => (
                    <Tag key={idx}>{feature}</Tag>
                  ))}
                </TagContainer>
              </Card>
            ))}
          </Grid>
        </Section>

        <Section>
          <SectionTitle>Messages et Valeurs Éducatives</SectionTitle>
          <SectionIntro>
            Intégrez des valeurs importantes dans chaque conte pour accompagner l'épanouissement de votre enfant.
          </SectionIntro>
          <Grid columns={1}>
            {valueMessages.map((value, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardIcon>{value.icon}</CardIcon>
                  <CardTitle>{value.title}</CardTitle>
                </CardHeader>
                <CardDescription>{value.description}</CardDescription>
              </Card>
            ))}
          </Grid>
        </Section>

        <CTASection>
          <CTATitle>Prêt à Découvrir Toutes Ces Fonctionnalités ?</CTATitle>
          <CTADescription>
            Créez dès maintenant un conte personnalisé unique qui utilise toutes ces fonctionnalités 
            avancées pour offrir à votre enfant une expérience de lecture inoubliable.
          </CTADescription>
          <CTAButtons>
            <Button variant="primary" size="lg" onClick={() => window.location.href = '/story-form'}>
              ✨ Créer mon conte personnalisé
            </Button>
          </CTAButtons>
          <CTALinks>
            <Link to="/themes-de-contes">Voir les thèmes</Link>
            <Link to="/styles-illustration">Styles d'illustration</Link>
            <Link to="/contes-multilingues">Support multilingue</Link>
          </CTALinks>
        </CTASection>
      </Container>
    </PageLayout>
  );
};

export { FeaturesPage };

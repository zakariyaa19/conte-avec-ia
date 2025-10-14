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

const ValeursEducativesPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Valeurs Éducatives dans les Contes Personnalisés | Contes d\'IA';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Découvrez comment nos contes éducatifs transmettent des valeurs essentielles : respect, courage, empathie. Livre personnalisé IA pour l\'\u00e9panouissement de votre enfant.');
    }
  }, []);
  const educationalValues = [
    {
      title: "Respect et Tolérance",
      description: "Apprendre à accepter les différences, respecter autrui et cultiver l'ouverture d'esprit dès le plus jeune âge.",
      icon: "🤝",
      themes: ["Diversité culturelle", "Acceptation des différences", "Vivre ensemble"],
      ageGroups: ["4-6 ans", "6-8 ans", "8-10 ans"],
      color: "#E8F5E8"
    },
    {
      title: "Courage et Persévérance",
      description: "Développer la bravoure face aux défis et la détermination pour surmonter les obstacles de la vie.",
      icon: "💪",
      themes: ["Héros et bravoure", "Défis personnels", "Dépassement de soi"],
      ageGroups: ["5-8 ans", "8-10 ans", "10+ ans"],
      color: "#FFF0E6"
    },
    {
      title: "Empathie et Bienveillance",
      description: "Cultiver la capacité à comprendre les émotions d'autrui et développer la compassion naturelle.",
      icon: "❤️",
      themes: ["Amitié et partage", "Émotions", "Relations humaines"],
      ageGroups: ["3-6 ans", "6-8 ans", "8-12 ans"],
      color: "#FFE6F0"
    },
    {
      title: "Curiosité et Apprentissage",
      description: "Stimuler la soif de connaissances et l'amour de la découverte pour un apprentissage joyeux.",
      icon: "🔍",
      themes: ["Sciences et découvertes", "Exploration", "Mystères"],
      ageGroups: ["4-8 ans", "8-10 ans", "10+ ans"],
      color: "#E6F3FF"
    },
    {
      title: "Responsabilité Écologique",
      description: "Sensibiliser à la protection de l'environnement et développer une conscience écologique forte.",
      icon: "🌱",
      themes: ["Nature et animaux", "Écologie", "Environnement"],
      ageGroups: ["5-8 ans", "8-10 ans", "10+ ans"],
      color: "#F0FFE6"
    },
    {
      title: "Créativité et Expression",
      description: "Encourager l'imagination créative et la libre expression artistique de la personnalité unique.",
      icon: "🎨",
      themes: ["Art et créativité", "Expression personnelle", "Imagination"],
      ageGroups: ["3-6 ans", "6-8 ans", "8-12 ans"],
      color: "#F0E6FF"
    },
    {
      title: "Justice et Équité",
      description: "Comprendre l'importance de la fairness et développer un sens moral solide et équilibré.",
      icon: "⚖️",
      themes: ["Morale et éthique", "Droits et devoirs", "Citoyenneté"],
      ageGroups: ["6-8 ans", "8-10 ans", "10+ ans"],
      color: "#E6FFE6"
    },
    {
      title: "Confiance en Soi",
      description: "Renforcer l'estime personnelle et développer l'assurance nécessaire pour s'épanouir pleinement.",
      icon: "⭐",
      themes: ["Développement personnel", "Estime de soi", "Réussite"],
      ageGroups: ["4-8 ans", "8-10 ans", "10+ ans"],
      color: "#FFFAE6"
    }
  ];

  const implementationMethods = [
    {
      title: "Intégration Narrative Naturelle",
      description: "Les valeurs sont tissées dans l'histoire de manière organique, sans moralisation forcée.",
      icon: "📖"
    },
    {
      title: "Personnages Exemplaires",
      description: "Des héros qui incarnent les valeurs et servent de modèles positifs pour l'enfant.",
      icon: "🦸"
    },
    {
      title: "Situations Concrètes",
      description: "Des dilemmes et choix réalistes qui permettent à l'enfant de réfléchir aux conséquences.",
      icon: "🤔"
    },
    {
      title: "Dialogue et Réflexion",
      description: "Des moments d'échange qui encouragent la discussion entre parents et enfants.",
      icon: "💬"
    }
  ];

  const ageSpecificApproach = [
    {
      age: "3-5 ans",
      approach: "Découverte Émotionnelle",
      description: "Introduction douce aux émotions de base et aux relations interpersonnelles simples.",
      values: ["Partage", "Gentillesse", "Respect des autres", "Amour familial"],
      method: "Histoires courtes avec répétitions rassurantes et personnages attachants."
    },
    {
      age: "6-8 ans",
      approach: "Apprentissage Social",
      description: "Développement de la conscience sociale et des premières notions de bien et mal.",
      values: ["Amitié", "Honnêteté", "Courage", "Respect de la nature"],
      method: "Aventures avec choix moraux clairs et conséquences positives."
    },
    {
      age: "9-12 ans",
      approach: "Réflexion Éthique",
      description: "Exploration de concepts moraux plus complexes et développement de l'esprit critique.",
      values: ["Justice", "Responsabilité", "Tolérance", "Persévérance"],
      method: "Récits nuancés avec dilemmes moraux et réflexions approfondies."
    }
  ];

  return (
    <PageLayout>
      <Container>
        <PageHeader>
          <PageTitle>Valeurs Éducatives dans nos Contes Personnalisés</PageTitle>
          <PageIntro>
            Chaque conte éducatif est une graine de sagesse plantée dans le cœur de votre enfant. 
            Découvrez comment nos histoires transmettent des valeurs essentielles pour construire 
            un avenir bienveillant et épanouissant.
          </PageIntro>
        </PageHeader>

        <Section>
          <SectionTitle>Notre Palette de Valeurs Fondamentales</SectionTitle>
          <SectionIntro>
            Nos contes personnalisés enfant intègrent naturellement des valeurs universelles, 
            adaptées à chaque âge et personnalité. Chaque livre personnalisé IA devient un 
            compagnon de croissance morale et émotionnelle.
          </SectionIntro>
          
          <Grid>
            {educationalValues.map((value, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardIcon>{value.icon}</CardIcon>
                  <CardTitle>{value.title}</CardTitle>
                </CardHeader>
                <CardDescription>{value.description}</CardDescription>
                <TagContainer>
                  {value.themes.slice(0, 3).map((theme, idx) => (
                    <Tag key={idx}>{theme}</Tag>
                  ))}
                </TagContainer>
              </Card>
            ))}
          </Grid>
        </Section>

        <Section>
          <SectionTitle>Comment Nous Transmettons Ces Valeurs</SectionTitle>
          <Grid columns={4}>
            {implementationMethods.map((method, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardIcon>{method.icon}</CardIcon>
                  <CardTitle>{method.title}</CardTitle>
                </CardHeader>
                <CardDescription>{method.description}</CardDescription>
              </Card>
            ))}
          </Grid>
        </Section>

        <CTASection>
          <CTATitle>Semez les Graines d'un Avenir Bienveillant</CTATitle>
          <CTADescription>
            Créez un conte personnalisé enfant qui transmettra les valeurs qui vous tiennent à cœur. 
            Chaque histoire devient un cadeau précieux pour l'épanouissement moral et émotionnel de votre enfant.
          </CTADescription>
          <CTAButtons>
            <Button variant="primary" size="lg" onClick={() => window.location.href = '/story-form'}>
              ✨ Créer mon conte personnalisé
            </Button>
          </CTAButtons>
          <CTALinks>
            <Link to="/themes-de-contes">Explorer les thèmes</Link>
            <Link to="/contes-par-age">Adapter à l'âge</Link>
          </CTALinks>
        </CTASection>
      </Container>
    </PageLayout>
  );
};

export default ValeursEducativesPage;

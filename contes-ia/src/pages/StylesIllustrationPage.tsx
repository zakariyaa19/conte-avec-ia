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

const StylesIllustrationPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Styles d\'Illustration Livre Personnalisé | Conte Illustré sur Mesure';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Choisissez le style parfait pour votre livre illustré personnalisé : aquarelle douce, cartoon coloré, réalisme fantastique, vintage. Conte illustré avec photo de votre enfant.');
    } else {
      const newMetaDescription = document.createElement('meta');
      newMetaDescription.name = 'description';
      newMetaDescription.content = 'Choisissez le style parfait pour votre livre illustré personnalisé : aquarelle douce, cartoon coloré, réalisme fantastique, vintage. Conte illustré avec photo de votre enfant.';
      document.head.appendChild(newMetaDescription);
    }

    // Mots-clés pour les styles d'illustration
    const metaKeywords = document.querySelector('meta[name="keywords"]') || document.createElement('meta');
    metaKeywords.setAttribute('name', 'keywords');
    metaKeywords.setAttribute('content', 'livre illustré personnalisé, conte illustré avec photo de mon enfant, styles illustration livre enfant, livre personnalisé aquarelle, conte cartoon personnalisé, illustration sur mesure enfant, livre artistique personnalisé');
    if (!document.querySelector('meta[name="keywords"]')) {
      document.head.appendChild(metaKeywords);
    }
  }, []);
  const illustrationStyles = [
    {
      name: "Aquarelle Douce",
      description: "Des illustrations délicates aux couleurs pastel, parfaites pour les contes apaisants et poétiques. Style idéal pour les tout-petits.",
      characteristics: ["Couleurs douces", "Traits fluides", "Atmosphère tendre", "Effet apaisant"],
      ageGroup: "2-6 ans",
      mood: "Calme et rassurant",
      image: "🎨",
      color: "#E6F3FF"
    },
    {
      name: "Cartoon Coloré",
      description: "Un style vibrant et joyeux avec des personnages expressifs. Parfait pour captiver l'attention des jeunes lecteurs.",
      characteristics: ["Couleurs vives", "Personnages expressifs", "Traits marqués", "Dynamisme"],
      ageGroup: "4-8 ans",
      mood: "Joyeux et énergique",
      image: "🌈",
      color: "#FFE6CC"
    },
    {
      name: "Réalisme Fantastique",
      description: "Des illustrations détaillées qui mélangent réalisme et magie. Idéal pour les aventures épiques et les mondes imaginaires.",
      characteristics: ["Détails fins", "Réalisme magique", "Profondeur", "Immersion"],
      ageGroup: "6-10 ans",
      mood: "Aventureux et mystérieux",
      image: "✨",
      color: "#F0E6FF"
    },
    {
      name: "Style Vintage",
      description: "Inspiré des livres d'antan avec des teintes sépia et des ornements délicats. Pour une atmosphère nostalgique et chaleureuse.",
      characteristics: ["Teintes sépia", "Ornements classiques", "Élégance rétro", "Charme d'antan"],
      ageGroup: "5-12 ans",
      mood: "Nostalgique et chaleureux",
      image: "📚",
      color: "#FFF0E6"
    },
    {
      name: "Minimaliste Moderne",
      description: "Des illustrations épurées aux lignes nettes. Style contemporain qui met l'accent sur l'essentiel de l'histoire.",
      characteristics: ["Lignes épurées", "Couleurs sélectionnées", "Simplicité élégante", "Focus narratif"],
      ageGroup: "6-12 ans",
      mood: "Moderne et sophistiqué",
      image: "⚡",
      color: "#E6FFE6"
    },
    {
      name: "Collage Artistique",
      description: "Un mélange créatif de textures et matériaux pour un rendu unique et original. Stimule la créativité artistique.",
      characteristics: ["Textures variées", "Matériaux mixtes", "Originalité", "Créativité"],
      ageGroup: "7-12 ans",
      mood: "Créatif et original",
      image: "🎭",
      color: "#FFE6F0"
    }
  ];

  const customizationOptions = [
    {
      title: "Palette de Couleurs",
      description: "Choisissez les couleurs dominantes selon les préférences de votre enfant",
      icon: "🎨"
    },
    {
      title: "Niveau de Détail",
      description: "Adaptez la complexité visuelle à l'âge et aux goûts de votre enfant",
      icon: "🔍"
    },
    {
      title: "Ambiance Générale",
      description: "Définissez l'atmosphère : douce, aventureuse, mystérieuse ou joyeuse",
      icon: "🌟"
    },
    {
      title: "Personnages Uniques",
      description: "Créez des personnages qui ressemblent à votre enfant ou à ses héros préférés",
      icon: "👤"
    }
  ];

  return (
    <PageLayout>
      <Container>
        <PageHeader>
          <PageTitle>Styles d'Illustration pour Contes Personnalisés</PageTitle>
          <PageIntro>
            Chaque conte illustré mérite un style visuel unique. Découvrez notre palette artistique 
            pour créer un livre personnalisé IA qui émerveillera votre enfant par sa beauté visuelle.
          </PageIntro>
        </PageHeader>

        <Section>
          <SectionTitle>Notre Galerie de Styles Artistiques</SectionTitle>
          <SectionIntro>
            Notre intelligence artificielle maîtrise une variété de styles d'illustration pour s'adapter 
            parfaitement à l'âge, aux goûts et à la personnalité de votre enfant.
          </SectionIntro>
          
          <Grid>
            {illustrationStyles.map((style, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardIcon>{style.image}</CardIcon>
                  <CardTitle>{style.name}</CardTitle>
                </CardHeader>
                <CardDescription>{style.description}</CardDescription>
                <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#666' }}>
                  <div><strong>Âge :</strong> {style.ageGroup}</div>
                  <div><strong>Ambiance :</strong> {style.mood}</div>
                </div>
              </Card>
            ))}
          </Grid>
        </Section>

        <Section>
          <SectionTitle>Personnalisation de Vos Illustrations</SectionTitle>
          <Grid columns={4}>
            {customizationOptions.map((option, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardIcon>{option.icon}</CardIcon>
                  <CardTitle>{option.title}</CardTitle>
                </CardHeader>
                <CardDescription>{option.description}</CardDescription>
              </Card>
            ))}
          </Grid>
        </Section>

        <CTASection>
          <CTATitle>Créez Votre Conte Illustré Unique</CTATitle>
          <CTADescription>
            Transformez votre histoire en œuvre d'art visuelle. Notre IA va créer des illustrations 
            personnalisées qui donneront vie à votre conte personnalisé enfant de la plus belle manière.
          </CTADescription>
          <CTAButtons>
            <Button variant="primary" size="lg" onClick={() => window.location.href = '/story-form'}>
              ✨ Créer mon conte personnalisé
            </Button>
          </CTAButtons>
          <CTALinks>
            <Link to="/themes-de-contes">Choisir un thème</Link>
            <Link to="/contes-par-age">Voir par âge</Link>
          </CTALinks>
        </CTASection>
      </Container>
    </PageLayout>
  );
};

export default StylesIllustrationPage;

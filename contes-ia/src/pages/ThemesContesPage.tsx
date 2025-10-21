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

const ThemesContesPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Thèmes de Contes Personnalisés pour Enfants | Livre sur Mesure avec IA';
    
    // Meta description optimisée
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Choisissez parmi nos thèmes de contes personnalisés : aventure, magie, animaux, héros, princesses. Créez un livre enfant sur mesure adapté aux goûts de votre petit avec notre IA.');
    } else {
      const newMetaDescription = document.createElement('meta');
      newMetaDescription.name = 'description';
      newMetaDescription.content = 'Choisissez parmi nos thèmes de contes personnalisés : aventure, magie, animaux, héros, princesses. Créez un livre enfant sur mesure adapté aux goûts de votre petit avec notre IA.';
      document.head.appendChild(newMetaDescription);
    }

    // Mots-clés longue traîne pour les thèmes
    const metaKeywords = document.querySelector('meta[name="keywords"]') || document.createElement('meta');
    metaKeywords.setAttribute('name', 'keywords');
    metaKeywords.setAttribute('content', 'thèmes contes personnalisés, livre enfant sur mesure, conte magique personnalisé, histoire personnalisée aventure, conte personnalisé animaux, livre personnalisé héros, thème conte enfant, choix thème livre personnalisé');
    if (!document.querySelector('meta[name="keywords"]')) {
      document.head.appendChild(metaKeywords);
    }
  }, []);
  const themes = [
    {
      title: "Aventures et Explorations",
      description: "Des contes personnalisés qui emmènent votre enfant dans des voyages extraordinaires à travers des mondes fantastiques.",
      icon: "🗺️",
      keywords: ["aventure", "exploration", "voyage", "découverte"]
    },
    {
      title: "Animaux et Nature",
      description: "Des histoires touchantes avec des animaux attachants qui enseignent le respect de la nature et de l'environnement.",
      icon: "🦊",
      keywords: ["animaux", "nature", "forêt", "écologie"]
    },
    {
      title: "Magie et Féerie",
      description: "L'univers enchanté des fées, sorciers et créatures magiques pour stimuler l'imagination de votre enfant.",
      icon: "✨",
      keywords: ["magie", "fées", "sorciers", "enchantement"]
    },
    {
      title: "Héros et Courage",
      description: "Des récits inspirants où votre enfant devient le héros de sa propre histoire, développant confiance et bravoure.",
      icon: "🦸",
      keywords: ["héros", "courage", "bravoure", "confiance"]
    },
    {
      title: "Amitié et Partage",
      description: "Des contes émouvants sur l'importance de l'amitié, de l'entraide et des valeurs humaines essentielles.",
      icon: "🤝",
      keywords: ["amitié", "partage", "entraide", "solidarité"]
    },
    {
      title: "Sciences et Découvertes",
      description: "L'apprentissage devient magique avec des histoires qui éveillent la curiosité scientifique de votre enfant.",
      icon: "🔬",
      keywords: ["science", "découverte", "apprentissage", "curiosité"]
    }
  ];

  return (
    <PageLayout>
      <Container>
        <PageHeader>
          <PageTitle>Thèmes de Contes Personnalisés pour Enfants</PageTitle>
          <PageIntro>
            Chaque enfant mérite une histoire unique qui lui ressemble. Découvrez notre collection de thèmes magiques 
            pour créer un conte personnalisé enfant qui éveillera son imagination et nourrira ses rêves.
          </PageIntro>
        </PageHeader>

        <Section>
          <SectionTitle>Explorez Nos Univers Enchantés</SectionTitle>
          <SectionIntro>
            Nos thèmes de contes sont soigneusement conçus pour offrir à votre enfant une expérience de lecture 
            inoubliable. Chaque livre personnalisé IA s'adapte à ses goûts et à sa personnalité unique.
          </SectionIntro>
          
          <Grid>
            {themes.map((theme, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardIcon>{theme.icon}</CardIcon>
                  <CardTitle>{theme.title}</CardTitle>
                </CardHeader>
                <CardDescription>{theme.description}</CardDescription>
                <TagContainer>
                  {theme.keywords.map((keyword, idx) => (
                    <Tag key={idx}>{keyword}</Tag>
                  ))}
                </TagContainer>
              </Card>
            ))}
          </Grid>
        </Section>

        <Section>
          <SectionTitle>Les Bienfaits Éducatifs de Nos Thèmes</SectionTitle>
          <Grid columns={4}>
            <Card>
              <CardHeader>
                <CardIcon>🧠</CardIcon>
                <CardTitle>Développement Cognitif</CardTitle>
              </CardHeader>
              <CardDescription>Chaque conte éducatif stimule la réflexion, la logique et la résolution de problèmes.</CardDescription>
            </Card>
            <Card>
              <CardHeader>
                <CardIcon>💭</CardIcon>
                <CardTitle>Imagination Créative</CardTitle>
              </CardHeader>
              <CardDescription>Nos thèmes variés nourrissent la créativité et l'expression artistique de votre enfant.</CardDescription>
            </Card>
            <Card>
              <CardHeader>
                <CardIcon>❤️</CardIcon>
                <CardTitle>Intelligence Émotionnelle</CardTitle>
              </CardHeader>
              <CardDescription>Les histoires développent l'empathie, la gestion des émotions et les compétences sociales.</CardDescription>
            </Card>
            <Card>
              <CardHeader>
                <CardIcon>🌍</CardIcon>
                <CardTitle>Ouverture au Monde</CardTitle>
              </CardHeader>
              <CardDescription>Découverte de cultures, de valeurs et de perspectives enrichissantes pour grandir.</CardDescription>
            </Card>
          </Grid>
        </Section>

        <Section>
          <SectionTitle>Personnalisation Avancée par l'IA</SectionTitle>
          <SectionIntro>
            Notre intelligence artificielle adapte chaque thème selon l'âge, les préférences et la personnalité 
            de votre enfant. Le résultat ? Un cadeau enfant original qui marquera sa mémoire pour toujours.
          </SectionIntro>
          
          <Grid columns={3}>
            <Card>
              <CardHeader>
                <CardIcon>🎯</CardIcon>
                <CardTitle>Adaptation à l'Âge</CardTitle>
              </CardHeader>
              <CardDescription>Vocabulaire, complexité et longueur ajustés selon le développement de l'enfant.</CardDescription>
            </Card>
            <Card>
              <CardHeader>
                <CardIcon>🎨</CardIcon>
                <CardTitle>Style Visuel Unique</CardTitle>
              </CardHeader>
              <CardDescription>Illustrations personnalisées qui correspondent au thème choisi et aux goûts de l'enfant.</CardDescription>
            </Card>
            <Card>
              <CardHeader>
                <CardIcon>🌟</CardIcon>
                <CardTitle>Valeurs Intégrées</CardTitle>
              </CardHeader>
              <CardDescription>Chaque histoire véhicule des messages positifs et des <Link to="/valeurs-educatives">valeurs éducatives</Link> importantes.</CardDescription>
            </Card>
          </Grid>
        </Section>

        <CTASection>
          <CTATitle>Prêt à Créer le Conte Parfait ?</CTATitle>
          <CTADescription>
            Transformez l'un de ces thèmes magiques en une histoire unique pour votre enfant. 
            Notre IA créera un conte illustré personnalisé qui deviendra son nouveau livre préféré.
          </CTADescription>
          <CTAButtons>
            <Button variant="primary" size="lg" onClick={() => window.location.href = '/story-form'}>
              ✨ Créer mon conte personnalisé
            </Button>
          </CTAButtons>
          <CTALinks>
            <Link to="/contes-par-age">Voir les contes par âge</Link>
            <Link to="/styles-illustration">Découvrir les styles d'illustration</Link>
          </CTALinks>
        </CTASection>
      </Container>
    </PageLayout>
  );
};

export default ThemesContesPage;

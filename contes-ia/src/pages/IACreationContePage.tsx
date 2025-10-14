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

const IACreationContePage: React.FC = () => {
  useEffect(() => {
    document.title = 'Comment l\'IA Crée des Contes Personnalisés | Technologie Contes d\'IA';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Découvrez la technologie IA derrière nos contes personnalisés : génération narrative, adaptation linguistique, création d\'illustrations uniques.');
    }
  }, []);
  const aiCapabilities = [
    {
      title: "Génération Narrative Intelligente",
      description: "Notre IA analyse les paramètres fournis pour créer une trame narrative cohérente et captivante, adaptée à l'âge et aux préférences de l'enfant.",
      icon: "📝",
      technical: "Algorithmes de traitement du langage naturel (NLP) avancés",
      benefits: ["Cohérence narrative", "Adaptation automatique", "Créativité infinie", "Personnalisation fine"]
    },
    {
      title: "Personnalisation Contextuelle",
      description: "L'intelligence artificielle intègre naturellement les éléments personnels dans l'histoire, créant une expérience immersive unique.",
      icon: "🎯",
      technical: "Modèles de deep learning pour l'intégration contextuelle",
      benefits: ["Intégration naturelle", "Cohérence personnelle", "Réalisme émotionnel", "Identification forte"]
    },
    {
      title: "Adaptation Linguistique",
      description: "Ajustement automatique du vocabulaire, de la complexité syntaxique et du style selon l'âge et le niveau de développement.",
      icon: "🗣️",
      technical: "Analyse psycholinguistique et adaptation développementale",
      benefits: ["Vocabulaire adapté", "Complexité ajustée", "Style approprié", "Progression naturelle"]
    },
    {
      title: "Génération d'Illustrations",
      description: "Création d'images uniques qui complètent parfaitement le récit, dans le style artistique choisi.",
      icon: "🎨",
      technical: "IA générative pour création visuelle et cohérence artistique",
      benefits: ["Illustrations uniques", "Cohérence visuelle", "Style personnalisé", "Qualité professionnelle"]
    }
  ];

  const creationProcess = [
    {
      step: 1,
      title: "Analyse des Paramètres",
      description: "L'IA examine tous les éléments fournis : âge, préférences, personnalité, thèmes souhaités.",
      details: [
        "Profil psychologique de l'enfant",
        "Préférences thématiques",
        "Niveau de développement cognitif",
        "Contexte familial et culturel"
      ],
      duration: "< 1 seconde"
    },
    {
      step: 2,
      title: "Construction Narrative",
      description: "Création de la structure du conte avec personnages, intrigue et messages éducatifs intégrés.",
      details: [
        "Développement des personnages",
        "Architecture narrative",
        "Intégration des valeurs éducatives",
        "Équilibrage émotionnel"
      ],
      duration: "2-3 secondes"
    },
    {
      step: 3,
      title: "Rédaction Adaptée",
      description: "Génération du texte final avec le style, vocabulaire et longueur appropriés à l'enfant.",
      details: [
        "Adaptation linguistique",
        "Optimisation du rythme",
        "Intégration des dialogues",
        "Révision automatique"
      ],
      duration: "3-5 secondes"
    },
    {
      step: 4,
      title: "Création Visuelle",
      description: "Génération des illustrations personnalisées qui accompagnent et enrichissent l'histoire.",
      details: [
        "Analyse des scènes clés",
        "Génération artistique",
        "Cohérence stylistique",
        "Optimisation qualité"
      ],
      duration: "10-15 secondes"
    },
    {
      step: 5,
      title: "Assemblage Final",
      description: "Mise en page professionnelle et création du livre personnalisé IA dans le format choisi.",
      details: [
        "Mise en page automatique",
        "Optimisation typographique",
        "Génération PDF/eBook",
        "Contrôle qualité final"
      ],
      duration: "2-3 secondes"
    }
  ];

  const technicalInnovations = [
    {
      innovation: "Modèles de Langage Spécialisés",
      description: "IA entraînée spécifiquement sur la littérature jeunesse pour garantir un contenu approprié et engageant.",
      impact: "Qualité narrative exceptionnelle adaptée aux enfants"
    },
    {
      innovation: "Psychologie Développementale Intégrée",
      description: "Algorithmes basés sur les recherches en développement cognitif et émotionnel de l'enfant.",
      impact: "Adaptation précise aux capacités et besoins de chaque âge"
    },
    {
      innovation: "Génération Artistique Cohérente",
      description: "Système d'IA visuelle maintenant la cohérence des personnages et du style à travers tout le livre.",
      impact: "Expérience visuelle immersive et professionnelle"
    },
    {
      innovation: "Apprentissage Continu",
      description: "L'IA s'améliore constamment grâce aux retours et aux nouvelles créations, affinant sa compréhension.",
      impact: "Qualité en amélioration permanente et innovation continue"
    }
  ];

  const qualityAssurance = [
    {
      aspect: "Contenu Approprié",
      description: "Filtrage automatique pour garantir un contenu 100% adapté aux enfants",
      methods: ["Analyse sémantique", "Filtres de sécurité", "Validation éthique"]
    },
    {
      aspect: "Cohérence Narrative",
      description: "Vérification de la logique et de la fluidité de l'histoire",
      methods: ["Analyse structurelle", "Contrôle temporel", "Validation causale"]
    },
    {
      aspect: "Qualité Linguistique",
      description: "Correction automatique et optimisation du style d'écriture",
      methods: ["Correction orthographique", "Analyse stylistique", "Optimisation rythmique"]
    },
    {
      aspect: "Pertinence Éducative",
      description: "Validation de l'intégration des valeurs et messages éducatifs",
      methods: ["Analyse pédagogique", "Validation psychologique", "Contrôle développemental"]
    }
  ];

  return (
    <PageLayout>
      <Container>
        <PageHeader>
          <PageTitle>Comment l'IA Crée des Contes Personnalisés Uniques</PageTitle>
          <PageIntro>
            Plongez dans les coulisses de notre technologie révolutionnaire ! Découvrez comment notre 
            intelligence artificielle transforme vos idées en contes personnalisés magiques, 
            alliant créativité humaine et précision technologique.
          </PageIntro>
        </PageHeader>

        <Section>
          <SectionTitle>Les Super-Pouvoirs de Notre IA Créative</SectionTitle>
          <SectionIntro>
            Notre intelligence artificielle maîtrise l'art délicat de la création littéraire pour enfants, 
            combinant analyse psychologique, créativité narrative et adaptation personnalisée.
          </SectionIntro>
          
          <Grid>
            {aiCapabilities.map((capability, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardIcon>{capability.icon}</CardIcon>
                  <CardTitle>{capability.title}</CardTitle>
                </CardHeader>
                <CardDescription>{capability.description}</CardDescription>
              </Card>
            ))}
          </Grid>
        </Section>

        <Section>
          <SectionTitle>Le Processus de Création en 5 Étapes</SectionTitle>
          <SectionIntro>
            De votre idée au livre personnalisé IA final, suivez le parcours fascinant 
            de création d'un conte personnalisé enfant en moins de 30 secondes !
          </SectionIntro>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {creationProcess.map((process, index) => (
              <Card key={index}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ 
                    background: '#FF9999', 
                    color: 'white', 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontWeight: 'bold'
                  }}>
                    {process.step}
                  </div>
                  <div>
                    <CardTitle>{process.title}</CardTitle>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>{process.duration}</div>
                  </div>
                </div>
                <CardDescription>{process.description}</CardDescription>
              </Card>
            ))}
          </div>
          
          <Card style={{ textAlign: 'center', marginTop: '2rem' }}>
            <p><strong>⚡ Temps total de création : 20-30 secondes</strong></p>
            <p>Ce qui prendrait des heures à un auteur humain, notre IA le réalise en quelques instants !</p>
          </Card>
        </Section>

        <CTASection>
          <CTATitle>Découvrez la Magie de l'IA en Action</CTATitle>
          <CTADescription>
            Prêt à voir notre intelligence artificielle créer un conte personnalisé enfant unique ? 
            Lancez le processus et observez la technologie transformer vos idées en histoire magique !
          </CTADescription>
          <CTAButtons>
            <Button variant="primary" size="lg" onClick={() => window.location.href = '/story-form'}>
              ✨ Tester l'IA maintenant
            </Button>
          </CTAButtons>
          <CTALinks>
            <Link to="/themes-de-contes">Voir les thèmes disponibles</Link>
            <Link to="/styles-illustration">Découvrir les styles artistiques</Link>
          </CTALinks>
        </CTASection>
      </Container>
    </PageLayout>
  );
};

export default IACreationContePage;

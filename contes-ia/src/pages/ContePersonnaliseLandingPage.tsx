import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { useScrollReveal, useStaggerReveal } from '../hooks/useScrollReveal';
import { SEOHead } from '../components/SEOHead';
import { SchemaBreadcrumb, SchemaFAQ, SchemaHowTo, SchemaProduct } from '../components/SchemaMarkup';
import { theme } from '../styles/theme';
import {
  PageContainer, HeroSection, HeroDecoBlur, HeroContent, HeroBadge,
  HeroTitle, HeroDivider, HeroSubtitle, ContentSection, SectionDeco,
  Container, SectionWrapper, SectionTitle, SectionSubtitle, SectionDivider,
  CardsGrid, FeatureCard, CardIcon, CardTitle, CardDescription, CardTagsRow, CardTag,
  StepNumber,
  FinalCTASection, FinalCTAContent, FinalCTATitle, FinalCTAText, WhiteButton
} from '../styles/DiscoverPageStyles';

const benefits = [
  {
    icon: '✨',
    title: "Le prénom de votre enfant dans chaque page",
    description: "Pas \"un petit garçon\" ni \"une héroïne\" : votre enfant est nommé, reconnu, célébré. L'identification est totale.",
    tags: ["Prénom intégré", "Reconnaissance forte", "Émotion maximale"]
  },
  {
    icon: '🎨',
    title: "Sa photo dans les illustrations",
    description: "L'IA analyse les traits physiques pour créer un personnage qui ressemble vraiment à votre enfant — cheveux, yeux, peau.",
    tags: ["Photo optionnelle", "9 styles d'illustration", "Personnage fidèle"]
  },
  {
    icon: '🧚',
    title: "Une histoire 100% unique générée par IA",
    description: "Pas un template avec champs à compléter : une vraie histoire neuve, créée pour votre enfant. Deux enfants n'auront jamais le même conte personnalisé.",
    tags: ["IA générative", "Jamais 2 fois la même", "Cohérence narrative"]
  },
  {
    icon: '⚡',
    title: "Prêt en 5 minutes, sans engagement",
    description: "Renseignez 3 étapes, l'IA s'occupe du reste. Pas d'attente de livraison, pas de carte bancaire pour le premier conte.",
    tags: ["5 minutes", "Premier conte gratuit", "Sans CB"]
  },
  {
    icon: '👨‍👩‍👧‍👦',
    title: "Personnages secondaires inclus",
    description: "Ajoutez un frère, une sœur, un copain, ou l'animal de compagnie : ils apparaissent tous dans l'histoire et les images.",
    tags: ["Frère/Sœur", "Animal", "Ami du parc"]
  },
  {
    icon: '🌍',
    title: "Adapté à toutes les cultures et valeurs",
    description: "Noël, Ramadan, Pâques, Diwali, valeurs familiales, prénoms du monde entier : l'IA respecte votre culture.",
    tags: ["Multilingue", "Inclusif", "Religion optionnelle"]
  }
];

const creationSteps = [
  {
    step: 1,
    title: "Choisissez le thème",
    description: "Aventure, animaux, espace, contes de fées, pirates, dinosaures, Noël, Ramadan… Plus de 15 univers pour coller à ses passions.",
    duration: "30 secondes"
  },
  {
    step: 2,
    title: "Personnalisez le héros",
    description: "Prénom, âge, photo (optionnelle), hobbies, animal de compagnie, frère ou sœur. L'IA intègre tout dans le récit.",
    duration: "2 minutes"
  },
  {
    step: 3,
    title: "Recevez votre livre",
    description: "L'IA génère une histoire illustrée 100% unique avec votre enfant comme héros. Lecture immédiate sur tout écran ou PDF.",
    duration: "5 minutes"
  }
];

const ageRanges = [
  {
    icon: '👶',
    title: "Bébé (0-2 ans)",
    description: "Histoires courtes (3 pages), grandes illustrations très contrastées, vocabulaire simple. Cadeau de naissance ou premier anniversaire idéal.",
    keywords: ["Conte personnalisé bébé", "Cadeau naissance", "Premier livre"]
  },
  {
    icon: '🧒',
    title: "Maternelle (3-5 ans)",
    description: "L'âge d'or du conte personnalisé. L'enfant reconnaît son prénom dans le texte et son personnage dans les images. Émotion garantie.",
    keywords: ["3 ans", "4 ans", "5 ans", "Rituel du soir"]
  },
  {
    icon: '🎒',
    title: "École (6-8 ans)",
    description: "Histoires plus longues (20 pages en version complète), vocabulaire enrichi, aventures complexes. L'enfant lit seul et adore relire \"son\" livre.",
    keywords: ["6 ans", "7 ans", "8 ans", "Lecture autonome"]
  },
  {
    icon: '🚀',
    title: "Ados (9-12 ans)",
    description: "Aventures matures, intrigues profondes, illustrations style manga ou réaliste. Plus de personnages secondaires, plus de twists.",
    keywords: ["9 ans", "10 ans", "11 ans", "12 ans"]
  }
];

const themes = [
  { icon: '🐉', title: "Fantastique & Dragons", desc: "Royaumes magiques, créatures, quêtes héroïques" },
  { icon: '🚀', title: "Espace & Astronautes", desc: "Voyages spatiaux, planètes, extraterrestres amicaux" },
  { icon: '🦁', title: "Animaux & Nature", desc: "Aventures avec son animal de compagnie ou la faune sauvage" },
  { icon: '🏴‍☠️', title: "Pirates & Trésors", desc: "Cartes, îles désertes, coffres mystérieux" },
  { icon: '🧚', title: "Contes de fées", desc: "Princesses modernes, magie, château enchanté" },
  { icon: '🦖', title: "Dinosaures", desc: "Voyages au temps des dinos, paléontologie ludique" },
  { icon: '🎄', title: "Noël & Fêtes", desc: "Père Noël, Ramadan, Pâques, Diwali, anniversaire" },
  { icon: '🦸', title: "Super-héros", desc: "Pouvoirs spéciaux, missions de sauvetage" },
  { icon: '🌈', title: "Aventures & Voyages", desc: "Tour du monde, jungle, montagne, océan" }
];

const testimonials = [
  {
    icon: '💬',
    title: "« C'est MOI dans le livre ! » — Yasmine, 5 ans",
    description: "Nadia, sa maman : \"On a la Lunii depuis 2 ans. Mais quand Yasmine a vu son prénom dans le conte personnalisé Contedia, elle a crié 'C'est MOI !'. Aucune autre conteuse n'a provoqué cette réaction.\"",
    tags: ["Yasmine, 5 ans", "Nadia, maman"]
  },
  {
    icon: '👴',
    title: "Le partage qui fait pleurer Mamie",
    description: "Thomas, papa de Lucas : \"J'ai envoyé le conte personnalisé de Lucas à mes parents par WhatsApp. Ma mère a pleuré. Essayez de faire ça avec un livre Wonderbly imprimé…\"",
    tags: ["Lucas, 4 ans", "Partage famille"]
  },
  {
    icon: '💖',
    title: "Un souvenir vivant de son chien disparu",
    description: "Sophie : \"Notre chien Réglisse est mort cet hiver. J'ai créé un conte personnalisé où mon fils Léo et Réglisse vivent une dernière aventure ensemble. Léo le lit chaque soir. C'est précieux.\"",
    tags: ["Léo, 6 ans", "Animal hommage"]
  },
  {
    icon: '🌙',
    title: "Le nouveau rituel du coucher",
    description: "Amira, maman d'Adam : \"Le premier conte gratuit m'a convaincue. Adam reconnaît son personnage et dit 'c'est Adam !' à chaque page. On est passés au Club — 4 contes personnalisés par mois.\"",
    tags: ["Adam, 3 ans", "Club mensuel"]
  }
];

const faqQuestions = [
  {
    question: "Qu'est-ce qu'un conte personnalisé exactement ?",
    answer: "Un conte personnalisé est une histoire illustrée dont votre enfant est le héros principal. Contrairement à un livre classique acheté en librairie, le conte personnalisé Contedia intègre le vrai prénom de votre enfant, éventuellement sa photo, ses hobbies, ses personnages préférés (frère, sœur, ami, animal de compagnie). Chaque conte est généré par intelligence artificielle, donc 100% unique."
  },
  {
    question: "Quelle est la différence avec Wonderbly ou Hourra Héros ?",
    answer: "Wonderbly et Hourra Héros proposent des contes personnalisés \"templatés\" : la même histoire pré-écrite est imprimée avec le prénom de votre enfant inséré dans les champs. Sur Contedia, l'IA crée une histoire entièrement nouvelle à chaque commande. Deux enfants avec le même prénom et le même thème reçoivent deux histoires différentes. Personnalisation niveau 3 vs niveau 1."
  },
  {
    question: "Le premier conte personnalisé est-il vraiment gratuit ?",
    answer: "Oui, le premier conte personnalisé est entièrement gratuit, sans carte bancaire, sans engagement, sans essai limité. Vous recevez un livre illustré complet (chapitre de 3 pages avec cliffhanger). Pour découvrir la suite (20 pages complètes), c'est 2,99€ unique — ou rejoignez le Club à 1,99€ le premier mois."
  },
  {
    question: "Est-ce que mon enfant peut être le héros, même s'il a un prénom rare ou étranger ?",
    answer: "Absolument. Contedia gère tous les prénoms : français classiques (Louis, Emma), arabes (Yasmine, Rayan, Mohamed), africains, asiatiques, hébreux, etc. L'IA respecte l'orthographe et l'origine culturelle du prénom. Aucun prénom n'est exclu."
  },
  {
    question: "Quelle est la longueur d'un conte personnalisé ?",
    answer: "Un conte personnalisé Contedia complet fait 20 pages illustrées (un par paragraphe + illustrations pleine page). Le premier chapitre gratuit fait 3 pages avec un cliffhanger pour vous donner envie de lire la suite. À 20 pages, c'est l'équivalent d'un livre jeunesse de 20-30 minutes de lecture."
  },
  {
    question: "Peut-on imprimer le conte personnalisé ?",
    answer: "Oui, vous recevez un PDF haute qualité que vous pouvez imprimer chez vous ou via un service d'impression (Vistaprint, Photobox). Le format PDF est optimisé pour l'impression A4 ou pour la lecture sur écran (tablette, téléphone, ordinateur)."
  },
  {
    question: "Peut-on faire un conte personnalisé pour deux enfants (frère et sœur) ?",
    answer: "Oui ! Vous renseignez un héros principal, et vous pouvez ajouter jusqu'à 5 personnages secondaires : frère, sœur, copain, papi/mamie, animal de compagnie. L'IA intègre tout le monde dans l'aventure. Idéal pour une fratrie ou un cadeau collectif."
  },
  {
    question: "Combien coûte un conte personnalisé Contedia ?",
    answer: "Le premier conte est gratuit (chapitre de 3 pages). Pour lire la suite complète (20 pages) : 2,99€ unique. Pour des contes illimités : Club mensuel à 1,99€ le premier mois puis 9,99€/mois (4 contes complets/mois) ou Club annuel 79,99€/an (-33%). Vs Wonderbly : 25-40€ le livre. Vs Lunii : 65€ + packs."
  },
  {
    question: "Comment l'IA s'assure que le contenu est adapté à l'âge ?",
    answer: "L'IA est entraînée sur la littérature jeunesse et calibre automatiquement le vocabulaire, la longueur des phrases, et la complexité narrative selon l'âge renseigné — à 2 ans, phrases courtes et grandes images ; à 8 ans, aventures plus complexes. Le nombre de pages, lui, ne dépend pas de l'âge : 3 pages pour le premier chapitre gratuit, 20 pages pour la version complète. Vous gardez la main : si l'âge est mal réglé, vous pouvez régénérer."
  },
  {
    question: "Peut-on offrir un conte personnalisé en cadeau ?",
    answer: "Oui, c'est l'un des cadeaux les plus émouvants qui existent. Vous créez le conte avec le prénom de l'enfant à offrir, et vous partagez le lien PDF par email ou WhatsApp. Pour Noël, anniversaire, naissance, baptême, fête des mères : le conte personnalisé est un cadeau unique, abordable et 100% souvenir."
  },
  {
    question: "Est-ce que Contedia respecte ma vie privée ?",
    answer: "Oui. Les photos d'enfant sont utilisées uniquement pour générer les illustrations puis supprimées des serveurs IA après traitement. Aucune donnée personnelle n'est revendue. Vous pouvez supprimer votre compte à tout moment. Contedia est édité par PAUSIA (SIRET 99282930900010), entreprise française basée en France."
  },
  {
    question: "Combien de temps pour recevoir mon conte personnalisé ?",
    answer: "5 minutes en moyenne. Le texte est généré en 30 secondes, les illustrations en 2-4 minutes selon le style choisi. Vous recevez une notification quand le livre est prêt, accessible directement sur votre tableau de bord Contedia. Aucune attente de livraison physique."
  }
];

const howToSteps = [
  {
    name: "Choisir le thème et l'âge",
    text: "Sélectionnez l'âge de votre enfant et le thème du conte (aventure, animaux, espace, Noël, dinosaures, contes de fées…). Plus de 15 univers disponibles."
  },
  {
    name: "Personnaliser le héros",
    text: "Renseignez le prénom de votre enfant, son âge, sa photo (optionnelle), ses hobbies, son animal de compagnie. Ajoutez des personnages secondaires si vous voulez."
  },
  {
    name: "Recevoir le conte personnalisé",
    text: "L'IA génère en 5 minutes une histoire illustrée 100% unique avec votre enfant comme héros. Le premier conte est entièrement gratuit."
  }
];

const ContePersonnaliseLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const benefitsReveal = useScrollReveal();
  const benefitsCardsReveal = useStaggerReveal(benefits.length);
  const stepsReveal = useScrollReveal();
  const stepsCardsReveal = useStaggerReveal(creationSteps.length);
  const ageReveal = useScrollReveal();
  const ageCardsReveal = useStaggerReveal(ageRanges.length);
  const themesReveal = useScrollReveal();
  const themesCardsReveal = useStaggerReveal(themes.length);
  const testimonialsReveal = useScrollReveal();
  const testimonialsCardsReveal = useStaggerReveal(testimonials.length);
  const faqReveal = useScrollReveal();
  const ctaReveal = useScrollReveal();

  return (
    <PageContainer>
      <SEOHead
        title="Conte personnalisé : votre enfant héros de son livre IA (gratuit) | Contedia"
        description="Conte personnalisé avec le prénom, la photo et les passions de votre enfant. Histoire 100% unique générée par IA, illustrations sur mesure, prêt en 5 minutes. Premier conte gratuit."
        type="website"
      />
      <SchemaBreadcrumb items={[
        { name: 'Accueil', url: 'https://contedia.fr/' },
        { name: 'Conte personnalisé', url: 'https://contedia.fr/conte-personnalise' },
      ]} />
      <SchemaFAQ questions={faqQuestions} />
      <SchemaHowTo
        name="Comment créer un conte personnalisé pour votre enfant"
        description="Créez en 3 étapes un conte personnalisé illustré 100% unique avec le prénom et la photo de votre enfant. Premier conte gratuit, sans carte bancaire."
        totalTime="PT5M"
        steps={howToSteps}
      />
      <SchemaProduct
        name="Conte personnalisé IA — Premier chapitre gratuit"
        description="Livre conte personnalisé pour enfant avec prénom, photo et histoire 100% unique générée par IA. Premier chapitre offert."
        price="0"
        priceCurrency="EUR"
      />
      <Header />

      <HeroSection>
        <HeroDecoBlur $size={350} $top="-10%" $left="-5%" $color={theme.colors.accent.coral} $opacity={0.08} />
        <HeroDecoBlur $size={280} $top="60%" $left="85%" $color={theme.colors.accent.pastelBlue} $opacity={0.06} />
        <HeroDecoBlur $size={200} $top="30%" $left="50%" $color={theme.colors.accent.paleYellow} $opacity={0.07} />
        <HeroContent>
          <HeroBadge>Conte personnalisé IA · 1er chapitre gratuit</HeroBadge>
          <HeroTitle>Le <span>conte personnalisé</span> où votre enfant est enfin le héros</HeroTitle>
          <HeroDivider />
          <HeroSubtitle>
            Pas un livre où on a juste collé le prénom : une vraie histoire illustrée, 100% unique,
            générée par IA avec sa photo et ses passions. Prête en 5 minutes. Le premier conte est gratuit.
          </HeroSubtitle>
          <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <WhiteButton onClick={() => navigate('/create-story')}>✨ Créer mon conte gratuit</WhiteButton>
          </div>
        </HeroContent>
      </HeroSection>

      {/* Section 1: Pourquoi un conte personnalisé */}
      <ContentSection ref={benefitsReveal.ref}>
        <SectionDeco $size={300} $top="-50px" $right="-100px" $color={theme.colors.accent.softPink} />
        <Container>
          <SectionWrapper $visible={benefitsReveal.isVisible}>
            <SectionTitle>Pourquoi un <span>conte personnalisé</span> change tout</SectionTitle>
            <SectionDivider />
            <SectionSubtitle>
              Un conte personnalisé Contedia n'est pas juste un livre où on a remplacé le prénom du héros :
              c'est une histoire imaginée pour <em>votre</em> enfant, avec ses traits, ses passions, et ceux qu'il aime.
            </SectionSubtitle>
          </SectionWrapper>
          <CardsGrid $columns={3} ref={benefitsCardsReveal.ref}>
            {benefits.map((benefit, i) => (
              <FeatureCard key={i} $visible={benefitsCardsReveal.isVisible} $delay={benefitsCardsReveal.getDelay(i)}>
                <CardIcon>{benefit.icon}</CardIcon>
                <CardTitle>{benefit.title}</CardTitle>
                <CardDescription>{benefit.description}</CardDescription>
                <CardTagsRow>
                  {benefit.tags.map((tag, j) => (
                    <CardTag key={j}>{tag}</CardTag>
                  ))}
                </CardTagsRow>
              </FeatureCard>
            ))}
          </CardsGrid>
        </Container>
      </ContentSection>

      {/* Section 2: Comment ça marche */}
      <ContentSection $alt ref={stepsReveal.ref}>
        <SectionDeco $size={250} $top="10%" $left="-80px" $color={theme.colors.accent.paleYellow} />
        <Container>
          <SectionWrapper $visible={stepsReveal.isVisible}>
            <SectionTitle>Créer un conte personnalisé en <span>3 étapes</span></SectionTitle>
            <SectionDivider />
            <SectionSubtitle>
              5 minutes top chrono. Pas de carte bancaire pour le premier conte personnalisé.
              Pas d'attente de livraison. Histoire prête immédiatement.
            </SectionSubtitle>
          </SectionWrapper>
          <CardsGrid $columns={3} ref={stepsCardsReveal.ref}>
            {creationSteps.map((step, i) => (
              <FeatureCard key={i} $visible={stepsCardsReveal.isVisible} $delay={stepsCardsReveal.getDelay(i)}>
                <StepNumber>{step.step}</StepNumber>
                <CardTitle>{step.title}</CardTitle>
                <CardDescription>{step.description}</CardDescription>
                <CardTagsRow>
                  <CardTag $color={theme.colors.accent.pastelBlue}>{step.duration}</CardTag>
                </CardTagsRow>
              </FeatureCard>
            ))}
          </CardsGrid>
        </Container>
      </ContentSection>

      {/* Section 3: Par âge */}
      <ContentSection ref={ageReveal.ref}>
        <SectionDeco $size={280} $top="-30px" $right="-60px" $color={theme.colors.accent.lightGreen} />
        <Container>
          <SectionWrapper $visible={ageReveal.isVisible}>
            <SectionTitle>Un <span>conte personnalisé</span> adapté à chaque âge</SectionTitle>
            <SectionDivider />
            <SectionSubtitle>
              L'IA ajuste automatiquement la longueur, le vocabulaire et la complexité narrative
              en fonction de l'âge de votre enfant. De la naissance à 12 ans.
            </SectionSubtitle>
          </SectionWrapper>
          <CardsGrid $columns={2} ref={ageCardsReveal.ref}>
            {ageRanges.map((age, i) => (
              <FeatureCard key={i} $visible={ageCardsReveal.isVisible} $delay={ageCardsReveal.getDelay(i)}>
                <CardIcon>{age.icon}</CardIcon>
                <CardTitle>{age.title}</CardTitle>
                <CardDescription>{age.description}</CardDescription>
                <CardTagsRow>
                  {age.keywords.map((kw, j) => (
                    <CardTag key={j}>{kw}</CardTag>
                  ))}
                </CardTagsRow>
              </FeatureCard>
            ))}
          </CardsGrid>
        </Container>
      </ContentSection>

      {/* Section 4: Thèmes */}
      <ContentSection $alt ref={themesReveal.ref}>
        <SectionDeco $size={250} $top="10%" $right="-80px" $color={theme.colors.accent.coral} />
        <Container>
          <SectionWrapper $visible={themesReveal.isVisible}>
            <SectionTitle>15+ <span>thèmes</span> pour votre conte personnalisé</SectionTitle>
            <SectionDivider />
            <SectionSubtitle>
              Choisissez l'univers qui passionne votre enfant. L'IA s'adapte au thème
              et intègre les codes du genre (dragons, espace, pirates…) tout en gardant votre enfant au centre.
            </SectionSubtitle>
          </SectionWrapper>
          <CardsGrid $columns={3} ref={themesCardsReveal.ref}>
            {themes.map((t, i) => (
              <FeatureCard key={i} $visible={themesCardsReveal.isVisible} $delay={themesCardsReveal.getDelay(i)}>
                <CardIcon>{t.icon}</CardIcon>
                <CardTitle>{t.title}</CardTitle>
                <CardDescription>{t.desc}</CardDescription>
              </FeatureCard>
            ))}
          </CardsGrid>
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Link to="/themes-de-contes" style={{ color: theme.colors.accent.coral, fontWeight: 600 }}>
              Voir tous les thèmes disponibles →
            </Link>
          </div>
        </Container>
      </ContentSection>

      {/* Section 5: Témoignages */}
      <ContentSection ref={testimonialsReveal.ref}>
        <SectionDeco $size={300} $top="-50px" $left="-100px" $color={theme.colors.accent.pastelBlue} />
        <Container>
          <SectionWrapper $visible={testimonialsReveal.isVisible}>
            <SectionTitle>Ce que les parents disent de leur <span>conte personnalisé</span></SectionTitle>
            <SectionDivider />
            <SectionSubtitle>
              Quatre histoires vraies de parents qui ont créé un conte personnalisé Contedia
              pour leur enfant — et l'effet que ça a eu.
            </SectionSubtitle>
          </SectionWrapper>
          <CardsGrid $columns={2} ref={testimonialsCardsReveal.ref}>
            {testimonials.map((t, i) => (
              <FeatureCard key={i} $visible={testimonialsCardsReveal.isVisible} $delay={testimonialsCardsReveal.getDelay(i)}>
                <CardIcon>{t.icon}</CardIcon>
                <CardTitle>{t.title}</CardTitle>
                <CardDescription>{t.description}</CardDescription>
                <CardTagsRow>
                  {t.tags.map((tag, j) => (
                    <CardTag key={j}>{tag}</CardTag>
                  ))}
                </CardTagsRow>
              </FeatureCard>
            ))}
          </CardsGrid>
        </Container>
      </ContentSection>

      {/* Section 6: FAQ */}
      <ContentSection $alt ref={faqReveal.ref}>
        <SectionDeco $size={260} $top="20%" $right="-90px" $color={theme.colors.accent.paleYellow} />
        <Container>
          <SectionWrapper $visible={faqReveal.isVisible}>
            <SectionTitle>FAQ : <span>conte personnalisé</span> — toutes les réponses</SectionTitle>
            <SectionDivider />
            <SectionSubtitle>
              Les questions que se posent tous les parents avant de créer leur premier conte personnalisé.
            </SectionSubtitle>
          </SectionWrapper>
          <div style={{ maxWidth: '820px', margin: '0 auto' }}>
            {faqQuestions.map((q, i) => (
              <details key={i} style={{
                background: 'var(--bg-secondary, #fff)',
                border: '1px solid var(--border-color, #eee)',
                borderRadius: '12px',
                padding: '16px 20px',
                marginBottom: '12px',
              }}>
                <summary style={{ fontWeight: 600, cursor: 'pointer', fontSize: '1.05rem' }}>
                  {q.question}
                </summary>
                <p style={{ marginTop: '12px', lineHeight: 1.6, color: 'var(--text-secondary, #555)' }}>
                  {q.answer}
                </p>
              </details>
            ))}
          </div>
        </Container>
      </ContentSection>

      {/* Final CTA */}
      <FinalCTASection ref={ctaReveal.ref}>
        <SectionWrapper $visible={ctaReveal.isVisible}>
          <FinalCTAContent>
            <FinalCTATitle>Votre enfant mérite SON conte personnalisé</FinalCTATitle>
            <FinalCTAText>
              Le premier conte est entièrement gratuit, sans carte bancaire.
              Vous serez prêt à lire SA propre aventure dans 5 minutes.
            </FinalCTAText>
            <WhiteButton onClick={() => navigate('/create-story')}>✨ Créer mon conte personnalisé gratuit</WhiteButton>
            <p style={{ marginTop: '24px', fontSize: '0.85rem', opacity: 0.85 }}>
              <Link to="/blog/guide-livre-personnalise-enfant-2026" style={{ color: 'inherit', textDecoration: 'underline' }}>
                Lire d'abord notre guide complet
              </Link>
              {' · '}
              <Link to="/blog/conteuse-personnalisable-alternative-numerique-2026" style={{ color: 'inherit', textDecoration: 'underline' }}>
                Comparatif vs conteuses audio
              </Link>
            </p>
          </FinalCTAContent>
        </SectionWrapper>
      </FinalCTASection>

      <Footer />
    </PageContainer>
  );
};

export default ContePersonnaliseLandingPage;

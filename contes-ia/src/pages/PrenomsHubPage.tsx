import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { SEOHead } from '../components/SEOHead';
import { SchemaFAQ, SchemaBreadcrumb } from '../components/SchemaMarkup';
import { Helmet } from 'react-helmet-async';
import styled, { keyframes } from 'styled-components';

// ─── Data ───

const PRENOMS = [
  { name: 'Emma', slug: 'emma', gender: 'fille', origin: 'Germanique' },
  { name: 'Gabriel', slug: 'gabriel', gender: 'garcon', origin: 'Hébreu' },
  { name: 'Louise', slug: 'louise', gender: 'fille', origin: 'Germanique' },
  { name: 'Raphaël', slug: 'raphael', gender: 'garcon', origin: 'Hébreu' },
  { name: 'Jade', slug: 'jade', gender: 'fille', origin: 'Espagnol' },
  { name: 'Léo', slug: 'leo', gender: 'garcon', origin: 'Latin' },
  { name: 'Alice', slug: 'alice', gender: 'fille', origin: 'Germanique' },
  { name: 'Louis', slug: 'louis', gender: 'garcon', origin: 'Germanique' },
  { name: 'Rose', slug: 'rose', gender: 'fille', origin: 'Latin' },
  { name: 'Noah', slug: 'noah', gender: 'garcon', origin: 'Hébreu' },
  { name: 'Chloé', slug: 'chloe', gender: 'fille', origin: 'Grec' },
  { name: 'Adam', slug: 'adam', gender: 'garcon', origin: 'Hébreu' },
  { name: 'Lina', slug: 'lina', gender: 'fille', origin: 'Arabe' },
  { name: 'Lucas', slug: 'lucas', gender: 'garcon', origin: 'Latin' },
  { name: 'Mia', slug: 'mia', gender: 'fille', origin: 'Scandinave' },
  { name: 'Arthur', slug: 'arthur', gender: 'garcon', origin: 'Celtique' },
  { name: 'Ambre', slug: 'ambre', gender: 'fille', origin: 'Arabe' },
  { name: 'Jules', slug: 'jules', gender: 'garcon', origin: 'Latin' },
  { name: 'Anna', slug: 'anna', gender: 'fille', origin: 'Hébreu' },
  { name: 'Hugo', slug: 'hugo', gender: 'garcon', origin: 'Germanique' },
  { name: 'Léa', slug: 'lea', gender: 'fille', origin: 'Hébreu' },
  { name: 'Maël', slug: 'mael', gender: 'garcon', origin: 'Celtique' },
  { name: 'Luna', slug: 'luna', gender: 'fille', origin: 'Latin' },
  { name: 'Liam', slug: 'liam', gender: 'garcon', origin: 'Irlandais' },
  { name: 'Julia', slug: 'julia', gender: 'fille', origin: 'Latin' },
  { name: 'Ethan', slug: 'ethan', gender: 'garcon', origin: 'Hébreu' },
  { name: 'Manon', slug: 'manon', gender: 'fille', origin: 'Hébreu' },
  { name: 'Nathan', slug: 'nathan', gender: 'garcon', origin: 'Hébreu' },
  { name: 'Elena', slug: 'elena', gender: 'fille', origin: 'Grec' },
  { name: 'Tom', slug: 'tom', gender: 'garcon', origin: 'Araméen' },
  { name: 'Agathe', slug: 'agathe', gender: 'fille', origin: 'Grec' },
  { name: 'Paul', slug: 'paul', gender: 'garcon', origin: 'Latin' },
  { name: 'Camille', slug: 'camille', gender: 'fille', origin: 'Latin' },
  { name: 'Sacha', slug: 'sacha', gender: 'garcon', origin: 'Grec' },
  { name: 'Charlie', slug: 'charlie', gender: 'garcon', origin: 'Germanique' },
  { name: 'Mohamed', slug: 'mohamed', gender: 'garcon', origin: 'Arabe' },
  { name: 'Yasmine', slug: 'yasmine', gender: 'fille', origin: 'Arabe' },
  { name: 'Rayan', slug: 'rayan', gender: 'garcon', origin: 'Arabe' },
  { name: 'Inès', slug: 'ines', gender: 'fille', origin: 'Arabe' },
  { name: 'Nolan', slug: 'nolan', gender: 'garcon', origin: 'Celtique' },
  { name: 'Sarah', slug: 'sarah', gender: 'fille', origin: 'Hébreu' },
  { name: 'Théo', slug: 'theo', gender: 'garcon', origin: 'Grec' },
  { name: 'Clara', slug: 'clara', gender: 'fille', origin: 'Latin' },
  { name: 'Aaron', slug: 'aaron', gender: 'garcon', origin: 'Hébreu' },
  { name: 'Charlotte', slug: 'charlotte', gender: 'fille', origin: 'Germanique' },
  { name: 'Gabin', slug: 'gabin', gender: 'garcon', origin: 'Latin' },
  { name: 'Victoria', slug: 'victoria', gender: 'fille', origin: 'Latin' },
  { name: 'Robin', slug: 'robin', gender: 'garcon', origin: 'Germanique' },
  { name: 'Lily', slug: 'lily', gender: 'fille', origin: 'Latin' },
  { name: 'Martin', slug: 'martin', gender: 'garcon', origin: 'Latin' },
];

const FAQ_QUESTIONS = [
  {
    question: "Le prénom de mon enfant n'est pas dans la liste ?",
    answer: "Pas de problème ! Contedia fonctionne avec tous les prénoms. Tapez simplement le prénom dans le formulaire de création.",
  },
  {
    question: "L'histoire change-t-elle selon le prénom ?",
    answer: "Oui ! L'IA génère une histoire unique à chaque fois, adaptée au prénom choisi.",
  },
  {
    question: "Combien coûte un livre personnalisé ?",
    answer: "Le premier livre (3 chapitres illustrés) est 100% gratuit. Le livre complet (20 pages) est à 2,99\u20AC.",
  },
  {
    question: "Peut-on créer plusieurs livres avec des prénoms différents ?",
    answer: "Oui, vous pouvez créer autant de livres que vous voulez.",
  },
];

// ─── Keyframes ───

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

// ─── Styled Components ───

const PageWrapper = styled.div`
  color: #2d2d2d;
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, #fff5f7 0%, #f0f4ff 50%, #fef9f0 100%);
  padding: 80px 24px 60px;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -60px;
    right: -60px;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: rgba(255, 153, 170, 0.08);
    filter: blur(60px);
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -40px;
    left: -40px;
    width: 250px;
    height: 250px;
    border-radius: 50%;
    background: rgba(130, 170, 255, 0.07);
    filter: blur(60px);
    pointer-events: none;
  }
`;

const HeroContent = styled.div`
  max-width: 820px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  animation: ${fadeInUp} 0.8s ease-out;
`;

const HeroBadge = styled.span`
  display: inline-block;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 153, 153, 0.25);
  padding: 6px 18px;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #e06b80;
  margin-bottom: 20px;
  letter-spacing: 0.5px;
`;

const HeroTitle = styled.h1`
  font-size: 2.6rem;
  font-weight: 800;
  color: #1a1a2e;
  line-height: 1.2;
  margin-bottom: 24px;

  span {
    background: linear-gradient(135deg, #e06b80, #7b68ee);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const HeroDivider = styled.div`
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, #e06b80, #7b68ee);
  border-radius: 2px;
  margin: 0 auto 24px;
`;

const HeroText = styled.div`
  font-size: 1.05rem;
  line-height: 1.8;
  color: #444;
  text-align: left;
  max-width: 780px;
  margin: 0 auto;

  p {
    margin-bottom: 16px;
  }

  strong {
    color: #1a1a2e;
  }

  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`;

const Section = styled.section`
  padding: 60px 24px;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 40px 16px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a2e;
  text-align: center;
  margin-bottom: 12px;

  span {
    background: linear-gradient(135deg, #e06b80, #7b68ee);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 1.05rem;
  color: #666;
  text-align: center;
  max-width: 600px;
  margin: 0 auto 40px;
  line-height: 1.6;
`;

const PrenomsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }
`;

const PrenomCard = styled(Link)<{ $gender: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 16px;
  background: ${({ $gender }) => $gender === 'fille' ? '#FFE4EC' : '#E4F0FF'};
  border-radius: 16px;
  text-decoration: none;
  color: inherit;
  border: 2px solid transparent;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    border-color: ${({ $gender }) => $gender === 'fille' ? '#f0a0b8' : '#a0c0f0'};
  }
`;

const PrenomName = styled.span`
  font-size: 1.35rem;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 6px;
`;

const PrenomOrigin = styled.span`
  font-size: 0.82rem;
  color: #777;
  font-weight: 500;
`;

const GenderDot = styled.span<{ $gender: string }>`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $gender }) => $gender === 'fille' ? '#e06b80' : '#5b8dde'};
  margin-top: 8px;
`;

const StepsSection = styled.section`
  padding: 60px 24px;
  background: #f8f9fc;
`;

const StepsContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  margin-top: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const StepCard = styled.div`
  text-align: center;
  padding: 32px 20px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
`;

const StepNumber = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e06b80, #7b68ee);
  color: #fff;
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 16px;
`;

const StepTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 8px;
`;

const StepText = styled.p`
  font-size: 0.92rem;
  color: #666;
  line-height: 1.6;
`;

const CTASection = styled.section`
  padding: 70px 24px;
  text-align: center;
  background: linear-gradient(135deg, #1a1a2e 0%, #2d1b4e 100%);
  color: #fff;
`;

const CTATitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: #fff;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const CTAText = styled.p`
  font-size: 1.05rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 32px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`;

const CTAButton = styled(Link)`
  display: inline-block;
  padding: 16px 40px;
  background: linear-gradient(135deg, #e06b80, #c94f6d);
  color: #fff;
  font-size: 1.1rem;
  font-weight: 700;
  border-radius: 50px;
  text-decoration: none;
  transition: all 0.25s ease;
  box-shadow: 0 4px 20px rgba(224, 107, 128, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 28px rgba(224, 107, 128, 0.45);
  }
`;

const FAQSection = styled.section`
  padding: 60px 24px;
  max-width: 800px;
  margin: 0 auto;
`;

const FAQItem = styled.details`
  background: #fff;
  border-radius: 12px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid #f0f0f0;
  overflow: hidden;

  &[open] summary::after {
    transform: rotate(180deg);
  }
`;

const FAQSummary = styled.summary`
  padding: 20px 24px;
  font-size: 1.05rem;
  font-weight: 600;
  color: #1a1a2e;
  cursor: pointer;
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &::-webkit-details-marker {
    display: none;
  }

  &::after {
    content: '';
    width: 10px;
    height: 10px;
    border-right: 2px solid #999;
    border-bottom: 2px solid #999;
    transform: rotate(45deg);
    transition: transform 0.25s ease;
    flex-shrink: 0;
    margin-left: 16px;
  }
`;

const FAQAnswer = styled.div`
  padding: 0 24px 20px;
  font-size: 0.95rem;
  color: #555;
  line-height: 1.7;
`;

const Breadcrumb = styled.nav`
  padding: 16px 24px;
  max-width: 1200px;
  margin: 0 auto;
  font-size: 0.85rem;
  color: #888;

  a {
    color: #888;
    text-decoration: none;
    &:hover { color: #e06b80; }
  }

  span { margin: 0 8px; }
`;

// ─── Component ───

const PrenomsHubPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageLayout>
      <SEOHead
        title="Livre Personnalisé par Prénom : Emma, Gabriel, Louise... | Contedia"
        description="Découvrez nos livres personnalisés par prénom. 50+ histoires uniques où votre enfant est le héros. Emma, Gabriel, Louise, Raphaël... Créez le livre de votre enfant gratuitement."
      />      <SchemaFAQ questions={FAQ_QUESTIONS} />
      <SchemaBreadcrumb items={[
        { name: 'Accueil', url: 'https://contedia.fr/' },
        { name: 'Prénoms', url: 'https://contedia.fr/prenoms' },
      ]} />

      <PageWrapper>
        {/* Breadcrumb */}
        <Breadcrumb>
          <Link to="/">Accueil</Link>
          <span>/</span>
          Prénoms
        </Breadcrumb>

        {/* Hero / Intro */}
        <HeroSection>
          <HeroContent>
            <HeroBadge>50+ Prénoms</HeroBadge>
            <HeroTitle>
              Livres Personnalisés par Prénom — <span>50+ Histoires Uniques</span>
            </HeroTitle>
            <HeroDivider />
            <HeroText>
              <p>
                Chaque enfant est unique, et son prénom fait partie de son identité. Imaginez un livre où votre
                enfant n'est pas simplement mentionné sur la couverture, mais où <strong>chaque page de l'histoire
                contient son prénom</strong>. C'est exactement ce que propose Contedia : des livres personnalisés
                où Emma, Gabriel, Louise, Raphaël ou n'importe quel prénom prend vie dans une aventure
                extraordinaire. Le prénom de votre enfant est tissé naturellement dans chaque phrase, chaque
                dialogue, chaque moment de l'histoire. Votre enfant devient le véritable héros d'un conte
                unique, créé spécialement pour lui.
              </p>
              <p>
                Pourquoi un livre personnalisé avec le prénom de votre enfant est-il si spécial ? Parce qu'il
                crée un <strong>lien émotionnel immédiat</strong> entre l'enfant et la lecture. Quand un enfant
                entend ou lit son propre prénom dans une histoire, son attention se décuple. Les études montrent
                que les enfants qui se voient dans les histoires développent une meilleure estime de soi, une
                plus grande envie de lire et une imagination plus riche. Offrir un livre personnalisé, c'est
                offrir bien plus qu'un cadeau : c'est offrir une expérience de lecture transformatrice.
              </p>
              <p>
                Chez Contedia, notre <strong>intelligence artificielle</strong> ne se contente pas de remplacer
                un nom générique par celui de votre enfant. Elle crée une histoire entièrement originale, adaptée
                au prénom, à l'âge et aux centres d'intérêt de votre petit. Que votre enfant s'appelle Jade,
                Arthur, Lina ou Noah, l'IA construit un récit cohérent et captivant avec des illustrations
                personnalisées. Chaque histoire est unique : deux enfants avec le même prénom mais des passions
                différentes recevront deux aventures totalement distinctes.
              </p>
              <p>
                Le meilleur dans tout cela ? <strong>Le premier livre est entièrement gratuit.</strong> Trois
                chapitres illustrés, générés en quelques minutes, prêts à être lus sur écran ou imprimés.
                Découvrez ci-dessous les 50 prénoms les plus populaires en France et cliquez sur celui de votre
                enfant pour en savoir plus. Si le prénom que vous cherchez n'apparaît pas dans la liste, pas
                d'inquiétude : Contedia fonctionne avec absolument tous les prénoms, sans exception.
              </p>
            </HeroText>
          </HeroContent>
        </HeroSection>

        {/* Grid of 50 names */}
        <Section>
          <SectionTitle>Choisissez le Prénom de <span>Votre Enfant</span></SectionTitle>
          <SectionSubtitle>
            Cliquez sur un prénom pour découvrir les histoires personnalisées disponibles.
          </SectionSubtitle>
          <PrenomsGrid>
            {PRENOMS.map((p) => (
              <PrenomCard key={p.slug} to={`/prenom/${p.slug}`} $gender={p.gender}>
                <PrenomName>{p.name}</PrenomName>
                <PrenomOrigin>{p.origin}</PrenomOrigin>
                <GenderDot $gender={p.gender} />
              </PrenomCard>
            ))}
          </PrenomsGrid>
        </Section>

        {/* Comment ça marche */}
        <StepsSection>
          <StepsContainer>
            <SectionTitle>Comment <span>ça marche</span> ?</SectionTitle>
            <SectionSubtitle>
              Créer un livre personnalisé avec le prénom de votre enfant est simple et rapide.
            </SectionSubtitle>
            <StepsGrid>
              <StepCard>
                <StepNumber>1</StepNumber>
                <StepTitle>Choisissez le prénom</StepTitle>
                <StepText>
                  Entrez le prénom de votre enfant dans le formulaire de création. Tous les prénoms sont acceptés,
                  sans aucune restriction.
                </StepText>
              </StepCard>
              <StepCard>
                <StepNumber>2</StepNumber>
                <StepTitle>Sélectionnez un thème</StepTitle>
                <StepText>
                  Aventure, animaux, magie, espace... Choisissez le thème qui passionne votre enfant pour une
                  histoire sur mesure.
                </StepText>
              </StepCard>
              <StepCard>
                <StepNumber>3</StepNumber>
                <StepTitle>L'IA crée l'histoire personnalisée</StepTitle>
                <StepText>
                  En quelques minutes, notre intelligence artificielle génère un conte unique avec le prénom de
                  votre enfant sur chaque page, accompagné d'illustrations originales.
                </StepText>
              </StepCard>
            </StepsGrid>
          </StepsContainer>
        </StepsSection>

        {/* CTA */}
        <CTASection>
          <CTATitle>Créez le livre personnalisé de votre enfant</CTATitle>
          <CTAText>
            Premier livre gratuit, prêt en 5 minutes. Aucune carte bancaire requise.
          </CTAText>
          <CTAButton to="/create-story">
            C'est gratuit — Créer mon livre
          </CTAButton>
        </CTASection>

        {/* FAQ */}
        <FAQSection>
          <SectionTitle style={{ marginBottom: 32 }}>Questions <span>Fréquentes</span></SectionTitle>
          {FAQ_QUESTIONS.map((faq, i) => (
            <FAQItem key={i}>
              <FAQSummary>{faq.question}</FAQSummary>
              <FAQAnswer>{faq.answer}</FAQAnswer>
            </FAQItem>
          ))}
        </FAQSection>
      </PageWrapper>
    </PageLayout>
  );
};

export default PrenomsHubPage;

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { SEOHead } from '../components/SEOHead';
import { SchemaOrganization, SchemaBreadcrumb } from '../components/SchemaMarkup';
import { Helmet } from 'react-helmet-async';
import styled, { keyframes } from 'styled-components';

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

const HeroText = styled.p`
  font-size: 1.15rem;
  line-height: 1.8;
  color: #444;
  max-width: 700px;
  margin: 0 auto;
  font-style: italic;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const Section = styled.section`
  padding: 60px 24px;
  max-width: 900px;
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

const TextBlock = styled.div`
  font-size: 1.05rem;
  line-height: 1.8;
  color: #444;
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

const StepIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 16px;
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

const TechSection = styled.section`
  padding: 60px 24px;
  max-width: 900px;
  margin: 0 auto;
`;

const EngagementGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-top: 32px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const EngagementCard = styled.div`
  padding: 28px 24px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  border: 1px solid #f0f0f0;
`;

const EngagementIcon = styled.div`
  font-size: 1.8rem;
  margin-bottom: 12px;
`;

const EngagementTitle = styled.h3`
  font-size: 1.05rem;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 8px;
`;

const EngagementText = styled.p`
  font-size: 0.92rem;
  color: #666;
  line-height: 1.6;
`;

const StatsSection = styled.section`
  padding: 60px 24px;
  background: linear-gradient(135deg, #1a1a2e 0%, #2d1b4e 100%);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  max-width: 900px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
`;

const StatCard = styled.div`
  text-align: center;
  padding: 24px 16px;
`;

const StatNumber = styled.div`
  font-size: 2.2rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 8px;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const StatLabel = styled.div`
  font-size: 0.92rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
`;

const ContactSection = styled.section`
  padding: 60px 24px;
  max-width: 700px;
  margin: 0 auto;
  text-align: center;
`;

const ContactEmail = styled.a`
  display: inline-block;
  font-size: 1.15rem;
  font-weight: 600;
  color: #e06b80;
  text-decoration: none;
  margin-bottom: 16px;

  &:hover {
    text-decoration: underline;
  }
`;

const ContactLegal = styled.p`
  font-size: 0.85rem;
  color: #999;
  margin-top: 16px;
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

const AProposPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageLayout>
      <SEOHead
        title="À Propos de Contedia — Notre Mission, Notre Équipe | Contedia"
        description="Découvrez l'histoire de Contedia : notre mission, notre technologie IA, notre engagement pour des histoires personnalisées de qualité pour les enfants."
      />
      <Helmet>
        <title>À Propos de Contedia — Notre Mission, Notre Équipe | Contedia</title>
        <meta name="description" content="Découvrez l'histoire de Contedia : notre mission, notre technologie IA, notre engagement pour des histoires personnalisées de qualité pour les enfants." />
        <link rel="canonical" href="https://contedia.fr/a-propos" />
      </Helmet>
      <SchemaOrganization />
      <SchemaBreadcrumb items={[
        { name: 'Accueil', url: 'https://contedia.fr/' },
        { name: 'À Propos', url: 'https://contedia.fr/a-propos' },
      ]} />

      <PageWrapper>
        {/* Breadcrumb */}
        <Breadcrumb>
          <Link to="/">Accueil</Link>
          <span>/</span>
          À Propos
        </Breadcrumb>

        {/* Hero — Notre Mission */}
        <HeroSection>
          <HeroContent>
            <HeroTitle>
              À Propos de <span>Contedia</span>
            </HeroTitle>
            <HeroDivider />
            <HeroText>
              "Chaque enfant mérite d'être le héros de sa propre histoire."
            </HeroText>
          </HeroContent>
        </HeroSection>

        {/* Notre Mission */}
        <Section>
          <SectionTitle>Notre <span>Mission</span></SectionTitle>
          <SectionSubtitle>
            Démocratiser les livres personnalisés pour enfants grâce à l'intelligence artificielle.
          </SectionSubtitle>
          <TextBlock>
            <p>
              Chez Contedia, nous croyons que chaque enfant mérite de vivre une aventure unique, avec <strong>son prénom sur chaque page</strong>. Notre mission est simple : rendre les livres personnalisés accessibles à toutes les familles, pas seulement à celles qui peuvent se permettre des ouvrages à 30 euros.
            </p>
            <p>
              Grâce à l'intelligence artificielle, nous créons des histoires et des illustrations 100% originales, adaptées à chaque enfant. Le premier livre est <strong>entièrement gratuit</strong>, parce que nous pensons que la magie de la lecture personnalisée devrait être à la portée de tous.
            </p>
            <p>
              Notre objectif va au-delà du simple divertissement : nous voulons <strong>créer des moments magiques entre parents et enfants</strong>, renforcer le goût de la lecture et stimuler l'imagination des plus petits.
            </p>
          </TextBlock>
        </Section>

        {/* Notre Histoire */}
        <Section style={{ background: '#f8f9fc', maxWidth: '100%', padding: '60px 24px' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <SectionTitle>Notre <span>Histoire</span></SectionTitle>
            <SectionSubtitle>
              Comment une idée simple est devenue un service utilisé par des centaines de familles.
            </SectionSubtitle>
            <TextBlock>
              <p>
                Contedia est né en 2025 d'une idée toute simple : un parent qui cherchait une histoire unique pour son enfant. Les livres personnalisés existants étaient chers, limités dans leurs options et rarement vraiment "personnalisés" — souvent, seul le prénom changeait sur la couverture.
              </p>
              <p>
                Et si l'intelligence artificielle pouvait créer un livre où <strong>votre enfant est véritablement le héros</strong> ? Pas juste un prénom inséré dans un texte générique, mais une histoire entière construite autour de ses passions, de son âge et de son univers.
              </p>
              <p>
                Aujourd'hui, <strong>des centaines de familles utilisent Contedia chaque mois</strong> pour créer des contes uniques. Chaque histoire est différente, chaque illustration est originale, et chaque enfant découvre la magie de se voir dans un vrai livre.
              </p>
            </TextBlock>
          </div>
        </Section>

        {/* Comment Ça Marche */}
        <StepsSection>
          <StepsContainer>
            <SectionTitle>Comment <span>Ça Marche</span> ?</SectionTitle>
            <SectionSubtitle>
              Créer un livre personnalisé en 3 étapes simples.
            </SectionSubtitle>
            <StepsGrid>
              <StepCard>
                <StepIcon>📝</StepIcon>
                <StepNumber>1</StepNumber>
                <StepTitle>Remplissez le formulaire</StepTitle>
                <StepText>
                  Prénom, âge, thème préféré, passions de votre enfant... En quelques clics, vous définissez l'univers de l'histoire.
                </StepText>
              </StepCard>
              <StepCard>
                <StepIcon>🤖</StepIcon>
                <StepNumber>2</StepNumber>
                <StepTitle>L'IA crée l'histoire</StepTitle>
                <StepText>
                  Notre intelligence artificielle génère un texte captivant et des illustrations uniques grâce à la technologie gpt-image-1.
                </StepText>
              </StepCard>
              <StepCard>
                <StepIcon>📖</StepIcon>
                <StepNumber>3</StepNumber>
                <StepTitle>Lisez et téléchargez</StepTitle>
                <StepText>
                  Lisez l'histoire en ligne avec votre enfant ou téléchargez le PDF pour l'imprimer et le garder pour toujours.
                </StepText>
              </StepCard>
            </StepsGrid>
          </StepsContainer>
        </StepsSection>

        {/* Notre Technologie */}
        <TechSection>
          <SectionTitle>Notre <span>Technologie</span></SectionTitle>
          <SectionSubtitle>
            Une IA de pointe au service de l'imagination de vos enfants.
          </SectionSubtitle>
          <TextBlock>
            <p>
              Contedia s'appuie sur les <strong>derniers modèles d'intelligence artificielle</strong> pour créer des histoires et des illustrations d'une qualité exceptionnelle. Le texte est généré par les modèles GPT les plus avancés, capables de construire des récits cohérents, captivants et adaptés à l'âge de chaque enfant.
            </p>
            <p>
              Les illustrations sont créées grâce à <strong>gpt-image-1</strong>, la dernière technologie de génération d'images. Avec <strong>9 styles d'illustration disponibles</strong> — aquarelle, dessin animé, conte de fées, et bien d'autres — chaque livre a une identité visuelle unique.
            </p>
            <p>
              Chaque histoire est <strong>100% unique</strong> : deux enfants avec le même prénom mais des centres d'intérêt différents recevront deux aventures complètement distinctes. Et parce que la sécurité de vos enfants est notre priorité, <strong>chaque histoire est vérifiée</strong> pour garantir un contenu adapté à leur âge.
            </p>
          </TextBlock>
        </TechSection>

        {/* Nos Engagements */}
        <Section style={{ background: '#f8f9fc', maxWidth: '100%', padding: '60px 24px' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <SectionTitle>Nos <span>Engagements</span></SectionTitle>
            <SectionSubtitle>
              Ce à quoi nous nous engageons envers chaque famille.
            </SectionSubtitle>
            <EngagementGrid>
              <EngagementCard>
                <EngagementIcon>🔒</EngagementIcon>
                <EngagementTitle>Vie privée</EngagementTitle>
                <EngagementText>
                  Vos données personnelles ne sont jamais vendues ni partagées avec des tiers. Le prénom et les informations de votre enfant servent uniquement à créer son histoire.
                </EngagementText>
              </EngagementCard>
              <EngagementCard>
                <EngagementIcon>✨</EngagementIcon>
                <EngagementTitle>Qualité</EngagementTitle>
                <EngagementText>
                  Chaque histoire passe par un processus de vérification pour garantir un contenu de qualité, cohérent et adapté à l'âge de votre enfant.
                </EngagementText>
              </EngagementCard>
              <EngagementCard>
                <EngagementIcon>🎁</EngagementIcon>
                <EngagementTitle>Accessibilité</EngagementTitle>
                <EngagementText>
                  Le premier livre est gratuit, sans carte bancaire requise. Nous croyons que chaque enfant mérite de découvrir la magie d'un livre personnalisé.
                </EngagementText>
              </EngagementCard>
              <EngagementCard>
                <EngagementIcon>🚀</EngagementIcon>
                <EngagementTitle>Amélioration continue</EngagementTitle>
                <EngagementText>
                  Nous améliorons constamment notre technologie, nos styles d'illustration et la qualité de nos histoires grâce aux retours de nos utilisateurs.
                </EngagementText>
              </EngagementCard>
            </EngagementGrid>
          </div>
        </Section>

        {/* Contedia en Chiffres */}
        <StatsSection>
          <SectionTitle style={{ color: '#fff', marginBottom: 40 }}>Contedia en <span>Chiffres</span></SectionTitle>
          <StatsGrid>
            <StatCard>
              <StatNumber>500+</StatNumber>
              <StatLabel>Familles</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>2 000+</StatNumber>
              <StatLabel>Histoires créées</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>9</StatNumber>
              <StatLabel>Styles d'illustration</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>4.8/5</StatNumber>
              <StatLabel>Satisfaction</StatLabel>
            </StatCard>
          </StatsGrid>
        </StatsSection>

        {/* Contactez-nous */}
        <ContactSection>
          <SectionTitle style={{ marginBottom: 24 }}>Contactez-<span>nous</span></SectionTitle>
          <p style={{ fontSize: '1.05rem', color: '#666', lineHeight: 1.7, marginBottom: 20 }}>
            Une question, une suggestion, un partenariat ? N'hésitez pas à nous écrire.
          </p>
          <ContactEmail href="mailto:contact@contedia.fr">
            contact@contedia.fr
          </ContactEmail>
          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center', gap: 20 }}>
            <a href="https://www.facebook.com/contedia" target="_blank" rel="noopener noreferrer" style={{ color: '#666', textDecoration: 'none', fontSize: '0.95rem' }}>
              Facebook
            </a>
            <a href="https://www.instagram.com/contedia.fr" target="_blank" rel="noopener noreferrer" style={{ color: '#666', textDecoration: 'none', fontSize: '0.95rem' }}>
              Instagram
            </a>
          </div>
          <ContactLegal>
            PAUSIA — SIRET : 99282930900010
          </ContactLegal>
        </ContactSection>

        {/* CTA */}
        <CTASection>
          <CTATitle>Créez votre premier livre gratuit</CTATitle>
          <CTAText>
            Une histoire unique où votre enfant est le héros. Gratuit, en 5 minutes.
          </CTAText>
          <CTAButton to="/create-story">
            Créez votre premier livre gratuit
          </CTAButton>
        </CTASection>
      </PageWrapper>
    </PageLayout>
  );
};

export default AProposPage;

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { SEOHead } from '../components/SEOHead';
import { SchemaFAQ, SchemaBreadcrumb, SchemaProduct } from '../components/SchemaMarkup';
import { Helmet } from 'react-helmet-async';
import styled, { keyframes } from 'styled-components';

// ─── Data ───

const FAQ_QUESTIONS = [
  {
    question: "Le premier livre est-il vraiment gratuit ?",
    answer: "Oui, 100% gratuit. Aucune carte bancaire n'est requise. Vous créez votre compte, remplissez le formulaire et recevez un livre de 3 chapitres illustrés sans rien payer.",
  },
  {
    question: "Puis-je annuler le Club à tout moment ?",
    answer: "Oui, le Club est sans engagement. Vous pouvez annuler votre abonnement en 1 clic depuis votre espace personnel, à tout moment. Aucun frais de résiliation.",
  },
  {
    question: "Que comprend le livre gratuit ?",
    answer: "Le livre gratuit comprend 3 chapitres illustrés avec le prénom de votre enfant intégré dans l'histoire, des illustrations originales générées par IA, la lecture en ligne et le téléchargement en PDF.",
  },
  {
    question: "Comment payer ?",
    answer: "Le paiement est sécurisé via Stripe, leader mondial du paiement en ligne. Nous acceptons les cartes bancaires CB, Visa et Mastercard. Vos données bancaires ne sont jamais stockées sur nos serveurs.",
  },
  {
    question: "Y a-t-il des frais cachés ?",
    answer: "Non, aucun frais caché. Les prix affichés sont les prix finaux. Le livre gratuit est vraiment gratuit, le livre complet coûte 2,99€ et le Club 1,99€/mois. C'est tout.",
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
  max-width: 600px;
  margin: 0 auto;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const Section = styled.section`
  padding: 60px 24px;
  max-width: 1100px;
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

const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
  max-width: 1000px;
  margin: 0 auto;
  align-items: stretch;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    max-width: 420px;
    gap: 24px;
  }
`;

const PricingCard = styled.div<{ $featured?: boolean }>`
  background: ${({ $featured }) => $featured ? 'linear-gradient(135deg, #1a1a2e 0%, #2d1b4e 100%)' : '#fff'};
  color: ${({ $featured }) => $featured ? '#fff' : '#2d2d2d'};
  border-radius: 20px;
  padding: 40px 28px;
  text-align: center;
  box-shadow: ${({ $featured }) => $featured ? '0 8px 40px rgba(123, 104, 238, 0.25)' : '0 2px 16px rgba(0, 0, 0, 0.06)'};
  border: ${({ $featured }) => $featured ? '2px solid #7b68ee' : '2px solid #f0f0f0'};
  position: relative;
  display: flex;
  flex-direction: column;
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ $featured }) => $featured ? '0 12px 48px rgba(123, 104, 238, 0.35)' : '0 8px 32px rgba(0, 0, 0, 0.1)'};
  }
`;

const PopularBadge = styled.div`
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #e06b80, #c94f6d);
  color: #fff;
  padding: 6px 20px;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 700;
  white-space: nowrap;
  letter-spacing: 0.5px;
`;

const PricingTier = styled.h3<{ $featured?: boolean }>`
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: ${({ $featured }) => $featured ? '#fff' : '#1a1a2e'};
`;

const PricingPrice = styled.div<{ $featured?: boolean }>`
  font-size: 2.8rem;
  font-weight: 800;
  margin: 16px 0 8px;
  color: ${({ $featured }) => $featured ? '#fff' : '#1a1a2e'};

  small {
    font-size: 1rem;
    font-weight: 500;
    color: ${({ $featured }) => $featured ? 'rgba(255,255,255,0.7)' : '#999'};
  }
`;

const PricingFeatures = styled.ul<{ $featured?: boolean }>`
  list-style: none;
  padding: 0;
  margin: 24px 0 32px;
  text-align: left;
  flex: 1;

  li {
    padding: 8px 0;
    font-size: 0.92rem;
    color: ${({ $featured }) => $featured ? 'rgba(255,255,255,0.85)' : '#555'};
    display: flex;
    align-items: flex-start;
    gap: 10px;
    line-height: 1.5;

    &::before {
      content: '✓';
      color: ${({ $featured }) => $featured ? '#7b68ee' : '#e06b80'};
      font-weight: 700;
      flex-shrink: 0;
    }
  }
`;

const PricingButton = styled(Link)<{ $featured?: boolean }>`
  display: block;
  padding: 14px 24px;
  background: ${({ $featured }) => $featured ? 'linear-gradient(135deg, #e06b80, #c94f6d)' : 'transparent'};
  color: ${({ $featured }) => $featured ? '#fff' : '#C9302C'};
  border: ${({ $featured }) => $featured ? 'none' : '2px solid #C9302C'};
  font-size: 1rem;
  font-weight: 700;
  border-radius: 50px;
  text-decoration: none;
  transition: all 0.25s ease;
  text-align: center;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ $featured }) => $featured
      ? '0 6px 24px rgba(224, 107, 128, 0.4)'
      : '0 4px 16px rgba(224, 107, 128, 0.2)'};
    ${({ $featured }) => !$featured && 'background: #C9302C; color: #fff;'}
  }
`;

const CompareSection = styled.section`
  padding: 60px 24px;
  background: #f8f9fc;
`;

const CompareTable = styled.div`
  max-width: 900px;
  margin: 0 auto;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);

  th, td {
    padding: 16px 20px;
    text-align: center;
    font-size: 0.92rem;
    border-bottom: 1px solid #f0f0f0;
  }

  th {
    background: #1a1a2e;
    color: #fff;
    font-weight: 700;
    font-size: 0.95rem;
  }

  th:first-child, td:first-child {
    text-align: left;
    font-weight: 600;
    color: #1a1a2e;
  }

  tr:last-child td {
    border-bottom: none;
  }

  @media (max-width: 640px) {
    th, td {
      padding: 12px 10px;
      font-size: 0.82rem;
    }
  }
`;

const Check = styled.span`
  color: #22c55e;
  font-weight: 700;
  font-size: 1.1rem;
`;

const Cross = styled.span`
  color: #ccc;
  font-size: 1.1rem;
`;

const WhyCheaperSection = styled.section`
  padding: 60px 24px;
  max-width: 800px;
  margin: 0 auto;
`;

const TextBlock = styled.div`
  font-size: 1.05rem;
  line-height: 1.8;
  color: #444;

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

const TarifsPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageLayout>
      <SEOHead
        title="Tarifs Contedia — Livre Personnalisé Enfant dès 0€ | Contedia"
        description="Combien coûte un livre personnalisé Contedia ? Premier livre gratuit, livre complet à 2,99€, abonnement Club à 1,99€/mois. Transparent, sans engagement."
      />      <SchemaProduct
        name="Livre Personnalisé Gratuit — Contedia"
        description="Premier livre personnalisé gratuit : 3 chapitres illustrés, prénom de l'enfant, PDF téléchargeable."
        price="0"
      />
      <SchemaProduct
        name="Livre Complet Personnalisé — Contedia"
        description="Livre personnalisé complet : 20 pages illustrées, tous les thèmes, 9 styles d'illustration, PDF haute qualité."
        price="2.99"
      />
      <SchemaProduct
        name="Club Contedia — Abonnement Mensuel"
        description="Abonnement Club Contedia : livres illimités, toutes les fonctionnalités, nouveaux styles en avant-première, sans engagement."
        price="1.99"
      />
      <SchemaFAQ questions={FAQ_QUESTIONS} />
      <SchemaBreadcrumb items={[
        { name: 'Accueil', url: 'https://contedia.fr/' },
        { name: 'Tarifs', url: 'https://contedia.fr/tarifs' },
      ]} />

      <PageWrapper>
        {/* Breadcrumb */}
        <Breadcrumb>
          <Link to="/">Accueil</Link>
          <span>/</span>
          Tarifs
        </Breadcrumb>

        {/* Hero */}
        <HeroSection>
          <HeroContent>
            <HeroTitle>
              Tarifs Contedia : Votre Premier Livre est <span>Gratuit</span>
            </HeroTitle>
            <HeroDivider />
            <HeroText>
              Des histoires personnalisées pour tous les budgets. Le premier livre est toujours gratuit.
            </HeroText>
          </HeroContent>
        </HeroSection>

        {/* Pricing Cards */}
        <Section>
          <PricingGrid>
            {/* Gratuit */}
            <PricingCard>
              <PricingTier>Gratuit</PricingTier>
              <PricingPrice>0€</PricingPrice>
              <PricingFeatures>
                <li>1 livre de 3 chapitres illustrés</li>
                <li>Prénom personnalisé dans l'histoire</li>
                <li>Illustrations IA originales</li>
                <li>Lecture en ligne</li>
                <li>PDF téléchargeable</li>
              </PricingFeatures>
              <PricingButton to="/create-story">
                Commencer gratuitement
              </PricingButton>
            </PricingCard>

            {/* Livre Complet */}
            <PricingCard>
              <PricingTier>Livre Complet</PricingTier>
              <PricingPrice>2,99€</PricingPrice>
              <PricingFeatures>
                <li>20 pages illustrées</li>
                <li>Histoire complète et captivante</li>
                <li>Tous les thèmes disponibles</li>
                <li>9 styles d'illustration au choix</li>
                <li>PDF haute qualité</li>
              </PricingFeatures>
              <PricingButton to="/create-story">
                Créer un livre complet
              </PricingButton>
            </PricingCard>

            {/* Club */}
            <PricingCard $featured>
              <PopularBadge>Le plus populaire</PopularBadge>
              <PricingTier $featured>Club</PricingTier>
              <PricingPrice $featured>1,99€<small>/mois</small></PricingPrice>
              <PricingFeatures $featured>
                <li>Livres illimités</li>
                <li>Toutes les fonctionnalités incluses</li>
                <li>Nouveaux styles en avant-première</li>
                <li>Support prioritaire</li>
                <li>Sans engagement — annulation en 1 clic</li>
              </PricingFeatures>
              <PricingButton to="/create-story" $featured>
                Rejoindre le Club
              </PricingButton>
            </PricingCard>
          </PricingGrid>
        </Section>

        {/* Tableau comparatif */}
        <CompareSection>
          <SectionTitle style={{ marginBottom: 40 }}>Comparer les <span>Formules</span></SectionTitle>
          <CompareTable>
            <Table>
              <thead>
                <tr>
                  <th>Fonctionnalité</th>
                  <th>Gratuit</th>
                  <th>Livre Complet</th>
                  <th>Club</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Prénom personnalisé</td>
                  <td><Check>✓</Check></td>
                  <td><Check>✓</Check></td>
                  <td><Check>✓</Check></td>
                </tr>
                <tr>
                  <td>Illustrations IA</td>
                  <td><Check>✓</Check></td>
                  <td><Check>✓</Check></td>
                  <td><Check>✓</Check></td>
                </tr>
                <tr>
                  <td>Lecture en ligne</td>
                  <td><Check>✓</Check></td>
                  <td><Check>✓</Check></td>
                  <td><Check>✓</Check></td>
                </tr>
                <tr>
                  <td>PDF téléchargeable</td>
                  <td><Check>✓</Check></td>
                  <td><Check>✓</Check></td>
                  <td><Check>✓</Check></td>
                </tr>
                <tr>
                  <td>Nombre de pages</td>
                  <td>3 chapitres</td>
                  <td>20 pages</td>
                  <td>20 pages</td>
                </tr>
                <tr>
                  <td>Tous les thèmes</td>
                  <td><Cross>—</Cross></td>
                  <td><Check>✓</Check></td>
                  <td><Check>✓</Check></td>
                </tr>
                <tr>
                  <td>9 styles d'illustration</td>
                  <td><Cross>—</Cross></td>
                  <td><Check>✓</Check></td>
                  <td><Check>✓</Check></td>
                </tr>
                <tr>
                  <td>Livres illimités</td>
                  <td><Cross>—</Cross></td>
                  <td><Cross>—</Cross></td>
                  <td><Check>✓</Check></td>
                </tr>
                <tr>
                  <td>Nouveaux styles en avant-première</td>
                  <td><Cross>—</Cross></td>
                  <td><Cross>—</Cross></td>
                  <td><Check>✓</Check></td>
                </tr>
                <tr>
                  <td>Support prioritaire</td>
                  <td><Cross>—</Cross></td>
                  <td><Cross>—</Cross></td>
                  <td><Check>✓</Check></td>
                </tr>
              </tbody>
            </Table>
          </CompareTable>
        </CompareSection>

        {/* Pourquoi c'est moins cher */}
        <WhyCheaperSection>
          <SectionTitle>Pourquoi c'est <span>moins cher</span> ?</SectionTitle>
          <SectionSubtitle>
            Des livres personnalisés de qualité, à une fraction du prix habituel.
          </SectionSubtitle>
          <TextBlock>
            <p>
              Les livres personnalisés traditionnels coûtent cher. <strong>Wonderbly facture entre 25 et 35€</strong> par livre, <strong>Hourra Héros demande plus de 30€</strong>. Ces prix s'expliquent par les coûts d'impression, de stockage et de logistique.
            </p>
            <p>
              Chez Contedia, l'intelligence artificielle nous permet de créer des histoires et des illustrations <strong>100% uniques</strong> sans aucun de ces coûts. Pas d'impression physique, pas d'entrepôt, pas de livraison. Vous recevez un <strong>PDF numérique haute qualité</strong> que vous pouvez lire en ligne ou imprimer vous-même autant de fois que vous le souhaitez.
            </p>
            <p>
              Résultat : un livre véritablement personnalisé — pas juste un prénom sur une couverture, mais une histoire entière créée pour votre enfant — <strong>à partir de 0€</strong>. Et même le livre complet à 2,99€ reste 10 fois moins cher que les alternatives traditionnelles.
            </p>
          </TextBlock>
        </WhyCheaperSection>

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

        {/* CTA */}
        <CTASection>
          <CTATitle>Prêt à créer votre premier livre ?</CTATitle>
          <CTAText>
            Gratuit, sans carte bancaire, prêt en 5 minutes. Votre enfant va adorer.
          </CTAText>
          <CTAButton to="/create-story">
            C'est gratuit — Créer mon livre
          </CTAButton>
        </CTASection>
      </PageWrapper>
    </PageLayout>
  );
};

export default TarifsPage;

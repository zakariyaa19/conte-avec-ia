import React, { useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { Button } from '../components/ui/Button';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const CancelContainer = styled.main`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${theme.colors.accent.softPeach}, ${theme.colors.accent.lightCoral});
  padding: ${theme.spacing.xl};
`;

const CancelCard = styled.div`
  background: white;
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing['3xl']};
  text-align: center;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
`;

const CancelIcon = styled.div`
  font-size: 4rem;
  margin-bottom: ${theme.spacing.xl};
`;

const CancelTitle = styled.h1`
  color: ${theme.colors.text.primary};
  font-family: ${theme.fonts.heading};
  font-size: 2.5rem;
  margin-bottom: ${theme.spacing.lg};
`;

const CancelMessage = styled.p`
  color: ${theme.colors.text.secondary};
  font-size: 1.25rem;
  line-height: 1.6;
  margin-bottom: ${theme.spacing.xl};
`;

const InfoBox = styled.div`
  background: ${theme.colors.background.secondary};
  padding: ${theme.spacing.xl};
  border-radius: ${theme.borderRadius.lg};
  margin: ${theme.spacing.xl} 0;
`;

const InfoText = styled.p`
  color: ${theme.colors.text.secondary};
  line-height: 1.6;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${theme.spacing.lg};
  justify-content: center;
  margin-top: ${theme.spacing.xl};
  
  @media (max-width: ${theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

export const CancelPage: React.FC = () => {
  useEffect(() => {
    // SEO pour la page d'annulation
    document.title = 'Paiement Annulé | Reprendre votre Commande de Livre Personnalisé';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Paiement annulé. Reprenez facilement votre commande de livre personnalisé enfant. Aucun montant débité, votre conte sur mesure vous attend.');
    } else {
      const newMetaDescription = document.createElement('meta');
      newMetaDescription.name = 'description';
      newMetaDescription.content = 'Paiement annulé. Reprenez facilement votre commande de livre personnalisé enfant. Aucun montant débité, votre conte sur mesure vous attend.';
      document.head.appendChild(newMetaDescription);
    }
  }, []);

  const handleRetryPayment = () => {
    window.location.href = '/create-story';
  };

  const handleReturnHome = () => {
    window.location.href = '/';
  };

  return (
    <PageContainer>
      <Header />
      <CancelContainer>
        <CancelCard>
        <CancelIcon>😔</CancelIcon>
        <CancelTitle>Paiement annulé</CancelTitle>
        <CancelMessage>
          Votre paiement a été annulé. Aucun montant n'a été débité de votre compte.
        </CancelMessage>

        <InfoBox>
          <InfoText>
            <strong>Que s'est-il passé ?</strong><br/>
            Vous avez annulé le processus de paiement ou fermé la fenêtre de paiement.
            Votre commande n'a pas été finalisée et reste en attente.
          </InfoText>
        </InfoBox>

        <InfoBox>
          <InfoText>
            <strong>💡 Vous pouvez :</strong><br/>
            • Reprendre votre commande là où vous l'avez laissée<br/>
            • Modifier vos choix si nécessaire<br/>
            • Contacter notre support si vous rencontrez des difficultés
          </InfoText>
        </InfoBox>

        <ButtonGroup>
          <Button
            variant="primary"
            size="lg"
            onClick={handleRetryPayment}
          >
            Reprendre ma commande
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={handleReturnHome}
          >
            Retour à l'accueil
          </Button>
        </ButtonGroup>
        </CancelCard>
      </CancelContainer>
      <Footer />
    </PageContainer>
  );
};

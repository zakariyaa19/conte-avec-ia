import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { theme } from '../styles/theme';
import { Button } from '../components/ui/Button';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { ApiService } from '../config/api';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${theme.colors.background.primary};
`;

const CancelContainer = styled.main`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing['3xl']} ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.xl} ${theme.spacing.md};
  }
`;

const CancelCard = styled.div`
  background: ${theme.colors.background.white};
  border-radius: ${theme.borderRadius['2xl']};
  padding: ${theme.spacing['3xl']};
  text-align: center;
  max-width: 620px;
  width: 100%;
  box-shadow: ${theme.shadows.card};
  border: 1px solid rgba(0, 0, 0, 0.04);
  animation: ${fadeInUp} 0.6s ease-out;

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.xl} ${theme.spacing.lg};
    border-radius: ${theme.borderRadius.xl};
  }
`;

const CancelIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: ${theme.colors.accent.coral}12;
  font-size: 2.5rem;
  margin-bottom: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.sm}) {
    width: 72px;
    height: 72px;
    font-size: 2rem;
    margin-bottom: ${theme.spacing.lg};
  }
`;

const CancelTitle = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['3xl']};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.md};
  letter-spacing: -0.01em;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes['2xl']};
  }
`;

const CancelMessage = styled.p`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.fontSizes.base};
  line-height: 1.7;
  margin-bottom: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.sm};
  }
`;

const InfoBox = styled.div`
  background: ${theme.colors.background.secondary};
  padding: ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.xl};
  margin-bottom: ${theme.spacing.md};
  text-align: left;
`;

const InfoText = styled.p`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.fontSizes.sm};
  line-height: 1.7;

  strong {
    color: ${theme.colors.text.primary};
    font-weight: 600;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  justify-content: center;
  margin-top: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

export const CancelPage: React.FC = () => {
  const location = useLocation();

  // Marquer la commande comme abandonnee
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const orderId = searchParams.get('order_id');
    if (orderId) {
      ApiService.abandonOrder(orderId).catch(() => {});
    }
  }, [location.search]);

  useEffect(() => {
    document.title = 'Paiement Annule | Reprendre votre Commande de Livre Personnalise';

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Paiement annule. Reprenez facilement votre commande de livre personnalise enfant. Aucun montant debite, votre conte sur mesure vous attend.');
    } else {
      const newMetaDescription = document.createElement('meta');
      newMetaDescription.name = 'description';
      newMetaDescription.content = 'Paiement annule. Reprenez facilement votre commande de livre personnalise enfant. Aucun montant debite, votre conte sur mesure vous attend.';
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
          <CancelTitle>Paiement annule</CancelTitle>
          <CancelMessage>
            Votre paiement a ete annule. Aucun montant n'a ete debite de votre compte.
          </CancelMessage>

          <InfoBox>
            <InfoText>
              <strong>Que s'est-il passe ?</strong><br/>
              Vous avez annule le processus de paiement ou ferme la fenetre de paiement.
              Votre commande n'a pas ete finalisee et reste en attente.
            </InfoText>
          </InfoBox>

          <InfoBox>
            <InfoText>
              <strong>Vous pouvez :</strong><br/>
              • Reprendre votre commande la ou vous l'avez laissee<br/>
              • Modifier vos choix si necessaire<br/>
              • Contacter notre support si vous rencontrez des difficultes
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
              variant="outline"
              size="lg"
              onClick={handleReturnHome}
            >
              Retour a l'accueil
            </Button>
          </ButtonGroup>
        </CancelCard>
      </CancelContainer>
      <Footer />
    </PageContainer>
  );
};

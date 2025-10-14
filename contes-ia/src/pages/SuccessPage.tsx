import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const SuccessContainer = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.accent.coral});
  padding: ${theme.spacing.xl};
`;

const SuccessCard = styled.div`
  background: white;
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing['3xl']};
  text-align: center;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
`;

const SuccessIcon = styled.div`
  font-size: 4rem;
  color: #4CAF50;
  margin-bottom: ${theme.spacing.xl};
`;

const LoadingIcon = styled.div`
  font-size: 4rem;
  margin-bottom: ${theme.spacing.xl};
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const Title = styled.h1`
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.lg};
  font-size: 2rem;
  font-family: ${theme.fonts.heading};
`;

const Message = styled.p`
  color: ${theme.colors.text.secondary};
  margin-bottom: ${theme.spacing.xl};
  line-height: 1.6;
`;

const SessionInfo = styled.div`
  background: #f5f5f5;
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.lg};
  margin-bottom: ${theme.spacing.xl};
  font-family: monospace;
  font-size: 0.9rem;
  color: #555;
`;

const StyledButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s;
  margin-top: ${theme.spacing.xl};

  &:hover {
    transform: translateY(-4px);
  }
`;

export const SuccessPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  
  const searchParams = new URLSearchParams(location.search);
  const sessionId = searchParams.get('session_id');
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    const verifyPayment = async () => {
      if (sessionId && orderId) {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/stripe/check-payment-status?sessionId=${sessionId}&orderId=${orderId}`);
          const data = await response.json();
          
          if (data.success && data.status === 'paid') {
            setPaymentConfirmed(true);
          }
        } catch (error) {
          console.error('Erreur lors de la vérification du paiement:', error);
        }
      }
      setIsVerifying(false);
    };

    verifyPayment();
  }, [sessionId, orderId]);

  const handleReturnHome = () => {
    navigate('/');
  };

  if (isVerifying) {
    return (
      <PageContainer>
        <Header />
        <SuccessContainer>
          <SuccessCard>
            <LoadingIcon>⏳</LoadingIcon>
            <Title>Vérification du paiement...</Title>
            <Message>
              Nous vérifions votre paiement et préparons votre commande.
            </Message>
          </SuccessCard>
        </SuccessContainer>
        <Footer />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header />
      <SuccessContainer>
        <SuccessCard>
        <SuccessIcon>✅</SuccessIcon>
        <Title>Paiement réussi !</Title>
        <Message>
          Votre commande a été confirmée avec succès. Nous avons reçu votre paiement et 
          nous commençons immédiatement la création de votre conte personnalisé.
        </Message>
        {sessionId && (
          <SessionInfo>
            ID de session: {sessionId}
          </SessionInfo>
        )}
        <Message>
          {paymentConfirmed ? (
            <>
              ✅ Paiement confirmé et emails envoyés !<br/>
              Vous recevrez un email de confirmation sous peu avec tous les détails de votre commande.
              Notre équipe se mettra au travail pour créer votre histoire unique !
            </>
          ) : (
            <>
              Vous recevrez un email de confirmation sous peu avec tous les détails de votre commande.
              Notre équipe se mettra au travail pour créer votre histoire unique !
            </>
          )}
        </Message>
        <StyledButton onClick={handleReturnHome}>
          Retour à l'accueil
        </StyledButton>
      </SuccessCard>
    </SuccessContainer>
    <Footer />
    </PageContainer>
  );
};

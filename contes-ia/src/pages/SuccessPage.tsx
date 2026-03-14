import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { theme } from '../styles/theme';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { trackPurchase } from '../utils/tiktokPixel';
import { metaTrackPurchase } from '../utils/metaPixel';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../config/constants';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.3); }
  50% { box-shadow: 0 0 0 16px rgba(76, 175, 80, 0); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${theme.colors.background.primary};
`;

const SuccessContainer = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing['3xl']} ${theme.spacing.lg};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -100px;
    right: -100px;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: ${theme.colors.accent.coral}08;
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -80px;
    left: -80px;
    width: 250px;
    height: 250px;
    border-radius: 50%;
    background: ${theme.colors.accent.paleYellow}30;
    pointer-events: none;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.xl} ${theme.spacing.md};
  }
`;

const SuccessCard = styled.div`
  background: ${theme.colors.background.white};
  border-radius: ${theme.borderRadius['2xl']};
  padding: ${theme.spacing['3xl']};
  text-align: center;
  max-width: 620px;
  width: 100%;
  box-shadow: ${theme.shadows.card};
  border: 1px solid rgba(0, 0, 0, 0.04);
  animation: ${fadeInUp} 0.6s ease-out;
  position: relative;
  z-index: 1;

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.xl} ${theme.spacing.lg};
    border-radius: ${theme.borderRadius.xl};
  }
`;

const IconContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 88px;
  height: 88px;
  border-radius: 50%;
  margin-bottom: ${theme.spacing.xl};
  animation: ${scaleIn} 0.5s ease-out 0.2s both;

  @media (max-width: ${theme.breakpoints.sm}) {
    width: 72px;
    height: 72px;
    margin-bottom: ${theme.spacing.lg};
  }
`;

const SuccessIconContainer = styled(IconContainer)`
  background: linear-gradient(135deg, #E8F5E9, #C8E6C9);
  animation: ${scaleIn} 0.5s ease-out 0.2s both, ${pulseGlow} 2s ease-in-out 1s infinite;
`;

const LoadingIconContainer = styled(IconContainer)`
  background: ${theme.colors.accent.coral}12;
`;

const IconEmoji = styled.span`
  font-size: 2.5rem;
  line-height: 1;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 2rem;
  }
`;

const SpinningEmoji = styled(IconEmoji)`
  display: inline-block;
  animation: ${spin} 1.5s linear infinite;
`;

const Title = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['3xl']};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.md};
  letter-spacing: -0.01em;
  animation: ${fadeInUp} 0.5s ease-out 0.3s both;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes['2xl']};
  }
`;

const Message = styled.p`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.fontSizes.base};
  line-height: 1.7;
  margin-bottom: ${theme.spacing.lg};
  animation: ${fadeInUp} 0.5s ease-out 0.4s both;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.sm};
  }
`;

const StepsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  text-align: left;
  margin: ${theme.spacing.xl} 0;
  padding: ${theme.spacing.lg};
  background: ${theme.colors.background.secondary};
  border-radius: ${theme.borderRadius.xl};
  animation: ${fadeInUp} 0.5s ease-out 0.5s both;

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.md};
    margin: ${theme.spacing.lg} 0;
  }
`;

const StepItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${theme.spacing.md};
`;

const StepNumber = styled.div<{ $highlighted?: boolean }>`
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.$highlighted
    ? `linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.button.primaryHover})`
    : `linear-gradient(135deg, ${theme.colors.accent.lightGreen}, #8FE6A0)`
  };
  color: ${theme.colors.text.white};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.fontSizes.sm};
  font-weight: 700;
`;

const StepText = styled.div`
  padding-top: 4px;

  strong {
    display: block;
    color: ${theme.colors.text.primary};
    font-size: ${theme.fontSizes.sm};
    font-weight: 600;
    margin-bottom: 2px;
  }

  span {
    color: ${theme.colors.text.light};
    font-size: ${theme.fontSizes.xs};
    line-height: 1.5;
  }
`;

const ConfirmedBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  background: linear-gradient(135deg, #E8F5E9, #C8E6C9);
  color: #2E7D32;
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
  margin-bottom: ${theme.spacing.md};
  animation: ${fadeInUp} 0.5s ease-out 0.35s both;
`;

const ButtonContainer = styled.div`
  margin-top: ${theme.spacing.lg};
  animation: ${fadeInUp} 0.5s ease-out 0.6s both;
`;

export const SuccessPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const { isAuthenticated, refreshProfile, setTokenAndUser } = useAuth();

  const searchParams = new URLSearchParams(location.search);
  const sessionId = searchParams.get('session_id');
  const orderId = searchParams.get('order_id');
  const isClubFree = searchParams.get('club_free') === 'true';

  useEffect(() => {
    document.title = 'Commande Confirmee | Votre Livre Personnalise est en Preparation';

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Felicitations ! Votre conte personnalise est confirme. Votre eBook personnalise sera bientot pret.');
    } else {
      const newMetaDescription = document.createElement('meta');
      newMetaDescription.name = 'description';
      newMetaDescription.content = 'Felicitations ! Votre conte personnalise est confirme. Votre eBook personnalise sera bientot pret.';
      document.head.appendChild(newMetaDescription);
    }

    // Commande Club gratuite : pas besoin de verifier Stripe
    if (isClubFree) {
      setPaymentConfirmed(true);
      setIsVerifying(false);
      if (localStorage.getItem('userToken')) {
        refreshProfile();
      }
      // Tracker la conversion même pour les commandes Club gratuites
      if (orderId) {
        metaTrackPurchase('club', orderId, 0, 'EUR');
      }
      return;
    }

    const verifyPayment = async () => {
      if (sessionId && orderId) {
        try {
          const response = await fetch(`${API_BASE_URL}/api/stripe/check-payment-status?sessionId=${sessionId}&orderId=${orderId}`);
          const data = await response.json();

          if (data.success && data.status === 'paid') {
            setPaymentConfirmed(true);

            // Auto-login: use token from payment verification
            // (token may have been lost during Stripe redirect)
            if (data.token && data.user) {
              setTokenAndUser(data.token, data.user);
            }

            if (localStorage.getItem('userToken')) {
              await refreshProfile();
            }

            const productType = data.order?.formData?.productType || 'ebook';
            const userEmail = data.order?.userEmail;
            await trackPurchase(productType, orderId || 'unknown', userEmail);
            await metaTrackPurchase(productType, orderId || 'unknown');
          }
        } catch (error) {
          console.error('Erreur lors de la verification du paiement:', error);
        }
      }
      setIsVerifying(false);
    };

    verifyPayment();
  }, [sessionId, orderId, isClubFree]);

  const handleReturnHome = () => {
    navigate('/');
  };

  const handleCreateAnother = () => {
    navigate('/create-story');
  };

  if (isVerifying) {
    return (
      <PageContainer>
        <Header />
        <SuccessContainer>
          <SuccessCard>
            <LoadingIconContainer>
              <SpinningEmoji>⏳</SpinningEmoji>
            </LoadingIconContainer>
            <Title>Verification du paiement...</Title>
            <Message>
              Nous verifions votre paiement et preparons votre commande.
              Cela ne prend que quelques instants.
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
          <SuccessIconContainer>
            <IconEmoji>✅</IconEmoji>
          </SuccessIconContainer>

          <Title>Votre conte est en cours de creation !</Title>

          {paymentConfirmed && (
            <ConfirmedBadge>
              &#x2713; Commande confirmee
            </ConfirmedBadge>
          )}

          <Message>
            Notre IA genere votre livre personnalise en ce moment meme.<br />
            Il sera pret dans environ <strong>5 minutes</strong>.
          </Message>

          <StepsContainer>
            <StepItem>
              <StepNumber $highlighted>1</StepNumber>
              <StepText>
                <strong>Generation en cours</strong>
                <span>Notre IA redige l'histoire et illustre chaque page de votre conte</span>
              </StepText>
            </StepItem>
            <StepItem>
              <StepNumber>2</StepNumber>
              <StepText>
                <strong>Disponible dans votre bibliotheque</strong>
                <span>Retrouvez votre livre numerique dans votre espace personnel des qu'il est pret. Vous pouvez le lire en ligne ou le telecharger en PDF</span>
              </StepText>
            </StepItem>
          </StepsContainer>

          <ButtonContainer>
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/dashboard')}
              fullWidth
            >
              Retrouver mon livre dans ma bibliotheque
            </Button>
            <div style={{ marginTop: theme.spacing.sm }}>
              <Button
                variant="ghost"
                size="md"
                onClick={handleCreateAnother}
                fullWidth
              >
                Creer un autre conte
              </Button>
            </div>
          </ButtonContainer>
        </SuccessCard>
      </SuccessContainer>
      <Footer />
    </PageContainer>
  );
};

import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { theme } from '../styles/theme';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { ApiService } from '../config/api';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
`;

const Card = styled.div`
  max-width: 440px;
  width: 100%;
  text-align: center;
  animation: ${fadeIn} 0.5s ease both;
`;

const IconCircle = styled.div`
  width: 72px; height: 72px;
  border-radius: 50%;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 20px;
  font-size: 32px;
`;

const Title = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: clamp(1.4rem, 4vw, 1.8rem);
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 8px;
`;

const Sub = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0 0 28px;
`;

const InfoCard = styled.div`
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  padding: 16px 20px;
  text-align: left;
  margin-bottom: 24px;
`;

const InfoLine = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 6px 0;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
`;

const InfoIcon = styled.span`
  font-size: 15px;
  flex-shrink: 0;
  margin-top: 1px;
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
`;

const PrimaryLink = styled.button`
  appearance: none;
  border: none;
  background: ${theme.colors.accent.coral};
  color: white;
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.base};
  font-weight: 700;
  padding: 14px 32px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { transform: translateY(-1px); box-shadow: 0 4px 16px ${theme.colors.accent.coral}40; }
  &:active { transform: scale(0.97); }
`;

const SecondaryLink = styled.button`
  appearance: none;
  border: none;
  background: none;
  color: var(--text-light);
  font-size: 13px;
  cursor: pointer;
  padding: 8px;
  &:hover { color: var(--text-secondary); }
`;

export const CancelPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const isSubscription = params.get('type') === 'subscription';
  const orderId = params.get('order_id');

  useEffect(() => {
    if (orderId) {
      ApiService.abandonOrder(orderId).catch(() => {});
    }
  }, [orderId]);

  useEffect(() => {
    document.title = 'Paiement annulé | Contes d\'IA';
  }, []);

  return (
    <Page>
      <Header />
      <Main>
        <Card>
          <IconCircle>✋</IconCircle>
          <Title>Paiement non finalisé</Title>
          <Sub>
            {isSubscription
              ? 'Votre abonnement n\'a pas été activé. Aucun montant n\'a été débité.'
              : 'Votre commande n\'a pas été finalisée. Aucun montant n\'a été débité.'}
          </Sub>

          <InfoCard>
            <InfoLine>
              <InfoIcon>🔒</InfoIcon>
              <span>Aucun prélèvement n'a été effectué</span>
            </InfoLine>
            <InfoLine>
              <InfoIcon>📖</InfoIcon>
              <span>
                {isSubscription
                  ? 'Vous pouvez rejoindre le Club à tout moment'
                  : 'Votre livre vous attend — reprenez quand vous voulez'}
              </span>
            </InfoLine>
            <InfoLine>
              <InfoIcon>💬</InfoIcon>
              <span>Un souci ? Contactez-nous à contact@contedia.fr</span>
            </InfoLine>
          </InfoCard>

          <Actions>
            <PrimaryLink onClick={() => navigate(isSubscription ? '/club/checkout' : '/create-story')}>
              {isSubscription ? 'Rejoindre le Club' : 'Reprendre ma commande'}
            </PrimaryLink>
            <SecondaryLink onClick={() => navigate('/')}>
              Retour à l'accueil
            </SecondaryLink>
          </Actions>
        </Card>
      </Main>
      <Footer />
    </Page>
  );
};

export default CancelPage;

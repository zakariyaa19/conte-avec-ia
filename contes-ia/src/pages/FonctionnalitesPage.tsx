import React from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing['2xl']} ${theme.spacing.lg};
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing.xl} ${theme.spacing.md};
  }
`;

const PageTitle = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['4xl']};
  color: ${theme.colors.text.primary};
  text-align: center;
  margin-bottom: ${theme.spacing.xl};
  
  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.fontSizes['3xl']};
  }
`;

const PlaceholderContent = styled.div`
  text-align: center;
  padding: ${theme.spacing['4xl']} ${theme.spacing.xl};
  background-color: ${theme.colors.background.secondary};
  border-radius: ${theme.borderRadius.lg};
  border: 2px dashed ${theme.colors.accent.coral};
`;

const PlaceholderText = styled.p`
  font-size: ${theme.fontSizes.lg};
  color: ${theme.colors.text.secondary};
  margin-bottom: ${theme.spacing.md};
`;

const PlaceholderEmoji = styled.div`
  font-size: 4rem;
  margin-bottom: ${theme.spacing.lg};
`;

export const FonctionnalitesPage: React.FC = () => {
  return (
    <PageContainer>
      <Header />
      <MainContent>
        <PageTitle>Découvrez vos possibilités</PageTitle>
        <PlaceholderContent>
          <PlaceholderEmoji>🚀✨</PlaceholderEmoji>
          <PlaceholderText>
            Cette page présentera bientôt toutes les fonctionnalités incroyables de Contes d'IA !
          </PlaceholderText>
          <PlaceholderText>
            Explorez les possibilités infinies de création d'histoires personnalisées.
          </PlaceholderText>
        </PlaceholderContent>
      </MainContent>
      <Footer />
    </PageContainer>
  );
};

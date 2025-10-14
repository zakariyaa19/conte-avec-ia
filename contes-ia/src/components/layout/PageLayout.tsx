import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { Header } from './Header';
import { Footer } from './Footer';

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${theme.colors.background.white};
`;

const MainContent = styled.main`
  flex: 1;
  background: linear-gradient(135deg, ${theme.colors.background.primary} 0%, ${theme.colors.accent.paleYellow} 100%);
`;

interface PageLayoutProps {
  children: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <PageContainer>
      <Header />
      <MainContent>
        {children}
      </MainContent>
      <Footer />
    </PageContainer>
  );
};

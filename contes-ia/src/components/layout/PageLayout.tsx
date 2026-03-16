import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { Header } from './Header';
import { Footer } from './Footer';

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-primary);
`;

const MainContent = styled.main`
  flex: 1;
  background: var(--gradient-hero);
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

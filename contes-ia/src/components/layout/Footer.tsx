import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { theme } from '../../styles/theme';
const FooterContainer = styled.footer`
  background-color: ${theme.colors.background.secondary};
  margin-top: auto;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, ${theme.colors.accent.lightCoral}, transparent);
  }
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing['2xl']} ${theme.spacing.lg} ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing.xl} ${theme.spacing.md};
  }
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: ${theme.spacing.xl};
  margin-bottom: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr 1fr;
    gap: ${theme.spacing.lg};
  }

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.lg};
  }
`;

const FooterSection = styled.div`
  h4 {
    font-family: ${theme.fonts.heading};
    font-size: ${theme.fontSizes.lg};
    color: ${theme.colors.text.primary};
    margin-bottom: ${theme.spacing.lg};
    font-weight: 600;
  }
`;

const FooterDescription = styled.p`
  color: ${theme.colors.text.light};
  font-size: ${theme.fontSizes.sm};
  line-height: 1.7;
  margin-bottom: ${theme.spacing.md};
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`;

const FooterLink = styled.a`
  color: ${theme.colors.text.light};
  font-size: ${theme.fontSizes.sm};
  text-decoration: none;
  transition: all ${theme.transitions.fast};
  font-weight: 450;

  &:hover {
    color: ${theme.colors.accent.coral};
    padding-left: 4px;
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  padding-top: ${theme.spacing.lg};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.md}) {
    flex-direction: column;
    text-align: center;
  }
`;

const Copyright = styled.p`
  color: ${theme.colors.text.light};
  font-size: ${theme.fontSizes.sm};
  margin: 0;
`;

const LegalInfo = styled.p`
  color: ${theme.colors.text.light};
  font-size: ${theme.fontSizes.xs};
  margin: 0;
  opacity: 0.7;
`;

export const Footer: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    if (path.startsWith('#')) {
      const element = document.getElementById(path.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (path.startsWith('http') || path.startsWith('mailto') || path.startsWith('tel')) {
      window.open(path, path.startsWith('http') ? '_blank' : '_self');
    } else {
      navigate(path);
    }
  };

  return (
    <FooterContainer>
      <FooterContent>
        <FooterGrid>
          <FooterSection>
            <h4>Contes d'IA</h4>
            <FooterDescription>
              Creez des contes personnalises et magiques pour vos enfants grace a l'intelligence artificielle.
              Chaque histoire est unique et adaptee a votre petit lecteur.
            </FooterDescription>
          </FooterSection>

          <FooterSection>
            <h4>Navigation</h4>
            <FooterLinks>
              <FooterLink href="#" onClick={(e) => { e.preventDefault(); handleNavigation('/'); }}>Accueil</FooterLink>
              <FooterLink href="#" onClick={(e) => { e.preventDefault(); handleNavigation('/exemples'); }}>Exemples de contes</FooterLink>
              <FooterLink href="#" onClick={(e) => { e.preventDefault(); handleNavigation('/fonctionnalites'); }}>Fonctionnalites</FooterLink>
              <FooterLink href="#" onClick={(e) => { e.preventDefault(); handleNavigation('#tarifs'); }}>Nos tarifs</FooterLink>
              <FooterLink href="#" onClick={(e) => { e.preventDefault(); handleNavigation('/create-story'); }}>Creer un conte</FooterLink>
            </FooterLinks>
          </FooterSection>

          <FooterSection>
            <h4>Support</h4>
            <FooterLinks>
              <FooterLink href="#" onClick={(e) => { e.preventDefault(); handleNavigation('mailto:contact@contedia.fr'); }}>Nous contacter</FooterLink>
              <FooterLink href="#" onClick={(e) => { e.preventDefault(); handleNavigation('tel:+33780777110'); }}>Support telephonique</FooterLink>
            </FooterLinks>
          </FooterSection>

          <FooterSection>
            <h4>Legal</h4>
            <FooterLinks>
              <FooterLink href="#" onClick={(e) => { e.preventDefault(); handleNavigation('/mentions-legales'); }}>Mentions legales</FooterLink>
              <FooterLink href="#" onClick={(e) => { e.preventDefault(); handleNavigation('/politique-confidentialite'); }}>Politique de confidentialite</FooterLink>
            </FooterLinks>
          </FooterSection>
        </FooterGrid>

        <FooterBottom>
          <Copyright>&copy; 2025 Contes d'IA. Tous droits reserves.</Copyright>
          <LegalInfo>
            SIRET: 12345678901234 | TVA: FR12345678901 | contact@contedia.fr
          </LegalInfo>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
};

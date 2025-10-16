import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { theme } from '../../styles/theme';

const FooterContainer = styled.footer`
  background-color: ${theme.colors.background.secondary};
  border-top: none;
  margin-top: auto;
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
    margin-bottom: ${theme.spacing.md};
  }
`;

const FooterDescription = styled.p`
  color: ${theme.colors.text.light};
  font-size: ${theme.fontSizes.sm};
  line-height: 1.6;
  margin-bottom: ${theme.spacing.md};
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const FooterLink = styled.a`
  color: ${theme.colors.text.light};
  font-size: ${theme.fontSizes.sm};
  text-decoration: none;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${theme.colors.accent.coral};
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.md};
`;

const SocialIcon = styled.a`
  width: 40px;
  height: 40px;
  background-color: ${theme.colors.accent.coral};
  border-radius: ${theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.text.white};
  text-decoration: none;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${theme.colors.button.primaryHover};
    transform: translateY(-2px);
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid #E5E5E5;
  padding-top: ${theme.spacing.lg};
  text-align: center;
  color: ${theme.colors.text.light};
  font-size: ${theme.fontSizes.sm};
`;

export const Footer: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    if (path.startsWith('#')) {
      // Pour les ancres, on reste sur la même page et on scroll
      const element = document.getElementById(path.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (path.startsWith('http') || path.startsWith('mailto') || path.startsWith('tel')) {
      // Pour les liens externes, email et téléphone, on ouvre normalement
      window.open(path, path.startsWith('http') ? '_blank' : '_self');
    } else {
      // Pour les routes internes, on utilise navigate
      navigate(path);
    }
  };

  return (
    <FooterContainer>
      <FooterContent>
        <FooterGrid>
          <FooterSection>
            <h4>Contes d'IA ✨</h4>
            <FooterDescription>
              Créez des contes personnalisés et magiques pour vos enfants grâce à l'intelligence artificielle. 
              Chaque histoire est unique et adaptée à votre petit lecteur.
            </FooterDescription>
            <SocialLinks>
              <SocialIcon href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                📘
              </SocialIcon>
              <SocialIcon href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                📷
              </SocialIcon>
              <SocialIcon href="https://twitter.com" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                🐦
              </SocialIcon>
            </SocialLinks>
          </FooterSection>
          
          <FooterSection>
            <h4>Navigation</h4>
            <FooterLinks>
              <FooterLink href="#" onClick={(e) => { e.preventDefault(); handleNavigation('/'); }}>Accueil</FooterLink>
              <FooterLink href="#" onClick={(e) => { e.preventDefault(); handleNavigation('/exemples'); }}>Exemples de contes</FooterLink>
              <FooterLink href="#" onClick={(e) => { e.preventDefault(); handleNavigation('/fonctionnalites'); }}>Fonctionnalités</FooterLink>
              <FooterLink href="#" onClick={(e) => { e.preventDefault(); handleNavigation('#tarifs'); }}>Nos tarifs</FooterLink>
              <FooterLink href="#" onClick={(e) => { e.preventDefault(); handleNavigation('/create-story'); }}>Créer un conte</FooterLink>
            </FooterLinks>
          </FooterSection>
          
          <FooterSection>
            <h4>Support</h4>
            <FooterLinks>
              <FooterLink href="#" onClick={(e) => { e.preventDefault(); handleNavigation('mailto:contact@contedia.fr'); }}>Nous contacter</FooterLink>
              <FooterLink href="#" onClick={(e) => { e.preventDefault(); handleNavigation('#aide'); }}>Aide & FAQ</FooterLink>
              <FooterLink href="#" onClick={(e) => { e.preventDefault(); handleNavigation('tel:+33123456789'); }}>📞 Support téléphonique</FooterLink>
              <FooterLink href="#" onClick={(e) => { e.preventDefault(); handleNavigation('#livraison'); }}>Informations de livraison</FooterLink>
            </FooterLinks>
          </FooterSection>
          
          <FooterSection>
            <h4>Légal</h4>
            <FooterLinks>
              <FooterLink href="#" onClick={(e) => { e.preventDefault(); handleNavigation('/mentions-legales'); }}>Mentions légales</FooterLink>
              <FooterLink href="#" onClick={(e) => { e.preventDefault(); handleNavigation('/politique-confidentialite'); }}>Politique de confidentialité</FooterLink>
            </FooterLinks>
          </FooterSection>
        </FooterGrid>
        
        <FooterBottom>
          <p>&copy; 2025 Contes d'IA. Tous droits réservés. Fait avec ❤️ pour les enfants.</p>
          <p style={{ marginTop: '8px', fontSize: '12px', color: '#888' }}>
            SIRET: 12345678901234 | TVA: FR12345678901 | 
            <FooterLink href="#" onClick={(e) => { e.preventDefault(); handleNavigation('mailto:contact@contedia.fr'); }} style={{ color: 'inherit' }}>contact@contedia.fr</FooterLink>
          </p>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
};

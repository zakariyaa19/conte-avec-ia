import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';

const HeaderContainer = styled.header`
  background-color: ${theme.colors.background.white};
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: none;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding: 0 ${theme.spacing.md};
    height: 70px;
  }
`;

const Logo = styled.div`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['2xl']};
  font-weight: 700;
  color: ${theme.colors.accent.coral};
  cursor: pointer;
  
  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.fontSizes.lg};
  }
  
  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.base};
  }
`;

const Navigation = styled.nav`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.lg};
  
  @media (max-width: ${theme.breakpoints.lg}) {
    display: none;
  }
`;

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const NavItem = styled.div<{ $hasDropdown?: boolean }>`
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.base};
  font-weight: 500;
  color: ${theme.colors.text.secondary};
  cursor: pointer;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.sm};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    color: ${theme.colors.accent.coral};
    background-color: rgba(255, 107, 107, 0.1);
  }
  
  ${props => props.$hasDropdown && `
    &::after {
      content: '▼';
      font-size: 0.7rem;
      transition: transform 0.2s ease;
    }
    
    &:hover::after {
      transform: rotate(180deg);
    }
  `}
`;

const DropdownMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  background-color: ${theme.colors.background.white};
  min-width: 220px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.sm} 0;
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.$isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.3s ease;
  z-index: 1001;
`;

const DropdownItem = styled.div`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  color: ${theme.colors.text.secondary};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: ${theme.fontSizes.sm};
  
  &:hover {
    background-color: rgba(255, 107, 107, 0.1);
    color: ${theme.colors.accent.coral};
  }
`;

const MobileMenu = styled.div<{ $isOpen: boolean }>`
  display: none;
  
  @media (max-width: ${theme.breakpoints.lg}) {
    display: ${props => props.$isOpen ? 'block' : 'none'};
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    background-color: ${theme.colors.background.white};
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    z-index: 999;
    max-height: calc(100vh - 70px);
    overflow-y: auto;
  }
`;

const MobileSection = styled.div`
  padding: ${theme.spacing.md};
  border-bottom: 1px solid #eee;
`;

const MobileSectionTitle = styled.div`
  font-weight: 600;
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.sm};
  font-size: ${theme.fontSizes.base};
`;

const MobileItem = styled.div`
  padding: ${theme.spacing.sm} 0;
  color: ${theme.colors.text.secondary};
  cursor: pointer;
  font-size: ${theme.fontSizes.sm};
  
  &:hover {
    color: ${theme.colors.accent.coral};
  }
`;

const CTASection = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  
  @media (max-width: ${theme.breakpoints.md}) {
    gap: ${theme.spacing.sm};
  }
  
  @media (max-width: ${theme.breakpoints.sm}) {
    gap: ${theme.spacing.xs};
  }
  
  .desktop-text {
    display: inline;
    
    @media (max-width: ${theme.breakpoints.md}) {
      display: none;
    }
  }
  
  .mobile-text {
    display: none;
    
    @media (max-width: ${theme.breakpoints.md}) {
      display: inline;
    }
  }
  
  button {
    @media (max-width: ${theme.breakpoints.md}) {
      font-size: 0.9rem;
      padding: 0.6rem 0.8rem;
    }
    
    @media (max-width: ${theme.breakpoints.sm}) {
      font-size: 0.85rem;
      padding: 0.5rem 0.7rem;
    }
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${theme.colors.text.primary};
  padding: ${theme.spacing.sm};
  
  @media (max-width: ${theme.breakpoints.lg}) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;


export const Header: React.FC = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    navigate('/');
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    navigate('/');
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
  };

  const handleDropdownToggle = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo onClick={handleLogoClick}>
          Contes d'IA ✨
        </Logo>
        
        <Navigation>
          <NavItem onClick={() => handleNavigation('/')}>
            Accueil
          </NavItem>
          
          <NavItem onClick={() => handleNavigation('/exemples')}>
            Exemples
          </NavItem>
          
          <DropdownContainer>
            <NavItem 
              $hasDropdown 
              onClick={() => handleDropdownToggle('nos-contes')}
            >
              Nos contes
            </NavItem>
            <DropdownMenu $isOpen={activeDropdown === 'nos-contes'}>
              <DropdownItem onClick={() => handleNavigation('/themes-de-contes')}>
                Thèmes de contes
              </DropdownItem>
              <DropdownItem onClick={() => handleNavigation('/contes-par-age')}>
                Contes par âge
              </DropdownItem>
              <DropdownItem onClick={() => handleNavigation('/styles-illustration')}>
                Styles d'illustration
              </DropdownItem>
            </DropdownMenu>
          </DropdownContainer>
          
          <DropdownContainer>
            <NavItem 
              $hasDropdown 
              onClick={() => handleDropdownToggle('decouvrir')}
            >
              Découvrir
            </NavItem>
            <DropdownMenu $isOpen={activeDropdown === 'decouvrir'}>
              <DropdownItem onClick={() => handleNavigation('/contes-multilingues')}>
                Contes multilingues
              </DropdownItem>
              <DropdownItem onClick={() => handleNavigation('/valeurs-educatives')}>
                Valeurs éducatives
              </DropdownItem>
              <DropdownItem onClick={() => handleNavigation('/idees-cadeaux')}>
                Idées cadeaux
              </DropdownItem>
              <DropdownItem onClick={() => handleNavigation('/ia-creation-conte')}>
                Comment fonctionne l'IA ?
              </DropdownItem>
            </DropdownMenu>
          </DropdownContainer>
          
          <DropdownContainer>
            <NavItem 
              $hasDropdown 
              onClick={() => handleDropdownToggle('aide')}
            >
              Aide & Infos
            </NavItem>
            <DropdownMenu $isOpen={activeDropdown === 'aide'}>
              <DropdownItem onClick={() => handleNavigation('/fonctionnalites')}>
                Fonctionnalités
              </DropdownItem>
              <DropdownItem onClick={() => handleNavigation('/blog')}>
                Blog
              </DropdownItem>
            </DropdownMenu>
          </DropdownContainer>
        </Navigation>
        
        <MobileMenu $isOpen={isMobileMenuOpen}>
          <MobileSection>
            <MobileItem onClick={() => handleNavigation('/')}>Accueil</MobileItem>
            <MobileItem onClick={() => handleNavigation('/exemples')}>Exemples</MobileItem>
          </MobileSection>
          
          <MobileSection>
            <MobileSectionTitle>Nos contes</MobileSectionTitle>
            <MobileItem onClick={() => handleNavigation('/themes-de-contes')}>Thèmes de contes</MobileItem>
            <MobileItem onClick={() => handleNavigation('/contes-par-age')}>Contes par âge</MobileItem>
            <MobileItem onClick={() => handleNavigation('/styles-illustration')}>Styles d'illustration</MobileItem>
          </MobileSection>
          
          <MobileSection>
            <MobileSectionTitle>Découvrir</MobileSectionTitle>
            <MobileItem onClick={() => handleNavigation('/contes-multilingues')}>Contes multilingues</MobileItem>
            <MobileItem onClick={() => handleNavigation('/valeurs-educatives')}>Valeurs éducatives</MobileItem>
            <MobileItem onClick={() => handleNavigation('/idees-cadeaux')}>Idées cadeaux</MobileItem>
            <MobileItem onClick={() => handleNavigation('/ia-creation-conte')}>Comment fonctionne l'IA ?</MobileItem>
          </MobileSection>
          
          <MobileSection>
            <MobileSectionTitle>Aide & Infos</MobileSectionTitle>
            <MobileItem onClick={() => handleNavigation('/fonctionnalites')}>Fonctionnalités</MobileItem>
            <MobileItem onClick={() => handleNavigation('/blog')}>Blog</MobileItem>
          </MobileSection>
        </MobileMenu>
        
        <CTASection>
          <Button 
            variant="primary" 
            size="md" 
            onClick={() => handleNavigation('/story-form')}
          >
            <span className="desktop-text">📚 Créer un livre</span>
            <span className="mobile-text">Créer un livre</span>
          </Button>
          <MobileMenuButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? '✕' : '☰'}
          </MobileMenuButton>
        </CTASection>
      </HeaderContent>
    </HeaderContainer>
  );
};

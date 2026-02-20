import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { Button } from '../ui/Button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const HeaderContainer = styled.header<{ $scrolled: boolean }>`
  background-color: ${props => props.$scrolled ? 'rgba(255, 255, 255, 0.72)' : theme.colors.background.white};
  backdrop-filter: ${props => props.$scrolled ? 'blur(24px) saturate(200%)' : 'none'};
  -webkit-backdrop-filter: ${props => props.$scrolled ? 'blur(24px) saturate(200%)' : 'none'};
  box-shadow: ${props => props.$scrolled ? '0 1px 0 rgba(0, 0, 0, 0.08), 0 4px 20px rgba(0, 0, 0, 0.04)' : 'none'};
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: background-color 0.35s ease, backdrop-filter 0.35s ease, box-shadow 0.35s ease;
  border-bottom: 1px solid ${props => props.$scrolled ? 'rgba(0, 0, 0, 0.06)' : 'rgba(0,0,0,0.04)'};

  @media (max-width: ${theme.breakpoints.lg}) {
    position: relative;
  }
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;

  @media (max-width: ${theme.breakpoints.md}) {
    padding: 0 ${theme.spacing.md};
    height: 64px;
  }
`;

const Logo = styled.div`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['2xl']};
  font-weight: 700;
  color: ${theme.colors.accent.coral};
  cursor: pointer;
  transition: all ${theme.transitions.base};
  user-select: none;

  &:hover {
    opacity: 0.85;
    transform: scale(1.02);
  }

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.fontSizes.xl};
  }
`;

const Navigation = styled.nav`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};

  @media (max-width: ${theme.breakpoints.lg}) {
    display: none;
  }
`;

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const NavItem = styled.div<{ $hasDropdown?: boolean; $active?: boolean }>`
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${props => props.$active ? 600 : 500};
  color: ${props => props.$active ? theme.colors.accent.coral : theme.colors.text.secondary};
  cursor: pointer;
  padding: 0.5rem 0.875rem;
  border-radius: ${theme.borderRadius.lg};
  transition: all ${theme.transitions.base};
  display: flex;
  align-items: center;
  gap: 0.375rem;

  &:hover {
    color: ${theme.colors.accent.coral};
    background-color: rgba(255, 153, 153, 0.06);
  }

  ${props => props.$hasDropdown && `
    &::after {
      content: '';
      width: 0;
      height: 0;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 4px solid currentColor;
      transition: transform ${theme.transitions.base};
    }

    &:hover::after {
      transform: rotate(180deg);
    }
  `}
`;

const DropdownMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 4px);
  left: 50%;
  transform: translateX(-50%);
  background-color: ${theme.colors.background.white};
  min-width: 260px;
  box-shadow: ${theme.shadows.lg};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.sm};
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.$isOpen ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(-8px)'};
  transition: all ${theme.transitions.smooth};
  z-index: 1001;
  border: 1px solid rgba(0, 0, 0, 0.04);
`;

const DropdownItem = styled.div`
  padding: 0.625rem ${theme.spacing.md};
  color: ${theme.colors.text.secondary};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  font-size: ${theme.fontSizes.sm};
  border-radius: ${theme.borderRadius.md};
  font-weight: 450;

  &:hover {
    background-color: rgba(255, 153, 153, 0.06);
    color: ${theme.colors.accent.coral};
  }
`;

const MobileOverlay = styled.div<{ $isOpen: boolean }>`
  display: none;

  @media (max-width: ${theme.breakpoints.lg}) {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    z-index: 998;
    opacity: ${props => props.$isOpen ? 1 : 0};
    visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
    transition: all ${theme.transitions.smooth};
  }
`;

const MobileMenu = styled.div<{ $isOpen: boolean }>`
  display: none;

  @media (max-width: ${theme.breakpoints.lg}) {
    display: block;
    position: fixed;
    top: 0;
    right: 0;
    width: min(85vw, 380px);
    height: 100vh;
    background-color: ${theme.colors.background.white};
    box-shadow: ${theme.shadows.xl};
    z-index: 999;
    transform: ${props => props.$isOpen ? 'translateX(0)' : 'translateX(100%)'};
    transition: transform ${theme.transitions.smooth};
    overflow-y: auto;
    padding: ${theme.spacing.xl} ${theme.spacing.lg};
    padding-top: calc(${theme.spacing.xl} + 60px);
  }
`;

const MobileCloseButton = styled.button`
  position: absolute;
  top: ${theme.spacing.lg};
  right: ${theme.spacing.lg};
  background: ${theme.colors.background.secondary};
  border: none;
  border-radius: ${theme.borderRadius.full};
  width: 40px;
  height: 40px;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.text.secondary};
  transition: all ${theme.transitions.base};

  &:hover {
    background: ${theme.colors.accent.lightCoral};
    color: ${theme.colors.text.primary};
  }
`;

const MobileSection = styled.div`
  padding: ${theme.spacing.md} 0;
  border-bottom: 1px solid rgba(0,0,0,0.05);

  &:last-child {
    border-bottom: none;
  }
`;

const MobileSectionTitle = styled.div`
  font-weight: 600;
  color: ${theme.colors.text.light};
  margin-bottom: ${theme.spacing.sm};
  font-size: ${theme.fontSizes.xs};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const MobileItem = styled.div`
  padding: 0.625rem 0;
  color: ${theme.colors.text.secondary};
  cursor: pointer;
  font-size: ${theme.fontSizes.base};
  font-weight: 500;
  transition: color ${theme.transitions.fast};

  &:hover {
    color: ${theme.colors.accent.coral};
  }
`;

const CTASection = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};

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
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  color: ${theme.colors.text.primary};
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.md};
  transition: all ${theme.transitions.fast};

  &:hover {
    background: rgba(0,0,0,0.04);
  }

  @media (max-width: ${theme.breakpoints.lg}) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const UserMenuContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  background: none;
  border: 2px solid ${theme.colors.accent.coral}30;
  border-radius: ${theme.borderRadius.full};
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
  color: ${theme.colors.text.primary};
  cursor: pointer;
  transition: all ${theme.transitions.base};

  &:hover {
    border-color: ${theme.colors.accent.coral};
    background: rgba(255, 153, 153, 0.06);
  }
`;

const ClubBadge = styled.span`
  background: linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.button.primaryHover});
  color: white;
  font-size: ${theme.fontSizes.xs};
  font-weight: 700;
  padding: 2px ${theme.spacing.xs};
  border-radius: ${theme.borderRadius.full};
`;

const UserDropdownMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background-color: ${theme.colors.background.white};
  min-width: 200px;
  box-shadow: ${theme.shadows.lg};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.sm};
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.$isOpen ? 'translateY(0)' : 'translateY(-8px)'};
  transition: all ${theme.transitions.smooth};
  z-index: 1001;
  border: 1px solid rgba(0, 0, 0, 0.04);
`;

const UserDropdownItem = styled.div<{ $danger?: boolean }>`
  padding: 0.625rem ${theme.spacing.md};
  color: ${props => props.$danger ? theme.colors.status.error : theme.colors.text.secondary};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  font-size: ${theme.fontSizes.sm};
  border-radius: ${theme.borderRadius.md};
  font-weight: 450;

  &:hover {
    background-color: ${props => props.$danger ? 'rgba(229, 62, 62, 0.06)' : 'rgba(255, 153, 153, 0.06)'};
    color: ${props => props.$danger ? theme.colors.status.error : theme.colors.accent.coral};
  }
`;

const UserDropdownDivider = styled.div`
  height: 1px;
  background: rgba(0, 0, 0, 0.06);
  margin: ${theme.spacing.xs} 0;
`;

const HamburgerIcon = styled.div<{ $isOpen: boolean }>`
  width: 22px;
  height: 16px;
  position: relative;

  span {
    display: block;
    position: absolute;
    height: 2px;
    width: 100%;
    background: ${theme.colors.text.primary};
    border-radius: 2px;
    transition: all ${theme.transitions.base};

    &:nth-child(1) {
      top: ${props => props.$isOpen ? '7px' : '0'};
      transform: ${props => props.$isOpen ? 'rotate(45deg)' : 'none'};
    }

    &:nth-child(2) {
      top: 7px;
      opacity: ${props => props.$isOpen ? 0 : 1};
    }

    &:nth-child(3) {
      top: ${props => props.$isOpen ? '7px' : '14px'};
      transform: ${props => props.$isOpen ? 'rotate(-45deg)' : 'none'};
    }
  }
`;


export const Header: React.FC = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const headerRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, isClub, user, logout } = useAuth();

  const currentPath = location.pathname;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

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
    <>
      <HeaderContainer $scrolled={isScrolled} ref={headerRef}>
        <HeaderContent>
          <Logo onClick={handleLogoClick}>
            Contes d'IA
          </Logo>

          <Navigation>
            <NavItem $active={currentPath === '/'} onClick={() => handleNavigation('/')}>
              Accueil
            </NavItem>

            <NavItem $active={currentPath === '/exemples'} onClick={() => handleNavigation('/exemples')}>
              Exemples
            </NavItem>

            <NavItem $active={currentPath === '/club'} onClick={() => handleNavigation('/club')}>
              Club
            </NavItem>

            <DropdownContainer>
              <NavItem
                $hasDropdown
                onClick={() => handleDropdownToggle('decouvrir')}
              >
                Decouvrir
              </NavItem>
              <DropdownMenu $isOpen={activeDropdown === 'decouvrir'}>
                <DropdownItem onClick={() => handleNavigation('/contes-multilingues')}>
                  Contes multilingues
                </DropdownItem>
                <DropdownItem onClick={() => handleNavigation('/valeurs-educatives')}>
                  Valeurs educatives
                </DropdownItem>
                <DropdownItem onClick={() => handleNavigation('/idees-cadeaux')}>
                  Idees cadeaux
                </DropdownItem>
                <DropdownItem onClick={() => handleNavigation('/ia-creation-conte')}>
                  Comment fonctionne l'IA ?
                </DropdownItem>
                <DropdownItem onClick={() => handleNavigation('/themes-de-contes')}>
                  Themes de contes
                </DropdownItem>
                <DropdownItem onClick={() => handleNavigation('/contes-par-age')}>
                  Contes par age
                </DropdownItem>
                <DropdownItem onClick={() => handleNavigation('/styles-illustration')}>
                  Styles d'illustration
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
                  Fonctionnalites
                </DropdownItem>
                <DropdownItem onClick={() => handleNavigation('/blog')}>
                  Blog
                </DropdownItem>
              </DropdownMenu>
            </DropdownContainer>
          </Navigation>

          <CTASection>
            {isAuthenticated ? (
              <>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleNavigation('/create-story')}
                >
                  <span className="desktop-text">Creer un livre</span>
                  <span className="mobile-text">Creer</span>
                </Button>
                <UserMenuContainer>
                  <UserButton onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                    {isClub && <ClubBadge>Club</ClubBadge>}
                    {user?.firstName || user?.email?.split('@')[0] || 'Mon compte'}
                  </UserButton>
                  <UserDropdownMenu $isOpen={isUserMenuOpen}>
                    <UserDropdownItem onClick={() => { setIsUserMenuOpen(false); handleNavigation('/dashboard'); }}>
                      Ma bibliotheque
                    </UserDropdownItem>
                    <UserDropdownItem onClick={() => { setIsUserMenuOpen(false); handleNavigation('/dashboard/account'); }}>
                      Modifier mon compte
                    </UserDropdownItem>
                    <UserDropdownDivider />
                    <UserDropdownItem $danger onClick={() => { setIsUserMenuOpen(false); logout(); handleNavigation('/'); }}>
                      Deconnexion
                    </UserDropdownItem>
                  </UserDropdownMenu>
                </UserMenuContainer>
              </>
            ) : (
              <>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleNavigation('/story-form')}
                >
                  <span className="desktop-text">Creer un livre</span>
                  <span className="mobile-text">Creer</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavigation('/login')}
                >
                  Connexion
                </Button>
              </>
            )}
            <MobileMenuButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <HamburgerIcon $isOpen={isMobileMenuOpen}>
                <span />
                <span />
                <span />
              </HamburgerIcon>
            </MobileMenuButton>
          </CTASection>
        </HeaderContent>
      </HeaderContainer>

      <MobileOverlay $isOpen={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen(false)} />
      <MobileMenu $isOpen={isMobileMenuOpen}>
        <MobileCloseButton onClick={() => setIsMobileMenuOpen(false)}>
          ✕
        </MobileCloseButton>

        <MobileSection>
          <MobileItem onClick={() => handleNavigation('/')} style={currentPath === '/' ? { color: theme.colors.accent.coral, fontWeight: 600 } : undefined}>Accueil</MobileItem>
          <MobileItem onClick={() => handleNavigation('/exemples')} style={currentPath === '/exemples' ? { color: theme.colors.accent.coral, fontWeight: 600 } : undefined}>Exemples</MobileItem>
          <MobileItem onClick={() => handleNavigation('/club')} style={currentPath === '/club' ? { color: theme.colors.accent.coral, fontWeight: 600 } : undefined}>Club</MobileItem>
        </MobileSection>

        <MobileSection>
          <MobileSectionTitle>Decouvrir</MobileSectionTitle>
          <MobileItem onClick={() => handleNavigation('/contes-multilingues')}>Contes multilingues</MobileItem>
          <MobileItem onClick={() => handleNavigation('/valeurs-educatives')}>Valeurs educatives</MobileItem>
          <MobileItem onClick={() => handleNavigation('/idees-cadeaux')}>Idees cadeaux</MobileItem>
          <MobileItem onClick={() => handleNavigation('/ia-creation-conte')}>Comment fonctionne l'IA ?</MobileItem>
          <MobileItem onClick={() => handleNavigation('/themes-de-contes')}>Themes de contes</MobileItem>
          <MobileItem onClick={() => handleNavigation('/contes-par-age')}>Contes par age</MobileItem>
          <MobileItem onClick={() => handleNavigation('/styles-illustration')}>Styles d'illustration</MobileItem>
        </MobileSection>

        <MobileSection>
          <MobileSectionTitle>Aide & Infos</MobileSectionTitle>
          <MobileItem onClick={() => handleNavigation('/fonctionnalites')}>Fonctionnalites</MobileItem>
          <MobileItem onClick={() => handleNavigation('/blog')}>Blog</MobileItem>
        </MobileSection>

        {isAuthenticated && (
          <MobileSection>
            <MobileSectionTitle>Mon compte</MobileSectionTitle>
            <MobileItem onClick={() => handleNavigation('/dashboard')}>Ma bibliotheque</MobileItem>
            <MobileItem onClick={() => handleNavigation('/dashboard/account')}>Modifier mon compte</MobileItem>
            <MobileItem onClick={() => { logout(); handleNavigation('/'); }}>Deconnexion</MobileItem>
          </MobileSection>
        )}

        <div style={{ marginTop: theme.spacing.xl }}>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => handleNavigation('/create-story')}
          >
            Creer un livre
          </Button>
          {!isAuthenticated && (
            <Button
              variant="ghost"
              size="lg"
              fullWidth
              onClick={() => handleNavigation('/login')}
              style={{ marginTop: theme.spacing.sm }}
            >
              Connexion
            </Button>
          )}
        </div>
      </MobileMenu>
    </>
  );
};

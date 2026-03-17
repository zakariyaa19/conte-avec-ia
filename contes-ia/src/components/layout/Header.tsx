import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../../styles/theme';
import { Button } from '../ui/Button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

/* ─── Animations ─── */
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* ─── Glass Bar ─── */
const HeaderContainer = styled.header<{ $scrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 52px;
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  background: var(--header-glass);
  border-bottom: 0.5px solid var(--border-color);
  transition: box-shadow 0.3s ease;
  box-shadow: ${p => p.$scrolled
    ? '0 0.5px 0 var(--border-color), 0 4px 24px rgba(0,0,0,0.08)'
    : '0 0.5px 0 var(--border-color)'};

  @media (max-width: ${theme.breakpoints.md}) {
    height: 48px;
  }
`;

/* Spacer to offset fixed header height */
const HeaderSpacer = styled.div`
  height: 52px;
  @media (max-width: ${theme.breakpoints.md}) {
    height: 48px;
  }
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  height: 100%;
  gap: 8px;

  @media (max-width: ${theme.breakpoints.md}) {
    padding: 0 12px;
  }
`;

/* ─── Logo ─── */
const Logo = styled.div`
  font-family: ${theme.fonts.heading};
  font-size: 1.25rem;
  font-weight: 700;
  color: ${theme.colors.accent.coral};
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  flex-shrink: 0;
  transition: opacity 0.2s;

  &:hover { opacity: 0.8; }

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: 1.05rem;
  }
`;

/* ─── Desktop Nav ─── */
const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 2px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: ${theme.breakpoints.lg}) {
    display: none;
  }
`;

const NavPill = styled.button<{ $active?: boolean }>`
  all: unset;
  font-family: ${theme.fonts.body};
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${p => p.$active ? theme.colors.accent.coral : 'var(--text-secondary)'};
  padding: 6px 14px;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  position: relative;
  background: ${p => p.$active ? 'var(--hover-bg)' : 'transparent'};

  &:hover {
    color: ${theme.colors.accent.coral};
    background: var(--hover-bg);
  }
`;

const NavPillDropdown = styled(NavPill)`
  display: inline-flex;
  align-items: center;
  gap: 4px;

  &::after {
    content: '';
    width: 0; height: 0;
    border-left: 3.5px solid transparent;
    border-right: 3.5px solid transparent;
    border-top: 3.5px solid currentColor;
    opacity: 0.5;
    transition: transform 0.2s;
  }
`;

/* ─── Dropdown (glass) ─── */
const DropdownContainer = styled.div`
  position: relative;
`;

const DropdownPanel = styled.div<{ $open: boolean }>`
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  min-width: 220px;
  padding: 6px;
  border-radius: 14px;
  background: var(--bg-elevated);
  backdrop-filter: blur(40px) saturate(200%);
  -webkit-backdrop-filter: blur(40px) saturate(200%);
  border: 0.5px solid var(--border-color);
  box-shadow: 0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06);
  opacity: ${p => p.$open ? 1 : 0};
  visibility: ${p => p.$open ? 'visible' : 'hidden'};
  pointer-events: ${p => p.$open ? 'auto' : 'none'};
  transition: opacity 0.18s ease, visibility 0.18s ease;
  z-index: 1001;
  animation: ${p => p.$open ? fadeIn : 'none'} 0.18s ease;
`;

const DropdownItem = styled.button`
  all: unset;
  display: block;
  width: 100%;
  padding: 8px 12px;
  font-size: 0.8125rem;
  font-weight: 450;
  color: var(--text-secondary);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s ease;
  box-sizing: border-box;

  &:hover {
    background: var(--hover-bg);
    color: ${theme.colors.accent.coral};
  }
`;

const DesktopOnly = styled.div`
  display: contents;
  @media (max-width: ${theme.breakpoints.lg}) {
    display: none;
  }
`;

const MobileOnly = styled.div`
  display: none;
  @media (max-width: ${theme.breakpoints.lg}) {
    display: contents;
  }
`;

/* ─── Right Section ─── */
const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  margin-left: auto;

  @media (max-width: ${theme.breakpoints.lg}) {
    margin-left: auto;
  }
`;

const IconBtn = styled.button`
  all: unset;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  color: var(--text-secondary);
  transition: all 0.2s ease;

  &:hover {
    background: var(--hover-bg);
    color: ${theme.colors.accent.coral};
  }

  svg { width: 17px; height: 17px; }
`;

/* ─── User Menu ─── */
const userChipBase = `
  all: unset;
  display: flex;
  align-items: center;
  gap: 6px;
  border-radius: 9999px;
  font-weight: 600;
  color: var(--text-primary);
  background: var(--hover-bg);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  &:hover { background: rgba(255,153,153,0.15); }
`;

/* Desktop: full chip with name, hidden on mobile */
const UserChipDesktop = styled.button`
  ${userChipBase}
  padding: 4px 12px 4px 8px;
  font-size: 0.8125rem;
  @media (max-width: ${theme.breakpoints.lg}) { display: none; }
`;

/* Mobile: compact chip, hidden on desktop */
const UserChipMobile = styled.button`
  ${userChipBase}
  padding: 4px 10px 4px 6px;
  font-size: 12px;
  display: none;
  @media (max-width: ${theme.breakpoints.lg}) { display: flex; }
`;

/* Desktop-only dropdown */
const UserDropdownDesktop = styled.div<{ $open: boolean }>`
  @media (max-width: ${theme.breakpoints.lg}) { display: none !important; }
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 180px;
  padding: 6px;
  border-radius: 14px;
  background: var(--bg-elevated);
  backdrop-filter: blur(40px) saturate(200%);
  -webkit-backdrop-filter: blur(40px) saturate(200%);
  border: 0.5px solid var(--border-color);
  box-shadow: 0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06);
  opacity: ${p => p.$open ? 1 : 0};
  visibility: ${p => p.$open ? 'visible' : 'hidden'};
  pointer-events: ${p => p.$open ? 'auto' : 'none'};
  transition: opacity 0.18s ease, visibility 0.18s ease;
  z-index: 1001;
  animation: ${p => p.$open ? fadeIn : 'none'} 0.18s ease;
`;

/* Connexion: desktop text, mobile icon */
const ConnexionDesktop = styled(NavPill)`
  font-size: 0.8125rem;
  @media (max-width: ${theme.breakpoints.lg}) { display: none; }
`;

const ConnexionMobile = styled(IconBtn)`
  display: none;
  @media (max-width: ${theme.breakpoints.lg}) { display: flex; }
`;

const UserAvatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 9999px;
  background: linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.button.primaryHover});
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.6875rem;
  font-weight: 700;
`;

const ClubBadge = styled.span`
  background: linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.button.primaryHover});
  color: white;
  font-size: 0.625rem;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 9999px;
  letter-spacing: 0.02em;
`;

/* UserDropdown removed — replaced by UserDropdownDesktop above */

const UserDropdownItem = styled.button<{ $danger?: boolean }>`
  all: unset;
  display: block;
  width: 100%;
  padding: 8px 12px;
  font-size: 0.8125rem;
  font-weight: 450;
  color: ${p => p.$danger ? theme.colors.status.error : 'var(--text-secondary)'};
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s ease;
  box-sizing: border-box;

  &:hover {
    background: ${p => p.$danger ? 'rgba(229,62,62,0.08)' : 'var(--hover-bg)'};
    color: ${p => p.$danger ? theme.colors.status.error : theme.colors.accent.coral};
  }
`;

const Divider = styled.div`
  height: 0.5px;
  background: var(--border-color);
  margin: 4px 8px;
`;

/* ─── Burger (mobile) ─── */
const BurgerBtn = styled.button`
  all: unset;
  display: none;
  cursor: pointer;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  color: var(--text-primary);
  transition: background 0.2s;

  &:hover { background: var(--hover-bg); }

  @media (max-width: ${theme.breakpoints.lg}) {
    display: flex;
  }
`;

const BurgerLines = styled.div<{ $open: boolean }>`
  width: 18px; height: 14px; position: relative;

  span {
    display: block; position: absolute;
    height: 1.5px; width: 100%;
    background: currentColor; border-radius: 2px;
    transition: all 0.25s cubic-bezier(0.4,0,0.2,1);

    &:nth-child(1) {
      top: ${p => p.$open ? '6px' : '0'};
      transform: ${p => p.$open ? 'rotate(45deg)' : 'none'};
    }
    &:nth-child(2) {
      top: 6px;
      opacity: ${p => p.$open ? 0 : 1};
    }
    &:nth-child(3) {
      top: ${p => p.$open ? '6px' : '12px'};
      transform: ${p => p.$open ? 'rotate(-45deg)' : 'none'};
    }
  }
`;

/* ─── Mobile Drawer ─── */
const Overlay = styled.div<{ $open: boolean }>`
  display: none;
  @media (max-width: ${theme.breakpoints.lg}) {
    display: block;
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.25);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    z-index: 998;
    opacity: ${p => p.$open ? 1 : 0};
    visibility: ${p => p.$open ? 'visible' : 'hidden'};
    transition: all 0.3s ease;
  }
`;

const Drawer = styled.div<{ $open: boolean }>`
  display: none;
  @media (max-width: ${theme.breakpoints.lg}) {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0; right: 0;
    width: min(85vw, 360px);
    height: 100dvh;
    background: var(--bg-card);
    backdrop-filter: blur(40px) saturate(180%);
    -webkit-backdrop-filter: blur(40px) saturate(180%);
    z-index: 999;
    transform: ${p => p.$open ? 'translateX(0)' : 'translateX(100%)'};
    transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding: 72px 24px 32px;
  }
`;

const DrawerClose = styled.button`
  all: unset;
  position: absolute;
  top: 16px; right: 16px;
  width: 36px; height: 36px;
  border-radius: 9999px;
  background: var(--bg-secondary);
  display: flex; align-items: center; justify-content: center;
  color: var(--text-secondary);
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${theme.colors.accent.lightCoral};
    color: var(--text-primary);
  }
`;

const DrawerSection = styled.div`
  padding: 12px 0;
  border-bottom: 0.5px solid var(--border-color);
  &:last-child { border-bottom: none; }
`;

const DrawerLabel = styled.div`
  font-weight: 600;
  color: var(--text-light);
  margin-bottom: 4px;
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const DrawerItem = styled.button<{ $active?: boolean }>`
  all: unset;
  display: block;
  width: 100%;
  padding: 10px 0;
  color: ${p => p.$active ? theme.colors.accent.coral : 'var(--text-secondary)'};
  font-weight: ${p => p.$active ? 600 : 500};
  font-size: 0.9375rem;
  cursor: pointer;
  transition: color 0.15s;
  box-sizing: border-box;

  &:hover { color: ${theme.colors.accent.coral}; }
`;


/* ═══════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════ */

export const Header: React.FC = () => {
  const [dropdown, setDropdown] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const headerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, isClub, user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const path = location.pathname;

  // Scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  // Close dropdowns on click outside
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdown(null);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenu(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const go = (to: string) => {
    navigate(to);
    setDropdown(null);
    setDrawerOpen(false);
    setUserMenu(false);
  };

  const initials = (user?.firstName?.[0] || user?.email?.[0] || 'U').toUpperCase();

  return (
    <>
      <HeaderSpacer />
      <HeaderContainer $scrolled={scrolled} ref={headerRef}>
        <HeaderContent>
          {/* Logo */}
          <Logo onClick={() => go('/')}>Contes d'IA</Logo>

          {/* Desktop Nav — centré */}
          <Nav>
            <NavPill $active={path === '/'} onClick={() => go('/')}>Accueil</NavPill>
            <NavPill $active={path === '/exemples'} onClick={() => go('/exemples')}>Exemples</NavPill>
            <NavPill $active={path === '/club'} onClick={() => go('/club')}>Club</NavPill>

            <DropdownContainer ref={dropdownRef}>
              <NavPillDropdown
                $active={['/contes-multilingues','/valeurs-educatives','/idees-cadeaux','/ia-creation-conte','/themes-de-contes','/contes-par-age','/styles-illustration'].includes(path)}
                onClick={() => setDropdown(dropdown === 'd' ? null : 'd')}
              >
                Decouvrir
              </NavPillDropdown>
              <DropdownPanel $open={dropdown === 'd'}>
                <DropdownItem onClick={() => go('/themes-de-contes')}>Themes de contes</DropdownItem>
                <DropdownItem onClick={() => go('/contes-par-age')}>Contes par age</DropdownItem>
                <DropdownItem onClick={() => go('/styles-illustration')}>Styles d'illustration</DropdownItem>
                <DropdownItem onClick={() => go('/contes-multilingues')}>Contes multilingues</DropdownItem>
                <DropdownItem onClick={() => go('/valeurs-educatives')}>Valeurs educatives</DropdownItem>
                <DropdownItem onClick={() => go('/idees-cadeaux')}>Idees cadeaux</DropdownItem>
                <DropdownItem onClick={() => go('/ia-creation-conte')}>Comment fonctionne l'IA ?</DropdownItem>
              </DropdownPanel>
            </DropdownContainer>

            <NavPill $active={path === '/blog'} onClick={() => go('/blog')}>Blog</NavPill>
          </Nav>

          {/* Right */}
          <RightSection>
            {/* Theme toggle */}
            <IconBtn onClick={toggleTheme} aria-label={isDark ? 'Mode jour' : 'Mode nuit'}>
              {isDark ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </IconBtn>

            {/* CTA */}
            <Button variant="primary" size="sm" onClick={() => go(isAuthenticated ? '/create-story' : '/story-form')}
              style={{ fontSize: '0.8125rem', padding: '6px 16px', borderRadius: '9999px', height: '32px' }}>
              Creer
            </Button>

            {/* User / Connexion */}
            {isAuthenticated ? (
              <div style={{ position: 'relative' }} ref={userMenuRef}>
                {/* Desktop: full chip with dropdown */}
                <UserChipDesktop onClick={() => setUserMenu(!userMenu)}>
                  <UserAvatar>{initials}</UserAvatar>
                  {isClub && <ClubBadge>Club</ClubBadge>}
                  {user?.firstName || user?.email?.split('@')[0] || 'Compte'}
                </UserChipDesktop>
                {/* Mobile: compact chip → dashboard direct */}
                <UserChipMobile onClick={() => go('/dashboard')}>
                  <UserAvatar style={{ width: '24px', height: '24px', fontSize: '11px' }}>{initials}</UserAvatar>
                  {user?.firstName || 'Compte'}
                </UserChipMobile>
                <UserDropdownDesktop $open={userMenu}>
                  <UserDropdownItem onClick={() => go('/dashboard')}>Ma bibliotheque</UserDropdownItem>
                  <UserDropdownItem onClick={() => go('/dashboard/account')}>Mon compte</UserDropdownItem>
                  <Divider />
                  <UserDropdownItem $danger onClick={() => { logout(); go('/'); }}>Deconnexion</UserDropdownItem>
                </UserDropdownDesktop>
              </div>
            ) : (
              <>
                {/* Desktop: text link */}
                <ConnexionDesktop onClick={() => go('/login')}>Connexion</ConnexionDesktop>
                {/* Mobile: icon */}
                <ConnexionMobile onClick={() => go('/login')} aria-label="Connexion">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </ConnexionMobile>
              </>
            )}

            {/* Burger */}
            <BurgerBtn onClick={() => setDrawerOpen(!drawerOpen)}>
              <BurgerLines $open={drawerOpen}>
                <span /><span /><span />
              </BurgerLines>
            </BurgerBtn>
          </RightSection>
        </HeaderContent>
      </HeaderContainer>

      {/* ─── Mobile Drawer ─── */}
      <Overlay $open={drawerOpen} onClick={() => setDrawerOpen(false)} />
      <Drawer $open={drawerOpen}>
        <DrawerClose onClick={() => setDrawerOpen(false)}>✕</DrawerClose>

        <DrawerSection>
          <DrawerItem $active={path === '/'} onClick={() => go('/')}>Accueil</DrawerItem>
          <DrawerItem $active={path === '/exemples'} onClick={() => go('/exemples')}>Exemples</DrawerItem>
          <DrawerItem $active={path === '/club'} onClick={() => go('/club')}>Club</DrawerItem>
          <DrawerItem $active={path === '/blog'} onClick={() => go('/blog')}>Blog</DrawerItem>
        </DrawerSection>

        <DrawerSection>
          <DrawerLabel>Decouvrir</DrawerLabel>
          <DrawerItem onClick={() => go('/themes-de-contes')}>Themes de contes</DrawerItem>
          <DrawerItem onClick={() => go('/contes-par-age')}>Contes par age</DrawerItem>
          <DrawerItem onClick={() => go('/styles-illustration')}>Styles d'illustration</DrawerItem>
          <DrawerItem onClick={() => go('/contes-multilingues')}>Contes multilingues</DrawerItem>
          <DrawerItem onClick={() => go('/valeurs-educatives')}>Valeurs educatives</DrawerItem>
          <DrawerItem onClick={() => go('/idees-cadeaux')}>Idees cadeaux</DrawerItem>
          <DrawerItem onClick={() => go('/ia-creation-conte')}>IA & creation</DrawerItem>
        </DrawerSection>

        {isAuthenticated && (
          <DrawerSection>
            <DrawerLabel>Mon compte</DrawerLabel>
            <DrawerItem onClick={() => go('/dashboard')}>Ma bibliotheque</DrawerItem>
            <DrawerItem onClick={() => go('/dashboard/account')}>Parametres</DrawerItem>
            <DrawerItem onClick={() => { logout(); go('/'); }}>Deconnexion</DrawerItem>
          </DrawerSection>
        )}

        <div style={{ marginTop: 'auto', paddingTop: 20 }}>
          <Button variant="primary" size="lg" fullWidth onClick={() => go('/create-story')}
            style={{ borderRadius: '14px' }}>
            Creer un livre
          </Button>
          {!isAuthenticated && (
            <Button variant="ghost" size="lg" fullWidth onClick={() => go('/login')}
              style={{ marginTop: 8, borderRadius: '14px' }}>
              Connexion
            </Button>
          )}
        </div>
      </Drawer>
    </>
  );
};

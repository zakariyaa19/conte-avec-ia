import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { useAuth } from '../../contexts/AuthContext';

const LayoutWrapper = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Sidebar = styled.aside<{ $isOpen: boolean }>`
  width: 220px;
  background: ${theme.colors.admin.sidebar};
  color: ${theme.colors.admin.sidebarText};
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 100;
  transition: transform 0.3s ease;

  @media (max-width: ${theme.breakpoints.md}) {
    transform: ${props => props.$isOpen ? 'translateX(0)' : 'translateX(-100%)'};
  }
`;

const SidebarOverlay = styled.div<{ $isOpen: boolean }>`
  display: none;
  @media (max-width: ${theme.breakpoints.md}) {
    display: ${props => props.$isOpen ? 'block' : 'none'};
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 99;
  }
`;

const Logo = styled.div`
  padding: ${theme.spacing.lg};
  font-size: ${theme.fontSizes.lg};
  font-weight: 700;
  border-bottom: 1px solid ${theme.colors.admin.sidebarHover};
  letter-spacing: -0.5px;
`;

const Nav = styled.nav`
  flex: 1;
  padding: ${theme.spacing.md} 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const NavItem = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  background: ${props => props.$active ? theme.colors.admin.sidebarActive + '20' : 'transparent'};
  color: ${props => props.$active ? '#fff' : theme.colors.admin.sidebarText};
  border: none;
  border-left: 3px solid ${props => props.$active ? theme.colors.admin.sidebarActive : 'transparent'};
  cursor: pointer;
  font-size: ${theme.fontSizes.sm};
  font-weight: ${props => props.$active ? 600 : 400};
  text-align: left;
  width: 100%;
  transition: all 0.15s ease;

  &:hover {
    background: ${theme.colors.admin.sidebarHover};
  }
`;

const NavIcon = styled.span`
  font-size: 1.1rem;
  width: 24px;
  text-align: center;
`;

const SidebarFooter = styled.div`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-top: 1px solid ${theme.colors.admin.sidebarHover};
`;

const LogoutBtn = styled.button`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.sm} 0;
  background: none;
  border: none;
  color: ${theme.colors.admin.sidebarText};
  cursor: pointer;
  font-size: ${theme.fontSizes.sm};
  opacity: 0.7;
  transition: opacity 0.15s;

  &:hover {
    opacity: 1;
  }
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: 220px;
  background: ${theme.colors.admin.contentBg};
  min-height: 100vh;

  @media (max-width: ${theme.breakpoints.md}) {
    margin-left: 0;
  }
`;

const TopBar = styled.div`
  display: none;
  @media (max-width: ${theme.breakpoints.md}) {
    display: flex;
    align-items: center;
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    background: ${theme.colors.admin.sidebar};
    color: white;
  }
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  margin-right: ${theme.spacing.md};
`;

const ContentArea = styled.div`
  padding: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.md};
  }
`;

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { path: '/admin', label: 'Accueil', icon: '📊', exact: true },
    { path: '/admin/orders', label: 'Commandes', icon: '📦' },
    { path: '/admin/clients', label: 'Clients', icon: '👥' },
  ];

  const isActive = (item: typeof navItems[0]) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  const handleNav = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <LayoutWrapper>
      <SidebarOverlay $isOpen={sidebarOpen} onClick={() => setSidebarOpen(false)} />
      <Sidebar $isOpen={sidebarOpen}>
        <Logo>Contes d'IA</Logo>
        <Nav>
          {navItems.map(item => (
            <NavItem
              key={item.path}
              $active={isActive(item)}
              onClick={() => handleNav(item.path)}
            >
              <NavIcon>{item.icon}</NavIcon>
              {item.label}
            </NavItem>
          ))}
        </Nav>
        <SidebarFooter>
          <LogoutBtn onClick={handleLogout}>
            <NavIcon>🚪</NavIcon>
            Deconnexion
          </LogoutBtn>
        </SidebarFooter>
      </Sidebar>

      <MainContent>
        <TopBar>
          <MenuButton onClick={() => setSidebarOpen(true)}>☰</MenuButton>
          <span style={{ fontWeight: 600 }}>Admin</span>
        </TopBar>
        <ContentArea>
          {children}
        </ContentArea>
      </MainContent>
    </LayoutWrapper>
  );
};

export default AdminLayout;

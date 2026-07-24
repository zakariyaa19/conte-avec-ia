import React from 'react';
import styled, { css } from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { theme } from '../../styles/theme';
import { BLOG_CATEGORIES } from '../../data/blogArticles';
const FooterContainer = styled.footer`
  background-color: var(--bg-secondary);
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
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
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
    color: var(--text-primary);
    margin-bottom: ${theme.spacing.lg};
    font-weight: 600;
  }
`;

const FooterDescription = styled.p`
  color: var(--text-light);
  font-size: ${theme.fontSizes.sm};
  line-height: 1.7;
  margin-bottom: ${theme.spacing.md};
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`;

const linkStyles = css`
  color: var(--text-light);
  font-size: ${theme.fontSizes.sm};
  text-decoration: none;
  transition: all ${theme.transitions.fast};
  font-weight: 450;

  &:hover {
    color: ${theme.colors.accent.coral};
    padding-left: 4px;
  }
`;

// Lien externe / mailto / tel / anchor smooth-scroll : reste sur <a> + onClick.
const FooterLink = styled.a`
  ${linkStyles}
`;

// Lien interne (route) : utilise <Link> de react-router → href crawlable par
// Google (vrai jus PageRank distribué depuis le footer site-wide).
const FooterRouterLink = styled(Link)`
  ${linkStyles}
`;

const FooterBottom = styled.div`
  border-top: 1px solid var(--border-color);
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
  color: var(--text-light);
  font-size: ${theme.fontSizes.sm};
  margin: 0;
`;

const LegalInfo = styled.p`
  color: var(--text-light);
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
            <h4>Contedia</h4>
            <FooterDescription>
              Créez des contes personnalisés et magiques pour vos enfants grâce à l'intelligence artificielle.
              Chaque histoire est unique et adaptée à votre petit lecteur.
            </FooterDescription>
          </FooterSection>

          <FooterSection>
            <h4>Navigation</h4>
            <FooterLinks>
              <FooterRouterLink to="/">Accueil</FooterRouterLink>
              <FooterRouterLink to="/exemples">Exemples de contes</FooterRouterLink>
              <FooterLink href="#tarifs" onClick={(e) => { e.preventDefault(); handleNavigation('#tarifs'); }}>Nos tarifs</FooterLink>
              <FooterRouterLink to="/create-story">Créer un conte</FooterRouterLink>
              <FooterRouterLink to="/blog">Blog</FooterRouterLink>
              <FooterRouterLink to="/club">Club</FooterRouterLink>
              <FooterRouterLink to="/a-propos">À propos</FooterRouterLink>
            </FooterLinks>
          </FooterSection>

          <FooterSection>
            <h4>Explorer le blog</h4>
            <FooterLinks>
              {BLOG_CATEGORIES.map(c => (
                <FooterRouterLink key={c.slug} to={`/blog/categorie/${c.slug}`}>
                  {c.label}
                </FooterRouterLink>
              ))}
            </FooterLinks>
          </FooterSection>

          <FooterSection>
            <h4>Support</h4>
            <FooterLinks>
              <FooterLink href="mailto:contact@contedia.fr">Nous contacter</FooterLink>
              <FooterLink href="tel:+33780777110">Support téléphonique</FooterLink>
            </FooterLinks>
          </FooterSection>

          <FooterSection>
            <h4>Légal</h4>
            <FooterLinks>
              <FooterRouterLink to="/mentions-legales">Mentions légales</FooterRouterLink>
              <FooterRouterLink to="/conditions-generales-de-vente">Conditions générales de vente</FooterRouterLink>
              <FooterRouterLink to="/politique-confidentialite">Politique de confidentialité</FooterRouterLink>
            </FooterLinks>
          </FooterSection>
        </FooterGrid>

        <FooterBottom>
          <Copyright>&copy; {new Date().getFullYear()} Contedia. Tous droits réservés.</Copyright>
          <LegalInfo>
            SIRET: 99282930900010 | TVA non applicable, art. 293 B du CGI | contact@contedia.fr
          </LegalInfo>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
};

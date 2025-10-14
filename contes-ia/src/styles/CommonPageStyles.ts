import styled from 'styled-components';
import { theme } from './theme';

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${theme.spacing.lg};
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding: 0 ${theme.spacing.md};
  }
`;

export const PageHeader = styled.header`
  text-align: center;
  padding: ${theme.spacing['4xl']} ${theme.spacing['3xl']};
  margin: ${theme.spacing['2xl']} ${theme.spacing.lg} ${theme.spacing.xl};
  background: ${theme.colors.background.white};
  border-radius: ${theme.borderRadius.xl};
  color: ${theme.colors.text.primary};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  
  @media (max-width: ${theme.breakpoints.md}) {
    margin: ${theme.spacing.xl} ${theme.spacing.md};
    padding: ${theme.spacing['3xl']} ${theme.spacing.xl};
  }
`;

export const PageTitle = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['4xl']};
  font-weight: bold;
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.lg};
  
  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.fontSizes['3xl']};
  }
`;

export const PageIntro = styled.p`
  font-size: ${theme.fontSizes.xl};
  color: ${theme.colors.text.secondary};
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
  
  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.fontSizes.lg};
  }
`;

export const Section = styled.section`
  padding: ${theme.spacing['3xl']} 0;
  margin: ${theme.spacing.xl} 0;
  
  &:nth-child(even) {
    background-color: ${theme.colors.background.white};
    border-radius: ${theme.borderRadius.xl};
    padding: ${theme.spacing['4xl']} ${theme.spacing['3xl']};
    margin: ${theme.spacing['2xl']} ${theme.spacing.lg};
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    
    @media (max-width: ${theme.breakpoints.md}) {
      margin: ${theme.spacing.xl} ${theme.spacing.md};
      padding: ${theme.spacing['3xl']} ${theme.spacing.xl};
    }
  }
  
  &:nth-child(odd) {
    background-color: ${theme.colors.background.white};
    border-radius: ${theme.borderRadius.xl};
    padding: ${theme.spacing['4xl']} ${theme.spacing['3xl']};
    margin: ${theme.spacing['2xl']} ${theme.spacing.lg};
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    
    @media (max-width: ${theme.breakpoints.md}) {
      margin: ${theme.spacing.xl} ${theme.spacing.md};
      padding: ${theme.spacing['3xl']} ${theme.spacing.xl};
    }
  }
`;

export const SectionTitle = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['3xl']};
  color: ${theme.colors.text.primary};
  text-align: center;
  margin-bottom: ${theme.spacing.xl};
  
  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.fontSizes['2xl']};
  }
`;

export const SectionIntro = styled.p`
  color: ${theme.colors.text.secondary};
  text-align: center;
  font-size: ${theme.fontSizes.lg};
  margin-bottom: ${theme.spacing['2xl']};
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`;

export const Grid = styled.div<{ columns?: number }>`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(${props => props.columns ? `${300 / props.columns}px` : '300px'}, 1fr));
  gap: ${theme.spacing.xl};
  margin-top: ${theme.spacing.xl};
  
  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: ${theme.spacing.lg};
  }
  
  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.md};
  }
`;

export const Card = styled.div`
  background: ${theme.colors.background.white};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.xl};
  box-shadow: ${theme.shadows.md};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${theme.shadows.lg};
  }
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing.lg};
  }
  
  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.md};
  }
`;

export const CardHeader = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing.lg};
`;

export const CardIcon = styled.div`
  font-size: ${theme.fontSizes['3xl']};
  margin-bottom: ${theme.spacing.md};
  
  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.fontSizes['2xl']};
  }
  
  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.xl};
    margin-bottom: ${theme.spacing.sm};
  }
`;

export const CardTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.xl};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.sm};
  
  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.fontSizes.lg};
  }
  
  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.base};
  }
`;

export const CardDescription = styled.p`
  color: ${theme.colors.text.secondary};
  line-height: 1.6;
  margin-bottom: ${theme.spacing.lg};
  
  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.fontSizes.sm};
    margin-bottom: ${theme.spacing.md};
  }
  
  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes.sm};
    line-height: 1.5;
  }
`;

export const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.lg};
`;

export const Tag = styled.span`
  background: ${theme.colors.accent.coral};
  color: ${theme.colors.text.white};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.sm};
  font-weight: 500;
`;

export const CTASection = styled.section`
  background: ${theme.colors.background.white};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing['4xl']} ${theme.spacing['3xl']};
  margin: ${theme.spacing['2xl']} ${theme.spacing.lg};
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  
  @media (max-width: ${theme.breakpoints.md}) {
    margin: ${theme.spacing.xl} ${theme.spacing.md};
    padding: ${theme.spacing['3xl']} ${theme.spacing.xl};
  }
`;

export const CTATitle = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['3xl']};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.lg};
`;

export const CTADescription = styled.p`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.fontSizes.lg};
  line-height: 1.6;
  margin-bottom: ${theme.spacing.xl};
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

export const CTAButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.lg};
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: ${theme.spacing.lg};
  
  @media (max-width: ${theme.breakpoints.md}) {
    gap: ${theme.spacing.md};
  }
  
  @media (max-width: ${theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: center;
    gap: ${theme.spacing.sm};
  }
`;

export const CTALinks = styled.div`
  display: flex;
  gap: ${theme.spacing.lg};
  justify-content: center;
  flex-wrap: wrap;
  
  @media (max-width: ${theme.breakpoints.md}) {
    gap: ${theme.spacing.md};
  }
  
  @media (max-width: ${theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: center;
    gap: ${theme.spacing.sm};
  }
  
  a {
    color: ${theme.colors.text.secondary};
    text-decoration: none;
    font-weight: 500;
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    border: 2px solid ${theme.colors.accent.coral};
    border-radius: ${theme.borderRadius.full};
    transition: all 0.3s ease;
    
    @media (max-width: ${theme.breakpoints.sm}) {
      padding: ${theme.spacing.xs} ${theme.spacing.sm};
      font-size: ${theme.fontSizes.sm};
      text-align: center;
      min-width: 200px;
    }
    
    &:hover {
      background: ${theme.colors.accent.coral};
      color: ${theme.colors.text.white};
    }
  }
`;

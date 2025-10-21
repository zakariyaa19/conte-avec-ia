import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { Button } from '../components/ui/Button';
import { PricingCard } from '../components/ui/PricingCard';
import { Accordion } from '../components/ui/Accordion';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { useNavigate } from 'react-router-dom';
import { exampleStories } from '../data/exampleStories';

// Éléments graphiques animés
const FloatingBubbles = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 1;
`;

const Bubble = styled.div<{ size: number; delay: number; duration: number; left: number }>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  left: ${props => props.left}%;
  animation: float ${props => props.duration}s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
  
  @keyframes float {
    0%, 100% {
      transform: translateY(100vh) rotate(0deg);
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      transform: translateY(-100px) rotate(360deg);
      opacity: 0;
    }
  }
  
  @media (max-width: 768px) {
    width: ${props => props.size * 0.7}px;
    height: ${props => props.size * 0.7}px;
  }
`;

const StarField = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
`;

const Star = styled.div<{ top: number; left: number; delay: number; size?: number }>`
  position: absolute;
  top: ${props => props.top}%;
  left: ${props => props.left}%;
  width: ${props => props.size || 3}px;
  height: ${props => props.size || 3}px;
  opacity: 0.4;
  animation: starTwinkle 3s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    background: #FFD700;
    transform: translate(-50%, -50%) rotate(45deg);
    clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 150%;
    height: 150%;
    background: radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 60%);
    transform: translate(-50%, -50%);
    border-radius: 50%;
    animation: starGlow 2s ease-in-out infinite;
    animation-delay: ${props => props.delay}s;
  }
  
  @keyframes starTwinkle {
    0%, 100% {
      opacity: 0.2;
      transform: scale(0.8) rotate(0deg);
    }
    50% {
      opacity: 0.8;
      transform: scale(1.2) rotate(180deg);
    }
  }
  
  @keyframes starGlow {
    0%, 100% {
      opacity: 0.1;
      transform: translate(-50%, -50%) scale(1);
    }
    50% {
      opacity: 0.4;
      transform: translate(-50%, -50%) scale(1.5);
    }
  }
  
  @media (max-width: 768px) {
    width: ${props => (props.size || 3) * 0.8}px;
    height: ${props => (props.size || 3) * 0.8}px;
  }
`;

const MagicWand = styled.div<{ top: number; left: number; rotation: number }>`
  position: absolute;
  top: ${props => props.top}%;
  left: ${props => props.left}%;
  width: 30px;
  height: 4px;
  background: linear-gradient(90deg, #8B4513 0%, #D2691E 100%);
  border-radius: 2px;
  transform: rotate(${props => props.rotation}deg);
  animation: magicFloat 4s ease-in-out infinite;
  
  &::before {
    content: '✨';
    position: absolute;
    left: -8px;
    top: -8px;
    font-size: 16px;
    animation: sparkle 1.5s ease-in-out infinite;
  }
  
  @keyframes magicFloat {
    0%, 100% {
      transform: rotate(${props => props.rotation}deg) translateY(0px);
    }
    50% {
      transform: rotate(${props => props.rotation + 10}deg) translateY(-10px);
    }
  }
  
  @keyframes sparkle {
    0%, 100% {
      opacity: 0.5;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(1.3);
    }
  }
  
  @media (max-width: 768px) {
    width: 20px;
    height: 3px;
    
    &::before {
      font-size: 12px;
      left: -6px;
      top: -6px;
    }
  }
`;


const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, ${theme.colors.background.primary} 0%, ${theme.colors.accent.paleYellow} 100%);
  background-size: 400% 400%;
  animation: gradientShift 8s ease-in-out infinite;
  padding: ${theme.spacing['4xl']} 0;
  position: relative;
  overflow: hidden;
  
  @keyframes gradientShift {
    0%, 100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${theme.spacing.lg};
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing['3xl']};
  align-items: center;
  
  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing['2xl']};
    text-align: center;
  }
`;

const HeroTitle = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['5xl']};
  font-weight: bold;
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.lg};
  text-align: left;
  
  @media (max-width: ${theme.breakpoints.lg}) {
    text-align: center;
  }
  
  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.fontSizes['4xl']};
  }
`;

const HeroSubtitle = styled.p`
  font-size: ${theme.fontSizes.xl};
  color: ${theme.colors.text.secondary};
  margin-bottom: ${theme.spacing['2xl']};
  line-height: 1.6;
  text-align: left;
  
  @media (max-width: ${theme.breakpoints.lg}) {
    text-align: center;
  }
  
  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.fontSizes.lg};
  }
`;

const CTAButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.lg};
  justify-content: flex-start;
  flex-wrap: wrap;
  
  @media (max-width: ${theme.breakpoints.lg}) {
    justify-content: center;
  }
`;

const FeaturesSection = styled.section`
  padding: ${theme.spacing['4xl']} 0;
  background-color: ${theme.colors.background.white};
`;

const SectionTitle = styled.h2`
  text-align: center;
  margin-bottom: ${theme.spacing['3xl']};
  color: ${theme.colors.text.primary};
`;

const FeaturesGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${theme.spacing.lg};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${theme.spacing['2xl']};
`;

const FeatureCard = styled.div`
  background: linear-gradient(135deg, ${theme.colors.background.primary} 0%, ${theme.colors.accent.paleYellow} 100%);
  padding: ${theme.spacing['2xl']};
  border-radius: ${theme.borderRadius.xl};
  text-align: center;
  box-shadow: ${theme.shadows.sm};
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${theme.shadows.md};
  }
`;

const FeatureIcon = styled.div`
  margin-bottom: ${theme.spacing.xl};
  display: flex;
  justify-content: center;
  align-items: center;
  height: 140px;
`;

const FeatureImage = styled.img`
  width: 280px;
  height: 160px;
  object-fit: cover;
  border-radius: ${theme.borderRadius.xl};
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: scale(1.05) translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  }
  
  &:not([src]) {
    display: none;
  }
  
  &[src=""] {
    display: none;
  }
`;

const FeatureIconFallback = styled.div`
  font-size: ${theme.fontSizes['5xl']};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, ${theme.colors.accent.pastelBlue}, ${theme.colors.accent.lightGreen});
  border-radius: ${theme.borderRadius.xl};
  color: white;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05) translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  }
`;

const FeatureTitle = styled.h3`
  margin-bottom: ${theme.spacing.md};
  color: ${theme.colors.text.primary};
`;

const FeatureDescription = styled.p`
  color: ${theme.colors.text.light};
  font-size: ${theme.fontSizes.sm};
`;

const PricingSection = styled.section`
  padding: ${theme.spacing['4xl']} 0;
  background-color: ${theme.colors.background.white};
  
  /* Ajout d'un ID pour le scroll depuis le header */
  &#tarifs {
    scroll-margin-top: 80px;
  }
`;

const PricingGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${theme.spacing.lg};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${theme.spacing['2xl']};
`;

const FAQSection = styled.section`
  padding: ${theme.spacing['4xl']} 0;
  background-color: ${theme.colors.background.white};
`;

const TestimonialsSection = styled.section`
  padding: ${theme.spacing['4xl']} 0;
  background: linear-gradient(135deg, ${theme.colors.background.primary} 0%, ${theme.colors.accent.paleYellow} 100%);
`;

const TestimonialGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${theme.spacing.lg};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${theme.spacing.xl};
`;

const TestimonialCard = styled.div`
  background-color: ${theme.colors.background.white};
  padding: ${theme.spacing.xl};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.sm};
  text-align: center;
`;

const TestimonialText = styled.p`
  font-style: italic;
  color: ${theme.colors.text.secondary};
  margin-bottom: ${theme.spacing.lg};
  font-size: ${theme.fontSizes.base};
`;

const TestimonialAuthor = styled.div`
  font-weight: 600;
  color: ${theme.colors.text.primary};
  font-size: ${theme.fontSizes.sm};
`;

// Styles pour la section des 3 étapes
const StepsSection = styled.section`
  padding: ${theme.spacing['4xl']} 0;
  background-color: ${theme.colors.background.white};
  position: relative;
  overflow: hidden;
`;

const StepsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${theme.spacing.lg};
`;

const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr auto 1fr;
  gap: ${theme.spacing.lg};
  align-items: center;
  margin-bottom: ${theme.spacing['3xl']};
  
  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.xl};
  }
`;

const StepCard = styled.div`
  background: ${theme.colors.accent.creamyYellow};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing['2xl']};
  box-shadow: ${theme.shadows.sm};
  transition: all 0.3s ease;
  text-align: center;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: ${theme.shadows.lg};
  }
`;

const StepNumber = styled.div`
  width: 80px;
  height: 80px;
  border-radius: ${theme.borderRadius.full};
  background: linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.accent.lightCoral});
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.fontSizes['4xl']};
  font-weight: bold;
  color: white;
  margin: 0 auto ${theme.spacing.lg};
  transition: transform 0.3s ease;
  
  ${StepCard}:hover & {
    transform: scale(1.1);
  }
`;

const StepArrow = styled.div`
  font-size: ${theme.fontSizes['2xl']};
  color: ${theme.colors.accent.coral};
  
  @media (max-width: ${theme.breakpoints.lg}) {
    display: none;
  }
`;

const StepTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.xl};
  font-weight: 600;
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.md};
`;

const StepDescription = styled.p`
  color: ${theme.colors.text.secondary};
  line-height: 1.6;
  font-size: ${theme.fontSizes.sm};
`;

const StepsCTA = styled.div`
  text-align: center;
`;

// Styles pour la section exemple
const ExampleSection = styled.section`
  padding: ${theme.spacing['4xl']} 0;
  background-color: ${theme.colors.background.white};
`;

const ExampleContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${theme.spacing.lg};
`;

const ExamplesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: ${theme.spacing['2xl']};
  margin-top: ${theme.spacing['2xl']};
  
  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.xl};
  }
`;

const ExampleCard = styled.div`
  background: ${theme.colors.background.white};
  border-radius: ${theme.borderRadius.xl};
  overflow: hidden;
  box-shadow: ${theme.shadows.md};
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  height: 96%;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: ${theme.shadows.lg};
  }
`;

const BookSection = styled.div`
  position: relative;
  height: 400px;
  overflow: hidden;
`;

const BookCover = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  cursor: pointer;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
    
    &:hover {
      transform: scale(1.05);
    }
  }
`;

const DetailsSection = styled.div`
  padding: ${theme.spacing.lg};
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
`;

const DetailsTitle = styled.h3`
  font-size: ${theme.fontSizes.lg};
  font-weight: 700;
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.md};
  line-height: 1.3;
`;

const StoryInfo = styled.div`
  margin-bottom: ${theme.spacing.md};
  flex: 1;
  min-height: 0;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.xs};
  font-size: ${theme.fontSizes.sm};
`;

const InfoLabel = styled.span`
  color: ${theme.colors.text.secondary};
  font-weight: 500;
`;

const InfoValue = styled.span`
  color: ${theme.colors.text.primary};
  font-weight: 600;
`;

const ExampleSectionTitle = styled.h5`
  font-size: ${theme.fontSizes.lg};
  font-weight: 600;
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const DetailsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.xs} 0;
  border-bottom: 1px solid #f5f5f5;
  
  &:last-child {
    border-bottom: none;
  }
`;

const DetailLabel = styled.span`
  font-weight: 500;
  color: ${theme.colors.text.secondary};
  font-size: ${theme.fontSizes.sm};
`;

const DetailValue = styled.span`
  font-weight: 500;
  color: ${theme.colors.text.primary};
  font-size: ${theme.fontSizes.sm};
  text-align: right;
  
  @media (max-width: 480px) {
    font-size: ${theme.fontSizes.xs};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${theme.spacing.lg};
  padding-top: ${theme.spacing.md};
  border-top: 1px solid #e5e7eb;
  flex-shrink: 0;
  
  button {
    min-width: 140px;
    font-size: ${theme.fontSizes.sm};
    padding: ${theme.spacing.sm} ${theme.spacing.lg};
  }
`;

// Styles pour la nouvelle section promotionnelle
const LanguagePromoSection = styled.section`
  background: linear-gradient(135deg, ${theme.colors.background.primary} 0%, ${theme.colors.accent.paleYellow} 100%);
  padding: ${theme.spacing['4xl']} 0;
  margin: 0;
`;

const LanguagePromoContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${theme.spacing.lg};
`;

const LanguagePromoContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing['3xl']};
  align-items: center;
  
  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing['2xl']};
    text-align: center;
  }
`;

const ImageColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xl};
  align-items: center;
`;

const PromoImageContainer = styled.div`
  background: white;
  border-radius: ${theme.borderRadius.xl};
  padding: 0;
  box-shadow: ${theme.shadows.lg};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${theme.shadows.xl};
  }
`;

const PromoImage = styled.img`
  width: 100%;
  max-width: 300px;
  height: 400px;
  object-fit: cover;
  border-radius: ${theme.borderRadius.lg};
  display: block;
`;

const PromoButtonsContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  justify-content: center;
  
  @media (max-width: ${theme.breakpoints.sm}) {
    flex-direction: column;
    width: 100%;
    
    button {
      width: 100%;
    }
  }
`;

const TextColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
  justify-content: center;
`;

const PromoTitle = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['4xl']};
  font-weight: bold;
  color: ${theme.colors.text.primary};
  margin: 0;
  line-height: 1.2;
  
  @media (max-width: ${theme.breakpoints.lg}) {
    font-size: ${theme.fontSizes['3xl']};
    text-align: center;
  }
  
  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.fontSizes['2xl']};
  }
`;

const PromoSubtitle = styled.h3`
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.xl};
  font-weight: 600;
  color: ${theme.colors.text.secondary};
  margin: 0;
  line-height: 1.4;
  
  @media (max-width: ${theme.breakpoints.lg}) {
    text-align: center;
  }
`;

const PromoDescription = styled.p`
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.lg};
  color: ${theme.colors.text.secondary};
  margin: 0;
  line-height: 1.6;
  
  @media (max-width: ${theme.breakpoints.lg}) {
    text-align: center;
  }
`;

const PromoFeatures = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.md};
  
  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const PromoFeature = styled.div`
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.base};
  color: ${theme.colors.text.primary};
  font-weight: 500;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: rgba(255, 255, 255, 0.7);
  border-radius: ${theme.borderRadius.lg};
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  
  @media (max-width: ${theme.breakpoints.lg}) {
    text-align: center;
  }
`;

const HeroImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const HeroImage = styled.img`
  width: 120%;
  height: auto;
  
  @media (max-width: ${theme.breakpoints.lg}) {
    width: 100%;
  }
`;

// Styles pour la visionneuse d'image
const ImageViewerOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  cursor: pointer;
`;

const ImageViewerContainer = styled.div`
  position: relative;
  width: 90vw;
  height: 90vh;
  cursor: default;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 768px) {
    width: 95vw;
    height: 95vh;
  }
`;

const ViewerImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    border-radius: 8px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.2s ease;
  z-index: 1001;
  
  &:hover {
    background: rgba(0, 0, 0, 0.9);
    transform: scale(1.1);
  }
`;

const faqItems = [
  {
    id: '1',
    question: 'Comment fonctionne la création d\'un conte personnalisé ?',
    answer: 'Vous remplissez un formulaire en 3 étapes : choix du thème et du style, informations sur le protagoniste, et finalisation. Notre IA génère ensuite un conte unique avec des illustrations adaptées à vos choix.'
  },
  {
    id: '2',
    question: 'Combien de temps faut-il pour recevoir mon conte ?',
    answer: 'L\'eBook est disponible immédiatement après paiement. Pour le livre relié, comptez 5-7 jours ouvrés pour l\'impression et la livraison.'
  },
  {
    id: '3',
    question: 'Puis-je modifier mon conte après commande ?',
    answer: 'Les modifications ne sont possibles que dans les 24h suivant la commande et avant le début de la production. Contactez-nous rapidement si vous souhaitez des ajustements.'
  },
  {
    id: '4',
    question: 'Les contes sont-ils adaptés à tous les âges ?',
    answer: 'Oui ! Vous choisissez la tranche d\'âge lors de la commande (0-2 ans, 3-5 ans, 6-9 ans, 10+ ans) et le contenu s\'adapte automatiquement au niveau de lecture approprié.'
  },
  {
    id: '5',
    question: 'Que se passe-t-il si je ne suis pas satisfait ?',
    answer: 'Nous offrons une garantie satisfaction. Si le conte ne vous convient pas, nous le modifions gratuitement ou vous remboursons intégralement.'
  }
];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // SEO optimisé pour la page d'accueil avec mots-clés principaux
  useEffect(() => {
    document.title = 'Créez un conte personnalisé avec l\'IA | Contes d\'IA';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Offrez à votre enfant un livre unique et magique ! Créez facilement un conte personnalisé avec l\'intelligence artificielle : prénom, photo, thème, style d\'illustration et message éducatif sur mesure.');
    } else {
      const newMetaDescription = document.createElement('meta');
      newMetaDescription.name = 'description';
      newMetaDescription.content = 'Offrez à votre enfant un livre unique et magique ! Créez facilement un conte personnalisé avec l\'intelligence artificielle : prénom, photo, thème, style d\'illustration et message éducatif sur mesure.';
      document.head.appendChild(newMetaDescription);
    }

    // Mots-clés principaux SEO
    const metaKeywords = document.querySelector('meta[name="keywords"]') || document.createElement('meta');
    metaKeywords.setAttribute('name', 'keywords');
    metaKeywords.setAttribute('content', 'livre personnalisé enfant, conte personnalisé enfant, livre personnalisé avec photo, histoire personnalisée pour enfant, créer un livre personnalisé, livre pour enfant personnalisé, conte sur mesure pour enfant, livre enfant sur mesure, conte personnalisé avec IA, créer une histoire personnalisée');
    if (!document.querySelector('meta[name="keywords"]')) {
      document.head.appendChild(metaKeywords);
    }

    // Balises Open Graph pour le partage social
    const ogTitle = document.querySelector('meta[property="og:title"]') || document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    ogTitle.setAttribute('content', 'Créez un conte personnalisé avec l\'IA | Contes d\'IA');
    if (!document.querySelector('meta[property="og:title"]')) {
      document.head.appendChild(ogTitle);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]') || document.createElement('meta');
    ogDescription.setAttribute('property', 'og:description');
    ogDescription.setAttribute('content', 'Offrez à votre enfant un livre unique et magique ! Créez facilement un conte personnalisé avec l\'intelligence artificielle.');
    if (!document.querySelector('meta[property="og:description"]')) {
      document.head.appendChild(ogDescription);
    }
  }, []);
  
  // Récupérer 3 histoires d'exemple
  const featuredStories = [
    exampleStories.find(story => story.id === "1"), // Emma - Forêt Magique
    exampleStories.find(story => story.id === "2"), // Luna - Voyage Cosmique  
    exampleStories.find(story => story.id === "6")  // Zak - Examen Hunter
  ].filter((story): story is NonNullable<typeof story> => story !== undefined);
  
  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsImageViewerOpen(true);
  };
  
  const closeImageViewer = () => {
    setIsImageViewerOpen(false);
    setSelectedImage(null);
  };
  
  const handleViewExample = (story?: any) => {
    if (story && story.pdfUrl) {
      window.open(story.pdfUrl, '_blank');
    } else {
      // Si aucun story n'est fourni, ouvrir le PDF d'exemple par défaut
      window.open('/pdfs/exemple-conte.pdf', '_blank');
    }
  };
  
  
  return (
    <PageContainer>
      <Header />
      <HeroSection>
        {/* Éléments graphiques animés */}
        <FloatingBubbles>
          <Bubble size={60} delay={0} duration={8} left={10} />
          <Bubble size={40} delay={2} duration={10} left={80} />
          <Bubble size={80} delay={4} duration={12} left={60} />
          <Bubble size={30} delay={6} duration={9} left={20} />
          <Bubble size={50} delay={8} duration={11} left={90} />
          <Bubble size={45} delay={10} duration={13} left={35} />
          <Bubble size={35} delay={12} duration={9} left={75} />
          <Bubble size={55} delay={14} duration={10} left={5} />
          <Bubble size={25} delay={16} duration={11} left={95} />
        </FloatingBubbles>
        
        <StarField>
          <Star top={5} left={15} delay={0} size={4} />
          <Star top={15} left={85} delay={0.5} size={3} />
          <Star top={25} left={25} delay={1} size={5} />
          <Star top={35} left={75} delay={1.5} size={3} />
          <Star top={45} left={10} delay={2} size={4} />
          <Star top={55} left={90} delay={2.5} size={3} />
          <Star top={65} left={35} delay={3} size={5} />
          <Star top={75} left={65} delay={3.5} size={4} />
          <Star top={85} left={20} delay={4} size={3} />
          <Star top={95} left={80} delay={4.5} size={4} />
          <Star top={12} left={50} delay={5} size={3} />
          <Star top={40} left={5} delay={5.5} size={4} />
          <Star top={60} left={95} delay={6} size={3} />
          <Star top={80} left={45} delay={6.5} size={5} />
          <Star top={30} left={70} delay={7} size={3} />
        </StarField>
        
        <MagicWand top={20} left={5} rotation={45} />
        <MagicWand top={60} left={95} rotation={-30} />
        
        <HeroContent>
          <div>
            <HeroTitle>
              Créez des contes personnalisés avec l'IA
            </HeroTitle>
            <HeroSubtitle>
            Créez un livre pour enfants personnalisé grâce à l’IA.<br /> Une histoire unique et des images magnifiques spécialement conçues pour votre enfant.
            </HeroSubtitle>
            <CTAButtons>
              <Button variant="primary" size="lg" onClick={() => window.location.href = '/create-story'}>
                Commencer mon conte
              </Button>
              <Button variant="outline" size="lg" onClick={() => window.location.href = '/exemples'}>
                Voir des exemples
              </Button>
            </CTAButtons>
          </div>
          <HeroImageContainer>
            <HeroImage 
              src="/images/homepage/hero-image.png" 
              alt="Enfants découvrant des contes magiques"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </HeroImageContainer>
        </HeroContent>
      </HeroSection>

      <StepsSection>
        {/* Éléments décoratifs pour la section étapes */}
        <StarField>
          <Star top={20} left={5} delay={0} size={4} />
          <Star top={40} left={95} delay={1} size={3} />
          <Star top={80} left={10} delay={2} size={5} />
          <Star top={15} left={75} delay={3} size={3} />
          <Star top={65} left={85} delay={4} size={4} />
          <Star top={30} left={25} delay={5} size={3} />
        </StarField>
        
        <StepsContainer>
          <StepsGrid>
            <StepCard>
              <StepNumber>1</StepNumber>
              <StepTitle>Personnalisez votre conte</StepTitle>
              <StepDescription>
                Donnez en détail le thème, l'âge visé, le message central et le style d'illustration 
                pour créer une histoire sur mesure, adaptée aux goûts et aux centres d'intérêt de votre enfant.
              </StepDescription>
            </StepCard>
            
            <StepArrow>→</StepArrow>
            
            <StepCard>
              <StepNumber>2</StepNumber>
              <StepTitle>Créez le héros de l'histoire</StepTitle>
              <StepDescription>
                Remplissez les noms et les informations des personnages et téléversez leurs photos. 
                Nos illustrations se basent directement sur vos images pour donner vie à un conte unique.
              </StepDescription>
            </StepCard>
            
            <StepArrow>→</StepArrow>
            
            <StepCard>
              <StepNumber>3</StepNumber>
              <StepTitle>Recevez votre livre dans le format que vous voulez</StepTitle>
              <StepDescription>
                Recevez votre eBook personnalisé dans la journée pour 4,99 €. 
                Vous souhaitez un exemplaire physique ? Choisissez une couverture rigide pour 19,99 € 
                et recevez votre livre directement chez vous.
              </StepDescription>
            </StepCard>
          </StepsGrid>
          
          <StepsCTA>
            <Button 
              variant="primary" 
              size="lg" 
              onClick={() => navigate('/create-story')}
            >
              Commencer mon conte personnalisé
            </Button>
          </StepsCTA>
        </StepsContainer>
      </StepsSection>

      {/* Section exemples - 3 contes personnalisés */}
      <ExampleSection>
        <ExampleContainer>
          <SectionTitle>Découvrez des exemples de contes personnalisés</SectionTitle>
          <ExamplesGrid>
            {featuredStories.map((story, index) => (
              <ExampleCard key={story.id}>
                <BookSection>
                  <BookCover onClick={() => handleImageClick(story.coverImage)}>
                    <img 
                      src={story.coverImage} 
                      alt={story.title}
                      crossOrigin="anonymous"
                    />
                  </BookCover>
                </BookSection>

                <DetailsSection>
                  <DetailsTitle>{story.title}</DetailsTitle>
                  
                  <StoryInfo>
                    <InfoItem>
                      <InfoLabel>Âge :</InfoLabel>
                      <InfoValue>{story.ageRange}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>Thème :</InfoLabel>
                      <InfoValue>{story.generalTheme}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>Style :</InfoLabel>
                      <InfoValue>{story.illustrationStyle}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>Héros :</InfoLabel>
                      <InfoValue>{story.protagonistName}</InfoValue>
                    </InfoItem>
                    {story.secondaryCharacterName && (
                      <InfoItem>
                        <InfoLabel>Compagnon :</InfoLabel>
                        <InfoValue>{story.secondaryCharacterName}</InfoValue>
                      </InfoItem>
                    )}
                  </StoryInfo>
                  
                  <ActionButtons>
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => handleViewExample(story)}
                    >
                      Voir l'exemple
                    </Button>
                  </ActionButtons>
                </DetailsSection>
              </ExampleCard>
            ))}
          </ExamplesGrid>
        </ExampleContainer>
      </ExampleSection>

      <LanguagePromoSection>
        <LanguagePromoContainer>
          <LanguagePromoContent>
            <ImageColumn>
              <PromoImageContainer>
                <PromoImage 
                  src="/images/homepage/multilingual-story.jpg" 
                  alt="Conte multilingue illustré"
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    e.currentTarget.src = "/images/homepage/hero-image.png";
                  }}
                />
              </PromoImageContainer>
              <PromoButtonsContainer>
                <Button 
                  variant="secondary" 
                  size="md"
                  onClick={() => handleViewExample()}
                >
                  🔍 Voir un exemple
                </Button>
                <Button 
                  variant="primary" 
                  size="md"
                  onClick={() => navigate('/create-story')}
                >
                  ✨ Créer mon conte
                </Button>
              </PromoButtonsContainer>
            </ImageColumn>
            
            <TextColumn>
              <PromoTitle>De nombreuses options uniques pour votre conte !</PromoTitle>
              <PromoSubtitle>
              🌍 Créez votre conte dans 10 langues différentes !
              </PromoSubtitle>
              <PromoDescription>
              <strong>Choisissez la religion de votre héros !</strong>
              <br></br>
              Vous pouvez même définir la religion de votre personnage principal 
                pour une histoire encore plus authentique et unique.
              </PromoDescription>
              <PromoFeatures>
                <PromoFeature>🎨 Styles d'illustration variés</PromoFeature>
                <PromoFeature>🌟 Messages éducatifs personnalisés</PromoFeature>
                <PromoFeature>👨‍👩‍👧‍👦 Choisissez la religion de votre héros</PromoFeature>
                <PromoFeature>📚 Adapté à chaque tranche d'âge</PromoFeature>
              </PromoFeatures>
            </TextColumn>
          </LanguagePromoContent>
        </LanguagePromoContainer>
      </LanguagePromoSection>

      <PricingSection id="tarifs">
        <div className="container">
          <SectionTitle>Nos tarifs</SectionTitle>
          <PricingGrid>
            <PricingCard
              title="eBook Numérique"
              price="4,99€"
              features={[
                "Conte personnalisé de 20 pages",
                "Illustrations haute qualité",
                "Format PDF optimisé",
                "Téléchargement immédiat",
                "Compatible tous appareils"
              ]}
              isPopular={true}
              ctaText="Commander l'eBook"
              onSelect={() => navigate('/create-story')}
            />
            
            <PricingCard
              title="Livre Relié Premium"
              price="19,99€"
              features={[
                "Conte personnalisé de 20 pages",
                "Illustrations premium",
                "Impression haute qualité",
                "Couverture rigide",
                "Livraison gratuite",
                "eBook inclus"
              ]}
              ctaText="Commander le livre"
              onSelect={() => navigate('/create-story')}
            />
          </PricingGrid>
        </div>
      </PricingSection>

      <FeaturesSection>
        <div className="container">
          <SectionTitle>Pourquoi choisir Contes d'IA ?</SectionTitle>
          <FeaturesGrid>
            <FeatureCard>
              <FeatureIcon>
                <FeatureImage 
                  src="/images/homepage/feature-personnalisation.png" 
                  alt="Personnalisation complète"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <FeatureIconFallback style={{display: 'none'}}>🎨</FeatureIconFallback>
              </FeatureIcon>
              <FeatureTitle>Personnalisation complète</FeatureTitle>
              <FeatureDescription>
                Choisissez le thème, les personnages, et même le style d'illustration 
                pour créer un conte unique qui ressemble à votre enfant.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>
                <FeatureImage 
                  src="/images/homepage/feature-qualite.png" 
                  alt="Qualité professionnelle"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <FeatureIconFallback style={{display: 'none'}}>📚</FeatureIconFallback>
              </FeatureIcon>
              <FeatureTitle>Qualité professionnelle</FeatureTitle>
              <FeatureDescription>
                Nos contes sont disponibles en eBook haute qualité ou en livre relié 
                imprimé avec soin pour une expérience de lecture exceptionnelle.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>
                <FeatureImage 
                  src="/images/homepage/feature-livraison.png" 
                  alt="Livraison rapide"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <FeatureIconFallback style={{display: 'none'}}>⚡</FeatureIconFallback>
              </FeatureIcon>
              <FeatureTitle>Livraison rapide</FeatureTitle>
              <FeatureDescription>
                Recevez votre conte personnalisé en quelques jours seulement. 
                L'eBook est disponible immédiatement après commande.
              </FeatureDescription>
            </FeatureCard>
          </FeaturesGrid>
        </div>
      </FeaturesSection>

      <FAQSection>
        <div className="container">
          <SectionTitle>Questions fréquentes</SectionTitle>
          <Accordion items={faqItems} />
        </div>
      </FAQSection>

      <TestimonialsSection>
        <div className="container">
          <SectionTitle>Ce que disent nos clients</SectionTitle>
          <TestimonialGrid>
            <TestimonialCard>
              <TestimonialText>
                "Ma fille de 5 ans adore son conte personnalisé ! Elle se reconnaît dans l'héroïne et redemande l'histoire tous les soirs. Un cadeau magique !"
              </TestimonialText>
              <TestimonialAuthor>
                Sophie M. - Maman de Léa
              </TestimonialAuthor>
            </TestimonialCard>
            
            <TestimonialCard>
              <TestimonialText>
                "La qualité d'impression est exceptionnelle et l'histoire est vraiment bien écrite. Mon fils de 7 ans était émerveillé de voir son nom dans un vrai livre !"
              </TestimonialText>
              <TestimonialAuthor>
                Marc D. - Papa de Thomas
              </TestimonialAuthor>
            </TestimonialCard>
            
            <TestimonialCard>
              <TestimonialText>
                "Service client au top ! Ils ont su adapter l'histoire aux goûts particuliers de ma fille. Je recommande vivement cette expérience unique."
              </TestimonialText>
              <TestimonialAuthor>
                Julie L. - Maman d'Emma
              </TestimonialAuthor>
            </TestimonialCard>
          </TestimonialGrid>
        </div>
      </TestimonialsSection>
      <Footer />
      
      {/* Visionneuse d'image */}
      {isImageViewerOpen && selectedImage && (
        <ImageViewerOverlay onClick={() => setIsImageViewerOpen(false)}>
          <ImageViewerContainer onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={() => setIsImageViewerOpen(false)}>✕</CloseButton>
            <ViewerImage 
              src={selectedImage} 
              alt="Image agrandie" 
              crossOrigin="anonymous"
            />
          </ImageViewerContainer>
        </ImageViewerOverlay>
      )}
    </PageContainer>
  );
};

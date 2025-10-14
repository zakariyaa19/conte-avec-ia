import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { exampleStories } from '../data/exampleStories';
import { useNavigate } from 'react-router-dom';

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, ${theme.colors.background.primary} 0%, ${theme.colors.accent.paleYellow} 100%);
`;

const HeroSection = styled.section`
  background: transparent;
  padding: ${theme.spacing['2xl']} 0 ${theme.spacing.lg} 0;
  text-align: center;
  margin: 0;
  border: none;
  position: relative;
  z-index: 1;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 0 0 ${theme.spacing.xl} 0;
  background: transparent;
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${theme.spacing.lg};
  
  @media (max-width: 768px) {
    padding: 0 ${theme.spacing.md};
  }
  
  @media (max-width: 480px) {
    padding: 0 ${theme.spacing.sm};
  }
`;

const Title = styled.h1`
  font-size: ${theme.fontSizes['3xl']};
  color: ${theme.colors.text.primary};
  text-align: center;
  margin-bottom: ${theme.spacing.md};
  font-weight: 700;
  
  @media (max-width: 768px) {
    font-size: ${theme.fontSizes['2xl']};
  }
  
  @media (max-width: 480px) {
    font-size: ${theme.fontSizes.xl};
    margin-bottom: ${theme.spacing.sm};
  }
`;

const Description = styled.p`
  font-size: ${theme.fontSizes.lg};
  color: ${theme.colors.text.secondary};
  margin-bottom: ${theme.spacing.xl};
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
`;

const ExamplesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
  gap: ${theme.spacing.xl};
  margin-top: ${theme.spacing.xl};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.md};
    margin-top: ${theme.spacing.lg};
  }
`;

const ExampleCard = styled.div`
  background: transparent;
  border-radius: 0;
  overflow: visible;
  box-shadow: none;
  transition: all 0.3s ease;
  border: none;
  display: flex;
  flex-direction: row;
  min-height: 380px;
  gap: ${theme.spacing.lg};
  
  @media (max-width: 1024px) {
    flex-direction: column;
    min-height: auto;
    gap: ${theme.spacing.md};
  }
  
  @media (max-width: 768px) {
    margin: 0 ${theme.spacing.sm};
    gap: ${theme.spacing.sm};
  }
`;

const BookSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${theme.spacing.lg};
  background: transparent;
  
  @media (max-width: 1024px) {
    padding: ${theme.spacing.md};
    min-height: 300px;
  }
  
  @media (max-width: 768px) {
    padding: ${theme.spacing.sm};
    min-height: 250px;
  }
`;

const BookCover = styled.div`
  width: auto;
  height: 460px;
  border-radius: ${theme.borderRadius.md};
  background: linear-gradient(135deg, ${theme.colors.button.primary}, ${theme.colors.accent.coral});
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  padding: 0;
  text-align: center;
  box-shadow: ${theme.shadows.md};
  border: 3px solid ${theme.colors.button.primaryHover};
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
  
  img {
    border-radius: calc(${theme.borderRadius.md} - 3px);
    
    &:hover {
      transform: scale(1.02);
    }
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.05);
    border-radius: ${theme.borderRadius.md};
    pointer-events: none;
  }
  
  @media (max-width: 768px) {
    height: 300px;
    width: 100%;
    max-width: 220px;
  }
  
  @media (max-width: 480px) {
    height: 250px;
    max-width: 180px;
  }
`;

const BookTitle = styled.h3`
  font-size: ${theme.fontSizes.lg};
  font-weight: 700;
  margin-bottom: ${theme.spacing.md};
  z-index: 1;
`;

const BookSubtitle = styled.p`
  font-size: ${theme.fontSizes.sm};
  opacity: 0.9;
  z-index: 1;
`;

const CharacterIllustration = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${theme.colors.accent.lightCoral}, ${theme.colors.accent.coral});
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.fontSizes['2xl']};
  margin: ${theme.spacing.md} 0;
  z-index: 1;
`;

const DetailsSection = styled.div`
  flex: 2;
  min-height: 380px;
  display: flex;
  flex-direction: column;
  background: ${theme.colors.background.white};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xl};
  box-shadow: ${theme.shadows.sm};
  border: 1px solid #f0f0f0;
  
  @media (max-width: 1024px) {
    flex: 1;
    min-height: auto;
    padding: ${theme.spacing.lg};
  }
  
  @media (max-width: 768px) {
    padding: ${theme.spacing.md};
  }
  
  @media (max-width: 480px) {
    padding: ${theme.spacing.sm};
  }
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.xl};
  flex: 1;
  margin-bottom: ${theme.spacing.lg};
  
  @media (max-width: 1024px) {
    gap: ${theme.spacing.lg};
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.md};
  }
  
  @media (max-width: 480px) {
    gap: ${theme.spacing.sm};
  }
`;

const DetailsColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const SectionTitle = styled.h5`
  font-size: ${theme.fontSizes.base};
  font-weight: 600;
  margin-bottom: ${theme.spacing.sm};
  color: ${theme.colors.text.primary};
  padding: ${theme.spacing.xs} 0;
  border-bottom: 2px solid ${theme.colors.accent.coral};
  
  @media (max-width: 768px) {
    font-size: ${theme.fontSizes.sm};
  }
`;

const DetailsTitle = styled.h4`
  font-size: ${theme.fontSizes.xl};
  font-weight: 700;
  color: ${theme.colors.text.primary};
  text-align: center;
  padding: ${theme.spacing.md};
  background: linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.accent.lightCoral});
  border-radius: ${theme.borderRadius.md};
  color: white;
`;

const DetailsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  
  @media (max-width: 768px) {
    gap: ${theme.spacing.xs};
  }
`;

const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.xs} 0;
  border-bottom: 1px solid ${theme.colors.background.secondary};
  
  &:last-child {
    border-bottom: none;
  }
`;

const DetailLabel = styled.span`
  font-weight: 500;
  color: ${theme.colors.text.secondary};
  font-size: ${theme.fontSizes.sm};
  
  @media (max-width: 480px) {
    font-size: ${theme.fontSizes.xs};
  }
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
  flex-direction: row;
  gap: ${theme.spacing.lg};
  padding-top: ${theme.spacing.lg};
  border-top: 1px solid #e5e7eb;
  margin-top: auto;
  
  @media (max-width: 768px) {
    gap: ${theme.spacing.md};
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: ${theme.spacing.sm};
  }
  
  button {
    flex: 1;
    max-width: 200px;
    
    @media (max-width: 480px) {
      max-width: none;
    }
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.md};
  width: 100%;
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
  
  @media (max-width: 768px) {
    top: -35px;
    right: -5px;
    width: 28px;
    height: 28px;
    font-size: ${theme.fontSizes.base};
  }
`;

export const ExemplesPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedStory, setSelectedStory] = useState<typeof exampleStories[0] | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);

  const handleViewExample = (story: any) => {
    if (story.pdfUrl) {
      window.open(story.pdfUrl, '_blank');
    }
  };

  const handleCloseViewer = () => {
    setIsViewerOpen(false);
    setSelectedStory(null);
  };

  const handleCreateStory = () => {
    navigate('/create-story');
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsImageViewerOpen(true);
  };

  const closeImageViewer = () => {
    setIsImageViewerOpen(false);
    setSelectedImage(null);
  };

  return (
    <PageContainer>
      <Header />
      <HeroSection>
        <Title>Exemples de Contes Personnalisés ✨</Title>
        <Description>
          Découvrez quelques exemples de contes personnalisés créés avec Contes d'IA.
          Chaque histoire est unique et adaptée aux préférences et photos de l'enfant.
        </Description>
      </HeroSection>
      <MainContent>
        <ContentContainer>
          
          <ExamplesGrid>
            {exampleStories.map((story) => (
              <ExampleCard key={story.id}>
                <BookSection>
                  <BookCover>
                    <img 
                      src={story.coverImage} 
                      alt={story.title}
                      crossOrigin="anonymous"
                      onClick={() => handleImageClick(story.coverImage)}
                      style={{
                        height: '100%',
                        width: 'auto',
                        objectFit: 'contain',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease'
                      }}
                      onLoad={() => {
                        console.log('Image loaded successfully:', story.coverImage);
                      }}
                      onError={(e) => {
                        console.error('Image failed to load:', story.coverImage);
                        // Fallback si l'image ne charge pas
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        fallback.style.display = 'flex';
                      }}
                    />
                    <div style={{
                      display: 'none',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      textAlign: 'center',
                      padding: '20px'
                    }}>
                      <BookTitle>{story.title}</BookTitle>
                      <CharacterIllustration>
                        {story.protagonistName.charAt(0)}
                      </CharacterIllustration>
                      <BookSubtitle>Magical Children's Book</BookSubtitle>
                    </div>
                  </BookCover>
                  
                </BookSection>

                <DetailsSection>
                  <DetailsTitle>Détails du conte personnalisé</DetailsTitle>
                  
                  <DetailsGrid>
                    <div>
                      <SectionTitle>📚 Histoire</SectionTitle>
                      <DetailsList>
                        <DetailItem>
                          <DetailLabel>Titre :</DetailLabel>
                          <DetailValue>{story.title}</DetailValue>
                        </DetailItem>
                        <DetailItem>
                          <DetailLabel>Âge :</DetailLabel>
                          <DetailValue>{story.ageRange}</DetailValue>
                        </DetailItem>
                        <DetailItem>
                          <DetailLabel>Thème :</DetailLabel>
                          <DetailValue>{story.generalTheme}</DetailValue>
                        </DetailItem>
                        <DetailItem>
                          <DetailLabel>Sujet :</DetailLabel>
                          <DetailValue>{story.specificSubject}</DetailValue>
                        </DetailItem>
                        <DetailItem>
                          <DetailLabel>Message :</DetailLabel>
                          <DetailValue>{story.centralMessage}</DetailValue>
                        </DetailItem>
                        <DetailItem>
                          <DetailLabel>Style :</DetailLabel>
                          <DetailValue>{story.illustrationStyle}</DetailValue>
                        </DetailItem>
                      </DetailsList>
                    </div>

                    <div>
                      <SectionTitle>👤 Personnages</SectionTitle>
                      <DetailsList>
                        <DetailItem>
                          <DetailLabel>Prénom :</DetailLabel>
                          <DetailValue>{story.protagonistName}</DetailValue>
                        </DetailItem>
                        <DetailItem>
                          <DetailLabel>Âge :</DetailLabel>
                          <DetailValue>{story.protagonistAge}</DetailValue>
                        </DetailItem>
                        <DetailItem>
                          <DetailLabel>Yeux :</DetailLabel>
                          <DetailValue>{story.eyeColor}</DetailValue>
                        </DetailItem>
                        <DetailItem>
                          <DetailLabel>Cheveux :</DetailLabel>
                          <DetailValue>{story.hairColor}</DetailValue>
                        </DetailItem>
                        {story.secondaryCharacterName && (
                          <>
                            <DetailItem>
                              <DetailLabel>Compagnon :</DetailLabel>
                              <DetailValue>{story.secondaryCharacterName}</DetailValue>
                            </DetailItem>
                            <DetailItem>
                              <DetailLabel>Type :</DetailLabel>
                              <DetailValue>{story.secondaryCharacterAge}</DetailValue>
                            </DetailItem>
                          </>
                        )}
                      </DetailsList>
                    </div>
                  </DetailsGrid>
                  
                  <ActionButtons>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => handleViewExample(story)}
                    >
                      Voir l'exemple
                    </Button>
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => navigate('/create-story')}
                    >
                      ✨ Créer mon conte
                    </Button>
                  </ActionButtons>
                </DetailsSection>
              </ExampleCard>
            ))}
          </ExamplesGrid>
          
        </ContentContainer>
      </MainContent>
      <Footer />
      
      {/* Visionneuse d'image */}
      {isImageViewerOpen && selectedImage && (
        <ImageViewerOverlay onClick={closeImageViewer}>
          <ImageViewerContainer onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={closeImageViewer}>✕</CloseButton>
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

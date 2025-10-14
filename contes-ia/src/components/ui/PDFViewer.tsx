import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import * as pdfjsLib from 'pdfjs-dist';

// Configuration de PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

interface PDFViewerProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl?: string;
  title: string;
}

interface PageData {
  canvas: HTMLCanvasElement;
  pageNumber: number;
}

const ViewerOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #2c1810 0%, #1a0f0a 100%);
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  font-family: 'Georgia', serif;
`;

const ViewerContainer = styled.div`
  background: transparent;
  border-radius: 0;
  width: 95%;
  max-width: 1200px;
  height: 90%;
  max-height: 800px;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const ViewerHeader = styled.div`
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 8px 8px 0 0;
  backdrop-filter: blur(10px);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
`;

const ViewerTitle = styled.h3`
  margin: 0;
  color: #f5f5f5;
  font-size: ${theme.fontSizes.lg};
  font-family: 'Georgia', serif;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 20px;
  cursor: pointer;
  color: #f5f5f5;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.2s ease;
  backdrop-filter: blur(5px);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
  }
`;

const BookContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1200px;
  padding: 60px 20px 80px;
  position: relative;
`;

const BookWrapper = styled.div`
  position: relative;
  width: 800px;
  height: 600px;
  transform-style: preserve-3d;
  transition: transform 0.6s ease-in-out;
`;

const BookPage = styled.div<{ 
  isLeft: boolean; 
  isFlipping: boolean;
  zIndex: number;
}>`
  position: absolute;
  width: 400px;
  height: 600px;
  background: #fefefe;
  border: 1px solid #ddd;
  box-shadow: ${props => props.isLeft 
    ? '2px 0 10px rgba(0,0,0,0.1)' 
    : '-2px 0 10px rgba(0,0,0,0.1)'
  };
  transform-origin: ${props => props.isLeft ? 'right center' : 'left center'};
  transform: ${props => {
    if (props.isFlipping) {
      return props.isLeft 
        ? 'rotateY(-180deg)' 
        : 'rotateY(180deg)';
    }
    return 'rotateY(0deg)';
  }};
  transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  z-index: ${props => props.zIndex};
  ${props => props.isLeft ? 'left: 0;' : 'right: 0;'}
  border-radius: ${props => props.isLeft ? '8px 0 0 8px' : '0 8px 8px 0'};
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
`;

const PageCanvas = styled.canvas`
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  object-position: center;
`;

const NavigationControls = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 20px;
  background: rgba(0, 0, 0, 0.8);
  padding: 12px 24px;
  border-radius: 25px;
  backdrop-filter: blur(10px);
  z-index: 10;
`;

const NavButton = styled.button<{ disabled?: boolean }>`
  background: ${props => props.disabled ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)'};
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: ${props => props.disabled ? '#888' : '#f5f5f5'};
  padding: 10px 16px;
  border-radius: 20px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  &:disabled {
    opacity: 0.5;
  }
`;

const PageIndicator = styled.div`
  color: #f5f5f5;
  font-size: 14px;
  font-weight: 500;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  min-width: 120px;
  text-align: center;
`;

const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #f5f5f5;
  font-size: 18px;
  
  &::after {
    content: '';
    width: 40px;
    height: 40px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top: 3px solid #f5f5f5;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-left: 15px;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const PDFViewer: React.FC<PDFViewerProps> = ({ 
  isOpen, 
  onClose, 
  pdfUrl, 
  title 
}) => {
  const [currentSpread, setCurrentSpread] = useState(0); // 0 = pages 1-2, 1 = pages 3-4, etc.
  const [totalPages, setTotalPages] = useState(0);
  const [pages, setPages] = useState<PageData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);

  const loadPDF = async () => {
    if (!pdfUrl) return;
    
    setIsLoading(true);
    try {
      const loadingTask = pdfjsLib.getDocument(pdfUrl);
      const pdf = await loadingTask.promise;
      setTotalPages(pdf.numPages);
      
      const pagePromises: Promise<PageData>[] = [];
      
      for (let i = 1; i <= pdf.numPages; i++) {
        pagePromises.push(
          pdf.getPage(i).then(async (page) => {
            const viewport = page.getViewport({ scale: 1.0 });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d')!;
            
            // Ajuster les dimensions pour s'adapter au conteneur
            const containerWidth = 380; // largeur de la page moins padding
            const containerHeight = 580; // hauteur de la page moins padding
            
            const scaleX = containerWidth / viewport.width;
            const scaleY = containerHeight / viewport.height;
            const scale = Math.min(scaleX, scaleY); // Garder les proportions
            
            const scaledViewport = page.getViewport({ scale });
            
            canvas.height = scaledViewport.height;
            canvas.width = scaledViewport.width;
            
            await page.render({
              canvasContext: context,
              viewport: scaledViewport
            }).promise;
            
            return {
              canvas,
              pageNumber: i
            };
          })
        );
      }
      
      const loadedPages = await Promise.all(pagePromises);
      setPages(loadedPages);
    } catch (error) {
      console.error('Erreur lors du chargement du PDF:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const goToNextSpread = () => {
    if (currentSpread < Math.ceil(totalPages / 2) - 1) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentSpread(prev => prev + 1);
        setIsFlipping(false);
      }, 400);
    }
  };

  const goToPrevSpread = () => {
    if (currentSpread > 0) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentSpread(prev => prev - 1);
        setIsFlipping(false);
      }, 400);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen && pdfUrl) {
      setCurrentSpread(0);
      loadPDF();
    }
  }, [isOpen, pdfUrl]);

  useEffect(() => {
    // Mettre à jour les canvas quand les pages changent
    pages.forEach((pageData, index) => {
      const canvasRef = canvasRefs.current[index];
      if (canvasRef && pageData.canvas) {
        const ctx = canvasRef.getContext('2d')!;
        canvasRef.width = pageData.canvas.width;
        canvasRef.height = pageData.canvas.height;
        ctx.drawImage(pageData.canvas, 0, 0);
      }
    });
  }, [pages]);

  if (!isOpen) return null;

  const leftPageIndex = currentSpread * 2;
  const rightPageIndex = currentSpread * 2 + 1;
  const hasLeftPage = leftPageIndex < pages.length;
  const hasRightPage = rightPageIndex < pages.length;

  return (
    <ViewerOverlay $isOpen={isOpen} onClick={handleOverlayClick}>
      <ViewerContainer>
        <ViewerHeader>
          <ViewerTitle>{title}</ViewerTitle>
          <CloseButton onClick={onClose}>✕</CloseButton>
        </ViewerHeader>
        
        <BookContainer>
          {isLoading ? (
            <LoadingSpinner>Chargement du conte...</LoadingSpinner>
          ) : (
            <BookWrapper>
              {/* Page de gauche */}
              {hasLeftPage && (
                <BookPage 
                  isLeft={true} 
                  isFlipping={isFlipping}
                  zIndex={2}
                >
                  <PageCanvas 
                    ref={el => {
                      canvasRefs.current[leftPageIndex] = el;
                    }}
                  />
                </BookPage>
              )}
              
              {/* Page de droite */}
              {hasRightPage && (
                <BookPage 
                  isLeft={false} 
                  isFlipping={isFlipping}
                  zIndex={1}
                >
                  <PageCanvas 
                    ref={el => {
                      canvasRefs.current[rightPageIndex] = el;
                    }}
                  />
                </BookPage>
              )}
            </BookWrapper>
          )}
        </BookContainer>
        
        <NavigationControls>
          <NavButton 
            onClick={goToPrevSpread} 
            disabled={currentSpread === 0 || isFlipping}
          >
            ← Précédent
          </NavButton>
          
          <PageIndicator>
            Pages {leftPageIndex + 1}-{Math.min(rightPageIndex + 1, totalPages)} sur {totalPages}
          </PageIndicator>
          
          <NavButton 
            onClick={goToNextSpread} 
            disabled={currentSpread >= Math.ceil(totalPages / 2) - 1 || isFlipping}
          >
            Suivant →
          </NavButton>
        </NavigationControls>
      </ViewerContainer>
    </ViewerOverlay>
  );
};

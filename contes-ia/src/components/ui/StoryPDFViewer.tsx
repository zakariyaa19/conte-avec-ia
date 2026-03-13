import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import styled, { keyframes } from 'styled-components';
import { theme } from '../../styles/theme';

// Worker PDF.js — fichier local copie depuis react-pdf/node_modules/pdfjs-dist
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface StoryPDFViewerProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string | null;
  title: string;
  onDownload?: () => void;
}

/* ─── Animations ─── */

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

/* ─── Styled Components ─── */

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  flex-direction: column;
  background: ${theme.colors.background.primary};
  animation: ${fadeIn} 0.25s ease-out;
  overflow: hidden;

  /* Empêcher le scroll du body */
  touch-action: none;
`;

const TopBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: ${theme.colors.background.white};
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  z-index: 10;
  flex-shrink: 0;
  min-height: 56px;
  gap: 8px;

  @media (min-width: ${theme.breakpoints.md}) {
    padding: 14px 24px;
  }
`;

const TopBarTitle = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.base};
  color: ${theme.colors.text.primary};
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
  flex: 1;

  @media (min-width: ${theme.breakpoints.md}) {
    font-size: ${theme.fontSizes.lg};
  }
`;

const TopBarActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

const IconButton = styled.button<{ $variant?: 'default' | 'close' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${theme.borderRadius.lg};
  border: none;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.2s ease;
  background: ${props => props.$variant === 'close'
    ? 'rgba(0,0,0,0.06)'
    : `${theme.colors.accent.coral}12`
  };
  color: ${props => props.$variant === 'close'
    ? theme.colors.text.secondary
    : theme.colors.accent.coral
  };

  &:hover {
    background: ${props => props.$variant === 'close'
      ? 'rgba(0,0,0,0.1)'
      : `${theme.colors.accent.coral}20`
    };
  }

  &:active {
    transform: scale(0.95);
  }

  @media (min-width: ${theme.breakpoints.md}) {
    width: 44px;
    height: 44px;
    font-size: 20px;
  }
`;

const ScrollContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  background: ${theme.colors.background.secondary};
  touch-action: pan-y pinch-zoom;
`;

const PagesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 0;
  gap: 12px;

  @media (min-width: ${theme.breakpoints.md}) {
    padding: 32px 0;
    gap: 24px;
  }
`;

const PageWrapper = styled.div`
  width: 100%;
  max-width: 950px;
  display: flex;
  justify-content: center;
  animation: ${slideUp} 0.4s ease-out both;
  border-radius: ${theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  background: white;

  /* react-pdf canvas responsive */
  .react-pdf__Page {
    display: flex !important;
    justify-content: center !important;
  }

  .react-pdf__Page__canvas {
    width: 100% !important;
    height: auto !important;
  }

  .react-pdf__Page__textContent,
  .react-pdf__Page__annotations {
    display: none !important;
  }

  @media (min-width: ${theme.breakpoints.md}) {
    border-radius: ${theme.borderRadius.xl};
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
`;

const PageSkeleton = styled.div`
  width: 100%;
  max-width: 950px;
  aspect-ratio: 1.4;
  border-radius: ${theme.borderRadius.lg};
  background: linear-gradient(
    90deg,
    ${theme.colors.background.secondary} 25%,
    ${theme.colors.background.white} 50%,
    ${theme.colors.background.secondary} 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;

  @media (min-width: ${theme.breakpoints.md}) {
    border-radius: ${theme.borderRadius.xl};
  }
`;

const PageIndicator = styled.div<{ $visible: boolean }>`
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10001;
  background: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 8px 20px;
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  opacity: ${props => props.$visible ? 1 : 0};
  transition: opacity 0.3s ease;
  pointer-events: none;
  white-space: nowrap;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);

  @media (min-width: ${theme.breakpoints.md}) {
    bottom: 32px;
    font-size: ${theme.fontSizes.base};
    padding: 10px 24px;
  }
`;

const LoadingOverlay = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: ${theme.colors.text.secondary};
  padding: 40px;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${theme.colors.background.secondary};
  border-top-color: ${theme.colors.accent.coral};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const ErrorContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 40px 24px;
  text-align: center;
`;

const ErrorIcon = styled.div`
  font-size: 48px;
  margin-bottom: 8px;
`;

const ErrorText = styled.p`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.fontSizes.base};
  max-width: 320px;
  line-height: 1.6;
`;

const RetryButton = styled.button`
  padding: 10px 24px;
  border-radius: ${theme.borderRadius.lg};
  border: 2px solid ${theme.colors.accent.coral};
  background: transparent;
  color: ${theme.colors.accent.coral};
  font-weight: 600;
  font-size: ${theme.fontSizes.sm};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${theme.colors.accent.coral};
    color: white;
  }
`;

/* ─── Component ─── */

export const StoryPDFViewer: React.FC<StoryPDFViewerProps> = ({
  isOpen,
  onClose,
  pdfUrl,
  title,
  onDownload
}) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingDoc, setLoadingDoc] = useState(true);
  const [error, setError] = useState(false);
  const [showIndicator, setShowIndicator] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const indicatorTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Bloquer le scroll du body quand ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [isOpen]);

  // Mesurer la largeur du conteneur pour le rendu responsive
  useEffect(() => {
    if (!isOpen) return;

    const measure = () => {
      if (scrollRef.current) {
        const w = scrollRef.current.clientWidth;
        setContainerWidth(Math.min(w, 950));
      }
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [isOpen]);

  // IntersectionObserver pour tracker la page visible
  useEffect(() => {
    if (!isOpen || numPages === 0) return;

    const currentPageRef = { value: currentPage };

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const pageNum = Number(entry.target.getAttribute('data-page'));
            if (pageNum && pageNum !== currentPageRef.value) {
              currentPageRef.value = pageNum;
              setCurrentPage(pageNum);
              setShowIndicator(true);

              if (indicatorTimeout.current) clearTimeout(indicatorTimeout.current);
              indicatorTimeout.current = setTimeout(() => setShowIndicator(false), 1500);
            }
          }
        }
      },
      {
        root: scrollRef.current,
        threshold: 0.5,
      }
    );

    pageRefs.current.forEach((ref) => {
      if (ref) observerRef.current!.observe(ref);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [isOpen, numPages]); // removed currentPage to prevent observer recreation loop

  const onDocumentLoadSuccess = useCallback(({ numPages: n }: { numPages: number }) => {
    setNumPages(n);
    setLoadingDoc(false);
    setError(false);
    setCurrentPage(1);
  }, []);

  const onDocumentLoadError = useCallback(() => {
    setLoadingDoc(false);
    setError(true);
  }, []);

  const handleRetry = () => {
    setError(false);
    setLoadingDoc(true);
  };

  // Fermer avec Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <Overlay $isOpen={isOpen}>
      <TopBar>
        <TopBarTitle>{title}</TopBarTitle>
        <TopBarActions>
          {onDownload && (
            <IconButton onClick={onDownload} title="Telecharger le PDF" aria-label="Telecharger">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </IconButton>
          )}
          <IconButton $variant="close" onClick={onClose} title="Fermer" aria-label="Fermer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </IconButton>
        </TopBarActions>
      </TopBar>

      {error ? (
        <ErrorContainer>
          <ErrorIcon>😔</ErrorIcon>
          <ErrorText>
            Impossible de charger le conte. Verifiez votre connexion internet et reessayez.
          </ErrorText>
          <RetryButton onClick={handleRetry}>Reessayer</RetryButton>
        </ErrorContainer>
      ) : (
        <ScrollContainer ref={scrollRef}>
          {pdfUrl && (
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={
                <LoadingOverlay>
                  <Spinner />
                  <span>Chargement du conte...</span>
                </LoadingOverlay>
              }
            >
              <PagesWrapper>
                {loadingDoc ? (
                  <>
                    <PageSkeleton />
                    <PageSkeleton />
                    <PageSkeleton />
                  </>
                ) : (
                  Array.from({ length: numPages }, (_, i) => (
                    <PageWrapper
                      key={`page-${i + 1}`}
                      ref={(el) => { pageRefs.current[i] = el; }}
                      data-page={i + 1}
                      style={{ animationDelay: `${Math.min(i * 0.05, 0.3)}s` }}
                    >
                      <Page
                        pageNumber={i + 1}
                        width={containerWidth || undefined}
                        loading={<PageSkeleton />}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                      />
                    </PageWrapper>
                  ))
                )}
              </PagesWrapper>
            </Document>
          )}
        </ScrollContainer>
      )}

      {numPages > 0 && !error && (
        <PageIndicator $visible={showIndicator}>
          {currentPage} / {numPages}
        </PageIndicator>
      )}
    </Overlay>
  );
};

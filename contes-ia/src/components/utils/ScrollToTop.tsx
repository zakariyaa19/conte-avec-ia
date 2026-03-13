import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Scroll vers le haut à chaque changement de route
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });

    // Skip le premier rendu : index.html fire déjà PageView + ttq.page() au chargement initial
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Meta Pixel : signaler chaque navigation SPA à Facebook
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView');
    }

    // TikTok Pixel : signaler chaque navigation SPA à TikTok
    if (typeof window !== 'undefined' && (window as any).ttq) {
      (window as any).ttq.page();
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;

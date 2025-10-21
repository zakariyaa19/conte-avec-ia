// Configuration des URLs pour l'application
const getApiBaseUrl = () => {
  // Si une URL API est explicitement définie, l'utiliser
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Détection automatique de l'environnement
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // Production sur contedia.fr
    if (hostname === 'contedia.fr' || hostname.includes('contedia')) {
      return 'https://conte-avec-ia-1.onrender.com';
    }
    
    // Vercel preview deployments
    if (hostname.includes('vercel.app')) {
      return 'https://conte-avec-ia-1.onrender.com';
    }
  }
  
  // Fallback pour développement local
  return 'http://localhost:5001';
};

export const API_BASE_URL = getApiBaseUrl();

// Helper pour construire les URLs d'images
export const getImageUrl = (photoUrl: string | null): string | undefined => {
  if (!photoUrl) return undefined;
  
  // Si l'URL commence déjà par http, la retourner telle quelle
  if (photoUrl.startsWith('http')) {
    return photoUrl;
  }
  
  // Extraire le nom du fichier du chemin
  let filename = photoUrl;
  if (photoUrl.startsWith('/uploads/')) {
    filename = photoUrl.replace('/uploads/', '');
  } else if (photoUrl.startsWith('/images/')) {
    filename = photoUrl.replace('/images/', '');
  } else if (photoUrl.startsWith('uploads/')) {
    filename = photoUrl.replace('uploads/', '');
  } else if (photoUrl.startsWith('images/')) {
    filename = photoUrl.replace('images/', '');
  }
  
  // Utiliser la nouvelle route API pour les images
  return `${API_BASE_URL}/files/image/${filename}`;
};

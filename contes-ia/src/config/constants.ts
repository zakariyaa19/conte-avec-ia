// Configuration des URLs pour l'application
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

// Helper pour construire les URLs d'images
export const getImageUrl = (photoUrl: string | null): string | undefined => {
  if (!photoUrl) return undefined;
  
  // Si l'URL commence déjà par http, la retourner telle quelle
  if (photoUrl.startsWith('http')) {
    return photoUrl;
  }
  
  // Sinon, construire l'URL complète avec le serveur backend
  return `${API_BASE_URL}${photoUrl}`;
};

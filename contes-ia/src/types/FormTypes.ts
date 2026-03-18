// Types pour le formulaire de commande

export interface SecondaryCharacter {
  kind: 'human' | 'animal';
  name: string;
  ageOrType: string;
  physical?: string;
}

export interface StoryFormData {
  // Étape 1 - Personnalisez votre conte
  ageRange: string;
  generalTheme: string;
  customTheme?: string;
  specificSubject: string;
  customSubject?: string;
  centralMessage: string;
  customMessage?: string;
  illustrationStyle: string;
  
  // Étape 2 - Créons le héros de l'histoire
  protagonistName: string;
  protagonistAge: string;
  protagonistGender: 'boy' | 'girl';
  appearanceMode?: 'photo' | 'manual';
  eyeColor?: string;
  hairColor?: string;
  skinColor?: string;
  photo?: File;
  
  // Langue du conte
  language: string;
  
  // Informations supplémentaires (facultatif)
  hobbies?: string;
  favoriteDish?: string;
  specialEvents?: string;
  
  // Option religieuse (facultatif)
  religion?: string;
  customReligion?: string;
  
  // Personnages secondaires (jusqu'à 5)
  secondaryCharacters?: SecondaryCharacter[];
  
  // Anciens champs (pour rétrocompatibilité temporaire)
  secondaryCharacterName?: string;
  secondaryCharacterAge?: string;
  
  // Détails personnels
  creatorName?: string;
  narratedBy?: string; // Club only: "Raconté par..."
  
  // Preview data (passed to order for reuse in generation)
  firstIllustrationUrl?: string;
  storyPreviewTextJson?: string;

  // Etape 3 - Paiement et informations
  userEmail: string;
  password?: string;
  coverImageBase64?: string;
  coverTitle?: string;
  productType: 'ebook';
  purchaseType?: 'single' | 'club';
  billingPeriod?: 'monthly' | 'annual';
  firstName?: string;
  lastName?: string;
}

export interface FormStep {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
}

// Options pour les sélections
export const AGE_RANGES = [
  { value: '0-2', label: '0-2 ans', description: 'Histoires simples avec images colorées', imagePath: '/image/ageenfant/age-0-2.png' },
  { value: '3-5', label: '3-5 ans', description: 'Contes courts avec vocabulaire adapté', imagePath: '/image/ageenfant/age-3-5.png' },
  { value: '6-9', label: '6-9 ans', description: 'Histoires plus longues et aventures', imagePath: '/image/ageenfant/age-6-9.png' },
  { value: '10+', label: '10+ ans', description: 'Récits complexes et personnages développés', imagePath: '/image/ageenfant/age-10-plus.png' }
];

export const GENERAL_THEMES = [
  { value: 'educational', label: 'Éducatif', icon: '📚', imagePath: '/image/themes/educatif.png' },
  { value: 'fairy-tales', label: 'Contes de fées', icon: '🧚‍♀️', imagePath: '/image/themes/contes-de-fees.png' },
  { value: 'activities', label: 'Activités', icon: '🎨', imagePath: '/image/themes/activites.png' },
  { value: 'stories', label: 'Histoires', icon: '📖', imagePath: '/image/themes/histoires.png' },
  { value: 'celebrations', label: 'Fêtes', icon: '🎉', imagePath: '/image/themes/fetes.png' },
  { value: 'family', label: 'Famille', icon: '👨‍👩‍👧‍👦', imagePath: '/image/themes/famille.png' }
];

export const SPECIFIC_SUBJECTS = [
  { value: 'birthday', label: 'Anniversaire', icon: '🎂', imagePath: '/image/occasions/anniversaire.png' },
  { value: 'christmas', label: 'Noël', icon: '🎄', imagePath: '/image/occasions/noel.png' },
  { value: 'new-year', label: 'Nouvel An', icon: '🎆', imagePath: '/image/occasions/nouvel-an.png' },
  { value: 'easter', label: 'Pâques', icon: '🐣', imagePath: '/image/occasions/paques.png' },
  { value: 'eid', label: 'Aïd el-Fitr', icon: '🌙', imagePath: '/image/occasions/aid.png' },
  { value: 'mothers-day', label: 'Fête des mères', icon: '💐', imagePath: '/image/occasions/fete-meres.png' },
  { value: 'fathers-day', label: 'Fête des pères', icon: '👨‍👧', imagePath: '/image/occasions/fete-peres.png' }
];

export const CENTRAL_MESSAGES = [
  { value: 'friendship', label: 'Amitié', icon: '🤝', imagePath: '/image/messages/amitie.png' },
  { value: 'courage', label: 'Courage', icon: '💪', imagePath: '/image/messages/courage.png' },
  { value: 'love', label: 'Amour', icon: '❤️', imagePath: '/image/messages/amour.png' },
  { value: 'perseverance', label: 'Persévérance', icon: '🎯', imagePath: '/image/messages/perseverance.png' },
  { value: 'sharing', label: 'Partage', icon: '🤲', imagePath: '/image/messages/partage.png' },
  { value: 'honesty', label: 'Honnêteté', icon: '✨', imagePath: '/image/messages/honnetete.png' },
  { value: 'respect', label: 'Respect', icon: '🙏', imagePath: '/image/messages/respect.png' }
];

export const ILLUSTRATION_STYLES = [
  { value: 'watercolor', label: 'Aquarelle', icon: '🎨', imagePath: '/images/illustration-styles/aquarelle.jpg' },
  { value: '3d-animation', label: 'Animation 3D', icon: '🎬', imagePath: '/images/illustration-styles/animation-3d.jpg' },
  { value: 'block-world', label: 'Monde des blocs', icon: '🧱', imagePath: '/images/illustration-styles/monde-des-blocs.jpg' },
  { value: 'paper-cut', label: 'Papier découpé', icon: '✂️', imagePath: '/images/illustration-styles/papier-decoupe.jpg' },
  { value: 'clay-animation', label: 'Clay-animation', icon: '🏺', imagePath: '/images/illustration-styles/clay-animation.jpg' },
  { value: 'kawaii', label: 'Kawaii', icon: '🥰', imagePath: '/images/illustration-styles/kawaii.jpg' },
  { value: 'geometric', label: 'Géométrique', icon: '🔷', imagePath: '/images/illustration-styles/geometrique.jpg' },
  { value: 'illustrated-book', label: 'Livre illustré', icon: '📚', imagePath: '/images/illustration-styles/livre-illustre.jpg' },
  { value: 'japanese-manga', label: 'Dessin japonais / manga', icon: '🎌', imagePath: '/images/illustration-styles/dessin-japonais-manga.jpg' }
];

export const EYE_COLORS = [
  { value: 'brown', label: 'Marron', color: '#8B4513' },
  { value: 'blue', label: 'Bleu', color: '#4169E1' },
  { value: 'green', label: 'Vert', color: '#228B22' },
  { value: 'hazel', label: 'Noisette', color: '#CD853F' },
  { value: 'gray', label: 'Gris', color: '#708090' },
  { value: 'amber', label: 'Ambre', color: '#FFBF00' }
];

export const HAIR_COLORS = [
  { value: 'brown', label: 'Châtain', color: '#8B4513' },
  { value: 'blonde', label: 'Blond', color: '#FFD700' },
  { value: 'black', label: 'Noir', color: '#000000' },
  { value: 'red', label: 'Roux', color: '#FF4500' },
  { value: 'auburn', label: 'Auburn', color: '#A52A2A' },
  { value: 'gray', label: 'Gris', color: '#808080' }
];

export const SKIN_COLORS = [
  { value: 'light', label: 'Clair', color: '#FDDCB5' },
  { value: 'medium', label: 'Moyen', color: '#E8B88A' },
  { value: 'olive', label: 'Mat', color: '#C8915E' },
  { value: 'dark', label: 'Foncé', color: '#8D5524' }
];

export const LANGUAGES = [
  { value: 'french', label: 'Français', flag: '🇫🇷' },
  { value: 'english', label: 'Anglais', flag: '🇬🇧' },
  { value: 'spanish', label: 'Espagnol', flag: '🇪🇸' },
  { value: 'arabic', label: 'Arabe', flag: '🇸🇦' },
  { value: 'german', label: 'Allemand', flag: '🇩🇪' },
  { value: 'japanese', label: 'Japonais', flag: '🇯🇵' },
  { value: 'italian', label: 'Italien', flag: '🇮🇹' },
  { value: 'flemish', label: 'Flamand', flag: '🇧🇪' },
  { value: 'portuguese', label: 'Portugais', flag: '🇵🇹' },
  { value: 'polish', label: 'Polonais', flag: '🇵🇱' }
];

export const RELIGIONS = [
  { value: 'christian', label: 'Chrétien', icon: '✝️' },
  { value: 'jewish', label: 'Juif', icon: '✡️' },
  { value: 'muslim', label: 'Musulman', icon: '☪️' },
  { value: 'buddhist', label: 'Bouddhiste', icon: '🕉️' }
];

export const GENDERS = [
  { value: 'girl', label: 'Fille', icon: '👧' },
  { value: 'boy', label: 'Garçon', icon: '👦' }
];

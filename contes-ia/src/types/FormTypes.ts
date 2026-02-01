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
  eyeColor: string;
  hairColor: string;
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
  
  // Étape 3 - Paiement et informations
  userEmail: string;
  productType: 'ebook' | 'printed';
  shippingAddress?: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
  };
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
  { value: '0-2', label: '0-2 ans', description: 'Histoires simples avec images colorées' },
  { value: '3-5', label: '3-5 ans', description: 'Contes courts avec vocabulaire adapté' },
  { value: '6-9', label: '6-9 ans', description: 'Histoires plus longues et aventures' },
  { value: '10+', label: '10+ ans', description: 'Récits complexes et personnages développés' }
];

export const GENERAL_THEMES = [
  { value: 'educational', label: 'Éducatif', icon: '📚' },
  { value: 'fairy-tales', label: 'Contes de fées', icon: '🧚‍♀️' },
  { value: 'activities', label: 'Activités', icon: '🎨' },
  { value: 'stories', label: 'Histoires', icon: '📖' },
  { value: 'celebrations', label: 'Fêtes', icon: '🎉' },
  { value: 'family', label: 'Famille', icon: '👨‍👩‍👧‍👦' }
];

export const SPECIFIC_SUBJECTS = [
  { value: 'birthday', label: 'Anniversaire', icon: '🎂' },
  { value: 'christmas', label: 'Noël', icon: '🎄' },
  { value: 'new-year', label: 'Nouvel An', icon: '🎆' },
  { value: 'easter', label: 'Pâques', icon: '🐣' },
  { value: 'eid', label: 'Aïd el-Fitr', icon: '🌙' },
  { value: 'mothers-day', label: 'Fête des mères', icon: '💐' },
  { value: 'fathers-day', label: 'Fête des pères', icon: '👨‍👧' },
  { value: 'saint-nicolas', label: 'Saint-Nicolas', icon: '🎅' },
  { value: 'carnival', label: 'Carnaval', icon: '🎭' },
  { value: 'halloween', label: 'Halloween', icon: '👻' }
];

export const CENTRAL_MESSAGES = [
  { value: 'friendship', label: 'Amitié', icon: '🤝' },
  { value: 'courage', label: 'Courage', icon: '💪' },
  { value: 'nature-care', label: 'Prendre soin de la nature', icon: '🌱' },
  { value: 'love', label: 'Amour', icon: '❤️' },
  { value: 'perseverance', label: 'Persévérance', icon: '🎯' },
  { value: 'sharing', label: 'Partage', icon: '🤲' },
  { value: 'honesty', label: 'Honnêteté', icon: '✨' },
  { value: 'respect', label: 'Respect', icon: '🙏' }
];

export const ILLUSTRATION_STYLES = [
  { value: 'watercolor', label: 'Aquarelle', icon: '🎨' },
  { value: '3d-animation', label: 'Animation 3D', icon: '🎬' },
  { value: 'block-world', label: 'Monde des blocs', icon: '🧱' },
  { value: 'paper-cut', label: 'Papier découpé', icon: '✂️' },
  { value: 'clay-animation', label: 'Clay-animation', icon: '🏺' },
  { value: 'kawaii', label: 'Kawaii', icon: '🥰' },
  { value: 'geometric', label: 'Géométrique', icon: '🔷' },
  { value: 'illustrated-book', label: 'Livre illustré', icon: '📚' },
  { value: 'japanese-manga', label: 'Dessin japonais / manga', icon: '🎌' }
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

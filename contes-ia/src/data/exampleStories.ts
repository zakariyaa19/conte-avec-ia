export interface ExampleStory {
  id: string;
  title: string;
  ageRange: string;
  generalTheme: string;
  specificSubject: string;
  centralMessage: string;
  illustrationStyle: string;
  protagonistName: string;
  protagonistAge: string;
  eyeColor: string;
  hairColor: string;
  secondaryCharacterName?: string;
  secondaryCharacterAge?: string;
  coverImage: string;
  userPhotos: string[];
  characterCount: number;
  pdfUrl?: string;
}

export const exampleStories: ExampleStory[] = [
  {
    id: "1",
    title: "Dans la Forêt Magique : Une Histoire de Confiance",
    ageRange: "10-16 ans",
    generalTheme: "Activités",
    specificSubject: "Au bois",
    centralMessage: "Rêves Sucrés",
    illustrationStyle: "Animation 3D",
    protagonistName: "Emma",
    protagonistAge: "8 ans",
    eyeColor: "Marron",
    hairColor: "Châtain",
    secondaryCharacterName: "Rex",
    secondaryCharacterAge: "Chien",
    coverImage: "/images/covers/forest-adventure.jpg",
    userPhotos: ["/images/examples/girl-glasses.jpg", "/images/examples/dog-border-collie.jpg"],
    characterCount: 2,
    pdfUrl: "/pdfs/forest-adventure.pdf"
  },
  {
    id: "2",
    title: "Les Étoiles de Luna : Un Voyage Cosmique",
    ageRange: "6-10 ans",
    generalTheme: "Science",
    specificSubject: "L'espace",
    centralMessage: "Curiosité et Découverte",
    illustrationStyle: "Aquarelle",
    protagonistName: "Luna",
    protagonistAge: "7 ans",
    eyeColor: "Bleu",
    hairColor: "Noir",
    secondaryCharacterName: "Stella",
    secondaryCharacterAge: "Chat",
    coverImage: "/images/covers/space-adventure.jpg",
    userPhotos: ["/images/examples/girl-curly.jpg", "/images/examples/cat-white.jpg"],
    characterCount: 2,
    pdfUrl: "/pdfs/space-adventure.pdf"
  },
  {
    id: "3",
    title: "Le Petit Chef Léo : Recettes Magiques",
    ageRange: "4-8 ans",
    generalTheme: "Cuisine",
    specificSubject: "Apprendre à cuisiner",
    centralMessage: "Partage et Générosité",
    illustrationStyle: "Cartoon",
    protagonistName: "Léo",
    protagonistAge: "6 ans",
    eyeColor: "Vert",
    hairColor: "Blond",
    secondaryCharacterName: "Grand-mère Marie",
    secondaryCharacterAge: "65 ans",
    coverImage: "/images/covers/cooking-adventure.jpg",
    userPhotos: ["/images/examples/boy-blonde.jpg", "/images/examples/grandmother.jpg"],
    characterCount: 2,
    pdfUrl: "/pdfs/cooking-adventure.pdf"
  },
  {
    id: "4",
    title: "Zoé et le Royaume des Océans",
    ageRange: "8-12 ans",
    generalTheme: "Nature",
    specificSubject: "Océan et vie marine",
    centralMessage: "Protection de l'Environnement",
    illustrationStyle: "Réaliste",
    protagonistName: "Zoé",
    protagonistAge: "9 ans",
    eyeColor: "Bleu",
    hairColor: "Roux",
    secondaryCharacterName: "Nemo",
    secondaryCharacterAge: "Poisson",
    coverImage: "/images/covers/ocean-adventure.jpg",
    userPhotos: ["/images/examples/girl-red-hair.jpg", "/images/examples/fish-colorful.jpg"],
    characterCount: 2,
    pdfUrl: "/pdfs/ocean-adventure.pdf"
  },
  {
    id: "5",
    title: "Max le Brave : L'École des Héros",
    ageRange: "6-10 ans",
    generalTheme: "École",
    specificSubject: "Premier jour d'école",
    centralMessage: "Courage et Amitié",
    illustrationStyle: "Bande Dessinée",
    protagonistName: "Max",
    protagonistAge: "6 ans",
    eyeColor: "Marron",
    hairColor: "Brun",
    coverImage: "/images/covers/school-adventure.jpg",
    userPhotos: ["/images/examples/boy-brown-hair.jpg"],
    characterCount: 1,
    pdfUrl: "/pdfs/school-adventure.pdf"
  },
  {
    id: "6",
    title: "Zak passe l'examen Hunter",
    ageRange: "10+ ans",
    generalTheme: "sport",
    specificSubject: "courage",
    centralMessage: "Patience et Persévérance",
    illustrationStyle: "japonais manga",
    protagonistName: "Zak",
    protagonistAge: "11 ans",
    eyeColor: "Bleu",
    hairColor: "châtains",
    secondaryCharacterName: "Sylvie",
    secondaryCharacterAge: "Chat-dragon",
    coverImage: "/images/covers/examen-hunter.jpg",
    userPhotos: ["/images/examples/girl-blonde.jpg", "/images/examples/butterfly.jpg"],
    characterCount: 2,
    pdfUrl: "/pdfs/examen-hunter.pdf"
  }
];

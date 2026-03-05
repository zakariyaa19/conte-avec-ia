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
  skinColor: string;
  secondaryCharacterName?: string;
  secondaryCharacterAge?: string;
  coverImage: string;
  userPhotos: string[];
  characterCount: number;
  pdfUrl?: string;
}

export const exampleStories: ExampleStory[] = [
  {
    id: "emma-noel",
    title: "Emma et le Noel enchante",
    ageRange: "4-8 ans",
    generalTheme: "Fetes",
    specificSubject: "Noel en famille",
    centralMessage: "Amour familial et Partage",
    illustrationStyle: "Animation 3D",
    protagonistName: "Emma",
    protagonistAge: "7 ans",
    eyeColor: "Marron",
    hairColor: "Chatain",
    skinColor: "Clair",
    secondaryCharacterName: "Papa",
    secondaryCharacterAge: "Adulte",
    coverImage: "/images/covers/emma-noel.jpg",
    userPhotos: [],
    characterCount: 2,
    pdfUrl: "/pdfs/emma-noel.pdf"
  },
  {
    id: "hajar-ramadan",
    title: "Hajar et la magie du Ramadan",
    ageRange: "4-10 ans",
    generalTheme: "Culture",
    specificSubject: "Ramadan en famille",
    centralMessage: "Patience et Foi",
    illustrationStyle: "Kawaii",
    protagonistName: "Hajar",
    protagonistAge: "7 ans",
    eyeColor: "Marron",
    hairColor: "Brun",
    skinColor: "Moyen",
    secondaryCharacterName: "Mami Mika",
    secondaryCharacterAge: "Adulte",
    coverImage: "/images/covers/hajar-ramadan.jpg",
    userPhotos: [],
    characterCount: 2,
    pdfUrl: "/pdfs/hajar-ramadan.pdf"
  },
  {
    id: "younes-paques",
    title: "Younes et l'Escalade des Oeufs Magiques",
    ageRange: "3-8 ans",
    generalTheme: "Fetes",
    specificSubject: "Chasse aux oeufs de Paques",
    centralMessage: "Joie et Decouverte",
    illustrationStyle: "Papier Decoupe",
    protagonistName: "Younes",
    protagonistAge: "5 ans",
    eyeColor: "Marron",
    hairColor: "Noir",
    skinColor: "Mat",
    coverImage: "/images/covers/younes-paques.jpg",
    userPhotos: [],
    characterCount: 1,
    pdfUrl: "/pdfs/younes-paques.pdf"
  },
  {
    id: "adele-carnaval",
    title: "Adele et les Masques Magiques du Carnaval",
    ageRange: "0-3 ans",
    generalTheme: "Fetes",
    specificSubject: "Carnaval et deguisements",
    centralMessage: "Emerveillement et Imagination",
    illustrationStyle: "Animation 3D",
    protagonistName: "Adele",
    protagonistAge: "1 an",
    eyeColor: "Marron",
    hairColor: "Chatain",
    skinColor: "Clair",
    coverImage: "/images/covers/adele-carnaval.jpg",
    userPhotos: [],
    characterCount: 1,
    pdfUrl: "/pdfs/adele-carnaval.pdf"
  }
];

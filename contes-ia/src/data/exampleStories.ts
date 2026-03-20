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
  protagonistGender?: string;
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
    id: "emmie-aventures",
    title: "Les Aventures Magiques d'Emmie",
    ageRange: "6-9 ans",
    generalTheme: "Contes de fees",
    specificSubject: "Contes de fees",
    centralMessage: "Aventure et Decouverte",
    illustrationStyle: "Animation 3D",
    protagonistName: "Emmie",
    protagonistAge: "7 ans",
    protagonistGender: "girl",
    eyeColor: "",
    hairColor: "",
    skinColor: "",
    coverImage: "https://res.cloudinary.com/ddcfqlkrd/image/upload/v1774018112/conte-ia/covers/cover-1774018111614-186146487.png",
    userPhotos: [],
    characterCount: 1,
    pdfUrl: "https://res.cloudinary.com/ddcfqlkrd/raw/upload/v1774018306/conte-ia/pdfs/story-cmmz0kwlk0001rr2aolxiphqc-1774018305987"
  },
  {
    id: "rayan-dino-paques",
    title: "Rayan et le Dino de Paques",
    ageRange: "3-5 ans",
    generalTheme: "Fetes",
    specificSubject: "Paques",
    centralMessage: "Partage",
    illustrationStyle: "Animation 3D",
    protagonistName: "Rayan",
    protagonistAge: "3 ans",
    protagonistGender: "boy",
    eyeColor: "",
    hairColor: "",
    skinColor: "",
    coverImage: "https://res.cloudinary.com/ddcfqlkrd/image/upload/v1774009120/conte-ia/covers/cover-1774009119376-652266210.png",
    userPhotos: [],
    characterCount: 1,
    pdfUrl: "https://res.cloudinary.com/ddcfqlkrd/raw/upload/v1774008102/conte-ia/pdfs/story-cmmyug1tj0007pp29eaxoauab-1774008102174"
  },
  {
    id: "timeo-noel",
    title: "Timeo et le fruit enchante de Noel",
    ageRange: "3-5 ans",
    generalTheme: "Fetes",
    specificSubject: "Noel en famille",
    centralMessage: "Amour",
    illustrationStyle: "Kawaii",
    protagonistName: "Timéo",
    protagonistAge: "4 ans",
    protagonistGender: "boy",
    eyeColor: "",
    hairColor: "",
    skinColor: "",
    coverImage: "https://res.cloudinary.com/ddcfqlkrd/image/upload/v1774005307/conte-ia/covers/cover-1774005306089-669886729.png",
    userPhotos: [],
    characterCount: 1,
    pdfUrl: "https://res.cloudinary.com/ddcfqlkrd/raw/upload/v1774007316/conte-ia/pdfs/story-cmmysygbf0001pp29k87lb1xs-1774007316100"
  },
  {
    id: "ethan-etoiles",
    title: "Ethan et le Voyage des Etoiles",
    ageRange: "6-9 ans",
    generalTheme: "Aventure",
    specificSubject: "Voyage spatial",
    centralMessage: "Courage et Curiosite",
    illustrationStyle: "Animation 3D",
    protagonistName: "Ethan",
    protagonistAge: "7 ans",
    protagonistGender: "boy",
    eyeColor: "",
    hairColor: "",
    skinColor: "",
    coverImage: "https://res.cloudinary.com/ddcfqlkrd/image/upload/v1774002706/conte-ia/covers/cover-1774002706211-337991428.png",
    userPhotos: [],
    characterCount: 1,
    pdfUrl: "https://res.cloudinary.com/ddcfqlkrd/raw/upload/v1774002899/conte-ia/pdfs/story-cmmyrepnd0001ne1tz88fo1a9-1774002899048"
  },
  {
    id: "enzo-anniversaire",
    title: "Enzo et les Coquillages Magiques de l'Anniversaire",
    ageRange: "3-5 ans",
    generalTheme: "Fetes",
    specificSubject: "Anniversaire",
    centralMessage: "Respect",
    illustrationStyle: "Manga",
    protagonistName: "Enzo",
    protagonistAge: "4 ans",
    protagonistGender: "boy",
    eyeColor: "",
    hairColor: "",
    skinColor: "",
    coverImage: "https://res.cloudinary.com/ddcfqlkrd/image/upload/v1773942968/conte-ia/covers/cover-1773942967849-276520848.png",
    userPhotos: [],
    characterCount: 1,
    pdfUrl: "https://res.cloudinary.com/ddcfqlkrd/raw/upload/v1773943320/conte-ia/pdfs/story-cmmxrucku000boj2c1q5bj9ab-1773943320454"
  }
];

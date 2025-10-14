// Types partagés pour l'API Backend

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
  photo?: Express.Multer.File;
  
  // Langue du conte
  language: string;
  
  // Informations supplémentaires (facultatif)
  hobbies?: string;
  favoriteDish?: string;
  specialEvents?: string;
  
  // Option religieuse (facultatif)
  religion?: string;
  customReligion?: string;
  
  // Personnage secondaire (optionnel)
  secondaryCharacterName?: string;
  secondaryCharacterAge?: string;
  
  // Détails personnels
  creatorName?: string;
  
  // Étape 3 - Paiement
  productType: 'EBOOK' | 'PRINTED';
  shippingAddress?: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
  };
}

export interface CreateOrderRequest {
  formData: StoryFormData;
  userEmail?: string;
}

export interface PaymentIntentRequest {
  orderId: string;
  amount: number;
  currency: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface OrderFilters {
  status?: string;
  productType?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

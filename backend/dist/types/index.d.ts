export interface StoryFormData {
    ageRange: string;
    generalTheme: string;
    customTheme?: string;
    specificSubject: string;
    customSubject?: string;
    centralMessage: string;
    customMessage?: string;
    illustrationStyle: string;
    protagonistName: string;
    protagonistAge: string;
    protagonistGender: 'boy' | 'girl';
    eyeColor: string;
    hairColor: string;
    photo?: Express.Multer.File;
    language: string;
    hobbies?: string;
    favoriteDish?: string;
    specialEvents?: string;
    religion?: string;
    customReligion?: string;
    secondaryCharacterName?: string;
    secondaryCharacterAge?: string;
    creatorName?: string;
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
//# sourceMappingURL=index.d.ts.map
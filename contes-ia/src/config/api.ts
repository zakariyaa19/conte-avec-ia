// Configuration des URLs API
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
      return 'https://conte-avec-ia-backend.onrender.com';
    }
    
    // Vercel preview deployments
    if (hostname.includes('vercel.app')) {
      return 'https://conte-avec-ia-backend.onrender.com';
    }
  }
  
  // Fallback pour développement local
  return 'http://localhost:5001';
};

const baseUrl = getApiBaseUrl();

const API_CONFIG = {
  BASE_URL: baseUrl,
  ENDPOINTS: {
    // Health checks
    HEALTH: '/health',
    API_HEALTH: '/api/health',
    
    // Orders
    ORDERS: '/api/orders',
    ORDER_BY_ID: (id: string) => `/api/orders/${id}`,
    
    // Admin
    ADMIN_LOGIN: '/api/admin/login',
    ADMIN_DASHBOARD: '/api/admin/dashboard',
    ADMIN_ORDERS: '/api/admin/orders',
    
    // Database test
    TEST_DB: '/api/test-db'
  }
};

// Service API pour les requêtes
export class ApiService {
  private static baseUrl = API_CONFIG.BASE_URL;

  // Fonction de retry pour les requêtes critiques
  private static async requestWithRetry<T>(
    endpoint: string,
    options: RequestInit = {},
    maxRetries: number = 2
  ): Promise<T> {
    let lastError: Error | null = null;
      
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }

        return await this.request<T>(endpoint, options);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        // Ne pas retry sur certaines erreurs (4xx sauf 408, 429)
        if (error instanceof Error && error.message.includes('40') && 
            !error.message.includes('408') && !error.message.includes('429')) {
          throw error;
        }
      }
    }
    
    throw lastError ?? new Error('Request failed after retries');
  }

  // Create a timeout signal with AbortController fallback for older browsers
  private static createTimeoutSignal(ms: number): AbortSignal {
    if (typeof AbortSignal.timeout === 'function') {
      return AbortSignal.timeout(ms);
    }
    const controller = new AbortController();
    setTimeout(() => controller.abort(), ms);
    return controller.signal;
  }

  // Méthode générique pour les requêtes avec timeout
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const isFormData = options.body instanceof FormData;

    const config: RequestInit = {
      ...options,
      headers: {
        ...(!isFormData && { 'Content-Type': 'application/json' }),
        ...(options.headers as Record<string, string>),
      },
      signal: options.signal || this.createTimeoutSignal(60000),
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        let errorData: any = {};

        try {
          errorData = await response.json();
        } catch {
          // Response not JSON
        }

        if (response.status === 401) {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('userToken');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }

        throw new Error(errorData.message || `Erreur ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Erreur fetch:', url, error);
      throw error;
    }
  }

  // Health check
  static async checkHealth(): Promise<{ status: string; message: string }> {
    return this.request(API_CONFIG.ENDPOINTS.HEALTH);
  }

  // Test de la base de données
  static async testDatabase(): Promise<{ success: boolean; data: any }> {
    return this.request(API_CONFIG.ENDPOINTS.TEST_DB);
  }

  // Créer une commande (+ session Stripe inline, single round trip)
  static async createOrder(orderData: {
    userEmail: string;
    formData: any;
    authToken?: string;
  }): Promise<{ success: boolean; data: any; stripeUrl?: string; token?: string; user?: any; message: string; isClubFreeOrder?: boolean; isFirstBookFree?: boolean; clubCreditExhausted?: boolean; limitReached?: boolean; bookCount?: number; bookLimit?: number }> {
    const headers: Record<string, string> = {};
    if (orderData.authToken) {
      headers['Authorization'] = `Bearer ${orderData.authToken}`;
    }

    // Clean formData: remove heavy binary fields
    const cleanFormData = { ...orderData.formData };
    let photoFile = cleanFormData.photo instanceof File ? cleanFormData.photo : null;
    delete cleanFormData.photo;
    // TOUJOURS supprimer le base64 — la cover est sur Cloudinary ou sera générée par le backend
    delete cleanFormData.coverImageBase64;

    // Compresser la photo avant envoi (les photos iPhone font 8-15MB, on réduit à ~300KB)
    if (photoFile) {
      try {
        photoFile = await this.compressPhoto(photoFile);
      } catch (e) {
        console.warn('[API] Compression photo échouée, envoi original:', e);
      }

      const formDataToSend = new FormData();
      formDataToSend.append('userEmail', orderData.userEmail);
      formDataToSend.append('formData', JSON.stringify(cleanFormData));
      formDataToSend.append('photo', photoFile);

      return this.request(API_CONFIG.ENDPOINTS.ORDERS, {
        method: 'POST',
        body: formDataToSend,
        headers,
        signal: this.createTimeoutSignal(120000),
      });
    }

    // No photo: send JSON (faster, skips multer)
    return this.request(API_CONFIG.ENDPOINTS.ORDERS, {
      method: 'POST',
      body: JSON.stringify({
        userEmail: orderData.userEmail,
        formData: cleanFormData
      }),
      headers,
      signal: this.createTimeoutSignal(120000), // 2min for Stripe session creation
    });
  }

  // Créer une session de paiement Stripe (PAS de retry — fail fast pour UX rapide)
  static async createPaymentSession(orderId: string): Promise<{ sessionId: string; url: string }> {
    try {
      return await this.request<{ sessionId: string; url: string }>('/api/stripe/create-payment-session', {
        method: 'POST',
        body: JSON.stringify({ orderId }),
      });
    } catch (error) {
      console.error('❌ Erreur création session Stripe:', error);
      throw error;
    }
  }

  // Sauvegarder le cover image d'une commande
  static async saveCoverImage(orderId: string, coverImageBase64: string, coverTitle?: string): Promise<{ success: boolean; coverImageUrl?: string }> {
    return this.request(`/api/orders/${orderId}/cover`, {
      method: 'POST',
      body: JSON.stringify({ coverImageBase64, coverTitle }),
    });
  }

  // Upload cover base64 → Cloudinary AVANT la soumission du formulaire
  // Retourne l'URL Cloudinary pour l'inclure dans le JSON (quelques octets au lieu de 20MB)
  static async uploadCoverToCloud(coverImageBase64: string): Promise<{ success: boolean; url?: string }> {
    return this.request('/api/upload/cover', {
      method: 'POST',
      body: JSON.stringify({ coverImageBase64 }),
      signal: this.createTimeoutSignal(120000), // 2min pour upload gros fichier
    });
  }

  // Authentification admin
  static async adminLogin(email: string, password: string): Promise<{ success: boolean; data: any; message?: string }> {
    return this.request('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Dashboard admin
  static async getAdminDashboardStats(token: string): Promise<{ success: boolean; data: any }> {
    return this.request('/api/admin/dashboard/stats', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  // Gestion des commandes admin
  static async getAdminOrders(token: string, params?: any): Promise<{ success: boolean; data: any; pagination?: any }> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request(`/api/admin/orders${queryString}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  static async getAdminOrderDetails(token: string, orderId: string): Promise<{ success: boolean; data: any }> {
    return this.request(`/api/admin/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  static async updateAdminOrder(token: string, orderId: string, updateData: any): Promise<{ success: boolean; data: any }> {
    return this.request(`/api/admin/orders/${orderId}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }

  static async deleteAdminOrder(token: string, orderId: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/api/admin/orders/${orderId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }

  // Upload PDF admin
  static async uploadStoryPdf(token: string, orderId: string, file: File): Promise<{ success: boolean; data: any }> {
    const formData = new FormData();
    formData.append('pdf', file);
    return this.request(`/api/admin/orders/${orderId}/upload-pdf`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  // Livrer un conte
  static async deliverStory(token: string, orderId: string): Promise<{ success: boolean; data: any }> {
    return this.request(`/api/admin/orders/${orderId}/deliver`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }

  // Admin clients
  static async getAdminClients(token: string, params?: any): Promise<{ success: boolean; data: any }> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request(`/api/admin/clients${queryString}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }

  static async getAdminClientDetail(token: string, clientId: string): Promise<{ success: boolean; data: any }> {
    return this.request(`/api/admin/clients/${clientId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }

  static async deleteAdminClient(token: string, clientId: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/api/admin/clients/${clientId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }

  static async updateAdminClientPassword(token: string, clientId: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/api/admin/clients/${clientId}/password`, {
      method: 'PATCH',
      body: JSON.stringify({ newPassword }),
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }

  static async updateAdminClientCredits(token: string, clientId: string, action: 'add' | 'set', amount: number): Promise<{ success: boolean; message: string }> {
    return this.request(`/api/admin/clients/${clientId}/credits`, {
      method: 'PATCH',
      body: JSON.stringify({ action, amount }),
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }

  // ========== Retention ==========
  static async applyRetentionDiscount(token: string): Promise<{ success: boolean; message: string }> {
    return this.request('/api/stripe/apply-retention-discount', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
    });
  }

  // ========== Referral ==========
  static async getReferralInfo(token: string): Promise<{ success: boolean; data: { referralCode: string; referralCredits: number; referralCount: number; maxCredits: number; referralLink: string } }> {
    return this.request('/api/client/referral', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }

  // ========== Unified Login ==========
  static async unifiedLogin(email: string, password: string): Promise<{ success: boolean; data: any; message?: string }> {
    return this.request('/api/auth/unified-login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  // ========== Client Auth ==========
  static async clientLogin(email: string, password: string): Promise<{ success: boolean; data: any; message?: string }> {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  static async clientRegister(email: string, password: string, firstName?: string, lastName?: string): Promise<{ success: boolean; data: any; message?: string }> {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, firstName, lastName })
    });
  }

  static async googleAuth(credential: string): Promise<{ success: boolean; data: any; message?: string }> {
    return this.request('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify({ credential })
    });
  }

  static async checkEmail(email: string): Promise<{ success: boolean; exists: boolean; hasPassword?: boolean; isFirstPurchase?: boolean }> {
    return this.request(`/api/auth/check-email?email=${encodeURIComponent(email)}`);
  }

  static async requestMagicLink(email: string): Promise<{ success: boolean; message: string }> {
    return this.request('/api/auth/magic-link', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  static async sendOTP(email: string): Promise<{ success: boolean; message: string }> {
    return this.request('/api/auth/send-code', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  static async verifyOTP(email: string, code: string): Promise<{ success: boolean; data?: any; message?: string }> {
    return this.request('/api/auth/verify-code', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    });
  }

  static async verifyMagicLink(token: string): Promise<{ success: boolean; data?: any; message?: string }> {
    return this.request('/api/auth/magic-link/verify', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  static async getClientProfile(token: string): Promise<{ success: boolean; data: any }> {
    return this.request('/api/auth/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }

  // ========== Client Dashboard ==========
  static async getClientStories(token: string, params?: any): Promise<{ success: boolean; data: any[] }> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request(`/api/client/stories${queryString}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }

  static async getClientStoryDetail(token: string, storyId: string): Promise<{ success: boolean; data: any }> {
    return this.request(`/api/client/stories/${storyId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }

  static async toggleFavorite(token: string, storyId: string): Promise<{ success: boolean; data: any }> {
    return this.request(`/api/client/stories/${storyId}/favorite`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }

  static async getClientChildren(token: string): Promise<{ success: boolean; data: any[] }> {
    return this.request('/api/client/children', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }

  static async createChild(token: string, data: { name: string; age?: number; photoUrl?: string }): Promise<{ success: boolean; data: any }> {
    return this.request('/api/client/children', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }

  static async updateChild(token: string, childId: string, data: any): Promise<{ success: boolean; data: any }> {
    return this.request(`/api/client/children/${childId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }

  static async deleteChild(token: string, childId: string): Promise<{ success: boolean }> {
    return this.request(`/api/client/children/${childId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }

  static async getClientSubscription(token: string): Promise<{ success: boolean; data: any }> {
    return this.request('/api/client/subscription', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }

  // Club credit status
  static async getClubCredit(token: string): Promise<{ success: boolean; data: { canSubmit: boolean; remaining: number; nextCreditDate?: string; totalEarned?: number } }> {
    return this.request('/api/client/club-credit', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }

  // ========== Stripe Subscription ==========
  static async createSubscriptionSession(token: string, orderId?: string, plan: 'monthly' | 'annual' = 'monthly'): Promise<{ sessionId: string; url: string }> {
    return this.request('/api/stripe/create-subscription-session', {
      method: 'POST',
      body: JSON.stringify({ orderId, plan }),
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }

  // Verifier le statut de souscription (polling apres checkout)
  static async checkSubscriptionStatus(token: string): Promise<{ success: boolean; status: string; user?: any }> {
    return this.request('/api/stripe/check-subscription-status', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }

  // Marquer une commande comme abandonnee
  static async abandonOrder(orderId: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/api/orders/${orderId}/abandon`, {
      method: 'POST'
    });
  }

  static async createCustomerPortal(token: string): Promise<{ url: string }> {
    return this.request('/api/stripe/create-customer-portal', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }

  // Client profile update
  static async updateProfile(token: string, data: { firstName?: string; lastName?: string }): Promise<{ success: boolean; data: any }> {
    return this.request('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }

  // Client password change
  static async changePassword(token: string, currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    return this.request('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }

  // ========== Public Story Sharing ==========

  static async generateShareToken(token: string, storyId: string): Promise<{ success: boolean; data: { shareToken: string } }> {
    return this.request(`/api/client/stories/${storyId}/share`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }

  static async getPublicStory(shareToken: string): Promise<{ success: boolean; data: any }> {
    return this.request(`/api/public/stories/${shareToken}`);
  }

  // Compresser une photo (iPhone 12MP → ~300KB JPEG)
  // Timeout 10s pour ne jamais bloquer sur appareil lent
  private static compressPhoto(file: File, maxSize = 1200, quality = 0.85): Promise<File> {
    return new Promise((resolve) => {
      // Timeout de sécurité : si compression prend > 10s, envoyer l'original
      const timeout = setTimeout(() => {
        console.warn('[Photo] Compression timeout, envoi original');
        resolve(file);
      }, 10000);

      const objectUrl = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let { width, height } = img;
          if (width > height) {
            if (width > maxSize) { height = Math.round(height * maxSize / width); width = maxSize; }
          } else {
            if (height > maxSize) { width = Math.round(width * maxSize / height); height = maxSize; }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) { clearTimeout(timeout); URL.revokeObjectURL(objectUrl); resolve(file); return; }
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(blob => {
            clearTimeout(timeout);
            URL.revokeObjectURL(objectUrl);
            if (!blob) { resolve(file); return; }
            const compressed = new File([blob], file.name.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' });
            console.log(`[Photo] Compressée: ${(file.size/1024).toFixed(0)}KB → ${(compressed.size/1024).toFixed(0)}KB`);
            resolve(compressed);
          }, 'image/jpeg', quality);
        } catch {
          clearTimeout(timeout);
          URL.revokeObjectURL(objectUrl);
          resolve(file);
        }
      };
      img.onerror = () => { clearTimeout(timeout); URL.revokeObjectURL(objectUrl); resolve(file); };
      img.src = objectUrl;
    });
  }

  // Get base URL (used for PDF preview links)
  static getBaseUrl(): string {
    return this.baseUrl;
  }

  // ========== Generation Workflow (Admin) ==========

  static async sendToGeneration(token: string, orderId: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/api/admin/orders/${orderId}/send-to-generation`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }

  static async regenerateStory(token: string, orderId: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/api/admin/generation/orders/${orderId}/regenerate`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }

  static async validateGeneration(token: string, orderId: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/api/admin/generation/orders/${orderId}/validate`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }

  static async deleteGeneration(token: string, orderId: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/api/admin/generation/orders/${orderId}/delete-generation`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }

  static async replacePdf(token: string, orderId: string, file: File): Promise<{ success: boolean; message: string }> {
    const formData = new FormData();
    formData.append('pdf', file);
    return this.request(`/api/admin/generation/orders/${orderId}/replace-pdf`, {
      method: 'POST',
      body: formData,
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }

  static async getGenerationLogs(token: string, orderId: string): Promise<{ success: boolean; data: any[] }> {
    return this.request(`/api/admin/generation/orders/${orderId}/logs`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }

  // ========== Story Generation (Admin) ==========

  static async getGenerationQueue(token: string): Promise<{ success: boolean; data: any[] }> {
    return this.request('/api/admin/generation/orders', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }

  static async startGeneration(token: string, orderId: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/api/admin/generation/orders/${orderId}/generate`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }

  static async getGenerationStatus(token: string, orderId: string): Promise<{ success: boolean; data: any }> {
    return this.request(`/api/admin/generation/orders/${orderId}/status`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }

  static async retryGeneration(token: string, orderId: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/api/admin/generation/orders/${orderId}/retry`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }

  static async createTestOrder(token: string, data?: any, photoFile?: File): Promise<{ success: boolean; data: any; message?: string }> {
    const formData = new FormData();

    // Ajouter tous les champs du formulaire
    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          formData.append(key, String(value));
        }
      });
    }

    // Ajouter la photo si presente
    if (photoFile) {
      formData.append('photo', photoFile);
    }

    const response = await fetch(`${this.baseUrl}/api/admin/generation/test-order`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Pas de Content-Type — le navigateur le met automatiquement avec le boundary multipart
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erreur serveur' }));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Generate AI cover preview
  static async generateCoverPreview(data: {
    formData: Record<string, any>;
    photoBase64?: string;
  }, signal?: AbortSignal): Promise<{ success: boolean; data?: { imageBase64: string; paramsHash: string; title?: string }; message?: string }> {
    const url = `${this.baseUrl}/api/preview/generate`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      signal,
    });
    const result = await response.json();
    return result;
  }

  // Generate first illustration preview
  static async generateFirstIllustration(data: {
    formData: Record<string, any>;
    paragraph: string;
    coverImageBase64?: string;
  }, signal?: AbortSignal): Promise<{ success: boolean; data?: { illustrationUrl: string; illustrationBase64: string }; message?: string }> {
    const url = `${this.baseUrl}/api/preview/first-illustration`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      signal,
    });
    return response.json();
  }

  // Generate AI story preview (3 paragraphs)
  static async generateStoryPreview(data: {
    formData: Record<string, any>;
  }, signal?: AbortSignal): Promise<{ success: boolean; data?: { title: string; paragraphs: string[] }; message?: string }> {
    const url = `${this.baseUrl}/api/preview/story-preview`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      signal,
    });
    const result = await response.json();
    return result;
  }

  // PDF download (returns blob URL)
  static async downloadStoryPdf(token: string, storyId: string): Promise<string> {
    const url = `${this.baseUrl}/api/client/stories/${storyId}/pdf`;
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Erreur telechargement PDF');
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }
}

export default API_CONFIG;

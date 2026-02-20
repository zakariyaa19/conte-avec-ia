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
console.log('🌐 URL API configurée:', baseUrl);

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
          console.log(`🔄 Tentative ${attempt + 1}/${maxRetries + 1} pour ${endpoint}`);
          // Attendre avant de retry (backoff exponentiel)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
        
        return await this.request<T>(endpoint, options);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.warn(`⚠️ Échec tentative ${attempt + 1}:`, error);
        
        // Ne pas retry sur certaines erreurs (4xx sauf 408, 429)
        if (error instanceof Error && error.message.includes('40') && 
            !error.message.includes('408') && !error.message.includes('429')) {
          throw error;
        }
      }
    }
    
    throw lastError ?? new Error('Request failed after retries');
  }

  // Méthode générique pour les requêtes avec retry et timeout
  private static async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    console.log('🔄 Requête API:', { url, options });
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      // Timeout de 60 secondes pour les requêtes importantes
      signal: AbortSignal.timeout(60000),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      console.log('📡 Réponse API:', {
        url,
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        let errorData = {};
        let responseText = '';
        
        try {
          // Clone la réponse pour pouvoir la lire plusieurs fois
          const responseClone = response.clone();
          responseText = await responseClone.text();
          console.log('📄 Response body brut:', responseText);
          
          // Essayer de parser en JSON
          if (responseText) {
            errorData = JSON.parse(responseText);
          }
        } catch (parseError) {
          console.log('⚠️ Impossible de parser la réponse JSON:', parseError);
        }
        
        console.log('❌ Erreur API:', { status: response.status, errorData, responseText });
        
        // Si c'est une erreur d'authentification (401), supprimer les tokens et rediriger vers /login
        if (response.status === 401) {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('userToken');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
        
        throw new Error((errorData as any).message || `Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Données reçues:', data);
      return data;
    } catch (error) {
      console.error('❌ Erreur fetch:', { url, error });
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

  // Créer une commande (avec retry, auth optionnelle)
  static async createOrder(orderData: {
    userEmail: string;
    formData: any;
    authToken?: string;
  }): Promise<{ success: boolean; data: any; token?: string; user?: any; message: string; isClubFreeOrder?: boolean; clubCreditExhausted?: boolean }> {
    // Créer un FormData pour gérer l'upload de fichier
    const formDataToSend = new FormData();

    // Ajouter les données du formulaire
    formDataToSend.append('userEmail', orderData.userEmail);
    formDataToSend.append('formData', JSON.stringify(orderData.formData));

    // Ajouter la photo si elle existe
    if (orderData.formData.photo) {
      formDataToSend.append('photo', orderData.formData.photo);
    }

    const headers: Record<string, string> = {};
    if (orderData.authToken) {
      headers['Authorization'] = `Bearer ${orderData.authToken}`;
    }

    return this.requestWithRetry(API_CONFIG.ENDPOINTS.ORDERS, {
      method: 'POST',
      body: formDataToSend,
      headers
    }, 2);
  }

  // Créer une session de paiement Stripe (avec retry)
  static async createPaymentSession(orderId: string): Promise<{ sessionId: string; url: string }> {
    console.log('🔄 Création session Stripe pour commande:', orderId);
    
    try {
      const response = await this.requestWithRetry<{ sessionId: string; url: string }>('/api/stripe/create-payment-session', {
        method: 'POST',
        body: JSON.stringify({ orderId }),
      }, 2); // 2 retry pour cette requête critique
      
      console.log('✅ Réponse session Stripe:', response);
      return response;
    } catch (error) {
      console.error('❌ Erreur création session Stripe:', error);
      throw error;
    }
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

  static async checkEmail(email: string): Promise<{ success: boolean; exists: boolean; hasPassword?: boolean }> {
    return this.request(`/api/auth/check-email?email=${encodeURIComponent(email)}`);
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
  static async createSubscriptionSession(token: string, orderId?: string): Promise<{ sessionId: string; url: string }> {
    return this.request('/api/stripe/create-subscription-session', {
      method: 'POST',
      body: JSON.stringify({ orderId }),
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

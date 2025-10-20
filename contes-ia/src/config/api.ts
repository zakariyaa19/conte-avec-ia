// Configuration des URLs API
const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5001',
  ENDPOINTS: {
    // Health checks
    HEALTH: '/health',
    API_HEALTH: '/api/health',
    
    // Orders
    ORDERS: '/api/orders',
    ORDER_BY_ID: (id: string) => `/api/orders/${id}`,
    
    // Payments (pour future intégration Stripe)
    PAYMENTS: '/api/payments',
    PAYMENT_INTENT: '/api/payments/create-intent',
    PAYMENT_WEBHOOK: '/api/payments/webhook',
    
    // Admin (pour futur panneau d'administration)
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
    let lastError: Error;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          console.log(`🔄 Tentative ${attempt + 1}/${maxRetries + 1} pour ${endpoint}`);
          // Attendre avant de retry (backoff exponentiel)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
        
        return await this.request<T>(endpoint, options);
      } catch (error) {
        lastError = error as Error;
        console.warn(`⚠️ Échec tentative ${attempt + 1}:`, error);
        
        // Ne pas retry sur certaines erreurs (4xx sauf 408, 429)
        if (error instanceof Error && error.message.includes('40') && 
            !error.message.includes('408') && !error.message.includes('429')) {
          throw error;
        }
      }
    }
    
    throw lastError!;
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
        
        // Si c'est une erreur d'authentification (401), supprimer le token expiré
        if (response.status === 401) {
          localStorage.removeItem('adminToken');
          // Rediriger vers la page de connexion
          if (window.location.pathname.startsWith('/admin')) {
            window.location.href = '/admin';
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

  // Créer une commande (avec retry)
  static async createOrder(orderData: {
    userEmail: string;
    formData: any;
  }): Promise<{ success: boolean; data: any; message: string }> {
    // Créer un FormData pour gérer l'upload de fichier
    const formDataToSend = new FormData();
    
    // Ajouter les données du formulaire
    formDataToSend.append('userEmail', orderData.userEmail);
    formDataToSend.append('formData', JSON.stringify(orderData.formData));
    
    // Ajouter la photo si elle existe
    if (orderData.formData.photo) {
      formDataToSend.append('photo', orderData.formData.photo);
    }

    return this.requestWithRetry(API_CONFIG.ENDPOINTS.ORDERS, {
      method: 'POST',
      body: formDataToSend,
      // Ne pas définir Content-Type, le navigateur le fera automatiquement avec boundary
      headers: {}
    }, 2); // 2 retry pour cette requête critique
  }

  // Récupérer toutes les commandes
  static async getOrders(): Promise<{ success: boolean; data: any[] }> {
    return this.request(API_CONFIG.ENDPOINTS.ORDERS);
  }

  // Récupérer une commande par ID
  static async getOrderById(id: string): Promise<{ success: boolean; data: any }> {
    return this.request(API_CONFIG.ENDPOINTS.ORDER_BY_ID(id));
  }

  // Mettre à jour une commande
  static async updateOrder(id: string, updateData: any): Promise<{ success: boolean; data: any }> {
    return this.request(API_CONFIG.ENDPOINTS.ORDER_BY_ID(id), {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
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
  static async getAdminOrders(token: string, params?: any): Promise<{ success: boolean; data: any }> {
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
    console.log('🔧 updateAdminOrder appelée avec:', { orderId, updateData, token: token?.substring(0, 20) + '...' });
    
    return this.request(`/api/admin/orders/${orderId}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }
}

export default API_CONFIG;

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ApiService } from '../config/api';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  subscriptionStatus?: string;
  subscriptionPeriodEnd?: string;
  weeklySubmissionCount?: number;
  weeklySubmissionReset?: string;
  isFirstPurchase?: boolean;
  hasPassword?: boolean;
  hasGoogle?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isClub: boolean;
  isAdmin: boolean;
  adminToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string; userType?: string }>;
  register: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ success: boolean; message?: string }>;
  googleLogin: (credential: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  setTokenAndUser: (token: string, user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;
  const isClub = user?.role === 'CLUB' && ['active', 'canceling'].includes(user?.subscriptionStatus || '');
  const isAdmin = !!adminToken;

  const setTokenAndUser = useCallback((token: string, userData: User) => {
    localStorage.setItem('userToken', token);
    setUser(userData);
  }, []);

  const refreshProfile = useCallback(async () => {
    // Check admin token first
    const savedAdminToken = localStorage.getItem('adminToken');
    if (savedAdminToken) {
      try {
        const tokenPayload = JSON.parse(atob(savedAdminToken.split('.')[1]));
        if (tokenPayload.exp && tokenPayload.exp > Date.now() / 1000) {
          setAdminToken(savedAdminToken);
        } else {
          localStorage.removeItem('adminToken');
          setAdminToken(null);
        }
      } catch {
        localStorage.removeItem('adminToken');
        setAdminToken(null);
      }
    }

    // Check client token
    const token = localStorage.getItem('userToken');
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await ApiService.getClientProfile(token);
      if (response.success) {
        setUser(response.data);
      } else {
        // Profil invalide (401) → déconnecter
        localStorage.removeItem('userToken');
        setUser(null);
      }
    } catch (error) {
      // Erreur réseau (timeout, connexion lente) → garder le token et réessayer
      // Ne PAS supprimer le token sur erreur réseau — sinon l'utilisateur est déconnecté sur mobile
      console.warn('[Auth] Erreur chargement profil (token conservé):', error);
      // Décoder le token localement pour au moins avoir les infos de base
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp && payload.exp > Date.now() / 1000) {
          setUser({ id: payload.userId, email: payload.email, role: payload.role } as any);
        } else {
          localStorage.removeItem('userToken');
          setUser(null);
        }
      } catch {
        localStorage.removeItem('userToken');
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  // After any auth method sets user without isFirstPurchase, refresh to get full profile
  useEffect(() => {
    if (user && user.isFirstPurchase === undefined) {
      refreshProfile();
    }
  }, [user?.id]); // eslint-disable-line

  const login = async (email: string, password: string) => {
    try {
      const response = await ApiService.unifiedLogin(email, password);
      if (response.success) {
        const { token, userType, user: userData } = response.data;

        if (userType === 'admin') {
          localStorage.setItem('adminToken', token);
          setAdminToken(token);
        } else {
          localStorage.setItem('userToken', token);
          setUser(userData);
        }

        return { success: true, userType };
      }
      return { success: false, message: response.message || 'Identifiants invalides' };
    } catch (error: any) {
      return { success: false, message: error.message || 'Erreur de connexion' };
    }
  };

  const register = async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      const response = await ApiService.clientRegister(email, password, firstName, lastName);
      if (response.success) {
        localStorage.setItem('userToken', response.data.token);
        setUser(response.data.user);
        return { success: true };
      }
      return { success: false, message: response.message || 'Erreur d\'inscription' };
    } catch (error: any) {
      return { success: false, message: error.message || 'Erreur d\'inscription' };
    }
  };

  const googleLogin = async (credential: string) => {
    try {
      const response = await ApiService.googleAuth(credential);
      if (response.success) {
        localStorage.setItem('userToken', response.data.token);
        setUser(response.data.user);
        return { success: true };
      }
      return { success: false, message: response.message || 'Erreur Google' };
    } catch (error: any) {
      return { success: false, message: error.message || 'Erreur Google' };
    }
  };

  const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('adminToken');
    setUser(null);
    setAdminToken(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isClub,
      isAdmin,
      adminToken,
      isLoading,
      login,
      register,
      googleLogin,
      logout,
      refreshProfile,
      setTokenAndUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

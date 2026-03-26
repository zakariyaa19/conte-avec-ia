import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ApiService } from '../config/api';
import { safeLocalStorage, safeSessionStorage } from '../utils/safeStorage';

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
    safeLocalStorage.setItem('userToken', token);
    setUser(userData);
  }, []);

  const refreshProfile = useCallback(async () => {
    // Check admin token first
    const savedAdminToken = safeLocalStorage.getItem('adminToken');
    if (savedAdminToken) {
      try {
        const tokenPayload = JSON.parse(atob(savedAdminToken.split('.')[1]));
        if (tokenPayload.exp && tokenPayload.exp > Date.now() / 1000) {
          setAdminToken(savedAdminToken);
        } else {
          safeLocalStorage.removeItem('adminToken');
          setAdminToken(null);
        }
      } catch {
        safeLocalStorage.removeItem('adminToken');
        setAdminToken(null);
      }
    }

    // Check client token (localStorage + backup sessionStorage)
    let token = safeLocalStorage.getItem('userToken');
    if (!token) {
      // Fallback: récupérer depuis sessionStorage (backup mobile Safari)
      const backup = safeSessionStorage.getItem('userToken_backup');
      if (backup) {
        token = backup;
        safeLocalStorage.setItem('userToken', token);
      }
    }
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
        safeLocalStorage.removeItem('userToken');
        safeSessionStorage.removeItem('userToken_backup');
        setUser(null);
      }
    } catch (error) {
      // Erreur réseau → garder le token, décoder le JWT localement
      console.warn('[Auth] Erreur réseau profil, décodage JWT local');
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp && payload.exp > Date.now() / 1000) {
          setUser({
            id: payload.userId,
            email: payload.email,
            role: payload.role,
            firstName: payload.firstName || null,
            lastName: payload.lastName || null,
            isFirstPurchase: undefined, // sera résolu au prochain refreshProfile
          } as any);
        } else {
          safeLocalStorage.removeItem('userToken');
          safeSessionStorage.removeItem('userToken_backup');
          setUser(null);
        }
      } catch {
        // Token corrompu → déconnecter
        safeLocalStorage.removeItem('userToken');
        safeSessionStorage.removeItem('userToken_backup');
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
          safeLocalStorage.setItem('adminToken', token);
          setAdminToken(token);
        } else {
          safeLocalStorage.setItem('userToken', token);
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
        safeLocalStorage.setItem('userToken', response.data.token);
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
        safeLocalStorage.setItem('userToken', response.data.token);
        setUser(response.data.user);
        return { success: true };
      }
      return { success: false, message: response.message || 'Erreur Google' };
    } catch (error: any) {
      return { success: false, message: error.message || 'Erreur Google' };
    }
  };

  const logout = () => {
    safeLocalStorage.removeItem('userToken');
    safeLocalStorage.removeItem('adminToken');
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

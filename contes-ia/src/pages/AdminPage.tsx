import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AdminLoginPage from './AdminLoginPage';
import AdminDashboardPage from './AdminDashboardPage';
import AdminOrderDetailPage from './AdminOrderDetailPage';

export const AdminPage: React.FC = () => {
  const { orderId } = useParams<{ orderId?: string }>();
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifier si un token existe déjà
    const savedToken = localStorage.getItem('adminToken');
    console.log('🔍 Token récupéré du localStorage:', savedToken ? savedToken.substring(0, 20) + '...' : 'null');
    if (savedToken) {
      setToken(savedToken);
    }
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = (newToken: string) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!token) {
    return <AdminLoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Si on a un orderId dans l'URL, afficher la page de détail
  if (orderId) {
    return <AdminOrderDetailPage token={token} />;
  }

  return <AdminDashboardPage token={token} onLogout={handleLogout} />;
};

export default AdminPage;

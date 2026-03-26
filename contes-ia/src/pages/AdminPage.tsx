import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AdminDashboardPage from './AdminDashboardPage';
import AdminOrderDetailPage from './AdminOrderDetailPage';
import AdminClientsPage from './AdminClientsPage';
import AdminClientDetailPage from './AdminClientDetailPage';
import AdminGenerationPage from './AdminGenerationPage';
import AdminFunnelPage from './AdminFunnelPage';

export const AdminPage: React.FC = () => {
  const { orderId, clientId } = useParams<{ orderId?: string; clientId?: string }>();
  const location = useLocation();
  const { adminToken, logout } = useAuth();

  // Le guard AdminProtectedRoute s'occupe de la redirection si pas admin
  const token = adminToken || '';

  // Routage interne selon l'URL
  if (orderId) {
    return <AdminOrderDetailPage token={token} />;
  }

  if (clientId) {
    return <AdminClientDetailPage token={token} />;
  }

  if (location.pathname === '/admin/funnel') {
    return <AdminFunnelPage token={token} />;
  }

  if (location.pathname === '/admin/generation') {
    return <AdminGenerationPage token={token} />;
  }

  if (location.pathname === '/admin/clients') {
    return <AdminClientsPage token={token} />;
  }

  return <AdminDashboardPage token={token} onLogout={logout} />;
};

export default AdminPage;

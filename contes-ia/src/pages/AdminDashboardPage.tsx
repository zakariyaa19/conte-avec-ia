import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { ApiService } from '../config/api';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: ${theme.colors.background.secondary};
  padding: ${theme.spacing.lg};
`;

const Header = styled.div`
  background: white;
  padding: ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.sm};
  margin-bottom: ${theme.spacing.lg};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  color: ${theme.colors.text.primary};
  margin: 0;
  font-size: 2rem;
  font-weight: 600;
`;

const LogoutButton = styled.button`
  background: ${theme.colors.status.error};
  color: white;
  border: none;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background: ${theme.colors.status.error}dd;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};
`;

const StatCard = styled.div`
  background: white;
  padding: ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.sm};
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${theme.colors.button.primary};
  margin-bottom: ${theme.spacing.sm};
`;

const StatLabel = styled.div`
  color: ${theme.colors.text.secondary};
  font-weight: 500;
`;

const OrdersSection = styled.div`
  background: white;
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.sm};
  overflow: hidden;
`;

const SectionHeader = styled.div`
  padding: ${theme.spacing.lg};
  border-bottom: 1px solid ${theme.colors.background.secondary};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SectionTitle = styled.h2`
  margin: 0;
  color: ${theme.colors.text.primary};
  font-size: 1.5rem;
`;

const FilterSelect = styled.select`
  padding: ${theme.spacing.sm};
  border: 2px solid ${theme.colors.background.secondary};
  border-radius: ${theme.borderRadius.md};
  background: white;
`;

const OrdersTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  padding: ${theme.spacing.md};
  text-align: left;
  background: ${theme.colors.background.secondary};
  color: ${theme.colors.text.primary};
  font-weight: 600;
`;

const TableCell = styled.td`
  padding: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.background.secondary};
  color: ${theme.colors.text.primary};
`;

const StatusDropdown = styled.div`
  position: relative;
  display: inline-block;
`;

const StatusButton = styled.button<{ status: string }>`
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  background: ${props => {
    const statusColors = {
      NEW_ORDER: theme.colors.status.info,
      IN_PROGRESS: theme.colors.status.warning,
      DELIVERED: theme.colors.status.success,
      BLOCKED: theme.colors.status.error,
      PENDING: theme.colors.status.warning,
      PAID: theme.colors.status.success,
      PROCESSING: theme.colors.status.info,
      GENERATED: theme.colors.accent.coral,
      PRINTED: theme.colors.accent.softPeach,
      SHIPPED: theme.colors.accent.lightCoral,
      CANCELLED: theme.colors.status.error,
      REFUNDED: theme.colors.status.error
    };
    return statusColors[props.status as keyof typeof statusColors] || theme.colors.text.light;
  }};
  color: white;
  min-width: 140px;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    opacity: 0.9;
  }
`;

const StatusMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid ${theme.colors.text.light};
  border-radius: ${theme.borderRadius.md};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  margin-top: 4px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.2s ease;

  ${StatusDropdown}:hover & {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
`;

const StatusMenuItem = styled.button`
  width: 100%;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.primary};
  transition: background-color 0.2s ease;

  &:hover {
    background: ${theme.colors.background.secondary};
  }

  &:first-child {
    border-radius: ${theme.borderRadius.md} ${theme.borderRadius.md} 0 0;
  }

  &:last-child {
    border-radius: 0 0 ${theme.borderRadius.md} ${theme.borderRadius.md};
  }

  &:only-child {
    border-radius: ${theme.borderRadius.md};
  }
`;
const ActionButton = styled.button`
  background: ${theme.colors.button.primary};
  color: white;
  border: none;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  cursor: pointer;
  font-size: 0.875rem;
  margin-right: ${theme.spacing.xs};

  &:hover {
    background: ${theme.colors.button.primaryHover};
  }
`;

const ViewButton = styled.button`
  background: transparent;
  color: ${theme.colors.button.primary};
  border: 1px solid ${theme.colors.button.primary};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;

  &:hover {
    background: ${theme.colors.button.primary};
    color: white;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: ${theme.spacing.xl};
  color: ${theme.colors.text.secondary};
`;

const ErrorMessage = styled.div`
  background: ${theme.colors.status.error}20;
  color: ${theme.colors.status.error};
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  margin: ${theme.spacing.md};
`;

interface AdminDashboardPageProps {
  token: string;
  onLogout: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ token, onLogout }) => {
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [updating, setUpdating] = useState(false);

  const getStatusLabel = (status: string) => {
    const statusLabels = {
      NEW_ORDER: 'Nouvelle commande',
      IN_PROGRESS: 'En cours de création',
      DELIVERED: 'Livré',
      BLOCKED: 'Bloqué',
      // Anciens statuts pour compatibilité
      PENDING: 'En attente',
      PAID: 'Payé',
      PROCESSING: 'En traitement',
      GENERATED: 'Généré',
      PRINTED: 'Imprimé',
      SHIPPED: 'Expédié',
      CANCELLED: 'Annulé',
      REFUNDED: 'Remboursé'
    };
    return statusLabels[status as keyof typeof statusLabels] || status;
  };

  const getAvailableStatuses = () => {
    return ['NEW_ORDER', 'IN_PROGRESS', 'DELIVERED', 'BLOCKED'];
  };

  useEffect(() => {
    loadDashboardData();
  }, [token]);

  useEffect(() => {
    loadOrders();
  }, [statusFilter, token]);

  const loadDashboardData = async () => {
    try {
      const response = await ApiService.getAdminDashboardStats(token);
      if (response.success) {
        setStats(response.data);
      }
    } catch (error: any) {
      setError('Erreur lors du chargement des statistiques');
      console.error('Erreur stats:', error);
    }
  };

  const loadOrders = async () => {
    try {
      setLoading(true);
      const params = statusFilter ? { status: statusFilter } : {};
      const response = await ApiService.getAdminOrders(token, params);
      if (response.success) {
        setOrders(response.data);
      }
    } catch (error: any) {
      setError('Erreur lors du chargement des commandes');
      console.error('Erreur commandes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setUpdating(true);
      setError(''); // Clear previous errors
      
      console.log('🔄 Mise à jour statut:', { orderId, newStatus, token: token?.substring(0, 20) + '...' });
      
      const currentToken = localStorage.getItem('adminToken') || token;
      console.log('🔑 Token utilisé:', currentToken?.substring(0, 20) + '...');
      
      if (!currentToken) {
        throw new Error('Token manquant');
      }
      
      await ApiService.updateAdminOrder(currentToken, orderId, { status: newStatus });
      await loadOrders(); // Recharger la liste
      await loadDashboardData(); // Recharger les stats
      
      console.log('✅ Statut mis à jour avec succès');
    } catch (error: any) {
      console.error('❌ Erreur update complète:', error);
      setError('Erreur lors de la mise à jour du statut: ' + error.message);
      
      if (error.message.includes('401') || error.message.includes('Token') || error.message.includes('authentification')) {
        console.log('🔄 Token expiré, redirection...');
        localStorage.removeItem('adminToken');
        window.location.href = '/admin';
      }
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <DashboardContainer>
      <Header>
        <Title>Dashboard Administration</Title>
        <LogoutButton onClick={onLogout}>
          Déconnexion
        </LogoutButton>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {stats && (
        <StatsGrid>
          <StatCard>
            <StatValue>{stats.totalOrders || 0}</StatValue>
            <StatLabel>Commandes totales</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{stats.pendingOrders || 0}</StatValue>
            <StatLabel>En attente</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{stats.paidOrders || 0}</StatValue>
            <StatLabel>Payées</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{stats.totalRevenue || '0'}€</StatValue>
            <StatLabel>Chiffre d'affaires</StatLabel>
          </StatCard>
        </StatsGrid>
      )}

      <OrdersSection>
        <SectionHeader>
          <SectionTitle>Commandes récentes</SectionTitle>
          <FilterSelect 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tous les statuts</option>
            <option value="NEW_ORDER">Nouvelle commande</option>
            <option value="IN_PROGRESS">En cours de création</option>
            <option value="DELIVERED">Livré</option>
            <option value="BLOCKED">Bloqué</option>
          </FilterSelect>
        </SectionHeader>

        {loading ? (
          <LoadingMessage>Chargement des commandes...</LoadingMessage>
        ) : orders.length === 0 ? (
          <LoadingMessage>Aucune commande trouvée</LoadingMessage>
        ) : (
          <OrdersTable>
            <thead>
              <tr>
                <TableHeader>ID</TableHeader>
                <TableHeader>Client</TableHeader>
                <TableHeader>Protagoniste</TableHeader>
                <TableHeader>Produit</TableHeader>
                <TableHeader>Prix</TableHeader>
                <TableHeader>Statut</TableHeader>
                <TableHeader>Date</TableHeader>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <TableCell>
                    <ViewButton onClick={() => window.location.href = `/admin/order/${order.id}`}>
                      {order.id.slice(-8)}
                    </ViewButton>
                  </TableCell>
                  <TableCell>{order.user?.email || 'N/A'}</TableCell>
                  <TableCell>{order.protagonistName}</TableCell>
                  <TableCell>{order.productType}</TableCell>
                  <TableCell>{order.price}€</TableCell>
                  <TableCell>
                    <StatusDropdown>
                      <StatusButton status={order.status} disabled={updating}>
                        {getStatusLabel(order.status)} ▼
                      </StatusButton>
                      <StatusMenu>
                        {getAvailableStatuses().map(status => (
                          <StatusMenuItem 
                            key={status}
                            onClick={() => handleStatusChange(order.id, status)}
                            disabled={updating}
                          >
                            {getStatusLabel(status)}
                          </StatusMenuItem>
                        ))}
                      </StatusMenu>
                    </StatusDropdown>
                  </TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                </tr>
              ))}
            </tbody>
          </OrdersTable>
        )}
      </OrdersSection>
    </DashboardContainer>
  );
};

export default AdminDashboardPage;

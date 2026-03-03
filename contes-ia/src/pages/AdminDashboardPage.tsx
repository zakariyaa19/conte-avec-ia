import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { ApiService } from '../config/api';
import { AdminLayout } from '../components/admin/AdminLayout';

// ========== Styled Components ==========

const PageTitle = styled.h1`
  font-size: ${theme.fontSizes['2xl']};
  font-weight: 700;
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing.lg};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatCard = styled.div<{ $accent?: string }>`
  background: white;
  padding: ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.admin.cardBorder};
  border-top: 3px solid ${props => props.$accent || theme.colors.admin.accent};
`;

const StatValue = styled.div`
  font-size: ${theme.fontSizes['3xl']};
  font-weight: 700;
  color: ${theme.colors.text.primary};
  line-height: 1;
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.light};
  font-weight: 500;
`;

const SectionCard = styled.div`
  background: white;
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.admin.cardBorder};
  overflow: hidden;
  margin-bottom: ${theme.spacing.xl};
`;

const SectionHeader = styled.div`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-bottom: 1px solid ${theme.colors.admin.cardBorder};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${theme.spacing.sm};
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: ${theme.fontSizes.lg};
  font-weight: 600;
  color: ${theme.colors.text.primary};
`;

const FiltersRow = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  align-items: center;
  flex-wrap: wrap;
`;

const FilterSelect = styled.select`
  padding: 6px 10px;
  border: 1px solid ${theme.colors.admin.cardBorder};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.fontSizes.sm};
  background: white;
  color: ${theme.colors.text.primary};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${theme.colors.admin.accent};
  }
`;

const SearchInput = styled.input`
  padding: 6px 10px;
  border: 1px solid ${theme.colors.admin.cardBorder};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.fontSizes.sm};
  min-width: 200px;

  &:focus {
    outline: none;
    border-color: ${theme.colors.admin.accent};
  }
`;

const DateInput = styled.input`
  padding: 6px 10px;
  border: 1px solid ${theme.colors.admin.cardBorder};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.fontSizes.sm};

  &:focus {
    outline: none;
    border-color: ${theme.colors.admin.accent};
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  text-align: left;
  font-size: ${theme.fontSizes.xs};
  font-weight: 600;
  color: ${theme.colors.text.light};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${theme.colors.admin.contentBg};
  border-bottom: 1px solid ${theme.colors.admin.cardBorder};
`;

const Td = styled.td`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.primary};
  border-bottom: 1px solid ${theme.colors.admin.cardBorder}80;
  vertical-align: middle;
`;

const Badge = styled.span<{ $color: string; $bg: string }>`
  display: inline-block;
  padding: 2px 8px;
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.xs};
  font-weight: 600;
  color: ${props => props.$color};
  background: ${props => props.$bg};
  white-space: nowrap;
`;

const StatusDropdownWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const StatusBtn = styled.button<{ $bg: string }>`
  padding: 4px 10px;
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.fontSizes.xs};
  font-weight: 600;
  border: none;
  cursor: pointer;
  background: ${props => props.$bg};
  color: white;
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;

  &:hover { opacity: 0.9; }
`;

const StatusMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 160px;
  background: white;
  border: 1px solid ${theme.colors.admin.cardBorder};
  border-radius: ${theme.borderRadius.md};
  box-shadow: ${theme.shadows.lg};
  z-index: 1000;
  margin-top: 4px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-8px);
  transition: all 0.15s ease;

  ${StatusDropdownWrapper}:hover & {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
`;

const StatusMenuItem = styled.button`
  width: 100%;
  padding: 8px 12px;
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.primary};

  &:hover { background: ${theme.colors.admin.contentBg}; }
  &:first-child { border-radius: ${theme.borderRadius.md} ${theme.borderRadius.md} 0 0; }
  &:last-child { border-radius: 0 0 ${theme.borderRadius.md} ${theme.borderRadius.md}; }
`;

const ActionBtn = styled.button<{ $variant?: 'primary' | 'success' | 'ghost' | 'danger' }>`
  padding: 4px 10px;
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.fontSizes.xs};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;

  ${props => {
    switch (props.$variant) {
      case 'success':
        return `background: ${theme.colors.status.success}; color: white; border: none; &:hover { opacity: 0.9; }`;
      case 'ghost':
        return `background: transparent; color: ${theme.colors.admin.accent}; border: 1px solid ${theme.colors.admin.accent}; &:hover { background: ${theme.colors.admin.accent}10; }`;
      case 'danger':
        return `background: transparent; color: #DC2626; border: 1px solid #DC2626; &:hover { background: #DC262610; }`;
      default:
        return `background: ${theme.colors.admin.accent}; color: white; border: none; &:hover { background: ${theme.colors.admin.accentHover}; }`;
    }
  }}

  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const ActionsCell = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing['2xl']};
  color: ${theme.colors.text.light};
  font-size: ${theme.fontSizes.sm};
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-top: 1px solid ${theme.colors.admin.cardBorder};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.light};
`;

const PaginationBtns = styled.div`
  display: flex;
  gap: ${theme.spacing.xs};
`;

const PageBtn = styled.button<{ $active?: boolean }>`
  padding: 4px 10px;
  border: 1px solid ${props => props.$active ? theme.colors.admin.accent : theme.colors.admin.cardBorder};
  background: ${props => props.$active ? theme.colors.admin.accent : 'white'};
  color: ${props => props.$active ? 'white' : theme.colors.text.primary};
  border-radius: ${theme.borderRadius.sm};
  cursor: pointer;
  font-size: ${theme.fontSizes.sm};

  &:hover:not(:disabled) { border-color: ${theme.colors.admin.accent}; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const ErrorBanner = styled.div`
  background: ${theme.colors.status.error}10;
  border: 1px solid ${theme.colors.status.error}30;
  color: ${theme.colors.status.error};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  margin-bottom: ${theme.spacing.md};
  font-size: ${theme.fontSizes.sm};
`;

// ========== Helpers ==========

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  PENDING: { label: 'En attente', color: '#6B7280', bg: '#F3F4F6' },
  UNPAID: { label: 'Non payee', color: '#9333EA', bg: '#F3E8FF' },
  PAID: { label: 'Payee - A traiter', color: '#D97706', bg: '#FEF3C7' },
  GENERATING: { label: 'En generation', color: '#2563EB', bg: '#DBEAFE' },
  GENERATED: { label: 'Prete a livrer', color: '#10B981', bg: '#D1FAE5' },
  BLOCKED: { label: 'Bloquee', color: '#DC2626', bg: '#FEE2E2' },
  DELIVERED: { label: 'Livree', color: '#059669', bg: '#D1FAE5' },
};

const PURCHASE_TYPE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  SINGLE: { label: 'Unique', color: '#6B7280', bg: '#F3F4F6' },
  CLUB: { label: 'Club', color: '#7C3AED', bg: '#EDE9FE' },
};

const ALL_STATUSES = Object.keys(STATUS_CONFIG);

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const formatPrice = (p: number | string) => `${Number(p).toFixed(2)}€`;

// ========== Component ==========

interface AdminDashboardPageProps {
  token: string;
  onLogout: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ token }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isOrdersView = location.pathname === '/admin/orders';

  const [stats, setStats] = useState<any>(null);
  const [actionOrders, setActionOrders] = useState<any[]>([]);
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [allPagination, setAllPagination] = useState({ page: 1, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);

  const getToken = () => localStorage.getItem('adminToken') || token;

  const loadStats = useCallback(async () => {
    try {
      const response = await ApiService.getAdminDashboardStats(getToken());
      if (response.success) setStats(response.data);
    } catch (err: any) {
      console.error('Stats error:', err);
    }
  }, [token]);

  const loadActionOrders = useCallback(async () => {
    try {
      const response = await ApiService.getAdminOrders(getToken(), { actionRequired: 'true', limit: '50' });
      if (response.success) setActionOrders(response.data);
    } catch (err: any) {
      console.error('Action orders error:', err);
    }
  }, [token]);

  const loadAllOrders = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = { page: String(page), limit: '20' };
      if (statusFilter) params.status = statusFilter;
      if (typeFilter) params.purchaseType = typeFilter;
      if (searchFilter) params.search = searchFilter;
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;
      const response = await ApiService.getAdminOrders(getToken(), params);
      if (response.success) {
        setAllOrders(response.data);
        if (response.pagination) setAllPagination(response.pagination);
      }
    } catch (err: any) {
      setError('Erreur chargement commandes');
    } finally {
      setLoading(false);
    }
  }, [token, page, statusFilter, typeFilter, searchFilter, dateFrom, dateTo]);

  useEffect(() => {
    loadStats();
    loadActionOrders();
  }, [loadStats, loadActionOrders]);

  useEffect(() => {
    loadAllOrders();
  }, [loadAllOrders]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setUpdating(true);
      setError('');
      await ApiService.updateAdminOrder(getToken(), orderId, { status: newStatus });
      await Promise.all([loadActionOrders(), loadAllOrders()]);
    } catch (err: any) {
      setError('Erreur mise a jour: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeliver = async (orderId: string) => {
    if (!window.confirm('Livrer ce conte ? Un email sera envoye au client.')) return;
    try {
      setUpdating(true);
      await ApiService.deliverStory(getToken(), orderId);
      await Promise.all([loadActionOrders(), loadAllOrders()]);
    } catch (err: any) {
      setError('Erreur livraison: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleSendToGeneration = async (orderId: string) => {
    try {
      setUpdating(true);
      setError('');
      await ApiService.sendToGeneration(getToken(), orderId);
      await Promise.all([loadStats(), loadActionOrders(), loadAllOrders()]);
    } catch (err: any) {
      setError('Erreur envoi en generation: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm('Supprimer cette commande definitivement ?')) return;
    try {
      setUpdating(true);
      setError('');
      await ApiService.deleteAdminOrder(getToken(), orderId);
      await Promise.all([loadActionOrders(), loadAllOrders()]);
    } catch (err: any) {
      setError('Erreur suppression: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteClient = async (clientId: string, email: string) => {
    if (!window.confirm(`Supprimer le compte ${email} et toutes ses commandes ?`)) return;
    try {
      setUpdating(true);
      setError('');
      await ApiService.deleteAdminClient(getToken(), clientId);
      await Promise.all([loadActionOrders(), loadAllOrders()]);
    } catch (err: any) {
      setError('Erreur suppression client: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const renderStatusBadge = (status: string) => {
    const cfg = STATUS_CONFIG[status] || { label: status, color: '#6B7280', bg: '#F3F4F6' };
    return <Badge $color={cfg.color} $bg={cfg.bg}>{cfg.label}</Badge>;
  };

  const renderTypeBadge = (order: any) => {
    if (order.purchaseType === 'CLUB' && Number(order.price) === 0) {
      return <Badge $color="#059669" $bg="#D1FAE5">Club gratuit</Badge>;
    }
    if (order.purchaseType === 'CLUB') {
      return <Badge $color="#7C3AED" $bg="#EDE9FE">Club</Badge>;
    }
    return <Badge $color="#6B7280" $bg="#F3F4F6">Unique</Badge>;
  };

  const renderStatusDropdown = (order: any) => {
    const cfg = STATUS_CONFIG[order.status] || { label: order.status, color: '#fff', bg: '#6B7280' };
    return (
      <StatusDropdownWrapper>
        <StatusBtn $bg={cfg.color} disabled={updating}>
          {cfg.label} ▾
        </StatusBtn>
        <StatusMenu>
          {ALL_STATUSES.map(s => (
            <StatusMenuItem key={s} onClick={() => handleStatusChange(order.id, s)} disabled={updating}>
              {STATUS_CONFIG[s]?.label || s}
            </StatusMenuItem>
          ))}
        </StatusMenu>
      </StatusDropdownWrapper>
    );
  };

  const renderOrderRow = (order: any, showActions = false) => (
    <tr key={order.id}>
      <Td>
        <ActionBtn $variant="ghost" onClick={() => navigate(`/admin/order/${order.id}`)}>
          #{order.id.slice(-8)}
        </ActionBtn>
      </Td>
      <Td>{formatDate(order.createdAt)}</Td>
      <Td>
        <span style={order.user?.role === 'CLUB' ? { color: '#B8860B', fontWeight: 600 } : {}}>
          {order.user?.email || '-'}
        </span>
        {order.user?.role === 'CLUB' && <Badge $color="#92400E" $bg="#FDE68A" style={{ marginLeft: '6px', fontSize: '10px' }}>Club</Badge>}
      </Td>
      <Td>{order.protagonistName}</Td>
      <Td>{renderTypeBadge(order)}</Td>
      <Td>{renderStatusDropdown(order)}</Td>
      <Td>{formatPrice(order.price)}</Td>
      {showActions && (
        <Td>
          <ActionsCell>
            <ActionBtn $variant="ghost" onClick={() => navigate(`/admin/order/${order.id}`)}>
              Voir
            </ActionBtn>
            {order.status === 'PAID' && (
              <ActionBtn onClick={() => handleSendToGeneration(order.id)} disabled={updating}>
                Generation
              </ActionBtn>
            )}
            {order.status === 'GENERATED' && (
              <ActionBtn $variant="success" onClick={() => handleDeliver(order.id)} disabled={updating}>
                Livrer
              </ActionBtn>
            )}
            <ActionBtn $variant="danger" onClick={() => handleDeleteOrder(order.id)} disabled={updating}>
              Suppr.
            </ActionBtn>
          </ActionsCell>
        </Td>
      )}
    </tr>
  );

  // Orders view (all orders with filters)
  if (isOrdersView) {
    return (
      <AdminLayout>
        <PageTitle>Commandes</PageTitle>
        {error && <ErrorBanner>{error}</ErrorBanner>}

        <SectionCard>
          <SectionHeader>
            <SectionTitle>Toutes les commandes</SectionTitle>
            <FiltersRow>
              <FilterSelect value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
                <option value="">Tous les statuts</option>
                {ALL_STATUSES.map(s => (
                  <option key={s} value={s}>{STATUS_CONFIG[s]?.label || s}</option>
                ))}
              </FilterSelect>
              <FilterSelect value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1); }}>
                <option value="">Tous les types</option>
                <option value="SINGLE">Achat unique</option>
                <option value="CLUB">Club</option>
              </FilterSelect>
              <SearchInput
                placeholder="Rechercher email, prenom..."
                value={searchFilter}
                onChange={e => { setSearchFilter(e.target.value); setPage(1); }}
              />
              <DateInput type="date" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setPage(1); }} title="Date debut" />
              <DateInput type="date" value={dateTo} onChange={e => { setDateTo(e.target.value); setPage(1); }} title="Date fin" />
            </FiltersRow>
          </SectionHeader>

          {loading ? (
            <EmptyState>Chargement...</EmptyState>
          ) : allOrders.length === 0 ? (
            <EmptyState>Aucune commande trouvee</EmptyState>
          ) : (
            <>
              <Table>
                <thead>
                  <tr>
                    <Th>ID</Th>
                    <Th>Date</Th>
                    <Th>Client</Th>
                    <Th>Protagoniste</Th>
                    <Th>Type</Th>
                    <Th>Statut</Th>
                    <Th>Prix</Th>
                    <Th>Actions</Th>
                  </tr>
                </thead>
                <tbody>
                  {allOrders.map(order => renderOrderRow(order, true))}
                </tbody>
              </Table>
              <Pagination>
                <span>{allPagination.total} commande(s) — page {allPagination.page}/{allPagination.totalPages || 1}</span>
                <PaginationBtns>
                  <PageBtn disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Precedent</PageBtn>
                  <PageBtn disabled={page >= (allPagination.totalPages || 1)} onClick={() => setPage(p => p + 1)}>Suivant</PageBtn>
                </PaginationBtns>
              </Pagination>
            </>
          )}
        </SectionCard>
      </AdminLayout>
    );
  }

  // Dashboard home view
  return (
    <AdminLayout>
      <PageTitle>Tableau de bord</PageTitle>
      {error && <ErrorBanner>{error}</ErrorBanner>}

      {/* Stats */}
      {stats && (
        <StatsGrid>
          <StatCard $accent={theme.colors.status.warning}>
            <StatValue>{stats.ordersToProcess || 0}</StatValue>
            <StatLabel>A traiter</StatLabel>
          </StatCard>
          <StatCard $accent="#9333EA">
            <StatValue>{stats.unpaidOrders || 0}</StatValue>
            <StatLabel>Non payees</StatLabel>
          </StatCard>
          <StatCard $accent={theme.colors.status.success}>
            <StatValue>{formatPrice(stats.totalRevenue || 0)}</StatValue>
            <StatLabel>Chiffre d'affaires</StatLabel>
          </StatCard>
          <StatCard $accent="#7C3AED">
            <StatValue>{stats.clubSubscribers || 0}</StatValue>
            <StatLabel>Abonnements Club</StatLabel>
          </StatCard>
          <StatCard $accent="#B8860B">
            <StatValue>{formatPrice(stats.mrr || 0)}</StatValue>
            <StatLabel>Revenus Club / mois</StatLabel>
          </StatCard>
          <StatCard $accent={theme.colors.admin.accent}>
            <StatValue>{stats.totalStories || 0}</StatValue>
            <StatLabel>Contes generes</StatLabel>
          </StatCard>
        </StatsGrid>
      )}

      {/* Section "A traiter" */}
      <SectionCard>
        <SectionHeader>
          <SectionTitle>A traiter ({actionOrders.length})</SectionTitle>
        </SectionHeader>
        {actionOrders.length === 0 ? (
          <EmptyState>Aucune commande a traiter</EmptyState>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>ID</Th>
                <Th>Date</Th>
                <Th>Client</Th>
                <Th>Protagoniste</Th>
                <Th>Type</Th>
                <Th>Statut</Th>
                <Th>Prix</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {actionOrders.map(order => renderOrderRow(order, true))}
            </tbody>
          </Table>
        )}
      </SectionCard>

      {/* Commandes recentes */}
      <SectionCard>
        <SectionHeader>
          <SectionTitle>Commandes recentes</SectionTitle>
          <ActionBtn $variant="ghost" onClick={() => navigate('/admin/orders')}>
            Voir toutes →
          </ActionBtn>
        </SectionHeader>
        {loading ? (
          <EmptyState>Chargement...</EmptyState>
        ) : allOrders.length === 0 ? (
          <EmptyState>Aucune commande</EmptyState>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>ID</Th>
                <Th>Date</Th>
                <Th>Client</Th>
                <Th>Protagoniste</Th>
                <Th>Type</Th>
                <Th>Statut</Th>
                <Th>Prix</Th>
              </tr>
            </thead>
            <tbody>
              {allOrders.slice(0, 10).map(order => renderOrderRow(order, false))}
            </tbody>
          </Table>
        )}
      </SectionCard>
    </AdminLayout>
  );
};

export default AdminDashboardPage;

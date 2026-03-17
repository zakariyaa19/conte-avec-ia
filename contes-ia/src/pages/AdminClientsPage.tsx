import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { ApiService } from '../config/api';
import { AdminLayout } from '../components/admin/AdminLayout';

const PageTitle = styled.h1`
  font-size: ${theme.fontSizes['2xl']};
  font-weight: 700;
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing.lg};
`;

const FiltersRow = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.lg};
  flex-wrap: wrap;
  align-items: center;
`;

const FilterSelect = styled.select`
  padding: 6px 10px;
  border: 1px solid ${theme.colors.admin.cardBorder};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.fontSizes.sm};
  background: white;
  cursor: pointer;
  &:focus { outline: none; border-color: ${theme.colors.admin.accent}; }
`;

const SearchInput = styled.input`
  padding: 6px 10px;
  border: 1px solid ${theme.colors.admin.cardBorder};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.fontSizes.sm};
  min-width: 250px;
  &:focus { outline: none; border-color: ${theme.colors.admin.accent}; }
`;

const Card = styled.div`
  background: white;
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.admin.cardBorder};
  overflow: hidden;
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
`;

const Badge = styled.span<{ $color: string; $bg: string }>`
  display: inline-block;
  padding: 2px 8px;
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.xs};
  font-weight: 600;
  color: ${props => props.$color};
  background: ${props => props.$bg};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing['2xl']};
  color: ${theme.colors.text.light};
  font-size: ${theme.fontSizes.sm};
`;

const PaginationRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-top: 1px solid ${theme.colors.admin.cardBorder};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.light};
`;

const PageBtn = styled.button`
  padding: 4px 10px;
  border: 1px solid ${theme.colors.admin.cardBorder};
  background: white;
  border-radius: ${theme.borderRadius.sm};
  cursor: pointer;
  font-size: ${theme.fontSizes.sm};
  margin-left: ${theme.spacing.xs};
  &:hover:not(:disabled) { border-color: ${theme.colors.admin.accent}; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

interface AdminClientsPageProps {
  token: string;
}

export const AdminClientsPage: React.FC<AdminClientsPageProps> = ({ token }) => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [roleFilter, setRoleFilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });

  const getToken = () => localStorage.getItem('adminToken') || token;

  useEffect(() => {
    loadClients();
  }, [roleFilter, search, page]);

  const loadClients = async () => {
    try {
      setLoading(true);
      const params: any = { page: String(page), limit: '20' };
      if (roleFilter) params.role = roleFilter;
      if (search) params.search = search;
      const response = await ApiService.getAdminClients(getToken(), params);
      if (response.success) {
        setClients(response.data);
        if ((response as any).pagination) setPagination((response as any).pagination);
      }
    } catch (error) {
      console.error('Erreur chargement clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const roleBadge = (role: string) => {
    switch (role) {
      case 'CLUB': return <Badge $color="#7C3AED" $bg="#EDE9FE">Club</Badge>;
      case 'ADMIN': return <Badge $color="#DC2626" $bg="#FEE2E2">Admin</Badge>;
      default: return <Badge $color="#6B7280" $bg="#F3F4F6">User</Badge>;
    }
  };

  const subBadge = (status?: string) => {
    if (!status) return <span style={{ color: theme.colors.text.light }}>-</span>;
    if (status === 'active') return <Badge $color="#059669" $bg="#D1FAE5">Actif</Badge>;
    return <Badge $color="#D97706" $bg="#FEF3C7">{status}</Badge>;
  };

  const handleDeleteClient = async (e: React.MouseEvent, clientId: string, email: string) => {
    e.stopPropagation();
    if (!window.confirm(`Supprimer le compte ${email} et toutes ses commandes ?`)) return;
    try {
      setDeleting(true);
      await ApiService.deleteAdminClient(getToken(), clientId);
      loadClients();
    } catch (error: any) {
      alert('Erreur: ' + error.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminLayout>
      <PageTitle>Clients</PageTitle>

      <FiltersRow>
        <FilterSelect value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}>
          <option value="">Tous les roles</option>
          <option value="USER">Utilisateur</option>
          <option value="CLUB">Membre Club</option>
        </FilterSelect>
        <SearchInput
          placeholder="Rechercher par email, nom..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </FiltersRow>

      <Card>
        {loading ? (
          <EmptyState>Chargement...</EmptyState>
        ) : clients.length === 0 ? (
          <EmptyState>Aucun client trouve</EmptyState>
        ) : (
          <>
            <Table>
              <thead>
                <tr>
                  <Th>Email</Th>
                  <Th>Nom</Th>
                  <Th>Role</Th>
                  <Th>Abonnement</Th>
                  <Th>Commandes</Th>
                  <Th>Inscription</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id} onClick={() => navigate(`/admin/clients/${client.id}`)} style={{
                    cursor: 'pointer',
                    ...(client.role === 'CLUB' ? {
                      background: 'linear-gradient(90deg, rgba(139,92,246,0.08) 0%, rgba(139,92,246,0.03) 100%)',
                      borderLeft: '3px solid #8B5CF6',
                    } : {}),
                  }}>
                    <Td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {client.role === 'CLUB' && (
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '3px',
                            background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
                            color: 'white', fontSize: '9px', fontWeight: 700,
                            padding: '2px 7px', borderRadius: '6px', flexShrink: 0,
                          }}>
                            ★ Club
                          </span>
                        )}
                        <span style={client.role === 'CLUB' ? { fontWeight: 600, color: '#7C3AED' } : {}}>
                          {client.email}
                        </span>
                      </div>
                    </Td>
                    <Td>{client.firstName || '-'} {client.lastName || ''}</Td>
                    <Td>{roleBadge(client.role)}</Td>
                    <Td>{subBadge(client.subscriptionStatus)}</Td>
                    <Td>{client.orderCount ?? client._count?.orders ?? 0}</Td>
                    <Td>{new Date(client.createdAt).toLocaleDateString('fr-FR')}</Td>
                    <Td>
                      <button
                        onClick={(e) => handleDeleteClient(e, client.id, client.email)}
                        disabled={deleting}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          background: 'transparent',
                          color: '#DC2626',
                          border: '1px solid #DC2626',
                          transition: 'all 0.15s',
                          opacity: deleting ? 0.5 : 1
                        }}
                      >
                        Supprimer
                      </button>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {pagination.totalPages > 1 && (
              <PaginationRow>
                <span>{pagination.total} client(s) — page {page}/{pagination.totalPages}</span>
                <div>
                  <PageBtn disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Precedent</PageBtn>
                  <PageBtn disabled={page >= pagination.totalPages} onClick={() => setPage(p => p + 1)}>Suivant</PageBtn>
                </div>
              </PaginationRow>
            )}
          </>
        )}
      </Card>
    </AdminLayout>
  );
};

export default AdminClientsPage;

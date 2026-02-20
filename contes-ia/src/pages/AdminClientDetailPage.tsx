import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { ApiService } from '../config/api';
import { AdminLayout } from '../components/admin/AdminLayout';

// ========== Styled ==========

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.light};
  margin-bottom: ${theme.spacing.lg};

  span.link {
    color: ${theme.colors.admin.accent};
    cursor: pointer;
    &:hover { text-decoration: underline; }
  }
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
  flex-wrap: wrap;
  gap: ${theme.spacing.sm};
`;

const PageTitle = styled.h1`
  font-size: ${theme.fontSizes['2xl']};
  font-weight: 700;
  color: ${theme.colors.text.primary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const ClubBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.xs};
  font-weight: 700;
  color: #92400E;
  background: linear-gradient(135deg, #FDE68A, #F59E0B);
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

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.admin.cardBorder};
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-bottom: 1px solid ${theme.colors.admin.cardBorder};
  font-weight: 600;
  font-size: ${theme.fontSizes.base};
  color: ${theme.colors.text.primary};
  background: ${theme.colors.admin.contentBg};
`;

const CardBody = styled.div`
  padding: ${theme.spacing.lg};
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${theme.spacing.xs} 0;
  border-bottom: 1px solid ${theme.colors.admin.cardBorder}40;
  font-size: ${theme.fontSizes.sm};

  &:last-child { border-bottom: none; }
`;

const InfoLabel = styled.span`
  color: ${theme.colors.text.light};
  font-weight: 500;
`;

const InfoValue = styled.span`
  color: ${theme.colors.text.primary};
  font-weight: 600;
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

const ActionBtn = styled.button<{ $variant?: 'danger' | 'primary' | 'default' }>`
  padding: 6px 14px;
  border: 1px solid ${props =>
    props.$variant === 'danger' ? '#DC2626' :
    props.$variant === 'primary' ? theme.colors.admin.accent :
    theme.colors.admin.cardBorder};
  background: ${props =>
    props.$variant === 'danger' ? '#FEE2E2' :
    props.$variant === 'primary' ? theme.colors.admin.accent :
    'white'};
  color: ${props =>
    props.$variant === 'danger' ? '#DC2626' :
    props.$variant === 'primary' ? 'white' :
    theme.colors.text.primary};
  border-radius: ${theme.borderRadius.sm};
  cursor: pointer;
  font-size: ${theme.fontSizes.sm};
  font-weight: 500;
  &:hover { opacity: 0.85; }
`;

const ActionsRow = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  flex-wrap: wrap;
`;

const FormInput = styled.input`
  padding: 6px 10px;
  border: 1px solid ${theme.colors.admin.cardBorder};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.fontSizes.sm};
  min-width: 200px;
  &:focus { outline: none; border-color: ${theme.colors.admin.accent}; }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing['2xl']};
  color: ${theme.colors.text.light};
  font-size: ${theme.fontSizes.sm};
`;

const StatusMsg = styled.div<{ $type: 'success' | 'error' }>`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  margin-bottom: ${theme.spacing.md};
  font-size: ${theme.fontSizes.sm};
  color: ${props => props.$type === 'success' ? '#059669' : '#DC2626'};
  background: ${props => props.$type === 'success' ? '#D1FAE5' : '#FEE2E2'};
`;

// ========== Helpers ==========

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  PENDING: { label: 'En attente', color: '#6B7280', bg: '#F3F4F6' },
  PAID: { label: 'Payee - A traiter', color: '#D97706', bg: '#FEF3C7' },
  BLOCKED: { label: 'Bloquee', color: '#DC2626', bg: '#FEE2E2' },
  DELIVERED: { label: 'Livree', color: '#059669', bg: '#D1FAE5' },
};

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });

const formatPrice = (p: number | string) => `${Number(p).toFixed(2)}€`;

// ========== Component ==========

interface AdminClientDetailPageProps {
  token: string;
}

export const AdminClientDetailPage: React.FC<AdminClientDetailPageProps> = ({ token }) => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const getToken = () => localStorage.getItem('adminToken') || token;

  useEffect(() => {
    loadClient();
  }, [clientId]);

  const loadClient = async () => {
    if (!clientId) return;
    try {
      setLoading(true);
      const response = await ApiService.getAdminClientDetail(getToken(), clientId);
      if (response.success) {
        setClient(response.data);
      }
    } catch (error) {
      console.error('Erreur chargement client:', error);
      setMessage({ text: 'Erreur lors du chargement du client', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClient = async () => {
    if (!clientId || !client) return;
    const confirmed = window.confirm(
      `Supprimer le client ${client.email} et toutes ses commandes ? Cette action est irreversible.`
    );
    if (!confirmed) return;

    try {
      const response = await ApiService.deleteAdminClient(getToken(), clientId);
      if (response.success) {
        setMessage({ text: response.message, type: 'success' });
        setTimeout(() => navigate('/admin/clients'), 1500);
      } else {
        setMessage({ text: response.message || 'Erreur', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Erreur lors de la suppression', type: 'error' });
    }
  };

  const handleChangePassword = async () => {
    if (!clientId || !newPassword) return;
    if (newPassword.length < 8) {
      setMessage({ text: 'Le mot de passe doit contenir au moins 8 caracteres', type: 'error' });
      return;
    }

    try {
      const response = await ApiService.updateAdminClientPassword(getToken(), clientId, newPassword);
      if (response.success) {
        setMessage({ text: 'Mot de passe modifie', type: 'success' });
        setNewPassword('');
        setShowPasswordForm(false);
      } else {
        setMessage({ text: response.message || 'Erreur', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Erreur lors de la modification', type: 'error' });
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <EmptyState>Chargement...</EmptyState>
      </AdminLayout>
    );
  }

  if (!client) {
    return (
      <AdminLayout>
        <EmptyState>Client non trouve</EmptyState>
      </AdminLayout>
    );
  }

  const isClub = client.role === 'CLUB';

  return (
    <AdminLayout>
      <Breadcrumb>
        <span className="link" onClick={() => navigate('/admin')}>Tableau de bord</span>
        <span>/</span>
        <span className="link" onClick={() => navigate('/admin/clients')}>Clients</span>
        <span>/</span>
        <span>{client.email}</span>
      </Breadcrumb>

      <PageHeader>
        <PageTitle>
          <span style={isClub ? { color: '#B8860B' } : {}}>{client.email}</span>
          {isClub && <ClubBadge>Club</ClubBadge>}
          {!isClub && <Badge $color="#6B7280" $bg="#F3F4F6">{client.role}</Badge>}
        </PageTitle>
      </PageHeader>

      {message && (
        <StatusMsg $type={message.type}>{message.text}</StatusMsg>
      )}

      <CardsGrid>
        {/* Informations */}
        <Card>
          <CardHeader>Informations</CardHeader>
          <CardBody>
            <InfoRow>
              <InfoLabel>Email</InfoLabel>
              <InfoValue>{client.email}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Prenom</InfoLabel>
              <InfoValue>{client.firstName || '-'}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Nom</InfoLabel>
              <InfoValue>{client.lastName || '-'}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Role</InfoLabel>
              <InfoValue>{client.role}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Inscription</InfoLabel>
              <InfoValue>{formatDate(client.createdAt)}</InfoValue>
            </InfoRow>
          </CardBody>
        </Card>

        {/* Abonnement */}
        <Card>
          <CardHeader>Abonnement</CardHeader>
          <CardBody>
            <InfoRow>
              <InfoLabel>Statut</InfoLabel>
              <InfoValue>
                {client.subscriptionStatus === 'active' && <Badge $color="#059669" $bg="#D1FAE5">Actif</Badge>}
                {client.subscriptionStatus === 'canceling' && <Badge $color="#D97706" $bg="#FEF3C7">Annulation programmee</Badge>}
                {client.subscriptionStatus === 'cancelled' && <Badge $color="#DC2626" $bg="#FEE2E2">Annule</Badge>}
                {!client.subscriptionStatus && <Badge $color="#6B7280" $bg="#F3F4F6">Basique</Badge>}
              </InfoValue>
            </InfoRow>
            {client.subscriptionPeriodEnd && (
              <InfoRow>
                <InfoLabel>Fin de periode</InfoLabel>
                <InfoValue>{formatDate(client.subscriptionPeriodEnd)}</InfoValue>
              </InfoRow>
            )}
            {client.subscriptionId && (
              <InfoRow>
                <InfoLabel>Stripe Sub ID</InfoLabel>
                <InfoValue style={{ fontSize: '11px', fontFamily: 'monospace' }}>{client.subscriptionId}</InfoValue>
              </InfoRow>
            )}
            <InfoRow>
              <InfoLabel>Credits utilises</InfoLabel>
              <InfoValue>{client.weeklySubmissionCount || 0}</InfoValue>
            </InfoRow>
          </CardBody>
        </Card>
      </CardsGrid>

      {/* Commandes */}
      <Card style={{ marginBottom: theme.spacing.lg }}>
        <CardHeader>Commandes ({client.orders?.length || 0})</CardHeader>
        {!client.orders || client.orders.length === 0 ? (
          <EmptyState>Aucune commande</EmptyState>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Date</Th>
                <Th>Protagoniste</Th>
                <Th>Type</Th>
                <Th>Statut</Th>
                <Th>Prix</Th>
                <Th>Action</Th>
              </tr>
            </thead>
            <tbody>
              {client.orders.map((order: any) => {
                const statusCfg = STATUS_CONFIG[order.status] || { label: order.status, color: '#6B7280', bg: '#F3F4F6' };
                return (
                  <tr key={order.id}>
                    <Td>{formatDate(order.createdAt)}</Td>
                    <Td>{order.protagonistName || '-'}</Td>
                    <Td>
                      <Badge $color="#6B7280" $bg="#F3F4F6">{order.productType}</Badge>
                      {' '}
                      {order.purchaseType === 'CLUB' && <Badge $color="#7C3AED" $bg="#EDE9FE">Club</Badge>}
                    </Td>
                    <Td><Badge $color={statusCfg.color} $bg={statusCfg.bg}>{statusCfg.label}</Badge></Td>
                    <Td>{formatPrice(order.price)}</Td>
                    <Td>
                      <ActionBtn onClick={() => navigate(`/admin/order/${order.id}`)}>
                        Voir
                      </ActionBtn>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </Card>

      {/* Actions admin */}
      <Card>
        <CardHeader>Actions administrateur</CardHeader>
        <CardBody>
          <ActionsRow>
            <ActionBtn onClick={() => setShowPasswordForm(!showPasswordForm)}>
              Modifier le mot de passe
            </ActionBtn>
            <ActionBtn $variant="danger" onClick={handleDeleteClient}>
              Supprimer le compte
            </ActionBtn>
          </ActionsRow>

          {showPasswordForm && (
            <div style={{ marginTop: theme.spacing.md, display: 'flex', gap: theme.spacing.sm, alignItems: 'center' }}>
              <FormInput
                type="password"
                placeholder="Nouveau mot de passe (min 8 car.)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <ActionBtn $variant="primary" onClick={handleChangePassword}>
                Valider
              </ActionBtn>
              <ActionBtn onClick={() => { setShowPasswordForm(false); setNewPassword(''); }}>
                Annuler
              </ActionBtn>
            </div>
          )}
        </CardBody>
      </Card>
    </AdminLayout>
  );
};

export default AdminClientDetailPage;

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
              <InfoLabel>Crédits utilisés</InfoLabel>
              <InfoValue>{client.weeklySubmissionCount || 0}</InfoValue>
            </InfoRow>

            {/* Credits management for Club members */}
            {client.role === 'CLUB' && (() => {
              const startDate = client.weeklySubmissionReset ? new Date(client.weeklySubmissionReset) : null;
              const now = new Date();
              const monthsSinceStart = startDate ? (now.getTime() - startDate.getTime()) / (30 * 24 * 60 * 60 * 1000) : 0;
              const totalEarned = startDate ? (Math.floor(monthsSinceStart) + 1) * 4 : 0;
              const used = client.weeklySubmissionCount || 0;
              const remaining = Math.max(0, totalEarned - used);

              return (
                <>
                  <InfoRow>
                    <InfoLabel>Crédits restants</InfoLabel>
                    <InfoValue style={{ fontWeight: 700, color: remaining > 0 ? '#22C55E' : '#EF4444' }}>
                      {remaining} restant{remaining > 1 ? 's' : ''} (gagné: {totalEarned}, utilisé: {used})
                    </InfoValue>
                  </InfoRow>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <button
                      onClick={async () => {
                        const token = localStorage.getItem('adminToken') || '';
                        try {
                          const res = await ApiService.updateAdminClientCredits(token, client.id, 'add', 1);
                          if (res.success) {
                            alert(res.message);
                            window.location.reload();
                          } else {
                            alert(res.message || 'Erreur');
                          }
                        } catch { alert('Erreur réseau'); }
                      }}
                      style={{
                        padding: '6px 14px', borderRadius: '8px', border: 'none',
                        background: '#22C55E', color: 'white', fontSize: '12px',
                        fontWeight: 600, cursor: 'pointer',
                      }}
                    >
                      + Ajouter 1 crédit
                    </button>
                    <button
                      onClick={async () => {
                        const input = prompt('Combien de crédits ajouter ?', '4');
                        if (!input) return;
                        const num = parseInt(input);
                        if (isNaN(num) || num <= 0) { alert('Entrez un nombre positif'); return; }
                        const token = localStorage.getItem('adminToken') || '';
                        try {
                          const res = await ApiService.updateAdminClientCredits(token, client.id, 'add', num);
                          if (res.success) {
                            alert(res.message);
                            window.location.reload();
                          } else {
                            alert(res.message || 'Erreur');
                          }
                        } catch { alert('Erreur réseau'); }
                      }}
                      style={{
                        padding: '6px 14px', borderRadius: '8px', border: '1px solid #ddd',
                        background: 'transparent', color: 'var(--text-primary)', fontSize: '12px',
                        fontWeight: 600, cursor: 'pointer',
                      }}
                    >
                      + Ajouter X crédits
                    </button>
                    <button
                      onClick={async () => {
                        if (!confirm('Remettre les crédits utilisés à 0 ?')) return;
                        const token = localStorage.getItem('adminToken') || '';
                        try {
                          const res = await ApiService.updateAdminClientCredits(token, client.id, 'set', 0);
                          if (res.success) {
                            alert(res.message);
                            window.location.reload();
                          } else {
                            alert(res.message || 'Erreur');
                          }
                        } catch { alert('Erreur réseau'); }
                      }}
                      style={{
                        padding: '6px 14px', borderRadius: '8px', border: '1px solid #EF4444',
                        background: 'transparent', color: '#EF4444', fontSize: '12px',
                        fontWeight: 600, cursor: 'pointer',
                      }}
                    >
                      Reset à 0
                    </button>
                  </div>
                </>
              );
            })()}
          </CardBody>
        </Card>
      </CardsGrid>

      {/* Bibliothèque — livres avec stats */}
      <Card style={{ marginBottom: theme.spacing.lg }}>
        <CardHeader>Bibliotheque ({client.orders?.filter((o: any) => ['PAID', 'GENERATING', 'GENERATED', 'DELIVERED'].includes(o.status)).length || 0} livres)</CardHeader>
        {!client.orders || client.orders.length === 0 ? (
          <EmptyState>Aucun livre</EmptyState>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <Table>
              <thead>
                <tr>
                  <Th>Date</Th>
                  <Th>Couverture</Th>
                  <Th>Protagoniste</Th>
                  <Th>Statut</Th>
                  <Th>Lectures</Th>
                  <Th>Partages</Th>
                  <Th>Vues publiques</Th>
                  <Th>Derniere lecture</Th>
                  <Th>Prix</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {client.orders.map((order: any) => {
                  const statusCfg = STATUS_CONFIG[order.status] || { label: order.status, color: '#6B7280', bg: '#F3F4F6' };
                  const frontendUrl = 'https://contedia.fr';
                  const bookLink = order.status === 'DELIVERED' && order.shareToken
                    ? `${frontendUrl}/story/${order.shareToken}`
                    : null;
                  return (
                    <tr key={order.id}>
                      <Td>{formatDate(order.createdAt)}</Td>
                      <Td>
                        {order.coverImageUrl ? (
                          <img
                            src={order.coverImageUrl}
                            alt={order.protagonistName}
                            style={{ width: 48, height: 64, objectFit: 'cover', borderRadius: 6, border: '1px solid #eee' }}
                          />
                        ) : (
                          <span style={{ color: '#aaa', fontSize: 11 }}>—</span>
                        )}
                      </Td>
                      <Td>
                        <strong>{order.protagonistName || '-'}</strong>
                        {order.coverTitle && <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{order.coverTitle}</div>}
                      </Td>
                      <Td>
                        <Badge $color={statusCfg.color} $bg={statusCfg.bg}>{statusCfg.label}</Badge>
                        {order.purchaseType === 'CLUB' && <> <Badge $color="#7C3AED" $bg="#EDE9FE">Club</Badge></>}
                      </Td>
                      <Td style={{ textAlign: 'center', fontWeight: 700, color: (order.readCount || 0) > 0 ? '#059669' : '#aaa' }}>
                        {order.readCount || 0}
                      </Td>
                      <Td style={{ textAlign: 'center', fontWeight: 700, color: (order.shareCount || 0) > 0 ? '#2563EB' : '#aaa' }}>
                        {order.shareCount || 0}
                      </Td>
                      <Td style={{ textAlign: 'center', fontWeight: 700, color: (order.publicViewCount || 0) > 0 ? '#7C3AED' : '#aaa' }}>
                        {order.publicViewCount || 0}
                      </Td>
                      <Td style={{ fontSize: 11, color: '#888' }}>
                        {order.lastReadAt ? formatDate(order.lastReadAt) : '—'}
                      </Td>
                      <Td>{formatPrice(order.price)}</Td>
                      <Td>
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                          <ActionBtn onClick={() => navigate(`/admin/order/${order.id}`)}>
                            Detail
                          </ActionBtn>
                          {bookLink && (
                            <ActionBtn $variant="primary" onClick={() => window.open(bookLink, '_blank')}>
                              Lire
                            </ActionBtn>
                          )}
                        </div>
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
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

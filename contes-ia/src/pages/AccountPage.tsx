import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { ApiService } from '../config/api';

// ========== Styled ==========

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-primary);
`;

const MainContent = styled.main`
  flex: 1;
  max-width: 720px;
  margin: 0 auto;
  padding: ${theme.spacing['2xl']} ${theme.spacing.lg};
  width: 100%;
`;

const PageTitle = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['2xl']};
  color: var(--text-primary);
  margin: 0 0 ${theme.spacing.xl};
`;

const Card = styled.div`
  background: var(--bg-card);
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.admin.cardBorder};
  margin-bottom: ${theme.spacing.lg};
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-bottom: 1px solid ${theme.colors.admin.cardBorder};
  font-weight: 600;
  font-size: ${theme.fontSizes.base};
  color: var(--text-primary);
`;

const CardBody = styled.div`
  padding: ${theme.spacing.lg};
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.sm} 0;
  border-bottom: 1px solid ${theme.colors.admin.cardBorder}40;
  font-size: ${theme.fontSizes.sm};

  &:last-child { border-bottom: none; }
`;

const InfoLabel = styled.span`
  color: var(--text-secondary);
`;

const InfoValue = styled.span`
  color: var(--text-primary);
  font-weight: 500;
`;

const FormGroup = styled.div`
  margin-bottom: ${theme.spacing.md};
`;

const FormLabel = styled.label`
  display: block;
  font-size: ${theme.fontSizes.sm};
  color: var(--text-secondary);
  margin-bottom: ${theme.spacing.xs};
`;

const FormInput = styled.input`
  width: 100%;
  padding: 10px 14px;
  border: 1px solid ${theme.colors.admin.cardBorder};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.sm};
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-color: ${theme.colors.accent.coral};
    box-shadow: 0 0 0 3px ${theme.colors.accent.coral}20;
  }
`;

const Badge = styled.span<{ $variant: 'club' | 'basic' | 'canceling' }>`
  display: inline-block;
  padding: 4px 12px;
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.xs};
  font-weight: 700;
  color: ${props =>
    props.$variant === 'club' ? '#92400E' :
    props.$variant === 'canceling' ? '#92400E' :
    '#6B7280'};
  background: ${props =>
    props.$variant === 'club' ? 'linear-gradient(135deg, #FDE68A, #F59E0B)' :
    props.$variant === 'canceling' ? '#FEF3C7' :
    '#F3F4F6'};
`;

const StatusMsg = styled.div<{ $type: 'success' | 'error' }>`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  margin-bottom: ${theme.spacing.md};
  font-size: ${theme.fontSizes.sm};
  color: ${props => props.$type === 'success' ? '#059669' : '#DC2626'};
  background: ${props => props.$type === 'success' ? '#D1FAE5' : '#FEE2E2'};
`;

const ButtonRow = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  flex-wrap: wrap;
  margin-top: ${theme.spacing.md};
`;

// ========== Component ==========

export const AccountPage: React.FC = () => {
  const { user, isClub, logout, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [editingProfile, setEditingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [loading, setLoading] = useState(false);
  const [clubCredit, setClubCredit] = useState<{ remaining: number; nextCreditDate?: string } | null>(null);

  const getToken = () => localStorage.getItem('userToken') || '';

  // Fetch club credits
  useEffect(() => {
    if (isClub) {
      ApiService.getClubCredit(getToken())
        .then(res => { if (res.success) setClubCredit(res.data); })
        .catch(() => {});
    }
  }, [isClub]); // eslint-disable-line

  const handleSaveProfile = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const response = await ApiService.updateProfile(getToken(), { firstName, lastName });
      if (response.success) {
        setMessage({ text: 'Profil mis a jour', type: 'success' });
        setEditingProfile(false);
        await refreshProfile();
      } else {
        setMessage({ text: 'Erreur lors de la mise a jour', type: 'error' });
      }
    } catch {
      setMessage({ text: 'Erreur lors de la mise a jour', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 8) {
      setMessage({ text: 'Le mot de passe doit contenir au moins 8 caractères', type: 'error' });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const response = await ApiService.changePassword(getToken(), currentPassword, newPassword);
      if (response.success) {
        setMessage({ text: 'Mot de passe modifie avec succes', type: 'success' });
        setShowPasswordForm(false);
        setCurrentPassword('');
        setNewPassword('');
      } else {
        setMessage({ text: response.message || 'Erreur', type: 'error' });
      }
    } catch {
      setMessage({ text: 'Erreur lors du changement de mot de passe', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const [portalLoading, setPortalLoading] = useState(false);
  const handleManageSubscription = async () => {
    setPortalLoading(true);
    try {
      const response = await ApiService.createCustomerPortal(getToken());
      if (response.url) {
        window.location.href = response.url;
      } else {
        setMessage({ text: 'Impossible d\'ouvrir le portail de gestion', type: 'error' });
      }
    } catch {
      setMessage({ text: 'Erreur lors de l\'ouverture du portail', type: 'error' });
    } finally {
      setPortalLoading(false);
    }
  };

  const subscriptionVariant = user?.subscriptionStatus === 'canceling' ? 'canceling' : (isClub ? 'club' : 'basic');

  return (
    <PageContainer>
      <Header />
      <MainContent>
        <PageTitle>Mon compte</PageTitle>

        {message && <StatusMsg $type={message.type}>{message.text}</StatusMsg>}

        {/* Informations du compte */}
        <Card>
          <CardHeader>Informations</CardHeader>
          <CardBody>
            <InfoRow>
              <InfoLabel>Email</InfoLabel>
              <InfoValue>{user?.email}</InfoValue>
            </InfoRow>

            {!editingProfile ? (
              <>
                <InfoRow>
                  <InfoLabel>Prenom</InfoLabel>
                  <InfoValue>{user?.firstName || '-'}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>Nom</InfoLabel>
                  <InfoValue>{user?.lastName || '-'}</InfoValue>
                </InfoRow>
                <ButtonRow>
                  <Button variant="outline" size="sm" onClick={() => setEditingProfile(true)}>
                    Modifier
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowPasswordForm(!showPasswordForm)}>
                    Changer le mot de passe
                  </Button>
                </ButtonRow>
              </>
            ) : (
              <>
                <FormGroup>
                  <FormLabel>Prenom</FormLabel>
                  <FormInput value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Nom</FormLabel>
                  <FormInput value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </FormGroup>
                <ButtonRow>
                  <Button variant="primary" size="sm" onClick={handleSaveProfile} disabled={loading}>
                    Enregistrer
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => { setEditingProfile(false); setFirstName(user?.firstName || ''); setLastName(user?.lastName || ''); }}>
                    Annuler
                  </Button>
                </ButtonRow>
              </>
            )}

            {showPasswordForm && !editingProfile && (
              <div style={{ marginTop: theme.spacing.md, paddingTop: theme.spacing.md, borderTop: `1px solid ${theme.colors.admin.cardBorder}` }}>
                <FormGroup>
                  <FormLabel>Mot de passe actuel</FormLabel>
                  <FormInput type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Nouveau mot de passe (min 8 caractères)</FormLabel>
                  <FormInput type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </FormGroup>
                <ButtonRow>
                  <Button variant="primary" size="sm" onClick={handleChangePassword} disabled={loading}>
                    Valider
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => { setShowPasswordForm(false); setCurrentPassword(''); setNewPassword(''); }}>
                    Annuler
                  </Button>
                </ButtonRow>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Abonnement */}
        <Card>
          <CardHeader>Abonnement</CardHeader>
          <CardBody>
            <InfoRow>
              <InfoLabel>Statut</InfoLabel>
              <InfoValue>
                <Badge $variant={subscriptionVariant}>
                  {user?.role === 'CLUB'
                    ? user?.subscriptionStatus === 'canceling'
                      ? 'Club (annulation programmée)'
                      : user?.subscriptionStatus === 'past_due'
                        ? 'Club (paiement en attente)'
                        : 'Membre Club'
                    : 'Plan Gratuit'}
                </Badge>
              </InfoValue>
            </InfoRow>

            {user?.subscriptionStatus === 'past_due' && (
              <div style={{
                background: '#FEF3C7', border: '1px solid #F59E0B', borderRadius: '8px',
                padding: '10px 14px', margin: '8px 0', fontSize: '13px', color: '#92400E',
              }}>
                Votre paiement a échoué. Mettez à jour votre moyen de paiement pour conserver votre accès Club.
              </div>
            )}

            {isClub && clubCredit && (
              <InfoRow>
                <InfoLabel>Crédits ce mois</InfoLabel>
                <InfoValue style={{ fontWeight: 700 }}>
                  {clubCredit.remaining}/4 disponibles
                </InfoValue>
              </InfoRow>
            )}

            {isClub && user?.subscriptionPeriodEnd && (
              <InfoRow>
                <InfoLabel>{user?.subscriptionStatus === 'canceling' ? 'Accès jusqu\'au' : 'Prochaine facturation'}</InfoLabel>
                <InfoValue>{new Date(user.subscriptionPeriodEnd).toLocaleDateString('fr-FR')}</InfoValue>
              </InfoRow>
            )}

            {isClub && clubCredit?.nextCreditDate && user?.subscriptionStatus !== 'canceling' && (
              <InfoRow>
                <InfoLabel>Prochains crédits</InfoLabel>
                <InfoValue>{new Date(clubCredit.nextCreditDate).toLocaleDateString('fr-FR')}</InfoValue>
              </InfoRow>
            )}

            <ButtonRow>
              {isClub || user?.role === 'CLUB' ? (
                <>
                  <Button variant="outline" size="sm" onClick={handleManageSubscription} disabled={portalLoading}>
                    {portalLoading ? 'Chargement...' : 'Gérer mon abonnement'}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/account/cancel')}
                    style={{ color: 'var(--text-light)', fontSize: '12px' }}>
                    Résilier / Passer au plan gratuit
                  </Button>
                </>
              ) : (
                <Button variant="primary" size="sm" onClick={() => navigate('/club/checkout')}>
                  Passer au Club — 9,99€/mois
                </Button>
              )}
            </ButtonRow>
          </CardBody>
        </Card>

        {/* Actions */}
        <Card>
          <CardBody>
            <ButtonRow>
              <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
                Ma bibliothèque
              </Button>
              <Button variant="outline" size="sm" onClick={() => { logout(); navigate('/'); }}>
                Déconnexion
              </Button>
            </ButtonRow>
          </CardBody>
        </Card>
      </MainContent>
      <Footer />
    </PageContainer>
  );
};

export default AccountPage;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { ApiService } from '../config/api';
import { getImageUrl } from '../config/constants';

const DetailContainer = styled.div`
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

const BackButton = styled.button`
  background: ${theme.colors.text.light};
  color: white;
  border: none;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background: ${theme.colors.text.secondary};
  }
`;

const Title = styled.h1`
  color: ${theme.colors.text.primary};
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
`;

const QuickActions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  align-items: center;
`;

const PhotoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  max-width: 300px;
`;

const PhotoPreview = styled.img`
  width: 100%;
  max-width: 200px;
  height: auto;
  border-radius: ${theme.borderRadius.md};
  border: 2px solid ${theme.colors.background.secondary};
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
    border-color: ${theme.colors.button.primary};
  }
`;

const PhotoActions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
`;

const DownloadButton = styled.button`
  background: ${theme.colors.button.primary};
  color: white;
  border: none;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background: ${theme.colors.button.primaryHover};
  }
`;

const ViewButton = styled.button`
  background: ${theme.colors.text.light};
  color: white;
  border: none;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background: ${theme.colors.text.secondary};
  }
`;

const StatusDropdown = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownButton = styled.button<{ disabled?: boolean }>`
  background: ${theme.colors.button.primary};
  color: white;
  border: none;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-size: ${theme.fontSizes.sm};
  font-weight: 500;
  opacity: ${props => props.disabled ? 0.6 : 1};
  transition: all 0.2s ease;
  min-width: 140px;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover:not(:disabled) {
    background: ${theme.colors.button.primaryHover};
    transform: translateY(-1px);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${theme.colors.button.primary}33;
  }
`;

const DropdownMenu = styled.div`
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

const DropdownItem = styled.button<{ disabled?: boolean }>`
  width: 100%;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: none;
  background: transparent;
  text-align: left;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.primary};
  opacity: ${props => props.disabled ? 0.5 : 1};
  transition: background-color 0.2s ease;

  &:hover:not(:disabled) {
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

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.lg};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
  background: white;
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.sm};
  overflow: hidden;
`;

const SectionHeader = styled.div`
  padding: ${theme.spacing.lg};
  border-bottom: 1px solid ${theme.colors.background.secondary};
  background: ${theme.colors.background.primary};
`;

const SectionTitle = styled.h2`
  margin: 0;
  color: ${theme.colors.text.primary};
  font-size: 1.25rem;
  font-weight: 600;
`;

const SectionContent = styled.div`
  padding: ${theme.spacing.lg};
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${theme.spacing.md};
  padding-bottom: ${theme.spacing.sm};
  border-bottom: 1px solid ${theme.colors.background.secondary};

  &:last-child {
    margin-bottom: 0;
    border-bottom: none;
  }
`;

const Label = styled.span`
  font-weight: 600;
  color: ${theme.colors.text.secondary};
  min-width: 140px;
`;

const Value = styled.span`
  color: ${theme.colors.text.primary};
  flex: 1;
  text-align: right;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  font-size: 0.875rem;
  font-weight: 500;
  background: ${props => {
    switch (props.status) {
      case 'PENDING': return theme.colors.status.warning + '20';
      case 'PAID': return theme.colors.status.success + '20';
      case 'PROCESSING': return theme.colors.status.info + '20';
      case 'GENERATED': return theme.colors.accent.coral + '40';
      case 'PRINTED': return theme.colors.accent.creamyYellow + '40';
      case 'SHIPPED': return theme.colors.accent.lightCoral + '40';
      case 'DELIVERED': return theme.colors.status.success + '20';
      case 'CANCELLED': return theme.colors.status.error + '20';
      default: return theme.colors.background.secondary;
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'PENDING': return theme.colors.status.warning;
      case 'PAID': return theme.colors.status.success;
      case 'PROCESSING': return theme.colors.status.info;
      case 'GENERATED': return theme.colors.text.primary;
      case 'PRINTED': return theme.colors.text.primary;
      case 'SHIPPED': return theme.colors.text.primary;
      case 'DELIVERED': return theme.colors.status.success;
      case 'CANCELLED': return theme.colors.status.error;
      default: return theme.colors.text.secondary;
    }
  }};
`;

const ErrorMessage = styled.div`
  background: ${theme.colors.status.error}20;
  color: ${theme.colors.status.error};
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  margin-bottom: ${theme.spacing.lg};
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: ${theme.spacing.xl};
  color: ${theme.colors.text.secondary};
`;

interface AdminOrderDetailPageProps {
  token: string;
}

export const AdminOrderDetailPage: React.FC<AdminOrderDetailPageProps> = ({ token }) => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (orderId) {
      loadOrderDetails();
    }
  }, [orderId]);
  
  if (!orderId) {
    return (
      <DetailContainer>
        <ErrorMessage>ID de commande manquant</ErrorMessage>
      </DetailContainer>
    );
  }

  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      // Récupérer le token le plus récent du localStorage
      const currentToken = localStorage.getItem('adminToken') || token;
      console.log('🔍 Chargement détails avec token:', currentToken?.substring(0, 20) + '...');
      
      const response = await ApiService.getAdminOrderDetails(currentToken, orderId!);
      if (response.success) {
        setOrder(response.data);
      } else {
        setError('Commande non trouvée');
      }
    } catch (error: any) {
      setError('Erreur lors du chargement des détails');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus: string) => {
    try {
      setUpdating(true);
      setError(''); // Effacer les erreurs précédentes
      
      const currentToken = localStorage.getItem('adminToken') || token;
      await ApiService.updateAdminOrder(currentToken, orderId, { status: newStatus });
      
      // Recharger les détails de la commande
      await loadOrderDetails();
      
    } catch (error: any) {
      setError('Erreur lors de la mise à jour du statut');
      console.error('Erreur update:', error);
      
      if (error.message.includes('401') || error.message.includes('Token')) {
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

  const formatPrice = (price: number) => {
    return `${price}€`;
  };

  const getStatusLabel = (status: string) => {
    const statusLabels: { [key: string]: string } = {
      'NEW_ORDER': 'Nouvelle commande',
      'IN_PROGRESS': 'En cours de création',
      'DELIVERED': 'Livré',
      'BLOCKED': 'Bloqué',
      // Anciens statuts pour compatibilité
      'PENDING': 'En attente',
      'PAID': 'Payé',
      'PROCESSING': 'En traitement',
      'GENERATED': 'Généré',
      'PRINTED': 'Imprimé',
      'SHIPPED': 'Expédié'
    };
    return statusLabels[status] || status;
  };

  const getAvailableStatuses = (currentStatus: string, productType: string) => {
    // Nouveaux statuts simplifiés
    return ['NEW_ORDER', 'IN_PROGRESS', 'DELIVERED', 'BLOCKED'];
  };

  const downloadPhoto = async (photoUrl: string, filename: string) => {
    try {
      const response = await fetch(photoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      setError('Erreur lors du téléchargement de l\'image');
    }
  };

  if (loading) {
    return (
      <DetailContainer>
        <LoadingMessage>Chargement des détails de la commande...</LoadingMessage>
      </DetailContainer>
    );
  }

  if (!order) {
    return (
      <DetailContainer>
        <ErrorMessage>Commande non trouvée</ErrorMessage>
      </DetailContainer>
    );
  }

  return (
    <DetailContainer>
      <Header>
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
          <BackButton onClick={() => navigate('/admin')}>
            ← Retour
          </BackButton>
          <Title>Commande #{order.id.slice(-8)}</Title>
        </div>
        
        <QuickActions>
          <StatusDropdown>
            <DropdownButton disabled={updating}>
              {getStatusLabel(order.status)} ▼
            </DropdownButton>
            <DropdownMenu>
              {getAvailableStatuses(order.status, order.productType).map(status => (
                <DropdownItem 
                  key={status}
                  onClick={() => updateOrderStatus(status)}
                  disabled={updating}
                >
                  {getStatusLabel(status)}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </StatusDropdown>
        </QuickActions>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <ContentGrid>
        {/* Informations générales */}
        <Section>
          <SectionHeader>
            <SectionTitle>Informations générales</SectionTitle>
          </SectionHeader>
          <SectionContent>
            <InfoRow>
              <Label>Statut :</Label>
              <Value><StatusBadge status={order.status}>{order.status}</StatusBadge></Value>
            </InfoRow>
            <InfoRow>
              <Label>Client :</Label>
              <Value>{order.user?.email || 'N/A'}</Value>
            </InfoRow>
            <InfoRow>
              <Label>Produit :</Label>
              <Value>{order.productType}</Value>
            </InfoRow>
            <InfoRow>
              <Label>Prix :</Label>
              <Value>{formatPrice(order.price)}</Value>
            </InfoRow>
            <InfoRow>
              <Label>Créé le :</Label>
              <Value>{formatDate(order.createdAt)}</Value>
            </InfoRow>
            {order.paidAt && (
              <InfoRow>
                <Label>Payé le :</Label>
                <Value>{formatDate(order.paidAt)}</Value>
              </InfoRow>
            )}
          </SectionContent>
        </Section>

        {/* Détails du conte */}
        <Section>
          <SectionHeader>
            <SectionTitle>🎨 Détails du conte</SectionTitle>
          </SectionHeader>
          <SectionContent>
            <InfoRow>
              <Label>Tranche d'âge :</Label>
              <Value>{order.ageRange}</Value>
            </InfoRow>
            <InfoRow>
              <Label>Thème général :</Label>
              <Value>
                {order.generalTheme === 'custom' && order.customTheme 
                  ? `Personnalisé : ${order.customTheme}`
                  : order.generalTheme}
              </Value>
            </InfoRow>
            <InfoRow>
              <Label>Sujet spécifique :</Label>
              <Value>
                {order.specificSubject === 'custom' && order.customSubject 
                  ? `Personnalisé : ${order.customSubject}`
                  : order.specificSubject}
              </Value>
            </InfoRow>
            <InfoRow>
              <Label>Message central :</Label>
              <Value>
                {order.centralMessage === 'custom' && order.customMessage 
                  ? `Personnalisé : ${order.customMessage}`
                  : order.centralMessage}
              </Value>
            </InfoRow>
            <InfoRow>
              <Label>Style d'illustration :</Label>
              <Value>{order.illustrationStyle}</Value>
            </InfoRow>
            {order.language && (
              <InfoRow>
                <Label>Langue du conte :</Label>
                <Value>{order.language}</Value>
              </InfoRow>
            )}
          </SectionContent>
        </Section>

        {/* Protagoniste */}
        <Section>
          <SectionHeader>
            <SectionTitle>🧍 Protagoniste</SectionTitle>
          </SectionHeader>
          <SectionContent>
            <InfoRow>
              <Label>Nom :</Label>
              <Value>{order.protagonistName}</Value>
            </InfoRow>
            {order.protagonistAge && (
              <InfoRow>
                <Label>Âge :</Label>
                <Value>{order.protagonistAge}</Value>
              </InfoRow>
            )}
            {order.protagonistGender && (
              <InfoRow>
                <Label>Sexe :</Label>
                <Value>{order.protagonistGender === 'boy' ? 'Garçon' : 'Fille'}</Value>
              </InfoRow>
            )}
            {order.eyeColor && (
              <InfoRow>
                <Label>Couleur des yeux :</Label>
                <Value>{order.eyeColor}</Value>
              </InfoRow>
            )}
            {order.hairColor && (
              <InfoRow>
                <Label>Couleur des cheveux :</Label>
                <Value>{order.hairColor}</Value>
              </InfoRow>
            )}
            {order.secondaryCharacterName && (
              <InfoRow>
                <Label>Personnage secondaire :</Label>
                <Value>{order.secondaryCharacterName}</Value>
              </InfoRow>
            )}
            {order.secondaryCharacterAge && (
              <InfoRow>
                <Label>Âge/Type du personnage secondaire :</Label>
                <Value>{order.secondaryCharacterAge}</Value>
              </InfoRow>
            )}
            {order.photoUrl && (
              <InfoRow>
                <Label>Photo de référence :</Label>
                <Value>
                  <PhotoContainer>
                    <PhotoPreview 
                      src={getImageUrl(order.photoUrl)} 
                      alt="Photo de référence du protagoniste"
                      onClick={() => {
                        const imageUrl = getImageUrl(order.photoUrl);
                        if (imageUrl) window.open(imageUrl, '_blank');
                      }}
                    />
                    <PhotoActions>
                      <DownloadButton 
                        onClick={() => {
                          const imageUrl = getImageUrl(order.photoUrl);
                          if (imageUrl) downloadPhoto(imageUrl, `photo-${order.protagonistName}-${order.id.slice(-8)}.jpg`);
                        }}
                      >
                        📥 Télécharger
                      </DownloadButton>
                      <ViewButton 
                        onClick={() => {
                          const imageUrl = getImageUrl(order.photoUrl);
                          if (imageUrl) window.open(imageUrl, '_blank');
                        }}
                      >
                        👁️ Voir en grand
                      </ViewButton>
                    </PhotoActions>
                  </PhotoContainer>
                </Value>
              </InfoRow>
            )}
          </SectionContent>
        </Section>

        {/* Informations supplémentaires */}
        {(order.hobbies || order.favoriteDish || order.specialEvents || order.religion || order.creatorName) && (
          <Section>
            <SectionHeader>
              <SectionTitle>📝 Informations supplémentaires</SectionTitle>
            </SectionHeader>
            <SectionContent>
              {order.hobbies && (
                <InfoRow>
                  <Label>Loisirs / Centres d'intérêt :</Label>
                  <Value>{order.hobbies}</Value>
                </InfoRow>
              )}
              {order.favoriteDish && (
                <InfoRow>
                  <Label>Plat préféré :</Label>
                  <Value>{order.favoriteDish}</Value>
                </InfoRow>
              )}
              {order.specialEvents && (
                <InfoRow>
                  <Label>Événements particuliers :</Label>
                  <Value>{order.specialEvents}</Value>
                </InfoRow>
              )}
              {order.religion && (
                <InfoRow>
                  <Label>Religion :</Label>
                  <Value>
                    {order.religion === 'other' && order.customReligion 
                      ? `Autre : ${order.customReligion}`
                      : order.religion}
                  </Value>
                </InfoRow>
              )}
              {order.creatorName && (
                <InfoRow>
                  <Label>Nom du créateur :</Label>
                  <Value>{order.creatorName}</Value>
                </InfoRow>
              )}
            </SectionContent>
          </Section>
        )}

        {/* Adresse de livraison */}
        {(order.shippingFirstName || order.shippingAddress) && (
          <Section>
            <SectionHeader>
              <SectionTitle>📦 Adresse de livraison</SectionTitle>
            </SectionHeader>
            <SectionContent>
              {order.shippingFirstName && (
                <InfoRow>
                  <Label>Nom :</Label>
                  <Value>{order.shippingFirstName} {order.shippingLastName}</Value>
                </InfoRow>
              )}
              {order.shippingAddress && (
                <InfoRow>
                  <Label>Adresse :</Label>
                  <Value>{order.shippingAddress}</Value>
                </InfoRow>
              )}
              {order.shippingCity && (
                <InfoRow>
                  <Label>Ville :</Label>
                  <Value>{order.shippingPostalCode} {order.shippingCity}</Value>
                </InfoRow>
              )}
            </SectionContent>
          </Section>
        )}
      </ContentGrid>
    </DetailContainer>
  );
};

export default AdminOrderDetailPage;

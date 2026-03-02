import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { ApiService } from '../config/api';
import { AdminLayout } from '../components/admin/AdminLayout';
import { getImageUrl } from '../config/constants';

// ========== Styled ==========

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.light};
  margin-bottom: ${theme.spacing.lg};

  a, span.link {
    color: ${theme.colors.admin.accent};
    cursor: pointer;
    text-decoration: none;
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
`;

const HeaderActions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  align-items: center;
`;

const Timeline = styled.div`
  display: flex;
  gap: 0;
  margin-bottom: ${theme.spacing.xl};
  background: white;
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.admin.cardBorder};
  padding: ${theme.spacing.lg};
  overflow-x: auto;
`;

const TimelineStep = styled.div<{ $active?: boolean; $done?: boolean }>`
  flex: 1;
  text-align: center;
  position: relative;
  min-width: 120px;

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    top: 14px;
    right: -50%;
    width: 100%;
    height: 2px;
    background: ${props => props.$done ? theme.colors.status.success : theme.colors.admin.cardBorder};
  }
`;

const TimelineDot = styled.div<{ $active?: boolean; $done?: boolean }>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  margin: 0 auto ${theme.spacing.xs};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  position: relative;
  z-index: 1;
  background: ${props => props.$done ? theme.colors.status.success : props.$active ? theme.colors.admin.accent : theme.colors.admin.cardBorder};
  color: ${props => (props.$done || props.$active) ? 'white' : theme.colors.text.light};
`;

const TimelineLabel = styled.div`
  font-size: ${theme.fontSizes.xs};
  font-weight: 600;
  color: ${theme.colors.text.secondary};
`;

const TimelineDate = styled.div`
  font-size: 10px;
  color: ${theme.colors.text.light};
  margin-top: 2px;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.md}) {
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
  font-size: ${theme.fontSizes.base};
  font-weight: 600;
  color: ${theme.colors.text.primary};
`;

const CardBody = styled.div`
  padding: ${theme.spacing.lg};
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: ${theme.spacing.sm} 0;
  border-bottom: 1px solid ${theme.colors.admin.cardBorder}40;

  &:last-child { border-bottom: none; }
`;

const Label = styled.span`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.light};
  font-weight: 500;
  min-width: 130px;
`;

const Value = styled.span`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.primary};
  text-align: right;
  flex: 1;
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

const StatusDropdownWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const StatusBtn = styled.button<{ $bg: string }>`
  padding: 6px 14px;
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
  border: none;
  cursor: pointer;
  background: ${props => props.$bg};
  color: white;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover { opacity: 0.9; }
`;

const StatusMenuDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  min-width: 180px;
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

const StatusMenuItemBtn = styled.button`
  width: 100%;
  padding: 8px 14px;
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

const PhotoPreview = styled.img`
  max-width: 180px;
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.admin.cardBorder};
  cursor: pointer;
  &:hover { opacity: 0.9; }
`;

const PhotoActions = styled.div`
  display: flex;
  gap: ${theme.spacing.xs};
  margin-top: ${theme.spacing.xs};
`;

const SmallBtn = styled.button<{ $variant?: string }>`
  padding: 4px 10px;
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.fontSizes.xs};
  font-weight: 500;
  cursor: pointer;
  border: 1px solid ${theme.colors.admin.accent};
  background: ${props => props.$variant === 'fill' ? theme.colors.admin.accent : 'transparent'};
  color: ${props => props.$variant === 'fill' ? 'white' : theme.colors.admin.accent};

  &:hover { opacity: 0.8; }
`;

const CharacterItem = styled.div`
  background: ${theme.colors.admin.contentBg};
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  border-left: 3px solid ${theme.colors.admin.accent};
  margin-bottom: ${theme.spacing.xs};
  font-size: ${theme.fontSizes.sm};
`;

const UploadZone = styled.div<{ $isDragOver?: boolean }>`
  border: 2px dashed ${props => props.$isDragOver ? theme.colors.admin.accent : theme.colors.admin.cardBorder};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xl};
  text-align: center;
  background: ${props => props.$isDragOver ? theme.colors.admin.accent + '08' : theme.colors.admin.contentBg};
  cursor: pointer;
  transition: all 0.2s;
  &:hover { border-color: ${theme.colors.admin.accent}; }
`;

const DeliverButton = styled.button`
  background: ${theme.colors.status.success};
  color: white;
  border: none;
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  font-weight: 600;
  font-size: ${theme.fontSizes.sm};
  width: 100%;
  &:hover { opacity: 0.9; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const PdfInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: ${theme.colors.status.success}15;
  border-radius: ${theme.borderRadius.md};
  color: ${theme.colors.status.success};
  font-weight: 500;
  font-size: ${theme.fontSizes.sm};
  margin-bottom: ${theme.spacing.sm};
`;

const SuccessMsg = styled.div`
  background: ${theme.colors.status.success}15;
  color: ${theme.colors.status.success};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  margin-bottom: ${theme.spacing.sm};
  font-weight: 500;
  font-size: ${theme.fontSizes.sm};
`;

const ErrorMsg = styled.div`
  background: ${theme.colors.status.error}10;
  border: 1px solid ${theme.colors.status.error}30;
  color: ${theme.colors.status.error};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  margin-bottom: ${theme.spacing.md};
  font-size: ${theme.fontSizes.sm};
`;

const LoadingState = styled.div`
  text-align: center;
  padding: ${theme.spacing['3xl']};
  color: ${theme.colors.text.light};
`;

// ========== Helpers ==========

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  PENDING: { label: 'En attente', color: '#6B7280', bg: '#F3F4F6' },
  UNPAID: { label: 'Non payee', color: '#9333EA', bg: '#F3E8FF' },
  PAID: { label: 'Payee - A traiter', color: '#D97706', bg: '#FEF3C7' },
  BLOCKED: { label: 'Bloquee', color: '#DC2626', bg: '#FEE2E2' },
  DELIVERED: { label: 'Livree', color: '#059669', bg: '#D1FAE5' },
};

const ALL_STATUSES = Object.keys(STATUS_CONFIG);

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

// ========== Component ==========

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
  const [uploading, setUploading] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [delivering, setDelivering] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const pdfInputRef = React.useRef<HTMLInputElement>(null);
  const coverInputRef = React.useRef<HTMLInputElement>(null);

  const getToken = () => localStorage.getItem('adminToken') || token;

  useEffect(() => {
    if (orderId) loadOrderDetails();
  }, [orderId]);

  if (!orderId) {
    return <AdminLayout><ErrorMsg>ID de commande manquant</ErrorMsg></AdminLayout>;
  }

  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getAdminOrderDetails(getToken(), orderId!);
      if (response.success) setOrder(response.data);
      else setError('Commande non trouvee');
    } catch {
      setError('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus: string) => {
    try {
      setUpdating(true);
      setError('');
      await ApiService.updateAdminOrder(getToken(), orderId, { status: newStatus });
      await loadOrderDetails();
    } catch (err: any) {
      setError('Erreur mise a jour: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handlePdfUpload = async (file: File) => {
    if (!file || file.type !== 'application/pdf') {
      setError('Veuillez selectionner un fichier PDF');
      return;
    }
    try {
      setUploading(true);
      setError('');
      await ApiService.uploadStoryPdf(getToken(), orderId!, file);
      setUploadSuccess('PDF uploade avec succes');
      await loadOrderDetails();
      setTimeout(() => setUploadSuccess(''), 3000);
    } catch (err: any) {
      setError('Erreur upload: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeliver = async () => {
    if (!window.confirm('Livrer ce conte ? Un email sera envoye au client.')) return;
    try {
      setDelivering(true);
      setError('');
      await ApiService.deliverStory(getToken(), orderId!);
      setUploadSuccess('Conte livre ! Email envoye.');
      await loadOrderDetails();
      setTimeout(() => setUploadSuccess(''), 5000);
    } catch (err: any) {
      setError('Erreur livraison: ' + err.message);
    } finally {
      setDelivering(false);
    }
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
    } catch {
      setError('Erreur telechargement image');
    }
  };

  const handleCoverUpload = async (file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      setError('Veuillez selectionner une image (PNG, JPG)');
      return;
    }
    try {
      setUploadingCover(true);
      setError('');
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      await ApiService.saveCoverImage(orderId!, base64);
      setUploadSuccess('Couverture uploadee avec succes');
      await loadOrderDetails();
      setTimeout(() => setUploadSuccess(''), 3000);
    } catch (err: any) {
      setError('Erreur upload couverture: ' + err.message);
    } finally {
      setUploadingCover(false);
    }
  };

  const parseSecondaryCharacters = (json?: string | null) => {
    if (!json) return [];
    try { return JSON.parse(json); } catch { return []; }
  };

  if (loading) return <AdminLayout><LoadingState>Chargement...</LoadingState></AdminLayout>;
  if (!order) return <AdminLayout><ErrorMsg>Commande non trouvee</ErrorMsg></AdminLayout>;

  const cfg = STATUS_CONFIG[order.status] || { label: order.status, color: '#6B7280', bg: '#F3F4F6' };

  // Timeline steps
  const steps = [
    { label: 'Cree', date: order.createdAt },
    { label: 'Paye', date: order.paidAt },
    { label: 'PDF genere', date: order.generatedAt || (order.pdfUrl ? order.updatedAt : null) },
    { label: 'Livre', date: order.deliveredAt },
  ];

  const purchaseTypeBadge = () => {
    if (order.purchaseType === 'CLUB' && Number(order.price) === 0) return <Badge $color="#059669" $bg="#D1FAE5">Club gratuit</Badge>;
    if (order.purchaseType === 'CLUB') return <Badge $color="#7C3AED" $bg="#EDE9FE">Club payant</Badge>;
    return <Badge $color="#6B7280" $bg="#F3F4F6">Achat unique</Badge>;
  };

  const secondaryChars = parseSecondaryCharacters(order.secondaryCharactersJson);

  return (
    <AdminLayout>
      {/* Breadcrumb */}
      <Breadcrumb>
        <span className="link" onClick={() => navigate('/admin')}>Admin</span>
        <span>/</span>
        <span className="link" onClick={() => navigate('/admin/orders')}>Commandes</span>
        <span>/</span>
        <span>#{order.id.slice(-8)}</span>
      </Breadcrumb>

      {/* Header */}
      <PageHeader>
        <PageTitle>Commande #{order.id.slice(-8)}</PageTitle>
        <HeaderActions>
          <StatusDropdownWrapper>
            <StatusBtn $bg={cfg.color} disabled={updating}>
              {cfg.label} ▾
            </StatusBtn>
            <StatusMenuDropdown>
              {ALL_STATUSES.map(s => (
                <StatusMenuItemBtn key={s} onClick={() => updateOrderStatus(s)} disabled={updating}>
                  {STATUS_CONFIG[s]?.label || s}
                </StatusMenuItemBtn>
              ))}
            </StatusMenuDropdown>
          </StatusDropdownWrapper>
          <button
            onClick={async () => {
              if (!window.confirm('Supprimer cette commande definitivement ?')) return;
              try {
                await ApiService.deleteAdminOrder(localStorage.getItem('adminToken') || '', order.id);
                navigate('/admin/orders');
              } catch (err: any) {
                setError('Erreur suppression: ' + err.message);
              }
            }}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              background: 'transparent',
              color: '#DC2626',
              border: '1px solid #DC2626',
              transition: 'all 0.15s'
            }}
          >
            Supprimer
          </button>
        </HeaderActions>
      </PageHeader>

      {error && <ErrorMsg>{error}</ErrorMsg>}
      {uploadSuccess && <SuccessMsg>{uploadSuccess}</SuccessMsg>}

      {/* Timeline */}
      <Timeline>
        {steps.map((step, i) => {
          const done = !!step.date;
          const active = !done && (i === 0 || !!steps[i - 1]?.date);
          return (
            <TimelineStep key={i} $done={done} $active={active}>
              <TimelineDot $done={done} $active={active}>
                {done ? '✓' : i + 1}
              </TimelineDot>
              <TimelineLabel>{step.label}</TimelineLabel>
              {step.date && <TimelineDate>{formatDate(step.date)}</TimelineDate>}
            </TimelineStep>
          );
        })}
      </Timeline>

      {/* Content */}
      <ContentGrid>
        {/* General info */}
        <Card>
          <CardHeader>Informations generales</CardHeader>
          <CardBody>
            <InfoRow><Label>Statut</Label><Value><Badge $color={cfg.color} $bg={cfg.bg}>{cfg.label}</Badge></Value></InfoRow>
            <InfoRow><Label>Client</Label><Value>
              <span style={order.user?.role === 'CLUB' ? { color: '#B8860B', fontWeight: 600 } : {}}>
                {order.user?.email || '-'}
              </span>
              {order.user?.role === 'CLUB' && <span style={{ marginLeft: '8px', padding: '2px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, color: '#92400E', background: '#FDE68A' }}>Club</span>}
            </Value></InfoRow>
            <InfoRow><Label>Produit</Label><Value>{order.productType}</Value></InfoRow>
            <InfoRow><Label>Type d'achat</Label><Value>{purchaseTypeBadge()}</Value></InfoRow>
            <InfoRow><Label>Prix</Label><Value>{Number(order.price).toFixed(2)}€</Value></InfoRow>
            <InfoRow><Label>Cree le</Label><Value>{formatDate(order.createdAt)}</Value></InfoRow>
            {order.paidAt && <InfoRow><Label>Paye le</Label><Value>{formatDate(order.paidAt)}</Value></InfoRow>}
            {order.deliveredAt && <InfoRow><Label>Livre le</Label><Value>{formatDate(order.deliveredAt)}</Value></InfoRow>}
          </CardBody>
        </Card>

        {/* Story details */}
        <Card>
          <CardHeader>Details du conte</CardHeader>
          <CardBody>
            <InfoRow><Label>Tranche d'age</Label><Value>{order.ageRange}</Value></InfoRow>
            <InfoRow><Label>Theme</Label><Value>{order.generalTheme === 'custom' && order.customTheme ? order.customTheme : order.generalTheme}</Value></InfoRow>
            <InfoRow><Label>Sujet</Label><Value>{order.specificSubject === 'custom' && order.customSubject ? order.customSubject : order.specificSubject}</Value></InfoRow>
            <InfoRow><Label>Message</Label><Value>{order.centralMessage === 'custom' && order.customMessage ? order.customMessage : order.centralMessage}</Value></InfoRow>
            <InfoRow><Label>Illustration</Label><Value>{order.illustrationStyle}</Value></InfoRow>
            {order.language && <InfoRow><Label>Langue</Label><Value>{order.language}</Value></InfoRow>}
          </CardBody>
        </Card>

        {/* Protagonist */}
        <Card>
          <CardHeader>Protagoniste</CardHeader>
          <CardBody>
            <InfoRow><Label>Nom</Label><Value>{order.protagonistName}</Value></InfoRow>
            {order.protagonistAge && <InfoRow><Label>Age</Label><Value>{order.protagonistAge}</Value></InfoRow>}
            {order.protagonistGender && <InfoRow><Label>Sexe</Label><Value>{order.protagonistGender === 'boy' ? 'Garcon' : 'Fille'}</Value></InfoRow>}
            {order.eyeColor && <InfoRow><Label>Yeux</Label><Value>{order.eyeColor}</Value></InfoRow>}
            {order.hairColor && <InfoRow><Label>Cheveux</Label><Value>{order.hairColor}</Value></InfoRow>}
            {order.skinColor && <InfoRow><Label>Peau</Label><Value>{order.skinColor}</Value></InfoRow>}
            {order.photoUrl && (
              <div style={{ marginTop: theme.spacing.sm }}>
                <PhotoPreview
                  src={getImageUrl(order.photoUrl)}
                  alt="Photo"
                  onClick={() => window.open(getImageUrl(order.photoUrl), '_blank')}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <PhotoActions>
                  <SmallBtn $variant="fill" onClick={() => { const url = getImageUrl(order.photoUrl); if (url) downloadPhoto(url, `photo-${order.protagonistName}-${order.id.slice(-8)}.jpg`); }}>
                    Telecharger
                  </SmallBtn>
                  <SmallBtn onClick={() => window.open(getImageUrl(order.photoUrl), '_blank')}>
                    Agrandir
                  </SmallBtn>
                </PhotoActions>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Cover image */}
        <Card>
          <CardHeader>Couverture du conte</CardHeader>
          <CardBody>
            {order.coverImageUrl ? (
              <>
                {order.coverTitle && (
                  <InfoRow><Label>Titre GPT</Label><Value>{order.coverTitle}</Value></InfoRow>
                )}
                <div style={{ marginTop: theme.spacing.sm }}>
                  <PhotoPreview
                    src={getImageUrl(order.coverImageUrl)}
                    alt="Couverture"
                    onClick={() => window.open(getImageUrl(order.coverImageUrl), '_blank')}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <PhotoActions>
                    <SmallBtn $variant="fill" onClick={() => { const url = getImageUrl(order.coverImageUrl); if (url) downloadPhoto(url, `couverture-${order.protagonistName}-${order.id.slice(-8)}.png`); }}>
                      Telecharger
                    </SmallBtn>
                    <SmallBtn onClick={() => window.open(getImageUrl(order.coverImageUrl), '_blank')}>
                      Agrandir
                    </SmallBtn>
                  </PhotoActions>
                </div>
              </>
            ) : (
              <div style={{ padding: theme.spacing.lg, textAlign: 'center' }}>
                <div style={{ color: theme.colors.text.light, marginBottom: theme.spacing.md }}>
                  Aucune couverture generee
                </div>
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => { if (e.target.files?.[0]) handleCoverUpload(e.target.files[0]); }}
                />
                <SmallBtn
                  $variant="fill"
                  onClick={() => coverInputRef.current?.click()}
                  disabled={uploadingCover}
                  style={{ padding: '6px 16px' }}
                >
                  {uploadingCover ? 'Upload en cours...' : 'Uploader une couverture'}
                </SmallBtn>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Secondary characters */}
        {(secondaryChars.length > 0 || order.secondaryCharacterName) && (
          <Card>
            <CardHeader>Personnages secondaires</CardHeader>
            <CardBody>
              {secondaryChars.length > 0 ? (
                secondaryChars.map((char: any, i: number) => (
                  <CharacterItem key={i}>
                    <strong>{i + 1}. {char.name}</strong> ({char.kind === 'human' ? 'Humain' : 'Animal'})
                    {char.ageOrType && <div style={{ fontSize: theme.fontSizes.xs, color: theme.colors.text.light }}>Age/Type: {char.ageOrType}</div>}
                    {char.physical && <div style={{ fontSize: theme.fontSizes.xs, color: theme.colors.text.light }}>Caract.: {char.physical}</div>}
                  </CharacterItem>
                ))
              ) : (
                <InfoRow>
                  <Label>Personnage</Label>
                  <Value>{order.secondaryCharacterName} {order.secondaryCharacterAge && `(${order.secondaryCharacterAge})`}</Value>
                </InfoRow>
              )}
            </CardBody>
          </Card>
        )}

        {/* Additional info */}
        {(order.hobbies || order.favoriteDish || order.specialEvents || order.religion || order.creatorName) && (
          <Card>
            <CardHeader>Informations supplementaires</CardHeader>
            <CardBody>
              {order.hobbies && <InfoRow><Label>Loisirs</Label><Value>{order.hobbies}</Value></InfoRow>}
              {order.favoriteDish && <InfoRow><Label>Plat prefere</Label><Value>{order.favoriteDish}</Value></InfoRow>}
              {order.specialEvents && <InfoRow><Label>Evenements</Label><Value>{order.specialEvents}</Value></InfoRow>}
              {order.religion && <InfoRow><Label>Religion</Label><Value>{order.religion === 'other' && order.customReligion ? order.customReligion : order.religion}</Value></InfoRow>}
              {order.creatorName && <InfoRow><Label>Createur</Label><Value>{order.creatorName}</Value></InfoRow>}
            </CardBody>
          </Card>
        )}


        {/* PDF & Delivery */}
        <Card>
          <CardHeader>PDF & Livraison</CardHeader>
          <CardBody>
            {order.pdfUrl ? (
              <>
                <PdfInfo>PDF: {order.pdfUrl.split('/').pop()}</PdfInfo>
                {order.storyStatus === 'DISPONIBLE' && !order.deliveredAt && (
                  <DeliverButton onClick={handleDeliver} disabled={delivering}>
                    {delivering ? 'Livraison...' : 'Livrer au client'}
                  </DeliverButton>
                )}
                {order.deliveredAt && (
                  <PdfInfo>Livre le {new Date(order.deliveredAt).toLocaleDateString('fr-FR')}</PdfInfo>
                )}
              </>
            ) : (
              <>
                <input
                  type="file"
                  accept="application/pdf"
                  ref={pdfInputRef}
                  style={{ display: 'none' }}
                  onChange={(e) => { const file = e.target.files?.[0]; if (file) handlePdfUpload(file); }}
                />
                <UploadZone
                  $isDragOver={isDragOver}
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={(e) => { e.preventDefault(); setIsDragOver(false); const f = e.dataTransfer.files[0]; if (f) handlePdfUpload(f); }}
                  onClick={() => pdfInputRef.current?.click()}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '4px' }}>📄</div>
                  <div style={{ fontSize: theme.fontSizes.sm, color: theme.colors.text.light }}>
                    {uploading ? 'Upload en cours...' : 'Glissez un PDF ou cliquez'}
                  </div>
                </UploadZone>
              </>
            )}
          </CardBody>
        </Card>
      </ContentGrid>
    </AdminLayout>
  );
};

export default AdminOrderDetailPage;

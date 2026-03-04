import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: ${theme.spacing.md};
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

const FilterBtn = styled.button<{ $active?: boolean }>`
  padding: 4px 12px;
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.xs};
  font-weight: 600;
  border: 1px solid ${props => props.$active ? theme.colors.admin.accent : theme.colors.admin.cardBorder};
  background: ${props => props.$active ? theme.colors.admin.accent : 'white'};
  color: ${props => props.$active ? 'white' : theme.colors.text.primary};
  cursor: pointer;
  transition: all 0.15s;
  &:hover { border-color: ${theme.colors.admin.accent}; }
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

const ActionBtn = styled.button<{ $variant?: 'primary' | 'success' | 'warning' | 'danger' | 'ghost' }>`
  padding: 6px 14px;
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.fontSizes.xs};
  font-weight: 600;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 0.15s;

  ${props => {
    switch (props.$variant) {
      case 'success':
        return `background: #10B981; color: white;`;
      case 'warning':
        return `background: #F59E0B; color: white;`;
      case 'danger':
        return `background: #EF4444; color: white;`;
      case 'ghost':
        return `background: transparent; color: ${theme.colors.admin.accent}; border: 1px solid ${theme.colors.admin.accent};`;
      default:
        return `background: ${theme.colors.admin.accent}; color: white;`;
    }
  }}

  &:hover { opacity: 0.85; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const ActionsRow = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  flex-wrap: wrap;
`;

const ProgressBarOuter = styled.div`
  width: 100%;
  height: 8px;
  background: ${theme.colors.admin.cardBorder};
  border-radius: 4px;
  overflow: hidden;
  margin-top: 4px;
`;

const ProgressBarInner = styled.div<{ $width: number; $color?: string }>`
  height: 100%;
  width: ${props => props.$width}%;
  background: ${props => props.$color || theme.colors.admin.accent};
  border-radius: 4px;
  transition: width 0.5s ease;
`;

const ProgressText = styled.span`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.text.light};
`;

const EmptyState = styled.div`
  padding: ${theme.spacing.xl};
  text-align: center;
  color: ${theme.colors.text.light};
  font-size: ${theme.fontSizes.sm};
`;

const ErrorMsg = styled.div`
  color: #EF4444;
  font-size: ${theme.fontSizes.xs};
  margin-top: 4px;
  max-width: 300px;
  word-break: break-word;
`;

// Expandable detail panel
const DetailPanel = styled.tr`
  & > td {
    padding: 0;
    border-bottom: 2px solid ${theme.colors.admin.accent}20;
  }
`;

const DetailContent = styled.div`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  background: ${theme.colors.admin.contentBg};
`;

const LogEntry = styled.div<{ $status?: string }>`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-left: 3px solid ${props =>
    props.$status === 'completed' ? '#10B981' :
    props.$status === 'failed' ? '#EF4444' : '#F59E0B'
  };
  background: white;
  border-radius: 0 ${theme.borderRadius.sm} ${theme.borderRadius.sm} 0;
  margin-bottom: ${theme.spacing.xs};
  font-size: ${theme.fontSizes.sm};
`;

const UploadZone = styled.div<{ $isDragOver?: boolean }>`
  border: 2px dashed ${props => props.$isDragOver ? theme.colors.admin.accent : theme.colors.admin.cardBorder};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md};
  text-align: center;
  background: ${props => props.$isDragOver ? theme.colors.admin.accent + '08' : 'white'};
  cursor: pointer;
  transition: all 0.2s;
  margin-top: ${theme.spacing.sm};
  &:hover { border-color: ${theme.colors.admin.accent}; }
`;

// Test order form styles
const FormOverlay = styled.div<{ $open: boolean }>`
  display: ${props => props.$open ? 'block' : 'none'};
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 200;
`;

const FormModal = styled.div<{ $open: boolean }>`
  display: ${props => props.$open ? 'block' : 'none'};
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xl};
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  z-index: 201;
  box-shadow: ${theme.shadows.lg};
`;

const FormTitle = styled.h3`
  margin: 0 0 ${theme.spacing.md};
  font-size: ${theme.fontSizes.lg};
  font-weight: 600;
`;

const FormField = styled.div`
  margin-bottom: ${theme.spacing.md};
`;

const FormLabel = styled.label`
  display: block;
  font-size: ${theme.fontSizes.sm};
  font-weight: 500;
  color: ${theme.colors.text.primary};
  margin-bottom: 4px;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${theme.colors.admin.cardBorder};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.fontSizes.sm};
  box-sizing: border-box;
  &:focus { outline: none; border-color: ${theme.colors.admin.accent}; }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${theme.colors.admin.cardBorder};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.fontSizes.sm};
  background: white;
  box-sizing: border-box;
  &:focus { outline: none; border-color: ${theme.colors.admin.accent}; }
`;

const FormActions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  justify-content: flex-end;
  margin-top: ${theme.spacing.lg};
`;

// ========== Helpers ==========

function getStoryStatusBadge(status: string) {
  const map: Record<string, { color: string; bg: string; label: string }> = {
    'EN_COURS': { color: '#6B7280', bg: '#F3F4F6', label: 'En attente' },
    'GENERATING_TEXT': { color: '#2563EB', bg: '#DBEAFE', label: 'Texte...' },
    'GENERATING_IMAGES': { color: '#7C3AED', bg: '#EDE9FE', label: 'Images...' },
    'ASSEMBLING_PDF': { color: '#D97706', bg: '#FEF3C7', label: 'PDF...' },
    'DISPONIBLE': { color: '#059669', bg: '#D1FAE5', label: 'Disponible' },
    'GENERATION_FAILED': { color: '#DC2626', bg: '#FEE2E2', label: 'Echec' },
  };
  const s = map[status] || { color: '#6B7280', bg: '#F3F4F6', label: status };
  return <Badge $color={s.color} $bg={s.bg}>{s.label}</Badge>;
}

function getOrderStatusBadge(status: string) {
  const map: Record<string, { color: string; bg: string; label: string }> = {
    'GENERATING': { color: '#2563EB', bg: '#DBEAFE', label: 'En generation' },
    'GENERATED': { color: '#10B981', bg: '#D1FAE5', label: 'Prete a livrer' },
  };
  const s = map[status] || { color: '#6B7280', bg: '#F3F4F6', label: status };
  return <Badge $color={s.color} $bg={s.bg}>{s.label}</Badge>;
}

function getProgressLabel(status: string, progress: number | null): string {
  if (status === 'GENERATING_TEXT') return 'Generation du texte...';
  if (status === 'GENERATING_IMAGES') {
    const imgNum = progress ? Math.max(1, Math.round((progress - 10) / 83 * 6)) : 0;
    return `Illustration ${Math.min(imgNum, 6)}/6...`;
  }
  if (status === 'ASSEMBLING_PDF') return 'Assemblage PDF...';
  if (status === 'DISPONIBLE') return 'Termine';
  if (status === 'GENERATION_FAILED') return 'Echec';
  return '';
}

const GENERATING_STATUSES = ['GENERATING_TEXT', 'GENERATING_IMAGES', 'ASSEMBLING_PDF'];

type FilterType = 'all' | 'in_progress' | 'failed' | 'done' | 'validated';

// ========== Component ==========

interface Props {
  token: string;
}

const AdminGenerationPage: React.FC<Props> = ({ token }) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTestForm, setShowTestForm] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [logs, setLogs] = useState<Record<string, any[]>>({});
  const [filter, setFilter] = useState<FilterType>('all');
  const [isDragOver, setIsDragOver] = useState<string | null>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const replacingOrderId = useRef<string | null>(null);

  // Test form state
  const [testForm, setTestForm] = useState({
    protagonistName: 'Luna',
    protagonistAge: '7',
    protagonistGender: 'girl',
    ageRange: '6-9',
    generalTheme: 'fairy-tales',
    specificSubject: 'birthday',
    centralMessage: 'courage',
    illustrationStyle: 'illustrated-book',
    language: 'francais',
    creatorName: 'Maman',
    eyeColor: 'blue',
    hairColor: 'blonde',
    skinColor: 'light',
    hobbies: '',
    favoriteDish: '',
    specialEvents: '',
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Load queue
  const loadQueue = useCallback(async () => {
    try {
      const result = await ApiService.getGenerationQueue(token);
      if (result.success) {
        setOrders(result.data);
      }
    } catch (error) {
      console.error('Error loading generation queue:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Initial load
  useEffect(() => {
    loadQueue();
  }, [loadQueue]);

  // Poll for active generations
  useEffect(() => {
    const hasActive = orders.some(o => GENERATING_STATUSES.includes(o.storyStatus));

    if (hasActive) {
      pollRef.current = setInterval(async () => {
        const updated = await Promise.all(
          orders.map(async (order) => {
            if (GENERATING_STATUSES.includes(order.storyStatus)) {
              try {
                const result = await ApiService.getGenerationStatus(token, order.id);
                if (result.success) {
                  return { ...order, ...result.data };
                }
              } catch { /* keep old */ }
            }
            return order;
          })
        );
        setOrders(updated);

        if (!updated.some(o => GENERATING_STATUSES.includes(o.storyStatus))) {
          loadQueue();
        }
      }, 3000);
    }

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [orders, token, loadQueue]);

  // Load logs for expanded order
  const loadLogs = async (orderId: string) => {
    try {
      const result = await ApiService.getGenerationLogs(token, orderId);
      if (result.success) {
        setLogs(prev => ({ ...prev, [orderId]: result.data }));
      }
    } catch (error) {
      console.error('Error loading logs:', error);
    }
  };

  const toggleExpand = (orderId: string) => {
    if (expandedId === orderId) {
      setExpandedId(null);
    } else {
      setExpandedId(orderId);
      if (!logs[orderId]) {
        loadLogs(orderId);
      }
    }
  };

  // Actions
  const handleGenerate = async (orderId: string) => {
    setActionLoading(orderId);
    try {
      await ApiService.startGeneration(token, orderId);
      setOrders(prev => prev.map(o =>
        o.id === orderId ? { ...o, storyStatus: 'GENERATING_TEXT', generationProgress: 0, generationError: null } : o
      ));
    } catch (error: any) {
      alert(`Erreur: ${error.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRegenerate = async (orderId: string) => {
    if (!window.confirm('Relancer la generation ? Le PDF actuel sera remplace.')) return;
    setActionLoading(orderId);
    try {
      await ApiService.regenerateStory(token, orderId);
      setOrders(prev => prev.map(o =>
        o.id === orderId ? { ...o, status: 'GENERATING', storyStatus: 'GENERATING_TEXT', generationProgress: 0, generationError: null } : o
      ));
    } catch (error: any) {
      alert(`Erreur: ${error.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleValidate = async (orderId: string) => {
    setActionLoading(orderId);
    try {
      await ApiService.validateGeneration(token, orderId);
      setOrders(prev => prev.map(o =>
        o.id === orderId ? { ...o, status: 'GENERATED' } : o
      ));
    } catch (error: any) {
      alert(`Erreur: ${error.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteGeneration = async (orderId: string) => {
    if (!window.confirm('Supprimer la generation ? La commande reviendra au statut PAID.')) return;
    setActionLoading(orderId);
    try {
      await ApiService.deleteGeneration(token, orderId);
      await loadQueue();
    } catch (error: any) {
      alert(`Erreur: ${error.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReplacePdf = async (orderId: string, file: File) => {
    if (!file || file.type !== 'application/pdf') {
      alert('Veuillez selectionner un fichier PDF');
      return;
    }
    setActionLoading(orderId);
    try {
      await ApiService.replacePdf(token, orderId, file);
      await loadQueue();
      if (expandedId === orderId) loadLogs(orderId);
    } catch (error: any) {
      alert(`Erreur: ${error.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handlePreviewPdf = (order: any) => {
    const baseUrl = ApiService.getBaseUrl();
    window.open(`${baseUrl}/api/admin/generation/orders/${order.id}/pdf?token=${token}`, '_blank');
  };

  const handleCreateTest = async () => {
    setActionLoading('test');
    try {
      const formToSend = photoFile
        ? { ...testForm, eyeColor: '', hairColor: '', skinColor: '' }
        : testForm;
      const result = await ApiService.createTestOrder(token, formToSend, photoFile || undefined);
      setShowTestForm(false);
      setPhotoFile(null);
      setPhotoPreview(null);
      if (result.message) alert(result.message);
      await loadQueue();
    } catch (error: any) {
      alert(`Erreur: ${error.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setPhotoFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
    }
  };

  // Filter orders
  const filteredOrders = orders.filter(o => {
    if (filter === 'all') return true;
    if (filter === 'in_progress') return GENERATING_STATUSES.includes(o.storyStatus);
    if (filter === 'failed') return o.storyStatus === 'GENERATION_FAILED';
    if (filter === 'done') return o.storyStatus === 'DISPONIBLE' && o.status === 'GENERATING';
    if (filter === 'validated') return o.status === 'GENERATED';
    return true;
  });

  const counts = {
    all: orders.length,
    in_progress: orders.filter(o => GENERATING_STATUSES.includes(o.storyStatus)).length,
    failed: orders.filter(o => o.storyStatus === 'GENERATION_FAILED').length,
    done: orders.filter(o => o.storyStatus === 'DISPONIBLE' && o.status === 'GENERATING').length,
    validated: orders.filter(o => o.status === 'GENERATED').length,
  };

  return (
    <AdminLayout>
      <PageTitle>
        <span>Generation des Contes</span>
        <ActionBtn onClick={() => setShowTestForm(true)}>
          + Commande test
        </ActionBtn>
      </PageTitle>

      {/* Queue table */}
      <SectionCard>
        <SectionHeader>
          <SectionTitle>File de generation</SectionTitle>
          <FiltersRow>
            <FilterBtn $active={filter === 'all'} onClick={() => setFilter('all')}>
              Tout ({counts.all})
            </FilterBtn>
            <FilterBtn $active={filter === 'in_progress'} onClick={() => setFilter('in_progress')}>
              En cours ({counts.in_progress})
            </FilterBtn>
            <FilterBtn $active={filter === 'failed'} onClick={() => setFilter('failed')}>
              Echec ({counts.failed})
            </FilterBtn>
            <FilterBtn $active={filter === 'done'} onClick={() => setFilter('done')}>
              A valider ({counts.done})
            </FilterBtn>
            <FilterBtn $active={filter === 'validated'} onClick={() => setFilter('validated')}>
              Validees ({counts.validated})
            </FilterBtn>
            <ActionBtn onClick={loadQueue} $variant="ghost" disabled={loading} style={{ marginLeft: 8 }}>
              Rafraichir
            </ActionBtn>
          </FiltersRow>
        </SectionHeader>

        {loading ? (
          <EmptyState>Chargement...</EmptyState>
        ) : filteredOrders.length === 0 ? (
          <EmptyState>Aucune commande dans cette categorie</EmptyState>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>ID</Th>
                <Th>Date</Th>
                <Th>Client</Th>
                <Th>Protagoniste</Th>
                <Th>Commande</Th>
                <Th>Generation</Th>
                <Th>Progression</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => {
                const isGenerating = GENERATING_STATUSES.includes(order.storyStatus);
                const isFailed = order.storyStatus === 'GENERATION_FAILED';
                const isDone = order.storyStatus === 'DISPONIBLE';
                const isValidated = order.status === 'GENERATED';
                const isStuck = isGenerating && !actionLoading;
                const progress = order.generationProgress || 0;
                const isExpanded = expandedId === order.id;

                return (
                  <React.Fragment key={order.id}>
                    <tr style={{ cursor: 'pointer' }} onClick={() => toggleExpand(order.id)}>
                      <Td style={{ fontFamily: 'monospace', fontSize: '11px' }}>
                        {order.id.slice(0, 8)}...
                        {order.isTestOrder && (
                          <Badge $color="#D97706" $bg="#FEF3C7" style={{ marginLeft: 4 }}>TEST</Badge>
                        )}
                      </Td>
                      <Td>{new Date(order.createdAt).toLocaleDateString('fr-FR')}</Td>
                      <Td>{order.user?.email || '-'}</Td>
                      <Td>
                        <strong>{order.protagonistName}</strong>
                        <br />
                        <span style={{ fontSize: '11px', color: theme.colors.text.light }}>
                          {order.protagonistAge || ''} {order.protagonistGender === 'girl' ? 'F' : 'M'}
                        </span>
                      </Td>
                      <Td>{getOrderStatusBadge(order.status)}</Td>
                      <Td>{getStoryStatusBadge(order.storyStatus)}</Td>
                      <Td style={{ minWidth: 160 }} onClick={e => e.stopPropagation()}>
                        {isGenerating && (
                          <>
                            <ProgressBarOuter>
                              <ProgressBarInner $width={progress} $color={
                                order.storyStatus === 'GENERATING_TEXT' ? '#2563EB' :
                                order.storyStatus === 'GENERATING_IMAGES' ? '#7C3AED' : '#D97706'
                              } />
                            </ProgressBarOuter>
                            <ProgressText>
                              {getProgressLabel(order.storyStatus, progress)} {progress}%
                            </ProgressText>
                          </>
                        )}
                        {isFailed && order.generationError && (
                          <ErrorMsg>{order.generationError}</ErrorMsg>
                        )}
                        {isDone && <ProgressText>Termine</ProgressText>}
                      </Td>
                      <Td onClick={e => e.stopPropagation()}>
                        <ActionsRow>
                          {/* EN_COURS: Start generation */}
                          {order.storyStatus === 'EN_COURS' && order.status === 'GENERATING' && (
                            <ActionBtn
                              onClick={() => handleGenerate(order.id)}
                              disabled={actionLoading === order.id}
                            >
                              {actionLoading === order.id ? '...' : 'Generer'}
                            </ActionBtn>
                          )}

                          {/* FAILED: Retry + Delete */}
                          {isFailed && (
                            <>
                              <ActionBtn
                                $variant="warning"
                                onClick={() => handleRegenerate(order.id)}
                                disabled={actionLoading === order.id}
                              >
                                Relancer
                              </ActionBtn>
                              <ActionBtn
                                $variant="danger"
                                onClick={() => handleDeleteGeneration(order.id)}
                                disabled={actionLoading === order.id}
                              >
                                Suppr.
                              </ActionBtn>
                            </>
                          )}

                          {/* STUCK: In generating state but no active pipeline (e.g. server restarted) */}
                          {isStuck && !isFailed && order.storyStatus !== 'EN_COURS' && (
                            <>
                              <ActionBtn
                                $variant="warning"
                                onClick={() => handleRegenerate(order.id)}
                                disabled={actionLoading === order.id}
                              >
                                Relancer
                              </ActionBtn>
                              <ActionBtn
                                $variant="danger"
                                onClick={() => handleDeleteGeneration(order.id)}
                                disabled={actionLoading === order.id}
                              >
                                Suppr.
                              </ActionBtn>
                            </>
                          )}

                          {/* DISPONIBLE + GENERATING: Validate, Regenerate, Delete, PDF */}
                          {isDone && !isValidated && (
                            <>
                              <ActionBtn onClick={() => handlePreviewPdf(order)}>
                                PDF
                              </ActionBtn>
                              <ActionBtn
                                $variant="success"
                                onClick={() => handleValidate(order.id)}
                                disabled={actionLoading === order.id}
                              >
                                Valider
                              </ActionBtn>
                              <ActionBtn
                                $variant="warning"
                                onClick={() => handleRegenerate(order.id)}
                                disabled={actionLoading === order.id}
                              >
                                Regen.
                              </ActionBtn>
                              <ActionBtn
                                $variant="danger"
                                onClick={() => handleDeleteGeneration(order.id)}
                                disabled={actionLoading === order.id}
                              >
                                Suppr.
                              </ActionBtn>
                            </>
                          )}

                          {/* GENERATED (validated): PDF, Regenerate */}
                          {isValidated && (
                            <>
                              <ActionBtn onClick={() => handlePreviewPdf(order)}>
                                PDF
                              </ActionBtn>
                              <ActionBtn
                                $variant="warning"
                                onClick={() => handleRegenerate(order.id)}
                                disabled={actionLoading === order.id}
                              >
                                Regen.
                              </ActionBtn>
                            </>
                          )}
                        </ActionsRow>
                      </Td>
                    </tr>

                    {/* Expanded detail panel */}
                    {isExpanded && (
                      <DetailPanel>
                        <td colSpan={8}>
                          <DetailContent>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.lg }}>
                              {/* Left: Generation logs */}
                              <div>
                                <h4 style={{ margin: `0 0 ${theme.spacing.sm}`, fontSize: theme.fontSizes.sm }}>
                                  Historique des generations
                                </h4>
                                {!logs[order.id] ? (
                                  <ProgressText>Chargement...</ProgressText>
                                ) : logs[order.id].length === 0 ? (
                                  <ProgressText>Aucune generation</ProgressText>
                                ) : (
                                  logs[order.id].map((log: any) => (
                                    <LogEntry key={log.id} $status={log.status}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <strong>
                                          {log.source === 'manual_upload' ? 'Upload manuel' : `Tentative #${log.attempt}`}
                                        </strong>
                                        <Badge
                                          $color={log.status === 'completed' ? '#059669' : log.status === 'failed' ? '#DC2626' : '#D97706'}
                                          $bg={log.status === 'completed' ? '#D1FAE5' : log.status === 'failed' ? '#FEE2E2' : '#FEF3C7'}
                                        >
                                          {log.status === 'completed' ? 'OK' : log.status === 'failed' ? 'Echec' : 'En cours'}
                                        </Badge>
                                      </div>
                                      <div style={{ fontSize: '11px', color: theme.colors.text.light, marginTop: 2 }}>
                                        {new Date(log.startedAt).toLocaleString('fr-FR')}
                                        {log.completedAt && (
                                          <> — {Math.round((new Date(log.completedAt).getTime() - new Date(log.startedAt).getTime()) / 1000)}s</>
                                        )}
                                      </div>
                                      {log.error && (
                                        <ErrorMsg style={{ marginTop: 4 }}>{log.error}</ErrorMsg>
                                      )}
                                    </LogEntry>
                                  ))
                                )}
                              </div>

                              {/* Right: Replace PDF zone */}
                              <div>
                                <h4 style={{ margin: `0 0 ${theme.spacing.sm}`, fontSize: theme.fontSizes.sm }}>
                                  Remplacer le PDF
                                </h4>
                                <input
                                  ref={pdfInputRef}
                                  type="file"
                                  accept="application/pdf"
                                  style={{ display: 'none' }}
                                  onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (f && replacingOrderId.current) {
                                      handleReplacePdf(replacingOrderId.current, f);
                                    }
                                    e.target.value = '';
                                  }}
                                />
                                <UploadZone
                                  $isDragOver={isDragOver === order.id}
                                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(order.id); }}
                                  onDragLeave={() => setIsDragOver(null)}
                                  onDrop={(e) => {
                                    e.preventDefault();
                                    setIsDragOver(null);
                                    const f = e.dataTransfer.files[0];
                                    if (f) handleReplacePdf(order.id, f);
                                  }}
                                  onClick={() => {
                                    replacingOrderId.current = order.id;
                                    pdfInputRef.current?.click();
                                  }}
                                >
                                  <div style={{ fontSize: theme.fontSizes.sm, color: theme.colors.text.light }}>
                                    {actionLoading === order.id ? 'Upload en cours...' : 'Glissez un PDF ou cliquez pour remplacer'}
                                  </div>
                                </UploadZone>
                              </div>
                            </div>
                          </DetailContent>
                        </td>
                      </DetailPanel>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </Table>
        )}
      </SectionCard>

      {/* Test Order Modal */}
      <FormOverlay $open={showTestForm} onClick={() => setShowTestForm(false)} />
      <FormModal $open={showTestForm}>
        <FormTitle>Creer une commande test</FormTitle>

        <FormField>
          <FormLabel>Nom du protagoniste</FormLabel>
          <FormInput
            value={testForm.protagonistName}
            onChange={e => setTestForm(f => ({ ...f, protagonistName: e.target.value }))}
          />
        </FormField>

        <FormField>
          <FormLabel>Photo de l'enfant (optionnel)</FormLabel>
          <FormInput
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            style={{ padding: '6px' }}
          />
          {photoPreview && (
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <img src={photoPreview} alt="Preview" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }} />
              <ActionBtn $variant="danger" onClick={() => { setPhotoFile(null); setPhotoPreview(null); }} style={{ fontSize: 11, padding: '4px 8px' }}>
                Retirer
              </ActionBtn>
            </div>
          )}
        </FormField>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: theme.spacing.md }}>
          <FormField>
            <FormLabel>Age</FormLabel>
            <FormInput
              value={testForm.protagonistAge}
              onChange={e => setTestForm(f => ({ ...f, protagonistAge: e.target.value }))}
            />
          </FormField>
          <FormField>
            <FormLabel>Genre</FormLabel>
            <FormSelect
              value={testForm.protagonistGender}
              onChange={e => setTestForm(f => ({ ...f, protagonistGender: e.target.value }))}
            >
              <option value="girl">Fille</option>
              <option value="boy">Garcon</option>
            </FormSelect>
          </FormField>
          <FormField>
            <FormLabel>Tranche d'age</FormLabel>
            <FormSelect
              value={testForm.ageRange}
              onChange={e => setTestForm(f => ({ ...f, ageRange: e.target.value }))}
            >
              <option value="0-2">0-2 ans</option>
              <option value="3-5">3-5 ans</option>
              <option value="6-9">6-9 ans</option>
              <option value="10+">10+ ans</option>
            </FormSelect>
          </FormField>
        </div>

        {!photoFile && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: theme.spacing.md }}>
            <FormField>
              <FormLabel>Yeux</FormLabel>
              <FormSelect value={testForm.eyeColor} onChange={e => setTestForm(f => ({ ...f, eyeColor: e.target.value }))}>
                <option value="blue">Bleu</option>
                <option value="brown">Marron</option>
                <option value="green">Vert</option>
                <option value="hazel">Noisette</option>
              </FormSelect>
            </FormField>
            <FormField>
              <FormLabel>Cheveux</FormLabel>
              <FormSelect value={testForm.hairColor} onChange={e => setTestForm(f => ({ ...f, hairColor: e.target.value }))}>
                <option value="blonde">Blond</option>
                <option value="brown">Brun</option>
                <option value="black">Noir</option>
                <option value="red">Roux</option>
              </FormSelect>
            </FormField>
            <FormField>
              <FormLabel>Peau</FormLabel>
              <FormSelect value={testForm.skinColor} onChange={e => setTestForm(f => ({ ...f, skinColor: e.target.value }))}>
                <option value="light">Claire</option>
                <option value="medium">Medium</option>
                <option value="olive">Olive</option>
                <option value="dark">Foncee</option>
              </FormSelect>
            </FormField>
          </div>
        )}
        {photoFile && (
          <div style={{ padding: `${theme.spacing.sm} 0`, fontSize: theme.fontSizes.sm, color: theme.colors.text.light }}>
            Mode photo : les couleurs seront determinees par la photo
          </div>
        )}

        <FormField>
          <FormLabel>Theme</FormLabel>
          <FormSelect value={testForm.generalTheme} onChange={e => setTestForm(f => ({ ...f, generalTheme: e.target.value }))}>
            <option value="fairy-tales">Contes de fees</option>
            <option value="educational">Educatif</option>
            <option value="activities">Activites</option>
            <option value="stories">Histoires</option>
            <option value="celebrations">Celebrations</option>
            <option value="family">Famille</option>
          </FormSelect>
        </FormField>

        <FormField>
          <FormLabel>Occasion</FormLabel>
          <FormSelect value={testForm.specificSubject} onChange={e => setTestForm(f => ({ ...f, specificSubject: e.target.value }))}>
            <option value="birthday">Anniversaire</option>
            <option value="christmas">Noel</option>
            <option value="easter">Paques</option>
            <option value="new-year">Nouvel An</option>
            <option value="eid">Aid</option>
            <option value="mothers-day">Fete des meres</option>
            <option value="fathers-day">Fete des peres</option>
          </FormSelect>
        </FormField>

        <FormField>
          <FormLabel>Message central</FormLabel>
          <FormSelect value={testForm.centralMessage} onChange={e => setTestForm(f => ({ ...f, centralMessage: e.target.value }))}>
            <option value="courage">Courage</option>
            <option value="friendship">Amitie</option>
            <option value="love">Amour</option>
            <option value="perseverance">Perseverance</option>
            <option value="sharing">Partage</option>
            <option value="honesty">Honnetete</option>
            <option value="respect">Respect</option>
          </FormSelect>
        </FormField>

        <FormField>
          <FormLabel>Style illustration</FormLabel>
          <FormSelect value={testForm.illustrationStyle} onChange={e => setTestForm(f => ({ ...f, illustrationStyle: e.target.value }))}>
            <option value="illustrated-book">Livre illustre classique</option>
            <option value="watercolor">Aquarelle</option>
            <option value="3d-animation">Animation 3D</option>
            <option value="kawaii">Kawaii</option>
            <option value="clay-animation">Pate a modeler</option>
            <option value="paper-cut">Papier decoupe</option>
            <option value="geometric">Geometrique</option>
            <option value="japanese-manga">Manga</option>
          </FormSelect>
        </FormField>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.md }}>
          <FormField>
            <FormLabel>Langue</FormLabel>
            <FormSelect value={testForm.language} onChange={e => setTestForm(f => ({ ...f, language: e.target.value }))}>
              <option value="francais">Francais</option>
              <option value="english">English</option>
              <option value="espanol">Espanol</option>
              <option value="deutsch">Deutsch</option>
              <option value="arabe">Arabe</option>
            </FormSelect>
          </FormField>
          <FormField>
            <FormLabel>Createur</FormLabel>
            <FormInput
              value={testForm.creatorName}
              onChange={e => setTestForm(f => ({ ...f, creatorName: e.target.value }))}
            />
          </FormField>
        </div>

        <FormField>
          <FormLabel>Hobbies / Passions (optionnel)</FormLabel>
          <FormInput
            value={testForm.hobbies}
            onChange={e => setTestForm(f => ({ ...f, hobbies: e.target.value }))}
            placeholder="Ex: dessiner, jouer au foot, lire"
          />
        </FormField>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.md }}>
          <FormField>
            <FormLabel>Plat favori (optionnel)</FormLabel>
            <FormInput
              value={testForm.favoriteDish}
              onChange={e => setTestForm(f => ({ ...f, favoriteDish: e.target.value }))}
              placeholder="Ex: crepes, pizza"
            />
          </FormField>
          <FormField>
            <FormLabel>Evenement special (optionnel)</FormLabel>
            <FormInput
              value={testForm.specialEvents}
              onChange={e => setTestForm(f => ({ ...f, specialEvents: e.target.value }))}
              placeholder="Ex: rentree scolaire"
            />
          </FormField>
        </div>

        <FormActions>
          <ActionBtn $variant="danger" onClick={() => setShowTestForm(false)}>
            Annuler
          </ActionBtn>
          <ActionBtn
            onClick={handleCreateTest}
            disabled={actionLoading === 'test'}
          >
            {actionLoading === 'test' ? 'Generation couverture...' : 'Creer commande test'}
          </ActionBtn>
        </FormActions>
      </FormModal>
    </AdminLayout>
  );
};

export default AdminGenerationPage;

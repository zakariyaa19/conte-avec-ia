import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { theme } from '../styles/theme';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { ApiService } from '../config/api';
import { getImageUrl } from '../config/constants';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${theme.colors.background.primary};
`;

const MainContent = styled.main`
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing['2xl']} ${theme.spacing.lg};
  width: 100%;
  animation: ${fadeInUp} 0.6s ease-out;

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.lg} ${theme.spacing.md};
  }
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.xl};
  flex-wrap: wrap;
  gap: ${theme.spacing.md};
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
`;

const UserName = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['2xl']};
  color: ${theme.colors.text.primary};
  margin: 0;
`;

const Badge = styled.span<{ $variant: 'club' | 'basic' | 'activating' }>`
  display: inline-flex;
  align-items: center;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.xs};
  font-weight: 700;
  background: ${props => {
    if (props.$variant === 'club') return `linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.button.primaryHover})`;
    if (props.$variant === 'activating') return `linear-gradient(135deg, ${theme.colors.accent.coral}80, ${theme.colors.button.primaryHover}80)`;
    return theme.colors.background.secondary;
  }};
  color: ${props => props.$variant === 'basic' ? theme.colors.text.secondary : 'white'};
`;

/* Club Welcome Banner - shown during subscription activation */
const ClubWelcomeBanner = styled.div`
  background: linear-gradient(135deg, ${theme.colors.accent.coral}15, ${theme.colors.accent.softPink}25, ${theme.colors.accent.creamyYellow}30);
  border: 1px solid ${theme.colors.accent.coral}30;
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.xl} ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};
  text-align: center;
  animation: ${fadeInUp} 0.6s ease-out;
`;

const WelcomeTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.xl};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing.sm};
`;

const WelcomeText = styled.p`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.fontSizes.sm};
  margin: 0;
`;

const WelcomeShimmer = styled.div`
  height: 3px;
  margin-top: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.full};
  background: linear-gradient(90deg, transparent, ${theme.colors.accent.coral}60, transparent);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s linear infinite;
`;

/* Club Section - for active Club members */
const ClubSection = styled.div`
  background: linear-gradient(135deg, ${theme.colors.accent.creamyYellow}, ${theme.colors.accent.softPink}20);
  border: 1px solid ${theme.colors.accent.lightCoral}30;
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};
`;

const ClubSectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.md};
  flex-wrap: wrap;
  gap: ${theme.spacing.sm};
`;

const ClubSectionTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.lg};
  color: ${theme.colors.text.primary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const ManageLink = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.text.secondary};
  font-size: ${theme.fontSizes.xs};
  cursor: pointer;
  text-decoration: underline;
  padding: 0;

  &:hover {
    color: ${theme.colors.accent.coral};
  }
`;

const CreditCard = styled.div<{ $available: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  background: ${props => props.$available
    ? `linear-gradient(135deg, ${theme.colors.accent.lightGreen}30, #a8e6cf30)`
    : theme.colors.background.white
  };
  border: 1px solid ${props => props.$available ? '#a8e6cf' : '#E5E7EB'};
  border-radius: ${theme.borderRadius.lg};
  flex-wrap: wrap;
`;

const CreditInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const CreditIcon = styled.span`
  font-size: ${theme.fontSizes.xl};
`;

const CreditText = styled.div`
  h4 {
    font-family: ${theme.fonts.heading};
    font-size: ${theme.fontSizes.base};
    color: ${theme.colors.text.primary};
    margin: 0;
  }
  p {
    font-size: ${theme.fontSizes.xs};
    color: ${theme.colors.text.secondary};
    margin: ${theme.spacing.xs} 0 0;
  }
`;

const CountdownText = styled.span`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.accent.coral};
  font-weight: 600;
  white-space: nowrap;
`;

/* Join Club Banner - for non-Club users */
const JoinClubBanner = styled.div`
  background: ${theme.colors.background.white};
  border: 1px solid ${theme.colors.accent.lightCoral}30;
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${theme.spacing.md};
`;

const JoinClubText = styled.div`
  h3 {
    font-family: ${theme.fonts.heading};
    font-size: ${theme.fontSizes.base};
    color: ${theme.colors.text.primary};
    margin: 0 0 ${theme.spacing.xs};
  }
  p {
    color: ${theme.colors.text.secondary};
    font-size: ${theme.fontSizes.sm};
    margin: 0;
  }
`;

const FilterBar = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.lg};
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ $active: boolean }>`
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  border: 2px solid ${props => props.$active ? theme.colors.accent.coral : '#E5E7EB'};
  border-radius: ${theme.borderRadius.full};
  background: ${props => props.$active ? theme.colors.accent.coral : 'transparent'};
  color: ${props => props.$active ? 'white' : theme.colors.text.secondary};
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
  cursor: pointer;
  transition: all ${theme.transitions.base};

  &:hover {
    border-color: ${theme.colors.accent.coral};
  }
`;

const bookFloat = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-6px) rotate(0.5deg); }
`;

const BookshelfGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: ${theme.spacing.md};
  }
`;

const BookCard = styled.div<{ $hasImage: boolean }>`
  position: relative;
  aspect-ratio: 2 / 3;
  border-radius: 4px 12px 12px 4px;
  overflow: hidden;
  cursor: pointer;
  background: ${props => props.$hasImage ? '#1a1a2e' : `linear-gradient(135deg, ${theme.colors.accent.softPink}, ${theme.colors.accent.creamyYellow})`};
  box-shadow:
    -4px 0 8px rgba(0,0,0,0.15),
    4px 2px 12px rgba(0,0,0,0.2),
    inset -2px 0 4px rgba(255,255,255,0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: scale(1.04) translateY(-4px);
    box-shadow:
      -6px 0 12px rgba(0,0,0,0.2),
      6px 4px 20px rgba(0,0,0,0.3),
      inset -2px 0 4px rgba(255,255,255,0.1);
    animation: ${bookFloat} 3s ease-in-out infinite;
  }
`;

const BookSpine = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 6px;
  background: linear-gradient(to right, rgba(0,0,0,0.3), rgba(0,0,0,0.05));
  z-index: 3;
`;

const BookCoverImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1;
  height: 100%;
  object-fit: cover;
`;

const BookOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: ${theme.spacing.md} ${theme.spacing.sm};
  background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.4) 60%, transparent 100%);
  z-index: 2;
`;

const BookTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.sm};
  color: white;
  margin: 0 0 4px;
  line-height: 1.3;
  text-shadow: 0 1px 3px rgba(0,0,0,0.5);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const BookDate = styled.span`
  font-size: 10px;
  color: rgba(255,255,255,0.7);
`;

const BookStatusBadge = styled.span<{ $color: string }>`
  position: absolute;
  top: ${theme.spacing.sm};
  right: ${theme.spacing.sm};
  padding: 2px 8px;
  border-radius: ${theme.borderRadius.full};
  font-size: 10px;
  font-weight: 700;
  color: white;
  background: ${props => props.$color};
  z-index: 3;
  backdrop-filter: blur(4px);
`;

const BookFavoriteBtn = styled.button<{ $active: boolean }>`
  position: absolute;
  top: ${theme.spacing.sm};
  left: ${theme.spacing.md};
  background: none;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  z-index: 3;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.5));
  color: ${props => props.$active ? theme.colors.accent.coral : 'rgba(255,255,255,0.8)'};
  transition: transform 0.2s;

  &:hover { transform: scale(1.3); }
`;

const BookPlaceholder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.lg};
  text-align: center;
`;

const PlaceholderIcon = styled.div`
  font-size: 2.5rem;
  opacity: 0.5;
`;

const PlaceholderName = styled.div`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.base};
  color: ${theme.colors.text.secondary};
  font-weight: 600;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing['3xl']} ${theme.spacing.xl};
  color: ${theme.colors.text.secondary};
  background: ${theme.colors.background.white};
  border-radius: ${theme.borderRadius['2xl']};
  box-shadow: ${theme.shadows.card};
  border: 1px solid rgba(0, 0, 0, 0.04);
  max-width: 500px;
  margin: ${theme.spacing['2xl']} auto;
`;

const EmptyIcon = styled.div`
  font-size: 3.5rem;
  margin-bottom: ${theme.spacing.lg};
  line-height: 1;
`;

const EmptyTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.xl};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing.sm};
`;

const EmptyText = styled.p`
  font-size: ${theme.fontSizes.base};
  color: ${theme.colors.text.secondary};
  margin: 0 0 ${theme.spacing.xl};
  line-height: 1.6;
`;

// Countdown utility
const getTimeUntilNextCredit = (nextCreditDate: string | undefined) => {
  if (!nextCreditDate) return null;
  const diff = new Date(nextCreditDate).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000)
  };
};

export const DashboardPage: React.FC = () => {
  const { user, isClub, isAuthenticated, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [clubCredit, setClubCredit] = useState<{ canSubmit: boolean; remaining: number; nextCreditDate?: string; totalEarned?: number } | null>(null);
  const [subscriptionActivating, setSubscriptionActivating] = useState(false);
  const [countdown, setCountdown] = useState<{ days: number; hours: number } | null>(null);

  // Polling pour activer le Club apres checkout Stripe
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const subscriptionParam = searchParams.get('subscription');

    if (subscriptionParam !== 'success') return;

    const token = localStorage.getItem('userToken');
    if (!token) return;

    setSubscriptionActivating(true);
    let attempts = 0;
    const maxAttempts = 15; // 15 tentatives x 2s = 30s max

    const pollSubscription = async () => {
      try {
        const result = await ApiService.checkSubscriptionStatus(token);
        if (result.success && result.status === 'active') {
          // Subscription activee : rafraichir une seule fois
          await refreshProfile();
          const [storiesRes, creditRes] = await Promise.all([
            ApiService.getClientStories(token).catch(() => null),
            ApiService.getClubCredit(token).catch(() => null)
          ]);
          if (storiesRes?.success) setStories(storiesRes.data);
          if (creditRes?.success) setClubCredit(creditRes.data);

          setSubscriptionActivating(false);
          setLoading(false);
          navigate('/dashboard', { replace: true });
          return;
        }
      } catch (e) {
        console.error('Erreur polling subscription:', e);
      }

      attempts++;
      if (attempts < maxAttempts) {
        setTimeout(pollSubscription, 2000);
      } else {
        setSubscriptionActivating(false);
        await refreshProfile();
        try {
          const storiesRes = await ApiService.getClientStories(token);
          if (storiesRes.success) setStories(storiesRes.data);
        } catch {}
        setLoading(false);
        navigate('/dashboard', { replace: true });
      }
    };

    pollSubscription();
  }, [location.search]);

  useEffect(() => {
    loadStories();
    if (isClub) {
      const token = localStorage.getItem('userToken');
      if (token) {
        ApiService.getClubCredit(token)
          .then(res => { if (res.success) setClubCredit(res.data); })
          .catch(() => {});
      }
    }
  }, [isClub]);

  // Countdown timer pour le prochain credit
  useEffect(() => {
    if (!clubCredit?.nextCreditDate) {
      setCountdown(null);
      return;
    }

    const update = () => {
      setCountdown(getTimeUntilNextCredit(clubCredit.nextCreditDate));
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [clubCredit]);

  const loadStories = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) return;

    try {
      const response = await ApiService.getClientStories(token);
      if (response.success) {
        setStories(response.data);
      }
    } catch (error) {
      console.error('Erreur chargement contes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent, storyId: string) => {
    e.stopPropagation();
    const token = localStorage.getItem('userToken');
    if (!token) return;

    try {
      const response = await ApiService.toggleFavorite(token, storyId);
      if (response.success) {
        setStories(prev =>
          prev.map(s => s.id === storyId ? { ...s, isFavorite: response.data.isFavorite } : s)
        );
      }
    } catch (error) {
      console.error('Erreur toggle favori:', error);
    }
  };

  const handleManageSubscription = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) return;
    try {
      const result = await ApiService.createCustomerPortal(token);
      if (result.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      console.error('Erreur portail client:', error);
    }
  };

  const handleJoinClub = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const result = await ApiService.createSubscriptionSession(token);
      if (result.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      console.error('Erreur creation session abonnement:', error);
    }
  };

  const filteredStories = stories.filter(s => {
    if (filter === 'favorites') return s.isFavorite;
    if (filter === 'en_cours') return s.storyStatus === 'EN_COURS';
    if (filter === 'disponible') return s.storyStatus === 'DISPONIBLE';
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DISPONIBLE': return theme.colors.status.success;
      case 'EN_COURS': return theme.colors.status.warning;
      default: return theme.colors.text.light;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'DISPONIBLE': return 'Disponible';
      case 'EN_COURS': return 'En cours';
      default: return status;
    }
  };

  return (
    <PageContainer>
      <Header />
      <MainContent>
        <DashboardHeader>
          <UserInfo>
            <UserName>Ma Bibliotheque</UserName>
            <Badge $variant={isClub ? 'club' : subscriptionActivating ? 'activating' : 'basic'}>
              {isClub ? 'Membre Club' : subscriptionActivating ? 'Activation...' : 'Basique'}
            </Badge>
          </UserInfo>
          <div style={{ display: 'flex', gap: theme.spacing.sm }}>
            <Button variant="outline" size="md" onClick={() => navigate('/dashboard/account')}>
              Mon compte
            </Button>
            <Button variant="primary" size="md" onClick={() => navigate('/create-story')}>
              Creer un conte
            </Button>
          </div>
        </DashboardHeader>

        {/* Welcome banner during subscription activation */}
        {subscriptionActivating && (
          <ClubWelcomeBanner>
            <WelcomeTitle>Bienvenue dans le Club des Histoires Uniques</WelcomeTitle>
            <WelcomeText>Votre espace premium se prepare...</WelcomeText>
            <WelcomeShimmer />
          </ClubWelcomeBanner>
        )}

        {/* Club section for active members */}
        {!loading && isClub && !subscriptionActivating && (
          <ClubSection>
            <ClubSectionHeader>
              <ClubSectionTitle>
                Club des Histoires
              </ClubSectionTitle>
              <ManageLink onClick={handleManageSubscription}>
                Gerer mon abonnement
              </ManageLink>
            </ClubSectionHeader>

            {user?.subscriptionStatus === 'canceling' && user?.subscriptionPeriodEnd && (
              <div style={{
                background: '#FEF3C7',
                border: '1px solid #F59E0B',
                borderRadius: '8px',
                padding: '12px 16px',
                marginBottom: '16px',
                fontSize: theme.fontSizes.sm,
                color: '#92400E'
              }}>
                Votre abonnement sera annule le {new Date(user.subscriptionPeriodEnd).toLocaleDateString('fr-FR')}. Vous conservez l'acces Club jusqu'a cette date.
              </div>
            )}

            <CreditCard $available={!!clubCredit?.canSubmit}>
              <CreditInfo>
                <CreditIcon>{clubCredit?.canSubmit ? '\u2728' : '\u23F3'}</CreditIcon>
                <CreditText>
                  {clubCredit?.canSubmit ? (
                    <>
                      <h4>{clubCredit.remaining} eBook{clubCredit.remaining > 1 ? 's' : ''} gratuit{clubCredit.remaining > 1 ? 's' : ''} disponible{clubCredit.remaining > 1 ? 's' : ''}</h4>
                      <p>Format eBook numerique uniquement</p>
                    </>
                  ) : (
                    <>
                      <h4>Aucun credit disponible</h4>
                      <p>Format eBook numerique uniquement</p>
                    </>
                  )}
                </CreditText>
              </CreditInfo>

              <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md, flexWrap: 'wrap' }}>
                {countdown && (
                  <CountdownText>
                    Prochain credit dans : {countdown.days}j {countdown.hours}h
                  </CountdownText>
                )}
                {clubCredit?.canSubmit ? (
                  <Button variant="primary" size="sm" onClick={() => navigate('/create-story')}>
                    Creer mon eBook gratuit
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => navigate('/create-story')}>
                    Commander un conte (payant)
                  </Button>
                )}
              </div>
            </CreditCard>
          </ClubSection>
        )}

        {/* Join Club CTA for non-members */}
        {!loading && !isClub && !subscriptionActivating && (
          <JoinClubBanner>
            <JoinClubText>
              <h3>Rejoindre le Club des Histoires Uniques</h3>
              <p>1 eBook gratuit/semaine - 12,99EUR/mois</p>
            </JoinClubText>
            <Button variant="primary" size="sm" onClick={() => navigate('/club')}>
              Rejoindre le Club
            </Button>
          </JoinClubBanner>
        )}

        {!loading && stories.length > 0 && (
          <FilterBar>
            {[
              { key: 'all', label: 'Tous' },
              { key: 'favorites', label: 'Favoris' },
              { key: 'en_cours', label: 'En cours' },
              { key: 'disponible', label: 'Disponibles' }
            ].map(f => (
              <FilterButton
                key={f.key}
                $active={filter === f.key}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </FilterButton>
            ))}
          </FilterBar>
        )}

        {loading ? (
          <EmptyState>
            <EmptyText>Chargement de vos contes...</EmptyText>
          </EmptyState>
        ) : stories.length === 0 ? (
          <EmptyState>
            <EmptyIcon>📖</EmptyIcon>
            <EmptyTitle>Commencez a creer votre premier conte</EmptyTitle>
            <EmptyText>
              Votre bibliotheque est vide pour le moment.
              Creez un conte personnalise unique pour votre enfant.
            </EmptyText>
            <Button variant="primary" size="lg" onClick={() => navigate('/create-story')}>
              Creer un conte
            </Button>
          </EmptyState>
        ) : filteredStories.length === 0 ? (
          <EmptyState>
            <EmptyTitle>Aucun conte dans cette categorie</EmptyTitle>
            <EmptyText>
              Essayez un autre filtre ou creez un nouveau conte.
            </EmptyText>
            <Button variant="ghost" size="md" onClick={() => setFilter('all')}>
              Voir tous les contes
            </Button>
          </EmptyState>
        ) : (
          <BookshelfGrid>
            {filteredStories.map(story => {
              const coverUrl = story.coverImageUrl ? getImageUrl(story.coverImageUrl) : null;
              const title = story.coverTitle || `Conte de ${story.protagonistName}`;
              return (
                <BookCard key={story.id} $hasImage={false} onClick={() => navigate(`/dashboard/story/${story.id}`)}>
                  <BookSpine />
                  <BookPlaceholder>
                    <PlaceholderIcon>📖</PlaceholderIcon>
                    <PlaceholderName>{story.protagonistName}</PlaceholderName>
                  </BookPlaceholder>
                  {coverUrl && (
                    <BookCoverImage src={coverUrl} alt={title} loading="lazy" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  )}
                  <BookStatusBadge $color={getStatusColor(story.storyStatus)}>
                    {getStatusLabel(story.storyStatus)}
                  </BookStatusBadge>
                  <BookFavoriteBtn $active={story.isFavorite} onClick={(e) => handleToggleFavorite(e, story.id)}>
                    {story.isFavorite ? '\u2764\uFE0F' : '\u2661'}
                  </BookFavoriteBtn>
                  <BookOverlay>
                    <BookTitle>{title}</BookTitle>
                    <BookDate>{new Date(story.createdAt).toLocaleDateString('fr-FR')}</BookDate>
                  </BookOverlay>
                </BookCard>
              );
            })}
          </BookshelfGrid>
        )}
      </MainContent>
      <Footer />
    </PageContainer>
  );
};

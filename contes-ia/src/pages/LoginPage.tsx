import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { theme } from '../styles/theme';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { ApiService } from '../config/api';
import { metaTrackCompleteRegistration } from '../utils/metaPixel';
import { isInAppBrowser } from '../utils/safeStorage';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${theme.colors.background.primary};
`;

const LoginContainer = styled.main`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing['3xl']} ${theme.spacing.lg};
`;

const LoginCard = styled.div<{ $wide?: boolean }>`
  background: ${theme.colors.background.white};
  border-radius: ${theme.borderRadius['2xl']};
  padding: ${theme.spacing['3xl']};
  max-width: ${({ $wide }) => $wide ? '560px' : '440px'};
  width: 100%;
  box-shadow: ${theme.shadows.card};
  border: 1px solid rgba(0, 0, 0, 0.04);
  animation: ${fadeInUp} 0.6s ease-out;
  transition: max-width 0.3s ease;

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.xl} ${theme.spacing.lg};
  }
`;

const Title = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['3xl']};
  color: ${theme.colors.text.primary};
  text-align: center;
  margin-bottom: ${theme.spacing.sm};
`;

const Subtitle = styled.p`
  color: ${theme.colors.text.secondary};
  text-align: center;
  margin-bottom: ${theme.spacing.xl};
  font-size: ${theme.fontSizes.sm};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const InputLabel = styled.label`
  font-weight: 600;
  color: ${theme.colors.text.primary};
  font-size: ${theme.fontSizes.sm};
  margin-bottom: ${theme.spacing.xs};
`;

const InputField = styled.div`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  padding: ${theme.spacing.md};
  border: 2px solid #E5E7EB;
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.base};
  transition: border-color ${theme.transitions.smooth};

  &:focus {
    outline: none;
    border-color: ${theme.colors.accent.coral};
    box-shadow: 0 0 0 3px ${theme.colors.accent.coral}15;
  }
`;

const ErrorMsg = styled.div`
  background: #FFF5F5;
  border: 1px solid #FED7D7;
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  color: #C53030;
  font-size: ${theme.fontSizes.sm};
  text-align: center;
`;

const LinkText = styled.p`
  text-align: center;
  margin-top: ${theme.spacing.lg};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};

  a, span {
    color: ${theme.colors.accent.coral};
    cursor: pointer;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const PasswordHint = styled.p`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.text.light};
  margin-top: -${theme.spacing.xs};
`;

/* ─── Google OAuth ─── */

const GoogleButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${theme.spacing.md};

  > div {
    width: 100%;
  }
`;

const OrDivider = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.md};
  color: ${theme.colors.text.light};
  font-size: ${theme.fontSizes.sm};

  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #E5E7EB;
  }
`;

/* ─── Plan Selector ─── */

const shimmerLine = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const planPulse = keyframes`
  0%, 100% { box-shadow: 0 4px 16px rgba(255, 130, 100, 0.1); }
  50% { box-shadow: 0 8px 28px rgba(255, 130, 100, 0.2); }
`;

const PlanSelectorLabel = styled.p`
  font-family: ${theme.fonts.heading};
  font-weight: 700;
  color: ${theme.colors.text.primary};
  font-size: ${theme.fontSizes.base};
  margin-bottom: ${theme.spacing.sm};
  text-align: center;
`;

const PlanGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const PlanCard = styled.button<{ $selected: boolean; $isPro?: boolean; $isAnnual?: boolean }>`
  position: relative;
  width: 100%;
  background: ${({ $selected, $isPro }) =>
    $selected && $isPro
      ? 'linear-gradient(135deg, #FFF8F0 0%, #FFF0E0 100%)'
      : $selected
        ? '#F0F9FF'
        : theme.colors.background.white};
  border: 2px solid ${({ $selected, $isPro }) =>
    $selected && $isPro
      ? theme.colors.accent.coral
      : $selected
        ? '#60A5FA'
        : '#E5E7EB'};
  border-radius: 16px;
  padding: ${({ $isPro }) => $isPro ? '20px 16px' : '14px 16px'};
  cursor: pointer;
  text-align: left;
  transition: all 0.25s ease;
  outline: none;
  overflow: hidden;
  font-family: ${theme.fonts.body};

  ${({ $isPro, $selected }) => $isPro && !$selected && css`
    &::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 3px;
      background: linear-gradient(90deg,
        ${theme.colors.accent.coral},
        ${theme.colors.accent.softPink},
        ${theme.colors.accent.pastelBlue},
        ${theme.colors.accent.coral}
      );
      background-size: 200% auto;
      animation: ${shimmerLine} 3s linear infinite;
    }
  `}

  ${({ $isPro, $selected }) => $isPro && $selected && css`
    animation: ${planPulse} 3s ease-in-out infinite;
    &::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 3px;
      background: linear-gradient(90deg, ${theme.colors.accent.coral}, ${theme.colors.button.primaryHover});
    }
  `}

  ${({ $selected, $isPro }) => $selected && !$isPro && css`
    box-shadow: 0 0 0 3px #60A5FA20;
  `}

  &:hover {
    border-color: ${({ $isPro }) => $isPro ? theme.colors.accent.coral : '#60A5FA'};
    transform: translateY(-2px);
  }
`;

const PlanBadge = styled.span`
  display: inline-block;
  background: linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.button.primaryHover});
  color: white;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 3px 10px;
  border-radius: 20px;
  position: absolute;
  top: 8px;
  right: 12px;
  z-index: 2;
`;

const PlanCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
`;

const PlanName = styled.div<{ $isPro?: boolean }>`
  font-family: ${theme.fonts.heading};
  font-weight: 700;
  font-size: ${theme.fontSizes.base};
  color: ${({ $isPro }) => $isPro ? theme.colors.accent.coral : theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: 6px;
`;

const PlanPrice = styled.div<{ $isPro?: boolean }>`
  font-family: ${theme.fonts.heading};
  font-size: ${({ $isPro }) => $isPro ? theme.fontSizes.lg : theme.fontSizes.sm};
  color: ${({ $isPro }) => $isPro ? theme.colors.accent.coral : theme.colors.text.secondary};
  font-weight: 700;
`;

const PlanFeatures = styled.div<{ $columns?: boolean }>`
  display: ${({ $columns }) => $columns ? 'grid' : 'flex'};
  grid-template-columns: ${({ $columns }) => $columns ? '1fr 1fr' : 'unset'};
  flex-direction: column;
  gap: 4px;
  margin-top: 8px;
`;

const PlanFeature = styled.div<{ $premium?: boolean }>`
  font-size: 11px;
  color: ${({ $premium }) => $premium ? theme.colors.accent.coral : theme.colors.text.secondary};
  font-weight: ${({ $premium }) => $premium ? 600 : 400};
  display: flex;
  align-items: center;
  gap: 5px;
  line-height: 1.4;

  &::before {
    content: '\u2713';
    color: ${({ $premium }) => $premium ? theme.colors.accent.coral : '#22C55E'};
    font-weight: 700;
    font-size: 10px;
    flex-shrink: 0;
  }
`;

const PlanFreeTag = styled.span`
  display: inline-block;
  background: linear-gradient(135deg, #D1FAE520, #a8e6cf30);
  border: 1px solid #a8e6cf;
  border-radius: 20px;
  padding: 2px 10px;
  font-size: 10px;
  font-weight: 700;
  color: #2d6a4f;
`;

const CheckMark = styled.div<{ $visible: boolean }>`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: ${({ $visible }) => $visible ? '#3B82F6' : '#E5E7EB'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  font-size: 12px;
  color: white;
  flex-shrink: 0;
  transform: scale(${({ $visible }) => $visible ? 1 : 0.8});
`;

const CheckMarkPro = styled(CheckMark)`
  background: ${({ $visible }) => $visible
    ? `linear-gradient(135deg, ${theme.colors.accent.coral}, ${theme.colors.button.primaryHover})`
    : '#E5E7EB'};
`;

/* ─── Stripe redirect overlay ─── */

const RedirectOverlay = styled.div`
  text-align: center;
  padding: ${theme.spacing.xl} 0;
`;

const RedirectTitle = styled.p`
  font-weight: 700;
  font-size: ${theme.fontSizes.lg};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.sm};
`;

const RedirectText = styled.p`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.fontSizes.sm};
  margin-bottom: ${theme.spacing.lg};
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  margin: 0 auto ${theme.spacing.lg};
  border: 3px solid #E5E7EB;
  border-top-color: ${theme.colors.accent.coral};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const RedirectError = styled.div`
  background: #FFF5F5;
  border: 1px solid #FED7D7;
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md};
  color: #C53030;
  font-size: ${theme.fontSizes.sm};
  text-align: center;
  margin-top: ${theme.spacing.md};
`;

export const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const planParam = searchParams.get('plan');
  const initialPlan = (planParam === 'club' || planParam === 'club_annual') ? 'club' : 'basic';
  const initialStripePlan: 'monthly' | 'annual' = planParam === 'club_annual' ? 'annual' : 'monthly';

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [loginMethod, setLoginMethod] = useState<'magic' | 'password'>('password');
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'club'>(initialPlan);
  const [stripePlan] = useState<'monthly' | 'annual'>(initialStripePlan);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stripeRedirect, setStripeRedirect] = useState(false);
  const [stripeError, setStripeError] = useState('');
  const { login, register, googleLogin } = useAuth();
  const navigate = useNavigate();

  // Shared Stripe redirect logic for Club plan
  const handleClubStripeRedirect = async () => {
    setStripeRedirect(true);
    setStripeError('');
    try {
      const token = localStorage.getItem('userToken');
      if (!token) throw new Error('Token manquant');
      const session = await ApiService.createSubscriptionSession(token, undefined, stripePlan);
      if (session.url) {
        window.location.href = session.url;
      } else {
        throw new Error('URL de paiement non disponible');
      }
    } catch (err: any) {
      setStripeRedirect(false);
      setStripeError(
        'Votre compte a ete cree avec succes. La redirection vers le paiement a echoue. ' +
        'Vous pouvez souscrire au Club depuis votre espace client.'
      );
    }
  };

  const handleGoogleLogin = async (credential: string) => {
    setError('');
    setIsLoading(true);
    const result = await googleLogin(credential);
    setIsLoading(false);

    if (result.success) {
      if (mode === 'register') {
        metaTrackCompleteRegistration('google', selectedPlan);
      }
      // If registering with Club plan, redirect to Stripe
      if (mode === 'register' && selectedPlan === 'club') {
        await handleClubStripeRedirect();
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(result.message || 'Erreur de connexion Google');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (mode === 'register' && password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caracteres');
      return;
    }

    setIsLoading(true);

    if (mode === 'login') {
      const result = await login(email, password);
      setIsLoading(false);
      if (result.success) {
        if (result.userType === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(result.message || 'Identifiants invalides');
      }
    } else {
      const result = await register(email, password, firstName || undefined, lastName || undefined);
      setIsLoading(false);

      if (result.success) {
        metaTrackCompleteRegistration('email', selectedPlan);
        if (selectedPlan === 'club') {
          await handleClubStripeRedirect();
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(result.message || 'Erreur lors de l\'inscription');
      }
    }
  };

  const toggleMode = () => {
    setMode(prev => prev === 'login' ? 'register' : 'login');
    setError('');
    setStripeError('');
  };

  // If Stripe redirect is active, show a loading overlay
  if (stripeRedirect) {
    return (
      <PageContainer>
        <Header />
        <LoginContainer>
          <LoginCard>
            <RedirectOverlay>
              <Spinner />
              <RedirectTitle>Compte cree avec succes !</RedirectTitle>
              <RedirectText>
                Redirection vers le paiement securise...
              </RedirectText>
            </RedirectOverlay>
          </LoginCard>
        </LoginContainer>
        <Footer />
      </PageContainer>
    );
  }

  const isRegister = mode === 'register';

  return (
    <PageContainer>
      <Header />
      <LoginContainer>
        <LoginCard $wide={isRegister}>
          <Title>{isRegister ? 'Creer mon compte' : 'Connexion'}</Title>
          <Subtitle>
            {isRegister
              ? 'Creez votre compte pour retrouver vos livres'
              : 'Accedez a votre bibliotheque de livres'}
          </Subtitle>

          {error && <ErrorMsg>{error}</ErrorMsg>}

          {stripeError && (
            <RedirectError>
              {stripeError}
              <br />
              <span
                style={{ color: theme.colors.accent.coral, cursor: 'pointer', fontWeight: 600, marginTop: 8, display: 'inline-block' }}
                onClick={() => navigate('/dashboard')}
              >
                Aller a mon espace client &rarr;
              </span>
            </RedirectError>
          )}

          {/* ─── LOGIN MODE ─── */}
          {!isRegister && (
            <>
              {magicLinkSent ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>&#x2709;&#xFE0F;</div>
                  <p style={{ fontWeight: 700, fontSize: theme.fontSizes.lg, color: theme.colors.text.primary, marginBottom: 8 }}>
                    Lien envoye !
                  </p>
                  <p style={{ color: theme.colors.text.secondary, fontSize: theme.fontSizes.sm, lineHeight: 1.5 }}>
                    Ouvrez votre boite mail <strong>{email}</strong> et cliquez sur le lien pour acceder a votre bibliotheque.
                  </p>
                  <p style={{ color: theme.colors.text.light, fontSize: theme.fontSizes.xs, marginTop: 16 }}>
                    Pas recu ? Verifiez vos spams ou{' '}
                    <span style={{ color: theme.colors.accent.coral, cursor: 'pointer', fontWeight: 600 }}
                      onClick={async () => {
                        setIsLoading(true);
                        try { await ApiService.requestMagicLink(email); } catch {}
                        setIsLoading(false);
                      }}>
                      renvoyer le lien
                    </span>
                  </p>
                </div>
              ) : (
                <>
                  {/* Google en premier — methode principale */}
                  {!isInAppBrowser() && (
                    <GoogleButtonWrapper>
                      <GoogleLogin
                        onSuccess={(credentialResponse: CredentialResponse) => {
                          if (credentialResponse.credential) {
                            handleGoogleLogin(credentialResponse.credential);
                          }
                        }}
                        onError={() => setError('Erreur de connexion Google')}
                        text="signin_with"
                        shape="rectangular"
                        size="large"
                        width="100%"
                        logo_alignment="left"
                      />
                    </GoogleButtonWrapper>
                  )}

                  <OrDivider>ou</OrDivider>

                  {/* Email + mot de passe classique */}
                  <Form onSubmit={loginMethod === 'magic' ? async (e) => {
                    e.preventDefault();
                    if (!email) { setError('Entrez votre email'); return; }
                    setError('');
                    setIsLoading(true);
                    try {
                      await ApiService.requestMagicLink(email);
                      setMagicLinkSent(true);
                    } catch { setError('Erreur lors de l\'envoi. Verifiez votre email.'); }
                    setIsLoading(false);
                  } : handleSubmit}>
                    <InputField>
                      <InputLabel>Email</InputLabel>
                      <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder="votre@email.com" autoComplete="email" style={{ fontSize: 16 }} />
                    </InputField>

                    {loginMethod === 'password' && (
                      <InputField>
                        <InputLabel>Mot de passe</InputLabel>
                        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                          placeholder="Votre mot de passe" autoComplete="current-password" style={{ fontSize: 16 }} />
                      </InputField>
                    )}

                    <Button variant="primary" size="lg" type="submit" disabled={isLoading} fullWidth>
                      {isLoading
                        ? 'Connexion...'
                        : loginMethod === 'magic'
                          ? 'Recevoir un lien de connexion'
                          : 'Se connecter'}
                    </Button>
                  </Form>

                  <LinkText>
                    {loginMethod === 'password' ? (
                      <span onClick={() => { setLoginMethod('magic'); setMagicLinkSent(false); }}>
                        Mot de passe oublie ?
                      </span>
                    ) : (
                      <span onClick={() => setLoginMethod('password')}>
                        Se connecter avec un mot de passe
                      </span>
                    )}
                  </LinkText>
                </>
              )}
            </>
          )}

          {/* ─── REGISTER MODE ─── */}
          {isRegister && (
            <>
              {/* Google OAuth — hidden in WebView */}
              {!isInAppBrowser() && (
                <>
                  <GoogleButtonWrapper>
                    <GoogleLogin
                      onSuccess={(credentialResponse: CredentialResponse) => {
                        if (credentialResponse.credential) {
                          handleGoogleLogin(credentialResponse.credential);
                        }
                      }}
                      onError={() => setError('Erreur de connexion Google')}
                      text="signup_with"
                      shape="rectangular"
                      size="large"
                      width="100%"
                      logo_alignment="left"
                    />
                  </GoogleButtonWrapper>
                  <OrDivider>ou</OrDivider>
                </>
              )}

              <Form onSubmit={handleSubmit}>
                <InputField>
                  <InputLabel>Prenom</InputLabel>
                  <Input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Votre prenom" autoComplete="given-name" style={{ fontSize: 16 }} />
                </InputField>
                <InputField>
                  <InputLabel>Email</InputLabel>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com" autoComplete="email" style={{ fontSize: 16 }} />
                </InputField>
                <InputField>
                  <InputLabel>Mot de passe</InputLabel>
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 caracteres" autoComplete="new-password" style={{ fontSize: 16 }} />
                  <PasswordHint>Minimum 8 caracteres</PasswordHint>
                </InputField>

                {/* Plan Selector */}
                <div>
                  <PlanSelectorLabel>Choisissez votre formule</PlanSelectorLabel>
                  <PlanGrid>
                    <PlanCard type="button" $selected={selectedPlan === 'basic'} onClick={() => setSelectedPlan('basic')}>
                      <PlanCardHeader>
                        <PlanName>Basique</PlanName>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <PlanPrice>Gratuit</PlanPrice>
                          <CheckMark $visible={selectedPlan === 'basic'}>{selectedPlan === 'basic' ? '\u2713' : ''}</CheckMark>
                        </div>
                      </PlanCardHeader>
                      <PlanFeatures>
                        <PlanFeature>Premier livre 100% gratuit</PlanFeature>
                        <PlanFeature>Bibliotheque personnelle</PlanFeature>
                      </PlanFeatures>
                    </PlanCard>
                    <PlanCard type="button" $selected={selectedPlan === 'club'} $isPro onClick={() => setSelectedPlan('club')}>
                      <PlanBadge>Populaire</PlanBadge>
                      <PlanCardHeader>
                        <PlanName $isPro>Club des Histoires</PlanName>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <PlanPrice $isPro>9,99€/mois</PlanPrice>
                          <CheckMarkPro $visible={selectedPlan === 'club'}>{selectedPlan === 'club' ? '\u2713' : ''}</CheckMarkPro>
                        </div>
                      </PlanCardHeader>
                      <PlanFreeTag>Premier conte inclus</PlanFreeTag>
                      <PlanFeatures $columns>
                        <PlanFeature $premium>1 conte par semaine</PlanFeature>
                        <PlanFeature $premium>9 styles d'illustration</PlanFeature>
                        <PlanFeature $premium>5 personnages secondaires</PlanFeature>
                        <PlanFeature $premium>Themes et occasions</PlanFeature>
                        <PlanFeature>Bibliotheque illimitee</PlanFeature>
                        <PlanFeature>PDF telechargeables</PlanFeature>
                        <PlanFeature>Credits cumulables</PlanFeature>
                        <PlanFeature>Annulable a tout moment</PlanFeature>
                      </PlanFeatures>
                    </PlanCard>
                  </PlanGrid>
                </div>

                <Button variant="primary" size="lg" type="submit" disabled={isLoading} fullWidth>
                  {isLoading ? 'Inscription...' : selectedPlan === 'club' ? 'Creer mon compte & rejoindre le Club' : 'Creer mon compte'}
                </Button>
              </Form>
            </>
          )}

          <LinkText>
            {isRegister ? (
              <>Déjà un compte ?{' '}<span onClick={toggleMode}>Se connecter</span></>
            ) : (
              <>Pas encore de compte ?{' '}<span onClick={toggleMode}>Créer un compte</span></>
            )}
          </LinkText>
        </LoginCard>
      </LoginContainer>
      <Footer />
    </PageContainer>
  );
};

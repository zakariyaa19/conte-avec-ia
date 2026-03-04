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

const PlanSelectorLabel = styled.p`
  font-weight: 600;
  color: ${theme.colors.text.primary};
  font-size: ${theme.fontSizes.sm};
  margin-bottom: ${theme.spacing.xs};
`;

const PlanGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.md};

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const PlanCard = styled.button<{ $selected: boolean; $isPro?: boolean }>`
  position: relative;
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
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg} ${theme.spacing.md};
  cursor: pointer;
  text-align: left;
  transition: all 0.25s ease;
  outline: none;

  ${({ $selected, $isPro }) => $selected && $isPro && css`
    box-shadow: 0 0 0 3px ${theme.colors.accent.coral}20;
  `}

  ${({ $selected, $isPro }) => $selected && !$isPro && css`
    box-shadow: 0 0 0 3px #60A5FA20;
  `}

  &:hover {
    border-color: ${({ $isPro }) => $isPro ? theme.colors.accent.coral : '#60A5FA'};
    transform: translateY(-1px);
  }
`;

const PlanBadge = styled.span`
  display: inline-block;
  background: linear-gradient(135deg, ${theme.colors.accent.coral}, #FF8A65);
  color: white;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 3px 8px;
  border-radius: 20px;
  position: absolute;
  top: -10px;
  right: 12px;
`;

const PlanName = styled.div<{ $isPro?: boolean }>`
  font-weight: 700;
  font-size: ${theme.fontSizes.base};
  color: ${({ $isPro }) => $isPro ? theme.colors.accent.coral : theme.colors.text.primary};
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const PlanPrice = styled.div<{ $isPro?: boolean }>`
  font-size: ${theme.fontSizes.sm};
  color: ${({ $isPro }) => $isPro ? theme.colors.accent.coral : theme.colors.text.secondary};
  font-weight: ${({ $isPro }) => $isPro ? 600 : 400};
  margin-bottom: 8px;
`;

const PlanFeature = styled.div`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.text.secondary};
  display: flex;
  align-items: center;
  gap: 4px;
  line-height: 1.4;

  &::before {
    content: '\u2713';
    color: #22C55E;
    font-weight: 700;
    font-size: 11px;
  }
`;

const CheckMark = styled.div<{ $visible: boolean }>`
  position: absolute;
  top: 10px;
  left: 10px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${({ $visible }) => $visible ? '#3B82F6' : '#E5E7EB'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 11px;
  color: white;
`;

const CheckMarkPro = styled(CheckMark)`
  background: ${({ $visible }) => $visible ? theme.colors.accent.coral : '#E5E7EB'};
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
          <Title>{isRegister ? 'Creer un compte' : 'Connexion'}</Title>
          <Subtitle>
            {isRegister
              ? 'Inscrivez-vous pour retrouver vos contes'
              : 'Accedez a votre bibliotheque de contes'}
          </Subtitle>

          {/* Google OAuth Button */}
          <GoogleButtonWrapper>
            <GoogleLogin
              onSuccess={(credentialResponse: CredentialResponse) => {
                if (credentialResponse.credential) {
                  handleGoogleLogin(credentialResponse.credential);
                }
              }}
              onError={() => setError('Erreur de connexion Google')}
              text={isRegister ? 'signup_with' : 'signin_with'}
              shape="rectangular"
              size="large"
              width="100%"
              logo_alignment="left"
            />
          </GoogleButtonWrapper>
          <OrDivider>ou</OrDivider>

          <Form onSubmit={handleSubmit}>
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

            {isRegister && (
              <>
                <InputField>
                  <InputLabel>Prenom</InputLabel>
                  <Input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Votre prenom"
                    autoComplete="given-name"
                  />
                </InputField>

                <InputField>
                  <InputLabel>Nom</InputLabel>
                  <Input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Votre nom"
                    autoComplete="family-name"
                  />
                </InputField>
              </>
            )}

            <InputField>
              <InputLabel>Email</InputLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                autoComplete="email"
              />
            </InputField>

            <InputField>
              <InputLabel>Mot de passe</InputLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isRegister ? 'Minimum 8 caracteres' : 'Votre mot de passe'}
                autoComplete={isRegister ? 'new-password' : 'current-password'}
              />
              {isRegister && (
                <PasswordHint>Minimum 8 caracteres</PasswordHint>
              )}
            </InputField>

            {/* ─── Plan Selector (register only) ─── */}
            {isRegister && (
              <div>
                <PlanSelectorLabel>Choisissez votre formule</PlanSelectorLabel>
                <PlanGrid>
                  {/* Basic Plan */}
                  <PlanCard
                    type="button"
                    $selected={selectedPlan === 'basic'}
                    onClick={() => setSelectedPlan('basic')}
                  >
                    <CheckMark $visible={selectedPlan === 'basic'}>
                      {selectedPlan === 'basic' ? '\u2713' : ''}
                    </CheckMark>
                    <PlanName>Basique</PlanName>
                    <PlanPrice>Gratuit</PlanPrice>
                    <PlanFeature>Achat de contes a l'unite</PlanFeature>
                    <PlanFeature>Bibliotheque personnelle</PlanFeature>
                  </PlanCard>

                  {/* Pro / Club Plan */}
                  <PlanCard
                    type="button"
                    $selected={selectedPlan === 'club'}
                    $isPro
                    onClick={() => setSelectedPlan('club')}
                  >
                    <PlanBadge>PRO</PlanBadge>
                    <CheckMarkPro $visible={selectedPlan === 'club'}>
                      {selectedPlan === 'club' ? '\u2713' : ''}
                    </CheckMarkPro>
                    <PlanName $isPro>Club des Histoires</PlanName>
                    <PlanPrice $isPro>9,99€ / mois</PlanPrice>
                    <PlanFeature>3 eBooks gratuits / mois</PlanFeature>
                    <PlanFeature>Bibliotheque illimitee</PlanFeature>
                    <PlanFeature>Annulation libre</PlanFeature>
                  </PlanCard>
                </PlanGrid>
              </div>
            )}

            <Button
              variant="primary"
              size="lg"
              type="submit"
              disabled={isLoading}
              fullWidth
            >
              {isLoading
                ? (isRegister ? 'Inscription...' : 'Connexion...')
                : isRegister
                  ? selectedPlan === 'club'
                    ? 'Creer mon compte & rejoindre le Club'
                    : 'Creer mon compte'
                  : 'Se connecter'
              }
            </Button>
          </Form>

          <LinkText>
            {isRegister ? (
              <>
                Deja un compte ?{' '}
                <span onClick={toggleMode}>Se connecter</span>
              </>
            ) : (
              <>
                Pas encore de compte ?{' '}
                <span onClick={toggleMode}>Creer un compte</span>
              </>
            )}
          </LinkText>
        </LoginCard>
      </LoginContainer>
      <Footer />
    </PageContainer>
  );
};

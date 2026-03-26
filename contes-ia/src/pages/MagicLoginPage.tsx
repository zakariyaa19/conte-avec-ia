import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { ApiService } from '../config/api';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: var(--bg-primary);
`;

const Card = styled.div`
  background: var(--bg-card);
  border-radius: 20px;
  padding: 40px 32px;
  max-width: 420px;
  width: 100%;
  text-align: center;
  box-shadow: var(--shadow-card);
`;

const Title = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: 22px;
  color: var(--text-primary);
  margin-bottom: 12px;
`;

const Message = styled.p`
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.5;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  margin: 20px auto;
  border: 3px solid var(--border-input);
  border-top-color: ${theme.colors.accent.coral};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  @keyframes spin { to { transform: rotate(360deg); } }
`;

export const MagicLoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setTokenAndUser } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setErrorMsg('Lien invalide.');
      return;
    }

    (async () => {
      try {
        const response = await ApiService.verifyMagicLink(token);
        if (response.success && response.data) {
          setTokenAndUser(response.data.token, response.data.user);
          setStatus('success');
          setTimeout(() => navigate('/dashboard'), 1000);
        } else {
          setStatus('error');
          setErrorMsg(response.message || 'Lien invalide ou expiré.');
        }
      } catch (err: any) {
        setStatus('error');
        setErrorMsg(err?.message || 'Lien invalide ou expiré.');
      }
    })();
  }, [searchParams, navigate, setTokenAndUser]);

  return (
    <Container>
      <Card>
        {status === 'loading' && (
          <>
            <Spinner />
            <Title>Connexion en cours...</Title>
            <Message>Vérification de votre lien...</Message>
          </>
        )}
        {status === 'success' && (
          <>
            <div style={{ fontSize: 48, marginBottom: 12 }}>&#10003;</div>
            <Title>Connecté !</Title>
            <Message>Redirection vers votre bibliothèque...</Message>
          </>
        )}
        {status === 'error' && (
          <>
            <div style={{ fontSize: 48, marginBottom: 12 }}>&#10007;</div>
            <Title>Lien expiré</Title>
            <Message>{errorMsg}</Message>
            <Message style={{ marginTop: 16 }}>
              <span
                style={{ color: theme.colors.accent.coral, cursor: 'pointer', fontWeight: 600 }}
                onClick={() => navigate('/login')}
              >
                Retour à la connexion
              </span>
            </Message>
          </>
        )}
      </Card>
    </Container>
  );
};

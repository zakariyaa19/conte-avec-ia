import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { theme } from '../styles/theme';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { useAuth } from '../contexts/AuthContext';
import { ApiService } from '../config/api';

const fadeIn = keyframes`from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}`;

const Page = styled.div`min-height:100vh;display:flex;flex-direction:column;background:var(--bg-primary);`;
const Main = styled.main`flex:1;display:flex;align-items:center;justify-content:center;padding:40px 16px;`;
const Card = styled.div`max-width:480px;width:100%;animation:${fadeIn} 0.5s ease both;`;

export const CancelSubscriptionPage: React.FC = () => {
  const { isClub, isAuthenticated, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [error, setError] = useState('');

  // Redirect non-Club users
  if (!isAuthenticated || !isClub) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleApplyDiscount = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('userToken') || '';
      const res = await ApiService.applyRetentionDiscount(token);
      if (res.success) {
        setDiscountApplied(true);
        refreshProfile(); // Refresh auth context
      } else {
        setError(res.message || 'Erreur');
      }
    } catch {
      setError('Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelForReal = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('userToken') || '';
      const result = await ApiService.createCustomerPortal(token);
      if (result.url) {
        window.location.href = result.url;
      }
    } catch {
      setError('Erreur lors de l\'ouverture du portail');
    } finally {
      setLoading(false);
    }
  };

  if (discountApplied) {
    return (
      <Page>
        <Header />
        <Main>
          <Card style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
            <h1 style={{ fontFamily: theme.fonts.heading, fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px' }}>
              Offre appliquée !
            </h1>
            <p style={{ fontSize: theme.fontSizes.sm, color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 24px' }}>
              Votre prochaine facture sera réduite de 70%.
              Vous ne paierez que <strong style={{ color: theme.colors.accent.coral }}>3€</strong> au lieu de 9,99€.
              Le mois suivant, le tarif normal reprendra.
            </p>
            <button onClick={() => navigate('/dashboard')} style={{
              appearance: 'none', border: 'none', cursor: 'pointer', width: '100%',
              padding: '14px', borderRadius: '14px',
              background: `linear-gradient(135deg, ${theme.colors.accent.coral}, #FF7F7F)`,
              color: 'white', fontSize: '15px', fontWeight: 700,
            }}>
              Retour à ma bibliothèque
            </button>
          </Card>
        </Main>
        <Footer />
      </Page>
    );
  }

  return (
    <Page>
      <Header />
      <Main>
        <Card>
          <h1 style={{
            fontFamily: theme.fonts.heading, fontSize: 'clamp(1.3rem, 4vw, 1.7rem)',
            fontWeight: 800, color: 'var(--text-primary)', textAlign: 'center', margin: '0 0 20px',
          }}>
            Vous souhaitez nous quitter ?
          </h1>

          {/* Comparison table */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px',
          }}>
            {/* Free plan */}
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--border-color)',
              borderRadius: '14px', padding: '16px', textAlign: 'center',
            }}>
              <p style={{ fontSize: '12px', color: 'var(--text-light)', margin: '0 0 6px', fontWeight: 600 }}>Plan Gratuit</p>
              <p style={{ fontFamily: theme.fonts.heading, fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 10px' }}>0€</p>
              {['1 livre', '6 pages', '1 style', '1 personnage'].map(f => (
                <p key={f} style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '0 0 4px' }}>• {f}</p>
              ))}
            </div>

            {/* Club plan */}
            <div style={{
              background: `${theme.colors.accent.coral}08`,
              border: `2px solid ${theme.colors.accent.coral}40`,
              borderRadius: '14px', padding: '16px', textAlign: 'center', position: 'relative',
            }}>
              <span style={{
                position: 'absolute', top: '-8px', right: '12px',
                background: theme.colors.accent.coral, color: 'white',
                fontSize: '9px', fontWeight: 700, padding: '2px 8px', borderRadius: '10px',
              }}>Actuel</span>
              <p style={{ fontSize: '12px', color: theme.colors.accent.coral, margin: '0 0 6px', fontWeight: 600 }}>Club</p>
              <p style={{ fontFamily: theme.fonts.heading, fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 10px' }}>9,99€/mois</p>
              {['4 livres/mois', '2x plus de pages', '9 styles', '5 personnages'].map(f => (
                <p key={f} style={{ fontSize: '11px', color: 'var(--text-primary)', margin: '0 0 4px', fontWeight: 500 }}>✓ {f}</p>
              ))}
            </div>
          </div>

          {/* Retention offer */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea08, #764ba212)',
            border: '1px solid rgba(118,75,162,0.2)',
            borderRadius: '16px', padding: '20px', textAlign: 'center', marginBottom: '16px',
          }}>
            <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px' }}>
              🎁 Offre spéciale avant de partir
            </p>
            <p style={{ fontSize: '24px', fontWeight: 800, color: theme.colors.accent.coral, margin: '0 0 4px', fontFamily: theme.fonts.heading }}>
              -70% sur le prochain mois
            </p>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 14px', lineHeight: 1.4 }}>
              Payez seulement <strong>3€</strong> au lieu de 9,99€ le mois prochain.
              Le tarif normal reprendra ensuite.
            </p>
            <button onClick={handleApplyDiscount} disabled={loading} style={{
              appearance: 'none', border: 'none', cursor: 'pointer', width: '100%',
              padding: '14px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white', fontSize: '15px', fontWeight: 700,
              opacity: loading ? 0.7 : 1,
            }}>
              {loading ? 'Application...' : 'Rester avec -70% →'}
            </button>
          </div>

          {error && (
            <p style={{ color: '#EF4444', fontSize: '13px', textAlign: 'center', marginBottom: '12px' }}>{error}</p>
          )}

          {/* Cancel for real */}
          <button onClick={handleCancelForReal} disabled={loading} style={{
            appearance: 'none', border: 'none', cursor: 'pointer', width: '100%',
            padding: '12px', borderRadius: '12px', marginBottom: '8px',
            background: 'transparent', color: 'var(--text-light)', fontSize: '13px',
          }}>
            Non merci, je souhaite annuler →
          </button>

          <p style={{ fontSize: '10px', color: 'var(--text-light)', textAlign: 'center', lineHeight: 1.4 }}>
            La résiliation prend effet à la fin de votre période de facturation.
            Vous conservez l'accès jusqu'à cette date.
          </p>
        </Card>
      </Main>
      <Footer />
    </Page>
  );
};

export default CancelSubscriptionPage;

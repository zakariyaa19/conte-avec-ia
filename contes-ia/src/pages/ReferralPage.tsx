import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../styles/theme';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { ApiService } from '../config/api';

const fadeIn = keyframes`from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}`;

const Page = styled.div`min-height:100vh;display:flex;flex-direction:column;background:var(--bg-primary);`;
const Main = styled.main`flex:1;display:flex;align-items:center;justify-content:center;padding:40px 20px;`;
const Card = styled.div`
  max-width: 440px; width: 100%; text-align: center;
  animation: ${fadeIn} 0.5s ease both;
`;

export const ReferralPage: React.FC = () => {
  const [data, setData] = useState<{ referralCode: string; referralCredits: number; referralCount: number; maxCredits: number; referralLink: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Auth deja garantie par <ProtectedRoute> (voir App.tsx) : attend que
    // isLoading soit false avant meme de monter cette page, donc pas besoin
    // de re-verifier isAuthenticated ici. L'ancien check redirigeait vers
    // /login pour un utilisateur pourtant connecte, car isAuthenticated
    // valait encore false pendant le court instant ou AuthContext verifie
    // le token au chargement direct de la page (visite directe, pas un clic
    // depuis l'app).
    const token = localStorage.getItem('userToken') || '';
    ApiService.getReferralInfo(token)
      .then(res => { if (res.success) setData(res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCopy = async () => {
    if (!data) return;
    try {
      await navigator.clipboard.writeText(data.referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement('input');
      input.value = data.referralLink;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (!data || typeof navigator.share !== 'function') return;
    try {
      await navigator.share({
        title: 'Créez un livre personnalisé gratuit pour votre enfant',
        text: '📖 Votre enfant devient le héros de son propre livre ! Créez le vôtre gratuitement ✨',
        url: data.referralLink,
      });
    } catch { /* cancelled */ }
  };

  const handleWhatsApp = () => {
    if (!data) return;
    const text = encodeURIComponent(`📖 Créez un livre personnalisé GRATUIT pour votre enfant ! Votre enfant devient le héros de son histoire ✨\n${data.referralLink}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  if (loading) return <Page><Header /><Main><p style={{ color: 'var(--text-light)' }}>Chargement...</p></Main><Footer /></Page>;

  return (
    <Page>
      <Header />
      <Main>
        <Card>
          {/* Icon */}
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎁</div>

          {/* Title */}
          <h1 style={{
            fontFamily: theme.fonts.heading, fontSize: 'clamp(1.4rem, 4vw, 1.8rem)',
            fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px',
          }}>
            Gagnez des livres gratuits
          </h1>
          <p style={{
            fontSize: theme.fontSizes.sm, color: 'var(--text-secondary)',
            lineHeight: 1.6, margin: '0 0 24px',
          }}>
            Partagez votre lien à vos proches. Quand ils créent leur livre gratuit,
            vous recevez <strong style={{ color: theme.colors.accent.coral }}>1 livre gratuit</strong> en récompense !
          </p>

          {/* Progress */}
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border-color)',
            borderRadius: '14px', padding: '16px', marginBottom: '20px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Parrainages</span>
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {data?.referralCount || 0}/{data?.maxCredits || 3}
              </span>
            </div>
            <div style={{ height: '6px', borderRadius: '3px', background: 'var(--border-color)', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: '3px',
                background: `linear-gradient(90deg, ${theme.colors.accent.coral}, #FF7F7F)`,
                width: `${((data?.referralCount || 0) / (data?.maxCredits || 3)) * 100}%`,
                transition: 'width 0.3s ease',
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>
                {data?.referralCredits || 0} crédit{(data?.referralCredits || 0) > 1 ? 's' : ''} disponible{(data?.referralCredits || 0) > 1 ? 's' : ''}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>
                Max {data?.maxCredits || 3} parrainages
              </span>
            </div>
          </div>

          {/* How it works */}
          <div style={{
            background: 'var(--bg-secondary)', borderRadius: '12px',
            padding: '14px 16px', marginBottom: '20px', textAlign: 'left',
          }}>
            {[
              { num: '1', text: 'Partagez votre lien à un proche' },
              { num: '2', text: 'Il crée son livre gratuit avec votre lien' },
              { num: '3', text: 'Vous recevez 1 crédit pour un livre gratuit !' },
            ].map(s => (
              <div key={s.num} style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '6px 0' }}>
                <span style={{
                  width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                  background: theme.colors.accent.coral, color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', fontWeight: 700,
                }}>
                  {s.num}
                </span>
                <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{s.text}</span>
              </div>
            ))}
          </div>

          {/* Share buttons */}
          {typeof navigator.share === 'function' && (
            <button onClick={handleNativeShare} style={{
              appearance: 'none', border: 'none', cursor: 'pointer', width: '100%',
              padding: '14px', borderRadius: '14px', marginBottom: '10px',
              background: `linear-gradient(135deg, ${theme.colors.accent.coral}, #FF7F7F)`,
              color: 'white', fontSize: '15px', fontWeight: 700,
            }}>
              Partager mon lien
            </button>
          )}

          <button onClick={handleWhatsApp} style={{
            appearance: 'none', border: 'none', cursor: 'pointer', width: '100%',
            padding: '12px', borderRadius: '12px', marginBottom: '10px',
            background: '#25D366', color: 'white', fontSize: '14px', fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Envoyer via WhatsApp
          </button>

          <button onClick={handleCopy} style={{
            appearance: 'none', cursor: 'pointer', width: '100%',
            padding: '12px', borderRadius: '12px',
            background: 'var(--bg-card)', border: '1px solid var(--border-color)',
            color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600,
          }}>
            {copied ? '✅ Lien copié !' : '📋 Copier mon lien'}
          </button>

          {/* Link display */}
          {data?.referralLink && (
            <p style={{
              fontSize: '10px', color: 'var(--text-light)', marginTop: '12px',
              wordBreak: 'break-all', lineHeight: 1.4,
            }}>
              {data.referralLink}
            </p>
          )}
        </Card>
      </Main>
      <Footer />
    </Page>
  );
};

export default ReferralPage;

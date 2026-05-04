import styled, { keyframes, css } from 'styled-components';

// ─── Palette Contedia ──────────────────────────────────────────

export const C = {
  coral: '#FF9999',
  coralDark: '#FF7F7F',
  coralGlow: 'rgba(255, 153, 153, 0.3)',
  coralSubtle: 'rgba(255, 153, 153, 0.08)',
  bgPrimary: 'var(--bg-primary, #FEFCF8)',
  bgCard: 'var(--bg-card, #FFFFFF)',
  text: 'var(--text-primary, #2C2C2C)',
  textSecondary: 'var(--text-secondary, #5A4A42)',
  textLight: 'var(--text-light, #8B8B8B)',
  border: 'var(--border-color, rgba(0,0,0,0.06))',
  borderInput: 'var(--border-input, #E8E5E1)',
  headerGlass: 'var(--header-glass, rgba(255,255,255,0.72))',
  success: '#4CAF50',
  danger: '#F44336',
};

// ─── Animations ────────────────────────────────────────────────

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`;

const floatSoft = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
`;

const ctaPulse = keyframes`
  0%, 100% { box-shadow: 0 4px 20px rgba(255,153,153,0.35); }
  50% { box-shadow: 0 8px 32px rgba(255,153,153,0.5); }
`;

const ringCelebrate = keyframes`
  0% { transform: scale(1); }
  30% { transform: scale(1.15); }
  60% { transform: scale(0.95); }
  100% { transform: scale(1); }
`;

const particleBurst = keyframes`
  0% { opacity: 1; transform: scale(0) translate(0, 0); }
  50% { opacity: 1; }
  100% { opacity: 0; transform: scale(1) translate(var(--tx), var(--ty)); }
`;

// ─── Layout ────────────────────────────────────────────────────

export const PageWrap = styled.div`
  position: fixed;
  inset: 0;
  background: var(--bg-primary, #FEFCF8);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: 'Poppins', 'Inter', system-ui, -apple-system, sans-serif;
  color: ${C.text};

  /* Orbe decoratif corail (comme la homepage) */
  &::before {
    content: '';
    position: absolute;
    top: -10%;
    right: -15%;
    width: 60%;
    height: 50%;
    background: radial-gradient(circle, rgba(255,153,153,0.1) 0%, rgba(255,179,186,0.06) 40%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    filter: blur(40px);
    z-index: 0;
  }
  &::after {
    content: '';
    position: absolute;
    bottom: -15%;
    left: -10%;
    width: 45%;
    height: 40%;
    background: radial-gradient(circle, rgba(255,229,180,0.15) 0%, rgba(253,246,227,0.08) 40%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    filter: blur(50px);
    z-index: 0;
  }
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  background: ${C.headerGlass};
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border-bottom: 0.5px solid ${C.border};
  z-index: 10;
  flex-shrink: 0;
  min-height: 48px;
`;

export const Logo = styled.div`
  font-family: 'Baloo 2', 'Comic Neue', cursive;
  font-size: 1.25rem;
  font-weight: 700;
  color: ${C.coral};
  cursor: pointer;
  &:hover { opacity: 0.8; }
`;

/* Composer = textarea + paperclip wrapper. AUCUNE bordure visible —
   la profondeur du card vient uniquement du box-shadow. textarea en 16px
   pour empecher l'auto-zoom iOS Safari. */
export const Composer = styled.div`
  position: relative;
  background: ${C.bgCard};
  border: none;
  border-radius: 18px;
  padding: 14px 14px 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 6px 18px rgba(0, 0, 0, 0.04);

  /* Pas de focus-within : aucun changement visuel au clic */

  textarea {
    width: 100%;
    min-height: 110px;
    max-height: 280px;
    border: none;
    outline: none;
    resize: none;
    background: transparent;
    font-family: 'Poppins', system-ui, sans-serif;
    /* 16px obligatoire pour bloquer l'auto-zoom iOS Safari quand l'utilisateur tape */
    font-size: 16px;
    line-height: 1.5;
    color: ${C.text};
    padding: 0;
    letter-spacing: 0.005em;

    &::placeholder {
      color: ${C.textLight};
      opacity: 0.55;
    }
  }
`;

export const Body = styled.main`
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 28px 20px 20px;
  position: relative;
  z-index: 1;

  @media (min-width: 768px) {
    padding: 40px 24px 24px;
    display: flex;
    justify-content: center;
  }
`;

export const BodyInner = styled.div`
  max-width: 480px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (min-width: 768px) {
    gap: 28px;
  }
`;

export const Footer = styled.footer`
  flex-shrink: 0;
  padding: 14px 20px;
  padding-bottom: max(14px, env(safe-area-inset-bottom));
  background: ${C.bgCard};
  border-top: 0.5px solid ${C.border};
  z-index: 10;
  box-shadow: 0 -4px 20px rgba(0,0,0,0.04);
`;

export const FooterInner = styled.div`
  max-width: 480px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 14px;
`;

// ─── Hero ──────────────────────────────────────────────────────

export const HeroBlock = styled.div`
  text-align: center;
  animation: ${fadeIn} 0.6s ease-out;
`;

export const HeroBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: ${C.coralSubtle};
  border: 1px solid rgba(255,153,153,0.15);
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 0.7rem;
  font-weight: 600;
  color: ${C.coralDark};
  margin-bottom: 12px;
`;

export const Title = styled.h1`
  font-family: 'Baloo 2', 'Comic Neue', cursive;
  font-size: 1.55rem;
  font-weight: 700;
  color: ${C.text};
  margin: 0;
  line-height: 1.25;

  span {
    background: linear-gradient(135deg, ${C.coral}, ${C.coralDark});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  @media (min-width: 768px) {
    font-size: 1.85rem;
  }
`;

export const Subtitle = styled.p`
  font-size: 0.875rem;
  color: ${C.textSecondary};
  margin: 8px 0 0;
  line-height: 1.45;
`;

// ─── Form fields ───────────────────────────────────────────────

export const FieldWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  animation: ${fadeIn} 0.5s ease-out both;

  &:nth-child(2) { animation-delay: 0.1s; }
  &:nth-child(3) { animation-delay: 0.2s; }
  &:nth-child(4) { animation-delay: 0.3s; }
`;

export const FieldHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`;

export const FieldLabel = styled.label`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${C.text};
  span.opt { font-weight: 400; color: ${C.textLight}; font-size: 0.8rem; margin-left: 4px; }
`;

export const CharCount = styled.span<{ $over?: boolean }>`
  font-size: 0.75rem;
  color: ${p => p.$over ? C.danger : C.textLight};
  font-variant-numeric: tabular-nums;
`;

export const FieldInput = styled.input`
  width: 100%;
  padding: 14px 16px;
  border: 1.5px solid ${C.borderInput};
  border-radius: 14px;
  font-family: 'Poppins', system-ui, sans-serif;
  font-size: 1rem;
  color: ${C.text};
  background: ${C.bgCard};
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.25s, box-shadow 0.25s;
  box-shadow: 0 1px 4px rgba(0,0,0,0.03);

  &:focus {
    border-color: ${C.coral};
    box-shadow: 0 0 0 3px rgba(255,153,153,0.12), 0 2px 8px rgba(0,0,0,0.04);
  }
  &:focus-visible { outline: 2px solid ${C.coral}; outline-offset: 2px; }
  &::placeholder { color: ${C.textLight}; font-size: 0.9rem; }
`;

export const FieldTextarea = styled.textarea`
  width: 100%;
  min-height: 110px;
  max-height: 200px;
  padding: 14px 16px;
  resize: none;
  border: 1.5px solid ${C.borderInput};
  border-radius: 14px;
  font-family: 'Poppins', system-ui, sans-serif;
  font-size: 1rem;
  line-height: 1.55;
  color: ${C.text};
  background: ${C.bgCard};
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.25s, box-shadow 0.25s;
  box-shadow: 0 1px 4px rgba(0,0,0,0.03);

  &:focus {
    border-color: ${C.coral};
    box-shadow: 0 0 0 3px rgba(255,153,153,0.12), 0 2px 8px rgba(0,0,0,0.04);
  }
  &:focus-visible { outline: 2px solid ${C.coral}; outline-offset: 2px; }
  &::placeholder { color: ${C.textLight}; font-size: 0.9rem; }
`;

export const FieldHint = styled.p`
  font-size: 0.75rem;
  color: ${C.textLight};
  margin: 0;
  display: flex;
  align-items: flex-start;
  gap: 5px;
  line-height: 1.35;
  span.icon { font-size: 13px; flex-shrink: 0; margin-top: 1px; }
`;

// ─── Photo ─────────────────────────────────────────────────────

export const PhotoBtn = styled.button<{ $has?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  min-height: 48px;
  border: 1.5px dashed ${p => p.$has ? C.success : C.borderInput};
  border-radius: 12px;
  background: ${p => p.$has ? 'rgba(76,175,80,0.04)' : C.bgCard};
  font-family: 'Poppins', system-ui, sans-serif;
  font-size: 0.875rem;
  color: ${p => p.$has ? C.success : C.textSecondary};
  cursor: pointer;
  transition: all 0.25s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);

  &:hover {
    border-color: ${C.coral};
    color: ${C.coralDark};
    background: ${C.coralSubtle};
  }
  &:focus-visible { outline: 2px solid ${C.coral}; outline-offset: 2px; }
`;

// ─── Trust signals ─────────────────────────────────────────────

export const TrustRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 6px;
  flex-wrap: wrap;
`;

export const TrustItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: ${C.textLight};
  font-weight: 500;
  white-space: nowrap;
  background: ${C.coralSubtle};
  border-radius: 999px;
  padding: 5px 12px;
`;

// ─── CTA Button ────────────────────────────────────────────────

export const CTA = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 16px 20px;
  border: none;
  border-radius: 16px;
  font-family: 'Baloo 2', 'Poppins', system-ui, sans-serif;
  font-size: 1rem;
  font-weight: 700;
  cursor: ${p => p.$active ? 'pointer' : 'default'};
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);

  background: ${p => p.$active
    ? `linear-gradient(135deg, ${C.coral} 0%, ${C.coralDark} 100%)`
    : C.borderInput};
  color: ${p => p.$active ? 'white' : C.textLight};
  opacity: ${p => p.$active ? 1 : 0.6};
  box-shadow: ${p => p.$active ? `0 4px 20px ${C.coralGlow}` : 'none'};

  ${p => p.$active && css`animation: ${ctaPulse} 2.5s ease-in-out infinite;`}

  &:hover {
    ${p => p.$active && css`transform: translateY(-2px); box-shadow: 0 8px 32px rgba(255,153,153,0.45);`}
  }
  &:active { ${p => p.$active && css`transform: scale(0.98);`} }
  &:disabled { cursor: not-allowed; }
`;

export const CTASpinner = styled.div`
  display: inline-block; width: 18px; height: 18px;
  border: 2.5px solid rgba(255,255,255,0.3); border-top-color: white;
  border-radius: 50%; animation: spin 0.6s linear infinite;
  @keyframes spin { to { transform: rotate(360deg); } }
`;

// ─── Ring (petit, dans le footer) ──────────────────────────────

export const RingWrap = styled.div<{ $celebrating?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  ${p => p.$celebrating && css`animation: ${ringCelebrate} 600ms ease-out;`}
`;

export const RingPct = styled.span`
  position: absolute;
  font-size: 10px;
  font-weight: 800;
  color: ${C.text};
`;

export const RingParticles = styled.div`
  position: absolute;
  inset: -6px;
  pointer-events: none;
  span {
    position: absolute; width: 4px; height: 4px; border-radius: 50%;
    background: ${C.success};
    animation: ${particleBurst} 800ms ease-out forwards; opacity: 0;
  }
`;

// ─── Auth (step 2) ─────────────────────────────────────────────

export const AuthInput = styled.input`
  width: 100%;
  padding: 14px 16px;
  border: 1.5px solid ${C.borderInput};
  border-radius: 14px;
  font-family: 'Poppins', system-ui, sans-serif;
  font-size: 1rem;
  color: ${C.text};
  outline: none;
  box-sizing: border-box;
  background: ${C.bgCard};
  transition: border-color 0.25s, box-shadow 0.25s;
  box-shadow: 0 1px 4px rgba(0,0,0,0.03);
  &:focus { border-color: ${C.coral}; box-shadow: 0 0 0 3px rgba(255,153,153,0.12); }
  &::placeholder { color: ${C.textLight}; }
`;

export const CHAT_COLORS = C;

import styled, { keyframes, css } from 'styled-components';

// ─── Palette Contedia ──────────────────────────────────────────

export const C = {
  coral: '#FF9999',
  coralDark: '#FF7F7F',
  coralGlow: 'rgba(255, 153, 153, 0.3)',
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

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;
const ctaPulse = keyframes`
  0%, 100% { box-shadow: 0 4px 16px rgba(255,153,153,0.3); }
  50% { box-shadow: 0 6px 24px rgba(255,153,153,0.45); }
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
  position: fixed; inset: 0;
  background: ${C.bgPrimary};
  display: flex; flex-direction: column;
  overflow: hidden;
  font-family: 'Poppins', 'Inter', system-ui, -apple-system, sans-serif;
  color: ${C.text};
`;

export const Header = styled.header`
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 16px; height: 48px;
  background: ${C.headerGlass};
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border-bottom: 0.5px solid ${C.border};
  z-index: 10; flex-shrink: 0;
  @media (min-width: 768px) { padding: 8px 32px; height: 52px; }
`;

export const Logo = styled.div`
  font-family: 'Baloo 2', 'Comic Neue', cursive;
  font-size: 1.25rem; font-weight: 700; color: ${C.coral};
  cursor: pointer; &:hover { opacity: 0.8; }
`;

export const Body = styled.main`
  flex: 1; overflow-y: auto; -webkit-overflow-scrolling: touch;
  padding: 16px 16px 12px;
  max-width: 520px; width: 100%; margin: 0 auto;
  display: flex; flex-direction: column; gap: 14px;
  @media (min-width: 768px) { padding: 24px 24px 16px; gap: 18px; }
`;

export const Footer = styled.footer`
  flex-shrink: 0;
  padding: 10px 16px;
  padding-bottom: max(10px, env(safe-area-inset-bottom));
  background: ${C.bgCard};
  border-top: 0.5px solid ${C.border};
  @media (min-width: 768px) { padding: 12px 24px; display: flex; justify-content: center; }
`;

export const FooterInner = styled.div`
  max-width: 520px; width: 100%; margin: 0 auto;
  display: flex; align-items: center; gap: 12px;
`;

// ─── Title ─────────────────────────────────────────────────────

export const Title = styled.h1`
  font-family: 'Baloo 2', 'Comic Neue', cursive;
  font-size: 1.2rem; font-weight: 700; color: ${C.text};
  margin: 0; line-height: 1.2; text-align: center;
  span {
    background: linear-gradient(135deg, ${C.coral}, ${C.coralDark});
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  @media (min-width: 768px) { font-size: 1.4rem; }
`;

export const Subtitle = styled.p`
  font-size: 0.8rem; color: ${C.textLight};
  text-align: center; margin: 2px 0 0; line-height: 1.3;
`;

// ─── Form field ────────────────────────────────────────────────

export const FieldWrap = styled.div`
  display: flex; flex-direction: column; gap: 4px;
  animation: ${fadeIn} 300ms ease-out;
`;

export const FieldHeader = styled.div`
  display: flex; justify-content: space-between; align-items: baseline;
`;

export const FieldLabel = styled.label`
  font-size: 0.875rem; font-weight: 600; color: ${C.text};
  span.opt { font-weight: 400; color: ${C.textLight}; font-size: 0.75rem; margin-left: 4px; }
`;

export const CharCount = styled.span<{ $over?: boolean }>`
  font-size: 0.6875rem; color: ${p => p.$over ? C.danger : C.textLight};
  font-variant-numeric: tabular-nums;
`;

export const FieldInput = styled.input`
  width: 100%; padding: 10px 14px; min-height: 44px;
  border: 1.5px solid ${C.borderInput}; border-radius: 0.625rem;
  font-family: 'Poppins', system-ui, sans-serif; font-size: 0.9rem;
  color: ${C.text}; background: ${C.bgCard};
  outline: none; box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s;
  &:focus { border-color: ${C.coral}; box-shadow: 0 0 0 2px rgba(255,153,153,0.12); }
  &:focus-visible { outline: 2px solid ${C.coral}; outline-offset: 1px; }
  &::placeholder { color: ${C.textLight}; }
`;

export const FieldTextarea = styled.textarea`
  width: 100%; min-height: 72px; max-height: 180px;
  padding: 10px 14px; resize: none;
  border: 1.5px solid ${C.borderInput}; border-radius: 0.625rem;
  font-family: 'Poppins', system-ui, sans-serif; font-size: 0.9rem;
  line-height: 1.5; color: ${C.text}; background: ${C.bgCard};
  outline: none; box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s;
  &:focus { border-color: ${C.coral}; box-shadow: 0 0 0 2px rgba(255,153,153,0.12); }
  &::placeholder { color: ${C.textLight}; }
`;

export const FieldHint = styled.p`
  font-size: 0.6875rem; color: ${C.textLight}; margin: 0;
  display: flex; align-items: center; gap: 4px;
  span.icon { font-size: 12px; }
`;

// ─── Photo button (inline, petit) ─────────────────────────────

export const PhotoBtn = styled.button<{ $has?: boolean }>`
  display: flex; align-items: center; gap: 6px;
  padding: 10px 14px; min-height: 44px;
  border: 1.5px dashed ${p => p.$has ? C.success : C.borderInput};
  border-radius: 0.5rem; background: transparent;
  font-family: 'Poppins', system-ui, sans-serif;
  font-size: 0.8125rem; color: ${p => p.$has ? C.success : C.textLight};
  cursor: pointer; transition: all 0.2s;
  &:hover { border-color: ${C.coral}; color: ${C.coral}; }
  &:focus-visible { outline: 2px solid ${C.coral}; outline-offset: 2px; }
`;

// ─── Trust ─────────────────────────────────────────────────────

export const TrustRow = styled.div`
  display: flex; justify-content: center; gap: 14px; padding: 0 4px;
`;

export const TrustItem = styled.div`
  display: flex; align-items: center; gap: 3px;
  font-size: 0.625rem; color: ${C.textLight}; font-weight: 500; white-space: nowrap;
`;

// ─── CTA ───────────────────────────────────────────────────────

export const CTA = styled.button<{ $active: boolean }>`
  flex: 1; padding: 12px 16px; border: none; border-radius: 1.25rem;
  font-family: 'Poppins', system-ui, sans-serif; font-size: 0.9rem; font-weight: 700;
  cursor: ${p => p.$active ? 'pointer' : 'default'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: ${p => p.$active ? `linear-gradient(135deg, ${C.coral}, ${C.coralDark})` : C.borderInput};
  color: ${p => p.$active ? 'white' : C.textLight};
  opacity: ${p => p.$active ? 1 : 0.6};
  box-shadow: ${p => p.$active ? `0 4px 16px ${C.coralGlow}` : 'none'};
  ${p => p.$active && css`animation: ${ctaPulse} 2.5s ease-in-out infinite;`}
  &:hover { ${p => p.$active && css`transform: translateY(-1px);`} }
  &:disabled { cursor: not-allowed; }
`;

export const CTASpinner = styled.div`
  display: inline-block; width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,0.3); border-top-color: white;
  border-radius: 50%; animation: spin 0.6s linear infinite;
  @keyframes spin { to { transform: rotate(360deg); } }
`;

// ─── Ring (petit, dans le footer) ──────────────────────────────

export const RingWrap = styled.div<{ $celebrating?: boolean }>`
  position: relative; display: flex; align-items: center; justify-content: center;
  width: 38px; height: 38px; flex-shrink: 0;
  ${p => p.$celebrating && css`animation: ${ringCelebrate} 600ms ease-out;`}
`;

export const RingPct = styled.span`
  position: absolute; font-size: 9px; font-weight: 800; color: ${C.text};
`;

export const RingParticles = styled.div`
  position: absolute; inset: -6px; pointer-events: none;
  span {
    position: absolute; width: 4px; height: 4px; border-radius: 50%;
    background: ${C.success};
    animation: ${particleBurst} 800ms ease-out forwards; opacity: 0;
  }
`;

// ─── Auth (step 2) ─────────────────────────────────────────────

export const AuthInput = styled.input`
  width: 100%; padding: 0.75rem 1rem;
  border: 2px solid ${C.borderInput}; border-radius: 0.625rem;
  font-family: 'Poppins', system-ui, sans-serif; font-size: 0.9rem;
  color: ${C.text}; outline: none; box-sizing: border-box;
  background: ${C.bgCard};
  transition: border-color 0.25s, box-shadow 0.25s;
  &:focus { border-color: ${C.coral}; box-shadow: 0 0 0 3px rgba(255,153,153,0.15); }
  &::placeholder { color: ${C.textLight}; }
`;

export const CHAT_COLORS = C;

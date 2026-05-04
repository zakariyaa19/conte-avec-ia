import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { StoryFormData } from '../../types/FormTypes';
import { ApiService } from '../../config/api';
import { useAuth } from '../../contexts/AuthContext';
import { safeLocalStorage } from '../../utils/safeStorage';
import { trackFunnelStep } from '../../utils/funnelTracker';
import { useCoverPreview, isPhase1Complete } from '../../hooks/useCoverPreview';
import { CompletionRing } from './CompletionRing';
import { BookCoverPreview } from '../ui/BookCoverPreview';
import { useStoryDetection, computeDetectionScore } from './useStoryDetection';
import { useSmartHint } from './useSmartHint';
import { SmartHint } from './SmartHint';

import {
  PageWrap, Header, Logo, Body, BodyInner, Footer, FooterInner,
  Subtitle, TrustRow, TrustItem,
  CTA, CTASpinner, AuthInput, C, Composer,
} from './ChatStoryStyles';

interface Props {
  formData: Partial<StoryFormData>;
  onUpdate: (d: Partial<StoryFormData>) => void;
  onSubmit: (d?: Partial<StoryFormData>) => Promise<void>;
  isSubmitting: boolean;
  isAuthenticated: boolean;
  isClub: boolean;
  currentUser: any;
  clubCredit: any;
}

const STORY_LIMIT = 600;

const PLACEHOLDERS = [
  "Une petite fille de 10 ans qui adore le foot, dans l'univers d'Harry Potter...",
  "Mon fils Adam, 5 ans, courageux face au monstre sous son lit, avec son chien Moustache...",
  "Luna, 7 ans, princesse en quête de son dragon perdu, sur le thème de l'amitié...",
  "Inès et son chat Biscuit explorent un château magique, style aquarelle...",
];

export const ChatStoryCreator: React.FC<Props> = ({
  formData, onUpdate, onSubmit, isSubmitting,
  isAuthenticated, isClub, currentUser,
}) => {
  // ── Single field : description complete (prenom + age + theme + tout) ────
  const [story, setStory] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [email, setEmail] = useState(formData.userEmail || '');
  const [step, setStep] = useState<'form' | 'preview'>('form');
  const [googleError, setGoogleError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [phIdx, setPhIdx] = useState(0);
  const { setTokenAndUser } = useAuth();
  const googleAutoRef = useRef(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const previewTopRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Placeholder rotatif (4.5s) — cesse de tourner des que l'utilisateur ecrit
  useEffect(() => {
    if (story.length > 0) return;
    const id = setInterval(() => setPhIdx(i => (i + 1) % PLACEHOLDERS.length), 4500);
    return () => clearInterval(id);
  }, [story.length]);

  // Auto-grow de la textarea (jusqu'a 280px puis scroll interne)
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 280) + 'px';
  }, [story]);

  // ── Detection en live (sans defaults) — pilote scoring + cover preview ──
  const detected = useStoryDetection(story, !!photo);
  const percentage = computeDetectionScore(detected);
  // Seuil 70% = "pret a lancer" : on override le hint et on signale visuellement
  const isReady = percentage >= 70;
  // SmartHint = vraie analyse IA du brief (debounced, cache, fallback local)
  const { hint: aiHint, thinking: hintThinking } = useSmartHint(story, detected);
  // Au-dessus de 70%, on remplace le hint par une invitation a lancer la creation
  const hintText = isReady ? "Tout est prêt — tu peux lancer la création !" : aiHint;
  const ringColor = isReady ? '#22C55E' : percentage >= 35 ? '#F59E0B' : '#FF9999';

  // ── mergedData : detection + defaults pour la creation backend ──
  const mergedData = useMemo<Partial<StoryFormData>>(() => {
    let ageRange = '6-9';
    if (detected.age) {
      const n = parseInt(detected.age, 10);
      ageRange = n <= 2 ? '0-2' : n <= 5 ? '3-5' : n <= 9 ? '6-9' : '10+';
    }
    const secondaryChars = detected.secondary ? [{
      kind: detected.secondary.kind,
      name: '',
      ageOrType: detected.secondary.label,
    }] : [];
    return {
      protagonistName: detected.name || '',
      protagonistAge: detected.age || '7',
      protagonistGender: detected.gender || 'girl',
      ageRange,
      generalTheme: detected.theme || 'stories',
      customTheme: '',
      specificSubject: detected.occasion || detected.theme || 'stories',
      centralMessage: detected.moral || 'courage',
      illustrationStyle: detected.style || formData.illustrationStyle || '3d-animation',
      hobbies: detected.hobby || '',
      secondaryCharacters: secondaryChars.length ? secondaryChars : undefined,
      language: 'french',
      productType: 'ebook',
      appearanceMode: photo ? 'photo' : undefined,
      photo: photo || undefined,
      specialEvents: story.trim(),
    } as Partial<StoryFormData>;
  }, [detected, story, photo, formData.illustrationStyle]);

  const heroName = detected.name && detected.name.length > 15 ? detected.name.substring(0, 15) + '...' : (detected.name || 'votre enfant');
  const heroNameFull = detected.name || 'votre enfant';

  // Cover preview
  const coverPreview = useCoverPreview(mergedData);

  // Auth
  useEffect(() => { if (isAuthenticated && currentUser?.email) setEmail(currentUser.email); }, [isAuthenticated, currentUser]);
  useEffect(() => { trackFunnelStep('chat_ui_page_view'); }, []);
  useEffect(() => {
    if (googleAutoRef.current && isAuthenticated && currentUser?.email) {
      googleAutoRef.current = false;
      doSubmit(currentUser.email);
    }
  }, [isAuthenticated, currentUser]);

  // Funnel : email_entered fire des qu'un email valide est saisi (manuel) OU
  // qu'une auth Google a aboutit. Une seule fois par session grace au dedup interne.
  useEffect(() => {
    if (isAuthenticated && currentUser?.email) {
      trackFunnelStep('email_entered');
    } else if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      trackFunnelStep('email_entered');
    }
  }, [isAuthenticated, currentUser, email]);

  // Focus on step change
  useEffect(() => {
    if (step === 'preview') {
      setTimeout(() => previewTopRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [step]);

  // Photo
  const pickPhoto = useCallback((file: File) => {
    if (file.size > 15 * 1024 * 1024) { alert('Photo trop lourde (max 15 Mo)'); return; }
    if (!file.type.startsWith('image/')) { alert('Format de fichier non supporté'); return; }
    const r = new FileReader();
    r.onerror = () => { alert('Erreur lors de la lecture de la photo'); };
    r.onload = e => { setPhoto(file); setPhotoPreview(e.target?.result as string); };
    r.readAsDataURL(file);
  }, []);

  // canGo = prenom detecte + un peu de description (le reste a des defauts safe)
  const canGo = !!detected.name && story.trim().length >= 12;

  // CTA → preview
  const gotoPreview = useCallback(() => {
    if (!canGo || submitting) return;

    const dataToSend = { ...mergedData };
    if (!dataToSend.protagonistGender) dataToSend.protagonistGender = 'girl';
    if (!dataToSend.ageRange) dataToSend.ageRange = '6-9';
    if (!dataToSend.protagonistAge) dataToSend.protagonistAge = '7';
    if (!dataToSend.generalTheme) dataToSend.generalTheme = 'stories';
    if (!dataToSend.specificSubject) dataToSend.specificSubject = dataToSend.generalTheme;
    if (!dataToSend.centralMessage) dataToSend.centralMessage = 'courage';
    if (!dataToSend.illustrationStyle) dataToSend.illustrationStyle = '3d-animation';

    onUpdate(dataToSend);
    if (isPhase1Complete(dataToSend)) coverPreview.generate();
    trackFunnelStep('chat_to_preview');
    setStep('preview');
  }, [canGo, submitting, mergedData, onUpdate, coverPreview]);

  // Submit
  const doSubmit = useCallback(async (submitEmail: string) => {
    if (submitting || isSubmitting) return; // anti double-click
    setSubmitting(true);
    try {
      const final: Partial<StoryFormData> = {
        ...mergedData,
        protagonistGender: mergedData.protagonistGender || 'girl',
        ageRange: mergedData.ageRange || '6-9',
        protagonistAge: mergedData.protagonistAge || '7',
        generalTheme: mergedData.generalTheme || 'stories',
        specificSubject: mergedData.specificSubject || mergedData.generalTheme || 'stories',
        centralMessage: mergedData.centralMessage || 'courage',
        illustrationStyle: mergedData.illustrationStyle || '3d-animation',
        userEmail: submitEmail.trim().toLowerCase(),
        coverImageUrl: coverPreview.cloudinaryUrl || undefined,
        coverImageBase64: coverPreview.rawBase64 || undefined,
        coverTitle: coverPreview.coverTitle || undefined,
      };
      onUpdate(final);
      await onSubmit(final);
    } finally {
      setSubmitting(false);
    }
  }, [submitting, isSubmitting, mergedData, coverPreview, onUpdate, onSubmit]);

  const handlePreviewSubmit = useCallback(() => {
    if (isAuthenticated && currentUser?.email) doSubmit(currentUser.email);
    else if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) doSubmit(email);
  }, [isAuthenticated, currentUser, email, doSubmit]);

  const handleGoogle = useCallback(async (cred: CredentialResponse) => {
    if (!cred.credential) return;
    setGoogleError(false);
    try {
      const res = await ApiService.googleAuth(cred.credential);
      if (res.success && res.data) {
        if (res.data.token) safeLocalStorage.setItem('userToken', res.data.token);
        setTokenAndUser(res.data.token, res.data.user);
        setEmail(res.data.user?.email || '');
        onUpdate({ userEmail: res.data.user?.email || '', firstName: res.data.user?.firstName || '' });
        googleAutoRef.current = true;
      }
    } catch {
      setGoogleError(true);
    }
  }, [setTokenAndUser, onUpdate]);

  const inApp = /FBAN|FBAV|Instagram|Line\/|Twitter|MicroMessenger/i.test(navigator.userAgent);
  const validEmail = !!email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isBusy = submitting || isSubmitting;

  // ═══ STEP 1 : FORM ════════════════════════════════════
  if (step === 'form') {
    return (
      <PageWrap>
        {/* Logo Contedia minimal, cliquable, en haut-gauche flottant — pas de header bar */}
        <div
          onClick={() => { window.location.href = '/'; }}
          role="button"
          aria-label="Retour à l'accueil"
          style={{
            position: 'absolute', top: 14, left: 16, zIndex: 5,
            fontFamily: "'Baloo 2', 'Comic Neue', cursive",
            fontSize: 16, fontWeight: 700, color: C.coral, cursor: 'pointer',
            opacity: 0.7,
          }}
        >
          Contedia
        </div>

        <Body>
          <BodyInner>
            {/* Hero compact + H1 dynamique (sans badge) */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginTop: 28 }}>
              <h1 style={{
                fontFamily: "'Baloo 2', 'Comic Neue', cursive",
                fontSize: 'clamp(1.55rem, 5.8vw, 2.15rem)',
                lineHeight: 1.15,
                fontWeight: 800,
                color: C.text,
                textAlign: 'center',
                margin: 0,
                letterSpacing: '-0.01em',
              }}>
                L'histoire personnalisée<br />de votre enfant <span style={{ color: C.coral }}>en 5 min</span>
              </h1>
              <Subtitle style={{ marginTop: 2 }}>Décrivez ci-dessous, l'IA s'occupe du reste.</Subtitle>
            </div>

            {/* ── Composer unique : textarea + paperclip integre ── */}
            <Composer>
              <textarea
                ref={textareaRef}
                value={story}
                onChange={e => { if (e.target.value.length <= STORY_LIMIT) setStory(e.target.value); }}
                placeholder={PLACEHOLDERS[phIdx]}
                autoFocus
                aria-label="Décrivez l'histoire que vous voulez créer"
              />
              {/* Photo chip si attachee */}
              {photoPreview && (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'rgba(76,175,80,0.08)',
                  border: '1px solid rgba(76,175,80,0.2)',
                  borderRadius: 24,
                  padding: '4px 10px 4px 4px',
                  marginTop: 6,
                  fontSize: 12,
                  color: C.success,
                  fontWeight: 500,
                }}>
                  <img src={photoPreview} alt="Photo" style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }} />
                  <span>Photo jointe</span>
                  <button onClick={() => { setPhoto(null); setPhotoPreview(null); }}
                    aria-label="Retirer la photo"
                    style={{ background: 'none', border: 'none', color: C.danger, fontSize: 14, cursor: 'pointer', padding: '0 4px', lineHeight: 1 }}>&#10005;</button>
                </div>
              )}
              {/* Footer du composer : paperclip a gauche, count discret a droite */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, paddingTop: 8, borderTop: `1px solid ${C.border}` }}>
                <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/heic"
                  style={{ display: 'none' }} aria-label="Joindre une photo de l'enfant"
                  onChange={e => { const f = e.target.files?.[0]; if (f) pickPhoto(f); e.target.value = ''; }} />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  aria-label="Joindre une photo"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: 'transparent', border: 'none',
                    color: photo ? C.success : C.textLight,
                    fontSize: 13, fontWeight: 500, cursor: 'pointer',
                    padding: '4px 6px', borderRadius: 8,
                    fontFamily: 'inherit',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                  </svg>
                  {photo ? 'Photo jointe' : 'Joindre une photo'}
                </button>
                {story.length > STORY_LIMIT * 0.8 && (
                  <span style={{ fontSize: 11, color: story.length >= STORY_LIMIT ? C.danger : C.textLight, fontWeight: 500 }}>
                    {story.length}/{STORY_LIMIT}
                  </span>
                )}
              </div>
            </Composer>

            {/* SmartHint — apparition IA stylée sous la textarea */}
            <SmartHint text={hintText} thinking={hintThinking} />

            {/* Trust */}
            <TrustRow>
              <TrustItem>&#10003; 1er chapitre gratuit</TrustItem>
              <TrustItem>&#10003; Prêt en 5 minutes</TrustItem>
              <TrustItem>&#10003; Sans carte bancaire</TrustItem>
            </TrustRow>
          </BodyInner>
        </Body>

        <Footer>
          <FooterInner>
            <CTA
              $active={canGo}
              disabled={!canGo || isBusy}
              onClick={gotoPreview}
              aria-busy={isBusy}
              style={isReady ? { boxShadow: '0 0 0 3px rgba(34,197,94,0.18), 0 8px 28px rgba(34,197,94,0.3)' } : undefined}
            >
              {!canGo
                ? 'Décrivez votre histoire ci-dessus'
                : isReady
                  ? `✨ Prêt — créer le livre de ${heroName}`
                  : `Créer le livre de ${heroName} — Gratuit`}
            </CTA>
            <CompletionRing percentage={percentage} color={ringColor} />
          </FooterInner>
        </Footer>
      </PageWrap>
    );
  }

  // ═══ STEP 2 : PREVIEW ═════════════════════════════════
  const coverReady = !!coverPreview.rawBase64;
  const coverUrl = coverPreview.coverImageUrl;
  const coverError = coverPreview.error;
  // Le client peut soumettre des qu'il est identifié. La cover est un bonus visuel —
  // si elle n'est pas prête, le backend la régénère lors de la création du livre.
  const payReady = isAuthenticated || validEmail;

  return (
    <PageWrap>
      <Header>
        <Logo onClick={() => setStep('form')}>&#8592; Modifier</Logo>
        <div />
      </Header>

      <Body style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', overflowY: 'auto', padding: '20px 16px' }}>
        <div ref={previewTopRef} style={{
          width: '100%', maxWidth: 440,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
          margin: 'auto 0',
        }}>
          {/* Title */}
          <p style={{ fontFamily: "'Baloo 2', cursive", fontSize: '1.05rem', fontWeight: 700, textAlign: 'center', margin: 0 }}>
            {coverError ? `Préparation du livre de ${heroNameFull}` : coverReady ? `Le livre de ${heroNameFull} est prêt !` : `Création du livre de ${heroNameFull}...`}
          </p>

          {/* Cover — BookCoverPreview avec MagicalLoadingScene (livre anime, sparkles, messages rotatifs).
              Largeur explicite pour garantir un rendu coherent (sinon le ratio 2/3 du composant donne 0 height
              quand le parent flex n'a pas de hauteur definie). */}
          <div style={{
            width: '100%', maxWidth: 240,
            flexShrink: 0,
          }}>
            {coverError ? (
              <div style={{ textAlign: 'center', padding: 20, aspectRatio: '2/3', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-card)', borderRadius: 12 }}>
                <p style={{ fontSize: '3rem', margin: '0 0 8px' }}>📖</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', margin: '0 0 12px' }}>La couverture n'a pas pu être générée</p>
                <button onClick={() => coverPreview.generate()} style={{
                  padding: '8px 16px', borderRadius: 8, border: `1.5px solid ${C.coral}`, background: 'transparent',
                  color: C.coral, fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit',
                }}>Réessayer</button>
              </div>
            ) : (
              <BookCoverPreview
                coverImageUrl={coverUrl}
                isGenerating={!coverReady}
              />
            )}
          </div>

          {/* Auth + CTA */}
          <div style={{ width: '100%' }}>
            {!isAuthenticated && (
              <p style={{ fontFamily: "'Baloo 2', cursive", fontSize: '0.95rem', fontWeight: 700, textAlign: 'center', margin: '0 0 10px' }}>
                Recevez le livre de {heroNameFull} gratuitement
              </p>
            )}

            {!isAuthenticated && !inApp && (
              <div style={{ textAlign: 'center', marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <GoogleLogin onSuccess={handleGoogle} onError={() => setGoogleError(true)} text="continue_with" shape="rectangular" size="large" />
                </div>
                {googleError && (
                  <p style={{ fontSize: 11, color: C.danger, margin: '6px 0 0', textAlign: 'center' }}>Connexion Google échouée. Utilisez votre email.</p>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '10px 0 6px' }}>
                  <div style={{ flex: 1, height: 1, background: 'var(--border-color)' }} />
                  <span style={{ fontSize: 10, color: 'var(--text-light)' }}>ou</span>
                  <div style={{ flex: 1, height: 1, background: 'var(--border-color)' }} />
                </div>
              </div>
            )}

            {isAuthenticated && currentUser && (
              <div style={{ background: 'rgba(76,175,80,0.08)', border: '1px solid rgba(76,175,80,0.2)', borderRadius: 10, padding: '10px 14px', marginBottom: 10, textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#2E7D32' }}>
                Connecté : <strong>{currentUser.email}</strong>
              </div>
            )}

            {!isAuthenticated && (
              <div style={{ marginBottom: 10 }}>
                <AuthInput type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="votre@email.com" autoComplete="email"
                  onKeyDown={e => { if (e.key === 'Enter') handlePreviewSubmit(); }}
                  aria-label="Adresse email" />
              </div>
            )}

            <CTA $active={!!payReady && !isBusy} disabled={!payReady || isBusy} onClick={handlePreviewSubmit}
              style={{ width: '100%' }} aria-busy={isBusy}>
              {isBusy ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><CTASpinner /> Création en cours...</span> : `Lire le livre de ${heroName} gratuitement →`}
            </CTA>

            <p style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 10, textAlign: 'center' }}>&#9989; Gratuit &middot; &#9889; Prêt en 5 min</p>
          </div>
        </div>
      </Body>
    </PageWrap>
  );
};

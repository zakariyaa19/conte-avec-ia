import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { StoryFormData } from '../../types/FormTypes';
import { ApiService } from '../../config/api';
import { useAuth } from '../../contexts/AuthContext';
import { safeLocalStorage } from '../../utils/safeStorage';
import { trackFunnelStep } from '../../utils/funnelTracker';
import { useCoverPreview, isPhase1Complete } from '../../hooks/useCoverPreview';
import { useCompletionScore } from './useCompletionScore';
import { CompletionRing } from './CompletionRing';

import {
  PageWrap, Header, Logo, Body, Footer, FooterInner,
  Title, Subtitle, TrustRow, TrustItem,
  FieldWrap, FieldHeader, FieldLabel, CharCount, FieldInput, FieldTextarea, FieldHint,
  PhotoBtn, CTA, CTASpinner, AuthInput, C,
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

const LIMITS = { name: 30, story: 500, secondary: 200 };

export const ChatStoryCreator: React.FC<Props> = ({
  formData, onUpdate, onSubmit, isSubmitting,
  isAuthenticated, isClub, currentUser,
}) => {
  // ── Fields ─────────────────────────────────────────────
  const [name, setName] = useState('');
  const [story, setStory] = useState('');
  const [secondary, setSecondary] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [email, setEmail] = useState(formData.userEmail || '');
  const [step, setStep] = useState<'form' | 'preview'>('form');
  const [googleError, setGoogleError] = useState(false);
  const [submitting, setSubmitting] = useState(false); // local guard anti double-click
  const { setTokenAndUser } = useAuth();
  const googleAutoRef = useRef(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const previewTopRef = useRef<HTMLDivElement>(null);

  // ── Build StoryFormData from fields ────────────────────
  const mergedData = useMemo<Partial<StoryFormData>>(() => {
    const storyNorm = story.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

    // Parse age
    const ageMatch = story.match(/(\d{1,2})\s*ans?\b/i);
    const age = ageMatch ? ageMatch[1] : '';
    const ageNum = parseInt(age, 10);
    const ageRange = !age ? '' : ageNum <= 2 ? '0-2' : ageNum <= 5 ? '3-5' : ageNum <= 9 ? '6-9' : '10+';

    // Parse gender
    const isGirl = /\b(?:fille|fillette|petite|princesse|elle)\b/i.test(story);
    const isBoy = /\b(?:gar[cç]on|fils|petit|prince(?!sse)|il\s+(?:aime|adore|veut))\b/i.test(story);
    const gender: 'boy' | 'girl' | undefined = isGirl ? 'girl' : isBoy ? 'boy' : undefined;

    // Parse theme
    let theme = '';
    if (/magie|magique|fee|sorcier|dragon|licorne|chateau|enchante|harry potter|univers/.test(storyNorm)) theme = 'fairy-tales';
    else if (/educatif|ecole|apprendre|science/.test(storyNorm)) theme = 'educational';
    else if (/aventure|voyage|pirate|espace|tresor|jungle|mystere|detective/.test(storyNorm)) theme = 'stories';
    else if (/famille|frere|soeur|papa|maman/.test(storyNorm)) theme = 'family';
    else if (/anniversaire|noel|fete|paques/.test(storyNorm)) theme = 'celebrations';
    else if (story.length > 20) theme = 'stories';

    // Parse occasion (specificSubject)
    let occasion = '';
    if (/anniversaire/.test(storyNorm)) occasion = 'birthday';
    else if (/noel|christmas/.test(storyNorm)) occasion = 'christmas';
    else if (/paques/.test(storyNorm)) occasion = 'easter';
    else if (/aid|eid|ramadan/.test(storyNorm)) occasion = 'eid';
    else if (/fete des mere/.test(storyNorm)) occasion = 'mothers-day';
    else if (/fete des pere/.test(storyNorm)) occasion = 'fathers-day';

    // Parse moral (centralMessage)
    let moral = '';
    if (/courage|courageux|brave|peur|surmonter/.test(storyNorm)) moral = 'courage';
    else if (/amitie|ami|copain|camarade/.test(storyNorm)) moral = 'friendship';
    else if (/amour|tendresse|affection/.test(storyNorm)) moral = 'love';
    else if (/partage|genereux|generosite/.test(storyNorm)) moral = 'sharing';
    else if (/respect|tolerance|politesse/.test(storyNorm)) moral = 'respect';
    else if (/honnetete|verite|sincere/.test(storyNorm)) moral = 'honesty';
    else if (/perseverance|determination|abandonner/.test(storyNorm)) moral = 'perseverance';

    // Parse illustration style
    let style = formData.illustrationStyle || '3d-animation';
    if (/aquarelle|watercolor|peinture/.test(storyNorm)) style = 'watercolor';
    else if (/manga|anime|japonais|dessin anime/.test(storyNorm)) style = 'japanese-manga';
    else if (/3d|pixar|disney/.test(storyNorm)) style = '3d-animation';
    else if (/kawaii|mignon|cute/.test(storyNorm)) style = 'kawaii';
    else if (/papier decoupe|collage/.test(storyNorm)) style = 'paper-cut';
    else if (/bloc|minecraft|lego/.test(storyNorm)) style = 'block-world';

    // Parse hobbies
    const hobbyMatch = storyNorm.match(/(?:aime|adore|passion|kiffe|fan de|jouer au|faire du|faire de la)\s+(?:le |la |les |l'|du |de la |au |aux )?(.{3,30}?)(?:\.|,|$|\s+(?:et\s|avec|pour|dans|qui|elle|il|je))/);
    const hobbies = hobbyMatch?.[1]?.trim() || '';

    // Custom theme
    const customMatch = storyNorm.match(/(?:dans\s+l'?\s*)?univers?\s+(?:de\s+)?(.{3,40}?)(?:\.|,|$|\s+(?:et|avec|pour|elle|il|je|qui))/);
    const customTheme = customMatch?.[1]?.trim() || '';

    // Secondary characters
    const secondaryChars = secondary.trim() ? [{
      kind: /\b(?:chat|chien|lapin|hamster|oiseau|dragon|licorne|renard|loup|ours|tortue|poisson|cheval|poney)\b/i.test(secondary) ? 'animal' as const : 'human' as const,
      name: secondary.match(/(?:s'appelle|appele|nomme|nom(?:me)?)\s+([a-zà-ÿ]+)/i)?.[1] || secondary.split(/\s+/)[0] || '',
      ageOrType: secondary.match(/\b(chat|chien|lapin|hamster|oiseau|dragon|licorne|ami|amie|frere|soeur|cousin|voisin|cheval|poney)\b/i)?.[1] || '',
    }] : [];

    return {
      protagonistName: name.trim(),
      protagonistAge: age,
      protagonistGender: gender,
      ageRange,
      generalTheme: theme || 'stories',
      customTheme,
      specificSubject: occasion,
      centralMessage: moral,
      illustrationStyle: style,
      hobbies,
      secondaryCharacters: secondaryChars.length ? secondaryChars : undefined,
      language: 'french',
      productType: 'ebook',
      appearanceMode: photo ? 'photo' : undefined,
      photo: photo || undefined,
      specialEvents: story.trim(),
    } as Partial<StoryFormData>;
  }, [name, story, secondary, photo, formData.illustrationStyle]);

  const { percentage, color } = useCompletionScore(mergedData, !!photo);
  const heroName = name.trim().length > 15 ? name.trim().substring(0, 15) + '...' : (name.trim() || 'votre enfant');
  const heroNameFull = name.trim() || 'votre enfant';

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

  // Focus on step change
  useEffect(() => {
    if (step === 'preview') {
      setTimeout(() => previewTopRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [step]);

  // Photo
  const pickPhoto = useCallback((file: File) => {
    if (file.size > 15 * 1024 * 1024) { alert('Photo trop lourde (max 15MB)'); return; }
    if (!file.type.startsWith('image/')) { alert('Format de fichier non supporte'); return; }
    const r = new FileReader();
    r.onerror = () => { alert('Erreur lors de la lecture de la photo'); };
    r.onload = e => { setPhoto(file); setPhotoPreview(e.target?.result as string); };
    r.readAsDataURL(file);
  }, []);

  // canGo = prenom + description suffisent
  const canGo = name.trim().length >= 2 && story.trim().length >= 10;

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
        <Header>
          <Logo onClick={() => window.location.href = '/'}>Contedia</Logo>
          <div />
        </Header>

        <Body>
          <div>
            <Title>Creez <span>l'histoire unique</span> de votre enfant</Title>
            <Subtitle>Remplissez les champs, l'IA cree le livre</Subtitle>
          </div>

          {/* ── Prenom + Photo ── */}
          <FieldWrap>
            <FieldHeader>
              <FieldLabel>Prenom de l'enfant <span style={{ color: C.coral }}>*</span></FieldLabel>
              <CharCount $over={name.length > LIMITS.name}>{name.length}/{LIMITS.name}</CharCount>
            </FieldHeader>
            <FieldInput
              value={name}
              onChange={e => { if (e.target.value.length <= LIMITS.name) setName(e.target.value); }}
              placeholder="Luna, Adam, Ines..."
              maxLength={LIMITS.name}
              autoFocus
              aria-required="true"
            />
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/heic"
              style={{ display: 'none' }} aria-label="Ajouter une photo de l'enfant"
              onChange={e => { const f = e.target.files?.[0]; if (f) pickPhoto(f); e.target.value = ''; }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
              <PhotoBtn $has={!!photo} onClick={() => fileRef.current?.click()} type="button">
                {photo ? '✅' : '📷'} {photo ? 'Photo ajoutee' : 'Ajouter sa photo (optionnel)'}
              </PhotoBtn>
              {photoPreview && (
                <>
                  <img src={photoPreview} alt="Photo de l'enfant" style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'cover' }} />
                  <button onClick={() => { setPhoto(null); setPhotoPreview(null); }}
                    aria-label="Supprimer la photo"
                    style={{ background: 'none', border: 'none', color: C.danger, fontSize: 12, cursor: 'pointer', padding: '4px' }}>&#10005;</button>
                </>
              )}
            </div>
            <FieldHint><span className="icon">&#9432;</span> La photo permet de generer des illustrations qui lui ressemblent</FieldHint>
          </FieldWrap>

          {/* ── Description histoire ── */}
          <FieldWrap>
            <FieldHeader>
              <FieldLabel>Decrivez votre histoire <span style={{ color: C.coral }}>*</span></FieldLabel>
              <CharCount $over={story.length > LIMITS.story}>{story.length}/{LIMITS.story}</CharCount>
            </FieldHeader>
            <FieldTextarea
              value={story}
              onChange={e => { if (e.target.value.length <= LIMITS.story) setStory(e.target.value); }}
              placeholder="Une petite fille de 10 ans qui adore le foot, dans l'univers de Harry Potter. Style manga, sur le theme du courage..."
              maxLength={LIMITS.story}
              aria-required="true"
            />
            <FieldHint><span className="icon">&#9432;</span> Mentionnez l'age, le theme, le style d'illustration et la morale souhaitee</FieldHint>
          </FieldWrap>

          {/* ── Personnage secondaire ── */}
          <FieldWrap>
            <FieldHeader>
              <FieldLabel>Personnage secondaire <span className="opt">(optionnel)</span></FieldLabel>
              <CharCount $over={secondary.length > LIMITS.secondary}>{secondary.length}/{LIMITS.secondary}</CharCount>
            </FieldHeader>
            <FieldInput
              value={secondary}
              onChange={e => { if (e.target.value.length <= LIMITS.secondary) setSecondary(e.target.value); }}
              placeholder="Son chien Moustache, sa meilleure amie Jade..."
              maxLength={LIMITS.secondary}
            />
          </FieldWrap>

          {/* Trust */}
          <TrustRow>
            <TrustItem>&#9889; Pret en 5 min</TrustItem>
            <TrustItem>&#127873; 1er chapitre gratuit</TrustItem>
            <TrustItem>&#128274; Sans engagement</TrustItem>
          </TrustRow>
        </Body>

        <Footer>
          <FooterInner>
            <CTA $active={canGo} disabled={!canGo || isBusy} onClick={gotoPreview} aria-busy={isBusy}>
              {canGo ? `Creer le livre de ${heroName} — Gratuit` : 'Remplissez les champs ci-dessus'}
            </CTA>
            <CompletionRing percentage={percentage} color={color} />
          </FooterInner>
        </Footer>
      </PageWrap>
    );
  }

  // ═══ STEP 2 : PREVIEW ═════════════════════════════════
  const coverReady = !!coverPreview.rawBase64;
  const coverUrl = coverPreview.coverImageUrl;
  const coverError = coverPreview.error;
  const payReady = (coverReady || coverError) && (isAuthenticated || validEmail);

  return (
    <PageWrap>
      <Header>
        <Logo onClick={() => setStep('form')}>&#8592; Modifier</Logo>
        <div />
      </Header>

      <Body style={{ alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <div ref={previewTopRef} style={{ width: '100%', maxWidth: 400, flex: '1 1 0', minHeight: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <p style={{ fontFamily: "'Baloo 2', cursive", fontSize: '1rem', fontWeight: 700, textAlign: 'center', margin: '0 0 8px' }}>
            {coverError ? `Preparation du livre de ${heroNameFull}` : coverReady ? `Le livre de ${heroNameFull} est pret !` : `Creation du livre de ${heroNameFull}...`}
          </p>

          {/* Cover */}
          <div style={{ flex: '1 1 0', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 0, margin: '0 0 8px' }}>
            {coverUrl ? (
              <img src={coverUrl} alt={`Couverture du livre de ${heroNameFull}`} style={{ maxHeight: '100%', maxWidth: '70%', borderRadius: 12, objectFit: 'contain', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }} />
            ) : coverError ? (
              <div style={{ textAlign: 'center', padding: 20 }}>
                <p style={{ fontSize: '3rem', margin: '0 0 8px' }}>📖</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', margin: '0 0 12px' }}>La couverture n'a pas pu etre generee</p>
                <button onClick={() => coverPreview.generate()} style={{
                  padding: '8px 16px', borderRadius: 8, border: `1.5px solid ${C.coral}`, background: 'transparent',
                  color: C.coral, fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit',
                }}>Reessayer</button>
              </div>
            ) : (
              <div role="status" aria-label="Generation de la couverture en cours" style={{ maxHeight: '100%', aspectRatio: '3/4', borderRadius: 12, overflow: 'hidden', background: 'linear-gradient(145deg, var(--bg-card, #2E2850), var(--bg-secondary, #1C1735))', boxShadow: '0 8px 24px rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 180 }}>
                <svg viewBox="0 0 160 220" width="100%" height="100%" fill="none">
                  <rect width="160" height="220" fill="url(#sg)"><animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite" /></rect>
                  <defs><linearGradient id="sg" x1="0" y1="0" x2="160" y2="220"><stop offset="0%" stopColor="#FF9999" stopOpacity="0.08" /><stop offset="50%" stopColor="#A78BFA" stopOpacity="0.12" /><stop offset="100%" stopColor="#FF9999" stopOpacity="0.06" /></linearGradient></defs>
                  <rect x="18" y="30" width="120" height="160" rx="6" stroke="#FF9999" strokeWidth="1.5" opacity="0.25" />
                  <rect x="35" y="55" width="0" height="8" rx="4" fill="#E8A060" opacity="0.3"><animate attributeName="width" values="0;80" dur="1.5s" begin="0.5s" fill="freeze" /></rect>
                  <rect x="35" y="70" width="0" height="6" rx="3" fill="#6BA3D6" opacity="0.25"><animate attributeName="width" values="0;65" dur="1.2s" begin="1s" fill="freeze" /></rect>
                  <circle cx="120" cy="42" r="3" fill="#FFD700"><animate attributeName="opacity" values="0;0.8;0" dur="1.5s" repeatCount="indefinite" /></circle>
                  <text x="80" y="200" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9">Creation en cours...</text>
                </svg>
              </div>
            )}
          </div>

          {/* Auth */}
          {!isAuthenticated && (
            <p style={{ fontFamily: "'Baloo 2', cursive", fontSize: '0.875rem', fontWeight: 700, textAlign: 'center', margin: '0 0 8px' }}>
              Recevez le livre de {heroNameFull} gratuitement
            </p>
          )}

          <div style={{ width: '100%', flexShrink: 0 }}>
            {!isAuthenticated && !inApp && (
              <div style={{ textAlign: 'center', marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <GoogleLogin onSuccess={handleGoogle} onError={() => setGoogleError(true)} text="continue_with" shape="rectangular" size="large" />
                </div>
                {googleError && (
                  <p style={{ fontSize: 11, color: C.danger, margin: '6px 0 0', textAlign: 'center' }}>Connexion Google echouee. Utilisez votre email.</p>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '10px 0 6px' }}>
                  <div style={{ flex: 1, height: 1, background: 'var(--border-color)' }} />
                  <span style={{ fontSize: 10, color: 'var(--text-light)' }}>ou</span>
                  <div style={{ flex: 1, height: 1, background: 'var(--border-color)' }} />
                </div>
              </div>
            )}

            {isAuthenticated && currentUser && (
              <div style={{ background: 'rgba(76,175,80,0.08)', border: '1px solid rgba(76,175,80,0.2)', borderRadius: 10, padding: '8px 12px', marginBottom: 8, textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#2E7D32' }}>
                Connecte : <strong>{currentUser.email}</strong>
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
              {isBusy ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><CTASpinner /> Envoi...</span> : 'Lire mon livre gratuitement →'}
            </CTA>

            {!coverReady && !coverError ? (
              <div style={{ width: '100%', marginTop: 6 }}>
                <div style={{ height: 3, borderRadius: 2, background: 'var(--border-color)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '40%', background: 'linear-gradient(90deg, #FF9999, #FF7F7F, #FF9999)', animation: 'cs 1.5s ease-in-out infinite' }} />
                </div>
                <p style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 4, textAlign: 'center' }}>Votre couverture est en cours de creation...</p>
                <p style={{ fontSize: 9, color: 'var(--text-light)', marginTop: 1, textAlign: 'center' }}>Entrez votre email en attendant</p>
                <style>{`@keyframes cs { 0% { transform: translateX(-100%); } 100% { transform: translateX(350%); } }`}</style>
              </div>
            ) : (
              <p style={{ fontSize: 10, color: 'var(--text-light)', marginTop: 6, textAlign: 'center' }}>&#9989; Gratuit &middot; &#9889; Pret en 5 min</p>
            )}
          </div>
        </div>
      </Body>
    </PageWrap>
  );
};

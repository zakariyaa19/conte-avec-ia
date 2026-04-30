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
import { BookCoverPreview } from '../ui/BookCoverPreview';

import {
  PageWrap, Header, Logo, Body, BodyInner, Footer, FooterInner,
  HeroBlock, HeroBadge, Title, Subtitle, TrustRow, TrustItem,
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
      protagonistAge: age || '7',
      protagonistGender: gender || 'girl',
      ageRange: ageRange || '6-9',
      generalTheme: theme || 'stories',
      customTheme,
      specificSubject: occasion || theme || 'stories',
      centralMessage: moral || 'courage',
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
          <BodyInner>
            {/* Hero accueillant */}
            <HeroBlock>
              <HeroBadge>+500 histoires creees &middot; &#11088;&#11088;&#11088;&#11088;&#11088;</HeroBadge>
              <Title>Creez un <span>livre personnalise</span> pour votre enfant</Title>
              <Subtitle>Votre enfant devient le heros d'une histoire unique. Illustrations IA, pret en 5 minutes !</Subtitle>
            </HeroBlock>

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
              <PhotoBtn $has={!!photo} onClick={() => fileRef.current?.click()} type="button">
                {photo ? '✅' : '📷'} {photo ? 'Photo ajoutee' : 'Ajouter sa photo pour des illustrations personnalisees'}
              </PhotoBtn>
              {photoPreview && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'rgba(76,175,80,0.05)', borderRadius: 10 }}>
                  <img src={photoPreview} alt="Photo de l'enfant" style={{ width: 40, height: 40, borderRadius: 10, objectFit: 'cover' }} />
                  <span style={{ fontSize: '0.8rem', color: C.success, fontWeight: 500, flex: 1 }}>Les illustrations ressembleront a votre enfant</span>
                  <button onClick={() => { setPhoto(null); setPhotoPreview(null); }}
                    aria-label="Supprimer la photo"
                    style={{ background: 'none', border: 'none', color: C.danger, fontSize: 14, cursor: 'pointer', padding: '6px' }}>&#10005;</button>
                </div>
              )}
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
              <FieldHint><span className="icon">&#128161;</span> Mentionnez l'age, le theme, le style d'illustration et la morale souhaitee</FieldHint>
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
              <TrustItem>&#10003; 1er chapitre gratuit</TrustItem>
              <TrustItem>&#10003; Pret en 5 minutes</TrustItem>
              <TrustItem>&#10003; Sans carte bancaire</TrustItem>
            </TrustRow>
          </BodyInner>
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
  // Le client peut soumettre des qu'il est identifie. La cover est un bonus visuel —
  // si elle n'est pas prete, le backend la regenerera lors de la creation du livre.
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
            {coverError ? `Preparation du livre de ${heroNameFull}` : coverReady ? `Le livre de ${heroNameFull} est pret !` : `Creation du livre de ${heroNameFull}...`}
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
                <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', margin: '0 0 12px' }}>La couverture n'a pas pu etre generee</p>
                <button onClick={() => coverPreview.generate()} style={{
                  padding: '8px 16px', borderRadius: 8, border: `1.5px solid ${C.coral}`, background: 'transparent',
                  color: C.coral, fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit',
                }}>Reessayer</button>
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
              <div style={{ background: 'rgba(76,175,80,0.08)', border: '1px solid rgba(76,175,80,0.2)', borderRadius: 10, padding: '10px 14px', marginBottom: 10, textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#2E7D32' }}>
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
              {isBusy ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><CTASpinner /> Creation en cours...</span> : `Lire le livre de ${heroName} gratuitement →`}
            </CTA>

            <p style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 10, textAlign: 'center' }}>&#9989; Gratuit &middot; &#9889; Pret en 5 min</p>
          </div>
        </div>
      </Body>
    </PageWrap>
  );
};

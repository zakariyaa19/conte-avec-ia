import { useState, useRef, useCallback, useEffect } from 'react';
import { StoryFormData } from '../types/FormTypes';
import { ApiService } from '../config/api';
import { trackFunnelStep } from '../utils/funnelTracker';

interface UseCoverPreviewReturn {
  coverImageUrl: string | null;
  coverTitle: string | null;
  rawBase64: string | null;
  /** URL Cloudinary de la cover (prête pour soumission — léger, pas de base64) */
  cloudinaryUrl: string | null;
  isGenerating: boolean;
  error: string | null;
  generate: () => void;
}

// Vérifie si les champs essentiels (Phase 1) sont remplis
export function isPhase1Complete(formData: Partial<StoryFormData>): boolean {
  const baseComplete = !!(
    formData.protagonistName &&
    formData.protagonistAge &&
    formData.protagonistGender &&
    formData.generalTheme
  );
  if (!baseComplete) return false;

  // Photo mode: only need a photo
  if (formData.appearanceMode === 'photo') return !!formData.photo;
  // Manual mode: need all 3 colors
  if (formData.appearanceMode === 'manual') return !!(formData.eyeColor && formData.hairColor && formData.skinColor);
  // No appearance mode set (simplified wizard — appearance step skipped): OK, API will use defaults
  if (!formData.appearanceMode && !formData.eyeColor && !formData.hairColor && !formData.skinColor) return true;
  // Legacy orders with colors but no explicit mode
  return !!(formData.eyeColor && formData.hairColor && formData.skinColor);
}

// Convertir File en base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function useCoverPreview(formData: Partial<StoryFormData>): UseCoverPreviewReturn {
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [coverTitle, setCoverTitle] = useState<string | null>(null);
  const [rawBase64, setRawBase64] = useState<string | null>(null);
  const [cloudinaryUrl, setCloudinaryUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const generationStartRef = useRef<number | null>(null);

  // Stale generation guard: if isGenerating is true for more than 90s, reset it (gpt-image-1 can take 30-60s)
  useEffect(() => {
    if (isGenerating) {
      generationStartRef.current = Date.now();
    } else {
      generationStartRef.current = null;
    }
  }, [isGenerating]);

  useEffect(() => {
    if (!isGenerating) return;
    const check = setInterval(() => {
      if (generationStartRef.current && Date.now() - generationStartRef.current > 90_000) {
        console.warn('[useCoverPreview] Generation stale, resetting');
        setIsGenerating(false);
        setError('La génération a pris trop de temps. Réessayez.');
        abortControllerRef.current?.abort();
      }
    }, 5000);
    return () => clearInterval(check);
  }, [isGenerating]);

  const generate = useCallback(async () => {
    if (!isPhase1Complete(formData)) return;

    // Annuler la requête précédente
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsGenerating(true);
    setError(null);

    try {
      // Convertir la photo en base64 si présente
      let photoBase64: string | undefined;
      if (formData.photo) {
        try {
          photoBase64 = await fileToBase64(formData.photo);
        } catch {
          // La generation repart sans la photo (le hero ne lui ressemblera
          // pas) plutot que d'echouer entierement — mais c'etait totalement
          // silencieux avant. On le trace pour savoir si ca arrive en vrai.
          trackFunnelStep('chat_cover_photo_conversion_failed');
        }
      }

      const isManualMode = formData.appearanceMode !== 'photo';
      const formFields = {
        protagonistName: formData.protagonistName,
        protagonistAge: formData.protagonistAge,
        protagonistGender: formData.protagonistGender,
        eyeColor: isManualMode ? formData.eyeColor : undefined,
        hairColor: isManualMode ? formData.hairColor : undefined,
        skinColor: isManualMode ? formData.skinColor : undefined,
        illustrationStyle: formData.illustrationStyle || 'illustrated-book',
        generalTheme: formData.generalTheme,
        customTheme: formData.customTheme,
        specificSubject: formData.specificSubject,
        customSubject: formData.customSubject,
        centralMessage: formData.centralMessage,
        customMessage: formData.customMessage,
        ageRange: formData.ageRange,
        hobbies: formData.hobbies,
        specialEvents: formData.specialEvents,
      };

      // Explicit 60s timeout — don't rely on browser defaults
      const timeoutId = setTimeout(() => controller.abort(), 90000);
      const result = await ApiService.generateCoverPreview(
        { formData: formFields, photoBase64 },
        controller.signal
      );
      clearTimeout(timeoutId);

      // Vérifier que la requête n'a pas été annulée
      if (controller.signal.aborted) return;

      if (result.success && result.data) {
        const base64 = result.data.imageBase64;
        setCoverImageUrl(`data:image/png;base64,${base64}`);
        setRawBase64(base64);
        setCoverTitle(result.data.title || null);
        setError(null);

        // Upload immédiat sur Cloudinary en background (fire-and-forget)
        // Le formulaire enverra l'URL Cloudinary au lieu du base64 (quelques octets vs 20MB)
        ApiService.uploadCoverToCloud(base64)
          .then(res => {
            if (res.success && res.url) {
              setCloudinaryUrl(res.url);
              console.log('[Cover] Cloudinary upload OK:', res.url);
            } else {
              console.warn('[Cover] Cloudinary upload failed, fallback base64');
            }
          })
          .catch(err => console.warn('[Cover] Cloudinary upload error, fallback base64:', err));
      } else {
        setError(result.message || 'Erreur de génération');
      }
    } catch (err: any) {
      if (err?.name === 'AbortError') return;
      console.error('Erreur cover preview:', err);
      setError('Impossible de générer l\'aperçu');
    } finally {
      if (!controller.signal.aborted) {
        setIsGenerating(false);
      }
    }
  }, [formData]);

  return {
    coverImageUrl,
    coverTitle,
    rawBase64,
    cloudinaryUrl,
    isGenerating,
    error,
    generate,
  };
}

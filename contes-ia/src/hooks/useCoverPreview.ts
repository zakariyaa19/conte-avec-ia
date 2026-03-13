import { useState, useRef, useCallback, useEffect } from 'react';
import { StoryFormData } from '../types/FormTypes';
import { ApiService } from '../config/api';

interface UseCoverPreviewReturn {
  coverImageUrl: string | null;
  coverTitle: string | null;
  rawBase64: string | null;
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
  // Manual mode (or legacy orders with colors): need all 3 colors
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const generationStartRef = useRef<number | null>(null);

  // Stale generation guard: if isGenerating is true for more than 90s, reset it
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
          // Ignorer l'erreur de conversion photo
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

      const result = await ApiService.generateCoverPreview(
        { formData: formFields, photoBase64 },
        controller.signal
      );

      // Vérifier que la requête n'a pas été annulée
      if (controller.signal.aborted) return;

      if (result.success && result.data) {
        setCoverImageUrl(`data:image/png;base64,${result.data.imageBase64}`);
        setRawBase64(result.data.imageBase64);
        setCoverTitle(result.data.title || null);
        setError(null);
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
    isGenerating,
    error,
    generate,
  };
}

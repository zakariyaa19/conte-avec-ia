import { useState, useEffect, useRef, useCallback } from 'react';
import { StoryFormData } from '../types/FormTypes';
import { ApiService } from '../config/api';

interface UseCoverPreviewReturn {
  coverImageUrl: string | null;
  isGenerating: boolean;
  error: string | null;
  regenerate: () => void;
}

// Hash simple des champs pertinents (pas besoin de crypto cote frontend)
function computeFormHash(formData: Partial<StoryFormData>): string {
  const relevantFields = [
    formData.illustrationStyle || '',
    formData.generalTheme || '',
    formData.specificSubject || '',
    formData.centralMessage || '',
    formData.protagonistName || '',
    formData.protagonistAge || '',
    formData.protagonistGender || '',
    formData.eyeColor || '',
    formData.hairColor || '',
    formData.photo?.name || 'no-photo',
  ].join('|');

  let hash = 0;
  for (let i = 0; i < relevantFields.length; i++) {
    const char = relevantFields.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash.toString(36);
}

// Verifie si tous les champs protagoniste sont remplis
function isProtagonistComplete(formData: Partial<StoryFormData>): boolean {
  return !!(
    formData.protagonistName &&
    formData.protagonistAge &&
    formData.protagonistGender &&
    formData.eyeColor &&
    formData.hairColor &&
    formData.illustrationStyle &&
    formData.generalTheme &&
    formData.specificSubject
  );
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lastGeneratedHashRef = useRef<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const forceRegenerateRef = useRef(false);

  const generate = useCallback(async () => {
    if (!isProtagonistComplete(formData)) return;

    const currentHash = computeFormHash(formData);

    // Ne pas regenerer si le hash n'a pas change (sauf si force)
    if (currentHash === lastGeneratedHashRef.current && !forceRegenerateRef.current) return;
    forceRegenerateRef.current = false;

    // Annuler la requete precedente
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsGenerating(true);
    setError(null);

    try {
      // Convertir la photo en base64 si presente
      let photoBase64: string | undefined;
      if (formData.photo) {
        try {
          photoBase64 = await fileToBase64(formData.photo);
        } catch {
          // Ignorer l'erreur de conversion photo
        }
      }

      const formFields = {
        protagonistName: formData.protagonistName,
        protagonistAge: formData.protagonistAge,
        protagonistGender: formData.protagonistGender,
        eyeColor: formData.eyeColor,
        hairColor: formData.hairColor,
        illustrationStyle: formData.illustrationStyle,
        generalTheme: formData.generalTheme,
        specificSubject: formData.specificSubject,
        centralMessage: formData.centralMessage,
        ageRange: formData.ageRange,
      };

      const result = await ApiService.generateCoverPreview(
        { formData: formFields, photoBase64 },
        controller.signal
      );

      // Verifier que la requete n'a pas ete annulee
      if (controller.signal.aborted) return;

      if (result.success && result.data) {
        setCoverImageUrl(`data:image/png;base64,${result.data.imageBase64}`);
        lastGeneratedHashRef.current = currentHash;
        setError(null);
      } else {
        setError(result.message || 'Erreur de generation');
      }
    } catch (err: any) {
      if (err?.name === 'AbortError') return;
      console.error('Erreur cover preview:', err);
      setError('Impossible de generer l\'apercu');
    } finally {
      if (!controller.signal.aborted) {
        setIsGenerating(false);
      }
    }
  }, [formData]);

  // Debounce : attendre 500ms apres le dernier changement
  useEffect(() => {
    if (!isProtagonistComplete(formData)) return;

    const currentHash = computeFormHash(formData);
    if (currentHash === lastGeneratedHashRef.current && !forceRegenerateRef.current) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      generate();
    }, 500);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [
    formData.illustrationStyle,
    formData.generalTheme,
    formData.specificSubject,
    formData.centralMessage,
    formData.protagonistName,
    formData.protagonistAge,
    formData.protagonistGender,
    formData.eyeColor,
    formData.hairColor,
    formData.photo,
    generate
  ]);

  // Cleanup a l'unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const regenerate = useCallback(() => {
    forceRegenerateRef.current = true;
    lastGeneratedHashRef.current = null;
    setCoverImageUrl(null);
    generate();
  }, [generate]);

  return {
    coverImageUrl,
    isGenerating,
    error,
    regenerate,
  };
}

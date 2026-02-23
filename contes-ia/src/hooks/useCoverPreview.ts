import { useState, useRef, useCallback } from 'react';
import { StoryFormData } from '../types/FormTypes';
import { ApiService } from '../config/api';

interface UseCoverPreviewReturn {
  coverImageUrl: string | null;
  coverTitle: string | null;
  isGenerating: boolean;
  error: string | null;
  generate: () => void;
}

// Vérifie si les champs essentiels (Phase 1) sont remplis
export function isPhase1Complete(formData: Partial<StoryFormData>): boolean {
  return !!(
    formData.protagonistName &&
    formData.protagonistAge &&
    formData.protagonistGender &&
    formData.eyeColor &&
    formData.hairColor &&
    formData.skinColor &&
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
  const [coverTitle, setCoverTitle] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

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

      const formFields = {
        protagonistName: formData.protagonistName,
        protagonistAge: formData.protagonistAge,
        protagonistGender: formData.protagonistGender,
        eyeColor: formData.eyeColor,
        hairColor: formData.hairColor,
        skinColor: formData.skinColor,
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

      // Vérifier que la requête n'a pas été annulée
      if (controller.signal.aborted) return;

      if (result.success && result.data) {
        setCoverImageUrl(`data:image/png;base64,${result.data.imageBase64}`);
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
    isGenerating,
    error,
    generate,
  };
}

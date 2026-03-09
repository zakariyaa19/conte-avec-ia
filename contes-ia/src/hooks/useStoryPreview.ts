import { useState, useRef, useCallback, useEffect } from 'react';
import { StoryFormData } from '../types/FormTypes';
import { ApiService } from '../config/api';
import { isPhase1Complete } from './useCoverPreview';

interface UseStoryPreviewReturn {
  previewTitle: string | null;
  previewParagraphs: string[] | null;
  isGenerating: boolean;
  error: string | null;
  generate: () => void;
}

export function useStoryPreview(formData: Partial<StoryFormData>): UseStoryPreviewReturn {
  const [previewTitle, setPreviewTitle] = useState<string | null>(null);
  const [previewParagraphs, setPreviewParagraphs] = useState<string[] | null>(null);
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
        console.warn('[useStoryPreview] Generation stale, resetting');
        setIsGenerating(false);
        setError('La génération a pris trop de temps. Réessayez.');
        abortControllerRef.current?.abort();
      }
    }, 5000);
    return () => clearInterval(check);
  }, [isGenerating]);

  const generate = useCallback(async () => {
    if (!isPhase1Complete(formData)) return;

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsGenerating(true);
    setError(null);

    try {
      const formFields: Record<string, any> = {
        protagonistName: formData.protagonistName,
        protagonistAge: formData.protagonistAge,
        protagonistGender: formData.protagonistGender,
        illustrationStyle: formData.illustrationStyle,
        generalTheme: formData.generalTheme,
        customTheme: formData.customTheme,
        specificSubject: formData.specificSubject,
        customSubject: formData.customSubject,
        centralMessage: formData.centralMessage,
        customMessage: formData.customMessage,
        ageRange: formData.ageRange,
        hobbies: formData.hobbies,
        favoriteDish: formData.favoriteDish,
        specialEvents: formData.specialEvents,
        language: formData.language,
        creatorName: formData.creatorName,
      };

      // Serialize secondary characters if present
      if (formData.secondaryCharacters && formData.secondaryCharacters.length > 0) {
        formFields.secondaryCharactersJson = JSON.stringify(formData.secondaryCharacters);
      }

      const result = await ApiService.generateStoryPreview(
        { formData: formFields },
        controller.signal
      );

      if (controller.signal.aborted) return;

      if (result.success && result.data) {
        setPreviewTitle(result.data.title);
        setPreviewParagraphs(result.data.paragraphs);
        setError(null);
      } else {
        setError(result.message || 'Erreur de generation');
      }
    } catch (err: any) {
      if (err?.name === 'AbortError') return;
      console.error('Erreur story preview:', err);
      setError('Impossible de generer l\'apercu');
    } finally {
      if (!controller.signal.aborted) {
        setIsGenerating(false);
      }
    }
  }, [formData]);

  return {
    previewTitle,
    previewParagraphs,
    isGenerating,
    error,
    generate,
  };
}

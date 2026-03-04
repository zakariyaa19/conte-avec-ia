import { useState, useRef, useCallback } from 'react';
import { StoryFormData } from '../types/FormTypes';
import { ApiService } from '../config/api';

interface UseFirstIllustrationReturn {
  illustrationUrl: string | null;
  illustrationBase64: string | null;
  isGenerating: boolean;
  error: string | null;
  generate: (paragraph0: string, coverBase64?: string) => void;
}

export function useFirstIllustration(formData: Partial<StoryFormData>): UseFirstIllustrationReturn {
  const [illustrationUrl, setIllustrationUrl] = useState<string | null>(null);
  const [illustrationBase64, setIllustrationBase64] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const generate = useCallback(async (paragraph0: string, coverBase64?: string) => {
    if (!formData.protagonistName || !formData.illustrationStyle) return;

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
        eyeColor: formData.eyeColor,
        hairColor: formData.hairColor,
        skinColor: formData.skinColor,
        hobbies: formData.hobbies,
        specialEvents: formData.specialEvents,
      };

      if (formData.secondaryCharacters && formData.secondaryCharacters.length > 0) {
        formFields.secondaryCharactersJson = JSON.stringify(formData.secondaryCharacters);
      }

      const result = await ApiService.generateFirstIllustration(
        { formData: formFields, paragraph: paragraph0, coverImageBase64: coverBase64 },
        controller.signal
      );

      if (controller.signal.aborted) return;

      if (result.success && result.data) {
        setIllustrationUrl(result.data.illustrationUrl);
        setIllustrationBase64(result.data.illustrationBase64);
        setError(null);
      } else {
        setError(result.message || 'Erreur de generation');
      }
    } catch (err: any) {
      if (err?.name === 'AbortError') return;
      console.error('Erreur illustration preview:', err);
      setError('Impossible de generer l\'illustration');
    } finally {
      if (!controller.signal.aborted) {
        setIsGenerating(false);
      }
    }
  }, [formData]);

  return {
    illustrationUrl,
    illustrationBase64,
    isGenerating,
    error,
    generate,
  };
}

import { useState, useEffect, useRef, useCallback } from 'react';
import { extractAllFields, DetectedField } from './fieldDetectionRules';
import { StoryFormData } from '../../types/FormTypes';

const DEBOUNCE_MS = 300;

interface ParseResult {
  extractedData: Partial<StoryFormData>;
  detectedFields: DetectedField[];
}

export function useTextParser(rawText: string): ParseResult {
  const [result, setResult] = useState<ParseResult>({
    extractedData: {},
    detectedFields: [],
  });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (!rawText.trim()) {
      setResult({ extractedData: {}, detectedFields: [] });
      return;
    }

    timerRef.current = setTimeout(() => {
      const { data, detectedFields } = extractAllFields(rawText);
      setResult({
        extractedData: data as Partial<StoryFormData>,
        detectedFields,
      });
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [rawText]);

  return result;
}

// Hook pour gerer les overrides manuels (quand l'utilisateur clique un chip pour editer)
export function useFieldOverrides() {
  const [overrides, setOverrides] = useState<Partial<StoryFormData>>({});

  const setOverride = useCallback((field: string, value: any) => {
    setOverrides(prev => ({ ...prev, [field]: value }));
  }, []);

  const clearOverride = useCallback((field: string) => {
    setOverrides(prev => {
      const next = { ...prev };
      delete (next as any)[field];
      return next;
    });
  }, []);

  return { overrides, setOverride, clearOverride };
}

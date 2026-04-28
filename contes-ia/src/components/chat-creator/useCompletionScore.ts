import { useMemo } from 'react';
import { StoryFormData } from '../../types/FormTypes';
import { FIELD_WEIGHTS, MAX_SCORE, REQUIRED_FIELDS, MIN_SUBMIT_SCORE, getScoreColor, getScoreLabel } from './scoringConfig';

interface CompletionResult {
  score: number;         // 0-100
  percentage: number;    // 0-100
  color: string;         // hex color
  label: string;         // texte indicatif
  canSubmit: boolean;    // true si score suffisant ET champs requis remplis
  missingRequired: string[];
  missingOptional: string[];
}

export function useCompletionScore(data: Partial<StoryFormData>, hasPhoto: boolean): CompletionResult {
  return useMemo(() => {
    let score = 0;
    const missingRequired: string[] = [];
    const missingOptional: string[] = [];

    for (const [field, weight] of Object.entries(FIELD_WEIGHTS)) {
      let filled = false;

      if (field === 'photo') {
        filled = hasPhoto;
      } else if (field === 'secondaryCharacters') {
        filled = Array.isArray((data as any).secondaryCharacters) && (data as any).secondaryCharacters.length > 0;
      } else {
        const value = (data as any)[field];
        filled = value !== undefined && value !== null && value !== '';
      }

      if (filled) {
        score += weight;
      } else {
        const isReq = (REQUIRED_FIELDS as readonly string[]).includes(field);
        if (isReq) {
          missingRequired.push(field);
        } else {
          missingOptional.push(field);
        }
      }
    }

    const percentage = Math.round((score / MAX_SCORE) * 100);
    const allRequiredFilled = missingRequired.length === 0;
    const canSubmit = percentage >= MIN_SUBMIT_SCORE && allRequiredFilled;

    return {
      score,
      percentage,
      color: getScoreColor(percentage),
      label: getScoreLabel(percentage),
      canSubmit,
      missingRequired,
      missingOptional,
    };
  }, [data, hasPhoto]);
}

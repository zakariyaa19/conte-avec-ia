/* ══════════════════════════════════════════════
   SVG ENGINE — Constants & Configs
   ══════════════════════════════════════════════ */

export const SVG = {
  STROKE_WIDTH: 2.5,
  VIEW_BOX: '0 0 120 120',
  LINECAP: 'round' as const,
  LINEJOIN: 'round' as const,
};

/** Labels + mini icons for segmented progress bar */
export const STEP_CONFIG: Record<string, { label: string; icon: string }> = {
  age:        { label: 'Âge',         icon: 'M60 30 A30 30 0 1 1 60 90' },
  theme:      { label: 'Univers',     icon: 'M30 80 L60 30 L90 80 Z' },
  occasion:   { label: 'Occasion',    icon: 'M60 30 L70 55 L95 55 L75 70 L82 95 L60 80 L38 95 L45 70 L25 55 L50 55 Z' },
  style:      { label: 'Style',       icon: 'M30 70 Q45 30 60 70 Q75 30 90 70' },
  hero:       { label: 'Héros',       icon: 'M60 35 A15 15 0 1 0 60 65 M40 85 A25 15 0 0 1 80 85' },
  appearance: { label: 'Apparence',   icon: 'M40 60 A20 20 0 1 1 80 60' },
  choice:     { label: 'Choix',       icon: 'M45 60 L55 70 L75 45' },
  extras1:    { label: 'Message',     icon: 'M35 80 L35 40 L85 40 L85 80 Z M35 40 L60 60 L85 40' },
  extras2:    { label: 'Détails',     icon: 'M40 40 L80 40 M40 55 L80 55 M40 70 L70 70' },
};

/** Recommended universes by age range */
export const AGE_THEME_RECOMMENDATIONS: Record<string, string[]> = {
  '0-2': ['fairy-tales', 'activities'],
  '3-5': ['fairy-tales', 'educational', 'activities'],
  '6-9': ['educational', 'stories', 'celebrations'],
  '10+': ['stories', 'educational', 'family'],
};

/** Popular illustration styles (shown with badge) */
export const POPULAR_STYLES = ['watercolor', '3d-animation'];

// Configuration des palettes et traitements visuels pour la couverture

export interface CoverPalette {
  primary: string;
  secondary: string;
  accent: string;
  textColor: string;
  decorations: string[];
}

export interface StyleTreatment {
  backgroundExtra: string;
  titleStyle: string;
  borderRadius: string;
  decorationStyle: string;
}

// --- Palettes par occasion ---

const OCCASION_PALETTES: Record<string, CoverPalette> = {
  'birthday': {
    primary: '#FFE5EC', secondary: '#FFF0DB', accent: '#FF6B9D',
    textColor: '#8B2252', decorations: ['🎂', '🎈', '🎁', '⭐', '🎉'],
  },
  'christmas': {
    primary: '#E8F5E9', secondary: '#FFF8E1', accent: '#C62828',
    textColor: '#1B5E20', decorations: ['🎄', '⭐', '🎅', '❄️', '🎁'],
  },
  'new-year': {
    primary: '#E3F2FD', secondary: '#F3E5F5', accent: '#FFD700',
    textColor: '#1A237E', decorations: ['🎆', '✨', '🌟', '🎊', '🥂'],
  },
  'easter': {
    primary: '#F3E5F5', secondary: '#E8F5E9', accent: '#AB47BC',
    textColor: '#4A148C', decorations: ['🐣', '🌸', '🥚', '🐰', '🌷'],
  },
  'eid': {
    primary: '#E0F2F1', secondary: '#FFF8E1', accent: '#00897B',
    textColor: '#004D40', decorations: ['🌙', '⭐', '✨', '🕌', '🎁'],
  },
  'mothers-day': {
    primary: '#FCE4EC', secondary: '#FFF3E0', accent: '#E91E63',
    textColor: '#880E4F', decorations: ['💐', '❤️', '🌹', '💝', '🌸'],
  },
  'fathers-day': {
    primary: '#E3F2FD', secondary: '#E8EAF6', accent: '#1565C0',
    textColor: '#0D47A1', decorations: ['⭐', '🏆', '💙', '🎁', '👔'],
  },
};

// --- Palettes par theme ---

const THEME_PALETTES: Record<string, CoverPalette> = {
  'educational': {
    primary: '#E8F5E9', secondary: '#E3F2FD', accent: '#43A047',
    textColor: '#1B5E20', decorations: ['📚', '🌟', '✏️', '🔬', '🌈'],
  },
  'fairy-tales': {
    primary: '#F3E5F5', secondary: '#FCE4EC', accent: '#AB47BC',
    textColor: '#4A148C', decorations: ['🧚', '✨', '🏰', '🦄', '🌟'],
  },
  'activities': {
    primary: '#FFF8E1', secondary: '#E0F7FA', accent: '#FFB300',
    textColor: '#F57F17', decorations: ['🎨', '⚽', '🎵', '🌈', '⭐'],
  },
  'stories': {
    primary: '#FEFCF8', secondary: '#FFF0DB', accent: '#FF9999',
    textColor: '#5D4037', decorations: ['📖', '✨', '🌙', '⭐', '🔮'],
  },
  'celebrations': {
    primary: '#FFF3E0', secondary: '#FCE4EC', accent: '#FF7043',
    textColor: '#BF360C', decorations: ['🎉', '🎊', '🎈', '⭐', '🎁'],
  },
  'family': {
    primary: '#FFF8E1', secondary: '#FFEBEE', accent: '#FF8A65',
    textColor: '#4E342E', decorations: ['❤️', '🏠', '⭐', '🌈', '🌻'],
  },
};

const DEFAULT_PALETTE: CoverPalette = {
  primary: '#FEFCF8', secondary: '#FFF0E6', accent: '#FF9999',
  textColor: '#2C2C2C', decorations: ['✨', '⭐', '📖', '🌟', '❤️'],
};

export function getCoverPalette(specificSubject?: string, generalTheme?: string): CoverPalette {
  if (specificSubject && OCCASION_PALETTES[specificSubject]) {
    return OCCASION_PALETTES[specificSubject];
  }
  if (generalTheme && THEME_PALETTES[generalTheme]) {
    return THEME_PALETTES[generalTheme];
  }
  return DEFAULT_PALETTE;
}

// --- Traitements visuels par style d'illustration ---

const STYLE_TREATMENTS: Record<string, StyleTreatment> = {
  'watercolor': {
    backgroundExtra: `
      radial-gradient(ellipse at 20% 50%, rgba(255,182,193,0.25) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 20%, rgba(173,216,230,0.25) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 80%, rgba(255,228,181,0.25) 0%, transparent 50%)
    `,
    titleStyle: 'font-style: italic; text-shadow: 0 2px 8px rgba(0,0,0,0.08);',
    borderRadius: '20px',
    decorationStyle: 'opacity: 0.5; filter: blur(0.5px);',
  },
  '3d-animation': {
    backgroundExtra: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%)',
    titleStyle: 'text-shadow: 2px 3px 6px rgba(0,0,0,0.15); font-weight: 800;',
    borderRadius: '16px',
    decorationStyle: 'filter: drop-shadow(2px 3px 2px rgba(0,0,0,0.2));',
  },
  'block-world': {
    backgroundExtra: `
      repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(0,0,0,0.03) 20px, rgba(0,0,0,0.03) 21px),
      repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(0,0,0,0.03) 20px, rgba(0,0,0,0.03) 21px)
    `,
    titleStyle: 'font-weight: 900; letter-spacing: 0.05em; text-transform: uppercase; font-size: 0.9em;',
    borderRadius: '8px',
    decorationStyle: 'font-size: 1.2em;',
  },
  'paper-cut': {
    backgroundExtra: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.02) 100%)',
    titleStyle: 'text-shadow: 1px 1px 0 rgba(0,0,0,0.1); font-weight: 700;',
    borderRadius: '16px',
    decorationStyle: 'filter: drop-shadow(1px 2px 0 rgba(0,0,0,0.15));',
  },
  'clay-animation': {
    backgroundExtra: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.5) 0%, transparent 40%)',
    titleStyle: 'text-shadow: 2px 3px 0 rgba(0,0,0,0.12); font-weight: 800;',
    borderRadius: '24px',
    decorationStyle: 'filter: saturate(1.3); transform: rotate(-3deg);',
  },
  'kawaii': {
    backgroundExtra: `
      radial-gradient(circle at 15% 15%, rgba(255,182,193,0.3) 0%, transparent 30%),
      radial-gradient(circle at 85% 85%, rgba(173,216,230,0.3) 0%, transparent 30%)
    `,
    titleStyle: 'font-weight: 700;',
    borderRadius: '28px',
    decorationStyle: 'font-size: 1.1em;',
  },
  'geometric': {
    backgroundExtra: `
      linear-gradient(60deg, rgba(0,0,0,0.02) 25%, transparent 25%),
      linear-gradient(-60deg, rgba(0,0,0,0.02) 25%, transparent 25%)
    `,
    titleStyle: 'font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; font-size: 0.85em;',
    borderRadius: '4px',
    decorationStyle: 'opacity: 0.7;',
  },
  'illustrated-book': {
    backgroundExtra: 'none',
    titleStyle: 'font-style: italic; font-weight: 600; text-shadow: 0 1px 4px rgba(0,0,0,0.06);',
    borderRadius: '16px',
    decorationStyle: 'opacity: 0.8;',
  },
  'japanese-manga': {
    backgroundExtra: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.015) 10px, rgba(0,0,0,0.015) 11px)',
    titleStyle: 'font-weight: 900; letter-spacing: -0.02em; text-shadow: 2px 2px 0 rgba(0,0,0,0.08);',
    borderRadius: '6px',
    decorationStyle: 'filter: contrast(1.2); font-size: 1.1em;',
  },
};

const DEFAULT_TREATMENT: StyleTreatment = {
  backgroundExtra: 'none',
  titleStyle: '',
  borderRadius: '16px',
  decorationStyle: '',
};

export function getStyleTreatment(illustrationStyle?: string): StyleTreatment {
  if (illustrationStyle && STYLE_TREATMENTS[illustrationStyle]) {
    return STYLE_TREATMENTS[illustrationStyle];
  }
  return DEFAULT_TREATMENT;
}

/* ══════════════════════════════════════════════
   SVG TOKEN MAP — ~35 inline SVG tokens
   Each token = { elements: SvgElement[] }
   viewBox 0 0 120 120 — monochrome + 1 accent
   ══════════════════════════════════════════════ */

export interface SvgElement {
  type: 'path' | 'circle' | 'rect' | 'ellipse' | 'line';
  attrs: Record<string, string | number>;
}

export interface SvgToken {
  elements: SvgElement[];
}

const C = '#FF9999'; // coral accent
const S = '#5A4A42'; // secondary text

export const SVG_TOKENS: Record<string, SvgToken> = {
  /* ── AGE ── */
  age_0_2: {
    elements: [
      { type: 'circle', attrs: { cx: 60, cy: 48, r: 22, fill: 'none', stroke: S, strokeWidth: 2.5 } },
      { type: 'circle', attrs: { cx: 52, cy: 44, r: 3, fill: S } },
      { type: 'circle', attrs: { cx: 68, cy: 44, r: 3, fill: S } },
      { type: 'path', attrs: { d: 'M50 54 Q60 62 70 54', fill: 'none', stroke: S, strokeWidth: 2 } },
      { type: 'path', attrs: { d: 'M42 30 Q60 14 78 30', fill: 'none', stroke: C, strokeWidth: 2.5 } },
      { type: 'circle', attrs: { cx: 60, cy: 88, r: 8, fill: `${C}30` } },
      { type: 'path', attrs: { d: 'M52 88 L60 80 L68 88', fill: 'none', stroke: C, strokeWidth: 2 } },
    ],
  },
  age_3_5: {
    elements: [
      { type: 'circle', attrs: { cx: 60, cy: 46, r: 20, fill: 'none', stroke: S, strokeWidth: 2.5 } },
      { type: 'circle', attrs: { cx: 53, cy: 42, r: 2.5, fill: S } },
      { type: 'circle', attrs: { cx: 67, cy: 42, r: 2.5, fill: S } },
      { type: 'path', attrs: { d: 'M52 52 Q60 59 68 52', fill: 'none', stroke: S, strokeWidth: 2 } },
      { type: 'path', attrs: { d: 'M40 30 Q50 18 60 24 Q70 18 80 30', fill: 'none', stroke: C, strokeWidth: 2.5 } },
      { type: 'rect', attrs: { x: 44, y: 74, width: 32, height: 22, rx: 6, fill: 'none', stroke: S, strokeWidth: 2 } },
      { type: 'path', attrs: { d: 'M50 80 L56 86 L70 74', fill: 'none', stroke: C, strokeWidth: 2.5 } },
    ],
  },
  age_6_9: {
    elements: [
      { type: 'circle', attrs: { cx: 60, cy: 44, r: 18, fill: 'none', stroke: S, strokeWidth: 2.5 } },
      { type: 'circle', attrs: { cx: 54, cy: 40, r: 2, fill: S } },
      { type: 'circle', attrs: { cx: 66, cy: 40, r: 2, fill: S } },
      { type: 'path', attrs: { d: 'M54 50 Q60 55 66 50', fill: 'none', stroke: S, strokeWidth: 2 } },
      { type: 'path', attrs: { d: 'M42 30 Q52 16 60 22 Q68 16 78 30', fill: 'none', stroke: C, strokeWidth: 2.5 } },
      { type: 'path', attrs: { d: 'M38 72 L60 90 L82 72', fill: 'none', stroke: S, strokeWidth: 2 } },
      { type: 'path', attrs: { d: 'M42 80 L60 94 L78 80', fill: `${C}20`, stroke: 'none' } },
      { type: 'circle', attrs: { cx: 82, cy: 72, r: 6, fill: C } },
    ],
  },
  age_10_plus: {
    elements: [
      { type: 'circle', attrs: { cx: 60, cy: 42, r: 17, fill: 'none', stroke: S, strokeWidth: 2.5 } },
      { type: 'circle', attrs: { cx: 54, cy: 39, r: 2, fill: S } },
      { type: 'circle', attrs: { cx: 66, cy: 39, r: 2, fill: S } },
      { type: 'path', attrs: { d: 'M55 48 L65 48', fill: 'none', stroke: S, strokeWidth: 2 } },
      { type: 'path', attrs: { d: 'M44 28 Q52 14 60 20 Q68 14 76 28', fill: 'none', stroke: C, strokeWidth: 2.5 } },
      { type: 'rect', attrs: { x: 38, y: 68, width: 44, height: 28, rx: 4, fill: 'none', stroke: S, strokeWidth: 2 } },
      { type: 'path', attrs: { d: 'M46 76 L74 76 M46 82 L66 82 M46 88 L70 88', fill: 'none', stroke: `${S}60`, strokeWidth: 1.5 } },
      { type: 'circle', attrs: { cx: 76, cy: 68, r: 8, fill: C } },
      { type: 'path', attrs: { d: 'M73 68 L76 71 L80 65', fill: 'none', stroke: '#fff', strokeWidth: 2 } },
    ],
  },

  /* ── THEMES / UNIVERS ── */
  theme_educational: {
    elements: [
      { type: 'rect', attrs: { x: 30, y: 25, width: 60, height: 70, rx: 6, fill: 'none', stroke: S, strokeWidth: 2.5 } },
      { type: 'path', attrs: { d: 'M40 45 L80 45 M40 55 L75 55 M40 65 L70 65', fill: 'none', stroke: `${S}50`, strokeWidth: 2 } },
      { type: 'circle', attrs: { cx: 55, cy: 34, r: 5, fill: C } },
      { type: 'path', attrs: { d: 'M60 80 L72 80 L72 92 L60 92 Z', fill: `${C}30`, stroke: C, strokeWidth: 1.5 } },
    ],
  },
  theme_fairy_tales: {
    elements: [
      { type: 'path', attrs: { d: 'M60 20 L65 40 L85 40 L68 52 L75 72 L60 60 L45 72 L52 52 L35 40 L55 40 Z', fill: 'none', stroke: C, strokeWidth: 2.5 } },
      { type: 'circle', attrs: { cx: 60, cy: 46, r: 8, fill: `${C}25` } },
      { type: 'path', attrs: { d: 'M40 82 Q60 96 80 82', fill: 'none', stroke: S, strokeWidth: 2 } },
      { type: 'circle', attrs: { cx: 40, cy: 82, r: 3, fill: C } },
      { type: 'circle', attrs: { cx: 80, cy: 82, r: 3, fill: C } },
    ],
  },
  theme_activities: {
    elements: [
      { type: 'circle', attrs: { cx: 60, cy: 55, r: 28, fill: 'none', stroke: S, strokeWidth: 2.5 } },
      { type: 'path', attrs: { d: 'M60 35 L60 55 L75 55', fill: 'none', stroke: C, strokeWidth: 2.5 } },
      { type: 'circle', attrs: { cx: 60, cy: 55, r: 4, fill: C } },
      { type: 'path', attrs: { d: 'M45 88 L60 98 L75 88', fill: 'none', stroke: S, strokeWidth: 2 } },
    ],
  },
  theme_stories: {
    elements: [
      { type: 'path', attrs: { d: 'M30 30 L30 90 Q60 78 60 90 Q60 78 90 90 L90 30 Q60 42 60 30 Q60 42 30 30 Z', fill: 'none', stroke: S, strokeWidth: 2.5 } },
      { type: 'path', attrs: { d: 'M60 30 L60 90', fill: 'none', stroke: S, strokeWidth: 1.5 } },
      { type: 'path', attrs: { d: 'M38 48 L55 48 M38 56 L52 56 M38 64 L50 64', fill: 'none', stroke: `${S}50`, strokeWidth: 1.5 } },
      { type: 'circle', attrs: { cx: 75, cy: 55, r: 8, fill: `${C}30` } },
    ],
  },
  theme_celebrations: {
    elements: [
      { type: 'rect', attrs: { x: 40, y: 50, width: 40, height: 35, rx: 4, fill: 'none', stroke: C, strokeWidth: 2.5 } },
      { type: 'path', attrs: { d: 'M35 50 L60 30 L85 50', fill: 'none', stroke: C, strokeWidth: 2.5 } },
      { type: 'rect', attrs: { x: 56, y: 65, width: 8, height: 20, rx: 1, fill: `${C}40` } },
      { type: 'circle', attrs: { cx: 45, cy: 25, r: 5, fill: C } },
      { type: 'circle', attrs: { cx: 75, cy: 20, r: 4, fill: `${C}60` } },
      { type: 'circle', attrs: { cx: 60, cy: 15, r: 3, fill: `${C}40` } },
    ],
  },
  theme_family: {
    elements: [
      { type: 'circle', attrs: { cx: 45, cy: 40, r: 12, fill: 'none', stroke: S, strokeWidth: 2.5 } },
      { type: 'circle', attrs: { cx: 75, cy: 40, r: 12, fill: 'none', stroke: S, strokeWidth: 2.5 } },
      { type: 'circle', attrs: { cx: 60, cy: 70, r: 10, fill: 'none', stroke: C, strokeWidth: 2.5 } },
      { type: 'path', attrs: { d: 'M50 50 L55 62', fill: 'none', stroke: S, strokeWidth: 2 } },
      { type: 'path', attrs: { d: 'M70 50 L65 62', fill: 'none', stroke: S, strokeWidth: 2 } },
      { type: 'path', attrs: { d: 'M55 88 Q60 94 65 88', fill: 'none', stroke: C, strokeWidth: 2 } },
    ],
  },
  theme_custom: {
    elements: [
      { type: 'circle', attrs: { cx: 60, cy: 50, r: 30, fill: 'none', stroke: S, strokeWidth: 2.5, strokeDasharray: '6 4' } },
      { type: 'path', attrs: { d: 'M50 50 L70 50 M60 40 L60 60', fill: 'none', stroke: C, strokeWidth: 3 } },
      { type: 'path', attrs: { d: 'M44 88 Q60 96 76 88', fill: 'none', stroke: S, strokeWidth: 2 } },
    ],
  },

  /* ── OCCASIONS ── */
  occasion_birthday: {
    elements: [
      { type: 'rect', attrs: { x: 35, y: 50, width: 50, height: 35, rx: 6, fill: `${C}20`, stroke: S, strokeWidth: 2.5 } },
      { type: 'path', attrs: { d: 'M55 50 L55 35 M60 50 L60 32 M65 50 L65 38', fill: 'none', stroke: C, strokeWidth: 2 } },
      { type: 'circle', attrs: { cx: 55, cy: 30, r: 4, fill: C } },
      { type: 'circle', attrs: { cx: 60, cy: 27, r: 4, fill: C } },
      { type: 'circle', attrs: { cx: 65, cy: 33, r: 4, fill: C } },
      { type: 'path', attrs: { d: 'M35 68 L85 68', fill: 'none', stroke: S, strokeWidth: 1.5 } },
    ],
  },
  occasion_christmas: {
    elements: [
      { type: 'path', attrs: { d: 'M60 20 L35 75 L85 75 Z', fill: 'none', stroke: S, strokeWidth: 2.5 } },
      { type: 'path', attrs: { d: 'M60 35 L42 65 L78 65 Z', fill: `${C}15`, stroke: 'none' } },
      { type: 'rect', attrs: { x: 55, y: 75, width: 10, height: 15, rx: 2, fill: S } },
      { type: 'circle', attrs: { cx: 60, cy: 20, r: 5, fill: C } },
      { type: 'circle', attrs: { cx: 50, cy: 50, r: 3, fill: C } },
      { type: 'circle', attrs: { cx: 68, cy: 55, r: 3, fill: `${C}60` } },
    ],
  },
  occasion_new_year: {
    elements: [
      { type: 'path', attrs: { d: 'M35 70 Q48 20 60 50 Q72 20 85 70', fill: 'none', stroke: S, strokeWidth: 2.5 } },
      { type: 'circle', attrs: { cx: 40, cy: 35, r: 5, fill: C } },
      { type: 'circle', attrs: { cx: 60, cy: 25, r: 4, fill: `${C}60` } },
      { type: 'circle', attrs: { cx: 80, cy: 30, r: 6, fill: C } },
      { type: 'circle', attrs: { cx: 50, cy: 20, r: 3, fill: `${C}40` } },
      { type: 'path', attrs: { d: 'M40 85 Q60 95 80 85', fill: 'none', stroke: S, strokeWidth: 2 } },
    ],
  },
  occasion_easter: {
    elements: [
      { type: 'ellipse', attrs: { cx: 60, cy: 55, rx: 22, ry: 30, fill: 'none', stroke: S, strokeWidth: 2.5 } },
      { type: 'path', attrs: { d: 'M38 45 L82 45', fill: 'none', stroke: C, strokeWidth: 2 } },
      { type: 'path', attrs: { d: 'M40 55 Q50 50 60 55 Q70 60 80 55', fill: 'none', stroke: C, strokeWidth: 2 } },
      { type: 'path', attrs: { d: 'M42 65 L78 65', fill: 'none', stroke: `${C}60`, strokeWidth: 1.5 } },
      { type: 'circle', attrs: { cx: 50, cy: 38, r: 2.5, fill: C } },
      { type: 'circle', attrs: { cx: 70, cy: 38, r: 2.5, fill: C } },
    ],
  },
  occasion_eid: {
    elements: [
      { type: 'path', attrs: { d: 'M60 25 Q40 40 40 60 Q40 80 60 95 Q80 80 80 60 Q80 40 60 25 Z', fill: 'none', stroke: S, strokeWidth: 2.5 } },
      { type: 'circle', attrs: { cx: 60, cy: 55, r: 10, fill: `${C}20`, stroke: C, strokeWidth: 2 } },
      { type: 'circle', attrs: { cx: 60, cy: 55, r: 4, fill: C } },
      { type: 'path', attrs: { d: 'M46 40 L52 34 M68 40 L74 34', fill: 'none', stroke: C, strokeWidth: 2 } },
    ],
  },
  occasion_mothers_day: {
    elements: [
      { type: 'path', attrs: { d: 'M60 85 Q30 60 40 40 Q48 25 60 35 Q72 25 80 40 Q90 60 60 85 Z', fill: `${C}20`, stroke: C, strokeWidth: 2.5 } },
      { type: 'path', attrs: { d: 'M55 55 Q60 48 65 55', fill: 'none', stroke: S, strokeWidth: 2 } },
      { type: 'circle', attrs: { cx: 52, cy: 50, r: 2, fill: S } },
      { type: 'circle', attrs: { cx: 68, cy: 50, r: 2, fill: S } },
    ],
  },
  occasion_fathers_day: {
    elements: [
      { type: 'path', attrs: { d: 'M60 85 Q30 60 40 40 Q48 25 60 35 Q72 25 80 40 Q90 60 60 85 Z', fill: `${C}10`, stroke: S, strokeWidth: 2.5 } },
      { type: 'path', attrs: { d: 'M46 55 L54 65 L74 42', fill: 'none', stroke: C, strokeWidth: 3 } },
    ],
  },
  occasion_custom: {
    elements: [
      { type: 'circle', attrs: { cx: 60, cy: 50, r: 28, fill: 'none', stroke: S, strokeWidth: 2.5, strokeDasharray: '6 4' } },
      { type: 'path', attrs: { d: 'M50 50 L70 50 M60 40 L60 60', fill: 'none', stroke: C, strokeWidth: 3 } },
      { type: 'path', attrs: { d: 'M44 88 Q60 96 76 88', fill: 'none', stroke: S, strokeWidth: 2 } },
    ],
  },

  /* ── ILLUSTRATION STYLES ── */
  style_watercolor: {
    elements: [
      { type: 'circle', attrs: { cx: 45, cy: 50, r: 20, fill: `${C}30`, stroke: 'none' } },
      { type: 'circle', attrs: { cx: 65, cy: 45, r: 18, fill: '#A8D8EA40', stroke: 'none' } },
      { type: 'circle', attrs: { cx: 55, cy: 65, r: 16, fill: '#BAFFC930', stroke: 'none' } },
      { type: 'path', attrs: { d: 'M30 85 Q45 78 60 85 Q75 92 90 85', fill: 'none', stroke: S, strokeWidth: 2 } },
      { type: 'path', attrs: { d: 'M70 70 L78 60 L82 72', fill: 'none', stroke: C, strokeWidth: 2.5 } },
    ],
  },
  style_3d_animation: {
    elements: [
      { type: 'rect', attrs: { x: 35, y: 30, width: 50, height: 50, rx: 10, fill: 'none', stroke: S, strokeWidth: 2.5 } },
      { type: 'path', attrs: { d: 'M85 30 L95 20 L95 70 L85 80', fill: 'none', stroke: S, strokeWidth: 2 } },
      { type: 'path', attrs: { d: 'M35 30 L45 20 L95 20', fill: 'none', stroke: S, strokeWidth: 2 } },
      { type: 'circle', attrs: { cx: 60, cy: 55, r: 12, fill: `${C}25`, stroke: C, strokeWidth: 2 } },
      { type: 'path', attrs: { d: 'M56 52 L66 58 L56 64 Z', fill: C } },
    ],
  },
  style_block_world: {
    elements: [
      { type: 'rect', attrs: { x: 30, y: 55, width: 25, height: 25, rx: 3, fill: `${C}25`, stroke: S, strokeWidth: 2.5 } },
      { type: 'rect', attrs: { x: 60, y: 45, width: 25, height: 35, rx: 3, fill: '#A8D8EA30', stroke: S, strokeWidth: 2.5 } },
      { type: 'rect', attrs: { x: 42, y: 35, width: 25, height: 20, rx: 3, fill: '#BAFFC930', stroke: S, strokeWidth: 2.5 } },
      { type: 'rect', attrs: { x: 48, y: 20, width: 18, height: 15, rx: 3, fill: `${C}15`, stroke: S, strokeWidth: 2 } },
    ],
  },
  style_paper_cut: {
    elements: [
      { type: 'rect', attrs: { x: 30, y: 30, width: 60, height: 60, rx: 4, fill: '#FEFCF8', stroke: S, strokeWidth: 2.5 } },
      { type: 'path', attrs: { d: 'M45 45 L60 30 L75 45 L75 75 L45 75 Z', fill: `${C}20`, stroke: S, strokeWidth: 2 } },
      { type: 'path', attrs: { d: 'M35 65 L55 85', fill: 'none', stroke: C, strokeWidth: 2, strokeDasharray: '4 3' } },
      { type: 'circle', attrs: { cx: 82, cy: 38, r: 6, fill: C } },
    ],
  },
  style_clay_animation: {
    elements: [
      { type: 'ellipse', attrs: { cx: 60, cy: 60, rx: 28, ry: 22, fill: `${C}20`, stroke: S, strokeWidth: 2.5 } },
      { type: 'circle', attrs: { cx: 50, cy: 52, r: 5, fill: '#fff', stroke: S, strokeWidth: 2 } },
      { type: 'circle', attrs: { cx: 70, cy: 52, r: 5, fill: '#fff', stroke: S, strokeWidth: 2 } },
      { type: 'circle', attrs: { cx: 50, cy: 52, r: 2.5, fill: S } },
      { type: 'circle', attrs: { cx: 70, cy: 52, r: 2.5, fill: S } },
      { type: 'path', attrs: { d: 'M54 66 Q60 72 66 66', fill: 'none', stroke: S, strokeWidth: 2.5 } },
    ],
  },
  style_kawaii: {
    elements: [
      { type: 'circle', attrs: { cx: 60, cy: 55, r: 28, fill: `${C}15`, stroke: S, strokeWidth: 2.5 } },
      { type: 'circle', attrs: { cx: 48, cy: 48, r: 6, fill: S } },
      { type: 'circle', attrs: { cx: 72, cy: 48, r: 6, fill: S } },
      { type: 'circle', attrs: { cx: 46, cy: 46, r: 2, fill: '#fff' } },
      { type: 'circle', attrs: { cx: 70, cy: 46, r: 2, fill: '#fff' } },
      { type: 'path', attrs: { d: 'M52 64 Q60 72 68 64', fill: 'none', stroke: C, strokeWidth: 2.5 } },
      { type: 'circle', attrs: { cx: 38, cy: 60, r: 6, fill: `${C}30` } },
      { type: 'circle', attrs: { cx: 82, cy: 60, r: 6, fill: `${C}30` } },
    ],
  },
  style_geometric: {
    elements: [
      { type: 'path', attrs: { d: 'M60 25 L85 50 L75 80 L45 80 L35 50 Z', fill: 'none', stroke: S, strokeWidth: 2.5 } },
      { type: 'path', attrs: { d: 'M60 25 L75 80 M60 25 L45 80 M35 50 L75 80 M85 50 L45 80', fill: 'none', stroke: `${S}30`, strokeWidth: 1.5 } },
      { type: 'circle', attrs: { cx: 60, cy: 52, r: 10, fill: `${C}30`, stroke: C, strokeWidth: 2 } },
    ],
  },
  style_illustrated_book: {
    elements: [
      { type: 'path', attrs: { d: 'M30 25 Q60 35 60 25 Q60 35 90 25 L90 85 Q60 75 60 85 Q60 75 30 85 Z', fill: 'none', stroke: S, strokeWidth: 2.5 } },
      { type: 'path', attrs: { d: 'M60 25 L60 85', fill: 'none', stroke: S, strokeWidth: 1.5 } },
      { type: 'path', attrs: { d: 'M38 42 L55 42 M38 50 L52 50 M38 58 L50 58', fill: 'none', stroke: `${S}40`, strokeWidth: 1.5 } },
      { type: 'rect', attrs: { x: 66, y: 40, width: 18, height: 20, rx: 3, fill: `${C}25`, stroke: C, strokeWidth: 1.5 } },
    ],
  },
  style_japanese_manga: {
    elements: [
      { type: 'circle', attrs: { cx: 60, cy: 50, r: 24, fill: 'none', stroke: S, strokeWidth: 2.5 } },
      { type: 'ellipse', attrs: { cx: 50, cy: 46, rx: 6, ry: 8, fill: S } },
      { type: 'ellipse', attrs: { cx: 70, cy: 46, rx: 6, ry: 8, fill: S } },
      { type: 'circle', attrs: { cx: 48, cy: 44, r: 2.5, fill: '#fff' } },
      { type: 'circle', attrs: { cx: 68, cy: 44, r: 2.5, fill: '#fff' } },
      { type: 'path', attrs: { d: 'M54 60 Q60 66 66 60', fill: 'none', stroke: S, strokeWidth: 2 } },
      { type: 'path', attrs: { d: 'M36 30 Q42 20 52 28 M68 28 Q78 20 84 30', fill: 'none', stroke: C, strokeWidth: 2.5 } },
      { type: 'path', attrs: { d: 'M30 80 L50 80 L40 95 M70 80 L90 80 L80 95', fill: 'none', stroke: `${C}60`, strokeWidth: 2 } },
    ],
  },

  /* ── MESSAGES ── */
  message_friendship: {
    elements: [
      { type: 'circle', attrs: { cx: 42, cy: 50, r: 16, fill: 'none', stroke: S, strokeWidth: 2.5 } },
      { type: 'circle', attrs: { cx: 78, cy: 50, r: 16, fill: 'none', stroke: S, strokeWidth: 2.5 } },
      { type: 'path', attrs: { d: 'M55 44 L65 44', fill: 'none', stroke: C, strokeWidth: 3 } },
      { type: 'path', attrs: { d: 'M55 56 L65 56', fill: 'none', stroke: C, strokeWidth: 3 } },
      { type: 'path', attrs: { d: 'M35 42 Q40 38 38 44', fill: 'none', stroke: S, strokeWidth: 1.5 } },
      { type: 'path', attrs: { d: 'M49 42 Q44 38 46 44', fill: 'none', stroke: S, strokeWidth: 1.5 } },
      { type: 'path', attrs: { d: 'M50 82 Q60 90 70 82', fill: 'none', stroke: C, strokeWidth: 2 } },
    ],
  },
  message_courage: {
    elements: [
      { type: 'path', attrs: { d: 'M60 30 L55 55 L40 55 L52 68 L48 90 L60 78 L72 90 L68 68 L80 55 L65 55 Z', fill: `${C}20`, stroke: C, strokeWidth: 2.5 } },
      { type: 'path', attrs: { d: 'M55 52 L60 42 L65 52', fill: 'none', stroke: S, strokeWidth: 2 } },
    ],
  },
  message_love: {
    elements: [
      { type: 'path', attrs: { d: 'M60 85 Q25 55 38 35 Q48 22 60 38 Q72 22 82 35 Q95 55 60 85 Z', fill: `${C}20`, stroke: C, strokeWidth: 2.5 } },
      { type: 'circle', attrs: { cx: 52, cy: 50, r: 3, fill: S } },
      { type: 'circle', attrs: { cx: 68, cy: 50, r: 3, fill: S } },
      { type: 'path', attrs: { d: 'M54 62 Q60 68 66 62', fill: 'none', stroke: S, strokeWidth: 2 } },
    ],
  },
  message_perseverance: {
    elements: [
      { type: 'path', attrs: { d: 'M30 80 L50 50 L70 65 L90 30', fill: 'none', stroke: S, strokeWidth: 2.5 } },
      { type: 'path', attrs: { d: 'M82 30 L90 30 L90 38', fill: 'none', stroke: C, strokeWidth: 2.5 } },
      { type: 'circle', attrs: { cx: 30, cy: 80, r: 5, fill: `${C}30` } },
      { type: 'circle', attrs: { cx: 90, cy: 30, r: 5, fill: C } },
      { type: 'path', attrs: { d: 'M40 92 L80 92', fill: 'none', stroke: `${S}30`, strokeWidth: 1.5 } },
    ],
  },
  message_sharing: {
    elements: [
      { type: 'circle', attrs: { cx: 45, cy: 45, r: 15, fill: `${C}15`, stroke: S, strokeWidth: 2.5 } },
      { type: 'circle', attrs: { cx: 75, cy: 45, r: 15, fill: `${C}15`, stroke: S, strokeWidth: 2.5 } },
      { type: 'path', attrs: { d: 'M45 45 Q60 55 75 45', fill: 'none', stroke: C, strokeWidth: 2.5 } },
      { type: 'path', attrs: { d: 'M50 75 L60 65 L70 75', fill: 'none', stroke: S, strokeWidth: 2 } },
      { type: 'path', attrs: { d: 'M60 65 L60 90', fill: 'none', stroke: S, strokeWidth: 2 } },
    ],
  },
  message_honesty: {
    elements: [
      { type: 'path', attrs: { d: 'M60 25 L60 65', fill: 'none', stroke: S, strokeWidth: 3 } },
      { type: 'path', attrs: { d: 'M40 40 L60 30 L80 40', fill: 'none', stroke: S, strokeWidth: 2.5 } },
      { type: 'path', attrs: { d: 'M35 40 L35 55 L45 55', fill: 'none', stroke: S, strokeWidth: 2 } },
      { type: 'path', attrs: { d: 'M85 40 L85 55 L75 55', fill: 'none', stroke: S, strokeWidth: 2 } },
      { type: 'circle', attrs: { cx: 35, cy: 55, r: 5, fill: `${C}30` } },
      { type: 'circle', attrs: { cx: 85, cy: 55, r: 5, fill: `${C}30` } },
      { type: 'path', attrs: { d: 'M45 80 L75 80', fill: 'none', stroke: S, strokeWidth: 2 } },
      { type: 'path', attrs: { d: 'M50 86 L70 86', fill: 'none', stroke: `${S}50`, strokeWidth: 1.5 } },
    ],
  },
  message_respect: {
    elements: [
      { type: 'circle', attrs: { cx: 42, cy: 45, r: 14, fill: 'none', stroke: S, strokeWidth: 2.5 } },
      { type: 'circle', attrs: { cx: 78, cy: 45, r: 14, fill: 'none', stroke: S, strokeWidth: 2.5 } },
      { type: 'path', attrs: { d: 'M42 60 Q42 70 50 70 L70 70 Q78 70 78 60', fill: 'none', stroke: C, strokeWidth: 2.5 } },
      { type: 'path', attrs: { d: 'M36 40 Q42 34 48 40', fill: 'none', stroke: S, strokeWidth: 2 } },
      { type: 'path', attrs: { d: 'M72 40 Q78 34 84 40', fill: 'none', stroke: S, strokeWidth: 2 } },
      { type: 'path', attrs: { d: 'M50 85 Q60 92 70 85', fill: 'none', stroke: C, strokeWidth: 2 } },
    ],
  },
  message_custom: {
    elements: [
      { type: 'path', attrs: { d: 'M30 35 L90 35 L90 70 L65 70 L55 82 L55 70 L30 70 Z', fill: 'none', stroke: S, strokeWidth: 2.5 } },
      { type: 'circle', attrs: { cx: 50, cy: 52, r: 3, fill: C } },
      { type: 'circle', attrs: { cx: 60, cy: 52, r: 3, fill: C } },
      { type: 'circle', attrs: { cx: 70, cy: 52, r: 3, fill: C } },
    ],
  },
};

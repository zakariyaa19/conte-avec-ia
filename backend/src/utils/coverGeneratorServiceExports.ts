// Re-export shared constants from coverGeneratorService for use in storyImageGenerator
// These are duplicated here to avoid circular dependencies and keep coverGeneratorService clean

export const STYLE_DIRECTIVES: Record<string, string> = {
  'watercolor': 'delicate watercolor painting with soft washes, translucent layers, visible paper texture, gentle color bleeding at edges, dreamy and ethereal atmosphere, pastel tones',
  '3d-animation': 'Pixar/Disney-quality 3D rendered animation, soft global illumination, subsurface scattering on skin, rounded friendly character design, cinematic depth of field, vibrant colors',
  'kawaii': 'Japanese kawaii style, extremely cute and round character designs, pastel colors, sparkly eyes with large pupils, blushing cheeks, soft rounded shapes, adorable expressions',
  'block-world': 'blocky voxel-art style reminiscent of Minecraft, cubic characters and environment, pixel-like textures on 3D blocks, colorful and playful geometric world',
  'paper-cut': 'layered paper-cut collage art style, visible paper layers with shadows between them, textured craft paper surfaces, hand-cut edges, dimensional depth through layering',
  'clay-animation': 'claymation / stop-motion style, characters made of sculpted clay or plasticine, visible finger texture marks, warm lighting, slightly imperfect handmade charm, Aardman-like quality',
  'geometric': 'modern geometric illustration style, flat design with bold shapes, clean vector-like edges, limited but vibrant color palette, abstract forms composing recognizable figures',
  'illustrated-book': 'classic children\'s book illustration, warm gouache or colored pencil rendering, gentle lines, storybook charm like Beatrix Potter or Oliver Jeffers, inviting and nostalgic',
  'japanese-manga': 'Japanese manga/anime illustration style, expressive large eyes, dynamic composition, cel-shading, detailed hair rendering, vibrant colors, shojo/kodomo manga aesthetic',
};

export const OCCASION_SCENES: Record<string, string> = {
  'birthday': 'a magical birthday party scene with balloons, a sparkling cake, colorful confetti, and festive decorations',
  'christmas': 'a cozy Christmas scene with gently falling snow, a beautifully decorated tree, warm golden lights, and wrapped gifts',
  'new-year': 'a magical New Year celebration with bright fireworks lighting up the night sky, stars, and sparkles',
  'easter': 'a springtime Easter scene with colorful painted eggs hidden among blooming flowers, baby bunnies, and butterflies',
  'eid': 'a warm and joyful Eid celebration scene with a crescent moon, glowing lanterns, and beautiful decorations',
  'mothers-day': 'a heartwarming scene with beautiful flowers, a loving embrace, and a sunlit garden full of warmth',
  'fathers-day': 'an adventurous outdoor scene with father and child, warm golden sunlight, and a sense of bonding',
};

export const THEME_SCENES: Record<string, string> = {
  'educational': 'a scene of wonder and discovery with magical books, nature elements, a curious explorer in a vibrant world of knowledge',
  'fairy-tales': 'an enchanted fairy-tale scene with a magical castle in the distance, sparkles, a mystical forest, and fairy lights',
  'activities': 'a lively and colorful scene full of creative activities, art supplies, musical instruments, and playful energy',
  'stories': 'a dreamy storybook scene with open books, floating pages, imagination coming alive with magical elements',
  'celebrations': 'a joyful celebration scene with confetti, music notes, happy dancing, and a festive atmosphere',
  'family': 'a warm and cozy family scene with a welcoming home, togetherness, love, and a gentle sunset glow',
};

export const MESSAGE_MOODS: Record<string, string> = {
  'friendship': 'themes of friendship, togetherness, and joy of being with friends',
  'courage': 'themes of bravery, courage, and overcoming fears with determination',
  'love': 'themes of love, warmth, and tender affection',
  'perseverance': 'themes of perseverance, never giving up, and achieving goals',
  'sharing': 'themes of generosity, sharing with others, and the joy of giving',
  'honesty': 'themes of honesty, truth, and integrity',
  'respect': 'themes of respect, kindness, and growing together with empathy',
};

# 🎨 Images des Styles d'Illustration - Guide d'Implémentation

## 📁 Emplacement des Images

Toutes les images doivent être placées dans :
```
/contes-ia/public/images/illustration-styles/
```

## 📋 Liste Complète des Fichiers Requis

### 1. aquarelle.jpg
- **Style** : Aquarelle doux et fluide
- **Suggestions** : Peinture aquarelle avec couleurs pastel, effet de transparence, douceur
- **Mots-clés recherche** : watercolor painting, soft watercolor art, pastel watercolor

### 2. animation-3d.jpg
- **Style** : Animation 3D type Pixar/Disney
- **Suggestions** : Personnages 3D colorés, rendu brillant, style cartoon moderne
- **Mots-clés recherche** : 3D animation style, Pixar style render, cartoon 3D characters

### 3. monde-des-blocs.jpg
- **Style** : Minecraft/blocs cubiques
- **Suggestions** : Monde pixelisé, blocs carrés, style voxel art
- **Mots-clés recherche** : minecraft style, voxel art, block world game art

### 4. papier-decoupe.jpg
- **Style** : Papier découpé artisanal
- **Suggestions** : Collage de papier, découpes superposées, ombres douces
- **Mots-clés recherche** : paper cut art, paper craft illustration, layered paper art

### 5. clay-animation.jpg
- **Style** : Pâte à modeler / Claymation
- **Suggestions** : Personnages en pâte à modeler, texture mate, style Wallace & Gromit
- **Mots-clés recherche** : claymation style, plasticine art, clay animation characters

### 6. kawaii.jpg
- **Style** : Kawaii japonais mignon
- **Suggestions** : Personnages mignons aux grands yeux, couleurs pastel, style chibi
- **Mots-clés recherche** : kawaii illustration, cute japanese style, chibi characters

### 7. geometrique.jpg
- **Style** : Géométrique moderne
- **Suggestions** : Formes géométriques, design minimaliste, couleurs vives
- **Mots-clés recherche** : geometric illustration, modern geometric art, abstract shapes

### 8. livre-illustre.jpg
- **Style** : Livre illustré classique
- **Suggestions** : Illustration traditionnelle, style conte de fées, dessin à la main
- **Mots-clés recherche** : children book illustration, classic storybook art, fairy tale illustration

### 9. dessin-japonais-manga.jpg
- **Style** : Manga/Anime japonais
- **Suggestions** : Style manga, grands yeux expressifs, traits dynamiques
- **Mots-clés recherche** : manga style illustration, anime art style, japanese comic art

## 📐 Spécifications Techniques

### Format et Qualité
- **Format** : JPG (optimisé pour le web)
- **Dimensions** : 800x600px minimum (ratio 4:3) ou 1200x675px (ratio 16:9)
- **Poids** : < 200KB par image
- **Qualité** : 80-85%
- **Optimisation** : Utiliser TinyJPG ou Squoosh pour compression

### Composition
- **Sujet** : Illustration représentative du style (personnage, scène, ou motif)
- **Couleurs** : Vives et attrayantes, représentatives du style
- **Contraste** : Suffisant pour que le texte blanc soit lisible par-dessus
- **Zones sombres** : Prévoir une zone sombre en bas pour le texte (ou l'overlay le fera)

## 🎯 Mapping Technique

Le code utilise exactement ces chemins :

```typescript
const ILLUSTRATION_STYLES = [
  { value: 'watercolor', imagePath: '/images/illustration-styles/aquarelle.jpg' },
  { value: '3d-animation', imagePath: '/images/illustration-styles/animation-3d.jpg' },
  { value: 'block-world', imagePath: '/images/illustration-styles/monde-des-blocs.jpg' },
  { value: 'paper-cut', imagePath: '/images/illustration-styles/papier-decoupe.jpg' },
  { value: 'clay-animation', imagePath: '/images/illustration-styles/clay-animation.jpg' },
  { value: 'kawaii', imagePath: '/images/illustration-styles/kawaii.jpg' },
  { value: 'geometric', imagePath: '/images/illustration-styles/geometrique.jpg' },
  { value: 'illustrated-book', imagePath: '/images/illustration-styles/livre-illustre.jpg' },
  { value: 'japanese-manga', imagePath: '/images/illustration-styles/dessin-japonais-manga.jpg' }
];
```

## 🔍 Sources Recommandées

### Images Libres de Droits
1. **Unsplash** (unsplash.com) - Photos haute qualité gratuites
2. **Pexels** (pexels.com) - Banque d'images et vidéos gratuites
3. **Pixabay** (pixabay.com) - Images et illustrations libres
4. **Freepik** (freepik.com) - Illustrations vectorielles (vérifier licence)

### Générateurs IA (Alternative)
1. **Midjourney** - Génération d'images par IA
2. **DALL-E** - Génération d'images par IA
3. **Stable Diffusion** - Génération d'images open source

### Prompts Suggérés pour IA
```
"watercolor children's book illustration, soft pastel colors, dreamy atmosphere"
"3D rendered cartoon character, Pixar style, colorful and friendly"
"minecraft style landscape, cubic blocks, voxel art"
"paper cut craft illustration, layered paper art, shadow depth"
"claymation character, plasticine texture, stop motion style"
"kawaii cute character, big eyes, pastel colors, chibi style"
"geometric modern illustration, abstract shapes, vibrant colors"
"classic children's book illustration, hand drawn, fairy tale style"
"manga anime style character, expressive eyes, dynamic pose"
```

## ✅ Checklist de Validation

Avant de déployer, vérifier que :
- [ ] Les 9 fichiers sont présents dans le dossier
- [ ] Les noms de fichiers correspondent EXACTEMENT (avec tirets et accents)
- [ ] Les images sont optimisées (< 200KB chacune)
- [ ] Les images sont en format JPG
- [ ] Le texte blanc est lisible sur chaque image (tester avec overlay)
- [ ] Les images représentent bien leur style respectif
- [ ] Pas de watermark ou copyright visible

## 🚀 Déploiement

Une fois les images ajoutées :
1. Vérifier localement que toutes les images se chargent
2. Tester le responsive (mobile + desktop)
3. Vérifier l'accessibilité (contraste texte/image)
4. Commit et push sur GitHub
5. Vérifier en production après déploiement

## 🎨 Fallback

En cas d'erreur de chargement d'une image :
- Le composant affiche un fond gris (`theme.colors.background.secondary`)
- Le texte reste visible
- Aucune erreur bloquante pour l'utilisateur

## 📞 Support

En cas de problème :
1. Vérifier les chemins dans la console navigateur
2. Vérifier les permissions du dossier
3. Vérifier que les images sont bien dans `/public/images/illustration-styles/`
4. Vérifier l'orthographe exacte des noms de fichiers

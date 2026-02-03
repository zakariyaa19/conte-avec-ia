# 🎉 Images des Occasions - Guide d'Implémentation

## 📁 Emplacement des Images

Toutes les images doivent être placées dans :
```
/contes-ia/public/image/occasions/
```

## 📋 Liste Complète des Fichiers Requis

### 1. anniversaire.png
- **Occasion** : Anniversaire
- **Description** : Fête d'anniversaire
- **Suggestions visuelles** :
  - Enfant joyeux avec gâteau d'anniversaire et bougies
  - Ballons colorés en arrière-plan
  - Cadeaux emballés
  - Expression excitée et heureuse
  - Couleurs festives et vives
- **Mots-clés recherche** : child birthday illustration, kid with cake, birthday party child

### 2. noel.png
- **Occasion** : Noël
- **Description** : Fête de Noël
- **Suggestions visuelles** :
  - Enfant près d'un sapin de Noël décoré
  - Cadeaux sous le sapin
  - Ambiance chaleureuse et festive
  - Couleurs rouge, vert, or
  - Expression émerveillée
- **Mots-clés recherche** : child christmas illustration, kid with christmas tree, christmas child

### 3. nouvel-an.png
- **Occasion** : Nouvel An
- **Description** : Célébration du Nouvel An
- **Suggestions visuelles** :
  - Enfant avec feux d'artifice en arrière-plan
  - Confettis et étoiles
  - Ambiance festive nocturne
  - Couleurs éclatantes (or, argent, bleu nuit)
  - Expression joyeuse
- **Mots-clés recherche** : child new year illustration, kid with fireworks, new year celebration child

### 4. paques.png
- **Occasion** : Pâques
- **Description** : Fête de Pâques
- **Suggestions visuelles** :
  - Enfant cherchant des œufs de Pâques
  - Lapin de Pâques
  - Panier avec œufs colorés
  - Ambiance printanière
  - Couleurs pastel (rose, jaune, bleu clair)
- **Mots-clés recherche** : child easter illustration, kid with easter eggs, easter bunny child

### 5. aid.png
- **Occasion** : Aïd el-Fitr
- **Description** : Fête musulmane de l'Aïd
- **Suggestions visuelles** :
  - Enfant en tenue festive traditionnelle
  - Croissant de lune et étoiles
  - Lanternes décoratives
  - Ambiance chaleureuse et familiale
  - Couleurs or, vert, violet
- **Mots-clés recherche** : child eid illustration, kid eid celebration, islamic festival child

### 6. fete-meres.png
- **Occasion** : Fête des mères
- **Description** : Fête des mères
- **Suggestions visuelles** :
  - Enfant offrant un bouquet de fleurs
  - Carte ou cadeau fait main
  - Expression tendre et aimante
  - Couleurs douces (rose, violet, blanc)
  - Ambiance affectueuse
- **Mots-clés recherche** : child mothers day illustration, kid with flowers for mom, mothers day child

### 7. fete-peres.png
- **Occasion** : Fête des pères
- **Description** : Fête des pères
- **Suggestions visuelles** :
  - Enfant avec cadeau pour papa
  - Cravate ou outil symbolique
  - Expression fière et joyeuse
  - Couleurs masculines (bleu, gris, marron)
  - Ambiance complice
- **Mots-clés recherche** : child fathers day illustration, kid with gift for dad, fathers day child

### 8. halloween.png
- **Occasion** : Halloween
- **Description** : Fête d'Halloween
- **Suggestions visuelles** :
  - Enfant déguisé (fantôme, sorcière, super-héros)
  - Citrouille jack-o'-lantern
  - Sac de bonbons
  - Ambiance amusante (pas effrayante)
  - Couleurs orange, noir, violet
- **Mots-clés recherche** : child halloween illustration, kid in costume, halloween child friendly

### 9. personnalise.png
- **Occasion** : Occasion personnalisée
- **Description** : Pour toute autre occasion
- **Suggestions visuelles** :
  - Enfant créatif avec calendrier ou étoile
  - Crayon ou palette créative
  - Expression imaginative
  - Couleurs variées et joyeuses
  - Symbole de personnalisation
- **Mots-clés recherche** : child creative illustration, kid with calendar, custom occasion child

## 📐 Spécifications Techniques

### Format et Qualité
- **Format** : PNG (avec transparence)
- **Dimensions** : 400x400px (format carré)
- **Poids** : < 100KB par image
- **Fond** : Transparent ou uni clair
- **Style** : Illustration jeunesse moderne et colorée

### Composition
- **Cadrage** : Personnage principal bien visible
- **Visibilité** : Occasion clairement identifiable
- **Couleurs** : Vives et adaptées à chaque occasion
- **Expression** : Joyeuse et festive
- **Clarté** : Représentation immédiate de l'occasion

## 🎯 Mapping Technique

Le code utilise exactement ces chemins :

```typescript
const SPECIFIC_SUBJECTS = [
  { value: 'birthday', label: 'Anniversaire', icon: '🎂', imagePath: '/image/occasions/anniversaire.png' },
  { value: 'christmas', label: 'Noël', icon: '🎄', imagePath: '/image/occasions/noel.png' },
  { value: 'new-year', label: 'Nouvel An', icon: '🎆', imagePath: '/image/occasions/nouvel-an.png' },
  { value: 'easter', label: 'Pâques', icon: '🐣', imagePath: '/image/occasions/paques.png' },
  { value: 'eid', label: 'Aïd el-Fitr', icon: '🌙', imagePath: '/image/occasions/aid.png' },
  { value: 'mothers-day', label: 'Fête des mères', icon: '💐', imagePath: '/image/occasions/fete-meres.png' },
  { value: 'fathers-day', label: 'Fête des pères', icon: '👨‍👧', imagePath: '/image/occasions/fete-peres.png' },
  { value: 'halloween', label: 'Halloween', icon: '👻', imagePath: '/image/occasions/halloween.png' }
];
```

## 🔍 Sources Recommandées

### Images Libres de Droits
1. **Freepik** (freepik.com) - Illustrations vectorielles enfants
2. **Flaticon** (flaticon.com) - Icônes et personnages
3. **Vecteezy** (vecteezy.com) - Illustrations vectorielles gratuites
4. **Pixabay** (pixabay.com) - Illustrations PNG

### Générateurs IA (Alternative)
1. **Midjourney** - Génération d'images par IA
2. **DALL-E** - Génération d'images par IA
3. **Stable Diffusion** - Génération d'images open source

### Prompts Suggérés pour IA
```
"cute child with birthday cake and candles, festive illustration, colorful, PNG"
"child near christmas tree with gifts, warm atmosphere, holiday illustration, PNG"
"child with fireworks and confetti, new year celebration, joyful illustration, PNG"
"child hunting easter eggs with bunny, spring colors, pastel illustration, PNG"
"child in festive traditional clothing, eid celebration, crescent moon, PNG"
"child offering flowers bouquet, mothers day, tender illustration, PNG"
"child with gift for dad, fathers day, proud illustration, PNG"
"child in friendly costume with pumpkin, halloween, fun illustration, PNG"
"creative child with calendar and star, custom occasion, imaginative illustration, PNG"
```

## 🎨 Style Visuel Recommandé

### Cohérence
- **Style unifié** : Toutes les images doivent avoir le même style graphique
- **Palette** : Couleurs harmonieuses entre les 9 images
- **Proportions** : Taille similaire des personnages dans chaque image
- **Qualité** : Niveau de détail équivalent

### Caractéristiques
- **Moderne** : Style illustration contemporain
- **Festif** : Ambiance joyeuse et célébrative
- **Clair** : Occasion immédiatement reconnaissable
- **Coloré** : Utilisation de couleurs vives adaptées à chaque fête

## ✅ Checklist de Validation

Avant de déployer, vérifier que :
- [ ] Les 9 fichiers sont présents dans le dossier
- [ ] Les noms de fichiers correspondent EXACTEMENT
- [ ] Les images sont en format PNG avec transparence
- [ ] Les images sont optimisées (< 100KB chacune)
- [ ] Les 9 images ont un style cohérent
- [ ] Les occasions sont clairement différenciables
- [ ] Les personnages sont souriants et festifs
- [ ] Pas de watermark ou copyright visible
- [ ] Les images sont carrées (400x400px ou ratio 1:1)
- [ ] Carnaval et Saint-Nicolas ont bien été supprimés

## 🚀 Déploiement

Une fois les images ajoutées :
1. Vérifier localement que toutes les images se chargent
2. Tester le responsive (mobile + desktop)
3. Vérifier l'accessibilité (alt text, contraste)
4. Commit et push sur GitHub
5. Vérifier en production après déploiement

## 🎨 Fallback

En cas d'erreur de chargement d'une image :
- Le composant affiche un fond de couleur pastel avec l'emoji de l'occasion
- Le texte reste visible et lisible
- Aucune erreur bloquante pour l'utilisateur

## 📞 Support

En cas de problème :
1. Vérifier les chemins dans la console navigateur
2. Vérifier les permissions du dossier
3. Vérifier que les images sont bien dans `/public/image/occasions/`
4. Vérifier l'orthographe exacte des noms de fichiers

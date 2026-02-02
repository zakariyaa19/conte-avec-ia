# 👶 Images des Tranches d'Âge - Guide d'Implémentation

## 📁 Emplacement des Images

Toutes les images doivent être placées dans :
```
/contes-ia/public/image/ageenfant/
```

## 📋 Liste Complète des Fichiers Requis

### 1. age-0-2.png
- **Tranche d'âge** : 0-2 ans (Bébé/Tout-petit)
- **Description** : Histoires simples avec images colorées
- **Suggestions visuelles** : 
  - Bébé ou tout-petit souriant
  - Jouets d'éveil (hochet, peluche)
  - Couleurs douces et pastel
  - Expression joyeuse et innocente
- **Mots-clés recherche** : baby illustration, toddler cartoon, cute baby character, infant drawing

### 2. age-3-5.png
- **Tranche d'âge** : 3-5 ans (Préscolaire)
- **Description** : Contes courts avec vocabulaire adapté
- **Suggestions visuelles** :
  - Enfant préscolaire actif
  - Jouets éducatifs (blocs, livres d'images)
  - Couleurs vives et joyeuses
  - Expression curieuse et enjouée
- **Mots-clés recherche** : preschool child illustration, kindergarten kid cartoon, young child character

### 3. age-6-9.png
- **Tranche d'âge** : 6-9 ans (Âge scolaire)
- **Description** : Histoires plus longues et aventures
- **Suggestions visuelles** :
  - Enfant d'âge scolaire dynamique
  - Activités (lecture, sport, exploration)
  - Couleurs énergiques
  - Expression aventureuse et confiante
- **Mots-clés recherche** : school age child illustration, elementary kid cartoon, adventure child character

### 4. age-10-plus.png
- **Tranche d'âge** : 10+ ans (Préadolescent)
- **Description** : Récits complexes et personnages développés
- **Suggestions visuelles** :
  - Préadolescent/adolescent mature
  - Activités plus sophistiquées (lecture, technologie)
  - Couleurs modernes
  - Expression mature et réfléchie
- **Mots-clés recherche** : preteen illustration, tween character, young teenager cartoon

## 📐 Spécifications Techniques

### Format et Qualité
- **Format** : PNG (avec transparence)
- **Dimensions** : 400x400px (format carré)
- **Poids** : < 100KB par image
- **Fond** : Transparent ou uni clair
- **Style** : Illustration jeunesse moderne et colorée

### Composition
- **Cadrage** : Portrait ou buste de l'enfant
- **Visibilité** : Personnage bien visible et reconnaissable
- **Couleurs** : Vives et attrayantes, adaptées à l'âge
- **Expression** : Souriante et accueillante
- **Clarté** : Représentation claire de l'âge (taille, traits, activités)

## 🎯 Mapping Technique

Le code utilise exactement ces chemins :

```typescript
const AGE_RANGES = [
  { 
    value: '0-2', 
    label: '0–2 ans', 
    description: 'Histoires simples avec images colorées',
    imagePath: '/image/ageenfant/age-0-2.png'
  },
  { 
    value: '3-5', 
    label: '3–5 ans', 
    description: 'Contes courts avec vocabulaire adapté',
    imagePath: '/image/ageenfant/age-3-5.png'
  },
  { 
    value: '6-9', 
    label: '6–9 ans', 
    description: 'Histoires plus longues et aventures',
    imagePath: '/image/ageenfant/age-6-9.png'
  },
  { 
    value: '10+', 
    label: '10+ ans', 
    description: 'Récits complexes et personnages développés',
    imagePath: '/image/ageenfant/age-10-plus.png'
  }
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
"cute baby character illustration, 0-2 years old, colorful, friendly, PNG transparent background"
"preschool child character, 3-5 years old, happy, playful, modern illustration style, PNG"
"school age child character, 6-9 years old, adventurous, energetic, cartoon style, PNG"
"preteen character illustration, 10+ years old, confident, mature, modern style, PNG"
```

## 🎨 Style Visuel Recommandé

### Cohérence
- **Style unifié** : Toutes les images doivent avoir le même style graphique
- **Palette** : Couleurs harmonieuses entre les 4 images
- **Proportions** : Taille similaire des personnages dans chaque image
- **Qualité** : Niveau de détail équivalent

### Caractéristiques
- **Moderne** : Style illustration contemporain
- **Sympathique** : Personnages accueillants et non intimidants
- **Clair** : Différenciation évidente entre les âges
- **Coloré** : Utilisation de couleurs vives mais harmonieuses

## ✅ Checklist de Validation

Avant de déployer, vérifier que :
- [ ] Les 4 fichiers sont présents dans le dossier
- [ ] Les noms de fichiers correspondent EXACTEMENT
- [ ] Les images sont en format PNG avec transparence
- [ ] Les images sont optimisées (< 100KB chacune)
- [ ] Les 4 images ont un style cohérent
- [ ] Les âges sont clairement différenciables
- [ ] Les personnages sont souriants et accueillants
- [ ] Pas de watermark ou copyright visible
- [ ] Les images sont carrées (400x400px ou ratio 1:1)

## 🚀 Déploiement

Une fois les images ajoutées :
1. Vérifier localement que toutes les images se chargent
2. Tester le responsive (mobile + desktop)
3. Vérifier l'accessibilité (alt text, contraste)
4. Commit et push sur GitHub
5. Vérifier en production après déploiement

## 🎨 Fallback

En cas d'erreur de chargement d'une image :
- Le composant affiche un fond de couleur pastel
- Le texte reste visible et lisible
- Aucune erreur bloquante pour l'utilisateur

## 📞 Support

En cas de problème :
1. Vérifier les chemins dans la console navigateur
2. Vérifier les permissions du dossier
3. Vérifier que les images sont bien dans `/public/image/ageenfant/`
4. Vérifier l'orthographe exacte des noms de fichiers

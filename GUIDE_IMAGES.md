# Guide des Images de Couverture - Contes d'IA

## Structure des dossiers

```
backend/
├── images/
│   └── covers/
│       ├── forest-adventure.jpg
│       ├── space-adventure.jpg
│       ├── cooking-adventure.jpg
│       ├── ocean-adventure.jpg
│       ├── school-adventure.jpg
│       ├── garden-adventure.jpg
│       ├── time-adventure.jpg
│       ├── animals-adventure.jpg
│       ├── pirate-adventure.jpg
│       └── dance-adventure.jpg
```

## Images à créer

Vous devez créer 10 images de couverture correspondant aux contes d'exemple :

### 1. forest-adventure.jpg
- **Titre**: "Dans la Forêt Magique : Une Histoire de Confiance"
- **Thème**: Forêt, aventure, Emma (8 ans) et son chien Rex
- **Style**: Animation 3D
- **Couleurs**: Verts naturels, lumière dorée

### 2. space-adventure.jpg
- **Titre**: "Les Étoiles de Luna : Un Voyage Cosmique"
- **Thème**: Espace, étoiles, Luna (7 ans) et son chat Stella
- **Style**: Aquarelle
- **Couleurs**: Bleus cosmiques, violets, étoiles dorées

### 3. cooking-adventure.jpg
- **Titre**: "Le Petit Chef Léo : Recettes Magiques"
- **Thème**: Cuisine, Léo (6 ans) et sa grand-mère Marie
- **Style**: Cartoon
- **Couleurs**: Chauds (rouge, orange, jaune)

### 4. ocean-adventure.jpg
- **Titre**: "Zoé et le Royaume des Océans"
- **Thème**: Océan, vie marine, Zoé (9 ans) et Nemo le poisson
- **Style**: Réaliste
- **Couleurs**: Bleus océan, turquoise

### 5. school-adventure.jpg
- **Titre**: "Max le Brave : L'École des Héros"
- **Thème**: École, courage, Max (6 ans)
- **Style**: Bande Dessinée
- **Couleurs**: Vives et dynamiques

### 6. garden-adventure.jpg
- **Titre**: "Lily et le Jardin Enchanté"
- **Thème**: Jardinage, nature, Lily (5 ans) et un papillon
- **Style**: Aquarelle
- **Couleurs**: Verts tendres, pastels

### 7. time-adventure.jpg
- **Titre**: "Tom et la Machine à Remonter le Temps"
- **Thème**: Voyage temporel, Tom (11 ans) et Professeur Einstein
- **Style**: Steampunk
- **Couleurs**: Cuivrés, dorés, mécaniques

### 8. animals-adventure.jpg
- **Titre**: "Mia et les Animaux Parlants"
- **Thème**: Communication animale, Mia (7 ans) et Écureuil Noisette
- **Style**: Animation 3D
- **Couleurs**: Naturelles, chaleureuses

### 9. pirate-adventure.jpg
- **Titre**: "Hugo et le Trésor des Pirates"
- **Thème**: Pirates, trésor, Hugo (10 ans) et Capitaine Barbe-Rouge (perroquet)
- **Style**: Cartoon
- **Couleurs**: Bleus marins, or, rouge

### 10. dance-adventure.jpg
- **Titre**: "Chloé et la Danse des Nuages"
- **Thème**: Danse, nuages, Chloé (8 ans)
- **Style**: Pastel
- **Couleurs**: Doux pastels, blancs nuageux

## Format des images

- **Dimensions**: 300x400px (format portrait)
- **Format**: JPG
- **Qualité**: Haute résolution pour l'affichage web
- **Style**: Couvertures de livres pour enfants attractives

## Accès via le serveur

Les images seront accessibles via :
`http://localhost:5001/images/covers/[nom-fichier].jpg`

## Notes importantes

- Les images remplacent les placeholders textuels actuels
- Elles s'affichent avec un fallback en cas d'erreur de chargement
- Le serveur backend sert les images statiquement
- Les images doivent être optimisées pour le web

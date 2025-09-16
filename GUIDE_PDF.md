# Guide d'ajout des PDFs pour les exemples de contes

## Structure des dossiers

```
backend/
├── pdfs/
│   └── examples/
│       ├── forest-adventure.pdf
│       ├── space-adventure.pdf
│       ├── cooking-adventure.pdf
│       ├── ocean-adventure.pdf
│       ├── school-adventure.pdf
│       ├── garden-adventure.pdf
│       ├── time-adventure.pdf
│       ├── animals-adventure.pdf
│       ├── pirate-adventure.pdf
│       └── dance-adventure.pdf
```

## Comment ajouter vos PDFs

### 1. Créer le dossier (si pas encore fait)
```bash
mkdir -p /Users/kovsky/Documents/conte-ia\ copie/backend/pdfs/examples
```

### 2. Copier vos PDFs
Placez vos fichiers PDF dans le dossier `backend/pdfs/examples/` avec les noms suivants :

- `forest-adventure.pdf` → "Dans la Forêt Magique : Une Histoire de Confiance"
- `space-adventure.pdf` → "Les Étoiles de Luna : Un Voyage Cosmique"
- `cooking-adventure.pdf` → "Le Petit Chef Léo : Recettes Magiques"
- `ocean-adventure.pdf` → "Zoé et le Royaume des Océans"
- `school-adventure.pdf` → "Max le Brave : L'École des Héros"
- `garden-adventure.pdf` → "Lily et le Jardin Enchanté"
- `time-adventure.pdf` → "Tom et la Machine à Remonter le Temps"
- `animals-adventure.pdf` → "Mia et les Animaux Parlants"
- `pirate-adventure.pdf` → "Hugo et le Trésor des Pirates"
- `dance-adventure.pdf` → "Chloé et la Danse des Nuages"

### 3. Vérifier l'accès
Une fois vos PDFs ajoutés, ils seront accessibles via :
- `http://localhost:5001/pdfs/examples/forest-adventure.pdf`
- `http://localhost:5001/pdfs/examples/space-adventure.pdf`
- etc...

### 4. Redémarrer le serveur
```bash
cd backend
npm run dev
```

## URLs configurées dans l'application

Les URLs sont déjà configurées dans `src/data/exampleStories.ts` :
- `/pdfs/examples/forest-adventure.pdf`
- `/pdfs/examples/space-adventure.pdf`
- etc...

## Fonctionnement du viewer

- **Sans PDF** : Affiche un message "Conte en préparation"
- **Avec PDF** : Active le module de feuilletage interactif
- **Navigation** : Boutons Précédent/Suivant pour parcourir les pages
- **Interaction** : Clic sur les pages pour les retourner

## Notes importantes

1. **Noms de fichiers** : Respectez exactement les noms indiqués
2. **Format** : Seuls les fichiers PDF sont supportés
3. **Taille** : Optimisez vos PDFs pour le web (< 5MB recommandé)
4. **Sécurité** : Les PDFs sont servis en statique, pas de traitement côté serveur

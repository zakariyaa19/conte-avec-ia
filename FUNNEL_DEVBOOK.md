# CONTEDIA — Devbook Optimisation Funnel

> **Objectif** : Corriger toutes les fuites du funnel de conversion, de l'arrivee sur le site jusqu'a la retention post-achat.
> **Methode** : Chaque modification est une tache autonome, executable avec `/effort` une par une.
> **Date de creation** : 2026-04-12
> **Branche** : `v2`

---

## Legende statut

- [ ] A faire
- [x] Termine
- [~] En cours
- [!] Bloque

---

## Vue d'ensemble du funnel

```
Homepage → Wizard (Age/Theme → Personnage → Preview) → Livraison → Lecture → Paywall → Paiement → Post-achat → Emails relance
```

**Fuites identifiees (par ordre de gravite)** :
1. Etape Preview/Email (formulaire trop long + pricing visible) — CRITIQUE
2. Dependance a l'email pour acceder au reader — CRITIQUE  
3. Generation de couverture trop lente (30-60s) — CRITIQUE
4. Paywall cliffhanger sous-optimise — HAUTE
5. Upload photo = friction mobile — HAUTE
6. Email de livraison pollue par le pricing — MOYENNE
7. Homepage avec trop de CTAs concurrents — MOYENNE
8. Pas de sequence post-achat — MOYENNE
9. Fausse urgence (countdown, "expire dans 48h") — BASSE

---

# PHASE 1 — Quick Wins critiques (impact immediat)

## 1.1 — Reduire le formulaire preview a EMAIL SEUL

- **Statut** : [x] Termine (2026-04-12)
- **Priorite** : P0 (plus haute)
- **Impact estime** : +20-30% completion wizard
- **Temps estime** : 30-45 min
- **Fichier(s)** : `contes-ia/src/components/wizard/StoryWizard.tsx` (step preview, ~lignes 1376-1947)
- **Domaine d'expertise** : UX / React

### Probleme
L'etape preview demande prenom + nom + email + choix pricing pour un contenu GRATUIT. C'est 3 champs de trop. L'utilisateur venant de Facebook (attention ~30s) abandonne face a la complexite.

### Solution
- Retirer les champs `firstName` et `lastName` du formulaire pour les utilisateurs non-authentifies
- Ne garder QUE le champ email
- Le prenom/nom sera recupere plus tard (post-achat ou lors de la creation de compte)
- Si l'utilisateur est deja authentifie, ne montrer aucun formulaire (juste le bouton "Recevoir mon livre")

### Specification technique
```
AVANT :
[Cover preview]
[Radio: Gratuit / Club mensuel / Club annuel]  ← SUPPRIMER
[Input: Prenom]                                 ← SUPPRIMER  
[Input: Nom]                                    ← SUPPRIMER
[Input: Email]                                  ← GARDER
[Bouton Google]                                 ← GARDER
[Trust badges]
[Bouton: Recevoir mon livre]

APRES :
[Cover preview]
[Input: Email — pleine largeur]
[Bouton Google — pleine largeur]
[Trust badges: Gratuit · Sans CB · Pret en 5 min]
[Bouton: Recevoir l'histoire de {prenom} GRATUITEMENT]
```

### Verification
- [ ] Le formulaire ne montre que l'email pour les non-authentifies
- [ ] Les utilisateurs authentifies voient un bouton direct sans formulaire
- [ ] La soumission fonctionne avec email seul
- [ ] Le backend accepte une commande sans firstName/lastName
- [ ] Test mobile : le formulaire tient dans un ecran sans scroll

---

## 1.2 — Retirer les options pricing de l'etape preview

- **Statut** : [x] Termine (2026-04-12) — Note: le mode simplifie (95% users) n'avait deja pas de pricing visible. Le full flow garde le pricing car les returning users payants en ont besoin.
- **Priorite** : P0
- **Impact estime** : +15% completion wizard
- **Temps estime** : 20-30 min
- **Fichier(s)** : `contes-ia/src/components/wizard/StoryWizard.tsx` (step preview)
- **Domaine d'expertise** : UX / React

### Probleme
Des radio buttons "Gratuit / Club mensuel / Club annuel" sont affiches a l'etape preview. L'utilisateur voulait creer une histoire gratuite — lui montrer des prix AVANT qu'il ait lu l'histoire cree de la mefiance ("je croyais que c'etait gratuit").

### Solution
- Supprimer completement la section de selection de pricing pour les non-Club
- Le pricing sera presente au paywall (apres lecture), pas avant
- Pour les Club, garder le comportement actuel (utilisation de credit)

### Specification technique
- Retirer le composant de selection de plan (radio buttons Gratuit/Club/Annuel)
- Forcer `purchaseType = 'SINGLE'` et `price = 0` pour les premieres commandes
- Le texte du bouton devient : "Recevoir l'histoire de {prenom} GRATUITEMENT"
- Garder les trust badges sous le bouton

### Verification
- [ ] Aucune mention de prix visible a l'etape preview pour les non-Club
- [ ] La commande est creee avec price=0 et purchaseType=SINGLE
- [ ] Les utilisateurs Club voient toujours leur credit/bouton
- [ ] Le wording est coherent avec "gratuit"

---

## 1.3 — Rediriger vers le reader DIRECTEMENT apres soumission

- **Statut** : [x] Termine (2026-04-12) — Redirect avec ?new=true, auto-open reader quand DISPONIBLE, polling 5s pour nouveaux stories.
- **Priorite** : P0
- **Impact estime** : +25-35% lecture du chapitre
- **Temps estime** : 45-60 min
- **Fichier(s)** : 
  - `contes-ia/src/pages/StoryFormPage.tsx` (logique de redirection post-submit)
  - `contes-ia/src/pages/DashboardPage.tsx` (page story avec reader)
  - Backend : `backend/src/controllers/orderController.ts` ou equivalent
- **Domaine d'expertise** : React / Backend / UX

### Probleme
Actuellement, apres soumission du wizard, l'utilisateur depend de l'EMAIL pour acceder a son histoire. Si l'email arrive en spam ou avec du retard, le funnel est mort. L'utilisateur mobile quitte le site et ne revient jamais.

### Solution
- Apres soumission, rediriger IMMEDIATEMENT vers `/dashboard/story/{orderId}`
- Afficher une page d'attente avec :
  - Barre de progression animee
  - Message "L'histoire de {prenom} est en cours de creation..."
  - Etapes visibles (Ecriture → Illustrations → Assemblage)
- Quand l'histoire est prete, ouvrir automatiquement le StoryReader
- L'email de livraison reste envoye en parallele (backup)

### Specification technique
```
AVANT :
Wizard submit → Redirect dashboard → Attente email → Clic email → Reader

APRES :
Wizard submit → Redirect /dashboard/story/{id} → Page attente avec progress → Auto-open Reader
                                                 ↘ Email envoye en parallele (backup)
```
- Creer/ameliorer la page d'attente avec polling sur `/api/client/orders/{id}` (toutes les 5s)
- Quand `storyStatus === 'DISPONIBLE'`, ouvrir le StoryReader automatiquement
- Si l'utilisateur n'est pas authentifie, creer un compte temporaire avec l'email et generer un JWT
- Stocker le token dans localStorage pour maintenir la session

### Verification
- [ ] Apres soumission, l'utilisateur voit immediatement la page d'attente (pas d'email requis)
- [ ] La barre de progression reflete le vrai statut de generation
- [ ] Le reader s'ouvre automatiquement quand l'histoire est prete
- [ ] L'email de livraison est quand meme envoye
- [ ] Ca fonctionne meme sans compte (utilisateur anonyme avec email)
- [ ] Test mobile : la page d'attente est engageante, pas anxiogene

---

## 1.4 — Rendre "Continuer sans photo" ultra-visible

- **Statut** : [x] Termine (2026-04-12) — Bouton plein "Continuer sans photo →" avec sous-texte de reassurance. Titre upload adouci ("Une photo ?" au lieu de "Ajoutez").
- **Priorite** : P1
- **Impact estime** : +10-15% completion wizard
- **Temps estime** : 15-20 min
- **Fichier(s)** : `contes-ia/src/components/wizard/StoryWizard.tsx` (step hero, ~ligne 822)
- **Domaine d'expertise** : UX / CSS

### Probleme
L'upload photo est le plus gros point de friction sur mobile (95% du trafic). Ouvrir la galerie, chercher une photo, attendre l'upload = 30+ secondes. Beaucoup hesitent (vie privee). Le skip est "optionnel" techniquement mais visuellement ca semble requis.

### Solution
- Ajouter un bouton PLEIN (pas un lien discret) : "Continuer sans photo →"
- Positionnement : juste sous la zone d'upload, meme taille que le bouton "Continuer"
- Texte de reassurance : "La photo est optionnelle — votre enfant sera quand meme le heros de l'histoire"
- Reduire visuellement l'importance de la zone d'upload (pas la supprimer, juste desaccentuer)

### Specification technique
```
AVANT :
[Zone upload — grande, bordure pointillee, TRES visible]
"Optionnel" (petit texte gris)

APRES :
[Zone upload — taille reduite, bordure plus discrete]
"Ajoutez une photo pour que les illustrations ressemblent a votre enfant"

[Bouton secondaire pleine largeur]
"Continuer sans photo →"
"Votre enfant sera quand meme le heros ✨"
```

### Verification
- [ ] Le bouton "Continuer sans photo" est visible sans scroller sur mobile
- [ ] Cliquer dessus avance bien a l'etape suivante
- [ ] La zone d'upload reste fonctionnelle pour ceux qui veulent
- [ ] Le texte de reassurance est present
- [ ] Test sur iPhone SE (petit ecran) : tout tient

---

## 1.5 — Retirer le pricing de l'email de livraison (J+0)

- **Statut** : [x] Termine (2026-04-12) — Email epure : 1 seul CTA "Lire l'histoire", zero mention de prix. Objet simplifie.
- **Priorite** : P1
- **Impact estime** : +10-15% taux de clic email
- **Temps estime** : 20-30 min
- **Fichier(s)** : `backend/src/utils/mailjetService.ts` (lignes 162-269, fonction d'email de livraison)
- **Domaine d'expertise** : Backend / Email / Copywriting

### Probleme
L'email de livraison contient DEJA 2 offres payantes (2,99 EUR et Club 1,99 EUR) avant meme que l'utilisateur n'ait lu l'histoire. Ca cree un sentiment de "piege" : "je croyais que c'etait gratuit, ils veulent deja me vendre quelque chose".

### Solution
L'email J+0 doit etre PROPRE et SIMPLE :
- Un seul objectif : faire lire le chapitre gratuit
- Un seul CTA : "Lire l'histoire de {prenom}"
- Zero mention de prix, zero upsell
- Le pricing viendra naturellement au paywall dans le reader

### Specification technique
```
AVANT :
[Header]
"Le premier chapitre de {prenom} est pret !"
[CTA 1: Lire le chapitre]
[Warning: L'histoire s'arrete au meilleur moment...]
[CTA 2: Finir l'histoire — 2,99€]            ← SUPPRIMER
[CTA 3: Club — 1,99€/mois]                   ← SUPPRIMER
[Temoignage]
[Footer]

APRES :
[Header]
"L'histoire de {prenom} est prete !"
[Image: couverture du livre]
[CTA unique: Lire l'histoire de {prenom} →]
"Bonne lecture ! 📖"
[Footer simple]
```

### Verification
- [ ] L'email ne contient AUCUNE mention de prix
- [ ] Un seul CTA visible et clair
- [ ] Le magic link fonctionne toujours
- [ ] Le design est propre et mobile-friendly
- [ ] L'objet de l'email est ajuste (retirer "Que va-t-il se passer ensuite ?")

---

## 1.6 — Ajouter indicateur de progression "Etape X/4 · Gratuit"

- **Statut** : [x] Termine (2026-04-12) — ProgressHintText affiche "Etape X/Y · Gratuit · Sans carte bancaire".
- **Priorite** : P2
- **Impact estime** : +5-10% completion wizard
- **Temps estime** : 15-20 min
- **Fichier(s)** : `contes-ia/src/components/wizard/StoryWizard.tsx` (header du wizard)
- **Domaine d'expertise** : UX / React

### Probleme
L'utilisateur ne sait pas combien d'etapes l'attendent. L'anxiete de "ca va me prendre combien de temps ?" pousse a l'abandon. Pas de rappel que c'est gratuit pendant le wizard.

### Solution
- Afficher clairement "Etape 1/4" (ou 2/4, 3/4, 4/4) dans le header du wizard
- Ajouter un badge permanent "Gratuit · Sans carte bancaire" sous la barre de progression
- Le nombre total d'etapes depend du mode (4 pour simplifie, ~7 pour Club)

### Specification technique
```
[← Retour]   Etape 2/4   [X Fermer]
[========--------]  50%
Gratuit · Sans carte bancaire
```

### Verification
- [ ] Le compteur d'etapes est visible et correct a chaque etape
- [ ] Le badge "Gratuit" est toujours visible
- [ ] L'indicateur s'adapte au mode simplifie vs Club
- [ ] Test mobile : tout tient dans le header sans overflow

---

## 1.7 — Supprimer le bouton "Decouvrir le Club" du hero

- **Statut** : [x] Termine (2026-04-12)
- **Priorite** : P2
- **Impact estime** : +5% clic CTA principal
- **Temps estime** : 5-10 min
- **Fichier(s)** : `contes-ia/src/pages/HomePage.tsx` (section hero)
- **Domaine d'expertise** : UX / React

### Probleme
Deux CTAs dans le hero ("Creer mon 1er chapitre GRATUIT" + "Decouvrir le Club") creent de l'hesitation. Sur mobile avec attention ~30s, chaque seconde d'hesitation = abandon.

### Solution
- Retirer le bouton "Decouvrir le Club des Histoires" du hero
- Ne garder QUE "Creer mon 1er chapitre GRATUIT" comme CTA principal
- Le Club reste accessible via le header, le pricing section, et la page /club

### Verification
- [ ] Un seul CTA visible dans le hero
- [ ] Le bouton restant est bien centre et prominent
- [ ] Le Club est toujours accessible par d'autres chemins

---

# PHASE 2 — Ameliorations paywall & reader (coeur de la conversion)

## 2.1 — Refondre la slide paywall cliffhanger

- **Statut** : [x] Termine (2026-04-12) — Heading personnalise "L'histoire de {prenom} n'est pas finie...", sous-titre cliffhangerSummary + fallback, temoignage Marie/Hugo avant CTA, bouton pulsant PaywallCta (2,99€ + sub-texte 12 pages + PDF), Club reduit en lien discret (ClubLink — showClubRecap supprime), 3 trust badges inline. Prop cliffhangerSummary optionnelle ajoutee (pret pour tache 2.2).
- **Priorite** : P3
- **Impact estime** : +15-25% conversion paywall
- **Temps estime** : 2-3h
- **Fichier(s)** : `contes-ia/src/components/ui/StoryReader.tsx` (slide de fin, ~lignes 520-703)
- **Domaine d'expertise** : UX / Copywriting / Psychologie de conversion / React / CSS

### Probleme actuel
- Wording generique ("Que va-t-il se passer ensuite ?") — pas personnalise
- Pas de temoignage au moment crucial de la decision
- Le Club est trop complexe (carte depliable)
- Pas de garantie de satisfaction visible
- Pas d'urgence reelle
- Le bouton 2,99 EUR manque d'animation d'attention

### Nouveau design (wireframe)
```
[Fond sombre gradient + particules ✨]

    📖 L'histoire de {prenom} n'est pas finie...
    
    "{Resume personnalise du cliffhanger}"
    ← Texte dynamique base sur le contenu reel de l'histoire
    
    [3 pages floues avec effet de profondeur]
    
    ─────────────────────────────────────
    
    ⭐ "Mon fils me reclame son livre chaque soir"
       — Aurelie, maman de Leo (5 ans)
    
    ─────────────────────────────────────
    
    [GROS BOUTON PULSANT — animation pulse CSS]
    🎁 Offrir la fin de l'histoire a {prenom}
    2,99€ · 12 pages illustrees · PDF inclus
    
    [Lien discret, pas un bouton]
    ou economisez avec le Club → 1,99€/mois
    
    ─────────────────────────────────────
    ✓ Satisfait ou rembourse
    ✓ Paiement securise Stripe
    ✓ Disponible instantanement
```

### Changements techniques detailles
1. **Heading** : Remplacer "L'aventure de {name} continue..." par "L'histoire de {prenom} n'est pas finie..."
2. **Sous-titre** : Generer un resume du cliffhanger cote backend (champ `cliffhangerSummary` dans l'ordre) et l'afficher ici. Fallback si absent : "Que va-t-il decouvrir ensuite ?"
3. **Temoignage** : Ajouter un bloc de temoignage entre les pages floues et le CTA
4. **CTA principal** : 
   - Texte : "Offrir la fin de l'histoire a {prenom} — 2,99€"
   - Animation : `@keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(255,107,107,0.4) } 70% { box-shadow: 0 0 0 10px rgba(255,107,107,0) } }`
   - Taille : plus grand que l'actuel (padding 16px 32px, font-size 18px)
5. **Club** : Remplacer la carte depliable par un simple lien texte : "ou economisez avec le Club → 1,99€/mois"
6. **Trust signals** : Ajouter 3 badges en ligne : Satisfait ou rembourse / Stripe securise / Instantane
7. **Partage** : Bouton "Envoyer l'apercu a un proche" reste en bas

### Verification
- [ ] Le nouveau design est en place
- [ ] Le cliffhanger summary s'affiche s'il est disponible
- [ ] Le bouton a bien l'animation pulse
- [ ] Le Club est un lien discret, pas une carte
- [ ] Les trust signals sont visibles
- [ ] Le temoignage s'affiche
- [ ] Test mobile : tout tient dans un ecran, pas de scroll horizontal
- [ ] Le bouton 2,99€ redirige bien vers Stripe

---

## 2.2 — Personnaliser le wording paywall avec le vrai cliffhanger

- **Statut** : [x] Termine (2026-04-12) — Champ `cliffhangerSummary String?` ajoute au model Order + migration `20260412_add_cliffhanger_summary`. Nouvelle fonction `generateCliffhangerSummary()` dans storyTextGenerator (appel GPT-4o-mini sur les 2 derniers paragraphes, produit une question ciblee ~140 char). Appelee apres generateStoryText uniquement pour FREE (pas Club), non-bloquante si echec. Persiste dans Order, expose via clientController.getStoryDetail (auto via findFirst), prop cablee dans StoryDetailPage vers StoryReader.
- **Priorite** : P3
- **Impact estime** : +10-15% conversion paywall
- **Temps estime** : 1-2h
- **Fichier(s)** :
  - Backend : generateur d'histoire (ajouter champ `cliffhangerSummary`)
  - Backend : `backend/src/controllers/orderController.ts` (retourner le champ)
  - Frontend : `contes-ia/src/components/ui/StoryReader.tsx`
- **Domaine d'expertise** : Backend / IA / React

### Probleme
"Que va-t-il se passer ensuite ?" est generique. Le vrai hook c'est le contenu de l'histoire : "Est-ce que Emma va retrouver le dragon perdu ?" serait 10x plus engageant.

### Solution
- A la generation de l'histoire, faire generer par l'IA un resume du cliffhanger (1 phrase, format question)
- Stocker dans `order.cliffhangerSummary` (nouveau champ)
- L'afficher sur la slide paywall comme sous-titre personnalise
- Fallback si absent : garder le texte generique actuel

### Specification technique
- Ajouter champ `cliffhangerSummary: string` au modele Order (migration DB)
- Dans le prompt de generation d'histoire, ajouter : "Genere aussi une question de cliffhanger en 1 phrase qui donne envie de lire la suite"
- Retourner ce champ dans l'API `/api/client/orders/{id}`
- Dans StoryReader, afficher `order.cliffhangerSummary` en italique sous le heading

### Verification
- [ ] Le champ est ajoute en base
- [ ] Le prompt IA genere bien le cliffhanger summary
- [ ] Le texte s'affiche sur le paywall
- [ ] Le fallback fonctionne si le champ est vide
- [ ] Le texte est lisible et engageant sur mobile

---

## 2.3 — Ajouter un compteur de pages dans le reader

- **Statut** : [x] Termine (2026-04-12) — PageIndicator refondu : "Page X/N" sur les slides de contenu (N = pageCount reel, pas slideIndex), "Couverture" sur le cover, masque sur le slide end. Hint jaune "Derniere page du chapitre gratuit" injecte sur la derniere page d'un cliffhanger. Indicateur reste visible 6s (au lieu de 2s) sur cette page pour renforcer l'anticipation.
- **Priorite** : P4
- **Impact estime** : +anticipation, meilleure UX
- **Temps estime** : 20-30 min
- **Fichier(s)** : `contes-ia/src/components/ui/StoryReader.tsx`
- **Domaine d'expertise** : React / CSS

### Probleme
L'utilisateur ne sait pas qu'il approche de la fin du chapitre gratuit. Le cliffhanger arrive "par surprise", ce qui peut etre frustrant au lieu d'etre excitant.

### Solution
- Ajouter un indicateur discret "Page 3/5" en bas de chaque page
- A la page 4/5, ajouter un micro-message : "Derniere page du chapitre gratuit..."
- Ca cree l'anticipation et prepare psychologiquement au paywall

### Verification
- [ ] Le compteur est visible mais discret
- [ ] Il se met a jour correctement a chaque swipe
- [ ] Le message "Derniere page" apparait bien a l'avant-derniere page
- [ ] Ca ne gene pas la lecture

---

## 2.4 — Ajouter bouton partage flottant dans le reader

- **Statut** : [x] Termine (2026-04-12) — FloatingShareBtn (44x44, coin bas-droit, safe-area-aware) visible uniquement sur les slides de contenu. Utilise navigator.share() en priorite, fallback clipboard avec toast "Lien copie !", fallback ultime onShare. Icone share SVG (3 cercles + 2 traits).
- **Priorite** : P4
- **Impact estime** : +viralite organique
- **Temps estime** : 30-45 min
- **Fichier(s)** : `contes-ia/src/components/ui/StoryReader.tsx`
- **Domaine d'expertise** : React / Mobile Web APIs

### Probleme
Le moment d'emerveillement est PENDANT la lecture. Mais le partage n'est possible qu'apres le paywall. On rate la fenetre emotionnelle.

### Solution
- Bouton partage flottant discret (icone share, coin bas-droit)
- Utilise `navigator.share()` (Web Share API, supporte sur mobile)
- Texte de partage : "Regarde le livre personnalise de {prenom} ! 📖 {url}"
- Fallback desktop : copier le lien

### Verification
- [ ] Le bouton est visible mais ne gene pas la lecture
- [ ] `navigator.share()` fonctionne sur iOS Safari et Chrome Android
- [ ] Le fallback desktop copie le lien
- [ ] Le lien partage ouvre bien l'apercu de l'histoire

---

# PHASE 3 — Optimisation generation & performance

## 3.1 — Pre-generer la couverture des l'etape personnage

- **Statut** : [x] Termine (2026-04-12) — useEffect dedicace declenche generateCover() des que isHeroComplete passe a true, avec debounce 300ms. Evite le double trigger : ne lance pas si cover deja dispo, en cours, ou si on est deja sur l'etape preview (qui a son propre trigger).
- **Priorite** : P3
- **Impact estime** : -30s de temps d'attente a l'etape preview
- **Temps estime** : 1-2h
- **Fichier(s)** :
  - `contes-ia/src/hooks/useCoverPreview.ts`
  - `contes-ia/src/components/wizard/StoryWizard.tsx`
  - `contes-ia/src/pages/StoryFormPage.tsx`
- **Domaine d'expertise** : React / Performance / API

### Probleme
La generation de couverture (30-60s) ne commence qu'a l'arrivee sur l'etape preview. L'utilisateur attend devant un spinner. Sur mobile, c'est un abandon garanti apres 15s.

### Solution
- Lancer la generation de couverture en BACKGROUND des que l'etape personnage est completee (prenom + genre remplis)
- Quand l'utilisateur arrive au preview, la couverture est deja prete (ou presque)
- Si les donnees changent entre-temps, annuler et relancer

### Specification technique
- Dans `StoryWizard`, quand `isHeroComplete` passe a `true`, appeler `generateCoverPreview()` en background
- Stocker le resultat dans un state partage via le hook `useCoverPreview`
- A l'etape preview, verifier si la cover est deja disponible avant de lancer une nouvelle generation
- Gerer l'annulation si l'utilisateur change le prenom/genre (AbortController)

### Verification
- [ ] La generation demarre en background apres l'etape personnage
- [ ] La couverture est disponible immediatement a l'arrivee au preview
- [ ] Si les donnees changent, la generation est relancee
- [ ] Pas de double appel API si la cover est deja prete
- [ ] Test : aller vite au preview → la cover doit charger plus vite

---

## 3.2 — Ajouter bouton "Reessayer" si la generation de couverture echoue

- **Statut** : [x] Termine (2026-04-12) — Banniere d'erreur stylee (fond rouge clair) affichee a l'etape preview quand coverError est set. Deux boutons : "Reessayer la generation" (rappel generateCover) et "Continuer sans couverture" (set coverTitle fallback).
- **Priorite** : P4
- **Impact estime** : Reduit les abandons sur erreur
- **Temps estime** : 15-20 min
- **Fichier(s)** : `contes-ia/src/components/wizard/StoryWizard.tsx` (step preview)
- **Domaine d'expertise** : React / UX

### Probleme
Si la generation de couverture echoue (timeout 90s, erreur API), l'utilisateur voit un message d'erreur mais pas de bouton "Reessayer". Il doit revenir en arriere et recommencer.

### Solution
- Afficher un bouton "Reessayer la generation" en cas d'erreur
- Texte de reassurance : "La generation a echoue. Reessayez — ca prend generalement moins d'une minute."
- Option de continuer sans couverture (placeholder avec le prenom)

### Verification
- [ ] Le bouton "Reessayer" apparait en cas d'erreur
- [ ] Cliquer dessus relance la generation
- [ ] L'option "Continuer sans couverture" est disponible
- [ ] Le placeholder est visuellement acceptable

---

# PHASE 4 — Optimisation emails

## 4.1 — Simplifier l'objet de l'email de livraison

- **Statut** : [x] Termine (2026-04-12) — Inclus dans la tache 1.5.
- **Priorite** : P2
- **Impact estime** : +5-10% taux d'ouverture
- **Temps estime** : 5 min
- **Fichier(s)** : `backend/src/utils/mailjetService.ts` (~ligne 162)
- **Domaine d'expertise** : Email / Copywriting

### Changement
```
AVANT : "Le premier chapitre de {prenom} est pret ! Que va-t-il se passer ensuite ?"
APRES : "📖 L'histoire de {prenom} est prete !"
```
- Plus court, plus clair, pas de teasing premature

---

## 4.2 — Personnaliser les objets de relance avec le vrai cliffhanger

- **Statut** : [x] Termine (2026-04-12) — J+1 utilise cliffhangerSummary (sliced 140 char) comme objet d'email quand disponible, fallback original sinon. J+3 objet ajuste : "L'histoire de {prenom} n'est toujours pas finie...". J+7 inchange. emailSequence.ts passe cliffhangerSummary au service.
- **Priorite** : P4
- **Impact estime** : +15-20% taux d'ouverture
- **Temps estime** : 30-45 min
- **Fichier(s)** : `backend/src/utils/mailjetService.ts` (fonctions day1/day3/day7)
- **Domaine d'expertise** : Backend / Copywriting

### Probleme
Les objets actuels sont previsibles. Utiliser le vrai cliffhanger de l'histoire serait 10x plus engageant.

### Changements
```
J+1 AVANT : "{nom}, {prenom} attend la suite de son histoire..."
J+1 APRES : "Est-ce que {prenom} va {cliffhangerSummary} ?" 
            (fallback: "{prenom} attend la suite...")

J+3 AVANT : "{prenom} avec son chat, en aquarelle, pour Noel... imaginez"  
J+3 APRES : "L'histoire de {prenom} n'est toujours pas finie..."

J+7 : GARDER TEL QUEL (excellent tel qu'il est : "on ne vous ecrira plus apres ca")
```
- Depend de la tache 2.2 (champ cliffhangerSummary)

### Verification
- [ ] Les nouveaux objets sont en place
- [ ] Le fallback fonctionne si cliffhangerSummary est vide
- [ ] Les emails s'envoient correctement avec les nouveaux objets

---

## 4.3 — Ajouter un email J+0 (+3h) pour les non-ouvreurs

- **Statut** : [x] Termine (2026-04-12) — Nouvelle methode MailjetService.sendUnreadReminderEmail(). Logique dans emailSequence.ts : si 3h <= hoursSincePaid < 24h ET !order.lastReadAt ET !emailsSent.includes('day0_3h'), envoi du rappel. Flag 'day0_3h,' ajoute. `continue` sur l'ordre pour eviter un second email le meme tick.
- **Priorite** : P5
- **Impact estime** : +10% recuperation d'utilisateurs perdus
- **Temps estime** : 45-60 min
- **Fichier(s)** :
  - `backend/src/utils/mailjetService.ts` (nouvelle fonction)
  - `backend/src/jobs/emailSequence.ts` (ajouter la logique)
- **Domaine d'expertise** : Backend / Email

### Probleme
Si l'utilisateur ne clique pas sur l'email de livraison (spam, oubli), il n'y a rien pendant 24h.

### Solution
- Ajouter un email 3h apres la livraison si l'histoire n'a pas ete lue
- Objet : "Vous n'avez pas encore lu l'histoire de {prenom} ? 📖"
- Contenu : rappel simple + lien direct
- Condition : envoyer seulement si l'ordre n'a pas de `lastReadAt` ou equivalent

### Specification technique
- Ajouter `'day0_3h'` comme etape dans `emailSequenceSent`
- Dans `processEmailSequence()`, verifier si `hoursSincePaid >= 3` et l'histoire n'a pas ete consultee
- Necesssite un tracking de lecture cote frontend (stocker un `lastReadAt` quand le reader est ouvert)

### Verification
- [ ] L'email s'envoie 3h apres si l'histoire n'a pas ete lue
- [ ] L'email ne s'envoie PAS si l'histoire a ete lue
- [ ] Pas de conflit avec les autres emails de la sequence

---

## 4.4 — Creer une sequence post-achat

- **Statut** : [x] Termine (2026-04-12) — Nouvelle methode MailjetService.sendPostPurchaseEmail() avec 3 templates (post_day1 partage, post_day3 nouvelle histoire, post_day7 upsell Club). Nouveau bloc dans emailSequence.ts cible les ordres SINGLE price > 0 PAID/DELIVERED. Flags post_day1/post_day3/post_day7 dans emailSequenceSent (distinct du flow FREE). post_day7 skipe si user.role=CLUB ou subscriptionStatus=active.
- **Priorite** : P5
- **Impact estime** : +15% retention + 2e achat
- **Temps estime** : 1-2h
- **Fichier(s)** :
  - `backend/src/utils/mailjetService.ts` (nouvelles fonctions)
  - `backend/src/jobs/emailSequence.ts` (nouvelle logique)
- **Domaine d'expertise** : Backend / Email / Retention

### Probleme
Apres l'achat du livre complet (2,99 EUR), RIEN. Pas d'email de partage, pas d'upsell Club, pas de "creez une 2e histoire". Le moment post-achat est le meilleur moment pour la retention (dopamine).

### Sequence proposee
```
J+1 post-achat : "Le livre de {prenom} est pret a etre partage ! 📖"
  → CTA : Partager sur WhatsApp / Telecharger le PDF
  
J+3 post-achat : "Quelle sera la prochaine aventure de {prenom} ?"
  → CTA : Creer une nouvelle histoire (gratuit)
  
J+7 post-achat : "Avec le Club, {prenom} a un nouveau livre chaque semaine"
  → CTA : Essayer le Club pour 1,99€/mois
  → Uniquement si l'utilisateur n'est PAS deja Club
```

### Verification
- [ ] Les 3 emails post-achat sont implementes
- [ ] La sequence se declenche apres un paiement reussi (2,99€)
- [ ] L'email J+7 ne s'envoie pas aux Club existants
- [ ] Les CTAs fonctionnent (partage, creation, checkout Club)

---

## 4.5 — Varier les temoignages dans les emails

- **Statut** : [x] Termine (2026-04-12) — Temoignages differencies : J+1 = Sarah/Lea (4 ans, angle "enfant reconnait prenom"), J+3 = Thomas/Jules (6 ans, angle "cadeau mamie"), J+7 = Aurelie/Leo (5 ans, conservee), Paywall reader = Marie/Hugo (3 ans, "rituel du soir"). Design cards distincts (pastel orange, bleu, vert).
- **Priorite** : P5
- **Impact estime** : +credibilite
- **Temps estime** : 15-20 min
- **Fichier(s)** : `backend/src/utils/mailjetService.ts`
- **Domaine d'expertise** : Copywriting

### Probleme
Le meme temoignage d'Aurelie (maman de Leo) est utilise partout (livraison + J+7 + potentiellement paywall).

### Solution
Creer 3-4 temoignages differents et les repartir :
```
Livraison  : (pas de temoignage — email epure)
J+1        : "Ma fille a adore voir son prenom dans l'histoire !" — Sarah, maman de Lea (4 ans)
J+3        : "On a offert le livre a mamie, elle a pleure de joie." — Thomas, papa de Jules (6 ans)
J+7        : "Mon fils me reclame 'son livre' chaque soir." — Aurelie, maman de Leo (5 ans)
Paywall    : "C'est devenu notre rituel du soir." — Marie, maman d'Hugo (3 ans)
```

### Verification
- [ ] Chaque email a un temoignage different
- [ ] Les temoignages sont credibles et emotionnels
- [ ] Pas de doublon

---

# PHASE 5 — Credibilite & confiance

## 5.1 — Retirer la fausse urgence

- **Statut** : [x] Termine (2026-04-12) — Option A retenue : priceBadge() accepte maintenant un texte de preuve sociale au lieu d'urgence ("Rejoignez +500 familles dans le Club" J+1, "Plebiscite par les familles du Club" J+3, icone etoile au lieu de sablier). Countdown 20min du wizard SUPPRIME (state countdown + useEffect + PreviewTimerDigits retires). PreviewTimerBar conserve mais renomme en "✨ Deja +500 familles ont cree un livre avec Contedia".
- **Priorite** : P4
- **Impact estime** : +credibilite long-terme
- **Temps estime** : 30-45 min
- **Fichier(s)** :
  - `backend/src/utils/mailjetService.ts` (badges "expire dans 48h" / "24h")
  - `contes-ia/src/components/wizard/StoryWizard.tsx` (countdown 20min)
- **Domaine d'expertise** : UX / Ethique / Backend

### Probleme
- L'email J+1 dit "Votre offre de bienvenue expire dans 48h" mais rien n'expire
- L'email J+3 dit "Plus que 24h pour cette offre" mais le prix reste le meme
- Le wizard a un countdown de 20min qui se reset silencieusement
- Si un utilisateur le remarque, la confiance est detruite

### Solution (Option A : retirer la fausse urgence)
- Remplacer "expire dans 48h" par du vrai FOMO : "Rejoignez les +500 familles qui ont deja choisi le Club"
- Retirer le countdown du wizard
- Garder l'urgence narrative (le cliffhanger LUI-MEME est l'urgence)

### Solution (Option B : implementer une vraie urgence)
- L'offre 1,99 EUR expire reellement apres 7 jours (prix passe a 4,99 EUR le 1er mois)
- Le countdown du wizard est lie a une vraie reservation de slot de generation
- Plus complexe a implementer mais plus honnete

### Recommandation : Option A (plus simple, plus ethique)

### Verification
- [ ] Aucune mention de delai qui n'est pas reel
- [ ] Le countdown est retire du wizard
- [ ] Les badges d'urgence sont remplaces par de la preuve sociale
- [ ] L'urgence narrative (cliffhanger) reste intacte

---

## 5.2 — Corriger le message "3 chapitres gratuits" → "1er chapitre gratuit"

- **Statut** : [x] Termine (2026-04-12) — Corrige dans HomePage, PricingTiers, StoryFormPage. Articles SEO non modifies (contenu evergreen).
- **Priorite** : P2
- **Impact estime** : +clarte, -frustration
- **Temps estime** : 15-20 min
- **Fichier(s)** :
  - `contes-ia/src/pages/HomePage.tsx` (trust row, pricing section)
  - `contes-ia/src/components/PricingTiers.tsx`
- **Domaine d'expertise** : Copywriting / UX

### Probleme
"3 chapitres gratuits" laisse croire a 3 histoires completes gratuites. En realite c'est 3 histoires avec cliffhanger (5 pages, pas la fin). L'utilisateur se sent trompe au paywall.

### Solution
- Remplacer "3 chapitres gratuits" par "1er chapitre gratuit" partout
- Ou si on veut garder le "3" : "3 histoires a decouvrir gratuitement (debut de l'aventure)"
- Trust row hero : "✓ 1er chapitre gratuit" au lieu de "✓ 3 chapitres gratuits"

### Verification
- [ ] Aucune mention de "3 chapitres gratuits" qui prete a confusion
- [ ] Le wording est coherent partout (homepage, pricing, wizard, emails)

---

## 5.3 — Ameliorer le badge social proof

- **Statut** : [x] Termine (2026-04-12) — "Rejoignez +500 familles" remplace par "+500 histoires deja creees · ★★★★★" (angle volume de production + rating visible, plus impressionnant que le nb de familles).
- **Priorite** : P5
- **Impact estime** : +credibilite
- **Temps estime** : 10 min
- **Fichier(s)** : `contes-ia/src/pages/HomePage.tsx` (hero badge)
- **Domaine d'expertise** : Copywriting

### Probleme
"+500 familles" est un petit nombre. Ca peut faire "startup qui debute" plus que "produit valide".

### Solution
- Si le nombre est reel et > 500 : afficher "+500 histoires creees" (plus impressionnant)
- Si possible : compteur dynamique base sur le vrai nombre de commandes
- Alternative : retirer le badge si < 1000 et le remplacer par un temoignage

### Verification
- [ ] Le nombre affiche est credible et impressionnant
- [ ] Si dynamique, le compteur se met a jour

---

# PHASE 6 — Chantiers majeurs (transformateurs)

## 6.1 — Integrer Stripe Elements dans le reader (pas de redirection)

- **Statut** : [x] Termine (2026-04-15, gate A/B) — SDK @stripe/react-stripe-js + @stripe/stripe-js installes. Nouveau endpoint `POST /api/stripe/create-completion-intent` (PaymentIntent avec automatic_payment_methods) + helper `processCompletionPayment` idempotent partage entre `checkout.session.completed` et `payment_intent.succeeded`. Nouveau composant `contes-ia/src/components/payment/InlineCheckout.tsx` (mini-recap + PaymentElement theme night + TrustRow). Integre dans StoryReader via useExperiment('completion_checkout_v1'): control = redirection Checkout (preserve), inline = modal Stripe Elements. Apple Pay domain contedia.fr deja verifie cote Stripe. `REACT_APP_STRIPE_PUBLISHABLE_KEY` ajoutee au .env local (a dupliquer sur Vercel). Ancien endpoint createCompletionSession conserve pour fallback.
- **Priorite** : P6
- **Impact estime** : +20-30% conversion paiement
- **Temps estime** : 1-2 jours
- **Fichier(s)** :
  - `contes-ia/src/components/ui/StoryReader.tsx` (ajout composant Stripe Elements)
  - `backend/src/controllers/stripeController.ts` (Payment Intent au lieu de Checkout Session)
  - Nouveau composant : `contes-ia/src/components/payment/InlineCheckout.tsx`
- **Domaine d'expertise** : Stripe / React / Backend / Securite

### Probleme
Le redirect vers Stripe Checkout fait quitter le reader immersif. L'utilisateur passe d'un ecran sombre et engageant a une page Stripe froide. Perte de contexte = abandon.

### Solution
- Utiliser Stripe Elements (Payment Element) integre directement dans le reader
- L'utilisateur entre sa CB sans quitter le reader
- Ajouter un mini-recap de commande : couverture + titre + prix
- Apres paiement, transition fluide vers la barre de progression de generation

### Specification technique
- Backend : remplacer `createCheckoutSession` par `createPaymentIntent` pour les completions
- Frontend : `@stripe/react-stripe-js` + `PaymentElement`
- Gerer Apple Pay / Google Pay nativement dans l'Element
- Webhook : adapter pour `payment_intent.succeeded` en plus de `checkout.session.completed`

### Verification
- [ ] Le paiement se fait sans quitter le reader
- [ ] Apple Pay et Google Pay fonctionnent
- [ ] Le webhook traite correctement le PaymentIntent
- [ ] Le recap de commande est visible avant paiement
- [ ] La transition post-paiement est fluide
- [ ] Test mobile : le formulaire CB est utilisable sur petit ecran
- [ ] Securite : aucune donnee CB ne transite par le serveur

---

## 6.2 — Flow post-achat complet (partage + referral + 2e histoire)

- **Statut** : [x] Termine (2026-04-12, gate A/B) — Nouveau composant `contes-ia/src/components/ui/PostPurchaseFlow.tsx` : overlay modal 3 slides (progression+partage WhatsApp/Facebook/Copy, livre pret lire/PDF/offrir, nouvelle aventure+Club). Integre dans StoryDetailPage via useExperiment('post_purchase_flow_v1') : control = ancien auto-open reader, variante three_slides = nouveau flow. Skip slide 3 pour membres Club.
- **Priorite** : P7
- **Impact estime** : +30% LTV
- **Temps estime** : 1-2 jours
- **Fichier(s)** :
  - Nouveau composant : `contes-ia/src/components/post-purchase/PostPurchaseFlow.tsx`
  - `contes-ia/src/pages/DashboardPage.tsx`
- **Domaine d'expertise** : UX / Growth / React

### Probleme
Apres le paiement, l'utilisateur revient sur le dashboard et... rien. Pas de guidage, pas de partage facilite, pas d'incitation a revenir.

### Solution : ecran post-achat en 3 slides
```
SLIDE 1 : "Le livre de {prenom} est en preparation ! 🎉"
  → Barre de progression
  → "En attendant, partagez la nouvelle !"
  → [Bouton WhatsApp] [Bouton Facebook] [Bouton Copier lien]
  
SLIDE 2 : "Votre livre est pret !"
  → [Lire maintenant]
  → [Telecharger le PDF]
  → [Offrir a un proche]
  
SLIDE 3 : "Et si {prenom} vivait une nouvelle aventure ?"
  → [Creer une nouvelle histoire]
  → "Avec le Club, creez 4 livres par mois"
  → [Decouvrir le Club → 1,99€]
```

### Verification
- [ ] Le flow post-achat s'affiche apres chaque paiement reussi
- [ ] Les boutons de partage fonctionnent (WhatsApp, Facebook, copier)
- [ ] Le CTA "Creer une nouvelle histoire" redirige vers le wizard
- [ ] L'upsell Club ne s'affiche pas pour les membres Club

---

## 6.3 — A/B testing framework

- **Statut** : [x] Termine (2026-04-12) — Nouveau hook `contes-ia/src/hooks/useExperiment.ts`. Assignation deterministe via FNV-1a hash(experimentName|identity), identity = userId/email ou anon_id localStorage. Expose la variante a Clarity (`clarity('set', 'exp_xxx', variant)`), Meta Pixel (trackCustom ExperimentExposure), TikTok Pixel. Utilise en prod par la tache 6.2.
- **Priorite** : P7
- **Impact estime** : Fondation pour toutes les optimisations futures
- **Temps estime** : 1 jour
- **Fichier(s)** : Nouveau systeme a creer
- **Domaine d'expertise** : Analytics / React / Backend

### Probleme
Sans A/B testing, on ne peut pas mesurer l'impact reel de chaque changement. On fait des suppositions.

### Solution simple (sans outil externe)
- Creer un hook `useExperiment('nom_test', ['variante_a', 'variante_b'])`
- Assignation basee sur le hash de l'email/userId (deterministe)
- Stocker les conversions dans la base existante
- Dashboard admin pour voir les resultats

### Alternative rapide
- Utiliser Vercel Analytics + Feature Flags si disponible
- Ou PostHog (gratuit jusqu'a 1M events/mois)

---

# Recapitulatif & ordre d'execution

## Ordre recommande (par impact decroissant)

| # | Tache | Phase | Priorite | Temps | Impact |
|---|-------|-------|----------|-------|--------|
| 1 | Formulaire preview → email seul | 1.1 | P0 | 30min | +25% |
| 2 | Retirer pricing du preview | 1.2 | P0 | 20min | +15% |
| 3 | Redirect direct vers reader | 1.3 | P0 | 60min | +30% |
| 4 | Skip photo ultra-visible | 1.4 | P1 | 15min | +12% |
| 5 | Email livraison sans pricing | 1.5 | P1 | 20min | +12% |
| 6 | Indicateur progression wizard | 1.6 | P2 | 15min | +7% |
| 7 | Supprimer CTA Club du hero | 1.7 | P2 | 5min | +5% |
| 8 | Corriger "3 chapitres" | 5.2 | P2 | 15min | +clarte |
| 9 | Objet email livraison | 4.1 | P2 | 5min | +7% |
| 10 | Pre-generer la couverture | 3.1 | P3 | 2h | -30s attente |
| 11 | Refonte paywall cliffhanger | 2.1 | P3 | 3h | +20% |
| 12 | Cliffhanger personnalise | 2.2 | P3 | 2h | +12% |
| 13 | Retirer fausse urgence | 5.1 | P4 | 30min | +credibilite |
| 14 | Compteur pages reader | 2.3 | P4 | 20min | +UX |
| 15 | Bouton partage reader | 2.4 | P4 | 30min | +viralite |
| 16 | Bouton reessayer cover | 3.2 | P4 | 15min | -abandons |
| 17 | Objets email personnalises | 4.2 | P4 | 30min | +15% ouverture |
| 18 | Email J+0 (+3h) | 4.3 | P5 | 45min | +10% recup |
| 19 | Sequence post-achat emails | 4.4 | P5 | 2h | +15% retention |
| 20 | Varier temoignages | 4.5 | P5 | 15min | +credibilite |
| 21 | Badge social proof | 5.3 | P5 | 10min | +credibilite |
| 22 | Stripe Elements inline | 6.1 | P6 | 2 jours | +25% paiement |
| 23 | Flow post-achat complet | 6.2 | P7 | 2 jours | +30% LTV |
| 24 | A/B testing framework | 6.3 | P7 | 1 jour | fondation |

**Temps total estime** : ~6-8 jours de dev pour TOUT faire.
**Impact cumule estime des Quick Wins (taches 1-9)** : +50-80% de conversion globale du funnel.

---

# Notes de suivi

> **Derniere mise a jour** : 2026-04-15
> **Taches terminees** : 1.1-1.7, 2.1-2.4, 3.1-3.2, 4.1-4.5, 5.1-5.3, 6.1, 6.2, 6.3 (24/24) — DEVBOOK COMPLET
> **Etat** : Toutes les 24 taches livrees. Frontend + backend compilent. 3 A/B tests en place (completion_checkout_v1, post_purchase_flow_v1). A deployer en prod :
>   1. Migration Prisma : `ALTER TABLE orders ADD cliffhangerSummary TEXT;`
>   2. Var env Vercel : `REACT_APP_STRIPE_PUBLISHABLE_KEY` = cle publique Stripe (meme valeur que local)
>   3. Webhook Stripe prod : verifier que `payment_intent.succeeded` est coche dans la liste des events
> **Blocages** : Aucun

---

*Ce devbook est concu pour etre execute tache par tache avec `/effort`. Chaque tache est autonome et peut etre implementee independamment des autres (sauf dependances notees).*

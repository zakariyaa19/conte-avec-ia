Cahier des charges - Projet Contes d’IA

I. Design et Expérience Utilisateur

1. Design général du site utilise boo

Le design repose sur une palette de couleurs pastel, douce et accueillante, qui évoque le monde de l'enfance et des contes de fées.
Palette de couleurs :
Couleur de fond principale : Un blanc cassé ou un crème très clair.
Couleurs d'accentuation : Des tons doux comme un rose corail, un bleu pastel et un jaune pâle. Ces couleurs sont utilisées pour les boutons "Call-to-Action", les icônes et les éléments mis en évidence.
Couleur du texte : Un gris-noir ou un brun foncé.
Typographie :
Utiliser une combinaison de deux polices : une police avec des empattements ronds (type Baloo 2 ou similaire) pour les titres et une police sans empattement plus simple (type Poppins ou Inter) pour les corps de texte.
Éléments graphiques et visuels :
Boutons : Formes arrondies avec des ombres subtiles.
Cartes de sélection : Utiliser des "cartes" rectangulaires aux coins arrondis pour les options du formulaire, avec un effet visuel au survol ou à la sélection.
Icônes : Icônes simples et stylisées, souvent dans les couleurs d'accentuation.
Agencement et espacement :
Utiliser un espacement généreux (espace blanc) pour un design aéré et minimaliste.
Organiser le contenu en grilles et colonnes pour une structure claire.

2. Structure du site

Pages principales : Créer les pages suivantes :
Page d'accueil (Home) avec Formulaire de commande en trois étapes.
Page de connexion.


II. Développement Front-end

1. Navigation et Sections Statiques
En-tête :
Création du header avec le logo cliquable.
Mise en place de la navigation principale (Accueil, Exemples, Tarifs, Aide / FAQ).
Création du bouton "Créez un conte" en tant que Call-to-Action.
Le header et la navigation doivent être entièrement "responsive".

Pied de page : Création du footer avec les liens obligatoires (Mentions légales, Politique de confidentialité, CGV, Contact) et les icônes de réseaux sociaux.

Sections de la page d'accueil :
Tarifs : Affichage clair des prix (eBook, Livre relié) et des promotions.
FAQ : Mise en place d'un système de type accordéon pour les questions/réponses.
Témoignages : Mise en avant d'avis clients.

2. Formulaire de Commande (Processus en 3 Étapes)

Étape 1 - Choix du Thème :
Tranche d'âge : 0–2 ans, 3–5 ans, 6–9 ans, 10+ ans.
Thème général : Éducatif, Contes de fées, Activités, Histoires, Fêtes, Famille.
Sujet précis : Contes de fées, Mondes fantastiques, Licornes, Princes et princesses, Chevaliers et dragons, École de sorciers.
Message central : Amitié, Courage, Prendre soin de la nature, Amour, Persévérance, Partage, Honnêteté, Respect.
Style d’illustration : Aquarelle, Animation 3D, Monde des blocs, Anime doux, Papier découpé, Clay-animation, Kawaii, Géométrique, Livre illustré.

Étape 2 - Détails du Protagoniste :
Création du champ de texte pour le nom du protagoniste, son age, ca couleur de yeux, couleur cheuveux,
Ajout des champs pour le personnage secondaire (nom, âge).
Implémentation de l'interface de téléversement pour la photo.

Étape 3 - Paiement :
Affichage du récapitulatif des choix de l'utilisateur.
Création des options de produit (eBook, Livre relié).
Logique de navigation : Coder la fonctionnalité qui permet à l'utilisateur de se déplacer entre les trois étapes du formulaire.


III. Intégrations et Logique Métier

1. Traitement des commandes
Intégration Stripe : Mettre en place la logique de paiement via Stripe.
Base de données : Mettre en place une base de données pour stocker les informations de commande après un paiement réussi.
Email de confirmation : Coder le système qui envoie une confirmation de commande par email au client.

2. Panneau d'administration
Interface : Créer l'interface d'accès administrateur.
Affichage : Connecter le panneau à la base de données pour afficher la liste des commandes à traiter.


IV. Technologies et Outils Recommandés

Le projet doit être développé avec Next.js (React) pour le front-end, accompagné de Tailwind CSS afin de garantir un design moderne, responsive et facilement personnalisable selon la charte graphique pastel définie. Le back-end sera géré en Node.js avec Express (ou via des fonctions serverless sur Vercel/Netlify), car cette stack est performante, largement adoptée et dispose de nombreuses intégrations prêtes à l’emploi. La base de données sera en PostgreSQL (via Supabase) pour bénéficier de la robustesse relationnelle et de la simplicité du cloud managé. Les paiements seront intégrés avec Stripe Checkout, reconnu comme la solution la plus fiable et sécurisée du marché.

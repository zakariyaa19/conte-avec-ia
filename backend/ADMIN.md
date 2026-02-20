# Administration — Contes d'IA

## Identifiants admin (dev)

| Email | Mot de passe | Role |
|-------|-------------|------|
| `contact@contedia.fr` | `Admin2024!` | SUPER_ADMIN |

## Commandes utiles

```bash
# Reset complet de la base (supprime tout + recree admin)
npm run db:reset

# Seed avec donnees de test
npm run db:seed

# Pousser le schema Prisma vers la DB
npm run db:push

# Ouvrir Prisma Studio (GUI)
npm run db:studio
```

## Architecture auth

### 2 tables, 2 JWT

| Table | Secret JWT | Duree | Usage |
|-------|-----------|-------|-------|
| `AdminUser` | `JWT_SECRET` | 24h | Panel admin |
| `User` | `JWT_CLIENT_SECRET` | 7j | Espace client |

### Endpoint unifie

`POST /api/auth/unified-login` — essaie AdminUser en priorite, puis User.

Reponse :
```json
{
  "success": true,
  "data": {
    "token": "...",
    "userType": "admin" | "client",
    "user": { ... }
  }
}
```

Le frontend redirige vers `/admin` si admin, `/dashboard` si client.

### Routes admin protegees

Toutes les routes `/admin*` sont protegees par `AdminProtectedRoute` qui verifie la presence d'un `adminToken` valide dans le contexte.

## Workflow admin typique

1. **Commande creee** → statut `NEW_ORDER` (formulaire soumis, pas encore paye)
2. **Paiement recu** → statut `PAID` (webhook Stripe)
3. **Creation du conte** → l'admin cree le PDF manuellement
4. **Upload PDF** → via le drag-and-drop dans le detail commande
5. **Livraison** → bouton "Livrer" : passe en `DELIVERED`, envoie un email au client

## Statuts de commande

| Statut | Description |
|--------|------------|
| `NEW_ORDER` | Formulaire soumis, en attente de paiement |
| `ABANDONED` | Le client a quitte avant de payer |
| `PENDING` | En attente (generique) |
| `PAID` | Paiement recu |
| `IN_PROGRESS` | Conte en cours de creation |
| `PROCESSING` | En traitement |
| `GENERATED` | Conte genere |
| `PRINTED` | Imprime (livre physique) |
| `SHIPPED` | Expedie |
| `DELIVERED` | Livre au client |
| `CANCELLED` | Annule |
| `REFUNDED` | Rembourse |

### StoryStatus (parallele)

| Statut | Description |
|--------|------------|
| `EN_COURS` | PDF pas encore cree |
| `DISPONIBLE` | PDF uploade, pret a etre livre |

## Types d'achat

| PurchaseType | Description |
|-------------|------------|
| `SINGLE` | Achat unique (eBook 14.99€ / imprime 29.99€) |
| `CLUB` | Via abonnement Club (gratuit si credit dispo, sinon payant) |

## Dashboard admin

- **Accueil** (`/admin`) : stats + section "A traiter" (commandes qui necessitent une action)
- **Commandes** (`/admin/orders`) : vue complete avec filtres (statut, type, recherche, dates)
- **Detail** (`/admin/order/:id`) : timeline, upload PDF, livraison
- **Clients** (`/admin/clients`) : liste avec filtres role et recherche

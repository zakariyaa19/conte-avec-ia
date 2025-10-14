# Guide de Configuration Mailjet

## Configuration requise

### 1. Variables d'environnement

Ajoutez ces variables à votre fichier `.env` :

```env
# Mailjet Configuration
MAILJET_API_KEY="votre-clé-api-publique-mailjet"
MAILJET_SECRET_KEY="votre-clé-secrète-mailjet"
MAILJET_FROM_EMAIL="noreply@votre-domaine.com"
ADMIN_EMAIL="admin@votre-domaine.com"
```

### 2. Obtenir vos clés Mailjet

1. Connectez-vous à votre compte Mailjet
2. Allez dans **Account Settings** > **Master API Key & Sub API key management**
3. Copiez votre **API Key** (clé publique) et **Secret Key** (clé privée)
4. Remplacez les valeurs dans votre fichier `.env`

### 3. Configuration de l'adresse d'expédition

1. Dans Mailjet, allez dans **Account Settings** > **Sender addresses & domains**
2. Ajoutez et vérifiez votre domaine d'expédition
3. Utilisez cette adresse vérifiée dans `MAILJET_FROM_EMAIL`

## Fonctionnalités

### Emails automatiques envoyés :

1. **Email de confirmation au client** :
   - Objet : "Confirmation de commande #[numéro]"
   - Contient : nom du client, numéro de commande, détails, message de préparation

2. **Email de notification à l'admin** :
   - Objet : "🆕 Nouvelle commande #[numéro] - [nom client]"
   - Contient : toutes les informations de la commande pour traitement

### Déclenchement automatique

Les emails sont envoyés automatiquement lors de la soumission du formulaire de commande via l'endpoint `/api/orders`.

## Test de l'intégration

### Endpoint de test disponible

```bash
POST /api/test/mailjet
```

**Payload exemple :**
```json
{
  "customerName": "Test Client",
  "customerEmail": "test@example.com",
  "orderNumber": "12345678",
  "orderDetails": "Test de commande\nProduit: eBook\nPrix: 14.99€"
}
```

### Test avec curl

```bash
curl -X POST http://localhost:5001/api/test/mailjet \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test Client",
    "customerEmail": "votre-email@test.com",
    "orderNumber": "TEST123",
    "orderDetails": "Test de commande\nProduit: eBook\nPrix: 14.99€"
  }'
```

## Gestion des erreurs

- Si l'envoi d'email échoue, l'erreur est loggée dans la console
- La commande est créée même si l'email échoue (pour éviter de perdre les données)
- Messages d'erreur clairs retournés au client en cas de problème

## Migration depuis Nodemailer

✅ **Terminé :**
- Suppression de l'ancien service Nodemailer
- Installation et configuration de Mailjet
- Mise à jour des endpoints de commande
- Création du service MailjetService
- Tests disponibles

## Démarrage

1. Installez les dépendances : `npm install`
2. Configurez vos variables d'environnement
3. Démarrez le serveur : `npm run dev`
4. Testez avec l'endpoint `/api/test/mailjet`

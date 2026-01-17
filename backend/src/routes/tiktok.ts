import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import axios from 'axios';

const router = Router();

// Fonction pour hasher en SHA256
function sha256Hash(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

// Route de santé
router.get('/health', (req: Request, res: Response) => {
  res.json({ ok: true });
});

// Route principale pour envoyer des événements à TikTok
router.post('/events', async (req: Request, res: Response) => {
  try {
    // Récupérer les variables d'environnement
    const TIKTOK_ACCESS_TOKEN = process.env.TIKTOK_ACCESS_TOKEN;
    const TIKTOK_PIXEL_ID = process.env.TIKTOK_PIXEL_ID;

    if (!TIKTOK_ACCESS_TOKEN || !TIKTOK_PIXEL_ID) {
      console.error('❌ TikTok: Variables d\'environnement manquantes');
      return res.status(500).json({ 
        ok: false, 
        error: 'Configuration TikTok manquante sur le serveur' 
      });
    }

    // Extraire les données du body
    const { event, event_id, event_time, url, properties, context, user } = req.body;

    // Validation des champs obligatoires
    if (!event || !event_id || !event_time || !url) {
      return res.status(400).json({ 
        ok: false, 
        error: 'Champs obligatoires manquants: event, event_id, event_time, url' 
      });
    }

    // Construire l'objet user avec hashage si nécessaire
    const hashedUser: any = {};
    
    if (user?.email) {
      hashedUser.email = sha256Hash(user.email.toLowerCase().trim());
    }
    
    if (user?.phone) {
      hashedUser.phone = sha256Hash(user.phone.toLowerCase().trim());
    }
    
    if (user?.external_id) {
      hashedUser.external_id = sha256Hash(user.external_id.toLowerCase().trim());
    }

    // Construire le payload pour TikTok Events API v1.3
    const payload = {
      pixel_code: TIKTOK_PIXEL_ID,
      event: event,
      event_id: event_id,
      timestamp: event_time,
      context: {
        page: {
          url: url
        },
        ...(context?.ip && { ip: context.ip }),
        ...(context?.user_agent && { user_agent: context.user_agent }),
        ...(context?.ttclid && { ad: { callback: context.ttclid } })
      },
      properties: properties || {},
      ...(Object.keys(hashedUser).length > 0 && { user: hashedUser })
    };

    // Nettoyer les champs vides
    const cleanPayload = JSON.parse(JSON.stringify(payload, (key, value) => {
      return value === null || value === undefined || value === '' ? undefined : value;
    }));

    console.log('📤 TikTok Events API - Envoi événement:', {
      event,
      event_id,
      pixel_id: TIKTOK_PIXEL_ID
    });

    // Envoyer à TikTok Events API
    const response = await axios.post(
      'https://business-api.tiktok.com/open_api/v1.3/event/track/',
      cleanPayload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Token': TIKTOK_ACCESS_TOKEN
        },
        timeout: 10000 // 10 secondes timeout
      }
    );

    console.log('✅ TikTok Events API - Réponse:', response.data);

    res.json({ 
      ok: true,
      tiktok_response: response.data
    });

  } catch (error: any) {
    console.error('❌ TikTok Events API - Erreur:', error.response?.data || error.message);
    
    res.status(500).json({ 
      ok: false, 
      error: error.response?.data?.message || error.message || 'Erreur lors de l\'envoi à TikTok'
    });
  }
});

export default router;

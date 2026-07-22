import { prisma } from '../utils/database';
import { deleteOrderCloudinaryAssets } from '../utils/cloudinaryService';

const RETENTION_DAYS = 30;

/**
 * Supprime les chapitres gratuits (cliffhanger 3 pages) jamais completes/payes,
 * au-dela de RETENTION_DAYS. Economise le stockage Cloudinary + la base, et va
 * dans le sens du RGPD (donnees personnelles d'enfants a ne pas garder sans
 * necessite).
 *
 * Discriminant fiable : price = 0 (une commande gratuite completee -- payee
 * 2,99€ -- est mise a jour EN PLACE par autoCompleteStory, price passe a 2.99
 * sur la MEME ligne). Ne jamais supprimer une commande price > 0.
 *
 * Appelee via un endpoint cron (ex: /api/jobs/cleanup-free-orders).
 */
export async function cleanupOldFreeOrders(): Promise<{ deleted: number; errors: number }> {
  let deleted = 0;
  let errors = 0;

  const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000);

  const candidates = await prisma.order.findMany({
    where: {
      price: 0,
      purchaseType: 'SINGLE',
      status: 'DELIVERED',
      isTestOrder: false,
      createdAt: { lt: cutoff },
    },
    select: {
      id: true,
      coverImageUrl: true,
      pdfUrl: true,
      illustrationUrlsJson: true,
    },
  });

  console.log(`[CleanupFreeOrders] ${candidates.length} commande(s) gratuite(s) jamais completee(s), creees avant le ${cutoff.toISOString()}`);

  for (const order of candidates) {
    try {
      // Sécurité : re-vérifier price=0 juste avant suppression (au cas où une
      // complétion serait survenue entre le findMany et cette itération).
      const fresh = await prisma.order.findUnique({ where: { id: order.id }, select: { price: true } });
      if (!fresh || Number(fresh.price) > 0) {
        console.log(`[CleanupFreeOrders] Order ${order.id} completee entre-temps, skip`);
        continue;
      }

      const { attempted, deleted: assetsDeleted } = await deleteOrderCloudinaryAssets(order);
      await prisma.order.delete({ where: { id: order.id } });

      console.log(`[CleanupFreeOrders] Order ${order.id} supprimee (${assetsDeleted}/${attempted} assets Cloudinary)`);
      deleted++;
    } catch (error: any) {
      errors++;
      console.error(`[CleanupFreeOrders] Echec suppression order ${order.id}:`, error.message);
    }
  }

  console.log(`[CleanupFreeOrders] Termine: ${deleted} supprimee(s), ${errors} erreur(s)`);
  return { deleted, errors };
}

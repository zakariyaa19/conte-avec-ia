import { prisma } from '../utils/database';
import { MailjetService } from '../utils/mailjetService';

/**
 * Séquence d'emails de relance Club après le premier livre gratuit.
 *
 * Logique : on cherche les utilisateurs non-Club qui ont reçu leur premier livre
 * gratuit et on leur envoie des emails de relance à J+1, J+3, J+7.
 *
 * Appelé via un endpoint cron (ex: /api/jobs/email-sequence).
 */
export async function processEmailSequence(): Promise<{ sent: number; errors: number }> {
  let sent = 0;
  let errors = 0;

  const now = new Date();

  // Chercher les commandes gratuites (prix = 0, SINGLE, DELIVERED ou PAID)
  // dont l'utilisateur n'est PAS encore Club
  const freeOrders = await prisma.order.findMany({
    where: {
      price: 0,
      purchaseType: 'SINGLE',
      status: { in: ['PAID', 'GENERATING', 'GENERATED', 'DELIVERED'] },
      user: {
        role: { not: 'CLUB' },
        // Exclure ceux qui ont déjà un abonnement actif
        OR: [
          { subscriptionStatus: null },
          { subscriptionStatus: { not: 'active' } }
        ]
      }
    },
    include: {
      user: true
    },
    orderBy: { paidAt: 'asc' }
  });

  for (const order of freeOrders) {
    if (!order.user || !order.paidAt) continue;

    const user = order.user;
    const paidAt = new Date(order.paidAt);
    const hoursSincePaid = (now.getTime() - paidAt.getTime()) / (1000 * 60 * 60);

    // Déterminer l'étape de la séquence basée sur le temps écoulé
    // On utilise les metadata de la commande pour tracker les emails envoyés
    const emailsSent = (order as any).emailSequenceSent || '';

    const customerName = user.firstName || 'Parent';
    const protagonistName = order.protagonistName || 'votre enfant';

    try {
      // J+1 (24h) — premier rappel
      if (hoursSincePaid >= 24 && !emailsSent.includes('day1')) {
        await MailjetService.sendClubRelanceEmail({
          customerName,
          customerEmail: user.email,
          protagonistName,
          step: 'day1',
          userId: user.id
        });
        await prisma.order.update({
          where: { id: order.id },
          data: { emailSequenceSent: emailsSent + 'day1,' }
        });
        sent++;
      }
      // J+3 (72h) — avantages
      else if (hoursSincePaid >= 72 && emailsSent.includes('day1') && !emailsSent.includes('day3')) {
        await MailjetService.sendClubRelanceEmail({
          customerName,
          customerEmail: user.email,
          protagonistName,
          step: 'day3',
          userId: user.id
        });
        await prisma.order.update({
          where: { id: order.id },
          data: { emailSequenceSent: emailsSent + 'day3,' }
        });
        sent++;
      }
      // J+7 (168h) — dernier rappel
      else if (hoursSincePaid >= 168 && emailsSent.includes('day3') && !emailsSent.includes('day7')) {
        await MailjetService.sendClubRelanceEmail({
          customerName,
          customerEmail: user.email,
          protagonistName,
          step: 'day7',
          userId: user.id
        });
        await prisma.order.update({
          where: { id: order.id },
          data: { emailSequenceSent: emailsSent + 'day7,' }
        });
        sent++;
      }
    } catch (err) {
      console.error(`[EmailSequence] Erreur pour order ${order.id}:`, err);
      errors++;
    }
  }

  console.log(`[EmailSequence] Terminé: ${sent} envoyés, ${errors} erreurs`);
  return { sent, errors };
}

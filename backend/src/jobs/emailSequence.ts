import { prisma } from '../utils/database';
import { MailjetService } from '../utils/mailjetService';
import { resolveCustomerName } from '../utils/nameValidation';

/**
 * Séquence d'emails de relance Club après le premier livre gratuit.
 *
 * J+0 (1h)  — Livre prêt + teaser Club
 * J+1 (24h) — Comparatif gratuit vs Club
 * J+3 (72h) — Features détaillées
 * J+7 (168h) — Dernier rappel + urgence
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

    const emailsSent = (order as any).emailSequenceSent || '';

    const customerName = resolveCustomerName([user.firstName], 'Bonjour');
    const protagonistName = order.protagonistName || 'votre enfant';

    try {
      // J+0 est géré par sendStoryDeliveryEmail dans deliverStory (adminController)

      // J+0 +3h — Rappel si l'histoire n'a pas ete lue (4.3 devbook)
      if (
        hoursSincePaid >= 3
        && hoursSincePaid < 24
        && !emailsSent.includes('day0_3h')
        && !order.lastReadAt
      ) {
        await MailjetService.sendUnreadReminderEmail({
          customerName,
          customerEmail: user.email,
          protagonistName,
          userId: user.id,
        });
        await prisma.order.update({
          where: { id: order.id },
          data: { emailSequenceSent: emailsSent + 'day0_3h,' }
        });
        sent++;
        continue; // on s'arrete ici pour cet ordre ce tick
      }

      // J+1 (24h) — comparatif gratuit vs Club
      if (hoursSincePaid >= 24 && !emailsSent.includes('day1')) {
        await MailjetService.sendClubRelanceEmail({
          customerName,
          customerEmail: user.email,
          protagonistName,
          step: 'day1',
          userId: user.id,
          cliffhangerSummary: (order as any).cliffhangerSummary || null,
        });
        await prisma.order.update({
          where: { id: order.id },
          data: { emailSequenceSent: emailsSent + 'day1,' }
        });
        sent++;
      }
      // J+3 (72h) — features détaillées
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

  console.log(`[EmailSequence] Termine: ${sent} envoyes, ${errors} erreurs`);

  // ══════════════════════════════════════════════════════════════════
  // Sequence post-achat (4.4 devbook) : relance apres paiement 2,99€
  // Cible : commandes SINGLE payees > 0€ (completion ou standalone)
  // ══════════════════════════════════════════════════════════════════
  const paidOrders = await prisma.order.findMany({
    where: {
      price: { gt: 0 },
      purchaseType: 'SINGLE',
      status: { in: ['PAID', 'GENERATED', 'DELIVERED'] },
      paidAt: { not: null },
    },
    include: { user: true },
    orderBy: { paidAt: 'asc' },
  });

  for (const order of paidOrders) {
    if (!order.user || !order.paidAt) continue;
    const user = order.user;
    const paidAt = new Date(order.paidAt);
    const hoursSincePaid = (now.getTime() - paidAt.getTime()) / (1000 * 60 * 60);
    const emailsSent = (order as any).emailSequenceSent || '';
    const customerName = resolveCustomerName([user.firstName], 'Bonjour');
    const protagonistName = order.protagonistName || 'votre enfant';
    const isClub = user.role === 'CLUB' || user.subscriptionStatus === 'active';

    try {
      // Post-J+1 (24h apres paiement)
      if (hoursSincePaid >= 24 && !emailsSent.includes('post_day1')) {
        await MailjetService.sendPostPurchaseEmail({
          customerName, customerEmail: user.email, protagonistName,
          step: 'post_day1', userId: user.id,
        });
        await prisma.order.update({
          where: { id: order.id },
          data: { emailSequenceSent: emailsSent + 'post_day1,' },
        });
        sent++;
      }
      // Post-J+3 (72h)
      else if (hoursSincePaid >= 72 && emailsSent.includes('post_day1') && !emailsSent.includes('post_day3')) {
        await MailjetService.sendPostPurchaseEmail({
          customerName, customerEmail: user.email, protagonistName,
          step: 'post_day3', userId: user.id,
        });
        await prisma.order.update({
          where: { id: order.id },
          data: { emailSequenceSent: emailsSent + 'post_day3,' },
        });
        sent++;
      }
      // Post-J+7 (168h) — uniquement si non-Club
      else if (
        hoursSincePaid >= 168
        && emailsSent.includes('post_day3')
        && !emailsSent.includes('post_day7')
        && !isClub
      ) {
        await MailjetService.sendPostPurchaseEmail({
          customerName, customerEmail: user.email, protagonistName,
          step: 'post_day7', userId: user.id,
        });
        await prisma.order.update({
          where: { id: order.id },
          data: { emailSequenceSent: emailsSent + 'post_day7,' },
        });
        sent++;
      }
    } catch (err) {
      console.error(`[EmailSequence] Erreur post-achat pour order ${order.id}:`, err);
      errors++;
    }
  }

  console.log(`[EmailSequence] Total apres post-achat: ${sent} envoyes, ${errors} erreurs`);
  return { sent, errors };
}

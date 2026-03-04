import { prisma } from './database';

export class ClubService {
  /**
   * Calcule les credits disponibles pour un membre Club.
   *
   * Logique : 3 credits offerts a la souscription, puis 3 nouveaux credits tous les 30 jours.
   * Les credits non utilises s'accumulent.
   *
   * - weeklySubmissionReset = date de debut du comptage (date de souscription)
   * - weeklySubmissionCount = nombre total de credits utilises depuis la souscription
   * - creditsGagnes = (floor(monthsSinceStart) + 1) * 3
   * - creditsDisponibles = creditsGagnes - creditsUtilises
   */
  static async canSubmitFreeStory(userId: string): Promise<{
    canSubmit: boolean;
    remaining: number;
    nextCreditDate?: string;
    totalEarned?: number;
    reason?: string;
  }> {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return { canSubmit: false, remaining: 0, reason: 'Utilisateur non trouve' };
    }

    if (user.role !== 'CLUB' || user.subscriptionStatus !== 'active') {
      return { canSubmit: false, remaining: 0, reason: 'Abonnement Club non actif' };
    }

    const now = new Date();
    let startDate = user.weeklySubmissionReset;

    // Premiere fois : initialiser la date de debut
    if (!startDate) {
      startDate = now;
      await prisma.user.update({
        where: { id: userId },
        data: { weeklySubmissionReset: startDate, weeklySubmissionCount: 0 }
      });
    }

    // Calculer les credits gagnes depuis la souscription (3 par mois)
    const msSinceStart = now.getTime() - startDate.getTime();
    const monthsSinceStart = msSinceStart / (30 * 24 * 60 * 60 * 1000);
    const totalEarned = (Math.floor(monthsSinceStart) + 1) * 3;
    const totalUsed = user.weeklySubmissionCount || 0;
    const remaining = Math.max(0, totalEarned - totalUsed);

    // Calculer la date du prochain palier de credits (prochain multiple de 30 jours)
    const nextCreditDate = new Date(startDate.getTime() + (Math.floor(monthsSinceStart) + 1) * 30 * 24 * 60 * 60 * 1000);

    return {
      canSubmit: remaining > 0,
      remaining,
      totalEarned,
      nextCreditDate: nextCreditDate.toISOString()
    };
  }

  // Enregistre l'utilisation d'un credit Club
  static async recordSubmission(userId: string): Promise<void> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return;

    const now = new Date();

    if (!user.weeklySubmissionReset) {
      // Initialiser si pas encore fait
      await prisma.user.update({
        where: { id: userId },
        data: {
          weeklySubmissionCount: 1,
          weeklySubmissionReset: now
        }
      });
    } else {
      await prisma.user.update({
        where: { id: userId },
        data: {
          weeklySubmissionCount: { increment: 1 }
        }
      });
    }
  }
}

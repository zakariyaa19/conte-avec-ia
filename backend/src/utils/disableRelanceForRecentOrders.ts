import { PrismaClient } from '@prisma/client';

/**
 * Stoppe la sequence d'emails de relance pour les N commandes gratuites
 * les plus recentes (par defaut 9).
 *
 * Cas d'usage : un bug a stocke "Un" ou "313" comme prenom/firstName. Les
 * mails J+1/J+3/J+7 sont sur le point de partir et vont nuire a l'image
 * de marque. Cette commande marque ces commandes comme "relances deja
 * envoyees" pour que le cron `processEmailSequence` les saute.
 *
 * Usage :
 *   cd backend && npx ts-node src/utils/disableRelanceForRecentOrders.ts
 *   cd backend && npx ts-node src/utils/disableRelanceForRecentOrders.ts 20  # N=20
 *
 * Idempotent : si une commande a deja tous les markers, on ne la touche pas.
 */

const ALL_MARKERS = ['day0_3h', 'day1', 'day3', 'day7', 'post_day1', 'post_day3', 'post_day7'];
const ALL_MARKERS_STR = ALL_MARKERS.map(m => m + ',').join('');

const prisma = new PrismaClient();

async function main() {
  const countArg = parseInt(process.argv[2] || '9', 10);
  const N = Number.isFinite(countArg) && countArg > 0 ? countArg : 9;

  console.log(`[DisableRelance] Recherche des ${N} commandes gratuites les plus recentes...`);

  const orders = await prisma.order.findMany({
    where: {
      price: 0,
      purchaseType: 'SINGLE',
      status: { in: ['PAID', 'GENERATING', 'GENERATED', 'DELIVERED'] },
    },
    orderBy: { createdAt: 'desc' },
    take: N,
    select: {
      id: true,
      createdAt: true,
      protagonistName: true,
      emailSequenceSent: true,
      user: { select: { email: true, firstName: true } },
    },
  });

  if (orders.length === 0) {
    console.log('[DisableRelance] Aucune commande trouvee.');
    return;
  }

  console.log(`[DisableRelance] ${orders.length} commande(s) trouvee(s) :`);
  for (const o of orders) {
    const shortId = o.id.slice(-8);
    const date = o.createdAt.toISOString().split('T')[0];
    const email = o.user?.email || '(no email)';
    const protaName = o.protagonistName || '(no name)';
    const firstName = o.user?.firstName || '(no firstName)';
    const alreadyDone = ALL_MARKERS.every(m => (o.emailSequenceSent || '').includes(m));
    console.log(
      `  - #${shortId} | ${date} | ${email} | enfant="${protaName}" | parent="${firstName}" ${alreadyDone ? ' [DEJA MARQUE]' : ''}`
    );
  }

  console.log(`[DisableRelance] Mise a jour de emailSequenceSent...`);

  let updated = 0;
  let skipped = 0;
  for (const o of orders) {
    const current = o.emailSequenceSent || '';
    const alreadyDone = ALL_MARKERS.every(m => current.includes(m));
    if (alreadyDone) {
      skipped++;
      continue;
    }
    // On garde les markers deja presents et on ajoute les manquants
    const missing = ALL_MARKERS.filter(m => !current.includes(m));
    const newValue = current + missing.map(m => m + ',').join('');
    await prisma.order.update({
      where: { id: o.id },
      data: { emailSequenceSent: newValue },
    });
    updated++;
  }

  console.log(`[DisableRelance] Termine : ${updated} mises a jour, ${skipped} deja marquees.`);
}

main()
  .catch(err => {
    console.error('[DisableRelance] Erreur :', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

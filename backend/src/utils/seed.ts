import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding...');

  // Créer un utilisateur admin par défaut
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.adminUser.upsert({
    where: { email: 'contact@contedia.fr' },
    update: {},
    create: {
      email: 'contact@contedia.fr',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'Contes IA',
      role: 'SUPER_ADMIN'
    }
  });

  console.log('✅ Admin créé:', admin.email);

  // Créer quelques utilisateurs de test
  const testUsers = await Promise.all([
    prisma.user.upsert({
      where: { email: 'sophie.martin@example.com' },
      update: {},
      create: {
        email: 'sophie.martin@example.com',
        firstName: 'Sophie',
        lastName: 'Martin'
      }
    }),
    prisma.user.upsert({
      where: { email: 'marc.dubois@example.com' },
      update: {},
      create: {
        email: 'marc.dubois@example.com',
        firstName: 'Marc',
        lastName: 'Dubois'
      }
    })
  ]);

  console.log('✅ Utilisateurs de test créés');

  // Créer quelques commandes de test
  const testOrders = await Promise.all([
    prisma.order.create({
      data: {
        userId: testUsers[0].id,
        status: 'PAID',
        ageRange: '3-5',
        generalTheme: 'fairy-tales',
        specificSubject: 'unicorns',
        centralMessage: 'friendship',
        illustrationStyle: 'watercolor',
        protagonistName: 'Léa',
        protagonistAge: '5 ans',
        eyeColor: 'blue',
        hairColor: 'blonde',
        productType: 'EBOOK',
        price: 14.99,
        paidAt: new Date()
      }
    }),
    prisma.order.create({
      data: {
        userId: testUsers[1].id,
        status: 'PROCESSING',
        ageRange: '6-9',
        generalTheme: 'educational',
        specificSubject: 'knights-dragons',
        centralMessage: 'courage',
        illustrationStyle: '3d-animation',
        protagonistName: 'Thomas',
        protagonistAge: '7 ans',
        eyeColor: 'brown',
        hairColor: 'brown',
        secondaryCharacterName: 'Rex',
        secondaryCharacterAge: 'chien',
        productType: 'PRINTED',
        price: 29.99,
        shippingFirstName: 'Marc',
        shippingLastName: 'Dubois',
        shippingAddress: '123 Rue de la Paix',
        shippingCity: 'Paris',
        shippingPostalCode: '75001',
        paidAt: new Date()
      }
    }),
    prisma.order.create({
      data: {
        userId: testUsers[0].id,
        status: 'PENDING',
        ageRange: '0-2',
        generalTheme: 'family',
        specificSubject: 'fairy-tales',
        centralMessage: 'love',
        illustrationStyle: 'kawaii',
        protagonistName: 'Emma',
        protagonistAge: '2 ans',
        eyeColor: 'green',
        hairColor: 'red',
        productType: 'EBOOK',
        price: 49.99
      }
    })
  ]);

  console.log('✅ Commandes de test créées');

  console.log('🎉 Seeding terminé avec succès !');
  console.log('📧 Admin: contact@contedia.fr / admin123');
}

main()
  .catch((e) => {
    console.error('❌ Erreur pendant le seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import * as bcrypt from 'bcryptjs';
import { prisma } from './database';

// Script pour créer un utilisateur administrateur
async function createAdmin() {
  try {
    const email = 'contact@contedia.fr';
    const password = 'admin123'; // À changer en production
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.adminUser.upsert({
      where: { email },
      update: {},
      create: {
        email,
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'Contes IA',
        role: 'SUPER_ADMIN',
        isActive: true
      }
    });

    console.log('✅ Administrateur créé avec succès:');
    console.log(`📧 Email: ${admin.email}`);
    console.log(`🔑 Mot de passe: ${password}`);
    console.log(`👤 Rôle: ${admin.role}`);
    console.log('\n⚠️  IMPORTANT: Changez le mot de passe après la première connexion!');

  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'administrateur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  createAdmin();
}

export { createAdmin };

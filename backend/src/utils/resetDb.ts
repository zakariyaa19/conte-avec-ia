import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function resetDatabase() {
  console.log('=== RESET BASE DE DONNEES ===\n');

  // 1. Supprimer toutes les donnees dans l'ordre (relations)
  console.log('Suppression des commandes...');
  const deletedOrders = await prisma.order.deleteMany();
  console.log(`  ${deletedOrders.count} commande(s) supprimee(s)`);

  console.log('Suppression des profils enfants...');
  const deletedProfiles = await prisma.childProfile.deleteMany();
  console.log(`  ${deletedProfiles.count} profil(s) supprime(s)`);

  console.log('Suppression des utilisateurs...');
  const deletedUsers = await prisma.user.deleteMany();
  console.log(`  ${deletedUsers.count} utilisateur(s) supprime(s)`);

  console.log('Suppression des administrateurs...');
  const deletedAdmins = await prisma.adminUser.deleteMany();
  console.log(`  ${deletedAdmins.count} admin(s) supprime(s)`);

  // 2. Nettoyer les fichiers uploades
  const uploadsDir = path.resolve(__dirname, '../../uploads');
  const pdfsDir = path.resolve(__dirname, '../../uploads/pdfs');

  for (const dir of [pdfsDir, uploadsDir]) {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir).filter(f => !f.startsWith('.'));
      for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isFile()) {
          fs.unlinkSync(filePath);
          console.log(`  Fichier supprime: ${filePath}`);
        }
      }
    }
  }
  console.log('Fichiers uploades nettoyes\n');

  // 3. Recreer le compte admin
  const hashedPassword = await bcrypt.hash('Admin2024!', 10);
  const admin = await prisma.adminUser.create({
    data: {
      email: 'contact@contedia.fr',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'Contes IA',
      role: 'SUPER_ADMIN',
      isActive: true
    }
  });

  console.log('Compte admin cree:');
  console.log(`  Email: ${admin.email}`);
  console.log(`  Mot de passe: Admin2024!`);
  console.log(`  Role: ${admin.role}`);
  console.log(`\n=== RESET TERMINE ===`);
}

resetDatabase()
  .catch((e) => {
    console.error('Erreur lors du reset:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

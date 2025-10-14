import { PrismaClient } from '@prisma/client';

// Instance globale de Prisma
let prisma: PrismaClient;

declare global {
  var __prisma: PrismaClient | undefined;
}

// Éviter les multiples instances en développement
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.__prisma) {
    global.__prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });
  }
  prisma = global.__prisma;
}

export { prisma };

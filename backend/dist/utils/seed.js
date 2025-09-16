"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../generated/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new prisma_1.PrismaClient();
async function main() {
    console.log('🌱 Début du seeding...');
    // Créer un utilisateur admin par défaut
    const hashedPassword = await bcryptjs_1.default.hash('admin123', 10);
    const admin = await prisma.adminUser.upsert({
        where: { email: 'admin@contes-ia.com' },
        update: {},
        create: {
            email: 'admin@contes-ia.com',
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
                shippingCountry: 'France',
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
                productType: 'PACK',
                price: 49.99
            }
        })
    ]);
    console.log('✅ Commandes de test créées');
    console.log('🎉 Seeding terminé avec succès !');
    console.log('📧 Admin: admin@contes-ia.com / admin123');
}
main()
    .catch((e) => {
    console.error('❌ Erreur pendant le seeding:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map
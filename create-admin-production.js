// Script pour créer l'admin en production via API
const axios = require('axios');

async function createAdminProduction() {
  const baseUrl = 'https://conte-avec-ia-1.onrender.com';
  
  try {
    console.log('🔄 Création admin en production...');
    
    // Créer l'admin via la route temporaire
    const response = await axios.post(`${baseUrl}/api/admin/create-admin-temp`, {
      email: 'contact@contedia.fr',
      password: 'lvAlancheDestoc!ea',
      firstName: 'Admin',
      lastName: 'Contes IA',
      role: 'SUPER_ADMIN'
    });
    
    console.log('✅ Admin créé:', response.data);
    
  } catch (error) {
    console.log('❌ Route create non disponible:', error.response?.status);
    console.log('💡 Il faut créer l\'admin directement sur le serveur de production');
    console.log('📋 Solutions possibles:');
    console.log('   1. SSH sur le serveur Render');
    console.log('   2. Ajouter une route de création admin temporaire');
    console.log('   3. Utiliser les logs Render pour exécuter le script');
  }
}

createAdminProduction();

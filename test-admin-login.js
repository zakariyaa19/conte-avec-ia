// Script de test pour vérifier la connexion admin
const axios = require('axios');

async function testAdminLogin() {
  try {
    console.log('🔄 Test de connexion admin...');
    
    const response = await axios.post('http://localhost:5001/api/admin/login', {
      email: 'contact@contedia.fr',
      password: 'lvAlancheDestoc!ea'
    });

    console.log('✅ Connexion réussie !');
    console.log('📊 Réponse:', {
      success: response.data.success,
      token: response.data.data.token ? response.data.data.token.substring(0, 20) + '...' : 'null',
      user: response.data.data.user
    });

    // Test du dashboard avec le token
    if (response.data.data.token) {
      console.log('\n🔄 Test du dashboard...');
      const dashboardResponse = await axios.get('http://localhost:5001/api/admin/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${response.data.data.token}`
        }
      });
      
      console.log('✅ Dashboard accessible !');
      console.log('📊 Stats:', dashboardResponse.data.data);
    }

  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
  }
}

testAdminLogin();

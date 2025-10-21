// Test de l'URL backend Render
const axios = require('axios');

async function testRenderBackend() {
  const baseUrl = 'https://conte-avec-ia-1.onrender.com';
  
  try {
    console.log('🔄 Test du backend Render:', baseUrl);
    
    // Test health check
    console.log('\n1. Test health check...');
    const healthResponse = await axios.get(`${baseUrl}/health`);
    console.log('✅ Health check OK:', healthResponse.data);
    
    // Test admin login
    console.log('\n2. Test admin login...');
    const loginResponse = await axios.post(`${baseUrl}/api/admin/login`, {
      email: 'contact@contedia.fr',
      password: 'lvAlancheDestoc!ea'
    });
    
    if (loginResponse.data.success) {
      console.log('✅ Admin login OK!');
      console.log('📊 User:', loginResponse.data.data.user);
      console.log('🔑 Token:', loginResponse.data.data.token.substring(0, 20) + '...');
    } else {
      console.log('❌ Admin login failed:', loginResponse.data.message);
    }
    
  } catch (error) {
    console.error('❌ Erreur:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
  }
}

testRenderBackend();

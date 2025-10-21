// Test final de notification Telegram avec photo
const axios = require('axios');

async function testTelegramFinal() {
  const baseUrl = 'https://conte-avec-ia-1.onrender.com';
  
  try {
    console.log('🚀 Test final notification Telegram avec photo...');
    
    // Appeler la route de test
    const response = await axios.post(`${baseUrl}/api/test/telegram-photo`);
    
    if (response.data.success) {
      console.log('✅ Test réussi !');
      console.log('📊 Détails:', response.data.data);
      console.log('💬 Message:', response.data.message);
      console.log('');
      console.log('🎉 Vérifiez votre Telegram pour voir:');
      console.log('   1. 📸 La photo du protagoniste');
      console.log('   2. 📝 Le message détaillé de la commande');
    } else {
      console.log('❌ Test échoué:', response.data.message);
    }
    
  } catch (error) {
    console.error('❌ Erreur:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
  }
}

testTelegramFinal();

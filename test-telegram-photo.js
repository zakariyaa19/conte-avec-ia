// Test de l'envoi de photo Telegram
const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function testTelegramPhoto() {
  try {
    console.log('🔄 Test envoi photo Telegram...');
    
    // Configuration Telegram (remplacez par vos vraies valeurs)
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
    
    if (!BOT_TOKEN || !CHAT_ID) {
      console.log('❌ Variables d\'environnement Telegram manquantes');
      console.log('💡 Configurez TELEGRAM_BOT_TOKEN et TELEGRAM_CHAT_ID');
      return;
    }
    
    console.log('✅ Configuration Telegram trouvée');
    console.log('🤖 Bot Token:', BOT_TOKEN.substring(0, 10) + '...');
    console.log('💬 Chat ID:', CHAT_ID);
    
    // Chercher une image de test dans uploads
    const uploadsDir = path.join(__dirname, 'backend/uploads');
    if (!fs.existsSync(uploadsDir)) {
      console.log('❌ Dossier uploads non trouvé:', uploadsDir);
      return;
    }
    
    const files = fs.readdirSync(uploadsDir);
    const imageFiles = files.filter(file => 
      file.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/)
    );
    
    if (imageFiles.length === 0) {
      console.log('❌ Aucune image trouvée dans uploads');
      return;
    }
    
    const testImage = imageFiles[0];
    const imagePath = path.join(uploadsDir, testImage);
    
    console.log('📸 Image de test:', testImage);
    console.log('📁 Chemin:', imagePath);
    
    // Préparer FormData
    const FormData = require('form-data');
    const form = new FormData();
    
    form.append('chat_id', CHAT_ID);
    form.append('photo', fs.createReadStream(imagePath));
    form.append('caption', `🧪 <b>Test envoi photo</b>

📸 Image: ${testImage}
⏰ Date: ${new Date().toLocaleString('fr-FR')}

<i>Test du système de notification avec photo</i>`);
    form.append('parse_mode', 'HTML');
    
    // Envoyer à Telegram
    const response = await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, form, {
      headers: {
        ...form.getHeaders(),
      },
    });
    
    if (response.data.ok) {
      console.log('✅ Photo envoyée avec succès !');
      console.log('📊 Réponse:', {
        message_id: response.data.result.message_id,
        date: response.data.result.date,
        photo_sizes: response.data.result.photo.length
      });
    } else {
      console.log('❌ Erreur Telegram:', response.data.description);
    }
    
  } catch (error) {
    console.error('❌ Erreur:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
  }
}

testTelegramPhoto();

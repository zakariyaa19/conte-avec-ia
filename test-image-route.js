// Test de la nouvelle route d'images
const axios = require('axios');

async function testImageRoute() {
  const baseUrl = 'https://conte-avec-ia-1.onrender.com';
  
  try {
    console.log('🔄 Test de la route d\'images...');
    
    // 1. Lister les images disponibles
    console.log('\n1. Liste des images disponibles:');
    const listResponse = await axios.get(`${baseUrl}/files/list`);
    console.log('✅ Images trouvées:', {
      uploads: listResponse.data.data.uploads.length,
      images: listResponse.data.data.images.length
    });
    
    // 2. Tester l'accès à une image spécifique
    const uploads = listResponse.data.data.uploads;
    if (uploads.length > 0) {
      const testImage = uploads[0];
      console.log(`\n2. Test d'accès à l'image: ${testImage}`);
      
      try {
        const imageResponse = await axios.get(`${baseUrl}/files/image/${testImage}`, {
          responseType: 'arraybuffer'
        });
        console.log('✅ Image accessible:', {
          status: imageResponse.status,
          contentType: imageResponse.headers['content-type'],
          size: imageResponse.data.length
        });
      } catch (imageError) {
        console.log('❌ Erreur accès image:', {
          status: imageError.response?.status,
          data: imageError.response?.data?.toString()
        });
      }
    }
    
    // 3. Tester une image inexistante
    console.log('\n3. Test image inexistante:');
    try {
      await axios.get(`${baseUrl}/files/image/inexistante.jpg`);
    } catch (error) {
      console.log('✅ Erreur 404 attendue:', {
        status: error.response?.status,
        message: error.response?.data?.message
      });
    }
    
  } catch (error) {
    console.error('❌ Erreur:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
  }
}

testImageRoute();

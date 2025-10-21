// Test spécifique pour les images du dashboard
const axios = require('axios');

async function testDashboardImage() {
  const baseUrl = 'https://conte-avec-ia-1.onrender.com';
  
  try {
    console.log('🔄 Test des images du dashboard admin...');
    
    // 1. Se connecter en tant qu'admin
    console.log('\n1. Connexion admin...');
    const loginResponse = await axios.post(`${baseUrl}/api/admin/login`, {
      email: 'contact@contedia.fr',
      password: 'lvAlancheDestoc!ea'
    });
    
    const token = loginResponse.data.data.token;
    console.log('✅ Connexion réussie');
    
    // 2. Récupérer la liste des commandes
    console.log('\n2. Récupération des commandes...');
    const ordersResponse = await axios.get(`${baseUrl}/api/admin/orders`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log('📊 Réponse orders:', ordersResponse.data);
    const orders = ordersResponse.data.data?.orders || ordersResponse.data.data || [];
    console.log(`✅ ${orders.length} commandes trouvées`);
    
    // 3. Trouver une commande avec photo
    const orderWithPhoto = orders.find(order => order.photoUrl);
    if (!orderWithPhoto) {
      console.log('❌ Aucune commande avec photo trouvée');
      return;
    }
    
    console.log(`\n3. Test image de la commande ${orderWithPhoto.id.slice(-8)}:`);
    console.log(`📸 Photo URL: ${orderWithPhoto.photoUrl}`);
    
    // 4. Construire l'URL avec la nouvelle fonction
    let filename = orderWithPhoto.photoUrl;
    if (filename.startsWith('/uploads/')) {
      filename = filename.replace('/uploads/', '');
    }
    
    const imageUrl = `${baseUrl}/files/image/${filename}`;
    console.log(`🔗 URL construite: ${imageUrl}`);
    
    // 5. Tester l'accès à l'image
    try {
      const imageResponse = await axios.get(imageUrl, {
        responseType: 'arraybuffer'
      });
      console.log('✅ Image accessible depuis dashboard:', {
        status: imageResponse.status,
        contentType: imageResponse.headers['content-type'],
        size: imageResponse.data.length
      });
    } catch (imageError) {
      console.log('❌ Erreur accès image dashboard:', {
        status: imageError.response?.status,
        data: imageError.response?.data?.toString()
      });
    }
    
  } catch (error) {
    console.error('❌ Erreur:', {
      message: error.message,
      status: error.response?.status
    });
  }
}

testDashboardImage();

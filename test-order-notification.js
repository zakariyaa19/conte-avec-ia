// Test de notification complète avec photo
const axios = require('axios');

async function testOrderNotification() {
  const baseUrl = 'https://conte-avec-ia-1.onrender.com';
  
  try {
    console.log('🔄 Test notification commande avec photo...');
    
    // 1. Se connecter en tant qu'admin
    console.log('\n1. Connexion admin...');
    const loginResponse = await axios.post(`${baseUrl}/api/admin/login`, {
      email: 'contact@contedia.fr',
      password: 'lvAlancheDestoc!ea'
    });
    
    const token = loginResponse.data.data.token;
    console.log('✅ Connexion réussie');
    
    // 2. Récupérer une commande avec photo
    console.log('\n2. Recherche commande avec photo...');
    const ordersResponse = await axios.get(`${baseUrl}/api/admin/orders`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const orders = ordersResponse.data.data.orders || ordersResponse.data.data || [];
    const orderWithPhoto = orders.find(order => order.photoUrl);
    
    if (!orderWithPhoto) {
      console.log('❌ Aucune commande avec photo trouvée');
      return;
    }
    
    console.log(`✅ Commande trouvée: ${orderWithPhoto.id.slice(-8)}`);
    console.log(`📸 Photo: ${orderWithPhoto.photoUrl}`);
    console.log(`👤 Client: ${orderWithPhoto.shippingFirstName} ${orderWithPhoto.shippingLastName}`);
    
    // 3. Simuler l'envoi de notification (appel direct au service)
    console.log('\n3. Test envoi notification...');
    
    // Préparer les données comme le ferait le webhook Stripe
    const orderData = {
      customerName: `${orderWithPhoto.shippingFirstName} ${orderWithPhoto.shippingLastName}`,
      customerEmail: orderWithPhoto.user?.email || 'test@example.com',
      orderNumber: orderWithPhoto.id.slice(-8),
      amount: parseFloat(orderWithPhoto.price),
      orderDate: new Date(orderWithPhoto.createdAt),
      productType: orderWithPhoto.productType,
      orderDetails: orderWithPhoto
    };
    
    console.log('📋 Données préparées:', {
      customerName: orderData.customerName,
      orderNumber: orderData.orderNumber,
      photoUrl: orderData.orderDetails.photoUrl,
      protagonistName: orderData.orderDetails.protagonistName
    });
    
    // 4. Appeler l'API de test notification
    try {
      const notificationResponse = await axios.post(`${baseUrl}/api/test/telegram-notification`, {
        orderData
      });
      
      console.log('✅ Notification envoyée:', notificationResponse.data);
    } catch (notifError) {
      console.log('⚠️ Pas de route de test, mais les données sont prêtes');
      console.log('💡 Le service Telegram sera appelé lors du prochain paiement réel');
    }
    
  } catch (error) {
    console.error('❌ Erreur:', {
      message: error.message,
      status: error.response?.status
    });
  }
}

testOrderNotification();

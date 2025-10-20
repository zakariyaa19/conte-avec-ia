/**
 * Service de keep-alive pour éviter le cold start sur Render
 */
export class KeepAliveService {
  private static intervalId: NodeJS.Timeout | null = null;
  
  /**
   * Démarre le service de keep-alive
   */
  static start() {
    // Ping toutes les 14 minutes (Render met en veille après 15 min)
    this.intervalId = setInterval(() => {
      this.ping();
    }, 14 * 60 * 1000);
    
    console.log('🔄 Service keep-alive démarré (ping toutes les 14 minutes)');
  }
  
  /**
   * Arrête le service de keep-alive
   */
  static stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('⏹️ Service keep-alive arrêté');
    }
  }
  
  /**
   * Effectue un ping interne pour maintenir le serveur actif
   */
  private static ping() {
    try {
      // Ping interne simple
      console.log('🏓 Keep-alive ping -', new Date().toISOString());
      
      // Ping vers l'endpoint de warm-up pour maintenir la DB active
      const baseUrl = process.env.RENDER_EXTERNAL_URL || process.env.BACKEND_URL;
      if (baseUrl) {
        fetch(`${baseUrl}/warmup`, {
          method: 'GET',
          headers: { 'User-Agent': 'KeepAlive-Service' }
        })
          .then(response => {
            if (response.ok) {
              console.log('✅ Keep-alive warm-up réussi');
            } else {
              console.log('⚠️ Keep-alive warm-up échoué:', response.status);
            }
          })
          .catch(error => {
            console.log('⚠️ Keep-alive warm-up erreur:', error.message);
          });
      }
    } catch (error) {
      console.error('❌ Erreur keep-alive ping:', error);
    }
  }
}

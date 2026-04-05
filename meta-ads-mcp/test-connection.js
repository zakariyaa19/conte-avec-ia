// Quick test to verify your Meta Marketing API credentials work
const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const AD_ACCOUNT_ID = process.env.META_AD_ACCOUNT_ID;

if (!ACCESS_TOKEN || !AD_ACCOUNT_ID) {
  console.error("\n❌ Variables manquantes !");
  console.error("Lance avec :");
  console.error("  META_ACCESS_TOKEN=ton_token META_AD_ACCOUNT_ID=act_XXXXX node test-connection.js\n");
  process.exit(1);
}

console.log("\n🔍 Test de connexion Meta Marketing API...\n");
console.log(`   Account ID: ${AD_ACCOUNT_ID}`);
console.log(`   Token: ${ACCESS_TOKEN.substring(0, 10)}...${ACCESS_TOKEN.slice(-5)}\n`);

try {
  const url = `https://graph.facebook.com/v21.0/${AD_ACCOUNT_ID}?fields=name,account_status,currency,amount_spent&access_token=${ACCESS_TOKEN}`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.error) {
    console.error("❌ Erreur API Meta :", data.error.message);
    if (data.error.code === 190) {
      console.error("\n   → Ton token est expiré ou invalide.");
      console.error("   → Va sur https://developers.facebook.com/tools/explorer/");
      console.error("   → Sélectionne ton app et génère un nouveau token.\n");
    }
    process.exit(1);
  }

  console.log("✅ Connexion réussie !\n");
  console.log(`   Nom du compte : ${data.name}`);
  console.log(`   Statut : ${data.account_status === 1 ? "ACTIF" : "INACTIF"}`);
  console.log(`   Devise : ${data.currency}`);
  console.log(`   Dépenses totales : ${(parseFloat(data.amount_spent) / 100).toFixed(2)} ${data.currency}`);
  console.log("\n🎉 Tout est bon ! Tu peux configurer le serveur MCP.\n");
} catch (err) {
  console.error("❌ Erreur réseau :", err.message);
  process.exit(1);
}

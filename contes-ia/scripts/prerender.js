#!/usr/bin/env node
/**
 * Script de prerendering custom pour Contedia
 * Pre-rend toutes les pages publiques pour donner du HTML aux crawlers SEO
 * (Googlebot léger, Bingbot, partages sociaux) qui ne rendent pas le JS.
 *
 * Stratégie :
 *  - En local (macOS/Windows) : utilise `puppeteer` (devDep, Chromium intégré)
 *  - Sur Vercel (Linux build)  : utilise `puppeteer-core` + `@sparticuz/chromium`
 *    (deps standard, légers, conçus pour environnements serverless)
 *  - Si rien n'est disponible : skip silencieusement (build ne casse pas)
 */

let puppeteer;
let sparticuzChromium = null;

try {
  puppeteer = require('puppeteer');
  console.log('  → Backend: puppeteer (full, local dev)');
} catch {
  try {
    puppeteer = require('puppeteer-core');
    sparticuzChromium = require('@sparticuz/chromium');
    console.log('  → Backend: puppeteer-core + @sparticuz/chromium (Vercel)');
  } catch {
    console.log('⏭️  Prerendering skipped (no puppeteer backend available)');
    process.exit(0);
  }
}
const { createServer } = require('http');
const { readFileSync, writeFileSync, mkdirSync, existsSync } = require('fs');
const { join, dirname } = require('path');

const BUILD_DIR = join(__dirname, '..', 'build');
const PORT = 45678;
const CONCURRENCY = 4;

// Toutes les pages publiques a pre-rendre
const ROUTES = [
  '/',
  '/create-story',
  '/exemples',
  '/club',
  '/blog',
  '/livre-personnalise-enfant',
  '/themes-de-contes',
  '/contes-par-age',
  '/styles-illustration',
  '/contes-multilingues',
  '/valeurs-educatives',
  '/idees-cadeaux',
  '/ia-creation-conte',
  // Articles blog
  '/blog/histoire-animal-compagnie-livre-personnalise',
  '/blog/nouveaux-personnages-styles-aventures-ados',
  '/blog/evolution-livres-enfants-contes-fees-aventures-personnalisees',
  '/blog/ia-revolution-creation-histoires-enfants',
  '/blog/animal-compagnie-stimule-imagination-enfant',
  '/blog/conte-personnalise-noel-cadeau-amoureux-animaux',
  '/blog/photo-heros-conte-ia-transforme-animal-personnage',
  '/blog/lire-compagnon-quatre-pattes-rituel-lien-enfant-animal',
  '/blog/top-5-themes-histoires-animal-heros-conte',
  '/blog/transmettre-foi-histoires-contes-personnalises-spiritualite',
  '/blog/fetes-religieuses-conte-personnalise-noel-ramadan-paque-diwali',
  '/blog/livre-personnalise-vs-livre-classique-enfant',
  '/blog/enfant-heros-propre-histoire',
  '/blog/livre-personnalise-enfant-timide',
  '/blog/cadeau-livre-personnalise-enfant',
  '/blog/guide-livre-personnalise-enfant-2026',
  '/blog/meilleurs-livres-personnalises-enfants-comparatif-2026',
  '/blog/conteuse-personnalisable-alternative-numerique-2026',
  '/blog/livre-conte-personnalise-histoire-unique-enfant',
  '/blog/conte-personnalise-gratuit',
  '/blog/cadeau-fete-des-meres-livre-personnalise',
  '/blog/contedia-vs-wonderbly-comparatif',
  '/blog/contedia-vs-hourra-heros-comparatif',
  '/blog/livre-personnalise-bebe-premier-livre',
  '/blog/alternative-lunii-livre-personnalise-ia',
  '/blog/alternative-toniebox-livre-personnalise-enfant',
  '/blog/histoire-du-soir-enfant-meilleures-idees',
  '/blog/conte-pour-sendormir-histoires-personnalisees',
  '/blog/cadeau-naissance-livre-personnalise-bebe',
  '/blog/cadeau-noel-livre-personnalise-enfant',
  '/blog/livre-personnalise-enfant-3-5-ans',
  '/blog/contedia-vs-epopia-comparatif',
  '/blog/cadeau-anniversaire-enfant-livre-personnalise',
  '/blog/lunii-vs-toniebox-comparatif-2026',
  '/blog/conteuse-enfant-guide-complet-2026',
  '/blog/histoire-du-soir-par-age-guide',
  '/blog/idee-cadeau-enfant-3-ans',
  '/blog/idee-cadeau-enfant-5-ans',
  '/blog/chatgpt-vs-contedia-histoires-enfants',
  // Pages business
  '/a-propos',
  '/tarifs',
  // Hub prenoms
  '/prenoms',
  // Pages prenoms programmatiques
  '/prenom/emma', '/prenom/gabriel', '/prenom/louise', '/prenom/raphael',
  '/prenom/jade', '/prenom/leo', '/prenom/alice', '/prenom/louis',
  '/prenom/rose', '/prenom/noah', '/prenom/chloe', '/prenom/adam',
  '/prenom/lina', '/prenom/lucas', '/prenom/mia', '/prenom/arthur',
  '/prenom/ambre', '/prenom/jules', '/prenom/anna', '/prenom/hugo',
  '/prenom/lea', '/prenom/mael', '/prenom/luna', '/prenom/liam',
  '/prenom/julia', '/prenom/ethan', '/prenom/manon', '/prenom/nathan',
  '/prenom/elena', '/prenom/tom', '/prenom/agathe', '/prenom/paul',
  '/prenom/camille', '/prenom/sacha', '/prenom/charlie', '/prenom/mohamed',
  '/prenom/yasmine', '/prenom/rayan', '/prenom/ines', '/prenom/nolan',
  '/prenom/sarah', '/prenom/theo', '/prenom/clara', '/prenom/aaron',
  '/prenom/charlotte', '/prenom/gabin', '/prenom/victoria', '/prenom/robin',
  '/prenom/lily', '/prenom/martin',
];

// Serveur HTTP statique simple avec SPA fallback
function startServer() {
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.mjs': 'application/javascript',
    '.map': 'application/json',
  };

  // Snapshot the pristine index.html ONCE at server startup.
  // The prerender writes back to build/index.html for the "/" route,
  // so we must avoid serving the contaminated post-prerender file
  // as the SPA shell to subsequent routes.
  const pristineIndexHtml = readFileSync(join(BUILD_DIR, 'index.html'), 'utf-8');

  const server = createServer((req, res) => {
    let filePath = join(BUILD_DIR, req.url);
    const ext = require('path').extname(filePath);

    // Tenter de servir le fichier statique
    if (ext && existsSync(filePath)) {
      const content = readFileSync(filePath);
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      res.end(content);
      return;
    }

    // SPA fallback: servir l'index.html pristine en mémoire
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(pristineIndexHtml);
  });

  return new Promise((resolve) => {
    server.listen(PORT, () => {
      console.log(`  Serveur statique demarre sur http://localhost:${PORT}`);
      resolve(server);
    });
  });
}

// Pre-rendre une page
async function prerenderPage(browser, route) {
  const page = await browser.newPage();

  // Bloquer les requetes externes (tracking pixels, fonts, etc.)
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    const url = req.url();
    if (
      url.includes('analytics.tiktok.com') ||
      url.includes('connect.facebook.net') ||
      url.includes('clarity.ms') ||
      url.includes('js.stripe.com') ||
      url.includes('fonts.googleapis.com') ||
      url.includes('fonts.gstatic.com') ||
      url.includes('vercel.live') ||
      url.includes('facebook.com/tr') ||
      url.includes('conte-avec-ia-backend.onrender.com')
    ) {
      req.abort();
      return;
    }
    req.continue();
  });

  // Supprimer les erreurs console pour garder le terminal propre
  page.on('pageerror', () => {});
  page.on('console', () => {});

  try {
    await page.goto(`http://localhost:${PORT}${route}`, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    // Attendre que le contenu React soit rendu
    await page.waitForFunction(
      () => {
        const root = document.getElementById('root');
        return root && root.children.length > 0;
      },
      { timeout: 15000 }
    );

    // Délai pour que styled-components + react-helmet-async injectent dans le DOM
    // (Helmet utilise des effets différés ; 2.5s laisse largement le temps)
    await new Promise(r => setTimeout(r, 2500));

    // CRITIQUE — Fix FOUC pour styled-components v6 :
    // En production, styled-components v6 stocke les regles CSS dans le CSSStyleSheet
    // attache au tag <style data-styled> (via sheet.cssRules), MAIS le textContent
    // du tag reste vide. Du coup page.content() (qui serialize via outerHTML) ne
    // capture rien et le HTML prerendu est sans styles → FOUC.
    //
    // On extrait les rules via sheet.cssRules et on les ecrit dans un nouveau
    // <style data-prerendered-sc> que le serializer captera.
    await page.evaluate(() => {
      try {
        const cssRules = [];
        const styleTags = document.querySelectorAll('style[data-styled]');
        for (const tag of styleTags) {
          if (tag.sheet) {
            try {
              for (const rule of tag.sheet.cssRules) {
                cssRules.push(rule.cssText);
              }
            } catch (_) { /* CORS sheet, skip */ }
          }
          // Defensif : certaines versions/contextes peuvent aussi avoir du textContent
          if (tag.textContent && tag.textContent.trim()) {
            cssRules.push(tag.textContent);
          }
        }
        if (cssRules.length > 0) {
          const styleEl = document.createElement('style');
          styleEl.setAttribute('data-prerendered-sc', 'true');
          styleEl.textContent = cssRules.join('\n');
          document.head.appendChild(styleEl);
        }
      } catch (e) {
        console.warn('[prerender] Style extraction failed:', e && e.message);
      }
    });

    let html = await page.content();

    // Le prerender baked le data-theme du moment dans <html>. Si on le laisse,
    // le user voit la couleur du theme prerendu une fraction de seconde avant
    // que le script du head lise localStorage et le change → flash.
    // On retire l'attribut pour que le script soit seule source de verite.
    html = html.replace(/(<html\b[^>]*?)\s+data-theme="[^"]*"/i, '$1');

    // Creer le repertoire et sauver le fichier
    const outputPath = route === '/'
      ? join(BUILD_DIR, 'index.html')
      : join(BUILD_DIR, route, 'index.html');

    const dir = dirname(outputPath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    writeFileSync(outputPath, html, 'utf-8');
    return { route, success: true, size: html.length };
  } catch (err) {
    return { route, success: false, error: err.message };
  } finally {
    await page.close();
  }
}

// Traiter les routes par batch
async function processBatch(browser, routes) {
  return Promise.all(routes.map(route => prerenderPage(browser, route)));
}

async function main() {
  console.log(`\n  Prerendering Contedia — ${ROUTES.length} pages\n`);

  const server = await startServer();

  let launchOptions;
  let browser;
  try {
    launchOptions = sparticuzChromium
      ? {
          args: sparticuzChromium.args,
          defaultViewport: sparticuzChromium.defaultViewport,
          executablePath: await sparticuzChromium.executablePath(),
          headless: sparticuzChromium.headless,
        }
      : {
          headless: 'new',
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
          ],
        };

    browser = await puppeteer.launch(launchOptions);
  } catch (err) {
    // En prod (Vercel), si Chromium ne peut pas démarrer, on ne casse PAS la build.
    // Le site reste fonctionnel, juste sans HTML prérendéré (état antérieur).
    console.log(`⚠️  Chromium launch failed: ${err.message}`);
    console.log('⏭️  Prerendering skipped — build continues with SPA shell only');
    server.close();
    process.exit(0);
  }

  let success = 0;
  let failed = 0;

  // Traiter par batch de CONCURRENCY
  for (let i = 0; i < ROUTES.length; i += CONCURRENCY) {
    const batch = ROUTES.slice(i, i + CONCURRENCY);
    const results = await processBatch(browser, batch);

    for (const result of results) {
      if (result.success) {
        success++;
        const sizeKB = Math.round(result.size / 1024);
        console.log(`  ✅ ${result.route} (${sizeKB}KB)`);
      } else {
        failed++;
        console.log(`  ❌ ${result.route} — ${result.error}`);
      }
    }

    // Afficher progression
    const total = success + failed;
    if (total % 20 === 0 || i + CONCURRENCY >= ROUTES.length) {
      console.log(`  📊 ${total}/${ROUTES.length} pages traitees (${success} OK, ${failed} echecs)\n`);
    }
  }

  await browser.close();
  server.close();

  console.log(`\n  ✨ Prerendering termine : ${success}/${ROUTES.length} pages OK\n`);

  if (failed > 0) {
    console.log(`  ⚠️  ${failed} pages en echec\n`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Erreur fatale:', err);
  process.exit(1);
});

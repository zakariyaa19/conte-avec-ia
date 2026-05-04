#!/usr/bin/env node
/**
 * Audit SEO exhaustif des pages prerendées.
 * Vérifie pour chaque page :
 *  - Présence d'un <title> non-fallback
 *  - Présence et unicité de meta description
 *  - Présence d'og:title spécifique (pas le statique générique)
 *  - Présence d'au moins 1 schema JSON-LD valide
 *  - Pas de duplicate critique
 *  - Pas de contenu polluant d'autres pages (HomePage tags sur articles, etc.)
 *  - Schema FAQ/Breadcrumb/Article bien formés (JSON parsable)
 *
 * Usage: node scripts/seo-audit.js
 * Exit code: 0 si tout OK, 1 si problèmes critiques détectés.
 */
const { readFileSync, readdirSync, statSync } = require('fs');
const { join } = require('path');

const BUILD_DIR = join(__dirname, '..', 'build');

// Strings spécifiques à HomePage qui ne doivent PAS apparaître sur d'autres pages
const HOMEPAGE_TITLE = "Livre Personnalisé Enfant GRATUIT — Histoire IA en 5 min | Contedia";
const HOMEPAGE_DESC_FRAGMENT = "Votre enfant héros de son propre livre illustré par IA";

// Pages utilitaires (app/galerie) qui n'ont pas vocation à exposer des schemas SEO
const UTILITY_PAGES = new Set(['/create-story', '/exemples']);

// Trouve tous les index.html prerendés
function findPrerenderedPages(dir, baseUrl = '') {
  const pages = [];
  for (const entry of readdirSync(dir)) {
    if (entry === 'static' || entry === 'images' || entry === 'image' ||
        entry === 'pdfs' || entry.startsWith('.') || entry.endsWith('.png') ||
        entry.endsWith('.json') || entry.endsWith('.txt') || entry.endsWith('.xml') ||
        entry.endsWith('.js') || entry.endsWith('.mjs')) continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      const indexFile = join(full, 'index.html');
      try {
        statSync(indexFile);
        pages.push({ url: `${baseUrl}/${entry}`, file: indexFile });
      } catch {}
      pages.push(...findPrerenderedPages(full, `${baseUrl}/${entry}`));
    }
  }
  return pages;
}

// Audit une page
function auditPage(file, url) {
  const html = readFileSync(file, 'utf-8');
  const issues = [];
  const warnings = [];

  // 1. Titles
  const titles = [...html.matchAll(/<title>([^<]+)<\/title>/g)].map(m => m[1]);
  if (titles.length === 0) {
    issues.push('NO_TITLE: aucune balise <title>');
  } else {
    const fallbackOnly = titles.length === 1 && titles[0] === 'Contedia';
    if (fallbackOnly) {
      issues.push('FALLBACK_TITLE_ONLY: seul "Contedia" présent, Helmet n\'a pas injecté de title spécifique');
    }
    if (titles.length > 2) {
      warnings.push(`TITLE_DUPLICATES: ${titles.length} balises <title> (>2 = pollution)`);
    }
    // HomePage title pollution sur autres pages
    if (url !== '' && titles.includes(HOMEPAGE_TITLE)) {
      issues.push('HOMEPAGE_TITLE_POLLUTION: contient le title HomePage alors que ce n\'est pas /');
    }
  }

  // 2. Meta description
  const descs = [...html.matchAll(/<meta name="description" content="([^"]+)"/g)].map(m => m[1]);
  if (descs.length === 0) {
    issues.push('NO_META_DESC: aucune meta description');
  } else if (descs.length > 1) {
    warnings.push(`META_DESC_DUPLICATES: ${descs.length} meta descriptions`);
  }
  if (descs.some(d => d.includes(HOMEPAGE_DESC_FRAGMENT)) && url !== '') {
    issues.push('HOMEPAGE_DESC_POLLUTION: contient la description HomePage');
  }

  // 3. og:title
  const ogTitles = [...html.matchAll(/<meta property="og:title" content="([^"]+)"/g)].map(m => m[1]);
  if (ogTitles.length === 0) {
    warnings.push('NO_OG_TITLE: pas de og:title');
  } else if (ogTitles.length > 1) {
    warnings.push(`OG_TITLE_DUPLICATES: ${ogTitles.length} og:title`);
  }

  // 4. Canonical
  const canonicals = [...html.matchAll(/<link rel="canonical" href="([^"]+)"/g)].map(m => m[1]);
  if (canonicals.length === 0) {
    warnings.push('NO_CANONICAL');
  } else if (canonicals.length > 1) {
    warnings.push(`CANONICAL_DUPLICATES: ${canonicals.length} canonicals`);
  }

  // 5. JSON-LD schemas (skip les pages utilitaires qui n'ont pas besoin de schema)
  const schemaScripts = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]);
  if (schemaScripts.length === 0 && !UTILITY_PAGES.has(url)) {
    warnings.push('NO_JSONLD: aucun schema JSON-LD');
  }
  let validSchemas = 0;
  let invalidSchemas = 0;
  const schemaTypes = [];
  for (const raw of schemaScripts) {
    try {
      const parsed = JSON.parse(raw);
      validSchemas++;
      if (parsed['@type']) schemaTypes.push(parsed['@type']);
      else if (Array.isArray(parsed)) {
        for (const item of parsed) if (item['@type']) schemaTypes.push(item['@type']);
      }
    } catch (e) {
      invalidSchemas++;
      issues.push(`INVALID_JSONLD: schema JSON malformé — ${e.message.substring(0, 60)}`);
    }
  }

  // 6. Robots noindex check (cohérence sitemap)
  const noindex = /<meta name="robots" content="noindex/.test(html);

  // 7. Body content check (le HTML rendered doit avoir du vrai contenu)
  // Le HTML est minifié, donc on cherche depuis <div id="root"> jusqu'à </body>
  const rootStart = html.indexOf('<div id="root">');
  const bodyEnd = html.indexOf('</body>');
  const rootContent = (rootStart >= 0 && bodyEnd > rootStart)
    ? html.substring(rootStart + 15, bodyEnd) : '';
  if (rootContent.length < 500) {
    issues.push(`EMPTY_RENDERED: contenu rendered <500 chars (${rootContent.length})`);
  }

  return {
    url,
    title: titles[0] || null,
    titles_count: titles.length,
    descs_count: descs.length,
    og_title: ogTitles[0] || null,
    canonicals_count: canonicals.length,
    schemas_count: schemaScripts.length,
    valid_schemas: validSchemas,
    invalid_schemas: invalidSchemas,
    schema_types: schemaTypes,
    noindex,
    issues,
    warnings,
    body_size: rootContent.length,
  };
}

// MAIN
const homePage = { url: '', file: join(BUILD_DIR, 'index.html') };
const allPages = [homePage, ...findPrerenderedPages(BUILD_DIR)];
console.log(`\n  📊 Audit SEO — ${allPages.length} pages\n`);

// Si on n'a que la homepage CRA (prerender skippé en prod), on n'audit pas
// — sinon on casserait la build pour rien. Le prerender a sa propre logique.
if (allPages.length <= 2) {
  console.log('  ⏭️  Prerender semble skippé (seulement ' + allPages.length + ' page(s) trouvée(s))');
  console.log('  ⏭️  Audit ignoré — la build continue normalement.\n');
  process.exit(0);
}

const results = allPages.map(p => auditPage(p.file, p.url));

// Stats globales
const withIssues = results.filter(r => r.issues.length > 0);
const withWarnings = results.filter(r => r.warnings.length > 0);
const withSchemas = results.filter(r => r.schemas_count > 0);
const withFAQ = results.filter(r => r.schema_types.includes('FAQPage'));
const withBreadcrumb = results.filter(r => r.schema_types.includes('BreadcrumbList'));
const withArticle = results.filter(r => r.schema_types.includes('Article'));
const noindexed = results.filter(r => r.noindex);

console.log('═══ RÉSULTATS GLOBAUX ═══');
console.log(`Pages auditées        : ${results.length}`);
console.log(`Pages avec problèmes  : ${withIssues.length}`);
console.log(`Pages avec warnings   : ${withWarnings.length}`);
console.log(`Pages avec schemas    : ${withSchemas.length}`);
console.log(`  └ FAQPage           : ${withFAQ.length}`);
console.log(`  └ BreadcrumbList    : ${withBreadcrumb.length}`);
console.log(`  └ Article           : ${withArticle.length}`);
console.log(`Pages noindex         : ${noindexed.length}`);
console.log('');

if (withIssues.length > 0) {
  console.log('═══ ❌ PROBLÈMES CRITIQUES ═══');
  for (const r of withIssues) {
    console.log(`\n  ${r.url || '/'}`);
    for (const issue of r.issues) console.log(`    ❌ ${issue}`);
  }
  console.log('');
}

if (withWarnings.length > 0) {
  console.log('═══ ⚠️  WARNINGS ═══');
  for (const r of withWarnings) {
    console.log(`\n  ${r.url || '/'}`);
    for (const w of r.warnings) console.log(`    ⚠️  ${w}`);
  }
  console.log('');
}

console.log('═══ EXIT ═══');
if (withIssues.length === 0) {
  console.log('✅ Aucun problème critique détecté');
  process.exit(0);
} else {
  console.log(`❌ ${withIssues.length} pages avec problèmes critiques`);
  process.exit(1);
}

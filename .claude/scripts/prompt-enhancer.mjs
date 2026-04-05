#!/usr/bin/env node
/**
 * Prompt Enhancer v3 — Agent IA de reformulation
 *
 * Utilise Claude Haiku pour transformer les prompts bruts
 * en prompts clairs, structurés et exploitables.
 *
 * Sécurité :
 * - Préserve TOUJOURS le sens original
 * - Ne rajoute JAMAIS de demandes
 * - Échec silencieux
 */

import { execFileSync } from 'child_process';
import { writeFileSync, readFileSync, unlinkSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

// ── Lire stdin ─────────────────────────────────────────
const chunks = [];
process.stdin.setEncoding('utf8');
process.stdin.on('data', c => chunks.push(c));
process.stdin.on('end', () => {
  try {
    main(chunks.join(''));
  } catch {
    process.exit(0);
  }
});

function main(raw) {
  const data = JSON.parse(raw);
  const prompt = data.prompt || '';

  // ── Garde-fous ───────────────────────────────────────
  if (prompt.length < 40) process.exit(0);
  if (prompt.startsWith('/')) process.exit(0);

  const mdHeaders = (prompt.match(/^#{1,3}\s/gm) || []).length;
  const codeBlocks = (prompt.match(/```/g) || []).length;
  if (mdHeaders >= 3 && codeBlocks >= 2) process.exit(0);

  // ── System prompt ────────────────────────────────────
  const systemPrompt = `Tu es un agent de reformulation de prompts. Tu travailles pour un développeur sur Contedia, un SaaS de contes personnalisés pour enfants par IA (React + Express + PostgreSQL + Stripe + OpenAI).

TON RÔLE : Prendre le prompt brut et le transformer en un prompt parfaitement clair, structuré et exploitable par un assistant IA de développement.

RÈGLES :
1. PRÉSERVE exactement le même sens et les mêmes demandes
2. NE RAJOUTE AUCUNE demande ou question que l'utilisateur n'a pas mentionnée
3. NE SUPPRIME aucune demande
4. Reformule en français clair et précis
5. Si plusieurs tâches : numérote-les clairement
6. Clarifie les termes vagues quand le contexte projet le permet
7. Sois concis mais complet — pas de blabla
8. Garde les noms de fichiers et termes techniques tels quels
9. NE POSE PAS de questions — reformule simplement

Retourne UNIQUEMENT le prompt reformulé. Rien d'autre.`;

  // ── Appel Claude Haiku via CLI ───────────────────────
  // On passe le prompt en argument pour éviter les problèmes de stdin
  const tmpFile = join(tmpdir(), `prompt-enhancer-${process.pid}.txt`);

  try {
    // Trouver le chemin de claude
    const claudePath = findClaude();
    if (!claudePath) process.exit(0);

    const result = execFileSync(claudePath, [
      '-p',
      '--model', 'haiku',
      '--system-prompt', systemPrompt,
      prompt
    ], {
      encoding: 'utf8',
      timeout: 20000,
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env }
    });

    const reformulated = result.trim();

    if (!reformulated || reformulated.length < 15) process.exit(0);

    // ── Sortie hook JSON ─────────────────────────────
    const output = {
      hookSpecificOutput: {
        hookEventName: 'UserPromptSubmit',
        additionalContext: `[Prompt reformulé]\n${reformulated}`
      }
    };

    process.stdout.write(JSON.stringify(output));
  } catch {
    process.exit(0);
  } finally {
    try { unlinkSync(tmpFile); } catch {}
  }
}

function findClaude() {
  const paths = [
    '/Users/kovsky/.local/bin/claude',
    '/usr/local/bin/claude',
    '/opt/homebrew/bin/claude'
  ];

  for (const p of paths) {
    try {
      execFileSync(p, ['--version'], { encoding: 'utf8', timeout: 3000, stdio: 'pipe' });
      return p;
    } catch {}
  }

  // Fallback: try PATH
  try {
    const which = execFileSync('which', ['claude'], { encoding: 'utf8', timeout: 2000 }).trim();
    if (which) return which;
  } catch {}

  return null;
}

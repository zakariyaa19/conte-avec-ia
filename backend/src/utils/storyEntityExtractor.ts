/**
 * Extraction d'entites a partir du brief libre du parent via GPT-4o-mini.
 *
 * La detection regex frontend (`useStoryDetection`) peut se tromper (ex : prend
 * "Un" comme prenom si le brief commence par "Un enfant..."). Cet extracteur
 * GPT donne LA REPONSE AUTORITATIVE pour le prenom, les personnages secondaires,
 * l'age, etc. Il est appele cote serveur au moment de la creation de commande.
 *
 * Latence typique : 400-900ms. Cout : ~$0.0005 par appel.
 */

import { isPlausibleName } from './nameValidation';

export interface ExtractedEntities {
  protagonistName: string | null;     // Vrai prenom seulement, jamais "Un" / "Le" / "313"
  protagonistAge: string | null;       // Chiffre en string, ex: "7"
  protagonistGender: 'boy' | 'girl' | null;
  secondaryCharacters: Array<{
    name: string | null;               // Si nomme dans le brief
    kind: 'human' | 'animal';
    role: string | null;               // "petit frere", "chien", "meilleure amie", etc.
  }>;
  hobbies: string | null;
  favoriteDish: string | null;
  theme: string | null;                // "univers Mario", "foret enchantee", "famille musulmane"
  occasion: string | null;             // "anniversaire", "noel", "aid", etc.
  illustrationStyle: string | null;    // "manga", "aquarelle", "3d", etc.
}

// `success` distingue "GPT a lu le brief en entier et n'y a trouve aucun vrai
// prenom" (verdict fiable, protagonistName=null EST l'information) de "l'appel
// OpenAI a echoue" (aucune information, EMPTY_RESULT est un simple filet de
// securite). Avant, les deux cas etaient indiscernables pour l'appelant — un
// null "je ne trouve rien" et un null "je n'ai pas pu verifier" se valaient,
// donc le null autoritatif de GPT etait ignore au profit de la devinette
// regex frontend, parfois fausse (ex: "Rencontrer" pris pour un prenom).
export interface ExtractionResult {
  success: boolean;
  entities: ExtractedEntities;
}

const EMPTY_RESULT: ExtractedEntities = {
  protagonistName: null,
  protagonistAge: null,
  protagonistGender: null,
  secondaryCharacters: [],
  hobbies: null,
  favoriteDish: null,
  theme: null,
  occasion: null,
  illustrationStyle: null,
};

const SYSTEM_PROMPT = `Tu es un parseur d'entites pour un service de creation de livres pour enfants. Le parent ecrit un brief libre decrivant l'enfant et l'histoire qu'il imagine. Tu extrais les informations factuelles en JSON.

REGLES ABSOLUES :
- protagonistName : UNIQUEMENT un vrai prenom propre (Lea, Adam, Mohamed, Luna, Marie-Louise...). JAMAIS un article ("Un", "Le", "Mon"), un pronom ("Elle", "Il"), un mot generique ("enfant", "fille", "garcon", "bebe", "petit"), un verbe ou debut de phrase capitalise ("Rencontrer", "Aller", "Voici"), un chiffre, ou une syllabe sans sens. Si aucun vrai prenom n'est mentionne, retourne null — ne devine JAMAIS un prenom a partir d'un mot ambigu.
- protagonistGender : si aucun pronom explicite (il/elle) n'indique le genre mais que le prenom a un genre conventionnel clair en francais (ex: Sandro, Adam, Lucas = garcon ; Lea, Luna, Sasha peut etre les deux — dans le doute reste null), deduis-le du prenom. Ne force rien si le prenom est ambigu.
- protagonistAge : donne toujours un nombre d'annees. Si le brief donne un age en MOIS (ex: "6 mois", "15 mois"), convertis en annees completes arrondies vers le bas (6 mois -> "0", 15 mois -> "1", 23 mois -> "1"). Si aucun age n'est mentionne, retourne null.
- secondaryCharacters : extrais TOUS les autres personnages, animaux, doudous, freres, soeurs, amis mentionnes. Chacun a son propre objet.
- Ne fabrique RIEN d'autre. Si une info n'est pas explicitement dans le brief, retourne null pour ce champ.
- Reponds UNIQUEMENT avec le JSON, sans markdown, sans commentaire.

Format JSON attendu :
{
  "protagonistName": "Lea" | null,
  "protagonistAge": "7" | null,
  "protagonistGender": "boy" | "girl" | null,
  "secondaryCharacters": [{"name": "Moustache" | null, "kind": "human" | "animal", "role": "chien"}],
  "hobbies": "foot, dessin" | null,
  "favoriteDish": "pates" | null,
  "theme": "univers Mario" | "foret enchantee" | "famille musulmane" | null,
  "occasion": "anniversaire" | "noel" | "aid" | "ramadan" | "paques" | "halloween" | null,
  "illustrationStyle": "manga" | "aquarelle" | "3d" | "kawaii" | "pixar" | null
}`;

let openaiClient: any = null;
async function getOpenAI() {
  if (!openaiClient) {
    const { default: OpenAI } = await import('openai');
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
}

/**
 * Appelle GPT-4o-mini pour extraire les entites du brief.
 *
 * `success: false` signifie "je n'ai pas pu verifier" (brief trop court, cle
 * API absente, erreur OpenAI/parsing) — l'appelant doit alors utiliser les
 * valeurs frontend en fallback, comme avant.
 * `success: true` avec un champ a `null` signifie "j'ai lu le brief en entier
 * et cette info n'y est vraiment pas" — c'est une reponse autoritative que
 * l'appelant doit respecter, y compris quand elle contredit une devinette
 * regex frontend (ex: protagonistName=null doit ecraser un faux positif comme
 * "Rencontrer" pris pour un prenom).
 */
export async function extractStoryEntities(brief: string): Promise<ExtractionResult> {
  const text = (brief || '').trim();
  if (text.length < 3) return { success: false, entities: EMPTY_RESULT };
  if (!process.env.OPENAI_API_KEY) {
    console.warn('[EntityExtractor] OPENAI_API_KEY absent, skip extraction');
    return { success: false, entities: EMPTY_RESULT };
  }

  try {
    const openai = await getOpenAI();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Brief du parent :\n"""${text.slice(0, 800)}"""\n\nReponds avec le JSON des entites extraites.` },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 400,
      temperature: 0.1, // tres bas : on veut extraction deterministe, pas creativite
    });

    const raw = completion.choices[0]?.message?.content?.trim();
    if (!raw) return { success: false, entities: EMPTY_RESULT };

    const parsed = JSON.parse(raw);

    // Validation defensive : on ne fait confiance qu'aux types attendus
    const protagonistName =
      typeof parsed.protagonistName === 'string' && isPlausibleName(parsed.protagonistName)
        ? parsed.protagonistName.trim()
        : null;

    const protagonistAge =
      typeof parsed.protagonistAge === 'string' && /^\d{1,2}$/.test(parsed.protagonistAge)
        ? parsed.protagonistAge
        : null;

    const protagonistGender =
      parsed.protagonistGender === 'boy' || parsed.protagonistGender === 'girl'
        ? parsed.protagonistGender
        : null;

    const secondaryCharacters = Array.isArray(parsed.secondaryCharacters)
      ? parsed.secondaryCharacters
          .filter((c: any) => c && (c.kind === 'human' || c.kind === 'animal'))
          .map((c: any) => ({
            name: typeof c.name === 'string' && isPlausibleName(c.name) ? c.name.trim() : null,
            kind: c.kind as 'human' | 'animal',
            role: typeof c.role === 'string' && c.role.trim() ? c.role.trim().slice(0, 80) : null,
          }))
          .slice(0, 5)
      : [];

    const stringOrNull = (v: any, max = 200) =>
      typeof v === 'string' && v.trim().length > 0 ? v.trim().slice(0, max) : null;

    return {
      success: true,
      entities: {
        protagonistName,
        protagonistAge,
        protagonistGender,
        secondaryCharacters,
        hobbies: stringOrNull(parsed.hobbies, 200),
        favoriteDish: stringOrNull(parsed.favoriteDish, 80),
        theme: stringOrNull(parsed.theme, 120),
        occasion: stringOrNull(parsed.occasion, 40),
        illustrationStyle: stringOrNull(parsed.illustrationStyle, 40),
      },
    };
  } catch (error: any) {
    console.error('[EntityExtractor] Erreur:', error?.message || error);
    return { success: false, entities: EMPTY_RESULT };
  }
}

import OpenAI from 'openai';

// --- Types ---

export interface StoryTextParams {
  protagonistName: string;
  protagonistAge?: string;
  protagonistGender?: string;
  ageRange: string;
  generalTheme: string;
  customTheme?: string;
  specificSubject: string;
  customSubject?: string;
  centralMessage: string;
  customMessage?: string;
  hobbies?: string;
  favoriteDish?: string;
  specialEvents?: string;
  religion?: string;
  customReligion?: string;
  language?: string;
  secondaryCharactersJson?: string;
  creatorName?: string;
  narratedBy?: string;
  isClub?: boolean;
}

export interface StoryTextResult {
  title: string;
  paragraphs: string[];
}

// --- OpenAI Client ---

let openaiClient: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!openaiClient) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY non configuree');
    }
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
}

// --- Label maps ---

const THEME_LABELS: Record<string, string> = {
  'educational': 'Educatif / Decouverte',
  'fairy-tales': 'Contes de fees',
  'activities': 'Activites et jeux',
  'stories': 'Histoires et recits',
  'celebrations': 'Fetes et celebrations',
  'family': 'Famille et liens',
};

const OCCASION_LABELS: Record<string, string> = {
  'birthday': 'Anniversaire',
  'christmas': 'Noel',
  'new-year': 'Nouvel An',
  'easter': 'Paques',
  'eid': 'Aid el-Fitr',
  'mothers-day': 'Fete des meres',
  'fathers-day': 'Fete des peres',
};

const MESSAGE_LABELS: Record<string, string> = {
  'friendship': 'l\'amitie et la joie d\'etre ensemble',
  'courage': 'le courage et la bravoure face aux defis',
  'love': 'l\'amour et la tendresse',
  'perseverance': 'la perseverance et ne jamais abandonner',
  'sharing': 'le partage et la generosite',
  'honesty': 'l\'honnetete et l\'integrite',
  'respect': 'le respect et la bienveillance',
};

// --- Build prompt ---

function buildStoryPrompt(params: StoryTextParams): string {
  const name = params.protagonistName || 'Enfant';
  const genderWord = params.protagonistGender === 'girl' ? 'fille' : 'garcon';
  const hasSpecificAge = !!params.protagonistAge;
  const ageForVocab = params.protagonistAge || (params.ageRange === '0-2' ? '2' : params.ageRange === '3-5' ? '4' : params.ageRange === '10+' ? '11' : '7');

  const theme = params.customTheme || THEME_LABELS[params.generalTheme] || params.generalTheme;
  const occasion = params.customSubject || OCCASION_LABELS[params.specificSubject] || params.specificSubject || '';
  const message = params.customMessage || MESSAGE_LABELS[params.centralMessage] || params.centralMessage || '';

  const language = params.language || 'francais';

  // Parse secondary characters
  let secondaryChars = '';
  if (params.secondaryCharactersJson) {
    try {
      const chars = JSON.parse(params.secondaryCharactersJson);
      if (Array.isArray(chars) && chars.length > 0) {
        secondaryChars = chars.map((c: any) => {
          const kindLabel = c.kind === 'animal' ? 'Animal' : 'Humain';
          const parts = [`- ${c.name || 'Ami(e)'} (${kindLabel})`];
          if (c.ageOrType) parts.push(c.ageOrType);
          if (c.physical) parts.push(`description : ${c.physical}`);
          return parts.join(' — ');
        }).join('\n');
      }
    } catch { /* ignore parse errors */ }
  }

  const religionNote = params.customReligion || params.religion || '';

  return `Tu es un auteur de livres pour enfants reconnu. Ecris le DEBUT d'un conte en ${language} de EXACTEMENT 3 paragraphes.

IMPORTANT — STRUCTURE CLIFFHANGER :
Ce texte est le TOUT DEBUT d'une histoire. Il ne doit PAS avoir de fin. L'histoire doit se COUPER net au moment le plus palpitant pour donner une envie IRRESISTIBLE de lire la suite. Le lecteur doit ressentir une frustration positive : il DOIT connaitre la suite.

PROTAGONISTE :
- Prenom : ${name}
${hasSpecificAge ? `- Age : ${params.protagonistAge} ans` : `- Tranche d'age : ${params.ageRange || '6-9'} ans (NE PAS mentionner un age precis dans le recit)`}
- Genre : ${genderWord}
${params.hobbies ? `- Passions/Hobbies : ${params.hobbies}` : ''}
${params.favoriteDish ? `- Plat favori : ${params.favoriteDish}` : ''}

${secondaryChars ? `PERSONNAGES SECONDAIRES (OBLIGATOIRE — ils doivent TOUS apparaitre dans l'histoire) :\n${secondaryChars}\nChaque personnage secondaire doit avoir un vrai role dans l'histoire : dialogues, actions, interactions avec ${name}. Ils ne doivent PAS etre simplement mentionnes une fois — ils accompagnent ${name} dans l'aventure.` : ''}

THEME : ${theme}
${occasion ? `OCCASION : ${occasion} — l'histoire doit se derouler dans le contexte de cette occasion` : ''}
${message ? `MESSAGE CENTRAL : ${message} — ce message doit etre le fil conducteur de toute l'histoire` : ''}
${religionNote ? `CONTEXTE RELIGIEUX/SPIRITUEL : ${religionNote} (integrer avec respect et delicatesse)` : ''}
${params.specialEvents ? `EVENEMENT SPECIAL : ${params.specialEvents} — integrer cet evenement comme element important de l'histoire` : ''}

STRUCTURE NARRATIVE OBLIGATOIRE (3 paragraphes — rythme RAPIDE) :
- Paragraphe 1 : INTRODUCTION IMMERSIVE — Presenter ${name} dans un decor enchante. Poser l'univers en quelques phrases fortes. Le lecteur doit etre immediatement captive.
- Paragraphe 2 : DECLENCHEUR + AVENTURE — Un evenement inattendu lance l'aventure. ${name} decouvre quelque chose d'extraordinaire, rencontre un personnage fascinant, ou se retrouve dans une situation incroyable. Monter la tension RAPIDEMENT.
- Paragraphe 3 : CLIFFHANGER INTENSE — Le moment le plus palpitant. ${name} est sur le point de decouvrir un secret, d'ouvrir une porte mystérieuse, d'affronter un defi... mais le texte SE COUPE NET. La derniere phrase doit creer un suspense IRRESISTIBLE. Le parent et l'enfant doivent absolument vouloir connaitre la suite. NE PAS resoudre. NE PAS donner d'indice sur la resolution.

EXIGENCES :
1. PAS DE FIN. PAS DE RESOLUTION. PAS DE MORALE. L'histoire est INACHEVEE.
2. Vocabulaire adapte a un enfant de ${ageForVocab} ans
3. Le prenom "${name}" doit apparaitre dans CHAQUE paragraphe
4. Chaque paragraphe fait 3 a 4 phrases (assez pour immerger mais pas trop long — optimise pour lecture mobile)
${params.hobbies ? `5. Les passions de ${name} (${params.hobbies}) doivent etre integrees naturellement dans l'histoire` : '5. Integrer des details personnels pour rendre l\'histoire unique'}
${params.favoriteDish ? `6. Mentionner le plat favori (${params.favoriteDish}) a un moment de l'histoire` : ''}
7. ${secondaryChars ? `CRUCIAL : Chaque personnage secondaire doit apparaitre avec des actions concretes et des dialogues.` : 'L\'histoire doit etre captivante, magique et positive'}
8. Ecris en ${language}
${!hasSpecificAge ? `9. IMPORTANT : Ne mentionne JAMAIS un age precis pour ${name} dans le texte.` : ''}
10. Le dernier paragraphe DOIT finir sur des points de suspension (...) pour marquer le suspense

FORMAT DE REPONSE :
Reponds UNIQUEMENT avec un JSON array de EXACTEMENT 3 strings (chaque string = 1 paragraphe).
Pas de titre, pas de commentaire, JUSTE le JSON array.
Exemple : ["Premier paragraphe...", "Deuxieme paragraphe...", "Troisieme paragraphe avec cliffhanger..."]`;
}

// --- Club Premium prompt (12 paragraphs, rich narrative) ---

function buildClubStoryPrompt(params: StoryTextParams): string {
  const name = params.protagonistName || 'Enfant';
  const genderWord = params.protagonistGender === 'girl' ? 'fille' : 'garcon';
  const hasSpecificAge = !!params.protagonistAge;
  const ageForVocab = params.protagonistAge || (params.ageRange === '0-2' ? '2' : params.ageRange === '3-5' ? '4' : params.ageRange === '10+' ? '11' : '7');

  const theme = params.customTheme || THEME_LABELS[params.generalTheme] || params.generalTheme;
  const occasion = params.customSubject || OCCASION_LABELS[params.specificSubject] || params.specificSubject || '';
  const message = params.customMessage || MESSAGE_LABELS[params.centralMessage] || params.centralMessage || '';
  const language = params.language || 'francais';

  let secondaryChars = '';
  if (params.secondaryCharactersJson) {
    try {
      const chars = JSON.parse(params.secondaryCharactersJson);
      if (Array.isArray(chars) && chars.length > 0) {
        secondaryChars = chars.map((c: any) => {
          const kindLabel = c.kind === 'animal' ? 'Animal' : 'Humain';
          const parts = [`- ${c.name || 'Ami(e)'} (${kindLabel})`];
          if (c.ageOrType) parts.push(c.ageOrType);
          if (c.physical) parts.push(`description : ${c.physical}`);
          return parts.join(' — ');
        }).join('\n');
      }
    } catch { /* ignore */ }
  }

  const religionNote = params.customReligion || params.religion || '';
  const narratedBy = params.narratedBy || params.creatorName || '';

  return `Tu es un auteur professionnel de livres premium pour enfants. Ecris un conte LONG et IMMERSIF en ${language} de EXACTEMENT 20 paragraphes.

PROTAGONISTE :
- Prenom : ${name}
${hasSpecificAge ? `- Age : ${params.protagonistAge} ans` : `- Tranche d'age : ${params.ageRange || '6-9'} ans (NE PAS mentionner un age precis)`}
- Genre : ${genderWord}
${params.hobbies ? `- Passions/Hobbies : ${params.hobbies} — ces passions doivent etre un element CENTRAL de l'aventure, pas juste mentionnees` : ''}
${params.favoriteDish ? `- Plat favori : ${params.favoriteDish} — l'integrer naturellement dans une scene` : ''}

${secondaryChars ? `PERSONNAGES SECONDAIRES (CRUCIAL — chacun doit avoir un VRAI role) :
${secondaryChars}
Regles strictes :
- Chaque personnage secondaire doit apparaitre dans AU MOINS 5 paragraphes
- Ils doivent avoir des dialogues, des actions, des emotions
- Ils interagissent activement avec ${name}
- Les animaux ont un comportement coherent et attachant
- Les humains ont une personnalite distincte` : ''}

THEME : ${theme}
${occasion ? `OCCASION : ${occasion} — l'histoire se deroule ENTIEREMENT dans le contexte de cette occasion. Ambiance, decors, details doivent correspondre.` : ''}
${message ? `MESSAGE CENTRAL : ${message} — ce theme est le FIL ROUGE de toute l'histoire. Il doit transparaitre dans les choix, les actions et la resolution.` : ''}
${religionNote ? `CONTEXTE SPIRITUEL : ${religionNote} (integrer avec respect et delicatesse)` : ''}
${params.specialEvents ? `EVENEMENT SPECIAL : ${params.specialEvents} — element important de l'intrigue` : ''}

STRUCTURE NARRATIVE OBLIGATOIRE (20 paragraphes) :
- Paragraphes 1-3 : INTRODUCTION — Presenter ${name}, son monde, ses proches. Creer l'atmosphere. Poser le decor de maniere enchantee.
- Paragraphe 4 : DECLENCHEUR — Un evenement inattendu lance l'aventure.
- Paragraphes 5-8 : DEVELOPPEMENT — ${name} explore, decouvre, progresse. Rencontres et interactions multiples.
- Paragraphes 9-11 : MONTEE EN TENSION — Des defis grandissants. Decouvertes. Apprentissages.
- Paragraphes 12-14 : OBSTACLE MAJEUR — Le plus grand defi. ${name} doit trouver une solution. Moment de doute, d'emotion.
- Paragraphes 15-17 : RESOLUTION — ${name} surmonte l'obstacle grace a ses qualites, son courage et l'aide de ses proches.
- Paragraphes 18-19 : CONCLUSION — Retour au calme. Celebration. Reconnaissance. Les personnages partagent un moment de joie.
- Paragraphe 20 : MORALE ET OUVERTURE — Lecon apprise, formulee avec douceur et poesie.${narratedBy ? ` Terminer par "Histoire racontee par ${narratedBy}" en derniere phrase.` : ''}

EXIGENCES QUALITE PREMIUM :
1. Chaque paragraphe fait 3 a 4 phrases (riche mais toujours aere pour lecture mobile)
2. Vocabulaire adapte a un enfant de ${ageForVocab} ans mais avec de la richesse
3. Le prenom "${name}" apparait dans au moins 14 paragraphes sur 20
4. Descriptions sensorielles : couleurs, sons, odeurs, textures
5. Dialogues vivants entre les personnages (au moins 6 echanges dans l'histoire)
6. Emotions claires et evoluant au fil de l'histoire : curiosite, excitation, peur, determination, joie
7. Coherence parfaite entre tous les elements personnalises
8. Ecris UNIQUEMENT en ${language} — aucun mot dans une autre langue
${!hasSpecificAge ? `9. NE MENTIONNE JAMAIS un age precis pour ${name}` : ''}

FORMAT DE REPONSE :
Reponds UNIQUEMENT avec un JSON array de EXACTEMENT 20 strings.
Pas de titre, pas de commentaire, JUSTE le JSON array.
Exemple : ["Premier paragraphe...", "Deuxieme...", ..., "Vingtieme paragraphe..."]`;
}

// --- Generate story text ---

export async function generateStoryText(params: StoryTextParams, title: string): Promise<StoryTextResult> {
  const openai = getOpenAI();
  const isClub = params.isClub === true;
  const targetParagraphs = isClub ? 20 : 3;
  const prompt = isClub ? buildClubStoryPrompt(params) : buildStoryPrompt(params);

  console.log(`[StoryTextGenerator] Generating ${targetParagraphs} paragraphs (${isClub ? 'CLUB' : 'FREE'}) for:`, params.protagonistName);

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: isClub ? 8000 : 4000,
        temperature: isClub ? 0.85 : 0.8,
      });

      const content = response.choices[0]?.message?.content?.trim();
      if (!content) {
        throw new Error('Reponse GPT vide');
      }

      let jsonStr = content;
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        jsonStr = jsonMatch[0];
      }

      const paragraphs = JSON.parse(jsonStr);

      if (!Array.isArray(paragraphs) || paragraphs.length !== targetParagraphs) {
        console.warn(`[StoryTextGenerator] Attempt ${attempt + 1}: Got ${Array.isArray(paragraphs) ? paragraphs.length : 'non-array'} paragraphs, expected ${targetParagraphs}`);
        if (attempt === 0) continue;
        if (Array.isArray(paragraphs) && paragraphs.length >= targetParagraphs - 2) {
          while (paragraphs.length < targetParagraphs) paragraphs.push(paragraphs[paragraphs.length - 1]);
          return { title, paragraphs: paragraphs.slice(0, targetParagraphs) };
        }
        throw new Error(`GPT a retourne ${Array.isArray(paragraphs) ? paragraphs.length : 0} paragraphes au lieu de ${targetParagraphs}`);
      }

      const validParagraphs = paragraphs.map((p: any) => String(p));

      console.log(`[StoryTextGenerator] Successfully generated ${targetParagraphs} paragraphs (${isClub ? 'CLUB' : 'FREE'})`);
      return { title, paragraphs: validParagraphs };

    } catch (error) {
      console.error(`[StoryTextGenerator] Attempt ${attempt + 1} failed:`, error);
      if (attempt === 1) throw error;
    }
  }

  throw new Error('Echec generation texte apres 2 tentatives');
}

// --- Complete a cliffhanger story (generate pages 6-12 continuation) ---

export async function generateStoryContinuation(
  params: StoryTextParams,
  title: string,
  existingParagraphs: string[]
): Promise<StoryTextResult> {
  const openai = getOpenAI();
  const name = params.protagonistName || 'Enfant';
  const genderWord = params.protagonistGender === 'girl' ? 'fille' : 'garcon';
  const language = params.language || 'francais';
  const theme = params.customTheme || THEME_LABELS[params.generalTheme] || params.generalTheme || '';
  const occasion = params.customSubject || OCCASION_LABELS[params.specificSubject] || params.specificSubject || '';
  const message = params.customMessage || MESSAGE_LABELS[params.centralMessage] || params.centralMessage || '';
  const ageForVocab = params.protagonistAge || (params.ageRange === '0-2' ? '2' : params.ageRange === '3-5' ? '4' : params.ageRange === '10+' ? '11' : '7');

  // Parse secondary characters
  let secondaryChars = '';
  if (params.secondaryCharactersJson) {
    try {
      const chars = JSON.parse(params.secondaryCharactersJson);
      if (Array.isArray(chars) && chars.length > 0) {
        secondaryChars = chars.map((c: any) => {
          const kindLabel = c.kind === 'animal' ? 'Animal' : 'Humain';
          const parts = [`- ${c.name || 'Ami(e)'} (${kindLabel})`];
          if (c.ageOrType) parts.push(c.ageOrType);
          if (c.physical) parts.push(`description : ${c.physical}`);
          return parts.join(' — ');
        }).join('\n');
      }
    } catch { /* ignore */ }
  }

  const religionNote = params.customReligion || params.religion || '';
  const existingText = existingParagraphs.map((p, i) => `Paragraphe ${i + 1}: ${p}`).join('\n');

  const continuationPrompt = `Tu es un auteur de livres pour enfants reconnu. Tu dois ecrire la SUITE et la FIN d'une histoire deja commencee.

TITRE DE L'HISTOIRE : ${title}

CONTEXTE ORIGINAL DE L'HISTOIRE (A RESPECTER IMPERATIVEMENT) :
- Protagoniste : ${name} (${genderWord}, ${params.ageRange || '6-9'} ans)
- Theme : ${theme}
${occasion ? `- Occasion : ${occasion}` : ''}
${message ? `- Message central : ${message}` : ''}
${params.hobbies ? `- Passions/Hobbies de ${name} : ${params.hobbies}` : ''}
${params.favoriteDish ? `- Plat favori : ${params.favoriteDish}` : ''}
${secondaryChars ? `- Personnages secondaires :\n${secondaryChars}` : ''}
${religionNote ? `- Contexte spirituel : ${religionNote}` : ''}
${params.specialEvents ? `- Evenement special : ${params.specialEvents}` : ''}

VOICI LE DEBUT DE L'HISTOIRE (${existingParagraphs.length} paragraphes deja ecrits) :
${existingText}

REGLE ABSOLUE : La suite DOIT se derouler dans le MEME UNIVERS, avec les MEMES personnages, le MEME theme (${theme}) et le MEME ton que les paragraphes ci-dessus. Tu ne dois PAS changer d'univers, pas introduire de nouveaux themes, pas inventer un decor different. Tu continues EXACTEMENT la meme histoire.

Tu dois maintenant ecrire EXACTEMENT 17 paragraphes pour TERMINER cette histoire en beaute.

STRUCTURE DE LA SUITE (17 paragraphes — histoire RICHE et IMMERSIVE) :
- Paragraphe 4 : REVELATION — La suite immediate du cliffhanger. Ce que ${name} decouvre. MEME LIEU, MEME UNIVERS.
- Paragraphes 5-7 : AVENTURE — L'aventure s'installe. ${name} explore, decouvre, interagit avec les personnages. Dialogues et actions.
- Paragraphes 8-10 : MONTEE EN TENSION — Des obstacles croissants, des decouvertes, des choix. Le theme "${theme}" est au coeur.
- Paragraphes 11-13 : EPREUVE MAJEURE — Le plus grand defi. ${name} doute, cherche une solution, puise dans son courage${params.hobbies ? ` et ses passions (${params.hobbies})` : ''}.
- Paragraphes 14-16 : RESOLUTION — ${name} surmonte l'epreuve grace a ses qualites et l'aide de ses proches. Moment emouvant.
- Paragraphes 17-19 : CELEBRATION — Retour au calme, joie partagee, reconnaissance. Les personnages savourent la victoire.
- Paragraphe 20 : CONCLUSION — Morale douce et ouverture poetique${message ? `. Le message central (${message}) doit transparaitre dans la resolution et la conclusion.` : ''}

EXIGENCES :
1. COHERENCE ABSOLUE avec les paragraphes existants : memes personnages, meme univers (${theme}), meme ton, meme decor
2. ${secondaryChars ? `Les personnages secondaires doivent reapparaitre dans la suite avec des actions concretes et des dialogues` : 'Garder les memes personnages que dans le debut'}
3. Vocabulaire adapte a un enfant de ${ageForVocab} ans
4. Chaque paragraphe fait 3 a 4 phrases (riche mais aere)
5. Le prenom "${name}" doit apparaitre regulierement (dans au moins 12 paragraphes sur 17)
6. La fin doit etre satisfaisante, positive et emouvante
7. Au moins 5 echanges de dialogues dans la suite
8. Ecris UNIQUEMENT en ${language}

FORMAT DE REPONSE :
Reponds UNIQUEMENT avec un JSON array de EXACTEMENT 17 strings (paragraphes 4 a 20).
Pas de titre, pas de commentaire, JUSTE le JSON array.`;

  const targetContinuation = 17; // 3 existing + 17 new = 20 total
  console.log(`[StoryTextGenerator] Generating continuation (${targetContinuation} paragraphs) for: ${name}`);

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: continuationPrompt }],
        max_tokens: 12000,
        temperature: 0.85,
      });

      const content = response.choices[0]?.message?.content?.trim();
      if (!content) throw new Error('Reponse GPT vide pour continuation');

      let jsonStr = content;
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) jsonStr = jsonMatch[0];

      const continuationParagraphs = JSON.parse(jsonStr);

      if (!Array.isArray(continuationParagraphs) || continuationParagraphs.length < targetContinuation) {
        if (attempt === 0) continue;
        // Tolérance: si GPT retourne un peu moins, on complète
        if (Array.isArray(continuationParagraphs) && continuationParagraphs.length >= targetContinuation - 3) {
          while (continuationParagraphs.length < targetContinuation) continuationParagraphs.push(continuationParagraphs[continuationParagraphs.length - 1]);
        } else {
          throw new Error(`Continuation: ${continuationParagraphs?.length || 0} paragraphes au lieu de ${targetContinuation}`);
        }
      }

      // Assembler l'histoire complete : 3 premiers + 17 nouveaux = 20 paragraphes
      const validContinuation = continuationParagraphs.map((p: any) => String(p));
      const fullParagraphs = [...existingParagraphs, ...validContinuation].slice(0, 20);

      console.log(`[StoryTextGenerator] Continuation generated: ${validContinuation.length} new paragraphs, total: ${fullParagraphs.length}`);
      return { title, paragraphs: fullParagraphs };

    } catch (error) {
      console.error(`[StoryTextGenerator] Continuation attempt ${attempt + 1} failed:`, error);
      if (attempt === 1) throw error;
    }
  }

  throw new Error('Echec generation continuation apres 2 tentatives');
}

// --- Cliffhanger Summary (1-sentence hook for paywall) ---

export async function generateCliffhangerSummary(
  paragraphs: string[],
  protagonistName: string,
  language: string = 'francais'
): Promise<string | null> {
  if (!Array.isArray(paragraphs) || paragraphs.length === 0) return null;

  const openai = getOpenAI();
  const name = protagonistName || 'l\'enfant';
  const lastParagraphs = paragraphs.slice(-2).join('\n\n');

  const prompt = `Voici la fin d'un debut de conte pour enfants (il s'arrete sur un cliffhanger) :

${lastParagraphs}

Ecris UNE SEULE phrase en ${language}, sous forme de question, qui donne a un parent l'envie irresistible d'acheter la suite pour son enfant. La question doit :
- Faire reference a un element CONCRET du cliffhanger (pas generique)
- Commencer par "Est-ce que ${name}..." ou "Que va-t-il se passer quand ${name}..." ou une tournure similaire
- Faire maximum 140 caracteres
- Ne PAS divulguer la reponse
- Etre emotionnellement engageante

Reponds UNIQUEMENT avec la phrase, sans guillemets, sans prefixe, sans commentaire.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 120,
      temperature: 0.8,
    });
    const raw = response.choices[0]?.message?.content?.trim();
    if (!raw) return null;
    const cleaned = raw.replace(/^["'«»\s]+|["'«»\s]+$/g, '').trim();
    if (!cleaned || cleaned.length < 10) return null;
    return cleaned.slice(0, 200);
  } catch (error) {
    console.error('[CliffhangerSummary] Failed:', error);
    return null;
  }
}

// --- Story Preview (3 opening paragraphs) ---

export interface StoryPreviewResult {
  title: string;
  paragraphs: string[];
}

function buildStoryPreviewPrompt(params: StoryTextParams): string {
  const name = params.protagonistName || 'Enfant';
  const genderWord = params.protagonistGender === 'girl' ? 'fille' : 'garcon';
  const hasSpecificAge = !!params.protagonistAge;
  const ageForVocab = params.protagonistAge || (params.ageRange === '0-2' ? '2' : params.ageRange === '3-5' ? '4' : params.ageRange === '10+' ? '11' : '7');

  const theme = params.customTheme || THEME_LABELS[params.generalTheme] || params.generalTheme;
  const occasion = params.customSubject || OCCASION_LABELS[params.specificSubject] || params.specificSubject || '';
  const message = params.customMessage || MESSAGE_LABELS[params.centralMessage] || params.centralMessage || '';

  const language = params.language || 'francais';

  let secondaryChars = '';
  if (params.secondaryCharactersJson) {
    try {
      const chars = JSON.parse(params.secondaryCharactersJson);
      if (Array.isArray(chars) && chars.length > 0) {
        secondaryChars = chars.map((c: any) => `${c.name || 'Ami(e)'}`).join(', ');
      }
    } catch { /* ignore */ }
  }

  return `Tu es un auteur de livres pour enfants reconnu. Ecris les 3 premiers paragraphes d'ouverture d'un conte en ${language}.

PROTAGONISTE :
- Prenom : ${name}
${hasSpecificAge ? `- Age : ${params.protagonistAge} ans` : `- Tranche d'age : ${params.ageRange || '6-9'} ans (NE PAS mentionner un age precis)`}
- Genre : ${genderWord}
${params.hobbies ? `- Passions : ${params.hobbies}` : ''}

THEME : ${theme}
${occasion ? `OCCASION : ${occasion}` : ''}
${message ? `MESSAGE CENTRAL : ${message}` : ''}
${secondaryChars ? `PERSONNAGES SECONDAIRES : ${secondaryChars}` : ''}

EXIGENCES :
1. Exactement 3 paragraphes captivants qui ouvrent l'histoire
2. Le lecteur doit etre immerse et vouloir connaitre la suite
3. Le prenom "${name}" doit apparaitre des le premier paragraphe
4. Vocabulaire adapte a un enfant de ${ageForVocab} ans
5. Chaque paragraphe fait 3 a 5 phrases
6. Terminer sur un moment de suspense ou d'excitation qui donne envie de lire la suite
7. Ecris en ${language}
${!hasSpecificAge ? `8. IMPORTANT : Ne mentionne JAMAIS un age precis pour ${name}. Pas de "avait X ans".` : ''}

FORMAT DE REPONSE :
Reponds UNIQUEMENT avec un JSON array de exactement 3 strings.
Pas de titre, pas de commentaire, JUSTE le JSON array.`;
}

export async function generateStoryPreview(params: StoryTextParams, title: string): Promise<StoryPreviewResult> {
  const openai = getOpenAI();
  const prompt = buildStoryPreviewPrompt(params);

  console.log('[StoryPreview] Generating 3 preview paragraphs for:', params.protagonistName);

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0.8,
    });

    const content = response.choices[0]?.message?.content?.trim();
    if (!content) throw new Error('Reponse GPT vide');

    let jsonStr = content;
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) jsonStr = jsonMatch[0];

    const paragraphs = JSON.parse(jsonStr);

    if (!Array.isArray(paragraphs) || paragraphs.length < 2) {
      throw new Error(`GPT a retourne ${Array.isArray(paragraphs) ? paragraphs.length : 0} paragraphes au lieu de 3`);
    }

    const validParagraphs = paragraphs.slice(0, 3).map((p: any) => String(p));
    console.log('[StoryPreview] Successfully generated', validParagraphs.length, 'preview paragraphs');
    return { title, paragraphs: validParagraphs };

  } catch (error) {
    console.error('[StoryPreview] Failed:', error);
    throw error;
  }
}

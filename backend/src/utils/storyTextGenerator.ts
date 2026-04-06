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

  return `Tu es un auteur de livres pour enfants reconnu. Ecris le DEBUT d'un conte en ${language} de EXACTEMENT 5 paragraphes.

IMPORTANT — STRUCTURE CLIFFHANGER :
Ce texte est le DEBUT d'une histoire. Il ne doit PAS avoir de fin. L'histoire doit se COUPER au moment le plus palpitant, le plus intense, pour donner envie de lire la suite.

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

STRUCTURE NARRATIVE OBLIGATOIRE (5 paragraphes) :
- Paragraphe 1 : INTRODUCTION — Presenter ${name}, son univers, poser le decor de maniere enchantee
- Paragraphe 2 : MISE EN PLACE — Un element declencheur lance l'aventure
- Paragraphe 3 : DEVELOPPEMENT — ${name} avance dans l'aventure, decouvre, explore
- Paragraphe 4 : MONTEE EN TENSION — Un defi, un mystere, une decouverte importante
- Paragraphe 5 : CLIFFHANGER — Le moment le plus intense de l'histoire. ${name} est sur le point de decouvrir quelque chose d'incroyable, de resoudre le mystere, d'affronter le defi... mais le texte SE COUPE ICI. La derniere phrase doit creer un suspense irresistible (une porte qui s'ouvre, une lumiere qui brille, un bruit mysterieux, un personnage qui apparait...). NE PAS resoudre la situation.

EXIGENCES :
1. PAS DE FIN. PAS DE RESOLUTION. PAS DE MORALE. L'histoire est INACHEVEE.
2. Vocabulaire adapte a un enfant de ${ageForVocab} ans
3. Le prenom "${name}" doit apparaitre regulierement
4. Chaque paragraphe fait 2 a 3 phrases MAXIMUM (tres court, aere, optimise pour lecture mobile plein ecran)
${params.hobbies ? `5. Les passions de ${name} (${params.hobbies}) doivent etre integrees naturellement dans l'histoire` : '5. Integrer des details personnels pour rendre l\'histoire unique'}
${params.favoriteDish ? `6. Mentionner le plat favori (${params.favoriteDish}) a un moment de l'histoire` : ''}
7. ${secondaryChars ? `CRUCIAL : Chaque personnage secondaire doit apparaitre avec des actions concretes et des dialogues.` : 'L\'histoire doit etre captivante, magique et positive'}
8. Ecris en ${language}
${!hasSpecificAge ? `9. IMPORTANT : Ne mentionne JAMAIS un age precis pour ${name} dans le texte.` : ''}
10. Le dernier paragraphe DOIT finir sur des points de suspension (...) pour marquer le suspense

FORMAT DE REPONSE :
Reponds UNIQUEMENT avec un JSON array de EXACTEMENT 5 strings (chaque string = 1 paragraphe).
Pas de titre, pas de commentaire, JUSTE le JSON array.
Exemple : ["Premier paragraphe...", "Deuxieme paragraphe...", ..., "Cinquieme paragraphe avec cliffhanger..."]`;
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

  return `Tu es un auteur professionnel de livres premium pour enfants. Ecris un conte LONG et IMMERSIF en ${language} de EXACTEMENT 12 paragraphes.

PROTAGONISTE :
- Prenom : ${name}
${hasSpecificAge ? `- Age : ${params.protagonistAge} ans` : `- Tranche d'age : ${params.ageRange || '6-9'} ans (NE PAS mentionner un age precis)`}
- Genre : ${genderWord}
${params.hobbies ? `- Passions/Hobbies : ${params.hobbies} — ces passions doivent etre un element CENTRAL de l'aventure, pas juste mentionnees` : ''}
${params.favoriteDish ? `- Plat favori : ${params.favoriteDish} — l'integrer naturellement dans une scene` : ''}

${secondaryChars ? `PERSONNAGES SECONDAIRES (CRUCIAL — chacun doit avoir un VRAI role) :
${secondaryChars}
Regles strictes :
- Chaque personnage secondaire doit apparaitre dans AU MOINS 3 paragraphes
- Ils doivent avoir des dialogues, des actions, des emotions
- Ils interagissent activement avec ${name}
- Les animaux ont un comportement coherent et attachant
- Les humains ont une personnalite distincte` : ''}

THEME : ${theme}
${occasion ? `OCCASION : ${occasion} — l'histoire se deroule ENTIEREMENT dans le contexte de cette occasion. Ambiance, decors, details doivent correspondre.` : ''}
${message ? `MESSAGE CENTRAL : ${message} — ce theme est le FIL ROUGE de toute l'histoire. Il doit transparaitre dans les choix, les actions et la resolution.` : ''}
${religionNote ? `CONTEXTE SPIRITUEL : ${religionNote} (integrer avec respect et delicatesse)` : ''}
${params.specialEvents ? `EVENEMENT SPECIAL : ${params.specialEvents} — element important de l'intrigue` : ''}

STRUCTURE NARRATIVE OBLIGATOIRE (12 paragraphes) :
- Paragraphes 1-2 : INTRODUCTION — Presenter ${name}, son monde, ses proches. Creer l'atmosphere.
- Paragraphe 3 : DECLENCHEUR — Un evenement inattendu lance l'aventure.
- Paragraphes 4-6 : DEVELOPPEMENT — ${name} explore, decouvre, progresse. Rencontres et interactions.
- Paragraphes 7-8 : OBSTACLE — Un defi majeur. ${name} doit trouver une solution. Moment de doute.
- Paragraphes 9-10 : RESOLUTION — ${name} surmonte l'obstacle grace a ses qualites et l'aide de ses proches.
- Paragraphe 11 : CONCLUSION — Retour au calme. Celebration. Reconnaissance.
- Paragraphe 12 : MORALE ET OUVERTURE — Lecon apprise, formulee avec douceur.${narratedBy ? ` Terminer par "Histoire racontee par ${narratedBy}" en derniere phrase.` : ''}

EXIGENCES QUALITE PREMIUM :
1. Chaque paragraphe fait 3 a 4 phrases (plus riche que la version basique, mais toujours aere)
2. Vocabulaire adapte a un enfant de ${ageForVocab} ans mais avec de la richesse
3. Le prenom "${name}" apparait dans au moins 8 paragraphes sur 12
4. Descriptions sensorielles : couleurs, sons, odeurs, textures
5. Dialogues vivants entre les personnages (au moins 3 echanges dans l'histoire)
6. Emotions claires et evoluant au fil de l'histoire
7. Coherence parfaite entre tous les elements personnalises
8. Ecris UNIQUEMENT en ${language} — aucun mot dans une autre langue
${!hasSpecificAge ? `9. NE MENTIONNE JAMAIS un age precis pour ${name}` : ''}

FORMAT DE REPONSE :
Reponds UNIQUEMENT avec un JSON array de EXACTEMENT 12 strings.
Pas de titre, pas de commentaire, JUSTE le JSON array.
Exemple : ["Premier paragraphe...", "Deuxieme...", ..., "Douzieme paragraphe..."]`;
}

// --- Generate story text ---

export async function generateStoryText(params: StoryTextParams, title: string): Promise<StoryTextResult> {
  const openai = getOpenAI();
  const isClub = params.isClub === true;
  const targetParagraphs = isClub ? 12 : 5;
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
  const language = params.language || 'francais';
  const message = params.customMessage || MESSAGE_LABELS[params.centralMessage] || params.centralMessage || '';
  const ageForVocab = params.protagonistAge || (params.ageRange === '0-2' ? '2' : params.ageRange === '3-5' ? '4' : params.ageRange === '10+' ? '11' : '7');

  const existingText = existingParagraphs.map((p, i) => `Paragraphe ${i + 1}: ${p}`).join('\n');

  const continuationPrompt = `Tu es un auteur de livres pour enfants reconnu. Tu dois ecrire la SUITE et la FIN d'une histoire deja commencee.

TITRE DE L'HISTOIRE : ${title}

VOICI LE DEBUT DE L'HISTOIRE (5 paragraphes deja ecrits) :
${existingText}

L'histoire s'etait arretee sur un cliffhanger. Tu dois maintenant ecrire EXACTEMENT 7 paragraphes pour TERMINER cette histoire.

STRUCTURE DE LA SUITE (7 paragraphes) :
- Paragraphe 6 : REVELATION — La suite immediate du cliffhanger. Ce que ${name} decouvre.
- Paragraphe 7 : AVENTURE — L'aventure continue, explorations, interactions
- Paragraphe 8 : OBSTACLE — Un defi majeur se presente
- Paragraphe 9 : DETERMINATION — ${name} puise dans son courage et ses qualites
- Paragraphe 10 : RESOLUTION — ${name} surmonte le defi grace a ses qualites et l'aide de ses proches
- Paragraphe 11 : CELEBRATION — Retour au calme, joie, reconnaissance
- Paragraphe 12 : CONCLUSION — Morale douce et ouverture${message ? `. Le message central (${message}) doit transparaitre dans la resolution et la conclusion.` : ''}

EXIGENCES :
1. La suite doit etre COHERENTE avec les 5 premiers paragraphes (memes personnages, meme univers, meme ton)
2. Vocabulaire adapte a un enfant de ${ageForVocab} ans
3. Chaque paragraphe fait 3 a 4 phrases (un peu plus riche car c'est la version complete)
4. Le prenom "${name}" doit apparaitre regulierement
5. La fin doit etre satisfaisante, positive et emouvante
6. Ecris en ${language}

FORMAT DE REPONSE :
Reponds UNIQUEMENT avec un JSON array de EXACTEMENT 7 strings (paragraphes 6 a 12).
Pas de titre, pas de commentaire, JUSTE le JSON array.`;

  console.log(`[StoryTextGenerator] Generating continuation (7 paragraphs) for: ${name}`);

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: continuationPrompt }],
        max_tokens: 6000,
        temperature: 0.85,
      });

      const content = response.choices[0]?.message?.content?.trim();
      if (!content) throw new Error('Reponse GPT vide pour continuation');

      let jsonStr = content;
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) jsonStr = jsonMatch[0];

      const continuationParagraphs = JSON.parse(jsonStr);

      if (!Array.isArray(continuationParagraphs) || continuationParagraphs.length < 7) {
        if (attempt === 0) continue;
        // Tolérance: si GPT retourne 5-6 au lieu de 7, on complète
        if (Array.isArray(continuationParagraphs) && continuationParagraphs.length >= 5) {
          while (continuationParagraphs.length < 7) continuationParagraphs.push(continuationParagraphs[continuationParagraphs.length - 1]);
        } else {
          throw new Error(`Continuation: ${continuationParagraphs?.length || 0} paragraphes au lieu de 7`);
        }
      }

      // Assembler l'histoire complete : 5 premiers + 7 nouveaux = 12 paragraphes
      const validContinuation = continuationParagraphs.map((p: any) => String(p));
      const fullParagraphs = [...existingParagraphs, ...validContinuation].slice(0, 12);

      console.log(`[StoryTextGenerator] Continuation generated: ${validContinuation.length} new paragraphs, total: ${fullParagraphs.length}`);
      return { title, paragraphs: fullParagraphs };

    } catch (error) {
      console.error(`[StoryTextGenerator] Continuation attempt ${attempt + 1} failed:`, error);
      if (attempt === 1) throw error;
    }
  }

  throw new Error('Echec generation continuation apres 2 tentatives');
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

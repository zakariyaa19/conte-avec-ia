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

  return `Tu es un auteur de livres pour enfants reconnu. Ecris un conte en ${language} de 6 paragraphes.

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

EXIGENCES :
1. Arc narratif lineaire : debut (presentation), developpement (aventure/defi), climax, resolution, conclusion
2. Vocabulaire adapte a un enfant de ${ageForVocab} ans
3. Le prenom "${name}" doit apparaitre regulierement
4. La morale doit etre organique, integree a l'histoire (pas de lecon explicite a la fin)
5. Chaque paragraphe fait 2 a 3 phrases MAXIMUM (tres court, aere, optimise pour lecture mobile plein ecran)
${params.hobbies ? `6. Les passions de ${name} (${params.hobbies}) doivent etre integrees naturellement dans l'histoire` : '6. Integrer des details personnels pour rendre l\'histoire unique'}
${params.favoriteDish ? `7. Mentionner le plat favori (${params.favoriteDish}) a un moment de l'histoire` : ''}
8. ${secondaryChars ? `CRUCIAL : Chaque personnage secondaire doit apparaitre dans PLUSIEURS paragraphes, avec des actions concretes et des dialogues. Ils sont essentiels a l'histoire, pas de la figuration.` : 'L\'histoire doit etre captivante, magique et positive'}
9. Ecris en ${language}
${!hasSpecificAge ? `10. IMPORTANT : Ne mentionne JAMAIS un age precis pour ${name} dans le texte. Ne dis pas "avait X ans" ou "agee de X ans". Utilise des expressions comme "petit(e)", "jeune" si necessaire.` : ''}

FORMAT DE REPONSE :
Reponds UNIQUEMENT avec un JSON array de exactement 6 strings (chaque string = 1 paragraphe).
Pas de titre, pas de commentaire, JUSTE le JSON array.
Exemple : ["Premier paragraphe...", "Deuxieme paragraphe...", ...]`;
}

// --- Generate story text ---

export async function generateStoryText(params: StoryTextParams, title: string): Promise<StoryTextResult> {
  const openai = getOpenAI();
  const prompt = buildStoryPrompt(params);

  console.log('[StoryTextGenerator] Generating 6 paragraphs for:', params.protagonistName);

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 4000,
        temperature: 0.8,
      });

      const content = response.choices[0]?.message?.content?.trim();
      if (!content) {
        throw new Error('Reponse GPT vide');
      }

      // Extract JSON array from response (handle markdown code blocks)
      let jsonStr = content;
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        jsonStr = jsonMatch[0];
      }

      const paragraphs = JSON.parse(jsonStr);

      if (!Array.isArray(paragraphs) || paragraphs.length !== 6) {
        console.warn(`[StoryTextGenerator] Attempt ${attempt + 1}: Got ${Array.isArray(paragraphs) ? paragraphs.length : 'non-array'} paragraphs, expected 6`);
        if (attempt === 0) continue;
        // On second attempt, accept close to 6 or pad/trim
        if (Array.isArray(paragraphs) && paragraphs.length >= 4) {
          while (paragraphs.length < 6) paragraphs.push(paragraphs[paragraphs.length - 1]);
          return { title, paragraphs: paragraphs.slice(0, 6) };
        }
        throw new Error(`GPT a retourne ${Array.isArray(paragraphs) ? paragraphs.length : 0} paragraphes au lieu de 6`);
      }

      // Validate all entries are strings
      const validParagraphs = paragraphs.map((p: any) => String(p));

      console.log('[StoryTextGenerator] Successfully generated 6 paragraphs');
      return { title, paragraphs: validParagraphs };

    } catch (error) {
      console.error(`[StoryTextGenerator] Attempt ${attempt + 1} failed:`, error);
      if (attempt === 1) throw error;
    }
  }

  throw new Error('Echec generation texte apres 2 tentatives');
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

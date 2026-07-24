import { Request, Response } from 'express';
import {
  generateCoverImage,
  generateBookTitle,
  computeParamsHash,
  getCachedPreview,
  setCachedPreview,
  getCachedStoryPreview,
  setCachedStoryPreview,
  getCachedIllustration,
  setCachedIllustration,
  CoverGenerationParams
} from '../utils/coverGeneratorService';
import { generateStoryPreview, StoryTextParams } from '../utils/storyTextGenerator';
import { generateFirstIllustration, ImageGenerationParams } from '../utils/storyImageGenerator';
import { uploadCoverToCloudinary } from '../utils/cloudinaryService';

export class PreviewController {
  static async generateCoverPreview(req: Request, res: Response) {
    try {
      const { formData, photoBase64 } = req.body;

      if (!formData) {
        return res.status(400).json({
          success: false,
          message: 'Donnees du formulaire requises'
        });
      }

      // Valider les champs obligatoires (couleurs optionnelles — mode simplifié peut ne pas les avoir)
      const required = ['protagonistName', 'protagonistAge', 'protagonistGender', 'generalTheme'];
      const missing = required.filter(f => !formData[f]);
      if (missing.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Champs manquants: ${missing.join(', ')}`
        });
      }

      // Verifier que la cle OpenAI est configuree
      if (!process.env.OPENAI_API_KEY) {
        return res.status(503).json({
          success: false,
          message: 'Service de preview temporairement indisponible'
        });
      }

      const params: CoverGenerationParams = {
        protagonistName: formData.protagonistName,
        protagonistAge: formData.protagonistAge,
        protagonistGender: formData.protagonistGender,
        eyeColor: formData.eyeColor,
        hairColor: formData.hairColor,
        skinColor: formData.skinColor,
        illustrationStyle: formData.illustrationStyle || 'illustrated-book',
        generalTheme: formData.generalTheme,
        customTheme: formData.customTheme,
        specificSubject: formData.specificSubject || '',
        customSubject: formData.customSubject,
        centralMessage: formData.centralMessage,
        customMessage: formData.customMessage,
        ageRange: formData.ageRange,
        hobbies: formData.hobbies,
        favoriteDish: formData.favoriteDish,
        specialEvents: formData.specialEvents,
      };

      // Verifier le cache
      const hasPhoto = !!photoBase64;
      const paramsHash = computeParamsHash(params, hasPhoto);
      const cached = getCachedPreview(paramsHash);

      if (cached) {
        console.log('Cover preview: cache hit pour hash', paramsHash);
        return res.json({
          success: true,
          data: { imageBase64: cached.imageBase64, paramsHash, title: cached.title }
        });
      }

      // Generer l'image
      console.log('Cover preview: generation pour', params.protagonistName, '- style:', params.illustrationStyle);
      console.log('Cover preview: custom fields =>', {
        generalTheme: params.generalTheme,
        customTheme: params.customTheme || '(vide)',
        specificSubject: params.specificSubject,
        customSubject: params.customSubject || '(vide)',
        centralMessage: params.centralMessage || '(vide)',
        customMessage: params.customMessage || '(vide)',
        hobbies: params.hobbies || '(vide)',
        specialEvents: params.specialEvents || '(vide)',
      });
      const result = await generateCoverImage(params, photoBase64);

      // Stocker en cache
      setCachedPreview(paramsHash, result.imageBase64, result.title);

      res.json({
        success: true,
        data: { imageBase64: result.imageBase64, paramsHash, title: result.title }
      });

    } catch (error: any) {
      console.error('Erreur generation cover preview:', error);

      // Gerer les erreurs specifiques OpenAI
      if (error?.status === 400 && error?.error?.code === 'content_policy_violation') {
        return res.status(200).json({
          success: false,
          message: 'Le contenu genere ne respecte pas les regles de securite. Essayez avec des parametres differents.'
        });
      }

      if (error?.status === 429) {
        return res.status(429).json({
          success: false,
          message: 'Trop de demandes. Reessayez dans quelques instants.'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erreur lors de la generation de l\'apercu'
      });
    }
  }

  static async generateFirstIllustration(req: Request, res: Response) {
    try {
      const { formData, paragraph, coverImageBase64 } = req.body;

      if (!formData || !paragraph) {
        return res.status(400).json({
          success: false,
          message: 'Donnees du formulaire et paragraphe requis'
        });
      }

      const required = ['protagonistName', 'protagonistGender', 'generalTheme'];
      const missing = required.filter(f => !formData[f]);
      if (missing.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Champs manquants: ${missing.join(', ')}`
        });
      }

      if (!process.env.OPENAI_API_KEY) {
        return res.status(503).json({
          success: false,
          message: 'Service temporairement indisponible'
        });
      }

      const coverParams: CoverGenerationParams = {
        protagonistName: formData.protagonistName,
        protagonistAge: formData.protagonistAge || '',
        protagonistGender: formData.protagonistGender,
        illustrationStyle: formData.illustrationStyle || 'illustrated-book',
        generalTheme: formData.generalTheme,
        customTheme: formData.customTheme,
        specificSubject: formData.specificSubject || '',
        customSubject: formData.customSubject,
        centralMessage: formData.centralMessage,
        customMessage: formData.customMessage,
        ageRange: formData.ageRange,
        hobbies: formData.hobbies,
        specialEvents: formData.specialEvents,
      };

      const paramsHash = computeParamsHash(coverParams, false);
      const cached = getCachedIllustration(paramsHash);

      if (cached) {
        console.log('Illustration preview: cache hit for hash', paramsHash);
        return res.json({
          success: true,
          data: { illustrationBase64: cached }
        });
      }

      const imageParams: ImageGenerationParams = {
        protagonistName: formData.protagonistName,
        protagonistAge: formData.protagonistAge,
        protagonistGender: formData.protagonistGender,
        ageRange: formData.ageRange,
        eyeColor: formData.eyeColor,
        hairColor: formData.hairColor,
        skinColor: formData.skinColor,
        illustrationStyle: formData.illustrationStyle || 'illustrated-book',
        generalTheme: formData.generalTheme,
        customTheme: formData.customTheme,
        specificSubject: formData.specificSubject || '',
        customSubject: formData.customSubject,
        centralMessage: formData.centralMessage,
        customMessage: formData.customMessage,
        hobbies: formData.hobbies,
        specialEvents: formData.specialEvents,
        secondaryCharactersJson: formData.secondaryCharactersJson,
      };

      // Decode cover image if provided for visual consistency
      let coverBuffer: Buffer | undefined;
      if (coverImageBase64) {
        coverBuffer = Buffer.from(coverImageBase64, 'base64');
      }

      console.log('Illustration preview: generating for', formData.protagonistName);
      const imageBuffer = await generateFirstIllustration(
        imageParams,
        formData.protagonistName,
        paragraph,
        coverBuffer
      );

      // Upload to Cloudinary
      const publicId = `preview-illust-${paramsHash}-${Date.now()}`;
      const illustrationUrl = await uploadCoverToCloudinary(imageBuffer, publicId);

      // Cache the base64
      const illustrationBase64 = imageBuffer.toString('base64');
      setCachedIllustration(paramsHash, illustrationBase64);

      res.json({
        success: true,
        data: { illustrationUrl, illustrationBase64 }
      });

    } catch (error: any) {
      console.error('Erreur generation illustration preview:', error);

      if (error?.status === 400 && error?.error?.code === 'content_policy_violation') {
        return res.status(200).json({
          success: false,
          message: 'Le contenu genere ne respecte pas les regles de securite.'
        });
      }

      if (error?.status === 429) {
        return res.status(429).json({
          success: false,
          message: 'Trop de demandes. Reessayez dans quelques instants.'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erreur lors de la generation de l\'illustration'
      });
    }
  }

  static async generateStoryPreview(req: Request, res: Response) {
    try {
      const { formData } = req.body;

      if (!formData) {
        return res.status(400).json({
          success: false,
          message: 'Donnees du formulaire requises'
        });
      }

      const required = ['protagonistName', 'protagonistAge', 'protagonistGender', 'generalTheme'];
      const missing = required.filter(f => !formData[f]);
      if (missing.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Champs manquants: ${missing.join(', ')}`
        });
      }

      if (!process.env.OPENAI_API_KEY) {
        return res.status(503).json({
          success: false,
          message: 'Service de preview temporairement indisponible'
        });
      }

      // Build hash for cache (reuse cover hash logic)
      const coverParams: CoverGenerationParams = {
        protagonistName: formData.protagonistName,
        protagonistAge: formData.protagonistAge,
        protagonistGender: formData.protagonistGender,
        illustrationStyle: formData.illustrationStyle || 'illustrated-book',
        generalTheme: formData.generalTheme,
        customTheme: formData.customTheme,
        specificSubject: formData.specificSubject || '',
        customSubject: formData.customSubject,
        centralMessage: formData.centralMessage,
        customMessage: formData.customMessage,
        ageRange: formData.ageRange,
        hobbies: formData.hobbies,
        specialEvents: formData.specialEvents,
      };

      const paramsHash = computeParamsHash(coverParams, false);
      const cached = getCachedStoryPreview(paramsHash);

      if (cached) {
        console.log('Story preview: cache hit pour hash', paramsHash);
        return res.json({
          success: true,
          data: { title: cached.title, paragraphs: cached.paragraphs }
        });
      }

      // Generate title first
      const title = await generateBookTitle(coverParams);

      // Generate preview paragraphs
      const storyParams: StoryTextParams = {
        protagonistName: formData.protagonistName,
        protagonistAge: formData.protagonistAge,
        protagonistGender: formData.protagonistGender,
        ageRange: formData.ageRange || '6-9',
        generalTheme: formData.generalTheme,
        customTheme: formData.customTheme,
        specificSubject: formData.specificSubject || '',
        customSubject: formData.customSubject,
        centralMessage: formData.centralMessage,
        customMessage: formData.customMessage,
        hobbies: formData.hobbies,
        favoriteDish: formData.favoriteDish,
        specialEvents: formData.specialEvents,
        language: formData.language,
        secondaryCharactersJson: formData.secondaryCharactersJson,
        creatorName: formData.creatorName,
      };

      console.log('Story preview: generation pour', storyParams.protagonistName);
      const result = await generateStoryPreview(storyParams, title);

      // Cache result
      setCachedStoryPreview(paramsHash, result.title, result.paragraphs);

      res.json({
        success: true,
        data: { title: result.title, paragraphs: result.paragraphs }
      });

    } catch (error: any) {
      console.error('Erreur generation story preview:', error);

      if (error?.status === 429) {
        return res.status(429).json({
          success: false,
          message: 'Trop de demandes. Reessayez dans quelques instants.'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erreur lors de la generation de l\'apercu texte'
      });
    }
  }

  /**
   * Smart Hint — analyse en temps reel du brief client par GPT-4o-mini.
   * Retourne UNE phrase de conseil courte et personnalisee selon ce qui manque.
   * Cache LRU 5 min pour eviter les appels en doublon.
   */
  static async generateSmartHint(req: Request, res: Response) {
    try {
      const { description, hasPhoto, skippedTopics } = req.body as { description?: string; hasPhoto?: boolean; skippedTopics?: string[] };
      const photoUploaded = !!hasPhoto;
      const skipped = Array.isArray(skippedTopics) ? skippedTopics.filter(s => typeof s === 'string').slice(0, 10) : [];

      // Validation
      const desc = (description || '').trim();
      if (desc.length < 3) {
        return res.json({
          success: true,
          data: { hint: "Quel est le prénom de l'enfant ?" }
        });
      }
      if (desc.length > 800) {
        return res.status(400).json({ success: false, message: 'Description trop longue' });
      }

      if (!process.env.OPENAI_API_KEY) {
        return res.json({
          success: true,
          data: { hint: getLocalFallbackHint(desc, photoUploaded, skipped) }
        });
      }

      // Cache lookup (5 min TTL) — la photo et les sujets ignores influencent
      // le hint, les inclure dans la cle (sinon un hint perime pourrait
      // reproposer un sujet deja ignore par la personne).
      const cacheKey = hintCacheKey(desc) + '|p=' + (photoUploaded ? '1' : '0') + '|s=' + skipped.slice().sort().join(',');
      const cached = hintCache.get(cacheKey);
      if (cached && Date.now() - cached.t < 5 * 60 * 1000) {
        return res.json({ success: true, data: { hint: cached.hint, cached: true } });
      }

      const { default: OpenAI } = await import('openai');
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const systemPrompt = `Tu es un assistant intelligent qui aide un parent a definir les elements de l'histoire personnalisee de son enfant. Tu lis son brief et tu proposes UNE seule question ou suggestion a la fois.

═══ TA MISSION ═══

Identifie la PROCHAINE information a suggerer et demande-la de facon naturelle. Tu collectes des INFORMATIONS FACTUELLES, pas des idees narratives. Pas de suggestions de scenario, pas d'inventions creatives.

═══ DEUX PALIERS — PAS UNE LISTE PLATE ═══

PALIER CŒUR (une vraie question tant qu'il en manque une — ce sont les 4 seules infos qui changent vraiment la qualite de l'histoire) :
1. **Prenom** du personnage principal
2. **Age** de l'enfant
3. **Genre** (fille/garcon) — sauter si le prenom est evident (Lucas=garcon, Ines=fille, Adam=garcon, Luna=fille, etc.) ou si "fille"/"garcon" deja dit
4. **Univers / monde** (franchise — Mario, Harry Potter — contexte culturel — musulman, africain — ou decor — foret, espace)

PALIER BONUS (suggere une fois chacun, JAMAIS bloquant — une fois le palier CŒUR complet, le brief est deja utilisable, ces suggestions sont juste des ameliorations) :
5. **Personnage secondaire** qui accompagne le heros (ami, frere, soeur, etc.)
6. **Animal de compagnie** (si pas deja couvert par #5)
7. **Morale / message** a transmettre
8. **Photo** de l'enfant (pour que les illustrations lui ressemblent)
9. **Style d'illustration** (manga, aquarelle, 3D, Pixar, kawaii...)
10. **Hobbies / passions** specifiques de l'enfant

Ne demande JAMAIS s'il y a un mechant dans l'histoire — ce n'est pas une information utile a collecter (tres majoritairement "non" quand on le demande, elle n'ameliore quasiment jamais le brief). Si le parent en parle spontanement, tant mieux, mais ne le suggere jamais toi-meme.

═══ SUJETS DEJA IGNORES — NE JAMAIS REPROPOSER ═══

Les INFOS EXTERNES listent d'eventuels "sujets deja ignores" : la personne a continue d'ecrire sans repondre a cette suggestion precise. Traite-les comme deja couverts et passe directement au suivant.

═══ DETECTION IMPLICITE — NE PAS REDEMANDER ═══

Avant de poser ta question, verifie ce qui est deja DANS le brief, meme implicitement :

- Prenom donne le genre : Lucas/Adam/Hugo=garcon, Ines/Luna/Emma=fille
- Termes culturels/religieux ("musulmane", "africaine", "chretienne", "juif") = univers couvert
- Franchise ("Mario", "Harry Potter", "Pokemon", "Disney", "Star Wars") = univers couvert
- "Petit frere", "soeur", "ami(e)", "cousin", "voisin" = personnage secondaire couvert
- "Chien Rex", "chat", "lapin", n'importe quel animal nomme = animal de compagnie couvert
- "Courage", "amitie", "partage", "respect", "perseverance" = morale couverte
- "Aime/adore/passionne par X" = hobby couvert
- "manga", "aquarelle", "3D", "Pixar" en contexte style = style couvert

NE redemande JAMAIS quelque chose deja present.

═══ FORMULATIONS NATURELLES ═══

Pose la question avec naturel, comme un assistant qui guide :

- Pour le prenom : "Quel est le prenom de l'enfant ?"
- Pour l'age : "Quel age a {prenom} ?"
- Pour le genre : "{prenom} est une fille ou un garcon ?"
- Pour l'univers : "Dans quel univers va se derouler l'histoire ?"
- Pour le perso secondaire : "Quel personnage secondaire pour accompagner {prenom} ?"
- Pour l'animal : "Y a-t-il un animal de compagnie ?"
- Pour la morale : "Quelle morale ou message a transmettre ?"
- Pour la photo : "Ajoute sa photo pour que les illustrations lui ressemblent ?"
- Pour le style : "Quel style d'illustration ? (manga, aquarelle, 3D...)"
- Pour le hobby : "Quelles sont ses passions preferees ?"

Tu peux varier les formulations — l'important c'est que ce soit une demande d'INFO, pas une suggestion narrative.

═══ REGLE — PALIER CŒUR COMPLET ═══

Des que prenom + age + genre + univers sont TOUS couverts (ou dans les sujets deja ignores), ta phrase doit TOUJOURS commencer par affirmer que c'est pret, meme si tu ajoutes une suggestion bonus juste apres. Exemple : "C'est pret ! Tu peux ajouter sa photo pour un rendu encore plus fidele." Ne dis JAMAIS une suggestion bonus seule, sans l'affirmation de readiness devant — ca donnerait l'impression a tort que ce n'est pas encore utilisable.

Si en plus tous les bonus sont couverts ou dans les sujets ignores :
→ "Tout est prêt, lance la création." (seul, sans suggestion)

═══ EXEMPLES ═══

Brief : "Lucas"
→ "Quel age a Lucas ?"

Brief : "Lucas 13 ans"
✓ prenom, age. Genre=garcon implicite (Lucas).
→ "Dans quel univers va se derouler l'histoire ?"

Brief : "Lucas 13 ans garcon histoire musulmane"
✓ palier cœur complet (prenom, age, genre, univers).
Prochaine suggestion bonus : personnage secondaire.
→ "C'est pret ! Quel personnage secondaire pour accompagner Lucas ?"

Brief : "Inès collectionne les fossiles dans l'univers de Mario"
✓ prenom, univers, hobby (fossiles). Cœur incomplet (age manque).
→ "Quel age a Ines ?"

Brief : "Adam 5 ans Mario chien Rex courage style Pixar" + photo deja jointe
✓ Cœur complet + tous les bonus couverts (perso via animal, morale, style) + photo.
→ "Tout est prêt, lance la création."

Brief vide ou < 10 chars
→ "Quel est le prenom de l'enfant ?"

═══ FORMAT DE LA REPONSE ═══

- UNE seule phrase courte, 6 a 16 mots
- Francais parfait avec accents (é, è, à, ç, ê, ô, î, û)
- Tutoiement chaleureux et naturel
- AUCUN emoji, guillemet, numerotation, "💡"
- AUCUNE validation flatteuse ("Super !", "Genial !")
- Pas de raisonnement explicite, pas de "Verifions"

═══ FORMAT JSON ═══

Retourne UNIQUEMENT un objet JSON (rien avant, rien apres) :
{"hint": "ta phrase ici", "topic": "cle-technique-du-sujet-aborde-ou-null"}

"topic" DOIT etre exactement une de ces valeurs (jamais autre chose) :
"name", "age", "gender", "theme", "secondary", "moral", "photo", "style", "hobby", ou null si "hint" est "Tout est prêt, lance la création." (rien a suggerer).
Ceci sert a verifier automatiquement que tu n'as pas reprop une des sujets ignores — sois honnete sur le sujet que "hint" aborde vraiment.`;

      // Les cles techniques (name/age/secondary/...) ne veulent rien dire
      // pour GPT, qui ne connait que les libelles francais de sa propre
      // liste de priorite — sans cette traduction, "secondary" n'etait
      // jamais reconnu comme "personnage secondaire" et le sujet continuait
      // a etre reproposee malgre le skip (bug trouve en testant en direct
      // contre l'API avant de considerer ce point termine).
      const skippedLine = skipped.length > 0
        ? skipped.map(k => SKIP_TOPIC_LABELS_FR[k] || k).join(', ')
        : 'aucun';
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Brief du parent :\n"""${desc}"""\n\nINFOS EXTERNES :\n- Photo de l'enfant deja jointe : ${photoUploaded ? 'OUI ✓' : 'NON'}\n- Sujets deja ignores par la personne (ne jamais reproposer) : ${skippedLine}\n\nQuelle est la PROCHAINE suggestion (palier cœur en priorite, puis bonus) ? ${photoUploaded ? 'Ne propose JAMAIS d\'ajouter une photo (deja faite).' : ''}` },
        ],
        response_format: { type: 'json_object' },
        max_tokens: 80,
        // Temperature moderee : on veut respect de la priorite, pas creativite narrative
        temperature: 0.4,
      });

      // Filet de securite : GPT respecte le skip dans l'immense majorite des
      // cas, mais pas garanti a 100% (observe en testant : quand TOUS les
      // sujets bonus sont ignores, GPT retombe parfois sur sa liste de
      // priorite malgre l'instruction). On demande donc a GPT de declarer
      // explicitement quel sujet il aborde (JSON, champ "topic"), et on
      // rejette sa reponse — fallback local deterministe — si ce sujet est
      // justement dans la liste des sujets ignores.
      const CORE_TOPIC_KEYS = ['name', 'age', 'gender', 'theme'];
      let hint = '';
      const raw = completion.choices[0]?.message?.content?.trim();
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          const topic = typeof parsed.topic === 'string' ? parsed.topic : null;
          let candidateHint = typeof parsed.hint === 'string' ? parsed.hint.trim() : '';
          if (candidateHint && !(topic && skipped.includes(topic))) {
            // 2e filet de securite : GPT oublie parfois le prefixe "C'est
            // pret !" une fois le palier coeur complet, malgre l'instruction.
            // On le force ici, deterministe, plutot que de compter dessus.
            const isBonusSuggestion = !!topic && !CORE_TOPIC_KEYS.includes(topic);
            const alreadyAffirmsReady = /^(c'?est|tout est)\s+pr[êe]t/i.test(candidateHint);
            if (isBonusSuggestion && detectCoreComplete(desc) && !alreadyAffirmsReady) {
              candidateHint = `C'est prêt ! ${candidateHint}`;
            }
            hint = candidateHint;
          }
        } catch {
          // JSON invalide — hint reste vide, fallback local plus bas
        }
      }
      // Nettoyage defensif : enlever guillemets, points multiples, etc.
      hint = hint.replace(/^["'«»\s]+|["'«»\s]+$/g, '').replace(/\.{2,}/g, '.').trim();
      if (!hint) hint = getLocalFallbackHint(desc, photoUploaded, skipped);

      // Cache
      hintCache.set(cacheKey, { hint, t: Date.now() });
      // Cleanup si > 200 entrees
      if (hintCache.size > 200) {
        const cutoff = Date.now() - 5 * 60 * 1000;
        for (const [k, v] of hintCache.entries()) {
          if (v.t < cutoff) hintCache.delete(k);
        }
      }

      res.json({ success: true, data: { hint } });
    } catch (error: any) {
      console.error('Erreur smart-hint:', error?.message || error);
      // Fallback gracieux : local hint, pas d'erreur exposee
      const desc = (req.body?.description || '').trim();
      const ph = !!req.body?.hasPhoto;
      const sk = Array.isArray(req.body?.skippedTopics) ? req.body.skippedTopics.filter((s: any) => typeof s === 'string').slice(0, 10) : [];
      res.json({ success: true, data: { hint: getLocalFallbackHint(desc, ph, sk), fallback: true } });
    }
  }
}

// Traduit les cles techniques du frontend (useStoryDetection.ts, type
// HintTopic) vers les libelles francais utilises dans systemPrompt — sans
// ca, GPT ne peut pas relier "secondary" a "5. Personnage secondaire".
const SKIP_TOPIC_LABELS_FR: Record<string, string> = {
  name: 'prenom',
  age: 'age',
  gender: 'genre',
  theme: 'univers',
  secondary: 'personnage secondaire',
  moral: 'morale',
  photo: 'photo',
  style: 'style',
  hobby: 'hobbies',
  occasion: 'occasion',
};

// ── Cache LRU simple en memoire (5 min TTL) ────────────────────────
const hintCache = new Map<string, { hint: string; t: number }>();
function hintCacheKey(desc: string): string {
  // Normalize : lowercase + trim + collapse spaces. Pas de hash pour rester debug-friendly.
  return desc.toLowerCase().replace(/\s+/g, ' ').trim().slice(0, 400);
}

// Detection grossiere (regex, pas de dependance a l'extraction GPT) du
// palier coeur complet — utilisee a la fois par le fallback local ET pour
// forcer le prefixe "C'est pret !" sur la reponse GPT quand celle-ci
// oublie de l'inclure (observe en testant : GPT respecte le skip de sujets
// de facon fiable une fois le format JSON en place, mais oublie parfois ce
// prefixe precis — filet de securite deterministe plutot que de compter
// sur la formulation du prompt seule).
function detectCoreComplete(desc: string): boolean {
  const hasName = /^[A-ZÀ-ÖØ-Ý]/.test(desc.trim());
  const hasAge = /\d+\s*ans?/i.test(desc);
  const hasGender = /(fille|garçon|garcon|fillette|princesse|prince|fils)/i.test(desc);
  const hasUniverse = (/(univers|monde|royaume|aventure|magie|ecole|école)/i.test(desc)) || desc.length >= 60;
  return hasName && hasAge && hasGender && hasUniverse;
}

// ── Fallback local si OpenAI indisponible ────────────────────────
// Meme logique a 2 paliers que le prompt GPT (voir plus haut) : palier
// coeur (prenom/age/genre/univers) bloque encore le "tout est pret",
// palier bonus (perso secondaire/morale/photo) ne bloque plus une fois le
// coeur complet — prefixe juste la suggestion par une affirmation de
// readiness. `skipped` : sujets que la personne a deja ignores, jamais
// reproposes.
function getLocalFallbackHint(desc: string, hasPhoto = false, skipped: string[] = []): string {
  const t = desc.toLowerCase();
  if (t.length < 3) return "Quel est le prénom de l'enfant ?";
  const skip = new Set(skipped);

  const hasName = /^[A-ZÀ-ÖØ-Ý]/.test(desc.trim());
  const hasAge = /\d+\s*ans?/i.test(desc);
  const hasGender = /(fille|garçon|garcon|fillette|princesse|prince|fils)/i.test(desc);
  const hasUniverse = (/(univers|monde|royaume|aventure|magie|ecole|école)/i.test(desc)) || desc.length >= 60;

  if (!hasName && !skip.has('name')) return "Quel est le prénom de l'enfant ?";
  if (!hasAge && !skip.has('age')) return "Quel âge a l'enfant ?";
  if (!hasGender && !skip.has('gender')) return "Une fille ou un garçon ?";
  if (!hasUniverse && !skip.has('theme')) return "Dans quel univers va se dérouler l'histoire ?";

  // Palier coeur complet (ou ignore) a partir d'ici — toute suggestion
  // bonus est prefixee pour ne jamais donner l'impression d'un blocage.
  const hasSecondary = /(frere|frère|soeur|sœur|ami|copain|copine|cousin|grand-)/i.test(desc);
  const hasMoral = /(courage|amitié|amitie|amour|partage|honnete|honnête|persever)/i.test(desc);

  if (!hasSecondary && !skip.has('secondary')) return "C'est prêt ! Quel personnage secondaire pour l'accompagner ?";
  if (!hasMoral && !skip.has('moral')) return "C'est prêt ! Une morale ou un message à transmettre ?";
  if (!hasPhoto && !skip.has('photo')) return "C'est prêt ! Ajoute sa photo pour que les illustrations lui ressemblent ?";
  return "Tout est prêt, lance la création.";
}

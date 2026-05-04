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
      const { description } = req.body as { description?: string };

      // Validation
      const desc = (description || '').trim();
      if (desc.length < 3) {
        return res.json({
          success: true,
          data: { hint: "Décris-moi l'enfant et l'histoire que tu imagines." }
        });
      }
      if (desc.length > 800) {
        return res.status(400).json({ success: false, message: 'Description trop longue' });
      }

      if (!process.env.OPENAI_API_KEY) {
        return res.json({
          success: true,
          data: { hint: getLocalFallbackHint(desc) }
        });
      }

      // Cache lookup (5 min TTL)
      const cacheKey = hintCacheKey(desc);
      const cached = hintCache.get(cacheKey);
      if (cached && Date.now() - cached.t < 5 * 60 * 1000) {
        return res.json({ success: true, data: { hint: cached.hint, cached: true } });
      }

      const { default: OpenAI } = await import('openai');
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const systemPrompt = `Tu es un editeur creatif qui aide un parent a imaginer l'histoire personnalisee qu'il veut creer pour son enfant. Tu lis attentivement son brief, tu comprends son intention narrative, et tu proposes UNE seule suggestion qui rendra CETTE histoire vraiment singuliere.

═══ TA MISSION ═══

Ton job n'est PAS de cocher une checklist. C'est de :

1. COMPRENDRE ce que le parent imagine (univers, ton, personnages, age, contexte culturel, atmosphere)
2. IDENTIFIER ce qui manque vraiment OU ce qui rendrait l'histoire memorable et propre a cet enfant
3. PROPOSER UNE seule suggestion contextuelle, intelligente et inspirante

Tu dois etre INTELLIGENT et CREATIF — pas robotique. Chaque histoire merite une suggestion unique adaptee a SON contexte.

═══ AVANT DE REPONDRE ═══

Lis le brief MOT PAR MOT. Identifie tout ce qui est deja present, meme implicitement :
- Un prenom donne le genre (Lucas=garcon, Ines=fille)
- Un terme culturel/religieux ("musulmane", "chretienne", "africaine") donne un univers entier
- Une franchise ("Mario", "Harry Potter", "Pokemon") donne univers + style + souvent compagnons
- "Petit frere", "soeur", "ami(e)", "chien", n'importe quel animal = compagnon present
- "Aime", "adore", "passionne", "fan de" = hobby/passion connue
- "Morale", "message", ou un mot-cle de valeur ("courage", "amitie", "partage") = morale presente
- L'ambiance generale du brief implique deja un ton (drole, mysterieux, doux, epique...)

NE SUGGERE JAMAIS quelque chose qui est deja dans le texte, meme implicitement.

═══ TYPES DE SUGGESTIONS POSSIBLES ═══

Selon ce qui manque, tu peux proposer :
- **Element narratif** : un evenement declencheur, un defi, une rencontre, un secret a decouvrir
- **Personnage secondaire** : si vraiment aucun n'est present
- **Trait du protagoniste** : une passion, une peur, une qualite, un objet fetiche
- **Univers / contexte** : si vraiment rien n'est etabli (lieu, epoque, atmosphere)
- **Morale** : si rien d'implicite n'est la
- **Style d'illustration** : si rien n'est mentionne
- **Detail surprenant** : un element specifique a cette histoire qui la rend unique

Privilegie le contextuel — si le brief mentionne "Ramadan", suggere quelque chose lie au Ramadan. Si "Mario", suggere quelque chose lie a Mario. Si "fossiles", suggere quelque chose de paleontologique.

═══ EXEMPLES INTELLIGENTS ═══

Brief : "Lucas 13 ans garcon histoire musulmane"
✓ Detecte : prenom, age, genre (garcon explicite + Lucas), univers culturel (musulmane).
Mauvaise suggestion robotique : "Un compagnon ?" (trop generique)
Bonne suggestion contextuelle : "Une valeur islamique au coeur de l'aventure ?" OU "Un evenement comme le Ramadan ou un voyage a La Mecque ?" OU "Un grand-pere sage qui transmet la sagesse ?"

Brief : "Ines collectionne les fossiles dans l'univers de Mario"
✓ Detecte : prenom, univers (Mario), passion (fossiles).
Bonne suggestion : "Un Goomba paleontologue qui l'aide ?" OU "Quel age a Ines ?" OU "Un fossile magique qui deverrouille un pouvoir ?"

Brief : "Adam 5 ans aide sa grand-mere"
✓ Detecte : prenom, age, compagnon (grand-mere).
Bonne suggestion : "Quelle aventure incroyable les attend ensemble ?" OU "Un secret de famille a decouvrir ?" OU "Adam est un garcon ou il y a une autre precision ?"

Brief : "Luna princesse"
✓ Detecte : prenom, role (princesse implique genre fille + univers feerie + contexte royal).
Bonne suggestion : "Quel age a Luna ?" OU "Un dragon allie ou un royaume a sauver ?"

Brief : "Adam 5 ans Mario chien Rex courage style Pixar"
✓ Tout couvert : prenom, age, univers, compagnon, morale, style.
Reponse : "Tout est prêt, lance la création."

Brief vide ou < 10 chars
→ "Décris-moi l'enfant et l'histoire que tu imagines."

═══ FORMAT DE LA REPONSE ═══

- UNE seule phrase, 8 a 16 mots maximum
- Francais parfait avec tous les accents (é, è, à, ç, ê, ô, î, û...)
- Tutoiement chaleureux, ton inspirant mais pas familier
- AUCUN emoji, AUCUN guillemet, AUCUN "💡", AUCUNE numerotation
- AUCUNE validation flatteuse ("Super !", "Genial !", "Joli prenom !")
- Pas de "Verifions", pas de raisonnement explicite

Retourne UNIQUEMENT la suggestion finale, rien d'autre.`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Brief du parent :\n"""${desc}"""\n\nQuelle suggestion contextuelle proposes-tu pour rendre cette histoire singuliere ?` },
        ],
        max_tokens: 80,
        // Temperature elevee pour favoriser la creativite contextuelle (vs robotique)
        temperature: 0.85,
      });

      let hint = completion.choices[0]?.message?.content?.trim() || '';
      // Nettoyage defensif : enlever guillemets, points multiples, etc.
      hint = hint.replace(/^["'«»\s]+|["'«»\s]+$/g, '').replace(/\.{2,}/g, '.').trim();
      if (!hint) hint = getLocalFallbackHint(desc);

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
      res.json({ success: true, data: { hint: getLocalFallbackHint(desc), fallback: true } });
    }
  }
}

// ── Cache LRU simple en memoire (5 min TTL) ────────────────────────
const hintCache = new Map<string, { hint: string; t: number }>();
function hintCacheKey(desc: string): string {
  // Normalize : lowercase + trim + collapse spaces. Pas de hash pour rester debug-friendly.
  return desc.toLowerCase().replace(/\s+/g, ' ').trim().slice(0, 400);
}

// ── Fallback local si OpenAI indisponible ────────────────────────
function getLocalFallbackHint(desc: string): string {
  const t = desc.toLowerCase();
  if (t.length < 3) return "Décris-moi l'enfant et l'histoire que tu imagines.";
  if (!/^[A-ZÀ-ÖØ-Ý]/.test(desc.trim())) return "Le prénom de l'enfant ?";
  if (!/\d+\s*ans?/i.test(desc)) return "Quel âge a l'enfant ?";
  if (!/(fille|garçon|garcon|fillette|princesse|prince|fils)/i.test(desc)) return "Une fille ou un garçon ?";
  if (!/(univers|monde|royaume|aventure|magie|ecole|école|école)/i.test(desc) && desc.length < 60) return "Dans quel univers va se dérouler l'histoire ?";
  if (!/(courage|amitié|amitie|amour|partage|honnete|honnête|persever)/i.test(desc)) return "Une morale ou un message à transmettre ?";
  return "Tout est prêt, lance la création.";
}

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

      const systemPrompt = `Tu es un assistant IA qui aide un parent a decrire l'histoire personnalisee qu'il veut creer pour son enfant. Tu vas lire son brief et proposer UNE seule phrase courte de conseil pour enrichir sa description.

═══ CHECKLIST DES ELEMENTS IMPORTANTS (priorite haute → basse) ═══

1. PRENOM DE L'ENFANT
   - Couvert si : un prenom apparait (Lucas, Inès, Adam, Luna, etc.)
   - Sinon : suggere le prenom

2. AGE
   - Couvert si : "X ans" apparait (5 ans, 13 ans, etc.)
   - Sinon : suggere l'age

3. GENRE
   - Couvert si : "fille", "garcon", "fillette", "fils", "petite", "petit", "princesse", "prince" apparait, OU si le prenom est manifestement genre (Lucas=garcon, Ines=fille)
   - Sinon : suggere de preciser

4. UNIVERS / MONDE / THEME / RELIGION / CONTEXTE CULTUREL
   - Couvert si : ANY de ces concepts apparait :
     * Univers explicite : "univers de Mario", "monde de Harry Potter", "Disney", "Pokemon", "Naruto", "Minecraft", "Star Wars", etc.
     * Genre narratif : "aventure", "magique", "feerie", "espace", "ocean", "jungle"
     * Religion / culture : "musulman(e)", "chretien(ne)", "juif/juive", "hindou", "africain(e)" — c'est un univers culturel
     * Lieu : "ecole", "chateau", "foret", "ferme", "montagne"
     * Decor : "robots", "dinosaures", "dragons", "fees"
   - Sinon : suggere un univers

5. COMPAGNON / PERSONNAGE SECONDAIRE
   - Couvert si : ANY mention de :
     * Famille : "petit frere", "petite soeur", "frere", "soeur", "cousin(e)", "ami(e)", "meilleur(e) ami(e)"
     * Animal : "chien", "chat", "lapin", "hamster", "poney", "cheval", "oiseau", "dragon", "licorne", "tortue", "panda", n'importe quel animal
     * Personnage humain secondaire : "voisin", "professeur", "grand-pere", "grand-mere", "papi", "mamie"
   - IMPORTANT : "petit frere" = compagnon DETECTE. Ne propose PAS de compagnon si "frere"/"soeur"/"ami" est dans le texte.
   - Sinon : suggere d'ajouter un compagnon

6. MORALE / MESSAGE A TRANSMETTRE
   - Couvert si : "courage", "amitie", "amour", "partage", "respect", "honnetete", "perseverance", "gentillesse", "tolerance", OU mention explicite "morale", "message", "lecon"
   - Sinon : suggere une morale

7. STYLE D'ILLUSTRATION
   - Couvert si : "manga", "aquarelle", "3D", "Pixar", "Disney", "kawaii", "papier decoupe", "bloc", "Minecraft" en contexte style
   - Sinon : suggere un style

8. HOBBIES / PASSIONS
   - Couvert si : "aime", "adore", "passionne", "kiffe", "fan de" + un sujet (foot, danse, lecture, dinosaures, etc.)
   - Sinon : suggere les passions

═══ REGLE D'OR ═══

LIS le brief MOT PAR MOT. Verifie chaque element de la checklist. Trouve le PREMIER niveau de priorite NON couvert et propose une suggestion pour celui-la. NE PROPOSE JAMAIS quelque chose qui est deja dans le texte, meme implicitement.

Si TOUS les niveaux 1-5 sont couverts → tu peux suggerer 6, 7 ou 8 selon ce qui manque.
Si TOUT est couvert (1 a 8) → reponds EXACTEMENT : "Tout est prêt, lance la création."

═══ FORMAT DE LA REPONSE ═══

- UNE seule phrase, 8 a 14 mots
- Francais parfait avec accents corrects (é, è, à, ç, ê, ô...)
- Tutoiement chaleureux mais pas familier
- AUCUN emoji, AUCUN guillemet, AUCUNE numerotation, AUCUN "💡"
- AUCUNE validation flatteuse ("Super !", "Genial !", "Joli !")
- Style suggestion neutre, comme un coach silencieux

═══ EXEMPLES ═══

Brief : "Lucas"
→ "Quel age a Lucas ?"

Brief : "Lucas 13 ans garcon histoire musulmane"
→ Verifions : prenom=Lucas ✓, age=13 ✓, genre=garcon ✓, univers/contexte=musulmane ✓.
   Il manque : compagnon, morale.
→ "Un compagnon a ajouter (animal, ami) ?"

Brief : "Lucas 13 ans garcon avec son petit frere histoire musulmane"
→ Verifions : prenom ✓, age ✓, genre ✓, univers ✓, compagnon=petit frere ✓.
   Il manque : morale.
→ "Une morale ou un message a transmettre ?"

Brief : "Inès, 7 ans, fille qui adore les dinosaures"
→ "Dans quel univers va se derouler l'histoire ?"

Brief : "Adam 5 ans dans l'univers Mario avec son chien Rex pour le courage style 3D Pixar"
→ Tout couvert (1-7). Hobby manque pas vraiment (Mario implique passion gaming).
→ "Tout est prêt, lance la création."

Retourne UNIQUEMENT la phrase de suggestion, rien d'autre. Pas de "Verifions", pas de raisonnement.`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Brief actuel : """${desc}"""\n\nPropose ta suggestion :` },
        ],
        max_tokens: 60,
        temperature: 0.4,
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

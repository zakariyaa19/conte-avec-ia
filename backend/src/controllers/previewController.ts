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
      const { description, hasPhoto } = req.body as { description?: string; hasPhoto?: boolean };
      const photoUploaded = !!hasPhoto;

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
          data: { hint: getLocalFallbackHint(desc, photoUploaded) }
        });
      }

      // Cache lookup (5 min TTL) — la photo influence le hint, l'inclure dans la cle
      const cacheKey = hintCacheKey(desc) + '|p=' + (photoUploaded ? '1' : '0');
      const cached = hintCache.get(cacheKey);
      if (cached && Date.now() - cached.t < 5 * 60 * 1000) {
        return res.json({ success: true, data: { hint: cached.hint, cached: true } });
      }

      const { default: OpenAI } = await import('openai');
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const systemPrompt = `Tu es un assistant intelligent qui aide un parent a definir tous les elements de l'histoire personnalisee de son enfant. Tu lis son brief et tu poses UNE seule question (ou fais UNE seule suggestion d'ajout d'info) pour completer le brief.

═══ TA MISSION ═══

Identifie la PROCHAINE information manquante dans le brief et demande-la de facon naturelle. Tu collectes des INFORMATIONS FACTUELLES, pas des idees narratives. Pas de suggestions de scenario, pas d'inventions creatives — juste les questions necessaires pour qu'un livre vraiment personnalise puisse etre cree.

═══ ORDRE DE PRIORITE STRICT ═══

Suis CET ordre, du plus important au moins important. Demande la PREMIERE info manquante.

1. **Prenom** du personnage principal
2. **Age** de l'enfant
3. **Genre** (fille/garcon) — sauter si le prenom est evident (Lucas=garcon, Ines=fille, Adam=garcon, Luna=fille, etc.) ou si "fille"/"garcon" deja dit
4. **Univers / monde** dans lequel se deroule l'histoire (peut etre une franchise — Mario, Harry Potter — un contexte culturel — musulman, africain — ou un decor — foret, espace)
5. **Personnage secondaire** qui accompagne le heros (ami, frere, soeur, etc.)
6. **Mechant / antagoniste** (ou un obstacle/danger)
7. **Animal de compagnie** (si pas deja couvert par #5)
8. **Morale / message** a transmettre
9. **Photo** de l'enfant (proposer de l'ajouter pour que les illustrations lui ressemblent)
10. **Style d'illustration** (manga, aquarelle, 3D, Pixar, kawaii...)
11. **Hobbies / passions** specifiques de l'enfant

═══ DETECTION IMPLICITE — NE PAS REDEMANDER ═══

Avant de poser ta question, verifie ce qui est deja DANS le brief, meme implicitement :

- Prenom donne le genre : Lucas/Adam/Hugo=garcon, Ines/Luna/Emma=fille
- Termes culturels/religieux ("musulmane", "africaine", "chretienne", "juif") = univers couvert
- Franchise ("Mario", "Harry Potter", "Pokemon", "Disney", "Star Wars") = univers couvert
- "Petit frere", "soeur", "ami(e)", "cousin", "voisin" = personnage secondaire couvert
- "Chien Rex", "chat", "lapin", n'importe quel animal nomme = animal de compagnie couvert
- "Mechant", "monstre", "sorcier", "dragon mauvais", "Bowser" = antagoniste couvert
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
- Pour le mechant : "Y a-t-il un mechant dans l'histoire ?"
- Pour l'animal : "Y a-t-il un animal de compagnie ?"
- Pour la morale : "Quelle morale ou message a transmettre ?"
- Pour la photo : "Ajoute sa photo pour que les illustrations lui ressemblent."
- Pour le style : "Quel style d'illustration ? (manga, aquarelle, 3D...)"
- Pour le hobby : "Quelles sont ses passions preferees ?"

Tu peux varier les formulations — l'important c'est que ce soit une demande d'INFO, pas une suggestion narrative.

═══ EXEMPLES ═══

Brief : "Lucas"
→ "Quel age a Lucas ?"

Brief : "Lucas 13 ans"
✓ prenom, age. Genre=garcon implicite (Lucas).
→ "Dans quel univers va se derouler l'histoire ?"

Brief : "Lucas 13 ans garcon histoire musulmane"
✓ prenom, age, genre, univers (musulmane).
Prochaine priorite manquante : personnage secondaire.
→ "Quel personnage secondaire pour accompagner Lucas ?"

Brief : "Lucas 13 ans avec son petit frere histoire musulmane"
✓ prenom, age, genre (Lucas), univers, perso secondaire (petit frere).
Prochaine priorite : mechant.
→ "Y a-t-il un mechant dans l'histoire ?"

Brief : "Lucas 13 ans petit frere musulmane Bowser"
✓ prenom, age, genre, univers, perso, mechant (Bowser).
Prochaine priorite : animal de compagnie.
→ "Y a-t-il un animal de compagnie ?"

Brief : "Inès collectionne les fossiles dans l'univers de Mario"
✓ prenom, univers, hobby (fossiles).
Prochaine priorite : age.
→ "Quel age a Ines ?"

Brief : "Adam 5 ans Mario chien Rex courage style Pixar"
✓ prenom, age, univers, animal, morale, style. Genre=garcon implicite.
Prochaine priorite : photo.
→ "Ajoute sa photo pour que les illustrations lui ressemblent."

Brief vide ou < 10 chars
→ "Quel est le prenom de l'enfant ?"

═══ REGLE ABSOLUE — PHOTO ═══

NE DIS JAMAIS "Tout est prêt, lance la création." SI les INFOS EXTERNES indiquent "Photo de l'enfant deja jointe : NON". Dans ce cas, propose TOUJOURS d'abord :
→ "Ajoute sa photo pour que les illustrations lui ressemblent."

La photo est essentielle pour personnaliser visuellement le heros. Meme si le brief texte est tres complet, sans photo, l'illustration ne ressemblera pas a l'enfant. C'est la priorite a proposer en derniere etape avant "tout est pret".

Brief vraiment complet (toutes les priorites 1-8 couvertes ET photo jointe)
→ "Tout est prêt, lance la création."

═══ FORMAT DE LA REPONSE ═══

- UNE seule phrase courte, 6 a 14 mots
- Francais parfait avec accents (é, è, à, ç, ê, ô, î, û)
- Tutoiement chaleureux et naturel
- AUCUN emoji, guillemet, numerotation, "💡"
- AUCUNE validation flatteuse ("Super !", "Genial !")
- Pas de raisonnement explicite, pas de "Verifions"

Retourne UNIQUEMENT la phrase, rien d'autre.`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Brief du parent :\n"""${desc}"""\n\nINFOS EXTERNES :\n- Photo de l'enfant deja jointe : ${photoUploaded ? 'OUI ✓' : 'NON'}\n\nQuelle est la PROCHAINE info manquante a demander (selon l'ordre de priorite) ? ${photoUploaded ? 'Ne propose JAMAIS d\'ajouter une photo (deja faite). Passe a la priorite suivante.' : ''}` },
        ],
        max_tokens: 60,
        // Temperature moderee : on veut respect de la priorite, pas creativite narrative
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
      const ph = !!req.body?.hasPhoto;
      res.json({ success: true, data: { hint: getLocalFallbackHint(desc, ph), fallback: true } });
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
function getLocalFallbackHint(desc: string, hasPhoto = false): string {
  const t = desc.toLowerCase();
  if (t.length < 3) return "Quel est le prénom de l'enfant ?";
  if (!/^[A-ZÀ-ÖØ-Ý]/.test(desc.trim())) return "Quel est le prénom de l'enfant ?";
  if (!/\d+\s*ans?/i.test(desc)) return "Quel âge a l'enfant ?";
  if (!/(fille|garçon|garcon|fillette|princesse|prince|fils)/i.test(desc)) return "Une fille ou un garçon ?";
  if (!/(univers|monde|royaume|aventure|magie|ecole|école)/i.test(desc) && desc.length < 60) return "Dans quel univers va se dérouler l'histoire ?";
  if (!/(frere|frère|soeur|sœur|ami|copain|copine|cousin|grand-)/i.test(desc)) return "Quel personnage secondaire pour l'accompagner ?";
  if (!/(courage|amitié|amitie|amour|partage|honnete|honnête|persever)/i.test(desc)) return "Une morale ou un message à transmettre ?";
  if (!hasPhoto) return "Ajoute sa photo pour que les illustrations lui ressemblent.";
  return "Tout est prêt, lance la création.";
}

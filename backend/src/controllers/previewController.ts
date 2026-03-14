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
}

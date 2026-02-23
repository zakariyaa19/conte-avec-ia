import { Request, Response } from 'express';
import {
  generateCoverImage,
  generateBookTitle,
  computeParamsHash,
  getCachedPreview,
  setCachedPreview,
  CoverGenerationParams
} from '../utils/coverGeneratorService';

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

      // Valider les champs obligatoires
      const required = ['protagonistName', 'protagonistAge', 'protagonistGender', 'eyeColor', 'hairColor', 'skinColor', 'illustrationStyle', 'generalTheme', 'specificSubject'];
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
        illustrationStyle: formData.illustrationStyle,
        generalTheme: formData.generalTheme,
        customTheme: formData.customTheme,
        specificSubject: formData.specificSubject,
        customSubject: formData.customSubject,
        centralMessage: formData.centralMessage,
        customMessage: formData.customMessage,
        ageRange: formData.ageRange,
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
}

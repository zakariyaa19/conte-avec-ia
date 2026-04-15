import { Request, Response } from 'express';
import { prisma } from '../utils/database';
import { generateStoryText, generateCliffhangerSummary, StoryTextParams } from '../utils/storyTextGenerator';
import { generateStoryImages, ImageGenerationParams } from '../utils/storyImageGenerator';
import { assemblePdf } from '../utils/pdfAssemblyService';
import { generateBookTitle, generateCoverImage, CoverGenerationParams } from '../utils/coverGeneratorService';
import { uploadPdfToCloudinary, uploadCoverToCloudinary, deleteFromCloudinary, isCloudinaryUrl } from '../utils/cloudinaryService';
import fs from 'fs';
import path from 'path';

// Track active generations to prevent double-launches
export const activeGenerations = new Set<string>();

export class StoryGenerationController {

  // GET /api/admin/generation/orders — List generation queue (GENERATING + GENERATED)
  static async getGenerationQueue(req: Request, res: Response) {
    try {
      const orders = await prisma.order.findMany({
        where: {
          status: { in: ['GENERATING', 'GENERATED'] },
        },
        omit: { coverImageData: true, pdfData: true },
        include: { user: true, generationLogs: { orderBy: { startedAt: 'desc' } } },
        orderBy: { createdAt: 'desc' },
      });

      res.json({ success: true, data: orders });
    } catch (error) {
      console.error('[Generation] Error fetching queue:', error);
      res.status(500).json({ success: false, message: 'Erreur chargement file d\'attente' });
    }
  }

  // POST /api/admin/generation/orders/:id/generate — Launch generation (requires GENERATING status)
  static async startGeneration(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (activeGenerations.has(id)) {
        return res.status(409).json({ success: false, message: 'Generation deja en cours pour cette commande' });
      }

      const order = await prisma.order.findUnique({
        where: { id },
        omit: { coverImageData: true, pdfData: true },
      });

      if (!order) {
        return res.status(404).json({ success: false, message: 'Commande non trouvee' });
      }

      // Must be in GENERATING status (set by sendToGeneration)
      if (order.status !== 'GENERATING') {
        return res.status(400).json({
          success: false,
          message: `La commande doit etre en statut GENERATING (actuel: ${order.status})`
        });
      }

      if (!['EN_COURS', 'GENERATION_FAILED'].includes(order.storyStatus)) {
        return res.status(400).json({
          success: false,
          message: `Impossible de lancer la generation: storyStatus actuel = ${order.storyStatus}`
        });
      }

      // Create GenerationLog
      const maxAttempt = await prisma.generationLog.aggregate({
        where: { orderId: id },
        _max: { attempt: true },
      });
      const attempt = (maxAttempt._max.attempt || 0) + 1;

      const genLog = await prisma.generationLog.create({
        data: {
          orderId: id,
          attempt,
          status: 'started',
          source: 'generation',
        }
      });

      // Mark as generating and respond immediately
      await prisma.order.update({
        where: { id },
        data: {
          storyStatus: 'GENERATING_TEXT',
          generationProgress: 0,
          generationError: null,
          generationStartedAt: new Date(),
        }
      });

      res.status(202).json({ success: true, message: 'Generation lancee' });

      // Run pipeline asynchronously
      activeGenerations.add(id);
      runGenerationPipeline(id, order, genLog.id).finally(() => {
        activeGenerations.delete(id);
      });

    } catch (error) {
      console.error('[Generation] Error starting:', error);
      res.status(500).json({ success: false, message: 'Erreur lancement generation' });
    }
  }

  // GET /api/admin/generation/orders/:id/status — Poll progress
  static async getGenerationStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const order = await prisma.order.findUnique({
        where: { id },
        select: {
          id: true,
          status: true,
          storyStatus: true,
          generationProgress: true,
          generationError: true,
          generationStartedAt: true,
          pdfUrl: true,
        }
      });

      if (!order) {
        return res.status(404).json({ success: false, message: 'Commande non trouvee' });
      }

      res.json({ success: true, data: order });
    } catch (error) {
      console.error('[Generation] Error fetching status:', error);
      res.status(500).json({ success: false, message: 'Erreur statut generation' });
    }
  }

  // POST /api/admin/generation/orders/:id/regenerate — Regenerate (from DISPONIBLE or FAILED)
  static async regenerate(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (activeGenerations.has(id)) {
        return res.status(409).json({ success: false, message: 'Generation deja en cours' });
      }

      const order = await prisma.order.findUnique({
        where: { id },
        omit: { coverImageData: true, pdfData: true },
      });

      if (!order) {
        return res.status(404).json({ success: false, message: 'Commande non trouvee' });
      }

      if (!['GENERATING', 'GENERATED'].includes(order.status)) {
        return res.status(400).json({
          success: false,
          message: `La commande doit etre en statut GENERATING ou GENERATED (actuel: ${order.status})`
        });
      }

      if (!['DISPONIBLE', 'GENERATION_FAILED'].includes(order.storyStatus)) {
        return res.status(400).json({
          success: false,
          message: `storyStatus doit etre DISPONIBLE ou GENERATION_FAILED (actuel: ${order.storyStatus})`
        });
      }

      // If was GENERATED, go back to GENERATING
      const newStatus = order.status === 'GENERATED' ? 'GENERATING' : order.status;

      // Create GenerationLog
      const maxAttempt = await prisma.generationLog.aggregate({
        where: { orderId: id },
        _max: { attempt: true },
      });
      const attempt = (maxAttempt._max.attempt || 0) + 1;

      const genLog = await prisma.generationLog.create({
        data: {
          orderId: id,
          attempt,
          status: 'started',
          source: 'generation',
        }
      });

      // Reset and launch
      await prisma.order.update({
        where: { id },
        data: {
          status: newStatus as any,
          storyStatus: 'GENERATING_TEXT',
          generationProgress: 0,
          generationError: null,
          generationStartedAt: new Date(),
        }
      });

      res.status(202).json({ success: true, message: 'Regeneration lancee' });

      // Run pipeline asynchronously
      activeGenerations.add(id);
      runGenerationPipeline(id, order, genLog.id).finally(() => {
        activeGenerations.delete(id);
      });

    } catch (error) {
      console.error('[Generation] Error regenerating:', error);
      res.status(500).json({ success: false, message: 'Erreur relance generation' });
    }
  }

  // POST /api/admin/generation/orders/:id/validate — GENERATING → GENERATED
  static async validateGeneration(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const order = await prisma.order.findUnique({
        where: { id },
        select: { id: true, status: true, storyStatus: true },
      });

      if (!order) {
        return res.status(404).json({ success: false, message: 'Commande non trouvee' });
      }

      if (order.status !== 'GENERATING') {
        return res.status(400).json({
          success: false,
          message: `La commande doit etre en statut GENERATING (actuel: ${order.status})`
        });
      }

      if (order.storyStatus !== 'DISPONIBLE') {
        return res.status(400).json({
          success: false,
          message: `Le PDF doit etre disponible (storyStatus actuel: ${order.storyStatus})`
        });
      }

      await prisma.order.update({
        where: { id },
        data: { status: 'GENERATED' },
      });

      res.json({ success: true, message: 'Generation validee — prete a livrer' });
    } catch (error) {
      console.error('[Generation] Error validating:', error);
      res.status(500).json({ success: false, message: 'Erreur validation generation' });
    }
  }

  // POST /api/admin/generation/orders/:id/delete-generation — Back to PAID, remove PDF
  static async deleteGeneration(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (activeGenerations.has(id)) {
        return res.status(409).json({ success: false, message: 'Generation en cours — impossible de supprimer' });
      }

      const order = await prisma.order.findUnique({
        where: { id },
        select: { id: true, status: true, pdfUrl: true },
      });

      if (!order) {
        return res.status(404).json({ success: false, message: 'Commande non trouvee' });
      }

      if (!['GENERATING', 'GENERATED'].includes(order.status)) {
        return res.status(400).json({
          success: false,
          message: `La commande doit etre en statut GENERATING ou GENERATED (actuel: ${order.status})`
        });
      }

      // Delete PDF file
      if (order.pdfUrl) {
        if (isCloudinaryUrl(order.pdfUrl)) {
          // Extract public_id from Cloudinary URL (e.g. conte-ia/pdfs/story-xxx)
          const match = order.pdfUrl.match(/conte-ia\/pdfs\/[^.]+/);
          if (match) await deleteFromCloudinary(match[0], 'raw');
        } else {
          const pdfPath = path.join(__dirname, '../../', order.pdfUrl);
          try { await fs.promises.unlink(pdfPath); } catch { /* file may not exist */ }
        }
      }

      await prisma.order.update({
        where: { id },
        data: {
          status: 'PAID',
          storyStatus: 'EN_COURS',
          pdfUrl: null,
          pdfData: null,
          generationProgress: null,
          generationError: null,
          generationStartedAt: null,
          storyTextJson: null,
        },
      });

      res.json({ success: true, message: 'Generation supprimee — commande revenue a PAID' });
    } catch (error) {
      console.error('[Generation] Error deleting generation:', error);
      res.status(500).json({ success: false, message: 'Erreur suppression generation' });
    }
  }

  // POST /api/admin/generation/orders/:id/replace-pdf — Upload replacement PDF
  static async replacePdf(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!req.file) {
        return res.status(400).json({ success: false, message: 'Fichier PDF requis' });
      }

      const order = await prisma.order.findUnique({
        where: { id },
        select: { id: true, status: true },
      });

      if (!order) {
        return res.status(404).json({ success: false, message: 'Commande non trouvee' });
      }

      if (!['GENERATING', 'GENERATED'].includes(order.status)) {
        return res.status(400).json({
          success: false,
          message: `La commande doit etre en statut GENERATING ou GENERATED (actuel: ${order.status})`
        });
      }

      const pdfBuffer = await fs.promises.readFile(req.file.path);
      const publicId = `story-${id}-${Date.now()}`;
      const pdfUrl = await uploadPdfToCloudinary(pdfBuffer, publicId);

      // Clean up temp file
      try { await fs.promises.unlink(req.file.path); } catch { /* ignore */ }

      // Create GenerationLog for manual upload
      await prisma.generationLog.create({
        data: {
          orderId: id,
          attempt: 0,
          status: 'completed',
          completedAt: new Date(),
          pdfUrl,
          source: 'manual_upload',
        }
      });

      await prisma.order.update({
        where: { id },
        data: {
          pdfUrl,
          storyStatus: 'DISPONIBLE',
          generationProgress: 100,
          generatedAt: new Date(),
        },
      });

      res.json({ success: true, message: 'PDF remplace avec succes' });
    } catch (error) {
      console.error('[Generation] Error replacing PDF:', error);
      res.status(500).json({ success: false, message: 'Erreur remplacement PDF' });
    }
  }

  // GET /api/admin/generation/orders/:id/logs — Generation history
  static async getGenerationLogs(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const logs = await prisma.generationLog.findMany({
        where: { orderId: id },
        orderBy: { startedAt: 'desc' },
      });

      res.json({ success: true, data: logs });
    } catch (error) {
      console.error('[Generation] Error fetching logs:', error);
      res.status(500).json({ success: false, message: 'Erreur chargement historique' });
    }
  }

  // POST /api/admin/generation/orders/:id/retry — Retry failed generation (legacy compat)
  static async retryGeneration(req: Request, res: Response) {
    // Delegate to regenerate
    return StoryGenerationController.regenerate(req, res);
  }

  // GET /api/admin/generation/orders/:id/pdf — Preview generated PDF (admin only)
  static async previewPdf(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Auth: accept token from query string or Authorization header
      const queryToken = req.query.token as string | undefined;
      const headerToken = req.headers.authorization?.replace('Bearer ', '');
      const token = queryToken || headerToken;

      if (!token) {
        return res.status(401).json({ success: false, message: 'Token requis' });
      }

      const jwt = await import('jsonwebtoken');
      try {
        const decoded = jwt.default.verify(token, process.env.JWT_SECRET!) as any;
        if (!decoded.adminId) {
          return res.status(401).json({ success: false, message: 'Token admin invalide' });
        }
      } catch {
        return res.status(401).json({ success: false, message: 'Token invalide ou expire' });
      }

      const order = await prisma.order.findUnique({
        where: { id },
        select: { id: true, pdfUrl: true, storyStatus: true, protagonistName: true }
      });

      if (!order) {
        return res.status(404).json({ success: false, message: 'Commande non trouvee' });
      }

      if (order.storyStatus !== 'DISPONIBLE') {
        return res.status(400).json({ success: false, message: 'Aucun PDF disponible pour cette commande' });
      }

      // Cloudinary URL → redirect (no memory usage)
      if (order.pdfUrl && isCloudinaryUrl(order.pdfUrl)) {
        return res.redirect(order.pdfUrl);
      }

      // Legacy: try disk file first, then fallback to DB pdfData
      let pdfBuffer: Buffer | null = null;
      if (order.pdfUrl) {
        const diskPath = path.join(__dirname, '../..', order.pdfUrl);
        try {
          pdfBuffer = await fs.promises.readFile(diskPath);
        } catch { /* file not on disk, try DB */ }
      }
      if (!pdfBuffer) {
        const orderWithPdf = await prisma.order.findUnique({
          where: { id },
          select: { pdfData: true }
        });
        if (orderWithPdf?.pdfData) {
          pdfBuffer = Buffer.from(orderWithPdf.pdfData);
        }
      }

      if (!pdfBuffer) {
        return res.status(400).json({ success: false, message: 'Aucun PDF disponible pour cette commande' });
      }

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="conte-${order.protagonistName || id}.pdf"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      res.send(pdfBuffer);

    } catch (error) {
      console.error('[Generation] Error previewing PDF:', error);
      res.status(500).json({ success: false, message: 'Erreur preview PDF' });
    }
  }

  // POST /api/admin/generation/test-order — Create test order with cover generation
  static async createTestOrder(req: Request, res: Response) {
    try {
      const data = req.body || {};

      // Photo uploadee via multer (champ 'photo')
      const photoFile = (req as any).file;
      let photoUrl: string | null = null;
      let photoBase64: string | undefined = undefined;

      if (photoFile) {
        photoUrl = `/uploads/${photoFile.filename}`;
        const photoPath = path.join(__dirname, '../../uploads', photoFile.filename);
        const photoBuffer = await fs.promises.readFile(photoPath);
        photoBase64 = photoBuffer.toString('base64');
        console.log(`[Generation] Photo uploadee: ${photoFile.filename} (${photoBuffer.length} bytes)`);
      }

      const hasPhoto = !!photoFile;

      // 1. Creer l'order (sans couverture)
      const testOrder = await prisma.order.create({
        data: {
          ageRange: data.ageRange || '6-9',
          generalTheme: data.generalTheme || 'fairy-tales',
          specificSubject: data.specificSubject || 'birthday',
          centralMessage: data.centralMessage || 'courage',
          illustrationStyle: data.illustrationStyle || 'illustrated-book',
          protagonistName: data.protagonistName || 'Luna',
          protagonistAge: data.protagonistAge || '7',
          protagonistGender: data.protagonistGender || 'girl',
          eyeColor: hasPhoto ? null : (data.eyeColor || 'blue'),
          hairColor: hasPhoto ? null : (data.hairColor || 'blonde'),
          skinColor: hasPhoto ? null : (data.skinColor || 'light'),
          hobbies: data.hobbies || undefined,
          favoriteDish: data.favoriteDish || undefined,
          specialEvents: data.specialEvents || undefined,
          creatorName: data.creatorName || 'Maman',
          language: data.language || 'francais',
          photoUrl,
          productType: 'EBOOK',
          purchaseType: 'SINGLE',
          price: 0,
          status: 'PAID',
          paidAt: new Date(),
          storyStatus: 'EN_COURS',
          isTestOrder: true,
        },
        omit: { coverImageData: true, pdfData: true },
      });

      // 2. Generer la couverture
      console.log(`[Generation] Generation de la couverture pour commande test ${testOrder.id}...`);
      try {
        const coverParams: CoverGenerationParams = {
          protagonistName: data.protagonistName || 'Luna',
          protagonistAge: data.protagonistAge || '7',
          protagonistGender: data.protagonistGender || 'girl',
          eyeColor: hasPhoto ? undefined : (data.eyeColor || 'blue'),
          hairColor: hasPhoto ? undefined : (data.hairColor || 'blonde'),
          skinColor: hasPhoto ? undefined : (data.skinColor || 'light'),
          illustrationStyle: data.illustrationStyle || 'illustrated-book',
          generalTheme: data.generalTheme || 'fairy-tales',
          customTheme: data.customTheme || undefined,
          specificSubject: data.specificSubject || 'birthday',
          customSubject: data.customSubject || undefined,
          centralMessage: data.centralMessage || undefined,
          customMessage: data.customMessage || undefined,
          ageRange: data.ageRange || '6-9',
          hobbies: data.hobbies || undefined,
          specialEvents: data.specialEvents || undefined,
        };

        const coverResult = await generateCoverImage(coverParams, photoBase64);
        const coverBuffer = Buffer.from(coverResult.imageBase64, 'base64');

        const coverPublicId = `cover-test-${testOrder.id}-${Date.now()}`;
        const coverUrl = await uploadCoverToCloudinary(coverBuffer, coverPublicId);

        await prisma.order.update({
          where: { id: testOrder.id },
          data: {
            coverImageUrl: coverUrl,
            coverTitle: coverResult.title,
          },
        });

        console.log(`[Generation] Couverture generee: ${coverPublicId} (${coverBuffer.length} bytes), titre: "${coverResult.title}"`);

        res.json({
          success: true,
          data: { ...testOrder, coverTitle: coverResult.title, coverImageUrl: coverUrl },
          message: `Commande test creee avec couverture "${coverResult.title}"`,
        });

      } catch (coverError: any) {
        console.error('[Generation] Erreur generation couverture:', coverError.message);
        res.json({
          success: true,
          data: testOrder,
          message: `Commande test creee (couverture echouee: ${coverError.message})`,
        });
      }

    } catch (error) {
      console.error('[Generation] Error creating test order:', error);
      res.status(500).json({ success: false, message: 'Erreur creation commande test' });
    }
  }
}

// --- Async generation pipeline ---

async function runGenerationPipeline(orderId: string, order: any, genLogId: string) {
  const steps: Array<{ step: string; status: string; timestamp: string; detail?: string }> = [];

  function logStep(step: string, status: string, detail?: string) {
    steps.push({ step, status, timestamp: new Date().toISOString(), detail });
  }

  try {
    console.log(`[Generation] Pipeline started for order ${orderId}`);
    logStep('pipeline', 'started');

    // Fetch cover image data
    let coverImageData: Buffer | null = null;

    // New path: cover is on Cloudinary — download the buffer
    if (order.coverImageUrl && isCloudinaryUrl(order.coverImageUrl)) {
      try {
        const axios = (await import('axios')).default;
        const coverResp = await axios.get(order.coverImageUrl, { responseType: 'arraybuffer' });
        coverImageData = Buffer.from(coverResp.data);
        console.log(`[Generation] Cover fetched from Cloudinary (${coverImageData.length} bytes)`);
      } catch (err: any) {
        console.warn(`[Generation] Failed to fetch cover from Cloudinary:`, err.message);
      }
    }

    // Legacy fallback: cover stored as blob in DB
    if (!coverImageData) {
      const orderWithCover = await prisma.order.findUnique({
        where: { id: orderId },
        select: { coverImageData: true },
      });
      coverImageData = orderWithCover?.coverImageData
        ? Buffer.from(orderWithCover.coverImageData)
        : null;
    }

    // If still no cover, generate one now and save the URL
    if (!coverImageData && !order.coverImageUrl) {
      console.log(`[Generation] No cover image found — generating one now...`);
      try {
        const hasPhoto = !!order.photoUrl;
        const coverGenParams: CoverGenerationParams = {
          protagonistName: order.protagonistName,
          protagonistAge: order.protagonistAge || '',
          protagonistGender: order.protagonistGender || 'boy',
          eyeColor: hasPhoto ? undefined : (order.eyeColor || ''),
          hairColor: hasPhoto ? undefined : (order.hairColor || ''),
          skinColor: hasPhoto ? undefined : (order.skinColor || ''),
          illustrationStyle: order.illustrationStyle,
          generalTheme: order.generalTheme,
          customTheme: order.customTheme || undefined,
          specificSubject: order.specificSubject,
          customSubject: order.customSubject || undefined,
          centralMessage: order.centralMessage || undefined,
          customMessage: order.customMessage || undefined,
          ageRange: order.ageRange || '6-9',
        };
        const coverResult = await generateCoverImage(coverGenParams);
        coverImageData = Buffer.from(coverResult.imageBase64, 'base64');
        // Upload to Cloudinary and save URL
        const coverPublicId = `cover-${orderId}-${Date.now()}`;
        const coverUrl = await uploadCoverToCloudinary(coverImageData, coverPublicId);
        await prisma.order.update({
          where: { id: orderId },
          data: { coverImageUrl: coverUrl, coverTitle: coverResult.title || order.coverTitle }
        });
        console.log(`[Generation] Cover generated and saved: ${coverUrl}`);
      } catch (coverErr: any) {
        console.error(`[Generation] Failed to generate cover:`, coverErr.message);
      }
    }

    // --- Step 1: Generate text (0-10%) ---
    logStep('text', 'started');
    await updateProgress(orderId, 'GENERATING_TEXT', 2);

    const hasOrderPhoto = !!order.photoUrl;

    const titleParams: CoverGenerationParams = {
      protagonistName: order.protagonistName,
      protagonistAge: order.protagonistAge || '',
      protagonistGender: order.protagonistGender || 'boy',
      eyeColor: hasOrderPhoto ? undefined : (order.eyeColor || ''),
      hairColor: hasOrderPhoto ? undefined : (order.hairColor || ''),
      skinColor: hasOrderPhoto ? undefined : (order.skinColor || ''),
      illustrationStyle: order.illustrationStyle,
      generalTheme: order.generalTheme,
      customTheme: order.customTheme || undefined,
      specificSubject: order.specificSubject,
      customSubject: order.customSubject || undefined,
      centralMessage: order.centralMessage || undefined,
      customMessage: order.customMessage || undefined,
      ageRange: order.ageRange,
      hobbies: order.hobbies || undefined,
      specialEvents: order.specialEvents || undefined,
    };

    const title = order.coverTitle || await generateBookTitle(titleParams);

    const isClubOrder = order.purchaseType === 'CLUB';
    console.log(`[Generation] Order type: ${isClubOrder ? 'CLUB (12 pages, premium)' : 'FREE/SINGLE (5 pages, cliffhanger)'}`);

    const textParams: StoryTextParams = {
      protagonistName: order.protagonistName,
      protagonistAge: order.protagonistAge || undefined,
      protagonistGender: order.protagonistGender || undefined,
      ageRange: order.ageRange,
      generalTheme: order.generalTheme,
      customTheme: order.customTheme || undefined,
      specificSubject: order.specificSubject,
      customSubject: order.customSubject || undefined,
      centralMessage: order.centralMessage,
      customMessage: order.customMessage || undefined,
      hobbies: order.hobbies || undefined,
      favoriteDish: order.favoriteDish || undefined,
      specialEvents: order.specialEvents || undefined,
      religion: order.religion || undefined,
      customReligion: order.customReligion || undefined,
      language: order.language || 'francais',
      secondaryCharactersJson: order.secondaryCharactersJson || undefined,
      creatorName: order.creatorName || undefined,
      narratedBy: (order as any).narratedBy || order.creatorName || undefined,
      isClub: isClubOrder,
    };

    const storyText = await generateStoryText(textParams, title);
    logStep('text', 'completed');

    // Cliffhanger summary : question hook pour le paywall (uniquement version gratuite 5p)
    let cliffhangerSummary: string | null = null;
    if (!isClubOrder) {
      try {
        cliffhangerSummary = await generateCliffhangerSummary(
          storyText.paragraphs,
          textParams.protagonistName,
          textParams.language
        );
        if (cliffhangerSummary) {
          console.log(`[Generation] Cliffhanger summary: "${cliffhangerSummary}"`);
        }
      } catch (err: any) {
        console.warn('[Generation] Cliffhanger summary generation failed (non-blocking):', err?.message);
      }
    }

    // Cache text in DB
    await prisma.order.update({
      where: { id: orderId },
      data: {
        storyTextJson: JSON.stringify(storyText.paragraphs),
        coverTitle: storyText.title,
        cliffhangerSummary: cliffhangerSummary || undefined,
      }
    });

    await updateProgress(orderId, 'GENERATING_TEXT', 10);

    // --- Fetch first illustration from preview (if available) ---
    let firstIllustrationBuffer: Buffer | undefined;
    if (order.firstIllustrationUrl) {
      try {
        const axios = (await import('axios')).default;
        const illustResp = await axios.get(order.firstIllustrationUrl, { responseType: 'arraybuffer' });
        firstIllustrationBuffer = Buffer.from(illustResp.data);
        console.log(`[Generation] First illustration fetched from preview (${firstIllustrationBuffer.length} bytes)`);
      } catch (err: any) {
        console.warn(`[Generation] Failed to fetch first illustration:`, err.message);
      }
    }

    console.log(`[Generation] Cover data ready: ${coverImageData ? coverImageData.length + ' bytes' : 'NONE'}`);
    console.log(`[Generation] First illustration from preview: ${firstIllustrationBuffer ? firstIllustrationBuffer.length + ' bytes' : 'NONE'}`);
    console.log(`[Generation] Text generated: ${storyText.paragraphs.length} paragraphs, title: "${storyText.title}"`);

    // --- Step 2: Generate images (10-93%) ---
    logStep('images', 'started');
    await updateProgress(orderId, 'GENERATING_IMAGES', 10);

    const imageParams: ImageGenerationParams = {
      protagonistName: order.protagonistName,
      protagonistAge: order.protagonistAge || undefined,
      protagonistGender: order.protagonistGender || undefined,
      ageRange: order.ageRange,
      eyeColor: hasOrderPhoto ? undefined : (order.eyeColor || undefined),
      hairColor: hasOrderPhoto ? undefined : (order.hairColor || undefined),
      skinColor: hasOrderPhoto ? undefined : (order.skinColor || undefined),
      illustrationStyle: order.illustrationStyle,
      generalTheme: order.generalTheme,
      customTheme: order.customTheme || undefined,
      specificSubject: order.specificSubject,
      customSubject: order.customSubject || undefined,
      centralMessage: order.centralMessage || undefined,
      customMessage: order.customMessage || undefined,
      hobbies: order.hobbies || undefined,
      specialEvents: order.specialEvents || undefined,
      secondaryCharactersJson: order.secondaryCharactersJson || undefined,
      isClub: isClubOrder,
    };

    const imageResult = await generateStoryImages(
      imageParams,
      storyText.title,
      storyText.paragraphs,
      async (imageIndex, total) => {
        const progress = Math.round(10 + (imageIndex / total) * 83);
        await updateProgress(orderId, 'GENERATING_IMAGES', progress);
      },
      coverImageData || undefined,
      firstIllustrationBuffer
    );
    console.log(`[Generation] Images generated: ${imageResult.images.length} images, sizes: [${imageResult.images.map(b => b.length).join(', ')}]`);
    logStep('images', 'completed');

    // --- Upload illustrations to Cloudinary (for StoryReader + public sharing) ---
    let illustrationUrls: string[] = [];
    try {
      console.log(`[Generation] Uploading ${imageResult.images.length} illustrations to Cloudinary...`);
      const results = await Promise.allSettled(
        imageResult.images.map((buf, i) =>
          uploadCoverToCloudinary(buf, `illust-${orderId}-${i}-${Date.now()}`)
        )
      );
      illustrationUrls = results
        .filter((r): r is PromiseFulfilledResult<string> => r.status === 'fulfilled')
        .map(r => r.value);
      const failed = results.filter(r => r.status === 'rejected').length;
      console.log(`[Generation] Illustrations uploaded: ${illustrationUrls.length} OK, ${failed} failed`);
      if (failed > 0) {
        results.forEach((r, i) => {
          if (r.status === 'rejected') console.warn(`[Generation] Illustration ${i} upload failed:`, (r as any).reason?.message);
        });
      }
    } catch (err: any) {
      console.error('[Generation] Critical error uploading illustrations:', err.message);
    }

    // --- Step 3: Assemble PDF (93-100%) ---
    logStep('pdf', 'started');
    await updateProgress(orderId, 'ASSEMBLING_PDF', 93);

    let coverImage: Buffer | null;
    if (coverImageData) {
      coverImage = coverImageData;
      console.log(`[Generation] Using existing cover image (${coverImageData.length} bytes)`);
    } else {
      console.warn(`[Generation] No cover image found for order ${orderId}, using placeholder`);
      coverImage = Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1536"><rect width="1024" height="1536" fill="#DDA0DD" rx="20"/><text x="512" y="768" font-family="Arial" font-size="48" fill="white" text-anchor="middle">COVER</text></svg>`,
        'utf-8'
      );
    }

    console.log(`[Generation] Starting PDF assembly: cover=${coverImage.length} bytes, images=${imageResult.images.length}, paragraphs=${storyText.paragraphs.length}`);

    let pdfBuffer: Buffer | null = await assemblePdf({
      title: storyText.title,
      creatorName: order.creatorName || '',
      paragraphs: storyText.paragraphs,
      coverImage: coverImage!,
      images: imageResult.images,
    });

    // Release image buffers — no longer needed after PDF assembly
    coverImageData = null;
    coverImage = null;
    imageResult.images.length = 0;

    await updateProgress(orderId, 'ASSEMBLING_PDF', 97);

    // --- Step 4: Upload PDF to Cloudinary ---
    const pdfPublicId = `story-${orderId}-${Date.now()}`;
    const pdfUrl = await uploadPdfToCloudinary(pdfBuffer!, pdfPublicId);

    // Release PDF buffer — uploaded to Cloudinary, no longer needed in memory
    pdfBuffer = null;
    global.gc?.();

    // Update status with Cloudinary URL — mark as GENERATED so admin can deliver
    await prisma.order.update({
      where: { id: orderId },
      data: {
        pdfUrl,
        status: 'GENERATED',
        storyStatus: 'DISPONIBLE',
        generationProgress: 100,
        generatedAt: new Date(),
        ...(illustrationUrls.length > 0 && { illustrationUrlsJson: JSON.stringify(illustrationUrls) }),
      }
    });
    logStep('pdf', 'completed');

    // Update GenerationLog — completed
    logStep('pipeline', 'completed');
    await prisma.generationLog.update({
      where: { id: genLogId },
      data: {
        status: 'completed',
        completedAt: new Date(),
        pdfUrl,
        stepsJson: JSON.stringify(steps),
      }
    });

    console.log(`[Generation] Pipeline completed for order ${orderId}`);

  } catch (error: any) {
    const errorDetail = `${error.message || 'Erreur inconnue'} | Stack: ${error.stack?.split('\n').slice(0, 5).join(' <- ')}`;
    console.error(`[Generation] Pipeline failed for order ${orderId}:`, errorDetail);
    logStep('pipeline', 'failed', errorDetail);

    try {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          storyStatus: 'GENERATION_FAILED',
          generationError: errorDetail.slice(0, 500),
        }
      });

      await prisma.generationLog.update({
        where: { id: genLogId },
        data: {
          status: 'failed',
          completedAt: new Date(),
          error: error.message || 'Erreur inconnue',
          stepsJson: JSON.stringify(steps),
        }
      });
    } catch (dbError) {
      console.error('[Generation] Failed to update error status:', dbError);
    }
  }
}

/**
 * Auto-generate and deliver a story after payment.
 * Called from payment confirmation points (webhook, polling, club free).
 * Idempotent: skips if order is already GENERATING/GENERATED/DELIVERED.
 * Never throws — all errors are caught and sent to Telegram.
 */
export async function autoGenerateAndDeliver(orderId: string): Promise<void> {
  // --- Idempotency guard ---
  if (activeGenerations.has(orderId)) {
    console.log(`[AutoGen] Skipped ${orderId} — already in activeGenerations`);
    return;
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    omit: { coverImageData: true, pdfData: true },
    include: { user: true },
  });

  if (!order) {
    console.error(`[AutoGen] Order ${orderId} not found`);
    return;
  }

  // Only launch from PAID status with EN_COURS story status
  if (order.status !== 'PAID') {
    console.log(`[AutoGen] Skipped ${orderId} — status is ${order.status}, not PAID`);
    return;
  }

  if (order.storyStatus && order.storyStatus !== 'EN_COURS') {
    console.log(`[AutoGen] Skipped ${orderId} — storyStatus is ${order.storyStatus}, not EN_COURS`);
    return;
  }

  console.log(`[AutoGen] Starting auto-generation for order ${orderId}`);

  // --- Atomically set order to GENERATING (only if still PAID) ---
  // This prevents race conditions when webhook + polling both fire
  const updated = await prisma.order.updateMany({
    where: { id: orderId, status: 'PAID' },
    data: {
      status: 'GENERATING',
      storyStatus: 'EN_COURS',
    },
  });

  if (updated.count === 0) {
    console.log(`[AutoGen] Skipped ${orderId} — status already changed (race condition avoided)`);
    return;
  }

  // --- Send "in progress" email to customer ---
  try {
    const { MailjetService } = await import('../utils/mailjetService');
    const customerEmail = order.user?.email;
    const customerName = order.user?.firstName || order.creatorName || 'Client';

    if (customerEmail) {
      await MailjetService.sendStoryInProgressEmail({
        customerName,
        customerEmail,
        orderNumber: order.id.slice(-8),
        protagonistName: order.protagonistName,
      });
    }
  } catch (emailError) {
    console.error(`[AutoGen] Failed to send in-progress email for ${orderId}:`, emailError);
    // Non-blocking — continue generation
  }

  // --- Create GenerationLog ---
  const maxAttempt = await prisma.generationLog.aggregate({
    where: { orderId },
    _max: { attempt: true },
  });
  const attempt = (maxAttempt._max.attempt || 0) + 1;

  const genLog = await prisma.generationLog.create({
    data: {
      orderId,
      attempt,
      status: 'started',
      source: 'auto',
    },
  });

  // --- Update storyStatus to GENERATING_TEXT ---
  await prisma.order.update({
    where: { id: orderId },
    data: {
      storyStatus: 'GENERATING_TEXT',
      generationProgress: 0,
      generationError: null,
      generationStartedAt: new Date(),
    },
  });

  // --- Run pipeline asynchronously ---
  activeGenerations.add(orderId);

  runGenerationPipeline(orderId, order, genLog.id)
    .then(async () => {
      // Pipeline succeeded — order is now GENERATED with storyStatus DISPONIBLE
      // Auto-deliver: set to DELIVERED and send delivery email
      try {
        const freshOrder = await prisma.order.findUnique({
          where: { id: orderId },
          omit: { coverImageData: true, pdfData: true },
          include: { user: true },
        });

        if (freshOrder && freshOrder.status === 'GENERATED' && freshOrder.storyStatus === 'DISPONIBLE') {
          await prisma.order.update({
            where: { id: orderId },
            data: {
              status: 'DELIVERED',
              deliveredAt: new Date(),
            },
          });
          console.log(`[AutoGen] Order ${orderId} auto-delivered`);

          // Send delivery email
          const { MailjetService } = await import('../utils/mailjetService');
          const customerEmail = freshOrder.user?.email;
          const customerName = freshOrder.user?.firstName || freshOrder.creatorName || 'Client';

          if (customerEmail) {
            await MailjetService.sendStoryDeliveryEmail({
              customerName,
              customerEmail,
              orderNumber: orderId.slice(-8),
              protagonistName: freshOrder.protagonistName,
              userId: freshOrder.user?.id,
            });
          }
        }
      } catch (deliveryError) {
        console.error(`[AutoGen] Auto-delivery failed for ${orderId}:`, deliveryError);
        // The generation succeeded, so the order is GENERATED — admin can deliver manually
      }
    })
    .catch(async (pipelineError) => {
      // Pipeline failed — send Telegram alert
      console.error(`[AutoGen] Pipeline failed for ${orderId}:`, pipelineError);
      try {
        const { TelegramService } = await import('../utils/telegramService');
        await TelegramService.sendGenerationFailedAlert({
          orderId,
          orderNumber: orderId.slice(-8),
          customerName: order.user?.firstName || order.creatorName || 'Client',
          customerEmail: order.user?.email || 'Email non fourni',
          protagonistName: order.protagonistName,
          error: pipelineError?.message || 'Erreur inconnue',
        });
      } catch (telegramError) {
        console.error(`[AutoGen] Failed to send Telegram alert for ${orderId}:`, telegramError);
      }
    })
    .finally(() => {
      activeGenerations.delete(orderId);
    });
}

/**
 * Complete a cliffhanger story after payment (2.99€)
 * Takes existing 5 paragraphs + 5 images, generates 7 more paragraphs + 7 more images,
 * assembles new 12-page PDF, delivers to user.
 */
export async function autoCompleteStory(orderId: string): Promise<void> {
  if (activeGenerations.has(orderId)) {
    console.log(`[Completion] Skipped ${orderId} — already active`);
    return;
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { user: true },
  });

  if (!order) {
    console.error(`[Completion] Order ${orderId} not found`);
    return;
  }

  // Parse existing story text
  let existingParagraphs: string[] = [];
  try {
    if (order.storyTextJson) {
      const parsed = JSON.parse(order.storyTextJson as string);
      existingParagraphs = parsed.paragraphs || parsed;
    }
  } catch {
    console.error(`[Completion] Cannot parse existing storyTextJson for ${orderId}`);
    return;
  }

  if (existingParagraphs.length < 3) {
    console.error(`[Completion] Not enough existing paragraphs (${existingParagraphs.length}) for ${orderId}`);
    return;
  }

  console.log(`[Completion] Starting story completion for ${orderId} — ${existingParagraphs.length} existing paragraphs`);

  activeGenerations.add(orderId);

  try {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'GENERATING',
        storyStatus: 'GENERATING_TEXT',
        generationProgress: 10,
        generationStartedAt: new Date(),
      }
    });

    // Build params from order data
    const { generateStoryContinuation } = await import('../utils/storyTextGenerator');

    const storyParams = {
      // Identité du protagoniste
      protagonistName: order.protagonistName,
      protagonistAge: order.protagonistAge || undefined,
      protagonistGender: order.protagonistGender || undefined,
      ageRange: order.ageRange,
      // Apparence physique (CRITIQUE pour la cohérence visuelle des images)
      eyeColor: (order as any).eyeColor || undefined,
      hairColor: (order as any).hairColor || undefined,
      skinColor: (order as any).skinColor || undefined,
      photoUrl: (order as any).photoUrl || undefined,
      // Thème et contexte
      generalTheme: order.generalTheme,
      customTheme: order.customTheme || undefined,
      specificSubject: order.specificSubject || '',
      customSubject: order.customSubject || undefined,
      centralMessage: order.centralMessage || '',
      customMessage: order.customMessage || undefined,
      // Personnalisation
      hobbies: order.hobbies || undefined,
      favoriteDish: order.favoriteDish || undefined,
      specialEvents: order.specialEvents || undefined,
      religion: order.religion || undefined,
      customReligion: order.customReligion || undefined,
      // Style et langue
      language: order.language || 'francais',
      illustrationStyle: order.illustrationStyle || '',
      // Personnages secondaires
      secondaryCharactersJson: order.secondaryCharactersJson || undefined,
      // Crédits
      creatorName: order.creatorName || undefined,
      narratedBy: order.narratedBy || undefined,
      isClub: true, // Generate as full/premium since they paid
    };

    // 1. Generate continuation text (paragraphs 6-12)
    const title = order.coverTitle || `Le conte de ${order.protagonistName}`;
    const fullStory = await generateStoryContinuation(storyParams, title, existingParagraphs);

    await prisma.order.update({
      where: { id: orderId },
      data: {
        storyStatus: 'GENERATING_IMAGES',
        generationProgress: 30,
        storyTextJson: JSON.stringify(fullStory.paragraphs), // Même format que la génération initiale (array)
      }
    });

    // 2. Récupérer les 5 images existantes depuis Cloudinary
    let existingImages: Buffer[] = [];
    let existingCount = 0;
    try {
      if (order.illustrationUrlsJson) {
        const illustrationUrls: string[] = JSON.parse(order.illustrationUrlsJson as string);
        existingCount = illustrationUrls.length;
        const axios = (await import('axios')).default;
        for (const url of illustrationUrls) {
          try {
            const resp = await axios.get(url, { responseType: 'arraybuffer', timeout: 15000 });
            existingImages.push(Buffer.from(resp.data));
          } catch {
            console.warn(`[Completion] Failed to download existing image: ${url}`);
          }
        }
      }
    } catch {
      console.warn(`[Completion] Failed to parse existing illustration URLs`);
    }

    console.log(`[Completion] Retrieved ${existingImages.length}/${existingCount} existing images`);

    // 3. Récupérer l'image de couverture comme référence visuelle (cohérence des personnages)
    let coverReferenceBuffer: Buffer | undefined;
    if (order.coverImageUrl) {
      try {
        const axios = (await import('axios')).default;
        const coverResp = await axios.get(order.coverImageUrl, { responseType: 'arraybuffer', timeout: 15000 });
        coverReferenceBuffer = Buffer.from(coverResp.data);
        console.log(`[Completion] Cover reference image downloaded (${coverReferenceBuffer.length} bytes)`);
      } catch {
        console.warn('[Completion] Failed to download cover reference image — generating without reference');
      }
    }

    // 4. Générer les 12 images complètes (avec isClub=true pour utiliser CLUB_IMAGE_PARAGRAPH_INDICES)
    // On passe TOUS les 12 paragraphes + l'image de couverture comme référence visuelle
    // pour que gpt-image-1 maintienne la cohérence du personnage sur toutes les pages.
    const { generateStoryImages } = await import('../utils/storyImageGenerator');

    const fullImageResult = await generateStoryImages(
      { ...storyParams, isClub: true } as any,
      fullStory.title,
      fullStory.paragraphs,
      (progress: number) => {
        prisma.order.update({
          where: { id: orderId },
          data: { generationProgress: 30 + Math.round(progress * 0.5) }
        }).catch(() => {});
      },
      coverReferenceBuffer // Image de couverture comme référence visuelle pour la cohérence
    );

    // Assembler : garder les 5 premières images existantes + prendre les 7 nouvelles (indices 5-11)
    let allImages: Buffer[];
    if (existingImages.length >= existingCount && existingCount > 0) {
      // On a bien récupéré les images existantes : les garder + prendre les nouvelles
      allImages = [...existingImages, ...fullImageResult.images.slice(existingCount)];
    } else {
      // Fallback : si les images existantes n'ont pas pu être récupérées, utiliser toutes les nouvelles
      allImages = fullImageResult.images;
    }
    const imageResult = { images: allImages.slice(0, 12) }; // Sécurité: max 12

    console.log(`[Completion] Final image count: ${imageResult.images.length} (${existingImages.length} kept + ${imageResult.images.length - existingImages.length} new)`);

    // 2b. Upload les nouvelles images sur Cloudinary et sauvegarder les URLs
    console.log(`[Completion] Uploading ${imageResult.images.length} illustrations to Cloudinary...`);
    const { uploadCoverToCloudinary } = await import('../utils/cloudinaryService');

    // Upload TOUTES les images (existantes + nouvelles) pour avoir des URLs fraîches
    const uploadResults = await Promise.allSettled(
      imageResult.images.map((buf, i) =>
        uploadCoverToCloudinary(buf, `illust-complete-${orderId}-${i}-${Date.now()}`)
      )
    );
    const illustrationUrls = uploadResults
      .map(r => r.status === 'fulfilled' ? r.value : null)
      .filter(Boolean) as string[];

    console.log(`[Completion] Uploaded ${illustrationUrls.length}/${imageResult.images.length} illustrations to Cloudinary`);

    // Sauvegarder les URLs des illustrations dans la commande
    await prisma.order.update({
      where: { id: orderId },
      data: {
        storyStatus: 'ASSEMBLING_PDF',
        generationProgress: 85,
        illustrationUrlsJson: JSON.stringify(illustrationUrls),
      }
    });

    // 3. Get cover image for PDF assembly
    let coverImageBuffer: Buffer;
    if (order.coverImageUrl) {
      try {
        const axios = (await import('axios')).default;
        const coverResp = await axios.get(order.coverImageUrl, { responseType: 'arraybuffer', timeout: 15000 });
        coverImageBuffer = Buffer.from(coverResp.data);
      } catch {
        // Fallback: create a simple placeholder
        coverImageBuffer = Buffer.alloc(0);
      }
    } else {
      coverImageBuffer = Buffer.alloc(0);
    }

    // 4. Assemble complete PDF
    const { assemblePdf } = await import('../utils/pdfAssemblyService');
    const pdfBuffer = await assemblePdf({
      title: fullStory.title,
      creatorName: order.creatorName || '',
      paragraphs: fullStory.paragraphs,
      coverImage: coverImageBuffer,
      images: imageResult.images,
    });

    // 4. Upload PDF to Cloudinary
    const { uploadPdfToCloudinary } = await import('../utils/cloudinaryService');
    const pdfUrl = await uploadPdfToCloudinary(pdfBuffer, `story-complete-${orderId}`);

    // 5. Update order — mark as complete
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'DELIVERED',
        storyStatus: 'DISPONIBLE',
        pdfUrl,
        generationProgress: 100,
        deliveredAt: new Date(),
      }
    });

    console.log(`[Completion] Story ${orderId} completed and delivered!`);

    // 6. Send delivery email
    try {
      const { MailjetService } = await import('../utils/mailjetService');
      if (order.user?.email) {
        await MailjetService.sendStoryDeliveryEmail({
          customerName: order.user.firstName || order.creatorName || 'Client',
          customerEmail: order.user.email,
          orderNumber: order.id.slice(-8),
          protagonistName: order.protagonistName,
          userId: order.user.id,
        });
      }
    } catch { /* non bloquant */ }

  } catch (error: any) {
    console.error(`[Completion] Failed for ${orderId}:`, error.message);
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'DELIVERED', // Remettre en DELIVERED (le livre gratuit reste lisible)
        storyStatus: 'GENERATION_FAILED',
        generationError: error.message?.slice(0, 500),
      }
    }).catch(() => {});
  } finally {
    activeGenerations.delete(orderId);
  }
}

async function updateProgress(orderId: string, status: string, progress: number) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        storyStatus: status as any,
        generationProgress: progress,
      }
    });
  } catch (error) {
    console.error(`[Generation] Failed to update progress for ${orderId}:`, error);
  }
}

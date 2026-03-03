import { Request, Response } from 'express';
import { prisma } from '../utils/database';
import { generateStoryText, StoryTextParams } from '../utils/storyTextGenerator';
import { generateStoryImages, ImageGenerationParams } from '../utils/storyImageGenerator';
import { assemblePdf } from '../utils/pdfAssemblyService';
import { generateBookTitle, generateCoverImage, CoverGenerationParams } from '../utils/coverGeneratorService';
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

      // Delete PDF file from disk
      if (order.pdfUrl) {
        const pdfPath = path.join(__dirname, '../../', order.pdfUrl);
        try { await fs.promises.unlink(pdfPath); } catch { /* file may not exist */ }
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

      const pdfUrl = `/uploads/pdfs/${req.file.filename}`;
      const pdfData = await fs.promises.readFile(req.file.path);

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
          pdfData,
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

      // Try disk file first (fast), then fallback to DB pdfData
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

        const coversDir = path.join(__dirname, '../../uploads/covers');
        await fs.promises.mkdir(coversDir, { recursive: true });
        const coverFilename = `cover-test-${testOrder.id}-${Date.now()}.png`;
        const coverPath = path.join(coversDir, coverFilename);
        await fs.promises.writeFile(coverPath, coverBuffer);

        await prisma.order.update({
          where: { id: testOrder.id },
          data: {
            coverImageData: coverBuffer,
            coverImageUrl: `/uploads/covers/${coverFilename}`,
            coverTitle: coverResult.title,
          },
        });

        console.log(`[Generation] Couverture generee: ${coverFilename} (${coverBuffer.length} bytes), titre: "${coverResult.title}"`);

        res.json({
          success: true,
          data: { ...testOrder, coverTitle: coverResult.title, coverImageUrl: `/uploads/covers/${coverFilename}` },
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
    const orderWithCover = await prisma.order.findUnique({
      where: { id: orderId },
      select: { coverImageData: true },
    });
    let coverImageData: Buffer | null = orderWithCover?.coverImageData
      ? Buffer.from(orderWithCover.coverImageData)
      : null;

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
    };

    const storyText = await generateStoryText(textParams, title);
    logStep('text', 'completed');

    // Cache text in DB
    await prisma.order.update({
      where: { id: orderId },
      data: {
        storyTextJson: JSON.stringify(storyText.paragraphs),
        coverTitle: storyText.title,
      }
    });

    await updateProgress(orderId, 'GENERATING_TEXT', 10);

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
    };

    const imageResult = await generateStoryImages(
      imageParams,
      storyText.title,
      storyText.paragraphs,
      async (imageIndex, total) => {
        const progress = Math.round(10 + (imageIndex / total) * 83);
        await updateProgress(orderId, 'GENERATING_IMAGES', progress);
      },
      coverImageData || undefined
    );
    logStep('images', 'completed');

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

    // --- Step 4: Store PDF to disk ---
    const uploadsDir = path.join(__dirname, '../../uploads/pdfs');
    await fs.promises.mkdir(uploadsDir, { recursive: true });
    const pdfFilename = `story-${orderId}-${Date.now()}.pdf`;
    const pdfPath = path.join(uploadsDir, pdfFilename);
    await fs.promises.writeFile(pdfPath, pdfBuffer);

    // Release PDF buffer — written to disk, no longer needed in memory
    pdfBuffer = null;
    global.gc?.();

    const pdfUrl = `/uploads/pdfs/${pdfFilename}`;

    // Update status (no large binary — disk is the primary storage)
    await prisma.order.update({
      where: { id: orderId },
      data: {
        pdfUrl,
        storyStatus: 'DISPONIBLE',
        generationProgress: 100,
        generatedAt: new Date(),
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

    // Store PDF binary in DB (backup for ephemeral disk — survives redeploys)
    // Re-read from disk so only one buffer is in memory at this point
    // (all image buffers + assemblePdf doc already freed above)
    try {
      const pdfForDb = await fs.promises.readFile(pdfPath);
      await prisma.order.update({
        where: { id: orderId },
        data: { pdfData: pdfForDb },
      });
      console.log(`[Generation] pdfData stored in DB for ${orderId} (${pdfForDb.length} bytes)`);
    } catch (dbErr: any) {
      console.warn(`[Generation] Non-critical: failed to store pdfData in DB for ${orderId}:`, dbErr.message);
    }

    console.log(`[Generation] Pipeline completed for order ${orderId}`);

  } catch (error: any) {
    console.error(`[Generation] Pipeline failed for order ${orderId}:`, error);
    logStep('pipeline', 'failed', error.message || 'Erreur inconnue');

    try {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          storyStatus: 'GENERATION_FAILED',
          generationError: error.message || 'Erreur inconnue',
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

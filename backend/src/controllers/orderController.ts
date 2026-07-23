import { Request, Response } from 'express';
import Stripe from 'stripe';
import * as bcrypt from 'bcryptjs';
import { PRODUCT_PRICES, FREE_CHAPTER_LIMIT } from '../utils/pricing';
import { StoryFormData, ApiResponse } from '../types';
import { prisma } from '../utils/database';
import { stringifySecondaryCharacters } from '../utils/formatters';
import { generateClientToken } from './authController';
import { ClientAuthRequest } from '../middleware/clientAuth';
import { ClubService } from '../utils/clubService';
import { MailjetService } from '../utils/mailjetService';
import { buildOrderDetailsString } from '../utils/orderFormatter';
import { saveCoverImage } from '../utils/coverStorage';
import { isPlausibleName, normalizeChildName, resolveCustomerName } from '../utils/nameValidation';
import { extractStoryEntities } from '../utils/storyEntityExtractor';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { typescript: true });

export class OrderController {
  // Créer une nouvelle commande
  static async createOrder(req: ClientAuthRequest, res: Response) {
    try {
      console.log('📝 Création de commande reçue');

      // Récupérer les données depuis le body
      let formData, userEmail;

      if (req.body.formData) {
        formData = typeof req.body.formData === 'string' ? JSON.parse(req.body.formData) : req.body.formData;
        userEmail = req.body.userEmail || formData.userEmail;
      } else {
        formData = req.body.formData || req.body;
        userEmail = req.body.userEmail || formData.userEmail;
      }

      // Normaliser l'email (trim + lowercase) pour éviter les doublons
      if (userEmail) userEmail = userEmail.trim().toLowerCase();

      // Validation des donnees minimales (productType + brief libre obligatoires)
      if (!formData.productType) {
        return res.status(400).json({
          success: false,
          message: 'Données obligatoires manquantes dans le formulaire'
        });
      }

      // ══ Extraction des entites via GPT-4o-mini ═════════════════════════
      // Le frontend envoie ses devinettes (regex) mais GPT donne la reponse
      // autoritative. Surtout pour le prenom : la regex frontend pouvait
      // attraper "Un" ou "Le" comme prenom. GPT lit le contexte complet et
      // retourne le vrai prenom (ou null si vraiment rien). On ecrase ensuite
      // les champs frontend par les valeurs GPT (quand elles sont meilleures).
      const brief = (formData.specialEvents || '').trim();
      let extraction: Awaited<ReturnType<typeof extractStoryEntities>> = { success: false, entities: null as any };
      if (brief.length >= 3) {
        try {
          extraction = await extractStoryEntities(brief);
        } catch (extractErr) {
          console.error('[OrderController] Echec extraction GPT, on continue avec les valeurs frontend:', extractErr);
        }
      }
      const extracted = extraction.success ? extraction.entities : null;

      // Prenom : priorite GPT > frontend. Si l'extraction a REUSSI et que GPT
      // n'a trouve aucun prenom, c'est un verdict fiable (GPT a lu tout le
      // brief) — on l'ecrase la devinette frontend au lieu de la garder par
      // defaut, sinon un faux positif regex (ex: "Rencontrer" pris pour un
      // prenom dans "Rencontrer les extraterrestres") passait silencieusement.
      if (extracted?.protagonistName) {
        formData.protagonistName = extracted.protagonistName;
      } else if (extraction.success) {
        formData.protagonistName = null as any;
      }
      // Age, genre, theme, hobbies : completer si manquant cote frontend
      if (extracted?.protagonistAge && !formData.protagonistAge) {
        formData.protagonistAge = extracted.protagonistAge;
      }
      if (extracted?.protagonistGender && !formData.protagonistGender) {
        formData.protagonistGender = extracted.protagonistGender as any;
      }
      if (extracted?.hobbies && !formData.hobbies) {
        formData.hobbies = extracted.hobbies;
      }
      if (extracted?.favoriteDish && !(formData as any).favoriteDish) {
        (formData as any).favoriteDish = extracted.favoriteDish;
      }
      if (extracted?.theme && !formData.customTheme) {
        formData.customTheme = extracted.theme;
      }
      if (extracted?.occasion && !formData.customSubject) {
        formData.customSubject = extracted.occasion;
      }
      // Personnages secondaires : si GPT en a trouve plus, on prend la version GPT
      const frontendChars = (formData as any).secondaryCharacters;
      const gptChars = extracted?.secondaryCharacters || [];
      if (gptChars.length > 0 && (!Array.isArray(frontendChars) || frontendChars.length < gptChars.length)) {
        (formData as any).secondaryCharacters = gptChars.map(c => ({
          name: c.name || '',
          kind: c.kind,
          ageOrType: c.role || '',
          physical: '',
        }));
      }

      // Defaults safe pour les champs encore vides (le backend tolere ces fallbacks)
      if (!formData.ageRange) formData.ageRange = '6-9';
      if (!formData.generalTheme) formData.generalTheme = 'stories';

      // Garde-fou final : si malgre tout le prenom est invalide, on rejette
      // proprement avec un message clair. Au lieu d'echouer en silence sur la
      // generation, l'utilisateur peut corriger son brief.
      if (!isPlausibleName(formData.protagonistName)) {
        console.warn(`[OrderController] Prenom non extrait apres GPT: "${formData.protagonistName}" (email=${userEmail}) brief="${brief.slice(0, 100)}"`);
        return res.status(400).json({
          success: false,
          message: 'Ajoutez le prénom de l\'enfant dans votre description pour que l\'histoire le mette en héros.',
          field: 'protagonistName',
        });
      }
      formData.protagonistName = normalizeChildName(formData.protagonistName);

      // Prix par défaut : 0€ (chapitre gratuit). Sera ajusté si Club/crédits épuisés.
      let price = 0;

      let user = null;
      let photoUrl = null;
      let coverImageUrl: string | null = null;
      const coverTitle = formData.coverTitle || null;

      // Gestion de la couverture generee par GPT
      // Priorité : URL Cloudinary (déjà uploadée côté frontend) > base64 (fallback)
      if (formData.coverImageUrl && formData.coverImageUrl.startsWith('http')) {
        coverImageUrl = formData.coverImageUrl;
        console.log('🖼️ Cover URL Cloudinary reçue:', coverImageUrl);
        delete formData.coverImageUrl;
      } else if (formData.coverImageBase64) {
        console.log('🖼️ Cover base64 reçue (fallback):', (formData.coverImageBase64.length / 1024 / 1024).toFixed(1), 'MB');
        try {
          const result = await saveCoverImage(formData.coverImageBase64);
          coverImageUrl = result.url;
          console.log('🖼️ Couverture sauvegardee:', coverImageUrl);
        } catch (coverErr) {
          console.error('❌ Erreur sauvegarde couverture:', coverErr);
        }
        delete formData.coverImageBase64;
      }

      // Gestion de l'upload de photo
      if (req.file) {
        photoUrl = `/uploads/${req.file.filename}`;
      }

      const password = req.body.password || formData.password;
      let purchaseType = (formData.purchaseType || 'SINGLE').toUpperCase();

      // --- Resolution du user ---
      if (req.clientUser) {
        // Utilisateur connecte : on utilise directement son compte
        user = await prisma.user.findUnique({ where: { id: req.clientUser.id } });
        userEmail = req.clientUser.email;
        console.log('👤 Utilisateur connecte:', userEmail);
      } else if (userEmail) {
        // Invité : chercher ou creer le user par email
        const existingUser = await prisma.user.findUnique({ where: { email: userEmail } });
        if (existingUser) {
          if (password && !existingUser.password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user = await prisma.user.update({
              where: { email: userEmail },
              data: { password: hashedPassword }
            });
          } else {
            user = existingUser;
          }
        } else {
          const createData: any = { email: userEmail };
          if (password) {
            createData.password = await bcrypt.hash(password, 10);
          }
          user = await prisma.user.create({ data: createData });
        }
      }

      // --- Logique chapitres gratuits (modèle cliffhanger) ---
      // Tout utilisateur non-Club peut créer jusqu'à 3 chapitres gratuits (3 pages + cliffhanger)
      // Les membres Club créent des livres complets directement (20 pages, pas de cliffhanger)
      const isExistingClubMember = user && user.role === 'CLUB' && user.subscriptionStatus === 'active';
      let isFirstBookFree = false;

      if (purchaseType === 'SINGLE' && userEmail && !isExistingClubMember) {
        // Compter les chapitres déjà créés
        const chapterCount = await prisma.order.count({
          where: {
            user: { email: userEmail },
            status: { in: ['PAID', 'GENERATING', 'GENERATED', 'DELIVERED'] }
          }
        });

        if (chapterCount >= FREE_CHAPTER_LIMIT) {
          // Limite atteinte → doit s'abonner au Club
          return res.status(403).json({
            success: false,
            message: `Vous avez utilise vos ${FREE_CHAPTER_LIMIT} chapitres gratuits. Abonnez-vous au Club pour creer des livres complets illimites !`,
            limitReached: true,
            bookCount: chapterCount,
            bookLimit: FREE_CHAPTER_LIMIT
          });
        }

        // Chapitre gratuit (3 pages + cliffhanger)
        price = PRODUCT_PRICES.EBOOK_FREE;
        isFirstBookFree = true;
        console.log(`📖 Chapitre gratuit ${chapterCount + 1}/${FREE_CHAPTER_LIMIT} pour ${userEmail}`);
      }

      // --- Attribution parrainage : créditer le parrain si le filleul crée son 1er chapitre ---
      const refCode = formData.referralCode || formData.ref;
      if (refCode && isFirstBookFree) {
        try {
          const referrer = await prisma.user.findUnique({ where: { referralCode: refCode } });
          if (referrer && referrer.email !== userEmail && (referrer.referralCount || 0) < 3) {
            await prisma.user.update({
              where: { id: referrer.id },
              data: {
                referralCredits: { increment: 1 },
                referralCount: { increment: 1 }
              }
            });
            // Stocker le parrain sur le filleul
            const filleul = await prisma.user.findUnique({ where: { email: userEmail } });
            if (filleul && !filleul.referredBy) {
              await prisma.user.update({ where: { id: filleul.id }, data: { referredBy: referrer.id } });
            }
            console.log(`🎉 Parrainage: ${referrer.email} a gagné 1 crédit grâce à ${userEmail}`);
          }
        } catch (refErr) {
          console.error('Erreur attribution parrainage:', refErr);
        }
      }

      // --- Logique Club : conte gratuit hebdomadaire ---
      // Ne verifier le credit QUE si l'utilisateur est deja membre Club actif.
      // Si l'utilisateur n'est pas encore Club (nouvel abonnement), on laisse
      // purchaseType = 'CLUB' pour que le frontend redirige vers le checkout subscription.
      let isClubFreeOrder = false;
      let clubCreditExhausted = false;

      if (isExistingClubMember && purchaseType === 'CLUB') {
        const clubCheck = await ClubService.canSubmitFreeStory(user!.id);
        if (clubCheck.canSubmit) {
          price = 0;
          isClubFreeOrder = true;
        } else {
          // Credit epuise cette semaine : fallback en achat unique
          purchaseType = 'SINGLE';
          clubCreditExhausted = true;
        }
      }

      // Filet de securite CRITIQUE : toute commande a prix 0 doit etre finalisee
      // comme livre gratuit (statut PAID + generation + notifications). Sans ca,
      // un membre Club passant par l'UI mono-champ (qui envoie purchaseType
      // SINGLE) cree une commande a 0€ jamais finalisee : elle reste PENDING,
      // n'est jamais generee/notifiee, et le frontend retombe sur
      // createPaymentSession qui rejette le prix 0 -> "Erreur 400:" vide.
      // On exclut purchaseType CLUB (nouvel abonnement = checkout subscription).
      if (price === 0 && !isClubFreeOrder && user && purchaseType !== 'CLUB') {
        isFirstBookFree = true;
      }

      // Défensif : garantir que les champs obligatoires ne sont jamais null/undefined
      const safeSpecificSubject = formData.specificSubject || formData.generalTheme || 'non spécifié';
      const safeCentralMessage = formData.centralMessage || 'non spécifié';
      const safeIllustrationStyle = formData.illustrationStyle || '3d-animation';

      console.log('📦 Création commande:', {
        userId: user?.id, userEmail, purchaseType, price,
        ageRange: formData.ageRange, generalTheme: formData.generalTheme,
        specificSubject: safeSpecificSubject, protagonistName: formData.protagonistName,
        coverImageUrl: coverImageUrl ? 'OUI' : 'NON',
      });

      // Créer la commande (omit exclut les champs binaires volumineux de la reponse)
      const order = await prisma.order.create({
        data: {
          userId: user?.id,
          ageRange: formData.ageRange,
          generalTheme: formData.generalTheme,
          customTheme: formData.customTheme || null,
          specificSubject: safeSpecificSubject,
          customSubject: formData.customSubject || null,
          centralMessage: safeCentralMessage,
          customMessage: formData.customMessage || null,
          illustrationStyle: safeIllustrationStyle,
          protagonistName: formData.protagonistName,
          protagonistAge: formData.protagonistAge || null,
          protagonistGender: formData.protagonistGender || null,
          eyeColor: photoUrl ? null : (formData.eyeColor || null),
          hairColor: photoUrl ? null : (formData.hairColor || null),
          skinColor: photoUrl ? null : (formData.skinColor || null),
          photoUrl: photoUrl,
          coverImageUrl: coverImageUrl,
          coverTitle: coverTitle,
          language: formData.language || null,
          hobbies: formData.hobbies || null,
          favoriteDish: formData.favoriteDish || null,
          specialEvents: formData.specialEvents || null,
          religion: formData.religion || null,
          customReligion: formData.customReligion || null,
          secondaryCharactersJson: stringifySecondaryCharacters(formData.secondaryCharacters),
          secondaryCharacterName: formData.secondaryCharacterName || null,
          secondaryCharacterAge: formData.secondaryCharacterAge || null,
          creatorName: formData.creatorName || null,
          firstIllustrationUrl: formData.firstIllustrationUrl || null,
          storyPreviewTextJson: formData.storyPreviewTextJson || null,
          productType: 'EBOOK',
          purchaseType: purchaseType as 'SINGLE' | 'CLUB',
          price: price
        },
        omit: { coverImageData: true, pdfData: true }
      });

      // --- Create Stripe session inline (single HTTP round trip) ---
      let stripeUrl: string | undefined;

      if (!isClubFreeOrder && !isFirstBookFree) {
        try {
          if (purchaseType === 'CLUB' && !clubCreditExhausted && user) {
            // Subscription checkout
            let stripeCustomerId = user.stripeCustomerId;
            if (!stripeCustomerId) {
              const customer = await stripe.customers.create({
                email: user.email,
                metadata: { userId: user.id }
              });
              stripeCustomerId = customer.id;
              await prisma.user.update({
                where: { id: user.id },
                data: { stripeCustomerId }
              });
            }

            const priceId = process.env.STRIPE_CLUB_PRICE_ID;
            if (priceId) {
              const session = await stripe.checkout.sessions.create({
                customer: stripeCustomerId,
                line_items: [{ price: priceId, quantity: 1 }],
                mode: 'subscription',
                success_url: `${process.env.FRONTEND_URL}/dashboard?subscription=success`,
                cancel_url: `${process.env.FRONTEND_URL}/create-story?subscription=cancelled`,
                metadata: { userId: user.id, orderId: order.id }
              });
              stripeUrl = session.url || undefined;
            }
          } else {
            // Single payment checkout
            const unitAmount = Math.round(Number(price) * 100);
            if (unitAmount > 0) {
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              const customerEmail = user?.email && emailRegex.test(user.email) ? user.email : undefined;

              const session = await stripe.checkout.sessions.create({
                customer_email: customerEmail,
                line_items: [{
                  price_data: {
                    currency: 'eur',
                    product_data: {
                      name: 'Conte personnalise - eBook Numerique',
                      description: `Conte pour ${formData.protagonistName}`,
                    },
                    unit_amount: unitAmount,
                  },
                  quantity: 1,
                }],
                mode: 'payment',
                success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
                cancel_url: `${process.env.FRONTEND_URL}/cancel?order_id=${order.id}`,
                metadata: { orderId: order.id },
              });
              stripeUrl = session.url || undefined;

              await prisma.order.update({
                where: { id: order.id },
                data: { status: 'PENDING' }
              });
            }
          }
        } catch (stripeError: any) {
          console.error('[ORDER] ECHEC creation session Stripe inline:', stripeError?.message || stripeError);
          console.error('[ORDER] Order ID:', order.id, 'Price:', price, 'Type:', purchaseType);
          // Retourner une erreur explicite au frontend au lieu d'echouer silencieusement
          return res.status(500).json({
            success: false,
            message: 'Impossible de creer la session de paiement. Merci de reessayer dans quelques instants.',
            error: 'STRIPE_SESSION_FAILED',
            orderId: order.id
          });
        }
      }

      // --- Si commande Club gratuite : finaliser immediatement ---
      if (isClubFreeOrder && user) {
        await ClubService.recordSubmission(user.id);

        const updatedOrder = await prisma.order.update({
          where: { id: order.id },
          data: { status: 'PAID', paidAt: new Date() },
          omit: { coverImageData: true, pdfData: true },
          include: { user: true }
        });

        // Envoyer notifications (emails + Telegram)
        try {
          const orderDetails = buildOrderDetailsString(updatedOrder);
          const customerEmail = user.email;
          const customerName = resolveCustomerName([user.firstName, formData.creatorName]);

          if (customerEmail) {
            await MailjetService.sendOrderConfirmation({
              customerName,
              customerEmail,
              orderNumber: order.id.slice(-8),
              orderDetails
            });
          }

          await MailjetService.sendAdminNotification({
            customerName,
            customerEmail: customerEmail || 'Email non fourni',
            orderNumber: order.id.slice(-8),
            orderDetails
          });

          const { TelegramService } = await import('../utils/telegramService');
          await TelegramService.sendOrderNotification({
            customerName,
            customerEmail: customerEmail || 'Email non fourni',
            orderNumber: order.id.slice(-8),
            amount: 0,
            orderDate: new Date(),
            productType: order.productType,
            purchaseType: 'CLUB',
            orderDetails: updatedOrder
          });
        } catch (notifError) {
          console.error('Erreur envoi notifications Club:', notifError);
        }

        // Auto-generate story (fire-and-forget)
        try {
          const { autoGenerateAndDeliver } = await import('./storyGenerationController');
          autoGenerateAndDeliver(order.id).catch(err =>
            console.error('[ClubFree] autoGenerateAndDeliver error (non-blocking):', err)
          );
        } catch (genErr) {
          console.error('[ClubFree] Failed to import autoGenerateAndDeliver:', genErr);
        }
      }

      // --- Si premier livre gratuit : finaliser immédiatement ---
      // Seul le update DB est await — tout le reste est fire-and-forget pour répondre VITE
      if (isFirstBookFree && user) {
        await prisma.order.update({
          where: { id: order.id },
          data: { status: 'PAID', paidAt: new Date() }
        });

        // Notifications + génération en arrière-plan (ne bloque PAS la réponse)
        const orderId = order.id;
        const customerEmail = user.email;
        const customerName = resolveCustomerName([user.firstName, formData.creatorName]);

        setImmediate(async () => {
          try {
            const fullOrder = await prisma.order.findUnique({
              where: { id: orderId },
              omit: { coverImageData: true, pdfData: true },
              include: { user: true }
            });
            const orderDetails = buildOrderDetailsString(fullOrder!);

            // Emails + Telegram en parallèle
            await Promise.allSettled([
              customerEmail ? MailjetService.sendOrderConfirmation({
                customerName, customerEmail,
                orderNumber: orderId.slice(-8), orderDetails
              }) : Promise.resolve(),
              MailjetService.sendAdminNotification({
                customerName, customerEmail: customerEmail || 'Email non fourni',
                orderNumber: orderId.slice(-8), orderDetails
              }),
              import('../utils/telegramService').then(({ TelegramService }) =>
                TelegramService.sendOrderNotification({
                  customerName, customerEmail: customerEmail || 'Email non fourni',
                  orderNumber: orderId.slice(-8), amount: 0, orderDate: new Date(),
                  productType: order.productType, purchaseType: 'SINGLE',
                  orderDetails: fullOrder
                })
              )
            ]);
          } catch (err) {
            console.error('[FreeBook] Notification error (non-blocking):', err);
          }

          // Auto-generate story
          try {
            const { autoGenerateAndDeliver } = await import('./storyGenerationController');
            autoGenerateAndDeliver(orderId).catch(err =>
              console.error('[FreeBook] autoGenerateAndDeliver error:', err)
            );
          } catch (err) {
            console.error('[FreeBook] Import error:', err);
          }
        });
      }

      // Ajouter le contact à la liste Mailjet (fire-and-forget)
      if (userEmail) {
        MailjetService.addContactToList({
          email: userEmail,
          name: `${formData.firstName || ''} ${formData.lastName || ''}`.trim() || undefined,
          firstName: formData.firstName || undefined,
          properties: {
            firstname: formData.firstName || '',
            lastname: formData.lastName || '',
            purchase_type: purchaseType,
            price: String(price),
            protagonist_name: formData.protagonistName || '',
          }
        }).catch(err => console.error('Mailjet list add error (non-blocking):', err));
      }

      // Generer un token JWT pour TOUT utilisateur (avec ou sans mot de passe)
      let token: string | undefined;
      let userData: any = undefined;
      if (user) {
        token = generateClientToken(user);
        userData = {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        };
      }

      res.status(201).json({
        success: true,
        data: order,
        stripeUrl,
        token,
        user: userData,
        isClubFreeOrder,
        isFirstBookFree,
        clubCreditExhausted,
        message: isFirstBookFree ? 'Premier livre gratuit cree avec succes' : isClubFreeOrder ? 'Conte Club gratuit cree avec succes' : 'Commande creee avec succes'
      });

    } catch (error: any) {
      const errMsg = error?.message || String(error);
      console.error('Erreur création commande:', errMsg, error?.stack);
      res.status(500).json({
        success: false,
        message: `Erreur création commande: ${errMsg}`
      });
    }
  }

  // Sauvegarder le cover image (appele apres creation de commande ou depuis l'admin)
  static async saveCover(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { coverImageBase64, coverTitle } = req.body;

      if (!coverImageBase64) {
        return res.status(400).json({ success: false, message: 'Pas de cover image' });
      }

      const result = await saveCoverImage(coverImageBase64);
      console.log('🖼️ Cover sauvegardee:', result.url);

      const updated = await prisma.order.update({
        where: { id },
        data: {
          coverImageUrl: result.url,
          ...(coverTitle && { coverTitle })
        },
        select: { id: true, coverImageUrl: true }
      });

      console.log('✅ Cover DB update verified:', updated.id, updated.coverImageUrl);
      res.json({ success: true, coverImageUrl: updated.coverImageUrl });
    } catch (error) {
      console.error('Erreur sauvegarde cover:', error);
      res.status(500).json({ success: false, message: 'Erreur sauvegarde cover' });
    }
  }

  // Marquer une commande comme abandonnee (paiement annule)
  static async abandonOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const order = await prisma.order.findUnique({
        where: { id },
        select: { id: true, status: true, paidAt: true }
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Commande non trouvee'
        });
      }

      // Ne marquer comme abandonnee que si la commande n'est pas deja payee
      if (order.status === 'PAID' || order.paidAt) {
        return res.json({ success: true, message: 'Commande deja payee' });
      }

      await prisma.order.update({
        where: { id },
        data: { status: 'UNPAID' }
      });

      res.json({
        success: true,
        message: 'Commande marquee comme non payee'
      });
    } catch (error) {
      console.error('Erreur abandon commande:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'abandon de la commande'
      });
    }
  }

  // Récupérer une commande par ID
  static async getOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const order = await prisma.order.findUnique({
        where: { id },
        omit: { coverImageData: true, pdfData: true },
        include: { user: true }
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Commande non trouvée'
        });
      }

      res.json({
        success: true,
        data: order
      });

    } catch (error) {
      console.error('Erreur récupération commande:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de la commande'
      });
    }
  }

  // Mettre à jour le statut d'une commande
  static async updateOrderStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const order = await prisma.order.update({
        where: { id },
        data: { status },
        omit: { coverImageData: true, pdfData: true }
      });

      res.json({
        success: true,
        data: order,
        message: 'Statut de la commande mis à jour'
      });

    } catch (error) {
      console.error('Erreur mise à jour commande:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour de la commande'
      });
    }
  }

  // Lister toutes les commandes (pour l'admin)
  static async getAllOrders(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, status, productType, search } = req.query;
      
      const skip = (Number(page) - 1) * Number(limit);
      
      // Construction des filtres
      const where: any = {};
      if (status) where.status = status;
      if (productType) where.productType = productType;
      if (search) {
        where.OR = [
          { protagonistName: { contains: search as string, mode: 'insensitive' } },
          { user: { email: { contains: search as string, mode: 'insensitive' } } }
        ];
      }

      const [orders, total] = await Promise.all([
        prisma.order.findMany({
          where,
          omit: { coverImageData: true, pdfData: true },
          include: { user: true },
          orderBy: { createdAt: 'desc' },
          skip,
          take: Number(limit)
        }),
        prisma.order.count({ where })
      ]);

      res.json({
        success: true,
        data: orders,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit))
        }
      });

    } catch (error) {
      console.error('Erreur liste commandes:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des commandes'
      });
    }
  }

  // Mettre à jour une commande
  static async updateOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const order = await prisma.order.update({
        where: { id },
        data: updateData,
        omit: { coverImageData: true, pdfData: true },
        include: { user: true }
      });

      res.json({
        success: true,
        data: order
      });

    } catch (error) {
      console.error('Erreur mise à jour commande:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour de la commande'
      });
    }
  }

  // Lister toutes les commandes avec filtres
  static async getOrders(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, status, productType } = req.query;
      
      const where: any = {};
      if (status) where.status = status;
      if (productType) where.productType = productType;

      const orders = await prisma.order.findMany({
        where,
        omit: { coverImageData: true, pdfData: true },
        include: { user: true },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
      });

      const total = await prisma.order.count({ where });

      res.json({
        success: true,
        data: orders,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit))
        }
      });

    } catch (error) {
      console.error('Erreur liste commandes:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des commandes'
      });
    }
  }
}

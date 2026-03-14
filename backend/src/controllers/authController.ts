import { Request, Response } from 'express';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { prisma } from '../utils/database';
import { ClientAuthRequest } from '../middleware/clientAuth';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function getClientSecret(): string {
  const secret = process.env.JWT_CLIENT_SECRET || process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT secret non configure');
  return secret;
}

function generateClientToken(user: { id: string; email: string; role: string }): string {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    getClientSecret(),
    { expiresIn: '7d' }
  );
}

export class AuthController {
  // Inscription client
  static async register(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email et mot de passe requis'
        });
      }

      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          message: 'Le mot de passe doit contenir au moins 8 caracteres'
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // Upsert : si l'email existe sans mdp, on ajoute le mdp
      const existingUser = await prisma.user.findUnique({ where: { email } });

      let user;
      if (existingUser) {
        if (existingUser.password) {
          return res.status(409).json({
            success: false,
            message: 'Un compte existe deja avec cet email'
          });
        }
        // Utilisateur existe sans mot de passe -> securiser le compte
        user = await prisma.user.update({
          where: { email },
          data: {
            password: hashedPassword,
            firstName: firstName || existingUser.firstName,
            lastName: lastName || existingUser.lastName
          }
        });
      } else {
        user = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            firstName,
            lastName
          }
        });
      }

      const token = generateClientToken(user);

      res.status(201).json({
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
          }
        }
      });
    } catch (error) {
      console.error('Erreur inscription:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'inscription'
      });
    }
  }

  // Connexion client
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email et mot de passe requis'
        });
      }

      const user = await prisma.user.findUnique({ where: { email } });

      if (!user || !user.password) {
        return res.status(401).json({
          success: false,
          message: 'Identifiants invalides'
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Identifiants invalides'
        });
      }

      const token = generateClientToken(user);

      console.log('[AUTH] Login:', user.id, 'role:', user.role, 'subStatus:', user.subscriptionStatus);

      res.json({
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            subscriptionStatus: user.subscriptionStatus
          }
        }
      });
    } catch (error) {
      console.error('Erreur connexion:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la connexion'
      });
    }
  }

  // Profil utilisateur connecte
  static async getProfile(req: ClientAuthRequest, res: Response) {
    try {
      const userId = req.clientUser!.id;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          orders: {
            omit: { coverImageData: true, pdfData: true },
            orderBy: { createdAt: 'desc' },
            take: 20
          },
          childProfiles: true
        }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouve'
        });
      }

      console.log('[AUTH] getProfile:', user.id, 'role:', user.role, 'subStatus:', user.subscriptionStatus);

      // Vérifier si l'utilisateur a déjà un achat payé (pour le tripwire 1,99€)
      const hasPaidOrder = user.orders?.some((o: any) =>
        ['PAID', 'GENERATING', 'GENERATED', 'DELIVERED'].includes(o.status)
      ) || false;

      res.json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          subscriptionStatus: user.subscriptionStatus,
          subscriptionPeriodEnd: user.subscriptionPeriodEnd,
          weeklySubmissionCount: user.weeklySubmissionCount,
          weeklySubmissionReset: user.weeklySubmissionReset,
          orders: user.orders,
          children: user.childProfiles,
          isFirstPurchase: !hasPaidOrder
        }
      });
    } catch (error) {
      console.error('Erreur profil:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la recuperation du profil'
      });
    }
  }

  // Verifier si un email existe deja
  static async checkEmail(req: Request, res: Response) {
    try {
      const { email } = req.query;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email requis'
        });
      }

      const user = await prisma.user.findUnique({
        where: { email: email as string }
      });

      if (!user) {
        return res.json({
          success: true,
          exists: false
        });
      }

      res.json({
        success: true,
        exists: true,
        hasPassword: !!user.password
      });
    } catch (error) {
      console.error('Erreur check email:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la verification'
      });
    }
  }

  // Login unifie : admin ou client
  static async unifiedLogin(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email et mot de passe requis'
        });
      }

      // 1. Essayer d'abord la table AdminUser
      const admin = await prisma.adminUser.findUnique({ where: { email } });
      if (admin && admin.isActive) {
        const isValid = await bcrypt.compare(password, admin.password);
        if (isValid) {
          const token = jwt.sign(
            { adminId: admin.id, email: admin.email, role: admin.role },
            process.env.JWT_SECRET!,
            { expiresIn: '24h' }
          );
          return res.json({
            success: true,
            data: {
              token,
              userType: 'admin',
              user: {
                id: admin.id,
                email: admin.email,
                firstName: admin.firstName,
                lastName: admin.lastName,
                role: admin.role
              }
            }
          });
        }
      }

      // 2. Sinon essayer la table User
      const user = await prisma.user.findUnique({ where: { email } });
      if (user && user.password) {
        const isValid = await bcrypt.compare(password, user.password);
        if (isValid) {
          const token = generateClientToken(user);
          return res.json({
            success: true,
            data: {
              token,
              userType: 'client',
              user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                subscriptionStatus: user.subscriptionStatus
              }
            }
          });
        }
      }

      // Aucun match
      return res.status(401).json({
        success: false,
        message: 'Identifiants invalides'
      });
    } catch (error) {
      console.error('Erreur unified login:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la connexion'
      });
    }
  }

  // Mise a jour du profil (prenom, nom)
  static async updateProfile(req: any, res: Response) {
    try {
      const userId = req.clientUser!.id;
      const { firstName, lastName } = req.body;

      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          ...(firstName !== undefined && { firstName }),
          ...(lastName !== undefined && { lastName })
        }
      });

      res.json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Erreur mise a jour profil:', error);
      res.status(500).json({ success: false, message: 'Erreur lors de la mise a jour du profil' });
    }
  }

  // Changement de mot de passe
  static async changePassword(req: any, res: Response) {
    try {
      const userId = req.clientUser!.id;
      const { currentPassword, newPassword } = req.body;

      if (!newPassword || newPassword.length < 8) {
        return res.status(400).json({ success: false, message: 'Le nouveau mot de passe doit contenir au moins 8 caracteres' });
      }

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        return res.status(404).json({ success: false, message: 'Utilisateur non trouve' });
      }

      // Verifier l'ancien mot de passe si le user en a un
      if (user.password) {
        if (!currentPassword) {
          return res.status(400).json({ success: false, message: 'Mot de passe actuel requis' });
        }
        const isValid = await bcrypt.compare(currentPassword, user.password);
        if (!isValid) {
          return res.status(401).json({ success: false, message: 'Mot de passe actuel incorrect' });
        }
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({ where: { id: userId }, data: { password: hashedPassword } });

      res.json({ success: true, message: 'Mot de passe modifie avec succes' });
    } catch (error) {
      console.error('Erreur changement mot de passe:', error);
      res.status(500).json({ success: false, message: 'Erreur lors du changement de mot de passe' });
    }
  }

  // Connexion par magic link (sans mot de passe)
  // Étape 1: l'utilisateur entre son email → on envoie un lien par email
  static async requestMagicLink(req: Request, res: Response) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ success: false, message: 'Email requis' });
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        // Ne pas révéler si le compte existe ou non
        return res.json({ success: true, message: 'Si ce compte existe, un lien de connexion a ete envoye' });
      }

      // Générer un token magic link (courte durée : 30 min)
      const magicToken = jwt.sign(
        { userId: user.id, email: user.email, type: 'magic_link' },
        getClientSecret(),
        { expiresIn: '30m' }
      );

      const frontendUrl = process.env.FRONTEND_URL || 'https://contedia.fr';
      const magicUrl = `${frontendUrl}/magic-login?token=${magicToken}`;

      // Envoyer l'email
      const Mailjet = require('node-mailjet');
      const mailjet = new Mailjet({
        apiKey: process.env.MJ_APIKEY_PUBLIC,
        apiSecret: process.env.MJ_APIKEY_PRIVATE
      });

      await mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [{
          From: {
            Email: process.env.MAILJET_FROM_EMAIL || 'contact@contedia.fr',
            Name: "Conte d'IA"
          },
          To: [{ Email: user.email, Name: user.firstName || '' }],
          Subject: 'Votre lien de connexion — Conte d\'IA',
          HTMLPart: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 500px; margin: 0 auto; padding: 40px 20px;">
              <h1 style="color: #2D3748; font-size: 24px; text-align: center;">Connexion a votre compte</h1>
              <p style="color: #4A5568; font-size: 16px; text-align: center; line-height: 1.6;">
                Cliquez sur le bouton ci-dessous pour acceder a votre bibliotheque de contes.
              </p>
              <div style="text-align: center; margin: 32px 0;">
                <a href="${magicUrl}" style="background: linear-gradient(135deg, #FF6B6B, #FF8E53); color: white; padding: 14px 40px; border-radius: 30px; text-decoration: none; font-weight: 700; font-size: 16px; display: inline-block;">
                  Acceder a ma bibliotheque
                </a>
              </div>
              <p style="color: #A0AEC0; font-size: 12px; text-align: center;">
                Ce lien expire dans 30 minutes. Si vous n'avez pas demande ce lien, ignorez cet email.
              </p>
            </div>
          `
        }]
      });

      console.log(`[AUTH] Magic link sent to ${user.email}`);
      res.json({ success: true, message: 'Si ce compte existe, un lien de connexion a ete envoye' });
    } catch (error) {
      console.error('Erreur magic link:', error);
      res.status(500).json({ success: false, message: 'Erreur lors de l\'envoi du lien' });
    }
  }

  // Étape 2: l'utilisateur clique sur le lien → on vérifie le token et le connecte
  static async verifyMagicLink(req: Request, res: Response) {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({ success: false, message: 'Token requis' });
      }

      const decoded = jwt.verify(token, getClientSecret()) as any;

      if (decoded.type !== 'magic_link') {
        return res.status(401).json({ success: false, message: 'Token invalide' });
      }

      const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
      if (!user) {
        return res.status(404).json({ success: false, message: 'Utilisateur non trouve' });
      }

      // Générer un vrai token de session (7 jours)
      const sessionToken = generateClientToken(user);

      res.json({
        success: true,
        data: {
          token: sessionToken,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            subscriptionStatus: user.subscriptionStatus
          }
        }
      });
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: 'Le lien a expire. Demandez un nouveau lien.' });
      }
      console.error('Erreur verify magic link:', error);
      res.status(401).json({ success: false, message: 'Lien invalide ou expire' });
    }
  }

  // Connexion / Inscription via Google OAuth
  static async googleAuth(req: Request, res: Response) {
    try {
      const { credential } = req.body;

      if (!credential) {
        return res.status(400).json({ success: false, message: 'Google credential requis' });
      }

      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        return res.status(400).json({ success: false, message: 'Token Google invalide' });
      }

      const { sub: googleId, email, given_name: firstName, family_name: lastName } = payload;

      // Chercher user existant par googleId ou email
      let user = await prisma.user.findFirst({
        where: {
          OR: [
            { googleId: googleId },
            { email: email }
          ]
        }
      });

      if (user) {
        // Lier le googleId si pas encore fait
        if (!user.googleId) {
          user = await prisma.user.update({
            where: { id: user.id },
            data: {
              googleId,
              firstName: user.firstName || firstName,
              lastName: user.lastName || lastName
            }
          });
        }
      } else {
        // Creer un nouveau compte
        user = await prisma.user.create({
          data: {
            email: email,
            googleId,
            firstName: firstName || undefined,
            lastName: lastName || undefined
          }
        });
      }

      const token = generateClientToken(user);

      console.log(`[Google Auth] ${user.id} - role: ${user.role}`);

      res.json({
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            subscriptionStatus: user.subscriptionStatus
          }
        }
      });
    } catch (error: any) {
      console.error('Erreur Google Auth:', error);
      res.status(500).json({ success: false, message: 'Erreur lors de l\'authentification Google' });
    }
  }
}

export { generateClientToken };

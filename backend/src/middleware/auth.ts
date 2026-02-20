import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/database';

// Interface pour étendre Request avec les données utilisateur
interface AuthenticatedRequest extends Request {
  admin?: {
    id: string;
    email: string;
    role: string;
  };
}

// Middleware d'authentification JWT pour les admins
export const authenticateAdmin = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token d\'authentification requis'
      });
    }

    const token = authHeader.substring(7);

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET non configuré');
    }

    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
    // Récupérer l'admin depuis la base de données
    const admin = await prisma.adminUser.findUnique({
      where: { id: decoded.adminId }
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur administrateur non trouvé'
      });
    }

    // Ajouter les infos admin à la requête
    req.admin = {
      id: admin.id,
      email: admin.email,
      role: admin.role
    };

    next();

  } catch (error) {
    console.error('Erreur authentification:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: 'Token invalide'
      });
    }

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: 'Token expiré'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Erreur d\'authentification'
    });
  }
};

// Middleware pour vérifier les rôles admin
export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: 'Authentification requise'
      });
    }

    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({
        success: false,
        message: 'Permissions insuffisantes'
      });
    }

    next();
  };
};

// Middleware pour vérifier si l'utilisateur est super admin
export const requireSuperAdmin = requireRole(['SUPER_ADMIN']);

// Middleware pour vérifier si l'utilisateur est admin ou super admin
export const requireAdmin = requireRole(['ADMIN', 'SUPER_ADMIN']);

export type { AuthenticatedRequest };

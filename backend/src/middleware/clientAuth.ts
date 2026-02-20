import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/database';

export interface ClientAuthRequest extends Request {
  clientUser?: {
    id: string;
    email: string;
    role: string;
  };
}

// Auth optionnelle : si token present et valide, req.clientUser est rempli. Sinon, on continue sans erreur.
export const optionalAuthenticateClient = async (req: ClientAuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // Pas de token = invité, on continue
    }

    const token = authHeader.substring(7);
    const secret = process.env.JWT_CLIENT_SECRET || process.env.JWT_SECRET;

    if (!secret) {
      return next();
    }

    const decoded = jwt.verify(token, secret) as any;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (user) {
      req.clientUser = {
        id: user.id,
        email: user.email,
        role: user.role
      };
    }

    next();
  } catch (error) {
    // Token invalide ou expire : on continue en mode invité
    next();
  }
};

export const authenticateClient = async (req: ClientAuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token d\'authentification requis'
      });
    }

    const token = authHeader.substring(7);
    const secret = process.env.JWT_CLIENT_SECRET || process.env.JWT_SECRET;

    if (!secret) {
      throw new Error('JWT secret non configure');
    }

    const decoded = jwt.verify(token, secret) as any;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non trouve'
      });
    }

    req.clientUser = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: 'Token invalide'
      });
    }

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: 'Token expire'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Erreur d\'authentification'
    });
  }
};

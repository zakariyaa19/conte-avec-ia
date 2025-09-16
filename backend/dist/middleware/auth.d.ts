import { Request, Response, NextFunction } from 'express';
interface AuthenticatedRequest extends Request {
    admin?: {
        id: string;
        email: string;
        role: string;
    };
}
export declare const authenticateAdmin: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const requireRole: (roles: string[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const requireSuperAdmin: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const requireAdmin: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export type { AuthenticatedRequest };
//# sourceMappingURL=auth.d.ts.map
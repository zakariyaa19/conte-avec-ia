import { Request, Response } from 'express';
export declare const createPaymentSession: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const checkPaymentStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=stripeController.d.ts.map
import { Request, Response } from 'express';
export declare class PaymentController {
    static createPaymentIntent(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static handleWebhook(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    private static handlePaymentSuccess;
    private static handlePaymentFailed;
    static getPaymentStatus(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=paymentController.d.ts.map
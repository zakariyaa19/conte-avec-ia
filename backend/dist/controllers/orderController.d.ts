import { Request, Response } from 'express';
export declare class OrderController {
    static createOrder(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getOrder(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static updateOrderStatus(req: Request, res: Response): Promise<void>;
    static getAllOrders(req: Request, res: Response): Promise<void>;
    static updateOrder(req: Request, res: Response): Promise<void>;
    static getOrders(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=orderController.d.ts.map
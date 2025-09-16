import { Request, Response } from 'express';
export declare class AdminController {
    static login(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getDashboardStats(req: Request, res: Response): Promise<void>;
    static getOrders(req: Request, res: Response): Promise<void>;
    static getOrderDetails(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static updateOrder(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=adminController.d.ts.map
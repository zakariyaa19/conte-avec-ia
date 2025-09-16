import type { Order, User } from '../generated/prisma';
export declare class EmailService {
    private static transporter;
    static sendOrderNotificationToAdmin(order: any, formData: any): Promise<void>;
    static sendOrderConfirmation(order: Order & {
        user?: User | null;
    }): Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
    static sendStoryDelivery(order: Order & {
        user?: User | null;
    }, ebookUrl: string): Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
    static sendShippingNotification(order: Order & {
        user?: User | null;
    }, trackingNumber?: string): Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
    static sendPaymentError(order: Order & {
        user?: User | null;
    }): Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
}
//# sourceMappingURL=emailService.d.ts.map
import { NextFunction, Request, Response } from "express";
export declare const paymentController: {
    createPaymentSession: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    confirmPayment: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getPaymentHistory: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getPaymentDetails: (req: Request, res: Response, next: NextFunction) => Promise<void>;
};
//# sourceMappingURL=payment.controller.d.ts.map
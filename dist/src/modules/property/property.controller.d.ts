import { NextFunction, Request, Response } from "express";
export declare const propertyController: {
    createProperty: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getAllProperties: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getAllPropertyCategories: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getAdminProperties: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getSingleProperty: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateProperty: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateRentalRequestStatus: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getLandlordRentalRequests: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteProperty: (req: Request, res: Response, next: NextFunction) => Promise<void>;
};
//# sourceMappingURL=property.controller.d.ts.map
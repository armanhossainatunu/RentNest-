import { NextFunction, Request, Response } from "express";
import { Role } from "../../generated/prisma/enums";
declare const auth: (...requiredRole: Role[]) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export default auth;
//# sourceMappingURL=auth.d.ts.map
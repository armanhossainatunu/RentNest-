import { Role } from "../../../generated/prisma/enums";
declare global {
    namespace Express {
        interface Request {
            user?: {
                name: string;
                email: string;
                userId: string;
                role: Role;
            };
        }
    }
}
export declare const userRouter: import("express-serve-static-core").Router;
//# sourceMappingURL=user.route.d.ts.map
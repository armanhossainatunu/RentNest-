import { LoginPayload } from "./auth.interface";
export declare const authService: {
    loginUser: (payload: LoginPayload) => Promise<{
        user: {
            name: string;
            email: string;
            userId: string;
            role: import("../../../generated/prisma/enums").Role;
        };
        accessToken: string;
        refreshToken: string;
    }>;
};
//# sourceMappingURL=auth.service.d.ts.map
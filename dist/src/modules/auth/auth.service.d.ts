import { LoginPayload } from "./auth.interface";
export declare const authService: {
    loginUser: (payload: LoginPayload) => Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            password: string;
            status: import("../../../generated/prisma/enums").Status;
            role: import("../../../generated/prisma/enums").Role;
            createdAt: Date;
            updatedAt: Date;
        };
        accessToken: string;
        refreshToken: string;
    }>;
};
//# sourceMappingURL=auth.service.d.ts.map
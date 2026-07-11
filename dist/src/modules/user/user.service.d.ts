import { registerPayload } from "./user.interface";
import { Role } from "../../../generated/prisma/enums";
export declare const userService: {
    registerIntoDB: (payload: registerPayload) => Promise<({
        profile: {
            id: string;
            profilePhoto: string | null;
            bio: string | null;
            userId: string;
        } | null;
    } & {
        id: string;
        email: string;
        name: string;
        status: import("../../../generated/prisma/enums").Status;
        role: Role;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    getAllUsers: () => Promise<({
        profile: {
            id: string;
            profilePhoto: string | null;
            bio: string | null;
            userId: string;
        } | null;
    } & {
        id: string;
        email: string;
        name: string;
        status: import("../../../generated/prisma/enums").Status;
        role: Role;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getProfileBD: (useId: string) => Promise<{
        profile: {
            id: string;
            profilePhoto: string | null;
            bio: string | null;
            userId: string;
        } | null;
    } & {
        id: string;
        email: string;
        name: string;
        status: import("../../../generated/prisma/enums").Status;
        role: Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
};
//# sourceMappingURL=user.service.d.ts.map
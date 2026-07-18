import { registerPayload } from "./user.interface";
import { $Enums } from "../../../generated/prisma/browser";
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
        status: $Enums.Status;
        role: $Enums.Role;
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
        status: $Enums.Status;
        role: $Enums.Role;
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
        status: $Enums.Status;
        role: $Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateUserStatus: (userId: string, status: $Enums.Status) => Promise<{
        id: string;
        email: string;
        name: string;
        password: string;
        status: $Enums.Status;
        role: $Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    userDelete: (userId: string) => Promise<null>;
};
//# sourceMappingURL=user.service.d.ts.map
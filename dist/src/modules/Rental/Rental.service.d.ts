import { Role } from "../../../generated/prisma/enums";
export declare const rentalService: {
    createRentalRequest: (tenantId: string, propertyId: string, message?: string) => Promise<{
        payment: null;
        property: {
            id: string;
            status: import("../../../generated/prisma/enums").PropertyStatus;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            thumbnail: string | null;
            description: string;
            price: number;
            location: string;
            bedrooms: number | null;
            bathrooms: number | null;
            balconies: number | null;
            category: import("../../../generated/prisma/enums").PropertyCategory;
            views: number;
            authorId: string;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        propertyId: string;
        message: string | null;
        rentalstatus: import("../../../generated/prisma/enums").RentalRequestStatus;
    }>;
    getRentalRequestDetails: (requestId: string, userId: string, userRole: Role) => Promise<{
        property: {
            author: {
                id: string;
                email: string;
                name: string;
                role: Role;
            };
        } & {
            id: string;
            status: import("../../../generated/prisma/enums").PropertyStatus;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            thumbnail: string | null;
            description: string;
            price: number;
            location: string;
            bedrooms: number | null;
            bathrooms: number | null;
            balconies: number | null;
            category: import("../../../generated/prisma/enums").PropertyCategory;
            views: number;
            authorId: string;
        };
        tenant: {
            id: string;
            email: string;
            name: string;
            role: Role;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        propertyId: string;
        message: string | null;
        rentalstatus: import("../../../generated/prisma/enums").RentalRequestStatus;
    }>;
    getMyRentalRequests: (tenantId: string) => Promise<({
        property: {
            author: {
                id: string;
                email: string;
                name: string;
            };
        } & {
            id: string;
            status: import("../../../generated/prisma/enums").PropertyStatus;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            thumbnail: string | null;
            description: string;
            price: number;
            location: string;
            bedrooms: number | null;
            bathrooms: number | null;
            balconies: number | null;
            category: import("../../../generated/prisma/enums").PropertyCategory;
            views: number;
            authorId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        propertyId: string;
        message: string | null;
        rentalstatus: import("../../../generated/prisma/enums").RentalRequestStatus;
    })[]>;
    getAllRentalRequests: () => Promise<({
        property: {
            author: {
                id: string;
                email: string;
                name: string;
            };
        } & {
            id: string;
            status: import("../../../generated/prisma/enums").PropertyStatus;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            thumbnail: string | null;
            description: string;
            price: number;
            location: string;
            bedrooms: number | null;
            bathrooms: number | null;
            balconies: number | null;
            category: import("../../../generated/prisma/enums").PropertyCategory;
            views: number;
            authorId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        propertyId: string;
        message: string | null;
        rentalstatus: import("../../../generated/prisma/enums").RentalRequestStatus;
    })[]>;
};
//# sourceMappingURL=Rental.service.d.ts.map
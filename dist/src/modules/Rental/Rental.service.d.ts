import { PropertyStatus } from "../../../generated/prisma/client";
export declare const rentalService: {
    createRentalRequest: (tenantId: string, propertyId: string, message?: string) => Promise<{
        property: {
            id: string;
            status: PropertyStatus;
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
        status: import("../../../generated/prisma/enums").RentalRequestStatus;
        createdAt: Date;
        updatedAt: Date;
        message: string | null;
        tenantId: string;
        propertyId: string;
    }>;
};
//# sourceMappingURL=Rental.service.d.ts.map
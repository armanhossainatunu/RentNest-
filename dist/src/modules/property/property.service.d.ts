import { PropertyCategory, PropertyStatus, Role } from "../../../generated/prisma/client";
import { propertyPayload, propertyUpdatePayload } from "./property.interface";
export declare const propertyService: {
    createProperty: (payload: propertyPayload, userId: string) => Promise<{
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
        category: PropertyCategory;
        views: number;
        authorId: string;
    }>;
    getAllProperties: (query: Record<string, any>) => Promise<({
        reviews: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            authorId: string;
            propertyId: string;
            rating: number;
            comment: string;
        }[];
        author: {
            id: string;
            email: string;
            name: string;
            role: Role;
        };
    } & {
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
        category: PropertyCategory;
        views: number;
        authorId: string;
    })[]>;
    getAllPropertyCategories: () => Promise<("APARTMENT" | "HOUSE" | "VILLA" | "DUPLEX" | "STUDIO" | "OFFICE" | "COMMERCIAL" | "SHOP")[]>;
    getAdminProperties: () => Promise<({
        reviews: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            authorId: string;
            propertyId: string;
            rating: number;
            comment: string;
        }[];
        author: {
            id: string;
            email: string;
            name: string;
        };
    } & {
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
        category: PropertyCategory;
        views: number;
        authorId: string;
    })[]>;
    getPropertyById: (propertyId: string) => Promise<({
        reviews: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            authorId: string;
            propertyId: string;
            rating: number;
            comment: string;
        }[];
        author: {
            id: string;
            email: string;
            name: string;
            role: Role;
        };
    } & {
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
        category: PropertyCategory;
        views: number;
        authorId: string;
    }) | null>;
    updateProperty: (propertyId: string, payload: propertyUpdatePayload, authorId: string) => Promise<{
        reviews: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            authorId: string;
            propertyId: string;
            rating: number;
            comment: string;
        }[];
        author: {
            id: string;
            email: string;
            name: string;
        };
    } & {
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
        category: PropertyCategory;
        views: number;
        authorId: string;
    }>;
    deleteProperty: (propertyId: string, authorId: string, userRole: Role) => Promise<{
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
        category: PropertyCategory;
        views: number;
        authorId: string;
    }>;
};
//# sourceMappingURL=property.service.d.ts.map
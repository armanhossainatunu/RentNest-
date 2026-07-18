import { PropertyCategory, PropertyStatus } from "../../../generated/prisma/enums";
export interface propertyPayload {
    title: string;
    thumbnail?: string;
    description: string;
    price: number;
    location: string;
    bedrooms?: number;
    bathrooms?: number;
    balconies?: number;
}
export interface propertyUpdatePayload {
    title?: string;
    thumbnail?: string;
    description?: string;
    price?: number;
    location?: string;
    status?: PropertyStatus;
    category?: PropertyCategory;
    bedrooms?: number;
    bathrooms?: number;
    balconies?: number;
}
//# sourceMappingURL=property.interface.d.ts.map
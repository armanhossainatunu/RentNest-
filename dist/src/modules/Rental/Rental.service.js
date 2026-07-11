import { PropertyStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
const createRentalRequest = async (tenantId, propertyId, message) => {
    if (!tenantId?.trim() || !propertyId?.trim()) {
        throw new Error("Tenant ID and property ID are required");
    }
    const property = await prisma.property.findUnique({
        where: {
            id: propertyId,
        },
    });
    if (!property) {
        throw new Error("Property not found");
    }
    if (property.authorId === tenantId) {
        throw new Error("You cannot request your own property");
    }
    if (property.status !== PropertyStatus.AVAILABLE) {
        throw new Error("Property is not available for rental");
    }
    const existingRequest = await prisma.rentalRequest.findFirst({
        where: {
            tenantId,
            propertyId,
        },
    });
    if (existingRequest) {
        throw new Error("Rental request already submitted");
    }
    return prisma.rentalRequest.create({
        data: {
            tenantId,
            propertyId,
            message,
        },
        include: {
            property: true,
        },
    });
};
export const rentalService = {
    createRentalRequest,
};
//# sourceMappingURL=Rental.service.js.map
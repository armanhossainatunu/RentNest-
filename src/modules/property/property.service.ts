import {
  Prisma,
  PropertyCategory,
  PropertyStatus,
  RentalRequestStatus,
  Role,
  PaymentStatus,
} from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";;
import { propertyPayload, propertyUpdatePayload } from "./property.interface";

// create property
const createProperty = async (payload: propertyPayload, userId: string) => {

  
  const result = await prisma.property.create({
    data: {
      ...payload,
      authorId: userId,
    },
  });

  return result;
};

// get all properties
const getAllProperties = async (query: Record<string, any>) => {
  const { location, category, minPrice, maxPrice } = query;
  const where: Prisma.PropertyWhereInput = {};

  if (location) {
    where.location = {
      contains: location,
      mode: "insensitive",
    };
  }

  if (category) {
    where.category = category;
  }

  if (minPrice || maxPrice) {
    where.price = {};

    if (minPrice) {
      where.price.gte = Number(minPrice);
    }

    if (maxPrice) {
      where.price.lte = Number(maxPrice);
    }
  }

  const result = await prisma.property.findMany({
    where,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      // rentalRequests: {
      //   include: {
      //     tenant: {
      //       select: {
      //         name: true,
      //         email: true,
      //         role: true,
      //       },
      //     },
      //   },
      // },
      
      reviews: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  if (result.length === 0) {
    throw new Error("No data available");
  }
  return result;
};
// get property by id
const getPropertyById = async (propertyId: string) => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    // Check property exists
    const property = await tx.property.findUnique({
      where: {
        id: propertyId,
      },
    });

    if (!property) {
      throw new Error("Property not found");
    }

    // Increment views
    await tx.property.update({
      where: {
        id: propertyId,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    // Return updated property
    return await tx.property.findUnique({
      where: {
        id: propertyId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        reviews: true,
      },
    });
  });

  return transactionResult;
};
// get all property categories
const getAllPropertyCategories = async () => {
  // return Object.values(PropertyCategory);
  const result = await prisma.property.findMany({
    select: {
      category: true,
    },
    distinct: ["category"],
  });

  if (result.length === 0) {
    throw new Error(
    
      "Property categories not found"
    );
  }

  return result.map((item) => item.category);
};
// get admin properties
const getAdminProperties = async () => {
  const result = await prisma.property.findMany({
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      reviews: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};
// update Property
const updateProperty = async (
  propertyId: string,
  payload: propertyUpdatePayload,
  authorId: string,
) => {
  const property = await prisma.property.findUnique({
    where: {
      id: propertyId,
    },
  });
  if (!property) {
    throw new Error("Property not found");
  }

  if (property.authorId !== authorId) {
    throw new Error("You are not authorized to update this property");
  }

  const updateData = {
    ...payload,
    ...(payload.category && {
      category: payload.category.toUpperCase() as PropertyCategory,
    }),
    ...(payload.status && {
      status: payload.status.toUpperCase() as PropertyStatus,
    }),
  };

  return await prisma.property.update({
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      reviews: true,
    },
    where: {
      id: propertyId,
    },
    data: updateData,
  });
};



const updateRentalRequestStatus = async (
  rentalRequestId: string,
  landlordId: string,
  status: RentalRequestStatus,
) => {
  const rentalRequest = await prisma.rentalRequest.findUnique({
    where: {
      id: rentalRequestId,
    },
    include: {
      property: true,
    },
  });

  if (!rentalRequest) {
    throw new Error("Rental request not found");
  }

  if (rentalRequest.property.authorId !== landlordId) {
    throw new Error("You are not authorized to update this rental request");
  }

  if (rentalRequest.rentalstatus !== RentalRequestStatus.PENDING) {
    throw new Error("This rental request has already been processed");
  }

  return await prisma.$transaction(async (tx) => {
    // Update current rental request
    const updatedRequest = await tx.rentalRequest.update({
      where: {
        id: rentalRequestId,
      },
      data: {
        rentalstatus: status,
      },
      include: {
        property: true,
        tenant: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        }
      },
    });

    // If approved
    if (status === RentalRequestStatus.APPROVED) {
      // Make property unavailable
      await tx.property.update({
        where: {
          id: rentalRequest.propertyId,
        },
        data: {
          status: PropertyStatus.UNAVAILABLE,
        },
      });

      // Reject all other pending requests
      await tx.rentalRequest.updateMany({
        where: {
          propertyId: rentalRequest.propertyId,
          id: {
            not: rentalRequestId,
          },
          rentalstatus: RentalRequestStatus.PENDING,
        },
        data: {
          rentalstatus: RentalRequestStatus.REJECTED,
        },
      });

      // Create Payment Record
      await tx.payment.create({
        data: {
          userId: rentalRequest.tenantId,
          rentalRequestId: rentalRequestId,
          amount: rentalRequest.property.price,
          status: PaymentStatus.PENDING,
          meta: {},
        },
      });
    }

    return updatedRequest;
  });
};

// get landlord rental requests
const  getLandlordRentalRequests = async (landlordId: string) => {
  return await prisma.rentalRequest.findMany({
    where: {
      property: {
        authorId: landlordId,
      },
    },
    include: {
      property: true,
      tenant:{
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          reviews: true
        },
      }
    },
  });
}


// delete property
const deleteProperty = async (
  propertyId: string,
  authorId: string,
  userRole: Role,
) => {
  // const property = await prisma.property.findUniqueOrThrow({
  //   where: {
  //     id: propertyId,
  //   },
  // });
  const property = await prisma.property.findUnique({
    where: {
      id: propertyId,
    },
  });
  if (!property) {
    throw new Error("Property not found");
  }
  if (userRole !== Role.ADMIN && property.authorId !== authorId) {
    throw new Error("You are not authorized to delete this property");
  }
  return await prisma.property.delete({
    where: {
      id: propertyId,
    },
  });
};

export const propertyService = {
  createProperty,
  getAllProperties,
  getAllPropertyCategories,
  getAdminProperties,
  getPropertyById,
  updateProperty,
  updateRentalRequestStatus,
  getLandlordRentalRequests,
  deleteProperty,
};

import { Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { paymentService } from "../Payments/payment.service";

const createRentalRequest = async (
  tenantId: string,
  propertyId: string,
  message?: string,
) => {
  const property = await prisma.property.findUnique({
    where: {
      id: propertyId,
    },
  });

  if (!property) {
    throw new Error("Property not found");
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

  const data = await prisma.rentalRequest.create({
    data: {
      tenantId,
      propertyId,
      message,
    },
    include: {
      property: true,
    },
  });
  // const payment = paymentService.initializePayment(request.property, tenantId as any);
 

  return {
    ...data,
    payment: null
  };
};

const getMyRentalRequests = async (tenantId: string) => {
  const requests = await prisma.rentalRequest.findMany({
    where: {
      tenantId,
    },
    include: {
      property: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return requests;
};

const getRentalRequestDetails = async (
  requestId: string,
  userId: string,
  userRole: Role,
) => {
  const request = await prisma.rentalRequest.findUnique({
    where: {
      id: requestId,
    },
    include: {
      tenant: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      payment: true,
      property: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      },
    },
  });

  if (!request) {
    throw new Error("Rental request not found");
  }

  // Admin can view all requests
  if (userRole === Role.ADMIN) {
    return request;
  }

  // Tenant can view only their own request
  if (userRole === Role.TENANT && request.tenantId === userId) {
    return request;
  }

  // Landlord can view requests for their own properties
  if (userRole === Role.LANDLORD && request.property.authorId === userId) {
    return request;
  }

  throw new Error("You are not authorized to view this rental request");
};

const getAllRentalRequests = async () => {
  return prisma.rentalRequest.findMany({
    include: {
      property: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const rentalService = {
  createRentalRequest,
  getRentalRequestDetails,
  getMyRentalRequests,
  getAllRentalRequests,
};

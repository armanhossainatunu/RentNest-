import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { propertyPayload, propertyUpdatePayload } from "./property.interface";

const createProperty = async (payload: propertyPayload, userId: string) => {
  const result = await prisma.property.create({
    data: {
      ...payload,
      authorId: userId,
    },
  });
  return result;
};

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
      reviews: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};
const getPropertyById = async (propertyId: string) => {
  const property = await prisma.property.findUniqueOrThrow({
    where: {
      id: propertyId,
    },
  });
  const viewsUpdated = await prisma.property.update({
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
    where: {
      id: propertyId,
    },
    data: {
      views: property.views + 1,
    },
  });

  return viewsUpdated;
};
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
const updateProperty = async (
  propertyId: string,
  payload: propertyUpdatePayload,
  authorId: string,
) => {
  const property = await prisma.property.findUniqueOrThrow({
    where: {
      id: propertyId,
    },
  });
  if (property.authorId !== authorId) {
    throw new Error("You are not authorized to update this property");
  }
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
    data: {
      ...payload,
    },
  });
};
const deleteProperty = async (propertyId: string, authorId: string) => {
  const property = await prisma.property.findUniqueOrThrow({
    where: {
      id: propertyId,
    },
  });
  if (property.authorId !== authorId) {
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
  getAdminProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
};

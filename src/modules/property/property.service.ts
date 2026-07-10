import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { propertyPayload } from "./property.interface";

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
        },
      },
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
    where: {
      id: propertyId,
    },
    data: {
      views: property.views + 1,
    },
  });

  return viewsUpdated;
};
const getMyProperties = async (authorId: string) => {
  const result = await prisma.property.findMany({
    where: {
      authorId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return result;
};
const updateProperty = () => {};
const deleteProperty = () => {};

export const propertyService = {
  createProperty,
  getAllProperties,
  getMyProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
};

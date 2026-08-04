import { prisma } from "../../lib/prisma";

interface CreateReviewPayload {
  propertyId: string;
  authorId: string;
  rating: number;
  comment: string;
}

const createReview = async ({
  propertyId,
  authorId,
  rating,
  comment,
}: CreateReviewPayload) => {
  // Check property exists
  const property = await prisma.property.findUnique({
    where: {
      id: propertyId,
    },
  });

  if (!property) {
    throw new Error("Property not found");
  }

  // Check completed rental
  const completedRental = await prisma.rentalRequest.findFirst({
    where: {
      propertyId,
      tenantId: authorId,
      rentalstatus: "COMPLETED",
    },
  });

  if (!completedRental) {
    throw new Error(
      "You can only review a property after completing the rental.",
    );
  }

  // Prevent duplicate review
  const existingReview = await prisma.review.findFirst({
    where: {
      propertyId,
      authorId,
    },
  });

  if (existingReview) {
    throw new Error("You have already reviewed this property.");
  }

  // Create review
  return await prisma.review.create({
    data: {
      propertyId,
      authorId,
      rating,
      comment,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
        },
      },
      property: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
};

export const reviewService = {
  createReview,
};

export type { CreateReviewPayload };
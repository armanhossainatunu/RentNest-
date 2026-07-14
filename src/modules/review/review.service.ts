import { PaymentStatus, RentalRequestStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createReview = async (payload: {
  propertyId: string;
  authorId: string;
  rating: number;
  comment: string;
}) => {
  const { propertyId, authorId, rating, comment } = payload;

  // 1. Verify property exists
  const propertyExists = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!propertyExists) {
    throw new Error("Property not found");
  }

  // 2. Verify tenant has a completed and paid rental for this property
  const completedRental = await prisma.rentalRequest.findFirst({
    where: {
      propertyId,
      tenantId: authorId,
      rentalstatus: RentalRequestStatus.APPROVED,
      payment: {
        status: PaymentStatus.PAID,
      },
    },
  });

  if (!completedRental) {
    throw new Error("You can only review a property after completing and paying for the rental");
  }

  // 3. Create the review
  const review = await prisma.review.create({
    data: {
      propertyId,
      authorId,
      rating,
      comment,
    },
  });

  return review;
};

export const reviewService = {
  createReview,
};
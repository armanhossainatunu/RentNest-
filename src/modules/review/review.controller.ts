import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { reviewService } from "./review.service";

const createReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { propertyId, rating, comment } = req.body;
  const authorId = req.user?.userId;

  if (!authorId) {
    throw new Error("User not authenticated");
  }

  if (!propertyId) {
    throw new Error("Property ID is required");
  }

  const numericRating = Number(rating);
  if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
    throw new Error("Rating must be a number between 1 and 5");
  }

  if (!comment || typeof comment !== "string" || comment.trim() === "") {
    throw new Error("Comment is required");
  }

  const result = await reviewService.createReview({
    propertyId,
    authorId,
    rating: numericRating,
    comment: comment.trim(),
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Review created successfully",
    data: result,
  });
});

export const reviewController = {
  createReview,
};
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { rentalService } from "./Rental.service";
import httpStatus from "http-status";
import { Role } from "../../../generated/prisma/enums";

const createRentalRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

    const tenantId = req.user?.userId as string;

    const { propertyId, message } = req.body;

    const result = await rentalService.createRentalRequest(
      tenantId,
      propertyId,
      message,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Rental request submitted successfully",
      data: result,
    });
  },
);


const getMyRentalRequests = catchAsync(
  async (req: Request, res: Response , next: NextFunction) => {
    const tenantId = req.user?.userId as string;

    const result = await rentalService.getMyRentalRequests(tenantId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental requests fetched successfully",
      data: result,
    });
  },
);

const getRentalRequestDetails = catchAsync(
  async (req: Request, res: Response) => {
    const requestId = req.params.id;

    const result = await rentalService.getRentalRequestDetails(
      requestId as string,
      req.user?.userId as string,
      req.user?.role as Role
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental request fetched successfully",
      data: result,
    });
  },
);
const getAllRentalRequests = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await rentalService.getAllRentalRequests();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "All rental requests retrieved successfully",
      data: result,
    });
  },
);

export const rentalController = {
  createRentalRequest,
  getMyRentalRequests,
  getRentalRequestDetails,
  getAllRentalRequests

};
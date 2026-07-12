import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { propertyService } from "./property.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { Role } from "../../../generated/prisma/enums";
import { rentalService } from "../Rental/Rental.service";

const createProperty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.userId;

    const payload = req.body;

    const property = await propertyService.createProperty(
      payload,
      id as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Property created successfully",
      data: { property },
    });
  },
);
const getAllProperties = catchAsync(async (req, res) => {
  const result = await propertyService.getAllProperties(req.query);
 
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Properties retrieved successfully",
    data: result,
  });
});
const getAllPropertyCategories = catchAsync(async (req : Request, res : Response, next : NextFunction) => {
  const result = await propertyService.getAllPropertyCategories();
 
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Property categories retrieved successfully",
    data: result,
  });
})
const getPropertyById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const propertyId = req.params.id;
 
    const property = await propertyService.getPropertyById(
      propertyId as string,
    );
    
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Property fetched successfully",
      data: { property },
    });
  },
);
const getAdminProperties = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const properties = await propertyService.getAdminProperties();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Properties fetched successfully",
      data: { properties },
    });
  },
);
const updateProperty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const propertyId = req.params.id;

    if (!propertyId) {
      throw new Error("Property id is required");
    }

    const payload = req.body;
    const property = await propertyService.updateProperty(
      propertyId as string,
      payload,
      req.user?.userId as string,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Property updated successfully",
      data: { property },
    });
  },
);

const updateRentalRequestStatus = catchAsync(async (req, res) => {
  const rentalRequestId = req.params.id;
  const landlordId = req.user?.userId;

  console.log("Body:", req.body);

  const status = req.body?.status?.toUpperCase();

  if (!status) {
    throw new Error( "Status is required");
  }

  const result = await propertyService.updateRentalRequestStatus(
    rentalRequestId as string,
    landlordId as string,
    status
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: `Rental request ${status.toLowerCase()} successfully`,
    data: result,
  });
});
const deleteProperty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const propertyId = req.params?.id;
    if (!propertyId) {
      throw new Error("Property id is required");
    }
    await propertyService.deleteProperty(
      propertyId as string,
      req.user?.userId as string,
      req.user?.role as Role,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Property deleted successfully",
      data: null,
    });
  },
);

export const propertyController = {
  createProperty,
  getAllProperties,
  getAllPropertyCategories,
  getAdminProperties,
  getSingleProperty: getPropertyById,
  updateProperty,
  updateRentalRequestStatus,
  deleteProperty,
};

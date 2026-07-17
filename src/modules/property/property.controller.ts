import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { propertyService } from "./property.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { PropertyCategory, Role } from "../../../generated/prisma/enums";
import { rentalService } from "../Rental/Rental.service";
// create property
const createProperty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.userId;

    if (!id) {
      throw new Error("User id is required");
    }
    const payload = req.body;

    if (payload.category) {
      payload.category = payload.category.toUpperCase() as PropertyCategory;
    }

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
// get all properties
const getAllProperties = catchAsync(async (req, res) => {
  const result = await propertyService.getAllProperties(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Properties retrieved successfully",
    data: result,
  });
});
// get all property categories
const getAllPropertyCategories = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await propertyService.getAllPropertyCategories();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Property categories retrieved successfully",
      data: result,
    });
  },
);
// get property by id
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
// get admin properties
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
// update property
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
// update rental request
// const updateRentalRequestStatus = catchAsync(async (req : Request, res: Response, next: NextFunction) => {
//   const rentalRequestId = req.params.id;
//   const landlordId = req.user?.userId;

//   const status = req.body?.status?.toUpperCase();

//   if (!status) {
//     throw new Error( "Status is required");
//   }

//   const result = await propertyService.updateRentalRequestStatus(
//     rentalRequestId as string,
//     landlordId as string,
//     status
//   );

//   sendResponse(res, {
//     success: true,
//     statusCode: 200,
//     message: `Rental request ${status.toLowerCase()} successfully`,
//     data: result,
//   });
// });
const updateRentalRequestStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const rentalRequestId = req.params.id;
    const landlordId = req.user?.userId;

    const rentalstatus = req.body?.rentalstatus?.toUpperCase();

    if (!rentalstatus) {
      throw new Error("Rental status is required");
    }

    const result = await propertyService.updateRentalRequestStatus(
      rentalRequestId as string,
      req.user?.userId as string,
      req.user?.role as Role,
      rentalstatus,
    );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: `Rental request ${rentalstatus.toLowerCase()} successfully`,
      data: result,
    });
  },
);

// get landlord rental requests
const getLandlordRentalRequests = catchAsync(async (req, res) => {
  const landlordId = req.user?.userId;
  const result = await propertyService.getLandlordRentalRequests(
    landlordId as string,
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Rental requests retrieved successfully",
    data: result,
  });
});

// delete property
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
  getLandlordRentalRequests,
  deleteProperty,
};

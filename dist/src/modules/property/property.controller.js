import { catchAsync } from "../../utils/catchAsync";
import { propertyService } from "./property.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
const createProperty = catchAsync(async (req, res, next) => {
    const id = req.user?.userId;
    const payload = req.body;
    const property = await propertyService.createProperty(payload, id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Property created successfully",
        data: { property },
    });
});
const getAllProperties = catchAsync(async (req, res) => {
    const result = await propertyService.getAllProperties(req.query);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Properties retrieved successfully",
        data: result,
    });
});
const getAllPropertyCategories = catchAsync(async (req, res, next) => {
    const result = await propertyService.getAllPropertyCategories();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Property categories retrieved successfully",
        data: result,
    });
});
const getPropertyById = catchAsync(async (req, res, next) => {
    const propertyId = req.params.id;
    const property = await propertyService.getPropertyById(propertyId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Property fetched successfully",
        data: { property },
    });
});
const getAdminProperties = catchAsync(async (req, res, next) => {
    const properties = await propertyService.getAdminProperties();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Properties fetched successfully",
        data: { properties },
    });
});
const updateProperty = catchAsync(async (req, res, next) => {
    const propertyId = req.params.id;
    if (!propertyId) {
        throw new Error("Property id is required");
    }
    const payload = req.body;
    const property = await propertyService.updateProperty(propertyId, payload, req.user?.userId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Property updated successfully",
        data: { property },
    });
});
const deleteProperty = catchAsync(async (req, res, next) => {
    const propertyId = req.params?.id;
    if (!propertyId) {
        throw new Error("Property id is required");
    }
    await propertyService.deleteProperty(propertyId, req.user?.userId, req.user?.role);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Property deleted successfully",
        data: null,
    });
});
export const propertyController = {
    createProperty,
    getAllProperties,
    getAllPropertyCategories,
    getAdminProperties,
    getSingleProperty: getPropertyById,
    updateProperty,
    deleteProperty,
};
//# sourceMappingURL=property.controller.js.map
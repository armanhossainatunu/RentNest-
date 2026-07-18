import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { rentalService } from "./Rental.service";
import httpStatus from "http-status";
const createRentalRequest = catchAsync(async (req, res, next) => {
    const tenantId = req.user?.userId;
    const { propertyId, message } = req.body;
    const result = await rentalService.createRentalRequest(tenantId, propertyId, message);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Rental request submitted successfully",
        data: result,
    });
});
const getMyRentalRequests = catchAsync(async (req, res, next) => {
    const tenantId = req.user?.userId;
    const result = await rentalService.getMyRentalRequests(tenantId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Rental requests fetched successfully",
        data: result,
    });
});
const getRentalRequestDetails = catchAsync(async (req, res) => {
    const requestId = req.params.id;
    const result = await rentalService.getRentalRequestDetails(requestId, req.user?.userId, req.user?.role);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Rental request fetched successfully",
        data: result,
    });
});
const getAllRentalRequests = catchAsync(async (req, res, next) => {
    const result = await rentalService.getAllRentalRequests();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "All rental requests retrieved successfully",
        data: result,
    });
});
export const rentalController = {
    createRentalRequest,
    getMyRentalRequests,
    getRentalRequestDetails,
    getAllRentalRequests
};
//# sourceMappingURL=Rental.controller.js.map
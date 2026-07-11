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
export const rentalController = {
    createRentalRequest,
};
//# sourceMappingURL=Rental.controller.js.map
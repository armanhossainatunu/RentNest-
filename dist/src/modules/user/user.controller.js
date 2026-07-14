import httpStatus from "http-status";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
const register = catchAsync(async (req, res, next) => {
    const payload = req.body;
    const user = await userService.registerIntoDB(payload);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User registered successfully",
        data: { user },
    });
});
const getAllUsers = catchAsync(async (req, res, next) => {
    const users = await userService.getAllUsers();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Users fetched successfully",
        data: { users },
    });
});
const getProfile = catchAsync(async (req, res, next) => {
    const profile = await userService.getProfileBD(req.user?.userId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "user Profile get suscessfuly",
        data: {
            profile,
        },
    });
});
const updateUserStatus = catchAsync(async (req, res, next) => {
    const userId = req.params.id;
    const status = req.body.status;
    const user = await userService.updateUserStatus(userId, status);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User status updated successfully",
        data: { user },
    });
});
const userDelete = catchAsync(async (req, res, next) => {
    const userId = req.params.id;
    const user = await userService.userDelete(userId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User deleted successfully",
        data: { user },
    });
});
export const userController = {
    register,
    getAllUsers,
    getProfile,
    updateUserStatus,
    userDelete
};
//# sourceMappingURL=user.controller.js.map
import httpStatus from "http-status";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";


const register = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const user = await userService.registerIntoDB(payload);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User registered successfully",
      data: { user },
    });
  },
);
const getAllUsers = catchAsync(async (req : Request, res : Response, next : NextFunction) => {
  const users = await userService.getAllUsers();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Users fetched successfully",
    data: { users },
  });
})
const getProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const profile = await userService.getProfileBD(req.user?.userId as string);
    console.log(profile);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "user Profile get suscessfuly",
      data: {
        profile,
      },
    });
  },
);

const updateUserStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const status = req.body.status;
    const user = await userService.updateUserStatus(userId as string, status);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User status updated successfully",
      data: { user },
    });
  },
)
export const userController = {
  register,
  getAllUsers,
  getProfile,
  updateUserStatus
};

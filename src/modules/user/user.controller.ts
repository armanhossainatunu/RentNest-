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

export const userController = {
  register,
  getProfile,
};

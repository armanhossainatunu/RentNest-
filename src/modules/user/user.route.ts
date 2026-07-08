import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import { jwtUtils } from "../../utils/jwt";
import { config } from "../../config";
import { Role } from "../../../generated/prisma/enums";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";

const router = Router();

declare global {
  namespace Express {
    interface Request {
      user?: {
        name: string;
        email: string;
        userId: string;
        role: Role;
      };
    }
  }
}

router.post("/register", userController.registerUser);
const auth = () => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token =
      req.cookies.accessToken || req.headers.authorization?.startsWith("Bearer")
        ? req.headers.authorization?.split(" ")[1]
        : req.headers.authorization;

    if (!token) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        statusCode: httpStatus.UNAUTHORIZED,
        message: "User is not authorized to access this route",
      });
    }
    const verifiedToken = jwtUtils.verifyToken(token, config.jwt_secret_key);
  });
};

router.get(
  "/me",
  (req: Request, res: Response, next: NextFunction) => {
    // console.log(req.cookies,"cookis gte user")
    const { accessToken } = req.cookies;
    // console.log(accessToken);
    const verifiedToken = jwtUtils.verifyToken(
      accessToken,
      config.jwt_secret_key,
    );

    if (typeof verifiedToken === "string") {
      throw new Error(verifiedToken);
    }
    const { name, email, userId, role } = verifiedToken;
    const requestedRole = [Role.ADMIN, Role.LANDLORD, Role.TENANT];
    if (!requestedRole.includes(role)) {
      return res.status(httpStatus.FORBIDDEN).json({
        success: false,
        statusCode: httpStatus.FORBIDDEN,
        message: "User is not authorized to access this route",
      });
    }
    req.user = { name, email, userId, role };
    next();
  },
  userController.getProfile,
);

export const userRouter = router;

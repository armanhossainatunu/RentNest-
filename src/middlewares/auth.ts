import { NextFunction, Request, Response } from "express";
import { Role } from "../../generated/prisma/enums";
import { catchAsync } from "../utils/catchAsync";
import httpStatus from "http-status";
import { jwtUtils } from "../utils/jwt";
import { config } from "../config";
import { prisma } from "../lib/prisma";
import { JwtPayload } from "jsonwebtoken";

const auth = (...requiredRole: Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken
      ? req.cookies.accessToken
      : req.headers.authorization?.startsWith("Bearer")
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

    if (!verifiedToken.success) {
      throw new Error(verifiedToken.error);
    }

    const { name, email, userId, role } = verifiedToken.data as JwtPayload;

    if (requiredRole.length && !requiredRole.includes(role)) {
      throw new Error("User is not authorized to access this route");
    }
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
        name,
        email,
        role,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }
    if (user.status === "BANNED") {
      throw new Error("User is inactive");
    }
    req.user = { name, email, userId, role };
    next();
   
  });
};

export default auth;
import { catchAsync } from "../utils/catchAsync";
import httpStatus from "http-status";
import { jwtUtils } from "../utils/jwt";
import { config } from "../config";
import { prisma } from "../lib/prisma";
const auth = (...requiredRole) => {
    return catchAsync(async (req, res, next) => {
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
        const { name, email, userId, role } = verifiedToken.data;
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
        if (user.status === "INACTIVE") {
            throw new Error("User is inactive");
        }
        req.user = { name, email, userId, role };
        next();
    });
};
export default auth;
//# sourceMappingURL=auth.js.map
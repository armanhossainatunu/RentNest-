import { config } from "../../config";
import { prisma } from "../../lib/prisma";
import { jwtUtils } from "../../utils/jwt";
import bcrypt from "bcrypt";
const loginUser = async (payload) => {
    const { email, password } = payload;
    const user = await prisma.user.findUniqueOrThrow({
        where: { email },
    });
    if (user.status === "INACTIVE") {
        throw new Error("User is inactive");
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
        throw new Error("password is Incorrect");
    }
    const jwtPaylode = {
        name: user.name,
        userId: user.id,
        email: user.email,
        role: user.role,
    };
    //access token
    const accessToken = jwtUtils.createToken(jwtPaylode, config.jwt_secret_key, {
        expiresIn: config.jwt_expires_in,
    });
    // refresh token
    const refreshToken = jwtUtils.createToken(jwtPaylode, config.jwt_refresh_secret_key, {
        expiresIn: config.jwt_refresh_expires_in,
    });
    return {
        user,
        accessToken,
        refreshToken,
    };
};
export const authService = {
    loginUser
};
//# sourceMappingURL=auth.service.js.map
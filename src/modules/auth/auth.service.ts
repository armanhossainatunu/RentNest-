import { config } from "../../config";
import { prisma } from "../../lib/prisma";
import { jwtUtils } from "../../utils/jwt";
import { LoginPayload } from "./auth.interface";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";

const loginUser = async (payload: LoginPayload) => {
  const { email, password } = payload;

  const emailLowerCase = email.toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email : emailLowerCase },

    include: {
      profile: true,
    },
   
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new Error("Password is incorrect");
  }

  const jwtPayload = {
    name: user.name,
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(jwtPayload, config.jwt_secret_key, {
    expiresIn: config.jwt_expires_in,
  } as SignOptions);

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret_key,
    {
      expiresIn: config.jwt_refresh_expires_in,
    } as SignOptions,
  );

  return {
    user:{
      name: user.name,
      email: user.email,
      userId: user.id,
      role: user.role
    },
    accessToken,
    refreshToken,
  };
};

export const authService = {
  loginUser,
};

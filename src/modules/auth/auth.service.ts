import { config } from "../../config";
import { prisma } from "../../lib/prisma";
import { LoginPayload } from "./auth.interface";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const loginUser = async (payload: LoginPayload) => {
  const { email, password } = payload;
  const user = await prisma.user.findUniqueOrThrow({
    where: { email },
  });

  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    throw new Error("password is Incorrect");
  }

//   access token
const accessToken = jwt.sign({
  userId: user.id,
  email: user.email,
  role: user.role
},"access_token", {
  expiresIn: "1d",
});
// refresh token
const refreshToken = jwt.sign({
  userId: user.id,
  email: user.email,
  role: user.role
},"refresh_token", {
  expiresIn: "7d"
});
  return {
    accessToken,
    refreshToken,
  };
};

export const authService = {
  loginUser,
};

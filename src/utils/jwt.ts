import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";


const createToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn: SignOptions,
) => {
  const token = jwt.sign(payload, secret, expiresIn);
  return token;
};

const verifyToken = (token: string, secret: string) => {
  try {
    const verifiedToken = jwt.verify(token, secret);
    return verifiedToken;
  } catch (error: any) {
    console.log("Token verifiy faild:", error);
    throw new Error(error.message);
  }
};

export const jwtUtils = {
  createToken,
  verifyToken
};

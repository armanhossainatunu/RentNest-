import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import { config } from "../../config";
import { registerUserPayload } from "./user.interface";

const registerUserIntoDB = async (payload: registerUserPayload) => {
  const { name, email, password, profilePhoto, role } = payload;
  const isUserExists = await prisma.user.findUnique({
    where: { email },
  });
  if (isUserExists) {
    throw new Error("User already exists");
  }
  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );
  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
      profile: {
        create: {
          profilePhoto,
        },
      },
    },
  });
 
  const user = await prisma.user.findUnique({
    where: {
      id: createdUser.id,
      email: createdUser.email,
    },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });
  return user;
};

const getProfileBD = async (useId: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {id: useId},
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });
  return user;
};

export const userService = {
  registerUserIntoDB,
  getProfileBD,
};

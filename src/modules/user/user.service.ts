import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import { config } from "../../config";
import { registerPayload } from "./user.interface";
import { Role, Status } from "../../../generated/prisma/enums";
import { $Enums } from "../../../generated/prisma/browser";

const registerIntoDB = async (payload: registerPayload) => {
  const { name, email, password, profilePhoto } = payload;
  const role = payload.role?.toUpperCase() as Role;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format");
  }
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
const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    include: {
      profile: true,
    },
    omit: {
      password: true,
    },
  });
  return users;
};
const getProfileBD = async (useId: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: useId },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });
  return user;
};
const updateUserStatus = async (userId: string, status: $Enums.Status) => {
  const formattedStatus = status.toUpperCase() as Status;
  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      status: formattedStatus,
    },
  });

  return user;
};

export const userService = {
  registerIntoDB,
  getAllUsers,
  getProfileBD,
  updateUserStatus,
};

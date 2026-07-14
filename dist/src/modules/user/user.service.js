import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import { config } from "../../config";
const registerIntoDB = async (payload) => {
    const { name, email, password, profilePhoto } = payload;
    const emailLowerCase = email.toLowerCase();
    const role = payload.role?.toUpperCase();
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
    const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));
    const createdUser = await prisma.user.create({
        data: {
            name,
            email: emailLowerCase,
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
const getProfileBD = async (useId) => {
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
const updateUserStatus = async (userId, status) => {
    const formattedStatus = status.toUpperCase();
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
const userDelete = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new Error("User not found");
    }
    await prisma.$transaction(async (tx) => {
        await tx.profile.deleteMany({
            where: {
                userId,
            },
        });
        await tx.user.delete({
            where: {
                id: userId,
            },
        });
    });
    return null;
};
export const userService = {
    registerIntoDB,
    getAllUsers,
    getProfileBD,
    updateUserStatus,
    userDelete,
};
//# sourceMappingURL=user.service.js.map
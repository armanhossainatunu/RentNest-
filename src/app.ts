import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import { prisma } from "./lib/prisma";
import bcrypt from "bcrypt";
import { config } from "./config";
import httpStatus from "http-status";

const app: Application = express();

app.use(
  cors({
    origin: "http://localhost:5000",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.post("/api/auth/register", async (req: Request, res: Response) => {
  const { name, email, password, profilePhoto, role } = req.body;
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
      
    },
  });
  await prisma.profile.create({
    data: {
      userId: createdUser.id,
     profilePhoto,
    },
  });
  const user = await prisma.user.findUnique({
    where: {
      id: createdUser.id,
      email: createdUser.email,
    },
    include: {
      profile: true,
    },
  });
  res
    .status(201)
    .json({ 
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User registered successfully",
      data:{
        user,
      } });
});

export default app;

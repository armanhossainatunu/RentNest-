import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import { prisma } from "./lib/prisma";
import bcrypt from "bcrypt";
import { config } from "./config";
import httpStatus from "http-status";
import { userRouter } from "./modules/user/user.route";

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

app.use("/api/auth", userRouter);

export default app;

import { Router } from "express";
import { paymentController } from "./payment.controller";
import auth from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const route = Router();

route.post("/create", auth(Role.TENANT), paymentController.initiatePayment);
route.post("/success", paymentController.success);
route.post("/fail", paymentController.fail);
route.post("/cancel", paymentController.cancel);

export const paymentRouter = route;

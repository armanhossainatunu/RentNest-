import { Router } from "express";
import { paymentController } from "./payment.controller";
import auth from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
const route = Router();
// Create a payment intent/session for an approved rental
route.post("/create", auth(Role.TENANT), paymentController.createPaymentSession);
// Confirm/verify payment (webhook or callback)
route.post("/confirm", paymentController.confirmPayment);
// Get user's payment history
route.get("/", auth(Role.TENANT, Role.LANDLORD, Role.ADMIN), paymentController.getPaymentHistory);
// Get payment details
route.get("/:id", auth(Role.TENANT, Role.LANDLORD, Role.ADMIN), paymentController.getPaymentDetails);
export const paymentRouter = route;
//# sourceMappingURL=payment.route.js.map
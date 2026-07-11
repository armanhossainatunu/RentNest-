import { Router } from "express";
import { rentalController } from "./Rental.controller";
import auth from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router()

router.post("/rentals", auth(Role.TENANT), rentalController.createRentalRequest)
router.get("/rentals", auth(Role.TENANT), rentalController.getMyRentalRequests)
router.get("/rentals/:id",auth(Role.LANDLORD, Role.ADMIN, Role.TENANT), rentalController.getRentalRequestDetails)

export const rentalRouter = router
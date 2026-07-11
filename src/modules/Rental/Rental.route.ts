import { Router } from "express";
import { rentalController } from "./Rental.controller";
import auth from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

// Tenant create rental request
router.post(
  "/rentals",
  auth(Role.TENANT),
  rentalController.createRentalRequest,
);

// Tenant own rental requests
router.get(
  "/rentals/my-requests",
  auth(Role.TENANT),
  rentalController.getMyRentalRequests,
);

// Rental request details
router.get(
  "/rentals/:id",
  auth(Role.LANDLORD, Role.ADMIN, Role.TENANT),
  rentalController.getRentalRequestDetails,
);

// Admin all rental requests
router.get(
  "/rentals",
  auth(Role.ADMIN),
  rentalController.getAllRentalRequests,
);

export const rentalRouter = router;
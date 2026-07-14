import { Router } from "express";
import { reviewController } from "./review.controller";
import auth from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

// Create review (after completed rental)
router.post("/reviews", auth(Role.TENANT), reviewController.createReview);

export const reviewRouter = router;
import { Router } from "express";
import { reviewController } from "./review.controller";
const router = Router();
router.post("/create", reviewController.createReview);
export const reviewRouter = router;
//# sourceMappingURL=review.route.js.map
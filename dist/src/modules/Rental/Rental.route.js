import { Router } from "express";
import { rentalController } from "./Rental.controller";
const router = Router();
router.post("/rentals", rentalController.createRentalRequest);
export const rentalRouter = router;
//# sourceMappingURL=Rental.route.js.map
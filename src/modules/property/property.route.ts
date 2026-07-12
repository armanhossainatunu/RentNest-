import { Router } from "express";
import { propertyController } from "./property.controller";
import auth from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

// create property
router.post(
  "/properties",
  auth(Role.LANDLORD),
  propertyController.createProperty,
);
// get all properties
router.get("/properties", propertyController.getAllProperties);
// get all property categories
router.get("/categories", propertyController.getAllPropertyCategories);
// get admin properties
router.get(
  "/admin/properties",
  auth(Role.ADMIN),
  propertyController.getAdminProperties,
);
// get single property
router.get("/properties/:id", propertyController.getSingleProperty);
// update property
router.put(
  "/properties/:id",
  auth(Role.LANDLORD, Role.ADMIN),
  propertyController.updateProperty,
);
// delete property
router.delete(
  "/properties/:id",
  auth(Role.LANDLORD, Role.ADMIN),
  propertyController.deleteProperty,
);
// Rental requests
router.put(
  "/requests/:id",
  auth(Role.LANDLORD, Role.ADMIN),
  propertyController.updateRentalRequestStatus,
);
export const propertyRouter = router;

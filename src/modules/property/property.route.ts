import { Router } from "express";
import { propertyController } from "./property.controller";
import auth from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();
router.post(
  "/properties",
  auth(Role.LANDLORD),
  propertyController.createProperty
);
router.get(
  "/properties",
  propertyController.getAllProperties
);
router.get(
 "/admin/properties", auth(Role.ADMIN),
  propertyController.getAdminProperties
)
router.get(
  "/properties/:id",
  propertyController.getSingleProperty
);

router.put(
  "/properties/:id",
  auth(Role.LANDLORD),
  propertyController.updateProperty
);
router.delete(
  "/properties/:id",
  auth(Role.LANDLORD),
  propertyController.deleteProperty
);
export const propertyRouter = router;
 
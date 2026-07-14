import { Router } from "express";
import { userController } from "./user.controller";
import { Role } from "../../../generated/prisma/enums";
import auth from "../../middlewares/auth";
const router = Router();
router.post("/register", userController.register);
router.get("/users", auth(Role.ADMIN), userController.getAllUsers);
router.get("/me", auth(Role.ADMIN, Role.LANDLORD, Role.TENANT), userController.getProfile);
router.put("/users/:id", auth(Role.ADMIN), userController.updateUserStatus);
router.delete("/users/:id", auth(Role.ADMIN), userController.userDelete);
export const userRouter = router;
//# sourceMappingURL=user.route.js.map
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import { userRouter } from "./modules/user/user.route";
import { authRoute } from "./modules/auth/auth.route";
import { propertyRouter } from "./modules/property/property.route";
import { reviewRouter } from "./modules/review/review.route";
import { rentalRouter } from "./modules/Rental/Rental.route";
const app = express();
app.use(cors({
    origin: "http://localhost:5000",
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.get("/", (req, res) => {
    res.send("Hello, World!");
});
app.use("/api/auth", userRouter);
app.use("/api/admin", userRouter);
app.use("/api/auth/", authRoute);
app.use("/api/landlord", propertyRouter);
app.use("/api/", propertyRouter, rentalRouter);
app.use("/api/", reviewRouter);
export default app;
//# sourceMappingURL=app.js.map
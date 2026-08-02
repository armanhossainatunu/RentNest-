import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import { userRouter } from "./modules/user/user.route";
import { authRoute } from "./modules/auth/auth.route";
import { propertyRouter } from "./modules/property/property.route";
import { reviewRouter } from "./modules/review/review.route";
import { paymentRouter } from "./modules/Payments/payment.route";
import { rentalRouter } from "./modules/Rental/Rental.route";
import globalErrorHandling from "./middlewares/globalErrorHandling";

const app: Application = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
    ],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send({
    success: true,
    statusCode: 200,
    message: "welcome to RentNest Api Server 🚀",
  });
});

app.use("/api/auth", userRouter);
app.use("/api/admin", userRouter);

// app.use("/api/admin", userRouter);

app.use("/api/auth/", authRoute);
app.use("/api/landlord", propertyRouter);
app.use("/api/", propertyRouter);
app.use("/api", rentalRouter);
app.use("/api/", reviewRouter);
app.use("/api/payments", paymentRouter);
// Global Error Handling Middleware
app.use(globalErrorHandling);
export default app;

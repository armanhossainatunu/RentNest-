import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { initializePayment } from "./payment.service";

const initiatePayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const propertyId = req.body?.propertyId as string;

    if (!propertyId) {
      throw new Error("Property id is required");
    }

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new Error("Property not found");
    }

    const userId = req.user?.userId;
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error("User not found");
    }

    const initResp = await initializePayment(property, user as any);

    const gatewayUrl =
      initResp?.GatewayPageURL || initResp?.gateway_url || initResp?.GatewayURL;
    if (!gatewayUrl) {
      sendResponse(res, {
        success: false,
        statusCode: httpStatus.BAD_REQUEST,
        message: "Gateway URL not returned by payment provider",
        data: initResp,
      });
      return;
    }

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Please proceed to Paymen",
      data: { gatewayUrl },
    });
  },
);

const success = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  console.log("SSLCommerz success payload:", payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment success received",
    data: payload,
  });
});

const fail = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  console.log("SSLCommerz fail payload:", payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment fail received",
    data: payload,
  });
});

const cancel = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  console.log("SSLCommerz cancel payload:", payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment cancel received",
    data: payload,
  });
});

export const paymentController = {
  initiatePayment,
  success,
  fail,
  cancel,
};

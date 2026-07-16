import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { paymentService } from "./payment.service";
import { PaymentStatus, RentalRequestStatus, Role } from "../../../generated/prisma/client";

// POST /api/payments/create
const createPaymentSession = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { rentalRequestId } = req.body;

    if (!rentalRequestId) {
      throw new Error("Rental request ID is required");
    }

    const rentalRequest = await prisma.rentalRequest.findUnique({
      where: { id: rentalRequestId },
      include: {
        property: true,
        tenant: true,
      },
    });

    if (!rentalRequest) {
      throw new Error("Rental request not found");
    }

    const userId = req.user?.userId;
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Verify authorized tenant
    if (rentalRequest.tenantId !== userId) {
      throw new Error("You are not authorized to make payment for this rental request");
    }

    // Verify rental request status is APPROVED
    if (rentalRequest.rentalstatus !== RentalRequestStatus.APPROVED) {
      throw new Error("Payment can only be initiated for approved rental requests");
    }

    // Check or create payment record
    let payment = await prisma.payment.findUnique({
      where: {  rentalRequestId },
    });

    if (payment && payment.status === PaymentStatus.PAID) {
      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "This rental request has already been paid for",
        data: payment,
      });
      return;
    }

    const transactionId = `TXN_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    if (!payment) {
      payment = await prisma.payment.create({
        data: {
          userId: rentalRequest.tenantId,
          rentalRequestId: rentalRequestId,
          amount: rentalRequest.property.price,
          status: PaymentStatus.PENDING,
          transactionId,
          meta: {},
        },
      });
    } else {
      payment = await prisma.payment.update({
        where: { id: payment.id },
        data: {
          transactionId,
          status: PaymentStatus.PENDING,
        },
      });
    }

    const initResp = await paymentService.initializePayment(
      rentalRequest.property,
      rentalRequest.tenant,
      transactionId
    );

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

    // Update payment meta information with initialization response
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        meta: initResp || {},
      },
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Please proceed to Payment",
      data: { gatewayUrl },
    });
  }
);

// POST /api/payments/confirm
const confirmPayment = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const { tran_id, status } = payload || {};

  console.log("SSLCommerz callback received. Status:", status, "Transaction ID:", tran_id);

  if (!tran_id) {
    throw new Error("Transaction ID is missing in callback payload");
  }

  const payment = await prisma.payment.findUnique({
    where: { transactionId: tran_id },
  });

  if (!payment) {
    throw new Error("Payment record not found for transaction ID: " + tran_id);
  }

  let finalStatus: PaymentStatus = PaymentStatus.PENDING;

  if (status === "VALID" || status === "VALIDATED") {
    finalStatus = PaymentStatus.PAID;
  } else if (status === "FAILED") {
    finalStatus = PaymentStatus.FAILED;
  } else if (status === "CANCELLED") {
    finalStatus = PaymentStatus.CANCELLED;
  }

  const updatedPayment = await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: finalStatus,
      meta: payload || {},
    },
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: `Payment status suscessfully updated to ${finalStatus}`,
    data: updatedPayment,
  });
});

// GET /api/payments
const getPaymentHistory = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const role = req.user?.role;

  if (!userId) {
    throw new Error("User not authenticated");
  }

  let result;

  const paymentSelect = {
    id: true,
    userId: true,
    rentalRequestId: true,
    amount: true,
    status: true,
    transactionId: true,
    createdAt: true,
    updatedAt: true,
    

    rentalRequest: {
      include: {
        property: true,
      },
    },

    // user: {
    //   select: {
    //     id: true,
    //     name: true,
    //     email: true,
    //     role: true,
    //   },
    // },
  };

  if (role === Role.ADMIN) {
    result = await prisma.payment.findMany({
      select: paymentSelect,
      orderBy: {
        createdAt: "desc",
      },
    });
  } else if (role === Role.LANDLORD) {
    result = await prisma.payment.findMany({
      where: {
        rentalRequest: {
          property: {
            authorId: userId,
          },
        },
      },
      select: paymentSelect,
      orderBy: {
        createdAt: "desc",
      },
    });
  } else {
    // TENANT
    result = await prisma.payment.findMany({
      where: {
        userId,
      },
      select: paymentSelect,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment history fetched successfully",
    data: result,
  });
});

// GET /api/payments/:id
const getPaymentDetails = catchAsync(async (req: Request, res: Response) => {
  const paymentId = req.params.id as string;
  const userId = req.user?.userId;
  const role = req.user?.role;

  if (!userId) {
    throw new Error("User not authenticated");
  }

  let payment = await prisma.payment.findUnique({
    where: { id: paymentId },
 
    include: {
      rentalRequest: {
        include: {
          property: true,
        },
      },
      // user: {
      //   select: {
      //     id: true,
      //     name: true,
      //     email: true,
      //     role: true,
      //   },
      // },
    },
  });
   const paymentDetails =(payment?.amount, payment?.status, payment?.transactionId);
  if (!payment) {
    throw new Error("Payment record not found");
  }

  // Check authorization
  const isOwner = payment.userId === userId;
  const isLandlordOfProperty = payment.rentalRequest.property.authorId === userId;
  const isAdmin = role === Role.ADMIN;

  if (!isOwner && !isLandlordOfProperty && !isAdmin) {
    throw new Error("You are not authorized to view this payment's details");
  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment details fetched successfully",
    data: payment,
  });
});

export const paymentController = {
  createPaymentSession,
  confirmPayment,
  getPaymentHistory,
  getPaymentDetails,
};

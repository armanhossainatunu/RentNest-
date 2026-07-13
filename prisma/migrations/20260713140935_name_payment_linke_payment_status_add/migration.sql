-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED');

-- AlterTable
ALTER TABLE "rentalRequests" ADD COLUMN     "paymentLink" TEXT,
ADD COLUMN     "paymentStatus" "PaymentStatus";

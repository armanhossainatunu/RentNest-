/*
  Warnings:

  - You are about to drop the column `status` on the `rentalRequests` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "rentalRequests" DROP COLUMN "status",
ADD COLUMN     "rentalstatus" "RentalRequestStatus" NOT NULL DEFAULT 'PENDING';

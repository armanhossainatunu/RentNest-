/*
  Warnings:

  - You are about to drop the column `profileProto` on the `profiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "profileProto",
ADD COLUMN     "profilePhoto" TEXT;

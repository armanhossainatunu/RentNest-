/*
  Warnings:

  - You are about to alter the column `title` on the `properties` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- CreateEnum
CREATE TYPE "PropertyCategory" AS ENUM ('APARTMENT', 'HOUSE', 'VILLA', 'DUPLEX', 'STUDIO', 'OFFICE', 'COMMERCIAL', 'SHOP');

-- AlterTable
ALTER TABLE "properties" ADD COLUMN     "category" "PropertyCategory" NOT NULL DEFAULT 'APARTMENT',
ALTER COLUMN "title" SET DATA TYPE VARCHAR(255);

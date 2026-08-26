/*
  Warnings:

  - You are about to drop the column `tinyProductId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `TinyIntegration` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "tinyProductId",
ADD COLUMN     "tinySku" TEXT;

-- DropTable
DROP TABLE "TinyIntegration";

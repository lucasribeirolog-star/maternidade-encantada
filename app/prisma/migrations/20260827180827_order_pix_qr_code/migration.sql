-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "mpPixExpiresAt" TIMESTAMP(3),
ADD COLUMN     "mpPixQrCode" TEXT,
ADD COLUMN     "mpPixQrCodeBase64" TEXT;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "tinyOrderId" INTEGER,
ADD COLUMN     "tinyOrderNumber" TEXT,
ADD COLUMN     "tinySyncError" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "tinyProductId" INTEGER;

-- CreateTable
CREATE TABLE "TinyIntegration" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "vendedorId" INTEGER,
    "depositoId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TinyIntegration_pkey" PRIMARY KEY ("id")
);

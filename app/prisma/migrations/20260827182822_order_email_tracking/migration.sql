-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "confirmationEmailSentAt" TIMESTAMP(3),
ADD COLUMN     "trackingEmailSentAt" TIMESTAMP(3);

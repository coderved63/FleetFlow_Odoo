/*
  Warnings:

  - The `type` column on the `Vehicle` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "MaintenanceLog" ADD COLUMN     "description" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Pending';

-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "acquisitionCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'Truck';

-- CreateTable
CREATE TABLE "Expense" (
    "id" SERIAL NOT NULL,
    "tripId" TEXT NOT NULL,
    "driver" TEXT NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,
    "fuelCost" DOUBLE PRECISION NOT NULL,
    "miscExpense" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Expense_tripId_key" ON "Expense"("tripId");

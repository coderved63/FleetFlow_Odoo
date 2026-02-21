/*
  Warnings:

  - A unique constraint covering the columns `[driverId]` on the table `License` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tripId]` on the table `Trip` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `driverId` to the `License` table without a default value. This is not possible if the table is not empty.
  - Added the required column `destination` to the `Trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estimatedDistance` to the `Trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estimatedFuelPricePerKm` to the `Trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estimatedTripPrice` to the `Trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `origin` to the `Trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tripId` to the `Trip` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "License" ADD COLUMN     "driverId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Trip" ADD COLUMN     "actualDistance" DOUBLE PRECISION,
ADD COLUMN     "actualFuelCost" DOUBLE PRECISION,
ADD COLUMN     "actualTripPrice" DOUBLE PRECISION,
ADD COLUMN     "destination" TEXT NOT NULL,
ADD COLUMN     "estimatedDistance" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "estimatedFuelPricePerKm" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "estimatedTripPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "origin" TEXT NOT NULL,
ADD COLUMN     "tripId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "type" "VehicleType" NOT NULL DEFAULT 'TRUCK';

-- CreateIndex
CREATE UNIQUE INDEX "License_driverId_key" ON "License"("driverId");

-- CreateIndex
CREATE UNIQUE INDEX "Trip_tripId_key" ON "Trip"("tripId");

-- AddForeignKey
ALTER TABLE "License" ADD CONSTRAINT "License_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `usesrId` on the `UsageMetric` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `UsageMetric` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `UsageMetric` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UsageMetric" DROP CONSTRAINT "UsageMetric_usesrId_fkey";

-- AlterTable
ALTER TABLE "UsageMetric" DROP COLUMN "usesrId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UsageMetric_userId_key" ON "UsageMetric"("userId");

-- AddForeignKey
ALTER TABLE "UsageMetric" ADD CONSTRAINT "UsageMetric_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

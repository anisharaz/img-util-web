-- CreateTable
CREATE TABLE "UsageMetric" (
    "id" TEXT NOT NULL,
    "usesrId" TEXT NOT NULL,
    "totalStorageUsed" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UsageMetric_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UsageMetric" ADD CONSTRAINT "UsageMetric_usesrId_fkey" FOREIGN KEY ("usesrId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

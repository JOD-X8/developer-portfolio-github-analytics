-- CreateTable
CREATE TABLE "TrackedProfile" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "canonicalName" TEXT,
    "profileUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastSnapshotAt" TIMESTAMP(3),

    CONSTRAINT "TrackedProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatsSnapshot" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "snapshotDate" DATE NOT NULL,
    "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publicRepoCount" INTEGER NOT NULL DEFAULT 0,
    "followers" INTEGER NOT NULL DEFAULT 0,
    "following" INTEGER NOT NULL DEFAULT 0,
    "totalStars" INTEGER NOT NULL DEFAULT 0,
    "totalForks" INTEGER NOT NULL DEFAULT 0,
    "languageBreakdown" JSONB,

    CONSTRAINT "StatsSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TrackedProfile_username_key" ON "TrackedProfile"("username");

-- CreateIndex
CREATE INDEX "TrackedProfile_username_idx" ON "TrackedProfile"("username");

-- CreateIndex
CREATE INDEX "StatsSnapshot_profileId_snapshotDate_idx" ON "StatsSnapshot"("profileId", "snapshotDate");

-- CreateIndex
CREATE UNIQUE INDEX "StatsSnapshot_profileId_snapshotDate_key" ON "StatsSnapshot"("profileId", "snapshotDate");

-- AddForeignKey
ALTER TABLE "StatsSnapshot" ADD CONSTRAINT "StatsSnapshot_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "TrackedProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `activityOptionId` on the `UserEntry` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `UserEntry` table. All the data in the column will be lost.
  - You are about to drop the column `mood` on the `UserEntry` table. All the data in the column will be lost.
  - You are about to drop the column `prompt` on the `UserEntry` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ActivityOption" DROP CONSTRAINT "ActivityOption_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "UserEntry" DROP CONSTRAINT "UserEntry_activityOptionId_fkey";

-- AlterTable
ALTER TABLE "UserEntry" DROP COLUMN "activityOptionId",
DROP COLUMN "content",
DROP COLUMN "mood",
DROP COLUMN "prompt";

-- CreateTable
CREATE TABLE "Mood" (
    "id" SERIAL NOT NULL,
    "mood" TEXT NOT NULL,
    "userEntryId" INTEGER NOT NULL,

    CONSTRAINT "Mood_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Journal" (
    "id" SERIAL NOT NULL,
    "prompt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userEntryId" INTEGER NOT NULL,

    CONSTRAINT "Journal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserActivity" (
    "id" SERIAL NOT NULL,
    "userEntryId" INTEGER NOT NULL,
    "activityOptionId" INTEGER NOT NULL,

    CONSTRAINT "UserActivity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Mood_id_key" ON "Mood"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Journal_id_key" ON "Journal"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UserActivity_id_key" ON "UserActivity"("id");

-- AddForeignKey
ALTER TABLE "Mood" ADD CONSTRAINT "Mood_userEntryId_fkey" FOREIGN KEY ("userEntryId") REFERENCES "UserEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Journal" ADD CONSTRAINT "Journal_userEntryId_fkey" FOREIGN KEY ("userEntryId") REFERENCES "UserEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityOption" ADD CONSTRAINT "ActivityOption_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ActivityCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserActivity" ADD CONSTRAINT "UserActivity_userEntryId_fkey" FOREIGN KEY ("userEntryId") REFERENCES "UserEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserActivity" ADD CONSTRAINT "UserActivity_activityOptionId_fkey" FOREIGN KEY ("activityOptionId") REFERENCES "ActivityOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

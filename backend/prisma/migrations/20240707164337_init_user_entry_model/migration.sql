/*
  Warnings:

  - You are about to drop the `Journal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Mood` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserActivity` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Journal" DROP CONSTRAINT "Journal_userId_fkey";

-- DropForeignKey
ALTER TABLE "Mood" DROP CONSTRAINT "Mood_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserActivity" DROP CONSTRAINT "UserActivity_activityOptionId_fkey";

-- DropForeignKey
ALTER TABLE "UserActivity" DROP CONSTRAINT "UserActivity_userId_fkey";

-- DropTable
DROP TABLE "Journal";

-- DropTable
DROP TABLE "Mood";

-- DropTable
DROP TABLE "UserActivity";

-- CreateTable
CREATE TABLE "UserEntry" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "mood" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "activityOptionId" INTEGER NOT NULL,

    CONSTRAINT "UserEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserEntry_id_key" ON "UserEntry"("id");

-- AddForeignKey
ALTER TABLE "UserEntry" ADD CONSTRAINT "UserEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEntry" ADD CONSTRAINT "UserEntry_activityOptionId_fkey" FOREIGN KEY ("activityOptionId") REFERENCES "ActivityOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

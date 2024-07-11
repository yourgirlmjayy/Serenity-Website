-- DropForeignKey
ALTER TABLE "UserEntry" DROP CONSTRAINT "UserEntry_activityOptionId_fkey";

-- AlterTable
ALTER TABLE "UserEntry" ALTER COLUMN "mood" DROP NOT NULL,
ALTER COLUMN "prompt" DROP NOT NULL,
ALTER COLUMN "content" DROP NOT NULL,
ALTER COLUMN "activityOptionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "UserEntry" ADD CONSTRAINT "UserEntry_activityOptionId_fkey" FOREIGN KEY ("activityOptionId") REFERENCES "ActivityOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;

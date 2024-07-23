-- AlterTable
ALTER TABLE "Journal" ADD COLUMN     "downvote" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "refinedPrompt" TEXT,
ADD COLUMN     "upvote" INTEGER NOT NULL DEFAULT 0;

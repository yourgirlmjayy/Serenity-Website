/*
  Warnings:

  - You are about to drop the column `name` on the `ActivityCategory` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `ActivityOption` table. All the data in the column will be lost.
  - Added the required column `category` to the `ActivityCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `option` to the `ActivityOption` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ActivityCategory" DROP COLUMN "name",
ADD COLUMN     "category" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ActivityOption" DROP COLUMN "name",
ADD COLUMN     "option" TEXT NOT NULL;

/*
  Warnings:

  - Added the required column `icon` to the `ActivityOption` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ActivityOption" ADD COLUMN     "icon" TEXT NOT NULL;

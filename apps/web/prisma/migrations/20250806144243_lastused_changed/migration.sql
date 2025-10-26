/*
  Warnings:

  - You are about to drop the column `lastUsedNumOfDays` on the `Space` table. All the data in the column will be lost.
  - Added the required column `lastUsed` to the `Space` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Space" DROP COLUMN "lastUsedNumOfDays",
ADD COLUMN     "lastUsed" TEXT NOT NULL;

/*
  Warnings:

  - You are about to drop the column `excrept` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "excrept",
ADD COLUMN     "excerpt" TEXT;

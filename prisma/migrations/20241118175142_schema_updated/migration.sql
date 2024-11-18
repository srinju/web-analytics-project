/*
  Warnings:

  - You are about to drop the column `userid` on the `Page_view` table. All the data in the column will be lost.
  - You are about to drop the column `userid` on the `Visits` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Page_view" DROP CONSTRAINT "Page_view_userid_fkey";

-- DropForeignKey
ALTER TABLE "Visits" DROP CONSTRAINT "Visits_userid_fkey";

-- AlterTable
ALTER TABLE "Page_view" DROP COLUMN "userid";

-- AlterTable
ALTER TABLE "Visits" DROP COLUMN "userid";

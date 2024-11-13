/*
  Warnings:

  - Added the required column `userid` to the `Page_view` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userid` to the `Visits` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Page_view" ADD COLUMN     "userid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Visits" ADD COLUMN     "userid" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Visits" ADD CONSTRAINT "Visits_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page_view" ADD CONSTRAINT "Page_view_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

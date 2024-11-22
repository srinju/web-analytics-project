/*
  Warnings:

  - A unique constraint covering the columns `[website_name]` on the table `Website` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Events" DROP CONSTRAINT "Events_website_id_fkey";

-- DropForeignKey
ALTER TABLE "Visits" DROP CONSTRAINT "Visits_website_id_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "Website_website_name_key" ON "Website"("website_name");

-- AddForeignKey
ALTER TABLE "Visits" ADD CONSTRAINT "Visits_website_id_fkey" FOREIGN KEY ("website_id") REFERENCES "Website"("website_name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Events" ADD CONSTRAINT "Events_website_id_fkey" FOREIGN KEY ("website_id") REFERENCES "Website"("website_name") ON DELETE RESTRICT ON UPDATE CASCADE;

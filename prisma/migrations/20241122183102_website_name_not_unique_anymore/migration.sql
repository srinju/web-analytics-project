-- DropForeignKey
ALTER TABLE "Events" DROP CONSTRAINT "Events_website_id_fkey";

-- DropForeignKey
ALTER TABLE "Visits" DROP CONSTRAINT "Visits_website_id_fkey";

-- DropIndex
DROP INDEX "Website_website_name_key";

-- AddForeignKey
ALTER TABLE "Visits" ADD CONSTRAINT "Visits_website_id_fkey" FOREIGN KEY ("website_id") REFERENCES "Website"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Events" ADD CONSTRAINT "Events_website_id_fkey" FOREIGN KEY ("website_id") REFERENCES "Website"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "Events" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "event_name" TEXT NOT NULL,
    "website_id" TEXT NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "Events_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Events" ADD CONSTRAINT "Events_website_id_fkey" FOREIGN KEY ("website_id") REFERENCES "Website"("website_name") ON DELETE RESTRICT ON UPDATE CASCADE;

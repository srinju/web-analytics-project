-- CreateTable
CREATE TABLE "Visits" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "website_id" TEXT NOT NULL,
    "source" TEXT NOT NULL,

    CONSTRAINT "Visits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Page_view" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "domain" TEXT NOT NULL,
    "page" TEXT NOT NULL,

    CONSTRAINT "Page_view_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Visits" ADD CONSTRAINT "Visits_website_id_fkey" FOREIGN KEY ("website_id") REFERENCES "Website"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

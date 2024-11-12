-- CreateTable
CREATE TABLE "Website" (
    "id" TEXT NOT NULL,
    "website_name" TEXT NOT NULL,
    "userid" TEXT NOT NULL,

    CONSTRAINT "Website_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Website" ADD CONSTRAINT "Website_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

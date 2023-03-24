/*
  Warnings:

  - You are about to drop the `Notify` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Notify";

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "payer" TEXT NOT NULL,
    "transfer_amount" DOUBLE PRECISION NOT NULL,
    "transfer_time" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

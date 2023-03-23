-- CreateTable
CREATE TABLE "Notify" (
    "id" TEXT NOT NULL,
    "payer" TEXT NOT NULL,
    "transfer_amount" DOUBLE PRECISION NOT NULL,
    "transfer_time" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notify_pkey" PRIMARY KEY ("id")
);

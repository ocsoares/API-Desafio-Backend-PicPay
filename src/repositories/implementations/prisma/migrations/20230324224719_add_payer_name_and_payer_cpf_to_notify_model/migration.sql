/*
  Warnings:

  - You are about to drop the column `payer` on the `notifications` table. All the data in the column will be lost.
  - Added the required column `payer_cpf` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payer_name` to the `notifications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "payer",
ADD COLUMN     "payer_cpf" TEXT NOT NULL,
ADD COLUMN     "payer_name" TEXT NOT NULL;

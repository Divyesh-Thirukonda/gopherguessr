/*
  Warnings:

  - The `campus` column on the `Photo` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "CampusEnum" AS ENUM ('WestBank', 'EastBankCore', 'EastBankOuter', 'Dinkytown', 'StPaul');

-- AlterTable
ALTER TABLE "Photo" DROP COLUMN "campus",
ADD COLUMN     "campus" "CampusEnum";

-- CreateEnum
CREATE TYPE "DiffEnum" AS ENUM ('ONE', 'TWO', 'THREE');

-- AlterTable
ALTER TABLE "Photo" ADD COLUMN     "campus" TEXT,
ADD COLUMN     "diffRating" "DiffEnum",
ADD COLUMN     "indoors" BOOLEAN,
ADD COLUMN     "isApproved" BOOLEAN NOT NULL DEFAULT true;

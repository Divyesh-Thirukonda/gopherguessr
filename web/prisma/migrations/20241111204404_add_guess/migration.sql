/*
  Warnings:

  - You are about to drop the column `locX` on the `GameState` table. All the data in the column will be lost.
  - You are about to drop the column `locY` on the `GameState` table. All the data in the column will be lost.
  - You are about to drop the column `photosUsed` on the `GameState` table. All the data in the column will be lost.
  - You are about to drop the column `previousGuessAccuracy` on the `GameState` table. All the data in the column will be lost.
  - You are about to drop the column `previousGuessPoints` on the `GameState` table. All the data in the column will be lost.
  - You are about to drop the column `rounds` on the `GameState` table. All the data in the column will be lost.
  - You are about to drop the column `totalPoints` on the `GameState` table. All the data in the column will be lost.
  - Added the required column `points` to the `GameState` table without a default value. This is not possible if the table is not empty.
  - Added the required column `round` to the `GameState` table without a default value. This is not possible if the table is not empty.
  - Added the required column `started` to the `GameState` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GameState" DROP COLUMN "locX",
DROP COLUMN "locY",
DROP COLUMN "photosUsed",
DROP COLUMN "previousGuessAccuracy",
DROP COLUMN "previousGuessPoints",
DROP COLUMN "rounds",
DROP COLUMN "totalPoints",
ADD COLUMN     "points" INTEGER NOT NULL,
ADD COLUMN     "round" INTEGER NOT NULL,
ADD COLUMN     "started" BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE "Guess" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "gameStateId" INTEGER NOT NULL,
    "photoId" INTEGER NOT NULL,
    "guessComplete" BOOLEAN NOT NULL DEFAULT false,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "distance" DOUBLE PRECISION,
    "points" DOUBLE PRECISION,

    CONSTRAINT "Guess_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Guess" ADD CONSTRAINT "Guess_gameStateId_fkey" FOREIGN KEY ("gameStateId") REFERENCES "GameState"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guess" ADD CONSTRAINT "Guess_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "Photo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

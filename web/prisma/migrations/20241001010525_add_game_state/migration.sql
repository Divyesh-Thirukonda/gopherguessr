/*
  Warnings:

  - You are about to drop the `Test2` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Test2";

-- CreateTable
CREATE TABLE "GameState" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "locX" DOUBLE PRECISION NOT NULL,
    "locY" DOUBLE PRECISION NOT NULL,
    "photosUsed" INTEGER[],
    "previousGuessAccuracy" INTEGER NOT NULL,
    "previousGuessPoints" INTEGER NOT NULL,
    "rounds" INTEGER NOT NULL,
    "totalPoints" INTEGER NOT NULL,
    "complete" BOOLEAN NOT NULL,

    CONSTRAINT "GameState_pkey" PRIMARY KEY ("id")
);

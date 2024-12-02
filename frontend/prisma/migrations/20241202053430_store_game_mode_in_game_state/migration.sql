-- CreateEnum
CREATE TYPE "GameModeEnum" AS ENUM ('Easy', 'Medium', 'Hard', 'Minneapolis', 'StPaul', 'All');

-- AlterTable
ALTER TABLE "GameState" ADD COLUMN     "gameMode" "GameModeEnum";

-- AlterTable
ALTER TABLE "GameState" ADD COLUMN     "lobbyId" INTEGER;

-- CreateTable
CREATE TABLE "Lobby" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completeBy" TIMESTAMP(3) NOT NULL,
    "photoIds" INTEGER[],
    "code" TEXT NOT NULL,

    CONSTRAINT "Lobby_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lobby_code_key" ON "Lobby"("code");

-- AddForeignKey
ALTER TABLE "GameState" ADD CONSTRAINT "GameState_lobbyId_fkey" FOREIGN KEY ("lobbyId") REFERENCES "Lobby"("id") ON DELETE SET NULL ON UPDATE CASCADE;

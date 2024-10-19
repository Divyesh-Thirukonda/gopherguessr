"use server"; // Server action

import { revalidatePath } from "next/cache";
import { gameState } from "@/app/_utils/tempDb";

export async function clearGameState() {
  // Reset game state
  gameState.loc = null;
  gameState.allLocsUsed = [];
  gameState.round = 1;
  gameState.lastGuessPoints = 0;
  gameState.lastGuessLat = 0;
  gameState.lastGuessLng = 0;
  gameState.points = 0;
  gameState.lastGuessD = 0;
  gameState.complete = false;
  gameState.gameStarted = false;
  gameState.allGuessesUsed = [];

  // Revalidate the /play page
  revalidatePath("/play");
}

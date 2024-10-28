/*
  What is this file?:
    A Next.js Page Component
      Next.js Pages are where you put code that is unique to a specific page.
      Since this file is located in the /app/play folder,
      it is what runs when you go to the /play URL in the browser.
      Think of it like a main() method in Java.
      Learn more here: 
        https://nextjs.org/docs/app/building-your-application/routing/pages
  Server component or client component?:
    Server Component
  What are we using this file for?:
    Since this is a Server Component, 
    we are using it to run our server-side logic.
    This includes fetching locations from our temporary "database",
    and processing the user's guess (using a Server Action).
    If our map didn't require interactivity, 
    we could put all of our HTML in the return of the function and render our map UI directly in this file,
    but since our map needs to be interactive, 
    we import a Client Component (MapWrapper) that takes care of actually rendering the map UI.
*/

import { revalidatePath } from "next/cache";
import latlngToMeters from "../_utils/latlngToMeters";
import { gameStates, initGameState } from "../_utils/tempDb";
import DebugMenu from "./_components/DebugMenu";
import prisma from "../_utils/db";
import GameView from "./_components/GameView";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function Play() {
  // for debugging
  // TODO: REMOVE IN PROD
  console.log(gameStates);

  // store a handle for the specific gameState instance in cookies
  // this will be EXTREMELY UNSTABLE
  // (because everytime the deploy is updated the gamestates are cleared, and cookies aren't),
  // but it will work for MVP and that's all we need right now
  const cookieStore = await cookies();
  const cookie = cookieStore.get("clientGameStateHandle");

  if (!cookie) {
    redirect(`/createcookie?len=${Object.keys(gameStates).length}`);
  } else if (cookie.value > Object.keys(gameStates).length) {
    // try to make more stable by clearing any cookies that have goofy values
    redirect(`/createcookie?len=${Object.keys(gameStates).length}`);
  }

  const clientGameStateHandle = cookie.value;

  if (!gameStates[clientGameStateHandle]) {
    // initialize new gameState and clone the initGameState so we arent inadvertantly editing it
    gameStates[clientGameStateHandle] = structuredClone(initGameState);
  }

  if (!gameStates[clientGameStateHandle].loc) {
    // FOR MVP LIMIT TO WEST BANK AND EAST BANK CORE
    // TODO: ALLOW SELECTION OF CAMPUS
    const locCount = await prisma.photo.count({
      where: { OR: [{ campus: "WestBank" }, { campus: "EastBankCore" }] },
    });
    if (
      gameStates[clientGameStateHandle].round > locCount ||
      gameStates[clientGameStateHandle].round > 5
    ) {
      gameStates[clientGameStateHandle].complete = true;
    } else {
      let newLocId = Math.floor(Math.random() * locCount);
      let newLoc = await prisma.photo.findMany({
        skip: newLocId,
        take: 1,
        where: { OR: [{ campus: "WestBank" }, { campus: "EastBankCore" }] },
      });

      while (
        gameStates[clientGameStateHandle].allLocsUsed.some(
          (loc) => loc.id === newLocId,
        )
      ) {
        newLocId = Math.floor(Math.random() * locCount);
        newLoc = await prisma.photo.findMany({
          skip: newLocId,
          take: 1,
          where: { OR: [{ campus: "WestBank" }, { campus: "EastBankCore" }] },
        });
        if (!newLoc[0]) {
          // just in case i goofied something up
          console.log("THIS SHOULDN'T HAPPEN");
        }
      }
      gameStates[clientGameStateHandle].loc = newLoc[0];
    }
  }

  async function submitGuess(guess) {
    "use server";
    const d = latlngToMeters(
      guess[0],
      guess[1],
      gameStates[clientGameStateHandle].loc.latitude,
      gameStates[clientGameStateHandle].loc.longitude,
    );
    gameStates[clientGameStateHandle].lastGuessD = d;
    gameStates[clientGameStateHandle].allLocsUsed.push(
      gameStates[clientGameStateHandle].loc,
    );
    gameStates[clientGameStateHandle].lastGuessPoints =
      (500 - (d > 500 ? 500 : d)) * 2;
    gameStates[clientGameStateHandle].lastGuessLat = guess[0];
    gameStates[clientGameStateHandle].lastGuessLng = guess[1];
    gameStates[clientGameStateHandle].allGuessesUsed.push([guess[0], guess[1]]);
    gameStates[clientGameStateHandle].points +=
      gameStates[clientGameStateHandle].lastGuessPoints;
    gameStates[clientGameStateHandle].loc = null;
    gameStates[clientGameStateHandle].round += 1;
    gameStates[clientGameStateHandle].gameStarted = true;

    revalidatePath("/play");
  }

  async function clearGameState() {
    "use server";
    // Reset game state
    gameStates[clientGameStateHandle].loc = null;
    gameStates[clientGameStateHandle].allLocsUsed = [];
    gameStates[clientGameStateHandle].round = 1;
    gameStates[clientGameStateHandle].lastGuessPoints = 0;
    gameStates[clientGameStateHandle].lastGuessLat = 0;
    gameStates[clientGameStateHandle].lastGuessLng = 0;
    gameStates[clientGameStateHandle].points = 0;
    gameStates[clientGameStateHandle].lastGuessD = 0;
    gameStates[clientGameStateHandle].complete = false;
    gameStates[clientGameStateHandle].gameStarted = false;
    gameStates[clientGameStateHandle].allGuessesUsed = [];

    // Revalidate the /play page
    revalidatePath("/play");
    redirect("/playagain");
  }

  return (
    <>
      <GameView
        clearGameState={clearGameState}
        submitGuess={submitGuess}
        gameState={gameStates[clientGameStateHandle]}
      />
      <DebugMenu
        gameState={gameStates[clientGameStateHandle]}
        clearGameState={clearGameState}
      />
    </>
  );
}

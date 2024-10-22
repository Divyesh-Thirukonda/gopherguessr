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
import { gameState } from "../_utils/tempDb";
import dynamicImport from "next/dynamic";
import EndDialog from "./_components/EndDialog";
import ResultsDialog from "./_components/ResultsDialog";
import prisma from "../_utils/db";

const ImageView = dynamicImport(() => import("./_components/ImageView"), {
  ssr: false,
});

export const dynamic = "force-dynamic";

export default async function Play() {
  if (!gameState.loc) {
    const locCount = await prisma.photo.count();
    if (gameState.round > locCount || gameState.round > 5) {
      gameState.complete = true;
  } else {
    let newLocId = Math.floor(Math.random() * locCount);
    let newLoc = await prisma.photo.findMany({ skip: newLocSkip, take: 1 });
      
    while (gameState.allLocsUsed.some((loc) => loc.id === newLocId)) {
      newLocId = Math.floor(Math.random() * locCount);
      newLoc = await prisma.photo.findMany({ skip: newLocId, take: 1 });
      if (!newLoc[0]) {
        // just in case i goofied something up
        console.log("THIS SHOULDN'T HAPPEN");
      }
    }
    gameState.loc = newLoc[0];
  }

  async function submitGuess(guess) {
    "use server";
    const d = latlngToMeters(
      guess[0],
      guess[1],
      gameState.loc.latitude,
      gameState.loc.longitude,
    );
    gameState.lastGuessD = d;
    gameState.allLocsUsed.push(gameState.loc);
    gameState.lastGuessPoints = (500 - (d > 500 ? 500 : d)) * 2;
    gameState.lastGuessLat = guess[0];
    gameState.lastGuessLng = guess[1];
    gameState.allGuessesUsed.push([guess[0], guess[1]]);
    gameState.points += gameState.lastGuessPoints;
    gameState.loc = null;
    gameState.round += 1;
    gameState.gameStarted = true;

    revalidatePath("/play");
  }

    
  if (gameState.complete === true) {
    return <EndDialog gameState={gameState} />;
  }

  return (
    <>
      <DebugMenu justClear={false} />
      <ImageView submitGuess={submitGuess} gameState={gameState} />;
    </>
  );
}

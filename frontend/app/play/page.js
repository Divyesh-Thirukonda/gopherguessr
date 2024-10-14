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
import DebugMenu from "./_components/DebugMenu";
import PreviewImage from "./_components/PreviewImage";
import latlngToMeters from "../_utils/latlngToMeters";
import { gameState } from "../_utils/tempDb";

// we are importing this with a different name than usual because we need to export a variable called dynamic later
import dynamicImport from "next/dynamic";
import ResultsDialog from "./_components/ResultsDialog";
import EndDialog from "./_components/EndDialog";
import prisma from "../_utils/db";

// we import this a special way because Leaflet (the mapping library we are using), can't be prerendered.
// learn more here: https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading#skipping-ssr
const MapWrapper = dynamicImport(() => import("./_components/MapWrapper"), {
  ssr: false,
});

/*
  this tells next.js to not cache our page.
  if our page was cached, new data would not make it to the user immediately
  which would lead to outdated state and a broken UI.
*/
export const dynamic = "force-dynamic";

export default async function Play() {
  /*
    Since this is a server component (no "use client"), this JavaScript will not run on the client at all.
    Think like a PHP file.
  */

  /*
    This runs when somebody GETs this page.
    It just gets a random location from our REAL DATABASE NOW,
    and stores it in the gameState "database".
  */
  if (!gameState.loc) {
    const locCount = await prisma.photo.count();
    // don't have more rounds than 5 or the amount of locations we have
    if (gameState.round > locCount || gameState.round > 5) {
      gameState.complete = true;
    } else {
      let newLocId = Math.floor(Math.random() * locCount);
      // dont use the same location twice
      while (gameState.allLocsUsed.some((loc) => loc.id === newLocId)) {
        newLocId = Math.floor(Math.random() * locCount);
      }
      // get actual loc from db
      /* we are using findmany and skip instead of selecting by id specefically so that if we delete some, 
      there's no chance of accidentally trying to get a deleted item */
      const newLoc = await prisma.photo.findMany({ skip: newLocId, take: 1 });
      gameState.loc = newLoc[0];
    }
  }

  /*
    This is a Server Action (you know because the first line of the function is "use server").
      Learn more here: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
    Once compiled, this runs on the server when somebody sends a POST request 
    (except we can have an unlimited amount of Server Actions on a page vs just one POST handler on a traditional Express server).
    On our end, we can call the function anywhere (in an onClick handler in this case),
    just like you would any other function,
    and Next.js will automatically take care of making an API endpoint and converting to JSON and back.
  */
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
    // if guess is over 500 meters away, just make it 500 so we can calculate points easy
    gameState.lastGuessPoints = (500 - (d > 500 ? 500 : d)) * 2;
    gameState.lastGuessLat = guess[0];
    gameState.lastGuessLng = guess[1];
    gameState.allGuessesUsed.push([guess[0], guess[1]]);
    gameState.lastGuessLng;
    gameState.points += gameState.lastGuessPoints;
    gameState.loc = null;
    gameState.round += 1;
    gameState.gameStarted = true;

    /*
      Now that we've updated the game state in our "database", 
      we need a way to tell the client to "refresh".
      revalidatePath does just that by telling the server to rerender the entire page,
      running our code to get a new random location and sending that info to the client.
    */
    revalidatePath("/play");
  }

  // if the game is over we don't need to show the map anymore.
  // in the future we can put a game over / summary screen here.
  if (gameState.complete === true) {
    return (
      <>
        <EndDialog gameState={gameState} />
        <DebugMenu />
      </>
    );
  }

  return (
    <>
      <MapWrapper
        mode="eastBank"
        submitGuess={submitGuess}
        gameState={gameState}
      />
      <DebugMenu />
      <PreviewImage gameState={gameState} />
    </>
  );
}

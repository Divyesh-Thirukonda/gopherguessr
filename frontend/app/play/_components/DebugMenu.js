/*
  What is this file?:
    A React Component
      It is in the folder /app/play/_components because it is only used on the /play page.
      The underscore in the _components folder tells Next.js not to serve the files directly to the client.
      This prevents users from, for example, loading JUST our DebugMenu.
      Think of it like a private method in Java, 
      It needs to be part of something bigger (our page.js file) to be accessible.
      Learn more here: 
        https://nextjs.org/docs/app/building-your-application/routing/colocation#private-folders
  Server component or client component?:
    Server Component
      That's right, even though this is just a regular Component and not a Page,
      since there's nothing that needs client-side JavaScript,
      we can make it a Server Component.
      This allows us to create a Server Action directly in this component.
  What are we using this file for?:
    This is a temporary Component that shows the user the current gameState
    and allows them to reset it by clicking a button.
*/

import { Bug } from "@phosphor-icons/react/dist/ssr";
import { revalidatePath } from "next/cache";
import { gameState } from "@/app/_utils/tempDb";
import { clearGameState } from "../_utils/gameStateUtils";

export default function DebugMenu() {
  /*
    If this was connected to a real database
    we would actually need to request the gameState below or pass it as a prop from the page.js file.
    (remember since this is a Server Component, any logic we run here will run on the Server).
    But since it isn't, we can just import the gameState from our _utils folder.
    If you're wondering how we can just import the gameState object in 2 places and change it in one and and see updates in another,
    that's because objects are pointers (just like in Java).
  */

  /*
    This is a Server Action (you know because the first line of the function is "use server").
      Learn more here: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
    Once compiled, this runs on the server when somebody sends a POST request 
    (except we can have an unlimited amount of Server Actions on a page vs just one POST handler on a traditional Express server).
    On our end, we can call the function anywhere (in a form action in this case),
    and Next.js will automatically take care of making an API endpoint and converting to JSON and back.
  */

  return (
    <div
      className={`fixed right-0 top-0 z-[1000] px-4 py-2 ${gameState.complete ? "bg-emerald-50" : "bg-white"} w-72 rounded-bl-lg shadow-inner`}
    >
      <span className="flex items-center gap-1.5 text-lg font-medium">
        <Bug className="h-5 w-5" />
        debug
        {gameState.complete ? (
          <span className="text-emerald-600"> game finished</span>
        ) : null}
      </span>
      current points: {gameState.points} / {(gameState.round - 1) * 1000}
      <br />
      current round: {gameState.round}
      <br />
      current location name: {gameState.loc?.buildingName}
      <br />
      {gameState.allLocsUsed.length >= 1 && (
        <>
          last guess distance away: {gameState.lastGuessD}m
          <br />
          points added for last guess: {gameState.lastGuessPoints}
          <br />
          last location name:{" "}
          {
            gameState.allLocsUsed[gameState.allLocsUsed.length - 1]
              ?.buildingName
          }
          <br />
        </>
      )}
      <form action={clearGameState}>
        <button
          type="submit"
          className="mt-1.5 rounded-full border-2 bg-white px-2 py-1 hover:bg-gray-100"
        >
          clear game state
        </button>
      </form>
    </div>
  );
}

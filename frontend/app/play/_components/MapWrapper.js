/*
  What is this file?:
    A React Component
      It is in the folder /app/play/_components because it is only used on the /play page.
      The underscore in the _components folder tells Next.js not to serve the files directly to the client.
      This prevents users from, for example, loading JUST our MapWrapper.
      Think of it like a private method in Java,
      It needs to be part of something bigger (our page.js file) to be accessible.
      Learn more here:
        https://nextjs.org/docs/app/building-your-application/routing/colocation#private-folders
  Server component or client component?:
    Client Component
      We know it's a Client Component because "use client"; is the first line of the file.
      If you're keeping track, this is the first time we cross over from Server Component to Client Component.
      (remember we can't import Server Components into Client Components so unless we use a workaround,
      everything further down the tree needs to be a Client Component)
        Learn more about the workaround here:
          https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#supported-pattern-passing-server-components-to-client-components-as-props
      We need this to be a Client Component because we're using React Hooks, which need to run on the client.
      (imagine if our useState ran on the Server, every user would have the exact same state. that would be a disaster...)
  What are we using this file for?:
    This Component does a couple things:
      It sets up client-side state for the user's current guess (where they last clicked on the page).
      It renders our Leaflet Map and the button used to submit the user's guess.
      It also sets up client-side state to change the map view from Minneapolis to St.Paul and vice versa.
    This is imported directly into our page.js file.
*/

"use client";

import { useEffect, useState, useRef } from "react";
import * as motion from "framer-motion/client";
import { MapContainer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MapImageWrapper from "./MapImageWrapper";
import ResultsDialog from "./ResultsDialog";
import { MapTrifold, X } from "@phosphor-icons/react";

const minneapolisCenter = [44.97528, -93.23538];
const stPaulCenter = [44.98655, -93.18201];

export default function MapWrapper({
  submitGuess,
  gameState,
  onDialogContinue,
  viewMap,
}) {
  const [viewStPaul, setViewStPaul] = useState(false);
  const [guess, setGuess] = useState(
    viewStPaul ? stPaulCenter : minneapolisCenter,
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  // we create this ref here but we actually set it in MapImageWrapper
  const mapRef = useRef(null);

  /*
    The array at the end of this useEffect tells React when to run the code inside of it
    Any time something in the array (called a dependency array) changes, the code runs.
    In our case any time the gameState is updated (when the user submits a guess)
    or any time the viewStPaul state is updated (when the user switches to Minneapolis / St Paul),
    we reset the guess state to the center and use the mapRef we set in MapImageWrapper to pan the Leaflet map to the center.
  */
  useEffect(() => {
    if (mapRef.current) {
      if (viewStPaul) {
        mapRef.current.setView(stPaulCenter, 16);
        setGuess(stPaulCenter);
      } else {
        mapRef.current.setView(minneapolisCenter, 16);
        setGuess(minneapolisCenter);
      }
    }
  }, [gameState, viewStPaul]);

  useEffect(() => {
    if (gameState.gameStarted) {
      console.log("happening...");
      setDialogOpen(true);
    }
  }, [gameState.round]);
  if (viewMap == false) {
    return null;
  }
  return (
    <div className="fixed inset-0 z-[900] backdrop-blur-md">
      <div className="scale-[90%] overflow-hidden rounded-xl">
        <MapContainer
          center={viewStPaul ? stPaulCenter : minneapolisCenter}
          minZoom={15}
          zoom={16}
          maxZoom={18}
          scrollWheelZoom={true}
          className="h-dvh w-dvw"
        >
          <MapImageWrapper mapRef={mapRef} setGuess={setGuess} guess={guess} />
        </MapContainer>
        <motion.button
          className="fixed left-0 right-0 top-6 z-[1000] mx-auto w-min whitespace-nowrap rounded-full bg-rose-600 px-4 py-2 font-medium text-white hover:bg-rose-700"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.8 }}
          onClick={() => setViewStPaul((currentState) => !currentState)}
        >
          Go to {viewStPaul ? "Minneapolis" : "St Paul"}
        </motion.button>
        <motion.button
          className="fixed bottom-6 left-0 right-0 z-[1000] mx-auto w-min whitespace-nowrap rounded-full bg-rose-600 px-4 py-2 font-medium text-white hover:bg-rose-700"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.8 }}
          onClick={() => submitGuess(guess)}
        >
          Submit Guess
        </motion.button>
        <ResultsDialog
          gameState={gameState}
          open={dialogOpen}
          setDialogOpen={setDialogOpen}
          onContinue={onDialogContinue}
        />
        <motion.button
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.8 }}
          onClick={onDialogContinue}
          className="absolute right-4 top-4 z-[2000] rounded-full bg-rose-600 p-2.5"
        >
          <X className="h-6 w-6 text-white" />
        </motion.button>
      </div>
    </div>
  );
}

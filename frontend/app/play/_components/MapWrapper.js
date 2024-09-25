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
      It sets up an object with our different maps. (currently just one)
      It sets up client-side state for the user's current guess (where they last clicked on the page).
      It renders our Leaflet Map and the button used to submit the user's guess.
    This is imported directly into our page.js file.
*/

"use client";

import { useEffect, useState } from "react";
import * as motion from "framer-motion/client";
import { MapContainer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MapImageWrapper from "./MapImageWrapper";

const maps = {
  eastBank: {
    imgSrc: "/images/eastbank.png",
    bounds: [
      [44.97069111915625, -93.23820422738942],
      [44.97837130687424, -93.22659538730979],
    ],
  },
};

export default function MapWrapper({ submitGuess, mode, gameState }) {
  const center = [
    maps[mode].bounds[1][0] -
      (maps[mode].bounds[1][0] - maps[mode].bounds[0][0]) / 2,
    maps[mode].bounds[1][1] -
      (maps[mode].bounds[1][1] - maps[mode].bounds[0][1]) / 2,
  ];
  const [guess, setGuess] = useState(center);

  /*
    The array at the end of this useEffect tells React when to run the code inside of it
    Any time something in the array (called a dependency array) changes, the code runs.
    In our case any time the gameState is updated (when the user submits a guess),
    we reset the guess state to the center of the map.
  */
  useEffect(() => {
    setGuess(center);
  }, [gameState]);

  return (
    <>
      <MapContainer
        center={center}
        zoom={16}
        scrollWheelZoom={true}
        className="h-dvh w-dvw"
      >
        <MapImageWrapper
          imgSrc={maps[mode].imgSrc}
          bounds={maps[mode].bounds}
          center={center}
          setGuess={setGuess}
          guess={guess}
        />
      </MapContainer>
      <motion.button
        className="fixed bottom-6 left-0 right-0 z-[1000] mx-auto w-min whitespace-nowrap rounded-full bg-rose-600 px-4 py-2 font-medium text-white hover:bg-rose-700"
        whileHover={{ scale: 1.2 }}
        onClick={() => submitGuess(guess)}
      >
        Submit Guess
      </motion.button>
    </>
  );
}

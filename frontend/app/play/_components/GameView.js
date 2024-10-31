"use client";

import Image from "next/image";
import { useState } from "react";
import * as motion from "framer-motion/client";
import dynamicImport from "next/dynamic";
import { MapTrifold } from "@phosphor-icons/react";
import StatsMenu from "./StatsMenu";

const MapWrapper = dynamicImport(() => import("./MapWrapper"), {
  ssr: false,
});

function getFullUrl(id) {
  return `https://utfs.io/a/e9dxf42twp/${id}`;
}

export default function GameView({ submitGuess, gameState, clearGameState }) {
  const [viewMap, setViewMap] = useState(false);

  const getStatsMenu = () => {
    if (!viewMap) {
      return (
        <div className="fixed bottom-6 left-3 md:left-auto md:right-4 md:top-1/2 md:-translate-y-1/2 md:transform">
          <StatsMenu gameState={gameState} />
        </div>
      );
    }
  };

  const getOpenMap = () => {
    if (!viewMap) {
      return (
        <motion.button
          whileHover={{ scale: 1.2, x: "-.9rem", y: "-.9rem" }}
          onClick={() => setViewMap(true)}
          className="fixed bottom-0 right-0 z-[800] flex flex-col items-center rounded-tl-full bg-rose-600 pb-8 pl-12 pr-8 pt-12 text-white shadow"
        >
          <MapTrifold className="h-12 w-12" />
          <span className="font-medium">Open Map</span>
        </motion.button>
      );
    }
  };

  return (
    <>
      <div className="relative flex h-dvh w-dvw items-center justify-center bg-gray-500">
        {!gameState.complete && (
          <>
            <div>
              <Image
                fill
                src={getFullUrl(gameState.loc.imageId)}
                className="blur-xl"
                alt="Blurry guess image."
              />
            </div>
            <Image
              fill
              src={getFullUrl(gameState.loc.imageId)}
              className="h-full w-full object-contain object-center"
              alt="Guess image."
            />
          </>
        )}
      </div>
      <div>{getStatsMenu()}</div>
      <div>
        {getOpenMap()}
        <MapWrapper
          gameState={gameState}
          submitGuess={submitGuess}
          onDialogContinue={() => setViewMap(false)}
          viewMap={viewMap}
          clearGameState={clearGameState}
        />
      </div>
    </>
  );
}

"use client";

import { MapTrifold, X } from "@phosphor-icons/react";
import MapWrapper from "./MapWrapper";
import * as motion from "framer-motion/client";
import { useState } from "react";

export default function ResizeableMap({ gameState, submitGuess }) {
  const [viewMap, setViewMap] = useState(false);

  return (
    <div>
      <motion.button
        whileHover={{ scale: 1.2, x: "-.9rem", y: "-.9rem" }}
        onClick={() => setViewMap(true)}
        className="fixed bottom-0 right-0 z-[800] flex flex-col items-center rounded-tl-full bg-rose-600 pb-8 pl-12 pr-8 pt-12 text-white shadow"
      >
        <MapTrifold className="h-12 w-12" />
        <span className="font-medium">Open Map</span>
      </motion.button>

      <MapWrapper
        gameState={gameState}
        submitGuess={submitGuess}
        onDialogContinue={() => setViewMap(false)}
        viewMap={viewMap}
      />
    </div>
  );
}
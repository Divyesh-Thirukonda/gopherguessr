"use client";

import { MapTrifold, X } from "@phosphor-icons/react";
import MapWrapper from "./MapWrapper";
import * as motion from "framer-motion/client";
import { useState } from "react";

export default function ResizeableMap({ gameState, submitGuess }) {
  const [viewMap, setViewMap] = useState(false); // Controls map visibility
  const [dialogOpen, setDialogOpen] = useState(false); // Controls ResultsDialog visibility

  // Function to handle closing the dialog separately from the map
  const handleDialogContinue = () => {
    setDialogOpen(false); // Only close the dialog, keep the map view intact
  };

  if (viewMap) {
    return (
      <div className="fixed inset-0 z-[900] backdrop-blur-md">
        <div className="scale-[90%] overflow-hidden rounded-xl">
          <MapWrapper
            gameState={gameState}
            submitGuess={submitGuess}
            onDialogContinue={handleDialogContinue} // Use the dialog handling function here
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.8 }}
          onClick={() => setViewMap(false)} // This only controls the map visibility
          className="absolute right-4 top-4 rounded-full bg-rose-600 p-2.5"
        >
          <X className="h-6 w-6 text-white" />
        </motion.button>
      </div>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.2, x: "-.9rem", y: "-.9rem" }}
      onClick={() => setViewMap(true)} // Show the map when clicked
      className="fixed bottom-0 right-0 z-[800] flex flex-col items-center rounded-tl-full bg-rose-600 pb-8 pl-12 pr-8 pt-12 text-white shadow"
    >
      <MapTrifold className="h-12 w-12" />
      <span className="font-medium">Open Map</span>
    </motion.button>
  );
}

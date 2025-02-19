"use client";

import { Bug } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";
import MotionButton from "@/app/_components/MotionButton";

export default function DebugMenu({ gameState, clearGameState }) {
  const [showDebug, setShowDebug] = useState(false);

  if (!showDebug) {
    return (
      <MotionButton
        className="fixed right-5 top-20 z-[1000] md:right-4 md:top-4"
        onClick={() => setShowDebug(true)}
      >
        <Bug className="h-5 w-5" />
      </MotionButton>
    );
  }

  return (
    <div
      className={`fixed right-0 top-0 z-[1000] px-4 py-2 ${gameState.complete ? "bg-emerald-50" : "bg-white"} w-72 rounded-br-lg shadow-inner`}
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
      <button
        onClick={() => setShowDebug(false)}
        className="mt-1.5 rounded-full border-2 bg-white px-2 py-1 hover:bg-gray-100"
      >
        close debug
      </button>
    </div>
  );
}

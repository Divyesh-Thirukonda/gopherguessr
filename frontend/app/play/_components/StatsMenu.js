"use client";

export default function StatsMenu({ gameState }) {
  return (
    <div
      className={`fixed right-4 top-4 z-[1000] px-4 py-2 ${gameState.complete ? "bg-emerald-50" : "bg-white"} w-72 rounded-lg shadow-inner`}
    >
      <span className="flex items-center gap-1.5 text-lg font-medium">
        Stats
        {gameState.complete ? (
          <span className="text-emerald-600"> game finished</span>
        ) : null}
      </span>
      Score: {gameState.points} / {(gameState.round - 1) * 1000}
      <br />
      Round: {gameState.round} / 5
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
    </div>
  );
}

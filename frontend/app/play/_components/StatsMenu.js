"use client";

export default function StatsMenu({ gameState }) {
  return (
    <div
      className={`${gameState.complete ? "bg-emerald-50" : "bg-white"} w-full max-w-[10rem] rounded-lg p-4 shadow-inner md:max-w-[12rem] lg:max-w-[16rem]`}
    >
      <span className="flex items-center gap-1.5 text-lg font-medium">
        {gameState.complete ? (
          <span className="text-emerald-600"> FINISHED</span>
        ) : null}
      </span>
      <p className="text-xs md:text-base">
        Score: {gameState.points} / {(gameState.round - 1) * 1000}
      </p>
      <p className="text-xs md:text-base">Round: {gameState.round} / 5</p>
      {gameState.allLocsUsed.length >= 1 && (
        <>
          <p className="text-xs md:text-base">
            Prev Distance: {gameState.lastGuessD}m
          </p>
          <p className="text-xs md:text-base">
            Prev Points: {gameState.lastGuessPoints}
          </p>
        </>
      )}
    </div>
  );
}

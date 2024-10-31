"use client";

export default function StatsMenu({ gameState }) {
  const getScoreAndRound = () => {
    if (!gameState.complete) {
      return (
        <>
          <p className="text-xs md:text-base">
            Score: {gameState.points} / {(gameState.round - 1) * 1000}
          </p>
          <p className="text-xs md:text-base">Round: {gameState.round} / 5</p>
        </>
      );
    }

    return (
      <p className="text-xs md:text-base">
        Final Score: {gameState.points} / {(gameState.round - 1) * 1000}
      </p>
    );
  };

  return (
    <div
      className={`${gameState.complete ? "bg-emerald-50 text-emerald-600" : "bg-rose-600 text-white"} w-full min-w-48 max-w-[10rem] rounded-lg p-4 shadow-inner md:max-w-[12rem] lg:max-w-[16rem]`}
    >
      <span className="flex items-center gap-1.5 text-lg font-medium">
        {gameState.complete ? (
          <span className="text-emerald-600"> FINISHED</span>
        ) : null}
      </span>
      {getScoreAndRound()}
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

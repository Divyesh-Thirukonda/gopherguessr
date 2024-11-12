"use client";

export default function StatsMenu({ curState }) {
  const getScoreAndRound = () => {
    if (!curState.complete) {
      return (
        <>
          <p className="text-xs md:text-base">
            Score: {curState.points} / {(curState.round - 1) * 1000}
          </p>
          <p className="text-xs md:text-base">Round: {curState.round} / 5</p>
        </>
      );
    }

    return (
      <p className="text-xs md:text-base">
        Final Score: {curState.points} / {(curState.round - 1) * 1000}
      </p>
    );
  };

  return (
    <div
      className={`${curState.complete ? "bg-emerald-50 text-emerald-600" : "bg-rose-600 text-white"} w-full min-w-40 max-w-[10rem] rounded-lg p-4 shadow-inner md:max-w-[12rem] lg:max-w-[16rem]`} 
    >
      <span className="flex items-center gap-1.5 text-lg font-medium">
        {curState.complete ? (
          <span className="text-emerald-600"> FINISHED</span>
        ) : null}
      </span>
      {getScoreAndRound()}
      {curState.lastGuess && (
        <>
          <p className="text-xs md:text-base">
            Prev Distance: {curState.lastGuess.distance}m
          </p>
          <p className="text-xs md:text-base">
            Prev Points: {curState.lastGuess.points}
          </p>
        </>
      )}
    </div>
  );
}

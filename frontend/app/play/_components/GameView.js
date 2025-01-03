"use client";

import { useEffect, useState } from "react";
import * as motion from "framer-motion/client";
import dynamicImport from "next/dynamic";
import { MapTrifold } from "@phosphor-icons/react";
import Loading from "@/app/_components/Loading";
// import StatsMenu from "./StatsMenu";

const MapWrapper = dynamicImport(() => import("./MapWrapper"), {
  ssr: false,
});

function getFullUrl(id) {
  return `https://utfs.io/a/e9dxf42twp/${id}`;
}

export default function GameView({
  submitGuess,
  clearGameState,
  curState,
  persistGameState,
  goHome,
  curLobby,
  scoreData,
  isLoggedIn,
}) {
  const [viewMap, setViewMap] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  // trigger server action to save cookie on mount
  useEffect(() => {
    persistGameState();
    const timeout = setTimeout(() => setReady(true), 500);
    return () => clearTimeout(timeout);
  }, []);

  const totalPoints = 5000;
  const maxPointsPerRound = 1000;
  useEffect(() => {
    let start = 0;
    const increment = (timestamp) => {
      const incrementValue = Math.min(maxPointsPerRound / 30, 30);
      start = Math.min(start + incrementValue, curState.points);
      setProgress((start / totalPoints) * 100);

      if (start < curState.points) {
        requestAnimationFrame(increment);
      }
    };
    requestAnimationFrame(increment);
  }, [curState.points]);

  // on first load, if game complete, open map to show results dialog
  useEffect(() => {
    if (curState.complete) {
      setViewMap(true);
    }
  }, []);

  const getStatsMenu = () => {
    if (!viewMap) {
      return (
        <div className="absolute left-0 right-0 top-4 z-[1200] mx-4 flex flex-col justify-center">
          <div className="h-6 overflow-hidden rounded-full border border-gray-400 bg-gray-900 bg-opacity-50 backdrop-blur">
            <div
              className="absolute left-0 top-0 z-[1300] h-6 rounded-full bg-rose-600 shadow-lg transition-[width] duration-700 ease-out"
              style={{ width: `${progress}%` }}
            >
              {curState.points > 50 && (
                <div
                  className="absolute right-2 top-0 flex h-6 items-center text-xs font-semibold text-white"
                  style={{ right: "10px" }}
                >
                  {curState.points}
                </div>
              )}
            </div>

            {Array.from({ length: 4 }, (_, i) => (
              <div
                key={i}
                className="absolute top-0 z-[1250] h-6 border-r border-gray-400 opacity-50"
                style={{ left: `${(i + 1) * 20}%` }}
              >
                <span className="absolute ml-1 text-white">{`${(i + 1) * 1000}`}</span>
              </div>
            ))}
          </div>
          <div className="mx-auto mt-3 inline-block rounded-full border border-gray-400 bg-gray-900 bg-opacity-50 px-4 text-center font-semibold text-white backdrop-blur">
            Round {curState.round} / 5
          </div>
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

  // allow for a little time to prefetch images
  if (!ready) {
    return <Loading />;
  }

  return (
    <div className="fixed inset-0">
      <div className="relative flex h-dvh w-dvw items-center justify-center bg-gray-500">
        {!curState.complete && (
          <>
            {/* Blurred Background */}
            <div className="absolute inset-0">
              <img
                src={getFullUrl(curState.curGuess.photo.imageId)}
                className="h-full w-full object-cover blur-xl"
                alt="Blurry guess image."
              />
            </div>

            {/* Centered Guess Image */}
            <img
              src={getFullUrl(curState.curGuess.photo.imageId)}
              className="relative max-h-full max-w-full object-contain"
              alt="Guess image."
            />
          </>
        )}
      </div>
      <div>{getStatsMenu()}</div>
      <div>
        {getOpenMap()}
        <MapWrapper
          submitGuess={submitGuess}
          onDialogContinue={() => setViewMap(false)}
          viewMap={viewMap}
          clearGameState={clearGameState}
          curState={curState}
          goHome={goHome}
          curLobby={curLobby}
          scoreData={scoreData}
          isLoggedIn={isLoggedIn}
        />
      </div>
    </div>
  );
}

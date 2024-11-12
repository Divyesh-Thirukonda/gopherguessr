"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import * as motion from "framer-motion/client";
import dynamicImport from "next/dynamic";
import { MapTrifold } from "@phosphor-icons/react";
// import StatsMenu from "./StatsMenu";

const MapWrapper = dynamicImport(() => import("./MapWrapper"), {
  ssr: false,
});

function getFullUrl(id) {
  return `https://utfs.io/a/e9dxf42twp/${id}`;
}


export default function GameView({ submitGuess, clearGameState, curState }) {
  const [viewMap, setViewMap] = useState(false);
  const [progress, setProgress] = useState(0);

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




  const getStatsMenu = () => {
    if (!viewMap) {
      return (
        <div className="pointer-events-none absolute top-14 left-0 right-0 z-[1200] mx-4 bg-opacity-40 shadow-xl backdrop-blur-md">
          <div className="relative h-6 rounded-full bg-slate-500 shadow-xl">
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
                className="absolute top-0 z-[1250] h-6 border-r border-slate-200 opacity-50"
                style={{ left: `${(i + 1) * 20}%` }}
              >
                {/* <span className="text-white absolute ml-1">{`${(i + 1) * 1000}`}</span> */}
              </div>
            ))}

            {/* Text below the triangle */}
            <div
              className="absolute z-[1260] px-4 text-center font-semibold text-red-700"
              style={{
                left: `50%`,
                transform: "translateX(-50%)",
                bottom: "-5vh",
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                borderRadius: "10px",
                backdropFilter: "blur(10px)",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              }}
            >
              Round {curState.round} / 5
            </div>
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

  return (
    <>
      <div className="relative flex h-dvh w-dvw items-center justify-center bg-gray-500">
        {!curState.complete && (
          <>
            <div>
              <Image
                fill
                src={getFullUrl(curState.curGuess.photo.imageId)}
                className="blur-xl"
                alt="Blurry guess image."
              />
            </div>
            <Image
              fill
              src={getFullUrl(curState.curGuess.photo.imageId)}
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
          submitGuess={submitGuess}
          onDialogContinue={() => setViewMap(false)}
          viewMap={viewMap}
          clearGameState={clearGameState}
          curState={curState}
        />
      </div>
    </>
  );
}

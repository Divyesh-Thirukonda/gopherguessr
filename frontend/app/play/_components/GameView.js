"use client";

import { useEffect, useState, useRef } from "react";
import * as motion from "framer-motion/client";
import dynamicImport from "next/dynamic";
import { MapTrifold } from "@phosphor-icons/react";
import Loading from "@/app/_components/Loading";

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
  isTimed,
}) {
  const [viewMap, setViewMap] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [timer, setTimer] = useState(10); // Initialize the timer with 30 seconds
  const [isTimeUp, setIsTimeUp] = useState(false); // Track if the time is up
  const [hangTimer, setHangTimer] = useState(false); // Use state to control the timer hang
  const initialGameState = useRef(null);

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

  // Timer logic: Countdown and auto-submit
  useEffect(() => {
    if (isTimed && !isTimeUp && !(curState.curGuess.guessComplete)) {
      const interval = setInterval(() => {
        setTimer((prevTime) => {
          console.log("Starting timer", prevTime);
          if (!isTimed) {
            return prevTime;
          }

          if (hangTimer) {
            console.log("Timer is hanging, but game state is the same.");
            clearInterval(interval);
            return prevTime;
          }
          
          if (prevTime <= 1) {
            clearInterval(interval);
            setIsTimeUp(true);
            setViewMap(true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isTimed, isTimeUp, hangTimer]);

  // on first load, if game complete, open map to show results dialog
  useEffect(() => {
    if (curState.complete) {
      setViewMap(true);
    }
  }, []);

  useEffect(() => {
    if (curState.complete) {
      setHangTimer(false);
      return;
    }
    
    if (curState.curGuess && curState.curGuess.photo) {
      if (initialGameState.current === null) {
        // Store the first game state in the ref (this only happens once)
        initialGameState.current = curState.curGuess.photo.id;
        console.log("Initial GameState stored", initialGameState.current);
      } else {
        // This is not the first state change, so we don't update the initialGameState
        if (initialGameState.current !== curState.curGuess.photo.id) {
          console.log("Game state has already been set initially.");
          setHangTimer(true); // Set hangTimer to true when the guess is not the same
        } else {
          setHangTimer(false); // Reset the hangTimer if the guess is the same
        }
      }
    } else {
      console.log("curState.curGuess or curState.curGuess.photo is undefined");
    }
  }, [curState.curGuess?.photo?.id]); // Using optional chaining for safety
  

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
            Round {curState.round} / 5{" "}
            {isTimed && !isTimeUp && (
              <>
                <span className="mx-2">|</span>
                <span>
                  Time Remaining: {timer}s
                </span>
              </>
            )}
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

  const resetTime = () => {
    if (curState.complete || !isTimed) return;
    
    setIsTimeUp(false);
    setTimer(10); // Reset the timer
    
    // Check if curState.curGuess and curState.curGuess.photo are defined
    if (curState.curGuess && curState.curGuess.photo) {
      initialGameState.current = curState.curGuess.photo.id;
      console.log("Game state reset with photo id:", initialGameState.current);
    } else {
      console.log("curState.curGuess or curState.curGuess.photo is undefined, cannot reset game state");
    }
  
    setHangTimer(false); // Reset the hangTimer state
  };
  

  return (
    <div className="fixed inset-0">
      {/* Flashing Border Overlay */}
      {timer < 3 && isTimed && !isTimeUp && (
        <div className="absolute inset-0 animate-flash-red border-8 border-red-500 pointer-events-none z-50"></div>
      )}
    
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
          onDialogContinue={() => {
            setViewMap(false);
            resetTime();
          }}
          onXClick={() => {
            setViewMap(false);
          }}
          viewMap={viewMap}
          clearGameState={clearGameState}
          curState={curState}
          goHome={goHome}
          curLobby={curLobby}
          scoreData={scoreData}
          isLoggedIn={isLoggedIn}
          isTimeUp={isTimeUp}
        />
      </div>
    </div>
  );
  
}

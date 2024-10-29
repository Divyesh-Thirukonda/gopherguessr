"use client";
import { useEffect, useState } from "react";
import EndDialog from "./EndDialog";
import Leaflet from "@/app/_components/Leaflet";
import LeafletMarker from "@/app/_components/LeafletMarker";
import LeafletPolyline from "@/app/_components/LeafletPolyline";
import latlngToMeters from "@/app/_utils/latlngToMeters";

export default function ResultsDialog({
  gameState,
  setDialogOpen,
  onContinue,
  clearGameState,
}) {
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [progress, setProgress] = useState(0);

  const totalPoints = 5000;
  const maxPointsPerRound = 1000;

  // Compute actual location and center point between guess and actual location
  const actualLoc = [
    gameState.allLocsUsed[gameState.allLocsUsed.length - 1]?.latitude,
    gameState.allLocsUsed[gameState.allLocsUsed.length - 1]?.longitude,
  ];
  const [userGuessLoc, setUserGuessLoc] = useState([
    gameState.lastGuessLat,
    gameState.lastGuessLng,
  ]);
  const dialogCenter = [
    (actualLoc[0] + userGuessLoc[0]) / 2,
    (actualLoc[1] + userGuessLoc[1]) / 2,
  ];

  const dist = latlngToMeters(
    actualLoc[0],
    actualLoc[1],
    userGuessLoc[0],
    userGuessLoc[1]
  );

  // Determine zoom level based on distance
  const myZoom = dist < 100 ? 18 : dist < 600 ? 16 : dist < 1000 ? 15 : 14;

  // Effect to animate the points bar
  useEffect(() => {
    let start = gameState.points - gameState.lastGuessPoints;
    const increment = (timestamp) => {
      const incrementValue = Math.min(maxPointsPerRound / 30, 30); // controls animation speed
      start = Math.min(start + incrementValue, gameState.points);
      setProgress((start / totalPoints) * 100);

      if (start < gameState.points) {
        requestAnimationFrame(increment);
      }
    };
    requestAnimationFrame(increment);
  }, [gameState.points]);

  return (
    <div className="fixed inset-0 z-[1000]">
      {/* Leaflet map as background */}
      <Leaflet center={dialogCenter} zoom={myZoom} className="h-full w-full">
        <LeafletMarker position={userGuessLoc} icon="crosshair" />
        <LeafletMarker position={actualLoc} icon="destination" />
        <LeafletPolyline positions={[actualLoc, userGuessLoc]} />
      </Leaflet>

      {/* DEBUG PURPOSES */}
      {/* <div className="absolute inset-0 pointer-events-none z-[1100] flex flex-col items-center justify-center text-center text-white">
        <div className="bg-black bg-opacity-60 rounded-lg p-6 pointer-events-auto">
          <div className="mb-4 text-lg font-semibold">Results</div>
          <p>Your guess was {gameState.lastGuessD} meters away.</p>
          <p>You earned {gameState.lastGuessPoints} points!</p>
        </div>
      </div> */}

      {/* Points Progress Bar at the bottom */}
      <div className="absolute bottom-28 left-0 right-0 mx-4 pointer-events-none z-[1200] backdrop-blur-md bg-opacity-40 shadow-xl">
        <div className="relative bg-slate-500 h-6 rounded-full overflow-hidden shadow-xl">
          {/* Animated progress bar */}
          <div
            className="absolute top-0 left-0 h-6 bg-red-600 transition-[width] duration-700 ease-out shadow-lg z-[1300]"
            style={{ width: `${progress}%` }}
          >
            {/* Points earned text */}
            {gameState && gameState.points > 50 && (
              <div className="absolute right-2 top-0 h-6 flex items-center text-white font-semibold text-xs" style={{ right: "10px" }}>
                +{gameState.lastGuessPoints} points
              </div>
            )}
          </div>

          {/* Markers for 1000-point increments */}
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className="absolute top-0 h-6 border-r border-slate-200 opacity-50 z-[1250]"
              style={{ left: `${(i + 1) * 20}%` }}
            >
              <span style={{ marginRight: '5px'}}>{`${(i + 1) * 1000}`}</span> {/* Add a margin here */}
            </div>
          ))}
        </div>
      </div>





      {/* 'Continue' button */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center pointer-events-auto z-[1300]">
        <button
          className="rounded-full bg-rose-600 px-4 py-2 text-white hover:bg-rose-700"
          onClick={() => {
            if (gameState.complete) {
              setShowEndDialog(true);
            } else {
              onContinue();
              setDialogOpen(false);
            }
          }}
        >
          Continue
        </button>
      </div>

      {showEndDialog && (
        <EndDialog
          gameState={gameState}
          setShowEndDialog={setShowEndDialog}
          clearGameState={clearGameState}
        />
      )}
    </div>
  );
}

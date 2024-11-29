"use client";
import { useEffect, useState } from "react";
import EndDialog from "./EndDialog";
import Leaflet from "@/app/_components/Leaflet";
import LeafletMarker from "@/app/_components/LeafletMarker";
import LeafletPolyline from "@/app/_components/LeafletPolyline";
import latlngToMeters from "@/app/_utils/latlngToMeters";

export default function ResultsDialog({
  setDialogOpen,
  onContinue,
  clearGameState,
  curState,
  goHome,
}) {
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [progress, setProgress] = useState(0);

  const totalPoints = 5000;
  const maxPointsPerRound = 1000;

  const actualLoc = [
    curState.lastGuess.photo.latitude,
    curState.lastGuess.photo.longitude,
  ];
  const userGuessLoc = [
    curState.lastGuess.latitude,
    curState.lastGuess.longitude,
  ];
  const dialogCenter = [
    (actualLoc[0] + userGuessLoc[0]) / 2,
    (actualLoc[1] + userGuessLoc[1]) / 2,
  ];

  const dist = latlngToMeters(
    actualLoc[0],
    actualLoc[1],
    userGuessLoc[0],
    userGuessLoc[1],
  );

  const myZoom = dist < 100 ? 18 : dist < 600 ? 16 : dist < 1000 ? 15 : 14;

  useEffect(() => {
    let start = curState.points - curState.lastGuess.points;
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

  return (
    <div className="fixed inset-0 z-[1000]">
      <Leaflet center={dialogCenter} zoom={myZoom} className="h-full w-full">
        <LeafletMarker position={userGuessLoc} icon="crosshair" />
        <LeafletMarker position={actualLoc} icon="destination" />
        <LeafletPolyline 
          positions={[actualLoc, userGuessLoc]}
          distance={curState.lastGuess.distance}
          onClick={() => setSelectedImage(curState.lastGuess.photo.imageId)}
        />
      </Leaflet>

      /* image overlay */
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[2400] flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={`https://utfs.io/a/e9dxf42twp/${selectedImage}`}
            className="max-h-[80vh] max-w-[80vw] object-contain"
            alt="Round location"
          />
        </div>
      )} 
      
      <div className="pointer-events-none absolute bottom-28 left-0 right-0 z-[1200] mx-4 bg-opacity-40 shadow-xl backdrop-blur-md">
        <div className="relative h-6 rounded-full bg-slate-500 shadow-xl">
          <div
            className="absolute left-0 top-0 z-[1300] h-6 rounded-full bg-rose-600 shadow-lg transition-[width] duration-700 ease-out"
            style={{ width: `${progress}%` }}
          >
            {/* UNCOMMENT THE BELOW OUT IF YOU WANT MORE DETAIL */}
            {/* {(curState.points > 50 && curState.points < 500) && (
              <div
                className="absolute right-2 top-0 flex h-6 items-center text-xs font-semibold text-white"
                style={{ right: "10px" }}
              >
                +{curState.lastGuess.points} points
              </div>
            )}
            {(curState.points >= 500) && (
              <div
                className="absolute right-2 top-0 flex h-6 items-center text-xs font-semibold text-white"
                style={{ right: "10px" }}
              >
                +{curState.lastGuess.points} points ({curState.lastGuess.distance}m away)
              </div>
            )} */}
            {curState.points > 50 && (
              <div
                className="absolute right-2 top-0 flex h-6 items-center text-xs font-semibold text-white"
                style={{ right: "10px" }}
              >
                +{curState.lastGuess.points}
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
              left: `${progress}%`,
              bottom: "-2.5vh",
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              borderRadius: "10px",
              backdropFilter: "blur(10px)",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            ^ You have {curState.points} points!
          </div>
        </div>
      </div>

      <div className="pointer-events-auto absolute bottom-8 left-0 right-0 z-[1300] flex justify-center">
        <button
          className="rounded-full bg-rose-600 px-4 py-2 text-white hover:bg-rose-700"
          onClick={() => {
            if (curState.complete) {
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
          curState={curState}
          setShowEndDialog={setShowEndDialog}
          clearGameState={clearGameState}
          goHome={goHome}
        />
      )}
    </div>
  );
}

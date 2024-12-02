"use client";
import { useEffect, useState } from "react";
import EndDialog from "./EndDialog";
import Leaflet from "@/app/_components/Leaflet";
import LeafletMarker from "@/app/_components/LeafletMarker";
import LeafletPolyline from "@/app/_components/LeafletPolyline";
import MotionButton from "@/app/_components/MotionButton";

export default function ResultsDialog({
  setDialogOpen,
  onContinue,
  clearGameState,
  curState,
  goHome,
  curLobby,
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
    <div className="absolute inset-0 z-[1050] h-full w-full">
      <Leaflet className="h-full w-full">
        <LeafletMarker position={userGuessLoc} icon="crosshair" />
        <LeafletMarker position={actualLoc} icon="destination" />
        <LeafletPolyline
          positions={[actualLoc, userGuessLoc]}
          distance={curState.lastGuess.distance}
          onClick={() => setSelectedImage(curState.lastGuess.photo.imageId)}
        />
      </Leaflet>
      {/* image overlay */}
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
      <div className="pointer-events-none absolute bottom-20 left-0 right-0 z-[1200] mx-4 bg-opacity-40 shadow-xl backdrop-blur-md">
        <div className="relative h-6 rounded-full bg-slate-500 shadow-xl">
          <div
            className="absolute left-0 top-0 z-[1300] h-6 rounded-full bg-rose-600 shadow-lg transition-[width] duration-700 ease-out"
            style={{ width: `${progress}%` }}
          >
            {curState.points > 300 && (
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
              <span className="absolute ml-1 text-white">{`${(i + 1) * 1000}`}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="pointer-events-auto absolute bottom-6 left-0 right-0 z-[1300] flex justify-center">
        <MotionButton
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
        </MotionButton>
      </div>
      {showEndDialog && (
        <EndDialog
          curState={curState}
          setShowEndDialog={setShowEndDialog}
          clearGameState={clearGameState}
          goHome={goHome}
          curLobby={curLobby}
        />
      )}
    </div>
  );
}

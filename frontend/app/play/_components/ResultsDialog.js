"use client";
import { useEffect, useState } from "react";
import EndDialog from "./EndDialog";
import Leaflet from "@/app/_components/Leaflet";
import LeafletMarker from "@/app/_components/LeafletMarker";
import LeafletPolyline from "@/app/_components/LeafletPolyline";
import latlngToMeters from "@/app/_utils/latlngToMeters";
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
    <div className="absolute inset-0 z-[1050] h-full w-full">
      <Leaflet center={dialogCenter} zoom={myZoom} className="h-full w-full">
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
      <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-[1200] m-2 bg-opacity-40">
        <div className="relative h-full w-6 overflow-hidden rounded-full bg-slate-400">
          <div
            className="absolute bottom-0 left-0 w-full rounded-full bg-rose-600 transition-[height] duration-700 ease-out"
            style={{ height: `${progress}%` }} // Correct progress height
          >
            {curState.points > 300 && (
              <div className="relative flex items-center justify-center text-center text-xs text-white">
                +<br />
                {curState.lastGuess.points}
              </div>
            )}
          </div>
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

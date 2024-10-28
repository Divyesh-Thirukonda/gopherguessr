"use client";
import { useState } from "react";
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

  var actualLoc = [
    gameState.allLocsUsed[gameState.allLocsUsed.length - 1]?.latitude,
    gameState.allLocsUsed[gameState.allLocsUsed.length - 1]?.longitude,
  ];
  const [userGuessLoc, setUserGuessLoc] = useState([
    gameState.lastGuessLat,
    gameState.lastGuessLng,
  ]);
  var dialogCenter = [
    (actualLoc[0] + userGuessLoc[0]) / 2,
    (actualLoc[1] + userGuessLoc[1]) / 2,
  ];
  var dist = latlngToMeters(
    actualLoc[0],
    actualLoc[1],
    userGuessLoc[0],
    userGuessLoc[1],
  );
  var myZoom = 0;
  if (dist < 100) {
    myZoom = 18;
  } else if (dist < 600) {
    myZoom = 16;
  } else if (dist < 1000) {
    myZoom = 15;
  } else {
    myZoom = 14;
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md"></div>
      <div className="relative z-[1100] mx-4 w-full max-w-md rounded-lg bg-white p-6 text-center">
        <div className="mb-4 text-lg font-semibold">Results</div>
        <p>Your guess was {gameState.lastGuessD} meters away.</p>
        <p>You earned {gameState.lastGuessPoints} points!</p>
        <div className="mt-4 flex justify-center">
          <Leaflet center={dialogCenter} zoom={myZoom} className="h-96 w-96">
            <LeafletMarker position={userGuessLoc} icon="crosshair" />
            <LeafletMarker position={actualLoc} icon="destination" />
            <LeafletPolyline positions={[actualLoc, userGuessLoc]} />
          </Leaflet>
        </div>
        <button
          className="mt-6 rounded-full bg-rose-600 px-4 py-2 text-white hover:bg-rose-700"
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

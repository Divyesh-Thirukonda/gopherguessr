"use client";
import { MapContainer, Polyline } from "react-leaflet";
import MapImageWrapper from "./MapImageWrapper";
import { useEffect, useRef, useState } from "react";

export default function EndDialog({ gameState }) {
  const map = useRef(null);

  // I DONT THINK WE NEED actuallyShow
  // const [actuallyShow, setActuallyShow] = useState(false);

  // useEffect(() => {
  //     if (gameState.allLocsUsed.length > 0) {
  //         setTimeout(() => setActuallyShow(true), 10);
  //     }
  // }, [gameState.allLocsUsed]);

  // Calculate the center of the map by averaging all the locations
  const calculateMapCenter = (locations) => {
    const latSum = locations.reduce((sum, loc) => sum + loc.latitude, 0);
    const lngSum = locations.reduce((sum, loc) => sum + loc.longitude, 0);
    return [latSum / locations.length, lngSum / locations.length];
  };

  const mapCenter =
    gameState.allLocsUsed.length > 0
      ? calculateMapCenter(gameState.allLocsUsed)
      : [0, 0];

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md"></div>

      {/* Dialog container */}
      <dialog
        className="relative z-[1100] mx-4 w-full max-w-md rounded-lg bg-white p-6 text-center"
        open={true}
      >
        <div className="mb-4 text-lg font-semibold">Game Over!</div>
        <p>You earned {gameState.points} points!</p>

        {gameState.allLocsUsed.length > 0 && (
          <div className="mt-4 flex justify-center">
            <MapContainer
              center={mapCenter}
              minZoom={14}
              zoom={14}
              maxZoom={20}
              scrollWheelZoom={true}
              className="h-96 w-96"
            >
              {gameState.allLocsUsed.map((loc, index) => (
                <>
                  <MapImageWrapper
                    key={index}
                    mapRef={map}
                    guess={[
                      gameState.allGuessesUsed[index][0],
                      gameState.allGuessesUsed[index][1],
                    ]} // Use each location's lat and lng
                    setGuess={() => {}}
                    actualLocation={[loc.latitude, loc.longitude]}
                  />
                  <Polyline
                    positions={[
                      [
                        gameState.allGuessesUsed[index][0],
                        gameState.allGuessesUsed[index][1],
                      ],
                      [loc.latitude, loc.longitude],
                    ]} // Line connecting all locations
                    pathOptions={{
                      color: "black", // Color of the line
                      dashArray: "10, 10", // Dotted line style (alternating dashes)
                      weight: 2, // Line thickness
                    }}
                  />
                </>
              ))}
            </MapContainer>
          </div>
        )}

        {/* <button
                    className="mt-6 py-2 px-4 bg-rose-600 text-white rounded-full hover:bg-rose-700"
                    onClick={() => setDialogOpen(false)}
                >
                    Return Home
                </button> */}

        {/* TODO:
                - implement the return home button
                - add a full screen feature
                - only set complete to true if the last results screen continue is done
                 */}
      </dialog>
    </div>
  );
}

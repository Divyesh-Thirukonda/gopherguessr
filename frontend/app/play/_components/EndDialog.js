"use client";
import { MapContainer, Polyline } from "react-leaflet";
import MapImageWrapper from "./MapImageWrapper";
import { useRef } from "react";

export default function EndDialog({ gameState, setShowEndDialog }) {
  const map = useRef(null);

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
    <div className="fixed inset-0 z-[2000] flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md"></div>

      {/* Dialog container */}
      <dialog
        className="relative z-[2100] w-[90%] max-w-5xl h-[90%] rounded-lg bg-white p-6 text-center overflow-auto"
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
              className="h-[60vh] w-[80vw]" // Responsive map size
            >
              {gameState.allLocsUsed.map((loc, index) => (
                <div key={index}>
                  <MapImageWrapper
                    mapRef={map}
                    guess={[
                      gameState.allGuessesUsed[index][0],
                      gameState.allGuessesUsed[index][1],
                    ]}
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
                    ]}
                    pathOptions={{
                      color: "black",
                      dashArray: "10, 10",
                      weight: 2,
                    }}
                  />
                </div>
              ))}
            </MapContainer>
          </div>
        )}

        {/* Buttons container */}
        <div className="mt-6 flex justify-center space-x-4">
          <button
            className="py-2 px-4 bg-rose-600 text-white rounded-full hover:bg-rose-700"
            onClick={() => {
              setShowEndDialog(false);
              window.location.href = "/";
            }}
          >
            Go Home
          </button>

          <button
            className="py-2 px-4 bg-blue-600 text-white rounded-full hover:bg-blue-700"
            onClick={() => {
              setShowEndDialog(false);
              window.location.href = "/play";
            }}
          >
            Play Again
          </button>
        </div>

        {/* TODO:
          - find a way to call "clear game state" when we click on either button
        */}
      </dialog>
    </div>
  );
}

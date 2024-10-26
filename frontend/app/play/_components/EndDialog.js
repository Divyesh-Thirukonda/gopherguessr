"use client";
import { MapContainer, Polyline } from "react-leaflet";
import MapImageWrapper from "./MapImageWrapper";
import { useRef } from "react";
import { clearGameState } from "../_utils/gameStateUtils";

export default function EndDialog({
  gameState,
  setShowEndDialog,
  setActuallyShow,
}) {
  const map = useRef(null);

  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the Earth in kilometers
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon1 - lon2);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  // Calculate the average distance between guesses and actual locations
  const calculateAverageDistance = () => {
    if (gameState.allLocsUsed.length === 0) return 0;

    const distances = gameState.allLocsUsed.map((loc, index) => {
      return getDistanceFromLatLonInKm(
        loc.latitude,
        loc.longitude,
        gameState.allGuessesUsed[index][0],
        gameState.allGuessesUsed[index][1],
      );
    });

    return distances.reduce((sum, dist) => sum + dist, 0) / distances.length;
  };
  const calculateLargestDistance = () => {
    if (gameState.allLocsUsed.length === 0) return 0;
  
    const distances = gameState.allLocsUsed.map((loc, index) => {
      return getDistanceFromLatLonInKm(
        loc.latitude,
        loc.longitude,
        gameState.allGuessesUsed[index][0],
        gameState.allGuessesUsed[index][1],
      );
    });
  
    // Find the maximum distance using Math.max and the spread operator
    return Math.max(...distances);
  };

  // Calculate the center of the map by averaging all locations and guesses
  const calculateMapCenter = () => {
    if (gameState.allLocsUsed.length === 0) return [0, 0];

    let allPoints = [];
    gameState.allLocsUsed.forEach((loc, index) => {
      allPoints.push([loc.latitude, loc.longitude]);
      allPoints.push(gameState.allGuessesUsed[index]);
    });

    const latSum = allPoints.reduce((sum, point) => sum + point[0], 0);
    const lngSum = allPoints.reduce((sum, point) => sum + point[1], 0);
    return [latSum / allPoints.length, lngSum / allPoints.length];
  };

  // Calculate appropriate zoom level based on average distance
  const dist = calculateLargestDistance();
  const myZoom = dist < 0.1 ? 18 : dist < 0.6 ? 16 : dist < 1 ? 15 : 14;

  const mapCenter = calculateMapCenter();

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md"></div>

      {/* Dialog container */}
      <dialog
        className="relative z-[2100] h-[90%] w-[90%] max-w-5xl overflow-auto rounded-lg bg-white p-6 text-center"
        open={true}
      >
        <div className="mb-4 text-lg font-semibold">Game Over!</div>
        <p>You earned {gameState.points} points!</p>

        {gameState.allLocsUsed.length > 0 && (
          <div className="mt-4 flex justify-center">
            <MapContainer
              center={mapCenter}
              minZoom={14}
              zoom={myZoom}
              maxZoom={20}
              scrollWheelZoom={true}
              className="h-[60vh] w-[80vw]"
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
            className="rounded-full bg-rose-600 px-4 py-2 text-white hover:bg-rose-700"
            onClick={() => {
              clearGameState();
              setShowEndDialog(false);
              setActuallyShow(false);
              window.location.href = "/";
            }}
          >
            Go Home
          </button>

          <button
            className="rounded-full bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            onClick={() => {
              clearGameState();
              setShowEndDialog(false);
              setActuallyShow(false);
              window.location.href = "/play";
            }}
          >
            Play Again
          </button>
        </div>
      </dialog>
    </div>
  );
}

"use client";
import latlngToMeters from "@/app/_utils/latlngToMeters";
import Leaflet from "@/app/_components/Leaflet";
import LeafletMarker from "@/app/_components/LeafletMarker";
import LeafletPolyline from "@/app/_components/LeafletPolyline";
import { useRouter } from "next/navigation";
import MotionButton from "@/app/_components/MotionButton";
import { useEffect, useState } from "react";

export default function EndDialog({ gameState, clearGameState }) {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  const totalPoints = 5000;
  const maxPointsPerRound = 1000;

  // Calculate the average distance between guesses and actual locations
  const calculateAverageDistance = () => {
    if (gameState.allLocsUsed.length === 0) return 0;

    const distances = gameState.allLocsUsed.map((loc, index) => {
      return latlngToMeters(
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
      return latlngToMeters(
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
  const myZoom = dist < 100 ? 18 : dist < 600 ? 16 : dist < 1000 ? 15 : 14;

  const mapCenter = calculateMapCenter();
  
  useEffect(() => {
    let start = gameState.points - gameState.lastGuessPoints;
    const increment = (timestamp) => {
      const incrementValue = Math.min(maxPointsPerRound / 30, 30);
      start = Math.min(start + incrementValue, gameState.points);
      setProgress((start / totalPoints) * 100);

      if (start < gameState.points) {
        requestAnimationFrame(increment);
      }
    };
    requestAnimationFrame(increment);
  }, [gameState.points]);

  return (      
    <div className="fixed inset-0 z-[2000]">

      {gameState.allLocsUsed.length > 0 && (
      <Leaflet
        center={mapCenter}
        zoom={myZoom}
        className="h-full w-full"
      >
        {gameState.allLocsUsed.flatMap((loc, index) => [
          <LeafletMarker
            position={[
              gameState.allGuessesUsed[index][0],
              gameState.allGuessesUsed[index][1],
            ]}
            icon="crosshair"
            key={
              [
                loc.id,
                "guesssMarker",
              ] /* react needs unique keys for every item */
            }
          />,
          <LeafletMarker
            position={[loc.latitude, loc.longitude]}
            icon="destination"
            key={[loc.id, "destMarker"]}
          />,
          <LeafletPolyline
            positions={[
              [
                gameState.allGuessesUsed[index][0],
                gameState.allGuessesUsed[index][1],
              ],
              [loc.latitude, loc.longitude],
            ]}
            key={[loc.id, "line"]}
          />,
        ])}
      </Leaflet> )}


      <div className="pointer-events-none absolute bottom-28 left-0 right-0 z-[2200] mx-4 bg-opacity-40 shadow-xl backdrop-blur-md">
        <div className="relative h-6 rounded-full bg-slate-500 shadow-xl">
          <div
            className="absolute left-0 top-0 z-[2300] h-6 rounded-full bg-rose-600 shadow-lg transition-[width] duration-700 ease-out"
            style={{ width: `${progress}%` }}
          >
            {gameState && gameState.points > 50 && (
              <div
                className="absolute right-2 top-0 flex h-6 items-center text-xs font-semibold text-white"
                style={{ right: "10px" }}
              >
                +{gameState.lastGuessPoints}
              </div>
            )}
          </div>

          {Array.from({ length: 4 }, (_, i) => (
            <div
              key={i}
              className="absolute top-0 z-[2250] h-6 border-r border-slate-200 opacity-50"
              style={{ left: `${(i + 1) * 20}%` }}
            >
              <span className="absolute ml-1">{`${(i + 1) * 1000}`}</span>
            </div>
          ))}

          {/* Text below the triangle */}
          <div
            className="absolute z-[2260] px-4 text-center font-semibold text-red-700"
            style={{
              left: `${progress}%`,
              bottom: "-2.5vh",
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              borderRadius: "10px",
              backdropFilter: "blur(10px)",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            ^ You have {gameState.points} points!
          </div>
        </div>
      </div>

      <div className="pointer-events-auto absolute bottom-8 left-0 right-0 z-[2300] flex justify-center">
        <form action={clearGameState}>
          <MotionButton className="rounded-full bg-rose-600 px-4 py-2 text-white hover:bg-rose-700" type="submit">Play Again</MotionButton>
        </form>
      </div>
    </div>
  );
}

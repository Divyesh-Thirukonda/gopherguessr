"use client";
import latlngToMeters from "@/app/_utils/latlngToMeters";
import Leaflet from "@/app/_components/Leaflet";
import LeafletMarker from "@/app/_components/LeafletMarker";
import LeafletPolyline from "@/app/_components/LeafletPolyline";
import { useRouter } from "next/navigation";
import MotionButton from "@/app/_components/MotionButton";

export default function EndDialog({ gameState, clearGameState }) {
  const router = useRouter();

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

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md"></div>

      {/* Dialog container */}
      <dialog
        className="relative z-[2100] h-[90%] w-[90%] max-w-5xl overflow-auto rounded-lg bg-white p-6 text-center"
        open={true}
      >
        <div className="mb-4 text-lg font-semibold">Game Over!</div>
        <p>
          You earned {gameState.points} / {(gameState.round - 1) * 1000} points!
        </p>

        {gameState.allLocsUsed.length > 0 && (
          <div className="mt-4 flex justify-center">
            <Leaflet
              center={mapCenter}
              zoom={myZoom}
              className="h-[60vh] w-[80vw]"
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
            </Leaflet>
          </div>
        )}

        {/* Buttons container */}
        <div className="mt-6 flex justify-center space-x-4">
          <form action={clearGameState}>
            <MotionButton type="submit">Play Again</MotionButton>
          </form>
        </div>
      </dialog>
    </div>
  );
}

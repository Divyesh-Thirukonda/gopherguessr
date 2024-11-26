"use client";
import latlngToMeters from "@/app/_utils/latlngToMeters";
import Leaflet from "@/app/_components/Leaflet";
import LeafletMarker from "@/app/_components/LeafletMarker";
import LeafletPolyline from "@/app/_components/LeafletPolyline";
import { useRouter } from "next/navigation";
import MotionButton from "@/app/_components/MotionButton";
import { useEffect, useState } from "react";

export default function EndDialog({ clearGameState, curState, goHome }) {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  const totalPoints = 5000;
  const maxPointsPerRound = 1000;

  const calculateLargestDistance = () => {
    return Math.max(curState.guesses.map((guess) => guess.distance));
  };

  // Calculate the center of the map by averaging all locations and guesses
  const calculateMapCenter = () => {
    let allPoints = [];
    curState.guesses.forEach((guess) => {
      allPoints.push([guess.photo.latitude, guess.photo.latitude]);
      allPoints.push([guess.latitude, guess.longitude]);
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
    <div className="fixed inset-0 z-[2000]">
      <Leaflet
        center={[44.97528, -93.23538]}
        zoom={16}
        className="h-full w-full"
      >
        {curState.guesses.flatMap((guess, index) => [
          <LeafletMarker
            position={[guess.latitude, guess.longitude]}
            icon="crosshair"
            key={
              [
                guess.id,
                "guesssMarker",
              ] /* react needs unique keys for every item */
            }
          />,
          <LeafletMarker
            position={[guess.photo.latitude, guess.photo.longitude]}
            icon="destination"
            key={[guess.id, "destMarker"]}
          />,
          <LeafletPolyline
            positions={[
              [guess.latitude, guess.longitude],
              [guess.photo.latitude, guess.photo.longitude],
            ]}
            key={[guess.id, "line"]}
          />,
        ])}
      </Leaflet>

      <div className="pointer-events-none absolute bottom-28 left-0 right-0 z-[2200] mx-4 bg-opacity-40 shadow-xl backdrop-blur-md">
        <div className="relative h-6 rounded-full bg-slate-500 shadow-xl">
          <div
            className="absolute left-0 top-0 z-[2300] h-6 rounded-full bg-rose-600 shadow-lg transition-[width] duration-700 ease-out"
            style={{ width: `${progress}%` }}
          >
            {curState.points > 50 && (
              <div
                className="absolute right-2 top-0 flex h-6 items-center text-xs font-semibold text-white"
                style={{ right: "10px" }}
              >
                {curState.points}
              </div>
            )}
          </div>

          {Array.from({ length: 4 }, (_, i) => (
            <div
              key={i}
              className="absolute top-0 z-[2250] h-6 border-r border-slate-200 opacity-50"
              style={{ left: `${(i + 1) * 20}%` }}
            >
              {/* <span className="text-white absolute ml-1">{`${(i + 1) * 1000}`}</span> */}
            </div>
          ))}
        </div>
      </div>

      <div className="pointer-events-auto absolute bottom-8 left-0 right-0 z-[2300] flex justify-center gap-3">
        <form action={clearGameState}>
          <MotionButton
            className="rounded-full bg-rose-600 px-4 py-2 text-white hover:bg-rose-700"
            type="submit"
          >
            Play Again
          </MotionButton>
        </form>
        <form action={goHome}>
          <MotionButton
            className="rounded-full bg-rose-600 px-4 py-2 text-white hover:bg-rose-700"
            type="submit"
          >
            Go Home
          </MotionButton>
        </form>
      </div>
    </div>
  );
}

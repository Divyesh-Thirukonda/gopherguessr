"use client";
import latlngToMeters from "@/app/_utils/latlngToMeters";
import Leaflet from "@/app/_components/Leaflet";
import LeafletMarker from "@/app/_components/LeafletMarker";
import LeafletPolyline from "@/app/_components/LeafletPolyline";
import { useRouter } from "next/navigation";
import MotionButton from "@/app/_components/MotionButton";
import { useEffect, useState } from "react";

export default function EndDialog({
  clearGameState,
  curState,
  goHome,
  curLobby,
}) {
  const [progress, setProgress] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);

  const totalPoints = 5000;
  const maxPointsPerRound = 1000;

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

  function viewMultiplayerLeaderboard() {
    console.log(curLobby);
    let path = "/lobby?code=" + curLobby.code + "&showLeaderboard=1";
    window.location.replace(path);
  }

  return (
    <div className="absolute inset-0 z-[2000]">
      <Leaflet className="h-full w-full">
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
            distance={guess.distance}
            onClick={() => setSelectedImage(guess.photo.imageId)}
          />,
        ])}
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
      <div className="pointer-events-none absolute bottom-20 left-0 right-0 z-[2200] mx-4 bg-opacity-40 shadow-xl backdrop-blur-md">
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
                {curState.points} points!
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="pointer-events-auto absolute bottom-6 left-0 right-0 z-[2300] flex justify-center gap-3">
        {!curLobby && (
          <form action={clearGameState}>
            <MotionButton
              className="rounded-full bg-rose-600 px-4 py-2 text-white hover:bg-rose-700"
              type="submit"
            >
              Play Again
            </MotionButton>
          </form>
        )}
        {!curLobby && (
          <form action={goHome}>
            <MotionButton
              className="rounded-full bg-rose-600 px-4 py-2 text-white hover:bg-rose-700"
              type="submit"
            >
              Go Home
            </MotionButton>
          </form>
        )}
        {curLobby && (
          <form action={viewMultiplayerLeaderboard}>
            <MotionButton
              className="rounded-full bg-rose-600 px-4 py-2 text-white hover:bg-rose-700"
              type="submit"
            >
              View Standings
            </MotionButton>
          </form>
        )}
      </div>
    </div>
  );
}

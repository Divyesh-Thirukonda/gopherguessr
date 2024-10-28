"use client";

import Image from "next/image";
import ResizeableMap from "./ResizeableMap";

function getFullUrl(id) {
  return `https://utfs.io/a/e9dxf42twp/${id}`;
}

export default function ImageView({ submitGuess, gameState, clearGameState }) {
  return (
    <>
      <div className="relative flex h-dvh w-dvw items-center justify-center bg-gray-500">
        {!gameState.complete && (
          <>
            <div>
              <Image
                fill
                src={getFullUrl(gameState.loc.imageId)}
                className="blur-xl"
                alt="Blurry guess image."
              />
            </div>
            <Image
              fill
              src={getFullUrl(gameState.loc.imageId)}
              className="h-full w-full object-contain object-center"
              alt="Guess image."
            />
          </>
        )}
      </div>
      <ResizeableMap
        gameState={gameState}
        clearGameState={clearGameState}
        submitGuess={submitGuess}
      />
    </>
  );
}

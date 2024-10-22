"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import ResizeableMap from "./ResizeableMap";

function getFullUrl(id) {
  return `https://utfs.io/a/e9dxf42twp/${id}`;
}

export default function ImageView({ submitGuess, gameState }) {
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    if (gameState.loc) {
      setPhoto(gameState.loc);
    }
  }, [gameState.loc]);

  if (!photo) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="relative flex h-dvh w-dvw items-center justify-center bg-gray-500">
        <div>
          <Image fill src={getFullUrl(photo.imageId)} className="blur-xl" />
        </div>
        <Image
          fill
          src={getFullUrl(photo.imageId)}
          className="h-full w-full object-contain object-center"
        />
      </div>
      <ResizeableMap gameState={gameState} submitGuess={submitGuess} />
    </>
  );
}

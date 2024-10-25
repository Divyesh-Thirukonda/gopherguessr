// THIS IS JUST A MOCKUP
// DELETE IN PRODUCTION

import Image from "next/image";
import prisma from "../_utils/db";
import { gameState } from "../_utils/tempDb";
import ResizeableMap from "../play/_components/ResizeableMap";

export const dynamic = "force-dynamic";

function getFullUrl(id) {
  return `https://utfs.io/a/e9dxf42twp/${id}`;
}

export default async function ImageTest() {
  const allPhotos = await prisma.photo.findMany();
  // get random photo
  const photo = allPhotos[Math.floor(Math.random() * allPhotos.length)];

  // this doesn't do anything its just here to pass to the map
  async function submitGuess() {
    "use server";
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

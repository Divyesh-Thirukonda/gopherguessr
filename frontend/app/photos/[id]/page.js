// individual photo page
// this is pretty much a mock up for now
// TODO: add editing, deletion functionality

import prisma from "@/app/_utils/db";
import Image from "next/image";
import BackButton from "./_components/BackButton";

function getFullUrl(id) {
  return `https://utfs.io/a/e9dxf42twp/${id}`;
}

export default async function Page(props) {
  const params = await props.params;
  const photo = await prisma.photo.findFirst({
    where: { id: parseInt(params.id, 10) },
  });

  return (
    <div className="p-3">
      <BackButton />
      <h1 className="mt-3 text-3xl font-medium">{photo.buildingName}</h1>
      <div className="relative h-96 w-96">
        <Image
          src={getFullUrl(photo.imageId)}
          className="h-full w-full object-contain object-center"
          fill
          alt={photo.buildingName}
        />
      </div>
    </div>
  );
}

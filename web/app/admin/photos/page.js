// page to show a table of all the images

import prisma from "@/app/_utils/db";
import Table from "./_components/Table";

export default async function PhotosIndex() {
  const allPhotos = await prisma.photo.findMany({
    orderBy: {
      id: "asc",
    },
    include: {
      uploader: true,
      _count: {
        select: { guesses: true },
      },
    },
  });

  return <Table allPhotos={allPhotos} />;
}

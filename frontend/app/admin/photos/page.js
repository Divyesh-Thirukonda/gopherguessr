// page to render the map of all photos
/* 
  this is a server component and all its doing is
  loading the info of all our photos from our database and passing it to the Map client component
*/

import prisma from "@/app/_utils/db";
import MapView from "./_components/MapView";

export default async function PhotosIndex() {
  const allPhotos = await prisma.photo.findMany({});

  return <MapView allPhotos={allPhotos} />;
}

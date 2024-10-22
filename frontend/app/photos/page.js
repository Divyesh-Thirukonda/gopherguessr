// page to render the map of all photos
/* 
  this is a server component and all its doing is
  loading the info of all our photos from our database and passing it to the Map client component
*/

import dynamicImport from "next/dynamic";
import prisma from "../_utils/db";

// import dynamic here as we can't do ssr on leaflet
const Map = dynamicImport(() => import("./_components/Map"), {
  ssr: false,
});

export default async function PhotosIndex() {
  const allPhotos = await prisma.photo.findMany({});
  return <Map allPhotos={allPhotos} />;
}

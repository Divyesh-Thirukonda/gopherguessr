"use client";
import "leaflet/dist/leaflet.css";
import dynamicImport from "next/dynamic";

const Leaflet = dynamicImport(() => import("@/app/_components/Leaflet"), {
  ssr: false,
});
const LeafletMarker = dynamicImport(
  () => import("@/app/_components/LeafletMarker"),
  {
    ssr: false,
  },
);

export default function MapView({ allPhotos }) {
  return (
    <Leaflet center={[44.97528, -93.23538]}>
      {allPhotos.map((loc) => (
        <LeafletMarker
          position={[loc.latitude, loc.longitude]}
          icon="destination"
          key={loc.id}
          onClick={(e) => window.open(`/photos/${e.target.id}`)}
          id={loc.id}
        />
      ))}
    </Leaflet>
  );
}

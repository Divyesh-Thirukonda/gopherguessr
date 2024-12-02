"use client";
import dynamicImport from "next/dynamic";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  return (
    <Leaflet className="h-dvh max-h-[calc(100dvh-3rem)] w-dvw">
      {allPhotos.map((loc) => (
        <LeafletMarker
          position={[loc.latitude, loc.longitude]}
          icon="destination"
          key={loc.id}
          onClick={(e) => router.push(`/admin/photos/${e.target.id}`)}
          id={loc.id}
        />
      ))}
    </Leaflet>
  );
}

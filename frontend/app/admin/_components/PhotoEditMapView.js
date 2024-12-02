"use client";
import Loading from "@/app/_components/Loading";
import MotionButton from "@/app/_components/MotionButton";
import { FloppyDisk } from "@phosphor-icons/react/dist/ssr";
import dynamicImport from "next/dynamic";
import { useMemo, useState, useTransition } from "react";

const Leaflet = dynamicImport(() => import("@/app/_components/Leaflet"), {
  ssr: false,
});
const LeafletMarker = dynamicImport(
  () => import("@/app/_components/LeafletMarker"),
  {
    ssr: false,
  },
);

export default function MapView({ photo, updateLocation }) {
  const [position, setPosition] = useState([photo.latitude, photo.longitude]);

  // memoize center to prevent map from jumping around every render
  const memoizedCenter = useMemo(
    () => [photo.latitude, photo.longitude],
    [photo],
  );

  // for pending state
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <Leaflet
        center={memoizedCenter}
        zoom={16}
        onClick={(e) => setPosition([e.latlng.lat, e.latlng.lng])}
        className="h-80 w-full"
      >
        <LeafletMarker position={position} icon="destination" />
      </Leaflet>
      <MotionButton
        onClick={() =>
          startTransition(() => updateLocation(position[0], position[1]))
        }
        className="absolute bottom-6 left-0 right-0 z-[1000] flex items-center gap-1.5"
      >
        <FloppyDisk className="h-5 w-5" />
        Update Location
      </MotionButton>
      {isPending && (
        <div className="absolute inset-0 z-[1100] flex items-center justify-center bg-white bg-opacity-50 backdrop-blur">
          <Loading />
        </div>
      )}
    </>
  );
}

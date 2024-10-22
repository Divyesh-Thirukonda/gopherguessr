// pretty similar to our MapWrapper component in /play
// just simplified because we don't need all the extra stuff here
// TODO: consolidate this and the MapWrapper component

"use client";
import { useRef } from "react";
import MapMarkerWrapper from "../_components/MapMarkerWrapper";
import { MapContainer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function Map({ allPhotos }) {
  const mapRef = useRef(null);

  return (
    <MapContainer
      center={[44.97528, -93.23538]}
      minZoom={15}
      zoom={16}
      maxZoom={20}
      scrollWheelZoom={true}
      className="h-dvh w-dvw"
    >
      <MapMarkerWrapper mapRef={mapRef} allPhotos={allPhotos} />
    </MapContainer>
  );
}

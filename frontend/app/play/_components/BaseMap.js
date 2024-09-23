"use client";

import { MapContainer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import BaseImageOverlay from "./BaseImageOverlay";

export default function BaseMap({ imgSrc, bounds, center, setGuess, guess }) {
  return (
    <MapContainer
      center={center}
      zoom={16}
      scrollWheelZoom={true}
      className="h-dvh w-dvw"
    >
      <BaseImageOverlay
        imgSrc={imgSrc}
        bounds={bounds}
        center={center}
        setGuess={setGuess}
        guess={guess}
      />
    </MapContainer>
  );
}

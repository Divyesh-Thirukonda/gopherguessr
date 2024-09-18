"use client";

import { MapContainer, ImageOverlay } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function BaseMap({ imgSrc, bounds }) {
  return (
    <MapContainer
      center={[
        bounds[1][0] - (bounds[1][0] - bounds[0][0]) / 2,
        bounds[1][1] - (bounds[1][1] - bounds[0][1]) / 2,
      ]}
      zoom={16}
      scrollWheelZoom={true}
      className="w-dvw h-dvh"
    >
      <ImageOverlay
        attribution='Map &copy; <a target="_blank" href="https://egis.umn.edu/pdfmaps/Gopher-Way-Map.pdf">Regents of the University of Minnesota</a>'
        url={imgSrc}
        bounds={bounds}
        opacity={1}
        zIndex={10}
      />
    </MapContainer>
  );
}

"use client";

import { MapContainer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import BaseImageOverlay from "./BaseImageOverlay";

// taken from https://stackoverflow.com/questions/639695/how-to-convert-latitude-or-longitude-to-meters
function latlngToMeters(lat1, lon1, lat2, lon2) {
  var R = 6378.137; // Radius of earth in KM
  var dLat = (lat2 * Math.PI) / 180 - (lat1 * Math.PI) / 180;
  var dLon = (lon2 * Math.PI) / 180 - (lon1 * Math.PI) / 180;
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d * 1000; // meters
}

export default function BaseMap({ imgSrc, bounds, loc }) {
  const center = [
    bounds[1][0] - (bounds[1][0] - bounds[0][0]) / 2,
    bounds[1][1] - (bounds[1][1] - bounds[0][1]) / 2,
  ];
  const [guess, setGuess] = useState(center);

  // eventually run this calculation server side so people can't cheat
  useEffect(() => {
    const d = latlngToMeters(guess[0], guess[1], loc.lat, loc.lng);
    console.log(loc.name, d);
  }, [guess]);

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
        guess={guess}
        setGuess={setGuess}
      />
    </MapContainer>
  );
}

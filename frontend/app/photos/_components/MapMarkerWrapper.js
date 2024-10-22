// pretty similar to our MapImageWrapper component in /play
// but added in rendering a marker for every photo
// TODO: consolidate this and the MapImageWrapper into one unified component that is reusable

"use client";

import { useEffect } from "react";
import { useMap, ImageOverlay } from "react-leaflet";
import L from "leaflet";
import { leafletLayer as protomapsLayer, paintRules } from "protomaps-leaflet";
import customMapTheme from "../../play/_utils/customMapTheme";
import CustomMarker from "./CustomMarker";

const DestinationIcon = L.icon({
  iconUrl: "/cacheable/flag-20241001.svg",
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

export default function MapImageWrapper({ mapRef, allPhotos }) {
  const layer = protomapsLayer({
    url: "/cacheable/umn-20240926.pmtiles",
    paintRules: paintRules(customMapTheme),
  });
  const map = useMap();

  // this runs once (you can tell because that dependency array at the end is empty)
  useEffect(() => {
    // this sets our mapRef so we can manipulate the Leaflet map from MapWrapper
    mapRef.current = map;
    // this adds our map images (from Protomaps) to the Leaflet map
    layer.addTo(map);
  }, []);

  return (
    <>
      <ImageOverlay
        url={"/cacheable/eastbank-boundary-20240926.svg"}
        bounds={[
          [44.96929, -93.24221],
          [44.98447, -93.21487],
        ]}
        opacity={1}
        zIndex={10}
      />
      <ImageOverlay
        url={"/cacheable/westbank-boundary-20240926.svg"}
        bounds={[
          [44.96694, -93.24794],
          [44.97608, -93.2394],
        ]}
        opacity={1}
        zIndex={10}
      />
      <ImageOverlay
        url={"/cacheable/stpaul-boundary-20240926.svg"}
        bounds={[
          [44.97583, -93.18943],
          [44.99236, -93.17329],
        ]}
        opacity={1}
        zIndex={10}
      />
      {allPhotos.map((photo) => (
        <CustomMarker
          key={photo.id}
          photo={photo}
          DestinationIcon={DestinationIcon}
        />
      ))}
    </>
  );
}

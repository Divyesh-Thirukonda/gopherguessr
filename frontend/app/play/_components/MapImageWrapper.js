/*
  What is this file?:
    A React Component
      It is in the folder /app/play/_components because it is only used on the /play page.
      The underscore in the _components folder tells Next.js not to serve the files directly to the client.
      This prevents users from, for example, loading JUST our MapImageWrapper.
      Think of it like a private method in Java, 
      It needs to be part of something bigger (our MapWrapper component and then our page.js file) to be accessible.
      Learn more here: 
        https://nextjs.org/docs/app/building-your-application/routing/colocation#private-folders
  Server component or client component?:
    Client Component
      We know it's a Client Component because "use client"; is the first line of the file,
      but also because the only place we import it is another Client Component.
      We need this to be a Client Component because were using React Hooks, which need to run on the client.
  What are we using this file for?:
    This Component renders our crosshair, building labels & dashed red boundaries, and the actual images for our map.
    The only reason this is a seperate component (from MapWrapper) is because Leaflet forces you to do it that way.
    This is imported into our MapWrapper component.
*/

// we don't technically need to say "use client" here as this is only imported into another client component
// i just like to do it to make things clear
"use client";

import { useEffect } from "react";
import { useMap, useMapEvents, ImageOverlay, Marker } from "react-leaflet";
import L from "leaflet";
import { leafletLayer as protomapsLayer, paintRules } from "protomaps-leaflet";
import customMapTheme from "../_utils/customMapTheme";

// this is how leaflet lets you set a custom icon for a map marker
const CrosshairIcon = L.icon({
  iconUrl: "/cacheable/crosshair-20240927.svg",
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});
const DestinationIcon = L.icon({
  iconUrl: "/cacheable/flag-20241001.svg",
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

/*
  This sets up our map images using Protomaps Basemaps.
  Protomaps Basemaps is an open source map based on OpenStreetMap data.
  Learn more about Protomaps here:
    https://docs.protomaps.com/basemaps/downloads
*/

export default function MapImageWrapper({
  mapRef,
  guess,
  setGuess,
  actualLocation,
}) {
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

  // this is a hook that leaflet provides that allows you to set an event listener on the map
  // we use it to listen for a click on the map, and update our guess state.
  useMapEvents({
    click(e) {
      setGuess([e.latlng.lat, e.latlng.lng]);
    },
  });

  // the imageoverlays below include the building labels and dashed red boundaries
  // i made them with google drawings lol
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
      <Marker position={guess} icon={CrosshairIcon} />

      {actualLocation && (
        <Marker position={actualLocation} icon={DestinationIcon} />
      )}
    </>
  );
}

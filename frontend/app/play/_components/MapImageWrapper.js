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
    This Component renders our crosshair and the actual image for our map.
    The only reason this is a seperate component (from MapWrapper) is because Leaflet forces you to do it that way.
    This is imported into our MapWrapper component.
*/

// we don't technically need to say "use client" here as this is only imported into another client component
// i just like to do it to make things clear
"use client";

import { useMapEvents, ImageOverlay, Marker } from "react-leaflet";
import L from "leaflet";

// this is how leaflet lets you set a custom icon for a map marker
const CrosshairIcon = L.icon({
  iconUrl: "/images/crosshair.svg",
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

export default function BaseImageOverlay({ imgSrc, bounds, guess, setGuess }) {
  // this is a hook that leaflet provides that allows you to set an event listener on the map
  // we use it to listen for a click on the map, and update our guess state.
  useMapEvents({
    click(e) {
      setGuess([e.latlng.lat, e.latlng.lng]);
    },
  });

  return (
    <>
      <ImageOverlay
        attribution='Map &copy; <a target="_blank" href="https://egis.umn.edu/pdfmaps/Gopher-Way-Map.pdf">Regents of the University of Minnesota</a>'
        url={imgSrc}
        bounds={bounds}
        opacity={1}
        zIndex={10}
      />
      <Marker position={guess} icon={CrosshairIcon} />
    </>
  );
}

import { useMapEvents, ImageOverlay, Marker } from "react-leaflet";
import L from "leaflet";

export default function BaseImageOverlay({ imgSrc, bounds, guess, setGuess }) {
  const CrosshairIcon = L.icon({
    iconUrl: "/images/crosshair.svg",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

  const map = useMapEvents({
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
        onClick={(e) => console.log(e.latlng)}
      />
      {guess ? <Marker position={guess} icon={CrosshairIcon} /> : null}
    </>
  );
}

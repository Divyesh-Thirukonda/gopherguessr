import { useEffect, useRef } from "react";
import L from "leaflet";

// lets set all the marker icons here so they're easier to use in multiple places
const icons = {
  crosshair: L.icon({
    iconUrl: "/cacheable/crosshair-20240927.svg",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  }),
  destination: L.icon({
    iconUrl: "/cacheable/flag-20241027-1216.svg",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  }),
};

export default function LeafletMarker({ position, icon, mapRef, onClick, id }) {
  const marker = useRef(null);

  useEffect(() => {
    if (mapRef.current) {
      // automatically update when position updated
      if (marker.current) {
        marker.current.remove();
      }
      marker.current = L.marker(position, { icon: icons[icon] }).addTo(
        mapRef.current,
      );
      // add id for use during event handlers
      marker.current.id = id;
      // add an onclick handler
      marker.current.on("click", (e) => {
        onClick && onClick(e);
      });
    }
    // prevent memory leak
    return () => {
      if (mapRef.current && marker.current) {
        marker.current.remove();
      }
    };
  }, [mapRef.current, position]);

  // we don't need to return anything, all this component does is add a marker when mounted and remove it when unmounted
  return <></>;
}

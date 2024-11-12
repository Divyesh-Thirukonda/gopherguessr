import { useEffect, useRef } from "react";
import L from "leaflet";

export default function LeafletPolyline({ positions, mapRef }) {
  const line = useRef(null);
  useEffect(() => {
    if (mapRef.current) {
      // automatically update when positions updated
      if (line.current) {
        line.current.remove();
      }
      line.current = L.polyline(positions, {
        color: "black",
        dashArray: "10, 10",
        weight: 3,
      }).addTo(mapRef.current);
    }
    // prevent memory leak
    /* return () => {
      if (mapRef.current && line.current) {
        line.current.remove();
      }
    }; */
  }, [mapRef.current, positions]);

  // we don't need to return anything, all this component does is add a marker when mounted and remove it when unmounted
  return <></>;
}

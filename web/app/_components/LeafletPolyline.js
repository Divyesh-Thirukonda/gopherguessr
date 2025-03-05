import { useEffect, useRef } from "react";
import L from "leaflet";

export default function LeafletPolyline({ positions, mapRef, distance, onClick}) {
  const line = useRef(null);
  const hoverLine = useRef(null);
  
  useEffect(() => {
    if (mapRef.current) {
      // automatically update when positions updated
      if (line.current) {
        line.current.remove();
      }
      if (hoverLine.current) {
        hoverLine.current.remove();
      }

      // creates transparent line, much easier to hover this way
      // increase weight if u want it to be easier to hover
      hoverLine.current = L.polyline(positions, {
        color: "transparent",
        weight: 35,
      }).addTo(mapRef.current);

      // Create the visible polyline
      line.current = L.polyline(positions, {
        color: "black",
        dashArray: "10, 10",
        weight: 3,
      }).addTo(mapRef.current);

      // actual tooltip
      hoverLine.current.bindTooltip(
        `<div style="font-size: 24px; font-weight: bold;">${distance}m away!</div>`, 
        {
          permanent: false,
          direction: 'top',
          className: 'bg-rose-600 px-8 py-6 rounded-2xl shadow-2xl text-white min-w-[200px] text-center',
          opacity: 1
        }
      );

      if(onClick) {
        hoverLine.current.on('click', onClick);
      }
    }
    
    // prevent memory leak
    return () => {
      if (mapRef.current) {
        if (line.current) line.current.remove();
        if (hoverLine.current) hoverLine.current.remove();
      }
    };
  }, [mapRef.current, positions, distance, onClick]);

  return null;
}

// this needs to be a seperate component for the event handlers to work
// as every marker has its own photo it links to

import { useMemo, useRef } from "react";
import { Marker } from "react-leaflet";

export default function CustomMarker({ photo, DestinationIcon }) {
  const markerRef = useRef(null);

  const eventHandlers = useMemo(
    () => ({
      click() {
        window.open(`/photos/${markerRef.current.options.dataId}`);
      },
    }),
    [],
  );

  return (
    <Marker
      position={[photo.latitude, photo.longitude]}
      icon={DestinationIcon}
      eventHandlers={eventHandlers}
      ref={markerRef}
      dataId={photo.id}
    ></Marker>
  );
}

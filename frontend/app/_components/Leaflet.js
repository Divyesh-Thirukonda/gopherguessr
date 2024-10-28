// breaking out of react-leaflet because it has issues with newer versions of react
// and also everything is so much cleaner when we do it this way
// like i can update the center AUTOMATICALLY without having to do a bunch of crap in MapWrapper

"use client";
import { useState, Children, cloneElement } from "react";
import "leaflet/dist/leaflet.css";
import { useRef, useEffect } from "react";
import { leafletLayer as protomapsLayer, paintRules } from "protomaps-leaflet";
import customMapTheme from "../_utils/customMapTheme";
import L from "leaflet";

export default function Leaflet({
  onClick,
  center,
  zoom,
  className,
  children,
}) {
  const [renderChildren, setRenderChildren] = useState(false);
  const divRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) {
      // create the map if only it doesn't already exist
      mapRef.current = L.map(divRef.current, {
        center,
        zoom: zoom || 16,
        minZoom: 14,
        maxZoom: 20,
      });
      // get our custom protomaps tileset
      const layer = protomapsLayer({
        url: "/cacheable/umn-20240926.pmtiles",
        paintRules: paintRules(customMapTheme),
      });
      layer.addTo(mapRef.current);
      // add boundary lines
      L.imageOverlay(
        "/cacheable/westbank-boundary-20240926.svg",
        [
          [44.96694, -93.24794],
          [44.97608, -93.2394],
        ],
        { opacity: 1, zIndex: 10 },
      ).addTo(mapRef.current);
      L.imageOverlay(
        "/cacheable/eastbank-boundary-20240926.svg",
        [
          [44.96929, -93.24221],
          [44.98447, -93.21487],
        ],
        { opacity: 1, zIndex: 10 },
      ).addTo(mapRef.current);
      L.imageOverlay(
        "/cacheable/stpaul-boundary-20240926.svg",
        [
          [44.97583, -93.18943],
          [44.99236, -93.17329],
        ],
        { opacity: 1, zIndex: 10 },
      ).addTo(mapRef.current);
      // add an onclick handler
      mapRef.current.on("click", (e) => {
        onClick && onClick(e);
      });
    }
    // prevent memory leak (delete leaflet instance on unmount)
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // to update the center automatically
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(center, 16);
    }
  }, [center]);

  // wait to render children until map loaded
  useEffect(() => {
    if (mapRef.current._loaded) {
      setRenderChildren(true);
    }
  }, [mapRef.current?._loaded]);

  return (
    <>
      <div ref={divRef} className={className || "h-dvh w-dvw"}>
        {renderChildren &&
          Children.map(children, (child) =>
            cloneElement(child, {
              mapRef,
            }),
          )}
      </div>
    </>
  );
}

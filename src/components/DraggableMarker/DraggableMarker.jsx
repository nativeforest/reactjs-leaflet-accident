import react, { useMemo, useCallback, useState, useRef } from "react";
import React from "react";
import { LatLng, LatLngBounds } from "leaflet";
import {
  Map,
  MapContainer,
  TileLayer,
  CircleMarker,
  Marker,
  Popup
} from "react-leaflet";

const center = {
  lat: 4.595911000000002,
  lng: -74.12117349999999
};
export default function DraggableMarker() {
  const [draggable, setDraggable] = useState(true);
  const [position, setPosition] = useState(center);
  const markerRef = useRef(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          setPosition(marker.getLatLng());
          console.log(position);
          console.log("-->", marker.getLatLng());
        }
      }
    }),
    []
  );
  const toggleDraggable = useCallback(() => {
    setDraggable(d => !d);
    // console.log(position);
  }, []);

  return (
    <Marker
      draggable={draggable}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
    >
      <Popup minWidth={90}>
        <span onClick={toggleDraggable}>
          {draggable ? "arrastralo a la ubicación" : "punto del suceso"}
        </span>
      </Popup>
    </Marker>
  );
}

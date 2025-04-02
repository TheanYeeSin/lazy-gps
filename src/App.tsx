import "./App.css";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LeafletControlGeocoder } from "./components";
import { useEffect, useMemo, useRef, useState } from "react";
import L, { LeafletMouseEvent, LatLng } from "leaflet";

const App = () => {
  const [startLocation, setStartLocation] = useState<LatLng | null>(null);
  const [endLocation, setEndLocation] = useState<LatLng | null>(null);
  const [distance, setDistance] = useState<string | null>(null);

  const startMarkerRef = useRef<L.Marker | null>(null);
  const endMarkerRef = useRef<L.Marker | null>(null);

  const LocationMarker: React.FC = () => {
    useMapEvents({
      click(e: LeafletMouseEvent) {
        if (!startLocation) {
          setStartLocation(new L.LatLng(e.latlng.lat, e.latlng.lng));
        } else if (!endLocation) {
          setEndLocation(new L.LatLng(e.latlng.lat, e.latlng.lng));
        }
      },
    });
    return null;
  };

  const calculateDistance = () => {
    if (startLocation && endLocation) {
      const dist = startLocation.distanceTo(endLocation) / 1000;
      setDistance(dist.toFixed(2));
    }
  };

  useEffect(() => {
    calculateDistance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startLocation, endLocation]);

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <div>{distance && <p>Distance: {distance} km</p>}</div>
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
        <LeafletControlGeocoder />
        {startLocation && (
          <Marker
            position={startLocation}
            draggable
            ref={startMarkerRef}
            eventHandlers={{
              dragend: () => {
                if (startMarkerRef.current) {
                  const newPos = startMarkerRef.current.getLatLng();
                  setStartLocation(newPos);
                }
              },
            }}
          >
            <Popup>Start Location</Popup>
          </Marker>
        )}
        {endLocation && (
          <Marker
            position={endLocation}
            draggable
            ref={endMarkerRef}
            eventHandlers={{
              dragend: () => {
                if (endMarkerRef.current) {
                  const newPos = endMarkerRef.current.getLatLng();
                  setEndLocation(newPos);
                }
              },
            }}
          >
            <Popup>End Location</Popup>
          </Marker>
        )}
        {startLocation && endLocation && (
          <Polyline positions={[startLocation, endLocation]} />
        )}
      </MapContainer>
    </div>
  );
};

export default App;

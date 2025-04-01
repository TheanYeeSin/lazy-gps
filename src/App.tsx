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
import { useState } from "react";
import L, { LeafletMouseEvent, LatLng } from "leaflet";

const App = () => {
  const [startLocation, setStartLocation] = useState<LatLng | null>(null);
  const [endLocation, setEndLocation] = useState<LatLng | null>(null);
  const [distance, setDistance] = useState<string | null>(null);

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

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
        <LeafletControlGeocoder />
        {startLocation && (
          <Marker position={startLocation}>
            <Popup>Start Location</Popup>
          </Marker>
        )}
        {endLocation && (
          <Marker position={endLocation}>
            <Popup>End Location</Popup>
          </Marker>
        )}
        {startLocation && endLocation && (
          <Polyline positions={[startLocation, endLocation]} />
        )}
      </MapContainer>
      <div>
        <button
          onClick={calculateDistance}
          disabled={!startLocation || !endLocation}
        >
          Calculate Distance
        </button>
        {distance && <p>Distance: {distance} km</p>}
      </div>
    </div>
  );
};

export default App;

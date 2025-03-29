import Geocoder, { geocoders } from "leaflet-control-geocoder";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";



const LeafletControlGeocoder = () => {
  const map = useMap();

  useEffect(() => {
    const existingGeocoder = document.querySelector(
      ".leaflet-control-geocoder",
    );
    if (existingGeocoder) return;

    const GeocoderControl = new Geocoder({
      geocoder: new geocoders.Nominatim(),
      position: "topleft",
    }).addTo(map);

    return () => {
      map.removeControl(GeocoderControl);
    };
  }, [map]);

  return null;
};

export default LeafletControlGeocoder;

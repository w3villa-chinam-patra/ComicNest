import { useEffect } from "react";
import { useMap } from "react-leaflet";

const MapAutoCenter = ({ latlng }: { latlng: [number, number] }) => {
  const map = useMap();

  useEffect(() => {
    if (latlng) {
      map.setView(latlng, map.getZoom(), {
        animate: true,
      });
    }
  }, [latlng, map]);

  return null;
};

export default MapAutoCenter;

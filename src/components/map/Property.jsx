import { useContext, useEffect } from "react";
import { MapContext } from "./Map";

const Property = ({ data }) => {
  const map = useContext(MapContext);

  useEffect(() => {
    if (data) {
      const feature = {
        type: "Feature",
        id: data.enrollment,
        geometry: {
          type: "LineString",
          coordinates: data.geometry.coordinates[0],
        },
        properties: {},
      };

      const config = {
        type: "geoJson",
        data: [feature],
        opacity: 1,
        style: {
          strokeColor: "#333",
          weight: 2,
        },
        index: 1,
      };

      const layer = map.createLayer(config);

      map.addLayer(layer);
      map.fitBounds(map.getLayersBounds(), { padding: 100, duration: 0 });

      return () => {
        map.removeLayer(layer);
      };
    }
  }, [map, data]);

  return null;
};

export default Property;

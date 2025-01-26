import { useContext, useEffect } from "react";
import bbox from "@turf/bbox";
import { MapContext } from "./Map";

const layerId = "property";

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

      map.addSource(layerId, {
        type: "geojson",
        data: feature,
      });

      map.addLayer({
        id: layerId,
        type: "line",
        source: layerId,
        layout: {},
        paint: {
          "line-color": "#333",
          "line-width": 2,
        },
      });

      map.fitBounds(bbox(feature), { padding: 150, duration: 0 });

      return () => {
        map.removeLayer(layerId);
        map.removeSource(layerId);
      };
    }
  }, [map, data]);

  return null;
};

export default Property;

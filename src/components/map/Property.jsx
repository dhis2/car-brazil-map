import { useContext, useMemo, useEffect } from "react";
import bbox from "@turf/bbox";
import { MapContext } from "./Map";
import { DrawContext } from "./DrawControl";

const layerId = "property";

const Property = ({ data, editMode }) => {
  const map = useContext(MapContext);
  const draw = useContext(DrawContext);

  const feature = useMemo(
    () => ({
      type: "Feature",
      id: data.enrollment,
      geometry: {
        type: "LineString",
        coordinates: data.geometry.coordinates[0],
      },
      properties: {},
    }),
    [data]
  );

  useEffect(() => {
    const source = map.getSource(layerId);

    if (source) {
      source.setData(feature);
    } else {
      map.addSource(layerId, {
        type: "geojson",
        data: feature,
      });
    }

    map.fitBounds(bbox(feature), { padding: 100, duration: 0 });
  }, [map, feature]);

  useEffect(() => {
    if (editMode) {
      draw.add(feature);
      draw.changeMode("simple_select", { featureIds: [feature.id] });

      return () => {
        draw.deleteAll();
      };
    } else {
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

      return () => {
        map.removeLayer(layerId);
      };
    }
  }, [map, draw, feature, editMode]);

  return null;
};

export default Property;

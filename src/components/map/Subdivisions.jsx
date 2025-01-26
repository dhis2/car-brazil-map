import { useContext, useEffect } from "react";
import { MapContext } from "./Map";
import useLandTypes from "../../hooks/useLandTypes";

const layerId = "subdivisions";

const Subdivisions = ({ data }) => {
  const map = useContext(MapContext);
  const landTypes = useLandTypes(data?.program);

  useEffect(() => {
    if (data && landTypes) {
      const features = data.events.map(({ programStage, geometry }) => {
        const landType = landTypes.find((t) => t.id === programStage);

        return {
          type: "Feature",
          id: programStage,
          geometry,
          properties: {
            ...landType,
          },
        };
      });

      map.addSource(layerId, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features,
        },
      });

      const before = map.getStyle().layers[1]?.id;

      map.addLayer(
        {
          id: layerId,
          type: "fill",
          source: layerId,
          layout: {},
          paint: {
            "fill-color": ["get", "color"],
            "fill-opacity": 0.4,
            "fill-outline-color": "#333",
          },
        },
        before
      );

      return () => {
        map.removeLayer(layerId);
        map.removeSource(layerId);
      };
    }
  }, [map, data, landTypes]);

  return null;
};

export default Subdivisions;

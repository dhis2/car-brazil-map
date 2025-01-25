import { useContext, useEffect } from "react";
import { MapContext } from "./Map";
import getLandTypes from "../../hooks/getLandTypes";

const Subdivisions = ({ data }) => {
  const map = useContext(MapContext);
  const landTypes = getLandTypes(data?.program);

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

      const config = {
        type: "geoJson",
        data: features,
        opacity: 0.5,
        style: {
          strokeColor: "#333",
          weight: 1,
        },
        hoverLabel: "{name}",
      };

      map.addLayer(map.createLayer(config));
      map.fitBounds(map.getLayersBounds());
    }
  }, [map, data, landTypes]);

  return null;
};

export default Subdivisions;

import { useContext, useEffect } from "react";
import bbox from "@turf/bbox";
import { createPropertyFeature } from "./utils/geoJson.js";
import { MapContext } from "./Map.jsx";

const MapBounds = ({ data }) => {
  const map = useContext(MapContext);

  useEffect(() => {
    map.fitBounds(bbox(createPropertyFeature(data)), {
      padding: 100,
      duration: 0,
    });
  }, [map, data]);

  return null;
};

export default MapBounds;

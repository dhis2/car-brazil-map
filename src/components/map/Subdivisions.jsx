import { useContext, useCallback, useEffect } from "react";
import { Popup } from "maplibre-gl";
import { MapContext } from "./Map";
import useLandTypes from "../../hooks/useLandTypes";

const layerId = "subdivisions";

const Subdivisions = ({ data }) => {
  const map = useContext(MapContext);
  const landTypes = useLandTypes(data?.program);

  const onClick = useCallback(
    (evt) =>
      new Popup()
        .setLngLat(evt.lngLat)
        .setText(evt.features[0].properties.name)
        .addTo(map),
    []
  );

  const onMouseEnter = useCallback(
    () => (map.getCanvas().style.cursor = "pointer"),
    [map]
  );

  const onMouseLeave = useCallback(
    () => (map.getCanvas().style.cursor = ""),
    [map]
  );

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

      map.on("click", layerId, onClick);
      map.on("mouseenter", layerId, onMouseEnter);
      map.on("mouseleave", layerId, onMouseLeave);

      return () => {
        map.off("click", layerId, onClick);
        map.off("mouseenter", layerId, onMouseEnter);
        map.off("mouseleave", layerId, onMouseLeave);

        map.removeLayer(layerId);
        map.removeSource(layerId);
      };
    }
  }, [map, data, landTypes, onClick, onMouseEnter, onMouseLeave]);

  return null;
};

export default Subdivisions;

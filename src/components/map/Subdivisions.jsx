import { useContext, useMemo, useCallback, useEffect } from "react";
import { Popup } from "maplibre-gl";
import { MapContext } from "./Map";
import { DrawContext } from "./DrawControl";

const layerId = "subdivisions";

const Subdivisions = ({ data, landTypes, editMode }) => {
  const map = useContext(MapContext);
  const draw = useContext(DrawContext);

  const featureCollection = useMemo(
    () => ({
      type: "FeatureCollection",
      features: data.events
        .filter((feature) => feature.geometry)
        .map(({ programStage, geometry }) => {
          const landType = landTypes.find((t) => t.id === programStage);
          const { name, style } = landType;
          const color = style?.color || "#ccc";

          return {
            type: "Feature",
            id: programStage,
            geometry,
            properties: {
              name,
              color,
            },
          };
        }),
    }),
    [data, landTypes]
  );

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
    const source = map.getSource(layerId);

    if (source) {
      source.setData(featureCollection);
    } else {
      map.addSource(layerId, {
        type: "geojson",
        data: featureCollection,
      });
    }
  }, [map, featureCollection]);

  useEffect(() => {
    if (editMode) {
      draw.set(featureCollection);

      return () => {
        draw.deleteAll();
      };
    } else {
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
        map.getStyle().layers[1]?.id
      );

      return () => {
        map.removeLayer(layerId);
      };
    }
  }, [map, draw, featureCollection, editMode]);

  useEffect(() => {
    map.on("click", layerId, onClick);
    map.on("mouseenter", layerId, onMouseEnter);
    map.on("mouseleave", layerId, onMouseLeave);

    return () => {
      map.off("click", layerId, onClick);
      map.off("mouseenter", layerId, onMouseEnter);
      map.off("mouseleave", layerId, onMouseLeave);
    };
  }, [map, onClick, onMouseEnter, onMouseLeave]);

  return null;
};

export default Subdivisions;

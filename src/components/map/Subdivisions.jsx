import { useContext, useMemo, useCallback, useEffect } from "react";
import { Popup } from "maplibre-gl";
import area from "@turf/area";
import { MapContext } from "./Map";
import { DrawContext } from "./DrawControl";

const layerId = "subdivisions";

const Subdivisions = ({ features, editMode, onChange }) => {
  const map = useContext(MapContext);
  const draw = useContext(DrawContext);

  const onClick = useCallback((evt) => {
    const [feature] = evt.features;
    const { name } = feature.properties;
    const hectares = Math.round(area(feature) * 0.0001 * 100) / 100;

    new Popup()
      .setLngLat(evt.lngLat)
      .setHTML(`${name}<br />${hectares} ha`)
      .addTo(map);
  }, []);

  const onMouseEnter = useCallback(
    () => (map.getCanvas().style.cursor = "pointer"),
    [map]
  );

  const onMouseLeave = useCallback(
    () => (map.getCanvas().style.cursor = ""),
    [map]
  );

  const onPropertyChange = useCallback(
    (evt) => {
      const [feature] = evt.features;

      onChange({
        type: "FeatureCollection",
        features: features.features.map((f) =>
          f.id === feature.id ? feature : f
        ),
      });
    },
    [features]
  );

  const onDrawSelectionChange = useCallback(({ features }) => {
    const [feature] = features;

    if (feature) {
      // Force "DIRECT SELECT" mode as we operate on one feature at a time
      draw.changeMode(draw.modes.DIRECT_SELECT, {
        featureId: feature.id,
      });
    }
  }, []);

  useEffect(() => {
    const source = map.getSource(layerId);

    if (source) {
      source.setData(features);
    } else {
      map.addSource(layerId, {
        type: "geojson",
        data: features,
      });
    }
  }, [map, features]);

  useEffect(() => {
    if (editMode === "divisions") {
      draw.set(features);

      return () => {
        draw.deleteAll();
      };
    }
  }, [map, draw, features, editMode]);

  useEffect(() => {
    if (editMode !== "divisions") {
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
        map.getStyle().layers[2]?.id
      );

      return () => {
        map.removeLayer(layerId);
      };
    }
  }, [map, editMode]);

  useEffect(() => {
    if (!editMode) {
      map.on("click", layerId, onClick);
      map.on("mouseenter", layerId, onMouseEnter);
      map.on("mouseleave", layerId, onMouseLeave);

      return () => {
        map.off("click", layerId, onClick);
        map.off("mouseenter", layerId, onMouseEnter);
        map.off("mouseleave", layerId, onMouseLeave);
      };
    }
  }, [map, editMode, onClick, onMouseEnter, onMouseLeave]);

  useEffect(() => {
    if (editMode === "divisions") {
      map.on("draw.selectionchange", onDrawSelectionChange);
      map.on("draw.update", onPropertyChange);

      return () => {
        map.off("draw.selectionchange", onDrawSelectionChange);
        map.off("draw.update", onPropertyChange);
      };
    }
  }, [map, editMode, onDrawSelectionChange, onPropertyChange]);

  return null;
};

export default Subdivisions;

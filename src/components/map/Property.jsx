import { useContext, useCallback, useEffect } from "react";
import { MapContext } from "./Map";
import { DrawContext } from "./DrawControl";

const layerId = "property";

const Property = ({ feature, editMode, onChange }) => {
  const map = useContext(MapContext);
  const draw = useContext(DrawContext);

  const onPropertyChange = useCallback((evt) => onChange(evt.features[0]), []);

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
  }, [map, feature]);

  useEffect(() => {
    if (editMode) {
      draw.add(feature);
      draw.changeMode(draw.modes.DIRECT_SELECT, { featureId: feature.id });

      return () => {
        draw.deleteAll();
      };
    }
  }, [map, draw, editMode, feature, onPropertyChange]);

  useEffect(() => {
    if (!editMode) {
      map.addLayer(
        {
          id: layerId,
          type: "line",
          source: layerId,
          layout: {},
          paint: {
            "line-color": "#333",
            "line-width": 2,
          },
        },
        map.getStyle().layers[1]?.id
      );

      return () => {
        map.removeLayer(layerId);
      };
    }
  }, [map, editMode]);

  useEffect(() => {
    if (editMode) {
      map.on("draw.update", onPropertyChange);

      return () => {
        map.off("draw.update", onPropertyChange);
      };
    }
  }, [map, editMode, onPropertyChange]);

  return null;
};

export default Property;

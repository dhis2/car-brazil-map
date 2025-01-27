import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import {
  SnapPolygonMode,
  SnapPointMode,
  SnapLineMode,
  SnapModeDrawStyles,
  SnapDirectSelect,
} from "mapbox-gl-draw-snap-mode";
import { MapContext } from "./Map";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

MapboxDraw.constants.classes.CONTROL_BASE = "maplibregl-ctrl";
MapboxDraw.constants.classes.CONTROL_PREFIX = "maplibregl-ctrl-";
MapboxDraw.constants.classes.CONTROL_GROUP = "maplibregl-ctrl-group";

export const DrawContext = createContext(null);

const DrawControl = ({ children }) => {
  const [draw, setDraw] = useState(null);
  const map = useContext(MapContext);

  const onDrawModeChange = useCallback(
    (evt) =>
      (map.getCanvas().style.cursor =
        evt.mode === "draw_polygon" ? "crosshair" : ""),
    [map]
  );

  useEffect(() => {
    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
      modes: {
        ...MapboxDraw.modes,
        draw_point: SnapPointMode,
        draw_polygon: SnapPolygonMode,
        draw_line_string: SnapLineMode,
        direct_select: SnapDirectSelect,
      },
      // Styling guides
      styles: SnapModeDrawStyles,
      userProperties: true,
      // Config snapping features
      snap: true,
      /*
      snapOptions: {
        snapPx: 15, // defaults to 15
        snapToMidPoints: true, // defaults to false
        snapVertexPriorityDistance: 0.0025, // defaults to 1.25
        snapGetFeatures: (map, draw) => [
          ...map.queryRenderedFeatures({ layers: ["not-editable-layer-name"] }),
          ...draw.getAll().features,
        ], // defaults to all features from the draw layer (draw.getAll().features)
      },
      */
      guides: false,
    });

    map.addControl(draw, "top-right");

    map.on("draw.modechange", onDrawModeChange);

    setDraw(draw);

    return () => {
      map.off("draw.modechange", onDrawModeChange);
      map.removeControl(draw);
    };
  }, [map, onDrawModeChange]);

  return <DrawContext.Provider value={draw}>{children}</DrawContext.Provider>;
};

export default DrawControl;

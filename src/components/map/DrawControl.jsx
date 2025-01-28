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
    ({ mode }) =>
      (map.getCanvas().style.cursor =
        mode === "draw_polygon" ? "crosshair" : ""),
    [map, draw]
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
      snapOptions: {
        snapPx: 10,
        snapToMidPoints: true,
        snapVertexPriorityDistance: 0.0025,
        snapGetFeatures: (map, draw) => [
          ...(map.getLayer("property")
            ? map.queryRenderedFeatures({ layers: ["property"] })
            : []),
          ...draw.getAll().features,
        ],
      },
      guides: false,
    });

    map.addControl(draw, "top-right");

    setDraw(draw);

    return () => {
      map.removeControl(draw);
    };
  }, [map]);

  useEffect(() => {
    if (draw) {
      map.on("draw.modechange", onDrawModeChange);
      return () => {
        map.off("draw.modechange", onDrawModeChange);
      };
    }
  }, [draw]);

  return <DrawContext.Provider value={draw}>{children}</DrawContext.Provider>;
};

export default DrawControl;

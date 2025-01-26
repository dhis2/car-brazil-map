import { createContext, useState, useRef, useEffect } from "react";
import {
  Map as MapGL,
  NavigationControl,
  AttributionControl,
  ScaleControl,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export const MapContext = createContext(null);

const Map = ({ children }) => {
  const [map, setMap] = useState(null);
  const mapEl = useRef(null);

  useEffect(() => {
    const map = new MapGL({
      container: mapEl.current,
      style: {
        version: 8,
        sources: {},
        layers: [],
      },
      attributionControl: false,
    });

    map.addControl(
      new NavigationControl({
        showCompass: false,
      })
    );

    map.addControl(
      new AttributionControl({
        compact: true,
        customAttribution: "",
      })
    );

    map.addControl(new ScaleControl());

    // Disable map rotation using right click + drag
    map.dragRotate.disable();

    // Disable map rotation using touch rotation gesture
    map.touchZoomRotate.disableRotation();

    map.once("load", () => setMap(map));

    return () => {
      map.remove();
    };
  }, [mapEl]);

  return (
    <MapContext.Provider value={map}>
      <div
        ref={mapEl}
        style={{
          width: "100vw",
          height: "calc(100vh - 68px)",
          borderTop: "1px solid #ccc",
        }}
      >
        {map && children}
      </div>
    </MapContext.Provider>
  );
};

export default Map;

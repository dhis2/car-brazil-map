import { createContext, useState, useRef, useEffect } from "react";
import MapApi from "@dhis2/maps-gl";

export const MapContext = createContext(null);

const Map = ({ children }) => {
  const [map, setMap] = useState(null);
  const mapEl = useRef(null);

  useEffect(() => {
    const map = new MapApi(mapEl.current);

    map.once("ready", () => setMap(map));
    map.resize();

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

import { useState, useContext, useEffect } from "react";
import { MapContext } from "./Map";
import useSystemSettings from "../../hooks/getSystemSettings";
import styles from "./styles/BasemapControl.module.css";

const basemaps = [
  {
    id: "osmlight",
    name: "OSM Light",
    image: "osmlight.png",
    config: {
      type: "tileLayer",
      url: "//cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    },
  },
  {
    id: "osm",
    name: "OpenStreetMap",
    image: "osm.png",
    config: {
      type: "tileLayer",
      url: "//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    },
  },
  {
    id: "bingaerial",
    name: "Bing Aerial",
    image: "bingaerial.jpg",
    config: {
      type: "bingLayer",
      style: "Aerial",
    },
  },
  {
    id: "binghybrid",
    name: "Bing Hybrid",
    image: "binghybrid.jpg",
    config: {
      type: "bingLayer",
      style: "AerialWithLabelsOnDemand",
    },
  },
];

const BasemapControl = () => {
  const [basemapId, setBasemapId] = useState("osmlight");
  const map = useContext(MapContext);
  const { settings } = useSystemSettings();
  const bingMapsKey = settings?.keyBingMapsApiKey;

  useEffect(() => {
    if (!(basemapId.includes("bing") && !bingMapsKey)) {
      const { config } = basemaps.find(({ id }) => id === basemapId);

      const layer = map.createLayer({
        ...config,
        id: basemapId,
        ...(config.type === "bingLayer" && { apiKey: bingMapsKey }),
        index: 0,
      });

      map.addLayer(layer);

      return () => {
        map.removeLayer(layer);
      };
    }
  }, [map, basemapId, bingMapsKey]);

  return (
    <div className={styles.basemap}>
      {basemaps.map(({ id, image }) => (
        <span
          key={id}
          onClick={() => setBasemapId(id)}
          className={id === basemapId ? styles.selected : ""}
        >
          <img src={`images/map/${image}`} />
        </span>
      ))}
    </div>
  );
};

export default BasemapControl;

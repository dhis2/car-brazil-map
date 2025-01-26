import { useState, useContext, useEffect } from "react";
import { MapContext } from "./Map";
import useBingSource from "../../hooks/useBingSource";
import styles from "./styles/BasemapControl.module.css";

const basemaps = [
  {
    id: "osmlight",
    name: "OSM Light",
    image: "osmlight.png",
    url: "//cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
  },
  {
    id: "osm",
    name: "OpenStreetMap",
    image: "osm.png",
    url: "//a.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
  {
    id: "bingaerial",
    name: "Bing Aerial",
    image: "bingaerial.jpg",
    style: "Aerial",
  },
  {
    id: "binghybrid",
    name: "Bing Hybrid",
    image: "binghybrid.jpg",
    style: "AerialWithLabelsOnDemand",
  },
];

const layerId = "basemap";

const BasemapControl = () => {
  const map = useContext(MapContext);
  const [basemapId, setBasemapId] = useState("osmlight");
  const basemap = basemaps.find(({ id }) => id === basemapId);
  const bingSource = useBingSource(basemap.style);

  useEffect(() => {
    if (!(basemap.id.includes("bing") && !bingSource)) {
      map.addSource(
        layerId,
        bingSource || {
          type: "raster",
          tiles: [basemap.url],
          tileSize: 256,
          attribution: basemap.attribution,
        }
      );

      map.addLayer(
        {
          id: layerId,
          type: "raster",
          source: layerId,
          minzoom: 0,
          maxzoom: 22,
        },
        map.getStyle().layers[0]?.id
      );

      return () => {
        map.removeLayer(layerId);
        map.removeSource(layerId);
      };
    }
  }, [map, basemap, bingSource]);

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

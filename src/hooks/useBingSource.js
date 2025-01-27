import { useState, useEffect } from "react";
import useSystemSettings from "./useSystemSettings";

const bingStyles = ["Aerial", "AerialWithLabelsOnDemand"];

// https://stackoverflow.com/questions/75623330/bing-maps-as-layer-on-maplibre-gl
const useBingSource = (style) => {
  const [source, setSource] = useState(null);

  const { settings } = useSystemSettings();
  const bingMapsKey = settings?.keyBingMapsApiKey;

  useEffect(() => {
    setSource(null);

    if (bingStyles.includes(style) && bingMapsKey) {
      // https://docs.microsoft.com/en-us/bingmaps/rest-services/common-parameters-and-types/supported-culture-codes
      const culture = "pt-BR";
      const url = `https://dev.virtualearth.net/REST/V1/Imagery/Metadata/${style}?output=json&include=ImageryProviders&culture=${culture}&key=${bingMapsKey}&uriScheme=https`;

      fetch(url)
        .then((response) => response.json())
        .then((response) => {
          const tileInfo = response.resourceSets[0].resources[0];

          const tileUrls = tileInfo.imageUrlSubdomains.map((sub) =>
            tileInfo.imageUrl.replace("{subdomain}", sub)
          );

          const attribution = tileInfo.imageryProviders
            .map((p) => p.attribution)
            .join(", ");

          setSource({
            type: "raster",
            tiles: tileUrls,
            tileSize: tileInfo.imageWidth,
            attribution,
            minzoom: 1,
            maxzoom: 20,
          });
        });
    }
  }, [style, bingMapsKey]);

  return source;
};

export default useBingSource;

import { useState, useEffect } from "react";
import { apiUrl } from "../App";

// TODO: Possible to get color from programStage instead of hardcoding it
const landColors = {
  gXYpyK2TRE0: {
    color: "green",
  },
  Ezy7Dnc9KZA: {
    color: "orange",
  },
  wL6KHeaejIu: {
    color: "grey",
  },
  Sl0BKifTMwK: {
    color: "yellow",
  },
  bTECPklv5LB: {
    color: "blue",
  },
  Ocp0IZFahqO: {
    color: "purple",
  },
};

const getLandTypes = (programId) => {
  const [landTypes, setLandTypes] = useState(null);

  // https://implement.im.dhis2.org/car-brazil/api/41/programs/aE4f3D6PZlN?fields=access,featureType,trackedEntityType[displayName,access],programStages[id,name,access,color]
  useEffect(() => {
    if (programId) {
      fetch(
        `${apiUrl}programs/${programId}.json?fields=access,featureType,trackedEntityType[displayName,access],programStages[id,name,access,color]`
      )
        .then((response) => response.json())
        .then((data) =>
          data.programStages.map((ps) => ({
            ...ps,
            color: landColors[ps.id]?.color,
          }))
        )
        .then(setLandTypes);
    }
  }, [programId]);

  return landTypes;
};

export default getLandTypes;

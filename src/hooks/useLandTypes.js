import { useState, useEffect } from "react";
import { useDataQuery } from "@dhis2/app-runtime";

// https://implement.im.dhis2.org/car-brazil/api/41/programs/aE4f3D6PZlN?fields=access,featureType,trackedEntityType[displayName,access],programStages[id,name,access,style[color]]
const QUERY = {
  program: {
    resource: "programs",
    id: ({ id }) => id,
    params: {
      fields:
        "access,featureType,trackedEntityType[displayName,access],programStages[id,name,access,style[color]]",
    },
  },
};

const useLandTypes = (programId) => {
  const [data, setData] = useState(null);

  const { refetch } = useDataQuery(QUERY, {
    lazy: true,
    onComplete: (data) => setData(data.program.programStages),
  });

  useEffect(() => {
    if (programId) {
      refetch({ id: programId });
    }
  }, [programId, refetch]);

  return data;
};

export default useLandTypes;

import { useState, useEffect } from "react";
import { apiUrl } from "../App";

const usePropertyData = (propertyId) => {
  const [property, setProperty] = useState(null);

  // https://implement.im.dhis2.org/car-brazil/api/41/tracker/enrollments/LO09N3sRW8Q?fields=enrollment,trackedEntity,program,status,orgUnit
  useEffect(() => {
    fetch(
      `${apiUrl}tracker/enrollments/${propertyId}.json?fields=enrollment,trackedEntity,program,status,orgUnit`
    )
      .then((response) => response.json())
      .then((data) => {
        const { enrollment, program, trackedEntity /*, orgUnit */ } = data;

        // https://implement.im.dhis2.org/car-brazil/api/41/tracker/trackedEntities/BKHGD5wz9Tr?program=aE4f3D6PZlN&fields=enrollments
        fetch(
          `${apiUrl}tracker/trackedEntities/${trackedEntity}.json?program=${program}&fields=enrollments`
        )
          .then((response) => response.json())
          .then((data) =>
            data.enrollments.find((e) => e.enrollment === enrollment)
          )
          .then(setProperty);
      });
  }, [propertyId]);

  return property;
};

export default usePropertyData;

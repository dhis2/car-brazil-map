import { useState, useEffect } from "react";
import { useDataQuery } from "@dhis2/app-runtime";
import useEnrollmentData from "./useEnrollmentData";

// https://implement.im.dhis2.org/car-brazil/api/41/tracker/trackedEntities/BKHGD5wz9Tr?program=aE4f3D6PZlN&fields=enrollments
const QUERY = {
  trackedEntity: {
    resource: "tracker/trackedEntities/",
    id: ({ trackedEntity }) => trackedEntity,
    params: ({ program }) => ({
      program,
      fields: "enrollments",
    }),
  },
};

const usePropertyData = (enrollmentId) => {
  const [property, setProperty] = useState(null);
  const data = useEnrollmentData(enrollmentId);

  const { refetch } = useDataQuery(QUERY, {
    lazy: true,
    onComplete: ({ trackedEntity }) =>
      setProperty(
        trackedEntity.enrollments.find((e) => e.enrollment === enrollmentId)
      ),
  });

  useEffect(() => {
    if (data) {
      refetch(data.enrollment);
    }
  }, [data, refetch]);

  return property;
};

export default usePropertyData;

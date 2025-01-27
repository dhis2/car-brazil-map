import { useDataQuery } from "@dhis2/app-runtime";

// https://implement.im.dhis2.org/car-brazil/api/41/tracker/enrollments/LO09N3sRW8Q?fields=enrollment,trackedEntity,program,status,orgUnit
const QUERY = {
  enrollment: {
    resource: "tracker/enrollments",
    id: (id) => id,
    params: {
      fields: "enrollment,trackedEntity,program,status,orgUnit",
    },
  },
};

const useEnrollmentData = (id) => {
  const { data } = useDataQuery(QUERY, {
    variables: id,
  });

  return data;
};

export default useEnrollmentData;

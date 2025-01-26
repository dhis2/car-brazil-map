import { useDataQuery } from "@dhis2/app-runtime";

const QUERY = {
  systemSettings: {
    resource: "systemSettings",
    params: {
      key: "keyBingMapsApiKey",
    },
  },
};

const useSystemSettings = () => {
  const { loading, error, data } = useDataQuery(QUERY);

  return {
    settings: data?.systemSettings,
    error,
    loading,
  };
};

export default useSystemSettings;

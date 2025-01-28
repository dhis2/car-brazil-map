export const createPropertyFeature = (data) => ({
  type: "Feature",
  id: data.enrollment,
  geometry: {
    type: "LineString",
    coordinates: data.geometry.coordinates[0],
  },
  properties: {},
});

export const createDivisionFeatures = (data, landTypes) => ({
  type: "FeatureCollection",
  features: data.events
    .filter((feature) => feature.geometry)
    .map(({ programStage, geometry }) => {
      const landType = landTypes.find((t) => t.id === programStage);
      const { name, style } = landType;
      const color = style?.color || "#ccc";

      return {
        type: "Feature",
        id: programStage,
        geometry,
        properties: {
          name,
          color,
        },
      };
    }),
});

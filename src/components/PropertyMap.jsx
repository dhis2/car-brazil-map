import { useState, useEffect } from "react";
import bbox from "@turf/bbox";
import Map from "./map/Map.jsx";
import MapBounds from "./map/MapBounds.jsx";
import BasemapControl from "./map/BasemapControl.jsx";
import Property from "./map/Property.jsx";
import Subdivisions from "./map/Subdivisions.jsx";
import DrawControl from "./map/DrawControl.jsx";
import EditMode from "./map/EditMode.jsx";
import {
  createPropertyFeature,
  createDivisionFeatures,
} from "./map/utils/geoJson.js";
import usePropertyData from "../hooks/usePropertyData.js";
import useLandTypes from "../hooks/useLandTypes";

const propertyId = "LO09N3sRW8Q";

const PropertyMap = () => {
  const [propertyFeature, setPropertyFeature] = useState(null);
  const [divisionFeatures, setDivisionFeatures] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const data = usePropertyData(propertyId);
  const landTypes = useLandTypes(data?.program);

  useEffect(() => {
    setPropertyFeature(data ? createPropertyFeature(data) : null);
  }, [data]);

  useEffect(() => {
    setDivisionFeatures(
      data && landTypes ? createDivisionFeatures(data, landTypes) : null
    );
  }, [data, landTypes]);

  return (
    <div>
      <div
        style={{
          height: 20,
          fontSize: 14,
          lineHeight: "20px",
          paddingLeft: 5,
        }}
      >
        Enrollment: {propertyId}
      </div>
      <Map>
        {data && <MapBounds data={data} />}
        <EditMode editMode={editMode} setEditMode={setEditMode} />
        <DrawControl>
          {propertyFeature && (
            <Property
              feature={propertyFeature}
              editMode={editMode === "property"}
              onChange={setPropertyFeature}
            />
          )}
          {divisionFeatures && (
            <Subdivisions
              features={divisionFeatures}
              editMode={editMode}
              onChange={setDivisionFeatures}
            />
          )}
          <BasemapControl />
        </DrawControl>
      </Map>
    </div>
  );
};

export default PropertyMap;

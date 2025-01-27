import { useState } from "react";
import Map from "./map/Map.jsx";
import BasemapControl from "./map/BasemapControl.jsx";
import Property from "./map/Property.jsx";
import Subdivisions from "./map/Subdivisions.jsx";
import DrawControl from "./map/DrawControl.jsx";
import EditMode from "./map/EditMode.jsx";
import usePropertyData from "../hooks/usePropertyData.js";
import useLandTypes from "../hooks/useLandTypes";

const propertyId = "LO09N3sRW8Q";

const PropertyMap = () => {
  const [editMode, setEditMode] = useState(false);
  const data = usePropertyData(propertyId);
  const landTypes = useLandTypes(data?.program);

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
        <EditMode editMode={editMode} setEditMode={setEditMode} />
        <DrawControl>
          {data && (
            <>
              <Property data={data} editMode={editMode === "property"} />
              {landTypes && (
                <Subdivisions
                  data={data}
                  landTypes={landTypes}
                  editMode={editMode === "divisions"}
                />
              )}
            </>
          )}
          <BasemapControl />
        </DrawControl>
      </Map>
    </div>
  );
};

export default PropertyMap;

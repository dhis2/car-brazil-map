import Map from "./map/Map.jsx";
import BasemapControl from "./map/BasemapControl.jsx";
import Property from "./map/Property.jsx";
import Subdivisions from "./map/Subdivisions.jsx";
import DrawControl from "./map/DrawControl.jsx";
import usePropertyData from "../hooks/usePropertyData.js";

const propertyId = "LO09N3sRW8Q";

const PropertyMap = () => {
  const data = usePropertyData(propertyId);

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
        {data && (
          <>
            <Property data={data} />
            <Subdivisions data={data} />
          </>
        )}
        <BasemapControl />
        <DrawControl />
      </Map>
    </div>
  );
};

export default PropertyMap;

import React from "react";
import PropertyMap from "./components/PropertyMap";
import classes from "./App.module.css";

export const apiUrl = "/car-brazil/api/41/";

const MyApp = () => (
  <div className={classes.container}>
    <PropertyMap />
  </div>
);

export default MyApp;

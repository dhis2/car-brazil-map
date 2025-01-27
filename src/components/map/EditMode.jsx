import { Button } from "@dhis2/ui";
import classes from "./styles/EditMode.module.css";

const EditMode = ({ editMode, setEditMode }) => (
  <div className={classes.buttons}>
    <Button
      small
      toggled={editMode === "property"}
      onClick={() => setEditMode(editMode === "property" ? null : "property")}
    >
      Edit boundary
    </Button>
    <Button
      small
      toggled={editMode === "divisions"}
      onClick={() => setEditMode(editMode === "divisions" ? null : "divisions")}
    >
      Edit divisions
    </Button>
  </div>
);

export default EditMode;

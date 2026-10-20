import React from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// New task / Trash buttons, shown in the dashboard header.
const SideNav = ({ drafting, onNew, inTrash, onToggleTrash }) => {
  return (
    <>
      {!inTrash && (
        <button
          className="dash-hbtn dash-hbtn-primary"
          onClick={onNew}
          disabled={drafting}
          aria-label="new task"
        >
          <AddIcon fontSize="small" />
          New task
        </button>
      )}
      <button
        className="dash-hbtn"
        onClick={onToggleTrash}
        aria-label={inTrash ? "back to tasks" : "open trash"}
      >
        {inTrash ? (
          <ArrowBackIcon fontSize="small" />
        ) : (
          <DeleteOutlineIcon fontSize="small" />
        )}
        {inTrash ? "Back to tasks" : "Trash"}
      </button>
    </>
  );
};

export default SideNav;

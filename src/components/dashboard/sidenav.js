import React from "react";
import AddIcon from "@mui/icons-material/Add";

// New task button, shown in the dashboard header.
const SideNav = ({ drafting, onNew }) => (
  <button
    className="dash-hbtn dash-hbtn-primary"
    onClick={onNew}
    disabled={drafting}
    aria-label="new task"
  >
    <AddIcon fontSize="small" />
    New task
  </button>
);

export default SideNav;

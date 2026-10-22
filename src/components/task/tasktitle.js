import React from "react";
import { connect } from "react-redux";
import {
  updateTask,
  setEditing,
  editTitle,
  enableAnyTitleEditing,
  disableAnyTitleEditing,
} from "../../actions/todoActions";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import IconButton from "@mui/material/IconButton";
import SaveIcon from "@mui/icons-material/Save";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const TaskTitle = (props) => {
  const {
    task,
    updateTask,
    isEditing,
    editedTitle,
    setEditing,
    editTitle,
    enableAnyTitleEditing,
  } = props;

  const handleEditClick = () => {
    if (!props.isAnyTitleEditing) {
      editTitle(task.todo_title);
      setEditing(task.id, true);
      enableAnyTitleEditing();
    }
  };

  const handleSaveClick = async (e) => {
    e.preventDefault();

    await updateTask(task.id, { todo_title: editedTitle });
    setEditing(task.id, false);
    props.disableAnyTitleEditing();
  };

  return (
    <>
      <input type="checkbox" className="dash-toggle" id={`task_${task.id}`} />
      <div className="dash-card-head">
        {props.grip}
        {isEditing ? (
          <input
            type="text"
            className="dash-title-input"
            value={editedTitle}
            onChange={(e) => editTitle(e.target.value)}
          />
        ) : (
          <label className="dash-card-title" htmlFor={`task_${task.id}`}>
            {task.todo_title}
          </label>
        )}
        <div className="dash-icons">
          <IconButton
            size="small"
            onClick={props.onToggleCollapse}
            aria-label={props.collapsed ? "expand list" : "collapse list"}
            title={props.collapsed ? "Expand" : "Collapse"}
          >
            <ExpandMoreIcon
              style={{
                fontSize: 22,
                transition: "transform 0.2s ease",
                transform: props.collapsed ? "rotate(-90deg)" : "none",
              }}
            />
          </IconButton>
          <div className="dash-icons">
            {isEditing ? (
              <IconButton>
                <SaveIcon style={{ fontSize: 20 }} onClick={handleSaveClick} />
              </IconButton>
            ) : (
              <>
                {!props.isAnyTitleEditing ? (
                  <IconButton>
                    <EditIcon
                      style={{ fontSize: 20 }}
                      onClick={handleEditClick}
                    />
                  </IconButton>
                ) : (
                  <IconButton disabled>
                    <EditIcon style={{ fontSize: 20 }} />
                  </IconButton>
                )}
              </>
            )}
            <IconButton
              size="small"
              aria-label="delete list"
              title="Delete"
              onClick={() => props.onDelete(task)}
            >
              <DeleteOutlineIcon style={{ fontSize: 20 }} />
            </IconButton>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state, ownProps) => {
  const taskId = ownProps.task.id;
  return {
    editedTitle: state.editedTitle,
    isEditing: state.isEditing[taskId] || false,
    isAnyTitleEditing: state.isAnytitleEditing,
  };
};

export default connect(mapStateToProps, {
  updateTask,
  setEditing,
  editTitle,
  enableAnyTitleEditing,
  disableAnyTitleEditing,
})(TaskTitle);

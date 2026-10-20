import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  getTrash,
  getNotes,
  restoreTask,
  deleteForever,
} from "../../actions/todoActions";
import Masonry from "../dashboard/masonry";
import { parseChecklist } from "../../utils/checklist";
import { getTint } from "../../utils/tints";

const TrashCard = ({ task, note, onRestore, onDeleteForever }) => {
  const [sure, setSure] = useState(false);
  const items = note ? parseChecklist(note.todo_list).filter((i) => i.text) : [];

  return (
    <div
      className="dash-card dash-card-trash"
      style={{ "--tint": getTint(task.id) }}
    >
      <div className="dash-card-head">
        <span className="dash-card-title">{task.todo_title}</span>
      </div>
      <div className="dash-card-body">
        <div className="dash-list">
          {items.map((item, i) => (
            <div className={`dash-item ${item.done ? "done" : ""}`} key={i}>
              <span className="dash-trash-dot" />
              <span className="dash-item-text">{item.text}</span>
            </div>
          ))}
          {items.length === 0 && <p className="dash-trash-empty">Empty list</p>}
        </div>
        <div className="dash-draft-actions">
          {sure ? (
            <>
              <button
                className="dash-btn dash-btn-outline"
                onClick={() => setSure(false)}
              >
                Keep
              </button>
              <button className="dash-btn dash-btn-danger" onClick={onDeleteForever}>
                Yes, delete forever
              </button>
            </>
          ) : (
            <>
              <button
                className="dash-btn dash-btn-outline"
                onClick={() => setSure(true)}
              >
                Delete forever
              </button>
              <button className="dash-btn dash-btn-primary" onClick={onRestore}>
                Restore
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const TrashView = ({
  trashTasks,
  allUserNotes,
  getTrash,
  getNotes,
  restoreTask,
  deleteForever,
}) => {
  useEffect(() => {
    getTrash().then(() => {});
  }, [getTrash]);

  useEffect(() => {
    trashTasks.forEach((t) => getNotes(t.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trashTasks.length]);

  return (
    <>
      {trashTasks.length === 0 && (
        <p className="dash-empty">Trash is empty.</p>
      )}
      <Masonry>
      {trashTasks.map((task) => (
        <TrashCard
          key={task.id}
          task={task}
          note={allUserNotes.find((n) => n.todo_title_id === task.id)}
          onRestore={() => restoreTask(task.id)}
          onDeleteForever={() => deleteForever(task.id)}
        />
      ))}
      </Masonry>
    </>
  );
};

const mapStateToProps = (state) => ({
  trashTasks: state.trashTasks,
  allUserNotes: state.allUserNotes,
});

export default connect(mapStateToProps, {
  getTrash,
  getNotes,
  restoreTask,
  deleteForever,
})(TrashView);
